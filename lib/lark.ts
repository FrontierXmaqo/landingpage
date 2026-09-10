// lib/lark.ts
// Mirrors a lead into Lark Bitable using app credentials (no personal token needed).
//
// Requires these Vercel env vars:
//   LARK_APP_ID
//   LARK_APP_SECRET
//   LARK_BASE_APP_TOKEN
//   LARK_TABLE_ID

let cachedToken: string | null = null;
let tokenExpiresAt = 0; // epoch ms

async function getTenantAccessToken(): Promise<string> {
  // Reuse the token while it's still valid (refresh 5 min early to be safe)
  if (cachedToken && Date.now() < tokenExpiresAt - 5 * 60 * 1000) {
    return cachedToken;
  }

  const res = await fetch(
    "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_id: process.env.LARK_APP_ID,
        app_secret: process.env.LARK_APP_SECRET,
      }),
    }
  );

  const data = await res.json();

  if (data.code !== 0) {
    throw new Error(`Lark auth failed: ${data.msg}`);
  }

  const token: string = data.tenant_access_token;
  cachedToken = token;
  tokenExpiresAt = Date.now() + data.expire * 1000; // expire is in seconds
  return token;
}

// Fields must match your Base's column names exactly (case-sensitive).
export async function pushLeadToLark(fields: Record<string, unknown>) {
  const token = await getTenantAccessToken();

  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${process.env.LARK_BASE_APP_TOKEN}/tables/${process.env.LARK_TABLE_ID}/records`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ fields }),
  });

  const data = await res.json();

  // Lark's Bitable API returns HTTP 200 even on logical failures — the real
  // result is data.code (0 = success). Checking res.ok alone misses this.
  if (data.code !== 0) {
    // Don't throw — a Lark hiccup shouldn't block the Supabase insert / form
    // submission. Log it so it's visible in Vercel's function logs.
    console.error("Lark insert failed:", data.code, data.msg);
  }

  return data;
}