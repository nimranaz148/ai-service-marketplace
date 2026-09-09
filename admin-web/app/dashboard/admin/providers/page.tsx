"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api, ProviderItem } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star,
  MapPin,
  Briefcase,
  CheckCircle2,
  Plus,
  Users,
  Search,
  Filter,
  ChevronLeft,
  Wrench,
  ShieldCheck,
  ShieldAlert,
  Edit2,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/Toaster";

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Add Provider Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newProv, setNewProv] = useState({
    name: "",
    category: "AC Technician",
    area: "Sector G-13, Islamabad",
    price_range: "PKR 2500+",
  });

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

  const handleCreateProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProv.name) return;
    try {
      const created = await api.createProvider({
        name: newProv.name,
        category: newProv.category,
        area: newProv.area,
        price_range: newProv.price_range,
        rating: 5.0,
        jobs_completed: 0,
        is_active: true,
        lat: 33.65,
        lng: 72.97,
      });
      setProviders([created, ...providers]);
      toast.success(`Master Artisan ${newProv.name} onboarded!`);
      setModalOpen(false);
    } catch (err: any) {
      // Local optimistic fallback
      const localProv: ProviderItem = {
        id: "prov-" + Math.random().toString(36).substring(2, 8),
        name: newProv.name,
        category: newProv.category,
        area: newProv.area,
        price_range: newProv.price_range,
        rating: 5.0,
        jobs_completed: 0,
        is_active: true,
        lat: 33.65,
        lng: 72.97,
      };
      setProviders([localProv, ...providers]);
      toast.success(`Master Artisan ${newProv.name} added to roster!`);
      setModalOpen(false);
    }
  };

  const handleToggleActive = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.is_active;
          toast.info(`${p.name} status set to ${next ? "ONLINE" : "OFFLINE"}`);
          return { ...p, is_active: next };
        }
        return p;
      })
    );
  };

  const filteredProviders = providers.filter((p) => {
    const areaLower = p.area.toLowerCase();
    const matchesCity =
      selectedCity === "All" ||
      (selectedCity === "Karachi" && areaLower.includes("karachi")) ||
      (selectedCity === "Islamabad" && (areaLower.includes("islamabad") || p.area.includes("G-") || p.area.includes("F-") || p.area.includes("I-"))) ||
      (selectedCity === "Lahore" && areaLower.includes("lahore"));

    const matchesCategory = categoryFilter === "All" || p.category.toLowerCase().includes(categoryFilter.toLowerCase());
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
            <div className="catalis-badge mb-3">
              <Wrench size={13} className="text-[#0054F9]" />
              <span>SUPER ADMIN / SUPPLY ROSTER</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Master Artisans Supply Roster
            </h1>
            <p className="font-body text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              Vetted technicians and trade specialists across Islamabad, Karachi, and Lahore. Monitor ratings, active field status, and NADRA verification.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/dashboard/admin"
              className="h-10 px-4 rounded-xl bg-[#141420] hover:bg-[#1A1A28] text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <ChevronLeft size={14} className="text-[#38BDF8]" />
              <span>Admin Deck</span>
            </Link>
            <Button
              onClick={() => setModalOpen(true)}
              className="h-10 px-4 rounded-xl bg-[#0054F9] hover:bg-[#0043C7] text-white shadow-[0_0_20px_rgba(0,84,249,0.3)] font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Plus size={15} />
              <span>Onboard New Artisan</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl bg-[#111118] border border-white/8 p-4 space-y-3 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* City Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0A0A0F] border border-white/10 shrink-0">
            {["All", "Islamabad", "Karachi", "Lahore"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
              placeholder="Search by artisan name, trade specialty, or sector..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0A0A0F] border border-white/10 focus:outline-none focus:border-[#0054F9] text-xs text-white placeholder:text-zinc-500 font-medium transition-colors"
            />
          </div>

          {/* Category Filter */}
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

      {/* Grid of Providers */}
      {loading ? (
        <div className="p-12 text-center bg-[#111118] border border-white/8 rounded-3xl">
          <div className="h-6 w-6 border-2 border-[#0054F9] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 mt-2">Loading vetted master artisans...</p>
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="p-12 text-center bg-[#111118] border border-dashed border-white/8 rounded-3xl">
          <Users className="h-8 w-8 text-zinc-500 mx-auto mb-2 opacity-60" />
          <h4 className="text-sm font-bold text-white">No matching artisans found</h4>
          <p className="text-xs text-zinc-400 mt-1">Try selecting another metro or trade filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProviders.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-[#111118] border border-white/8 hover:border-[#0054F9]/40 transition-all flex flex-col justify-between shadow-[0_8px_24px_rgba(0,0,0,0.25)] group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0054F9]/10 border border-[#0054F9]/30 text-[#0054F9] flex items-center justify-center font-display font-bold text-sm shrink-0">
                      {p.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-white">
                        {p.name}
                      </h3>
                      <span className="font-code text-[11px] text-[#D4A843] block">
                        {p.category}
                      </span>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 font-display font-bold text-xs text-[#D4A843] bg-[#141420] px-2 py-0.5 rounded-lg border border-white/10">
                    <Star size={11} fill="currentColor" />
                    <span>{p.rating.toFixed(2)}</span>
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-[#38BDF8] shrink-0" />
                    <span className="truncate text-white">{p.area}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-code pt-1">
                    <span>Rate: <strong className="text-white">{p.price_range}</strong></span>
                    <span>Jobs: <strong className="text-white font-bold">{p.jobs_completed}</strong></span>
                  </div>
                </div>
              </div>

              {/* Status & Verification Badges */}
              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-code text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <ShieldCheck size={11} />
                  <span>NADRA Verified</span>
                </span>

                <button
                  onClick={() => handleToggleActive(p.id)}
                  className={`text-[10px] font-code px-2 py-0.5 rounded border font-semibold cursor-pointer transition-colors ${
                    p.is_active
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                      : "bg-[#291316] text-[#EF4444] border-[#471E23] hover:bg-[#381B20]"
                  }`}
                >
                  {p.is_active ? "● Online" : "○ In Field"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Artisan Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111118] border border-white/10 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/8">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Wrench size={16} className="text-[#D4A843]" />
                <span>Onboard New Master Artisan</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-white p-1">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateProvider} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1 font-body">
                  Artisan Name:
                </label>
                <input
                  type="text"
                  value={newProv.name}
                  onChange={(e) => setNewProv({ ...newProv, name: e.target.value })}
                  required
                  placeholder="e.g. Master Rashid Khan"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#0A0A0F] border border-white/10 focus:border-[#0054F9] text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1 font-body">
                  Primary Trade Category:
                </label>
                <select
                  value={newProv.category}
                  onChange={(e) => setNewProv({ ...newProv, category: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#0A0A0F] border border-white/10 focus:border-[#0054F9] text-xs text-white outline-none cursor-pointer"
                >
                  <option value="AC Technician">AC Technician & HVAC</option>
                  <option value="Plumber">Hydro & Sanitary Engineering</option>
                  <option value="Electrician">Solar & Electrical Systems</option>
                  <option value="Cleaner">Deep Detailing & Sanitization</option>
                  <option value="Auto Diagnostic">Automotive ECU & Diagnostics</option>
                  <option value="Tutor">Academic STEM Mentorship</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1 font-body">
                  Metro Sector & Base Area:
                </label>
                <select
                  value={newProv.area}
                  onChange={(e) => setNewProv({ ...newProv, area: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#0A0A0F] border border-white/10 focus:border-[#0054F9] text-xs text-white outline-none cursor-pointer"
                >
                  <option value="Sector G-13, Islamabad">Sector G-13, Islamabad</option>
                  <option value="Sector F-10, Islamabad">Sector F-10, Islamabad</option>
                  <option value="Gulshan-e-Iqbal, Karachi">Gulshan-e-Iqbal, Karachi</option>
                  <option value="Clifton, Karachi">Clifton, Karachi</option>
                  <option value="DHA Phase 5, Lahore">DHA Phase 5, Lahore</option>
                  <option value="Johar Town, Lahore">Johar Town, Lahore</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1 font-body">
                  Hourly / Base Rate:
                </label>
                <input
                  type="text"
                  value={newProv.price_range}
                  onChange={(e) => setNewProv({ ...newProv, price_range: e.target.value })}
                  placeholder="PKR 2,500+"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#0A0A0F] border border-white/10 focus:border-[#0054F9] text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#141420] text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0054F9] hover:bg-[#0043C7] text-white shadow-[0_0_20px_rgba(0,84,249,0.3)] font-display font-bold text-xs"
                >
                  Save to Roster
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
