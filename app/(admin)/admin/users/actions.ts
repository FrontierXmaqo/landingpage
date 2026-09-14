"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile, getSupabaseServiceClient, getSupabaseUserClient, type Role } from "@/lib/supabase/server";

export type { Role };

export type FormState = { status: "idle" | "error" | "success"; message?: string };

async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") throw new Error("Admin access required.");
}

export async function inviteUser(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const email = String(formData.get("email") || "").trim();
  const fullName = String(formData.get("full_name") || "").trim();
  const role = String(formData.get("role") || "") as Role;
  if (!email || !fullName || !["admin", "marketing", "sales"].includes(role)) {
    return { status: "error", message: "Please fill in name, email, and role." };
  }

  const service = getSupabaseServiceClient();
  const { data, error } = await service.auth.admin.inviteUserByEmail(email);
  if (error || !data.user) {
    return { status: "error", message: error?.message || "Could not send the invite." };
  }

  const { error: profileError } = await service.from("profiles").insert({ id: data.user.id, full_name: fullName, role });
  if (profileError) return { status: "error", message: profileError.message };

  revalidatePath("/admin/users");
  return { status: "success", message: `Invite sent to ${email}.` };
}

export async function updateUserRole(id: string, role: Role) {
  await requireAdmin();
  const supabase = await getSupabaseUserClient();
  await supabase.from("profiles").update({ role, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/users");
}

export async function removeUser(id: string) {
  await requireAdmin();
  const service = getSupabaseServiceClient();
  await service.auth.admin.deleteUser(id); // cascades to profiles via FK on delete cascade
  revalidatePath("/admin/users");
}
