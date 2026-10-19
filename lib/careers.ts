import type { Locale } from "@/lib/i18n";

/** Menu and footer link text for the Careers page. */
export const CAREERS_LABEL: Record<Locale, string> = { en: "Careers", cn: "加入我们", ms: "Kerjaya" };

/** Open roles. `title` is also the value posted by the application form and checked by submitApplication. */
export const CAREER_ROLES = [
  { title: "Account & Finance Manager / Finance Controller", team: "Finance", type: "Full-time" },
  { title: "Administrative Office", team: "Corporate", type: "Full-time" },
  { title: "Manager / Assistant Manager / Senior Sales Consultant, Commercial & Industrial (C&I)", team: "Sales", type: "Full-time" },
  { title: "Project Manager / Assistant Manager / Engineer", team: "Projects", type: "Full-time" },
  { title: "Sales Business Development Manager / Assistant Manager", team: "Sales", type: "Full-time" },
  { title: "Digital Growth Marketer", team: "Marketing", type: "Full-time" },
  { title: "Senior Marketing Executive", team: "Marketing", type: "Full-time" },
  { title: "Design Engineer / Solar PV Designer", team: "Engineering", type: "Full-time" },
  { title: "Solar Site Technician", team: "Operations", type: "Full-time" },
  { title: "Sales Consultant, Residential", team: "Sales", type: "Full-time" },
  { title: "Internship", team: "All teams", type: "Internship" },
] as const;

export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_EXTENSIONS = ["pdf", "doc", "docx"] as const;
