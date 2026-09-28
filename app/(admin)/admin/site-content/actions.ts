"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { requireRole } from "../guard";
import type { PublishState } from "../publishState";
import { oneOf, ValidationError } from "@/lib/validate";
import { CLEAN, SITE_SECTIONS, type SiteContent, type SiteSection } from "@/lib/siteContent";

/** Same editors as the Residential page's brand logos. */
const ROLES = ["admin", "marketing"] as const;

/** Where each section is edited, so a change refreshes the right admin page. */
const ADMIN_PATH: Record<SiteSection, string> = {
  products: "/admin/products-services",
  services: "/admin/products-services",
  blog: "/admin/blog",
  contact: "/admin/contact",
};

const BUCKET = "project-photos";
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
/** Product shots render at most ~420px wide in the detail dialog; 2x for retina. */
const MAX_IMAGE_WIDTH = 1000;

/** Draft if there is one, else what is live, else `fallback` (the built-in copy). */
export async function loadSection<S extends SiteSection>(section: S, fallback: SiteContent[S]) {
  const s = oneOf(section, SITE_SECTIONS, "section");
  await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();
  const [{ data: rows }, { count: archived }] = await Promise.all([
    supabase.from("site_content").select("status, data, published_at").eq("section", s).in("status", ["draft", "published"]),
    supabase.from("site_content").select("*", { count: "exact", head: true }).eq("section", s).eq("status", "archived"),
  ]);
  const draft = rows?.find((r) => r.status === "draft");
  const live = rows?.find((r) => r.status === "published");

  return {
    data: (draft?.data ?? live?.data ?? fallback) as SiteContent[S],
    lastPublished: live?.published_at as string | undefined,
    status: {
      canPublish: Boolean(draft) && JSON.stringify(draft!.data) !== JSON.stringify(live?.data ?? null),
      canUnpublish: Boolean(archived),
    },
  };
}

export async function saveSection(section: SiteSection, data: unknown) {
  const s = oneOf(section, SITE_SECTIONS, "section");
  const profile = await requireRole([...ROLES]);
  const clean = CLEAN[s](data);
  const supabase = await getSupabaseUserClient();
  const row = { data: clean, updated_by: profile.id, updated_at: new Date().toISOString() };

  const { data: updated, error } = await supabase.from("site_content").update(row).eq("section", s).eq("status", "draft").select("id");
  if (!error && !updated?.length) {
    const { error: insertError } = await supabase.from("site_content").insert({ ...row, section: s, status: "draft" });
    if (insertError) throw new Error(`Could not save the draft (${insertError.message}). Reload and try again.`);
  } else if (error) {
    throw new Error(`Could not save the draft (${error.message}). Reload and try again.`);
  }
  revalidatePath(ADMIN_PATH[s]);
}

export async function publishSection(section: SiteSection): Promise<PublishState> {
  const s = oneOf(section, SITE_SECTIONS, "section");
  const profile = await requireRole([...ROLES]);
  const { status } = await loadSection(s, null as never);
  if (!status.canPublish) return { status: "empty", message: "Nothing to publish - the draft matches what is already live." };

  const supabase = await getSupabaseUserClient();
  const { error } = await supabase.rpc("site_content_publish", { p_section: s, p_user: profile.id });
  if (error) return { status: "error", message: `Publishing failed: ${error.message}. Nothing was changed - reload and try again.` };

  revalidatePath(ADMIN_PATH[s]);
  revalidatePath("/", "layout");
  return { status: "success", message: "Published - the public page now shows this draft." };
}

export async function unpublishSection(section: SiteSection): Promise<PublishState> {
  const s = oneOf(section, SITE_SECTIONS, "section");
  await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();
  const { data: reverted, error } = await supabase.rpc("site_content_unpublish", { p_section: s });
  if (error) return { status: "error", message: `Reverting failed: ${error.message}. Nothing was changed - reload and try again.` };
  if (!reverted) return { status: "empty", message: "Nothing to revert to - no earlier published version was found." };

  revalidatePath(ADMIN_PATH[s]);
  revalidatePath("/", "layout");
  return { status: "success", message: "Reverted to the previous published version." };
}

export async function discardSectionDraft(section: SiteSection) {
  const s = oneOf(section, SITE_SECTIONS, "section");
  await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("site_content").delete().eq("section", s).eq("status", "draft");
  revalidatePath(ADMIN_PATH[s]);
}

/** Uploads a product photo, re-encoded to WebP like the C&I project photos.
 *  Returns the public URL; the editor adds it to the product and autosaves. */
export async function uploadProductImage(formData: FormData) {
  await requireRole([...ROLES]);
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) throw new ValidationError("Choose an image file to upload.");
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ValidationError(`That image is ${(file.size / 1024 / 1024).toFixed(1)}MB. Please use one under 10MB.`);
  }

  let webp: Buffer;
  try {
    webp = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    throw new ValidationError("That file could not be read as an image. Try exporting it again as PNG or JPEG.");
  }

  const supabase = await getSupabaseUserClient();
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, webp, { contentType: "image/webp" });
  if (error) throw new ValidationError(`The image could not be uploaded: ${error.message}`);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
