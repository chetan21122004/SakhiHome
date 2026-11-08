"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createClient,
  fetchClientDetail,
  fetchClients,
  grantMaids,
  patchClient,
  patchClientGrants,
  regeneratePin,
  type ClientListRow,
} from "@/lib/clients-admin-api";
import { clientLoginUrl, type ClientRecord } from "@/lib/client-types";

type Props = {
  role: "Admin" | "Coordinator";
  initialClientId?: string | null;
};

export default function ClientsPanel({ role, initialClientId }: Props) {
  const [list, setList] = useState<ClientListRow[]>([]);
  const [filter, setFilter] = useState<"all" | "lead" | "active" | "closed" | "stale">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ClientRecord | null>(null);
  const [grants, setGrants] = useState<
    Awaited<ReturnType<typeof fetchClientDetail>>["grants"]
  >([]);
  const [loading, setLoading] = useState(true);
  const [lastPin, setLastPin] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setList(await fetchClients());
    } catch (e) {
      toast.error(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!initialClientId) return;
    void openClient(initialClientId);
  }, [initialClientId]);

  async function openClient(id: string) {
    try {
      const detail = await fetchClientDetail(id);
      setSelected(detail.client);
      setGrants(detail.grants.filter((g) => !g.revokedAt));
    } catch (e) {
      toast.error(String((e as Error).message));
    }
  }

  const visible = list.filter((c) => {
    const q = search.toLowerCase();
    if (q && !`${c.name} ${c.phone} ${c.area}`.toLowerCase().includes(q)) {
      return false;
    }
    if (filter === "stale") return c.isStaleLead;
    if (filter === "all") return true;
    return c.status === filter;
  });

  async function handleCreate() {
    const name = window.prompt("Client name?");
    if (!name?.trim()) return;
    const phone = window.prompt("Mobile number?");
    if (!phone?.trim()) return;
    try {
      const { client, pin } = await createClient({ name, phone });
      setLastPin(pin);
      toast.success("Client created — copy PIN and login link");
      await refresh();
      await openClient(client.id);
    } catch (e) {
      toast.error(String((e as Error).message));
    }
  }

  async function copyLoginLink(client: ClientRecord) {
    await navigator.clipboard.writeText(clientLoginUrl(client.portalToken));
    toast.success("Login link copied");
  }

  async function handleRegeneratePin() {
    if (!selected) return;
    try {
      const { pin } = await regeneratePin(selected.id);
      setLastPin(pin);
      toast.success("New PIN generated — share with client");
    } catch (e) {
      toast.error(String((e as Error).message));
    }
  }

  if (selected) {
    return (
      <div className="rg-clients-detail">
        <button type="button" className="rg-btn small" onClick={() => setSelected(null)}>
          ← All clients
        </button>
        <h2 className="rg-panel-title">{selected.name}</h2>
        <p className="rg-settings-copy">
          {selected.phone} · {selected.area} ·{" "}
          <span className="rg-badge">{selected.status}</span>
          {selected.seriousClient && (
            <span className="rg-badge green">Serious client</span>
          )}
        </p>
        <div className="rg-share-actions" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
          <button type="button" className="rg-btn small primary" onClick={() => void copyLoginLink(selected)}>
            Copy login link
          </button>
          <button type="button" className="rg-btn small" onClick={() => void handleRegeneratePin()}>
            Regenerate PIN
          </button>
          {lastPin && (
            <button
              type="button"
              className="rg-btn small"
              onClick={() => void navigator.clipboard.writeText(lastPin).then(() => toast.success("PIN copied"))}
            >
              Copy PIN ({lastPin})
            </button>
          )}
          <button
            type="button"
            className="rg-btn small"
            onClick={() =>
              void patchClient(selected.id, {
                status: selected.status === "active" ? "active" : "active",
                portalEnabled: true,
              }).then(() => openClient(selected.id))
            }
          >
            Activate portal
          </button>
          {role === "Admin" && (
            <button
              type="button"
              className="rg-btn small"
              onClick={() =>
                void patchClient(selected.id, { seriousClient: !selected.seriousClient }).then(
                  () => openClient(selected.id),
                )
              }
            >
              {selected.seriousClient ? "Unset serious" : "Mark serious (full details)"}
            </button>
          )}
        </div>
        <h3 className="rg-section-label" style={{ marginTop: "1.5rem" }}>Granted profiles</h3>
        <ul className="rg-doc-list">
          {grants.filter((g) => !g.revokedAt).map((g) => (
            <li key={g.id} className="rg-document">
              <div>
                <strong>{g.maidName}</strong>
                <small>{g.accessLevel} · {new Date(g.grantedAt).toLocaleDateString()}</small>
              </div>
              {role === "Admin" && g.accessLevel === "teaser" && (
                <button
                  type="button"
                  className="rg-btn small"
                  onClick={() =>
                    void patchClientGrants(selected.id, "upgrade", [g.id]).then(() =>
                      openClient(selected.id),
                    )
                  }
                >
                  Upgrade to full
                </button>
              )}
              <button
                type="button"
                className="rg-btn small"
                onClick={() =>
                  void patchClientGrants(selected.id, "revoke", [g.id]).then(() =>
                    openClient(selected.id),
                  )
                }
              >
                Revoke
              </button>
            </li>
          ))}
        </ul>
        <textarea
          className="rg-field"
          rows={3}
          placeholder="Staff notes"
          value={selected.notes}
          onChange={(e) => setSelected({ ...selected, notes: e.target.value })}
          onBlur={() => void patchClient(selected.id, { notes: selected.notes })}
          style={{ width: "100%", marginTop: "1rem" }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="rg-toolbar">
        <input
          placeholder="Search clients…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
          <option value="all">All</option>
          <option value="lead">Lead</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="stale">Stale (7d+)</option>
        </select>
        <button type="button" className="rg-btn small primary" onClick={() => void handleCreate()}>
          Add client
        </button>
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="rg-list">
          {visible.map((c) => (
            <button
              type="button"
              key={c.id}
              className="rg-household"
              onClick={() => void openClient(c.id)}
            >
              <strong>{c.name}</strong>
              <small>{c.phone} · {c.area}</small>
              <div className="rg-tags">
                <span className="rg-badge">{c.status}</span>
                {c.isStaleLead && <span className="rg-badge amber">Stale lead</span>}
                <span className="rg-badge">{c.activeGrantCount} profiles</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
