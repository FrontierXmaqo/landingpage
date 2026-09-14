"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { requireRole } from "../guard";
import { num, oneOf, pick, text, uuid } from "@/lib/validate";

const CALCULATOR_ROLES = ["admin", "marketing"] as const;

/**
 * Columns a package edit is allowed to touch. Everything else — status,
 * published_at, published_by, id — is owned by the publish workflow, never by
 * whatever the browser posted.
 */
const PACKAGE_FIELDS = [
  "storage_type", "sort_order", "kwp", "panels", "inverter_model", "kwac", "dc_ac_ratio",
  "monthly_generation_kwh", "standard_selling_price", "monthly_savings_below_threshold",
  "monthly_savings_above_threshold", "payback_years_below_threshold", "payback_years_above_threshold",
] as const;

const CONFIG_FIELDS = [
  "tariff_tier_threshold_kwh",
  "tariff_below_threshold_per_kwh",
  "tariff_above_threshold_per_kwh",
  "suria_rebate_per_kwac",
  "suria_rebate_cap",
  "anniversary_rebate_flat",
] as const;

/** Ensures a draft config row + draft package rows exist, cloning from the
 * published set on first edit so editing always starts from what's live. */
export async function ensureDraftSeeded() {
  await requireRole([...CALCULATOR_ROLES]);
  const supabase = await getSupabaseUserClient();

  const { data: draftConfig } = await supabase.from("calculator_config").select("id").eq("status", "draft").maybeSingle();
  if (!draftConfig) {
    const { data: published } = await supabase.from("calculator_config").select("*").eq("status", "published").maybeSingle();
    const base = published ?? {};
    await supabase.from("calculator_config").insert({ ...base, id: undefined, status: "draft", published_at: null, published_by: null });
  }

  const { data: draftPackages } = await supabase.from("calculator_packages").select("id").eq("status", "draft").limit(1);
  if (!draftPackages?.length) {
    const { data: published } = await supabase.from("calculator_packages").select("*").eq("status", "published");
    if (published?.length) {
      await supabase.from("calculator_packages").insert(
        published.map((row) => ({ ...row, id: undefined, status: "draft", published_at: null, published_by: null }))
      );
    }
  }
}

export async function saveConfigDraft(formData: FormData) {
  const profile = await requireRole([...CALCULATOR_ROLES]);
  const supabase = await getSupabaseUserClient();
  const { data: draft } = await supabase.from("calculator_config").select("id").eq("status", "draft").maybeSingle();
  if (!draft) return;

  const patch: Record<string, unknown> = { updated_by: profile.id, updated_at: new Date().toISOString() };
  // Validate before writing: a blank or junk field used to reach the DB as NaN,
  // which serialises to null and would silently wipe a live tariff.
  for (const field of CONFIG_FIELDS) patch[field] = num(formData.get(field), { field });
  patch.anniversary_rebate_valid_until = text(formData.get("anniversary_rebate_valid_until"), { max: 100 });

  await supabase.from("calculator_config").update(patch).eq("id", draft.id);
  revalidatePath("/admin/calculator");
}

export type PackageInput = {
  id?: string;
  storage_type: "hybrid" | "neo";
  sort_order: number;
  kwp: number;
  panels: number;
  inverter_model: string;
  kwac: number;
  dc_ac_ratio: number;
  monthly_generation_kwh: number;
  standard_selling_price: number;
  monthly_savings_below_threshold: number;
  monthly_savings_above_threshold: number;
  payback_years_below_threshold: number;
  payback_years_above_threshold: number;
};

export async function savePackageDraft(input: PackageInput) {
  const profile = await requireRole([...CALCULATOR_ROLES]);
  const supabase = await getSupabaseUserClient();

  // `input` arrives straight from a client component, so the PackageInput type
  // guarantees nothing at runtime. Take only known columns, then check each.
  const raw = pick<Record<string, unknown>>(input, PACKAGE_FIELDS);
  const patch: Record<string, unknown> = {
    storage_type: oneOf(raw.storage_type, ["hybrid", "neo"] as const, "storage_type"),
    inverter_model: text(raw.inverter_model, { max: 120 }),
    updated_by: profile.id,
    updated_at: new Date().toISOString(),
  };
  for (const field of PACKAGE_FIELDS) {
    if (field === "storage_type" || field === "inverter_model") continue;
    patch[field] = num(raw[field], { field });
  }

  if (input?.id) {
    // Scoped to status='draft' so a crafted id can't rewrite a published row.
    await supabase.from("calculator_packages").update(patch).eq("id", uuid(input.id)).eq("status", "draft");
  } else {
    await supabase.from("calculator_packages").insert({ ...patch, status: "draft" });
  }
  revalidatePath("/admin/calculator");
}

export async function deletePackageDraft(id: string) {
  await requireRole([...CALCULATOR_ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("calculator_packages").delete().eq("id", uuid(id)).eq("status", "draft");
  revalidatePath("/admin/calculator");
}

// ponytail: sequential writes, not one DB transaction — fine at this table size/traffic;
// move to a single Postgres function if publishes ever need to be atomic under concurrent editors.
export async function publishCalculator() {
  const profile = await requireRole([...CALCULATOR_ROLES]);
  const supabase = await getSupabaseUserClient();
  const now = new Date().toISOString();

  await supabase.from("calculator_config").update({ status: "archived" }).eq("status", "published");
  await supabase.from("calculator_config").update({ status: "published", published_at: now, published_by: profile.id }).eq("status", "draft");

  await supabase.from("calculator_packages").update({ status: "archived" }).eq("status", "published");
  await supabase.from("calculator_packages").update({ status: "published", published_at: now, published_by: profile.id }).eq("status", "draft");

  revalidatePath("/admin/calculator");
  revalidatePath("/");
}

/** Reverts to the most recently archived snapshot (the state before the last publish). */
export async function unpublishCalculator() {
  await requireRole([...CALCULATOR_ROLES]);
  const supabase = await getSupabaseUserClient();

  const { data: lastArchivedConfig } = await supabase
    .from("calculator_config").select("id").eq("status", "archived").order("published_at", { ascending: false }).limit(1).maybeSingle();
  if (lastArchivedConfig) {
    await supabase.from("calculator_config").update({ status: "archived" }).eq("status", "published");
    await supabase.from("calculator_config").update({ status: "published" }).eq("id", lastArchivedConfig.id);
  }

  const { data: lastArchivedPackages } = await supabase
    .from("calculator_packages").select("published_at").eq("status", "archived").order("published_at", { ascending: false }).limit(1).maybeSingle();
  if (lastArchivedPackages?.published_at) {
    await supabase.from("calculator_packages").update({ status: "archived" }).eq("status", "published");
    await supabase.from("calculator_packages").update({ status: "published" }).eq("published_at", lastArchivedPackages.published_at).eq("status", "archived");
  }

  revalidatePath("/admin/calculator");
  revalidatePath("/");
}
