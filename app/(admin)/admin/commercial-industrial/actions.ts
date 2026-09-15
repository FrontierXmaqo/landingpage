"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { requireRole } from "../guard";
import { text, uuid, oneOf, ValidationError } from "@/lib/validate";

const CI_ROLES = ["admin", "marketing"] as const;

/** The three tables this section publishes together. */
const TABLES = ["ci_projects", "ci_clients", "ci_trust_stats"] as const;
type Table = (typeof TABLES)[number];

const BUCKET = "project-photos";
/** Matches the bucket's own limit, so an oversize file is refused here with a
 *  readable message rather than by the storage API with an opaque one. */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
/** Wider than the card ever renders, even at 2x on a large screen. */
const MAX_IMAGE_WIDTH = 1600;

/**
 * Seeds a draft copy of whatever is published, so editing always starts from
 * what is live. Runs per table: a section published before another existed
 * still gets its own draft.
 */
export async function ensureCiDraftSeeded() {
  await requireRole([...CI_ROLES]);
  const supabase = await getSupabaseUserClient();

  for (const table of TABLES) {
    const { data: draft } = await supabase.from(table).select("id").eq("status", "draft").limit(1);
    if (draft?.length) continue;

    const { data: published } = await supabase.from(table).select("*").eq("status", "published").order("sort_order");
    if (!published?.length) continue;

    await supabase.from(table).insert(
      published.map((row) => ({ ...row, id: undefined, status: "draft", published_at: null, published_by: null }))
    );
  }
}

/* ----------------------------- projects ----------------------------- */

export async function addProject() {
  const profile = await requireRole([...CI_ROLES]);
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
      `That image is ${(file.size / 1024 / 1024).toFixed(1)}MB. Please use one under 10MB — exporting at about 1600px wide is plenty.`
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
  if (error) throw new ValidationError("The image could not be uploaded. Please try again.");

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
  const supabase = await getSupabaseUserClient();
  const { count } = await supabase.from("ci_clients").select("*", { count: "exact", head: true }).eq("status", "draft");
  await supabase.from("ci_clients").insert({ status: "draft", sort_order: count ?? 0, name: clean, updated_by: profile.id });
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

/**
 * Promotes each table's draft to published.
 *
 * The per-table draft check is the same guard the lead form carries, and for
 * the same reason: archiving the live rows when there is no draft to replace
 * them promotes nothing and silently empties the section on the public page.
 */
export async function publishCiContent() {
  const profile = await requireRole([...CI_ROLES]);
  const supabase = await getSupabaseUserClient();
  const now = new Date().toISOString();

  for (const table of TABLES) {
    const { count } = await supabase.from(table).select("*", { count: "exact", head: true }).eq("status", "draft");
    if (!count) continue;
    await supabase.from(table).update({ status: "archived" }).eq("status", "published");
    await supabase.from(table).update({ status: "published", published_at: now, published_by: profile.id }).eq("status", "draft");
  }

  revalidatePath("/admin/commercial-industrial");
  revalidatePath("/", "layout");
}

/** Reverts to the snapshot taken by the previous publish. */
export async function unpublishCiContent() {
  await requireRole([...CI_ROLES]);
  const supabase = await getSupabaseUserClient();

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
  }

  revalidatePath("/admin/commercial-industrial");
  revalidatePath("/", "layout");
}

/** Throws away in-progress edits, reseeding the draft from what is published. */
export async function discardCiDraft() {
  await requireRole([...CI_ROLES]);
  const supabase = await getSupabaseUserClient();
  for (const table of TABLES) await supabase.from(table).delete().eq("status", "draft");
  await ensureCiDraftSeeded();
  revalidatePath("/admin/commercial-industrial");
}
