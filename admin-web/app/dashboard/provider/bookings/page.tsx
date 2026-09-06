"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  ChevronLeft,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/Toaster";

interface AssignedBooking {
  id: string;
  token: string;
  customerName: string;
  customerPhone: string;
  address: string;
  serviceRequested: string;
  reportedIssue: string;
  scheduledTime: string;
  status: "assigned" | "en_route" | "arrived" | "completed";
  estimatedEarnings: string;
}

const INITIAL_BOOKINGS: AssignedBooking[] = [
  {
    id: "bk-01",
    token: "BK-8011",
    customerName: "Dr. Ayesha Siddiqui",
    customerPhone: "+92 300 2134567",
    address: "House 14, St 2, Sector G-13/2, Islamabad",
    serviceRequested: "AC Technician & Diagnostic",
    reportedIssue: "Inverter AC cooling trip ho rahi hai, continuous E6 error display.",
    scheduledTime: "Today at 02:00 PM",
    status: "assigned",
    estimatedEarnings: "PKR 3,500",
  },
  {
    id: "bk-02",
    token: "BK-2758",
    customerName: "Hamza Tariq",
    customerPhone: "+92 321 8765432",
    address: "Apartment 4B, Sector F-10/4, Islamabad",
    serviceRequested: "Emergency AC Circuit Fix",
    reportedIssue: "Main outdoor capacitor blown after voltage fluctuation.",
    scheduledTime: "Today at 04:30 PM",
    status: "assigned",
    estimatedEarnings: "PKR 4,200",
  },
  {
    id: "bk-03",
    token: "BK-9042",
    customerName: "Zubair Khan",
    customerPhone: "+92 300 9876543",
    address: "House 89, Sector I-8/1, Islamabad",
    serviceRequested: "Annual AC General Service",
    reportedIssue: "High pressure jet wash + chemical coil cleaning.",
    scheduledTime: "Tomorrow at 10:00 AM",
    status: "assigned",
    estimatedEarnings: "PKR 2,800",
  },
];

export default function ProviderBookingsPage() {
  const [bookings, setBookings] = useState<AssignedBooking[]>(INITIAL_BOOKINGS);

  const handleUpdateStatus = (id: string, newStatus: AssignedBooking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          if (newStatus === "en_route") {
            toast.info(`Status: EN ROUTE — Customer notified of your arrival ETA!`);
          } else if (newStatus === "arrived") {
            toast.info(`Status: ARRIVED — Prompted customer for premises entry.`);
          } else if (newStatus === "completed") {
            toast.success(`Booking ${b.token} COMPLETED! Token verified & escrow PKR released!`);
          }
          return { ...b, status: newStatus };
        }
        return b;
      })
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1C2C24]">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/provider"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111C17] border border-[#20332B] text-xs font-semibold text-[#A3B8AF] hover:text-[#D4A843] transition-colors"
          >
            <ChevronLeft size={14} />
            <span>Artisan Deck</span>
          </Link>
          <span className="text-[#3A5247]">/</span>
          <span className="font-display font-bold text-base text-[#F2F7F4] flex items-center gap-2">
            <CalendarCheck size={18} className="text-[#D4A843]" />
            <span>Assigned Customer Bookings Queue</span>
          </span>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#292212] border border-[#473B1F] text-[#D4A843] font-code text-xs font-bold">
          {bookings.filter((b) => b.status !== "completed").length} Active Jobs In Queue
        </span>
      </div>

      {/* Bookings Queue */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="p-6 rounded-3xl bg-[#111C17] border border-[#20332B] hover:border-[#D4A843]/40 transition-all shadow-[0_16px_40px_rgba(0,0,0,0.3)] space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1C2E25]">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl bg-[#162D23] border border-[#2B493B] text-[#34D399] font-code font-bold text-xs">
                  {booking.token}
                </span>
                <span className="font-display font-bold text-base text-[#F2F7F4]">
                  {booking.customerName}
                </span>
                <span className="text-xs text-[#8EAAA0]">({booking.serviceRequested})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-[#34D399]">
                  {booking.estimatedEarnings}
                </span>
                <span className="text-[10px] text-[#6B877B] uppercase font-code">Escrow Lock</span>
              </div>
            </div>

            {/* Middle Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-[#D1E0D9]">
                  <MapPin size={14} className="text-[#34D399] shrink-0 mt-0.5" />
                  <span>{booking.address}</span>
                </div>
                <div className="flex items-center gap-2 text-[#8EAAA0] font-code">
                  <Phone size={13} className="text-[#D4A843]" />
                  <span>Customer Phone: <strong className="text-[#F2F7F4]">{booking.customerPhone}</strong></span>
                </div>
              </div>

              <div className="space-y-2 p-3 rounded-2xl bg-[#0B1310] border border-[#1F3329]">
                <span className="font-code text-[10px] uppercase font-bold text-[#6B877B] block">
                  Reported Technical Issue:
                </span>
                <p className="text-xs text-[#F2F7F4] italic leading-relaxed">
                  &ldquo;{booking.reportedIssue}&rdquo;
                </p>
              </div>
            </div>

            {/* Lifecycle Status & Controls */}
            <div className="pt-3 border-t border-[#1C2E25] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-code text-[11px] text-[#8EAAA0]">Job Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full border text-[10px] font-code font-bold uppercase ${
                    booking.status === "completed"
                      ? "bg-[#132A1F] text-[#34D399] border-[#214735]"
                      : booking.status === "arrived"
                      ? "bg-[#292212] text-[#D4A843] border-[#473B1F]"
                      : booking.status === "en_route"
                      ? "bg-[#0E202B] text-[#38BDF8] border-[#18394D]"
                      : "bg-[#111C17] text-[#8EAAA0] border-[#20332B]"
                  }`}
                >
                  ● {booking.status.replace("_", " ")}
                </span>
              </div>

              {/* Action Buttons based on status */}
              <div className="flex flex-wrap items-center gap-2">
                {booking.status === "assigned" && (
                  <Button
                    onClick={() => handleUpdateStatus(booking.id, "en_route")}
                    className="h-9 px-4 rounded-xl bg-[#0E202B] hover:bg-[#153142] text-[#38BDF8] border border-[#18394D] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Navigation size={13} />
                    <span>Mark On The Way (En Route)</span>
                  </Button>
                )}

                {booking.status === "en_route" && (
                  <Button
                    onClick={() => handleUpdateStatus(booking.id, "arrived")}
                    className="h-9 px-4 rounded-xl bg-[#292212] hover:bg-[#3D331B] text-[#D4A843] border border-[#473B1F] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <MapPin size={13} />
                    <span>Mark Arrived At Premises</span>
                  </Button>
                )}

                {booking.status === "arrived" && (
                  <Button
                    onClick={() => handleUpdateStatus(booking.id, "completed")}
                    className="h-9 px-4 rounded-xl bg-[#34D399] hover:bg-[#2EB885] text-[#090E0C] font-display font-bold text-xs flex items-center gap-1.5 shadow-[0_4px_16px_rgba(52,211,153,0.3)] cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    <span>Verify Token & Complete Job</span>
                  </Button>
                )}

                {booking.status === "completed" && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#34D399] font-code font-semibold px-3 py-1 rounded-xl bg-[#132A1F] border border-[#214735]">
                    <CheckCircle2 size={13} />
                    <span>Payout Released via Escrow</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
