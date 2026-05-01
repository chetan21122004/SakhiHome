/**
 * Canonical service catalog + SEO payload (single source of truth).
 * Icons used in UI map `iconKey` to lucide-react in `Services.tsx`.
 *
 * SEO UPDATE LOG:
 * - Added Japa Maid as a new service
 * - Expanded metaTitle + metaDescription to target Marathi/Hindi keyword variants
 * - Added `keywords` array per service (use in <meta name="keywords"> and page copy)
 * - Added `marathiKeywords` array for Marathi/Hindi search variants
 * - Added `relatedSearches` for internal linking anchor text
 * - Expanded FAQ answers with location signals (Hinjewadi, Wakad, Baner, Pune)
 * - Added `priceRange` for schema markup and page copy
 * - Added `searchIntent` to guide content tone per page
 */

export type ServiceIconKey =
  | "sparkles"
  | "chefHat"
  | "baby"
  | "heartHandshake"
  | "home"
  | "clock"
  | "heart";

export type ServiceFaq = { question: string; answer: string };

export type ServiceRecord = {
  slug: string;
  iconKey: ServiceIconKey;
  title: string;
  /** Optional badge shown on listing cards */
  tag?: string;
  /** Short bullets for listings + detail pages */
  points: string[];
  /** One-line mobile summary keyed by title slug usage */
  mobileSummary: string;
  headline: string;
  metaTitle: string;
  metaDescription: string;
  longDescription: string;
  /** Primary English SEO keywords to weave into page copy */
  keywords: string[];
  /** Marathi / Hindi search variants — use in alt text, copy, FAQ */
  marathiKeywords: string[];
  /** Anchor text for internal cross-linking between service pages */
  relatedSearches: string[];
  /** Price range string for schema markup + page copy */
  priceRange: string;
  /** Guides content tone: transactional = book now, informational = educate first */
  searchIntent: "transactional" | "informational" | "mixed";
  faq: ServiceFaq[];
};

export const WHATSAPP =
  "https://wa.me/919172475977?text=Hi%20SakhiHome%2C%20I%27d%20like%20to%20book%20a%20maid";

export const BRAND_NAME = "SakhiHome";
export const AREA_SERVED_CITY = "Pune";
export const AREA_SERVED_LOCALITY = "Hinjewadi IT Park";

export function getWhatsAppHrefWithService(topic: string) {
  const q = encodeURIComponent(`Hi SakhiHome, I'm interested in ${topic}.`);
  return `https://wa.me/919172475977?text=${q}`;
}

export function getAbsoluteSiteUrl(path = "") {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  const trimmed = base.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${trimmed}${p}`;
}

export const SERVICE_SLUGS = [
  "house-cleaning",
  "cooking-services",
  "babysitting",
  "japa-maid",
  "elder-care",
  "full-time-maid",
  "part-time-maid",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const services: readonly ServiceRecord[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. HOUSE CLEANING
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "house-cleaning",
    iconKey: "sparkles",
    title: "House Cleaning",
    tag: "Most Booked",
    points: [
      "Sweeping, mopping & dusting",
      "Kitchen & bathroom cleaning",
      "Daily or alternate visits",
    ],
    mobileSummary: "Sweeping, mopping, kitchen & bathroom cleaning.",
    headline: "House Cleaning Maid in Hinjewadi, Wakad & Baner, Pune",
    metaTitle:
      "House Cleaning Maid in Hinjewadi Pune | Cleaning Bai | SakhiHome",
    metaDescription:
      "Hire a trusted house cleaning maid in Hinjewadi, Wakad & Baner, Pune. Daily or alternate visits for sweeping, mopping, kitchen & bathroom. Verified cleaning bai — matched within hours. SakhiHome.",
    longDescription:
      "Keep your floors, surfaces, kitchen, and bathrooms spotless without the daily grind. SakhiHome matches you with reliable, background-verified cleaning maids (cleaning bai) who live near your society in Hinjewadi, Wakad, Baner, or Megapolis — shorter commute means they show up on time, every time. Whether you need daily jhadu-pocha, deep kitchen scrubbing, or alternate-day upkeep, we build a schedule around your home and your routine.",
    keywords: [
      "house cleaning maid Hinjewadi",
      "house cleaning maid Wakad",
      "house cleaning maid Baner",
      "house cleaning maid Pune",
      "cleaning maid near me Pune",
      "cleaning bai Hinjewadi",
      "jhadu pocha maid Pune",
      "kitchen cleaning maid Pune",
      "bathroom cleaning maid Pune",
      "daily cleaning maid Hinjewadi",
      "deep cleaning service Hinjewadi",
      "sweeping mopping maid Pune",
    ],
    marathiKeywords: [
      "cleaning bai Hinjewadi",
      "jhadu pocha bai Pune",
      "swachhata bai Pune",
      "ghar safai bai Hinjewadi",
    ],
    relatedSearches: [
      "part-time maid in Hinjewadi",
      "full-time maid in Wakad",
      "house cleaning in Baner",
    ],
    priceRange: "₹3,000 – ₹6,000/month",
    searchIntent: "transactional",
    faq: [
      {
        question: "How often can I book house cleaning in Hinjewadi?",
        answer:
          "You can arrange daily visits, alternate days, weekly deep cleans, or a custom rhythm to suit your IT Park schedule. Most families in Hinjewadi Phase 1, Phase 2, and Phase 3 prefer daily morning slots before office hours.",
      },
      {
        question: "What areas do you clean inside the home?",
        answer:
          "Typically living areas, bedrooms, kitchen, bathrooms, balconies, and common surfaces. We align scope during booking based on home size — 1 BHK through 4 BHK societies like Blue Ridge, Megapolis Splendour, and Kolte Patil Life Republic.",
      },
      {
        question: "Do you supply cleaning materials?",
        answer:
          "Most families prefer supplies they already trust at home. We clarify mop, disinfectant, and tool expectations when you enquire — no surprises.",
      },
      {
        question: "Are cleaners background verified?",
        answer:
          "Yes — every cleaning maid in SakhiHome's Hinjewadi and Wakad network is ID and address verified before placement. You can also ask for a trial visit before committing.",
      },
      {
        question: "What if my cleaning maid doesn't show up?",
        answer:
          "We arrange a verified replacement within 24–48 hours. One call to SakhiHome is all it takes — no chasing, no waiting.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. COOKING SERVICES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "cooking-services",
    iconKey: "chefHat",
    title: "Cooking Services",
    tag: "Popular",
    points: [
      "Daily home-style meals",
      "Custom menu preferences",
      "Veg, non-veg & regional cuisines",
    ],
    mobileSummary: "Home-style meals, custom menu, any cuisine.",
    headline: "Cook Maid in Hinjewadi, Wakad & Baner, Pune",
    metaTitle:
      "Cook Maid in Hinjewadi Pune | Swayampak Bai | Daily Home Cook | SakhiHome",
    metaDescription:
      "Hire a skilled cook maid (swayampak bai) in Hinjewadi, Wakad & Baner, Pune. Daily home-style meals — veg, non-veg, Jain, regional menus. Background-verified, fast matching. SakhiHome.",
    longDescription:
      "Nutritious, home-style food should match your family's taste — not compromise it. SakhiHome connects IT Park families in Hinjewadi, Wakad, and Baner with experienced cook maids (swayampak bai) for daily lunches and dinners. From Maharashtrian staples to north Indian, south Indian, Jain, and custom diet menus — we document your preferences upfront so the first meal feels familiar. Most cook maids cover breakfast, lunch, and dinner prep with leftovers planning built in.",
    keywords: [
      "cook maid Hinjewadi",
      "cook maid Wakad",
      "cook maid Baner",
      "cook maid Pune",
      "home cook Hinjewadi",
      "daily cook Hinjewadi",
      "cooking bai Pune",
      "swayampak bai Pune",
      "veg cook maid Pune",
      "Jain cook maid Pune",
      "cook and clean maid Hinjewadi",
      "meal prep maid Pune",
    ],
    marathiKeywords: [
      "swayampak bai Hinjewadi",
      "swayampak bai Pune",
      "khana banane wali bai Pune",
      "cooking bai Wakad",
      "jeva bai Hinjewadi",
    ],
    relatedSearches: [
      "full-time maid with cooking in Hinjewadi",
      "part-time cook maid in Wakad",
      "cook maid in Baner",
    ],
    priceRange: "₹4,000 – ₹9,000/month",
    searchIntent: "transactional",
    faq: [
      {
        question: "Can the cook maid adapt to allergies or Jain meals?",
        answer:
          "Yes — dietary notes, allergies, and regional preferences are documented upfront when you send an enquiry. We have cook maids in Hinjewadi experienced with Jain, vegan, diabetic-friendly, and low-oil diets.",
      },
      {
        question: "Is grocery shopping included?",
        answer:
          "Scope varies. Some placements include market runs; we confirm errands, timings, and kitchen workflow during onboarding. Many Hinjewadi and Wakad families pair grocery delivery apps with their cook maid for efficiency.",
      },
      {
        question: "Can I get breakfast, lunch, and dinner covered?",
        answer:
          "Yes — you can prioritise specific meals. Most IT Park families in Hinjewadi anchor lunch and dinner prep, with breakfast being optional. Leftover planning for next-day lunches is common.",
      },
      {
        question: "What if the food quality or taste doesn't match?",
        answer:
          "We focus on continuity. If chemistry or taste mismatches arise after the trial period, contact us and we'll re-align your placement with a better-matched cook maid nearby.",
      },
      {
        question: "How quickly can I get a cook maid in Hinjewadi?",
        answer:
          "Most placements happen within 24–48 hours of your enquiry. We prioritise maids who live near your society — Megapolis, Blue Ridge, Life Republic — so travel time is minimal.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. BABYSITTING
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "babysitting",
    iconKey: "baby",
    title: "Babysitting",
    points: [
      "Newborn & infant care",
      "Daytime supervision",
      "Trained, gentle caretakers",
    ],
    mobileSummary: "Trained caretakers for infants & daytime care.",
    headline: "Babysitter & Child Care at Home in Hinjewadi, Pune",
    metaTitle:
      "Babysitter in Hinjewadi Pune | Infant & Child Care Maid | SakhiHome",
    metaDescription:
      "Trusted babysitters for infants & toddlers in Hinjewadi, Wakad & Baner, Pune. Daytime care, newborn routines, supervised play. Background-verified, gentle caretakers. SakhiHome.",
    longDescription:
      "Peace of mind matters most when you're juggling WFH meetings and your infant's schedule at the same time. SakhiHome connects Hinjewadi, Wakad, and Baner families with trained babysitters for supervised daytime care, newborn-friendly routines, and calm transitions while you're in office or on calls. Every babysitter in our network is background-verified and matched based on your child's age — newborn through school age.",
    keywords: [
      "babysitter Hinjewadi",
      "babysitter Wakad",
      "babysitter Baner",
      "babysitter Pune",
      "baby care maid Pune",
      "infant care maid Hinjewadi",
      "child maid Hinjewadi",
      "nanny Hinjewadi",
      "newborn care maid Pune",
      "daytime babysitter Wakad",
      "child caretaker Hinjewadi",
      "baby sitter near me Pune",
    ],
    marathiKeywords: [
      "bal sangopan bai Pune",
      "baby sambhal wali bai Hinjewadi",
      "lahan mulanche care Pune",
    ],
    relatedSearches: [
      "Japa maid in Hinjewadi",
      "infant care in Wakad",
      "babysitter in Baner",
    ],
    priceRange: "₹6,000 – ₹12,000/month",
    searchIntent: "mixed",
    faq: [
      {
        question: "What ages do you cover for babysitting in Hinjewadi?",
        answer:
          "Newborns through school-age children. Duties are matched when you enquire — feeding support, diapering, nap routines, and supervised play for toddlers in societies like Blue Ridge, Life Republic, and Megapolis.",
      },
      {
        question: "Is daytime vs nighttime sitting available?",
        answer:
          "Most placements are daytime shifts — ideal for WFH parents in the Hinjewadi IT Park corridor. Overnight needs can be discussed case by case.",
      },
      {
        question: "Can the babysitter also do light housework?",
        answer:
          "Yes — many placements include light kitchen tidying or feeding prep alongside childcare. We document the exact scope during onboarding.",
      },
      {
        question: "How do you handle emergencies?",
        answer:
          "Emergency contacts and preferred protocols are documented during enquiry so caretakers know exactly who to call. We also provide a direct SakhiHome support line.",
      },
      {
        question: "Can we do a trial visit first?",
        answer:
          "Yes — a short trial half-day helps align routines and build comfort before committing weekly. Most Hinjewadi families do a 2–3 hour trial before full onboarding.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. JAPA MAID (NEW)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "japa-maid",
    iconKey: "heart",
    title: "Japa Maid",
    tag: "Specialist",
    points: [
      "Postpartum mother & newborn care",
      "Baby bathing, massage & feeding support",
      "Traditional Japa diet & recovery routines",
    ],
    mobileSummary: "Specialist postpartum care for mother and newborn.",
    headline: "Japa Maid in Hinjewadi, Wakad & Baner, Pune",
    metaTitle:
      "Japa Maid in Hinjewadi Pune | Postpartum Care | Newborn Care | SakhiHome",
    metaDescription:
      "Hire an experienced Japa maid in Hinjewadi, Wakad & Baner, Pune. Postpartum mother care, newborn bathing, massage, feeding support & Japa diet. Background-verified. SakhiHome.",
    longDescription:
      "The weeks after delivery are precious — and exhausting. A Japa maid is a trained specialist who cares for both the new mother and newborn during the postpartum recovery period. SakhiHome connects families in Hinjewadi, Wakad, Baner, and Megapolis with experienced Japa maids who handle baby bathing, oil massage, swaddling, feeding support, diaper changes, and traditional Japa diet preparation for the mother. Most Japa placements run for 40 days (saade teen mahine) or a custom duration based on your needs.",
    keywords: [
      "Japa maid Hinjewadi",
      "Japa maid Wakad",
      "Japa maid Baner",
      "Japa maid Pune",
      "postpartum care maid Pune",
      "newborn care maid Hinjewadi",
      "baby care after delivery Pune",
      "maternity maid Pune",
      "japa seva Pune",
      "40 days maid after delivery Pune",
      "mother and baby care maid Pune",
      "postnatal maid Hinjewadi",
    ],
    marathiKeywords: [
      "japa bai Pune",
      "japa bai Hinjewadi",
      "prasuti seva bai Pune",
      "balantiniche kam bai Pune",
      "navjat bal sangopan Pune",
    ],
    relatedSearches: [
      "babysitter in Hinjewadi",
      "newborn care in Wakad",
      "postpartum care in Baner",
    ],
    priceRange: "₹12,000 – ₹20,000 / 40-day placement",
    searchIntent: "transactional",
    faq: [
      {
        question: "What exactly does a Japa maid do?",
        answer:
          "A Japa maid cares for the newborn and the recovering mother. Newborn duties include daily oil massage, bathing, swaddling, diaper changes, and feeding assistance. For the mother, she prepares traditional Japa diet meals (gond ladoo, methi dishes, warm foods) and supports rest and recovery routines.",
      },
      {
        question: "How long is a typical Japa maid placement?",
        answer:
          "Most Japa placements in Hinjewadi and Pune are for 40 days — the traditional postpartum recovery window. We also offer shorter 20-day or 30-day placements based on availability and your preference.",
      },
      {
        question: "Do Japa maids live in or visit daily?",
        answer:
          "Both options are available. Live-in Japa maids are more common for newborns requiring night feeds and attention. Daily visit Japa maids work 8–12 hour shifts. We confirm the arrangement at enquiry.",
      },
      {
        question: "Is the Japa maid experienced with hospital discharge routines?",
        answer:
          "Yes — experienced Japa maids in our network are familiar with hospital discharge protocols, cord care, weight monitoring cues, and when to alert parents or seek medical attention.",
      },
      {
        question: "How early should I book a Japa maid in Hinjewadi?",
        answer:
          "We recommend booking 3–4 weeks before your expected delivery date. Japa maids are in high demand in Hinjewadi and Wakad, especially in large societies like Life Republic, Blue Ridge, and Megapolis — early booking ensures availability.",
      },
      {
        question: "Can the Japa maid also help with household cooking for the family?",
        answer:
          "Many Japa maids handle light cooking for the family in addition to the mother's Japa diet. Confirm this scope during enquiry so we match you with someone experienced in both.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. ELDER CARE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "elder-care",
    iconKey: "heartHandshake",
    title: "Elder Care",
    points: [
      "Daily assistance & mobility help",
      "Companionship",
      "Medication reminders",
    ],
    mobileSummary: "Daily assistance, mobility help & companionship.",
    headline: "Elder Care Helpers & Companions in Hinjewadi, Pune",
    metaTitle:
      "Elder Care Maid in Hinjewadi Pune | Senior Care Helper | SakhiHome",
    metaDescription:
      "Compassionate elder care helpers in Hinjewadi, Wakad & Baner, Pune. Mobility support, daily assistance, medication reminders & companionship for elderly parents. SakhiHome.",
    longDescription:
      "Supporting elderly parents at home while managing an IT career requires patience and a reliable system. SakhiHome's elder care helpers in Hinjewadi, Wakad, and Baner are matched for respectful daily assistance — mobility support, hydration nudges, medication reminders, light housekeeping around medical routines, and consistent companionship that keeps spirits high. Our caretakers are experienced with senior routines in gated societies where families may not always be home.",
    keywords: [
      "elder care maid Hinjewadi",
      "elder care maid Pune",
      "senior care helper Hinjewadi",
      "old age care maid Pune",
      "caretaker for elderly Pune",
      "companion for elderly Pune",
      "patient caretaker Pune",
      "elderly assistance Hinjewadi",
      "old age helper Wakad",
      "senior companion maid Baner",
    ],
    marathiKeywords: [
      "vrddha sewa bai Pune",
      "aai baba seva Hinjewadi",
      "motha manasa sathi bai Pune",
    ],
    relatedSearches: [
      "full-time maid in Hinjewadi",
      "live-in maid in Wakad",
      "elder care in Baner",
    ],
    priceRange: "₹7,000 – ₹14,000/month",
    searchIntent: "mixed",
    faq: [
      {
        question: "What tasks do elder care helpers handle?",
        answer:
          "Daily assistance like bathing support, dressing, mobility cues, meal serving, hydration reminders, and companionship. Light housekeeping around medical equipment or routines is also common. Clinical nursing is outside SakhiHome's scope.",
      },
      {
        question: "Can someone live-in for overnight elder care in Hinjewadi?",
        answer:
          "Yes — live-in rotations are available for families who need nighttime presence. Room, sanitation, offs, and dietary preferences are clarified before placement.",
      },
      {
        question: "How do carers handle medications?",
        answer:
          "Carers offer pill organiser reminders and prompt reminders — dosing decisions remain family-directed. We document medication schedules during onboarding.",
      },
      {
        question: "What happens in a medical emergency?",
        answer:
          "Family contacts and preferred hospitals in Hinjewadi and nearby areas are documented during onboarding for fast escalation. Carers are briefed on when and how to alert family.",
      },
      {
        question: "How is this different from a nursing service?",
        answer:
          "Elder care helpers provide non-clinical daily assistance and companionship. For post-surgery or clinical nursing needs, you would need a registered nurse. Our service is ideal for independent or semi-dependent elderly parents.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. FULL-TIME MAID
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "full-time-maid",
    iconKey: "home",
    title: "Full-Time Maid",
    points: [
      "8–12 hour shifts",
      "Live-in option available",
      "All-round household help",
    ],
    mobileSummary: "8–12 hr shifts with live-in option available.",
    headline: "Full-Time Maid in Hinjewadi, Wakad & Baner, Pune",
    metaTitle:
      "Full Time Maid in Hinjewadi Pune | Live-in Maid | All-Day Help | SakhiHome",
    metaDescription:
      "Hire a full-time maid in Hinjewadi, Wakad & Baner, Pune. 8–12 hour shifts or live-in option. Cleaning, cooking, errands & all-round household help. Background-verified. SakhiHome.",
    longDescription:
      "Demanding weeks call for dependable all-day coverage. A full-time maid from SakhiHome handles your Hinjewadi or Wakad household from morning to evening — cleaning rotations, cooking, ironing, grocery errands, and vendor coordination. Whether you need 8-hour weekday coverage or a live-in arrangement for a large family in societies like Blue Ridge, Megapolis Splendour, or Life Republic, we match you with a verified, locally-sourced full-time maid who understands your household rhythm.",
    keywords: [
      "full time maid Hinjewadi",
      "full time maid Wakad",
      "full time maid Baner",
      "full time maid Pune",
      "live-in maid Pune",
      "full day maid Hinjewadi",
      "all day maid Pune",
      "permanent maid Pune",
      "10 hour maid Pune",
      "12 hour maid Hinjewadi",
      "full day bai Pune",
      "24 hour maid Pune",
    ],
    marathiKeywords: [
      "full time bai Hinjewadi",
      "sarvakalik bai Pune",
      "divsbhar bai Hinjewadi",
      "permanent bai Pune",
    ],
    relatedSearches: [
      "cook maid in Hinjewadi",
      "live-in maid in Wakad",
      "full-time maid in Baner",
    ],
    priceRange: "₹8,000 – ₹18,000/month",
    searchIntent: "transactional",
    faq: [
      {
        question: "What hours count as full-time in Hinjewadi?",
        answer:
          "Typical placements run 8–12 hour weekday shifts, usually 7 AM to 6 PM or 8 AM to 7 PM. Weekend coverage is negotiated separately based on your requirement.",
      },
      {
        question: "What is the salary for a full-time maid in Pune in 2026?",
        answer:
          "For 8–10 hour daily shifts in Hinjewadi, Wakad, and Baner, the market rate in 2026 is ₹10,000 to ₹17,000 per month depending on experience, tasks, and society location. Premium gated communities like Blue Ridge and Life Republic often have higher benchmarks.",
      },
      {
        question: "What are the accommodation expectations for live-in maids?",
        answer:
          "Families clarify room setup, sanitation access, weekly offs, dietary preferences, and safety protocols before the maid joins. Live-in placements work best with clear agreements from day one.",
      },
      {
        question: "Can I customise the tasks week by week?",
        answer:
          "Yes — many families run a rotating chore schedule. Mondays for wardrobe organising, Tuesdays for balcony and terrace, Wednesdays for deep kitchen — whatever works for your household.",
      },
      {
        question: "What if I need to end or change the placement?",
        answer:
          "We recommend aligned notice windows from both sides. SakhiHome handles the transition and matches you with a replacement — usually within 24–48 hours for high-priority cases in Hinjewadi.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. PART-TIME MAID
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "part-time-maid",
    iconKey: "clock",
    title: "Part-Time Maid",
    tag: "Flexible",
    points: [
      "Flexible 1–3 hr visits",
      "Choose tasks & timing",
      "Perfect for working families",
    ],
    mobileSummary: "Flexible 1–3 hr visits — choose your timing.",
    headline: "Part-Time Maid in Hinjewadi, Wakad & Baner, Pune",
    metaTitle:
      "Part Time Maid in Hinjewadi Pune | Hourly Maid | Morning Bai | SakhiHome",
    metaDescription:
      "Flexible part-time maids in Hinjewadi, Wakad & Baner, Pune. 1–3 hour visits, choose your tasks & timing. Ideal for working IT families. Background-verified. SakhiHome.",
    longDescription:
      "Not every chore needs eight hours — sometimes you just need ninety focused minutes of jhadu-pocha and kitchen tidying before the school bus arrives. SakhiHome lines up part-time maids (morning bai) in Hinjewadi, Wakad, Baner, and Megapolis tuned to your weekday windows. Choose your timing, pick your tasks, and scale up or down month to month without any long-term lock-in.",
    keywords: [
      "part time maid Hinjewadi",
      "part time maid Wakad",
      "part time maid Baner",
      "part time maid Pune",
      "hourly maid Pune",
      "morning maid Hinjewadi",
      "2 hour maid Pune",
      "part time bai Hinjewadi",
      "flexible maid Pune",
      "morning bai Wakad",
      "short shift maid Hinjewadi",
      "WFH friendly maid Pune",
    ],
    marathiKeywords: [
      "part time bai Hinjewadi",
      "subah ki bai Wakad",
      "thoda vel bai Pune",
      "kami velachi bai Hinjewadi",
    ],
    relatedSearches: [
      "house cleaning in Hinjewadi",
      "cook maid in Wakad",
      "part-time maid in Baner",
    ],
    priceRange: "₹2,500 – ₹5,000/month",
    searchIntent: "transactional",
    faq: [
      {
        question: "What is the minimum visit length for a part-time maid in Hinjewadi?",
        answer:
          "Most micro visits run 90–120 minutes, though we can arrange 60-minute slots for very focused tasks in Hinjewadi, Wakad, and Baner societies. Enquire for your specific requirement.",
      },
      {
        question: "Can I stack multiple tasks in one visit?",
        answer:
          "Absolutely — jhadu-pocha plus kitchen wipe-down plus folding laundry in one 2-hour slot is very common. We align the task list with the maid before the first visit.",
      },
      {
        question: "Is part-time maid timing WFH-friendly?",
        answer:
          "Yes — we align quiet hours so Zoom calls survive vacuum passes. Most Hinjewadi IT Park families prefer 7–9 AM or 12–2 PM slots. Just tell us your schedule.",
      },
      {
        question: "What about festival and holiday coverage?",
        answer:
          "Availability may reduce near Diwali, Ganesh Chaturthi, and other long weekends. We recommend enquiring 1–2 weeks early during festival seasons so we can confirm your maid's availability.",
      },
      {
        question: "Can I upgrade from part-time to full-time later?",
        answer:
          "Yes — many families start part-time and scale up. Just let us know and we'll match you with a verified full-time maid in your society when you're ready.",
      },
    ],
  },
] satisfies readonly ServiceRecord[];

// ─── Lookup helpers ────────────────────────────────────────────────────────────

const bySlug = new Map(services.map((s) => [s.slug, s] as const));

export function getServiceBySlug(slug: string): ServiceRecord | undefined {
  return bySlug.get(slug);
}

export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}