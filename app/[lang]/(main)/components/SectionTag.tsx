export default function SectionTag({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-base-slate">
      <span aria-hidden className="h-2 w-2 shrink-0 bg-brand-orange-deep" />
      {children}
    </p>
  );
}
