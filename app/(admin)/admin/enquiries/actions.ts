"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import type { EnquiryStatus } from "./statuses";

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  const supabase = await getSupabaseUserClient();
  await supabase.from("atap_leads").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/enquiries");
}

export async function updateEnquiryNotes(id: string, notes: string) {
  const supabase = await getSupabaseUserClient();
  await supabase.from("atap_leads").update({ notes, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/enquiries");
}
