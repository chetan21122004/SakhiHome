/**
 * Route: /[serviceSlug]-in-[areaSlug]
 * Example: /house-cleaning-in-wakad
 *          /cooking-services-in-hinjewadi-phase-1
 *
 * Generates 48 pages (6 services × 8 areas).
 * Pulls content from services.ts + areas.ts — zero duplicate copy.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AREAS, getAreaBySlug, getAllAreaSlugs } from "@/lib/areas";
import { services, getServiceBySlug, getAllServiceSlugs, SERVICE_SLUGS } from "@/lib/services";
import {
  BRAND_NAME,
  getWhatsAppHrefWithService,
  getAbsoluteSiteUrl,
} from "@/lib/services";

// ─── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  const params: { serviceSlug: string; areaSlug: string }[] = [];
  for (const serviceSlug of getAllServiceSlugs()) {
    for (const areaSlug of getAllAreaSlugs()) {
      params.push({ serviceSlug, areaSlug });
    }
  }
  return params;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { serviceSlug: string; areaSlug: string };
}): Promise<Metadata> {
  const service = getServiceBySlug(params.serviceSlug);
  const area = getAreaBySlug(params.areaSlug);
  if (!service || !area) return {};

  const title = `${service.title} in ${area.name}, Pune | ${BRAND_NAME}`;
  const description = `Hire trusted ${service.title.toLowerCase()} maids in ${area.name}, Pune. ${service.mobileSummary} Background-verified, locally matched, fast replacement. ${BRAND_NAME}.`;
  const canonical = getAbsoluteSiteUrl(`/${service.slug}-in-${area.slug}`);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: BRAND_NAME,
      locale: "en_IN",
      type: "website",
    },
  };
}

// ─── JSON-LD Schema ────────────────────────────────────────────────────────────

function ServiceAreaSchema({
  service,
  area,
}: {
  service: NonNullable<ReturnType<typeof getServiceBySlug>>;
  area: NonNullable<ReturnType<typeof getAreaBySlug>>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.title} in ${area.name}`,
    description: service.longDescription,
    provider: {
      "@type": "LocalBusiness",
      name: BRAND_NAME,
      telephone: "+919172475977",
      url: getAbsoluteSiteUrl(),
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
    },
    url: getAbsoluteSiteUrl(`/${service.slug}-in-${area.slug}`),
    mainEntityOfPage: {
      "@type": "FAQPage",
      mainEntity: service.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
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

export default function ServiceAreaPage({
  params,
}: {
  params: { serviceSlug: string; areaSlug: string };
}) {
  const service = getServiceBySlug(params.serviceSlug);
  const area = getAreaBySlug(params.areaSlug);
  if (!service || !area) notFound();

  const waHref = getWhatsAppHrefWithService(`${service.title} in ${area.name}`);

  // Other services in same area (for cross-linking)
  const otherServices = services.filter((s) => s.slug !== service.slug);

  // Same service in other areas (for cross-linking)
  const otherAreas = AREAS.filter((a) => a.id !== area.id);

  return (
    <>
      <ServiceAreaSchema service={service} area={area} />

      {/* ── Breadcrumb ── */}
      <nav className="px-6 pt-6 max-w-4xl mx-auto text-sm text-gray-400">
        <Link href="/" className="hover:text-orange-500">Home</Link>
        {" / "}
        <Link href={`/maid-service-in-${area.slug}`} className="hover:text-orange-500">
          {area.name}
        </Link>
        {" / "}
        <span className="text-gray-600">{service.title}</span>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-[#faf7f2] py-14 px-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-orange-500 mb-3">
          {area.name} · Pune
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight max-w-3xl mx-auto">
          {service.title} in{" "}
          <span className="text-orange-500">{area.name}</span>
        </h1>
        <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
          {service.mobileSummary}. Background-verified maids
          near {area.landmark} — matched within hours.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full transition"
          >
            💬 WhatsApp to Book
          </a>
          <a
            href="tel:+919172475977"
            className="inline-block border border-gray-300 hover:border-orange-400 text-gray-700 font-semibold px-8 py-3 rounded-full transition"
          >
            📞 Call Now
          </a>
        </div>
      </section>

      {/* ── Service Detail ── */}
      <section className="py-14 px-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left — description + points */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About This Service
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {service.longDescription}
            </p>
            <ul className="space-y-2">
              {service.points.map((pt) => (
                <li key={pt} className="flex gap-3 text-gray-700">
                  <span className="text-orange-400 font-bold mt-0.5">✓</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — societies card */}
          <div className="bg-orange-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Societies We Serve in {area.name}
            </h3>
            <ul className="space-y-2">
              {area.societies.map((s) => (
                <li key={s.slug} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-orange-400">📍</span>
                  <Link
                    href={`/maid-service-in-${s.slug}`}
                    className="hover:text-orange-500 hover:underline"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
            {area.nearbyMicroLocalities.length > 0 && (
              <p className="mt-4 text-xs text-gray-400">
                Also near: {area.nearbyMicroLocalities.join(", ")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-gray-50 py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {service.faq.map((item) => (
              <div
                key={item.question}
                className="bg-white border border-gray-200 rounded-2xl p-5"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Other Services in Same Area ── */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Other Services in {area.name}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {otherServices.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}-in-${area.slug}`}
              className="text-sm font-medium text-gray-700 border border-gray-200 rounded-xl px-4 py-3 hover:border-orange-400 hover:text-orange-500 transition bg-white"
            >
              {s.title}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Same Service in Other Areas ── */}
      <section className="bg-gray-50 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {service.title} in other areas
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherAreas.map((a) => (
              <Link
                key={a.id}
                href={`/${service.slug}-in-${a.slug}`}
                className="text-sm px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-orange-400 hover:text-orange-500 transition"
              >
                {service.title} in {a.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6 text-center bg-orange-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Book {service.title} in {area.name}
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Tell us your requirement and we'll match you with a verified{" "}
          {service.title.toLowerCase()} maid near your society — usually within hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full transition"
          >
            💬 WhatsApp Us
          </a>
          <a
            href="tel:+919172475977"
            className="border border-gray-300 hover:border-orange-400 text-gray-700 font-semibold px-8 py-3 rounded-full transition"
          >
            📞 +91 91724 75977
          </a>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Mon–Sun · 8 AM – 9 PM · Replies within minutes
        </p>
      </section>
    </>
  );
}
