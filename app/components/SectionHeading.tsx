import SectionTag from "./SectionTag";

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
    <div className="max-w-2xl">
      <SectionTag>{eyebrow}</SectionTag>
      <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {body && <p className="mt-4 text-base leading-relaxed text-slate-600">{body}</p>}
    </div>
  );
}
