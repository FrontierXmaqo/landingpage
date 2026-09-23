/**
 * Proves, to the thank-you page's proxy check, that this browser was just
 * handed a "success" by submitLead's server action a few minutes ago — not a
 * bookmark, a shared link, a crawler, or a refresh. Signed (not just
 * base64'd) so a visitor can't forge one by hand, and short-lived so a leaked
 * cookie stops working almost immediately.
 */
const LEAD_TOKEN_TTL_MS = 10 * 60 * 1000;

const ENCODER = new TextEncoder();

async function getKey() {
  const secret = process.env.LEAD_TOKEN_SECRET;
  if (!secret) throw new Error("LEAD_TOKEN_SECRET is not set");
  return crypto.subtle.importKey("raw", ENCODER.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function signLeadToken(): Promise<string> {
  const exp = String(Date.now() + LEAD_TOKEN_TTL_MS);
  const key = await getKey();
  const signature = await crypto.subtle.sign("HMAC", key, ENCODER.encode(exp));
  return `${exp}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifyLeadToken(token: string): Promise<boolean> {
  const [exp, signature] = token.split(".");
  if (!exp || !signature || !Number.isFinite(Number(exp)) || Number(exp) < Date.now()) return false;
  try {
    const key = await getKey();
    return await crypto.subtle.verify("HMAC", key, fromBase64Url(signature), ENCODER.encode(exp));
  } catch {
    return false;
  }
}

/** Where each funnel's form redirects on success, and where a rejected visitor gets sent instead. */
export const THANK_YOU_FUNNELS = {
  main: { thankYouPath: "/thank-you", landingPath: "" },
  ev: { thankYouPath: "/ev/thank-you", landingPath: "/ev" },
  ci: { thankYouPath: "/commercial-and-industrial/thank-you", landingPath: "/commercial-and-industrial" },
} as const;

// ponytail: assert-based self-check, run with `node lib/leadToken.ts`
if (process.argv[1]?.replace(/\\/g, "/").endsWith("lib/leadToken.ts")) {
  const assert = (cond: boolean, msg: string) => {
    if (!cond) throw new Error("FAIL: " + msg);
  };

  process.env.LEAD_TOKEN_SECRET ??= "test-secret-for-self-check";

  const token = await signLeadToken();
  assert(await verifyLeadToken(token), "valid token should verify");
  assert(!(await verifyLeadToken(token + "x")), "tampered token should fail");
  assert(!(await verifyLeadToken("not-a-token")), "garbage token should fail");

  const expiredToken = `${Date.now() - 1000}.${token.split(".")[1]}`;
  assert(!(await verifyLeadToken(expiredToken)), "expired token should fail");

  console.log("lib/leadToken.ts self-check passed");
}
