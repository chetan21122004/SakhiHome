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

export default function Home() {
  return (
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
  );
}
