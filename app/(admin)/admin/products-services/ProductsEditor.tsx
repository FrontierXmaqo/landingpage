"use client";

import { useState, useTransition } from "react";
import type { Product } from "@/app/[lang]/(main)/products-and-services/products";
import { CATEGORIES, CLEAN } from "@/lib/siteContent";
import { saveSection, uploadProductImage } from "../site-content/actions";
import { ErrorNote, SaveStatus, inputClass, labelClass, useAutosave } from "../editorUi";

const CATEGORY_LABEL: Record<Product["category"], string> = { panels: "Solar Panels", inverters: "Inverters", batteries: "Batteries" };
const CHIP: Record<Product["category"], string> = {
  panels: "bg-brand-green-tint text-brand-green-ink",
  inverters: "bg-status-info/10 text-status-info",
  batteries: "bg-brand-orange-tint text-brand-orange-ink",
};
const small = "rounded-md border border-base-line px-2 py-1 text-xs font-semibold text-base-slate disabled:opacity-30 hover:border-base-slate";
const addLine = "rounded-lg border border-dashed border-base-line px-3 py-1.5 text-xs font-semibold text-brand-green-ink hover:border-brand-green";

function slug(name: string) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "product"}-${Date.now().toString(36).slice(-4)}`;
}

/** One entry per line: highlights, features, benefits, applications. */
function Lines({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <textarea rows={3} value={value.join("\n")} onChange={(e) => onChange(e.target.value.split("\n"))} className={`mt-1 ${inputClass}`} />
    </label>
  );
}

/** Two-column rows: specs (label/value) and product FAQ (q/a). */
function Pairs<K extends string>({
  label,
  rows,
  keys,
  placeholders,
  onChange,
}: {
  label: string;
  rows: Record<K, string>[];
  keys: [K, K];
  placeholders: [string, string];
  onChange: (rows: Record<K, string>[]) => void;
}) {
  const set = (i: number, k: K, v: string) => onChange(rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="mt-1 space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_1.5fr_auto] gap-2">
            {keys.map((k, n) => (
              <input key={k} value={r[k]} placeholder={placeholders[n]} aria-label={placeholders[n]} onChange={(e) => set(i, k, e.target.value)} className={inputClass} />
            ))}
            <button type="button" aria-label="Remove row" onClick={() => onChange(rows.filter((_, j) => j !== i))} className="px-2 text-base-slate hover:text-status-critical">
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...rows, { [keys[0]]: "", [keys[1]]: "" } as Record<K, string>])} className={addLine}>
          + Add row
        </button>
      </div>
    </div>
  );
}

function ImagesField({ images, onChange }: { images: Product["images"]; onChange: (v: Product["images"]) => void }) {
  const [uploading, startUpload] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      <span className={labelClass}>Images · the first one is the card cover</span>
      <div className="mt-1 space-y-2">
        {images.map((img, i) => (
          <div key={img.src} className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail, not worth next/image */}
            <img src={img.src} alt="" className="h-14 w-14 shrink-0 rounded-lg border border-base-line bg-white object-contain p-1" />
            <input
              value={img.alt}
              placeholder="What the photo shows"
              aria-label="Image description"
              onChange={(e) => onChange(images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))}
              className={inputClass}
            />
            <button type="button" aria-label="Remove image" onClick={() => onChange(images.filter((_, j) => j !== i))} className="px-2 text-base-slate hover:text-status-critical">
              ×
            </button>
          </div>
        ))}
        <label className={`${addLine} inline-block cursor-pointer ${uploading ? "opacity-50" : ""}`}>
          {uploading ? "Uploading…" : "+ Upload image"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setError(null);
              const fd = new FormData();
              fd.set("image", file);
              startUpload(async () => {
                try {
                  const src = await uploadProductImage(fd);
                  onChange([...images, { src, alt: "" }]);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Could not upload that image.");
                }
              });
            }}
          />
        </label>
      </div>
      <ErrorNote message={error} />
    </div>
  );
}

function ProductFields({ p, set }: { p: Product; set: (patch: Partial<Product>) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className={labelClass}>Name</span>
          <input value={p.name} onChange={(e) => set({ name: e.target.value })} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block">
          <span className={labelClass}>Brand</span>
          <input value={p.brand} onChange={(e) => set({ brand: e.target.value })} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block">
          <span className={labelClass}>Category</span>
          <select value={p.category} onChange={(e) => set({ category: e.target.value as Product["category"] })} className={`mt-1 ${inputClass}`}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className={labelClass}>Card tagline (one line)</span>
        <input value={p.tagline} onChange={(e) => set({ tagline: e.target.value })} className={`mt-1 ${inputClass}`} />
      </label>
      <Lines label="Card highlights · up to 4, one per line" value={p.highlights} onChange={(highlights) => set({ highlights })} />
      <ImagesField images={p.images} onChange={(images) => set({ images })} />
      <label className="block">
        <span className={labelClass}>Overview (detail dialog)</span>
        <textarea rows={3} value={p.overview} onChange={(e) => set({ overview: e.target.value })} className={`mt-1 ${inputClass}`} />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <Lines label="Key features" value={p.features} onChange={(features) => set({ features })} />
        <Lines label="What it means for you" value={p.benefits} onChange={(benefits) => set({ benefits })} />
        <Lines label="Where it fits" value={p.applications} onChange={(applications) => set({ applications })} />
      </div>
      <Pairs label="Technical specifications" rows={p.specs} keys={["label", "value"]} placeholders={["Label", "Value"]} onChange={(specs) => set({ specs })} />
      <Pairs label="Common questions" rows={p.faq} keys={["q", "a"]} placeholders={["Question", "Answer"]} onChange={(faq) => set({ faq })} />
    </div>
  );
}

export default function ProductsEditor({ initial }: { initial: Product[] }) {
  const { data, update, state, error } = useAutosave(initial, CLEAN.products, (d) => saveSection("products", d));
  const [open, setOpen] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState<Product["category"]>("panels");

  const patch = (id: string, p: Partial<Product>) => update(data.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...data];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    update(next);
  };

  return (
    <div className="admin-card p-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = newName.trim();
          if (!name) return;
          const id = slug(name);
          update([
            ...data,
            { id, category: newCat, brand: name.split(" ")[0], name, tagline: "", highlights: [], images: [], overview: "", features: [], benefits: [], specs: [], applications: [], faq: [] },
          ]);
          setNewName("");
          setOpen(id);
        }}
        className="flex flex-wrap items-end gap-3"
      >
        <label className="min-w-0 flex-1">
          <span className={labelClass}>Add a product</span>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Product name, e.g. Sigen Battery 8.0" className={`mt-1 ${inputClass}`} />
        </label>
        <label>
          <span className={labelClass}>Category</span>
          <select value={newCat} onChange={(e) => setNewCat(e.target.value as Product["category"])} className={`mt-1 ${inputClass}`}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={!newName.trim()} className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">
          Add product
        </button>
      </form>
      <div className="mt-2">
        <SaveStatus state={state} error={error} />
      </div>

      <div className="mt-4 space-y-2">
        {data.map((p, i) => {
          const isOpen = open === p.id;
          return (
            <div key={p.id} className={`rounded-lg border ${isOpen ? "border-brand-green bg-base-panel" : "border-transparent bg-base-bg"}`}>
              <div className="flex items-center gap-3 p-3">
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : p.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  {p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                    <img src={p.images[0].src} alt="" className="h-12 w-12 shrink-0 rounded-lg border border-base-line bg-white object-contain p-1" />
                  ) : (
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-status-warn-bg text-[10px] font-semibold text-status-warn">No image</span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-base-ink">{p.name || "Untitled product"}</span>
                    <span className="block truncate text-xs text-base-slate">{p.tagline || "No tagline yet"}</span>
                  </span>
                </button>
                <span className={`hidden rounded-full px-2 py-0.5 text-[11px] font-semibold sm:inline ${CHIP[p.category]}`}>{CATEGORY_LABEL[p.category]}</span>
                <span className="flex items-center gap-1">
                  <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className={small}>↑</button>
                  <button type="button" aria-label="Move down" disabled={i === data.length - 1} onClick={() => move(i, 1)} className={small}>↓</button>
                  {confirming === p.id ? (
                    <button type="button" onClick={() => { update(data.filter((x) => x.id !== p.id)); setConfirming(null); }} className="px-1 text-xs font-semibold text-status-critical">
                      Confirm remove
                    </button>
                  ) : (
                    <button type="button" onClick={() => setConfirming(p.id)} className="px-1 text-xs font-semibold text-base-slate hover:text-status-critical">
                      Remove
                    </button>
                  )}
                </span>
              </div>
              {isOpen && (
                <div className="border-t border-base-line p-4">
                  <ProductFields p={p} set={(x) => patch(p.id, x)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
