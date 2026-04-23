import { Phone, MessageCircle, MapPin, ArrowUpRight, Mail } from "lucide-react";
import logo from "@/assets/logo_only.png";
import logotext from "@/assets/logo_text.png";
import blobBg from "@/assets/blobs/color_grunge_pattern_liquidity_style_background.jpg";


const services = [
  { label: "House Cleaning", href: "#services" },
  { label: "Cooking", href: "#services" },
  { label: "Babysitting", href: "#services" },
  { label: "Elder Care", href: "#services" },
  { label: "Full / Part Time", href: "#services" },
];

const areas = [
  "Hinjewadi Phase 1",
  "Hinjewadi Phase 2",
  "Hinjewadi Phase 3",
  "Megapolis",
  "Wakad",
  "Bhumkar Chowk",
  "Baner",
  "Marunji",
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-dark text-dark-foreground">
      {/* Blob background texture */}
      <img
        src={blobBg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-[0.05] pointer-events-none select-none mix-blend-overlay"
      />


      {/* Layers */}
      <div className="absolute inset-0 bg-grid-light opacity-[0.18]" aria-hidden />
      <div className="absolute inset-0 bg-dots-light opacity-30" aria-hidden />
      <div
        className="absolute -left-24 top-0 h-[120%] w-[55%] rotate-[-8deg] bg-gradient-to-br from-primary/25 via-transparent to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent/15 blur-[110px] animate-blob"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-accent-deep/10 blur-[90px] animate-blob [animation-delay:-7s]"
        aria-hidden
      />

      {/* Giant watermark */}
      <p
        className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[clamp(4rem,18vw,14rem)] font-black uppercase leading-none text-white/[0.03]"
        aria-hidden
      >
        SakhiHome
      </p>

      <div className="relative container mx-auto px-4 pt-16 pb-10 md:px-6 md:pt-20">
        {/* Top flare */}
        <div className="mx-auto mb-12 h-px max-w-3xl bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.1] bg-gradient-to-br from-white/[0.08] to-transparent p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_-40px_hsl(var(--primary)/0.35)] md:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/25 blur-[70px]" aria-hidden />
              <a href="#top" className="relative inline-flex flex-col gap-4 sm:flex-row sm:items-center">
                <img src={logo} alt="" className="h-28 shrink-0 object-contain drop-shadow-[0_0_20px_hsl(var(--accent)/0.35)]" />
                <img
                  src={logotext}
                  alt="SakhiHome Services"
                  className="h-auto max-h-20 w-full max-w-[280px] object-contain object-left sm:max-w-none"
                />
              </a>
              <p className="relative mt-6 max-w-md text-sm leading-relaxed text-dark-muted">
                Trusted maid services across <span className="font-semibold text-dark-foreground/90">Hinjewadi IT Park</span>{" "}
                and Pune west — fast matching, verified help, human support.
              </p>
              <div className="relative mt-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Open for bookings
              </div>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
            {/* Services */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-gradient-to-r from-accent to-primary" />
                <h4 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">Services</h4>
              </div>
              <ul className="space-y-1">
                {services.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className="group flex items-center justify-between gap-2 rounded-xl py-2 pl-1 pr-2 text-sm text-dark-muted transition-smooth hover:bg-white/[0.04] hover:text-dark-foreground"
                    >
                      <span>{s.label}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-gradient-to-r from-accent to-primary" />
                <h4 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">Areas</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {areas.map((a) => (
                  <span
                    key={a}
                    className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-semibold tracking-wide text-dark-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-gradient-to-r from-accent to-primary" />
                <h4 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">Contact</h4>
              </div>
              <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 to-transparent p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <ul className="space-y-4 text-sm text-dark-foreground/90">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
                      <Phone className="h-4 w-4 text-accent" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">Call</p>
                      <a href="tel:+9172475977" className="font-semibold hover:text-accent transition-smooth">
                        +91 72475 977
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
                      <MessageCircle className="h-4 w-4 text-accent" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">WhatsApp</p>
                      <a
                        href="https://wa.me/9172475977"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold hover:text-accent transition-smooth"
                      >
                        Message us
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
                      <Mail className="h-4 w-4 text-accent" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">Email</p>
                      <a
                        href="mailto:help@sakhihome.in"
                        className="font-semibold hover:text-accent transition-smooth"
                      >
                        help@sakhihome.in
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
                      <MapPin className="h-4 w-4 text-accent" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">Based in</p>
                      <span className="font-medium leading-snug">Hinjewadi IT Park, Pune</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-dark-muted sm:flex-row">
          <p>© {new Date().getFullYear()} SakhiHome Services. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-accent" />
            Crafted in Hinjewadi · Pune
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
