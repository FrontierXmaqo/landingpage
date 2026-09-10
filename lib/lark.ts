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
 
  cachedToken = data.tenant_access_token;
  tokenExpiresAt = Date.now() + data.expire * 1000; // expire is in seconds
  return cachedToken;
}

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
 
  if (!res.ok) {
    console.error("Lark insert failed:", await res.text());
  }
}