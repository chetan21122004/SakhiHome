/**
 * Canonical area + society catalog (single source of truth).
 * Drives programmatic SEO pages:
 *   /maid-service-in-[areaSlug]
 *   /[serviceSlug]-in-[areaSlug]
 *   /maid-service-in-[societySlug]
 */

export type Society = {
  name: string;
  slug: string;
  areaId: string;
};

export type AreaRecord = {
  id: string;
  name: string;
  slug: string;
  shortName: string;
  description: string;
  landmark: string;
  pincode: string;
  nearbyMicroLocalities: string[];
  seoTitle: string;
  metaDescription: string;
  searchVolumeTier: "high" | "medium" | "low";
  societies: Omit<Society, "areaId">[];
};

export const AREAS: readonly AreaRecord[] = [
  {
    id: "mohammad-ali",
    name: "Mohammad Ali Road",
    slug: "mohammad-ali",
    shortName: "Mohammad Ali",
    description:
      "Historic South Mumbai corridor with dense residential and commercial pockets — families here need reliable daily help close to home.",
    landmark: "Mohammad Ali Road",
    pincode: "400003",
    nearbyMicroLocalities: ["Crawford Market", "Mandvi", "Bhuleshwar", "Dongri"],
    seoTitle: "Maid Service in Mohammad Ali Road, South Mumbai | SakhiHome",
    metaDescription:
      "Looking for a maid near Mohammad Ali Road, South Mumbai? SakhiHome connects you with background-verified maids for cleaning, cooking, babysitting & more. Match within hours.",
    searchVolumeTier: "high",
    societies: [
      { name: "Haji Ali Residences", slug: "haji-ali-residences-mohammad-ali" },
      { name: "Mandvi Tower", slug: "mandvi-tower-mohammad-ali" },
      { name: "Bhuleshwar Heights", slug: "bhuleshwar-heights-mohammad-ali" },
    ],
  },
  {
    id: "nagdevi",
    name: "Nagdevi",
    slug: "nagdevi",
    shortName: "Nagdevi",
    description:
      "Central South Mumbai locality near Crawford and Masjid Bunder — strong demand for part-time and full-time domestic help.",
    landmark: "Nagdevi Street",
    pincode: "400003",
    nearbyMicroLocalities: ["Crawford Market", "Masjid Bunder", "Dongri", "Pydhonie"],
    seoTitle: "Maid Service in Nagdevi, South Mumbai | Verified Maids - SakhiHome",
    metaDescription:
      "Find verified maids in Nagdevi, South Mumbai. SakhiHome matches local, background-checked domestic help for cleaning, cooking & childcare within hours.",
    searchVolumeTier: "high",
    societies: [
      { name: "Nagdevi Lane Societies", slug: "nagdevi-lane-societies" },
      { name: "Pydhonie Residency", slug: "pydhonie-residency-nagdevi" },
      { name: "Dongri Court", slug: "dongri-court-nagdevi" },
    ],
  },
  {
    id: "chakala",
    name: "Chakala",
    slug: "chakala",
    shortName: "Chakala",
    description:
      "Andheri East gateway with quick access to South Mumbai via Western Express Highway — popular with working families needing flexible maid timings.",
    landmark: "Chakala Junction",
    pincode: "400099",
    nearbyMicroLocalities: ["Andheri East", "MIDC", "Saki Naka", "Airport Road"],
    seoTitle: "Maid Service in Chakala, Mumbai | Trusted Domestic Help - SakhiHome",
    metaDescription:
      "Hire trusted maids near Chakala, Mumbai. SakhiHome provides background-verified help for cleaning, cooking, babysitting & elder care. Fast local matching.",
    searchVolumeTier: "medium",
    societies: [
      { name: "Chakala Metro Residency", slug: "chakala-metro-residency" },
      { name: "MIDC Staff Quarters", slug: "midc-staff-quarters-chakala" },
      { name: "Saki Naka Heights", slug: "saki-naka-heights-chakala" },
    ],
  },
  {
    id: "mazgaon",
    name: "Mazgaon",
    slug: "mazgaon",
    shortName: "Mazgaon",
    description:
      "Established South Mumbai neighbourhood with heritage housing and newer towers — ideal for long-term maid placements.",
    landmark: "Mazgaon Dock Road",
    pincode: "400010",
    nearbyMicroLocalities: ["Byculla", "Reay Road", "Dockyard Road", "Umerkhadi"],
    seoTitle: "Maid Service in Mazgaon, South Mumbai | SakhiHome",
    metaDescription:
      "Need a maid in Mazgaon, South Mumbai? SakhiHome offers verified maids for daily cleaning, cooking, childcare & full-time help. Replacement within 24-48 hours.",
    searchVolumeTier: "medium",
    societies: [
      { name: "Mazgaon Court", slug: "mazgaon-court" },
      { name: "Byculla East Towers", slug: "byculla-east-towers-mazgaon" },
      { name: "Dockyard Residency", slug: "dockyard-residency-mazgaon" },
    ],
  },
  {
    id: "crawford",
    name: "Crawford Market",
    slug: "crawford",
    shortName: "Crawford",
    description:
      "Iconic South Mumbai hub surrounded by residential pockets — families value maids who know the area and commute reliably.",
    landmark: "Mahatma Jyotiba Phule Mandai (Crawford Market)",
    pincode: "400001",
    nearbyMicroLocalities: ["Fort", "CST", "Kalbadevi", "Marine Lines"],
    seoTitle: "Maid Service near Crawford Market, South Mumbai | SakhiHome",
    metaDescription:
      "Book verified maid services near Crawford Market, South Mumbai. Cleaning, cooking, babysitting & elder support matched locally by SakhiHome.",
    searchVolumeTier: "high",
    societies: [
      { name: "Fort Residency", slug: "fort-residency-crawford" },
      { name: "Kalbadevi Heights", slug: "kalbadevi-heights-crawford" },
      { name: "Marine Lines Court", slug: "marine-lines-court-crawford" },
    ],
  },
] as const;

const bySlug = new Map(AREAS.map((a) => [a.slug, a]));
const byId = new Map(AREAS.map((a) => [a.id, a]));

export function getAreaBySlug(slug: string): AreaRecord | undefined {
  return bySlug.get(slug);
}

export function getAreaById(id: string): AreaRecord | undefined {
  return byId.get(id);
}

export function getAllAreaSlugs(): string[] {
  return AREAS.map((a) => a.slug);
}

export function getAllSocieties(): Society[] {
  return AREAS.flatMap((area) =>
    area.societies.map((s) => ({ ...s, areaId: area.id })),
  );
}

export function getSocietyBySlug(
  slug: string,
): (Society & { area: AreaRecord }) | undefined {
  for (const area of AREAS) {
    const society = area.societies.find((s) => s.slug === slug);
    if (society) return { ...society, areaId: area.id, area };
  }
  return undefined;
}

export function getAllSocietySlugs(): string[] {
  return getAllSocieties().map((s) => s.slug);
}
