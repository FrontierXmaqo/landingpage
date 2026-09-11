import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Achievements from "../components/Achievements";
import ScrollReveal from "../components/ScrollReveal";
import { CONTACT, OLD_SITE_IMAGES } from "@/lib/content";

export const metadata: Metadata = {
  title: "About MAQO Solar | Malaysia's Trusted Solar EPC Since 2013",
  description:
    "MAQO Solar is a leading solar power company in Malaysia, delivering ST Class A & CIDB G7-certified residential, commercial & industrial solar systems since 2013. Meet the team and values behind 1,000+ installations.",
};

const gallery = OLD_SITE_IMAGES.gallery;

const HIGHLIGHTS = [
  {
    title: "Led by an engineer",
    body: "Managing Director Kong Kok King holds a Master's degree in Engineering from the University of Tokyo and leads our fully accredited, qualified team.",
    featured: true,
  },
  {
    title: "Nothing outsourced",
    body: "Every project is handled in-house by our own licensed wiremen and chargemen, from licence applications and design to build and commissioning.",
  },
  {
    title: "See it in real time",
    body: "Track your system's performance from our web and mobile app, with live insight into what your panels are generating.",
  },
  {
    title: "25-year warranty",
    body: "Every system is backed by a 25-year performance warranty from our Tier-1, Bloomberg-rated manufacturer partner.",
  },
];

const CORE_VALUES = [
  {
    title: "Professionalism",
    body: "Honesty and integrity in our approach, delivering the best experience from first contact through long-term service and support.",
  },
  {
    title: "Sustainability",
    body: "We understand our responsibility to the environment, our community, our clients and partners, and work to build a better world for them.",
  },
  {
    title: "Quality",
    body: "The “Q” in MAQO stands for Quality. Our thinking, products and practices are held to it, built on the latest technologies and know-how.",
  },
  {
    title: "Together",
    body: "An enjoyable workplace brings out the best in everyone. We respect, value and take care of each other, and we grow together.",
  },
];

const LEAD_CREDENTIAL = {
  title: "ST Class A · CIDB G7",
  body: "The highest electrical contractor class and the highest construction grade issued in Malaysia, held by the same team on every job.",
};

const CREDENTIALS = [
  { title: "SEDA Registered", body: "Official solar installer" },
  { title: "ISO 9001:2015", body: "Quality management certified" },
  { title: "In-house wiremen & chargemen", body: "No outsourcing of critical electrical works" },
  { title: "Est. 2013", body: "13+ years delivering solar across Malaysia" },
];

const SEGMENTS = [
  {
    title: "Residential Solar",
    body: "Turnkey EPC rooftop solar for homes across Klang Valley & Selangor.",
    featured: true,
  },
  { title: "C&I Solar", body: "EPC, PPA and Zero Capex solar for factories, warehouses and offices, from 50kWp to 5,000kWp+." },
  { title: "BESS", body: "Battery energy storage systems for maximum demand management and peak shaving." },
  { title: "PPA / Zero Capex", body: "We invest in your rooftop system. You pay per unit at a discounted rate, zero upfront cost." },
  { title: "Xfiniti Energy", body: "BESS supply, EMS solutions, and solar equipment trading for the industry." },
  { title: "MAQO RE OPC (Philippines)", body: "Investment, developer and PPA model for C&I solar across Mindanao & Luzon." },
];

const GROUP = [
  "Maqo Engineering Sdn Bhd",
  "Xfiniti Energy Sdn Bhd",
  "Maqo Technologies Sdn Bhd",
  "Ecosensa Technologies (AiOPC.bz)",
  "SRM Selambau",
  "Maqo Holdings",
  "MAQO RE OPC",
];
const groupTrack = [...GROUP, ...GROUP];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-x-clip bg-white">
        {/* Hero: full-bleed real installation photo, gradient overlay for legibility, floating stat card breaks the frame */}
        <section className="relative isolate h-[560px] w-full sm:h-[640px]">
          <Image
            src={OLD_SITE_IMAGES.heroHouse}
            alt="MAQO Solar rooftop installation on a Malaysian home at sunset"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-20 sm:px-6 sm:pb-24">
            <span className="section-eyebrow inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase text-white ring-1 ring-white/20 backdrop-blur-sm">
              About MAQO Solar
            </span>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Unstoppable commitment to innovation and the advancement of{" "}
              <span className="text-maqo-orange">clean energy.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-200 sm:text-lg">
              Our vision is simple: bring green, clean energy to everyone, at the most
              affordable cost and with the most reliable service in Malaysia.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/#assessment"
                className="inline-flex items-center justify-center rounded-full bg-maqo-orange px-7 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:brightness-95"
              >
                Get My Free Assessment
              </Link>
              <a
                href={CONTACT.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Chat with us on WhatsApp
              </a>
            </div>
          </div>

          <div className="absolute -bottom-9 right-4 z-20 hidden w-60 rounded-2xl bg-white p-5 shadow-xl sm:right-8 sm:block lg:right-16">
            <p className="text-3xl font-bold text-slate-900">1,000+</p>
            <p className="mt-1 text-sm text-slate-500">Homeowners served since 2013</p>
          </div>
        </section>

        <div className="pt-9 sm:pt-9" />
        <Achievements />

        {/* Who we are: alternating asymmetric photo/text rows */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid items-center gap-10 sm:grid-cols-[1.1fr_0.9fr] sm:gap-14">
              <ScrollReveal>
                <p className="text-sm font-bold uppercase tracking-wide text-maqo-green-dark">
                  Not a fast-quote installer.
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Who is <span className="text-maqo-orange">MAQO</span>?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  MAQO is a leading solar power company and solar panel installer in Malaysia,
                  delivering clean energy for everything from residential rooftops to
                  full-scale commercial &amp; industrial systems and solar farm projects.
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  Since 2013, we&apos;ve grown into one of Malaysia&apos;s most trusted solar
                  providers, earning that trust through technology-driven energy savings and
                  customer-first service, delivered one project at a time.
                </p>
              </ScrollReveal>
              <ScrollReveal delayMs={120} className="relative sm:justify-self-end">
                <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl shadow-lg sm:rotate-2">
                  <Image
                    src={gallery[0]}
                    alt="MAQO Solar residential installation project"
                    fill
                    className="object-cover transition duration-500 hover:scale-105"
                    sizes="(min-width: 640px) 320px, 80vw"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 rounded-xl bg-white px-4 py-2.5 shadow-lg sm:-left-6">
                  <p className="text-sm font-bold text-slate-900">Est. 2013</p>
                  <p className="text-xs text-slate-500">13+ years in the field</p>
                </div>
              </ScrollReveal>
            </div>

            <div className="mt-16 grid items-center gap-10 sm:grid-cols-[0.9fr_1.1fr] sm:gap-14">
              <ScrollReveal className="order-2 relative sm:order-1">
                <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl shadow-lg sm:-rotate-2">
                  <Image
                    src={gallery[1]}
                    alt="MAQO Solar commercial installation project"
                    fill
                    className="object-cover transition duration-500 hover:scale-105"
                    sizes="(min-width: 640px) 320px, 80vw"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 rounded-xl bg-white px-4 py-2.5 shadow-lg sm:-right-6">
                  <p className="text-sm font-bold text-slate-900">500+</p>
                  <p className="text-xs text-slate-500">C&amp;I clients served</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delayMs={120} className="order-1 sm:order-2">
                <p className="text-sm font-bold uppercase tracking-wide text-maqo-green-dark">
                  Beware of fast quotes.
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  <span className="text-maqo-orange">Quality</span> above all
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  Not all solar companies are the same, and neither are solar proposals. We
                  take the time to understand your roof and your needs, and give you options
                  built for where you are today and where you&apos;re headed.
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  You&apos;re not just another customer to us. You&apos;re a business partner,
                  and part of the MAQO family.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Founder quote: real photo, brand-green overlay locked to full contrast, oversized quote mark */}
        <section className="relative overflow-hidden bg-maqo-green-dark py-20 sm:py-24">
          <Image
            src={gallery[2]}
            alt=""
            fill
            aria-hidden
            className="object-cover opacity-15"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-maqo-green-dark/90" />
          <ScrollReveal className="relative mx-auto max-w-3xl px-4 sm:px-6">
            <span aria-hidden className="block text-6xl font-bold leading-none text-white/25 sm:text-7xl">
              &ldquo;
            </span>
            <p className="-mt-6 text-xl font-semibold leading-relaxed text-white sm:text-2xl">
              We&apos;re in it for you, and for a better planet. Our mission is to reshape the
              energy landscape by making solar power accessible and affordable for everyone.
            </p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-white/70">
              Kong Kok King, Managing Director, MAQO Solar
            </p>
          </ScrollReveal>
        </section>

        {/* Team of experts: one featured card leads, three support it */}
        <section className="bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Team of <span className="text-maqo-orange">experts</span>
              </h2>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                We provide the latest solar technology and financing options, so you can make
                an informed decision before installing solar panels on your property.
              </p>
            </ScrollReveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {HIGHLIGHTS.map((h, i) => (
                <ScrollReveal
                  key={h.title}
                  delayMs={i * 80}
                  className={h.featured ? "lg:col-span-2" : ""}
                >
                  <div
                    className={`h-full rounded-2xl border p-6 shadow-sm ${
                      h.featured
                        ? "border-maqo-green/30 bg-maqo-green/5"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <p
                      className={
                        h.featured
                          ? "text-xl font-bold text-slate-900"
                          : "text-lg font-semibold text-slate-900"
                      }
                    >
                      {h.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{h.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Core values: staggered rhythm instead of a uniform grid */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                The &ldquo;Q&rdquo; in MAQO stands for <span className="text-maqo-orange">Quality</span>
              </h2>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                It&apos;s in our name, and it&apos;s in our DNA. Four values guide how we work
                with each other, our clients, and our partners.
              </p>
            </ScrollReveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {CORE_VALUES.map((v, i) => (
                <ScrollReveal
                  key={v.title}
                  delayMs={i * 80}
                  className={i % 2 === 1 ? "sm:mt-8" : ""}
                >
                  <div className="h-full rounded-2xl border border-slate-200 p-6 transition hover:border-maqo-green/40 hover:shadow-md">
                    <p className="text-base font-semibold text-slate-900">{v.title}</p>
                    <p className="mt-2 text-sm text-slate-500">{v.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Credentials: one lead license card, four supporting */}
        <section className="bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <p className="text-sm font-bold uppercase tracking-wide text-maqo-green-dark">
                Nothing here is outsourced.
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Built on the highest <span className="text-maqo-orange">standards</span>
              </h2>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                We hold the top-tier licenses in the industry so every project meets the
                strictest safety, quality and construction requirements.
              </p>
            </ScrollReveal>
            <ScrollReveal className="mt-10 rounded-2xl border border-maqo-green/30 bg-white p-7 shadow-sm">
              <p className="text-2xl font-bold text-slate-900">{LEAD_CREDENTIAL.title}</p>
              <p className="mt-2 text-sm text-slate-500">{LEAD_CREDENTIAL.body}</p>
            </ScrollReveal>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {CREDENTIALS.map((c, i) => (
                <ScrollReveal key={c.title} delayMs={i * 60}>
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-base font-semibold text-slate-900">{c.title}</p>
                    <p className="mt-2 text-sm text-slate-500">{c.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* What we do: one featured segment leads the grid */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <p className="text-sm font-bold uppercase tracking-wide text-maqo-green-dark">
                One rooftop. Or a gigawatt pipeline.
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                What we <span className="text-maqo-orange">do</span>
              </h2>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                A full-stack clean energy platform serving homeowners, factories and
                developers alike.
              </p>
            </ScrollReveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SEGMENTS.map((s, i) => (
                <ScrollReveal
                  key={s.title}
                  delayMs={i * 60}
                  className={s.featured ? "lg:col-span-2" : ""}
                >
                  <div
                    className={`group h-full rounded-2xl border p-6 transition hover:border-maqo-green/40 hover:shadow-md ${
                      s.featured ? "border-maqo-orange/30 bg-maqo-orange/5" : "border-slate-200"
                    }`}
                  >
                    <p
                      className={`font-semibold text-slate-900 group-hover:text-maqo-green-dark ${
                        s.featured ? "text-xl" : "text-base"
                      }`}
                    >
                      {s.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{s.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Group structure: a moving strip, showing breadth rather than stating it */}
        <section className="bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                The MAQO <span className="text-maqo-orange">Group</span>
              </h2>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                One mission, seven specialized entities across Malaysia and the Philippines.
              </p>
            </ScrollReveal>
          </div>
          <div className="relative mt-10 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-slate-50 to-transparent sm:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-slate-50 to-transparent sm:w-24" />
            <div className="flex w-max animate-marquee-ltr items-center">
              {groupTrack.map((g, i) => (
                <span
                  key={`${g}-${i}`}
                  className="mx-2.5 shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery: asymmetric photo layout, real installs, not a decorative grid */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <p className="text-sm font-bold uppercase tracking-wide text-maqo-green-dark">
                Proof, not promises.
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Our work speaks for itself
              </h2>
            </ScrollReveal>
            <ScrollReveal
              delayMs={100}
              className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:[grid-auto-rows:150px]"
            >
              <div className="relative col-span-2 row-span-1 overflow-hidden rounded-xl border border-slate-200 bg-white sm:col-span-2 sm:row-span-2">
                <Image
                  src={gallery[3]}
                  alt="MAQO Solar installation project"
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                  sizes="(min-width: 640px) 45vw, 90vw"
                />
              </div>
              {[gallery[4], gallery[5], gallery[6], gallery[7]].map((src, i) => (
                <div
                  key={src}
                  className="relative col-span-1 row-span-1 overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <Image
                    src={src}
                    alt={`MAQO Solar installation project ${i + 2}`}
                    fill
                    className="object-cover transition duration-500 hover:scale-105"
                    sizes="(min-width: 640px) 22vw, 45vw"
                  />
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>

        {/* CTA: textured callback to the hero photo */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <ScrollReveal className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-14 text-center sm:px-12">
            <Image
              src={OLD_SITE_IMAGES.heroHouse}
              alt=""
              fill
              aria-hidden
              className="object-cover opacity-10"
              sizes="100vw"
            />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Ready to energize your <span className="text-maqo-orange">future</span>?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
                Talk to our team about residential solar, C&amp;I EPC, BESS, or Zero Capex PPA.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/#assessment"
                  className="inline-flex items-center justify-center rounded-full bg-maqo-orange px-7 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:brightness-95"
                >
                  Get My Free Assessment
                </Link>
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-slate-600 px-7 py-3 text-sm font-semibold text-white transition hover:border-slate-400"
                >
                  WhatsApp us
                </a>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
