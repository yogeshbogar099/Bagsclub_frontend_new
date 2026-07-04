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
    <section id="about" className="py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase text-brand">Bag Club of India Limited</p>
          <h2 className="text-4xl font-bold leading-tight text-ink">
            Always Ready to Help Printers & Advertisers
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Unity empowers us. We can work alone, but together we will win. Unity is strength, where there is team work and collaborations, wonderfull things can be achieved.
          
           
          </p>
         
          {/* <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {aboutHighlights.map(([title, Icon, text]) => (
              <div key={title} className="rounded-lg bg-slate-50 p-4">
                <Icon className="mb-3 text-brand" size={28} />
                <h3 className="font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{text}</p>
              </div>
            ))}
          </div> */}
        </div>
        <img
          src={Eight}
          alt="Printers Club of India Limited"
          className="h-full max-h-[460px] w-full rounded-lg object-cover shadow-soft"
        />
      </div>
    </section>
  );
}
