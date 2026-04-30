"use client";

import { useEffect, useMemo, useState } from "react";
import { Home, Layers, MapPin, Phone, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { homeSection } from "@/lib/siteNav";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  hash?: string;
};

const items: NavItem[] = [
  { label: "Home", href: homeSection("top"), icon: Home },
  { label: "Services", href: homeSection("services"), icon: Layers, hash: "services" },
  { label: "Areas", href: homeSection("areas"), icon: MapPin, hash: "areas" },
  { label: "Enquiry", href: homeSection("enquiry"), icon: Send, hash: "enquiry" },
  { label: "Call", href: "tel:+919172475977", icon: Phone },
];

const BottomNav = () => {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash.replace(/^#/, ""));
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const isHomeRoute = pathname === "/";

  const activeLabel = useMemo(() => {
    if (!isHomeRoute) return "";
    if (hash) {
      const matched = items.find((item) => item.hash === hash);
      if (matched) return matched.label;
    }
    return "Home";
  }, [hash, isHomeRoute]);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-dark/96 backdrop-blur-xl md:hidden"
      aria-label="Bottom navigation"
    >
      <ul className="grid h-16 grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.label === activeLabel;
          return (
            <li key={item.label} className="flex">
              <a
                href={item.href}
                className={`flex min-h-12 w-full flex-col items-center justify-center gap-1 rounded-xl transition-smooth ${
                  active
                    ? "bg-white/10 text-accent"
                    : "text-dark-muted hover:bg-white/8 hover:text-dark-foreground"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[10px] font-semibold leading-none">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
