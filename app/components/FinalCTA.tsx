import { CONTACT } from "@/lib/content";

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl bg-slate-900 px-6 py-14 text-center sm:px-12">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Start with your roof, not a{" "}
          <span className="text-maqo-orange">contract.</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
          Free, no-obligation home assessment. ST Class A &amp; CIDB G7-certified installation,
          across Peninsular Malaysia.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#assessment"
            className="inline-flex items-center justify-center rounded-full bg-maqo-orange px-7 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:brightness-95"
          >
            Get My Free Assessment
          </a>
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-slate-600 px-7 py-3 text-sm font-semibold text-white transition hover:border-slate-400"
          >
            Ask a question on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
