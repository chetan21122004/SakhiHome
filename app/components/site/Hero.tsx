"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck, Clock, RefreshCw, MapPin, Phone, Sparkles as SparklesIcon, Star, ArrowRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
const logo = "logo_both.png";
const  bg1 = "assets/bg_vdos/1.mp4";
const bg2 = "assets/bg_vdos/2.mp4";
const bg3 = "assets/bg_vdos/3.mp4";
const blobBg = "blobs/color_grunge_pattern_liquidity_style_background.jpg";

const WHATSAPP = "https://wa.me/919172475977?text=Hi%20SakhiHome%2C%20I%27d%20like%20to%20book%20a%20maid";
const VIDEOS = [bg1, bg2, bg3];
const MobileHero = () => (
  <div className="md:hidden animate-fade-up">
    <div className="mx-auto max-w-[26rem]">
      {/* Eyebrow — locality + rating */}
      <div className="flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/75">
          <MapPin className="h-3 w-3 text-accent" />
          Hinjewadi · Pune
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-accent/35 bg-accent/10 px-2.5 py-1 text-[10px] font-bold text-accent">
          <Star className="h-3 w-3 fill-accent" /> 4.9
        </span>
      </div>

      {/* Logo + headline row */}
      <div className="mt-7 flex items-center gap-3">
        <div className="relative shrink-0 self-center">
          <span
            className="absolute -inset-3 rounded-full bg-accent/20 blur-3xl"
            aria-hidden
          />
          <span
            className="absolute inset-0 rounded-full ring-1 ring-white/12"
            aria-hidden
          />
          <img
            src={`/assets/${logo}`}
            alt="SakhiHome — Trusted Maid Services in Hinjewadi"
            className="relative h-48 w-48 object-contain drop-shadow-[0_14px_34px_rgba(0,0,0,0.55)]"
          />
        </div>

        <h1 className="min-w-0 flex-1 text-left font-display text-white">
          <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/55">
            Trusted Maids for
          </span>
          <span className="mt-1.5 block text-[1.62rem] font-extrabold leading-[0.95] tracking-[-0.02em]">
            <span className="bg-gradient-to-r from-accent via-accent-deep to-primary-glow bg-clip-text text-transparent">
              Hinjewadi
            </span>
          </span>
          <span className="mt-1 block text-[0.95rem] font-medium tracking-tight text-white/80">
            families
          </span>
        </h1>
      </div>

      {/* Hairline */}
      <div className="mt-7 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Subcopy */}
      <p className="mt-5 text-[13.5px] leading-relaxed text-white/70">
        A network of{" "}
        <span className="font-semibold text-white">500+ background-verified maids</span>
        {" "}— matched to your home in hours.
      </p>

      {/* CTA row — side-by-side */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          variant="hero"
          asChild
          className="group h-12 w-full rounded-xl text-[13px] font-bold tracking-tight"
        >
          <a href="#enquiry">
            <SparklesIcon className="h-4 w-4" />
            Book Maid
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Button>
        <Button
          variant="outline"
          asChild
          className="h-12 w-full rounded-xl border-white/20 bg-white/[0.04] text-[13px] font-semibold text-white backdrop-blur-md hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
        >
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            <Phone className="h-4 w-4" />
            WhatsApp
          </a>
        </Button>
      </div>

      {/* Meta strip — minimal hairline row */}
      <div className="mt-7 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-center">
        {[
          { icon: ShieldCheck, label: "Verified" },
          { icon: Clock, label: "Fast Match" },
          { icon: RefreshCw, label: "Replacement" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 px-2"
          >
            <Icon className="h-4 w-4 text-accent" aria-hidden />
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Areas note */}
      <p className="mt-5 text-center text-[11px] font-medium tracking-wide text-white/45">
        <span className="text-white/70">Areas</span>
        <span className="mx-2 text-white/25">·</span>
        Wakad · Baner · Marunji · Phase 1–3 · Megapolis
      </p>
    </div>
  </div>
);

const Hero = () => {
  const [active, setActive] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [failedVideos, setFailedVideos] = useState<number[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const allFailed = failedVideos.length >= VIDEOS.length;

  const activePlayableIndex = useMemo(() => {
    if (allFailed) return -1;
    for (let step = 0; step < VIDEOS.length; step += 1) {
      const candidate = (active + step) % VIDEOS.length;
      if (!failedVideos.includes(candidate)) return candidate;
    }
    return -1;
  }, [active, allFailed, failedVideos]);

  const nextPlayableIndex = (from: number) => {
    for (let step = 1; step <= VIDEOS.length; step += 1) {
      const candidate = (from + step) % VIDEOS.length;
      if (!failedVideos.includes(candidate)) return candidate;
    }
    return from;
  };

  const handleVideoEnded = () => {
    if (allFailed || activePlayableIndex < 0) return;
    setVideoReady(false);
    setActive(nextPlayableIndex(activePlayableIndex));
  };

  const handleVideoError = () => {
    if (activePlayableIndex < 0) return;
    setFailedVideos((prev) => (prev.includes(activePlayableIndex) ? prev : [...prev, activePlayableIndex]));
    setVideoReady(false);
    setActive(nextPlayableIndex(activePlayableIndex));
  };

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden min-h-[100svh] flex items-center pt-24 pb-12 md:pt-32 md:pb-14"
    >
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-dark-radial" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,hsl(var(--primary)/0.7),transparent_55%),radial-gradient(ellipse_at_85%_80%,hsl(var(--accent-deep)/0.55),transparent_55%),radial-gradient(ellipse_at_60%_40%,hsl(var(--accent)/0.25),transparent_60%)]"
          aria-hidden
        />

        {/* Blob background texture */}
        <img
          src={blobBg}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none select-none mix-blend-overlay"
        />

        {!allFailed && activePlayableIndex >= 0 && (
          <video
            key={VIDEOS[activePlayableIndex]}
            ref={videoRef}
            src={VIDEOS[activePlayableIndex]}
            autoPlay
            muted
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoReady(true)}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
              videoReady ? "opacity-40" : "opacity-0"
            }`}
            aria-hidden
          />
        )}

        {/* Readability overlays */}
        <div
          className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-700 ${
            videoReady ? "from-black/55 via-black/30 to-black/10" : "from-black/80 via-black/65 to-black/45"
          }`}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" aria-hidden />
        <div className="absolute inset-0 bg-grid-light opacity-[0.07]" aria-hidden />
      </div>

      {/* Floating accent orbs */}
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-accent/30 blur-[120px] animate-glow-pulse pointer-events-none" aria-hidden />
      <div className="absolute bottom-1/4 -right-20 h-80 w-80 rounded-full bg-primary-glow/30 blur-[120px] animate-glow-pulse pointer-events-none" aria-hidden style={{ animationDelay: "1.5s" }} />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Desktop / tablet layout (md+) — preserved exactly */}
        <div className="hidden md:block">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Left — content */}
          <div className="text-center lg:text-left animate-fade-up">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs font-semibold text-white border border-white/15 shadow-elevated">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <MapPin className="h-3.5 w-3.5 text-accent" />
              <span>Serving Hinjewadi IT Park, Pune</span>
              <span className="mx-1 h-3 w-px bg-white/20" />
              <span className="flex items-center gap-1 text-accent">
                <Star className="h-3 w-3 fill-accent" /> 4.9
              </span>
            </div>

            {/* Headline */}
            <h1 className="mx-auto mt-6 max-w-[18ch] font-display text-3xl font-semibold leading-[1.08] tracking-[-0.015em] text-white sm:text-4xl lg:mx-0 lg:text-[3.2rem]">
              <span className="block text-white/85">Trusted Maids for</span>
              <span className="mt-1 block font-extrabold text-white">
                <span className="bg-gradient-to-r from-accent via-accent-deep to-primary-glow bg-clip-text text-transparent">
                  Hinjewadi families
                </span>
              </span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Tap into a network of{" "}
              <span className="font-bold text-accent">500+ background-verified maids</span>{" "}
              for cleaning, cooking, babysitting and full-time domestic help — matched to your home in hours, not days.
            </p>

            {/* CTAs */}
            <div id="book" className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button variant="hero" size="xl" asChild className="group">
                <a href="#enquiry">
                  <SparklesIcon className="h-4 w-4" /> Book a Maid Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  <Phone className="h-4 w-4" /> WhatsApp Us
                </a>
              </Button>
            </div>

            {/* Trust strip */}
            <div className="mt-10 grid grid-cols-3 gap-3 max-w-xl mx-auto lg:mx-0">
              {[
                { icon: ShieldCheck, label: "Verified", sub: "ID & address" },
                { icon: Clock, label: "Fast Match", sub: "Within hours" },
                { icon: RefreshCw, label: "Replacement", sub: "24–48 hrs" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="group flex flex-col items-center lg:items-start gap-1 rounded-2xl glass border border-white/10 px-3 py-3 transition-all duration-300 hover:border-accent/40 hover:-translate-y-0.5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-sm font-bold text-white leading-tight">{label}</div>
                  <div className="text-[11px] text-white/55 leading-tight">{sub}</div>
                </div>
              ))}
            </div>

            {/* Areas served */}
            <p className="mt-6 text-xs font-medium text-white/50 tracking-wide">
              <span className="text-white/70">Areas:</span> Wakad · Bhumkar Chowk · Baner · Marunji · Phase 1–3 · Megapolis
            </p>
          </div>

          {/* Right — big logo */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Halo rings */}
              <div className="absolute inset-0 bg-gradient-brand rounded-full blur-[100px] opacity-60 scale-90 animate-glow-pulse" aria-hidden />
              <div className="absolute inset-10 bg-accent/40 rounded-full blur-[70px] opacity-60" aria-hidden />
              <div className="absolute inset-0 rounded-full border border-white/10 scale-110" aria-hidden />

              <img
                src={`/assets/${logo}`}
                alt="SakhiHome — Trusted Maid Services in Hinjewadi"
                className="relative w-full max-w-md lg:max-w-lg mx-auto animate-float drop-shadow-2xl"
              />

              {/* Floating mini-cards */}
              <div className="hidden md:flex absolute -left-4 top-12 items-center gap-2 rounded-2xl glass-strong border border-white/15 px-3 py-2 shadow-elevated animate-float" style={{ animationDelay: "0.8s" }}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] text-white/60 leading-none">Verified</div>
                  <div className="text-sm font-bold text-white leading-tight">500+ Maids</div>
                </div>
              </div>

              <div className="hidden md:flex absolute -right-2 bottom-16 items-center gap-2 rounded-2xl glass-strong border border-white/15 px-3 py-2 shadow-elevated animate-float" style={{ animationDelay: "1.6s" }}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <Star className="h-4 w-4 fill-accent" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] text-white/60 leading-none">Rated</div>
                  <div className="text-sm font-bold text-white leading-tight">4.9 / 5</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        {/* /Desktop / tablet layout */}

        {/* Mobile layout (<md) — minimal, clean, professional */}
        <MobileHero />
        {/* /Mobile layout */}
      </div>

      </section>
  );
};

export default Hero;
