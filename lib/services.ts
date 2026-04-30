/**
 * Canonical service catalog + SEO payload (single source of truth).
 * Icons used in UI map `iconKey` to lucide-react in `Services.tsx`.
 */

export type ServiceIconKey = "sparkles" | "chefHat" | "baby" | "heartHandshake" | "home" | "clock";

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
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const trimmed = base.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${trimmed}${p}`;
}

export const SERVICE_SLUGS = [
  "house-cleaning",
  "cooking-services",
  "babysitting",
  "elder-care",
  "full-time-maid",
  "part-time-maid",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const services: readonly ServiceRecord[] = [
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
    headline: "Professional House Cleaning in Hinjewadi, Pune",
    metaTitle: "House Cleaning Service in Hinjewadi, Pune | SakhiHome",
    metaDescription:
      "Trusted house cleaning maids in Hinjewadi and Pune west — sweeping, mopping, kitchens & baths. Daily or alternate schedules with SakhiHome.",
    longDescription:
      "Keep floors, surfaces, kitchens, and bathrooms fresh without the daily grind. Our house cleaning bookings match you with reliable maids suited to your Pune home routine — whether you need sweeping, deep mopping, or regular upkeep on a cadence that works for your family.",
    faq: [
      {
        question: "How often can I book house cleaning?",
        answer:
          "You can arrange daily visits, alternate days, weekly deep cleans, or a custom rhythm. Tell us your preferred schedule during enquiry.",
      },
      {
        question: "What areas do you clean?",
        answer:
          "Typically living areas, kitchens, bathrooms, balconies, and common surfaces — we align scope during booking based on home size and your priorities.",
      },
      {
        question: "Do you supply cleaning materials?",
        answer:
          "Many families prefer supplies they already trust at home; we clarify mop, disinfectant, and tool expectations when you enquire.",
      },
      {
        question: "Are cleaners verified?",
        answer:
          "Yes — SakhiHome focuses on vetted placements and continuity so you speak to the same household context every time.",
      },
    ],
  },
  {
    slug: "cooking-services",
    iconKey: "chefHat",
    title: "Cooking Services",
    tag: "Popular",
    points: [
      "Daily home-style meals",
      "Custom menu preferences",
      "Veg, non-veg, regional cuisines",
    ],
    mobileSummary: "Home-style meals, custom menu, any cuisine.",
    headline: "Home-Cooked Meals & Cooking Help in Hinjewadi, Pune",
    metaTitle: "Cook Maid & Home Meals in Hinjewadi, Pune | SakhiHome",
    metaDescription:
      "Hire skilled cooking maids in Hinjewadi and Pune west for daily meals — veg/non-veg, regional menus, allergies and preferences matched.",
    longDescription:
      "Nutritious, home-style food should match your family's preferences. We help you find cooking support in Pune for daily lunches and dinners — from Maharashtra classics to veg, non-veg, and speciality diets.",
    faq: [
      {
        question: "Can the cook adapt to allergies or Jain meals?",
        answer:
          "Yes — dietary notes and regional preferences can be documented up front when you send an enquiry.",
      },
      {
        question: "Is grocery shopping included?",
        answer:
          "Scope varies — some placements include errands; we confirm errands, timings, and kitchen workflow during onboarding.",
      },
      {
        question: "Breakfast, lunch, and dinner?",
        answer:
          "You can prioritise portions of the day; many Pune families anchor lunch+dinner prep with leftovers planning.",
      },
      {
        question: "Trial or replacement support?",
        answer:
          "We focus on continuity. If chemistry or timing mismatches arise, enquire so we can re-align placements.",
      },
    ],
  },
  {
    slug: "babysitting",
    iconKey: "baby",
    title: "Babysitting",
    points: ["Newborn & infant care", "Daytime supervision", "Trained, gentle caretakers"],
    mobileSummary: "Trained caretakers for infants & daytime care.",
    headline: "Babysitting & Child Care at Home in Hinjewadi, Pune",
    metaTitle: "Babysitting & Infant Care in Hinjewadi, Pune | SakhiHome",
    metaDescription:
      "Trusted babysitting help for infants and toddlers in Hinjewadi and Pune west — daytime care, newborn routines, supervised play, and gentle handovers.",
    longDescription:
      "Peace of mind matters when juggling work-school routines. SakhiHome connects Pune families with trained babysitters for supervised care, newborn-friendly routines, and calm transitions while you're at meetings or errands.",
    faq: [
      {
        question: "What ages do you cover?",
        answer:
          "Newborns through school-age childcare — timelines and duties are matched when you enquire (feeding support, diapering naps, play).",
      },
      {
        question: "Night vs daytime sits?",
        answer:
          "Most placements start with daytime shifts; overnight needs can be discussed case-by-case for continuity.",
      },
      {
        question: "Emergency pick-up support?",
        answer:
          "We document emergency contacts during enquiry so carers know escalation paths authorised by guardians.",
      },
      {
        question: "Trial half-days?",
        answer:
          "Yes — short trial windows help align routines before committing weekly.",
      },
    ],
  },
  {
    slug: "elder-care",
    iconKey: "heartHandshake",
    title: "Elder Care",
    points: ["Daily assistance & mobility help", "Companionship", "Medication reminders"],
    mobileSummary: "Daily assistance, mobility help & companionship.",
    headline: "Elder Care Assistants & Companions in Hinjewadi, Pune",
    metaTitle: "Elder Care Help at Home in Hinjewadi, Pune | SakhiHome",
    metaDescription:
      "Compassionate elder care helpers in Hinjewadi and Pune west — mobility support, daily routines, reminders, and companionship.",
    longDescription:
      "Supporting parents or elders at home blends patience with practicality. Elder care placements emphasise respectful assistance — mobility cues, housekeeping around medical routines, hydration nudges, and friendly companionship that keeps spirits high.",
    faq: [
      {
        question: "Clinical tasks vs housekeeping?",
        answer:
          "Assistants coordinate with families for ADLs-lite and household support; clinical nursing stays outside SakhiHome's scope.",
      },
      {
        question: "Can someone live-in?",
        answer:
          "Live-in rotations can be explored where families need nighttime presence — schedule details clarified at enquiry.",
      },
      {
        question: "How do carers handle medications?",
        answer:
          "We recommend pill organisers and carers offer reminder prompts — dosing decisions remain medical/family-directed.",
      },
      {
        question: "Emergency protocols?",
        answer:
          "Family contacts and preferred hospitals documented during onboarding for fast escalations.",
      },
    ],
  },
  {
    slug: "full-time-maid",
    iconKey: "home",
    title: "Full-Time Maid",
    points: ["8–12 hour shifts", "Live-in option available", "All-round household help"],
    mobileSummary: "8–12 hr shifts with live-in option available.",
    headline: "Full-Time Maid Services in Hinjewadi, Pune Households",
    metaTitle: "Full-Time Maid Service in Hinjewadi, Pune | SakhiHome",
    metaDescription:
      "Hire full-time domestic help in Hinjewadi and Pune west — 8–12 hour shifts or live-in, cleaning, errands, and multitask support.",
    longDescription:
      "Heavy weeks call for dependable full-time maid coverage — cleaning rotations, ironing, errands, groceries, vendor coordination — whatever keeps your Pune floor running smoother. Discuss shift length vs live-in with our team upfront.",
    faq: [
      {
        question: "What hours count as full-time?",
        answer:
          "Typical placements run 8–12 hour weekdays; weekend coverage negotiated separately.",
      },
      {
        question: "Accommodation expectations for live-ins?",
        answer:
          "Families clarify room, sanitation, offs, dietary preferences, safety protocols before onboarding.",
      },
      {
        question: "Notice periods?",
        answer:
          "We recommend aligned notice windows from both households and carers for smooth replacements.",
      },
      {
        question: "Can tasks rotate weekly?",
        answer:
          "Yes — create a rolling chore slate so Mondays focus on wardrobes, Tuesdays on balcony scrubs — whatever matters.",
      },
    ],
  },
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
    headline: "Part-Time Maid Help for Busy Hinjewadi, Pune Families",
    metaTitle: "Part-Time Maid Service in Hinjewadi, Pune | SakhiHome",
    metaDescription:
      "Flexible 1–3 hour maid visits in Hinjewadi and Pune west — weekday slots and focused tasks for working professionals.",
    longDescription:
      "Not every chore needs eight hours — sometimes you simply need ninety focused minutes folding laundry before the school bus returns. SakhiHome lines up part-time maids tuned to weekday windows.",
    faq: [
      {
        question: "Minimum visit length?",
        answer:
          "Most micro visits run 90–180 minutes depending on locality and scope — enquire for micro-slots.",
      },
      {
        question: "Can I stack multiple micro tasks?",
        answer:
          "Yes — ironing + kitchen wipe-down + organising dry balcony plants in one swoop.",
      },
      {
        question: "Work-from-home friendly timing?",
        answer:
          "We align quiet-hours so Zoom calls survive vacuum passes.",
      },
      {
        question: "Holiday coverage?",
        answer:
          "Festivals may affect availability — enquire early near Diwali/long weekends.",
      },
    ],
  },
] satisfies readonly ServiceRecord[];

const bySlug = new Map(services.map((s) => [s.slug, s] as const));

export function getServiceBySlug(slug: string): ServiceRecord | undefined {
  return bySlug.get(slug);
}

export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}
