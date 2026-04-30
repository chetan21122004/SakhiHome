/**
 * Route: /maid-service-in-[areaSlug]
 * Example: /maid-service-in-wakad
 *
 * Generates one page per area in AREAS.
 * Each page is fully self-contained: hero, service grid, society list,
 * FAQ, schema markup, and CTA — all driven by areas.ts + services.ts.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AREAS, getAreaBySlug, getAllAreaSlugs } from "@/lib/areas";
import { services } from "@/lib/services";
import {
  BRAND_NAME,
  WHATSAPP,
  getWhatsAppHrefWithService,
  getAbsoluteSiteUrl,
} from "@/lib/services";

// ─── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllAreaSlugs().map((areaSlug) => ({ areaSlug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { areaSlug: string };
}): Promise<Metadata> {
  const area = getAreaBySlug(params.areaSlug);
  if (!area) return {};

  const canonical = getAbsoluteSiteUrl(`/maid-service-in-${area.slug}`);

  return {
    title: area.seoTitle,
    description: area.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: area.seoTitle,
      description: area.metaDescription,
      url: canonical,
      siteName: BRAND_NAME,
      locale: "en_IN",
      type: "website",
    },
  };
}

// ─── JSON-LD Schema ────────────────────────────────────────────────────────────

function AreaSchema({ area }: { area: ReturnType<typeof getAreaBySlug> }) {
  if (!area) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": getAbsoluteSiteUrl(`/maid-service-in-${area.slug}`),
    name: `${BRAND_NAME} – ${area.name}`,
    description: area.metaDescription,
    url: getAbsoluteSiteUrl(`/maid-service-in-${area.slug}`),
    telephone: "+919172475977",
    image: getAbsoluteSiteUrl("/assets/logo_both.png"),
    priceRange: "₹₹",
    areaServed: {
      "@type": "Place",
      name: area.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: area.name,
        addressRegion: "Maharashtra",
        postalCode: area.pincode,
        addressCountry: "IN",
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Domestic Help Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          url: getAbsoluteSiteUrl(`/${s.slug}-in-${area.slug}`),
        },
      })),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AreaPage({ params }: { params: { areaSlug: string } }) {
  const area = getAreaBySlug(params.areaSlug);
  if (!area) notFound();

  const waHref = getWhatsAppHrefWithService(`maid service in ${area.name}`);

  return (
    <>
      <AreaSchema area={area} />

      {/* ── Hero ── */}
      <section className="relative bg-[#faf7f2] py-16 px-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-orange-500 mb-3">
          Serving {area.name}, Pune
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight max-w-3xl mx-auto">
          Trusted Maids in{" "}
          <span className="text-orange-500">{area.name}</span>
        </h1>
        <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
          {area.description} Connect with 500+ background-verified maids —
          matched to your home within hours.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#enquiry"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition"
          >
            Book a Maid Now
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-gray-300 hover:border-orange-400 text-gray-700 font-semibold px-8 py-3 rounded-full transition"
          >
            WhatsApp Us
          </a>
        </div>

        {/* Trust bar */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          {[
            ["500+", "Maids in network"],
            ["4.9★", "Customer rating"],
            ["Within hours", "Fast matching"],
            ["24–48 hrs", "Replacement"],
          ].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-xl font-bold text-gray-800">{val}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-14 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
          All Services in {area.name}
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Every service below is available near {area.landmark}.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/${service.slug}-in-${area.slug}`}
              className="group border border-gray-200 rounded-2xl p-6 hover:border-orange-400 hover:shadow-md transition bg-white"
            >
              {service.tag && (
                <span className="inline-block text-xs font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full mb-3">
                  {service.tag}
                </span>
              )}
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition">
                {service.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{service.mobileSummary}</p>
              <ul className="mt-3 space-y-1">
                {service.points.map((pt) => (
                  <li key={pt} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-orange-400 mt-0.5">✓</span>
                    {pt}
                  </li>
                ))}
              </ul>
              <span className="mt-4 inline-block text-sm font-medium text-orange-500 group-hover:underline">
                View details & book →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Societies Served ── */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Societies We Serve in {area.name}
          </h2>
          <p className="text-gray-500 mb-8">
            We have active maids living near all these societies — shorter commute means
            better reliability.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {area.societies.map((society) => (
              <Link
                key={society.slug}
                href={`/maid-service-in-${society.slug}`}
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:border-orange-400 hover:text-orange-600 transition"
              >
                {society.name}
              </Link>
            ))}
          </div>
          {area.nearbyMicroLocalities.length > 0 && (
            <p className="mt-6 text-sm text-gray-400">
              Also covering nearby:{" "}
              {area.nearbyMicroLocalities.join(" · ")}
            </p>
          )}
        </div>
      </section>

      {/* ── Why SakhiHome ── */}
      <section className="py-14 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Why Families in {area.name} Trust SakhiHome
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: "Background-Verified Maids",
              body: `Every maid in our ${area.name} network is ID and address verified before placement.`,
            },
            {
              title: "Locally Matched",
              body: `We prioritise maids who live near ${area.landmark} — shorter travel means more punctuality.`,
            },
            {
              title: "Real Human Support",
              body: "One real person you can call — no chatbots, no faceless apps.",
            },
            {
              title: "24–48 hr Replacement",
              body: "If your maid is unavailable, we arrange a verified backup within 24–48 hours.",
            },
          ].map(({ title, body }) => (
            <div key={title} className="border border-gray-200 rounded-2xl p-5 bg-white">
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Other Areas ── */}
      <section className="bg-gray-50 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Also serving nearby areas
          </h2>
          <div className="flex flex-wrap gap-2">
            {AREAS.filter((a) => a.id !== area.id).map((a) => (
              <Link
                key={a.id}
                href={`/maid-service-in-${a.slug}`}
                className="text-sm px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-orange-400 hover:text-orange-500 transition"
              >
                {a.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / Enquiry ── */}
      <section id="enquiry" className="py-16 px-6 text-center bg-orange-50">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Find a Maid in {area.name} Today
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Share your requirement and we'll match you with a verified maid near your
          society — usually within a few hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full transition"
          >
            💬 Chat on WhatsApp
          </a>
          <a
            href="tel:+919172475977"
            className="border border-gray-300 hover:border-orange-400 text-gray-700 font-semibold px-8 py-3 rounded-full transition"
          >
            📞 Call +91 91724 75977
          </a>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Mon–Sun · 8 AM – 9 PM · Replies within minutes
        </p>
      </section>
    </>
  );
}
