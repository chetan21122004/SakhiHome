import type { ClientRecord } from "./client-types";

async function parse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data?.error === "string" ? data.error : "Request failed");
  }
  return data as T;
}

export type ClientListRow = ClientRecord & {
  isStaleLead: boolean;
  activeGrantCount: number;
};

export async function fetchClients() {
  const data = await parse<{ clients: ClientListRow[] }>(
    await fetch("/api/admin/clients", { credentials: "include" }),
  );
  return data.clients;
}

export async function fetchClientDetail(id: string) {
  return parse<{
    client: ClientRecord;
    grants: {
      id: string;
      maidId: string;
      maidName: string;
      accessLevel: string;
      grantedAt: string;
      grantedBy: string | null;
      revokedAt: string | null;
    }[];
  }>(await fetch(`/api/admin/clients/${id}`, { credentials: "include" }));
}

export async function createClient(input: {
  name: string;
  phone: string;
  area?: string;
  service?: string;
  message?: string;
  notes?: string;
}) {
  return parse<{ client: ClientRecord; pin: string }>(
    await fetch("/api/admin/clients", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  );
}

export async function patchClient(id: string, body: Record<string, unknown>) {
  return parse<{ client: ClientRecord }>(
    await fetch(`/api/admin/clients/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function regeneratePin(id: string) {
  return parse<{ pin: string }>(
    await fetch(`/api/admin/clients/${id}/pin`, {
      method: "POST",
      credentials: "include",
    }),
  );
}

export async function grantMaids(clientId: string, maidIds: string[], level: "teaser" | "full" = "teaser") {
  await parse(
    await fetch(`/api/admin/clients/${clientId}/grants`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maidIds, level }),
    }),
  );
}

export async function patchClientGrants(
  clientId: string,
  action: "upgrade" | "revoke",
  grantIds: string[],
) {
  await parse(
    await fetch(`/api/admin/clients/${clientId}/grants`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, grantIds }),
    }),
  );
}
