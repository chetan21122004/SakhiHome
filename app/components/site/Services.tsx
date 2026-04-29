import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Sparkles, ChefHat, Baby, HeartHandshake, Home, Clock, ArrowRight, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ServiceIconKey } from "@/lib/services";
import { services } from "@/lib/services";

const cookingDoodle = "/assets/doodles/Cooking-bro.svg";
const blobBg = "/assets/blobs/color_grunge_pattern_liquidity_style_background.jpg";

const iconByKey: Record<ServiceIconKey, LucideIcon> = {
  sparkles: Sparkles,
  chefHat: ChefHat,
  baby: Baby,
  heartHandshake: HeartHandshake,
  home: Home,
  clock: Clock,
};

const MobileServices = () => (
  <div className="md:hidden">
    {/* Mobile heading */}
    <div className="mx-auto max-w-[26rem] text-left">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-gradient-brand-soft px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">
        <Wand2 className="h-3 w-3" />
        Our Services
      </span>
      <h2 className="mt-4 font-display text-[1.85rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-primary-deep">
        Everything your <span className="text-gradient-brand">home</span> needs
      </h2>
      <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/65">
        From a quick clean to a full-time helper — one trusted partner for every corner.
      </p>

      {/* Hairline */}
      <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
    </div>

    {/* Mobile service cards — single column */}
    <div className="mx-auto mt-5 grid max-w-[26rem] grid-cols-1 gap-3">
      {services.map(({ iconKey, title, slug, tag, mobileSummary }) => {
        const Icon = iconByKey[iconKey];
        const href = `/services/${slug}`;
        return (
          <Link
            key={slug}
            href={href}
            className="group relative flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors duration-300 active:bg-secondary/40"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand-soft border border-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-[15px] font-bold leading-tight text-primary-deep truncate">
                  {title}
                </h3>
                {tag && (
                  <span className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                    {tag}
                  </span>
                )}
              </div>
              <p className="mt-1 text-[12.5px] leading-snug text-foreground/60 line-clamp-2">{mobileSummary}</p>
            </div>

            <ArrowRight className="h-4 w-4 shrink-0 text-primary/60 transition-transform group-active:translate-x-0.5" aria-hidden />
          </Link>
        );
      })}
    </div>

    {/* Mobile CTA strip */}
    <div className="mx-auto mt-6 max-w-[26rem]">
      <Button variant="hero" asChild className="h-12 w-full rounded-xl text-[13px] font-bold tracking-tight">
        <a href="#enquiry">
          <Sparkles className="h-4 w-4" />
          Book a Maid
          <ArrowRight className="h-4 w-4" />
        </a>
      </Button>
    </div>
  </div>
);

const Services = () => {
  return (
    <section id="services" className="relative py-12 bg-gradient-soft overflow-hidden">
      {/* Blob background texture */}
      <img
        src={blobBg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-[0.04] pointer-events-none select-none mix-blend-multiply"
      />

      {/* Soft brand orbs */}
      <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-accent/15 blur-[110px] pointer-events-none" aria-hidden />
      <div className="absolute bottom-20 -right-20 h-80 w-80 rounded-full bg-primary/15 blur-[120px] pointer-events-none" aria-hidden />


      <div className="container relative mx-auto px-4 md:px-6">
        {/* Desktop / tablet layout (md+) — preserved exactly */}
        <div className="hidden md:block">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center mb-16 max-w-5xl mx-auto text-center md:text-left">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-brand-soft border border-primary/20 px-4 py-1.5 text-xs font-bold text-primary-deep uppercase tracking-wider">
              <Wand2 className="h-3.5 w-3.5" />
              Our Services
            </span>
            <h2 className="mt-5 font-display text-4xl md:text-6xl font-extrabold text-primary-deep text-balance leading-[1.05]">
              Everything your <span className="text-gradient-brand">home</span> needs
            </h2>
            <p className="mt-5 text-lg text-foreground/70 max-w-xl mx-auto md:mx-0">
              From a quick clean to a full-time helper, one trusted partner for every corner of your home.
            </p>
          </div>
          <div className="hidden md:flex justify-end">
            <img src={cookingDoodle} alt="Cooking and Maid Services" className="w-64 lg:w-80 object-contain drop-shadow-xl animate-float" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ iconKey, slug, title, points, tag }, i) => {
            const Icon = iconByKey[iconKey];
            const detailHref = `/services/${slug}`;
            return (
            <div
              key={slug}
              className="group relative rounded-[2rem] bg-card border border-border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Animated gradient sweep background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" aria-hidden />
              
              {/* Giant watermark icon */}
              <Icon 
                className="absolute -bottom-12 -right-12 h-64 w-64 text-primary/[0.03] group-hover:text-primary/[0.06] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none" 
                aria-hidden 
              />

              {/* Glowing orb that follows top-right */}
              <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-brand opacity-0 group-hover:opacity-20 blur-3xl transition-all duration-700 group-hover:scale-150 pointer-events-none" aria-hidden />

              <div className="relative p-7 md:p-8 flex flex-col h-full z-10">
                
                <div className="flex items-start justify-between mb-8">
                  {/* Floating Icon Box */}
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand-soft border border-primary/10 text-primary transition-all duration-500 group-hover:bg-gradient-brand group-hover:text-white group-hover:shadow-glow group-hover:scale-110 group-hover:-rotate-6">
                    <Icon className="h-7 w-7" />
                  </div>
                  
                  {tag && (
                    <span className="relative inline-flex items-center rounded-full bg-accent/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-accent border border-accent/20 shadow-sm backdrop-blur-md group-hover:bg-accent group-hover:text-white transition-colors duration-500">
                      <Sparkles className="h-3 w-3 mr-1.5 opacity-70" />
                      {tag}
                    </span>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-display text-4xl font-extrabold text-border group-hover:text-primary/30 transition-colors duration-500">
                      0{i + 1}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-primary-deep group-hover:text-primary transition-colors duration-300">
                      {title}
                    </h3>
                  </div>
                  
                  <ul className="space-y-3.5 relative">
                    {points.map((p, idx) => (
                      <li key={p} className="flex items-start gap-3 text-sm md:text-[15px] text-foreground/75 group-hover:text-foreground/90 transition-colors duration-300" style={{ transitionDelay: `${idx * 40}ms` }}>
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/5 border border-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:scale-110 shadow-sm">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        <span className="leading-snug">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Animated Button */}
                <div className="mt-9 relative">
                  <Button 
                    variant="outline" 
                    className="w-full bg-background/50 hover:bg-gradient-brand hover:text-white border-primary/20 hover:border-transparent hover:shadow-glow transition-all duration-500 group/btn h-12 text-primary group-hover:border-primary/50" 
                    asChild
                  >
                    <Link href={detailHref} className="flex items-center justify-center gap-2 overflow-hidden">
                      <span className="font-bold tracking-wide">View details & book</span>
                      <ArrowRight className="h-4 w-4 -translate-x-full opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-500 ease-out" />
                    </Link>
                  </Button>
                </div>
                
              </div>
            </div>
            );
          })}
        </div>
        </div>
        {/* /Desktop / tablet layout */}

        {/* Mobile layout (<md) — minimal premium */}
        <MobileServices />
        {/* /Mobile layout */}
      </div>
    </section>
  );
};

export default Services;
