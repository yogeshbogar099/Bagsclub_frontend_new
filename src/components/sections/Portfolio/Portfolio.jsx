import { CheckCircle } from "lucide-react";
import SectionHeading from "../../common/SectionHeading/SectionHeading.jsx";
import { printingProducts } from "../../../data/landingPageData.js";

export default function Portfolio() {
  return (
    <section id="section-portfolio" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Wide Range of Printing Services" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {printingProducts.map(([title, text]) => (
            <article key={title} className="flex gap-4 rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <CheckCircle size={22} />
              </div>
              <div>
                <h3 className="font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
