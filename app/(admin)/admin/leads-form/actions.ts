"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { FIELDS, type FieldName } from "./fields";
import { requireRole } from "../guard";
import { oneOf, text, uuid } from "@/lib/validate";

const LEAD_FORM_ROLES = ["admin", "marketing"] as const;

export async function ensureLeadFormDraftSeeded() {
  await requireRole([...LEAD_FORM_ROLES]);
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
  const profile = await requireRole([...LEAD_FORM_ROLES]);
  // `field` names a column-ish value from the client — pin it to the known list.
  const fieldName = oneOf(field, FIELDS, "field");
  const trimmed = text(value, { max: 120 });
  if (!trimmed) return;
  const supabase = await getSupabaseUserClient();
  const { count } = await supabase.from("lead_form_options").select("*", { count: "exact", head: true }).eq("status", "draft").eq("field_name", fieldName);
  await supabase.from("lead_form_options").insert({ field_name: fieldName, value: trimmed, sort_order: count ?? 0, status: "draft", updated_by: profile.id });
  revalidatePath("/admin/leads-form");
}

export async function removeOption(id: string) {
  await requireRole([...LEAD_FORM_ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("lead_form_options").delete().eq("id", uuid(id)).eq("status", "draft");
  revalidatePath("/admin/leads-form");
}

export async function moveOption(id: string, direction: "up" | "down", field: FieldName) {
  await requireRole([...LEAD_FORM_ROLES]);
  const fieldName = oneOf(field, FIELDS, "field");
  const rowId = uuid(id);
  const supabase = await getSupabaseUserClient();
  const { data: rows } = await supabase.from("lead_form_options").select("id, sort_order").eq("status", "draft").eq("field_name", fieldName).order("sort_order");
  if (!rows) return;
  const idx = rows.findIndex((r) => r.id === rowId);
  const swapWith = oneOf(direction, ["up", "down"] as const, "direction") === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapWith < 0 || swapWith >= rows.length) return;
  await supabase.from("lead_form_options").update({ sort_order: rows[swapWith].sort_order }).eq("id", rows[idx].id);
  await supabase.from("lead_form_options").update({ sort_order: rows[idx].sort_order }).eq("id", rows[swapWith].id);
  revalidatePath("/admin/leads-form");
}

// ponytail: sequential writes, matches the same pattern (and the same ceiling) as calculator publish/unpublish.
export async function publishLeadFormOptions() {
  const profile = await requireRole([...LEAD_FORM_ROLES]);
  const supabase = await getSupabaseUserClient();
  const now = new Date().toISOString();
  await supabase.from("lead_form_options").update({ status: "archived" }).eq("status", "published");
  await supabase.from("lead_form_options").update({ status: "published", published_at: now, published_by: profile.id }).eq("status", "draft");
  revalidatePath("/admin/leads-form");
  revalidatePath("/");
}

export async function unpublishLeadFormOptions() {
  await requireRole([...LEAD_FORM_ROLES]);
  const supabase = await getSupabaseUserClient();
  const { data: lastArchived } = await supabase
    .from("lead_form_options").select("published_at").eq("status", "archived").order("published_at", { ascending: false }).limit(1).maybeSingle();
  if (!lastArchived?.published_at) return;
  await supabase.from("lead_form_options").update({ status: "archived" }).eq("status", "published");
  await supabase.from("lead_form_options").update({ status: "published" }).eq("published_at", lastArchived.published_at).eq("status", "archived");
  revalidatePath("/admin/leads-form");
  revalidatePath("/");
}
