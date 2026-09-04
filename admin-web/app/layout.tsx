import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Atelier AI — Autonomous Local Service Concierge",
  description: "Next-generation multi-agent service marketplace for Pakistan. Book verified artisans in Islamabad, Karachi & Lahore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#090E0C] text-[#F2F7F4] font-body antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
