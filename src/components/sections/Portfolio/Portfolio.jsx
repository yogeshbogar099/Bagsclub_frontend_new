import { CheckCircle } from "lucide-react";
import SectionHeading from "../../common/SectionHeading/SectionHeading.jsx";
import { printingProducts } from "../../../data/landingPageData.js";

export default function Portfolio() {
  return (
    <section id="section-portfolio" className="py-10 sm:py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Wide Range of Printing Services" />
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {printingProducts.map(([title, text]) => (
            <article key={title} className="flex gap-4 rounded-lg border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white sm:h-12 sm:w-12">
                <CheckCircle size={20} className="sm:h-[22px] sm:w-[22px]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-ink sm:text-base">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm sm:leading-6">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
