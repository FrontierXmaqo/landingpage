import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import { ensureDraftSeeded, publishCalculator, unpublishCalculator } from "./actions";
import ConfigForm from "./ConfigForm";
import PackageRow from "./PackageRow";
import { redirect } from "next/navigation";

export default async function CalculatorSettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing"].includes(profile.role)) redirect("/admin");

  await ensureDraftSeeded();

  const supabase = await getSupabaseUserClient();
  const [{ data: draftConfig }, { data: publishedConfig }, { data: draftPackages }] = await Promise.all([
    supabase.from("calculator_config").select("*").eq("status", "draft").maybeSingle(),
    supabase.from("calculator_config").select("published_at").eq("status", "published").maybeSingle(),
    supabase.from("calculator_packages").select("*").eq("status", "draft").order("storage_type").order("sort_order"),
  ]);

  const hybrid = (draftPackages ?? []).filter((p) => p.storage_type === "hybrid");
  const neo = (draftPackages ?? []).filter((p) => p.storage_type === "neo");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-ink">Solar Calculator Settings</h1>
          <p className="mt-1 text-sm text-base-slate">
            Edit tariffs and package pricing. Changes save as a draft — publish when ready for the public site to show them.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-base-slate">
          {publishedConfig?.published_at && (
            <span>Last published {new Date(publishedConfig.published_at).toLocaleString("en-MY")}</span>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <a
          href="/admin/calculator/preview"
          target="_blank"
          className="rounded-lg border border-base-line bg-base-panel px-4 py-2 text-sm font-medium text-base-ink transition-colors duration-150 hover:border-brand-green"
        >
          Preview draft
        </a>
        <form action={publishCalculator}>
          <button className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-transform duration-100 active:scale-[0.98]">
            Publish
          </button>
        </form>
        <form action={unpublishCalculator}>
          <button className="rounded-lg border border-status-critical px-4 py-2 text-sm font-semibold text-status-critical transition-transform duration-100 active:scale-[0.98]">
            Unpublish (revert to previous)
          </button>
        </form>
      </div>

      {draftConfig && <ConfigForm config={draftConfig} />}

      {(["hybrid", "neo"] as const).map((type) => (
        <div key={type} className="mt-8">
          <h2 className="text-lg font-semibold text-base-ink">{type === "hybrid" ? "Without Battery Storage" : "With Battery Storage"} packages</h2>
          <div className="mt-3 overflow-x-auto rounded-xl border border-base-line bg-base-panel">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-base-line bg-base-bg text-xs uppercase text-base-slate">
                <tr>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">kWp</th>
                  <th className="px-3 py-2">Panels</th>
                  <th className="px-3 py-2">Inverter</th>
                  <th className="px-3 py-2">kWac</th>
                  <th className="px-3 py-2">Price (RM)</th>
                  <th className="px-3 py-2">Savings ≤tier</th>
                  <th className="px-3 py-2">Savings &gt;tier</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {(type === "hybrid" ? hybrid : neo).map((pkg) => (
                  <PackageRow key={pkg.id} pkg={pkg} storageType={type} />
                ))}
                <PackageRow storageType={type} />
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
