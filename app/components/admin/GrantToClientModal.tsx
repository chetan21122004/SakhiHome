"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchClients, grantMaids } from "@/lib/clients-admin-api";
import { clientLoginUrl } from "@/lib/client-types";
import type { ClientListRow } from "@/lib/clients-admin-api";

type Props = {
  maidIds: string[];
  open: boolean;
  onClose: () => void;
  onDone: () => void;
};

export default function GrantToClientModal({
  maidIds,
  open,
  onClose,
  onDone,
}: Props) {
  const [clients, setClients] = useState<ClientListRow[]>([]);
  const [clientId, setClientId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    void fetchClients()
      .then(setClients)
      .catch((e) => toast.error(String((e as Error).message)));
  }, [open]);

  if (!open) return null;

  async function submit() {
    if (!clientId) {
      toast.error("Select a client");
      return;
    }
    setSaving(true);
    try {
      await grantMaids(clientId, maidIds, "teaser");
      const client = clients.find((c) => c.id === clientId);
      if (client) {
        await navigator.clipboard.writeText(clientLoginUrl(client.portalToken));
        toast.success(
          `Access granted for ${maidIds.length} profile(s). Login link copied.`,
        );
      } else {
        toast.success("Access granted");
      }
      onDone();
      onClose();
    } catch (e) {
      toast.error(String((e as Error).message));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      role="dialog"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(15,23,42,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className="rg-panel"
        style={{ maxWidth: "24rem", width: "100%", padding: "1.25rem" }}
      >
        <h3>Grant to client</h3>
        <p className="rg-settings-copy">
          {maidIds.length} maid profile(s) will get <strong>basic</strong> access.
          Client must sign in to view.
        </p>
        <label className="rg-field">
          <span>Client</span>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">Select…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone})
              </option>
            ))}
          </select>
        </label>
        <div className="rg-panel-footer">
          <button type="button" className="rg-btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            type="button"
            className="rg-btn primary"
            onClick={() => void submit()}
            disabled={saving}
          >
            {saving ? "Saving…" : "Grant basic access"}
          </button>
        </div>
      </div>
    </div>
  );
}
