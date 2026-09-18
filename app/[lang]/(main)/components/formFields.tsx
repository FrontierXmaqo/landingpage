/**
 * Shared field parts for the public lead forms, built for the phone first —
 * most of this traffic is mobile, and the audience is homeowners rather than
 * people who fill in forms for a living.
 *
 * The rules every control here follows:
 *
 * - Field text is 16px. Below that, iOS Safari zooms the page in on focus and
 *   leaves the visitor pinching back out.
 * - Controls are at least 48px tall: Android's Material minimum target, and
 *   comfortably past Apple's 44px.
 * - Selects are `appearance-none` with our own chevron, so iOS and Android
 *   render one consistent arrow instead of each painting its own over ours.
 * - Labels are small, uppercase and slate; values are large and dark. That
 *   inversion is deliberate — when label and value share a size and weight,
 *   nothing tells the reader which one is the question.
 */

const LABEL = "text-[13px] font-semibold uppercase tracking-wide text-base-slate";

export const FIELD =
  "min-h-12 w-full rounded-xl border-2 border-base-field bg-base-panel px-4 text-base text-base-ink outline-none transition placeholder:text-base-slate focus:border-brand-green focus:ring-4 focus:ring-brand-green/25";

const SELECT = `${FIELD} appearance-none bg-[length:1.25rem] bg-[right_0.875rem_center] bg-no-repeat pr-12`;

/* Inlined so the arrow costs no extra request and inherits nothing from the
   native control it replaces. Stroke is base-slate. */
const CHEVRON = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235b6660' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
} as const;

/** A labelled text input. `label` carries its own " *" where the field is required. */
export function TextField({
  label,
  name,
  required,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  inputMode?: "text" | "email" | "tel";
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={LABEL}>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className={FIELD}
      />
    </label>
  );
}

export type Option = { value: string; label: string };

/**
 * A labelled dropdown. Used where the list is too long to lay out as pills.
 *
 * `clearable` leaves the empty option selectable, so an optional field can be
 * set back to nothing after a value has been picked; otherwise the placeholder
 * is a prompt the visitor cannot choose.
 */
export function SelectField({
  label,
  name,
  placeholder,
  options,
  clearable,
}: {
  label: string;
  name: string;
  placeholder: string;
  options: Option[];
  clearable?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={LABEL}>{label}</span>
      <select name={name} defaultValue="" className={SELECT} style={CHEVRON}>
        <option value="" disabled={!clearable}>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/**
 * Tap-to-choose alternative to a dropdown, for lists short enough to show at
 * once: no picker wheel to scroll, every choice visible, each one a 48px
 * target, and the chosen one obvious at a glance.
 *
 * Real radio inputs underneath, so keyboard and screen-reader behaviour comes
 * for free and the submitted value is byte-identical to what the <select>
 * posted — the server's allowlist validation needs no change. A fieldset rather
 * than a wrapping <label>, because a group of controls needs a legend.
 */
export function PillField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: Option[];
}) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className={`${LABEL} mb-1.5`}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="inline-flex min-h-12 cursor-pointer items-center rounded-xl border-2 border-base-field bg-base-panel px-4 text-base font-medium text-base-ink transition has-[:checked]:border-brand-green has-[:checked]:bg-brand-green-tint has-[:checked]:font-semibold has-[:checked]:text-brand-green-ink has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-green/25"
          >
            <input type="radio" name={name} value={o.value} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
