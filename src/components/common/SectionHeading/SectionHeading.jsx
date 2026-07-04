export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-10 text-center">
      <div className="title-line" />
      <h2 className="section-title">{title}</h2>
      {subtitle ? <p className="mx-auto mt-3 max-w-2xl text-slate-500">{subtitle}</p> : null}
    </div>
  );
}
