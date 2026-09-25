import { createClient } from "@supabase/supabase-js";
import { SOLAR_CALC_CONFIG, SOLAR_PACKAGES_HYBRID, SOLAR_PACKAGES_NEO, EV_CALC_DEFAULTS, BRAND_LOGOS, type SolarPackage } from "@/lib/content";
import type { LeadFormOptionLists } from "@/lib/leadFormOptions";
import type { Locale } from "@/lib/i18n";

// CMS text (FAQ, achievement labels, trust-stat labels) is written in English
// only. Chinese and Malay pages skip it and show the dictionary translation,
// which is what each fetcher's `fallback` holds.
const cmsTextApplies = (locale: Locale) => locale === "en";

export type PublishedCustomField = { key: string; label: string; values: string[] };

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

export type LeadFormPage = "main" | "ev" | "ci";

/** Fetches published lead-form dropdown options for one page, grouped by field,
 * falling back to the hardcoded lists in lib/leadFormOptions.ts per field when empty. */
export async function getPublishedLeadFormOptions(page: LeadFormPage): Promise<LeadFormOptionLists> {
  try {
    const supabase = getAnonClient();
    const { data } = await supabase
      .from("lead_form_options")
      .select("field_name, value")
      .eq("status", "published")
      .eq("page", page)
      .order("sort_order");

    const byField = (field: string) => (data ?? []).filter((r) => r.field_name === field).map((r) => r.value as string);

    return {
      salutations: byField("salutation"),
      states: byField("state"),
      billRanges: byField("bill_range"),
      propertyTypes: byField("property_type"),
      electricSupply: byField("electric_supply"),
      languages: byField("language"),
      roleInOrganization: byField("role_in_organization"),
    };
  } catch {
    return {};
  }
}

/** Fetches the live (published) EV landing page calculator config, falling back to
 * EV_CALC_DEFAULTS if Supabase is unreachable or empty — same safety net as
 * getPublishedCalculatorData(). */
export async function getPublishedEvCalculatorConfig() {
  try {
    const supabase = getAnonClient();
    const { data } = await supabase.from("ev_calculator_config").select("*").eq("status", "published").maybeSingle();
    if (!data) return EV_CALC_DEFAULTS;

    return {
      ratePerKwh: Number(data.rate_per_kwh),
      avgKwhPerKwpMonth: Number(data.avg_kwh_per_kwp_month),
      referenceSystemKwp: Number(data.reference_system_kwp),
      kwpPerPanel: Number(data.kwp_per_panel),
      minSystemKwp: Number(data.min_system_kwp),
      minMonthlyBill: Number(data.min_monthly_bill),
      offsetDayPercent: Number(data.offset_day_percent),
      offsetNightPercent: Number(data.offset_night_percent),
      offsetMixedPercent: Number(data.offset_mixed_percent),
    };
  } catch {
    return EV_CALC_DEFAULTS;
  }
}

/** Fetches published *custom* lead-form fields for one page (anything beyond the
 * 6 core fields), each with its published option values attached. Empty array on
 * failure — the public form simply renders none of them, core fields are unaffected. */
export async function getPublishedLeadFormFields(page: LeadFormPage): Promise<PublishedCustomField[]> {
  try {
    const supabase = getAnonClient();
    const [{ data: fields }, { data: options }] = await Promise.all([
      supabase.from("lead_form_fields").select("field_key, label, sort_order").eq("status", "published").eq("page", page).eq("is_core", false).order("sort_order"),
      supabase.from("lead_form_options").select("field_name, value, sort_order").eq("status", "published").eq("page", page).order("sort_order"),
    ]);

    return (fields ?? []).map((f) => ({
      key: f.field_key as string,
      label: f.label as string,
      values: (options ?? []).filter((o) => o.field_name === f.field_key).map((o) => o.value as string),
    }));
  } catch {
    return [];
  }
}

export type PublishedCiProject = {
  tag: string;
  capacity: string;
  client: string;
  panels?: string;
  image?: string;
  imageAlt: string;
  summary?: string;
};

/** A roster tile: the logo when there is one, the name otherwise (and as its
 *  alt text either way). */
export type PublishedCiClient = { name: string; logo?: string };

export type PublishedCiContent = {
  projects: PublishedCiProject[];
  clients: PublishedCiClient[];
  trustStats: { value: string; label: string }[];
};

/**
 * Fetches the published Commercial & Industrial page content — project cards,
 * client roster and trust stats.
 *
 * Each list falls back independently to the hardcoded content in the page's
 * own content.ts: an empty table, a half-finished publish or an unreachable
 * Supabase leaves that section showing what it shows today rather than
 * collapsing to nothing. Same safety net as the calculator and lead form.
 */
export async function getPublishedCiContent(fallback: PublishedCiContent, locale: Locale): Promise<PublishedCiContent> {
  try {
    const supabase = getAnonClient();
    const [projectsRes, clientsRes, statsRes] = await Promise.all([
      supabase.from("ci_projects").select("*").eq("status", "published").order("sort_order"),
      supabase.from("ci_clients").select("name, logo_url").eq("status", "published").order("sort_order"),
      supabase.from("ci_trust_stats").select("value, label").eq("status", "published").order("sort_order"),
    ]);

    const projects: PublishedCiProject[] = (projectsRes.data ?? []).map((row) => ({
      tag: String(row.tag),
      capacity: String(row.capacity),
      client: String(row.client),
      panels: row.panels ? String(row.panels) : undefined,
      image: row.image_url ? String(row.image_url) : undefined,
      imageAlt: String(row.image_alt ?? ""),
      summary: row.summary ? String(row.summary) : undefined,
    }));

    const clients: PublishedCiClient[] = (clientsRes.data ?? []).map((r) => ({
      name: String(r.name),
      logo: r.logo_url ? String(r.logo_url) : undefined,
    }));
    const trustStats = (statsRes.data ?? []).map((r) => ({ value: String(r.value), label: String(r.label) }));

    return {
      projects: projects.length ? projects : fallback.projects,
      clients: clients.length ? clients : fallback.clients,
      trustStats: trustStats.length && cmsTextApplies(locale) ? trustStats : fallback.trustStats,
    };
  } catch {
    return fallback;
  }
}

export type PublishedBrandLogo = { name: string; logo?: string };

/** Fetches the published brand-logo strip (Home's "Installed with brands
 *  homeowners trust"), falling back to the hardcoded BRAND_LOGOS in
 *  lib/content.ts — same safety net as getPublishedCiContent's client roster. */
export async function getPublishedBrandLogos(): Promise<PublishedBrandLogo[]> {
  try {
    const supabase = getAnonClient();
    const { data } = await supabase.from("brand_logos").select("name, logo_url").eq("status", "published").order("sort_order");

    const brands: PublishedBrandLogo[] = (data ?? []).map((r) => ({
      name: String(r.name),
      logo: r.logo_url ? String(r.logo_url) : undefined,
    }));

    return brands.length ? brands : BRAND_LOGOS;
  } catch {
    return BRAND_LOGOS;
  }
}

export type PublishedAchievement = { value: string; label: string };

/** Fetches the homepage's published achievement figures, falling back to
 *  whatever `fallback` the caller passes (the dictionary's hardcoded items)
 *  if Supabase is unreachable or the table is empty. */
export async function getPublishedAchievements(fallback: PublishedAchievement[], locale: Locale): Promise<PublishedAchievement[]> {
  if (!cmsTextApplies(locale)) return fallback;
  try {
    const supabase = getAnonClient();
    const { data } = await supabase.from("home_achievements").select("value, label").eq("status", "published").order("sort_order");
    const items = (data ?? []).map((r) => ({ value: String(r.value), label: String(r.label) }));
    return items.length ? items : fallback;
  } catch {
    return fallback;
  }
}

export type FaqPage = "residential" | "ev" | "atap";
export type PublishedFaqItem = { q: string; a: string };

/** Fetches a page's published FAQ list, falling back to whatever `fallback`
 *  the caller passes. Each page (Home/residential, EV, ATAP) publishes
 *  independently, so this is always scoped to one `page` at a time. */
export async function getPublishedFaq(page: FaqPage, fallback: PublishedFaqItem[], locale: Locale): Promise<PublishedFaqItem[]> {
  if (!cmsTextApplies(locale)) return fallback;
  try {
    const supabase = getAnonClient();
    const { data } = await supabase
      .from("faqs")
      .select("question, answer")
      .eq("status", "published")
      .eq("page", page)
      .order("sort_order");
    const items = (data ?? []).map((r) => ({ q: String(r.question), a: String(r.answer) }));
    return items.length ? items : fallback;
  } catch {
    return fallback;
  }
}
