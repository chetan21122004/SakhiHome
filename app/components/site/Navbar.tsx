'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
const logo = "/assets/logo_only.png";
const logotext = "/assets/logo_text.png";

const links = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#process" },
  { label: "Areas", href: "#areas" },
  { label: "About", href: "#about" },
  { label: "Enquiry", href: "#enquiry" },
];

const WHATSAPP = "https://wa.me/919172475977?text=Hi%20SakhiHome%2C%20I%27d%20like%20to%20book%20a%20maid";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 overflow-visible">
      {/* Readable backdrop — grows with navbar content */}
      <div
        className={`pointer-events-none absolute inset-0 transition-all duration-500 ease-out ${
          scrolled ? "bg-dark/[0.92] backdrop-blur-xl" : "bg-gradient-to-b from-dark/95 via-dark/75 to-dark/35 backdrop-blur-md"
        }`}
        aria-hidden
      />

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-70"
        }`}
        aria-hidden
      />

      {/* Accent smoke */}
      <div
        className="pointer-events-none absolute -top-28 left-[18%] h-52 w-52 rounded-full bg-accent/25 blur-[88px] animate-blob"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 right-[12%] h-44 w-44 rounded-full bg-primary/30 blur-[76px] animate-blob [animation-delay:-6s]"
        aria-hidden
      />

      <nav className="container relative mx-auto flex flex-wrap items-center gap-x-3 py-1 px-4 md:flex-nowrap md:gap-4 md:px-6 ">
        {/* Logo — both marks visible on mobile; sizes follow content */}
        <a
          href="#top"
          aria-label="SakhiHome — home"
          className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5 md:flex-initial md:max-w-none"
        >
          <img
            src={logo}
            alt=""
            className="w-24"
          />
          <img
            src={logotext}
            alt="SakhiHome Services"
            className=" h-12"
          />
        </a>

        {/* Center rail — high-contrast glass */}
        <ul className="order-last hidden min-w-0 flex-[100%] justify-center md:order-none md:flex md:flex-1 md:justify-center">
          <li className="flex max-w-full rounded-full border border-white/25 bg-dark/50 px-0.5 py-0.5 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative whitespace-nowrap rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-dark-foreground drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] transition-smooth hover:bg-white/15 md:px-3.5"
              >
                <span className="relative z-10">{l.label}</span>
                <span
                  className="absolute inset-x-2 bottom-1 h-[2px] scale-x-0 rounded-full bg-gradient-to-r from-accent via-primary to-accent-deep opacity-0 transition-smooth group-hover:scale-x-100 group-hover:opacity-100"
                  aria-hidden
                />
              </a>
            ))}
          </li>
        </ul>

        <div className="hidden shrink-0 items-center gap-2 md:flex md:gap-2.5">
          <Button
            variant="outlineDark"
            size="sm"
            className="border-white/35 bg-dark/40 text-dark-foreground shadow-[0_2px_16px_rgba(0,0,0,0.45)] backdrop-blur-sm hover:bg-dark/60"
            asChild
          >
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>
          <Button variant="hero" size="sm" className="relative overflow-hidden shadow-glow" asChild>
            <a href="#enquiry">
              <span className="pointer-events-none absolute inset-0 animate-shimmer opacity-35" aria-hidden />
              <span className="relative drop-shadow-sm">Book Maid</span>
            </a>
          </Button>
        </div>

        <button
          type="button"
          className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 bg-dark/55 text-dark-foreground shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-smooth hover:border-accent/50 hover:bg-dark/70 md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile */}
      <div
        className={`md:hidden overflow-hidden border-t border-white/15 bg-dark/[0.97] backdrop-blur-2xl transition-all duration-300 ease-out ${
          open ? "max-h-[min(85vh,520px)] opacity-100 shadow-[0_24px_60px_rgba(0,0,0,0.5)]" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-5">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-accent drop-shadow-sm">Menu</p>
          <ul className="flex flex-col gap-1.5">
            {links.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-dark-foreground shadow-inner transition-smooth hover:border-accent/35 hover:bg-white/10"
                >
                  <span className="font-display text-[11px] font-bold tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-semibold drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-5">
            <Button variant="outlineDark" className="w-full border-white/30 bg-dark/50" asChild>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
            <Button variant="hero" className="w-full shadow-glow" asChild>
              <a href="#enquiry" onClick={() => setOpen(false)}>
                Book Maid
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
