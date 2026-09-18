/**
 * TEMPORARY — draft preview only, not linked from the site. Delete this route
 * once a form treatment is chosen and folded into components/LeadForm.tsx.
 *
 * Three treatments of the same nine fields, presentational only: no server
 * action is wired up, because the point is to compare how they read on a phone.
 */
import {
  SALUTATIONS,
  MALAYSIAN_STATES,
  BILL_RANGES,
  PROPERTY_TYPES,
  ELECTRIC_SUPPLY_OPTIONS,
  COMMUNICATION_LANGUAGES,
} from "@/lib/leadFormOptions";
import { getDictionary } from "@/lib/i18n";
import { CHEVRON, FIELD, Field, GroupHeading, Pills, Select } from "./fields";

const t = getDictionary("en").leadForm;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-base-line bg-base-panel p-6 shadow-lg shadow-base-line/50">
      <h2 className="text-xl font-bold text-base-ink">{t.title}</h2>
      <p className="mt-1 text-sm text-base-slate">{t.subtitle}</p>
      <div className="mt-6 grid grid-cols-1 gap-4">{children}</div>
      <Submit />
    </div>
  );
}

function Submit() {
  return (
    <>
      <button
        type="button"
        className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-brand-orange-deep px-6 text-base font-bold text-white shadow-sm"
      >
        {t.submit}
      </button>
      <p className="mt-3 text-xs leading-relaxed text-base-slate">{t.consent}</p>
    </>
  );
}

/** Draft A — restyle only. Same nine rows, just legible. */
export function DraftA() {
  return (
    <Shell>
      <Field label="Salutation">
        <Select placeholder={t.salutationPlaceholder} values={SALUTATIONS} />
      </Field>
      <Field label="Full name">
        <input
          className={FIELD}
          placeholder={t.fullNamePlaceholder}
          autoComplete="name"
        />
      </Field>
      <Field label="Mobile number">
        <input
          className={FIELD}
          placeholder="012-345 6789"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
        />
      </Field>
      <Field label="Email">
        <input
          className={FIELD}
          placeholder="you@email.com"
          type="email"
          inputMode="email"
          autoComplete="email"
        />
      </Field>
      <Field label="State">
        <Select placeholder={t.statePlaceholder} values={MALAYSIAN_STATES} />
      </Field>
      <Field label="Average monthly TNB bill">
        <Select placeholder={t.billPlaceholder} values={BILL_RANGES} />
      </Field>
      <Field label="Property type">
        <Select placeholder={t.propertyTypePlaceholder} values={PROPERTY_TYPES} />
      </Field>
      <Field label="Electric supply">
        <Select placeholder={t.supplyPlaceholder} values={ELECTRIC_SUPPLY_OPTIONS} />
      </Field>
      <Field label="Preferred language">
        <Select placeholder={t.languagePlaceholder} values={COMMUNICATION_LANGUAGES} />
      </Field>
    </Shell>
  );
}

/** Draft B — restyle plus two numbered groups, so nine rows read as two blocks. */
export function DraftB() {
  return (
    <Shell>
      <GroupHeading step="1" title="About you" />
      <Field label="Salutation">
        <Select placeholder={t.salutationPlaceholder} values={SALUTATIONS} />
      </Field>
      <Field label="Full name">
        <input className={FIELD} placeholder={t.fullNamePlaceholder} autoComplete="name" />
      </Field>
      <Field label="Mobile number" hint="We call you within 1 business day.">
        <input
          className={FIELD}
          placeholder="012-345 6789"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
        />
      </Field>
      <Field label="Email">
        <input
          className={FIELD}
          placeholder="you@email.com"
          type="email"
          inputMode="email"
          autoComplete="email"
        />
      </Field>

      <GroupHeading step="2" title="Your home & bill" />
      <Field label="State">
        <Select placeholder={t.statePlaceholder} values={MALAYSIAN_STATES} />
      </Field>
      <Field label="Average monthly TNB bill">
        <Select placeholder={t.billPlaceholder} values={BILL_RANGES} />
      </Field>
      <Field label="Property type">
        <Select placeholder={t.propertyTypePlaceholder} values={PROPERTY_TYPES} />
      </Field>
      <Field label="Electric supply">
        <Select placeholder={t.supplyPlaceholder} values={ELECTRIC_SUPPLY_OPTIONS} />
      </Field>
      <Field label="Preferred language">
        <Select placeholder={t.languagePlaceholder} values={COMMUNICATION_LANGUAGES} />
      </Field>
    </Shell>
  );
}

/**
 * Draft C — groups plus tap-to-choose pills for the four short lists. State and
 * salutation stay dropdowns: sixteen states will not fit as pills, and
 * salutation is the one field nobody needs help with.
 */
export function DraftC() {
  return (
    <Shell>
      <GroupHeading step="1" title="About you" />
      <div className="grid grid-cols-[7.5rem_1fr] gap-3">
        <Field label="Title">
          <select defaultValue="" className={`${FIELD} appearance-none bg-[length:1.25rem] bg-[right_0.625rem_center] bg-no-repeat pr-9`} style={CHEVRON}>
            <option value="" disabled>
              —
            </option>
            {SALUTATIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Full name">
          <input className={FIELD} placeholder={t.fullNamePlaceholder} autoComplete="name" />
        </Field>
      </div>
      <Field label="Mobile number" hint="We call you within 1 business day.">
        <input
          className={FIELD}
          placeholder="012-345 6789"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
        />
      </Field>
      <Field label="Email">
        <input
          className={FIELD}
          placeholder="you@email.com"
          type="email"
          inputMode="email"
          autoComplete="email"
        />
      </Field>

      <GroupHeading step="2" title="Your home & bill" />
      <Field label="State">
        <Select placeholder={t.statePlaceholder} values={MALAYSIAN_STATES} />
      </Field>
      <Field label="Average monthly TNB bill">
        <Pills name="bill-c" values={BILL_RANGES} />
      </Field>
      <Field label="Property type">
        <Pills name="property-c" values={PROPERTY_TYPES} />
      </Field>
      <Field label="Electric supply">
        <Pills name="supply-c" values={ELECTRIC_SUPPLY_OPTIONS} />
      </Field>
      <Field label="Preferred language">
        <Pills name="language-c" values={COMMUNICATION_LANGUAGES} />
      </Field>
    </Shell>
  );
}
