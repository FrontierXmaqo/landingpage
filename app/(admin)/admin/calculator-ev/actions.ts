"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { requireRole } from "../guard";
import { num } from "@/lib/validate";

const EV_CALC_ROLES = ["admin", "marketing"] as const;

const CONFIG_FIELDS = [
  "rate_per_kwh",
  "avg_kwh_per_kwp_month",
  "reference_system_kwp",
  "kwp_per_panel",
  "min_system_kwp",
  "min_monthly_bill",
  "offset_day_percent",
  "offset_night_percent",
  "offset_mixed_percent",
] as const;

/** Ensures a draft row exists, cloning from the published row on first edit so
 * editing always starts from what's live — same pattern as the main calculator. */
export async function ensureEvDraftSeeded() {
  await requireRole([...EV_CALC_ROLES]);
  const supabase = await getSupabaseUserClient();

  const { data: draft } = await supabase.from("ev_calculator_config").select("id").eq("status", "draft").maybeSingle();
  if (draft) return;

  const { data: published } = await supabase.from("ev_calculator_config").select("*").eq("status", "published").maybeSingle();
  const base = published ?? {};
  await supabase.from("ev_calculator_config").insert({ ...base, id: undefined, status: "draft", published_at: null, published_by: null });
}

export async function saveEvConfigDraft(formData: FormData) {
  const profile = await requireRole([...EV_CALC_ROLES]);
  const supabase = await getSupabaseUserClient();
  const { data: draft } = await supabase.from("ev_calculator_config").select("id").eq("status", "draft").maybeSingle();
  if (!draft) return;

  const patch: Record<string, unknown> = { updated_by: profile.id, updated_at: new Date().toISOString() };
  for (const field of CONFIG_FIELDS) patch[field] = num(formData.get(field), { field });

  await supabase.from("ev_calculator_config").update(patch).eq("id", draft.id);
  revalidatePath("/admin/residential");
}

/** Discards in-progress draft edits, resetting the draft back to match the
 * currently published row. */
export async function discardEvConfigDraft() {
  await requireRole([...EV_CALC_ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("ev_calculator_config").delete().eq("status", "draft");
  await ensureEvDraftSeeded();
  revalidatePath("/admin/residential");
}

// Guarded the same way as the lead form's publish action: only archive the
// live published row if there's actually a draft ready to take its place, or
// a second publish with nothing new drafted wipes the config to nothing.
export async function publishEvCalculator() {
  const profile = await requireRole([...EV_CALC_ROLES]);
  const supabase = await getSupabaseUserClient();
  const now = new Date().toISOString();

  const { count: draftCount } = await supabase.from("ev_calculator_config").select("*", { count: "exact", head: true }).eq("status", "draft");
  if (draftCount) {
    await supabase.from("ev_calculator_config").update({ status: "archived" }).eq("status", "published");
    await supabase.from("ev_calculator_config").update({ status: "published", published_at: now, published_by: profile.id }).eq("status", "draft");
  }

  revalidatePath("/admin/residential");
  revalidatePath("/");
}

/** Reverts to the most recently archived snapshot (the state before the last publish). */
export async function unpublishEvCalculator() {
  await requireRole([...EV_CALC_ROLES]);
  const supabase = await getSupabaseUserClient();

  const { data: lastArchived } = await supabase
    .from("ev_calculator_config").select("id").eq("status", "archived").order("published_at", { ascending: false }).limit(1).maybeSingle();
  if (!lastArchived) return;

  await supabase.from("ev_calculator_config").update({ status: "archived" }).eq("status", "published");
  await supabase.from("ev_calculator_config").update({ status: "published" }).eq("id", lastArchived.id);

  revalidatePath("/admin/residential");
  revalidatePath("/");
}
