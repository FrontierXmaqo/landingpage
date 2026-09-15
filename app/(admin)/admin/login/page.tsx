import { isFirstRunSetup } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const firstRun = await isFirstRunSetup();
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
        <LoginForm firstRun={firstRun} />
      </div>
    </div>
  );
}
