import type { Role } from "@/lib/supabase/server";

/** Single source of truth for the CMS's sections — used by both the sidebar
 * (layout.tsx) and the dashboard's quick-link cards (page.tsx), so the two
 * can't drift apart. */
export const NAV: { href: string; label: string; description: string; roles: Role[] }[] = [
  { href: "/admin", label: "Overview", description: "Dashboard home.", roles: ["admin", "marketing", "sales_resi", "sales_ci"] },
  { href: "/admin/residential", label: "Residential Page", description: "Brand logos, achievement stats and calculator settings on the homepage.", roles: ["admin", "marketing"] },
  { href: "/admin/faq", label: "FAQ", description: "Questions and answers across Residential, EV and C&I.", roles: ["admin", "marketing", "sales_resi", "sales_ci"] },
  { href: "/admin/commercial-industrial", label: "Commercial & Industrial Page", description: "Projects, clients and stats on the C&I landing page.", roles: ["admin", "marketing", "sales_ci"] },
  { href: "/admin/leads-form", label: "Lead Form", description: "Fields and dropdown options on the public assessment form.", roles: ["admin", "marketing", "sales_resi", "sales_ci"] },
  { href: "/admin/enquiries", label: "Customer Enquiries", description: "Incoming leads — status and notes.", roles: ["admin", "marketing", "sales_resi", "sales_ci"] },
  { href: "/admin/analytics", label: "Performance Analytics", description: "Visitors, enquiries, and conversion charts.", roles: ["admin", "marketing", "sales_resi", "sales_ci"] },
  { href: "/admin/users", label: "User Management", description: "Staff accounts and roles.", roles: ["admin"] },
];
