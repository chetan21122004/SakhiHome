import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Navbar from "@/app/components/site/Navbar";
import Footer from "@/app/components/site/Footer";
import StickyWhatsApp from "@/app/components/site/StickyWhatsApp";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  AREA_SERVED_CITY,
  BRAND_NAME,
  getAbsoluteSiteUrl,
  getServiceBySlug,
  getWhatsAppHrefWithService,
  services,
} from "@/lib/services";
import { homeSection } from "@/lib/siteNav";

type PageProps = { params: Promise<{ slug: string }> };

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="border-b bg-muted/30">
            <div className="container mx-auto px-4 py-3 md:px-6">
              <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-1">
                  <li>
                    <Link href="/" className="hover:text-foreground underline-offset-4 hover:underline">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden className="px-1">
                    /
                  </li>
                  <li>
                    <Link href={homeSection("services")} className="hover:text-foreground underline-offset-4 hover:underline">
                      Services
                    </Link>
                  </li>
                  <li aria-hidden className="px-1">
                    /
                  </li>
                  <li className="font-medium text-foreground">{service.title}</li>
                </ol>
              </nav>
            </div>
          </div>

          <article className="container mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
            <header className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{AREA_SERVED_CITY}</p>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-primary-deep md:text-4xl">
                {service.headline}
              </h1>
              <p className="text-lg text-foreground/75">{service.longDescription}</p>
            </header>

            <section className="mt-10" aria-labelledby="features-heading">
              <h2 id="features-heading" className="sr-only">
                What&apos;s included
              </h2>
              <ul className="space-y-3">
                {service.points.map((p) => (
                  <li key={p} className="flex gap-3 text-foreground/85">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="font-display text-2xl font-bold text-primary-deep">
                Frequently asked questions
              </h2>
              <Accordion type="single" collapsible className="mt-4 w-full">
                {service.faq.map((item, i) => (
                  <AccordionItem key={item.question} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button variant="hero" asChild className="rounded-xl px-8">
                <a href={homeSection("enquiry")}>Book an enquiry</a>
              </Button>
              <Button variant="outline" asChild className="rounded-xl border-primary/25">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp
                </a>
              </Button>
              <Button variant="ghost" asChild>
                <Link href={homeSection("services")}>All services</Link>
              </Button>
            </div>
          </article>
        </main>
        <Footer />
        <StickyWhatsApp />
      </div>
    </>
  );
}
