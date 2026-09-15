import { getCurrentProfile, getSupabaseUserClient } from "@/lib/supabase/server";
import { NAV } from "./nav";
import { NAV_ICONS } from "./navIcons";

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
    <div className="animate-fade-in-up">
      <h1 className="text-2xl font-bold text-base-ink">Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}</h1>
      <p className="mt-1.5 text-sm text-base-slate">Jump straight to a section below.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = NAV_ICONS[item.href];
          return (
            <a
              key={item.href}
              href={item.href}
              className="admin-card admin-card-hover group block p-5"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green-tint text-brand-green-ink transition-colors duration-150 group-hover:bg-brand-green group-hover:text-white">
                  {Icon && <Icon className="h-5 w-5" />}
                </span>
                {item.href === "/admin/enquiries" && leadCount !== null && (
                  <span className="rounded-full bg-brand-green-tint px-2 py-0.5 text-xs font-semibold text-brand-green-ink">{leadCount}</span>
                )}
              </div>
              <h2 className="mt-3 text-sm font-semibold text-base-ink group-hover:text-brand-green-ink">{item.label}</h2>
              <p className="mt-1 text-xs text-base-slate">{item.description}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
