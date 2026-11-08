import type { Enquiry } from "./enquiries";
import type { Database } from "./database.types";

type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];
import {
  buildMaidSharePayload,
  maskDisplayName,
  type MaidSharePayload,
  type ShareTier,
  workerFromPayload,
} from "./maid-share";
import {
  clientInsertFromEnquiry,
  isStaleLead,
  manualClientRow,
  rowToClient,
  type ClientRecord,
} from "./clients";
import { getServiceSupabase } from "./supabase-service";
import { formatWorkerAreas, workerAreas } from "./registry-data";
import {
  generateClientPin,
  hashClientPin,
  normalizePhone,
  verifyClientPin,
} from "./client-pin";

export type GrantSummary = {
  id: string;
  maidId: string;
  accessLevel: "teaser" | "full";
  displayName: string;
  area: string;
  services: string[];
  experience: number;
  photoViewUrl?: string;
};

export async function upsertClientFromEnquiry(enquiry: Enquiry) {
  const sb = getServiceSupabase();
  const phoneNorm = normalizePhone(enquiry.phone);
  const { data: existing } = await sb
    .from("clients")
    .select("id")
    .eq("phone_normalized", phoneNorm)
    .maybeSingle();

  if (existing) {
    const { error } = await sb
      .from("clients")
      .update({
        name: enquiry.name,
        phone: enquiry.phone,
        area: enquiry.area,
        service: enquiry.service,
        message: enquiry.message ?? "",
        enquiry_id: enquiry.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
    return { clientId: existing.id, created: false };
  }

  const { id, row } = clientInsertFromEnquiry(enquiry);
  const { error } = await sb.from("clients").insert(row as ClientInsert);
  if (error) throw new Error(error.message);
  return { clientId: id, created: true };
}

export async function listClients(): Promise<
  (ClientRecord & { isStaleLead: boolean; activeGrantCount: number })[]
> {
  const sb = getServiceSupabase();
  const { data: clients, error } = await sb
    .from("clients")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);

  const { data: grants } = await sb
    .from("client_profile_grants")
    .select("client_id")
    .is("revoked_at", null);

  const counts = new Map<string, number>();
  for (const g of grants ?? []) {
    counts.set(g.client_id, (counts.get(g.client_id) ?? 0) + 1);
  }

  return (clients ?? []).map((row) => {
    const c = rowToClient(row);
    return {
      ...c,
      isStaleLead: isStaleLead(c),
      activeGrantCount: counts.get(c.id) ?? 0,
    };
  });
}

export async function getClientById(id: string): Promise<ClientRecord | null> {
  const sb = getServiceSupabase();
  const { data } = await sb.from("clients").select("*").eq("id", id).maybeSingle();
  return data ? rowToClient(data) : null;
}

export async function createManualClient(input: {
  name: string;
  phone: string;
  area?: string;
  service?: string;
  message?: string;
  notes?: string;
}) {
  const sb = getServiceSupabase();
  const phoneNorm = normalizePhone(input.phone);
  const { data: existing } = await sb
    .from("clients")
    .select("id")
    .eq("phone_normalized", phoneNorm)
    .maybeSingle();
  if (existing) {
    throw new Error("A client with this phone number already exists.");
  }
  const { id, row, pin } = manualClientRow(input);
  const { error } = await sb.from("clients").insert(row as ClientInsert);
  if (error) throw new Error(error.message);
  const client = await getClientById(id);
  if (!client) throw new Error("Client create failed");
  return { client, pin };
}

export async function updateClient(
  id: string,
  patch: Partial<{
    name: string;
    phone: string;
    area: string;
    service: string;
    message: string;
    status: ClientRecord["status"];
    portalEnabled: boolean;
    seriousClient: boolean;
    notes: string;
  }>,
  actorEmail: string,
) {
  const sb = getServiceSupabase();
  const row: ClientUpdate = {
    updated_at: new Date().toISOString(),
    staff_last_touched_at: new Date().toISOString(),
  };
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.phone !== undefined) {
    row.phone = patch.phone;
    row.phone_normalized = normalizePhone(patch.phone);
  }
  if (patch.area !== undefined) row.area = patch.area;
  if (patch.service !== undefined) row.service = patch.service;
  if (patch.message !== undefined) row.message = patch.message;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.portalEnabled !== undefined) row.portal_enabled = patch.portalEnabled;
  if (patch.seriousClient !== undefined) row.serious_client = patch.seriousClient;
  if (patch.notes !== undefined) row.notes = patch.notes;

  const { error } = await sb.from("clients").update(row).eq("id", id);
  if (error) throw new Error(error.message);
  void actorEmail;
}

export async function regenerateClientPin(id: string) {
  const sb = getServiceSupabase();
  const pin = generateClientPin();
  const { error } = await sb
    .from("clients")
    .update({
      access_pin_hash: hashClientPin(pin),
      pin_rotated_at: new Date().toISOString(),
      staff_last_touched_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  return pin;
}

export async function loginClient(
  phone: string,
  pin: string,
  portalToken?: string,
): Promise<{ clientId: string } | { error: string }> {
  const sb = getServiceSupabase();
  const phoneNorm = normalizePhone(phone);
  const { data: client } = await sb
    .from("clients")
    .select("*")
    .eq("phone_normalized", phoneNorm)
    .maybeSingle();
  if (!client) return { error: "Invalid phone or PIN" };
  if (!client.portal_enabled) {
    return { error: "Your portal is not active yet. Please contact SakhiHome." };
  }
  if (client.status === "closed") {
    return { error: "This account is closed. Please contact SakhiHome." };
  }
  if (portalToken && client.portal_token !== portalToken) {
    return { error: "Invalid login link for this phone number." };
  }
  if (!verifyClientPin(pin, client.access_pin_hash)) {
    return { error: "Invalid phone or PIN" };
  }
  return { clientId: client.id };
}

export async function grantMaidsToClient(
  clientId: string,
  maidIds: string[],
  level: "teaser" | "full",
  grantedBy: string,
) {
  const sb = getServiceSupabase();
  const now = new Date().toISOString();
  await sb
    .from("clients")
    .update({
      portal_enabled: true,
      status: "active",
      staff_last_touched_at: now,
      updated_at: now,
    })
    .eq("id", clientId);

  for (const maidId of maidIds) {
    const { data: active } = await sb
      .from("client_profile_grants")
      .select("id")
      .eq("client_id", clientId)
      .eq("maid_id", maidId)
      .is("revoked_at", null)
      .maybeSingle();

    if (active) {
      await sb
        .from("client_profile_grants")
        .update({ access_level: level, granted_by: grantedBy, granted_at: now })
        .eq("id", active.id);
    } else {
      const { error } = await sb.from("client_profile_grants").insert({
        client_id: clientId,
        maid_id: maidId,
        access_level: level,
        granted_by: grantedBy,
      });
      if (error) throw new Error(error.message);
    }
  }
}

export async function patchGrants(
  clientId: string,
  action: "upgrade" | "revoke",
  grantIds: string[],
) {
  const sb = getServiceSupabase();
  const now = new Date().toISOString();
  if (action === "revoke") {
    const { error } = await sb
      .from("client_profile_grants")
      .update({ revoked_at: now })
      .eq("client_id", clientId)
      .in("id", grantIds)
      .is("revoked_at", null);
    if (error) throw new Error(error.message);
    return;
  }
  const { error } = await sb
    .from("client_profile_grants")
    .update({ access_level: "full" })
    .eq("client_id", clientId)
    .in("id", grantIds)
    .is("revoked_at", null);
  if (error) throw new Error(error.message);
}

export async function listClientGrants(clientId: string) {
  const sb = getServiceSupabase();
  const { data: client } = await sb
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .maybeSingle();
  if (!client) return [];

  const { data: grants } = await sb
    .from("client_profile_grants")
    .select("*")
    .eq("client_id", clientId)
    .is("revoked_at", null)
    .order("granted_at", { ascending: false });

  const out: GrantSummary[] = [];
  for (const g of grants ?? []) {
    const { data: maid } = await sb
      .from("maids")
      .select("payload")
      .eq("id", g.maid_id)
      .maybeSingle();
    const worker = workerFromPayload(maid?.payload);
    if (!worker) continue;
    const tier: ShareTier =
      g.access_level === "full" || client.serious_client ? "full" : "teaser";
    const preview = await buildMaidSharePayload(worker, "teaser");
    out.push({
      id: g.id,
      maidId: g.maid_id,
      accessLevel: tier,
      displayName: maskDisplayName(worker.name),
      area: formatWorkerAreas(workerAreas(worker)),
      services: worker.services ?? [],
      experience: worker.experience ?? 0,
      photoViewUrl: preview.photoViewUrl,
    });
  }
  return out;
}

export async function getGrantProfileForClient(
  clientId: string,
  grantId: string,
): Promise<MaidSharePayload | null> {
  const sb = getServiceSupabase();
  const { data: client } = await sb
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .maybeSingle();
  if (!client || !client.portal_enabled || client.status === "closed") {
    return null;
  }

  const { data: grant } = await sb
    .from("client_profile_grants")
    .select("*")
    .eq("id", grantId)
    .eq("client_id", clientId)
    .is("revoked_at", null)
    .maybeSingle();
  if (!grant) return null;

  const { data: maid } = await sb
    .from("maids")
    .select("payload")
    .eq("id", grant.maid_id)
    .maybeSingle();
  const worker = workerFromPayload(maid?.payload);
  if (!worker) return null;

  const tier: ShareTier =
    grant.access_level === "full" || client.serious_client ? "full" : "teaser";
  return buildMaidSharePayload(worker, tier);
}

export type StaffGrantRow = {
  id: string;
  maidId: string;
  maidName: string;
  accessLevel: string;
  grantedAt: string;
  grantedBy: string | null;
  revokedAt: string | null;
};

export async function listGrantsForClientAdmin(clientId: string) {
  const sb = getServiceSupabase();
  const { data: grants } = await sb
    .from("client_profile_grants")
    .select("*")
    .eq("client_id", clientId)
    .order("granted_at", { ascending: false });

  const rows: StaffGrantRow[] = [];
  for (const g of grants ?? []) {
    const { data: maid } = await sb
      .from("maids")
      .select("payload")
      .eq("id", g.maid_id)
      .maybeSingle();
    const worker = workerFromPayload(maid?.payload);
    rows.push({
      id: g.id,
      maidId: g.maid_id,
      maidName: worker?.name ?? g.maid_id,
      accessLevel: g.access_level,
      grantedAt: g.granted_at,
      grantedBy: g.granted_by,
      revokedAt: g.revoked_at,
    });
  }
  return rows;
}
