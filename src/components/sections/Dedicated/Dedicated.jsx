import SectionHeading from "../../common/SectionHeading/SectionHeading.jsx";
import { dedicated } from "../../../data/landingPageData.js";

export default function Dedicated() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="We Are Dedicated To"
          subtitle="Three core promises that define every product and service we deliver."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {dedicated.map(([title, Icon, gradient, text]) => (
            <article key={title} className="card p-8">
              <div className={`icon-badge h-20 w-20 bg-gradient-to-br ${gradient}`}>
                <Icon size={34} />
              </div>
              <h3 className="text-xl font-bold text-ink">{title}</h3>
              <p className="mt-4 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
