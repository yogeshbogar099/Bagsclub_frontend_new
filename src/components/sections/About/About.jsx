import { Factory, MapPin, Users } from "lucide-react";
import { asset } from "../../../utils/asset.js";
import Eight from "../../../assets/images/8.jpg"

const aboutHighlights = [
  ["350+ Team", Users, "Skilled professionals dedicated to success"],
  ["12+ States", MapPin, "PAN India reach with delivery partners"],
  ["5,000 Sq. Mtr.", Factory, "State-of-the-art manufacturing facility"]
];

export default function About() {
  return (
    <section id="about" className="py-10 sm:py-12 md:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 sm:gap-8 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="order-2 lg:order-1">
          <p className="mb-2 text-xs font-semibold uppercase text-brand sm:mb-3 sm:text-sm">Bag Club of India Limited</p>
          <h2 className="text-2xl font-bold leading-tight text-ink sm:text-3xl md:text-4xl">
            Always Ready to Help Printers & Advertisers
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base md:leading-8">
            Unity empowers us. We can work alone, but together we will win. Unity is strength, where there is team work and collaborations, wonderfull things can be achieved.
          </p>
        </div>
        <div className="order-1 lg:order-2">
          <img
            src={Eight}
            alt="Printers Club of India Limited"
            loading="lazy"
            className="h-full max-h-[340px] w-full rounded-lg object-cover shadow-soft sm:max-h-[400px] lg:max-h-[460px]"
          />
        </div>
      </div>
    </section>
  );
}
