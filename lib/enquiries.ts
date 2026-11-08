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
  const response = await fetch("/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string"
        ? data.error
        : "Could not send your enquiry. Please try again.",
    );
  }
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
  getSupabase: () => import("@supabase/supabase-js").SupabaseClient,
) {
  const { data, error } = await getSupabase()
    .from("enquiries")
    .select("id,payload,created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(enquiryFromRow);
}

export async function updateEnquiryStatus(
  getSupabase: () => import("@supabase/supabase-js").SupabaseClient,
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
