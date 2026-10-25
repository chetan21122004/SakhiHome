import { getSupabaseServer } from "./supabase-server";
import { getAreaBySlug } from "./areas";

export type PublicMaidListing = {
  id: string;
  displayName: string;
  area: string;
  services: string[];
  experience: number;
  languages: string;
  schedule: string;
};

function rowToListing(row: {
  id: string | null;
  display_name: string | null;
  area: string | null;
  services: unknown;
  experience: number | null;
  languages: string | null;
  schedule: string | null;
}): PublicMaidListing | null {
  if (!row.id || !row.area || !row.display_name) return null;
  const services = Array.isArray(row.services)
    ? row.services.filter((s): s is string => typeof s === "string")
    : [];
  return {
    id: row.id,
    displayName: row.display_name,
    area: row.area,
    services,
    experience: row.experience ?? 0,
    languages: row.languages ?? "",
    schedule: row.schedule ?? "",
  };
}

export async function getAvailableMaidCount(): Promise<number | null> {
  const sb = getSupabaseServer();
  if (!sb) return null;
  const { count, error } = await sb
    .from("maid_public_listings")
    .select("*", { count: "exact", head: true });
  if (error) return null;
  return count ?? 0;
}

export async function getPublicMaidListings(
  areaName?: string,
): Promise<PublicMaidListing[]> {
  const sb = getSupabaseServer();
  if (!sb) return [];
  let query = sb.from("maid_public_listings").select("*").order("area");
  if (areaName) query = query.eq("area", areaName);
  const { data, error } = await query;
  if (error || !data) return [];
  return data
    .map((row) => rowToListing(row))
    .filter((row): row is PublicMaidListing => row !== null);
}

export async function getPublicMaidsByAreaSlug(
  areaSlug: string,
): Promise<PublicMaidListing[]> {
  const area = getAreaBySlug(areaSlug);
  if (!area) return [];
  return getPublicMaidListings(area.name);
}
