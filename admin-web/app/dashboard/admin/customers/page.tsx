"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  MapPin,
  CalendarCheck,
  ChevronLeft,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api, type AdminCustomer } from "@/lib/api";

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", area: "" });

  async function refresh() {
    try {
      const data = await api.getCustomers();
      setCustomers(data);
      setLoadError(null);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone ?? "").includes(searchQuery) ||
      (c.area ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !c.is_suspended) ||
      (statusFilter === "suspended" && c.is_suspended);
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: "", phone: "+92 300 ", area: "Sector G-13, Islamabad" });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: AdminCustomer) => {
    setEditingId(c.id);
    setFormData({ name: c.name, phone: c.phone ?? "", area: c.area ?? "" });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setSaving(true);
    try {
      if (editingId) {
        await api.updateCustomer(editingId, formData);
        toast.success(`Customer ${formData.name} updated.`);
      } else {
        await api.createCustomer(formData);
        toast.success(`Customer ${formData.name} created.`);
      }
      setModalOpen(false);
      await refresh();
    } catch {
      toast.error("Could not save this customer — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (c: AdminCustomer) => {
    try {
      await api.updateCustomer(c.id, { is_suspended: !c.is_suspended });
      toast.info(`${c.name} account is now ${c.is_suspended ? "ACTIVE" : "SUSPENDED"}`);
      await refresh();
    } catch {
      toast.error("Could not update this customer's status.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove customer ${name}?`)) return;
    try {
      await api.deleteCustomer(id);
      toast.error(`Customer ${name} removed.`);
      await refresh();
    } catch {
      toast.error("Could not remove this customer.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative rounded-[2rem] p-6 sm:p-8 bg-surface-raised border border-hairline shadow-raised overflow-hidden">

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-surface-sunken px-3 py-1 text-xs font-medium text-ink-muted mb-3">
              <Users size={13} className="text-accent" />
              <span>CUSTOMER REGISTRY</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
              Customer Management
            </h1>
            <p className="font-body text-xs sm:text-sm text-ink-muted mt-2 max-w-2xl leading-relaxed">
              Real registered customers, with each one&apos;s actual booking count.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/dashboard/admin"
              className="h-10 px-4 rounded-xl bg-surface-raised hover:bg-surface-sunken text-ink border border-hairline text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <ChevronLeft size={14} className="text-accent" />
              <span>Admin Deck</span>
            </Link>
            <Button
              onClick={handleOpenAdd}
              className="h-10 px-4 rounded-xl bg-primary hover:bg-[var(--accent-strong-hover)] text-accent-ink shadow-raised font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Plus size={15} />
              <span>Add New Customer</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-raised border border-hairline flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-3.5 text-ink-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, or area..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface border border-hairline focus:border-accent text-xs text-ink placeholder:text-ink-muted outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl bg-surface border border-hairline text-xs text-ink outline-none focus:border-accent font-medium cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="suspended">Suspended Only</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-surface-raised border border-hairline overflow-hidden shadow-raised">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-xs text-ink-muted">
            <Loader2 size={14} className="animate-spin" /> Loading customers…
          </div>
        ) : loadError ? (
          <div className="py-10 text-center text-xs text-ink-muted">{loadError}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface border-b border-hairline text-ink-muted font-code uppercase text-[10px]">
                  <th className="py-3.5 px-4 font-bold">Customer</th>
                  <th className="py-3.5 px-4 font-bold">Contact</th>
                  <th className="py-3.5 px-4 font-bold">Area</th>
                  <th className="py-3.5 px-4 font-bold">Bookings</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-ink-muted">
                      No customer accounts matched your search criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-raised transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-accent-tint border border-status-live-line text-accent flex items-center justify-center font-display font-bold text-xs shrink-0">
                            {c.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-display font-bold text-xs text-ink block">{c.name}</span>
                            <span className="font-code text-[10px] text-ink-muted">
                              Joined {c.created_at ? c.created_at.slice(0, 10) : "—"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-ink-muted">
                        <div className="flex items-center gap-1.5 font-code text-[11px]">
                          <Phone size={11} className="text-ink-muted" />
                          <span>{c.phone ?? "—"}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-ink">
                          <MapPin size={12} className="text-accent shrink-0" />
                          <span>{c.area ?? "—"}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-code text-[11px] text-ink flex items-center gap-1.5">
                          <CalendarCheck size={12} className="text-ink-muted" /> {c.bookings_count}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => void handleToggleStatus(c)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-code font-bold cursor-pointer transition-colors ${
                            !c.is_suspended
                              ? "bg-status-go-tint text-status-go border-status-go-line hover:bg-status-go-tint"
                              : "bg-status-stop-tint text-status-stop border-status-stop-line hover:bg-status-stop-tint"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${!c.is_suspended ? "bg-status-go" : "bg-status-stop"}`} />
                          <span className="capitalize">{c.is_suspended ? "suspended" : "active"}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(c)}
                            title="Edit Customer"
                            className="p-1.5 rounded-lg bg-surface-raised hover:bg-surface-sunken text-ink-muted hover:text-accent border border-hairline transition-colors cursor-pointer"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => void handleDelete(c.id, c.name)}
                            title="Delete Customer"
                            className="p-1.5 rounded-lg bg-surface-raised hover:bg-status-stop-tint text-ink-muted hover:text-status-stop border border-hairline transition-colors cursor-pointer"
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
        )}
      </div>

      {/* Add / Edit Customer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-scrim flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-raised border border-hairline rounded-3xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-hairline">
              <h3 className="font-display font-bold text-base text-ink flex items-center gap-2">
                <Users size={16} className="text-accent" />
                <span>{editingId ? "Edit Customer" : "Register New Customer"}</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-ink-muted hover:text-ink p-1 rounded-lg">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-1 font-body">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Ayesha Siddiqui"
                  className="w-full h-10 px-3.5 rounded-xl bg-surface border border-hairline focus:border-accent text-xs text-ink outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-1 font-body">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="w-full h-10 px-3.5 rounded-xl bg-surface border border-hairline focus:border-accent text-xs text-ink outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-1 font-body">
                  Area
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g. Gulberg, Lahore"
                  className="w-full h-10 px-3.5 rounded-xl bg-surface border border-hairline focus:border-accent text-xs text-ink outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-hairline">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-raised hover:bg-surface-sunken text-ink-muted hover:text-ink text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-[var(--accent-strong-hover)] text-accent-ink shadow-raised font-display font-bold text-xs cursor-pointer"
                >
                  {saving ? "Saving…" : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
