import { getSupabaseUserClient } from "@/lib/supabase/server";
import SolarCalculator from "@/app/(main)/components/SolarCalculator";
import type { SolarPackage } from "@/lib/content";

export default async function CalculatorPreviewPage() {
  const supabase = await getSupabaseUserClient();
  const [{ data: config }, { data: packages }] = await Promise.all([
    supabase.from("calculator_config").select("*").eq("status", "draft").maybeSingle(),
    supabase.from("calculator_packages").select("*").eq("status", "draft").order("sort_order"),
  ]);

  if (!config) return <p className="p-8 text-sm text-base-slate">No draft yet — edit and save in Solar Calculator Settings first.</p>;

  const toPackage = (r: Record<string, unknown>): SolarPackage => ({
    kwp: Number(r.kwp), panels: Number(r.panels), inverterModel: String(r.inverter_model), kWac: Number(r.kwac),
    dcAcRatio: Number(r.dc_ac_ratio), monthlyGenerationKwh: Number(r.monthly_generation_kwh),
    standardSellingPrice: Number(r.standard_selling_price), monthlySavingsBelowThreshold: Number(r.monthly_savings_below_threshold),
    monthlySavingsAboveThreshold: Number(r.monthly_savings_above_threshold), paybackYearsBelowThreshold: Number(r.payback_years_below_threshold),
    paybackYearsAboveThreshold: Number(r.payback_years_above_threshold),
  });

  return (
    <div>
      <div className="mb-4 rounded-lg bg-brand-orange-tint px-4 py-2 text-sm text-brand-orange-ink">
        Preview only — this draft is not visible to site visitors until you Publish.
      </div>
      <SolarCalculator
        config={{
          tariffTierThresholdKwh: Number(config.tariff_tier_threshold_kwh),
          tariffBelowThresholdPerKwh: Number(config.tariff_below_threshold_per_kwh),
          tariffAboveThresholdPerKwh: Number(config.tariff_above_threshold_per_kwh),
          suriaRebatePerKwac: Number(config.suria_rebate_per_kwac),
          suriaRebateCap: Number(config.suria_rebate_cap),
          maqoAnniversaryRebateFlat: Number(config.anniversary_rebate_flat),
          maqoAnniversaryRebateValidUntil: String(config.anniversary_rebate_valid_until ?? ""),
        }}
        packagesHybrid={(packages ?? []).filter((p) => p.storage_type === "hybrid").map(toPackage)}
        packagesNeo={(packages ?? []).filter((p) => p.storage_type === "neo").map(toPackage)}
      />
    </div>
  );
}
