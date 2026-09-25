import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, localeAlternates } from "@/lib/i18n";
import {
  getPublishedCalculatorData,
  getPublishedLeadFormOptions,
  getPublishedLeadFormFields,
  getPublishedBrandLogos,
  getPublishedAchievements,
  getPublishedFaq,
} from "@/lib/publishedContent";
import Header from "../components/Header";
import Hero from "../components/Hero";
import BrandStrip from "../components/BrandStrip";
import BillProof from "../components/BillProof";
import SolarCalculator from "../components/SolarCalculator";
import Testimonials from "../components/Testimonials";
import Gallery from "../components/Gallery";
import FAQ from "../components/FAQ";
import HowItWorks from "../components/HowItWorks";
import WhatsIncluded from "../components/WhatsIncluded";
import WhyAtap from "../components/WhyAtap";
import CommercialTeaser from "../components/CommercialTeaser";
import Achievements from "../components/Achievements";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";

/**
 * This page was the site's homepage until the MAQO Engineering homepage took
 * `/`. Nothing inside it changed in the move: same sections, same `main` lead
 * funnel, same `#assessment` anchor. Only the URL and its canonical did.
 */
export async function generateMetadata({ params }: PageProps<"/[lang]/residential">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  return {
    title: t.homeTitle,
    description: t.homeDescription,
    alternates: localeAlternates(lang, "/residential"),
  };
}

export default async function ResidentialPage({ params }: PageProps<"/[lang]/residential">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  // Pricing and lead-form options come from the CMS in every language: the
  // dictionaries carry the surrounding copy, but the numbers and the dropdown
  // values stay whatever marketing last published.
  const [calculatorData, leadFormOptions, customFields, brands, achievements, faqItems] = await Promise.all([
    getPublishedCalculatorData(),
    getPublishedLeadFormOptions("main"),
    getPublishedLeadFormFields("main"),
    getPublishedBrandLogos(),
    getPublishedAchievements(t.achievements.items, lang),
    getPublishedFaq("residential", t.faq.items, lang),
  ]);

  return (
    <>
      <Header locale={lang} t={t} />
      <main className="flex-1">
        <Hero locale={lang} t={t} leadFormOptions={leadFormOptions} customFields={customFields} />
        <BrandStrip t={t.brandStrip} brands={brands} />
        <BillProof t={t.billProof} space={t.space} />
        <SolarCalculator
          t={t.calculator}
          config={calculatorData.config}
          packagesHybrid={calculatorData.packagesHybrid}
          packagesNeo={calculatorData.packagesNeo}
        />
        <Testimonials t={t.testimonials} />
        <Gallery t={t.gallery} />
        <FAQ t={t.faq} items={faqItems} />
        <HowItWorks t={t.howItWorks} />
        <WhatsIncluded t={t.whatsIncluded} space={t.space} />
        <WhyAtap locale={lang} t={t.whyAtap} space={t.space} />
        <CommercialTeaser t={t.commercial} />
        <Achievements t={t.achievements} items={achievements} />
        <FinalCTA t={t.finalCta} space={t.space} />
      </main>
      <Footer
        locale={lang}
        t={t.footer}
        nav={t.header.nav}
      />
    </>
  );
}
