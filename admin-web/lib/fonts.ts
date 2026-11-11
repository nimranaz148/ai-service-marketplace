import localFont from "next/font/local";

export const clash = localFont({
  src: [
    { path: "../public/fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const zodiak = localFont({
  src: [
    { path: "../public/fonts/Zodiak-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Zodiak-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-zodiak",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const switzer = localFont({
  src: [
    { path: "../public/fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/Switzer-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-switzer",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const jbmono = localFont({
  src: [
    { path: "../public/fonts/JetBrainsMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/JetBrainsMono-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-jbmono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const fonts = { clash, zodiak, switzer, jbmono };
export const fontVariables = [clash.variable, zodiak.variable, switzer.variable, jbmono.variable].join(" ");
