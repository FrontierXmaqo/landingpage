// Plain module, not the "use server" one: a Server Actions file may only
// export async functions, so shared constants live here.
export const STATUSES = ["new", "contacted", "qualified", "converted"] as const;
export type EnquiryStatus = (typeof STATUSES)[number];
