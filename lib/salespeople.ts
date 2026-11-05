/**
 * Salespeople a residential visitor can name under "Were you referred by any
 * salesman?". Same list, names and codes as the get.maqosolar.com form
 * (malaysia/ref/salespeople.json there): respond.io's AI Agent assigns the
 * chat by matching the "Referred by: <name>" line word for word, and Lark gets
 * the code as ref_code. Change a name here only together with respond.io.
 */
export const SALESPEOPLE = [
  { code: "S01", name: "Muhammad Hazman" },
  { code: "S02", name: "Hugo Wong" },
  { code: "S03", name: "Stella Phan" },
  { code: "S04", name: "Jing Hong Kua" },
  { code: "S05", name: "Jeff It" },
  { code: "S06", name: "Lee Wei Yang" },
  // Test account: offered on preview/test sites only, never on get.maqo.asia.
  { code: "T00", name: "Frontierx Maqo" },
] as const;

/** The salespeople offered on this deployment (the T00 test account only off production). */
export function salespeopleFor(production: boolean) {
  return SALESPEOPLE.filter((p) => !production || p.code !== "T00");
}
