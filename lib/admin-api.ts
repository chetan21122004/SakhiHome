"use client";

import type { Json } from "./database.types";
import type { Enquiry } from "./enquiries";
import type { Registry } from "./registry";

export type AdminSessionInfo = { email: string; role: "Admin" | "Coordinator" };

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Request failed",
    );
  }
  return data as T;
}

export async function fetchAdminSession(): Promise<AdminSessionInfo | null> {
  const response = await fetch("/api/admin/session", { credentials: "include" });
  if (response.status === 401) return null;
  return parseJson(response);
}

export async function adminLogin(email: string, password: string) {
  await parseJson(
    await fetch("/api/admin/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }),
  );
}

export async function adminLogout() {
  await fetch("/api/admin/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchRegistry(): Promise<Registry> {
  return parseJson(await fetch("/api/admin/registry", { credentials: "include" }));
}

export async function saveRegistryChanges(
  changes: { table: string; before: unknown; after: unknown }[],
  messages: string[],
) {
  await parseJson(
    await fetch("/api/admin/registry", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ changes, messages }),
    }),
  );
}

export async function uploadAdminFile(
  workerId: string,
  file: File,
  photo: boolean,
) {
  const form = new FormData();
  form.append("workerId", workerId);
  form.append("photo", photo ? "1" : "0");
  form.append("file", file);
  return parseJson<{ path: string; bucket: string; signedUrl?: string }>(
    await fetch("/api/admin/upload", {
      method: "POST",
      credentials: "include",
      body: form,
    }),
  );
}

export async function removeAdminFiles(
  files: { bucket: string; path: string }[],
) {
  if (!files.length) return;
  await parseJson(
    await fetch("/api/admin/upload", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files }),
    }),
  );
}

export async function downloadAdminFile(path: string) {
  const response = await fetch(
    `/api/admin/file?path=${encodeURIComponent(path)}`,
    { credentials: "include" },
  );
  if (!response.ok) throw new Error("Could not download file");
  return response.blob();
}

export async function fetchAdminEnquiries(): Promise<Enquiry[]> {
  return parseJson(
    await fetch("/api/admin/enquiries", { credentials: "include" }),
  );
}

export async function patchAdminEnquiry(
  id: string,
  payload: Record<string, unknown>,
) {
  await parseJson(
    await fetch("/api/admin/enquiries", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, payload }),
    }),
  );
}

export async function fetchStaffAccess() {
  return parseJson<
    { email: string; role: string; enabled: boolean }[]
  >(await fetch("/api/admin/staff", { credentials: "include" }));
}

export async function addStaffAccess(email: string, role: string) {
  await parseJson(
    await fetch("/api/admin/staff", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    }),
  );
}

export async function toggleStaffAccess(email: string, enabled: boolean) {
  await parseJson(
    await fetch("/api/admin/staff", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, enabled }),
    }),
  );
}

export type { Json };
