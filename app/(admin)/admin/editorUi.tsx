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

/** Key-order-independent JSON, so the same content always compares equal. */
const stable = (v: unknown) =>
  JSON.stringify(v, (_k, x) => (x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort()) : x));

/**
 * Whole-document editing for the `site_content` sections: edits apply locally
 * at once and save 700ms after the last change. `clean` is the same validator
 * the server runs, so a bad value shows its error here instead of saving.
 *
 * The server re-renders after every save; `initial` only replaces local state
 * when it differs from what was last sent, i.e. after Discard draft.
 */
export function useAutosave<T>(initial: T, clean: (v: unknown) => T, save: (data: T) => Promise<void>) {
  const [data, setData] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const sent = useRef(stable(initial));
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const incoming = stable(initial);
    if (incoming !== sent.current) {
      sent.current = incoming;
      setData(initial);
    }
  }, [initial]);

  function update(next: T) {
    setData(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      let cleaned: T;
      try {
        cleaned = clean(next);
      } catch (e) {
        setState("error");
        setError(e instanceof Error ? e.message : "That value can't be saved.");
        return;
      }
      sent.current = stable(cleaned);
      setState("saving");
      setError(null);
      try {
        await save(cleaned);
        setState("saved");
      } catch (e) {
        setState("error");
        setError(e instanceof Error ? e.message : "Could not save the draft.");
      }
    }, 700);
  }

  return { data, update, state, error };
}

export function SaveStatus({ state, error }: { state: "idle" | "saving" | "saved" | "error"; error: string | null }) {
  return (
    <div aria-live="polite">
      {state === "saving" && <p className="text-xs text-base-slate">Saving draft…</p>}
      {state === "saved" && <p className="text-xs font-semibold text-brand-green-ink">✓ Draft saved - Publish to put it live.</p>}
      <ErrorNote message={error} />
    </div>
  );
}
