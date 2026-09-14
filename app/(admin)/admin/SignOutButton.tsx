"use client";

import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await getSupabaseBrowserClient().auth.signOut();
        router.push("/admin/login");
        router.refresh();
      }}
      className="w-full rounded-lg border border-base-line px-3 py-2 text-left text-sm font-medium text-base-slate transition-colors duration-150 hover:border-status-critical hover:text-status-critical"
    >
      Sign out
    </button>
  );
}
