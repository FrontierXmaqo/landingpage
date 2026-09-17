"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { addBrand, moveBrand, removeBrand, removeBrandLogo, updateBrand, uploadBrandLogo } from "./actions";

export type BrandRow = { id: string; name: string; logo_url: string | null };

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

/** Reports the id of a row that appeared since the last render, so the editor can
 *  point at it — same pattern as the C&I editor's useAddedRow. */
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
    document.getElementById(`brand-row-${fresh}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    const timer = setTimeout(() => setAdded(null), 5000);
    return () => clearTimeout(timer);
  }, [ids.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  return added;
}

function BrandLogoField({ brand }: { brand: BrandRow }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-9 w-16 shrink-0 overflow-hidden rounded-md border border-base-line bg-base-panel">
        {brand.logo_url ? (
          <Image src={brand.logo_url} alt="" fill className="object-contain p-1" sizes="64px" unoptimized />
        ) : (
          <span className="flex h-full items-center justify-center text-[10px] text-base-slate">No logo</span>
        )}
      </div>

      <div>
        <button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          className="rounded-md border border-base-line px-2 py-1 text-xs font-semibold text-base-slate hover:border-base-slate disabled:opacity-40"
        >
          {pending ? "Uploading…" : brand.logo_url ? "Replace logo" : "Add logo"}
        </button>
        {brand.logo_url && !pending && (
          <button
            type="button"
            onClick={() => startTransition(() => removeBrandLogo(brand.id))}
            className="ml-2 text-xs font-semibold text-base-slate hover:text-status-critical"
          >
            Remove logo
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const data = new FormData();
            data.set("logo", file);
            setError(null);
            startTransition(async () => {
              try {
                await uploadBrandLogo(brand.id, data);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Upload failed.");
              } finally {
                if (inputRef.current) inputRef.current.value = "";
              }
            });
          }}
        />
        <ErrorNote message={error} />
      </div>
    </div>
  );
}

function MoveButtons({ id, first, last }: { id: string; first: boolean; last: boolean }) {
  const [pending, startTransition] = useTransition();
  const base = "rounded-md border border-base-line px-2 py-1 text-xs font-semibold text-base-slate disabled:opacity-30 hover:border-base-slate";
  return (
    <span className="flex items-center gap-1">
      <button type="button" aria-label="Move up" disabled={first || pending} onClick={() => startTransition(() => moveBrand(id, "up"))} className={base}>
        ↑
      </button>
      <button type="button" aria-label="Move down" disabled={last || pending} onClick={() => startTransition(() => moveBrand(id, "down"))} className={base}>
        ↓
      </button>
    </span>
  );
}

export default function BrandLogosEditor({ brands }: { brands: BrandRow[] }) {
  const [pending, startTransition] = useTransition();
  const [adding, startAdding] = useTransition();
  const [newBrand, setNewBrand] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const added = useAddedRow(brands.map((b) => b.id));

  return (
    <section>
      <h2 className="text-lg font-semibold text-base-ink">Brand logos</h2>
      <p className="mt-0.5 text-sm text-base-slate">
        The strip under &ldquo;Installed with brands homeowners trust&rdquo; on the homepage. Add a logo and the tile shows the
        logo instead of the name — the name is still used for screen readers.
      </p>

      <div className="admin-card mt-4 p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = newBrand.trim();
            if (!name) return;
            setAddError(null);
            startAdding(async () => {
              try {
                await addBrand(name);
                setNewBrand("");
              } catch (err) {
                setAddError(err instanceof Error ? err.message : "Could not add that.");
              }
            });
          }}
          className="flex flex-wrap items-end gap-3"
        >
          <label className="min-w-0 flex-1">
            <span className={labelClass}>Add a brand</span>
            <input
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              placeholder="Brand or product name"
              className={`mt-1 ${inputClass}`}
            />
          </label>
          <button
            type="submit"
            disabled={pending || adding || !newBrand.trim()}
            className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {adding ? "Adding…" : "Add brand"}
          </button>
        </form>
        <ErrorNote message={addError} />
        <p role="status" aria-live="polite" className="mt-2 text-xs font-semibold text-brand-green-ink">
          {added && "✓ Brand added to the list below."}
        </p>

        {brands.length === 0 && (
          <p className="mt-4 text-sm text-base-slate">No brands yet — add one above, until then the strip falls back to what&rsquo;s built into the code.</p>
        )}

        <ul className="mt-4 space-y-2">
          {brands.map((brand, i) => (
            <li
              key={brand.id}
              id={`brand-row-${brand.id}`}
              className={`flex flex-wrap items-center gap-3 rounded-lg bg-base-bg px-3 py-2 ${
                added === brand.id ? "ring-2 ring-brand-green" : ""
              }`}
            >
              <input
                defaultValue={brand.name}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (!value || value === brand.name) {
                    e.target.value = brand.name;
                    return;
                  }
                  startTransition(() => updateBrand(brand.id, value));
                }}
                className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm text-base-ink hover:border-base-line focus:border-brand-green focus:bg-base-panel focus:outline-none"
              />
              <BrandLogoField brand={brand} />
              <MoveButtons id={brand.id} first={i === 0} last={i === brands.length - 1} />
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm(`Remove "${brand.name}" from the strip?`)) return;
                  startTransition(() => removeBrand(brand.id));
                }}
                className="text-xs font-semibold text-base-slate hover:text-status-critical"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
