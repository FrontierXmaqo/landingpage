"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { requireRole } from "../guard";
import { oneOf, text, uuid, MAX_TEXT } from "@/lib/validate";
import { STATUSES } from "./statuses";

const ENQUIRY_ROLES = ["admin", "sales"] as const;

export async function updateEnquiryStatus(id: string, status: string) {
  await requireRole([...ENQUIRY_ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase
    .from("atap_leads")
    .update({ status: oneOf(status, STATUSES, "status"), updated_at: new Date().toISOString() })
    .eq("id", uuid(id));
  revalidatePath("/admin/enquiries");
}

export async function updateEnquiryNotes(id: string, notes: string) {
  await requireRole([...ENQUIRY_ROLES]);
  const supabase = await getSupabaseUserClient();
  // Capped so a pasted document can't become an unbounded request/row.
  await supabase
    .from("atap_leads")
    .update({ notes: text(notes, { max: MAX_TEXT }), updated_at: new Date().toISOString() })
    .eq("id", uuid(id));
  revalidatePath("/admin/enquiries");
}

/** Same as updateEnquiryStatus/updateEnquiryNotes, for C&I's own ci_leads table. */
export async function updateCiEnquiryStatus(id: string, status: string) {
  await requireRole([...ENQUIRY_ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase
    .from("ci_leads")
    .update({ status: oneOf(status, STATUSES, "status"), updated_at: new Date().toISOString() })
    .eq("id", uuid(id));
  revalidatePath("/admin/enquiries");
}

export async function updateCiEnquiryNotes(id: string, notes: string) {
  await requireRole([...ENQUIRY_ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase
    .from("ci_leads")
    .update({ notes: text(notes, { max: MAX_TEXT }), updated_at: new Date().toISOString() })
    .eq("id", uuid(id));
  revalidatePath("/admin/enquiries");
}
