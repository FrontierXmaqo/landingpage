"use server";

import { getSupabaseServiceClient, isFirstRunSetup } from "@/lib/supabase/server";

export type FormState = { status: "idle" | "error" | "success"; message?: string };

/** Bootstraps the very first internal user as admin. Refuses once any profile exists. */
export async function createFirstAdmin(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isFirstRunSetup())) {
    return { status: "error", message: "An admin account already exists. Please sign in instead." };
  }

  const email = String(formData.get("email") || "").trim();
  const fullName = String(formData.get("full_name") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !fullName || password.length < 8) {
    return { status: "error", message: "Please fill in your name, a work email, and a password of at least 8 characters." };
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error || !data.user) {
    return { status: "error", message: error?.message || "Could not create the account." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: data.user.id, full_name: fullName, role: "admin" });
  if (profileError) {
    return { status: "error", message: profileError.message };
  }

  return { status: "success" };
}
