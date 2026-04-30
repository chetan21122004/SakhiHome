"use client";

import { Button } from "@/components/ui/button";
import { Phone, Sparkles as SparklesIcon } from "lucide-react";
import Sparkles from "./Sparkles";
import { homeSection } from "@/lib/siteNav";
import { services } from "@/lib/services";

const blobBg = "/assets/blobs/254596558522.jpg";


const WHATSAPP = "https://wa.me/919172475977?text=Hi%20SakhiHome%2C%20I%27d%20like%20to%20book%20a%20maid";

const FinalCTA = () => {
  return (
    <section id="cta" className="py-10 md:py-12 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-gradient-dark-radial p-5 sm:p-7 md:p-16 text-center shadow-elevated">
          {/* Blob background texture */}
          <img
            src={blobBg}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-[0.08] md:opacity-[0.1] pointer-events-none select-none mix-blend-overlay"
          />

          <div className="absolute inset-0 bg-grid-light opacity-20 md:opacity-30" aria-hidden />
          <Sparkles count={20} />

          {/* Big glow orbs */}
          <div className="absolute -top-28 -right-28 md:-top-32 md:-right-32 h-52 w-52 md:h-80 md:w-80 rounded-full bg-accent/30 blur-[70px] md:blur-[100px] animate-glow-pulse" aria-hidden />
          <div className="absolute -bottom-28 -left-28 md:-bottom-32 md:-left-32 h-52 w-52 md:h-80 md:w-80 rounded-full bg-primary-glow/30 blur-[70px] md:blur-[100px] animate-glow-pulse" aria-hidden />

          <div className="relative">
            <div className="inline-flex items-center gap-1.5 md:gap-2 rounded-full glass px-3.5 md:px-4 py-1.5 text-[10px] md:text-xs font-bold text-accent uppercase tracking-[0.18em] md:tracking-wider">
              <SparklesIcon className="h-3 w-3 md:h-3.5 md:w-3.5" /> Available now
            </div>

            <h2 className="mt-4 md:mt-5 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-dark-foreground text-balance max-w-3xl mx-auto leading-tight">
              Looking for a maid in <span className="text-gradient-brand">Hinjewadi</span>?
            </h2>
            <p className="mt-3 md:mt-5 text-sm sm:text-base md:text-xl text-dark-muted max-w-2xl mx-auto leading-relaxed">
              Get connected instantly with verified maids near you. No waiting, no hassle.
            </p>

            <div className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-2.5 md:gap-3 justify-center">
              <Button variant="hero" size="xl" asChild className="w-full sm:w-auto">
                <a href={homeSection("enquiry")}>
                  <SparklesIcon className="h-4 w-4" /> Send Maid Enquiry
                </a>
              </Button>
              <Button variant="whatsapp" size="xl" asChild className="w-full sm:w-auto">
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  <Phone className="h-4 w-4" /> Chat on WhatsApp
                </a>
              </Button>
            </div>

            <div className="mt-6 md:mt-7">
              <p className="text-xs md:text-sm text-dark-muted">Popular services in Hinjewadi, Pune:</p>
              <div className="mt-3 grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2">
                {services.slice(0, 4).map((service) => (
                  <a
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] md:text-xs font-semibold text-dark-foreground/90 transition-smooth hover:border-accent/50 hover:text-accent"
                  >
                    {service.title} in Pune
                  </a>
                ))}
              </div>
            </div>

            <p className="mt-5 md:mt-6 text-xs md:text-sm text-dark-muted">
              Reply usually within minutes · Mon–Sun · 8 AM – 9 PM
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
