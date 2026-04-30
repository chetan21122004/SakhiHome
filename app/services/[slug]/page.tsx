import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock3, MapPin, ShieldCheck } from "lucide-react";

import Navbar from "@/app/components/site/Navbar";
import Footer from "@/app/components/site/Footer";
import StickyWhatsApp from "@/app/components/site/StickyWhatsApp";
import LocalProgrammaticTemplate from "@/app/components/site/LocalProgrammaticTemplate";

import {
  AREA_SERVED_CITY,
  AREA_SERVED_LOCALITY,
  BRAND_NAME,
  getAbsoluteSiteUrl,
  getServiceBySlug,
  getWhatsAppHrefWithService,
  services,
} from "@/lib/services";

type PageProps = { params: Promise<{ slug: string }> };

const doodleBySlug: Record<string, string> = {
  "house-cleaning": "/assets/doodles/cleaning service-amico.svg",
  "cooking-services": "/assets/doodles/Cooking-bro.svg",
  babysitting: "/assets/doodles/cleaning service-amico.svg",
  "elder-care": "/assets/doodles/Dementia-amico.svg",
  "full-time-maid": "/assets/doodles/Cooking-bro.svg",
  "part-time-maid": "/assets/doodles/cleaning service-amico.svg",
};

const blobBySlug: Record<string, string> = {
  "house-cleaning": "/assets/blobs/color_grunge_pattern_liquidity_style_background.jpg",
  "cooking-services": "/assets/blobs/254596558522.jpg",
  babysitting: "/assets/blobs/063602423687.jpg",
  "elder-care": "/assets/blobs/063602423687.jpg",
  "full-time-maid": "/assets/blobs/254596558522.jpg",
  "part-time-maid": "/assets/blobs/color_grunge_pattern_liquidity_style_background.jpg",
};

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return { title: "Service not found" };
  }

  const url = getAbsoluteSiteUrl(`/services/${service.slug}`);

  return {
    title: {
      absolute: service.metaTitle,
    },
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: BRAND_NAME,
      title: service.metaTitle,
      description: service.metaDescription,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle,
      description: service.metaDescription,
    },
  };
}

export default async function ServiceDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const service = getServiceBySlug(slug);
  if (!service) {
    notFound();
  }

  const canonical = getAbsoluteSiteUrl(`/services/${service.slug}`);
  const homeUrl = getAbsoluteSiteUrl("/");
  const whatsappHref = getWhatsAppHrefWithService(service.title);
  const businessId = `${canonical}#localbusiness`;
  const doodleAsset = doodleBySlug[service.slug] ?? "/assets/doodles/Cooking-bro.svg";
  const blobAsset = blobBySlug[service.slug] ?? "/assets/blobs/254596558522.jpg";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": businessId,
        name: BRAND_NAME,
        url: homeUrl,
        description: `${BRAND_NAME} connects Pune households with vetted maid, cleaning, childcare, elder support, and cooking help.`,
        address: {
          "@type": "PostalAddress",
          addressLocality: AREA_SERVED_CITY,
          addressRegion: "Maharashtra",
          addressCountry: "IN",
        },
        areaServed: {
          "@type": "City",
          name: AREA_SERVED_CITY,
        },
        serviceArea: {
          "@type": "Place",
          name: `${AREA_SERVED_LOCALITY}, ${AREA_SERVED_CITY}`,
        },
      },
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: service.title,
        serviceType: service.title,
        description: service.metaDescription,
        provider: { "@id": businessId },
        areaServed: {
          "@type": "City",
          name: AREA_SERVED_CITY,
        },
        serviceArea: {
          "@type": "Place",
          name: `${AREA_SERVED_LOCALITY}, ${AREA_SERVED_CITY}`,
        },
        url: canonical,
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faq.map((item) => ({
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
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${homeUrl}#services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: canonical,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
          <LocalProgrammaticTemplate
            data={{
              breadcrumb: [
                { label: "Home", href: "/" },
                { label: "Services", href: "/#services" },
                { label: service.title },
              ],
              localityLabel: `${AREA_SERVED_LOCALITY}, ${AREA_SERVED_CITY}`,
              h1: service.headline,
              intro: service.longDescription,
              highlights: service.points,
              blobAsset,
              doodleAsset,
              doodleAlt: `${service.title} support illustration`,
              visualTitle: "Professional matching support",
              visualDescription:
                "Share your preferred timings and household needs. Our team aligns suitable profiles from nearby localities.",
              trustHeading: `Why families choose ${BRAND_NAME}`,
              trustHighlights,
              faqHeading: "Frequently asked questions",
              faqItems: service.faq,
              sideCtaTag: "Need help choosing?",
              sideCtaTitle: "Talk to our local matching team",
              sideCtaDescription: `Get recommendations based on family size, timing, and priorities in ${AREA_SERVED_LOCALITY} and nearby Pune areas.`,
              primaryCtaLabel: `Book ${service.title}`,
              primaryCtaHref: "/#enquiry",
              secondaryCtaLabel: "WhatsApp for quick match",
              secondaryCtaHref: whatsappHref,
              relatedHeading: "Related services",
              relatedLinks: services
                .filter((s) => s.slug !== service.slug)
                .map((s) => ({ href: `/services/${s.slug}`, label: s.title })),
            }}
          />
        </main>
        <Footer />
        <StickyWhatsApp />
      </div>
    </>
  );
}
