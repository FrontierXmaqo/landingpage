import { redirect } from "next/navigation";
import { getCurrentProfile, getSupabaseServiceClient, type Role } from "@/lib/supabase/server";
import InviteForm from "./InviteForm";
import UserRow from "./UserRow";
import PendingRow from "./PendingRow";

export default async function UsersPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/admin");

  const service = getSupabaseServiceClient();
  const [{ data: profiles }, { data: authUsers }] = await Promise.all([
    service.from("profiles").select("id, full_name, role"),
    service.auth.admin.listUsers(),
  ]);

  const emailById = new Map<string, string>(authUsers.users.map((u: { id: string; email?: string }): [string, string] => [u.id, u.email ?? ""]));

  const profileIds = new Set((profiles ?? []).map((p: { id: string }) => p.id));
  const withoutRole = authUsers.users.filter((u: { id: string }) => !profileIds.has(u.id));

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-base-ink">User Management</h1>
      <p className="mt-1 text-sm text-base-slate">Add Maqo staff and assign their role — email them an invite link, or set a temporary password yourself.</p>

      <div className="mt-6"><InviteForm /></div>

      {withoutRole.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-status-critical/40 bg-base-panel">
          <div className="border-b border-base-line px-3 py-2.5">
            <p className="text-sm font-semibold text-base-ink">Needs a role</p>
            <p className="text-xs text-base-slate">
              These logins can sign in but see nothing — usually because they were added in the Supabase dashboard
              instead of here. Give them a name and role, or remove them.
            </p>
          </div>
          <table className="w-full text-left text-sm">
            <tbody>
              {withoutRole.map((u: { id: string; email?: string }) => (
                <PendingRow key={u.id} id={u.id} email={u.email ?? ""} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-base-line bg-base-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-base-line bg-base-bg text-xs uppercase text-base-slate">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {((profiles ?? []) as { id: string; full_name: string; role: Role }[]).map((p) => (
              <UserRow key={p.id} id={p.id} email={emailById.get(p.id) ?? ""} fullName={p.full_name} role={p.role} isSelf={p.id === profile.id} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
