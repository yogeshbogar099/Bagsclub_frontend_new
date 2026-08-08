export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-8 text-center sm:mb-10">
      <div className="title-line" />
      <h2 className="section-title">{title}</h2>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-slate-500 sm:text-sm sm:leading-7 md:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
