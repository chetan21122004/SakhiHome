import type { MetadataRoute } from "next";

import { getAbsoluteSiteUrl, services } from "@/lib/services";

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

  return [...staticPages, ...servicePages];
}
