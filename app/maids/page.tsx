import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import Footer from "@/app/components/site/Footer";
import Navbar from "@/app/components/site/Navbar";
import StickyWhatsApp from "@/app/components/site/StickyWhatsApp";
import { getAbsoluteSiteUrl } from "@/lib/services";

export const metadata: Metadata = {
  title: "Maid matching",
  description:
    "SakhiHome shares maid profiles by private invitation link — not on a public directory.",
  alternates: { canonical: getAbsoluteSiteUrl("/maids") },
  robots: { index: true, follow: true },
};

export default function MaidsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-12 md:py-16">
        <ShieldCheck className="h-10 w-10 text-primary" />
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight">
          Profiles by invitation
        </h1>
        <p className="mt-4 text-muted-foreground">
          We do not publish a browsable list of maids online. When you enquire,
          our team sends a secure preview link. If you proceed with a candidate,
          we share a separate full-profile link with complete details.
        </p>
        <Link
          href="/#enquiry"
          className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Request a match
        </Link>
      </main>
      <Footer />
      <StickyWhatsApp />
    </div>
  );
}
