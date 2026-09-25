/**
 * Server-side validation helpers for the admin CMS.
 *
 * Hand-rolled rather than pulling in Zod on purpose: the rules here are a
 * handful of numbers and enums, and every added dependency is another
 * supply-chain surface to keep patched on a site this small.
 *
 * Server Actions are ordinary HTTP endpoints — the arguments a "use client"
 * component passes are attacker-controlled, and TypeScript types are erased at
 * runtime. Everything crossing that boundary is re-checked here.
 */

/** Longest free-text value we accept, to bound request size and DB writes. */
export const MAX_TEXT = 2000;

export class ValidationError extends Error {}

/** Trimmed string, length-capped. Throws if required and empty. */
export function text(value: unknown, { max = 200, required = false, field = "value" } = {}) {
  const out = String(value ?? "").trim().slice(0, max);
  if (required && !out) throw new ValidationError(`${field} is required.`);
  return out;
}

/** Finite, non-negative number. Rejects NaN/Infinity so a bad input can never blank out a live price. */
export function num(value: unknown, { min = 0, max = 1e9, field = "value" } = {}) {
  const n = typeof value === "number" ? value : Number(String(value ?? "").trim());
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be a number.`);
  if (n < min || n > max) throw new ValidationError(`${field} must be between ${min} and ${max}.`);
  return n;
}

/** Value must be one of `allowed`, else throws. */
export function oneOf<T extends string>(value: unknown, allowed: readonly T[], field = "value"): T {
  const v = String(value ?? "").trim();
  if (!(allowed as readonly string[]).includes(v)) throw new ValidationError(`${field} is not a valid option.`);
  return v as T;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Row ids come from the client; reject anything that isn't a real UUID. */
export function uuid(value: unknown, field = "id") {
  const v = String(value ?? "").trim();
  if (!UUID.test(v)) throw new ValidationError(`${field} is not a valid id.`);
  return v;
}
