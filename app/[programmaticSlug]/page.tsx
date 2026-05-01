import type { Metadata } from "next";
import { Clock3, MapPin, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

import Footer from "@/app/components/site/Footer";
import LocalProgrammaticTemplate, {
  type LocalProgrammaticTemplateData,
} from "@/app/components/site/LocalProgrammaticTemplate";
import Navbar from "@/app/components/site/Navbar";
import StickyWhatsApp from "@/app/components/site/StickyWhatsApp";
import { AREAS, getAreaBySlug, getAllSocietySlugs, getSocietyBySlug } from "@/lib/areas";
import {
  AREA_SERVED_CITY,
  AREA_SERVED_LOCALITY,
  BRAND_NAME,
  getAbsoluteSiteUrl,
  getAllServiceSlugs,
  getServiceBySlug,
  getWhatsAppHrefWithService,
  services,
} from "@/lib/services";

type PageProps = { params: Promise<{ programmaticSlug: string }> };

type ResolvedRoute =
  | { kind: "service-area"; serviceSlug: string; areaSlug: string }
  | { kind: "area"; areaSlug: string }
  | { kind: "society"; societySlug: string };

type BreadcrumbItem = { name: string; item: string };

const defaultBlob = "/assets/blobs/color_grunge_pattern_liquidity_style_background.jpg";
const defaultDoodle = "/assets/doodles/cleaning service-amico.svg";

const serviceVisuals: Record<string, { blob: string; doodle: string }> = {
  "house-cleaning": {
    blob: "/assets/blobs/color_grunge_pattern_liquidity_style_background.jpg",
    doodle: "/assets/doodles/cleaning service-amico.svg",
  },
  "cooking-services": {
    blob: "/assets/blobs/254596558522.jpg",
    doodle: "/assets/doodles/Cooking-bro.svg",
  },
  babysitting: {
    blob: "/assets/blobs/063602423687.jpg",
    doodle: "/assets/doodles/cleaning service-amico.svg",
  },
  "japa-maid": {
    blob: "/assets/blobs/063602423687.jpg",
    doodle: "/assets/doodles/cleaning service-amico.svg",
  },
  "elder-care": {
    blob: "/assets/blobs/063602423687.jpg",
    doodle: "/assets/doodles/Dementia-amico.svg",
  },
  "full-time-maid": {
    blob: "/assets/blobs/254596558522.jpg",
    doodle: "/assets/doodles/Cooking-bro.svg",
  },
  "part-time-maid": {
    blob: "/assets/blobs/color_grunge_pattern_liquidity_style_background.jpg",
    doodle: "/assets/doodles/cleaning service-amico.svg",
  },
};

const trustHighlights = [
  {
    icon: ShieldCheck,
    title: "Verified professionals",
    description:
      "Background-verified candidates shortlisted for your household preferences.",
  },
  {
    icon: Clock3,
    title: "Fast matching support",
    description:
      "Most families get relevant options quickly with a guided matching process.",
  },
  {
    icon: MapPin,
    title: `Local to ${AREA_SERVED_LOCALITY}`,
    description:
      "Location-aware matching helps with reliability, timing, and continuity.",
  },
];

const genericAreaFaq: LocalProgrammaticTemplateData["faqItems"] = [
  {
    question: "How quickly can I get a maid in this area?",
    answer:
      "Most enquiries receive matching options within hours, depending on schedule and service requirements.",
  },
  {
    question: "Are maids background verified?",
    answer:
      "Yes. We prioritize verified profiles and local matching to support reliability and continuity.",
  },
  {
    question: "Do you offer replacement support?",
    answer:
      "Yes. If availability changes, our team assists with replacement options as quickly as possible.",
  },
  {
    question: "Which services are available in this area?",
    answer:
      "House cleaning, cooking, babysitting, elder support, and full-time or part-time domestic help are available based on local availability.",
  },
];

const genericSocietyFaq: LocalProgrammaticTemplateData["faqItems"] = [
  {
    question: "Can I book a maid specifically for this society?",
    answer:
      "Yes. We can prioritize options suitable for households in this society and nearby localities.",
  },
  {
    question: "Do you provide part-time and full-time options?",
    answer:
      "Yes. Both part-time and full-time options can be discussed based on your routine and household needs.",
  },
  {
    question: "How do I start the booking process?",
    answer:
      "Share your requirements through enquiry or WhatsApp and our team will suggest suitable profiles.",
  },
  {
    question: "What if my timing requirements change later?",
    answer:
      "Our team helps with schedule adjustments and replacement coordination whenever feasible.",
  },
];

function resolveProgrammaticSlug(slug: string): ResolvedRoute | null {
  const maidPrefix = "maid-service-in-";
  if (slug.startsWith(maidPrefix)) {
    const token = slug.slice(maidPrefix.length);
    if (!token) return null;
    if (getAreaBySlug(token)) return { kind: "area", areaSlug: token };
    if (getSocietyBySlug(token)) return { kind: "society", societySlug: token };
    return null;
  }

  for (const serviceSlug of getAllServiceSlugs()) {
    const prefix = `${serviceSlug}-in-`;
    if (slug.startsWith(prefix)) {
      const areaSlug = slug.slice(prefix.length);
      if (getAreaBySlug(areaSlug)) {
        return { kind: "service-area", serviceSlug, areaSlug };
      }
    }
  }
  return null;
}

export function generateStaticParams() {
  const params: { programmaticSlug: string }[] = [];

  for (const area of AREAS) {
    params.push({ programmaticSlug: `maid-service-in-${area.slug}` });
  }

  for (const serviceSlug of getAllServiceSlugs()) {
    for (const area of AREAS) {
      params.push({ programmaticSlug: `${serviceSlug}-in-${area.slug}` });
    }
  }

  for (const societySlug of getAllSocietySlugs()) {
    params.push({ programmaticSlug: `maid-service-in-${societySlug}` });
  }

  return params;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { programmaticSlug } = await props.params;
  const resolved = resolveProgrammaticSlug(programmaticSlug);
  if (!resolved) return {};

  const canonical = getAbsoluteSiteUrl(`/${programmaticSlug}`);

  if (resolved.kind === "service-area") {
    const service = getServiceBySlug(resolved.serviceSlug);
    const area = getAreaBySlug(resolved.areaSlug);
    if (!service || !area) return {};
    const title = `${service.title} in ${area.name}, Pune | ${BRAND_NAME}`;
    const description = `Hire trusted ${service.title.toLowerCase()} support in ${area.name}, Pune. ${service.mobileSummary} Background-verified and locally matched by ${BRAND_NAME}.`;
    return {
      title,
      description,
      keywords: [...service.keywords, ...service.marathiKeywords],
      alternates: { canonical },
      openGraph: { title, description, url: canonical, siteName: BRAND_NAME, type: "website", locale: "en_IN" },
    };
  }

  if (resolved.kind === "area") {
    const area = getAreaBySlug(resolved.areaSlug);
    if (!area) return {};
    return {
      title: area.seoTitle,
      description: area.metaDescription,
      alternates: { canonical },
      openGraph: {
        title: area.seoTitle,
        description: area.metaDescription,
        url: canonical,
        siteName: BRAND_NAME,
        type: "website",
        locale: "en_IN",
      },
    };
  }

  const society = getSocietyBySlug(resolved.societySlug);
  if (!society) return {};
  const title = `Maid Service in ${society.name}, ${society.area.name} | ${BRAND_NAME}`;
  const description = `Book verified maid services near ${society.name}, ${society.area.name}, Pune for cleaning, cooking, childcare, and elder support.`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: BRAND_NAME, type: "website", locale: "en_IN" },
  };
}

export default async function ProgrammaticPage(props: PageProps) {
  const { programmaticSlug } = await props.params;
  const resolved = resolveProgrammaticSlug(programmaticSlug);
  if (!resolved) notFound();

  const canonical = getAbsoluteSiteUrl(`/${programmaticSlug}`);
  const homeUrl = getAbsoluteSiteUrl("/");
  const businessId = `${homeUrl}#localbusiness`;

  let schemaName = "";
  let schemaDescription = "";
  let breadcrumbItems: BreadcrumbItem[] = [];
  let templateData: LocalProgrammaticTemplateData;
  let serviceExtras: Record<string, unknown> = {};

  if (resolved.kind === "service-area") {
    const service = getServiceBySlug(resolved.serviceSlug);
    const area = getAreaBySlug(resolved.areaSlug);
    if (!service || !area) notFound();

    const visuals = serviceVisuals[service.slug] ?? { blob: defaultBlob, doodle: defaultDoodle };
    const waHref = getWhatsAppHrefWithService(`${service.title} in ${area.name}`);

    schemaName = `${service.title} in ${area.name}`;
    schemaDescription = `Trusted ${service.title.toLowerCase()} support in ${area.name}, Pune.`;
    serviceExtras = {
      keywords: service.keywords.join(", "),
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        priceRange: service.priceRange,
        availability: "https://schema.org/InStock",
        url: canonical,
      },
    };
    breadcrumbItems = [
      { name: "Home", item: homeUrl },
      { name: "Areas", item: getAbsoluteSiteUrl(`/maid-service-in-${area.slug}`) },
      { name: service.title, item: canonical },
    ];

    templateData = {
      breadcrumb: [
        { label: "Home", href: "/" },
        { label: area.name, href: `/maid-service-in-${area.slug}` },
        { label: service.title },
      ],
      localityLabel: `${area.name}, Pune`,
      h1: `${service.title} in ${area.name}`,
      intro: `${service.mobileSummary} Locally matched support near ${area.landmark}.`,
      highlights: service.points,
      blobAsset: visuals.blob,
      doodleAsset: visuals.doodle,
      doodleAlt: `${service.title} support in ${area.name}`,
      visualTitle: `Trusted support in ${area.shortName}`,
      visualDescription: `Share your preferred timings for ${area.name}. We align suitable profiles from nearby communities and societies.`,
      trustHeading: `Why families in ${area.name} choose ${BRAND_NAME}`,
      trustHighlights,
      faqHeading: "Frequently asked questions",
      faqItems: service.faq,
      sideCtaTag: `Serving ${area.shortName}`,
      sideCtaTitle: `Book ${service.title} in ${area.name}`,
      sideCtaDescription: `Get recommendations based on household size, timing, and preferences for ${area.name} and nearby Pune localities.`,
      primaryCtaLabel: `Book ${service.title}`,
      primaryCtaHref: "/#enquiry",
      secondaryCtaLabel: "WhatsApp for quick match",
      secondaryCtaHref: waHref,
      relatedHeading: `Related local services in ${area.name}`,
      relatedLinks: [
        { href: `/maid-service-in-${area.slug}`, label: `All maid services in ${area.name}` },
        ...services
          .filter((s) => s.slug !== service.slug)
          .slice(0, 5)
          .map((s) => ({ href: `/${s.slug}-in-${area.slug}`, label: `${s.title} in ${area.name}` })),
        ...area.societies
          .slice(0, 4)
          .map((s) => ({ href: `/maid-service-in-${s.slug}`, label: `Maid in ${s.name}` })),
      ],
    };
  } else if (resolved.kind === "area") {
    const area = getAreaBySlug(resolved.areaSlug);
    if (!area) notFound();
    const waHref = getWhatsAppHrefWithService(`maid services in ${area.name}`);

    schemaName = `Maid Service in ${area.name}`;
    schemaDescription = area.metaDescription;
    breadcrumbItems = [
      { name: "Home", item: homeUrl },
      { name: "Areas", item: homeUrl },
      { name: area.name, item: canonical },
    ];

    templateData = {
      breadcrumb: [
        { label: "Home", href: "/" },
        { label: "Areas" },
        { label: area.name },
      ],
      localityLabel: `${area.name}, Pune`,
      h1: `Maid Service in ${area.name}`,
      intro: area.description,
      highlights: [
        `Nearby landmark: ${area.landmark}`,
        `Pincode coverage: ${area.pincode}`,
        "Background-verified household support",
        "Quick replacement within 24-48 hours",
      ],
      blobAsset: defaultBlob,
      doodleAsset: defaultDoodle,
      doodleAlt: `Home service coverage in ${area.name}`,
      visualTitle: `Coverage across ${area.shortName}`,
      visualDescription: `We support families in ${area.name} and nearby micro-localities: ${area.nearbyMicroLocalities.join(", ")}.`,
      trustHeading: `Why households in ${area.name} trust ${BRAND_NAME}`,
      trustHighlights,
      faqHeading: "Frequently asked questions",
      faqItems: genericAreaFaq,
      sideCtaTag: `Area hub: ${area.shortName}`,
      sideCtaTitle: `Get a maid match in ${area.name}`,
      sideCtaDescription: `Tell us your schedule and requirements. Our team will shortlist suitable options for ${area.name}.`,
      primaryCtaLabel: "Start your enquiry",
      primaryCtaHref: "/#enquiry",
      secondaryCtaLabel: "Chat on WhatsApp",
      secondaryCtaHref: waHref,
      relatedHeading: `Explore services and societies in ${area.name}`,
      relatedLinks: [
        ...services.map((s) => ({ href: `/${s.slug}-in-${area.slug}`, label: `${s.title} in ${area.name}` })),
        ...area.societies
          .slice(0, 8)
          .map((s) => ({ href: `/maid-service-in-${s.slug}`, label: `Maid in ${s.name}` })),
      ],
    };
  } else {
    const society = getSocietyBySlug(resolved.societySlug);
    if (!society) notFound();
    const waHref = getWhatsAppHrefWithService(`maid services in ${society.name}`);

    schemaName = `Maid Service in ${society.name}`;
    schemaDescription = `Verified and locally matched domestic help for families in ${society.name}, ${society.area.name}, Pune.`;
    breadcrumbItems = [
      { name: "Home", item: homeUrl },
      { name: society.area.name, item: getAbsoluteSiteUrl(`/maid-service-in-${society.area.slug}`) },
      { name: society.name, item: canonical },
    ];

    templateData = {
      breadcrumb: [
        { label: "Home", href: "/" },
        { label: society.area.name, href: `/maid-service-in-${society.area.slug}` },
        { label: society.name },
      ],
      localityLabel: `${society.name}, ${society.area.name}`,
      h1: `Maid Service in ${society.name}`,
      intro: `Verified and locally matched domestic help for families in ${society.name}, ${society.area.name}, Pune.`,
      highlights: [
        `Society-focused support for ${society.name}`,
        `Quick reach from ${society.area.landmark}`,
        "Background-verified maids and domestic helpers",
        "Flexible full-time and part-time options",
      ],
      blobAsset: defaultBlob,
      doodleAsset: defaultDoodle,
      doodleAlt: `Domestic support in ${society.name}`,
      visualTitle: `Society-first matching`,
      visualDescription: `Get service options aligned for ${society.name} with support from nearby ${society.area.name} micro-localities.`,
      trustHeading: `Why families in ${society.name} choose ${BRAND_NAME}`,
      trustHighlights,
      faqHeading: "Frequently asked questions",
      faqItems: genericSocietyFaq,
      sideCtaTag: "Society support",
      sideCtaTitle: `Need help in ${society.name}?`,
      sideCtaDescription: `Our team can recommend cleaning, cooking, childcare, and elder support options near ${society.name}.`,
      primaryCtaLabel: "Book a consultation",
      primaryCtaHref: "/#enquiry",
      secondaryCtaLabel: "WhatsApp now",
      secondaryCtaHref: waHref,
      relatedHeading: `Explore services around ${society.area.name}`,
      relatedLinks: [
        { href: `/maid-service-in-${society.area.slug}`, label: `Maid services in ${society.area.name}` },
        ...services.map((s) => ({ href: `/${s.slug}-in-${society.area.slug}`, label: `${s.title} in ${society.area.name}` })),
      ],
    };
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": businessId,
        name: BRAND_NAME,
        url: homeUrl,
        telephone: "+919172475977",
        address: {
          "@type": "PostalAddress",
          addressLocality: AREA_SERVED_CITY,
          addressRegion: "Maharashtra",
          addressCountry: "IN",
        },
      },
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: schemaName,
        description: schemaDescription,
        ...serviceExtras,
        provider: { "@id": businessId },
        areaServed: {
          "@type": "City",
          name: AREA_SERVED_CITY,
        },
        serviceArea: {
          "@type": "Place",
          name: AREA_SERVED_LOCALITY,
        },
        url: canonical,
      },
      {
        "@type": "FAQPage",
        mainEntity: templateData.faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.item,
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
          <LocalProgrammaticTemplate data={templateData} />
        </main>
        <Footer />
        <StickyWhatsApp />
      </div>
    </>
  );
}
