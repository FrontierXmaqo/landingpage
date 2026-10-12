import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPage from "../components/LegalPage";
import { PRIVACY_LAST_UPDATED, PRIVACY_POLICY } from "@/lib/privacyPolicy";
import { hasLocale, localeAlternates } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const p = PRIVACY_POLICY[lang];
  return {
    title: `${p.title} | MAQO Solar`,
    description: p.metaDescription,
    alternates: localeAlternates(lang, "/privacy"),
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <LegalPage lang={lang} p={PRIVACY_POLICY[lang]} updated={PRIVACY_LAST_UPDATED} />;
}
