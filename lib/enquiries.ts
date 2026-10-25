"use client";

import type { Database } from "./database.types";

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  area: string;
  service: string;
  budget: string;
  startTime: string;
  endTime: string;
  message: string;
  status: "New" | "Contacted" | "Closed";
  createdAt?: string;
};

export type EnquiryInput = Omit<Enquiry, "id" | "status" | "createdAt">;

export async function submitEnquiry(input: EnquiryInput) {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase is not configured.");
  }
  const sb = createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  const id = `ENQ-${crypto.randomUUID()}`;
  const payload: Enquiry = {
    id,
    ...input,
    status: "New",
  };
  const { error } = await sb.from("enquiries").insert({ id, payload });
  if (error) throw new Error("Could not send your enquiry. Please try again.");
}

export function enquiryFromRow(row: {
  id: string;
  payload: unknown;
  created_at: string;
}): Enquiry {
  const p = row.payload as Enquiry;
  return { ...p, id: row.id, createdAt: row.created_at };
}

export async function loadEnquiries(
  getSupabase: () => import("@supabase/supabase-js").SupabaseClient<Database>,
) {
  const { data, error } = await getSupabase()
    .from("enquiries")
    .select("id,payload,created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(enquiryFromRow);
}

export async function updateEnquiryStatus(
  getSupabase: () => import("@supabase/supabase-js").SupabaseClient<Database>,
  id: string,
  status: Enquiry["status"],
  current: Enquiry,
) {
  const { error } = await getSupabase()
    .from("enquiries")
    .update({ payload: { ...current, status } })
    .eq("id", id);
  if (error) throw error;
}
