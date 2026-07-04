import SectionHeading from "../../common/SectionHeading/SectionHeading.jsx";
import { reasons } from "../../../data/landingPageData.js";

export default function Reasons() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Why Do Printers Choose Us?"
          subtitle="The reasons thousands of printing professionals trust Printers Club as their growth partner."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(([title, Icon, gradient, text]) => (
            <article key={title} className="card">
              <div className={`icon-badge bg-gradient-to-br ${gradient}`}>
                <Icon size={26} />
              </div>
              <h3 className="font-bold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
