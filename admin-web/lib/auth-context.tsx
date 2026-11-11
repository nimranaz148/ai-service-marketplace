"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { personas } from "@/lib/fixtures/personas";

const API = "/api-backend";
export const TOKEN_KEY = "atelier_ai_access_token";
export const getToken = (): string | null => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};

// Seeded sandbox accounts (see backend/app/db/seed.py). These go through the real /auth/login.
const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string }> = {
  admin: { email: "ayesha.malik@atelier.pk", password: "Admin@2026!" },
  provider: { email: "tariq.mehmood@atelier.pk", password: "Provider@2026!" },
  customer: { email: "zubair.khan@gmail.com", password: "Customer@2026!" },
};

export type UserRole = "admin" | "provider" | "customer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  area?: string;
  avatar?: string;
  category?: string; // For providers
  rating?: number;   // For providers
  completedJobs?: number;
}

export const PRESET_USERS: Record<UserRole, AuthUser> = {
  admin: {
    id: personas.admin.id,
    name: personas.admin.name,
    email: personas.admin.email,
    role: "admin",
    phone: personas.admin.phone,
    area: personas.admin.area,
    avatar: personas.admin.avatarInitials,
  },
  provider: {
    id: personas.provider.id,
    name: personas.provider.name,
    email: personas.provider.email,
    role: "provider",
    phone: personas.provider.phone,
    area: personas.provider.area,
    category: "AC Technician & HVAC",
    rating: 4.9,
    completedJobs: 142,
    avatar: personas.provider.avatarInitials,
  },
  customer: {
    id: personas.customer.id,
    name: personas.customer.name,
    email: personas.customer.email,
    role: "customer",
    phone: personas.customer.phone,
    area: personas.customer.area,
    avatar: personas.customer.avatarInitials,
  },
};

interface SignupData { name: string; email: string; password: string; role: UserRole; phone?: string; area?: string; category?: string }

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Resolves to an error message, or null on success (then redirects to the role's dashboard). */
  login: (email: string, password: string, role?: UserRole) => Promise<string | null>;
  loginAsDemo: (role: UserRole) => Promise<string | null>;
  signup: (userData: SignupData) => Promise<string | null>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "atelier_ai_authenticated_user";

function toAuthUser(u: any): AuthUser {
  const name: string = u.name || u.email;
  return {
    id: u.id,
    name,
    email: u.email,
    role: u.role,
    phone: u.phone ?? undefined,
    area: u.area ?? undefined,
    avatar: name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore the session only if a token exists, and re-verify it against the backend.
  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        const stored = localStorage.getItem(STORAGE_KEY);
        if (token && stored) {
          const res = await fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) setUser(toAuthUser(await res.json()));
          else clearSession();
        }
      } catch (e) {
        console.warn("Failed to restore session", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const clearSession = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  };

  const startSession = (token: string, raw: any) => {
    const u = toAuthUser(raw);
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {}
    setUser(u);
    redirectForRole(u.role);
  };

  const call = async (path: string, payload: object): Promise<string | null> => {
    try {
      const res = await fetch(`${API}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const d = data?.detail;
        return typeof d === "string" ? d : "Could not sign in. Please check your details.";
      }
      startSession(data.access_token, data.user);
      return null;
    } catch {
      return "Cannot reach the server. Is the backend running?";
    }
  };

  const login = (email: string, password: string, role?: UserRole) => call("/auth/login", { email, password, role });
  const loginAsDemo = (role: UserRole) => call("/auth/login", { ...DEMO_CREDENTIALS[role], role });
  const signup = (d: SignupData) => call("/auth/signup", d);

  const logout = () => {
    clearSession();
    setUser(null);
    router.push("/login");
  };

  // Dev-only persona switcher: signs in as the seeded account for that role.
  const switchRole = (role: UserRole) => {
    void loginAsDemo(role);
  };

  const redirectForRole = (role: UserRole) => {
    if (role === "admin") router.push("/dashboard/admin");
    else if (role === "provider") router.push("/dashboard/provider");
    else router.push("/dashboard/customer");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, loginAsDemo, signup, logout, switchRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
