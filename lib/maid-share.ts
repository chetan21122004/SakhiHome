import { randomBytes } from "node:crypto";
import type { Worker } from "./registry";
import { isVerificationDocName } from "./document-categories";
import { getServiceSupabase } from "./supabase-service";
import { getAbsoluteSiteUrl } from "./services";

export type ShareTier = "teaser" | "full";

export type SharedDocument = {
  category: string;
  note?: string;
  fileName: string;
  mimeKind: "image" | "pdf" | "other";
  viewUrl?: string;
};

export type MaidSharePayload = {
  tier: ShareTier;
  displayName: string;
  area: string;
  services: string[];
  experience: number;
  languages: string;
  schedule: string;
  status: string;
  photoViewUrl?: string;
  name?: string;
  phone?: string;
  address?: string;
  maritalStatus?: string;
  guardian?: string;
  dependants?: string;
  emergency?: string;
  salary?: string;
  documents?: SharedDocument[];
};

const SIGNED_URL_TTL = 600;

export function generateShareToken(): string {
  return randomBytes(32).toString("base64url");
}

export function maskDisplayName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Professional";
  if (parts.length === 1) return parts[0];
  const last = parts[parts.length - 1];
  return `${parts[0]} ${last[0]}.`;
}

function mimeKindFromFileName(fileName: string): SharedDocument["mimeKind"] {
  const lower = fileName.toLowerCase();
  if (/\.(jpe?g|png|webp|gif)$/.test(lower)) return "image";
  if (lower.endsWith(".pdf")) return "pdf";
  return "other";
}

async function signedPhotoUrl(
  sb: ReturnType<typeof getServiceSupabase>,
  photoPath?: string,
): Promise<string | undefined> {
  if (!photoPath) return undefined;
  const signed = await sb.storage
    .from("maid-photos")
    .createSignedUrl(photoPath, SIGNED_URL_TTL, {
      download: false,
    });
  if (signed.error) return undefined;
  return signed.data.signedUrl;
}

async function signedDocImageUrl(
  sb: ReturnType<typeof getServiceSupabase>,
  path: string,
  fileName: string,
): Promise<string | undefined> {
  if (mimeKindFromFileName(fileName) !== "image") return undefined;
  const signed = await sb.storage
    .from("maid-documents")
    .createSignedUrl(path, SIGNED_URL_TTL, { download: false });
  if (signed.error) return undefined;
  return signed.data.signedUrl;
}

function workerFromPayload(payload: unknown): Worker | null {
  if (!payload || typeof payload !== "object") return null;
  return payload as Worker;
}

export async function resolveShareByToken(
  token: string,
): Promise<MaidSharePayload | { error: string; status: number }> {
  if (!token || token.length < 32) {
    return { error: "Invalid link", status: 404 };
  }
  const sb = getServiceSupabase();
  const now = new Date().toISOString();

  let link = (
    await sb
      .from("maid_share_links")
      .select("*")
      .eq("teaser_token", token)
      .maybeSingle()
  ).data;
  if (!link) {
    link = (
      await sb
        .from("maid_share_links")
        .select("*")
        .eq("full_token", token)
        .maybeSingle()
    ).data;
  }
  if (!link) {
    return { error: "Profile not found", status: 404 };
  }
  if (link.revoked_at) {
    return { error: "This link has been revoked", status: 410 };
  }
  if (link.expires_at && link.expires_at < now) {
    return { error: "This link has expired", status: 410 };
  }

  const tier: ShareTier =
    link.full_token === token ? "full" : "teaser";

  const { data: row, error: maidError } = await sb
    .from("maids")
    .select("payload")
    .eq("id", link.maid_id)
    .maybeSingle();

  if (maidError || !row) {
    return { error: "Profile not found", status: 404 };
  }

  const worker = workerFromPayload(row.payload);
  if (!worker) {
    return { error: "Profile not found", status: 404 };
  }

  const photoViewUrl = await signedPhotoUrl(sb, worker.photoPath);

  const base: MaidSharePayload = {
    tier,
    displayName: maskDisplayName(worker.name),
    area: worker.area,
    services: worker.services ?? [],
    experience: worker.experience ?? 0,
    languages: worker.languages ?? "",
    schedule: worker.schedule ?? "",
    status: worker.status,
    photoViewUrl,
  };

  if (tier === "teaser") {
    return base;
  }

  const documents: SharedDocument[] = [];
  for (const doc of worker.documents ?? []) {
    if (!doc.path) continue;
    const mimeKind = mimeKindFromFileName(doc.file);
    let viewUrl: string | undefined;
    if (mimeKind === "image") {
      viewUrl = await signedDocImageUrl(sb, doc.path, doc.file);
    }
    documents.push({
      category: doc.name,
      note: doc.note,
      fileName: doc.file,
      mimeKind,
      viewUrl,
    });
  }

  return {
    ...base,
    displayName: worker.name,
    name: worker.name,
    phone: worker.phone,
    address: worker.address,
    maritalStatus: worker.maritalStatus,
    guardian: worker.guardian,
    dependants: worker.dependants,
    emergency: worker.emergency,
    salary: worker.salary,
    documents,
  };
}

export type ShareLinkInfo = {
  maidId: string;
  teaserUrl: string;
  fullUrl: string;
  expiresAt: string | null;
  createdAt: string;
};

export async function ensureShareLinks(
  maidId: string,
  createdBy: string,
  options?: { rotate?: boolean; expiresInDays?: number },
): Promise<ShareLinkInfo> {
  const sb = getServiceSupabase();
  const expiresInDays = options?.expiresInDays ?? 30;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const { data: existing } = await sb
    .from("maid_share_links")
    .select("*")
    .eq("maid_id", maidId)
    .maybeSingle();

  if (existing && !options?.rotate) {
    return linkRowToInfo(existing);
  }

  const teaser_token = generateShareToken();
  const full_token = generateShareToken();
  const row = {
    maid_id: maidId,
    teaser_token,
    full_token,
    created_by: createdBy,
    created_at: new Date().toISOString(),
    expires_at: expiresAt.toISOString(),
    revoked_at: null as string | null,
  };

  const { data, error } = await sb
    .from("maid_share_links")
    .upsert(row, { onConflict: "maid_id" })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not create share links");
  }
  return linkRowToInfo(data);
}

function linkRowToInfo(row: {
  maid_id: string;
  teaser_token: string;
  full_token: string;
  expires_at: string | null;
  created_at: string;
}): ShareLinkInfo {
  return {
    maidId: row.maid_id,
    teaserUrl: getAbsoluteSiteUrl(`/s/${row.teaser_token}`),
    fullUrl: getAbsoluteSiteUrl(`/s/${row.full_token}`),
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

export async function getShareLinksForMaid(
  maidId: string,
): Promise<ShareLinkInfo | null> {
  const sb = getServiceSupabase();
  const { data } = await sb
    .from("maid_share_links")
    .select("*")
    .eq("maid_id", maidId)
    .maybeSingle();
  if (!data || data.revoked_at) return null;
  return linkRowToInfo(data);
}

export function galleryDocuments(worker: Worker) {
  return (worker.documents ?? []).filter((d) => !isVerificationDocName(d.name));
}
