import { redirect } from "next/navigation";
import { getCurrentProfile, getSupabaseUserClient } from "@/lib/supabase/server";
import SetPasswordForm from "./SetPasswordForm";

export default async function SetPasswordPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/login");
  const { data: { user } } = await (await getSupabaseUserClient()).auth.getUser();
  const temporary = user?.app_metadata?.must_change_password === true;

  return (
    <div className="max-w-sm">
      <h1 className="text-2xl font-semibold text-base-ink">Set your password</h1>
      <p className="mt-1 text-sm text-base-slate">
        Welcome{profile.full_name ? `, ${profile.full_name}` : ""}. {temporary
          ? "You signed in with a temporary password from an admin. Choose your own password of at least 12 characters to continue."
          : "Choose a password of at least 12 characters to finish setting up your account."}
      </p>
      <SetPasswordForm />
    </div>
  );
}
