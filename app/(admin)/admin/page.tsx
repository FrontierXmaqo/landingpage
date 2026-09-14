import { getCurrentProfile } from "@/lib/supabase/server";

export default async function AdminHome() {
  const profile = await getCurrentProfile();
  return (
    <div>
      <h1 className="text-2xl font-bold text-base-ink">Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}</h1>
      <p className="mt-1.5 text-sm text-base-slate">Use the sidebar to manage the sections available to your role.</p>
    </div>
  );
}
