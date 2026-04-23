import { Button } from "@/components/ui/button";
import { ShieldCheck, Clock, RefreshCw, MapPin, Phone, Sparkles as SparklesIcon, Star, ArrowRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import logo from "@/assets/logo_both.png";
import bg1 from "@/assets/bg_vdos/1.mp4";
import bg2 from "@/assets/bg_vdos/2.mp4";
import bg3 from "@/assets/bg_vdos/3.mp4";
import blobBg from "@/assets/blobs/color_grunge_pattern_liquidity_style_background.jpg";

const WHATSAPP = "https://wa.me/9172475977?text=Hi%20SakhiHome%2C%20I%27d%20like%20to%20book%20a%20maid";
const VIDEOS = [bg1, bg2, bg3];

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
      className="relative isolate overflow-hidden min-h-[100svh] flex items-center pt-8 pb-12 md:pt-32 md:pb-14"
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
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
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
                src={logo}
                alt="HomeSakhi — Trusted Maid Services in Hinjewadi"
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

      </section>
  );
};

export default Hero;
