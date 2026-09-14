"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Bucket = { label: string; value: number };

const CHART_COLOR = "var(--color-chart-1)";

function StatTile({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="rounded-xl border border-base-line bg-base-panel p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-base-slate">{label}</p>
      <p className={`mt-1.5 font-bold text-base-ink ${big ? "text-3xl" : "text-2xl"}`}>{value}</p>
    </div>
  );
}

function MiniBarChart({ title, data }: { title: string; data: Bucket[] }) {
  return (
    <div className="rounded-xl border border-base-line bg-base-panel p-5">
      <p className="text-sm font-semibold text-base-ink">{title}</p>
      <div className="mt-3 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-base-line)" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--color-base-slate)" }} axisLine={{ stroke: "var(--color-base-line)" }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--color-base-slate)" }} axisLine={false} tickLine={false} width={32} />
            <Tooltip
              cursor={{ fill: "var(--color-base-bg)" }}
              contentStyle={{ borderRadius: 8, borderColor: "var(--color-base-line)", fontSize: 12 }}
            />
            <Bar dataKey="value" fill={CHART_COLOR} radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Charts({
  visitors,
  calculatorUsers,
  enquiries,
  enquiryConversion,
  calculatorCompletion,
  byStatus,
  byLocation,
  bySource,
}: {
  visitors: number;
  calculatorUsers: number;
  enquiries: number;
  enquiryConversion: number;
  calculatorCompletion: number;
  byStatus: Bucket[];
  byLocation: Bucket[];
  bySource: Bucket[];
}) {
  return (
    <div className="mt-6 space-y-6">
      <div>
        <p className="text-sm font-semibold text-base-ink">Enquiry funnel — this month</p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatTile label="Website visitors" value={visitors.toLocaleString("en-US")} big />
          <StatTile label="Calculator users" value={calculatorUsers.toLocaleString("en-US")} big />
          <StatTile label="Submitted enquiries" value={enquiries.toLocaleString("en-US")} big />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatTile label="Enquiry conversion (enquiries ÷ visitors)" value={`${enquiryConversion.toFixed(2)}%`} />
          <StatTile label="Calculator completion (enquiries ÷ calculator users)" value={`${calculatorCompletion.toFixed(1)}%`} />
        </div>
        <p className="mt-2 text-xs text-base-slate">
          Tracked from first-party pageview and calculator-use events recorded on the public site.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <MiniBarChart title="Enquiries by status" data={byStatus} />
        <MiniBarChart title="Enquiries by location" data={byLocation} />
        <MiniBarChart title="Leads: Google vs social vs direct" data={bySource} />
      </div>
    </div>
  );
}
