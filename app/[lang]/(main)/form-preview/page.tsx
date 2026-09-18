// TEMPORARY — draft preview only, not linked from the site. Delete this route
// once a form treatment is chosen and folded into components/LeadForm.tsx.
import { DraftA, DraftB, DraftC } from "./drafts";

const DRAFTS = [
  { id: "a", title: "Draft A — restyle only", body: "Same nine rows, made legible." },
  { id: "b", title: "Draft B — restyle + grouped", body: "Two numbered blocks instead of nine equal rows." },
  { id: "c", title: "Draft C — restyle + tap to choose", body: "Short lists become tappable pills, no picker wheel." },
];

export default function FormPreview() {
  return (
    <main className="bg-base-bg px-4 py-10">
      <div className="mx-auto flex max-w-sm flex-col gap-12">
        {DRAFTS.map((d, i) => (
          <section key={d.id} id={d.id}>
            <h1 className="text-lg font-bold text-base-ink">{d.title}</h1>
            <p className="mb-4 mt-1 text-sm text-base-slate">{d.body}</p>
            {i === 0 ? <DraftA /> : i === 1 ? <DraftB /> : <DraftC />}
          </section>
        ))}
      </div>
    </main>
  );
}
