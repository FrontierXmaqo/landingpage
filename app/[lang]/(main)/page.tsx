import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { getPublishedCalculatorData, getPublishedLeadFormOptions, getPublishedLeadFormFields } from "@/lib/publishedContent";
import PageviewBeacon from "./components/PageviewBeacon";
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

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  // Pricing and lead-form options come from the CMS in every language: the
  // dictionaries carry the surrounding copy, but the numbers and the dropdown
  // values stay whatever marketing last published.
  const [calculatorData, leadFormOptions, customFields] = await Promise.all([
    getPublishedCalculatorData(),
    getPublishedLeadFormOptions(),
    getPublishedLeadFormFields(),
  ]);

  return (
    <>
      <PageviewBeacon />
      <Header locale={lang} t={t} />
      <main className="flex-1">
        <Hero locale={lang} t={t} leadFormOptions={leadFormOptions} customFields={customFields} />
        <BrandStrip t={t.brandStrip} />
        <WhatsIncluded t={t.whatsIncluded} space={t.space} />
        <BillProof t={t.billProof} space={t.space} />
        <WhyAtap t={t.whyAtap} space={t.space} />
        <SolarCalculator
          t={t.calculator}
          config={calculatorData.config}
          packagesHybrid={calculatorData.packagesHybrid}
          packagesNeo={calculatorData.packagesNeo}
        />
        <HowItWorks t={t.howItWorks} />
        <Achievements t={t.achievements} />
        <CommercialTeaser t={t.commercial} />
        <Testimonials t={t.testimonials} />
        <Gallery t={t.gallery} />
        <FAQ t={t.faq} />
        <FinalCTA t={t.finalCta} space={t.space} />
      </main>
      <Footer locale={lang} t={t.footer} />
    </>
  );
}
