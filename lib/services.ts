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
 * - Expanded FAQ answers with location signals (South Mumbai, Chakala, Crawford, Mumbai)
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
  | "heart"
  | "handHeart";

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
  /** Marathi / Hindi search variants - use in alt text, copy, FAQ */
  marathiKeywords: string[];
  /** Anchor text for internal cross-linking between service pages */
  relatedSearches: string[];
  /** Price range string for schema markup + page copy */
  priceRange: string;
  /** Guides content tone: transactional = book now, informational = educate first */
  searchIntent: "transactional" | "informational" | "mixed";
  faq: ServiceFaq[];
};

export {
  CONTACT_PHONE_DISPLAY_IN,
  CONTACT_PHONE_E164,
  WHATSAPP,
  getWhatsAppHrefWithService,
} from "./contact";

export const BRAND_NAME = "SakhiHome";
export const AREA_SERVED_CITY = "Mumbai";
export const AREA_SERVED_LOCALITY = "South Mumbai";

/**
 * Absolute URL for canonicals, sitemaps, JSON-LD, and Open Graph metadata.
 *
 * Uses `||` (not `??`) so an **empty-string** env var falls through - `??` would keep `""`,
 * which produced relative URLs (`/services/...`) and broke `/sitemap.xml` in production.
 */
export function getAbsoluteSiteUrl(path = ""): string {
  const pathname = path.startsWith("/") ? path : path ? `/${path}` : "";

  const baseCandidate =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";

  const trimmed = baseCandidate.trim();
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const originUrl = new URL(withScheme);
    return `${originUrl.origin}${pathname}`;
  } catch {
    return `http://localhost:3000${pathname}`;
  }
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
    headline: "House Cleaning Maid in South Mumbai",
    metaTitle:
      "House Cleaning Maid in South Mumbai Mumbai | Cleaning Bai | SakhiHome",
    metaDescription:
      "Hire a trusted house cleaning maid in South Mumbai. Daily or alternate visits for sweeping, mopping, kitchen & bathroom. Verified cleaning bai - matched within hours. SakhiHome.",
    longDescription:
      "Keep your floors, surfaces, kitchen, and bathrooms spotless without the daily grind. SakhiHome matches you with reliable, background-verified cleaning maids (cleaning bai) who live near your society in South Mumbai, Chakala, Crawford, or Mazgaon - shorter commute means they show up on time, every time. Whether you need daily jhadu-pocha, deep kitchen scrubbing, or alternate-day upkeep, we build a schedule around your home and your routine.",
    keywords: [
      "house cleaning maid South Mumbai",
      "house cleaning maid Chakala",
      "house cleaning maid Crawford",
      "house cleaning maid Mumbai",
      "cleaning maid near me Mumbai",
      "cleaning bai South Mumbai",
      "jhadu pocha maid Mumbai",
      "kitchen cleaning maid Mumbai",
      "bathroom cleaning maid Mumbai",
      "daily cleaning maid South Mumbai",
      "deep cleaning service South Mumbai",
      "sweeping mopping maid Mumbai",
    ],
    marathiKeywords: [
      "cleaning bai South Mumbai",
      "jhadu pocha bai Mumbai",
      "swachhata bai Mumbai",
      "ghar safai bai South Mumbai",
    ],
    relatedSearches: [
      "part-time maid in South Mumbai",
      "full-time maid in Chakala",
      "house cleaning in Crawford",
    ],
    priceRange: "₹3,000 - ₹6,000/month",
    searchIntent: "transactional",
    faq: [
      {
        question: "How often can I book house cleaning in South Mumbai?",
        answer:
          "You can arrange daily visits, alternate days, weekly deep cleans, or a custom rhythm to suit your work schedule. Most families in Mohammad Ali, Nagdevi, and Crawford prefer daily morning slots before office hours.",
      },
      {
        question: "What areas do you clean inside the home?",
        answer:
          "Typically living areas, bedrooms, kitchen, bathrooms, balconies, and common surfaces. We align scope during booking based on home size - 1 BHK through 4 BHK buildings near Crawford, Mazgaon, and Mohammad Ali Road.",
      },
      {
        question: "Do you supply cleaning materials?",
        answer:
          "Most families prefer supplies they already trust at home. We clarify mop, disinfectant, and tool expectations when you enquire - no surprises.",
      },
      {
        question: "Are cleaners background verified?",
        answer:
          "Yes - every cleaning maid in SakhiHome's South Mumbai and Chakala network is ID and address verified before placement. You can also ask for a trial visit before committing.",
      },
      {
        question: "What if my cleaning maid doesn't show up?",
        answer:
          "We arrange a verified replacement within 24-48 hours. One call to SakhiHome is all it takes - no chasing, no waiting.",
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
    headline: "Cook Maid in South Mumbai",
    metaTitle:
      "Cook Maid in South Mumbai Mumbai | Swayampak Bai | Daily Home Cook | SakhiHome",
    metaDescription:
      "Hire a skilled cook maid (swayampak bai) in South Mumbai. Daily home-style meals - veg, non-veg, Jain, regional menus. Background-verified, fast matching. SakhiHome.",
    longDescription:
      "Nutritious, home-style food should match your family's taste - not compromise it. SakhiHome connects IT Park families in South Mumbai with experienced cook maids (swayampak bai) for daily lunches and dinners. From Maharashtrian staples to north Indian, south Indian, Jain, and custom diet menus - we document your preferences upfront so the first meal feels familiar. Most cook maids cover breakfast, lunch, and dinner prep with leftovers planning built in.",
    keywords: [
      "cook maid South Mumbai",
      "cook maid Chakala",
      "cook maid Crawford",
      "cook maid Mumbai",
      "home cook South Mumbai",
      "daily cook South Mumbai",
      "cooking bai Mumbai",
      "swayampak bai Mumbai",
      "veg cook maid Mumbai",
      "Jain cook maid Mumbai",
      "cook and clean maid South Mumbai",
      "meal prep maid Mumbai",
    ],
    marathiKeywords: [
      "swayampak bai South Mumbai",
      "swayampak bai Mumbai",
      "khana banane wali bai Mumbai",
      "cooking bai Chakala",
      "jeva bai South Mumbai",
    ],
    relatedSearches: [
      "full-time maid with cooking in South Mumbai",
      "part-time cook maid in Chakala",
      "cook maid in Crawford",
    ],
    priceRange: "₹4,000 - ₹9,000/month",
    searchIntent: "transactional",
    faq: [
      {
        question: "Can the cook maid adapt to allergies or Jain meals?",
        answer:
          "Yes - dietary notes, allergies, and regional preferences are documented upfront when you send an enquiry. We have cook maids in South Mumbai experienced with Jain, vegan, diabetic-friendly, and low-oil diets.",
      },
      {
        question: "Is grocery shopping included?",
        answer:
          "Scope varies. Some placements include market runs; we confirm errands, timings, and kitchen workflow during onboarding. Many South Mumbai and Chakala families pair grocery delivery apps with their cook maid for efficiency.",
      },
      {
        question: "Can I get breakfast, lunch, and dinner covered?",
        answer:
          "Yes - you can prioritise specific meals. Most IT Park families in South Mumbai anchor lunch and dinner prep, with breakfast being optional. Leftover planning for next-day lunches is common.",
      },
      {
        question: "What if the food quality or taste doesn't match?",
        answer:
          "We focus on continuity. If chemistry or taste mismatches arise after the trial period, contact us and we'll re-align your placement with a better-matched cook maid nearby.",
      },
      {
        question: "How quickly can I get a cook maid in South Mumbai?",
        answer:
          "Most placements happen within 24-48 hours of your enquiry. We prioritise maids who live near your building - Mazgaon, Crawford, Nagdevi - so travel time is minimal.",
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
    headline: "Nanny & Babysitter for Child Care at Home in South Mumbai, Mumbai",
    metaTitle:
      "Nanny & Babysitter in South Mumbai Mumbai | Infant & Toddler Care Maid | SakhiHome",
    metaDescription:
      "Hire a trusted nanny or babysitter in South Mumbai - daytime visits or longer placements, infant & toddler care, ayah/aaya-style home help, after-school supervision. Background-verified caretakers. SakhiHome.",
    longDescription:
      "Peace of mind matters most when you're juggling WFH meetings and your little one's routine. SakhiHome connects South Mumbai families with trained babysitters and home nannies for supervised daytime care, calm handovers when you're at the IT Park, and dependable coverage for toddlers and school-age kids when schedules slip. We match for newborn-friendly routines through preschool and after-school windows - feeding support, naps, diapering, supervised play, and gentle structure while parents work.\n\nMany families want visiting help a few hours a day; others prefer a longer daytime shift or a live-in nanny arrangement when continuity matters. Every profile we shortlist is background-verified, and you can start with a short trial so chemistry, hours, and duties (including light feeding prep or tidy-up around the child) are clear before you commit.",
    keywords: [
      "babysitter South Mumbai",
      "babysitter Chakala",
      "babysitter Crawford",
      "babysitter Mumbai",
      "nanny South Mumbai",
      "nanny Chakala",
      "nanny Crawford",
      "nanny Mumbai",
      "nanny near me Mumbai",
      "live-in nanny Mumbai",
      "full-time nanny South Mumbai",
      "part-time nanny Mumbai",
      "daytime nanny Chakala",
      "baby care maid Mumbai",
      "infant care maid South Mumbai",
      "child maid South Mumbai",
      "newborn care maid Mumbai",
      "daytime babysitter Chakala",
      "child caretaker South Mumbai",
      "baby sitter near me Mumbai",
      "ayah for baby Mumbai",
      "aaya for baby South Mumbai",
      "toddler care at home Mumbai",
      "after school babysitter Mumbai",
      "childcare maid Mumbai",
      "domestic help with childcare Mumbai",
    ],
    marathiKeywords: [
      "bal sangopan bai Mumbai",
      "baby sambhal wali bai South Mumbai",
      "lahan mulanche care Mumbai",
      "aaya bai Mumbai",
      "aayi bai South Mumbai",
      "bal palak bai Mumbai",
      "mulanche pahara Chakala",
      "bal tyanche palak Mumbai",
    ],
    relatedSearches: [
      "Japa maid in South Mumbai",
      "Full-time maid in South Mumbai",
      "Part-time maid in Chakala",
      "Elder care in Crawford",
      "Cooking services in Mumbai",
      "House cleaning in South Mumbai",
    ],
    priceRange: "₹6,000 - ₹12,000/month",
    searchIntent: "mixed",
    faq: [
      {
        question: "What ages do you cover for babysitting in South Mumbai?",
        answer:
          "Newborns through school-age children. Duties are matched when you enquire - feeding support, diapering, nap routines, and supervised play for toddlers in buildings near Crawford, Nagdevi, and Mazgaon.",
      },
      {
        question: "Is daytime vs nighttime sitting available?",
        answer:
          "Most placements are daytime shifts - ideal for WFH parents in the South Mumbai corridor. Overnight needs can be discussed case by case.",
      },
      {
        question: "Can the babysitter also do light housework?",
        answer:
          "Yes - many placements include light kitchen tidying or feeding prep alongside childcare. We document the exact scope during onboarding.",
      },
      {
        question: "How do you handle emergencies?",
        answer:
          "Emergency contacts and preferred protocols are documented during enquiry so caretakers know exactly who to call. We also provide a direct SakhiHome support line.",
      },
      {
        question: "Can we do a trial visit first?",
        answer:
          "Yes - a short trial half-day helps align routines and build comfort before committing weekly. Most South Mumbai families do a 2-3 hour trial before full onboarding.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. JAPA MAID (NEW)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "japa-maid",
    iconKey: "handHeart",
    title: "Japa Maid",
    tag: "Specialist",
    points: [
      "Mother & newborn care after delivery",
      "Traditional Japa diet, massage & baby routines",
      "Short-term 40-day specialist-not daily housekeeping",
    ],
    mobileSummary: "Postpartum specialist for mother & baby-not a regular full-time maid.",
    headline: "Japa Maid in South Mumbai",
    metaTitle:
      "Japa Maid in South Mumbai Mumbai | Postpartum Care | Newborn Care | SakhiHome",
    metaDescription:
      "Hire an experienced Japa maid in South Mumbai. Postpartum mother care, newborn bathing, massage, feeding support & Japa diet. Background-verified. SakhiHome.",
    longDescription:
      "The weeks after delivery are precious - and exhausting. A Japa maid is a trained specialist who cares for both the new mother and newborn during the postpartum recovery period. SakhiHome connects families in South Mumbai with experienced Japa maids who handle baby bathing, oil massage, swaddling, feeding support, diaper changes, and traditional Japa diet preparation for the mother. Most Japa placements run for 40 days (saade teen mahine) or a custom duration based on your needs.",
    keywords: [
      "Japa maid South Mumbai",
      "Japa maid Chakala",
      "Japa maid Crawford",
      "Japa maid Mumbai",
      "postpartum care maid Mumbai",
      "newborn care maid South Mumbai",
      "baby care after delivery Mumbai",
      "maternity maid Mumbai",
      "japa seva Mumbai",
      "40 days maid after delivery Mumbai",
      "mother and baby care maid Mumbai",
      "postnatal maid South Mumbai",
    ],
    marathiKeywords: [
      "japa bai Mumbai",
      "japa bai South Mumbai",
      "prasuti seva bai Mumbai",
      "balantiniche kam bai Mumbai",
      "navjat bal sangopan Mumbai",
    ],
    relatedSearches: [
      "babysitter in South Mumbai",
      "newborn care in Chakala",
      "postpartum care in Crawford",
    ],
    priceRange: "₹12,000 - ₹20,000 / 40-day placement",
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
          "Most Japa placements in South Mumbai and Mumbai are for 40 days - the traditional postpartum recovery window. We also offer shorter 20-day or 30-day placements based on availability and your preference.",
      },
      {
        question: "Do Japa maids live in or visit daily?",
        answer:
          "Both options are available. Live-in Japa maids are more common for newborns requiring night feeds and attention. Daily visit Japa maids work 8-12 hour shifts. We confirm the arrangement at enquiry.",
      },
      {
        question: "Is the Japa maid experienced with hospital discharge routines?",
        answer:
          "Yes - experienced Japa maids in our network are familiar with hospital discharge protocols, cord care, weight monitoring cues, and when to alert parents or seek medical attention.",
      },
      {
        question: "How early should I book a Japa maid in South Mumbai?",
        answer:
          "We recommend booking 3-4 weeks before your expected delivery date. Japa maids are in high demand in South Mumbai and Chakala, especially near Crawford, Mohammad Ali, and Mazgaon - early booking ensures availability.",
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
    headline: "Elder Care Helpers & Companions in South Mumbai, Mumbai",
    metaTitle:
      "Elder Care Maid in South Mumbai Mumbai | Senior Care Helper | SakhiHome",
    metaDescription:
      "Compassionate elder care helpers in South Mumbai. Mobility support, daily assistance, medication reminders & companionship for elderly parents. SakhiHome.",
    longDescription:
      "Supporting elderly parents at home while managing an IT career requires patience and a reliable system. SakhiHome's elder care helpers in South Mumbai are matched for respectful daily assistance - mobility support, hydration nudges, medication reminders, light housekeeping around medical routines, and consistent companionship that keeps spirits high. Our caretakers are experienced with senior routines in gated societies where families may not always be home.",
    keywords: [
      "elder care maid South Mumbai",
      "elder care maid Mumbai",
      "senior care helper South Mumbai",
      "old age care maid Mumbai",
      "caretaker for elderly Mumbai",
      "companion for elderly Mumbai",
      "patient caretaker Mumbai",
      "elderly assistance South Mumbai",
      "old age helper Chakala",
      "senior companion maid Crawford",
    ],
    marathiKeywords: [
      "vrddha sewa bai Mumbai",
      "aai baba seva South Mumbai",
      "motha manasa sathi bai Mumbai",
    ],
    relatedSearches: [
      "full-time maid in South Mumbai",
      "live-in maid in Chakala",
      "elder care in Crawford",
    ],
    priceRange: "₹7,000 - ₹14,000/month",
    searchIntent: "mixed",
    faq: [
      {
        question: "What tasks do elder care helpers handle?",
        answer:
          "Daily assistance like bathing support, dressing, mobility cues, meal serving, hydration reminders, and companionship. Light housekeeping around medical equipment or routines is also common. Clinical nursing is outside SakhiHome's scope.",
      },
      {
        question: "Can someone live-in for overnight elder care in South Mumbai?",
        answer:
          "Yes - live-in rotations are available for families who need nighttime presence. Room, sanitation, offs, and dietary preferences are clarified before placement.",
      },
      {
        question: "How do carers handle medications?",
        answer:
          "Carers offer pill organiser reminders and prompt reminders - dosing decisions remain family-directed. We document medication schedules during onboarding.",
      },
      {
        question: "What happens in a medical emergency?",
        answer:
          "Family contacts and preferred hospitals in South Mumbai and nearby areas are documented during onboarding for fast escalation. Carers are briefed on when and how to alert family.",
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
    tag: "All-round",
    points: [
      "Ongoing full-day household help",
      "Cleaning, cooking, laundry & errands",
      "8-12 hour shifts or live-in",
    ],
    mobileSummary: "Year-round maid for cleaning, cooking & home duties-not postpartum-only.",
    headline: "Full-Time Maid in South Mumbai",
    metaTitle:
      "Full Time Maid in South Mumbai Mumbai | Live-in Maid | All-Day Help | SakhiHome",
    metaDescription:
      "Hire a full-time maid in South Mumbai. 8-12 hour shifts or live-in option. Cleaning, cooking, errands & all-round household help. Background-verified. SakhiHome.",
    longDescription:
      "Demanding weeks call for dependable all-day coverage. A full-time maid from SakhiHome handles your South Mumbai or Chakala household from morning to evening - cleaning rotations, cooking, ironing, grocery errands, and vendor coordination. Whether you need 8-hour weekday coverage or a live-in arrangement for a large family near Crawford, Mazgaon, or Mohammad Ali Road, we match you with a verified, locally-sourced full-time maid who understands your household rhythm.",
    keywords: [
      "full time maid South Mumbai",
      "full time maid Chakala",
      "full time maid Crawford",
      "full time maid Mumbai",
      "live-in maid Mumbai",
      "full day maid South Mumbai",
      "all day maid Mumbai",
      "permanent maid Mumbai",
      "10 hour maid Mumbai",
      "12 hour maid South Mumbai",
      "full day bai Mumbai",
      "24 hour maid Mumbai",
    ],
    marathiKeywords: [
      "full time bai South Mumbai",
      "sarvakalik bai Mumbai",
      "divsbhar bai South Mumbai",
      "permanent bai Mumbai",
    ],
    relatedSearches: [
      "cook maid in South Mumbai",
      "live-in maid in Chakala",
      "full-time maid in Crawford",
    ],
    priceRange: "₹8,000 - ₹18,000/month",
    searchIntent: "transactional",
    faq: [
      {
        question: "What hours count as full-time in South Mumbai?",
        answer:
          "Typical placements run 8-12 hour weekday shifts, usually 7 AM to 6 PM or 8 AM to 7 PM. Weekend coverage is negotiated separately based on your requirement.",
      },
      {
        question: "What is the salary for a full-time maid in Mumbai in 2026?",
        answer:
          "For 8-10 hour daily shifts in South Mumbai, the market rate in 2026 is ₹10,000 to ₹17,000 per month depending on experience, tasks, and building location. Premium towers near Crawford and Fort often have higher benchmarks.",
      },
      {
        question: "What are the accommodation expectations for live-in maids?",
        answer:
          "Families clarify room setup, sanitation access, weekly offs, dietary preferences, and safety protocols before the maid joins. Live-in placements work best with clear agreements from day one.",
      },
      {
        question: "Can I customise the tasks week by week?",
        answer:
          "Yes - many families run a rotating chore schedule. Mondays for wardrobe organising, Tuesdays for balcony and terrace, Wednesdays for deep kitchen - whatever works for your household.",
      },
      {
        question: "What if I need to end or change the placement?",
        answer:
          "We recommend aligned notice windows from both sides. SakhiHome handles the transition and matches you with a replacement - usually within 24-48 hours for high-priority cases in South Mumbai.",
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
      "Flexible 1-3 hr visits",
      "Choose tasks & timing",
      "Perfect for working families",
    ],
    mobileSummary: "Flexible 1-3 hr visits - choose your timing.",
    headline: "Part-Time Maid in South Mumbai",
    metaTitle:
      "Part Time Maid in South Mumbai Mumbai | Hourly Maid | Morning Bai | SakhiHome",
    metaDescription:
      "Flexible part-time maids in South Mumbai. 1-3 hour visits, choose your tasks & timing. Ideal for working IT families. Background-verified. SakhiHome.",
    longDescription:
      "Not every chore needs eight hours - sometimes you just need ninety focused minutes of jhadu-pocha and kitchen tidying before the school bus arrives. SakhiHome lines up part-time maids (morning bai) in South Mumbai tuned to your weekday windows. Choose your timing, pick your tasks, and scale up or down month to month without any long-term lock-in.",
    keywords: [
      "part time maid South Mumbai",
      "part time maid Chakala",
      "part time maid Crawford",
      "part time maid Mumbai",
      "hourly maid Mumbai",
      "morning maid South Mumbai",
      "2 hour maid Mumbai",
      "part time bai South Mumbai",
      "flexible maid Mumbai",
      "morning bai Chakala",
      "short shift maid South Mumbai",
      "WFH friendly maid Mumbai",
    ],
    marathiKeywords: [
      "part time bai South Mumbai",
      "subah ki bai Chakala",
      "thoda vel bai Mumbai",
      "kami velachi bai South Mumbai",
    ],
    relatedSearches: [
      "house cleaning in South Mumbai",
      "cook maid in Chakala",
      "part-time maid in Crawford",
    ],
    priceRange: "₹2,500 - ₹5,000/month",
    searchIntent: "transactional",
    faq: [
      {
        question: "What is the minimum visit length for a part-time maid in South Mumbai?",
        answer:
          "Most micro visits run 90-120 minutes, though we can arrange 60-minute slots for very focused tasks in South Mumbai societies. Enquire for your specific requirement.",
      },
      {
        question: "Can I stack multiple tasks in one visit?",
        answer:
          "Absolutely - jhadu-pocha plus kitchen wipe-down plus folding laundry in one 2-hour slot is very common. We align the task list with the maid before the first visit.",
      },
      {
        question: "Is part-time maid timing WFH-friendly?",
        answer:
          "Yes - we align quiet hours so Zoom calls survive vacuum passes. Most South Mumbai families prefer 7-9 AM or 12-2 PM slots. Just tell us your schedule.",
      },
      {
        question: "What about festival and holiday coverage?",
        answer:
          "Availability may reduce near Diwali, Ganesh Chaturthi, and other long weekends. We recommend enquiring 1-2 weeks early during festival seasons so we can confirm your maid's availability.",
      },
      {
        question: "Can I upgrade from part-time to full-time later?",
        answer:
          "Yes - many families start part-time and scale up. Just let us know and we'll match you with a verified full-time maid in your society when you're ready.",
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

export function findServiceSlugByLabel(label: string): string | undefined {
  const l = label.toLowerCase();
  return services.find(
    (s) => l.includes(s.slug) || l.includes(s.title.toLowerCase())
  )?.slug;
}