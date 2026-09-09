"use server";

import { getSupabaseServerClient } from "@/lib/supabase";

export type LeadFormState = { status: "idle" | "success" | "error"; message?: string };

export async function submitLead(_prevState: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const full_name = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const state = String(formData.get("state") || "").trim();
  const monthly_bill_range = String(formData.get("monthly_bill_range") || "").trim();
  const property_type = String(formData.get("property_type") || "").trim();

  if (!full_name || !phone) {
    return { status: "error", message: "Please fill in your name and phone number." };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("atap_leads").insert({
      full_name, phone, email: email || null, state: state || null,
      monthly_bill_range: monthly_bill_range || null, property_type: property_type || null,
      package_interest: package_interest || null, source: "atap-landing",
    });
    if (error) {
      console.error("Supabase insert error", error);
      return { status: "error", message: "Something went wrong submitting your assessment. Please WhatsApp us instead." };
    }
    return { status: "success", message: "Thanks! Our ATAP team will call you within 1 business day." };
  } catch (err) {
    console.error(err);
    return { status: "error", message: "Something went wrong submitting your assessment. Please WhatsApp us instead." };
  }
}
