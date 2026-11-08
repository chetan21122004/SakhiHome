"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Grant = {
  id: string;
  maidId: string;
  accessLevel: string;
  displayName: string;
  area: string;
  services: string[];
  experience: number;
  photoViewUrl?: string;
};

export default function ClientPortalPage() {
  const router = useRouter();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/api/client/grants", { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          router.replace("/client/login");
          return;
        }
        const data = await res.json();
        setGrants(data.grants ?? []);
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function logout() {
    await fetch("/api/client/logout", { method: "POST" });
    router.replace("/client/login");
  }

  if (loading) {
    return <p className="p-8 text-center text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">Your shortlist</h1>
        <button
          type="button"
          className="text-sm text-muted-foreground underline"
          onClick={() => void logout()}
        >
          Sign out
        </button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Profiles shared with you by SakhiHome. Tap to view details.
      </p>
      {grants.length === 0 ? (
        <p className="mt-10 text-center text-muted-foreground">
          No profiles yet. Our team will add candidates here soon.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {grants.map((g) => (
            <li key={g.id}>
              <Link
                href={`/client/maids/${g.id}`}
                className="flex gap-4 rounded-xl border p-4 transition hover:border-primary"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {g.photoViewUrl ? (
                    <Image
                      src={g.photoViewUrl}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>
                <div>
                  <p className="font-semibold">{g.displayName}</p>
                  <p className="text-sm text-muted-foreground">{g.area}</p>
                  <p className="text-xs text-muted-foreground">
                    {g.services.join(" · ")} · {g.experience} yrs
                  </p>
                  {g.accessLevel === "full" && (
                    <span className="mt-1 inline-block text-xs font-medium text-emerald-700">
                      Full profile
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
