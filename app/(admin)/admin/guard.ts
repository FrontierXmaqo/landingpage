import { getCurrentProfile, type Role } from "@/lib/supabase/server";

/**
 * Server-side authorization for Server Actions.
 *
 * The page components already redirect on role, and RLS is the final backstop
 * at the database — but a Server Action is its own HTTP endpoint that any
 * signed-in user can invoke directly, so neither of those is a substitute for
 * checking here. Throws rather than returning, so a caller that forgets to
 * handle it still fails closed.
 */
export async function requireRole(allowed: Role[]) {
  const profile = await getCurrentProfile();
  if (!profile || !allowed.includes(profile.role)) {
    throw new Error("You don't have permission to do that.");
  }
  return profile;
}
