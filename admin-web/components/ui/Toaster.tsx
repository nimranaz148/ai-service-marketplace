"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

type ToastListener = (toast: ToastItem) => void;
const listeners = new Set<ToastListener>();

export const toast = {
  success: (message: string) => {
    const item: ToastItem = { id: Math.random().toString(36).substring(2, 9), type: "success", message };
    listeners.forEach((fn) => fn(item));
  },
  error: (message: string) => {
    const item: ToastItem = { id: Math.random().toString(36).substring(2, 9), type: "error", message };
    listeners.forEach((fn) => fn(item));
  },
  info: (message: string) => {
    const item: ToastItem = { id: Math.random().toString(36).substring(2, 9), type: "info", message };
    listeners.forEach((fn) => fn(item));
  },
};

export function Toaster({ position = "top-right" }: { position?: string; theme?: string; richColors?: boolean }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler: ToastListener = (newToast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4500);
    };

    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all ${
            t.type === "success"
              ? "bg-[#0D1813]/95 border-[#34D399]/40 text-[#F2F7F4] shadow-[0_8px_30px_rgba(52,211,153,0.15)]"
              : t.type === "error"
              ? "bg-[#1E0F11]/95 border-[#EF4444]/40 text-[#FEE2E2] shadow-[0_8px_30px_rgba(239,68,68,0.15)]"
              : "bg-[#0A141D]/95 border-[#38BDF8]/40 text-[#F0F9FF] shadow-[0_8px_30px_rgba(56,189,248,0.15)]"
          }`}
        >
          <div className="flex items-center gap-3">
            {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0" />}
            {t.type === "error" && <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />}
            {t.type === "info" && <Info className="w-5 h-5 text-[#38BDF8] shrink-0" />}
            <span className="font-body text-xs sm:text-sm font-medium leading-snug">{t.message}</span>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-[#8EAAA0] hover:text-[#F2F7F4] transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
