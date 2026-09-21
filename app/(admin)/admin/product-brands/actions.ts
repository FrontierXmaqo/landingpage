"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { requireRole } from "../guard";
import type { PublishState } from "../publishState";
import { text, uuid, ValidationError } from "@/lib/validate";

const ROLES = ["admin", "marketing"] as const;

const BUCKET = "project-photos";
/** Matches the bucket's own limit, so an oversize file is refused here with a
 *  readable message rather than by the storage API with an opaque one. */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
/** Logos render as small tiles, so they never need much width. */
const MAX_LOGO_WIDTH = 600;

/** Seeds a draft copy of whatever is published — see the C&I editor's
 *  ensureCiDraftSeeded for why this has to be one locked database call
 *  rather than a check-then-insert done here. */
export async function ensureBrandLogosDraftSeeded() {
  await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();
  const { error } = await supabase.rpc("ensure_draft_seeded", { p_table: "brand_logos" });
  if (error) {
    throw new Error(
      `Could not prepare the draft from what is published (${error.message}). Nothing was changed — reload and try again.`
    );
  }
}

export async function addBrand(name: string) {
  const profile = await requireRole([...ROLES]);
  const clean = text(name, { max: 80, required: true, field: "name" });
  await ensureBrandLogosDraftSeeded();
  const supabase = await getSupabaseUserClient();
  const { count } = await supabase.from("brand_logos").select("*", { count: "exact", head: true }).eq("status", "draft");
  await supabase.from("brand_logos").insert({ status: "draft", sort_order: count ?? 0, name: clean, updated_by: profile.id });
  revalidatePath("/admin/residential");
}

export async function updateBrand(id: string, name: string) {
  const profile = await requireRole([...ROLES]);
  const clean = text(name, { max: 80, required: true, field: "name" });
  const supabase = await getSupabaseUserClient();
  await supabase
    .from("brand_logos")
    .update({ name: clean, updated_by: profile.id, updated_at: new Date().toISOString() })
    .eq("id", uuid(id))
    .eq("status", "draft");
  revalidatePath("/admin/residential");
}

export async function removeBrand(id: string) {
  await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("brand_logos").delete().eq("id", uuid(id)).eq("status", "draft");
  revalidatePath("/admin/residential");
}

/** Uploads a brand's logo, re-encoded to WebP the same way the C&I client
 *  roster's logos are — capped narrower since these render as small tiles too,
 *  with transparency preserved so a logo on a transparent background sits
 *  cleanly on the strip. */
export async function uploadBrandLogo(id: string, formData: FormData) {
  const profile = await requireRole([...ROLES]);
  const rowId = uuid(id);
  const file = formData.get("logo");

  if (!(file instanceof File) || file.size === 0) throw new ValidationError("Choose an image file to upload.");
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ValidationError(
      `That image is ${(file.size / 1024 / 1024).toFixed(1)}MB. Please use one under 10MB — a logo about 600px wide is plenty.`
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
  const path = `brand-logos/${rowId}/${Date.now()}.webp`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, webp, { contentType: "image/webp", upsert: true });
  if (error) {
    console.error("Brand logo upload failed", error);
    throw new ValidationError(`The logo could not be uploaded: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  await supabase
    .from("brand_logos")
    .update({ logo_url: data.publicUrl, updated_by: profile.id, updated_at: new Date().toISOString() })
    .eq("id", rowId)
    .eq("status", "draft");

  revalidatePath("/admin/residential");
}

/** Clears the logo, putting the tile back to the brand's name in text. */
export async function removeBrandLogo(id: string) {
  const profile = await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase
    .from("brand_logos")
    .update({ logo_url: null, updated_by: profile.id, updated_at: new Date().toISOString() })
    .eq("id", uuid(id))
    .eq("status", "draft");
  revalidatePath("/admin/residential");
}

export async function moveBrand(id: string, direction: "up" | "down") {
  await requireRole([...ROLES]);
  const rowId = uuid(id);
  const supabase = await getSupabaseUserClient();

  const { data: rows } = await supabase.from("brand_logos").select("id, sort_order").eq("status", "draft").order("sort_order");
  if (!rows) return;
  const idx = rows.findIndex((r) => r.id === rowId);
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapWith < 0 || swapWith >= rows.length) return;

  await supabase.from("brand_logos").update({ sort_order: rows[swapWith].sort_order }).eq("id", rows[idx].id);
  await supabase.from("brand_logos").update({ sort_order: rows[idx].sort_order }).eq("id", rows[swapWith].id);
  revalidatePath("/admin/residential");
}

/* --------------------------- publish workflow --------------------------- */

const COMPARED = ["name", "logo_url"] as const;

function signature(rows: Record<string, unknown>[] | null) {
  return JSON.stringify((rows ?? []).map((row) => COMPARED.map((f) => row[f] ?? null)));
}

export async function getBrandLogosPublishStatus() {
  await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();

  const [draft, live, archived] = await Promise.all([
    supabase.from("brand_logos").select("*").eq("status", "draft").order("sort_order"),
    supabase.from("brand_logos").select("*").eq("status", "published").order("sort_order"),
    supabase.from("brand_logos").select("*", { count: "exact", head: true }).eq("status", "archived"),
  ]);

  return {
    canPublish: signature(draft.data) !== signature(live.data),
    canUnpublish: Boolean(archived.count),
  };
}

export async function publishBrandLogos(_prevState: PublishState, _formData: FormData): Promise<PublishState> {
  const profile = await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();

  const { canPublish } = await getBrandLogosPublishStatus();
  if (!canPublish) return { status: "empty", message: "Nothing to publish — the draft matches what is already live." };

  const { error } = await supabase.rpc("brand_logos_publish", { p_user: profile.id });
  if (error) {
    return { status: "error", message: `Publishing failed: ${error.message}. Nothing was changed — reload and try again.` };
  }

  revalidatePath("/admin/residential");
  revalidatePath("/", "layout");
  return { status: "success", message: "Published — the public page now shows this draft." };
}

export async function unpublishBrandLogos(_prevState: PublishState, _formData: FormData): Promise<PublishState> {
  await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();

  const { data: lastArchived } = await supabase
    .from("brand_logos")
    .select("published_at")
    .eq("status", "archived")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!lastArchived?.published_at) {
    return { status: "empty", message: "Nothing to revert to — no earlier published version was found." };
  }

  await supabase.from("brand_logos").update({ status: "archived" }).eq("status", "published");
  await supabase
    .from("brand_logos")
    .update({ status: "published" })
    .eq("published_at", lastArchived.published_at)
    .eq("status", "archived");

  revalidatePath("/admin/residential");
  revalidatePath("/", "layout");
  return { status: "success", message: "Reverted to the previous published version." };
}

export async function discardBrandLogosDraft() {
  await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("brand_logos").delete().eq("status", "draft");
  await ensureBrandLogosDraftSeeded();
  revalidatePath("/admin/residential");
}
