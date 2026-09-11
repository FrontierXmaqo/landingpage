import SectionHeading from "./SectionHeading";
import { WHY_ATAP } from "@/lib/content";

const ICONS = [
  <svg key="doc" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-full w-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6M9 17h6M9 9h2" />
  </svg>,
  <svg key="bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-full w-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 4.5 13.5H11L10 22l9.5-13.5H13V2Z" />
  </svg>,
  <svg key="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-full w-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 19 6v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
  </svg>,
  <svg key="badge" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-full w-full">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m12 2 2.2 1.3 2.6-.2.9 2.4 2.4.9-.2 2.6L21.2 11l-1.3 2.2.2 2.6-2.4.9-.9 2.4-2.6-.2L12 21l-2.2-1.3-2.6.2-.9-2.4-2.4-.9.2-2.6L2.8 11l1.3-2.2-.2-2.6 2.4-.9.9-2.4 2.6.2L12 2Z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
  </svg>,
];

export default function WhyAtap() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading eyebrow="Why ATAP" title="Solar, made simple for your home" />
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
          {WHY_ATAP.map((item, i) => (
            <div key={item.title} className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-maqo-green-dark">
                {ICONS[i]}
              </span>
              <div>
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
