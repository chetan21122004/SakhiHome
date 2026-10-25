"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createOrFetchShareLinks,
  type ShareLinkInfo,
} from "@/lib/share-links-client";

type Props = {
  maidId: string;
  className?: string;
  variant?: "field" | "admin";
};

export default function ShareLinksPanel({
  maidId,
  className,
  variant = "field",
}: Props) {
  const btn = variant === "admin" ? "rg-btn small" : "field-btn";
  const btnPrimary =
    variant === "admin" ? "rg-btn small primary" : "field-btn primary";
  const [links, setLinks] = useState<ShareLinkInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const info = await createOrFetchShareLinks(maidId, false);
      setLinks(info);
    } catch {
      setLinks(null);
    } finally {
      setLoading(false);
    }
  }, [maidId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function ensureLinks(): Promise<ShareLinkInfo> {
    const info = await createOrFetchShareLinks(maidId, false);
    setLinks(info);
    return info;
  }

  async function copyTeaser() {
    try {
      const info = links ?? await ensureLinks();
      await navigator.clipboard.writeText(info.teaserUrl);
      toast.success("Basic link copied");
    } catch (e) {
      toast.error(String((e as Error).message));
    }
  }

  async function copyFull() {
    try {
      const info = links ?? await ensureLinks();
      await navigator.clipboard.writeText(info.fullUrl);
      toast.success("Full link copied — share only with committed clients");
    } catch (e) {
      toast.error(String((e as Error).message));
    }
  }

  async function regenerate() {
    if (
      !window.confirm(
        "Regenerate links? Old URLs will stop working immediately.",
      )
    ) {
      return;
    }
    try {
      const info = await createOrFetchShareLinks(maidId, true);
      setLinks(info);
      toast.success("New share links created");
    } catch (e) {
      toast.error(String((e as Error).message));
    }
  }

  return (
    <div className={className}>
      <h3 className={variant === "admin" ? "rg-section-label" : "field-section-title"}>
        Share with client
      </h3>
      <p
        className={variant === "admin" ? "rg-settings-copy" : "field-hint"}
        style={{ marginBottom: "0.75rem" }}
      >
        Basic link hides phone and address. Full link unlocks all details (no
        document downloads).
      </p>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading links…</p>
      ) : (
        <>
          {links?.expiresAt && (
            <p className="text-xs text-muted-foreground">
              Expires {new Date(links.expiresAt).toLocaleDateString()}
            </p>
          )}
          <div
            className={variant === "admin" ? "rg-share-actions" : "field-actions"}
            style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
          >
            <button
              type="button"
              className={btnPrimary}
              onClick={() => void copyTeaser()}
            >
              Copy basic link
            </button>
            <button
              type="button"
              className={btn}
              onClick={() => void copyFull()}
            >
              Copy full link
            </button>
          </div>
          <button
            type="button"
            className={btn}
            style={{ marginTop: "0.5rem", width: variant === "field" ? "100%" : undefined }}
            onClick={() => void regenerate()}
          >
            Regenerate links
          </button>
        </>
      )}
    </div>
  );
}
