import { principles } from "../../../data/landingPageData.js";

export default function Principles() {
  return (
    <section className="grid lg:grid-cols-3">
      {principles.map(({ title, icon: Icon, bg, lines }) => (
        <article key={title} className={`${bg} min-h-72 p-10 text-white`}>
          <Icon className="mb-6 opacity-90" size={36} />
          <h3 className="text-2xl font-bold uppercase">{title}</h3>
          <div className="mt-5 space-y-4 leading-8 text-white/90">
            {lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
