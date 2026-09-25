"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { requireRole } from "../guard";
import type { PublishState } from "../publishState";
import { text, uuid, oneOf } from "@/lib/validate";

export type FaqPage = "residential" | "ev" | "atap";
const PAGES = ["residential", "ev", "atap"] as const;

/** Every FAQ page (Residential, EV, ATAP) is edited by the same sales team as
 *  the EV calculator and main/EV lead form. Admin and marketing keep every page. */
const FAQ_ROLES = ["admin", "marketing", "sales_resi"] as const;

/** Seeds a draft copy of whatever is published, for one page's FAQ list —
 *  same reasoning as the C&I editor's ensureCiDraftSeeded: one locked
 *  database call, so two overlapping loads can't both seed and duplicate
 *  the list. */
export async function ensureFaqDraftSeeded(page: FaqPage) {
  const p = oneOf(page, PAGES, "page");
  await requireRole([...FAQ_ROLES]);
  const supabase = await getSupabaseUserClient();
  const { error } = await supabase.rpc("ensure_faq_draft_seeded", { p_page: p });
  if (error) {
    throw new Error(
      `Could not prepare the ${p} FAQ draft from what is published (${error.message}). Nothing was changed - reload and try again.`
    );
  }
}

export async function addFaqItem(page: FaqPage, question: string) {
  const p = oneOf(page, PAGES, "page");
  const profile = await requireRole([...FAQ_ROLES]);
  const clean = text(question, { max: 300, required: true, field: "question" });
  await ensureFaqDraftSeeded(p);
  const supabase = await getSupabaseUserClient();
  const { count } = await supabase.from("faqs").select("*", { count: "exact", head: true }).eq("status", "draft").eq("page", p);
  await supabase.from("faqs").insert({
    status: "draft",
    page: p,
    sort_order: count ?? 0,
    question: clean,
    answer: "",
    updated_by: profile.id,
  });
  revalidatePath("/admin/faq");
}

export async function updateFaqItem(page: FaqPage, id: string, field: string, value: string) {
  const p = oneOf(page, PAGES, "page");
  const profile = await requireRole([...FAQ_ROLES]);
  const column = oneOf(field, ["question", "answer"] as const, "field");
  const clean = text(value, { max: column === "answer" ? 1200 : 300, required: column === "question", field: column });
  const supabase = await getSupabaseUserClient();
  await supabase
    .from("faqs")
    .update({ [column]: clean, updated_by: profile.id, updated_at: new Date().toISOString() })
    .eq("id", uuid(id))
    .eq("page", p)
    .eq("status", "draft");
  revalidatePath("/admin/faq");
}

export async function removeFaqItem(page: FaqPage, id: string) {
  const p = oneOf(page, PAGES, "page");
  await requireRole([...FAQ_ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("faqs").delete().eq("id", uuid(id)).eq("page", p).eq("status", "draft");
  revalidatePath("/admin/faq");
}

export async function moveFaqItem(page: FaqPage, id: string, direction: "up" | "down") {
  const p = oneOf(page, PAGES, "page");
  await requireRole([...FAQ_ROLES]);
  const rowId = uuid(id);
  const supabase = await getSupabaseUserClient();

  const { data: rows } = await supabase.from("faqs").select("id, sort_order").eq("status", "draft").eq("page", p).order("sort_order");
  if (!rows) return;
  const idx = rows.findIndex((r) => r.id === rowId);
  const swapWith = oneOf(direction, ["up", "down"] as const, "direction") === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapWith < 0 || swapWith >= rows.length) return;

  await supabase.from("faqs").update({ sort_order: rows[swapWith].sort_order }).eq("id", rows[idx].id);
  await supabase.from("faqs").update({ sort_order: rows[idx].sort_order }).eq("id", rows[swapWith].id);
  revalidatePath("/admin/faq");
}

/* --------------------------- publish workflow --------------------------- */

const COMPARED = ["question", "answer"] as const;

function signature(rows: Record<string, unknown>[] | null) {
  return JSON.stringify((rows ?? []).map((row) => COMPARED.map((f) => row[f] ?? null)));
}

export async function getFaqPublishStatus(page: FaqPage) {
  const p = oneOf(page, PAGES, "page");
  await requireRole([...FAQ_ROLES]);
  const supabase = await getSupabaseUserClient();

  const [draft, live, archived] = await Promise.all([
    supabase.from("faqs").select("*").eq("status", "draft").eq("page", p).order("sort_order"),
    supabase.from("faqs").select("*").eq("status", "published").eq("page", p).order("sort_order"),
    supabase.from("faqs").select("*", { count: "exact", head: true }).eq("status", "archived").eq("page", p),
  ]);

  return {
    canPublish: signature(draft.data) !== signature(live.data),
    canUnpublish: Boolean(archived.count),
  };
}

export async function publishFaq(page: FaqPage): Promise<PublishState> {
  const p = oneOf(page, PAGES, "page");
  const profile = await requireRole([...FAQ_ROLES]);
  const supabase = await getSupabaseUserClient();

  const { canPublish } = await getFaqPublishStatus(p);
  if (!canPublish) return { status: "empty", message: "Nothing to publish - the draft matches what is already live." };

  const { error } = await supabase.rpc("faq_publish", { p_page: p, p_user: profile.id });
  if (error) {
    return { status: "error", message: `Publishing failed: ${error.message}. Nothing was changed - reload and try again.` };
  }

  revalidatePath("/admin/faq");
  revalidatePath("/", "layout");
  return { status: "success", message: "Published - the public page now shows this draft." };
}

export async function unpublishFaq(page: FaqPage): Promise<PublishState> {
  const p = oneOf(page, PAGES, "page");
  await requireRole([...FAQ_ROLES]);
  const supabase = await getSupabaseUserClient();

  const { data: lastArchived } = await supabase
    .from("faqs")
    .select("published_at")
    .eq("status", "archived")
    .eq("page", p)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!lastArchived?.published_at) {
    return { status: "empty", message: "Nothing to revert to - no earlier published version was found." };
  }

  await supabase.from("faqs").update({ status: "archived" }).eq("status", "published").eq("page", p);
  await supabase
    .from("faqs")
    .update({ status: "published" })
    .eq("published_at", lastArchived.published_at)
    .eq("page", p)
    .eq("status", "archived");

  revalidatePath("/admin/faq");
  revalidatePath("/", "layout");
  return { status: "success", message: "Reverted to the previous published version." };
}

export async function discardFaqDraft(page: FaqPage) {
  const p = oneOf(page, PAGES, "page");
  await requireRole([...FAQ_ROLES]);
  const supabase = await getSupabaseUserClient();
  await supabase.from("faqs").delete().eq("status", "draft").eq("page", p);
  await ensureFaqDraftSeeded(p);
  revalidatePath("/admin/faq");
}
