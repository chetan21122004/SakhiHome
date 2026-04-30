/**
 * /app/sitemap.ts
 *
 * Generates XML sitemap for ALL programmatic SEO pages.
 * Next.js picks this up automatically at /sitemap.xml
 *
 * Pages covered:
 *  - /maid-service-in-[areaSlug]          (8 pages)
 *  - /[serviceSlug]-in-[areaSlug]         (48 pages)
 *  - /maid-service-in-[societySlug]       (57 pages)
 */

import type { MetadataRoute } from "next";
import { AREAS, getAllSocietySlugs } from "@/lib/areas";
import { getAllServiceSlugs } from "@/lib/services";
import { getAbsoluteSiteUrl } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // ── Static pages ───────────────────────────────────────────────────────────
  entries.push({
    url: getAbsoluteSiteUrl("/"),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1.0,
  });

  // ── Area pages ─────────────────────────────────────────────────────────────
  for (const area of AREAS) {
    entries.push({
      url: getAbsoluteSiteUrl(`/maid-service-in-${area.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: area.searchVolumeTier === "high" ? 0.9 : 0.8,
    });
  }

  // ── Service × Area pages ───────────────────────────────────────────────────
  const serviceSlugs = getAllServiceSlugs();
  for (const area of AREAS) {
    for (const serviceSlug of serviceSlugs) {
      entries.push({
        url: getAbsoluteSiteUrl(`/${serviceSlug}-in-${area.slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: area.searchVolumeTier === "high" ? 0.85 : 0.75,
      });
    }
  }

  // ── Society pages ──────────────────────────────────────────────────────────
  for (const societySlug of getAllSocietySlugs()) {
    entries.push({
      url: getAbsoluteSiteUrl(`/maid-service-in-${societySlug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
