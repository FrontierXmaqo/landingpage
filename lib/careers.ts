/** Open roles. `title` is also the value posted by the application form and checked by submitApplication. */
export const CAREER_ROLES = [
  { title: "Account & Finance Manager / Finance Controller", team: "Finance", blurb: "Lead accounting, reporting and financial controls for the MAQO group." },
  { title: "Administrative Office", team: "Corporate", blurb: "Keep the office, documents and day-to-day operations running smoothly." },
  { title: "Manager / Assistant Manager / Senior Sales Consultant, Commercial & Industrial (C&I)", team: "Sales", blurb: "Win factory, warehouse and developer clients with EPC, PPA and zero-capex solar." },
  { title: "Project Manager / Assistant Manager / Engineer", team: "Projects", blurb: "Deliver solar and BESS projects from kick-off to submissions and handover." },
  { title: "Sales Business Development Manager / Assistant Manager", team: "Sales", blurb: "Open new markets, partners and channels for MAQO's solar and storage offers." },
  { title: "Digital Growth Marketer", team: "Marketing", blurb: "Grow qualified leads through digital campaigns, content and analytics." },
  { title: "Senior Marketing Executive", team: "Marketing", blurb: "Plan and run campaigns, events and brand content across MAQO's segments." },
  { title: "Design Engineer / Solar PV Designer", team: "Engineering", blurb: "Design rooftop and ground-mount PV systems and prepare layouts and yield studies." },
  { title: "Solar Site Technician", team: "Operations", blurb: "Install and maintain solar systems on site, with quality and safety first." },
  { title: "Sales Consultant, Residential", team: "Sales", blurb: "Help homeowners choose and finance the right rooftop solar system." },
  { title: "Internship", team: "All teams", blurb: "Learn on real solar and BESS projects alongside Maqorians." },
] as const;

export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_EXTENSIONS = ["pdf", "doc", "docx"] as const;
