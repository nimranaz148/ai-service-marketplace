"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ChevronLeft,
  Home,
  Building,
  Sparkles,
  Phone,
  ShieldCheck,
  Radio,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/Toaster";

interface AddressItem {
  id: string;
  label: "Home" | "Office" | "Rental" | "Other";
  street: string;
  area: string;
  city: "Islamabad" | "Karachi" | "Lahore";
  landmark: string;
  isDefault: boolean;
}

const INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: "addr-01",
    label: "Home",
    street: "House 14, Street 2",
    area: "Sector G-13/2",
    city: "Islamabad",
    landmark: "Near Markaz Mosque & PSO Pump",
    isDefault: true,
  },
  {
    id: "addr-02",
    label: "Office",
    street: "Floor 4, Evacuee Trust Complex",
    area: "Aga Khan Road, F-5/1",
    city: "Islamabad",
    landmark: "Opposite Marriott Hotel",
    isDefault: false,
  },
  {
    id: "addr-03",
    label: "Rental",
    street: "Flat B-12, Al-Rauf Classic",
    area: "Block 13-D, Gulshan-e-Iqbal",
    city: "Karachi",
    landmark: "Behind Continental Bakery",
    isDefault: false,
  },
];

export default function CustomerProfileAddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<AddressItem[]>(INITIAL_ADDRESSES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [label, setLabel] = useState<"Home" | "Office" | "Rental" | "Other">("Home");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState<"Islamabad" | "Karachi" | "Lahore">("Islamabad");
  const [landmark, setLandmark] = useState("");

  // Communication Preferences
  const [voiceDialect, setVoiceDialect] = useState("roman_urdu");
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    const chosen = addresses.find((a) => a.id === id);
    toast.success(`Default address updated to ${chosen?.label} (${chosen?.area})`);
  };

  const handleDelete = (id: string) => {
    if (addresses.length <= 1) {
      toast.error("You must maintain at least one saved address.");
      return;
    }
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address removed.");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !area.trim()) {
      toast.error("Please fill in the street and sector/area.");
      return;
    }

    const newAddr: AddressItem = {
      id: `addr-${Date.now().toString().slice(-4)}`,
      label,
      street,
      area,
      city,
      landmark,
      isDefault: false,
    };

    setAddresses((prev) => [...prev, newAddr]);
    toast.success("New location added successfully!");
    setIsModalOpen(false);

    // Reset form
    setStreet("");
    setArea("");
    setLandmark("");
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C2C24] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard/customer"
              className="inline-flex items-center gap-1 text-xs font-code text-[#8EAAA0] hover:text-[#34D399] transition-colors"
            >
              <ChevronLeft size={14} /> Back to Concierge
            </Link>
            <span className="text-[#3D5245]">/</span>
            <span className="text-xs font-code text-[#34D399] uppercase tracking-wider">Saved Addresses</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F2F7F4] tracking-tight">
            Saved Locations & Voice Dispatch Preferences
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#A3B8AF] mt-1">
            Manage your residential and commercial premises. AI Concierge uses your default address for instant booking dispatch.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#34D399] hover:bg-[#2BB380] text-[#090E0C] font-display font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>Add New Address</span>
        </Button>
      </div>

      {/* Grid: Left column (Saved Addresses 7 cols), Right column (Voice & Communication Preferences 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SAVED ADDRESSES (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-[#F2F7F4] flex items-center gap-2">
              <MapPin size={18} className="text-[#34D399]" />
              <span>Registered Locations ({addresses.length})</span>
            </h2>
            <span className="text-xs font-code text-[#8EAAA0]">1 Default Active</span>
          </div>

          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 rounded-2xl border transition-all ${
                  addr.isDefault
                    ? "bg-[#13251D] border-[#34D399]/60 shadow-[0_4px_20px_rgba(52,211,153,0.1)]"
                    : "bg-[#111A15] border-[#1C2C24] hover:border-[#284435]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#182820] border border-[#274033] text-[#34D399] flex items-center justify-center shrink-0 mt-0.5">
                      {addr.label === "Home" ? (
                        <Home size={18} />
                      ) : addr.label === "Office" ? (
                        <Building size={18} />
                      ) : (
                        <MapPin size={18} />
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-base text-[#F2F7F4]">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-full bg-[#162D23] border border-[#34D399] text-[#34D399] text-[10px] font-code font-bold">
                            DEFAULT DISPATCH
                          </span>
                        )}
                        <span className="text-[10px] font-code text-[#8EAAA0] bg-[#18201C] px-2 py-0.5 rounded border border-[#25332B]">
                          {addr.city}
                        </span>
                      </div>

                      <p className="font-body text-xs text-[#F2F7F4]">
                        {addr.street}, {addr.area}
                      </p>

                      {addr.landmark && (
                        <p className="font-body text-[11px] text-[#8EAAA0] italic">
                          Landmark: {addr.landmark}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-xs font-code px-3 py-1.5 rounded-lg border border-[#234734] text-[#34D399] hover:bg-[#34D399]/10 transition-colors"
                      >
                        Set Default
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="p-1.5 rounded-lg text-[#8EAAA0] hover:text-[#EF4444] hover:bg-[#291316] transition-colors"
                      title="Delete Address"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VOICE & CONCIERGE PREFERENCES (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#111A15] border border-[#21352A] space-y-5">
            <h3 className="font-display font-bold text-base text-[#F2F7F4] flex items-center gap-2">
              <Sparkles size={16} className="text-[#34D399]" />
              <span>AI Concierge Voice Preferences</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-2">
                  Voice Agent Dialect (Vapi Engine)
                </label>
                <div className="space-y-2">
                  {[
                    { key: "roman_urdu", label: "Roman Urdu + English (Casual)", desc: "Natural mix used in Islamabad & Karachi" },
                    { key: "urdu", label: "Urdu (Authentic / Ba-Adab)", desc: "Polite formal Urdu phrasing" },
                    { key: "english", label: "Pakistani English (Crisp)", desc: "Clear professional English tone" },
                  ].map((opt) => (
                    <div
                      key={opt.key}
                      onClick={() => {
                        setVoiceDialect(opt.key);
                        toast.info(`Voice dialect set to: ${opt.label}`);
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        voiceDialect === opt.key
                          ? "bg-[#182D23] border-[#34D399] text-[#F2F7F4]"
                          : "bg-[#0C120F] border-[#1C2C24] text-[#8EAAA0] hover:border-[#2F4A3B]"
                      }`}
                    >
                      <div className="font-semibold text-xs">{opt.label}</div>
                      <div className="text-[10px] text-[#8EAAA0] mt-0.5">{opt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#1C2C24] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-xs text-[#F2F7F4]">
                      WhatsApp Live Location & ETA
                    </div>
                    <div className="text-[11px] font-body text-[#8EAAA0]">
                      Receive automated tracking ping when artisan starts driving.
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setWhatsappNotifications(!whatsappNotifications);
                      toast.info(`WhatsApp updates: ${!whatsappNotifications ? "ENABLED" : "DISABLED"}`);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      whatsappNotifications ? "bg-[#34D399]" : "bg-[#1C2C24]"
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-[#090E0C] absolute top-1 transition-transform ${
                        whatsappNotifications ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="font-display font-bold text-xs text-[#F2F7F4]">
                      SMS Security Token Backup
                    </div>
                    <div className="text-[11px] font-body text-[#8EAAA0]">
                      Receive completion token code via cellular SMS.
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSmsAlerts(!smsAlerts);
                      toast.info(`SMS Alerts: ${!smsAlerts ? "ENABLED" : "DISABLED"}`);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      smsAlerts ? "bg-[#34D399]" : "bg-[#1C2C24]"
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-[#090E0C] absolute top-1 transition-transform ${
                        smsAlerts ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD ADDRESS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111A15] border border-[#21352A] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1C2C24] pb-4">
              <h2 className="font-display font-extrabold text-xl text-[#F2F7F4]">
                Add Saved Location
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8EAAA0] hover:text-[#F2F7F4] font-code text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-1.5">
                  Location Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["Home", "Office", "Rental", "Other"] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setLabel(t)}
                      className={`py-2 rounded-xl text-xs font-code font-bold transition-all border ${
                        label === t
                          ? "bg-[#162D23] border-[#34D399] text-[#34D399]"
                          : "bg-[#0C120F] border-[#1C2C24] text-[#8EAAA0]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-1.5">
                  Metro City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as any)}
                  className="w-full bg-[#0C120F] border border-[#1C2C24] rounded-xl px-4 py-2.5 text-sm text-[#F2F7F4] focus:outline-none focus:border-[#34D399]"
                >
                  <option value="Islamabad">Islamabad</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-1.5">
                  Sector / Area *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector F-10/4 or DHA Phase 6"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-[#0C120F] border border-[#1C2C24] rounded-xl px-4 py-2.5 text-sm text-[#F2F7F4] focus:outline-none focus:border-[#34D399]"
                />
              </div>

              <div>
                <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-1.5">
                  Street & House / Apartment *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House 42, Street 18"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-[#0C120F] border border-[#1C2C24] rounded-xl px-4 py-2.5 text-sm text-[#F2F7F4] focus:outline-none focus:border-[#34D399]"
                />
              </div>

              <div>
                <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-1.5">
                  Nearby Landmark / Gate Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near PSO Pump, Red Gate"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full bg-[#0C120F] border border-[#1C2C24] rounded-xl px-4 py-2.5 text-sm text-[#F2F7F4] focus:outline-none focus:border-[#34D399]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1C2C24]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-[#1C2C24] text-[#8EAAA0] hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#34D399] hover:bg-[#2BB380] text-[#090E0C] font-display font-bold px-5"
                >
                  Save Location
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
