"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api, ProviderItem } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, Briefcase, CheckCircle2, Plus, Users, Search, Filter, ChevronLeft, Wrench } from "lucide-react";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const loadProviders = async () => {
    try {
      const data = await api.getProviders();
      setProviders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const filteredProviders = providers.filter((p) => {
    const matchesCity =
      selectedCity === "All" ||
      (selectedCity === "Karachi" && p.area.toLowerCase().includes("karachi")) ||
      (selectedCity === "Islamabad" && (p.area.toLowerCase().includes("islamabad") || p.area.includes("G-1") || p.area.includes("F-1") || p.area.includes("I-8")));

    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCity && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative rounded-[2rem] p-6 sm:p-8 bg-[#111118] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#0054F9]/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-surface-sunken px-3 py-1 text-xs font-medium text-ink-muted mb-3">
              <Wrench size={13} className="text-[#0054F9]" />
              <span>MARKETPLACE DIRECTORY / VERIFIED SUPPLY</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Service Providers Directory
            </h1>
            <p className="font-body text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              Real-time availability, NADRA biometric verification, and coverage across Islamabad, Karachi & Lahore.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/admin"
              className="h-10 px-4 rounded-xl bg-[#141420] hover:bg-[#1A1A28] text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <ChevronLeft size={14} className="text-[#38BDF8]" />
              <span>Admin Deck</span>
            </Link>
            <Badge className="bg-[#141420] text-[#38BDF8] text-xs font-mono px-3.5 py-2 rounded-xl border border-white/10 shadow-sm">
              Total Providers: {providers.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl bg-[#111118] border border-white/8 p-4 space-y-4 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* City Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0A0A0F] border border-white/10 shrink-0">
            {["All", "Karachi", "Islamabad"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCity === city
                    ? "bg-[#0054F9] text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by provider name, specialty, or metro sector..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0A0A0F] border border-white/10 focus:outline-none focus:border-[#0054F9] text-xs text-white placeholder:text-zinc-500 font-medium transition-colors"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {["All", "AC Technician", "Electrician", "Plumber", "Cleaner", "Tutor"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  categoryFilter === cat
                    ? "bg-[#0054F9] text-white border-[#0054F9] shadow-xs"
                    : "bg-[#0A0A0F] text-zinc-400 border-white/10 hover:bg-[#141420] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      {loading ? (
        <div className="p-12 text-center bg-[#111118] border border-white/8 rounded-2xl">
          <div className="h-6 w-6 border-2 border-[#0054F9] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 mt-2">Loading verified providers from Supabase Cloud...</p>
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="p-12 text-center bg-[#111118] border border-dashed border-white/10 rounded-2xl">
          <Users className="h-8 w-8 text-zinc-500 mx-auto mb-2 opacity-60" />
          <h4 className="text-sm font-bold text-white">No matching providers found</h4>
          <p className="text-xs text-zinc-400 mt-1">Try selecting another city or clearing your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProviders.map((provider) => (
            <Card
              key={provider.id}
              className="bg-[#111118] border-white/8 hover:border-[#0054F9]/40 transition-all duration-200 overflow-hidden group shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] rounded-2xl"
            >
              <CardHeader className="pb-3 border-b border-white/5 bg-[#141420]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base font-bold text-white group-hover:text-[#0054F9] transition-colors">
                      {provider.name}
                    </CardTitle>
                    <Badge variant="outline" className="mt-1 text-[10px] font-semibold bg-[#0A0A0F] text-zinc-400 border-white/10">
                      {provider.category}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 bg-[#1A1910] px-2 py-1 rounded-lg border border-[#3E341B] text-xs font-bold text-[#D4A843]">
                    <Star className="h-3.5 w-3.5 fill-[#D4A843] text-[#D4A843]" />
                    <span>{provider.rating.toFixed(1)}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-3.5 text-xs">
                <div className="flex items-center gap-2 text-zinc-300 font-medium">
                  <MapPin className="h-4 w-4 text-[#38BDF8] shrink-0" />
                  <span>{provider.area}</span>
                </div>

                <div className="flex items-center justify-between text-zinc-400 bg-[#0A0A0F] p-2.5 rounded-xl border border-white/5">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Briefcase className="h-3.5 w-3.5 text-zinc-500" />
                    Jobs Completed:
                  </span>
                  <span className="font-bold text-white">{provider.jobs_completed}+ jobs</span>
                </div>

                <div className="flex items-center justify-between text-zinc-400 bg-[#0A0A0F] p-2.5 rounded-xl border border-white/5">
                  <span className="font-medium">Standard Rate:</span>
                  <span className="font-bold text-white text-xs font-mono">{provider.price_range}</span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/5">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    NADRA Vetted
                  </span>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-bold">
                    Verified Pro
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
