"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { requireRole } from "../guard";
import type { PublishState } from "../publishState";
import { text, uuid, oneOf, ValidationError } from "@/lib/validate";

const CI_ROLES = ["admin", "marketing", "sales_ci"] as const;

/** The three tables this section publishes together. */
const TABLES = ["ci_projects", "ci_clients", "ci_trust_stats"] as const;
type Table = (typeof TABLES)[number];

const BUCKET = "project-photos";
/** Matches the bucket's own limit, so an oversize file is refused here with a
 *  readable message rather than by the storage API with an opaque one. */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
/** Wider than the card ever renders, even at 2x on a large screen. */
const MAX_IMAGE_WIDTH = 1600;
/** Client logos render as small tiles, so they never need project-photo width. */
const MAX_LOGO_WIDTH = 600;

/**
 * Seeds a draft copy of whatever is published, so editing always starts from
 * what is live. Runs per table: a section published before another existed
 * still gets its own draft.
 *
 * The "is there a draft yet?" check and the copy-from-published insert used to
 * happen as two separate round-trips from here, which raced: this runs on
 * every load of /admin/commercial-industrial, including Next.js's Link
 * prefetch, so two overlapping requests could both see "no draft" before
 * either had inserted, and both would copy the full published set — that's
 * how projects/clients/stats each ended up duplicated dozens of times over.
 * `ensure_draft_seeded` does the check and the insert inside one Postgres
 * function, under an advisory lock keyed by table name, so a second caller
 * blocks until the first commits and then finds the draft already there.
 */
export async function ensureCiDraftSeeded() {
  await requireRole([...CI_ROLES]);
  const supabase = await getSupabaseUserClient();

  for (const table of TABLES) {
    const { error } = await supabase.rpc("ensure_draft_seeded", { p_table: table });
    // Loudly, on purpose. A seed that fails quietly leaves the editor showing
    // an empty or partial draft that looks like a legitimate edit, and the next
    // Publish promotes that instead of the live content — which is how this
    // section ended up one keystroke from replacing six projects with one.
    if (error) {
      throw new Error(
        `Could not prepare the ${table} draft from what is published (${error.message}). Nothing was changed - reload and try again.`
      );
    }
  }
}

/* ----------------------------- projects ----------------------------- */

export async function addProject() {
  const profile = await requireRole([...CI_ROLES]);
  // Seed first: if the draft copy is missing, the new row would be the only
  // draft, and publishing would swap the whole section for it.
  await ensureCiDraftSeeded();
  const supabase = await getSupabaseUserClient();
  const { count } = await supabase.from("ci_projects").select("*", { count: "exact", head: true }).eq("status", "draft");

  await supabase.from("ci_projects").insert({
    status: "draft",
    sort_order: count ?? 0,
    tag: "Factory",
    capacity: "0 kWp",
    client: "New project",
    image_alt: "",
    updated_by: profile.id,
  });
  revalidatePath("/admin/commercial-industrial");
}

export async function updateProject(id: string, field: string, value: string) {
  const profile = await requireRole([...CI_ROLES]);
  // Only these columns are writable from the form. Without the allowlist a
  // caller could set `status: 'published'` and skip the publish step entirely.
  const column = oneOf(field, ["tag", "capacity", "client", "panels", "image_alt", "summary"] as const, "field");
  const limits: Record<string, number> = { summary: 600, image_alt: 300 };
  const required = column === "tag" || column === "capacity" || column === "client";
  const clean = text(value, { max: limits[column] ?? 120, required, field: column });

  const supabase = await getSupabaseUserClient();
  await supabase
    .from("ci_projects")
    .update({ [column]: clean || null, updated_by: profile.id, updated_at: new Date().toISOString() })
    .eq("id", uuid(id))
    .eq("status", "draft");
  revalidatePath("/admin/commercial-industrial");
}

export async function removeProject(id: string) {
  await requireRole([...CI_ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("ci_projects").delete().eq("id", uuid(id)).eq("status", "draft");
  revalidatePath("/admin/commercial-industrial");
}

/**
 * Uploads a project photo.
 *
 * Re-encoded to WebP at a sane width before it is stored, for two reasons: a
 * phone or drone still is tens of megapixels and has no business being served
 * to a visitor, and decoding it here means a truncated or corrupt file is
 * rejected now, with a message, instead of rendering as a half-grey card.
 */
export async function uploadProjectPhoto(id: string, formData: FormData) {
  const profile = await requireRole([...CI_ROLES]);
  const rowId = uuid(id);
  const file = formData.get("photo");

  if (!(file instanceof File) || file.size === 0) throw new ValidationError("Choose an image file to upload.");
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ValidationError(
      `That image is ${(file.size / 1024 / 1024).toFixed(1)}MB. Please use one under 10MB - exporting at about 1600px wide is plenty.`
    );
  }

  let webp: Buffer;
  try {
    webp = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate() // honour the EXIF orientation before it is stripped
      .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    throw new ValidationError("That file could not be read as an image. If it was uploaded from a phone, try exporting it again.");
  }

  const supabase = await getSupabaseUserClient();
  const path = `${rowId}/${Date.now()}.webp`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, webp, { contentType: "image/webp", upsert: true });
  // The reason matters: "violates row-level security policy" and "bucket not
  // found" need completely different fixes, and a blanket "try again" sent
  // someone round the same loop four times.
  if (error) {
    console.error("Project photo upload failed", error);
    throw new ValidationError(`The image could not be uploaded: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  await supabase
    .from("ci_projects")
    .update({ image_url: data.publicUrl, updated_by: profile.id, updated_at: new Date().toISOString() })
    .eq("id", rowId)
    .eq("status", "draft");

  revalidatePath("/admin/commercial-industrial");
}

/** Clears the photo, putting the card back to its category-icon placeholder. */
export async function removeProjectPhoto(id: string) {
  const profile = await requireRole([...CI_ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase
    .from("ci_projects")
    .update({ image_url: null, updated_by: profile.id, updated_at: new Date().toISOString() })
    .eq("id", uuid(id))
    .eq("status", "draft");
  revalidatePath("/admin/commercial-industrial");
}

/* ------------------------ clients + trust stats ------------------------ */

export async function addClient(name: string) {
  const profile = await requireRole([...CI_ROLES]);
  const clean = text(name, { max: 80, required: true, field: "name" });
  await ensureCiDraftSeeded(); // same reason as addProject
  const supabase = await getSupabaseUserClient();
  const { count } = await supabase.from("ci_clients").select("*", { count: "exact", head: true }).eq("status", "draft");
  await supabase.from("ci_clients").insert({ status: "draft", sort_order: count ?? 0, name: clean, updated_by: profile.id });
  revalidatePath("/admin/commercial-industrial");
}

/**
 * Uploads a client logo, re-encoded to WebP the same way project photos are.
 * Capped narrower because these render as small tiles, and transparency is
 * preserved so a logo on a transparent background still sits on the tile.
 */
export async function uploadClientLogo(id: string, formData: FormData) {
  const profile = await requireRole([...CI_ROLES]);
  const rowId = uuid(id);
  const file = formData.get("logo");

  if (!(file instanceof File) || file.size === 0) throw new ValidationError("Choose an image file to upload.");
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ValidationError(
      `That image is ${(file.size / 1024 / 1024).toFixed(1)}MB. Please use one under 10MB - a logo about 600px wide is plenty.`
    );
  }

  let webp: Buffer;
  try {
    webp = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: MAX_LOGO_WIDTH, withoutEnlargement: true })
      .webp({ quality: 88 })
      .toBuffer();
  } catch {
    throw new ValidationError("That file could not be read as an image. Try exporting the logo again as PNG or JPEG.");
  }

  const supabase = await getSupabaseUserClient();
  const path = `clients/${rowId}/${Date.now()}.webp`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, webp, { contentType: "image/webp", upsert: true });
  if (error) {
    console.error("Client logo upload failed", error);
    throw new ValidationError(`The logo could not be uploaded: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  await supabase
    .from("ci_clients")
    .update({ logo_url: data.publicUrl, updated_by: profile.id, updated_at: new Date().toISOString() })
    .eq("id", rowId)
    .eq("status", "draft");

  revalidatePath("/admin/commercial-industrial");
}

/** Clears the logo, putting the tile back to the client's name in text. */
export async function removeClientLogo(id: string) {
  const profile = await requireRole([...CI_ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase
    .from("ci_clients")
    .update({ logo_url: null, updated_by: profile.id, updated_at: new Date().toISOString() })
    .eq("id", uuid(id))
    .eq("status", "draft");
  revalidatePath("/admin/commercial-industrial");
}

export async function updateClient(id: string, name: string) {
  const profile = await requireRole([...CI_ROLES]);
  const clean = text(name, { max: 80, required: true, field: "name" });
  const supabase = await getSupabaseUserClient();
  await supabase
    .from("ci_clients")
    .update({ name: clean, updated_by: profile.id, updated_at: new Date().toISOString() })
    .eq("id", uuid(id))
    .eq("status", "draft");
  revalidatePath("/admin/commercial-industrial");
}

export async function removeClient(id: string) {
  await requireRole([...CI_ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("ci_clients").delete().eq("id", uuid(id)).eq("status", "draft");
  revalidatePath("/admin/commercial-industrial");
}

export async function updateStat(id: string, field: string, value: string) {
  const profile = await requireRole([...CI_ROLES]);
  const column = oneOf(field, ["value", "label"] as const, "field");
  const clean = text(value, { max: 60, required: true, field: column });
  const supabase = await getSupabaseUserClient();
  await supabase
    .from("ci_trust_stats")
    .update({ [column]: clean, updated_by: profile.id, updated_at: new Date().toISOString() })
    .eq("id", uuid(id))
    .eq("status", "draft");
  revalidatePath("/admin/commercial-industrial");
}

/* ------------------------------ ordering ------------------------------ */

export async function moveRow(table: string, id: string, direction: "up" | "down") {
  await requireRole([...CI_ROLES]);
  const from = oneOf(table, TABLES, "table") as Table;
  const rowId = uuid(id);
  const supabase = await getSupabaseUserClient();

  const { data: rows } = await supabase.from(from).select("id, sort_order").eq("status", "draft").order("sort_order");
  if (!rows) return;
  const idx = rows.findIndex((r) => r.id === rowId);
  const swapWith = oneOf(direction, ["up", "down"] as const, "direction") === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapWith < 0 || swapWith >= rows.length) return;

  await supabase.from(from).update({ sort_order: rows[swapWith].sort_order }).eq("id", rows[idx].id);
  await supabase.from(from).update({ sort_order: rows[idx].sort_order }).eq("id", rows[swapWith].id);
  revalidatePath("/admin/commercial-industrial");
}

/* --------------------------- publish workflow --------------------------- */

/** The fields a visitor actually sees, per table. Row ids and timestamps differ
 *  on every draft seed, so comparing whole rows would always look changed. */
const COMPARED: Record<Table, string[]> = {
  ci_projects: ["tag", "capacity", "client", "panels", "image_url", "image_alt", "summary"],
  ci_clients: ["name", "logo_url"],
  ci_trust_stats: ["value", "label"],
};

/** Order-sensitive fingerprint of a table's rows, so a reorder counts too. */
function signature(rows: Record<string, unknown>[] | null, table: Table) {
  return JSON.stringify((rows ?? []).map((row) => COMPARED[table].map((f) => row[f] ?? null)));
}

/**
 * Whether Publish and Unpublish have anything to do, so the page can disable
 * them up front rather than only reporting it after the click.
 *
 * Publish compares the draft against what is live field by field: a draft row
 * always exists (the page seeds one on every load), so "there is a draft" was
 * never the question — "does the draft differ" is. With nothing to publish the
 * button cannot be pressed at all, which is what turned one intended publish
 * into a dozen.
 */
export async function getCiPublishStatus() {
  await requireRole([...CI_ROLES]);
  const supabase = await getSupabaseUserClient();

  const results = await Promise.all(
    TABLES.map((table) =>
      Promise.all([
        supabase.from(table).select("*").eq("status", "draft").order("sort_order"),
        supabase.from(table).select("*").eq("status", "published").order("sort_order"),
        supabase.from(table).select("*", { count: "exact", head: true }).eq("status", "archived"),
      ])
    )
  );

  return {
    canPublish: results.some(([draft, live], i) => signature(draft.data, TABLES[i]) !== signature(live.data, TABLES[i])),
    canUnpublish: results.some(([, , archived]) => Boolean(archived.count)),
  };
}

/**
 * Promotes each table's draft to published.
 *
 * One locked transaction in the database (`ci_publish()`): archive the live
 * rows, promote the draft, then drop all but the newest three archived
 * snapshots so the history cannot grow without bound. Doing it here as a
 * read-then-write per table is what let a double-clicked Publish interleave
 * with the draft re-seed and multiply the section. Tables with no draft rows
 * are skipped — archiving live rows with nothing to replace them would
 * silently empty the section on the public page.
 */
export async function publishCiContent(): Promise<PublishState> {
  const profile = await requireRole([...CI_ROLES]);
  const supabase = await getSupabaseUserClient();

  const { canPublish } = await getCiPublishStatus();
  if (!canPublish) return { status: "empty", message: "Nothing to publish - the draft matches what is already live." };

  const { error } = await supabase.rpc("ci_publish", { p_user: profile.id });
  if (error) {
    return { status: "error", message: `Publishing failed: ${error.message}. Nothing was changed - reload and try again.` };
  }

  revalidatePath("/admin/commercial-industrial");
  revalidatePath("/", "layout");
  return { status: "success", message: "Published - the public page now shows this draft." };
}

/** Reverts to the snapshot taken by the previous publish. */
export async function unpublishCiContent(): Promise<PublishState> {
  await requireRole([...CI_ROLES]);
  const supabase = await getSupabaseUserClient();
  let reverted = false;

  for (const table of TABLES) {
    const { data: lastArchived } = await supabase
      .from(table)
      .select("published_at")
      .eq("status", "archived")
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!lastArchived?.published_at) continue;

    await supabase.from(table).update({ status: "archived" }).eq("status", "published");
    await supabase
      .from(table)
      .update({ status: "published" })
      .eq("published_at", lastArchived.published_at)
      .eq("status", "archived");
    reverted = true;
  }

  revalidatePath("/admin/commercial-industrial");
  revalidatePath("/", "layout");

  return reverted
    ? { status: "success", message: "Reverted to the previous published version." }
    : { status: "empty", message: "Nothing to revert to - no earlier published version was found." };
}

/** Throws away in-progress edits, reseeding the draft from what is published. */
export async function discardCiDraft() {
  await requireRole([...CI_ROLES]);
  const supabase = await getSupabaseUserClient();
  for (const table of TABLES) await supabase.from(table).delete().eq("status", "draft");
  await ensureCiDraftSeeded();
  revalidatePath("/admin/commercial-industrial");
}
