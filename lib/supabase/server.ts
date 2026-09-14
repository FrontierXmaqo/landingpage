import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yhpsidiipdassknsggcz.supabase.co";

/** RLS-respecting client for the signed-in user (server components/actions). */
export async function getSupabaseUserClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // called from a Server Component with no writable cookies — middleware refreshes the session instead.
        }
      },
    },
  });
}

/**
 * Bypasses RLS — service_role key. Server-only: admin user invites, analytics
 * event writes. Never import from a "use client" file or return it to the browser.
 * Distinct from the existing `SUPABASE_KEY` used by submitLead.ts (that one
 * relies on the "anon insert" RLS policy, not service_role).
 */
export function getSupabaseServiceClient() {
  return createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY as string);
}

/** True until the first internal user has been created (login page then offers "create admin account"). */
export async function isFirstRunSetup() {
  const { count } = await getSupabaseServiceClient()
    .from("profiles")
    .select("*", { count: "exact", head: true });
  return (count ?? 0) === 0;
}

export type Role = "admin" | "marketing" | "sales";

/** Current signed-in user's profile (id, full_name, role), or null if signed out. */
export async function getCurrentProfile() {
  const supabase = await getSupabaseUserClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("id, full_name, role").eq("id", user.id).single();
  return data as { id: string; full_name: string; role: Role } | null;
}
