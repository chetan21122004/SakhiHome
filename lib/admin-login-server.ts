import { getServiceSupabase } from "./supabase-service";
import { normalizeStaffEmail } from "./staff-auth";

export type StaffLoginRow = {
  email: string;
  role: "Admin" | "Coordinator";
  enabled: boolean;
};

export async function verifyStaffTableLogin(
  email: string,
  password: string,
): Promise<StaffLoginRow | null> {
  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("staff_access")
    .select("email,role,enabled,password")
    .eq("email", normalizeStaffEmail(email))
    .maybeSingle();
  if (error || !data?.enabled) return null;
  const row = data as StaffLoginRow & { password: string };
  if (!row.password || row.password !== password) return null;
  return {
    email: row.email,
    role: row.role as "Admin" | "Coordinator",
    enabled: row.enabled,
  };
}
