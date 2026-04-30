import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, MessageCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { homeSection } from "@/lib/siteNav";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type LinkItem = {
  href: string;
  label: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type TrustHighlight = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type LocalProgrammaticTemplateData = {
  breadcrumb: BreadcrumbItem[];
  localityLabel: string;
  h1: string;
  intro: string;
  highlights: string[];
  blobAsset: string;
  doodleAsset: string;
  doodleAlt: string;
  visualTitle: string;
  visualDescription: string;
  trustHeading: string;
  trustHighlights: TrustHighlight[];
  faqHeading: string;
  faqItems: FaqItem[];
  sideCtaTag: string;
  sideCtaTitle: string;
  sideCtaDescription: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  relatedHeading: string;
  relatedLinks: LinkItem[];
};

type Props = {
  data: LocalProgrammaticTemplateData;
};

export default function LocalProgrammaticTemplate({ data }: Props) {
  return (
    <>
      <div className="border-b bg-muted/40">
        <div className="container mx-auto px-4 py-3 md:px-6">
          <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1">
              {data.breadcrumb.map((item, index) => (
                <li key={`${item.label}-${index}`} className="flex items-center gap-1">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="hover:text-foreground underline-offset-4 hover:underline"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-foreground">{item.label}</span>
                  )}
                  {index < data.breadcrumb.length - 1 && (
                    <span aria-hidden className="px-1">
                      /
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      <article className="relative overflow-hidden">
        <img
          src={data.blobAsset}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.06] mix-blend-multiply"
        />
        <div
          className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-[120px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-accent/10 blur-[120px]"
          aria-hidden
        />

        <div className="container relative mx-auto px-4 py-10 md:px-6 md:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <header className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                <MapPin className="h-3.5 w-3.5" />
                {data.localityLabel}
              </div>

              <h1 className="font-display text-3xl font-extrabold tracking-tight text-primary-deep md:text-5xl">
                {data.h1}
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
                {data.intro}
              </p>

              <ul className="grid gap-3 sm:grid-cols-2" aria-label="Service highlights">
                {data.highlights.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-card/70 px-3.5 py-3 text-sm text-foreground/85 shadow-sm"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button variant="hero" asChild className="rounded-xl px-7">
                  <a href={data.primaryCtaHref}>
                    <Sparkles className="h-4 w-4" />
                    {data.primaryCtaLabel}
                  </a>
                </Button>
                <Button variant="outline" asChild className="rounded-xl border-primary/25">
                  <a href={data.secondaryCtaHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    {data.secondaryCtaLabel}
                  </a>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href={homeSection("services")}>
                    Compare all services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </header>

            <aside className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-soft p-6 shadow-card md:p-8">
              <img
                src={data.blobAsset}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12]"
              />
              <div
                className="pointer-events-none absolute -top-16 -right-12 h-48 w-48 rounded-full bg-accent/20 blur-[90px]"
                aria-hidden
              />
              <div className="relative">
                <img
                  src={data.doodleAsset}
                  alt={data.doodleAlt}
                  className="mx-auto h-auto w-full max-w-[320px] object-contain drop-shadow-xl"
                />
                <div className="mt-5 rounded-2xl border border-primary/15 bg-background/85 p-4">
                  <p className="text-sm font-semibold text-primary-deep">{data.visualTitle}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {data.visualDescription}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      <section
        className="container mx-auto px-4 py-8 md:px-6 md:py-10"
        aria-labelledby="trust-heading"
      >
        <h2
          id="trust-heading"
          className="font-display text-2xl font-bold text-primary-deep md:text-3xl"
        >
          {data.trustHeading}
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {data.trustHighlights.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-primary-deep">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="container mx-auto px-4 py-6 md:px-6 md:py-10"
        aria-labelledby="faq-heading"
      >
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <h2
              id="faq-heading"
              className="font-display text-2xl font-bold text-primary-deep md:text-3xl"
            >
              {data.faqHeading}
            </h2>
            <Accordion
              type="single"
              collapsible
              className="mt-4 w-full rounded-2xl border border-border bg-card px-4 py-2 md:px-6 md:py-3"
            >
              {data.faqItems.map((item, i) => (
                <AccordionItem key={item.question} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <aside className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              {data.sideCtaTag}
            </p>
            <h3 className="mt-3 font-display text-2xl font-extrabold text-primary-deep">
              {data.sideCtaTitle}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/75">
              {data.sideCtaDescription}
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <Button variant="hero" asChild>
                <a href={data.primaryCtaHref}>{data.primaryCtaLabel}</a>
              </Button>
              <Button variant="outline" asChild className="border-primary/30">
                <a href={data.secondaryCtaHref} target="_blank" rel="noopener noreferrer">
                  {data.secondaryCtaLabel}
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-10 md:px-6 md:pb-14">
        <h2 className="font-display text-2xl font-bold text-primary-deep md:text-3xl">
          {data.relatedHeading}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-border bg-card px-4 py-3 text-sm hover:border-primary/40"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
