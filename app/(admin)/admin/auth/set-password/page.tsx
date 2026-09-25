import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import SetPasswordForm from "./SetPasswordForm";

export default async function SetPasswordPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/login");

  return (
    <div className="max-w-sm">
      <h1 className="text-2xl font-semibold text-base-ink">Set your password</h1>
      <p className="mt-1 text-sm text-base-slate">
        Welcome{profile.full_name ? `, ${profile.full_name}` : ""}. Choose a password of at least 12 characters to finish
        setting up your account.
      </p>
      <SetPasswordForm />
    </div>
  );
}
