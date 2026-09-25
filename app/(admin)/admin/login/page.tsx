import { isFirstRunSetup } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const firstRun = await isFirstRunSetup();
  const inviteInvalid = (await searchParams).invite === "invalid";
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-bg px-4">
      <div className="admin-card animate-fade-in-up w-full max-w-sm p-8">
        <p className="flex items-center gap-2 text-lg font-bold text-base-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-green text-xs font-bold text-white">M</span>
          MAQO CMS
        </p>
        <p className="mt-1 text-sm text-base-slate">
          {firstRun ? "Create the first admin account to get started." : "Sign in with your Maqo account."}
        </p>
        {inviteInvalid && (
          <p role="alert" className="mt-4 rounded-lg border border-status-critical/40 bg-status-critical/5 px-3 py-2 text-sm text-status-critical">
            That invite link has expired or was already used. Ask an admin to send a new invite.
          </p>
        )}
        <LoginForm firstRun={firstRun} />
      </div>
    </div>
  );
}
