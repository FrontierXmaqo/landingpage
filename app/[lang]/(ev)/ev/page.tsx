import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import EvPage from "./EvPage";

export default async function Page({ params }: PageProps<"/[lang]/ev">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <EvPage
      locale={lang}
      t={dict.ev}
      space={dict.space}
      switcherLabel={dict.languageSwitcher.label}
      options={dict.formOptions}
    />
  );
}
