"use client";

import React, { useEffect, useState } from "react";
import { api, ProviderItem } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, Briefcase, CheckCircle2, Plus, Users, Search, Filter } from "lucide-react";

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#34D399] bg-[#162D23] px-3 py-1 rounded-full border border-[#2B493B]">
              Verified Marketplace Supply
            </span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#F2F7F4] tracking-tight mt-2">
            Service Providers Directory
          </h1>
          <p className="font-body text-xs text-[#A3B8AF] mt-1">
            Real-time availability, NADRA biometric verification, and coverage across Islamabad, Karachi & Lahore.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-[#111C17] text-[#34D399] text-xs font-mono px-3.5 py-1.5 border border-[#20332B] shadow-sm">
            Total Providers: {providers.length}
          </Badge>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl bg-[#111C17] border border-[#20332B] p-4 space-y-4 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* City Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0B1310] border border-[#1F3329] shrink-0">
            {["All", "Karachi", "Islamabad"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCity === city
                    ? "bg-[#162D23] text-[#34D399] border border-[#2B493B] shadow-sm"
                    : "text-[#8EAAA0] hover:text-[#F2F7F4]"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-[#5E796F] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by provider name, specialty, or metro sector..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0B1310] border border-[#1F3329] focus:outline-none focus:border-[#34D399] text-xs text-[#F2F7F4] placeholder-[#5E796F] font-medium transition-colors"
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
                    ? "bg-[#162D23] text-[#34D399] border-[#2B493B] shadow-xs"
                    : "bg-[#0B1310] text-[#8EAAA0] border-[#1F3329] hover:bg-[#121E18] hover:text-[#F2F7F4]"
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
        <div className="p-12 text-center bg-[#111C17] border border-[#20332B] rounded-2xl">
          <div className="h-6 w-6 border-2 border-[#34D399] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#8EAAA0] mt-2">Loading verified providers from Supabase Cloud...</p>
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="p-12 text-center bg-[#111C17] border border-dashed border-[#20332B] rounded-2xl">
          <Users className="h-8 w-8 text-[#5E796F] mx-auto mb-2 opacity-60" />
          <h4 className="text-sm font-bold text-[#F2F7F4]">No matching providers found</h4>
          <p className="text-xs text-[#8EAAA0] mt-1">Try selecting another city or clearing your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProviders.map((provider) => (
            <Card
              key={provider.id}
              className="bg-[#111C17] border-[#20332B] hover:border-[#34D399]/40 transition-all duration-200 overflow-hidden group shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] rounded-2xl"
            >
              <CardHeader className="pb-3 border-b border-[#1F3329] bg-[#0D1813]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base font-bold text-[#F2F7F4] group-hover:text-[#34D399] transition-colors">
                      {provider.name}
                    </CardTitle>
                    <Badge variant="outline" className="mt-1 text-[10px] font-semibold bg-[#0E1813] text-[#8EAAA0] border-[#23382E]">
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
                <div className="flex items-center gap-2 text-[#A3B8AF] font-medium">
                  <MapPin className="h-4 w-4 text-[#34D399] shrink-0" />
                  <span>{provider.area}</span>
                </div>

                <div className="flex items-center justify-between text-[#8EAAA0] bg-[#0B1310] p-2.5 rounded-xl border border-[#1C2C24]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Briefcase className="h-3.5 w-3.5 text-[#5E796F]" />
                    Jobs Completed:
                  </span>
                  <span className="font-bold text-[#F2F7F4]">{provider.jobs_completed}+ jobs</span>
                </div>

                <div className="flex items-center justify-between text-[#8EAAA0] bg-[#0B1310] p-2.5 rounded-xl border border-[#1C2C24]">
                  <span className="font-medium">Standard Rate:</span>
                  <span className="font-bold text-[#34D399] text-xs font-mono">{provider.price_range}</span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#1F3329]">
                  <span className="inline-flex items-center gap-1 text-[#34D399] font-semibold text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#34D399]" />
                    NADRA Vetted
                  </span>
                  <Badge className="bg-[#132A1F] text-[#34D399] border-[#214735] text-[10px] font-bold">
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
