import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { HTML_LANG, LOCALES, getDictionary, hasLocale, localePath } from "@/lib/i18n";
import { CONTACT, CREDENTIALS } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { getPublishedCiContent, getPublishedFaq } from "@/lib/publishedContent";
import { CLIENTS, PROJECTS, TRUST_STATS } from "./commercial-and-industrial/content";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CredentialBadges from "./components/CredentialBadges";
import { getHomeCopy } from "./components/home/copy";
import HomeHero from "./components/home/HomeHero";
import ManagingDirector from "./components/home/ManagingDirector";
import HomeNumbers from "./components/home/HomeNumbers";
import FeaturedProjects from "./components/home/FeaturedProjects";
import ProcessTimeline from "./components/home/ProcessTimeline";
import RouteTiles from "./components/home/RouteTiles";
import HomeFaq from "./components/home/HomeFaq";
import HomeFinalCta from "./components/home/HomeFinalCta";

/**
 * The technical face used for eyebrows, capacities and step numbers. Declared
 * here rather than in the layout so only this page pays for the download: the
 * variable is applied to this page's own wrapper, and `--font-mono` in
 * globals.css falls back to a system stack everywhere else.
 */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getHomeCopy(lang);
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: localePath(lang),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], localePath(l)])),
        "x-default": localePath(LOCALES[0]),
      },
    },
  };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = getHomeCopy(lang);

  // The C&I project cards and the FAQ are the same CMS rows the C&I and
  // residential pages read, so an edit there lands here too. Both fall back to
  // the committed content if Supabase is empty or unreachable.
  const [ci, faqItems] = await Promise.all([
    getPublishedCiContent({ projects: PROJECTS, clients: CLIENTS, trustStats: TRUST_STATS }),
    getPublishedFaq("residential", dict.faq.items),
  ]);

  // The organisation is described once, here, because this is the page Google
  // resolves the brand against.
  const organisation = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL.origin}/#organization`,
    name: "MAQO Engineering Sdn Bhd",
    alternateName: "MAQO Solar",
    url: `${SITE_URL.origin}${localePath(lang)}`,
    email: CONTACT.email,
    telephone: "+60380691706",
    foundingDate: "2013",
    description: t.meta.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "27, Jalan TPP 1/1, Taman Perindustrian Puchong",
      addressLocality: "Puchong",
      addressRegion: "Selangor",
      postalCode: "47100",
      addressCountry: "MY",
    },
    areaServed: { "@type": "Place", name: "Peninsular Malaysia" },
    hasCredential: CREDENTIALS,
  };

  return (
    <div className={`${plexMono.variable} contents`}>
      <Header locale={lang} t={dict} ctaHref="#consultation" />
      <main className="flex-1 overflow-x-clip">
        <HomeHero locale={lang} t={t} />

        {/* Why MAQO: the issued marks a buyer can verify, then the mission
            line attributed to the person who said it. Deliberately short. */}
        <section id="why" className="scroll-mt-20 bg-base-bg pb-14 pt-[clamp(3.5rem,6vw,5rem)] sm:pb-16">
          <CredentialBadges t={dict.credentialBadges} set="commercial" />
          <div className="px-4 sm:px-6">
            <ManagingDirector locale={lang} t={t.md} />
          </div>
        </section>

        <HomeNumbers t={t.numbers} />
        <FeaturedProjects locale={lang} t={t} ciProjects={ci.projects.slice(0, 3)} />
        <ProcessTimeline t={t.process} />
        <RouteTiles locale={lang} t={t.routes} />
        <HomeFaq t={t.faq} items={faqItems} />
        <HomeFinalCta locale={lang} t={t.finalCta} shared={dict.finalCta} space={dict.space} />
      </main>

      <Footer
        locale={lang}
        t={dict.footer}
        nav={dict.header.nav}
        explore={[
          { label: t.work.eyebrow, href: "#work" },
          { label: t.process.eyebrow, href: "#process" },
          { label: t.routes.eyebrow, href: "#routes" },
          { label: t.faq.eyebrow, href: "#faq" },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }}
      />
    </div>
  );
}
