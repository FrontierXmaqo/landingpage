// Plain module, not the "use server" one: a Server Actions file may only
// export async functions, so shared constants live here.
export const STATUSES = ["new", "contacted", "qualified", "converted"] as const;
export type EnquiryStatus = (typeof STATUSES)[number];

export const STATUS_STYLE: Record<string, string> = {
  new: "bg-status-info/10 text-status-info",
  contacted: "bg-status-warn-bg text-status-warn",
  qualified: "bg-brand-green-tint text-brand-green-ink",
  converted: "bg-brand-green text-white",
};
