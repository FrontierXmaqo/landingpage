"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import {
  addClient,
  addProject,
  moveRow,
  removeClient,
  removeClientLogo,
  removeProject,
  removeProjectPhoto,
  updateClient,
  updateProject,
  updateStat,
  uploadClientLogo,
  uploadProjectPhoto,
} from "./actions";
import { ErrorNote, inputClass, labelClass, useAddedRow } from "../editorUi";

export type ProjectRow = {
  id: string;
  sort_order: number;
  tag: string;
  capacity: string;
  client: string;
  panels: string | null;
  image_url: string | null;
  image_alt: string | null;
  summary: string | null;
};
export type ClientRow = { id: string; name: string; logo_url: string | null };
export type StatRow = { id: string; value: string; label: string };

/** Categories that have a drawn icon. Anything else is accepted and falls back
 *  to a generic building glyph on the page, so this is a shortcut, not a limit. */
const KNOWN_TAGS = ["Factory", "Car Showroom", "School", "Shoplot", "Mosque", "Solar Farm"];

/** Saves on blur, like the lead-form editor, so there is no per-field Save button. */
function Field({
  label,
  defaultValue,
  onSave,
  textarea = false,
  placeholder,
  list,
}: {
  label: string;
  defaultValue: string;
  onSave: (value: string) => Promise<void>;
  textarea?: boolean;
  placeholder?: string;
  list?: string;
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
    placeholder,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => commit(e.target.value),
    className: `${inputClass} ${saving ? "opacity-50" : ""}`,
  };

  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <span className="mt-1 block">
        {textarea ? <textarea rows={3} {...shared} /> : <input list={list} {...shared} />}
      </span>
      <ErrorNote message={error} />
    </label>
  );
}

function PhotoField({ project }: { project: ProjectRow }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <span className={labelClass}>Photo</span>
      <div className="mt-1 flex items-start gap-4">
        <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-base-line bg-base-bg">
          {project.image_url ? (
            <Image src={project.image_url} alt="" fill className="object-cover" sizes="160px" unoptimized />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-base-slate">No photo</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={pending}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const data = new FormData();
              data.set("photo", file);
              setError(null);
              startTransition(async () => {
                try {
                  await uploadProjectPhoto(project.id, data);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Upload failed.");
                } finally {
                  if (inputRef.current) inputRef.current.value = "";
                }
              });
            }}
            className="block w-full text-xs text-base-slate file:mr-3 file:rounded-lg file:border-0 file:bg-brand-green-tint file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-green-ink hover:file:bg-brand-green hover:file:text-white"
          />
          <p className="mt-1.5 text-xs text-base-slate">
            {pending ? "Uploading…" : "JPEG or PNG, up to 10MB. Resized and converted automatically."}
          </p>
          {project.image_url && (
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => removeProjectPhoto(project.id))}
              className="mt-2 text-xs font-semibold text-base-slate hover:text-status-critical"
            >
              Remove photo
            </button>
          )}
          <ErrorNote message={error} />
        </div>
      </div>
    </div>
  );
}

/** Optional logo for a roster tile. Without one the tile shows the name, as before. */
function ClientLogoField({ client }: { client: ClientRow }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-9 w-16 shrink-0 overflow-hidden rounded-md border border-base-line bg-base-panel">
        {client.logo_url ? (
          <Image src={client.logo_url} alt="" fill className="object-contain p-1" sizes="64px" unoptimized />
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
          {pending ? "Uploading…" : client.logo_url ? "Replace logo" : "Add logo"}
        </button>
        {client.logo_url && !pending && (
          <button
            type="button"
            onClick={() => startTransition(() => removeClientLogo(client.id))}
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
                await uploadClientLogo(client.id, data);
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

function MoveButtons({ table, id, first, last }: { table: string; id: string; first: boolean; last: boolean }) {
  const [pending, startTransition] = useTransition();
  const base = "rounded-md border border-base-line px-2 py-1 text-xs font-semibold text-base-slate disabled:opacity-30 hover:border-base-slate";
  return (
    <span className="flex items-center gap-1">
      <button type="button" aria-label="Move up" disabled={first || pending} onClick={() => startTransition(() => moveRow(table, id, "up"))} className={base}>
        ↑
      </button>
      <button type="button" aria-label="Move down" disabled={last || pending} onClick={() => startTransition(() => moveRow(table, id, "down"))} className={base}>
        ↓
      </button>
    </span>
  );
}

export default function CiEditor({
  projects,
  clients,
  stats,
}: {
  projects: ProjectRow[];
  clients: ClientRow[];
  stats: StatRow[];
}) {
  const [pending, startTransition] = useTransition();
  const [adding, startAdding] = useTransition();
  const [newClient, setNewClient] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const addedProject = useAddedRow(projects.map((p) => p.id), "ci-row-");
  const addedClient = useAddedRow(clients.map((c) => c.id), "ci-row-");

  return (
    <div className="space-y-10">
      <datalist id="ci-tags">
        {KNOWN_TAGS.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>

      {/* ------------------------------ Projects ------------------------------ */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-base-ink">Projects</h2>
            <p className="mt-0.5 text-sm text-base-slate">
              The cards in the carousel, in the order they appear. Changes save as you leave each box.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span role="status" aria-live="polite" className="text-xs font-semibold text-base-slate">
              {adding && "Adding…"}
              {!adding && addedProject && (
                <span className="text-brand-green-ink">✓ Project added below - fill it in, then Publish.</span>
              )}
            </span>
            <button
              type="button"
              disabled={pending || adding}
              onClick={() => startAdding(() => addProject())}
              className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-transform duration-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {adding ? "Adding…" : "Add project"}
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {projects.length === 0 && (
            <p className="admin-card p-5 text-sm text-base-slate">
              No projects yet. Add one - until then the page falls back to the six built into the code.
            </p>
          )}

          {projects.map((project, i) => (
            <div
              key={project.id}
              id={`ci-row-${project.id}`}
              className={`admin-card p-5 transition-shadow ${
                addedProject === project.id ? "ring-2 ring-brand-green ring-offset-2 ring-offset-base-bg" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-base-slate">
                  {i + 1}. {project.client}
                  {addedProject === project.id && (
                    <span className="ml-2 rounded-full bg-brand-green-tint px-2 py-0.5 text-[10px] font-bold text-brand-green-ink">
                      NEW
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-2">
                  <MoveButtons table="ci_projects" id={project.id} first={i === 0} last={i === projects.length - 1} />
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm(`Remove "${project.client}" from the carousel?`)) return;
                      startTransition(() => removeProject(project.id));
                    }}
                    className="text-xs font-semibold text-base-slate hover:text-status-critical"
                  >
                    Remove
                  </button>
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Client" defaultValue={project.client} onSave={(v) => updateProject(project.id, "client", v)} />
                <Field
                  label="Category"
                  defaultValue={project.tag}
                  list="ci-tags"
                  placeholder="Factory"
                  onSave={(v) => updateProject(project.id, "tag", v)}
                />
                <Field
                  label="Capacity"
                  defaultValue={project.capacity}
                  placeholder="1,071 kWp"
                  onSave={(v) => updateProject(project.id, "capacity", v)}
                />
                <Field
                  label="Panel count (optional)"
                  defaultValue={project.panels ?? ""}
                  placeholder="2,380 solar panels"
                  onSave={(v) => updateProject(project.id, "panels", v)}
                />
              </div>

              <div className="mt-4">
                <PhotoField project={project} />
              </div>

              <div className="mt-4 grid gap-4">
                <Field
                  label="Photo description (for screen readers)"
                  defaultValue={project.image_alt ?? ""}
                  placeholder="Aerial view of the factory roof covered in solar panels"
                  onSave={(v) => updateProject(project.id, "image_alt", v)}
                />
                <Field
                  label="Details shown when the card is opened (optional)"
                  defaultValue={project.summary ?? ""}
                  textarea
                  placeholder="A sentence or two about the site, the roof, or what made the job unusual."
                  onSave={(v) => updateProject(project.id, "summary", v)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------- Clients ------------------------------ */}
      <section>
        <h2 className="text-lg font-semibold text-base-ink">Client roster</h2>
        <p className="mt-0.5 text-sm text-base-slate">
          The tiles under &ldquo;Trusted by leading commercial &amp; industrial brands&rdquo;. Add a logo and the tile shows the logo instead of the name - the name is still used for screen readers.
        </p>

        <div className="admin-card mt-4 p-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = newClient.trim();
              if (!name) return;
              setClientError(null);
              startTransition(async () => {
                try {
                  await addClient(name);
                  setNewClient("");
                } catch (err) {
                  setClientError(err instanceof Error ? err.message : "Could not add that.");
                }
              });
            }}
            className="flex flex-wrap items-end gap-3"
          >
            <label className="min-w-0 flex-1">
              <span className={labelClass}>Add a client</span>
              <input
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                placeholder="Company name"
                className={`mt-1 ${inputClass}`}
              />
            </label>
            <button
              type="submit"
              disabled={pending || !newClient.trim()}
              className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Add
            </button>
          </form>
          <ErrorNote message={clientError} />
          <p role="status" aria-live="polite" className="mt-2 text-xs font-semibold text-brand-green-ink">
            {addedClient && "✓ Client added to the list below."}
          </p>

          <ul className="mt-4 space-y-2">
            {clients.map((client, i) => (
              <li
                key={client.id}
                id={`ci-row-${client.id}`}
                className={`flex flex-wrap items-center gap-3 rounded-lg bg-base-bg px-3 py-2 ${
                  addedClient === client.id ? "ring-2 ring-brand-green" : ""
                }`}
              >
                <input
                  defaultValue={client.name}
                  onBlur={(e) => {
                    const value = e.target.value.trim();
                    if (!value || value === client.name) {
                      e.target.value = client.name;
                      return;
                    }
                    startTransition(() => updateClient(client.id, value));
                  }}
                  className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm text-base-ink hover:border-base-line focus:border-brand-green focus:bg-base-panel focus:outline-none"
                />
                <ClientLogoField client={client} />
                <MoveButtons table="ci_clients" id={client.id} first={i === 0} last={i === clients.length - 1} />
                <button
                  type="button"
                  onClick={() => startTransition(() => removeClient(client.id))}
                  className="text-xs font-semibold text-base-slate hover:text-status-critical"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----------------------------- Trust stats ---------------------------- */}
      <section>
        <h2 className="text-lg font-semibold text-base-ink">Trust stats</h2>
        <p className="mt-0.5 text-sm text-base-slate">The three figures under the client roster.</p>

        <div className="admin-card mt-4 grid gap-5 p-5 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="space-y-3">
              <Field label="Figure" defaultValue={stat.value} placeholder="100+" onSave={(v) => updateStat(stat.id, "value", v)} />
              <Field label="Label" defaultValue={stat.label} placeholder="Commercial Installs" onSave={(v) => updateStat(stat.id, "label", v)} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
