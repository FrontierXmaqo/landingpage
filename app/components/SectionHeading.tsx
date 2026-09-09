export default function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="section-eyebrow text-xs font-semibold uppercase text-maqo-green-dark">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h2>
      {body && <p className="mt-3 text-base text-slate-600">{body}</p>}
    </div>
  );
}
