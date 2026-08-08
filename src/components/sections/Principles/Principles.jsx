import { principles } from "../../../data/landingPageData.js";

export default function Principles() {
  return (
    <section className="grid md:grid-cols-2 lg:grid-cols-3">
      {principles.map(({ title, icon: Icon, bg, lines }) => (
        <article key={title} className={`${bg} min-h-64 p-6 text-white sm:min-h-72 sm:p-8 lg:p-10`}>
          <Icon className="mb-5 h-8 w-8 opacity-90 sm:mb-6 sm:h-9 sm:w-9" />
          <h3 className="text-xl font-bold uppercase sm:text-2xl">{title}</h3>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/90 sm:mt-5 sm:space-y-4 sm:text-base sm:leading-8">
            {lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
