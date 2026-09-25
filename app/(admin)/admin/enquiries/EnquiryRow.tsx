"use client";

import { useState } from "react";
import { updateEnquiryStatus, updateEnquiryNotes } from "./actions";
import { STATUSES, type EnquiryStatus } from "./statuses";
import { formatMYDate } from "@/lib/datetime";

const STATUS_STYLE: Record<string, string> = {
  new: "bg-status-info/10 text-status-info",
  contacted: "bg-status-warn-bg text-status-warn",
  qualified: "bg-brand-green-tint text-brand-green-ink",
  converted: "bg-brand-green text-white",
};

export default function EnquiryRow({ lead }: { lead: Record<string, unknown> }) {
  const [notes, setNotes] = useState(String(lead.notes ?? ""));
  const [status, setStatus] = useState(String(lead.status ?? "new"));

  return (
    <tr className="border-b border-base-line align-top last:border-0">
      <td className="px-3 py-2.5">
        <p className="font-medium text-base-ink">{String(lead.full_name ?? "")}</p>
        <p className="text-xs text-base-slate">{String(lead.phone ?? "")}{lead.email ? ` · ${lead.email}` : ""}</p>
      </td>
      <td className="px-3 py-2.5 text-base-ink">{String(lead.state ?? "-")}</td>
      <td className="px-3 py-2.5 text-base-ink">{String(lead.lead_source ?? "-")}</td>
      <td className="px-3 py-2.5">
        <select
          value={status}
          onChange={async (e) => {
            const next = e.target.value as EnquiryStatus;
            setStatus(next);
            await updateEnquiryStatus(String(lead.id), next);
          }}
          className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold capitalize outline-none ${STATUS_STYLE[status] ?? ""}`}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
      <td className="px-3 py-2.5 text-xs text-base-slate">
        {lead.created_at ? formatMYDate(String(lead.created_at)) : "-"}
      </td>
      <td className="px-3 py-2.5">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => updateEnquiryNotes(String(lead.id), notes)}
          rows={1}
          placeholder="Add a note…"
          className="w-full min-w-[160px] rounded-md border border-base-line bg-base-bg px-2 py-1 text-xs text-base-ink outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
        />
      </td>
    </tr>
  );
}
