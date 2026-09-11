import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export const metadata: Metadata = {
  title: "About MAQO Solar | Energizing A Cleaner Future",
  description:
    "MAQO Engineering Sdn Bhd (MAQO Solar) is a tech-driven clean energy group — EPC contractor, PPA investor, developer and energy management solutions provider across Malaysia and the Philippines.",
};

const VALUES = [
  { letter: "P", word: "Passion", body: "We show up energized — for our customers, our craft, and the mission of a cleaner future." },
  { letter: "O", word: "Ownership", body: "Every Maqorian owns the outcome, from the first site survey to the last commissioning report." },
  { letter: "W", word: "Win Win", body: "We build relationships where customers, partners, and Maqo grow together." },
  { letter: "E", word: "Excellence, Endurance, Efficient", body: "Highest-grade certifications, built to last, delivered without waste." },
  { letter: "R", word: "Respect & Honesty", body: "Transparent proposals, honest numbers, and respect for every roof we work on." },
];

const CREDENTIALS = [
  { title: "ST Class A", body: "Highest electrical contractor class in Malaysia" },
  { title: "CIDB G7", body: "Highest construction grade in Malaysia" },
  { title: "SEDA Registered", body: "Official solar installer" },
  { title: "ISO 9001:2015", body: "Quality management certified" },
  { title: "In-house Wiremen & Chargemen", body: "No outsourcing of critical electrical works" },
  { title: "1,000+ Customers", body: "Homes and businesses powered since day one" },
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
        <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(34,197,94,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(56,189,248,0.2), transparent 40%)",
            }}
          />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              About Maqo
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-6xl">
              Energizing a cleaner future —{" "}
              <span className="text-emerald-400">one solar panel &amp; one battery at a time.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              MAQO Engineering Sdn Bhd is a tech-driven clean energy group operating across
              Malaysia and the Philippines. We are not just an installer — we are an EPC
              contractor, PPA investor, developer, and energy management solutions provider.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-slate-100 bg-white py-14">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 sm:grid-cols-4 sm:px-6">
            {[
              { value: "1,000+", label: "Customers served" },
              { value: "ST Class A", label: "Electrical contractor grade" },
              { value: "CIDB G7", label: "Construction grade" },
              { value: "2", label: "Countries — Malaysia & Philippines" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-slate-900 sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who we are */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid gap-12 sm:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Who we are</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  Maqo Engineering Sdn Bhd (&ldquo;MAQO Solar&rdquo;) is the parent operating
                  entity of the Maqo group, headquartered in Puchong, Selangor. From residential
                  rooftops to industrial-scale solar farms and battery storage, we design, build,
                  finance and manage clean energy systems end to end.
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  The &ldquo;Q&rdquo; in Maqo stands for Quality — it&apos;s in our DNA. Every
                  project is delivered by our own in-house licensed wiremen and chargemen, with
                  no outsourcing of critical electrical works.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Maqorians</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  Our people are called Maqorians — driven by P.O.W.E.R., our set of shared
                  values that shape how we work with each other, our customers, and our
                  partners.
                </p>
                <div className="mt-6 space-y-4">
                  {VALUES.map((v) => (
                    <div key={v.letter} className="flex gap-4">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-600">
                        {v.letter}
                      </span>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">{v.word}</span> — {v.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
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
                  className="group rounded-2xl border border-slate-200 p-6 transition hover:border-emerald-300 hover:shadow-md"
                >
                  <p className="text-base font-semibold text-slate-900 group-hover:text-emerald-600">
                    {s.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Group structure */}
        <section className="bg-slate-950 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">The Maqo Group</h2>
            <p className="mt-3 max-w-2xl text-base text-slate-400">
              One mission, several specialized entities — across Malaysia and the Philippines.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              {GROUP.map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-slate-700 bg-slate-900 px-5 py-2 text-sm text-slate-200"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Ready to energize your future?
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Talk to our team about residential solar, C&amp;I EPC, BESS, or Zero Capex PPA.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Back to home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
