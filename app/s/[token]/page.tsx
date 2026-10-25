import type { Metadata } from "next";
import Link from "next/link";
import MaidShareView from "@/app/components/share/MaidShareView";
import { resolveShareByToken } from "@/lib/maid-share";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Maid profile",
};

export default async function ShareProfilePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await resolveShareByToken(token);

  if ("error" in result) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">Link unavailable</h1>
        <p className="mt-2 text-muted-foreground">{result.error}</p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-primary">
          Go to SakhiHome
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MaidShareView profile={result} />
    </div>
  );
}
