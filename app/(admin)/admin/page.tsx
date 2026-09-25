import { getCurrentProfile, getSupabaseUserClient } from "@/lib/supabase/server";
import { NAV, NAV_CATEGORIES } from "./nav";
import { NAV_ICONS } from "./navIcons";
import { signOut } from "./login/actions";

export default async function AdminHome() {
  const profile = await getCurrentProfile();
  // Signed in, but no profile (so no role): say so instead of an empty dashboard.
  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-bg px-4">
        <div className="admin-card animate-fade-in-up w-full max-w-sm p-8">
          <h1 className="text-lg font-bold text-base-ink">Your account isn&apos;t set up yet</h1>
          <p className="mt-2 text-sm text-base-slate">
            You&apos;re signed in, but no role has been assigned to you, so there&apos;s nothing to show. Ask a CMS admin
            to give you access under User Management, then sign in again.
          </p>
          <form action={signOut} className="mt-6">
            <button className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white">Sign out</button>
          </form>
        </div>
      </div>
    );
  }

  const items = NAV.filter((item) => item.href !== "/admin" && profile && item.roles.includes(profile.role));

  let leadCount: number | null = null;
  if (profile?.role === "admin" || profile?.role === "sales_resi") {
    const supabase = await getSupabaseUserClient();
    const { count } = await supabase.from("atap_leads").select("*", { count: "exact", head: true });
    leadCount = count ?? 0;
  } else if (profile?.role === "sales_ci") {
    const supabase = await getSupabaseUserClient();
    const { count } = await supabase.from("ci_leads").select("*", { count: "exact", head: true });
    leadCount = count ?? 0;
  }

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-2xl font-bold text-base-ink">Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}</h1>
      <p className="mt-1.5 text-sm text-base-slate">Jump straight to a section below.</p>

      <div className="mt-8 space-y-8">
        {NAV_CATEGORIES.map((category) => {
          const group = items.filter((item) => item.category === category);
          if (group.length === 0) return null;
          return (
            <div key={category}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-base-slate">{category}</h2>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((item) => {
                  const Icon = NAV_ICONS[item.href];
                  return (
                    <a key={item.href} href={item.href} className="admin-card admin-card-hover group block p-5">
                      <div className="flex items-start justify-between">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green-tint text-brand-green-ink transition-colors duration-150 group-hover:bg-brand-green group-hover:text-white">
                          {Icon && <Icon className="h-5 w-5" />}
                        </span>
                        {item.href === "/admin/enquiries" && leadCount !== null && (
                          <span className="rounded-full bg-brand-green-tint px-2 py-0.5 text-xs font-semibold text-brand-green-ink">{leadCount}</span>
                        )}
                      </div>
                      <h3 className="mt-3 text-sm font-semibold text-base-ink group-hover:text-brand-green-ink">{item.label}</h3>
                      <p className="mt-1 text-xs text-base-slate">{item.description}</p>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
