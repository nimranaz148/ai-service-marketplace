"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Eye,
  Star,
  MapPin,
  ShieldCheck,
  Clock,
  Sparkles,
  ChevronLeft,
  DollarSign,
  Award,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  pricePKR: number;
  durationMinutes: number;
  description: string;
  warranty: string;
  isActive: boolean;
}

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "srv-01",
    title: "Master Inverter AC Diagnostic & Leak Check",
    category: "HVAC Diagnostics",
    pricePKR: 3500,
    durationMinutes: 45,
    description: "Digital manifold pressure testing, compressor amp draw verification, and electronic halogen gas leak check.",
    warranty: "30-Day Guarantee",
    isActive: true,
  },
  {
    id: "srv-02",
    title: "Dual Jet Pressure Foam Wash",
    category: "HVAC Servicing",
    pricePKR: 4500,
    durationMinutes: 60,
    description: "Indoor coil ultrasonic chemical wash, high-pressure outdoor condenser clean, and anti-bacterial blower disinfection.",
    warranty: "45-Day Odor Free",
    isActive: true,
  },
  {
    id: "srv-03",
    title: "Inverter PCB Logic Board Micro-Soldering",
    category: "Component Repair",
    pricePKR: 6500,
    durationMinutes: 90,
    description: "Component-level IGBT & IPM transistor repair, fuse bridge replacement, and firmware reset on OEM specs.",
    warranty: "90-Day Parts Warranty",
    isActive: true,
  },
  {
    id: "srv-04",
    title: "High-Purity Gas Refill (R410A / R32)",
    category: "Refrigeration",
    pricePKR: 7000,
    durationMinutes: 60,
    description: "Full vacuum purging with two-stage rotary pump, precision scale weight refill per OEM manufacturer plate.",
    warranty: "Season Warranty",
    isActive: true,
  },
  {
    id: "srv-05",
    title: "Thermostat Calibration & Smart Sensor Sync",
    category: "Smart HVAC",
    pricePKR: 2500,
    durationMinutes: 30,
    description: "Digital ambient temp discrepancy calibration, PCB sensor thermistor replacement and remote signal tuning.",
    warranty: "30-Day Guarantee",
    isActive: false,
  },
];

export default function ProviderServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("HVAC Diagnostics");
  const [pricePKR, setPricePKR] = useState(3500);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [description, setDescription] = useState("");
  const [warranty, setWarranty] = useState("30-Day Guarantee");

  const openAddModal = () => {
    setEditingService(null);
    setTitle("");
    setCategory("HVAC Diagnostics");
    setPricePKR(3500);
    setDurationMinutes(45);
    setDescription("");
    setWarranty("30-Day Guarantee");
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setTitle(service.title);
    setCategory(service.category);
    setPricePKR(service.pricePKR);
    setDurationMinutes(service.durationMinutes);
    setDescription(service.description);
    setWarranty(service.warranty);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a service title.");
      return;
    }

    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? { ...s, title, category, pricePKR: Number(pricePKR), durationMinutes: Number(durationMinutes), description, warranty }
            : s
        )
      );
      toast.success("Service updated successfully!");
    } else {
      const newService: ServiceItem = {
        id: `srv-${Date.now().toString().slice(-4)}`,
        title,
        category,
        pricePKR: Number(pricePKR),
        durationMinutes: Number(durationMinutes),
        description,
        warranty,
        isActive: true,
      };
      setServices((prev) => [newService, ...prev]);
      toast.success("New service added to your catalog!");
    }
    setIsModalOpen(false);
  };

  const toggleServiceStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next = !s.isActive;
          toast.info(`Service "${s.title}" marked ${next ? "ACTIVE" : "PAUSED"}`);
          return { ...s, isActive: next };
        }
        return s;
      })
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast.success("Service removed from catalog");
  };

  const activeServices = services.filter((s) => s.isActive);
  const minPrice = activeServices.length > 0 ? Math.min(...activeServices.map((s) => s.pricePKR)) : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard/provider"
              className="inline-flex items-center gap-1 text-xs font-code text-ink-muted hover:text-accent transition-colors"
            >
              <ChevronLeft size={14} /> Back to HUD
            </Link>
            <span className="text-ink-muted">/</span>
            <span className="text-xs font-code text-status-warn uppercase tracking-wider">Services & Live Preview</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
            Services Catalog & Live Client Preview
          </h1>
          <p className="font-body text-xs sm:text-sm text-ink-muted mt-1">
            Manage your service offerings, pricing in PKR, and see how customers view your profile in real-time.
          </p>
        </div>

        <Button
          onClick={openAddModal}
          className="bg-status-warn hover:opacity-90 text-white font-display font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>Add New Service</span>
        </Button>
      </div>

      {/* Grid: 2 Columns on XL screens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Service Management List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-ink flex items-center gap-2">
              <Layers size={18} className="text-status-warn" />
              <span>Published Services ({services.length})</span>
            </h2>
            <span className="text-xs font-code text-ink-muted">
              {activeServices.length} Active in Search
            </span>
          </div>

          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.id}
                className={`p-5 rounded-2xl border transition-all ${
                  service.isActive
                    ? "bg-surface-raised border-hairline hover:border-status-live-line"
                    : "bg-surface border-hairline opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-surface-raised text-ink-muted text-[10px] font-code font-bold uppercase border border-hairline">
                        {service.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-code text-accent bg-status-info-tint px-2 py-0.5 rounded border border-status-info-line">
                        <Award size={10} />
                        {service.warranty}
                      </span>
                      {!service.isActive && (
                        <span className="text-[10px] font-code text-status-stop bg-status-stop-tint px-2 py-0.5 rounded border border-status-stop-line">
                          PAUSED
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-base text-ink">
                      {service.title}
                    </h3>
                    <p className="font-body text-xs text-ink-muted line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-4 pt-2 text-xs font-code text-ink-muted">
                      <span className="flex items-center gap-1 text-status-warn font-bold text-sm">
                        PKR {service.pricePKR.toLocaleString()}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-ink-muted" />
                        ~{service.durationMinutes} mins
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => toggleServiceStatus(service.id)}
                      className={`text-[11px] font-code px-2.5 py-1 rounded-lg border transition-colors ${
                        service.isActive
                          ? "border-status-live-line text-accent hover:bg-accent-tint"
                          : "border-hairline text-ink-muted hover:bg-surface-sunken"
                      }`}
                    >
                      {service.isActive ? "Active" : "Activate"}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(service)}
                        className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-sunken transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="p-1.5 rounded-lg text-ink-muted hover:text-status-stop hover:bg-status-stop-tint transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Client Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-ink flex items-center gap-2">
              <Eye size={18} className="text-accent" />
              <span>Live Client Preview</span>
            </h2>
            <span className="text-[11px] font-code text-accent bg-status-info-tint px-2 py-0.5 rounded border border-status-info-line flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              Customer Perspective
            </span>
          </div>

          <p className="font-body text-xs text-ink-muted">
            This exact interactive card is presented to homeowners searching for artisans in your metro cluster.
          </p>

          {/* PREVIEW CARD */}
          <div className="p-6 rounded-3xl bg-surface-raised border-2 border-status-live-line shadow-raised relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-36 h-36 bg-accent-tint rounded-full blur-2xl pointer-events-none" />

            {/* Header info */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-status-warn-tint border border-status-warn-line text-status-warn flex items-center justify-center font-display font-black text-2xl shrink-0 shadow-inner">
                {user?.avatar || "TM"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-lg text-ink truncate">
                    {user?.name || "Tariq Mehmood"}
                  </h3>
                  <ShieldCheck size={16} className="text-accent shrink-0" />
                </div>
                <p className="font-body text-xs text-status-warn font-semibold mt-0.5">
                  {user?.category || "Master HVAC & AC Specialist"}
                </p>
                <p className="font-body text-[11px] text-ink-muted flex items-center gap-1 mt-1">
                  <MapPin size={11} className="text-accent" />
                  {user?.area || "Sector G-13, Islamabad"}
                </p>
              </div>
            </div>

            {/* Badges / Rating */}
            <div className="grid grid-cols-3 gap-2 mt-5 py-3 px-4 rounded-2xl bg-surface border border-hairline text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-status-warn font-display font-bold text-sm">
                  <Star size={13} fill="var(--status-warn)" />
                  <span>{user?.rating || 4.96}</span>
                </div>
                <div className="text-[10px] font-code text-ink-muted">142 Reviews</div>
              </div>
              <div className="border-x border-hairline">
                <div className="font-display font-bold text-sm text-accent">98%</div>
                <div className="text-[10px] font-code text-ink-muted">On-Time</div>
              </div>
              <div>
                <div className="font-display font-bold text-sm text-ink">Verified</div>
                <div className="text-[10px] font-code text-status-go">Verified</div>
              </div>
            </div>

            {/* Dynamic Services Pill list */}
            <div className="mt-5 space-y-2">
              <div className="text-[11px] font-code uppercase text-ink-muted font-bold">
                Available Services ({activeServices.length})
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {activeServices.length === 0 ? (
                  <div className="text-xs text-status-stop bg-status-stop-tint p-3 rounded-xl border border-status-stop-line">
                    No active services! Homeowners will not be able to book you until you activate at least one service.
                  </div>
                ) : (
                  activeServices.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-surface-raised border border-hairline text-xs font-body"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-ink truncate">{s.title}</div>
                        <div className="text-[10px] text-ink-muted flex items-center gap-1">
                          <Clock size={10} /> ~{s.durationMinutes} mins · {s.warranty}
                        </div>
                      </div>
                      <span className="font-display font-bold text-status-warn shrink-0">
                        PKR {s.pricePKR.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Price Preview & Booking CTA */}
            <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between">
              <div>
                <span className="text-[10px] font-code text-ink-muted uppercase">Starting From</span>
                <div className="font-display font-bold text-lg text-accent">
                  {minPrice > 0 ? `PKR ${minPrice.toLocaleString()}` : "N/A"}
                </div>
              </div>

              <Button
                disabled
                className="bg-primary text-accent-ink shadow-raised font-display font-bold px-4 py-2 rounded-xl text-xs opacity-90 cursor-not-allowed"
              >
                Book Artisan (Client View)
              </Button>
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="p-4 rounded-2xl bg-surface-raised border border-hairline flex items-start gap-3 text-xs text-ink-muted">
            <Sparkles size={16} className="text-status-warn shrink-0 mt-0.5" />
            <p>
              Changes made to service titles, rates, or guarantees are pushed instantly to the AI Dispatcher and Vapi Voice Agent knowledge graph.
            </p>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-scrim flex items-center justify-center p-4">
          <div className="bg-surface-raised border border-hairline rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <h2 className="font-display font-extrabold text-xl text-ink">
                {editingService ? "Edit Service Offering" : "Create New Service"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-muted hover:text-ink font-code text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-code uppercase text-ink-muted mb-1.5">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PCB Board Inspection & Overhaul"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface border border-hairline rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-code uppercase text-ink-muted mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface border border-hairline rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent"
                  >
                    <option value="HVAC Diagnostics">HVAC Diagnostics</option>
                    <option value="HVAC Servicing">HVAC Servicing</option>
                    <option value="Component Repair">Component Repair</option>
                    <option value="Refrigeration">Refrigeration</option>
                    <option value="Smart HVAC">Smart HVAC</option>
                    <option value="Emergency Visit">Emergency Visit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-code uppercase text-ink-muted mb-1.5">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    required
                    value={pricePKR}
                    onChange={(e) => setPricePKR(Number(e.target.value))}
                    className="w-full bg-surface border border-hairline rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-code uppercase text-ink-muted mb-1.5">
                    Estimated Time (Mins)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-surface border border-hairline rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-code uppercase text-ink-muted mb-1.5">
                    Warranty / Guarantee
                  </label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="e.g. 30-Day Guarantee"
                    className="w-full bg-surface border border-hairline rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-code uppercase text-ink-muted mb-1.5">
                  Detailed Scope / Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline the exact diagnostic tests or steps included in this service..."
                  className="w-full bg-surface border border-hairline rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-hairline">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-hairline text-ink-muted hover:bg-surface-sunken"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-status-warn hover:opacity-90 text-white font-display font-bold px-5"
                >
                  {editingService ? "Update Service" : "Publish to Catalog"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
