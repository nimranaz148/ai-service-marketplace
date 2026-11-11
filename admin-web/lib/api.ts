const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    // In browser: relative URL delegates to Next.js rewrites proxying to port 8000.
    // This eliminates Mixed Content errors on Cloudflare HTTPS tunnels!
    return "";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
};

export interface AdminStats {
  total_sessions: number;
  total_bookings: number;
  active_providers: number;
  total_trace_logs: number;
  recent_sessions: Array<{
    id: string;
    raw_input: string;
    detected_language: string;
    status: string;
    service_type: string;
    started_at: string;
  }>;
}

export interface TraceLog {
  id: string;
  session_id: string;
  step: number;
  agent_name: string;
  tool_used: string;
  input_payload: any;
  output_payload: any;
  output_summary: string;
  duration_ms: number;
  created_at: string;
}

export interface SessionItem {
  id: string;
  user_id?: string;
  raw_input: string;
  detected_language: string;
  status: string;
  started_at: string;
  completed_at?: string;
  intent_result?: {
    service_type: string;
    location_text: string;
    time_preference: string;
    urgency: string;
    extracted_payload: any;
  };
  trace_logs: TraceLog[];
}

export interface BookingItem {
  id: string;
  provider_id: string;
  user_id: string;
  slot_id?: string;
  status: string;
  confirmation_code: string;
  booked_at: string;
  provider?: {
    name: string;
    category: string;
    area: string;
    rating: number;
  };
}

export interface ConversationTurn {
  role: "user" | "agent";
  content: string;
  created_at?: string;
}

export interface ConversationResponse {
  session_id: string;
  status: "in_progress" | "needs_input" | "completed" | "failed";
  awaiting_input: boolean;
  area?: string | null;
  agent_message?: string | null;
  turns: ConversationTurn[];
  trace_logs: TraceLog[];
}

export interface ProviderSlotItem {
  id: string;
  provider_id: string;
  slot_date: string;
  slot_time: string;
  is_booked: boolean;
  created_at?: string;
}

export interface MyProviderProfile {
  id: string;
  name: string;
  category: string;
  area: string;
  lat: number;
  lng: number;
  rating: number;
  jobs_completed: number;
  price_range: string;
  is_active: boolean;
  slots: ProviderSlotItem[];
}

export interface CustomerContact {
  id: string;
  name: string;
  phone?: string | null;
  area?: string | null;
}

export interface ProviderBooking {
  id: string;
  provider_id: string;
  user_id: string;
  slot_id?: string | null;
  status: string;
  confirmation_code: string;
  booked_at?: string | null;
  slot?: ProviderSlotItem | null;
  customer?: CustomerContact | null;
}

export interface AdminCustomer {
  id: string;
  name: string;
  phone?: string | null;
  area?: string | null;
  role: string;
  is_suspended: boolean;
  bookings_count: number;
  created_at?: string | null;
}

export interface ProviderItem {
  id: string;
  name: string;
  category: string;
  area: string;
  lat: number;
  lng: number;
  rating: number;
  jobs_completed: number;
  price_range: string;
  is_active: boolean;
}

export const api = {
  getStats: async (): Promise<AdminStats> => {
    const res = await fetch(`${getBaseUrl()}/admin/stats`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch admin stats");
    return res.json();
  },

  getSessions: async (): Promise<SessionItem[]> => {
    const res = await fetch(`${getBaseUrl()}/admin/sessions`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch sessions");
    return res.json();
  },

  getSessionTraces: async (sessionId: string): Promise<TraceLog[]> => {
    const res = await fetch(`${getBaseUrl()}/requests/${sessionId}/trace`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch session traces");
    return res.json();
  },

  getBookings: async (): Promise<BookingItem[]> => {
    const res = await fetch(`${getBaseUrl()}/admin/bookings`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
  },

  getProviders: async (): Promise<ProviderItem[]> => {
    const res = await fetch(`${getBaseUrl()}/admin/providers`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch providers");
    return res.json();
  },

  createProvider: async (providerData: Partial<ProviderItem>): Promise<ProviderItem> => {
    const res = await fetch(`${getBaseUrl()}/admin/providers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(providerData),
    });
    if (!res.ok) throw new Error("Failed to create provider");
    return res.json();
  },

  triggerDemoRequest: async (message: string): Promise<any> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);
    try {
      const res = await fetch(`${getBaseUrl()}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error("Failed to execute agent workflow");
      return await res.json();
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  },

  // ---- Conversational agent (Phase 2 backend) ----
  startConversation: async (message: string, userId?: string, area?: string): Promise<ConversationResponse> => {
    const res = await fetch(`${getBaseUrl()}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, user_id: userId, area }),
    });
    if (!res.ok) throw new Error(`Failed to start conversation: ${res.status}`);
    return res.json();
  },

  continueConversation: async (sessionId: string, message: string): Promise<ConversationResponse> => {
    const res = await fetch(`${getBaseUrl()}/requests/${sessionId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error(`Failed to continue conversation: ${res.status}`);
    return res.json();
  },

  // ---- Provider self-service (/me/provider) ----
  // Real per-role auth isn't wired up yet — `userId` is the same explicit-id
  // convention the conversation endpoints already use; the backend falls
  // back to the seeded demo provider persona when it's omitted.
  getMyProvider: async (userId?: string): Promise<MyProviderProfile> => {
    const qs = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
    const res = await fetch(`${getBaseUrl()}/me/provider${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load provider profile: ${res.status}`);
    return res.json();
  },

  updateMyProvider: async (
    patch: Partial<Pick<MyProviderProfile, "name" | "category" | "area" | "price_range" | "is_active">>,
    userId?: string,
  ): Promise<MyProviderProfile> => {
    const qs = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
    const res = await fetch(`${getBaseUrl()}/me/provider${qs}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error(`Failed to update provider profile: ${res.status}`);
    return res.json();
  },

  getMyBookings: async (userId?: string): Promise<ProviderBooking[]> => {
    const qs = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
    const res = await fetch(`${getBaseUrl()}/me/provider/bookings${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load bookings: ${res.status}`);
    return res.json();
  },

  updateMyBookingStatus: async (
    bookingId: string,
    newStatus: "confirmed" | "en_route" | "arrived" | "completed" | "cancelled",
    userId?: string,
  ): Promise<ProviderBooking> => {
    const qs = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
    const res = await fetch(`${getBaseUrl()}/me/provider/bookings/${bookingId}${qs}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) throw new Error(`Failed to update booking status: ${res.status}`);
    return res.json();
  },

  getMySlots: async (userId?: string): Promise<ProviderSlotItem[]> => {
    const qs = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
    const res = await fetch(`${getBaseUrl()}/me/provider/slots${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load slots: ${res.status}`);
    return res.json();
  },

  createMySlot: async (slotDate: string, slotTime: string, userId?: string): Promise<ProviderSlotItem> => {
    const qs = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
    const res = await fetch(`${getBaseUrl()}/me/provider/slots${qs}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot_date: slotDate, slot_time: slotTime }),
    });
    if (!res.ok) throw new Error(`Failed to create slot: ${res.status}`);
    return res.json();
  },

  deleteMySlot: async (slotId: string, userId?: string): Promise<void> => {
    const qs = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
    const res = await fetch(`${getBaseUrl()}/me/provider/slots/${slotId}${qs}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Failed to delete slot: ${res.status}`);
  },

  // ---- Admin customer management ----
  getCustomers: async (): Promise<AdminCustomer[]> => {
    const res = await fetch(`${getBaseUrl()}/admin/customers`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch customers");
    return res.json();
  },

  createCustomer: async (data: { name: string; phone?: string; area?: string }): Promise<AdminCustomer> => {
    const res = await fetch(`${getBaseUrl()}/admin/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, role: "customer" }),
    });
    if (!res.ok) throw new Error("Failed to create customer");
    return res.json();
  },

  updateCustomer: async (
    id: string,
    patch: Partial<{ name: string; phone: string; area: string; is_suspended: boolean }>,
  ): Promise<AdminCustomer> => {
    const res = await fetch(`${getBaseUrl()}/admin/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error("Failed to update customer");
    return res.json();
  },

  deleteCustomer: async (id: string): Promise<void> => {
    const res = await fetch(`${getBaseUrl()}/admin/customers/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete customer");
  },
};
