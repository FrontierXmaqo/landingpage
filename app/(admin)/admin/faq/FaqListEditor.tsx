"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { addFaqItem, moveFaqItem, removeFaqItem, updateFaqItem, type FaqPage } from "./actions";

export type FaqRow = { id: string; question: string; answer: string };

const inputClass =
  "w-full rounded-lg border border-base-line bg-base-panel px-3 py-2 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green";
const labelClass = "block text-xs font-semibold uppercase tracking-wide text-base-slate";

function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-2 rounded-lg border border-status-critical/40 bg-status-critical/5 px-3 py-2 text-xs text-status-critical">
      {message}
    </p>
  );
}

/** Saves on blur, like the C&I editor's Field — no per-field Save button. */
function Field({
  label,
  defaultValue,
  onSave,
  textarea = false,
}: {
  label: string;
  defaultValue: string;
  onSave: (value: string) => Promise<void>;
  textarea?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const initial = useRef(defaultValue);

  async function commit(value: string) {
    if (value === initial.current) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(value);
      initial.current = value;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save that.");
    } finally {
      setSaving(false);
    }
  }

  const shared = {
    defaultValue,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => commit(e.target.value),
    className: `${inputClass} ${saving ? "opacity-50" : ""}`,
  };

  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <span className="mt-1 block">{textarea ? <textarea rows={3} {...shared} /> : <input {...shared} />}</span>
      <ErrorNote message={error} />
    </label>
  );
}

function useAddedRow(ids: string[]) {
  const [added, setAdded] = useState<string | null>(null);
  const seen = useRef<string[] | null>(null);

  useEffect(() => {
    const previous = seen.current;
    seen.current = ids;
    if (!previous) return;
    const fresh = ids.find((id) => !previous.includes(id));
    if (!fresh) return;

    setAdded(fresh);
    document.getElementById(`faq-row-${fresh}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    const timer = setTimeout(() => setAdded(null), 5000);
    return () => clearTimeout(timer);
  }, [ids.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  return added;
}

function MoveButtons({ page, id, first, last }: { page: FaqPage; id: string; first: boolean; last: boolean }) {
  const [pending, startTransition] = useTransition();
  const base = "rounded-md border border-base-line px-2 py-1 text-xs font-semibold text-base-slate disabled:opacity-30 hover:border-base-slate";
  return (
    <span className="flex items-center gap-1">
      <button type="button" aria-label="Move up" disabled={first || pending} onClick={() => startTransition(() => moveFaqItem(page, id, "up"))} className={base}>
        ↑
      </button>
      <button type="button" aria-label="Move down" disabled={last || pending} onClick={() => startTransition(() => moveFaqItem(page, id, "down"))} className={base}>
        ↓
      </button>
    </span>
  );
}

export default function FaqListEditor({ page, items }: { page: FaqPage; items: FaqRow[] }) {
  const [pending, startTransition] = useTransition();
  const [adding, startAdding] = useTransition();
  const [newQuestion, setNewQuestion] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const added = useAddedRow(items.map((i) => i.id));

  return (
    <div className="admin-card p-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const question = newQuestion.trim();
          if (!question) return;
          setAddError(null);
          startAdding(async () => {
            try {
              await addFaqItem(page, question);
              setNewQuestion("");
            } catch (err) {
              setAddError(err instanceof Error ? err.message : "Could not add that.");
            }
          });
        }}
        className="flex flex-wrap items-end gap-3"
      >
        <label className="min-w-0 flex-1">
          <span className={labelClass}>Add a question</span>
          <input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="A question visitors actually ask"
            className={`mt-1 ${inputClass}`}
          />
        </label>
        <button
          type="submit"
          disabled={pending || adding || !newQuestion.trim()}
          className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          {adding ? "Adding…" : "Add question"}
        </button>
      </form>
      <ErrorNote message={addError} />
      <p role="status" aria-live="polite" className="mt-2 text-xs font-semibold text-brand-green-ink">
        {added && "✓ Question added below - fill in the answer, then Publish."}
      </p>

      {items.length === 0 && (
        <p className="mt-4 text-sm text-base-slate">No questions yet - add the first one above.</p>
      )}

      <div className="mt-4 space-y-4">
        {items.map((item, i) => (
          <div
            key={item.id}
            id={`faq-row-${item.id}`}
            className={`rounded-lg bg-base-bg p-4 transition-shadow ${added === item.id ? "ring-2 ring-brand-green" : ""}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-base-slate">Question {i + 1}</span>
              <span className="flex items-center gap-2">
                <MoveButtons page={page} id={item.id} first={i === 0} last={i === items.length - 1} />
                <button
                  type="button"
                  onClick={() => {
                    if (!window.confirm("Remove this question?")) return;
                    startTransition(() => removeFaqItem(page, item.id));
                  }}
                  className="text-xs font-semibold text-base-slate hover:text-status-critical"
                >
                  Remove
                </button>
              </span>
            </div>
            <div className="mt-3 grid gap-3">
              <Field label="Question" defaultValue={item.question} onSave={(v) => updateFaqItem(page, item.id, "question", v)} />
              <Field label="Answer" defaultValue={item.answer} textarea onSave={(v) => updateFaqItem(page, item.id, "answer", v)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
