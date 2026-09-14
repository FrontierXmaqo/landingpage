import { isFirstRunSetup } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const firstRun = await isFirstRunSetup();
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-bg px-4">
      <div className="w-full max-w-sm rounded-2xl border border-base-line bg-base-panel p-8 shadow-sm">
        <p className="text-lg font-bold text-base-ink">MAQO CMS</p>
        <p className="mt-1 text-sm text-base-slate">
          {firstRun ? "Create the first admin account to get started." : "Sign in with your Maqo account."}
        </p>
        <LoginForm firstRun={firstRun} />
      </div>
    </div>
  );
}
