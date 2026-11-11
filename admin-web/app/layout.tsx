import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Atelier — Local Service Concierge",
  description:
    "Multi-agent local service marketplace for Pakistan. Book verified artisans in Islamabad, Karachi, and Lahore.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontVariables} scroll-smooth`} suppressHydrationWarning>
      <body data-theme="light" className="min-h-screen bg-surface text-ink antialiased">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
