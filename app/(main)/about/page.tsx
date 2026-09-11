import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Achievements from "../components/Achievements";
import ScrollReveal from "../components/ScrollReveal";
import SectionTag from "../components/SectionTag";
import { CONTACT, OLD_SITE_IMAGES } from "@/lib/content";

export const metadata: Metadata = {
  title: "About MAQO Solar | Malaysia's Trusted Solar EPC Since 2013",
  description:
    "MAQO Solar is a leading solar power company in Malaysia, delivering ST Class A & CIDB G7-certified residential, commercial & industrial solar systems since 2013. Meet the team and values behind 1,000+ installations.",
};

const gallery = OLD_SITE_IMAGES.gallery;

const DUE_DILIGENCE = [
  {
    title: "ST Class A · CIDB G7",
    tag: "Top electrical and construction grades",
    body: "ST Class A is the highest electrical contractor class issued by Suruhanjaya Tenaga. CIDB G7 is the highest construction grade. The same licensed entity carries your job, whether that is one rooftop or a factory.",
  },
  {
    title: "In-house wiremen and chargemen",
    tag: "Critical electrical work is never subcontracted",
    body: "Licence applications, system design, build and commissioning stay with our own people. The wireman on your roof is on our team, not a stranger's.",
  },
  {
    title: "SEDA registered",
    tag: "Recognised solar installer",
    body: "We are registered with the Sustainable Energy Development Authority, the body behind Malaysia's national solar programmes.",
  },
  {
    title: "ISO 9001:2015",
    tag: "Certified quality management",
    body: "Our quality management system is externally certified, so the process behind your installation is documented and repeatable rather than improvised.",
  },
  {
    title: "25-year performance warranty",
    tag: "Backed by a Tier-1 manufacturer",
    body: "Panels carry a 25-year performance warranty from our Tier-1, Bloomberg-rated manufacturer partner.",
  },
  {
    title: "Live system monitoring",
    tag: "Web and mobile app",
    body: "Track what your system is generating in real time, so your savings are something you can check rather than take on trust.",
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
    body: "Our thinking, products, solutions and practice are held to it, built on the latest technologies and knowledge rather than whatever is quickest.",
  },
  {
    title: "Together",
    body: "An enjoyable workplace brings out the best in everyone. We respect, value and take care of each other, and we grow together.",
  },
];

const SEGMENTS = [
  { title: "Residential Solar", body: "Turnkey EPC rooftop solar for homes across Klang Valley & Selangor." },
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
                  Who is <span className="text-maqo-orange-dark">MAQO</span>?
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
              <ScrollReveal delayMs={120}>
                <div className="relative mx-auto w-full max-w-xs sm:ml-auto sm:mr-0">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg sm:rotate-2">
                    <Image
                      src={gallery[0]}
                      alt="MAQO Solar residential installation project"
                      fill
                      className="object-cover transition duration-500 hover:scale-105"
                      sizes="(min-width: 640px) 320px, 80vw"
                    />
                  </div>
                  <div className="absolute bottom-5 -left-4 z-10 rounded-xl bg-white px-4 py-2.5 shadow-xl sm:-left-6">
                    <p className="text-sm font-bold text-slate-900">Est. 2013</p>
                    <p className="text-xs text-slate-500">13+ years in the field</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="mt-16 grid items-center gap-10 sm:grid-cols-[0.9fr_1.1fr] sm:gap-14">
              <ScrollReveal className="order-2 sm:order-1">
                <div className="relative mx-auto w-full max-w-xs sm:mx-0">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg sm:-rotate-2">
                    <Image
                      src={gallery[1]}
                      alt="MAQO Solar commercial installation project"
                      fill
                      className="object-cover transition duration-500 hover:scale-105"
                      sizes="(min-width: 640px) 320px, 80vw"
                    />
                  </div>
                  <div className="absolute bottom-5 -right-4 z-10 rounded-xl bg-white px-4 py-2.5 shadow-xl sm:-right-6">
                    <p className="text-sm font-bold text-slate-900">500+</p>
                    <p className="text-xs text-slate-500">C&amp;I clients served</p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delayMs={120} className="order-1 sm:order-2">
                <p className="text-sm font-bold uppercase tracking-wide text-maqo-green-dark">
                  Beware of fast quotes.
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  <span className="text-maqo-orange-dark">Quality</span> above all
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

        {/* Team: the real crew, photographed. The strongest trust signal we have. */}
        <section className="bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal className="max-w-xl">
              <SectionTag>Our team</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                The people on your roof{" "}
                <span className="text-maqo-orange-dark">work for us.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                Managing Director Kong Kok King holds a Master&apos;s degree in Engineering
                from the University of Tokyo. The team he leads is fully accredited and
                qualified, and it is the same team that turns up at your property.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Licence applications, system design, build and commissioning all stay
                in-house. Nothing critical is handed to a subcontractor you have never met.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-maqo-orange px-7 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:brightness-95"
                >
                  Talk to the team
                </a>
                <a
                  href="#standards"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  See our licences
                </a>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delayMs={120} className="mx-auto mt-12 max-w-6xl px-4 sm:px-6">
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl shadow-xl sm:aspect-[2/1]">
              <Image
                src="/maqo-team.png"
                alt="The MAQO Solar team in company uniform, holding a MAQO banner"
                fill
                className="object-cover"
                sizes="(min-width: 1152px) 1104px, 100vw"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <p className="absolute bottom-5 left-5 text-sm font-semibold text-white sm:left-7">
                The MAQO team
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Core values: an editorial index, not another card grid */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal className="max-w-xl">
              <SectionTag>Our DNA</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                The &ldquo;Q&rdquo; in MAQO stands for{" "}
                <span className="text-maqo-orange-dark">Quality.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                It is in our name, and it is in how we work. Four values sit behind every
                proposal we write and every roof we finish.
              </p>
            </ScrollReveal>
            <div className="mt-12 border-t border-slate-200">
              {CORE_VALUES.map((v, i) => (
                <ScrollReveal key={v.title} delayMs={i * 70}>
                  <div className="grid gap-3 border-b border-slate-200 py-7 sm:grid-cols-[2.5rem_11rem_1fr] sm:items-baseline sm:gap-8">
                    <span className="text-sm font-bold tabular-nums text-maqo-orange-dark">
                      0{i + 1}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">{v.title}</h3>
                    <p className="text-base leading-relaxed text-slate-600">{v.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Standards: due-diligence answers up front, as a native keyboard-accessible accordion */}
        <section id="standards" className="scroll-mt-20 bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal className="max-w-xl">
              <SectionTag>Due diligence</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                Licensed for <span className="text-maqo-orange-dark">every part</span> of the job.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                The questions worth asking any solar installer before you sign, answered here
                rather than buried in a brochure.
              </p>
            </ScrollReveal>
            <div className="mt-12 border-t border-slate-200">
              {DUE_DILIGENCE.map((d, i) => (
                <ScrollReveal key={d.title} delayMs={i * 50}>
                  <details open={i === 0} className="group border-b border-slate-200">
                    <summary className="flex cursor-pointer list-none items-start gap-4 py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-maqo-green-dark [&::-webkit-details-marker]:hidden">
                      <span className="flex-1">
                        <span className="block text-lg font-bold text-slate-900 sm:text-xl">
                          {d.title}
                        </span>
                        <span className="mt-1 block text-sm text-slate-500">{d.tag}</span>
                      </span>
                      <span
                        aria-hidden
                        className="mt-1 shrink-0 text-2xl font-light leading-none text-maqo-orange-dark transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-2xl pb-7 text-base leading-relaxed text-slate-600">
                      {d.body}
                    </p>
                  </details>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* What we do: one panel with hairline cells, reading as a single platform */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal className="max-w-xl">
              <SectionTag>What we do</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                One rooftop. Or a{" "}
                <span className="text-maqo-orange-dark">gigawatt pipeline.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                One platform across the whole chain, serving homeowners, factories and
                developers alike.
              </p>
            </ScrollReveal>
            <ScrollReveal
              delayMs={100}
              className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 shadow-sm"
            >
              <div className="grid gap-px sm:grid-cols-2">
                {SEGMENTS.map((s, i) => (
                  <div
                    key={s.title}
                    className={`p-7 ${
                      i === 0 ? "bg-maqo-orange/[0.07] sm:col-span-2" : "bg-white"
                    }`}
                  >
                    <p
                      className={`font-bold text-slate-900 ${
                        i === 0 ? "text-2xl" : "text-lg"
                      }`}
                    >
                      {s.title}
                    </p>
                    <p
                      className={`mt-2 leading-relaxed text-slate-600 ${
                        i === 0 ? "max-w-xl text-base" : "text-sm"
                      }`}
                    >
                      {s.body}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Group structure: a moving strip, showing breadth rather than stating it */}
        <section className="bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                The MAQO <span className="text-maqo-orange-dark">Group</span>
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
