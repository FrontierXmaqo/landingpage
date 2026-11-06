/**
 * The residential sales team, for the lead form's "Were you referred by any salesman?" question.
 * The name goes into the WhatsApp message as "Referred by: <name>", and respond.io's AI Agent
 * assigns the chat by matching it exactly, so a name here must equal the respond.io user's name.
 * The code is what Lark stores as Ref Code. T00 is the test account.
 */
export const SALESPEOPLE = [
  { code: "S01", name: "Muhammad Hazman" },
  { code: "S02", name: "Hugo Wong" },
  { code: "S03", name: "Stella Phan" },
  { code: "S04", name: "Jing Hong Kua" },
  { code: "S05", name: "Jeff It" },
  { code: "S06", name: "Lee Wei Yang" },
  { code: "T00", name: "Frontierx Maqo" },
] as const;

export function findSalesperson(name: string) {
  return SALESPEOPLE.find((p) => p.name === name);
}
