const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    const res = await fetch(`${API_BASE_URL}/admin/stats`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch admin stats");
    return res.json();
  },

  getSessions: async (): Promise<SessionItem[]> => {
    const res = await fetch(`${API_BASE_URL}/admin/sessions`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch sessions");
    return res.json();
  },

  getSessionTraces: async (sessionId: string): Promise<TraceLog[]> => {
    const res = await fetch(`${API_BASE_URL}/requests/${sessionId}/trace`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch session traces");
    return res.json();
  },

  getBookings: async (): Promise<BookingItem[]> => {
    const res = await fetch(`${API_BASE_URL}/admin/bookings`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
  },

  getProviders: async (): Promise<ProviderItem[]> => {
    const res = await fetch(`${API_BASE_URL}/admin/providers`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch providers");
    return res.json();
  },

  createProvider: async (providerData: Partial<ProviderItem>): Promise<ProviderItem> => {
    const res = await fetch(`${API_BASE_URL}/admin/providers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(providerData),
    });
    if (!res.ok) throw new Error("Failed to create provider");
    return res.json();
  },

  triggerDemoRequest: async (message: string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error("Failed to execute agent workflow");
    return res.json();
  },
};
