import { stats } from "../../../data/landingPageData.js";
import { asset } from "../../../utils/asset.js";

export default function Reach() {
  return (
    <section id="reach" className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-lg bg-white shadow-soft lg:grid-cols-2">
          <div
            className="min-h-[360px] bg-cover bg-center"
            style={{ backgroundImage: `url(${asset("can_images/services/Our-Reach-New.jpg")})` }}
          />
          <div className="p-8 lg:p-12">
            <p className="text-sm font-semibold uppercase text-brand">
              Speedly growing horizontally & vertically.
            </p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Our Current Reach & Network</h2>
            <div className="mt-5 space-y-4 leading-7 text-slate-600">
              <p>
               BagsClub of India Limited is widely popular all throughout North and Central India as we have features that are tailor made to satisfy Printers & advertising agency needs.
              </p>
              <p>
               With the valuable support of 25+ Delivery Partners we deliver our services to across North India. As we are in continious search of new Distributors and Partners PAN India
              </p>
              <p>
                Currently we serve Rajasthan, Punjab, Haryana, Delhi, Uttar Pradesh, Uttrakhand, Jammu & Kashmeer, Bihar, West Bengal, Gujrat, Madhya Pradesh & Himachal Pradesh
              </p>
              <p>
                We are continuously & Speedly growing our network reach.
              </p>
              <p>
                Our dedication, Quality & welfare works, helped us to achieve this success.
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-6 grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} flex min-h-[220px] flex-col items-center justify-center rounded-lg p-8 text-center text-ink shadow-soft`}
            >
              <img src={asset(stat.icon)} alt={stat.label} className="mx-auto mb-4 h-16 w-auto" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-2 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
