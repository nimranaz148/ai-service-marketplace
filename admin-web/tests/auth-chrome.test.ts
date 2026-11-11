import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const r = (p: string) => readFileSync(resolve(__dirname, "..", p), "utf8");

/**
 * Auth-page logic guard.
 *
 * Task 10 restyles the 4 unauthenticated auth pages with marketing chrome
 * WITHOUT changing behaviour. These anchors were captured verbatim from
 * `git show HEAD:<path>` before the restyle. Because the edits are visual-only
 * (className / wrapper / decoration), every anchor is still present after the
 * restyle — this test is GREEN before AND after, locking the logic in place.
 *
 * Anchors cover: the "use client" directive, the useAuth() surface, every
 * login()/signup()/loginAsDemo() call, the onSubmit handler + its guard,
 * the field useState hooks + their onChange wiring, the demo-login button
 * onClick, cross-portal route hrefs, and the exported component name.
 */
const ANCHORS: Record<string, string[]> = {
  "app/login/page.tsx": [
    '"use client";',
    'import { useAuth } from "@/lib/auth-context";',
    "const { login, loginAsDemo } = useAuth();",
    'const [email, setEmail] = useState("");',
    'const [password, setPassword] = useState("");',
    "const handleSubmit = (e: React.FormEvent) => {",
    "if (!email) return;",
    'login(email, "customer");',
    "<form onSubmit={handleSubmit}",
    "onChange={(e) => setEmail(e.target.value)}",
    "onChange={(e) => setPassword(e.target.value)}",
    'onClick={() => loginAsDemo("customer")}',
    'href="/signup"',
    'href="/provider/login"',
    'href="/admin/login"',
    "export default function CustomerLoginPage()",
  ],
  "app/signup/page.tsx": [
    '"use client";',
    'import { useAuth } from "@/lib/auth-context";',
    "const { signup } = useAuth();",
    'const [name, setName] = useState("");',
    'const [email, setEmail] = useState("");',
    'const [phone, setPhone] = useState("");',
    'const [area, setArea] = useState("Sector F-10, Islamabad");',
    "const handleSubmit = (e: React.FormEvent) => {",
    "if (!name || !email) return;",
    "signup({",
    'role: "customer",',
    'phone: phone || "+92 300 1234567",',
    "<form onSubmit={handleSubmit}",
    "onChange={(e) => setName(e.target.value)}",
    "onChange={(e) => setArea(e.target.value)}",
    'href="/provider/signup"',
    'href="/login"',
    "export default function CustomerSignupPage()",
  ],
  "app/provider/login/page.tsx": [
    '"use client";',
    'import { useAuth } from "@/lib/auth-context";',
    "const { login, loginAsDemo } = useAuth();",
    'const [email, setEmail] = useState("");',
    'const [password, setPassword] = useState("");',
    "const handleSubmit = (e: React.FormEvent) => {",
    "if (!email) return;",
    'login(email, "provider");',
    "<form onSubmit={handleSubmit}",
    "onChange={(e) => setEmail(e.target.value)}",
    "onChange={(e) => setPassword(e.target.value)}",
    'onClick={() => loginAsDemo("provider")}',
    'href="/provider/signup"',
    "export default function ProviderLoginPage()",
  ],
  "app/admin/login/page.tsx": [
    '"use client";',
    'import { useAuth } from "@/lib/auth-context";',
    "const { login, loginAsDemo } = useAuth();",
    'const [email, setEmail] = useState("");',
    'const [password, setPassword] = useState("");',
    "const handleSubmit = (e: React.FormEvent) => {",
    "if (!email) return;",
    'login(email, "admin");',
    "<form onSubmit={handleSubmit}",
    "onChange={(e) => setEmail(e.target.value)}",
    "onChange={(e) => setPassword(e.target.value)}",
    'onClick={() => loginAsDemo("admin")}',
    'href="/login"',
    'href="/provider/login"',
    "export default function AdminLoginPage()",
  ],
};

describe("auth pages keep their logic through the marketing-chrome restyle", () => {
  for (const [file, anchors] of Object.entries(ANCHORS)) {
    it(file, () => {
      const src = r(file);
      for (const a of anchors) {
        expect(src, `${file} must still contain: ${a}`).toContain(a);
      }
    });
  }
});
