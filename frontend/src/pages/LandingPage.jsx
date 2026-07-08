import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Benefits from "@/components/Benefits";
import WhatsIncluded from "@/components/WhatsIncluded";
import HowItWorks from "@/components/HowItWorks";
import LeadForm from "@/components/LeadForm";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export default function LandingPage() {
  useEffect(() => {
    document.title = "PM Kusum Tender & Document Kit — Latest Tender, Checklist & Guidance";
  }, []);

  return (
    <div data-testid="landing-page" className="min-h-screen bg-white text-brand-ink">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Benefits />
        <WhatsIncluded />
        <HowItWorks />
        <LeadForm />
        <Testimonials />
        <FAQ />
        <Disclaimer />
      </main>
      <Footer />
    </div>
  );
}
