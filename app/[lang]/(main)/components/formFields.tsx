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
        onChange={type === "tel" ? (e) => { e.target.value = formatMyPhone(e.target.value); } : undefined}
        className={FIELD}
      />
    </label>
  );
}

/** Formats digits as they're typed into Malaysian mobile shape: 012-345 6789
 *  (or 011-1234 5678 for the one prefix with an 8-digit subscriber number). */
export function formatMyPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  const [g1, g2] = digits.startsWith("011") ? [3, 4] : [3, 3];
  const p1 = digits.slice(0, g1);
  const p2 = digits.slice(g1, g1 + g2);
  const p3 = digits.slice(g1 + g2);
  return p2 ? (p3 ? `${p1}-${p2} ${p3}` : `${p1}-${p2}`) : p1;
}

export type Option = { value: string; label: string };

/** A labelled dropdown. Every field is required, so the placeholder is a
 *  prompt the visitor cannot submit the form while still selected. */
export function SelectField({
  label,
  name,
  placeholder,
  options,
}: {
  label: string;
  name: string;
  placeholder: string;
  options: Option[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={LABEL}>{label}</span>
      <select name={name} required defaultValue="" className={SELECT} style={CHEVRON}>
        <option value="" disabled>
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
