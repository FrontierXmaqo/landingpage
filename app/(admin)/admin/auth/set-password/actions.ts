"use server";

import { redirect } from "next/navigation";
import { getSupabaseServiceClient, getSupabaseUserClient } from "@/lib/supabase/server";
import { requireRole } from "../../guard";

export type SetPasswordState = { status: "idle" | "error"; message?: string };

const MIN_PASSWORD_LENGTH = 12;

/**
 * Sets the signed-in user's password — the last step of accepting a staff
 * invite, or the forced first step for an account an admin created with a
 * temporary password.
 */
export async function setPassword(_prev: SetPasswordState, formData: FormData): Promise<SetPasswordState> {
  const profile = await requireRole(["admin", "marketing", "sales_resi", "sales_ci"]);

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { status: "error", message: `Please choose a password of at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (password.length > 200) {
    return { status: "error", message: "That password is too long." };
  }
  if (password !== confirm) {
    return { status: "error", message: "The two passwords don't match." };
  }

  const supabase = await getSupabaseUserClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error?.code === "same_password") {
    return { status: "error", message: "Please choose a new password, not the one you were given." };
  }
  if (error) {
    console.error("setPassword: updateUser failed", error.code ?? error.message);
    return { status: "error", message: "Could not save the password. Please try again, or ask an admin for a new invite." };
  }

  // Only the service role can write app_metadata, so the flag is cleared here
  // rather than by the user's own client.
  const { error: flagError } = await getSupabaseServiceClient().auth.admin.updateUserById(profile.id, {
    app_metadata: { must_change_password: false },
  });
  if (flagError) {
    console.error("setPassword: could not clear must_change_password", flagError.code ?? flagError.message);
    return { status: "error", message: "Your password was saved, but we couldn't finish setup. Please try again." };
  }

  redirect("/admin");
}
