import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getDictionary, hasLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/commercial-and-industrial/thank-you">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: "Thank You | MAQO Solar",
    robots: { index: false, follow: false },
  };
}

export default async function CiThankYouPage({
  params,
}: PageProps<"/[lang]/commercial-and-industrial/thank-you">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <div data-theme="ci" className="contents">
      <Header locale={lang} t={dict} ctaHref={localePath(lang, "/commercial-and-industrial#assessment")} />
      <main className="flex flex-1 items-center justify-center bg-base-bg px-4 py-20 sm:py-28">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <span className="section-eyebrow inline-flex items-center gap-2 rounded-full bg-brand-green-tint px-3.5 py-1.5 text-xs font-semibold uppercase text-brand-green-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green-ink" />
            Enquiry Logged
          </span>

          <div className="mt-6 flex h-[76px] w-[76px] items-center justify-center rounded-2xl bg-brand-orange-deep shadow-[0_16px_32px_-12px_rgba(21,48,79,0.5)]">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">
            Thank you — our commercial team has your enquiry.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-base-slate">
            A dedicated C&amp;I energy consultant will contact you within 1 business day to schedule a site
            assessment and load review.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
            <Link
              href={localePath(lang, "/about")}
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange-deep px-7 py-3 text-[13px] font-bold text-white shadow-sm transition hover:brightness-95"
            >
              Learn more about MAQO
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 10h12M11 5l5 5-5 5" />
              </svg>
            </Link>
            <Link
              href={localePath(lang, "/")}
              className="border-b border-brand-green-deep/35 pb-0.5 text-sm font-semibold text-brand-green-deep transition hover:border-brand-green-deep"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </main>
      <Footer locale={lang} t={dict.footer} nav={dict.header.nav} />
    </div>
  );
}
