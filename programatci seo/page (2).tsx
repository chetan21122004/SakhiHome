/**
 * Route: /maid-service-in-[societySlug]
 * Example: /maid-service-in-blue-ridge-township-hinjewadi
 *          /maid-service-in-megapolis-splendour-hinjewadi
 *
 * Generates one page per society (~57 pages in Phase 2).
 * Lowest competition, highest buyer intent keywords.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSocietySlugs, getSocietyBySlug } from "@/lib/areas";
import { services } from "@/lib/services";
import {
  BRAND_NAME,
  getWhatsAppHrefWithService,
  getAbsoluteSiteUrl,
} from "@/lib/services";

// ─── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllSocietySlugs().map((societySlug) => ({ societySlug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { societySlug: string };
}): Promise<Metadata> {
  const result = getSocietyBySlug(params.societySlug);
  if (!result) return {};

  const { name: societyName, area } = result;
  const title = `Maid Service in ${societyName} | Verified Domestic Help – ${BRAND_NAME}`;
  const description = `Looking for a maid in ${societyName}, ${area.name}? SakhiHome connects you with background-verified maids for cleaning, cooking, babysitting & more — matched within hours.`;
  const canonical = getAbsoluteSiteUrl(`/maid-service-in-${params.societySlug}`);

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

function SocietySchema({
  societyName,
  area,
  societySlug,
}: {
  societyName: string;
  area: ReturnType<typeof getSocietyBySlug>["area"];
  societySlug: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${BRAND_NAME} – ${societyName}`,
    description: `Background-verified maid service for residents of ${societyName}, ${area.name}, Pune.`,
    url: getAbsoluteSiteUrl(`/maid-service-in-${societySlug}`),
    telephone: "+919172475977",
    image: getAbsoluteSiteUrl("/assets/logo_both.png"),
    priceRange: "₹₹",
    areaServed: {
      "@type": "Place",
      name: societyName,
      address: {
        "@type": "PostalAddress",
        addressLocality: area.name,
        addressRegion: "Maharashtra",
        postalCode: area.pincode,
        addressCountry: "IN",
      },
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

export default function SocietyPage({ params }: { params: { societySlug: string } }) {
  const result = getSocietyBySlug(params.societySlug);
  if (!result) notFound();

  const { name: societyName, area } = result;
  const waHref = getWhatsAppHrefWithService(`maid service in ${societyName}`);

  return (
    <>
      <SocietySchema societyName={societyName} area={area} societySlug={params.societySlug} />

      {/* ── Breadcrumb ── */}
      <nav className="px-6 pt-6 max-w-4xl mx-auto text-sm text-gray-400">
        <Link href="/" className="hover:text-orange-500">Home</Link>
        {" / "}
        <Link href={`/maid-service-in-${area.slug}`} className="hover:text-orange-500">
          {area.name}
        </Link>
        {" / "}
        <span className="text-gray-600">{societyName}</span>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-[#faf7f2] py-14 px-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-orange-500 mb-3">
          {societyName} · {area.name} · Pune
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight max-w-3xl mx-auto">
          Maid Service in{" "}
          <span className="text-orange-500">{societyName}</span>
        </h1>
        <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
          Trusted, background-verified maids for residents of {societyName} in{" "}
          {area.name}. Cleaning, cooking, babysitting, elder care & more — matched
          within hours, not days.
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
            📞 Call +91 91724 75977
          </a>
        </div>

        {/* Trust chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-gray-500">
          {["✅ ID & address verified", "📍 Maids near your tower", "🔄 24–48 hr replacement", "⭐ 4.9 rated"].map(
            (chip) => (
              <span key={chip} className="bg-white border border-gray-200 rounded-full px-3 py-1">
                {chip}
              </span>
            )
          )}
        </div>
      </section>

      {/* ── Services for this Society ── */}
      <section className="py-14 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Services Available at {societyName}
        </h2>
        <p className="text-center text-gray-500 mb-10">
          All services are available for residents of {societyName}. Tap any service to
          learn more or book.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/${service.slug}-in-${area.slug}`}
              className="group border border-gray-200 rounded-2xl p-5 hover:border-orange-400 hover:shadow-md transition bg-white"
            >
              {service.tag && (
                <span className="inline-block text-xs font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full mb-2">
                  {service.tag}
                </span>
              )}
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-orange-500 transition">
                {service.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{service.mobileSummary}</p>
              <span className="mt-3 inline-block text-sm font-medium text-orange-500 group-hover:underline">
                Book in {area.name} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How It Works for {societyName} Residents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                step: "01",
                title: "Share Your Requirement",
                body: `Tell us what you need via WhatsApp or call — cleaning, cooking, or full-time help at ${societyName}.`,
              },
              {
                step: "02",
                title: "Get Matched Locally",
                body: `We shortlist available maids who live near ${area.landmark} — shorter commute, better reliability.`,
              },
              {
                step: "03",
                title: "Choose & Confirm",
                body: "Pick the right maid and start service quickly — usually within the same day.",
              },
              {
                step: "04",
                title: "Ongoing Support",
                body: "We handle replacements and support anytime — one real human to call, no chatbots.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="bg-white border border-gray-200 rounded-2xl p-5">
                <span className="text-xs font-bold text-orange-400 tracking-widest">{step}</span>
                <h3 className="font-semibold text-gray-900 mt-1 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Other Societies in Same Area ── */}
      <section className="py-10 px-6 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Other societies in {area.name}
        </h2>
        <div className="flex flex-wrap gap-2">
          {area.societies
            .filter((s) => s.slug !== params.societySlug)
            .map((s) => (
              <Link
                key={s.slug}
                href={`/maid-service-in-${s.slug}`}
                className="text-sm px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-orange-400 hover:text-orange-500 transition"
              >
                {s.name}
              </Link>
            ))}
        </div>
        <div className="mt-4">
          <Link
            href={`/maid-service-in-${area.slug}`}
            className="text-sm text-orange-500 hover:underline"
          >
            ← View all maids in {area.name}
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6 text-center bg-orange-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Find a Maid at {societyName} Today
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          We match {societyName} residents with verified maids who live nearby — so
          they arrive on time, every time.
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
            📞 +91 91724 75977
          </a>
        </div>
        <p className="mt-4 text-xs text-gray-400">Mon–Sun · 8 AM – 9 PM · Replies within minutes</p>
      </section>
    </>
  );
}
