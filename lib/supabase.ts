import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase env vars. URL present: ${!!supabaseUrl}, Key present: ${!!supabaseAnonKey}`
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
}