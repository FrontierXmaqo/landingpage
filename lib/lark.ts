export async function pushLeadToLark(fields: Record<string, unknown>) {
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${process.env.LARK_APP_TOKEN}/tables/${process.env.LARK_TABLE_ID}/records`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LARK_PERSONAL_TOKEN}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    console.error("Lark insert failed:", await res.text());
  }
}