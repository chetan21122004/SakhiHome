/** Site-wide call / WhatsApp — single source of truth for NAP consistency. */

export const CONTACT_PHONE_E164 = "+919270075977";

/** Human-readable for India (matches marketing). */
export const CONTACT_PHONE_DISPLAY_IN = "+91 92700 75977";

const WA_ME_DIGITS = "919270075977";

const DEFAULT_BOOKING_TEXT = "Hi SakhiHome, I'd like to book a maid";

export const WHATSAPP = `https://wa.me/${WA_ME_DIGITS}?text=${encodeURIComponent(DEFAULT_BOOKING_TEXT)}`;

export function getWhatsAppHrefWithService(topic: string) {
  const q = encodeURIComponent(`Hi SakhiHome, I'm interested in ${topic}.`);
  return `https://wa.me/${WA_ME_DIGITS}?text=${q}`;
}
