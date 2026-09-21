import type { Role } from "@/lib/supabase/server";

/** Fixed display order for the sidebar and dashboard's category headers —
 * both group NAV by this, so a new category only needs adding here. */
export const NAV_CATEGORIES = ["Home", "Site Content", "Forms & FAQ", "Leads & Analytics", "Administration"] as const;
export type NavCategory = (typeof NAV_CATEGORIES)[number];

/** Single source of truth for the CMS's sections — used by both the sidebar
 * (layout.tsx) and the dashboard's quick-link cards (page.tsx), so the two
 * can't drift apart. */
export const NAV: { href: string; label: string; description: string; category: NavCategory; roles: Role[] }[] = [
  { href: "/admin", label: "Overview", description: "Dashboard home.", category: "Home", roles: ["admin", "marketing", "sales_resi", "sales_ci"] },
  { href: "/admin/residential", label: "Residential Page", description: "Brand logos, achievement stats and calculator settings on the homepage.", category: "Site Content", roles: ["admin", "marketing"] },
  { href: "/admin/commercial-industrial", label: "Commercial & Industrial Page", description: "Projects, clients and stats on the C&I landing page.", category: "Site Content", roles: ["admin", "marketing", "sales_ci"] },
  { href: "/admin/leads-form", label: "Lead Form", description: "Fields and dropdown options on the public assessment form.", category: "Forms & FAQ", roles: ["admin", "marketing", "sales_resi", "sales_ci"] },
  { href: "/admin/faq", label: "FAQ", description: "Questions and answers across Residential, EV and C&I.", category: "Forms & FAQ", roles: ["admin", "marketing", "sales_resi", "sales_ci"] },
  { href: "/admin/enquiries", label: "Customer Enquiries", description: "Incoming leads — status and notes.", category: "Leads & Analytics", roles: ["admin", "marketing", "sales_resi", "sales_ci"] },
  { href: "/admin/analytics", label: "Performance Analytics", description: "Visitors, enquiries, and conversion charts.", category: "Leads & Analytics", roles: ["admin", "marketing", "sales_resi", "sales_ci"] },
  { href: "/admin/users", label: "User Management", description: "Staff accounts and roles.", category: "Administration", roles: ["admin"] },
];
