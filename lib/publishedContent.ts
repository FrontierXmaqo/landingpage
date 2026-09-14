import { createClient } from "@supabase/supabase-js";
import { SOLAR_CALC_CONFIG, SOLAR_PACKAGES_HYBRID, SOLAR_PACKAGES_NEO, type SolarPackage } from "@/lib/content";
import type { LeadFormOptionLists } from "@/app/(main)/components/LeadForm";

// Public, RLS-protected anon client — server-side only, reads `status='published'` rows.
function getAnonClient() {
  return createClient(
    "https://yhpsidiipdassknsggcz.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    { auth: { persistSession: false } }
  );
}

function toPackage(row: Record<string, unknown>): SolarPackage {
  return {
    kwp: Number(row.kwp),
    panels: Number(row.panels),
    inverterModel: String(row.inverter_model),
    kWac: Number(row.kwac),
    dcAcRatio: Number(row.dc_ac_ratio),
    monthlyGenerationKwh: Number(row.monthly_generation_kwh),
    standardSellingPrice: Number(row.standard_selling_price),
    monthlySavingsBelowThreshold: Number(row.monthly_savings_below_threshold),
    monthlySavingsAboveThreshold: Number(row.monthly_savings_above_threshold),
    paybackYearsBelowThreshold: Number(row.payback_years_below_threshold),
    paybackYearsAboveThreshold: Number(row.payback_years_above_threshold),
  };
}

/** Fetches the live (published) calculator config + packages, falling back to the
 * hardcoded defaults in lib/content.ts if Supabase is unreachable or empty —
 * the public site must never break because of a CMS edit gone wrong. */
export async function getPublishedCalculatorData() {
  try {
    const supabase = getAnonClient();
    const [configRes, packagesRes] = await Promise.all([
      supabase.from("calculator_config").select("*").eq("status", "published").maybeSingle(),
      supabase.from("calculator_packages").select("*").eq("status", "published").order("sort_order"),
    ]);

    const config = configRes.data
      ? {
          tariffTierThresholdKwh: Number(configRes.data.tariff_tier_threshold_kwh),
          tariffBelowThresholdPerKwh: Number(configRes.data.tariff_below_threshold_per_kwh),
          tariffAboveThresholdPerKwh: Number(configRes.data.tariff_above_threshold_per_kwh),
          suriaRebatePerKwac: Number(configRes.data.suria_rebate_per_kwac),
          suriaRebateCap: Number(configRes.data.suria_rebate_cap),
          maqoAnniversaryRebateFlat: Number(configRes.data.anniversary_rebate_flat),
          maqoAnniversaryRebateValidUntil: String(configRes.data.anniversary_rebate_valid_until ?? ""),
        }
      : SOLAR_CALC_CONFIG;

    const rows = packagesRes.data ?? [];
    const hybrid = rows.filter((r) => r.storage_type === "hybrid").map(toPackage);
    const neo = rows.filter((r) => r.storage_type === "neo").map(toPackage);

    return {
      config,
      packagesHybrid: hybrid.length ? hybrid : SOLAR_PACKAGES_HYBRID,
      packagesNeo: neo.length ? neo : SOLAR_PACKAGES_NEO,
    };
  } catch {
    return { config: SOLAR_CALC_CONFIG, packagesHybrid: SOLAR_PACKAGES_HYBRID, packagesNeo: SOLAR_PACKAGES_NEO };
  }
}

/** Fetches published lead-form dropdown options, grouped by field, falling back
 * to the hardcoded lists in lib/leadFormOptions.ts per field when empty. */
export async function getPublishedLeadFormOptions(): Promise<LeadFormOptionLists> {
  try {
    const supabase = getAnonClient();
    const { data } = await supabase
      .from("lead_form_options")
      .select("field_name, value")
      .eq("status", "published")
      .order("sort_order");

    const byField = (field: string) => (data ?? []).filter((r) => r.field_name === field).map((r) => r.value as string);

    return {
      salutations: byField("salutation"),
      states: byField("state"),
      billRanges: byField("bill_range"),
      propertyTypes: byField("property_type"),
      electricSupply: byField("electric_supply"),
      languages: byField("language"),
    };
  } catch {
    return {};
  }
}
