/** Site-wide call / WhatsApp / address - single source of truth for NAP consistency. */

export const CONTACT_PHONE_E164 = "+919324094082";

/** City-level service area (no precise office pin). */
export const BUSINESS_STREET_ADDRESS = "South Mumbai";
export const BUSINESS_ADDRESS_LOCALITY = "Mumbai";
export const BUSINESS_ADDRESS_REGION = "Maharashtra";
export const BUSINESS_POSTAL_CODE = "";
export const BUSINESS_ADDRESS_COUNTRY = "IN";
export const BUSINESS_ADDRESS_DISPLAY =
  "South Mumbai — Mohammad Ali, Nagdevi, Chakala, Mazgaon, Crawford";

/** No precise coordinates until a verified office pin is available. */
export const HAS_PRECISE_GEO = false;

/** Empty when no embed URL; BusinessMap shows address only. */
export const GOOGLE_MAPS_EMBED_SRC = "";

export const GOOGLE_MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/search/South+Mumbai+maid+service";

/** Schema.org PostalAddress for LocalBusiness JSON-LD. */
export function getBusinessPostalAddressJsonLd() {
  return {
    "@type": "PostalAddress" as const,
    streetAddress: BUSINESS_STREET_ADDRESS,
    addressLocality: BUSINESS_ADDRESS_LOCALITY,
    addressRegion: BUSINESS_ADDRESS_REGION,
    ...(BUSINESS_POSTAL_CODE ? { postalCode: BUSINESS_POSTAL_CODE } : {}),
    addressCountry: BUSINESS_ADDRESS_COUNTRY,
  };
}

export function getBusinessGeoJsonLd(): {
  "@type": "GeoCoordinates";
  latitude: number;
  longitude: number;
} | null {
  if (!HAS_PRECISE_GEO) return null;
  return null;
}

/** Human-readable for India (matches marketing). */
export const CONTACT_PHONE_DISPLAY_IN = "+91 93240 94082";

const WA_ME_DIGITS = "919324094082";

const DEFAULT_BOOKING_TEXT = "Hi SakhiHome, I'd like to book a maid";

export const WHATSAPP = `https://wa.me/${WA_ME_DIGITS}?text=${encodeURIComponent(DEFAULT_BOOKING_TEXT)}`;

export function getWhatsAppHrefWithService(topic: string) {
  const q = encodeURIComponent(`Hi SakhiHome, I'm interested in ${topic}.`);
  return `https://wa.me/${WA_ME_DIGITS}?text=${q}`;
}
