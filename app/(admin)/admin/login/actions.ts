"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseServiceClient, getSupabaseUserClient, isFirstRunSetup } from "@/lib/supabase/server";
import { checkRateLimit, LOGIN_LIMIT } from "@/lib/rateLimit";
import { text, ValidationError } from "@/lib/validate";

export type FormState = { status: "idle" | "error" | "success"; message?: string };

const MIN_PASSWORD_LENGTH = 12;

async function getClientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}

/**
 * Signs in against Supabase from the server so the session cookie can be
 * HttpOnly — the browser client that used to do this had to keep the token
 * readable by JavaScript.
 *
 * Throttled per IP *and* per email: 5 attempts per 15 minutes. The failure
 * message is deliberately identical for "no such user" and "wrong password"
 * so it can't be used to enumerate which staff emails exist.
 */
export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = text(formData.get("email"), { max: 200 }).toLowerCase();
  const password = String(formData.get("password") ?? "");

  const ip = await getClientIp();
  const byIp = checkRateLimit(`login:ip:${ip}`, LOGIN_LIMIT);
  const byEmail = email ? checkRateLimit(`login:email:${email}`, LOGIN_LIMIT) : { allowed: true };
  if (!byIp.allowed || !byEmail.allowed) {
    return { status: "error", message: "Too many sign-in attempts. Please try again in 15 minutes." };
  }

  if (!email || !password) {
    return { status: "error", message: "Please enter your email and password." };
  }

  const supabase = await getSupabaseUserClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.warn(`Failed admin sign-in for ${email} from ${ip}`);
    return { status: "error", message: "Incorrect email or password." };
  }

  console.info(`Admin sign-in succeeded for ${email} from ${ip}`);
  redirect("/admin");
}

export async function signOut() {
  const supabase = await getSupabaseUserClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/** Bootstraps the very first internal user as admin. Refuses once any profile exists. */
export async function createFirstAdmin(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isFirstRunSetup())) {
    return { status: "error", message: "An admin account already exists. Please sign in instead." };
  }

  const ip = await getClientIp();
  if (!checkRateLimit(`bootstrap:${ip}`, LOGIN_LIMIT).allowed) {
    return { status: "error", message: "Too many attempts. Please try again in 15 minutes." };
  }

  let email: string;
  let fullName: string;
  try {
    email = text(formData.get("email"), { max: 200, required: true, field: "Work email" }).toLowerCase();
    fullName = text(formData.get("full_name"), { max: 120, required: true, field: "Full name" });
  } catch (err) {
    return { status: "error", message: err instanceof ValidationError ? err.message : "Please check your details." };
  }

  const password = String(formData.get("password") ?? "");
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { status: "error", message: `Please choose a password of at least ${MIN_PASSWORD_LENGTH} characters.` };
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error || !data.user) {
    console.error("createFirstAdmin: createUser failed", error);
    return { status: "error", message: "Could not create the account." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: data.user.id, full_name: fullName, role: "admin" });
  if (profileError) {
    // Don't leave an auth user with no profile — it would be a login that reaches nothing.
    await supabase.auth.admin.deleteUser(data.user.id);
    console.error("createFirstAdmin: profile insert failed", profileError);
    return { status: "error", message: "Could not create the account." };
  }

  console.info(`First admin account created for ${email} from ${ip}`);
  return { status: "success" };
}
