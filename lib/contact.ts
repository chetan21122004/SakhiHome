/** Site-wide call / WhatsApp / address - single source of truth for NAP consistency. */

export const CONTACT_PHONE_E164 = "+919270075977";

/** Human-readable for India (matches marketing). */
export const CONTACT_PHONE_DISPLAY_IN = "+91 92700 75977";

export type BranchId = "hinjewadi" | "nanded-city";

export type Branch = {
  id: BranchId;
  /** Public office label on the site. */
  name: string;
  shortLabel: string;
  /** GMB listing title when it differs from the site brand. */
  alternateName?: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  addressDisplay: string;
  geoLat: number;
  geoLng: number;
  mapsEmbedSrc: string;
  mapsDirectionsUrl: string;
  gmbUrl?: string;
  schemaIdSuffix: string;
  areaServedLabel: string;
};

export const BRANCHES: Record<BranchId, Branch> = {
  hinjewadi: {
    id: "hinjewadi",
    name: "SakhiHome Hinjewadi",
    shortLabel: "Hinjewadi / Maan",
    streetAddress: "Annabhau Sathe Nagar, Maan",
    addressLocality: "Man",
    addressRegion: "Maharashtra",
    postalCode: "411057",
    addressCountry: "IN",
    addressDisplay: "Annabhau Sathe Nagar, Maan, Man, Maharashtra 411057",
    geoLat: 18.575996,
    geoLng: 73.709906,
    mapsEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d778.0587754592929!2d73.70990627494702!3d18.57599619609245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb9abfbdf319%3A0xf0027cd442f858e0!2sAnnabhau%20Sathe%20Nagar%2C%20Maan%2C%20Man%2C%20Maharashtra%20411057!5e1!3m2!1sen!2sin!4v1779388548356!5m2!1sen!2sin",
    mapsDirectionsUrl:
      "https://www.google.com/maps/place/Annabhau+Sathe+Nagar,+Maan,+Man,+Maharashtra+411057/@18.575996,73.709906,17z",
    schemaIdSuffix: "localbusiness",
    areaServedLabel: "Hinjewadi IT Park, Pune",
  },
  "nanded-city": {
    id: "nanded-city",
    name: "SakhiHome Nanded City",
    shortLabel: "Nanded City / Uttam Nagar",
    alternateName: "Sakhi Home",
    streetAddress: "Uttam Nagar, Shivane",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    postalCode: "411023",
    addressCountry: "IN",
    addressDisplay: "Uttam Nagar, Shivane, Pune, Maharashtra 411023",
    geoLat: 18.4630779,
    geoLng: 73.7715147,
    mapsEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3114.2903741689975!2d73.7715147!3d18.463077900000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc295b358cf2745%3A0x383464a500c2bbff!2sSakhi%20Home!5e1!3m2!1sen!2sin!4v1787030699446!5m2!1sen!2sin",
    mapsDirectionsUrl: "https://share.google/6fr59VckzHywOHkBo",
    gmbUrl: "https://share.google/6fr59VckzHywOHkBo",
    schemaIdSuffix: "localbusiness-nanded-city",
    areaServedLabel: "Nanded City, Uttam Nagar & Sinhagad Road, Pune",
  },
};

export const BRANCH_ORDER: readonly BranchId[] = ["hinjewadi", "nanded-city"];

export const DEFAULT_BRANCH_ID: BranchId = "hinjewadi";
export const DEFAULT_BRANCH = BRANCHES[DEFAULT_BRANCH_ID];

export function getBranch(id: BranchId = DEFAULT_BRANCH_ID): Branch {
  return BRANCHES[id];
}

export function getAllBranches(): Branch[] {
  return BRANCH_ORDER.map((id) => BRANCHES[id]);
}

/** @deprecated Prefer getBranch("hinjewadi"). Kept for existing Hinjewadi NAP call sites. */
export const BUSINESS_STREET_ADDRESS = DEFAULT_BRANCH.streetAddress;
export const BUSINESS_ADDRESS_LOCALITY = DEFAULT_BRANCH.addressLocality;
export const BUSINESS_ADDRESS_REGION = DEFAULT_BRANCH.addressRegion;
export const BUSINESS_POSTAL_CODE = DEFAULT_BRANCH.postalCode;
export const BUSINESS_ADDRESS_COUNTRY = DEFAULT_BRANCH.addressCountry;
export const BUSINESS_ADDRESS_DISPLAY = DEFAULT_BRANCH.addressDisplay;
export const BUSINESS_GEO_LAT = DEFAULT_BRANCH.geoLat;
export const BUSINESS_GEO_LNG = DEFAULT_BRANCH.geoLng;
export const GOOGLE_MAPS_EMBED_SRC = DEFAULT_BRANCH.mapsEmbedSrc;
export const GOOGLE_MAPS_DIRECTIONS_URL = DEFAULT_BRANCH.mapsDirectionsUrl;

/** Schema.org PostalAddress for LocalBusiness JSON-LD. */
export function getBusinessPostalAddressJsonLd(branch: Branch = DEFAULT_BRANCH) {
  return {
    "@type": "PostalAddress" as const,
    streetAddress: branch.streetAddress,
    addressLocality: branch.addressLocality,
    addressRegion: branch.addressRegion,
    postalCode: branch.postalCode,
    addressCountry: branch.addressCountry,
  };
}

export function getBusinessGeoJsonLd(branch: Branch = DEFAULT_BRANCH) {
  return {
    "@type": "GeoCoordinates" as const,
    latitude: branch.geoLat,
    longitude: branch.geoLng,
  };
}

export function getLocalBusinessJsonLd(options: {
  homeUrl: string;
  branch?: Branch;
  extra?: Record<string, unknown>;
}) {
  const branch = options.branch ?? DEFAULT_BRANCH;
  const id = `${options.homeUrl}#${branch.schemaIdSuffix}`;

  return {
    "@type": "LocalBusiness" as const,
    "@id": id,
    name: "SakhiHome",
    alternateName: branch.alternateName,
    url: options.homeUrl,
    telephone: CONTACT_PHONE_E164,
    address: getBusinessPostalAddressJsonLd(branch),
    geo: getBusinessGeoJsonLd(branch),
    hasMap: branch.mapsDirectionsUrl,
    areaServed: {
      "@type": "Place" as const,
      name: branch.areaServedLabel,
    },
    ...options.extra,
  };
}

const WA_ME_DIGITS = "919270075977";

const DEFAULT_BOOKING_TEXT = "Hi SakhiHome, I'd like to book a maid";

export const WHATSAPP = `https://wa.me/${WA_ME_DIGITS}?text=${encodeURIComponent(DEFAULT_BOOKING_TEXT)}`;

export function getWhatsAppHrefWithService(topic: string) {
  const q = encodeURIComponent(`Hi SakhiHome, I'm interested in ${topic}.`);
  return `https://wa.me/${WA_ME_DIGITS}?text=${q}`;
}
