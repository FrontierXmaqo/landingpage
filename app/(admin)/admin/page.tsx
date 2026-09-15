import { getCurrentProfile, getSupabaseUserClient } from "@/lib/supabase/server";
import { NAV } from "./nav";

export default async function AdminHome() {
  const profile = await getCurrentProfile();
  const items = NAV.filter((item) => item.href !== "/admin" && profile && item.roles.includes(profile.role));

  let leadCount: number | null = null;
  if (profile && ["admin", "sales"].includes(profile.role)) {
    const supabase = await getSupabaseUserClient();
    const { count } = await supabase.from("atap_leads").select("*", { count: "exact", head: true });
    leadCount = count ?? 0;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-ink">Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}</h1>
      <p className="mt-1.5 text-sm text-base-slate">Jump straight to a section below.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="group rounded-xl border border-base-line bg-base-panel p-5 transition-colors duration-150 hover:border-brand-green"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-base-ink group-hover:text-brand-green-ink">{item.label}</h2>
              {item.href === "/admin/enquiries" && leadCount !== null && (
                <span className="rounded-full bg-brand-green-tint px-2 py-0.5 text-xs font-semibold text-brand-green-ink">{leadCount}</span>
              )}
            </div>
            <p className="mt-1.5 text-xs text-base-slate">{item.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
