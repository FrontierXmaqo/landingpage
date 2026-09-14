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
import { getPublishedCalculatorData, getPublishedLeadFormOptions } from "@/lib/publishedContent";
import PageviewBeacon from "./components/PageviewBeacon";

export default async function Home() {
  const [calculatorData, leadFormOptions] = await Promise.all([
    getPublishedCalculatorData(),
    getPublishedLeadFormOptions(),
  ]);

  return (
    <>
      <PageviewBeacon />
      <Header />
      <main className="flex-1">
        <Hero leadFormOptions={leadFormOptions} />
        <BrandStrip />
        <WhatsIncluded />
        <BillProof />
        <WhyAtap />
        <SolarCalculator
          config={calculatorData.config}
          packagesHybrid={calculatorData.packagesHybrid}
          packagesNeo={calculatorData.packagesNeo}
        />
        <HowItWorks />
        <Achievements />
        <CommercialTeaser />
        <Testimonials />
        <Gallery />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
