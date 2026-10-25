import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ShieldCheck, Sparkles } from "lucide-react";

import Footer from "@/app/components/site/Footer";
import Navbar from "@/app/components/site/Navbar";
import StickyWhatsApp from "@/app/components/site/StickyWhatsApp";
import { AREAS } from "@/lib/areas";
import { getPublicMaidListings } from "@/lib/public-maids";
import { getAbsoluteSiteUrl } from "@/lib/services";

export const metadata: Metadata = {
  title: "Available verified maids",
  description:
    "Browse SakhiHome professionals currently available for placement in Hinjewadi, Wakad, Baner and nearby Pune areas.",
  alternates: { canonical: getAbsoluteSiteUrl("/maids") },
  robots: { index: true, follow: true },
};

export default async function MaidsPage() {
  const listings = await getPublicMaidListings();
  const byArea = new Map<string, typeof listings>();
  for (const maid of listings) {
    const group = byArea.get(maid.area) ?? [];
    group.push(maid);
    byArea.set(maid.area, group);
  }
  const areaOrder = AREAS.map((a) => a.name).filter((name) => byArea.has(name));
  for (const name of byArea.keys()) {
    if (!areaOrder.includes(name)) areaOrder.push(name);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Live availability
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
          Verified maids ready to work
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Profiles shown here are verification-complete and available for new
          placements. Contact SakhiHome to match — we never publish private
          contact details on the website.
        </p>

        {listings.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed p-10 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-4 font-medium">No public listings right now</p>
            <p className="mt-2 text-sm text-muted-foreground">
              New verified professionals are added regularly. Call or WhatsApp us
              for immediate matching.
            </p>
            <Link
              href="/#enquiry"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Send an enquiry <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-12 space-y-12">
            {areaOrder.map((areaName) => {
              const group = byArea.get(areaName) ?? [];
              if (!group.length) return null;
              return (
                <section key={areaName}>
                  <h2 className="flex items-center gap-2 font-display text-xl font-bold">
                    <MapPin className="h-5 w-5 text-primary" />
                    {areaName}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({group.length})
                    </span>
                  </h2>
                  <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                    {group.map((maid) => (
                      <li
                        key={maid.id}
                        className="rounded-2xl border bg-card p-5 shadow-sm"
                      >
                        <p className="font-semibold">{maid.displayName}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {maid.experience}+ yrs · {maid.languages}
                        </p>
                        <p className="mt-3 text-sm">
                          {maid.services.join(" · ")}
                        </p>
                        {maid.schedule ? (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Schedule: {maid.schedule}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
      <StickyWhatsApp />
    </div>
  );
}
