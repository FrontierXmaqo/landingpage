import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Achievements from "../components/Achievements";
import { CONTACT, OLD_SITE_IMAGES } from "@/lib/content";

export const metadata: Metadata = {
  title: "About MAQO Solar | Malaysia's Trusted Solar EPC Since 2013",
  description:
    "MAQO Solar is a leading solar power company in Malaysia, delivering ST Class A & CIDB G7-certified residential, commercial & industrial solar systems since 2013. Meet the team and values behind 1,000+ installations.",
};

const HIGHLIGHTS = [
  {
    title: "Led by an engineer",
    body: "Managing Director Kong Kok King holds a Master's degree in Engineering from the University of Tokyo and leads our fully accredited, qualified team.",
  },
  {
    title: "Nothing outsourced",
    body: "Every project is handled in-house by our own licensed wiremen and chargemen — from licence applications and design to build and commissioning.",
  },
  {
    title: "See it in real time",
    body: "Track your system's performance from our web and mobile app, with live insight into what your panels are generating.",
  },
  {
    title: "25-year performance warranty",
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
    body: "We understand our responsibility to the environment, our community, our clients and partners — and work to build a better world for them.",
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

const CREDENTIALS = [
  { title: "ST Class A", body: "Highest electrical contractor class in Malaysia" },
  { title: "CIDB G7", body: "Highest construction grade in Malaysia" },
  { title: "SEDA Registered", body: "Official solar installer" },
  { title: "ISO 9001:2015", body: "Quality management certified" },
  { title: "In-house wiremen & chargemen", body: "No outsourcing of critical electrical works" },
  { title: "Est. 2013", body: "13+ years delivering solar across Malaysia" },
];

const SEGMENTS = [
  { title: "Residential Solar", body: "Turnkey EPC rooftop solar for homes across Klang Valley & Selangor." },
  { title: "C&I Solar", body: "EPC, PPA and Zero Capex solar for factories, warehouses and offices — 50kWp to 5,000kWp+." },
  { title: "BESS", body: "Battery energy storage systems for maximum demand management and peak shaving." },
  { title: "PPA / Zero Capex", body: "We invest in your rooftop system — you pay per unit at a discounted rate, zero upfront cost." },
  { title: "Xfiniti Energy", body: "BESS supply, EMS solutions, and solar equipment trading for the industry." },
  { title: "MAQO RE OPC — Philippines", body: "Investment, developer and PPA model for C&I solar across Mindanao & Luzon." },
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

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-maqo-green/5 via-white to-white">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-maqo-orange/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-maqo-green/20 blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
            <span className="section-eyebrow inline-flex items-center rounded-full bg-maqo-green/10 px-3 py-1 text-xs font-semibold uppercase text-maqo-green-dark">
              About MAQO Solar
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Unstoppable commitment to innovation and the advancement of clean energy.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              Our vision is to bring green, clean energy to everyone — at the most affordable
              cost and with the most reliable service. As a solar panel installer in Malaysia, we
              design solar systems and offer flexible financing so our clients can go green,
              generate their own energy, and save money.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Chat with us on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <Achievements />

        {/* Who we are */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid gap-12 sm:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Who is MAQO?</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  MAQO is a leading solar power company and solar panel installer in Malaysia,
                  delivering clean energy for everything from residential rooftops to full-scale
                  commercial &amp; industrial systems and solar farm projects.
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  Since 2013, we&apos;ve grown into one of Malaysia&apos;s most trusted solar
                  providers — earning that trust through technology-driven energy savings and
                  customer-first service, delivered one project at a time.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Quality above all</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  Not all solar companies are the same — and neither are solar proposals. Beware
                  of anyone offering a fast quote before really understanding your roof. We take
                  the time to understand your needs and give you options built for where you are
                  today and where you&apos;re headed.
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  You&apos;re not just another customer to us — you&apos;re a business partner,
                  and part of the MAQO family.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder quote */}
        <section className="bg-maqo-green-dark py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="text-xl font-semibold leading-relaxed text-white sm:text-2xl">
              &ldquo;We&apos;re in it for you — and for a better planet. Our mission is to reshape
              the energy landscape by making solar power accessible and affordable for
              everyone.&rdquo;
            </p>
            <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-white/70">
              Kong Kok King &mdash; Managing Director, MAQO Solar
            </p>
          </div>
        </section>

        {/* What you get */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Team of experts</h2>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              We provide the latest solar technology and financing options, so you can make an
              informed decision before installing solar panels on your property.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {HIGHLIGHTS.map((h) => (
                <div
                  key={h.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-lg font-semibold text-slate-900">{h.title}</p>
                  <p className="mt-2 text-sm text-slate-500">{h.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core values */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              The &ldquo;Q&rdquo; in MAQO stands for Quality
            </h2>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              It&apos;s in our name, and it&apos;s in our DNA. Four values guide how we work with
              each other, our clients, and our partners.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {CORE_VALUES.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl border border-slate-200 p-6 transition hover:border-maqo-green/40 hover:shadow-md"
                >
                  <p className="text-base font-semibold text-slate-900">{v.title}</p>
                  <p className="mt-2 text-sm text-slate-500">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Built on the highest standards
            </h2>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              We hold the top-tier licenses in the industry so every project meets the strictest
              safety, quality and construction requirements.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CREDENTIALS.map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-lg font-semibold text-slate-900">{c.title}</p>
                  <p className="mt-2 text-sm text-slate-500">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What we do */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">What we do</h2>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              A full-stack clean energy platform — from a single rooftop to gigawatt-scale
              ambitions.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SEGMENTS.map((s) => (
                <div
                  key={s.title}
                  className="group rounded-2xl border border-slate-200 p-6 transition hover:border-maqo-green/40 hover:shadow-md"
                >
                  <p className="text-base font-semibold text-slate-900 group-hover:text-maqo-green-dark">
                    {s.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Group structure */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">The MAQO Group</h2>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              One mission, several specialized entities — across Malaysia and the Philippines.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              {GROUP.map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm text-slate-700"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery teaser */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Our work speaks for itself</h2>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              A few recent installations from across Malaysia.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {OLD_SITE_IMAGES.gallery.slice(0, 4).map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <Image
                    src={src}
                    alt={`MAQO Solar installation project ${i + 1}`}
                    fill
                    className="object-cover transition duration-300 hover:scale-105"
                    sizes="(min-width: 640px) 25vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl bg-slate-900 px-6 py-14 text-center sm:px-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to energize your future?
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
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
