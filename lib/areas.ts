/**
 * Canonical area + society catalog (single source of truth).
 * Drives programmatic SEO pages:
 *   /maid-service-in-[areaSlug]
 *   /[serviceSlug]-in-[areaSlug]
 *   /maid-service-in-[societySlug]
 */

import type { BranchId } from "@/lib/contact";

export type ServiceRegion = BranchId;
export type CoverageTier = "primary" | "secondary" | "expansion";
export type SocietyHighlight = "nanny" | "maid";

export type Society = {
  name: string;
  slug: string;
  areaId: string;
  highlights?: readonly SocietyHighlight[];
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
  region: ServiceRegion;
  coverageTier: CoverageTier;
  societies: Omit<Society, "areaId">[];
};

export const AREAS: readonly AreaRecord[] = [
  {
    id: "hinjewadi-phase-1",
    name: "Hinjewadi Phase 1",
    slug: "hinjewadi-phase-1",
    shortName: "Phase 1",
    description:
      "Rajiv Gandhi Infotech Park core area and adjoining residential societies -the beating heart of Pune's IT corridor.",
    landmark: "Rajiv Gandhi Infotech Park Gate 1",
    pincode: "411057",
    nearbyMicroLocalities: ["Nande", "Hinjewadi Village", "Kate Wasti", "Kemse Vasti"],
    seoTitle: "Maid Service in Hinjewadi Phase 1 | Verified Maids Near You - SakhiHome",
    metaDescription:
      "Looking for a maid in Hinjewadi Phase 1? SakhiHome connects you with 500+ background-verified maids for cleaning, cooking, babysitting & more. Match within hours.",
    searchVolumeTier: "high",
    region: "hinjewadi",
    coverageTier: "primary",
    societies: [
      { name: "Godrej 24", slug: "godrej-24-hinjewadi" },
      { name: "Shapoorji Joyville Sensorium", slug: "shapoorji-joyville-sensorium" },
      { name: "Park Astra", slug: "park-astra-hinjewadi" },
      { name: "Gera Joy on the Treetops", slug: "gera-joy-treetops-hinjewadi" },
      { name: "Kolte Patil Life Republic", slug: "kolte-patil-life-republic" },
      { name: "VTP Blue Waters", slug: "vtp-blue-waters-hinjewadi" },
      { name: "Hazel View", slug: "hazel-view-hinjewadi" },
      { name: "Ashiana Malhar", slug: "ashiana-malhar-hinjewadi" },
      { name: "Kolte Canvas", slug: "kolte-canvas-hinjewadi" },
    ],
  },
  {
    id: "hinjewadi-phase-2",
    name: "Hinjewadi Phase 2",
    slug: "hinjewadi-phase-2",
    shortName: "Phase 2",
    description:
      "Home to Infosys, Wipro and large IT campuses with dense residential society clusters -thousands of working families nearby.",
    landmark: "Infosys Pune Development Centre",
    pincode: "411057",
    nearbyMicroLocalities: ["Maan", "Mahalunge", "Hinjewadi Phase 2 Hill"],
    seoTitle: "Maid Service in Hinjewadi Phase 2 | Trusted Domestic Help - SakhiHome",
    metaDescription:
      "Find verified maids near Infosys & Wipro IT societies in Hinjewadi Phase 2. SakhiHome matches local, background-checked domestic help within hours.",
    searchVolumeTier: "high",
    region: "hinjewadi",
    coverageTier: "primary",
    societies: [
      { name: "Supreme Estia Phase 1", slug: "supreme-estia-hinjewadi-phase-2" },
      { name: "VJ Eternity", slug: "vj-eternity-hinjewadi" },
      { name: "Megapolis Mystic", slug: "megapolis-mystic-hinjewadi" },
      { name: "Kolte 24K Atria", slug: "kolte-24k-atria-hinjewadi" },
      { name: "Lemon Tree Residences", slug: "lemon-tree-residences-hinjewadi" },
      { name: "Hinjewadi Village Residences", slug: "hinjewadi-village-residences" },
    ],
  },
  {
    id: "hinjewadi-phase-3",
    name: "Hinjewadi Phase 3",
    slug: "hinjewadi-phase-3",
    shortName: "Phase 3",
    description:
      "Blue Ridge Township, Life Republic and an expanding residential belt -one of the largest IT-adjacent communities in Pune west.",
    landmark: "Blue Ridge Township",
    pincode: "411057",
    nearbyMicroLocalities: ["Sus", "Marunji Road", "Hinjewadi Maan Phase 3"],
    seoTitle: "Maid Service in Hinjewadi Phase 3 | Blue Ridge & Life Republic - SakhiHome",
    metaDescription:
      "Trusted maid services in Hinjewadi Phase 3 -Blue Ridge, Life Republic & nearby societies. 500+ verified maids matched within hours. SakhiHome.",
    searchVolumeTier: "high",
    region: "hinjewadi",
    coverageTier: "primary",
    societies: [
      { name: "Blue Ridge Township", slug: "blue-ridge-township-hinjewadi" },
      { name: "Life Republic Aros", slug: "life-republic-aros-hinjewadi" },
      { name: "Life Republic 16", slug: "life-republic-16-hinjewadi" },
      { name: "Paranjape Broadway", slug: "paranjape-broadway-hinjewadi" },
      { name: "Shapoorji Joyville Phase 3", slug: "shapoorji-joyville-hinjewadi-phase-3" },
      { name: "The Ridges 41", slug: "the-ridges-41-blue-ridge" },
      { name: "Qrious by Life Republic", slug: "qrious-life-republic" },
    ],
  },
  {
    id: "megapolis",
    name: "Megapolis",
    slug: "megapolis-hinjewadi",
    shortName: "Megapolis",
    description:
      "Megapolis Splendour, Sparklet and the surrounding township -one of Pune's most densely populated IT-adjacent residential clusters.",
    landmark: "Megapolis Splendour Tower",
    pincode: "411057",
    nearbyMicroLocalities: ["Godambewadi", "Hinjewadi Phase 3 corridor"],
    seoTitle: "Maid Service in Megapolis Hinjewadi | Verified Domestic Help - SakhiHome",
    metaDescription:
      "Need a maid in Megapolis Splendour or Sparklet? SakhiHome provides background-verified maids for cleaning, cooking, babysitting & more. Fast matching, quick replacement.",
    searchVolumeTier: "medium",
    region: "hinjewadi",
    coverageTier: "primary",
    societies: [
      { name: "Megapolis Splendour", slug: "megapolis-splendour-hinjewadi" },
      { name: "Megapolis Sparklet", slug: "megapolis-sparklet-hinjewadi" },
      { name: "Megapolis Mystic", slug: "megapolis-mystic" },
      { name: "Megapolis Smart Homes", slug: "megapolis-smart-homes" },
    ],
  },
  {
    id: "wakad",
    name: "Wakad",
    slug: "wakad",
    shortName: "Wakad",
    description:
      "Highway belt and residential hubs with fast IT Park access -one of Pune west's fastest-growing localities for working professionals.",
    landmark: "Wakad Chowk",
    pincode: "411057",
    nearbyMicroLocalities: ["Tathawade", "Dange Chowk", "Pimple Saudagar"],
    seoTitle: "Maid Service in Wakad Pune | Trusted Maids & Domestic Help - SakhiHome",
    metaDescription:
      "Find verified maids in Wakad, Pune. SakhiHome connects you with local, background-checked maids for cleaning, cooking, babysitting & more. Match within hours.",
    searchVolumeTier: "high",
    region: "hinjewadi",
    coverageTier: "primary",
    societies: [
      { name: "RGS Forte", slug: "rgs-forte-wakad" },
      { name: "Sanskruti Casa Poli", slug: "sanskruti-casa-poli-wakad" },
      { name: "AR Atlas", slug: "ar-atlas-wakad" },
      { name: "HS Lagom Homes", slug: "hs-lagom-homes-wakad" },
      { name: "Paranjape Blue Ridge Wakad", slug: "paranjape-blue-ridge-wakad" },
      { name: "Kolte 24K Espada", slug: "kolte-24k-espada-wakad" },
      { name: "Kasturi Nagar Wakad", slug: "kasturi-nagar-wakad" },
    ],
  },
  {
    id: "bhumkar-chowk",
    name: "Bhumkar Chowk",
    slug: "bhumkar-chowk",
    shortName: "Bhumkar Chowk",
    description:
      "Junction area linking Wakad to Hinjewadi with rapidly growing residential societies -a key transit point for IT Park commuters.",
    landmark: "Bhumkar Chowk Junction",
    pincode: "411033",
    nearbyMicroLocalities: ["Bhumkar Nagar", "Wakadkar Wasti", "Hinjewadi Road"],
    seoTitle: "Maid Service in Bhumkar Chowk | Verified Maids Near You - SakhiHome",
    metaDescription:
      "Looking for a maid near Bhumkar Chowk? SakhiHome has 500+ background-verified maids for all home needs. Fast matching & 24-48 hr replacement guaranteed.",
    searchVolumeTier: "medium",
    region: "hinjewadi",
    coverageTier: "primary",
    societies: [
      { name: "Bhumkar Nagar Societies", slug: "bhumkar-nagar-societies" },
      { name: "Sai Nagar Bhumkar Chowk", slug: "sai-nagar-bhumkar-chowk" },
      { name: "Green Valley Bhumkar", slug: "green-valley-bhumkar-chowk" },
      { name: "Shreeram Residency", slug: "shreeram-residency-bhumkar" },
      { name: "Wakadkar Wasti", slug: "wakadkar-wasti-bhumkar" },
    ],
  },
  {
    id: "baner",
    name: "Baner",
    slug: "baner",
    shortName: "Baner",
    description:
      "Established residential neighbourhood a short drive from Hinjewadi IT Park -popular with senior IT professionals and families.",
    landmark: "Baner Road",
    pincode: "411045",
    nearbyMicroLocalities: ["Balewadi", "Aundh", "Pashan", "Sus Road"],
    seoTitle: "Maid Service in Baner Pune | Trusted Verified Domestic Help - SakhiHome",
    metaDescription:
      "Find trusted maids in Baner, Pune. SakhiHome provides background-verified maids for cleaning, cooking, elder care & babysitting. Fast matching near your society.",
    searchVolumeTier: "high",
    region: "hinjewadi",
    coverageTier: "primary",
    societies: [
      { name: "VJ Portia Grande", slug: "vj-portia-grande-baner" },
      { name: "Kalpataru Jade Residences", slug: "kalpataru-jade-residences-baner" },
      { name: "Grand Legacy Baner", slug: "grand-legacy-baner" },
      { name: "Supreme Estia Baner", slug: "supreme-estia-baner" },
      { name: "Kohinoor Zen Estate", slug: "kohinoor-zen-estate-baner" },
      { name: "Kolte 24K Grazio", slug: "kolte-24k-grazio-baner" },
      { name: "Gayatri Bravuria", slug: "gayatri-bravuria-baner" },
    ],
  },
  {
    id: "marunji",
    name: "Marunji",
    slug: "marunji",
    shortName: "Marunji",
    description:
      "Fast-growing locality near Sus and Hinjewadi corridors -increasing residential density as IT Park families move outward.",
    landmark: "Marunji Village Road",
    pincode: "412115",
    nearbyMicroLocalities: ["Sus", "Kasarsai Road", "Hinjewadi Phase 3 border"],
    seoTitle: "Maid Service in Marunji Pune | Background-Verified Maids - SakhiHome",
    metaDescription:
      "Need domestic help in Marunji near Sus or Hinjewadi? SakhiHome matches you with local, verified maids for all home services. Available within hours.",
    searchVolumeTier: "medium",
    region: "hinjewadi",
    coverageTier: "primary",
    societies: [
      { name: "Life Republic Marunji", slug: "life-republic-marunji" },
      { name: "Kolte Patil Western Avenue", slug: "kolte-patil-western-avenue-marunji" },
      { name: "Sus Road Societies", slug: "sus-road-societies-marunji" },
      { name: "Kasarsai Road Societies", slug: "kasarsai-road-societies-marunji" },
      { name: "Marunji Village Residences", slug: "marunji-village-residences" },
    ],
  },

  // ── Nanded City / Sinhagad Road belt ──────────────────────────────────────
  {
    id: "nanded-city",
    name: "Nanded City",
    slug: "nanded-city",
    shortName: "Nanded City",
    description:
      "A 700-acre integrated township on Sinhagad Road -7,000+ families across 95 delivered towers. The primary catchment for SakhiHome's Uttam Nagar branch.",
    landmark: "Nanded City township gate, Sinhagad Road",
    pincode: "411041",
    nearbyMicroLocalities: ["Uttam Nagar", "Shivane", "Dhayari", "Dhayari Phata"],
    seoTitle: "Maid Service in Nanded City Pune | Verified Maids - SakhiHome",
    metaDescription:
      "Hire verified maids, cooks, nannies and babysitters in Nanded City, Pune. SakhiHome matches local help for Sargam, Asawari, Pancham, Shubh Kalyan and more.",
    searchVolumeTier: "high",
    region: "nanded-city",
    coverageTier: "primary",
    societies: [
      { name: "Asawari", slug: "asawari-nanded-city", highlights: ["nanny"] },
      { name: "Bageshree", slug: "bageshree-nanded-city" },
      { name: "Bahaar", slug: "bahaar-nanded-city", highlights: ["nanny"] },
      { name: "Dhanashree", slug: "dhanashree-nanded-city" },
      { name: "Janaranjani", slug: "janaranjani-nanded-city" },
      { name: "Kalashree", slug: "kalashree-nanded-city", highlights: ["nanny"] },
      { name: "Lalit", slug: "lalit-nanded-city" },
      { name: "Madhuvanti", slug: "madhuvanti-nanded-city", highlights: ["maid"] },
      { name: "Mangal Bhairav", slug: "mangal-bhairav-nanded-city", highlights: ["maid"] },
      { name: "Pancham Nanded City", slug: "pancham-nanded-city", highlights: ["nanny"] },
      { name: "Sarang", slug: "sarang-nanded-city", highlights: ["maid"] },
      { name: "Sargam", slug: "sargam-nanded-city", highlights: ["nanny"] },
      { name: "Shubh Kalyan", slug: "shubh-kalyan-nanded-city", highlights: ["nanny"] },
      { name: "Sur Nanded City", slug: "sur-nanded-city", highlights: ["nanny"] },
      { name: "Rhythm", slug: "rhythm-nanded-city" },
      { name: "Melody", slug: "melody-nanded-city" },
    ],
  },
  {
    id: "uttam-nagar",
    name: "Uttam Nagar",
    slug: "uttam-nagar",
    shortName: "Uttam Nagar",
    description:
      "Residential pocket on Nanded-Shivane Road around SakhiHome's Sinhagad Road office -a short hop from Nanded City and Shivane societies.",
    landmark: "Nanded-Shivane Road, Uttam Nagar",
    pincode: "411023",
    nearbyMicroLocalities: ["Shivane", "Deshmukh Nagar", "Nanded City"],
    seoTitle: "Maid Service in Uttam Nagar Pune | Local Verified Help - SakhiHome",
    metaDescription:
      "Need a maid in Uttam Nagar, Pune? SakhiHome's local branch matches verified maids, cooks and babysitters near Shivane and Nanded City.",
    searchVolumeTier: "medium",
    region: "nanded-city",
    coverageTier: "secondary",
    societies: [
      { name: "Venkatesh Puram Housing Society", slug: "venkatesh-puram-uttam-nagar" },
      { name: "Anant Co-operative Housing Society", slug: "anant-cooperative-uttam-nagar" },
    ],
  },
  {
    id: "shivane",
    name: "Shivane",
    slug: "shivane",
    shortName: "Shivane",
    description:
      "Village-side residential belt next to Uttam Nagar and Nanded City -housing societies with easy access to Sinhagad Road and NDA Khadakwasla.",
    landmark: "Shivane village / Nanded-Shivane Road",
    pincode: "411023",
    nearbyMicroLocalities: ["Uttam Nagar", "Yashwant Nagar", "NDA Khadakwasla"],
    seoTitle: "Maid Service in Shivane Pune | Verified Maids Near You - SakhiHome",
    metaDescription:
      "Find verified maids in Shivane, Pune. SakhiHome covers Yashwant Nagar, Green City and nearby Uttam Nagar homes from our Nanded City branch.",
    searchVolumeTier: "medium",
    region: "nanded-city",
    coverageTier: "secondary",
    societies: [
      { name: "Yashwant Nagar Housing Society", slug: "yashwant-nagar-shivane" },
      { name: "Green City Shivane", slug: "green-city-shivane" },
    ],
  },
  {
    id: "dhayari",
    name: "Dhayari",
    slug: "dhayari",
    shortName: "Dhayari",
    description:
      "Established Sinhagad Road neighbourhood adjoining Nanded City -family apartments and co-operative housing with strong demand for daily maids and cooks.",
    landmark: "Dhayari Gaon",
    pincode: "411041",
    nearbyMicroLocalities: ["Dhayari Phata", "Nanded City", "Vadgaon Budruk"],
    seoTitle: "Maid Service in Dhayari Pune | Trusted Domestic Help - SakhiHome",
    metaDescription:
      "Hire a verified maid in Dhayari, Pune. Cleaning, cooking, babysitting and full-time help matched locally from SakhiHome's Nanded City branch.",
    searchVolumeTier: "high",
    region: "nanded-city",
    coverageTier: "secondary",
    societies: [
      { name: "Vitthal Sangam Housing Society", slug: "vitthal-sangam-dhayari" },
      { name: "Surya Ganga Co-Op Housing Society", slug: "surya-ganga-dhayari" },
      { name: "Vastushilp Housing Society", slug: "vastushilp-dhayari" },
    ],
  },
  {
    id: "dhayari-phata",
    name: "Dhayari Phata",
    slug: "dhayari-phata",
    shortName: "Dhayari Phata",
    description:
      "Sinhagad Road junction linking Dhayari, Nanded City and Vadgaon Budruk -a practical pickup point for part-time and full-time domestic help.",
    landmark: "Dhayari Phata junction, Sinhagad Road",
    pincode: "411041",
    nearbyMicroLocalities: ["Dhayari", "Nanded City", "Sinhagad Road", "Vadgaon Budruk"],
    seoTitle: "Maid Service in Dhayari Phata | Sinhagad Road Maids - SakhiHome",
    metaDescription:
      "Book verified maid services near Dhayari Phata on Sinhagad Road. SakhiHome matches local maids, cooks and nannies for Dhayari and Nanded City homes.",
    searchVolumeTier: "medium",
    region: "nanded-city",
    coverageTier: "secondary",
    societies: [],
  },
  {
    id: "kirkatwadi",
    name: "Kirkatwadi",
    slug: "kirkatwadi",
    shortName: "Kirkatwadi",
    description:
      "Residential clusters toward Wanjalewadi and UrbanGram -an expansion belt from the Uttam Nagar office for families needing reliable local maids.",
    landmark: "Kirkatwadi village",
    pincode: "411024",
    nearbyMicroLocalities: ["Wanjalewadi", "Kondhawe Dhawade", "Shivane"],
    seoTitle: "Maid Service in Kirkatwadi Pune | Verified Local Help - SakhiHome",
    metaDescription:
      "Need a maid in Kirkatwadi or Wanjalewadi? SakhiHome provides background-verified maids, cooks and babysitters from the nearby Nanded City branch.",
    searchVolumeTier: "medium",
    region: "nanded-city",
    coverageTier: "expansion",
    societies: [
      { name: "UrbanGram Society", slug: "urbangram-kirkatwadi" },
      { name: "Aapla Ghar Kirkatwadi", slug: "aapla-ghar-kirkatwadi" },
    ],
  },
  {
    id: "narhe",
    name: "Narhe",
    slug: "narhe",
    shortName: "Narhe",
    description:
      "Growing housing pocket off Sinhagad Road toward Ambegaon -expansion coverage for co-operative societies that sit a short drive from Nanded City.",
    landmark: "Narhe gaon",
    pincode: "411041",
    nearbyMicroLocalities: ["Ambegaon", "Dhayari", "Sinhagad Road"],
    seoTitle: "Maid Service in Narhe Pune | Trusted Maids & Nannies - SakhiHome",
    metaDescription:
      "Hire verified maids in Narhe, Pune. SakhiHome covers Bhakti Park, Aditya Sanskruti and nearby societies from the Nanded City / Uttam Nagar branch.",
    searchVolumeTier: "medium",
    region: "nanded-city",
    coverageTier: "expansion",
    societies: [
      { name: "Bhakti Park Housing Society", slug: "bhakti-park-narhe" },
      { name: "Aditya Sanskruti Co-Op Housing Society", slug: "aditya-sanskruti-narhe" },
      { name: "Siddhivinayak Gardenia Co-Op Housing Society", slug: "siddhivinayak-gardenia-narhe" },
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

const coverageTierRank: Record<CoverageTier, number> = {
  primary: 0,
  secondary: 1,
  expansion: 2,
};

export function getAreasByRegion(region: ServiceRegion): AreaRecord[] {
  return AREAS.filter((area) => area.region === region).sort(
    (a, b) => coverageTierRank[a.coverageTier] - coverageTierRank[b.coverageTier],
  );
}

export function getRegionLabel(region: ServiceRegion): string {
  return region === "nanded-city"
    ? "Nanded City & Sinhagad Road"
    : "Hinjewadi & Pune west";
}

const NANNY_SERVICE_SLUGS = new Set(["babysitting", "japa-maid"]);
const MAID_SERVICE_SLUGS = new Set([
  "house-cleaning",
  "cooking-services",
  "full-time-maid",
  "part-time-maid",
]);

export function sortSocietiesForService<T extends { highlights?: readonly SocietyHighlight[] }>(
  societies: readonly T[],
  serviceSlug?: string,
): T[] {
  if (!serviceSlug) return [...societies];

  const preferNanny = NANNY_SERVICE_SLUGS.has(serviceSlug);
  const preferMaid = MAID_SERVICE_SLUGS.has(serviceSlug);

  return [...societies].sort((a, b) => {
    const score = (society: T) => {
      if (preferNanny && society.highlights?.includes("nanny")) return 0;
      if (preferMaid && society.highlights?.includes("maid")) return 0;
      return 1;
    };
    return score(a) - score(b);
  });
}
