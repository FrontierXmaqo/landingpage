import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { getPublishedEvCalculatorConfig, getPublishedLeadFormOptions, getPublishedLeadFormFields, getPublishedFaq } from "@/lib/publishedContent";
import EvPage from "./EvPage";

export default async function Page({ params }: PageProps<"/[lang]/ev">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  // Pricing formula, lead-form options and the FAQ come from the CMS, same as
  // the main site — see app/[lang]/(main)/page.tsx.
  const [evCalcConfig, optionValues, customFields, faqItems] = await Promise.all([
    getPublishedEvCalculatorConfig(),
    getPublishedLeadFormOptions(),
    getPublishedLeadFormFields(),
    getPublishedFaq("ev", dict.ev.faq.items),
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
      faqItems={faqItems}
    />
  );
}
