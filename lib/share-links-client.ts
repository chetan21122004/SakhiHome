export type ShareLinkInfo = {
  maidId: string;
  teaserUrl: string;
  fullUrl: string;
  expiresAt: string | null;
  createdAt: string;
};

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Request failed",
    );
  }
  return data as T;
}

export async function fetchShareLinks(
  maidId: string,
): Promise<ShareLinkInfo | null> {
  const data = await parseJson<{ links: ShareLinkInfo | null }>(
    await fetch(`/api/admin/share-links?maidId=${encodeURIComponent(maidId)}`, {
      credentials: "include",
    }),
  );
  return data.links;
}

export async function createOrFetchShareLinks(
  maidId: string,
  rotate: boolean,
): Promise<ShareLinkInfo> {
  if (!rotate) {
    const existing = await fetchShareLinks(maidId);
    if (existing) return existing;
  }
  const data = await parseJson<{ links: ShareLinkInfo }>(
    await fetch("/api/admin/share-links", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maidId, rotate }),
    }),
  );
  return data.links;
}
