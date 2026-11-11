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
      <div className="relative rounded-[2rem] p-6 sm:p-8 bg-surface-raised border border-hairline shadow-raised overflow-hidden">

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-surface-sunken px-3 py-1 text-xs font-medium text-ink-muted mb-3">
              <CalendarCheck size={13} className="text-accent" />
              <span>SUPER ADMIN / BOOKINGS LEDGER</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
              Customer Bookings Ledger
            </h1>
            <p className="font-body text-xs sm:text-sm text-ink-muted mt-2 max-w-2xl leading-relaxed">
              Real-time atomic slot reservations created by BookingAgent and Vapi Voice Concierge with post-service escrow verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/admin"
              className="h-10 px-4 rounded-xl bg-surface-raised hover:bg-surface-sunken text-ink border border-hairline text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <ChevronLeft size={14} className="text-accent" />
              <span>Admin Deck</span>
            </Link>
            <Badge className="bg-surface-raised text-accent text-xs font-mono px-3.5 py-2 rounded-xl border border-hairline shadow-sm">
              Total Bookings: {bookings.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl bg-surface-raised border border-hairline p-3.5 shadow-raised">
        <div className="relative">
          <Search className="h-4 w-4 text-ink-muted absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Confirmation Code (e.g. BK-1182), Provider, or Metro area..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface border border-hairline focus:outline-none focus:border-accent text-xs text-ink placeholder:text-ink-muted font-medium transition-colors"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <Card className="bg-surface-raised border-hairline rounded-3xl overflow-hidden shadow-raised">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-surface border-b border-hairline">
              <TableRow className="border-hairline hover:bg-transparent">
                <TableHead className="text-xs font-bold text-ink-muted">Confirmation Code</TableHead>
                <TableHead className="text-xs font-bold text-ink-muted">Service Provider</TableHead>
                <TableHead className="text-xs font-bold text-ink-muted">Category</TableHead>
                <TableHead className="text-xs font-bold text-ink-muted">Location</TableHead>
                <TableHead className="text-xs font-bold text-ink-muted">Booked At</TableHead>
                <TableHead className="text-xs font-bold text-ink-muted">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-hairline">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-xs text-ink-muted">
                    <div className="h-5 w-5 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading bookings ledger...
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <TableRow key={b.id} className="hover:bg-surface-raised transition-colors border-b border-hairline">
                    <TableCell className="text-xs font-mono font-bold text-accent">
                      <span className="px-2 py-0.5 rounded-lg bg-accent-tint border border-status-live-line">
                        {b.confirmation_code}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-ink">
                      {b.provider?.name || "Verified Master Artisan"}
                    </TableCell>
                    <TableCell className="text-xs text-ink">
                      <Badge variant="outline" className="text-[10px] bg-surface-raised border-hairline text-ink-muted">
                        {b.provider?.category || "Specialist"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-ink">
                      <span className="flex items-center gap-1.5 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-accent" />
                        {b.provider?.area || "Pakistan Metro"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-ink-muted font-mono">
                      {formatDate(b.booked_at)}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-status-go-tint text-status-go border-status-go-line text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3 mr-1 text-status-go" />
                        {b.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-xs text-ink-muted">
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
