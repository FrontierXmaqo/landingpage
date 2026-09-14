"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { createFirstAdmin, type FormState } from "./actions";

const initialState: FormState = { status: "idle" };

export default function LoginForm({ firstRun }: { firstRun: boolean }) {
  const router = useRouter();
  const [signInError, setSignInError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [state, formAction] = useActionState(createFirstAdmin, initialState);

  async function handleSignIn(formData: FormData) {
    setPending(true);
    setSignInError(null);
    const { error } = await getSupabaseBrowserClient().auth.signInWithPassword({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    });
    setPending(false);
    if (error) {
      setSignInError("Incorrect email or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  const fieldClass =
    "w-full rounded-lg border border-base-line bg-base-bg px-3 py-2.5 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green";

  if (firstRun) {
    if (state.status === "success") {
      return (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-brand-green-ink">Admin account created.</p>
          <a href="/admin/login" className="block w-full rounded-lg bg-brand-green px-4 py-2.5 text-center text-sm font-semibold text-white">
            Sign in
          </a>
        </div>
      );
    }
    return (
      <form action={formAction} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-base-ink">
          Full name
          <input name="full_name" required className={`mt-1.5 ${fieldClass}`} />
        </label>
        <label className="block text-sm font-medium text-base-ink">
          Work email
          <input name="email" type="email" required className={`mt-1.5 ${fieldClass}`} />
        </label>
        <label className="block text-sm font-medium text-base-ink">
          Password
          <input name="password" type="password" required minLength={8} className={`mt-1.5 ${fieldClass}`} />
        </label>
        {state.status === "error" && <p className="text-sm text-status-critical">{state.message}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition-transform duration-100 active:scale-[0.98]"
        >
          Create admin account
        </button>
      </form>
    );
  }

  return (
    <form action={handleSignIn} className="mt-6 space-y-4">
      <label className="block text-sm font-medium text-base-ink">
        Work email
        <input name="email" type="email" required className={`mt-1.5 ${fieldClass}`} />
      </label>
      <label className="block text-sm font-medium text-base-ink">
        Password
        <input name="password" type="password" required className={`mt-1.5 ${fieldClass}`} />
      </label>
      {signInError && <p className="text-sm text-status-critical">{signInError}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition-transform duration-100 active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
