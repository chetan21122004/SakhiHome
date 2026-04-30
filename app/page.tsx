import type { Metadata } from "next";
import About from "@/app/components/site/About";
import Areas from "@/app/components/site/Areas";
import EnquirySection from "@/app/components/site/EnquirySection";
import FinalCTA from "@/app/components/site/FinalCTA";
import Footer from "@/app/components/site/Footer";
import Hero from "@/app/components/site/Hero";
import Navbar from "@/app/components/site/Navbar";
import Process from "@/app/components/site/Process";
import Services from "@/app/components/site/Services";
import StickyWhatsApp from "@/app/components/site/StickyWhatsApp";
import Testimonials from "@/app/components/site/Testimonials";
import TrustSection from "@/app/components/site/TrustSection";
import {
  AREA_SERVED_CITY,
  AREA_SERVED_LOCALITY,
  BRAND_NAME,
  getAbsoluteSiteUrl,
} from "@/lib/services";

const canonical = getAbsoluteSiteUrl("/");

export const metadata: Metadata = {
  alternates: {
    canonical,
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${canonical}#organization`,
        name: BRAND_NAME,
        url: canonical,
      },
      {
        "@type": "WebSite",
        "@id": `${canonical}#website`,
        name: BRAND_NAME,
        url: canonical,
        inLanguage: "en-IN",
      },
      {
        "@type": "LocalBusiness",
        "@id": `${canonical}#localbusiness`,
        name: BRAND_NAME,
        url: canonical,
        address: {
          "@type": "PostalAddress",
          addressLocality: AREA_SERVED_CITY,
          addressRegion: "Maharashtra",
          addressCountry: "IN",
        },
        areaServed: {
          "@type": "Place",
          name: `${AREA_SERVED_LOCALITY}, ${AREA_SERVED_CITY}`,
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <TrustSection />
          <Services />
          <Process />
          <About />
          <Areas />
          <Testimonials />
          <EnquirySection />
          <FinalCTA />
        </main>
        <Footer />
        <StickyWhatsApp />
      </div>
    </>
  );
}
