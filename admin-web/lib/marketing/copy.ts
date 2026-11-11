export const copy = {
  nav: { links: ["How it works", "Trades", "Pricing"], signIn: "Sign in", cta: "Get help now" },
  hero: {
    headline: "Ghar ka masla? Bol do.",
    sub: "AC, plumbing, bijli, safai, tuition — apni zabaan mein batayein, hum ek verified banda bhej dete hain. Islamabad, Karachi, Lahore.",
    boxPlaceholder: "Maslan: G-13 mein AC theek karana hai, kal subah…",
    ctaPrimary: "Get help now",
    ctaSecondary: "See how it works",
  },
  agentBeat: {
    kicker: "Behind the scenes",
    title: "You ask. The system does the running around.",
    stages: [
      "Reads your request — service, area, time, urgency.",
      "Finds verified providers nearby and ranks them.",
      "You approve. It books and gives you a code.",
      "You track it until the job is done.",
    ],
  },
  howItWorks: {
    title: "Three steps, that's it.",
    steps: [
      { n: 1, h: "Ask in your words", p: "Type or speak — Roman Urdu, Urdu, or English." },
      { n: 2, h: "We match, you approve", p: "See the person, their rating, and the price before anything is booked." },
      { n: 3, h: "Track till it's done", p: "Status updates from on-the-way to job closed." },
    ],
  },
  trades: { title: "What we cover", citiesLabel: "Live in", cities: ["Islamabad", "Karachi", "Lahore"], more: "More areas rolling out." },
  proof: {
    title: "Small, verified, growing.",
    quotesNote: "Quotes are illustrative until we publish verified reviews.",
    quotes: [
      { text: "Bola, banda aaya, AC theek. Rate pehle pata tha.", who: "Zubair, Gulshan-e-Iqbal" },
      { text: "Late night electrician mil gaya, koi drama nahi.", who: "Hamza, F-10" },
    ],
  },
  pricing: {
    title: "Per job. No subscription.",
    points: [
      "You see the rate before you confirm.",
      "Pay after the work is done.",
      "Cancel before dispatch — free.",
    ],
    ratesLabel: "Typical starting rates",
    // Shown only when a trade's rate is a monthly package, so the rate list
    // never contradicts the "No subscription." headline above it.
    monthlyNote: "Tutoring is billed as a monthly package — see Trades above.",
  },
  finalCta: { title: "Pehli booking abhi karein.", cta: "Get help now" },
  footer: {
    tagline: "Bol kar ya likh kar — Roman Urdu, Urdu, English.",
    cols: [
      { h: "Product", links: ["How it works", "Trades", "Pricing"] },
      { h: "Company", links: ["About", "Careers"] },
      { h: "Legal", links: ["Terms", "Privacy"] },
    ],
    newsletterLabel: "Get product updates",
    newsletterPlaceholder: "you@email.com",
  },
  auth: { backToHome: "← Back to home" },
} as const;
