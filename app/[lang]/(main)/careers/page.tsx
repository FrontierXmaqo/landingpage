import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import SectionTag from "../components/SectionTag";
import CareersBoard from "./CareersBoard";
import RotatingWord from "./RotatingWord";
import { getDictionary, hasLocale, localeAlternates, localePath } from "@/lib/i18n";
import { getPublishedContact } from "@/lib/publishedContent";

export async function generateMetadata({ params }: PageProps<"/[lang]/careers">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: "Careers | MAQO Solar",
    description: "Join MAQO Solar. Open roles in sales, projects, engineering, marketing and finance across Malaysia.",
    alternates: localeAlternates(lang, "/careers"),
  };
}

const CREDENTIALS = ["ST Class A", "CIDB G7", "SEDA Registered", "ISO 9001:2015", "In-house licensed wiremen"];
const POWER = [
  ["P", "Passion"],
  ["O", "Ownership"],
  ["W", "Win Win"],
  ["E", "Excellence, Endurance, Efficient"],
  ["R", "Respect & Honesty"],
];

// Page copy is English in every language for now; the header, footer and form chrome still follow the visitor's language.
export default async function CareersPage({ params }: PageProps<"/[lang]/careers">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const contact = await getPublishedContact();

  return (
    <>
      <Header locale={lang} t={dict} ctaHref={localePath(lang, "/#consultation")} />
      <main className="flex-1 overflow-x-clip">
        <section className="relative overflow-hidden pb-10 pt-14 sm:pt-16">
          <div aria-hidden className="atap-hero-glow atap-hero-dots pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <ScrollReveal>
              <SectionTag>Careers at MAQO</SectionTag>
              <h1 className="mt-5 whitespace-nowrap text-[clamp(2rem,8vw,6rem)] font-extrabold leading-[1] tracking-tight text-base-ink">
                Power up your <RotatingWord />
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-base-slate sm:text-lg">
                We design, build and run solar, battery storage and energy systems for over 1,000 customers across Malaysia. Join the Maqorians.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#apply" className="inline-flex min-h-12 items-center rounded-full bg-brand-orange-deep px-7 text-sm font-semibold text-white transition hover:brightness-95">Apply now</a>
                <a href="#roles" className="inline-flex min-h-12 items-center rounded-full border-2 border-base-ink px-7 text-sm font-semibold text-base-ink transition hover:bg-base-ink hover:text-white">See open roles</a>
              </div>
              <ul className="mt-10 flex flex-wrap gap-2.5">
                {CREDENTIALS.map((c) => (
                  <li key={c} className="rounded-full border border-base-line bg-base-panel px-4 py-2 text-sm font-medium text-base-ink">{c}</li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>

        <CareersBoard locale={lang} />

        <section className="bg-brand-forest py-16 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Built on P.O.W.E.R.</h2>
            <p className="mt-3 max-w-xl text-white/80">Five values shape how Maqorians hire, build and treat customers and each other.</p>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {POWER.map(([letter, word]) => (
                <li key={letter} className="rounded-2xl bg-white/10 p-5">
                  <b className="block text-4xl font-extrabold leading-none text-brand-orange">{letter}</b>
                  <span className="mt-2 block text-[15px]">{word}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer contact={contact} locale={lang} t={dict.footer} nav={dict.header.nav} />
    </>
  );
}
