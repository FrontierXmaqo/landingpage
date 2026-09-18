/**
 * TEMPORARY — draft preview only, not linked from the site. Delete this route
 * once a form treatment is chosen and folded into components/LeadForm.tsx.
 *
 * Shared field parts for the three drafts. The mobile rules they all obey:
 *
 * - Field text is 16px. Below that, iOS Safari zooms the whole page in on focus
 *   and the visitor has to pinch back out.
 * - Every control is at least 48px tall, Android's Material minimum target and
 *   comfortably past Apple's 44px.
 * - Selects are `appearance-none` with our own chevron, so Android and iOS both
 *   show the same arrow instead of each painting its own on top of ours.
 * - Labels are small, uppercase and slate; values are large and dark. That
 *   inversion is the whole point — on the live form the label and the value are
 *   both 14px semibold ink, so nothing tells you which is the question.
 */

export const LABEL = "text-[13px] font-semibold uppercase tracking-wide text-base-slate";

/* #8a9490 clears 3:1 against white, the WCAG minimum for a control boundary.
   The site's --color-base-line (#e4e7e4) is about 1.2:1 — which is why the live
   form reads as floating text with no visible box around it. */
export const FIELD =
  "min-h-12 w-full rounded-xl border-2 border-[#8a9490] bg-base-panel px-4 text-base text-base-ink outline-none transition focus:border-brand-green focus:ring-4 focus:ring-brand-green/25";

export const SELECT = `${FIELD} appearance-none bg-[length:1.25rem] bg-[right_0.875rem_center] bg-no-repeat pr-12`;

// Inlined as a data URI so the arrow needs no extra request and inherits nothing
// from the native control it replaces.
export const CHEVRON = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235b6660' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
} as const;

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={LABEL}>{label}</span>
      {children}
      {hint && <span className="text-xs text-base-slate">{hint}</span>}
    </label>
  );
}

export function Select({
  placeholder,
  values,
}: {
  placeholder: string;
  values: string[];
}) {
  return (
    <select defaultValue="" className={SELECT} style={CHEVRON}>
      <option value="" disabled>
        {placeholder}
      </option>
      {values.map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  );
}

/**
 * Tap-to-choose alternative to a dropdown (draft C). A radio group styled as
 * pills: no native picker wheel, the options are all visible at once, and each
 * one is a 48px target. Real radios underneath, so keyboard and screen-reader
 * behaviour comes for free.
 */
export function Pills({ name, values }: { name: string; values: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v) => (
        <label
          key={v}
          className="inline-flex min-h-12 cursor-pointer items-center rounded-xl border-2 border-[#8a9490] bg-base-panel px-4 text-base font-medium text-base-ink transition has-[:checked]:border-brand-green has-[:checked]:bg-brand-green-tint has-[:checked]:text-brand-green-ink has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-green/25"
        >
          <input type="radio" name={name} value={v} className="sr-only" />
          {v}
        </label>
      ))}
    </div>
  );
}

export function GroupHeading({ step, title }: { step: string; title: string }) {
  return (
    <div className="mt-2 flex items-center gap-2 border-t border-base-line pt-5 first:mt-0 first:border-0 first:pt-0">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-orange-deep text-xs font-bold text-white">
        {step}
      </span>
      <span className="text-base font-bold text-base-ink">{title}</span>
    </div>
  );
}
