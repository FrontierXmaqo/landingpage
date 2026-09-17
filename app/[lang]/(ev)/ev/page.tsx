import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { getPublishedEvCalculatorConfig, getPublishedLeadFormOptions, getPublishedLeadFormFields } from "@/lib/publishedContent";
import EvPage from "./EvPage";

export default async function Page({ params }: PageProps<"/[lang]/ev">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  // Pricing formula and lead-form options come from the CMS, same as the main
  // site — see app/[lang]/(main)/page.tsx.
  const [evCalcConfig, optionValues, customFields] = await Promise.all([
    getPublishedEvCalculatorConfig(),
    getPublishedLeadFormOptions(),
    getPublishedLeadFormFields(),
  ]);

  return (
    <EvPage
      locale={lang}
      dict={dict}
      t={dict.ev}
      space={dict.space}
      options={dict.formOptions}
      optionValues={optionValues}
      customFields={customFields}
      evCalcConfig={evCalcConfig}
    />
  );
}
