"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api, BookingItem } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { CalendarCheck, CheckCircle2, Search, MapPin, Tag, ChevronLeft } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api
      .getBookings()
      .then((data) => setBookings(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const code = b.confirmation_code.toLowerCase();
    const prov = (b.provider?.name || "").toLowerCase();
    const area = (b.provider?.area || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return code.includes(query) || prov.includes(query) || area.includes(query);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative rounded-[2rem] p-6 sm:p-8 bg-[#111118] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#0054F9]/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-surface-sunken px-3 py-1 text-xs font-medium text-ink-muted mb-3">
              <CalendarCheck size={13} className="text-[#0054F9]" />
              <span>SUPER ADMIN / BOOKINGS LEDGER</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Customer Bookings Ledger
            </h1>
            <p className="font-body text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              Real-time atomic slot reservations created by BookingAgent and Vapi Voice Concierge with post-service escrow verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/admin"
              className="h-10 px-4 rounded-xl bg-[#141420] hover:bg-[#1A1A28] text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <ChevronLeft size={14} className="text-[#38BDF8]" />
              <span>Admin Deck</span>
            </Link>
            <Badge className="bg-[#141420] text-[#38BDF8] text-xs font-mono px-3.5 py-2 rounded-xl border border-white/10 shadow-sm">
              Total Bookings: {bookings.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl bg-[#111118] border border-white/8 p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
        <div className="relative">
          <Search className="h-4 w-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Confirmation Code (e.g. BK-1182), Provider, or Metro area..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0A0A0F] border border-white/10 focus:outline-none focus:border-[#0054F9] text-xs text-white placeholder:text-zinc-500 font-medium transition-colors"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <Card className="bg-[#111118] border-white/10 rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#0D0D14] border-b border-white/8">
              <TableRow className="border-white/8 hover:bg-transparent">
                <TableHead className="text-xs font-bold text-zinc-400">Confirmation Code</TableHead>
                <TableHead className="text-xs font-bold text-zinc-400">Service Provider</TableHead>
                <TableHead className="text-xs font-bold text-zinc-400">Category</TableHead>
                <TableHead className="text-xs font-bold text-zinc-400">Location</TableHead>
                <TableHead className="text-xs font-bold text-zinc-400">Booked At</TableHead>
                <TableHead className="text-xs font-bold text-zinc-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-xs text-zinc-500">
                    <div className="h-5 w-5 border-2 border-[#0054F9] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading bookings ledger...
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <TableRow key={b.id} className="hover:bg-[#141420] transition-colors border-b border-white/5">
                    <TableCell className="text-xs font-mono font-bold text-[#38BDF8]">
                      <span className="px-2 py-0.5 rounded-lg bg-[#0054F9]/10 border border-[#0054F9]/30">
                        {b.confirmation_code}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-white">
                      {b.provider?.name || "Verified Master Artisan"}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-300">
                      <Badge variant="outline" className="text-[10px] bg-[#141420] border-white/10 text-zinc-400">
                        {b.provider?.category || "Specialist"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-zinc-300">
                      <span className="flex items-center gap-1.5 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-[#38BDF8]" />
                        {b.provider?.area || "Pakistan Metro"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-zinc-500 font-mono">
                      {formatDate(b.booked_at)}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-400" />
                        {b.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-xs text-zinc-500">
                    No bookings found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
