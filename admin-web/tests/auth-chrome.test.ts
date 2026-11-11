import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const r = (p: string) => readFileSync(resolve(__dirname, "..", p), "utf8");

/**
 * Auth-page logic guard.
 *
 * Task 10 restyles the unauthenticated auth pages with marketing chrome
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
    "const handleSubmit = async (e: React.FormEvent) => {",
    "if (!email) return;",
    'setError(await login(email, password, "customer"));',
    "<form onSubmit={handleSubmit}",
    "onChange={(e) => setEmail(e.target.value)}",
    "onChange={(e) => setPassword(e.target.value)}",
    'onClick={async () => setError(await loginAsDemo("customer"))}',
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
    "const handleSubmit = async (e: React.FormEvent) => {",
    "if (!name || !email) return;",
    "setError(await signup({",
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
    "const handleSubmit = async (e: React.FormEvent) => {",
    "if (!email) return;",
    'setError(await login(email, password, "provider"));',
    "<form onSubmit={handleSubmit}",
    "onChange={(e) => setEmail(e.target.value)}",
    "onChange={(e) => setPassword(e.target.value)}",
    'onClick={async () => setError(await loginAsDemo("provider"))}',
    'href="/provider/signup"',
    "export default function ProviderLoginPage()",
  ],
  "app/admin/login/page.tsx": [
    '"use client";',
    'import { useAuth } from "@/lib/auth-context";',
    "const { login, loginAsDemo } = useAuth();",
    'const [email, setEmail] = useState("");',
    'const [password, setPassword] = useState("");',
    "const handleSubmit = async (e: React.FormEvent) => {",
    "if (!email) return;",
    'setError(await login(email, password, "admin"));',
    "<form onSubmit={handleSubmit}",
    "onChange={(e) => setEmail(e.target.value)}",
    "onChange={(e) => setPassword(e.target.value)}",
    'onClick={async () => setError(await loginAsDemo("admin"))}',
    'href="/login"',
    'href="/provider/login"',
    "export default function AdminLoginPage()",
  ],
  // The 5th unauthenticated page. The Phase 0.5 spec's auth-chrome scope listed
  // only 4, so this one kept its legacy dark styling until the review fix wave;
  // these anchors were captured from the pre-restyle file and lock its logic the
  // same way.
  "app/provider/signup/page.tsx": [
    '"use client";',
    'import { useAuth } from "@/lib/auth-context";',
    "const { signup } = useAuth();",
    'const [name, setName] = useState("");',
    'const [email, setEmail] = useState("");',
    'const [phone, setPhone] = useState("");',
    'const [area, setArea] = useState("Sector G-13, Islamabad");',
    'const [category, setCategory] = useState("AC Technician & HVAC");',
    "const handleSubmit = async (e: React.FormEvent) => {",
    "if (!name || !email) return;",
    "setError(await signup({",
    'role: "provider",',
    'phone: phone || "+92 301 5554321",',
    "category,",
    "<form onSubmit={handleSubmit}",
    "onChange={(e) => setName(e.target.value)}",
    "onChange={(e) => setEmail(e.target.value)}",
    // NOTE: the baseline page declares `phone` state but never renders a phone
    // input, so `signup()` always sends the fallback number. That gap is left
    // exactly as-is by the restyle (visual-only) and is reported separately —
    // wiring a new field here would be a behaviour change, not a restyle.
    "onChange={(e) => setCategory(e.target.value)}",
    "onChange={(e) => setArea(e.target.value)}",
    'value="AC Technician & HVAC"',
    'value="Sector G-13, Islamabad"',
    'href="/provider/login"',
    "export default function ProviderSignupPage()",
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

/**
 * Route-level honesty guard for the unauthenticated surface, mirroring the
 * banned-claim assertion in tests/marketing-home.test.tsx. These pages are
 * public, so they must not assert certifications, security audits, access-tier
 * numbers, or payment guarantees that nothing in this build backs.
 */
const BANNED_CLAIMS = /\b(SOC2|ISO 27001|escrow|biometric|GPS|Raast|NADRA|guaranteed)\b/i;

describe("auth pages assert no unbacked claims", () => {
  for (const file of Object.keys(ANCHORS)) {
    it(file, () => {
      const match = r(file).match(BANNED_CLAIMS);
      expect(match?.[0], `${file} makes an unbacked claim`).toBeUndefined();
    });
  }
});
