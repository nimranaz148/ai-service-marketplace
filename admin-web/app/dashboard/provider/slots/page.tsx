"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Activity,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TimeSlot {
  id: string;
  timeRange: string;
  status: "open" | "booked" | "off_duty";
  customerName?: string;
  serviceName?: string;
}

interface DaySchedule {
  dayName: string;
  dateStr: string;
  dateKey: string;
  isToday?: boolean;
  slots: TimeSlot[];
}

const DEFAULT_SLOTS: TimeSlot[] = [
  { id: "s-1", timeRange: "09:00 AM – 10:30 AM", status: "open" },
  { id: "s-2", timeRange: "11:00 AM – 12:30 PM", status: "open" },
  {
    id: "s-3",
    timeRange: "02:00 PM – 03:30 PM",
    status: "booked",
    customerName: "Dr. Ayesha Siddiqui",
    serviceName: "Master AC Diagnostic",
  },
  {
    id: "s-4",
    timeRange: "04:30 PM – 06:00 PM",
    status: "booked",
    customerName: "Hamza Tariq",
    serviceName: "Emergency AC Circuit Fix",
  },
  { id: "s-5", timeRange: "06:30 PM – 08:00 PM", status: "open" },
  { id: "s-6", timeRange: "08:30 PM – 10:00 PM", status: "off_duty" },
];

export default function ProviderSlotsPage() {
  const { user } = useAuth();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [bufferMinutes, setBufferMinutes] = useState(30);
  const [maxJobsPerDay, setMaxJobsPerDay] = useState(4);
  const [emergencyOvertime, setEmergencyOvertime] = useState(true);

  // Generate next 7 days
  const days: DaySchedule[] = [
    { dayName: "Today", dateStr: "Sat, Sep 5", dateKey: "2026-09-05", isToday: true, slots: DEFAULT_SLOTS },
    {
      dayName: "Tomorrow",
      dateStr: "Sun, Sep 6",
      dateKey: "2026-09-06",
      slots: [
        { id: "s-1", timeRange: "09:00 AM – 10:30 AM", status: "open" },
        { id: "s-2", timeRange: "11:00 AM – 12:30 PM", status: "booked", customerName: "Usman Ghani", serviceName: "Foam Jet Wash" },
        { id: "s-3", timeRange: "02:00 PM – 03:30 PM", status: "open" },
        { id: "s-4", timeRange: "04:30 PM – 06:00 PM", status: "open" },
        { id: "s-5", timeRange: "06:30 PM – 08:00 PM", status: "off_duty" },
        { id: "s-6", timeRange: "08:30 PM – 10:00 PM", status: "off_duty" },
      ],
    },
    {
      dayName: "Mon",
      dateStr: "Sep 7",
      dateKey: "2026-09-07",
      slots: DEFAULT_SLOTS.map((s) => (s.status === "booked" ? { ...s, status: "open" as const, customerName: undefined } : s)),
    },
    {
      dayName: "Tue",
      dateStr: "Sep 8",
      dateKey: "2026-09-08",
      slots: DEFAULT_SLOTS.map((s) => (s.status === "booked" ? { ...s, status: "open" as const, customerName: undefined } : s)),
    },
    {
      dayName: "Wed",
      dateStr: "Sep 9",
      dateKey: "2026-09-09",
      slots: DEFAULT_SLOTS.map((s) => (s.status === "booked" ? { ...s, status: "open" as const, customerName: undefined } : s)),
    },
    {
      dayName: "Thu",
      dateStr: "Sep 10",
      dateKey: "2026-09-10",
      slots: DEFAULT_SLOTS.map((s) => (s.status === "booked" ? { ...s, status: "open" as const, customerName: undefined } : s)),
    },
    {
      dayName: "Fri",
      dateStr: "Sep 11",
      dateKey: "2026-09-11",
      slots: DEFAULT_SLOTS.map((s) => (s.status === "booked" ? { ...s, status: "open" as const, customerName: undefined } : s)),
    },
  ];

  const [schedules, setSchedules] = useState<DaySchedule[]>(days);

  const currentSchedule = schedules[selectedDayIndex];

  const toggleSlot = (slotId: string) => {
    setSchedules((prev) =>
      prev.map((day, dIdx) => {
        if (dIdx !== selectedDayIndex) return day;
        return {
          ...day,
          slots: day.slots.map((slot) => {
            if (slot.id !== slotId) return slot;
            if (slot.status === "booked") {
              toast.error("This slot is already booked by a customer and cannot be toggled.");
              return slot;
            }
            const nextStatus = slot.status === "open" ? "off_duty" : "open";
            toast.info(`Slot ${slot.timeRange} is now ${nextStatus.toUpperCase()}`);
            return { ...slot, status: nextStatus };
          }),
        };
      })
    );
  };

  const markAllOpen = () => {
    setSchedules((prev) =>
      prev.map((day, dIdx) => {
        if (dIdx !== selectedDayIndex) return day;
        return {
          ...day,
          slots: day.slots.map((s) => (s.status === "booked" ? s : { ...s, status: "open" })),
        };
      })
    );
    toast.success(`All available slots marked OPEN for ${currentSchedule.dayName}`);
  };

  const markAllOff = () => {
    setSchedules((prev) =>
      prev.map((day, dIdx) => {
        if (dIdx !== selectedDayIndex) return day;
        return {
          ...day,
          slots: day.slots.map((s) => (s.status === "booked" ? s : { ...s, status: "off_duty" })),
        };
      })
    );
    toast.info(`All unbooked slots marked OFF-DUTY for ${currentSchedule.dayName}`);
  };

  const openCount = currentSchedule.slots.filter((s) => s.status === "open").length;
  const bookedCount = currentSchedule.slots.filter((s) => s.status === "booked").length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard/provider"
              className="inline-flex items-center gap-1 text-xs font-code text-zinc-400 hover:text-[#0054F9] transition-colors"
            >
              <ChevronLeft size={14} /> Back to HUD
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-code text-[#D4A843] uppercase tracking-wider">Calendar & Availability</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Appointment Slots & Schedule Dispatch
          </h1>
          <p className="font-body text-xs sm:text-sm text-zinc-400 mt-1">
            Configure your operating windows, take rest periods, and manage live booking slots for your trade.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={markAllOpen}
            variant="outline"
            className="border-[#0054F9]/40 text-[#38BDF8] hover:bg-[#0054F9]/10 text-xs font-display font-bold"
          >
            Open All Slots
          </Button>
          <Button
            onClick={markAllOff}
            variant="outline"
            className="border-[#382326] text-[#EF4444] hover:bg-[#EF4444]/10 text-xs font-display font-bold"
          >
            Take Day Off
          </Button>
        </div>
      </div>

      {/* 7-Day Day Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {schedules.map((day, idx) => {
          const isSelected = idx === selectedDayIndex;
          const dayBooked = day.slots.filter((s) => s.status === "booked").length;
          return (
            <button
              key={day.dateKey}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex-1 min-w-[110px] p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#141420] border-[#0054F9] text-white shadow-[0_0_20px_rgba(0,84,249,0.25)]"
                  : "bg-[#111118] border-white/8 text-zinc-400 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className={`text-xs font-display font-bold ${isSelected ? "text-[#38BDF8]" : "text-white"}`}>
                  {day.dayName}
                </span>
                {day.isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                )}
              </div>
              <div className="text-[11px] font-code text-zinc-400">{day.dateStr}</div>
              <div className="mt-2 text-[10px] font-code">
                {dayBooked > 0 ? (
                  <span className="text-[#D4A843] bg-[#292212] px-2 py-0.5 rounded-full border border-[#473B1F]">
                    {dayBooked} Booked
                  </span>
                ) : (
                  <span className="text-zinc-400">All Open</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Slots Layout (8 cols) & Schedule Rules (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SLOTS LIST (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Clock size={18} className="text-[#D4A843]" />
              <span>Time Slots for {currentSchedule.dayName} ({currentSchedule.dateStr})</span>
            </h2>
            <div className="flex items-center gap-3 text-xs font-code">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> {openCount} Open
              </span>
              <span className="flex items-center gap-1 text-[#D4A843]">
                <span className="w-2 h-2 rounded-full bg-[#D4A843]" /> {bookedCount} Booked
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentSchedule.slots.map((slot) => {
              if (slot.status === "booked") {
                return (
                  <div
                    key={slot.id}
                    className="p-5 rounded-2xl bg-gradient-to-br from-[#1C170E] to-[#120F09] border-2 border-[#D4A843]/40 shadow-lg space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-code font-bold text-[#D4A843] flex items-center gap-1.5">
                        <Lock size={12} />
                        {slot.timeRange}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#292212] text-[#D4A843] text-[10px] font-code font-bold uppercase border border-[#473B1F]">
                        BOOKED
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="font-display font-bold text-sm text-white">
                        {slot.customerName}
                      </div>
                      <div className="text-xs font-body text-zinc-400">
                        {slot.serviceName}
                      </div>
                    </div>

                    <div className="text-[10px] font-code text-zinc-400 pt-1 border-t border-[#302514] flex items-center justify-between">
                      <span>Confirmed by AI Engine</span>
                      <Link
                        href="/dashboard/provider/bookings"
                        className="text-[#38BDF8] hover:underline"
                      >
                        View Job Details →
                      </Link>
                    </div>
                  </div>
                );
              }

              const isOpen = slot.status === "open";
              return (
                <div
                  key={slot.id}
                  onClick={() => toggleSlot(slot.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer select-none space-y-3 ${
                    isOpen
                      ? "bg-[#111118] border-white/10 hover:border-[#0054F9]/60 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                      : "bg-[#0A0A0F] border-white/8 opacity-50 hover:opacity-75"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-code font-bold flex items-center gap-1.5 ${
                        isOpen ? "text-[#38BDF8]" : "text-zinc-400"
                      }`}
                    >
                      <Clock size={12} />
                      {slot.timeRange}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-code font-bold uppercase border ${
                        isOpen
                          ? "bg-[#0E202B] text-[#38BDF8] border-[#18394D]"
                          : "bg-[#141420] text-zinc-400 border-white/10"
                      }`}
                    >
                      {isOpen ? "AVAILABLE" : "OFF-DUTY"}
                    </span>
                  </div>

                  <div className="text-xs font-body text-zinc-400">
                    {isOpen
                      ? "Open for homeowner dispatch and voice agent booking."
                      : "Artisan marked as resting or in transit."}
                  </div>

                  <div className="text-[11px] font-code text-[#38BDF8] pt-2 border-t border-white/8 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400">Click to toggle state</span>
                    <span>{isOpen ? "Close Slot" : "Open Slot"} ⇄</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SCHEDULE RULES & DISPATCH SETTINGS (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#111118] border border-white/10 space-y-5">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Zap size={16} className="text-[#38BDF8]" />
              <span>Dispatch Automation Rules</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-code uppercase text-zinc-400 mb-2">
                  Buffer Between Appointments
                </label>
                <div className="flex items-center gap-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        setBufferMinutes(mins);
                        toast.info(`Buffer updated to ${mins} minutes between jobs.`);
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-code font-bold border transition-colors ${
                        bufferMinutes === mins
                          ? "bg-[#141420] border-[#0054F9] text-[#38BDF8]"
                          : "bg-[#0A0A0F] border-white/8 text-zinc-400 hover:border-white/20"
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
                <p className="text-[11px] font-body text-zinc-400 mt-1.5">
                  Allows travel transit time across sectors in Islamabad.
                </p>
              </div>

              <div>
                <label className="block text-xs font-code uppercase text-zinc-400 mb-2">
                  Daily Cap (Maximum Jobs)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={maxJobsPerDay}
                    onChange={(e) => setMaxJobsPerDay(Number(e.target.value))}
                    className="w-full accent-[#0054F9] cursor-pointer"
                  />
                  <span className="font-display font-bold text-sm text-white w-12 text-right">
                    {maxJobsPerDay} jobs
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/8 flex items-center justify-between">
                <div>
                  <div className="font-display font-bold text-xs text-white">
                    Emergency Overtime
                  </div>
                  <div className="text-[11px] font-body text-zinc-400">
                    Accept urgent after-hours dispatch requests (+50% rate).
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = !emergencyOvertime;
                    setEmergencyOvertime(next);
                    toast.info(`Emergency Overtime: ${next ? "ENABLED" : "DISABLED"}`);
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    emergencyOvertime ? "bg-[#0054F9]" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      emergencyOvertime ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Sync status card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#141420] to-[#0A0A0F] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-code text-[#38BDF8]">
              <Sparkles size={14} />
              <span>Real-Time Sync Active</span>
            </div>
            <p className="font-body text-xs text-zinc-400">
              Whenever you toggle a slot to OFF-DUTY, the AI voice agent automatically offers the nearest alternative window to customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
