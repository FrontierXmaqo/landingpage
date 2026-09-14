"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseUserClient } from "@/lib/supabase/server";

export const FIELDS = ["salutation", "state", "bill_range", "property_type", "electric_supply", "language"] as const;
export type FieldName = (typeof FIELDS)[number];

export async function ensureLeadFormDraftSeeded() {
  const supabase = await getSupabaseUserClient();
  for (const field of FIELDS) {
    const { data: draft } = await supabase.from("lead_form_options").select("id").eq("status", "draft").eq("field_name", field).limit(1);
    if (draft?.length) continue;
    const { data: published } = await supabase.from("lead_form_options").select("value, sort_order").eq("status", "published").eq("field_name", field);
    if (published?.length) {
      await supabase.from("lead_form_options").insert(
        published.map((row) => ({ field_name: field, value: row.value, sort_order: row.sort_order, status: "draft" }))
      );
    }
  }
}

export async function addOption(field: FieldName, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return;
  const supabase = await getSupabaseUserClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { count } = await supabase.from("lead_form_options").select("*", { count: "exact", head: true }).eq("status", "draft").eq("field_name", field);
  await supabase.from("lead_form_options").insert({ field_name: field, value: trimmed, sort_order: count ?? 0, status: "draft", updated_by: user?.id });
  revalidatePath("/admin/leads-form");
}

export async function removeOption(id: string) {
  const supabase = await getSupabaseUserClient();
  await supabase.from("lead_form_options").delete().eq("id", id).eq("status", "draft");
  revalidatePath("/admin/leads-form");
}

export async function moveOption(id: string, direction: "up" | "down", field: FieldName) {
  const supabase = await getSupabaseUserClient();
  const { data: rows } = await supabase.from("lead_form_options").select("id, sort_order").eq("status", "draft").eq("field_name", field).order("sort_order");
  if (!rows) return;
  const idx = rows.findIndex((r) => r.id === id);
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapWith < 0 || swapWith >= rows.length) return;
  await supabase.from("lead_form_options").update({ sort_order: rows[swapWith].sort_order }).eq("id", rows[idx].id);
  await supabase.from("lead_form_options").update({ sort_order: rows[idx].sort_order }).eq("id", rows[swapWith].id);
  revalidatePath("/admin/leads-form");
}

// ponytail: sequential writes, matches the same pattern (and the same ceiling) as calculator publish/unpublish.
export async function publishLeadFormOptions() {
  const supabase = await getSupabaseUserClient();
  const { data: { user } } = await supabase.auth.getUser();
  const now = new Date().toISOString();
  await supabase.from("lead_form_options").update({ status: "archived" }).eq("status", "published");
  await supabase.from("lead_form_options").update({ status: "published", published_at: now, published_by: user?.id }).eq("status", "draft");
  revalidatePath("/admin/leads-form");
  revalidatePath("/");
}

export async function unpublishLeadFormOptions() {
  const supabase = await getSupabaseUserClient();
  const { data: lastArchived } = await supabase
    .from("lead_form_options").select("published_at").eq("status", "archived").order("published_at", { ascending: false }).limit(1).maybeSingle();
  if (!lastArchived?.published_at) return;
  await supabase.from("lead_form_options").update({ status: "archived" }).eq("status", "published");
  await supabase.from("lead_form_options").update({ status: "published" }).eq("published_at", lastArchived.published_at).eq("status", "archived");
  revalidatePath("/admin/leads-form");
  revalidatePath("/");
}
