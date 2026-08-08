import SectionHeading from "../../common/SectionHeading/SectionHeading.jsx";
import { dedicated } from "../../../data/landingPageData.js";

export default function Dedicated() {
  return (
    <section className="py-10 sm:py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="We Are Dedicated To"
          subtitle="Three core promises that define every product and service we deliver."
        />
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {dedicated.map(([title, Icon, gradient, text]) => (
            <article key={title} className="card p-6 sm:p-8">
              <div className={`icon-badge mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-lg sm:h-20 sm:w-20 ${gradient}`}>
                <Icon size={28} className="sm:h-[34px] sm:w-[34px]" />
              </div>
              <h3 className="text-lg font-bold text-ink sm:text-xl">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-7">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
