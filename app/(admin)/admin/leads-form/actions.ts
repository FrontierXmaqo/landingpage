"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { FIELDS } from "./fields";
import { requireRole } from "../guard";
import { oneOf, text, uuid } from "@/lib/validate";

const LEAD_FORM_ROLES = ["admin", "marketing"] as const;

/** Slug for a custom field's key: lowercase, digits, underscores — mirrors the
 * shape of the existing core field names (e.g. "bill_range"). */
const FIELD_KEY = /^[a-z][a-z0-9_]{1,39}$/;

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

/** Same seeding pattern as ensureLeadFormDraftSeeded, for the field *definitions*
 * themselves rather than their option values. */
export async function ensureLeadFormFieldsDraftSeeded() {
  await requireRole([...LEAD_FORM_ROLES]);
  const supabase = await getSupabaseUserClient();

  const { data: draft } = await supabase.from("lead_form_fields").select("id").eq("status", "draft").limit(1);
  if (draft?.length) return;

  const { data: published } = await supabase.from("lead_form_fields").select("*").eq("status", "published");
  if (published?.length) {
    await supabase.from("lead_form_fields").insert(
      published.map((row) => ({ ...row, id: undefined, status: "draft", published_at: null, published_by: null }))
    );
  }
}

/** A field name is only ever trusted if it's a currently-draft field key —
 * covers both the 6 core fields and any custom ones marketing has added. */
async function assertKnownDraftField(fieldName: string) {
  const supabase = await getSupabaseUserClient();
  const { data } = await supabase.from("lead_form_fields").select("id").eq("status", "draft").eq("field_key", fieldName).maybeSingle();
  if (!data) throw new Error("Unknown field.");
}

export async function addOption(field: string, value: string) {
  const profile = await requireRole([...LEAD_FORM_ROLES]);
  const fieldName = text(field, { max: 40, required: true, field: "field" });
  await assertKnownDraftField(fieldName);
  const trimmed = text(value, { max: 120 });
  if (!trimmed) return;
  const supabase = await getSupabaseUserClient();
  const { count } = await supabase.from("lead_form_options").select("*", { count: "exact", head: true }).eq("status", "draft").eq("field_name", fieldName);
  await supabase.from("lead_form_options").insert({ field_name: fieldName, value: trimmed, sort_order: count ?? 0, status: "draft", updated_by: profile.id });
  revalidatePath("/admin/leads-form");
}

export async function updateOption(id: string, value: string) {
  const profile = await requireRole([...LEAD_FORM_ROLES]);
  const trimmed = text(value, { max: 120, required: true, field: "value" });
  const supabase = await getSupabaseUserClient();
  await supabase.from("lead_form_options").update({ value: trimmed, updated_by: profile.id, updated_at: new Date().toISOString() }).eq("id", uuid(id)).eq("status", "draft");
  revalidatePath("/admin/leads-form");
}

export async function removeOption(id: string) {
  await requireRole([...LEAD_FORM_ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("lead_form_options").delete().eq("id", uuid(id)).eq("status", "draft");
  revalidatePath("/admin/leads-form");
}

/** Adds a brand-new custom dropdown field (always is_core=false — the 6 core
 * fields are seeded once by migration and never created through this action). */
export async function addField(key: string, label: string) {
  const profile = await requireRole([...LEAD_FORM_ROLES]);
  const fieldKey = text(key, { max: 40, required: true, field: "key" }).toLowerCase();
  if (!FIELD_KEY.test(fieldKey)) throw new Error("Field key must be lowercase letters, numbers, or underscores, starting with a letter.");
  const fieldLabel = text(label, { max: 80, required: true, field: "label" });

  const supabase = await getSupabaseUserClient();
  const { data: existing } = await supabase.from("lead_form_fields").select("id").eq("status", "draft").eq("field_key", fieldKey).maybeSingle();
  if (existing) throw new Error("A field with that key already exists.");

  const { count } = await supabase.from("lead_form_fields").select("*", { count: "exact", head: true }).eq("status", "draft");
  await supabase.from("lead_form_fields").insert({
    field_key: fieldKey, label: fieldLabel, is_core: false, sort_order: count ?? 0, status: "draft", updated_by: profile.id,
  });
  revalidatePath("/admin/leads-form");
}

export async function updateFieldLabel(id: string, label: string) {
  const profile = await requireRole([...LEAD_FORM_ROLES]);
  const fieldLabel = text(label, { max: 80, required: true, field: "label" });
  const supabase = await getSupabaseUserClient();
  await supabase.from("lead_form_fields").update({ label: fieldLabel, updated_by: profile.id, updated_at: new Date().toISOString() }).eq("id", uuid(id)).eq("status", "draft");
  revalidatePath("/admin/leads-form");
}

/** Deletes a custom field and its draft options. No-ops on core fields — those
 * are protected because the public form and submitLead.ts hardcode their keys. */
export async function removeField(id: string) {
  await requireRole([...LEAD_FORM_ROLES]);
  const rowId = uuid(id);
  const supabase = await getSupabaseUserClient();
  const { data: field } = await supabase.from("lead_form_fields").select("field_key, is_core").eq("id", rowId).eq("status", "draft").maybeSingle();
  if (!field || field.is_core) return;

  await supabase.from("lead_form_options").delete().eq("status", "draft").eq("field_name", field.field_key);
  await supabase.from("lead_form_fields").delete().eq("id", rowId);
  revalidatePath("/admin/leads-form");
}

export async function moveField(id: string, direction: "up" | "down") {
  await requireRole([...LEAD_FORM_ROLES]);
  const rowId = uuid(id);
  const supabase = await getSupabaseUserClient();
  const { data: rows } = await supabase.from("lead_form_fields").select("id, sort_order").eq("status", "draft").order("sort_order");
  if (!rows) return;
  const idx = rows.findIndex((r) => r.id === rowId);
  const swapWith = oneOf(direction, ["up", "down"] as const, "direction") === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapWith < 0 || swapWith >= rows.length) return;
  await supabase.from("lead_form_fields").update({ sort_order: rows[swapWith].sort_order }).eq("id", rows[idx].id);
  await supabase.from("lead_form_fields").update({ sort_order: rows[idx].sort_order }).eq("id", rows[swapWith].id);
  revalidatePath("/admin/leads-form");
}

// ponytail: sequential writes, matches the same pattern (and the same ceiling) as calculator publish/unpublish.
export async function publishLeadFormOptions() {
  const profile = await requireRole([...LEAD_FORM_ROLES]);
  const supabase = await getSupabaseUserClient();
  const now = new Date().toISOString();
  await supabase.from("lead_form_fields").update({ status: "archived" }).eq("status", "published");
  await supabase.from("lead_form_fields").update({ status: "published", published_at: now, published_by: profile.id }).eq("status", "draft");
  await supabase.from("lead_form_options").update({ status: "archived" }).eq("status", "published");
  await supabase.from("lead_form_options").update({ status: "published", published_at: now, published_by: profile.id }).eq("status", "draft");
  revalidatePath("/admin/leads-form");
  revalidatePath("/");
}

export async function unpublishLeadFormOptions() {
  await requireRole([...LEAD_FORM_ROLES]);
  const supabase = await getSupabaseUserClient();

  const { data: lastArchivedFields } = await supabase
    .from("lead_form_fields").select("published_at").eq("status", "archived").order("published_at", { ascending: false }).limit(1).maybeSingle();
  if (lastArchivedFields?.published_at) {
    await supabase.from("lead_form_fields").update({ status: "archived" }).eq("status", "published");
    await supabase.from("lead_form_fields").update({ status: "published" }).eq("published_at", lastArchivedFields.published_at).eq("status", "archived");
  }

  const { data: lastArchived } = await supabase
    .from("lead_form_options").select("published_at").eq("status", "archived").order("published_at", { ascending: false }).limit(1).maybeSingle();
  if (lastArchived?.published_at) {
    await supabase.from("lead_form_options").update({ status: "archived" }).eq("status", "published");
    await supabase.from("lead_form_options").update({ status: "published" }).eq("published_at", lastArchived.published_at).eq("status", "archived");
  }

  revalidatePath("/admin/leads-form");
  revalidatePath("/");
}

/** Discards in-progress draft edits (fields + options), resetting the draft
 * back to match the currently published set. */
export async function discardLeadFormDraft() {
  await requireRole([...LEAD_FORM_ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("lead_form_options").delete().eq("status", "draft");
  await supabase.from("lead_form_fields").delete().eq("status", "draft");
  await ensureLeadFormDraftSeeded();
  await ensureLeadFormFieldsDraftSeeded();
  revalidatePath("/admin/leads-form");
}
