import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPage from "../components/LegalPage";
import { TERMS_LAST_UPDATED, TERMS_CONDITIONS } from "@/lib/termsConditions";
import { hasLocale, localeAlternates } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const p = TERMS_CONDITIONS[lang];
  return {
    title: `${p.title} | MAQO Solar`,
    description: p.metaDescription,
    alternates: localeAlternates(lang, "/terms"),
  };
}

export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <LegalPage lang={lang} p={TERMS_CONDITIONS[lang]} updated={TERMS_LAST_UPDATED} />;
}
