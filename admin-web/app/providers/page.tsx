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
      <div className="relative rounded-[2rem] p-6 sm:p-8 bg-surface-raised border border-hairline shadow-raised overflow-hidden">

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-surface-sunken px-3 py-1 text-xs font-medium text-ink-muted mb-3">
              <Wrench size={13} className="text-accent" />
              <span>MARKETPLACE DIRECTORY / VERIFIED SUPPLY</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
              Service Providers Directory
            </h1>
            <p className="font-body text-xs sm:text-sm text-ink-muted mt-2 max-w-2xl leading-relaxed">
              Real-time availability, provider verification, and coverage across Islamabad, Karachi & Lahore.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/admin"
              className="h-10 px-4 rounded-xl bg-surface-raised hover:bg-surface-sunken text-ink border border-hairline text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <ChevronLeft size={14} className="text-accent" />
              <span>Admin Deck</span>
            </Link>
            <Badge className="bg-surface-raised text-accent text-xs font-mono px-3.5 py-2 rounded-xl border border-hairline shadow-sm">
              Total Providers: {providers.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl bg-surface-raised border border-hairline p-4 space-y-4 shadow-raised">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* City Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-hairline shrink-0">
            {["All", "Karachi", "Islamabad"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCity === city
                    ? "bg-primary text-accent-ink shadow-sm"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-ink-muted absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by provider name, specialty, or metro sector..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface border border-hairline focus:outline-none focus:border-accent text-xs text-ink placeholder:text-ink-muted font-medium transition-colors"
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
                    ? "bg-primary text-accent-ink border-accent shadow-xs"
                    : "bg-surface text-ink-muted border-hairline hover:bg-surface-raised hover:text-ink"
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
        <div className="p-12 text-center bg-surface-raised border border-hairline rounded-2xl">
          <div className="h-6 w-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-ink-muted mt-2">Loading verified providers from Supabase Cloud...</p>
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="p-12 text-center bg-surface-raised border border-dashed border-hairline rounded-2xl">
          <Users className="h-8 w-8 text-ink-muted mx-auto mb-2 opacity-60" />
          <h4 className="text-sm font-bold text-ink">No matching providers found</h4>
          <p className="text-xs text-ink-muted mt-1">Try selecting another city or clearing your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProviders.map((provider) => (
            <Card
              key={provider.id}
              className="bg-surface-raised border-hairline hover:border-status-live-line transition-all duration-200 overflow-hidden group shadow-raised hover:shadow-raised rounded-2xl"
            >
              <CardHeader className="pb-3 border-b border-hairline bg-surface-raised">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base font-bold text-ink group-hover:text-accent transition-colors">
                      {provider.name}
                    </CardTitle>
                    <Badge variant="outline" className="mt-1 text-[10px] font-semibold bg-surface text-ink-muted border-hairline">
                      {provider.category}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 bg-status-warn-tint px-2 py-1 rounded-lg border border-status-warn-line text-xs font-bold text-status-warn">
                    <Star className="h-3.5 w-3.5 fill-status-warn text-status-warn" />
                    <span>{provider.rating.toFixed(1)}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-3.5 text-xs">
                <div className="flex items-center gap-2 text-ink font-medium">
                  <MapPin className="h-4 w-4 text-accent shrink-0" />
                  <span>{provider.area}</span>
                </div>

                <div className="flex items-center justify-between text-ink-muted bg-surface p-2.5 rounded-xl border border-hairline">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Briefcase className="h-3.5 w-3.5 text-ink-muted" />
                    Jobs Completed:
                  </span>
                  <span className="font-bold text-ink">{provider.jobs_completed}+ jobs</span>
                </div>

                <div className="flex items-center justify-between text-ink-muted bg-surface p-2.5 rounded-xl border border-hairline">
                  <span className="font-medium">Standard Rate:</span>
                  <span className="font-bold text-ink text-xs font-mono">{provider.price_range}</span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-hairline">
                  <span className="inline-flex items-center gap-1 text-status-go font-semibold text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-status-go" />
                    Verified
                  </span>
                  <Badge className="bg-status-go-tint text-status-go border-status-go-line text-[10px] font-bold">
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
