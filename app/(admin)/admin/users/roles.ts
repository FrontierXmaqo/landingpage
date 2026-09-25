import type { Role } from "@/lib/supabase/server";

// Plain module, not the "use server" one: a Server Actions file may only
// export async functions, so shared constants live here.
export const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "marketing", label: "Marketing" },
  { value: "sales_resi", label: "Sales - Residential/EV" },
  { value: "sales_ci", label: "Sales - C&I" },
];
