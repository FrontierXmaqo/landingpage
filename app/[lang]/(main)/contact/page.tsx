import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import SectionTag from "../components/SectionTag";
import { CONTACT } from "@/lib/content";
import { HTML_LANG, LOCALES, getDictionary, hasLocale, localePath, type Locale } from "@/lib/i18n";

const COPY: Record<
  Locale,
  {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    body: string;
    office: string;
    phone: string;
    email: string;
    openMap: string;
    call: string;
    write: string;
    quoteTitle: string;
    quoteBody: string;
    quoteCta: string;
  }
> = {
  en: {
    metaTitle: "Contact Us | MAQO Solar",
    metaDescription: "Visit, call or email MAQO Solar at our Puchong, Selangor office.",
    eyebrow: "Contact us",
    title: "Talk to the people who install it",
    body: "Call, email or drop by our Puchong office. Questions about a quote, a product or an existing system all come to the same team.",
    office: "Office",
    phone: "Phone",
    email: "Email",
    openMap: "Open in Google Maps",
    call: "Call us",
    write: "Send an email",
    quoteTitle: "Want a quote instead?",
    quoteBody: "Leave your details and we will call you back with a system sized to your bill.",
    quoteCta: "Get a free assessment",
  },
  cn: {
    metaTitle: "联系我们 | MAQO Solar",
    metaDescription: "欢迎到访、致电或发电邮至 MAQO Solar 雪兰莪蒲种办公室。",
    eyebrow: "联系我们",
    title: "直接与负责安装的团队沟通",
    body: "欢迎致电、发电邮或亲临我们的蒲种办公室。报价、产品或现有系统的问题，都由同一个团队处理。",
    office: "办公室",
    phone: "电话",
    email: "电邮",
    openMap: "在 Google 地图中打开",
    call: "致电我们",
    write: "发送电邮",
    quoteTitle: "想要报价？",
    quoteBody: "留下您的资料，我们会根据您的电费单为您配置系统并回电。",
    quoteCta: "免费评估",
  },
  ms: {
    metaTitle: "Hubungi Kami | MAQO Solar",
    metaDescription: "Lawati, telefon atau e-mel MAQO Solar di pejabat kami di Puchong, Selangor.",
    eyebrow: "Hubungi kami",
    title: "Bercakap terus dengan pasukan pemasangan",
    body: "Telefon, e-mel atau singgah di pejabat kami di Puchong. Soalan tentang sebut harga, produk atau sistem sedia ada semuanya dikendalikan oleh pasukan yang sama.",
    office: "Pejabat",
    phone: "Telefon",
    email: "E-mel",
    openMap: "Buka di Google Maps",
    call: "Telefon kami",
    write: "Hantar e-mel",
    quoteTitle: "Mahukan sebut harga?",
    quoteBody: "Tinggalkan butiran anda dan kami akan menghubungi anda dengan sistem yang disaiz mengikut bil anda.",
    quoteCta: "Dapatkan penilaian percuma",
  },
};

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = COPY[lang];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: localePath(lang, "/contact"),
      languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], localePath(l, "/contact")])),
    },
  };
}

/** Line icons drawn for each channel: pin, handset, envelope. */
const ICONS = {
  office: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  email: "M3 6h18v12H3V6Zm0 0 9 7 9-7",
};

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = COPY[lang];
  const quoteHref = localePath(lang, "/#consultation");

  const channels = [
    { key: "office" as const, label: t.office, value: CONTACT.address, href: CONTACT.mapsHref, action: t.openMap, external: true },
    { key: "phone" as const, label: t.phone, value: CONTACT.office, href: CONTACT.officeHref, action: t.call, external: false },
    { key: "email" as const, label: t.email, value: CONTACT.email, href: CONTACT.emailHref, action: t.write, external: false },
  ];

  return (
    <>
      <Header locale={lang} t={dict} ctaHref={quoteHref} />
      <main className="flex-1 overflow-x-clip">
        <section className="relative overflow-hidden pb-16 pt-14 sm:pb-20 sm:pt-16">
          <div aria-hidden className="atap-hero-glow atap-hero-dots pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <ScrollReveal>
              <SectionTag>{t.eyebrow}</SectionTag>
              <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight text-base-ink sm:text-5xl">{t.title}</h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-base-slate sm:text-lg">{t.body}</p>
            </ScrollReveal>

            <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-[1.4fr_1fr_1fr]">
              {channels.map((c, i) => (
                <li key={c.key}>
                  <ScrollReveal delayMs={i * 70} className="h-full">
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex h-full flex-col rounded-[22px] border border-base-line bg-base-panel p-6 transition hover:-translate-y-1 hover:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-ink sm:p-7"
                    >
                      <span aria-hidden className="grid h-11 w-11 place-items-center rounded-full bg-brand-green-tint text-brand-green-ink">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d={ICONS[c.key]} />
                        </svg>
                      </span>
                      <span className="mt-5 text-sm font-semibold text-base-slate">{c.label}</span>
                      <span className="mt-1 text-lg font-bold leading-snug text-base-ink [overflow-wrap:anywhere]">{c.value}</span>
                      <span className="mt-auto pt-5 text-sm font-semibold text-brand-green-ink group-hover:underline">{c.action}</span>
                    </a>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-brand-forest py-16 text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">{t.quoteTitle}</h2>
              <p className="mt-2 max-w-xl text-white/80">{t.quoteBody}</p>
            </div>
            <Link
              href={quoteHref}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-brand-orange-deep px-7 text-sm font-semibold text-white transition hover:brightness-95"
            >
              {t.quoteCta}
            </Link>
          </div>
        </section>
      </main>
      <Footer locale={lang} t={dict.footer} nav={dict.header.nav} />
    </>
  );
}
