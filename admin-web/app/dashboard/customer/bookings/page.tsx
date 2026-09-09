"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  Star,
  ChevronLeft,
  ShieldCheck,
  Sparkles,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/Toaster";

interface CustomerBooking {
  id: string;
  token: string;
  serviceTitle: string;
  category: string;
  artisanName: string;
  artisanAvatar: string;
  artisanPhone: string;
  scheduledTime: string;
  address: string;
  amountPKR: number;
  status: "active" | "completed" | "cancelled";
  rating?: number;
  review?: string;
  paymentMethod: string;
}

const INITIAL_CUSTOMER_BOOKINGS: CustomerBooking[] = [
  {
    id: "cbk-01",
    token: "BK-8011",
    serviceTitle: "Master Inverter AC Diagnostic & Leak Check",
    category: "HVAC",
    artisanName: "Tariq Mehmood",
    artisanAvatar: "TM",
    artisanPhone: "+92 301 5554321",
    scheduledTime: "Today, Sep 5 at 02:00 PM",
    address: "House 14, St 2, Sector G-13/2, Islamabad",
    amountPKR: 3500,
    status: "active",
    paymentMethod: "Cash on Completion",
  },
  {
    id: "cbk-02",
    token: "BK-4519",
    serviceTitle: "Main Distribution Board & Breaker Overhaul",
    category: "Electrician",
    artisanName: "Kashif Siddiqui",
    artisanAvatar: "KS",
    artisanPhone: "+92 321 8887766",
    scheduledTime: "Aug 28, 2026 at 11:30 AM",
    address: "House 14, St 2, Sector G-13/2, Islamabad",
    amountPKR: 2800,
    status: "completed",
    rating: 5,
    review: "Bohat Zabardast service! Breaker tripping ka masla 30 min me pakar lia.",
    paymentMethod: "Atelier Escrow",
  },
  {
    id: "cbk-03",
    token: "BK-1209",
    serviceTitle: "Dual Jet Pressure Foam Coil Wash",
    category: "HVAC",
    artisanName: "Tariq Mehmood",
    artisanAvatar: "TM",
    artisanPhone: "+92 301 5554321",
    scheduledTime: "Aug 14, 2026 at 04:00 PM",
    address: "Apartment 4B, Sector F-10/4, Islamabad",
    amountPKR: 4500,
    status: "completed",
    rating: 5,
    review: "Thorough chemical wash, indoor smell is totally gone.",
    paymentMethod: "Cash on Completion",
  },
  {
    id: "cbk-04",
    token: "BK-9931",
    serviceTitle: "Concealed Ultrasonic Pipe Leak Detection",
    category: "Plumbing",
    artisanName: "Muhammad Usman",
    artisanAvatar: "MU",
    artisanPhone: "+92 333 4443322",
    scheduledTime: "Jul 20, 2026 at 01:00 PM",
    address: "House 14, St 2, Sector G-13/2, Islamabad",
    amountPKR: 4000,
    status: "completed",
    rating: 4,
    review: "Good diagnostic work with ultrasonic device.",
    paymentMethod: "Atelier Escrow",
  },
];

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<CustomerBooking[]>(INITIAL_CUSTOMER_BOOKINGS);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [reviewModalBooking, setReviewModalBooking] = useState<CustomerBooking | null>(null);
  const [stars, setStars] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const filteredBookings = bookings.filter((b) => {
    if (filter === "active") return b.status === "active";
    if (filter === "completed") return b.status === "completed";
    return true;
  });

  const openReviewModal = (booking: CustomerBooking) => {
    setReviewModalBooking(booking);
    setStars(booking.rating || 5);
    setReviewText(booking.review || "");
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalBooking) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === reviewModalBooking.id ? { ...b, rating: stars, review: reviewText } : b
      )
    );

    toast.success("Review submitted! Thank you for rating your Master Artisan.");
    setReviewModalBooking(null);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard/customer"
              className="inline-flex items-center gap-1 text-xs font-code text-zinc-400 hover:text-[#0054F9] transition-colors"
            >
              <ChevronLeft size={14} /> Back to Home
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-code text-[#38BDF8] uppercase tracking-wider">My Bookings</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            My Bookings & Orders
          </h1>
          <p className="font-body text-xs sm:text-sm text-zinc-400 mt-1">
            Track active technician dispatches, view security OTP codes, and rate your verified artisans.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {[
            { key: "all", label: "All Orders" },
            { key: "active", label: "Active (1)" },
            { key: "completed", label: "Completed (3)" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-code font-bold transition-all cursor-pointer ${
                filter === tab.key
                  ? "bg-[#0054F9] text-white shadow-[0_0_20px_rgba(0,84,249,0.3)]"
                  : "bg-[#111118] border border-white/8 text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Ledger Cards */}
      <div className="space-y-4">
        {filteredBookings.map((b) => {
          const isActive = b.status === "active";
          return (
            <div
              key={b.id}
              className={`p-6 rounded-3xl border transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#141420] to-[#0A0A0F] border-2 border-[#0054F9]/40 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
                  : "bg-[#111118] border-white/8"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Token, Service, Artisan info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#292212] border border-[#473B1F] text-[#D4A843] flex items-center justify-center font-display font-black text-xl shrink-0 shadow-inner">
                    {b.artisanAvatar}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-code font-black text-xs text-[#38BDF8] bg-[#0054F9]/15 px-2.5 py-0.5 rounded-md border border-[#0054F9]/30">
                        OTP: {b.token}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-code font-bold uppercase border ${
                          isActive
                            ? "bg-[#0E202B] text-[#38BDF8] border-[#18394D] animate-pulse"
                            : "bg-[#111118] text-zinc-400 border-white/8"
                        }`}
                      >
                        {isActive ? "ON THE WAY" : "COMPLETED"}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base sm:text-lg text-white">
                      {b.serviceTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-body text-zinc-400">
                      <span className="text-white font-semibold flex items-center gap-1">
                        Artisan: {b.artisanName}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-[#38BDF8]" />
                        {b.scheduledTime}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-zinc-400" />
                        {b.address}
                      </span>
                    </div>

                    {/* Review Snippet if available */}
                    {b.rating && (
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <div className="flex items-center text-[#D4A843]">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={i < b.rating! ? "#D4A843" : "none"}
                              stroke="#D4A843"
                            />
                          ))}
                        </div>
                        <span className="text-zinc-400 italic text-[11px]">"{b.review}"</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/8">
                  <div>
                    <div className="font-display font-extrabold text-lg text-[#38BDF8] text-right">
                      PKR {b.amountPKR.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-code text-zinc-400 text-right">
                      {b.paymentMethod}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <a
                        href={`tel:${b.artisanPhone}`}
                        className="h-9 px-3.5 rounded-xl bg-[#0054F9]/10 hover:bg-[#0054F9]/20 border border-[#0054F9]/40 text-[#38BDF8] font-code text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Phone size={13} />
                        <span>Call Artisan</span>
                      </a>
                    ) : (
                      <Button
                        onClick={() => openReviewModal(b)}
                        variant="outline"
                        className="h-9 border-white/8 text-[#D4A843] hover:bg-[#D4A843]/10 text-xs font-display flex items-center gap-1.5"
                      >
                        <Star size={13} />
                        <span>{b.rating ? "Edit Review" : "Leave Review"}</span>
                      </Button>
                    )}

                    <button
                      onClick={() => toast.info(`Invoice ${b.token}.pdf downloaded.`)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20 transition-colors"
                      title="Download Invoice"
                    >
                      <Download size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* REVIEW MODAL */}
      {reviewModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/8 pb-4">
              <div>
                <h2 className="font-display font-bold text-lg text-white">
                  Rate Your Experience
                </h2>
                <p className="text-xs text-zinc-400">{reviewModalBooking.artisanName}</p>
              </div>
              <button
                onClick={() => setReviewModalBooking(null)}
                className="text-zinc-400 hover:text-white font-code text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4">
              <div className="text-center py-2">
                <label className="block text-xs font-code uppercase text-zinc-400 mb-2">
                  Overall Rating
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setStars(st)}
                      className="p-1 transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        size={28}
                        fill={st <= stars ? "#D4A843" : "none"}
                        stroke="#D4A843"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-code uppercase text-zinc-400 mb-1.5">
                  Your Review / Feedback
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details about punctuality, craftsmanship, and pricing transparency..."
                  className="w-full bg-[#0A0A0F] border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#0054F9]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReviewModalBooking(null)}
                  className="border-white/8 text-zinc-400 hover:bg-white/5 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#D4A843] hover:bg-[#C29633] text-[#090E0C] font-display font-bold text-xs px-5"
                >
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
