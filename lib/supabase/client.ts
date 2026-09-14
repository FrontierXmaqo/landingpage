import { createBrowserClient } from "@supabase/ssr";

/** RLS-respecting client for use in "use client" components (admin login form, etc). */
export function getSupabaseBrowserClient() {
  return createBrowserClient(
    "https://yhpsidiipdassknsggcz.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}
