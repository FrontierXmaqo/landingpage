import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Achievements from "../components/Achievements";
import ScrollReveal from "../components/ScrollReveal";
import SectionTag from "../components/SectionTag";
import { OLD_SITE_IMAGES } from "@/lib/content";

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
      <main className="flex-1 overflow-x-clip bg-base-panel">
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
          <div className="absolute inset-0 bg-gradient-to-r from-base-ink/95 via-base-ink/75 to-base-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-base-ink/70 via-transparent to-transparent" />

          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-20 sm:px-6 sm:pb-24">
            <span className="section-eyebrow inline-flex w-fit items-center rounded-full bg-base-panel/10 px-3 py-1 text-xs font-semibold uppercase text-white ring-1 ring-white/20 backdrop-blur-sm">
              About MAQO Solar
            </span>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Unstoppable commitment to innovation and the advancement of{" "}
              <span className="text-brand-orange-ink">clean energy.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
              Our vision is simple: bring green, clean energy to everyone, at the most
              affordable cost and with the most reliable service in Malaysia.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/#assessment"
                className="inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-7 py-3 text-sm font-semibold text-base-ink shadow-sm transition hover:brightness-95"
              >
                Get My Free Assessment
              </Link>
            </div>
          </div>

          <div className="absolute -bottom-9 right-4 z-20 hidden w-60 rounded-2xl bg-base-panel p-5 shadow-xl sm:right-8 sm:block lg:right-16">
            <p className="text-3xl font-bold text-base-ink">1,000+</p>
            <p className="mt-1 text-sm text-base-slate">Homeowners served since 2013</p>
          </div>
        </section>

        <div className="pt-9 sm:pt-9" />
        <Achievements />

        {/* Who we are: alternating asymmetric photo/text rows */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid items-center gap-10 sm:grid-cols-[1.1fr_0.9fr] sm:gap-14">
              <ScrollReveal>
                <p className="text-sm font-bold uppercase tracking-wide text-brand-green-ink">
                  Not a fast-quote installer.
                </p>
                <h2 className="mt-2 text-2xl font-bold text-base-ink sm:text-3xl">
                  Who is <span className="text-brand-orange-ink">MAQO</span>?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-base-slate">
                  MAQO is a leading solar power company and solar panel installer in Malaysia,
                  delivering clean energy for everything from residential rooftops to
                  full-scale commercial &amp; industrial systems and solar farm projects.
                </p>
                <p className="mt-4 text-base leading-relaxed text-base-slate">
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
                  <div className="absolute bottom-5 -left-4 z-10 rounded-xl bg-base-panel px-4 py-2.5 shadow-xl sm:-left-6">
                    <p className="text-sm font-bold text-base-ink">Est. 2013</p>
                    <p className="text-xs text-base-slate">13+ years in the field</p>
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
                  <div className="absolute bottom-5 -right-4 z-10 rounded-xl bg-base-panel px-4 py-2.5 shadow-xl sm:-right-6">
                    <p className="text-sm font-bold text-base-ink">500+</p>
                    <p className="text-xs text-base-slate">C&amp;I clients served</p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delayMs={120} className="order-1 sm:order-2">
                <p className="text-sm font-bold uppercase tracking-wide text-brand-green-ink">
                  Beware of fast quotes.
                </p>
                <h2 className="mt-2 text-2xl font-bold text-base-ink sm:text-3xl">
                  <span className="text-brand-orange-ink">Quality</span> above all
                </h2>
                <p className="mt-4 text-base leading-relaxed text-base-slate">
                  Not all solar companies are the same, and neither are solar proposals. We
                  take the time to understand your roof and your needs, and give you options
                  built for where you are today and where you&apos;re headed.
                </p>
                <p className="mt-4 text-base leading-relaxed text-base-slate">
                  You&apos;re not just another customer to us. You&apos;re a business partner,
                  and part of the MAQO family.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Founder quote: real photo, brand-green overlay locked to full contrast, oversized quote mark */}
        <section className="relative overflow-hidden bg-brand-green-deep py-20 sm:py-24">
          <Image
            src={gallery[2]}
            alt=""
            fill
            aria-hidden
            className="object-cover opacity-15"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-brand-green-deep/90" />
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
        <section className="bg-base-bg py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal className="max-w-xl">
              <SectionTag>Our team</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">
                The people on your roof{" "}
                <span className="text-brand-orange-ink">work for us.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-base-slate">
                Managing Director Kong Kok King holds a Master&apos;s degree in Engineering
                from the University of Tokyo. The team he leads is fully accredited and
                qualified, and it is the same team that turns up at your property.
              </p>
              <p className="mt-4 text-base leading-relaxed text-base-slate">
                Licence applications, system design, build and commissioning all stay
                in-house. Nothing critical is handed to a subcontractor you have never met.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/#assessment"
                  className="inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-7 py-3 text-sm font-semibold text-base-ink shadow-sm transition hover:brightness-95"
                >
                  Talk to the team
                </Link>
                <a
                  href="#standards"
                  className="inline-flex items-center justify-center rounded-full border border-base-line px-7 py-3 text-sm font-semibold text-base-ink transition hover:border-base-slate"
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
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-base-ink/80 to-transparent" />
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
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">
                The &ldquo;Q&rdquo; in MAQO stands for{" "}
                <span className="text-brand-orange-ink">Quality.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-base-slate">
                It is in our name, and it is in how we work. Four values sit behind every
                proposal we write and every roof we finish.
              </p>
            </ScrollReveal>
            <div className="mt-12 border-t border-base-line">
              {CORE_VALUES.map((v, i) => (
                <ScrollReveal key={v.title} delayMs={i * 70}>
                  <div className="grid gap-3 border-b border-base-line py-7 sm:grid-cols-[2.5rem_11rem_1fr] sm:items-baseline sm:gap-8">
                    <span className="text-sm font-bold tabular-nums text-brand-orange-ink">
                      0{i + 1}
                    </span>
                    <h3 className="text-xl font-bold text-base-ink sm:text-2xl">{v.title}</h3>
                    <p className="text-base leading-relaxed text-base-slate">{v.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Standards: due-diligence answers up front, as a native keyboard-accessible accordion */}
        <section id="standards" className="scroll-mt-20 bg-base-bg py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal className="max-w-xl">
              <SectionTag>Due diligence</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">
                Licensed for <span className="text-brand-orange-ink">every part</span> of the job.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-base-slate">
                The questions worth asking any solar installer before you sign, answered here
                rather than buried in a brochure.
              </p>
            </ScrollReveal>
            <div className="mt-12 border-t border-base-line">
              {DUE_DILIGENCE.map((d, i) => (
                <ScrollReveal key={d.title} delayMs={i * 50}>
                  <details open={i === 0} className="group border-b border-base-line">
                    <summary className="flex cursor-pointer list-none items-start gap-4 py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green-ink [&::-webkit-details-marker]:hidden">
                      <span className="flex-1">
                        <span className="block text-lg font-bold text-base-ink sm:text-xl">
                          {d.title}
                        </span>
                        <span className="mt-1 block text-sm text-base-slate">{d.tag}</span>
                      </span>
                      <span
                        aria-hidden
                        className="mt-1 shrink-0 text-2xl font-light leading-none text-brand-orange-ink transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-2xl pb-7 text-base leading-relaxed text-base-slate">
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
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">
                One rooftop. Or a{" "}
                <span className="text-brand-orange-ink">gigawatt pipeline.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-base-slate">
                One platform across the whole chain, serving homeowners, factories and
                developers alike.
              </p>
            </ScrollReveal>
            <ScrollReveal
              delayMs={100}
              className="mt-12 overflow-hidden rounded-3xl border border-base-line bg-base-line shadow-sm"
            >
              <div className="grid gap-px sm:grid-cols-2">
                {SEGMENTS.map((s, i) => (
                  <div
                    key={s.title}
                    className={`p-7 ${
                      i === 0 ? "bg-brand-orange-deep/[0.07] sm:col-span-2" : "bg-base-panel"
                    }`}
                  >
                    <p
                      className={`font-bold text-base-ink ${
                        i === 0 ? "text-2xl" : "text-lg"
                      }`}
                    >
                      {s.title}
                    </p>
                    <p
                      className={`mt-2 leading-relaxed text-base-slate ${
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
        <section className="bg-base-bg py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-base-ink sm:text-3xl">
                The MAQO <span className="text-brand-orange-ink">Group</span>
              </h2>
              <p className="mt-3 max-w-2xl text-base text-base-slate">
                One mission, seven specialized entities across Malaysia and the Philippines.
              </p>
            </ScrollReveal>
          </div>
          <div className="relative mt-10 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-base-bg to-transparent sm:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-base-bg to-transparent sm:w-24" />
            <div className="flex w-max animate-marquee-ltr items-center">
              {groupTrack.map((g, i) => (
                <span
                  key={`${g}-${i}`}
                  className="mx-2.5 shrink-0 whitespace-nowrap rounded-full border border-base-line bg-base-panel px-5 py-2.5 text-sm text-base-ink"
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
              <p className="text-sm font-bold uppercase tracking-wide text-brand-green-ink">
                Proof, not promises.
              </p>
              <h2 className="mt-2 text-2xl font-bold text-base-ink sm:text-3xl">
                Our work speaks for itself
              </h2>
            </ScrollReveal>
            <ScrollReveal
              delayMs={100}
              className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:[grid-auto-rows:150px]"
            >
              <div className="relative col-span-2 row-span-1 overflow-hidden rounded-xl border border-base-line bg-base-panel sm:col-span-2 sm:row-span-2">
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
                  className="relative col-span-1 row-span-1 overflow-hidden rounded-xl border border-base-line bg-base-panel"
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
          <ScrollReveal className="relative overflow-hidden rounded-3xl bg-brand-orange-tint px-6 py-14 text-center sm:px-12">
            <Image
              src={OLD_SITE_IMAGES.heroHouse}
              alt=""
              fill
              aria-hidden
              className="object-cover opacity-10"
              sizes="100vw"
            />
            <div className="relative">
              <h2 className="text-2xl font-bold text-base-ink sm:text-3xl">
                Ready to energize your <span className="text-brand-orange-ink">future</span>?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-base-slate sm:text-base">
                Talk to our team about residential solar, C&amp;I EPC, BESS, or Zero Capex PPA.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/#assessment"
                  className="inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-7 py-3 text-[13px] font-bold text-white shadow-sm transition hover:brightness-95"
                >
                  Get My Free Assessment
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
