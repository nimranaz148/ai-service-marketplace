"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { personas } from "@/lib/fixtures/personas";

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

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => void;
  loginAsDemo: (role: UserRole) => void;
  signup: (userData: { name: string; email: string; role: UserRole; phone?: string; area?: string; category?: string }) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "atelier_ai_authenticated_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to read user from localStorage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUser = (u: AuthUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = (email: string, selectedRole: UserRole = "customer") => {
    const existing = Object.values(PRESET_USERS).find(
      (p) => p.email.toLowerCase() === email.toLowerCase()
    );
    const u: AuthUser = existing || {
      id: "usr-" + Math.random().toString(36).substring(2, 8),
      name: email.split("@")[0].replace(".", " ").toUpperCase(),
      email,
      role: selectedRole,
      area: "Islamabad / Rawalpindi",
      avatar: email.substring(0, 2).toUpperCase(),
    };
    saveUser(u);
    redirectForRole(u.role);
  };

  const loginAsDemo = (role: UserRole) => {
    const demoUser = PRESET_USERS[role];
    saveUser(demoUser);
    redirectForRole(role);
  };

  const signup = (userData: {
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    area?: string;
    category?: string;
  }) => {
    const initials = userData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const newUser: AuthUser = {
      id: "usr-" + Math.random().toString(36).substring(2, 8),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone || "+92 300 0000000",
      area: userData.area || "Islamabad",
      category: userData.category || (userData.role === "provider" ? "General Technician" : undefined),
      rating: userData.role === "provider" ? 5.0 : undefined,
      completedJobs: userData.role === "provider" ? 0 : undefined,
      avatar: initials || "AT",
    };
    saveUser(newUser);
    redirectForRole(newUser.role);
  };

  const logout = () => {
    saveUser(null);
    router.push("/login");
  };

  const switchRole = (role: UserRole) => {
    if (!user) {
      loginAsDemo(role);
      return;
    }
    const updated = {
      ...user,
      role,
      name: PRESET_USERS[role].name,
      category: PRESET_USERS[role].category,
    };
    saveUser(updated);
    redirectForRole(role);
  };

  const redirectForRole = (role: UserRole) => {
    if (role === "admin") {
      router.push("/dashboard/admin");
    } else if (role === "provider") {
      router.push("/dashboard/provider");
    } else {
      router.push("/dashboard/customer");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemo,
        signup,
        logout,
        switchRole,
      }}
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
