"use client";

import { useEffect, useRef, useState } from "react";

/** Shared building blocks for the CMS list editors (achievements, FAQ, brand
 *  logos, C&I), which all render the same inputs, labels and inline errors. */

export const inputClass =
  "w-full rounded-lg border border-base-line bg-base-panel px-3 py-2 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green";
export const labelClass = "block text-xs font-semibold uppercase tracking-wide text-base-slate";

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-2 rounded-lg border border-status-critical/40 bg-status-critical/5 px-3 py-2 text-xs text-status-critical">
      {message}
    </p>
  );
}

/**
 * Reports the id of a row that appeared since the last render, so the editor can
 * point at it. Adding a row used to give no feedback at all — the new card
 * landed at the bottom of a long list, off screen, and it was not obvious the
 * button had done anything.
 *
 * `idPrefix` is the DOM id prefix of each row element (`${idPrefix}${id}`),
 * which is scrolled into view when it appears.
 */
export function useAddedRow(ids: string[], idPrefix: string) {
  const [added, setAdded] = useState<string | null>(null);
  const seen = useRef<string[] | null>(null);

  useEffect(() => {
    const previous = seen.current;
    seen.current = ids;
    if (!previous) return; // first render: nothing was "added"
    const fresh = ids.find((id) => !previous.includes(id));
    if (!fresh) return;

    setAdded(fresh);
    document.getElementById(`${idPrefix}${fresh}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    const timer = setTimeout(() => setAdded(null), 5000);
    return () => clearTimeout(timer);
  }, [ids.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  return added;
}
