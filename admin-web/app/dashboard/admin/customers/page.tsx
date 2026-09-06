"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  CalendarCheck,
  ChevronLeft,
  X,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/Toaster";

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  metro: string;
  bookingsCount: number;
  totalSpent: string;
  status: "active" | "suspended";
  joinedDate: string;
}

const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: "c-01",
    name: "Dr. Ayesha Siddiqui",
    email: "ayesha.siddiqui@aku.edu.pk",
    phone: "+92 300 2134567",
    metro: "Clifton, Karachi",
    bookingsCount: 24,
    totalSpent: "PKR 98,500",
    status: "active",
    joinedDate: "2026-01-14",
  },
  {
    id: "c-02",
    name: "Hamza Tariq",
    email: "hamza.tariq@systems.ltd",
    phone: "+92 321 8765432",
    metro: "Sector F-10, Islamabad",
    bookingsCount: 19,
    totalSpent: "PKR 76,200",
    status: "active",
    joinedDate: "2026-02-01",
  },
  {
    id: "c-03",
    name: "Bilal Cheema",
    email: "b.cheema@descon.pk",
    phone: "+92 333 4567890",
    metro: "DHA Phase 5, Lahore",
    bookingsCount: 16,
    totalSpent: "PKR 64,800",
    status: "active",
    joinedDate: "2026-02-18",
  },
  {
    id: "c-04",
    name: "Zainab Bokhari",
    email: "zainab.b@lums.edu.pk",
    phone: "+92 302 9988776",
    metro: "Gulberg, Lahore",
    bookingsCount: 12,
    totalSpent: "PKR 49,000",
    status: "active",
    joinedDate: "2026-03-05",
  },
  {
    id: "c-05",
    name: "Saad Farooqi",
    email: "saad.f@engro.com",
    phone: "+92 345 1122334",
    metro: "PECHS Block 2, Karachi",
    bookingsCount: 11,
    totalSpent: "PKR 42,500",
    status: "suspended",
    joinedDate: "2026-03-22",
  },
  {
    id: "c-06",
    name: "Zubair Khan",
    email: "zubair.k@gmail.com",
    phone: "+92 300 9876543",
    metro: "Gulshan-e-Iqbal, Karachi",
    bookingsCount: 7,
    totalSpent: "PKR 28,000",
    status: "active",
    joinedDate: "2026-04-10",
  },
];

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [metroFilter, setMetroFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    metro: "Sector G-13, Islamabad",
    status: "active" as "active" | "suspended",
  });

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);
    const matchesMetro =
      metroFilter === "all" || c.metro.toLowerCase().includes(metroFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesMetro && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      phone: "+92 300 ",
      metro: "Sector G-13, Islamabad",
      status: "active",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: CustomerRecord) => {
    setEditingId(c.id);
    setFormData({
      name: c.name,
      email: c.email,
      phone: c.phone,
      metro: c.metro,
      status: c.status,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? { ...c, ...formData }
            : c
        )
      );
      toast.success(`Customer ${formData.name} updated successfully!`);
    } else {
      const newCust: CustomerRecord = {
        id: "c-0" + (customers.length + 1),
        ...formData,
        bookingsCount: 0,
        totalSpent: "PKR 0",
        joinedDate: new Date().toISOString().split("T")[0],
      };
      setCustomers((prev) => [newCust, ...prev]);
      toast.success(`New customer ${formData.name} created successfully!`);
    }
    setModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus = c.status === "active" ? "suspended" : "active";
          toast.info(`${c.name} account is now ${newStatus.toUpperCase()}`);
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove customer ${name}?`)) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      toast.error(`Customer ${name} removed from registry.`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1C2C24]">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111C17] border border-[#20332B] text-xs font-semibold text-[#A3B8AF] hover:text-[#34D399] transition-colors"
          >
            <ChevronLeft size={14} />
            <span>Admin Deck</span>
          </Link>
          <span className="text-[#3A5247]">/</span>
          <span className="font-display font-bold text-base text-[#F2F7F4] flex items-center gap-2">
            <Users size={18} className="text-[#38BDF8]" />
            <span>Customer Management Registry</span>
          </span>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="h-10 px-4 rounded-xl bg-[#34D399] hover:bg-[#2EB885] text-[#090E0C] font-display font-bold text-xs flex items-center gap-2 shadow-[0_4px_16px_rgba(52,211,153,0.3)] transition-all cursor-pointer active:scale-95"
        >
          <Plus size={15} />
          <span>Add New Customer</span>
        </Button>
      </div>

      {/* Filters & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#111C17] border border-[#20332B] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-3.5 text-[#5E796F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone number..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#090E0C] border border-[#22362C] focus:border-[#34D399] text-xs text-[#F2F7F4] placeholder:text-[#526D60] outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={metroFilter}
            onChange={(e) => setMetroFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#090E0C] border border-[#22362C] text-xs text-[#F2F7F4] outline-none focus:border-[#34D399] font-medium cursor-pointer"
          >
            <option value="all">All Metros (ISB, KHI, LHE)</option>
            <option value="islamabad">Islamabad</option>
            <option value="karachi">Karachi</option>
            <option value="lahore">Lahore</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#090E0C] border border-[#22362C] text-xs text-[#F2F7F4] outline-none focus:border-[#34D399] font-medium cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-[#111C17] border border-[#20332B] overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0D1612] border-b border-[#1C2C24] text-[#8EAAA0] font-code uppercase text-[10px]">
                <th className="py-3.5 px-4 font-bold">Customer</th>
                <th className="py-3.5 px-4 font-bold">Contact</th>
                <th className="py-3.5 px-4 font-bold">Metro / Sector</th>
                <th className="py-3.5 px-4 font-bold">Bookings & Spend</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18261F]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#6B877B]">
                    No customer accounts matched your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#14221B] transition-colors">
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#162D23] border border-[#2B493B] text-[#34D399] flex items-center justify-center font-display font-bold text-xs shrink-0">
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-display font-bold text-xs text-[#F2F7F4] block">
                            {c.name}
                          </span>
                          <span className="font-code text-[10px] text-[#6B877B]">
                            ID: {c.id} · Joined {c.joinedDate}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-[#A3B8AF]">
                      <div className="space-y-0.5 font-code text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Phone size={11} className="text-[#6B877B]" />
                          <span>{c.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#6B877B]">
                          <Mail size={11} />
                          <span>{c.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Metro */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#F2F7F4]">
                        <MapPin size={12} className="text-[#34D399] shrink-0" />
                        <span>{c.metro}</span>
                      </div>
                    </td>

                    {/* Bookings & Spend */}
                    <td className="py-3.5 px-4">
                      <span className="font-display font-bold text-xs text-[#34D399] block">
                        {c.totalSpent}
                      </span>
                      <span className="font-code text-[10px] text-[#8BA499]">
                        {c.bookingsCount} Completed Jobs
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(c.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-code font-bold cursor-pointer transition-colors ${
                          c.status === "active"
                            ? "bg-[#132A1F] text-[#34D399] border-[#214735] hover:bg-[#1A382A]"
                            : "bg-[#291316] text-[#EF4444] border-[#471E23] hover:bg-[#381B20]"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === "active" ? "bg-[#34D399]" : "bg-[#EF4444]"}`} />
                        <span className="capitalize">{c.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href="/bookings"
                          title="View Bookings"
                          className="p-1.5 rounded-lg bg-[#14221B] hover:bg-[#1E332A] text-[#8EAAA0] hover:text-[#38BDF8] border border-[#20332B] transition-colors"
                        >
                          <CalendarCheck size={13} />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          title="Edit Customer"
                          className="p-1.5 rounded-lg bg-[#14221B] hover:bg-[#1E332A] text-[#8EAAA0] hover:text-[#34D399] border border-[#20332B] transition-colors cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          title="Delete Customer"
                          className="p-1.5 rounded-lg bg-[#14221B] hover:bg-[#291316] text-[#8EAAA0] hover:text-[#EF4444] border border-[#20332B] transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0D1612] border border-[#22382E] rounded-3xl p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1C2C24]">
              <h3 className="font-display font-bold text-base text-[#F2F7F4] flex items-center gap-2">
                <Users size={16} className="text-[#38BDF8]" />
                <span>{editingId ? "Edit Customer Profile" : "Register New Customer"}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#8EAAA0] hover:text-[#F2F7F4] p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#8EAAA0] uppercase tracking-wider mb-1 font-body">
                  Full Name:
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Dr. Ayesha Siddiqui"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#090E0C] border border-[#22362C] focus:border-[#34D399] text-xs text-[#F2F7F4] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8EAAA0] uppercase tracking-wider mb-1 font-body">
                  Email Address:
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="name@example.com"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#090E0C] border border-[#22362C] focus:border-[#34D399] text-xs text-[#F2F7F4] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8EAAA0] uppercase tracking-wider mb-1 font-body">
                  Phone Number:
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#090E0C] border border-[#22362C] focus:border-[#34D399] text-xs text-[#F2F7F4] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8EAAA0] uppercase tracking-wider mb-1 font-body">
                  Metro & Sector:
                </label>
                <select
                  value={formData.metro}
                  onChange={(e) => setFormData({ ...formData, metro: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#090E0C] border border-[#22362C] focus:border-[#34D399] text-xs text-[#F2F7F4] outline-none cursor-pointer"
                >
                  <option value="Sector G-13, Islamabad">Sector G-13, Islamabad</option>
                  <option value="Sector F-10, Islamabad">Sector F-10, Islamabad</option>
                  <option value="Sector I-8, Islamabad">Sector I-8, Islamabad</option>
                  <option value="Gulshan-e-Iqbal, Karachi">Gulshan-e-Iqbal, Karachi</option>
                  <option value="Clifton, Karachi">Clifton, Karachi</option>
                  <option value="PECHS Block 2, Karachi">PECHS Block 2, Karachi</option>
                  <option value="DHA Phase 5, Lahore">DHA Phase 5, Lahore</option>
                  <option value="Gulberg, Lahore">Gulberg, Lahore</option>
                  <option value="Johar Town, Lahore">Johar Town, Lahore</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8EAAA0] uppercase tracking-wider mb-1 font-body">
                  Account Status:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "active" })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      formData.status === "active"
                        ? "bg-[#132A1F] border-[#34D399] text-[#34D399]"
                        : "bg-[#090E0C] border-[#1C2C24] text-[#8EAAA0]"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "suspended" })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      formData.status === "suspended"
                        ? "bg-[#291316] border-[#EF4444] text-[#EF4444]"
                        : "bg-[#090E0C] border-[#1C2C24] text-[#8EAAA0]"
                    }`}
                  >
                    Suspended
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1C2C24]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#14221B] hover:bg-[#1A2E24] text-[#8EAAA0] hover:text-[#F2F7F4] text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#34D399] hover:bg-[#2EB885] text-[#090E0C] font-display font-bold text-xs cursor-pointer"
                >
                  Save Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
