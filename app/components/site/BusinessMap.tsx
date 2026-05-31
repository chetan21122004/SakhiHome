"use client";

import {
  BUSINESS_ADDRESS_DISPLAY,
  GOOGLE_MAPS_DIRECTIONS_URL,
  GOOGLE_MAPS_EMBED_SRC,
} from "@/lib/contact";

type BusinessMapProps = {
  className?: string;
  title?: string;
};

/** Crawlable address + optional Google Maps embed for local SEO. */
export function BusinessMap({
  className,
  title = "SakhiHome service area in South Mumbai",
}: BusinessMapProps) {
  const hasEmbed = Boolean(GOOGLE_MAPS_EMBED_SRC?.trim());

  return (
    <div className={className}>
      <h3 className="sr-only">Service area</h3>
      <address className="not-italic">
        <p className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
          Serving
        </p>
        <a
          href={GOOGLE_MAPS_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-sm font-semibold leading-snug transition-smooth hover:text-accent"
        >
          {BUSINESS_ADDRESS_DISPLAY}
        </a>
      </address>
      {hasEmbed ? (
        <div className="mt-4 overflow-hidden rounded-xl md:rounded-2xl border border-white/10 shadow-sm ring-1 ring-black/5">
          <iframe
            src={GOOGLE_MAPS_EMBED_SRC}
            title={title}
            width="600"
            height="450"
            className="h-[200px] w-full sm:h-[240px] md:h-[280px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      ) : null}
    </div>
  );
}
