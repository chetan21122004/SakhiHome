import type { MetadataRoute } from "next";

import { AREAS, getAllSocietySlugs } from "@/lib/areas";
import { getAbsoluteSiteUrl, getAllServiceSlugs, services } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getAbsoluteSiteUrl("/");
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: origin,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: getAbsoluteSiteUrl(`/services/${s.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const areaPages: MetadataRoute.Sitemap = AREAS.map((area) => ({
    url: getAbsoluteSiteUrl(`/maid-service-in-${area.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: area.searchVolumeTier === "high" ? 0.9 : 0.8,
  }));

  const serviceAreaPages: MetadataRoute.Sitemap = [];
  const serviceSlugs = getAllServiceSlugs();
  for (const area of AREAS) {
    for (const serviceSlug of serviceSlugs) {
      serviceAreaPages.push({
        url: getAbsoluteSiteUrl(`/${serviceSlug}-in-${area.slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: area.searchVolumeTier === "high" ? 0.85 : 0.75,
      });
    }
  }

  const societyPages: MetadataRoute.Sitemap = getAllSocietySlugs().map((slug) => ({
    url: getAbsoluteSiteUrl(`/maid-service-in-${slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...areaPages, ...serviceAreaPages, ...societyPages];
}
