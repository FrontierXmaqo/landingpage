/** Open roles. `title` is also the value posted by the application form and checked by submitApplication. */
export const CAREER_ROLES = [
  { title: "Account & Finance Manager / Finance Controller", team: "Finance" },
  { title: "Administrative Office", team: "Corporate" },
  { title: "Manager / Assistant Manager / Senior Sales Consultant, Commercial & Industrial (C&I)", team: "Sales" },
  { title: "Project Manager / Assistant Manager / Engineer", team: "Projects" },
  { title: "Sales Business Development Manager / Assistant Manager", team: "Sales" },
  { title: "Digital Growth Marketer", team: "Marketing" },
  { title: "Senior Marketing Executive", team: "Marketing" },
  { title: "Design Engineer / Solar PV Designer", team: "Engineering" },
  { title: "Solar Site Technician", team: "Operations" },
  { title: "Sales Consultant, Residential", team: "Sales" },
  { title: "Internship", team: "All teams" },
] as const;

export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_EXTENSIONS = ["pdf", "doc", "docx"] as const;
