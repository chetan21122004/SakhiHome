"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const supabaseConfigured = Boolean(url && key);
let client: SupabaseClient<Database> | undefined;
export function getSupabase() {
  if (!url || !key)
    throw new Error(
      "Supabase is not configured. Add the project URL and publishable key to the environment.",
    );
  return (client ??= createClient<Database>(url, key));
}
