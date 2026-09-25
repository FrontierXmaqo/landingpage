"use server";

import { redirect } from "next/navigation";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { requireRole } from "../../guard";

export type SetPasswordState = { status: "idle" | "error"; message?: string };

const MIN_PASSWORD_LENGTH = 12;

/** Sets the signed-in user's password — the last step of accepting a staff invite. */
export async function setPassword(_prev: SetPasswordState, formData: FormData): Promise<SetPasswordState> {
  await requireRole(["admin", "marketing", "sales_resi", "sales_ci"]);

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
  if (error) {
    console.error("setPassword: updateUser failed", error.code ?? error.message);
    return { status: "error", message: "Could not save the password. Please try again, or ask an admin for a new invite." };
  }

  redirect("/admin");
}
