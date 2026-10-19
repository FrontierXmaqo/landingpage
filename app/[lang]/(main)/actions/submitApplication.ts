"use server";

import { headers } from "next/headers";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { toLeadPhone } from "@/lib/phone";
import { CAREER_ROLES, RESUME_EXTENSIONS, RESUME_MAX_BYTES } from "@/lib/careers";

export type ApplicationState = { status: "idle" | "success" | "error"; message?: string };

const EMAIL_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._%+'-]*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const RESUMES_BUCKET = "career-resumes";
// Lark Base keeps the link, so it must outlive the hiring cycle.
const RESUME_LINK_SECONDS = 60 * 60 * 24 * 365;

const ERRORS = {
  invalid: "Please fill in every required field and attach your resume (PDF, DOC or DOCX, up to 5 MB).",
  rateLimited: "Too many requests. Please try again in a minute.",
  captcha: "We couldn't verify you're human. Please try again.",
  generic: "Something went wrong sending your application. Please email us your resume instead.",
};

/** Single-line text: control/format characters removed, trimmed, capped. Newlines survive only when `multiline`. */
function clean(value: FormDataEntryValue | null, maxLength: number, multiline = false) {
  const text = String(typeof value === "string" ? value : "").replace(/\r\n/g, "\n");
  return text.replace(/[\p{Cc}\p{Cf}]/gu, (c) => (multiline && c === "\n" ? c : "")).trim().slice(0, maxLength);
}

/** A leading = + - @ would run as a formula when the Lark Base table is exported. */
const noFormula = (v: string) => (/^[=+\-@]/.test(v) ? `'${v}` : v);

async function getClientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}

export async function submitApplication(_prev: ApplicationState, formData: FormData): Promise<ApplicationState> {
  const ip = await getClientIp();
  if (!checkRateLimit(`career:${ip}`).allowed) return { status: "error", message: ERRORS.rateLimited };

  // Honeypot: real visitors never fill this hidden field.
  if (clean(formData.get("company_website"), 200)) return { status: "success" };

  const fullName = noFormula(clean(formData.get("full_name"), 120));
  const phone = toLeadPhone(clean(formData.get("phone"), 30));
  const email = clean(formData.get("email"), 200);
  const position = String(formData.get("position") ?? "");
  const message = noFormula(clean(formData.get("message"), 2000, true));
  const resume = formData.get("resume");

  const ext = resume instanceof File ? (resume.name.split(".").pop() ?? "").toLowerCase() : "";
  if (
    !fullName ||
    !phone ||
    !EMAIL_PATTERN.test(email) ||
    !CAREER_ROLES.some((r) => r.title === position) ||
    formData.get("terms_accepted") !== "yes" ||
    !(resume instanceof File) ||
    resume.size === 0 ||
    resume.size > RESUME_MAX_BYTES ||
    !(RESUME_EXTENSIONS as readonly string[]).includes(ext)
  ) {
    return { status: "error", message: ERRORS.invalid };
  }

  const host = ((await headers()).get("host") ?? "").split(":")[0];
  if (!(await verifyTurnstileToken(clean(formData.get("cf-turnstile-response"), 2000), ip, host))) {
    return { status: "error", message: ERRORS.captcha };
  }

  const webhookUrl = process.env.CAREERS_WEBHOOK_URL;
  if (!webhookUrl?.startsWith("https://")) {
    console.error("CAREERS_WEBHOOK_URL is missing or not https://; application not sent.");
    return { status: "error", message: ERRORS.generic };
  }

  // The stored name is random: the visitor's own file name never reaches the path.
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
  const storage = getSupabaseServiceClient().storage.from(RESUMES_BUCKET);
  const { error: uploadError } = await storage.upload(path, resume, { contentType: resume.type || "application/octet-stream" });
  const { data: signed } = uploadError ? { data: null } : await storage.createSignedUrl(path, RESUME_LINK_SECONDS);
  if (uploadError || !signed) {
    console.error("Resume upload failed", uploadError?.message);
    return { status: "error", message: ERRORS.generic };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        phone,
        email,
        position,
        message,
        resumeUrl: signed.signedUrl,
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`webhook responded ${res.status}`);
  } catch (err) {
    console.error("Careers webhook failed", err);
    return { status: "error", message: ERRORS.generic };
  } finally {
    clearTimeout(timeout);
  }

  return { status: "success" };
}
