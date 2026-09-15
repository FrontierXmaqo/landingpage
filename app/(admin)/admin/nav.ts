import type { Role } from "@/lib/supabase/server";

/** Single source of truth for the CMS's sections — used by both the sidebar
 * (layout.tsx) and the dashboard's quick-link cards (page.tsx), so the two
 * can't drift apart. */
export const NAV: { href: string; label: string; description: string; roles: Role[] }[] = [
  { href: "/admin", label: "Overview", description: "Dashboard home.", roles: ["admin", "marketing", "sales"] },
  { href: "/admin/calculator", label: "Solar Calculator Settings", description: "Tariffs and package pricing for the main site's calculator.", roles: ["admin", "marketing"] },
  { href: "/admin/calculator-ev", label: "EV Calculator Settings", description: "The formula behind the /ev landing page's calculator.", roles: ["admin", "marketing"] },
  { href: "/admin/leads-form", label: "Lead Form", description: "Fields and dropdown options on the public assessment form.", roles: ["admin", "marketing"] },
  { href: "/admin/enquiries", label: "Customer Enquiries", description: "Incoming leads — status and notes.", roles: ["admin", "sales"] },
  { href: "/admin/analytics", label: "Performance Analytics", description: "Visitors, enquiries, and conversion charts.", roles: ["admin", "marketing", "sales"] },
  { href: "/admin/users", label: "User Management", description: "Staff accounts and roles.", roles: ["admin"] },
];
