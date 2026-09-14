"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServiceClient, getSupabaseUserClient, type Role } from "@/lib/supabase/server";
import { requireRole } from "../guard";
import { oneOf, text, uuid } from "@/lib/validate";

const ROLES = ["admin", "marketing", "sales"] as const;

export type { Role };

export type FormState = { status: "idle" | "error" | "success"; message?: string };

export async function inviteUser(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireRole(["admin"]);

  const email = text(formData.get("email"), { max: 200 }).toLowerCase();
  const fullName = text(formData.get("full_name"), { max: 120 });
  if (!email || !fullName) {
    return { status: "error", message: "Please fill in name, email, and role." };
  }
  let role: Role;
  try {
    role = oneOf(formData.get("role"), ROLES, "role");
  } catch {
    return { status: "error", message: "Please choose a valid role." };
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
  const actor = await requireRole(["admin"]);
  const targetId = uuid(id);
  const nextRole = oneOf(role, ROLES, "role");
  // Stop an admin demoting themselves into a CMS with no admin left.
  if (targetId === actor.id && nextRole !== "admin") {
    throw new Error("You can't change your own role. Ask another admin.");
  }
  const supabase = await getSupabaseUserClient();
  await supabase.from("profiles").update({ role: nextRole, updated_at: new Date().toISOString() }).eq("id", targetId);
  revalidatePath("/admin/users");
}

export async function removeUser(id: string) {
  const actor = await requireRole(["admin"]);
  const targetId = uuid(id);
  if (targetId === actor.id) throw new Error("You can't remove your own account.");
  const service = getSupabaseServiceClient();
  await service.auth.admin.deleteUser(targetId); // cascades to profiles via FK on delete cascade
  revalidatePath("/admin/users");
}
