"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import MaidShareView from "@/app/components/share/MaidShareView";
import type { MaidSharePayload } from "@/lib/maid-share";

export default function ClientMaidProfilePage() {
  const { grantId } = useParams<{ grantId: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<MaidSharePayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch(`/api/client/grants/${grantId}`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          router.replace("/client/login");
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Not found");
          return;
        }
        setProfile(data as MaidSharePayload);
      });
  }, [grantId, router]);

  if (error) {
    return (
      <div className="p-8 text-center">
        <p>{error}</p>
        <Link href="/client" className="mt-4 inline-block text-primary">
          Back to shortlist
        </Link>
      </div>
    );
  }

  if (!profile) {
    return <p className="p-8 text-center text-muted-foreground">Loading…</p>;
  }

  return (
    <div>
      <div className="mx-auto max-w-lg px-4 pt-4">
        <Link href="/client" className="text-sm font-medium text-primary">
          ← Back to shortlist
        </Link>
      </div>
      <MaidShareView profile={profile} />
    </div>
  );
}
