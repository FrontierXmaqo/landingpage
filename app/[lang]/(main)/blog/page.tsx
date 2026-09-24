import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import SectionTag from "../components/SectionTag";
import { HTML_LANG, LOCALES, getDictionary, hasLocale, localePath, type Locale } from "@/lib/i18n";
import { POSTS, type TopicKey } from "./posts";

const TOPIC_ORDER: TopicKey[] = ["schemes", "tariffs", "industry", "archive"];

const COPY: Record<
  Locale,
  {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    body: string;
    jump: string;
    topics: Record<TopicKey, { name: string; blurb: string }>;
    read: string;
    newTab: string;
    englishNote: string;
    quoteTitle: string;
    quoteBody: string;
    quoteCta: string;
  }
> = {
  en: {
    metaTitle: "Blog | MAQO Solar",
    metaDescription: "MAQO Solar's notes on Malaysian solar schemes, electricity tariffs and the solar industry.",
    eyebrow: "Blog",
    title: "Solar schemes and tariffs, explained as they change",
    body: "We write these up whenever the rules move: new quotas, tariff surcharges, programme changes. Every article opens on maqosolar.com.",
    jump: "Topics",
    topics: {
      schemes: { name: "Government schemes", blurb: "ATAP, NEM, SelCo, CRESS, LSS and the programmes before them." },
      tariffs: { name: "Tariffs and costs", blurb: "Surcharges, green tariffs and certificates that change your bill." },
      industry: { name: "Panels and safety", blurb: "How the hardware ages, the module market and Bomba rules." },
      archive: { name: "From the archive", blurb: "Older news and commentary we have kept online." },
    },
    read: "Read article",
    newTab: "(opens in a new tab)",
    englishNote: "",
    quoteTitle: "Not sure which scheme fits your roof?",
    quoteBody: "Send us your bill and we will tell you what you qualify for.",
    quoteCta: "Get a free assessment",
  },
  cn: {
    metaTitle: "博客 | MAQO Solar",
    metaDescription: "MAQO Solar 关于马来西亚太阳能计划、电费与太阳能行业的文章。",
    eyebrow: "博客",
    title: "太阳能计划与电费，随政策变化随时解读",
    body: "每当规则变动，例如新配额、电费附加费或计划调整，我们就会写一篇说明。所有文章都在 maqosolar.com 上打开。",
    jump: "主题",
    topics: {
      schemes: { name: "政府计划", blurb: "ATAP、NEM、SelCo、CRESS、LSS 以及更早的计划。" },
      tariffs: { name: "电费与成本", blurb: "会影响电费单的附加费、绿色电价与证书。" },
      industry: { name: "太阳能板与安全", blurb: "设备寿命、组件市场与消防局规定。" },
      archive: { name: "旧文存档", blurb: "我们保留在线的旧新闻与评论。" },
    },
    read: "阅读文章",
    newTab: "（在新标签页打开）",
    englishNote: "文章以英文撰写。",
    quoteTitle: "不确定哪个计划适合您的屋顶？",
    quoteBody: "把电费单发给我们，我们会告诉您符合哪些资格。",
    quoteCta: "免费评估",
  },
  ms: {
    metaTitle: "Blog | MAQO Solar",
    metaDescription: "Catatan MAQO Solar tentang skim solar Malaysia, tarif elektrik dan industri solar.",
    eyebrow: "Blog",
    title: "Skim solar dan tarif, diterangkan setiap kali berubah",
    body: "Kami menulis setiap kali peraturan berubah: kuota baharu, surcaj tarif, perubahan program. Setiap artikel dibuka di maqosolar.com.",
    jump: "Topik",
    topics: {
      schemes: { name: "Skim kerajaan", blurb: "ATAP, NEM, SelCo, CRESS, LSS dan program sebelumnya." },
      tariffs: { name: "Tarif dan kos", blurb: "Surcaj, tarif hijau dan sijil yang mengubah bil anda." },
      industry: { name: "Panel dan keselamatan", blurb: "Jangka hayat perkakasan, pasaran modul dan peraturan Bomba." },
      archive: { name: "Arkib", blurb: "Berita dan ulasan lama yang masih kami simpan." },
    },
    read: "Baca artikel",
    newTab: "(dibuka di tab baharu)",
    englishNote: "Artikel ditulis dalam bahasa Inggeris.",
    quoteTitle: "Tidak pasti skim mana sesuai untuk bumbung anda?",
    quoteBody: "Hantar bil anda dan kami akan beritahu apa yang anda layak.",
    quoteCta: "Dapatkan penilaian percuma",
  },
};

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = COPY[lang];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: localePath(lang, "/blog"),
      languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], localePath(l, "/blog")])),
    },
  };
}

export default async function BlogPage({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = COPY[lang];
  const quoteHref = localePath(lang, "/#consultation");

  return (
    <>
      <Header locale={lang} t={dict} ctaHref={quoteHref} />
      <main className="flex-1 overflow-x-clip">
        <section className="relative overflow-hidden pb-10 pt-14 sm:pt-16">
          <div aria-hidden className="atap-hero-glow atap-hero-dots pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <ScrollReveal>
              <SectionTag>{t.eyebrow}</SectionTag>
              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-base-ink sm:text-5xl">{t.title}</h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-base-slate sm:text-lg">
                {t.body} {t.englishNote}
              </p>
            </ScrollReveal>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[200px_1fr]">
          <nav aria-label={t.jump} className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-semibold text-base-slate">{t.jump}</p>
            <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {TOPIC_ORDER.map((key) => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-base-line px-3 text-sm font-semibold text-base-ink transition hover:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-ink lg:w-full lg:border-transparent lg:px-2"
                  >
                    {t.topics[key].name}
                    <span className="text-xs font-medium text-base-slate">{POSTS[key].length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-16">
            {TOPIC_ORDER.map((key) => {
              const [lead, ...rest] = POSTS[key];
              return (
                <section key={key} id={key} aria-labelledby={`${key}-h`} className="scroll-mt-24">
                  <h2 id={`${key}-h`} className="text-2xl font-bold text-base-ink sm:text-3xl">{t.topics[key].name}</h2>
                  <p className="mt-2 text-base-slate">{t.topics[key].blurb}</p>

                  {/* The newest article in each topic gets the panel so the latest change stands out. */}
                  <a
                    href={lead.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 block rounded-[22px] border border-base-line bg-base-panel p-6 transition hover:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-ink sm:p-8"
                  >
                    <span className="block text-xl font-bold leading-snug text-base-ink [overflow-wrap:anywhere] sm:text-2xl">{lead.title}</span>
                    <span className="mt-3 block text-base-slate">{lead.summary}</span>
                    <span className="mt-5 inline-block text-sm font-semibold text-brand-green-ink group-hover:underline">
                      {t.read} <span className="sr-only">{t.newTab}</span>
                    </span>
                  </a>

                  <ul className="mt-2 divide-y divide-base-line">
                    {rest.map((p) => (
                      <li key={p.href}>
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-ink"
                        >
                          <span className="block font-semibold leading-snug text-base-ink [overflow-wrap:anywhere] group-hover:text-brand-green-ink group-hover:underline">
                            {p.title}
                          </span>
                          <span className="mt-1 block text-sm text-base-slate">{p.summary}</span>
                          <span className="sr-only">{t.newTab}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>

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
