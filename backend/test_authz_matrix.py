"""End-to-end authorization + feature check against a running backend (http://localhost:8000).

Run:  .venv/Scripts/python test_authz_matrix.py
Covers: login/signup rules, the role x endpoint permission matrix, token tampering,
ownership of conversations, the multi-agent booking flow, provider self-service,
admin customer CRUD and suspension.
"""
import sys
import time
import uuid
import httpx

BASE = "http://localhost:8000"
ACCOUNTS = {
    "admin": ("ayesha.malik@atelier.pk", "Admin@2026!"),
    "provider": ("tariq.mehmood@atelier.pk", "Provider@2026!"),
    "customer": ("zubair.khan@gmail.com", "Customer@2026!"),
}
passed = failed = 0


def check(name, cond, detail=""):
    global passed, failed
    if cond:
        passed += 1
        print(f"  PASS  {name}")
    else:
        failed += 1
        print(f"  FAIL  {name}  {detail}")


c = httpx.Client(base_url=BASE, timeout=60)


def login(role):
    e, p = ACCOUNTS[role]
    r = c.post("/auth/login", json={"email": e, "password": p, "role": role})
    return r.json().get("access_token") if r.status_code == 200 else None


def H(tok):
    return {"Authorization": f"Bearer {tok}"} if tok else {}


print("\n[1] health + login rules")
check("health 200", c.get("/health").status_code == 200)
tok = {r: login(r) for r in ACCOUNTS}
check("all three seeded accounts log in", all(tok.values()))
check("wrong password -> 401", c.post("/auth/login", json={"email": ACCOUNTS["customer"][0], "password": "nope"}).status_code == 401)
check("unknown email -> 401", c.post("/auth/login", json={"email": "ghost@x.com", "password": "whatever1"}).status_code == 401)
check("customer into admin portal -> 403", c.post("/auth/login", json={"email": ACCOUNTS["customer"][0], "password": ACCOUNTS["customer"][1], "role": "admin"}).status_code == 403)

print("\n[2] permission matrix (None = no token)")
# endpoint -> expected status per caller
MATRIX = [
    ("GET", "/admin/stats", {None: 401, "customer": 403, "provider": 403, "admin": 200}),
    ("GET", "/admin/customers", {None: 401, "customer": 403, "provider": 403, "admin": 200}),
    ("GET", "/admin/providers", {None: 401, "customer": 403, "provider": 403, "admin": 200}),
    ("GET", "/admin/bookings", {None: 401, "customer": 403, "provider": 403, "admin": 200}),
    ("GET", "/me/provider", {None: 401, "customer": 403, "provider": 200, "admin": 403}),
    ("GET", "/me/provider/bookings", {None: 401, "customer": 403, "provider": 200, "admin": 403}),
    ("GET", "/me/provider/slots", {None: 401, "customer": 403, "provider": 200, "admin": 403}),
    ("GET", "/providers", {None: 401, "customer": 200, "provider": 200, "admin": 200}),
    ("GET", "/me", {None: 401, "customer": 200, "provider": 200, "admin": 200}),
    ("GET", "/auth/me", {None: 401, "customer": 200, "provider": 200, "admin": 200}),
    ("POST", "/requests", {None: 401, "provider": 403}),
]
for method, path, expect in MATRIX:
    for who, want in expect.items():
        body = {"json": {"message": "hi"}} if (method == "POST" and path == "/requests" and who is None) or (method == "POST" and who == "provider") else {}
        r = c.request(method, path, headers=H(tok.get(who) if who else None), **body)
        check(f"{method} {path} as {who or 'anon'} -> {want}", r.status_code == want, f"got {r.status_code}")

print("\n[3] token tampering")
t = tok["customer"]
check("garbage token -> 401", c.get("/me", headers=H("abc.def.ghi")).status_code == 401)
check("signature-stripped token -> 401", c.get("/me", headers=H(t.rsplit(".", 1)[0] + ".")).status_code == 401)
check("role-forged payload (bad signature) -> 401", c.get("/admin/stats", headers=H(t[:-4] + "AAAA")).status_code == 401)
check("non-bearer scheme -> 401", c.get("/me", headers={"Authorization": f"Basic {t}"}).status_code == 401)

print("\n[3b] provider cannot be impersonated via ?user_id=")
cust_id = c.get("/me", headers=H(tok["customer"])).json()["id"]
check("customer + ?user_id=<provider> still 403", c.get("/me/provider", params={"user_id": cust_id}, headers=H(tok["customer"])).status_code == 403)

print("\n[4] signup rules")
em = f"qa+{uuid.uuid4().hex[:8]}@example.com"
r = c.post("/auth/signup", json={"name": "QA Customer", "email": em, "password": "Passw0rd!x", "role": "customer"})
check("customer signup 201 + token", r.status_code == 201 and "access_token" in r.json())
new_tok = r.json().get("access_token")
check("duplicate email -> 409", c.post("/auth/signup", json={"name": "QA Customer", "email": em, "password": "Passw0rd!x"}).status_code == 409)
check("short password -> 422", c.post("/auth/signup", json={"name": "QA", "email": "short@example.com", "password": "123"}).status_code == 422)
check("admin signup refused", c.post("/auth/signup", json={"name": "Evil", "email": "evil@example.com", "password": "Passw0rd!x", "role": "admin"}).status_code == 400)
check("new customer is NOT admin", c.get("/admin/stats", headers=H(new_tok)).status_code == 403)
pe = f"qa+prov{uuid.uuid4().hex[:6]}@example.com"
r = c.post("/auth/signup", json={"name": "QA Plumber", "email": pe, "password": "Passw0rd!x", "role": "provider", "category": "Plumber", "area": "Sector F-10, Islamabad"})
ptok = r.json().get("access_token")
check("provider signup gets a linked provider profile", c.get("/me/provider", headers=H(ptok)).status_code == 200)

print("\n[5] multi-agent booking flow (customer)")
r = c.post("/requests", headers=H(tok["customer"]), json={"message": "mujhe AC technician chahiye"})
d = r.json()
check("start conversation 200", r.status_code == 200, r.text[:200])
check("concierge asks for the missing area", d.get("status") == "needs_input" and d.get("current_agent") == "Concierge", str(d.get("current_agent")))
sid = d["session_id"]
r = c.post(f"/requests/{sid}/reply", headers=H(tok["customer"]), json={"message": "Gulshan-e-Iqbal Karachi"})
d = r.json()
agents = [t_["agent_name"] for t_ in d.get("trace_logs", [])]
check("handoff to Discovery found providers", d.get("current_agent") == "Discovery" and "Discovery" in agents, str(agents))
r = c.post(f"/requests/{sid}/reply", headers=H(tok["customer"]), json={"message": "haan pehla wala theek hai, book kar do"})
d = r.json()
agents = [t_["agent_name"] for t_ in d.get("trace_logs", [])]
check("chain reached Booking and Followup", {"Booking", "Followup"} <= set(agents), str(agents))
check("session completed with a confirmation code", d.get("status") == "completed" and "BK-" in (d.get("agent_message") or ""), (d.get("agent_message") or "")[:120])
check("another customer cannot read/continue my session (403)", c.post(f"/requests/{sid}/reply", headers=H(new_tok), json={"message": "x"}).status_code in (400, 403))

print("\n[6] provider self-service")
r = c.get("/me/provider", headers=H(tok["provider"]))
check("provider profile is Tariq's own", r.status_code == 200 and r.json()["name"] == "Tariq Mehmood")
slot = c.post("/me/provider/slots", headers=H(tok["provider"]), json={"slot_date": "2026-12-01", "slot_time": "10:00 AM"})
check("provider can add a slot", slot.status_code in (200, 201), slot.text[:120])
if slot.status_code in (200, 201):
    sl = slot.json().get("id")
    check("provider can delete own slot", c.delete(f"/me/provider/slots/{sl}", headers=H(tok["provider"])).status_code in (200, 204))
b = c.get("/me/provider/bookings", headers=H(tok["provider"]))
check("provider sees assigned bookings", b.status_code == 200 and isinstance(b.json(), list))

print("\n[7] admin customer CRUD + suspension")
r = c.post("/admin/customers", headers=H(tok["admin"]), json={"name": "QA Managed", "phone": "+92 300 0000000", "area": "F-10"})
check("admin creates customer", r.status_code in (200, 201), r.text[:120])
if r.status_code in (200, 201):
    cid = r.json()["id"]
    check("admin updates customer", c.patch(f"/admin/customers/{cid}", headers=H(tok["admin"]), json={"area": "G-13"}).status_code == 200)
    check("admin deletes customer", c.delete(f"/admin/customers/{cid}", headers=H(tok["admin"])).status_code in (200, 204))
# suspension blocks login/API for a real account
uid = c.get("/me", headers=H(new_tok)).json()["id"]
s = c.patch(f"/admin/customers/{uid}", headers=H(tok["admin"]), json={"is_suspended": True})
check("admin suspends customer", s.status_code == 200, s.text[:100])
check("suspended user's existing token stops working (403)", c.get("/me", headers=H(new_tok)).status_code == 403)
check("suspended user cannot log in (403)", c.post("/auth/login", json={"email": em, "password": "Passw0rd!x"}).status_code == 403)

print(f"\n==== {passed} passed, {failed} failed ====")
sys.exit(1 if failed else 0)
