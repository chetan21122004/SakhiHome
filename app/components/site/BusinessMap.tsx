"use client";

import type { BranchId } from "@/lib/contact";
import { DEFAULT_BRANCH_ID, getAllBranches, getBranch } from "@/lib/contact";

type BusinessMapProps = {
  className?: string;
  title?: string;
  branchId?: BranchId;
};

/** Crawlable address + Google Maps embed for local SEO. */
export function BusinessMap({
  className,
  title,
  branchId = DEFAULT_BRANCH_ID,
}: BusinessMapProps) {
  const branch = getBranch(branchId);
  const iframeTitle = title ?? `${branch.shortLabel} office location on Google Maps`;

  return (
    <div className={className}>
      <h3 className="sr-only">{branch.shortLabel} office location</h3>
      <address className="not-italic">
        <p className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
          {branch.shortLabel}
        </p>
        <a
          href={branch.mapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-sm font-semibold leading-snug transition-smooth hover:text-accent"
        >
          {branch.addressDisplay}
        </a>
      </address>
      <div className="mt-4 overflow-hidden rounded-xl md:rounded-2xl border border-white/10 shadow-sm ring-1 ring-black/5">
        <iframe
          src={branch.mapsEmbedSrc}
          title={iframeTitle}
          width="600"
          height="450"
          className="h-[200px] w-full sm:h-[240px] md:h-[280px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export function BranchMaps({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid gap-6 md:grid-cols-2">
        {getAllBranches().map((branch) => (
          <BusinessMap key={branch.id} branchId={branch.id} />
        ))}
      </div>
    </div>
  );
}
