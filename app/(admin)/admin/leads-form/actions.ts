"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { requireRole } from "../guard";
import type { PublishState } from "../publishState";
import { oneOf, text, uuid } from "@/lib/validate";

export type LeadFormPage = "main" | "ev" | "ci";
const PAGES = ["main", "ev", "ci"] as const;

/** Same category split as the FAQ editor: main/EV go to the resi/EV sales
 *  team, C&I to its own. Admin and marketing keep every page. */
function rolesForPage(page: LeadFormPage) {
  return page === "ci" ? (["admin", "marketing", "sales_ci"] as const) : (["admin", "marketing", "sales_resi"] as const);
}

/** Slug for a custom field's key: lowercase, digits, underscores — mirrors the
 * shape of the existing core field names (e.g. "bill_range"). */
const FIELD_KEY = /^[a-z][a-z0-9_]{1,39}$/;

// The check-then-insert this used to do here (one query for "is there a
// draft?", then a separate insert copying the published rows) raced: this
// runs on every load of /admin/leads-form, including Next.js's Link
// prefetch, so two overlapping requests could both see "no draft" before
// either had inserted, and both would copy the full published set. That is
// how the salutation options ended up with hundreds of duplicate rows.
// `ensure_lead_form_options_draft_seeded`/`ensure_lead_form_fields_draft_seeded`
// do the check and the insert inside one Postgres function, under an advisory
// lock keyed by table name + page, so a second caller blocks until the first
// commits and then finds the draft already there — same pattern as the FAQ
// editor's `ensure_faq_draft_seeded`, one page's seeding can't race another's.
export async function ensureLeadFormDraftSeeded(page: LeadFormPage) {
  const p = oneOf(page, PAGES, "page");
  await requireRole([...rolesForPage(p)]);
  const supabase = await getSupabaseUserClient();
  const { error } = await supabase.rpc("ensure_lead_form_options_draft_seeded", { p_page: p });
  if (error) {
    throw new Error(`Could not prepare the ${p} lead form options draft (${error.message}). Nothing was changed — reload and try again.`);
  }
}

/** Same seeding pattern as ensureLeadFormDraftSeeded, for the field *definitions*
 * themselves rather than their option values. */
export async function ensureLeadFormFieldsDraftSeeded(page: LeadFormPage) {
  const p = oneOf(page, PAGES, "page");
  await requireRole([...rolesForPage(p)]);
  const supabase = await getSupabaseUserClient();
  const { error } = await supabase.rpc("ensure_lead_form_fields_draft_seeded", { p_page: p });
  if (error) throw new Error(`Could not prepare the ${p} lead form draft (${error.message}).`);
}

/** A field name is only ever trusted if it's a currently-draft field key on
 * this page — covers both the 6 core fields and any custom ones marketing added. */
async function assertKnownDraftField(page: LeadFormPage, fieldName: string) {
  const supabase = await getSupabaseUserClient();
  const { data } = await supabase.from("lead_form_fields").select("id").eq("status", "draft").eq("page", page).eq("field_key", fieldName).maybeSingle();
  if (!data) throw new Error("Unknown field.");
}

export async function addOption(page: LeadFormPage, field: string, value: string) {
  const p = oneOf(page, PAGES, "page");
  const profile = await requireRole([...rolesForPage(p)]);
  const fieldName = text(field, { max: 40, required: true, field: "field" });
  await assertKnownDraftField(p, fieldName);
  const trimmed = text(value, { max: 120 });
  if (!trimmed) return;
  const supabase = await getSupabaseUserClient();
  const { count } = await supabase.from("lead_form_options").select("*", { count: "exact", head: true }).eq("status", "draft").eq("page", p).eq("field_name", fieldName);
  await supabase.from("lead_form_options").insert({ page: p, field_name: fieldName, value: trimmed, sort_order: count ?? 0, status: "draft", updated_by: profile.id });
  revalidatePath("/admin/leads-form");
}

export async function updateOption(page: LeadFormPage, id: string, value: string) {
  const p = oneOf(page, PAGES, "page");
  const profile = await requireRole([...rolesForPage(p)]);
  const trimmed = text(value, { max: 120, required: true, field: "value" });
  const supabase = await getSupabaseUserClient();
  await supabase.from("lead_form_options").update({ value: trimmed, updated_by: profile.id, updated_at: new Date().toISOString() }).eq("id", uuid(id)).eq("page", p).eq("status", "draft");
  revalidatePath("/admin/leads-form");
}

export async function removeOption(page: LeadFormPage, id: string) {
  const p = oneOf(page, PAGES, "page");
  await requireRole([...rolesForPage(p)]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("lead_form_options").delete().eq("id", uuid(id)).eq("page", p).eq("status", "draft");
  revalidatePath("/admin/leads-form");
}

/** Adds a brand-new custom dropdown field for one page (always is_core=false —
 * the 6 core fields are seeded once by migration and never created through this action). */
export async function addField(page: LeadFormPage, key: string, label: string) {
  const p = oneOf(page, PAGES, "page");
  const profile = await requireRole([...rolesForPage(p)]);
  const fieldKey = text(key, { max: 40, required: true, field: "key" }).toLowerCase();
  if (!FIELD_KEY.test(fieldKey)) throw new Error("Field key must be lowercase letters, numbers, or underscores, starting with a letter.");
  const fieldLabel = text(label, { max: 80, required: true, field: "label" });

  const supabase = await getSupabaseUserClient();
  const { data: existing } = await supabase.from("lead_form_fields").select("id").eq("status", "draft").eq("page", p).eq("field_key", fieldKey).maybeSingle();
  if (existing) throw new Error("A field with that key already exists on this page.");

  const { count } = await supabase.from("lead_form_fields").select("*", { count: "exact", head: true }).eq("status", "draft").eq("page", p);
  await supabase.from("lead_form_fields").insert({
    page: p, field_key: fieldKey, label: fieldLabel, is_core: false, sort_order: count ?? 0, status: "draft", updated_by: profile.id,
  });
  revalidatePath("/admin/leads-form");
}

export async function updateFieldLabel(page: LeadFormPage, id: string, label: string) {
  const p = oneOf(page, PAGES, "page");
  const profile = await requireRole([...rolesForPage(p)]);
  const fieldLabel = text(label, { max: 80, required: true, field: "label" });
  const supabase = await getSupabaseUserClient();
  await supabase.from("lead_form_fields").update({ label: fieldLabel, updated_by: profile.id, updated_at: new Date().toISOString() }).eq("id", uuid(id)).eq("page", p).eq("status", "draft");
  revalidatePath("/admin/leads-form");
}

/** Deletes a custom field and its draft options. No-ops on core fields — those
 * are protected because the public form and submitLead.ts hardcode their keys. */
export async function removeField(page: LeadFormPage, id: string) {
  const p = oneOf(page, PAGES, "page");
  await requireRole([...rolesForPage(p)]);
  const rowId = uuid(id);
  const supabase = await getSupabaseUserClient();
  const { data: field } = await supabase.from("lead_form_fields").select("page, field_key, is_core").eq("id", rowId).eq("page", p).eq("status", "draft").maybeSingle();
  if (!field || field.is_core) return;

  await supabase.from("lead_form_options").delete().eq("status", "draft").eq("page", field.page).eq("field_name", field.field_key);
  await supabase.from("lead_form_fields").delete().eq("id", rowId);
  revalidatePath("/admin/leads-form");
}

export async function moveField(page: LeadFormPage, id: string, direction: "up" | "down") {
  const p = oneOf(page, PAGES, "page");
  await requireRole([...rolesForPage(p)]);
  const rowId = uuid(id);
  const supabase = await getSupabaseUserClient();
  const { data: rows } = await supabase.from("lead_form_fields").select("id, sort_order").eq("status", "draft").eq("page", p).order("sort_order");
  if (!rows) return;
  const idx = rows.findIndex((r) => r.id === rowId);
  const swapWith = oneOf(direction, ["up", "down"] as const, "direction") === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapWith < 0 || swapWith >= rows.length) return;
  await supabase.from("lead_form_fields").update({ sort_order: rows[swapWith].sort_order }).eq("id", rows[idx].id);
  await supabase.from("lead_form_fields").update({ sort_order: rows[idx].sort_order }).eq("id", rows[swapWith].id);
  revalidatePath("/admin/leads-form");
}

/** Counts how many rows across both tables are draft/archived right now, for one
 * page, so the page can disable Publish/Unpublish up front instead of only
 * reporting "nothing to do" after the click. */
export async function getLeadFormPublishStatus(page: LeadFormPage) {
  const p = oneOf(page, PAGES, "page");
  await requireRole([...rolesForPage(p)]);
  const supabase = await getSupabaseUserClient();
  const [{ count: draftFields }, { count: draftOptions }, { count: archivedFields }, { count: archivedOptions }] = await Promise.all([
    supabase.from("lead_form_fields").select("*", { count: "exact", head: true }).eq("status", "draft").eq("page", p),
    supabase.from("lead_form_options").select("*", { count: "exact", head: true }).eq("status", "draft").eq("page", p),
    supabase.from("lead_form_fields").select("*", { count: "exact", head: true }).eq("status", "archived").eq("page", p),
    supabase.from("lead_form_options").select("*", { count: "exact", head: true }).eq("status", "archived").eq("page", p),
  ]);
  return {
    canPublish: Boolean(draftFields || draftOptions),
    canUnpublish: Boolean(archivedFields || archivedOptions),
  };
}

// ponytail: sequential writes, matches the same pattern (and the same ceiling) as calculator publish/unpublish.
//
// Each table's archive step only runs if that table actually has a draft ready
// to take the published slot. Without this guard, publishing twice in a row
// (the second time with nothing new drafted — e.g. a stray double-click, or
// hitting Publish again after a page reload reseeded an identical draft)
// archives the live published rows and promotes zero rows to replace them,
// silently wiping every option. Learned the hard way: this happened for real
// and left every field showing "No options yet".
export async function publishLeadFormOptions(page: LeadFormPage, _prevState: PublishState, _formData: FormData): Promise<PublishState> {
  const p = oneOf(page, PAGES, "page");
  const profile = await requireRole([...rolesForPage(p)]);
  const supabase = await getSupabaseUserClient();
  const now = new Date().toISOString();
  let published = false;

  const { count: draftFieldsCount } = await supabase.from("lead_form_fields").select("*", { count: "exact", head: true }).eq("status", "draft").eq("page", p);
  if (draftFieldsCount) {
    await supabase.from("lead_form_fields").update({ status: "archived" }).eq("status", "published").eq("page", p);
    await supabase.from("lead_form_fields").update({ status: "published", published_at: now, published_by: profile.id }).eq("status", "draft").eq("page", p);
    published = true;
  }

  const { count: draftOptionsCount } = await supabase.from("lead_form_options").select("*", { count: "exact", head: true }).eq("status", "draft").eq("page", p);
  if (draftOptionsCount) {
    await supabase.from("lead_form_options").update({ status: "archived" }).eq("status", "published").eq("page", p);
    await supabase.from("lead_form_options").update({ status: "published", published_at: now, published_by: profile.id }).eq("status", "draft").eq("page", p);
    published = true;
  }

  revalidatePath("/admin/leads-form");
  revalidatePath("/");

  return published
    ? { status: "success", message: "Published — the public form now shows this draft." }
    : { status: "empty", message: "Nothing to publish — the draft has no changes." };
}

export async function unpublishLeadFormOptions(page: LeadFormPage, _prevState: PublishState, _formData: FormData): Promise<PublishState> {
  const p = oneOf(page, PAGES, "page");
  await requireRole([...rolesForPage(p)]);
  const supabase = await getSupabaseUserClient();
  let reverted = false;

  const { data: lastArchivedFields } = await supabase
    .from("lead_form_fields").select("published_at").eq("status", "archived").eq("page", p).order("published_at", { ascending: false }).limit(1).maybeSingle();
  if (lastArchivedFields?.published_at) {
    await supabase.from("lead_form_fields").update({ status: "archived" }).eq("status", "published").eq("page", p);
    await supabase.from("lead_form_fields").update({ status: "published" }).eq("published_at", lastArchivedFields.published_at).eq("page", p).eq("status", "archived");
    reverted = true;
  }

  const { data: lastArchived } = await supabase
    .from("lead_form_options").select("published_at").eq("status", "archived").eq("page", p).order("published_at", { ascending: false }).limit(1).maybeSingle();
  if (lastArchived?.published_at) {
    await supabase.from("lead_form_options").update({ status: "archived" }).eq("status", "published").eq("page", p);
    await supabase.from("lead_form_options").update({ status: "published" }).eq("published_at", lastArchived.published_at).eq("page", p).eq("status", "archived");
    reverted = true;
  }

  revalidatePath("/admin/leads-form");
  revalidatePath("/");

  return reverted
    ? { status: "success", message: "Reverted to the previous published version." }
    : { status: "empty", message: "Nothing to revert to — no earlier published version was found." };
}

/** Discards in-progress draft edits (fields + options) for one page, resetting
 * that page's draft back to match what it currently has published. */
export async function discardLeadFormDraft(page: LeadFormPage) {
  const p = oneOf(page, PAGES, "page");
  await requireRole([...rolesForPage(p)]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("lead_form_options").delete().eq("status", "draft").eq("page", p);
  await supabase.from("lead_form_fields").delete().eq("status", "draft").eq("page", p);
  await ensureLeadFormDraftSeeded(p);
  await ensureLeadFormFieldsDraftSeeded(p);
  revalidatePath("/admin/leads-form");
}
