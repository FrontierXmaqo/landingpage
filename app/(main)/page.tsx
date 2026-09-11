import Header from "./components/Header";
import Hero from "./components/Hero";
import BrandStrip from "./components/BrandStrip";
import WhatsIncluded from "./components/WhatsIncluded";
import BillProof from "./components/BillProof";
import WhyAtap from "./components/WhyAtap";
import SolarCalculator from "./components/SolarCalculator";
import HowItWorks from "./components/HowItWorks";
import Achievements from "./components/Achievements";
import CommercialTeaser from "./components/CommercialTeaser";
import Testimonials from "./components/Testimonials";
import Gallery from "./components/Gallery";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <BrandStrip />
        <WhatsIncluded />
        <BillProof />
        <WhyAtap />
        <SolarCalculator />
        <HowItWorks />
        <Achievements />
        <CommercialTeaser />
        <Testimonials />
        <Gallery />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
