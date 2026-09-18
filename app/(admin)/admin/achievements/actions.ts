"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { requireRole } from "../guard";
import type { PublishState } from "../publishState";
import { text, uuid, oneOf } from "@/lib/validate";

const ROLES = ["admin", "marketing"] as const;

export async function ensureAchievementsDraftSeeded() {
  await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();
  const { error } = await supabase.rpc("ensure_draft_seeded", { p_table: "home_achievements" });
  if (error) {
    throw new Error(
      `Could not prepare the draft from what is published (${error.message}). Nothing was changed — reload and try again.`
    );
  }
}

export async function addAchievement() {
  const profile = await requireRole([...ROLES]);
  await ensureAchievementsDraftSeeded();
  const supabase = await getSupabaseUserClient();
  const { count } = await supabase.from("home_achievements").select("*", { count: "exact", head: true }).eq("status", "draft");
  await supabase.from("home_achievements").insert({
    status: "draft",
    sort_order: count ?? 0,
    value: "New title",
    label: "One-line description of this achievement",
    updated_by: profile.id,
  });
  revalidatePath("/admin/achievements");
}

export async function updateAchievement(id: string, field: string, value: string) {
  const profile = await requireRole([...ROLES]);
  const column = oneOf(field, ["value", "label"] as const, "field");
  const clean = text(value, { max: column === "label" ? 220 : 80, required: true, field: column });
  const supabase = await getSupabaseUserClient();
  await supabase
    .from("home_achievements")
    .update({ [column]: clean, updated_by: profile.id, updated_at: new Date().toISOString() })
    .eq("id", uuid(id))
    .eq("status", "draft");
  revalidatePath("/admin/achievements");
}

export async function removeAchievement(id: string) {
  await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("home_achievements").delete().eq("id", uuid(id)).eq("status", "draft");
  revalidatePath("/admin/achievements");
}

export async function moveAchievement(id: string, direction: "up" | "down") {
  await requireRole([...ROLES]);
  const rowId = uuid(id);
  const supabase = await getSupabaseUserClient();

  const { data: rows } = await supabase.from("home_achievements").select("id, sort_order").eq("status", "draft").order("sort_order");
  if (!rows) return;
  const idx = rows.findIndex((r) => r.id === rowId);
  const swapWith = oneOf(direction, ["up", "down"] as const, "direction") === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapWith < 0 || swapWith >= rows.length) return;

  await supabase.from("home_achievements").update({ sort_order: rows[swapWith].sort_order }).eq("id", rows[idx].id);
  await supabase.from("home_achievements").update({ sort_order: rows[idx].sort_order }).eq("id", rows[swapWith].id);
  revalidatePath("/admin/achievements");
}

/* --------------------------- publish workflow --------------------------- */

const COMPARED = ["value", "label"] as const;

function signature(rows: Record<string, unknown>[] | null) {
  return JSON.stringify((rows ?? []).map((row) => COMPARED.map((f) => row[f] ?? null)));
}

export async function getAchievementsPublishStatus() {
  await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();

  const [draft, live, archived] = await Promise.all([
    supabase.from("home_achievements").select("*").eq("status", "draft").order("sort_order"),
    supabase.from("home_achievements").select("*").eq("status", "published").order("sort_order"),
    supabase.from("home_achievements").select("*", { count: "exact", head: true }).eq("status", "archived"),
  ]);

  return {
    canPublish: signature(draft.data) !== signature(live.data),
    canUnpublish: Boolean(archived.count),
  };
}

export async function publishAchievements(_prevState: PublishState, _formData: FormData): Promise<PublishState> {
  const profile = await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();

  const { canPublish } = await getAchievementsPublishStatus();
  if (!canPublish) return { status: "empty", message: "Nothing to publish — the draft matches what is already live." };

  const { error } = await supabase.rpc("home_achievements_publish", { p_user: profile.id });
  if (error) {
    return { status: "error", message: `Publishing failed: ${error.message}. Nothing was changed — reload and try again.` };
  }

  revalidatePath("/admin/achievements");
  revalidatePath("/", "layout");
  return { status: "success", message: "Published — the public page now shows this draft." };
}

export async function unpublishAchievements(_prevState: PublishState, _formData: FormData): Promise<PublishState> {
  await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();

  const { data: lastArchived } = await supabase
    .from("home_achievements")
    .select("published_at")
    .eq("status", "archived")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!lastArchived?.published_at) {
    return { status: "empty", message: "Nothing to revert to — no earlier published version was found." };
  }

  await supabase.from("home_achievements").update({ status: "archived" }).eq("status", "published");
  await supabase
    .from("home_achievements")
    .update({ status: "published" })
    .eq("published_at", lastArchived.published_at)
    .eq("status", "archived");

  revalidatePath("/admin/achievements");
  revalidatePath("/", "layout");
  return { status: "success", message: "Reverted to the previous published version." };
}

export async function discardAchievementsDraft() {
  await requireRole([...ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("home_achievements").delete().eq("status", "draft");
  await ensureAchievementsDraftSeeded();
  revalidatePath("/admin/achievements");
}
