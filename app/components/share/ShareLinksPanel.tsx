"use client";

import { useCallback, useEffect, useState } from "react";
import { Link2, Share2 } from "lucide-react";
import { toast } from "sonner";
import {
  createOrFetchShareLinks,
  type ShareLinkInfo,
} from "@/lib/share-links-client";

type Props = {
  maidId: string;
  maidName?: string;
  className?: string;
  variant?: "field" | "admin";
};

export default function ShareLinksPanel({
  maidId,
  maidName,
  className,
  variant = "field",
}: Props) {
  const btn = variant === "admin" ? "rg-btn small" : "field-btn";
  const btnPrimary =
    variant === "admin" ? "rg-btn small primary" : "field-btn primary";
  const [links, setLinks] = useState<ShareLinkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

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
    setBusy(true);
    try {
      const info = links ?? (await ensureLinks());
      await navigator.clipboard.writeText(info.teaserUrl);
      toast.success("Profile link copied");
    } catch (e) {
      toast.error(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function copyFull() {
    setBusy(true);
    try {
      const info = links ?? (await ensureLinks());
      await navigator.clipboard.writeText(info.fullUrl);
      toast.success("Full profile link copied");
    } catch (e) {
      toast.error(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function nativeShare() {
    setBusy(true);
    try {
      const info = links ?? (await ensureLinks());
      const title = maidName
        ? `${maidName} — SakhiHome profile`
        : "SakhiHome profile";
      if (navigator.share) {
        await navigator.share({
          title,
          text: "Preview this professional’s profile",
          url: info.teaserUrl,
        });
      } else {
        await navigator.clipboard.writeText(info.teaserUrl);
        toast.success("Link copied (sharing not supported on this device)");
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        toast.error(String((e as Error).message));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={className ?? (variant === "admin" ? "rg-profile-share" : "")}>
      <h3
        className={
          variant === "admin" ? "rg-section-label" : "field-section-title"
        }
      >
        Share profile
      </h3>
      {loading ? (
        <p className={variant === "admin" ? "rg-settings-copy" : "field-hint"}>
          Preparing share link…
        </p>
      ) : (
        <>
          <div
            className={
              variant === "admin" ? "rg-share-actions" : "field-actions"
            }
          >
            <button
              type="button"
              className={btnPrimary}
              disabled={busy}
              onClick={() => void copyTeaser()}
            >
              <Link2 size={15} aria-hidden />
              Copy link
            </button>
            <button
              type="button"
              className={btn}
              disabled={busy}
              onClick={() => void nativeShare()}
            >
              <Share2 size={15} aria-hidden />
              Share
            </button>
            <button
              type="button"
              className={btn}
              disabled={busy}
              onClick={() => void copyFull()}
            >
              Full link
            </button>
          </div>
          <p className={variant === "admin" ? "rg-settings-copy" : "field-hint"}>
            Basic link is safe for first client review. Full link shows contact
            details (still view-only).
          </p>
        </>
      )}
    </div>
  );
}
