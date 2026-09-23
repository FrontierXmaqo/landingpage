import LeadForm, { type LeadFormOptionLists } from "../LeadForm";
import { CONTACT } from "@/lib/content";
import type { PublishedCustomField } from "@/lib/publishedContent";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { HomeCopy } from "./copy";

/**
 * The page closes on the thing it exists to do. The draft's final panel and
 * a separate form section would have meant two closing calls to action and a
 * primary button that scrolls the visitor upwards, so they are one section:
 * the panel's headline and the form share it.
 *
 * `LeadForm` carries `id="assessment"` itself, which is the anchor the header
 * CTA, the hero, the FAQ and every ad deep-link point at. Nothing here
 * re-declares it.
 */
export default function HomeLeadSection({
  locale,
  dict,
  t,
  leadFormOptions,
  customFields,
}: {
  locale: Locale;
  dict: Dictionary;
  t: HomeCopy;
  leadFormOptions?: LeadFormOptionLists;
  customFields?: PublishedCustomField[];
}) {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-forest to-brand-forest-deep px-6 py-10 sm:px-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[-1] bg-[radial-gradient(60rem_30rem_at_88%_-20%,rgba(249,112,0,0.34),transparent_66%),radial-gradient(48rem_30rem_at_6%_110%,rgba(49,172,71,0.3),transparent_68%)]"
        />

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="grid content-start gap-5">
            <p className="flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
              <span aria-hidden className="h-0.5 w-7 shrink-0 bg-brand-orange" />
              {t.form.eyebrow}
            </p>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              {dict.finalCta.titleLead}
              {dict.space}
              <span className="text-brand-orange">{dict.finalCta.titleAccent}</span>
              {dict.finalCta.titleTail}
            </h2>
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-white/80 sm:text-base">
              {t.finalCta.body}
            </p>

            <p className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/20 pt-5 text-sm text-white/70">
              <span>{t.finalCta.foot}</span>
              <a
                href={CONTACT.officeHref}
                className="font-semibold text-white transition hover:text-brand-orange"
              >
                {t.finalCta.secondary}
              </a>
              <a
                href={CONTACT.emailHref}
                className="font-semibold text-white transition hover:text-brand-orange"
              >
                {CONTACT.email}
              </a>
            </p>
          </div>

          <LeadForm
            locale={locale}
            t={dict.leadForm}
            labels={dict.formOptions}
            options={leadFormOptions}
            customFields={customFields}
          />
        </div>
      </div>
    </section>
  );
}
