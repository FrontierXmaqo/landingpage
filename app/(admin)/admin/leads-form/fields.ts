// Plain module, not the "use server" one: a Server Actions file may only
// export async functions, so shared constants live here.
export const FIELDS = ["salutation", "state", "bill_range", "property_type", "electric_supply", "language"] as const;
export type FieldName = (typeof FIELDS)[number];
