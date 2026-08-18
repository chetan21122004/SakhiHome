import type { Metadata } from "next";
import BlogSection from "@/app/components/site/BlogSection";
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
  CONTACT_PHONE_E164,
  getAllBranches,
  getLocalBusinessJsonLd,
} from "@/lib/contact";
import {
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
  const branches = getAllBranches();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${canonical}#organization`,
        name: BRAND_NAME,
        url: canonical,
        telephone: CONTACT_PHONE_E164,
        location: branches.map((branch) => ({
          "@id": `${canonical}#${branch.schemaIdSuffix}`,
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${canonical}#website`,
        name: BRAND_NAME,
        url: canonical,
        inLanguage: "en-IN",
      },
      ...branches.map((branch) =>
        getLocalBusinessJsonLd({
          homeUrl: canonical,
          branch,
        }),
      ),
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
          <BlogSection />
          <EnquirySection />
          <FinalCTA />
        </main>
        <Footer />
        <StickyWhatsApp />
      </div>
    </>
  );
}
