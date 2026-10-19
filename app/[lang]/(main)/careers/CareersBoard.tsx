"use client";

import { useActionState, useRef, useState } from "react";
import Script from "next/script";
import { submitApplication, type ApplicationState } from "../actions/submitApplication";
import { CAREER_ROLES, RESUME_EXTENSIONS, RESUME_MAX_BYTES } from "@/lib/careers";
import type { Locale } from "@/lib/i18n";
import TermsAgree from "../components/TermsAgree";
import { FIELD, PhoneTextField, TextField } from "../components/formFields";

const initialState: ApplicationState = { status: "idle" };
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TEAMS = [...new Set(CAREER_ROLES.map((r) => r.team))];
const LABEL = "text-[13px] font-semibold uppercase tracking-wide text-base-slate";

export default function CareersBoard({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(submitApplication, initialState);
  const [position, setPosition] = useState("");
  const [fileError, setFileError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const pick = (title: string) => {
    setPosition(title);
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section id="roles" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-base-ink sm:text-4xl">Open roles</h2>
          <p className="text-base-slate">{CAREER_ROLES.length} positions · {TEAMS.length} teams · Malaysia</p>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          {TEAMS.map((team, gi) => {
            const roles = CAREER_ROLES.filter((r) => r.team === team);
            return (
              <div
                key={team}
                style={{ animationDelay: `${gi * 60}ms` }}
                className="career-card grid grid-cols-1 gap-x-10 gap-y-5 rounded-[28px] border border-base-line bg-base-panel p-6 sm:p-8 lg:grid-cols-[14rem_1fr]"
              >
                <div className="flex items-baseline gap-3 lg:flex-col lg:gap-1">
                  <h3 className="text-3xl font-extrabold leading-none tracking-tight text-brand-orange-ink">{team}</h3>
                  <span className="text-sm font-semibold text-base-slate">
                    {roles.length} {roles.length === 1 ? "role" : "roles"}
                  </span>
                </div>
                <ul className="divide-y divide-base-line border-y border-base-line">
                  {roles.map((r) => (
                    <li key={r.title} className="group flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
                      <div className="min-w-0 flex-1 basis-72">
                        <h4 className="text-lg font-bold leading-snug text-base-ink">{r.title}</h4>
                        <p className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-base-slate">
                          <span className="rounded-full bg-brand-green-tint px-2.5 py-1 text-brand-green-ink">Malaysia</span>
                          <span className="rounded-full bg-brand-orange-tint px-2.5 py-1 text-brand-orange-ink">{r.type}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => pick(r.title)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-orange-deep px-5 text-sm font-semibold text-white transition hover:brightness-95"
                      >
                        Apply
                        <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section id="apply" className="mx-auto grid max-w-6xl scroll-mt-6 grid-cols-1 gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-base-ink sm:text-5xl">Tell us about you</h2>
          <p className="mt-4 max-w-md text-base-slate">Pick the role you want, attach your resume and add a short note. Our team reviews every application.</p>
        </div>

        {state.status === "success" ? (
          <div role="status" className="rounded-[28px] border border-base-line bg-base-panel p-8">
            <h3 className="text-3xl font-extrabold text-brand-green-ink">Application received</h3>
            <p className="mt-3 text-base-slate">Thank you. Our team will review your application and contact you if there is a fit.</p>
          </div>
        ) : (
          <form
            ref={formRef}
            action={formAction}
            className="flex flex-col gap-5 rounded-[28px] border border-base-line bg-base-panel p-6 sm:p-9"
          >
            <input type="hidden" name="locale" value={locale} />
            <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            {state.status === "error" && (
              <p role="alert" className="rounded-xl bg-status-critical/10 px-4 py-3 text-sm font-medium text-status-critical">{state.message}</p>
            )}

            <TextField label="Full name *" name="full_name" required autoComplete="name" placeholder="As on your IC / passport" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <PhoneTextField label="Phone number *" locale={locale} />
              <TextField label="Email *" name="email" type="email" inputMode="email" required autoComplete="email" placeholder="you@example.com" />
            </div>

            <label className="flex flex-col gap-1.5">
              <span className={LABEL}>Position applied *</span>
              <select
                name="position"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className={`${FIELD} py-3`}
              >
                <option value="" disabled>Select a position</option>
                {CAREER_ROLES.map((r) => (
                  <option key={r.title} value={r.title}>{r.title}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={LABEL}>Message</span>
              <textarea name="message" rows={4} maxLength={2000} placeholder="Tell us about your experience, licences held, and when you can start." className={`${FIELD} py-3`} />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={LABEL}>Resume *</span>
              <input
                type="file"
                name="resume"
                required
                accept={RESUME_EXTENSIONS.map((e) => `.${e}`).join(",")}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  const bad = f && f.size > RESUME_MAX_BYTES ? "That file is larger than 5 MB." : "";
                  setFileError(bad);
                  if (bad) e.target.value = "";
                }}
                className={`${FIELD} py-2.5 file:mr-4 file:rounded-full file:border-0 file:bg-base-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white`}
              />
              <span className={`text-sm ${fileError ? "font-medium text-status-critical" : "text-base-slate"}`}>
                {fileError || "PDF, DOC or DOCX, up to 5 MB"}
              </span>
            </label>

            {TURNSTILE_SITE_KEY && (
              <>
                <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
                <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="light" />
              </>
            )}

            <TermsAgree locale={locale} className="text-sm leading-relaxed text-base-slate" linkClassName="font-semibold underline hover:text-base-ink" />

            <button
              type="submit"
              disabled={pending}
              className="mt-1 inline-flex min-h-14 items-center justify-center rounded-xl bg-brand-orange-deep px-6 text-base font-bold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? "Sending…" : "Submit application"}
            </button>
          </form>
        )}
      </section>
    </>
  );
}
