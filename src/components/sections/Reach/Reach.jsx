import { stats } from "../../../data/landingPageData.js";
import { asset } from "../../../utils/asset.js";

export default function Reach() {
  return (
    <section id="reach" className="bg-slate-50 py-10 sm:py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-lg bg-white shadow-soft lg:grid-cols-2">
          <div
            className="min-h-[260px] bg-cover bg-center sm:min-h-[320px] lg:min-h-[360px]"
            style={{ backgroundImage: `url(${asset("can_images/services/Our-Reach-New.jpg")})` }}
          />
          <div className="p-6 sm:p-8 lg:p-12">
            <p className="text-xs font-semibold uppercase text-brand sm:text-sm">
              Speedly growing horizontally & vertically.
            </p>
            <h2 className="mt-2 text-2xl font-bold text-ink sm:mt-3 sm:text-3xl">Our Current Reach & Network</h2>
            <div className="mt-4 space-y-3 leading-7 text-slate-600 sm:mt-5 sm:space-y-4 sm:text-base">
              <p className="text-sm sm:text-base">
                BagsClub of India Limited is widely popular all throughout North and Central India as we have features that are tailor made to satisfy Printers & advertising agency needs.
              </p>
              <p className="text-sm sm:text-base">
                With the valuable support of 25+ Delivery Partners we deliver our services to across North India. As we are in continious search of new Distributors and Partners PAN India
              </p>
              <p className="text-sm sm:text-base">
                Currently we serve Rajasthan, Punjab, Haryana, Delhi, Uttar Pradesh, Uttrakhand, Jammu & Kashmeer, Bihar, West Bengal, Gujrat, Madhya Pradesh & Himachal Pradesh
              </p>
              <p className="text-sm sm:text-base">
                We are continuously & Speedly growing our network reach.
              </p>
              <p className="text-sm sm:text-base">
                Our dedication, Quality & welfare works, helped us to achieve this success.
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-5 grid max-w-6xl grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} flex min-h-[180px] flex-col items-center justify-center rounded-lg p-6 text-center text-ink shadow-soft sm:min-h-[200px] sm:p-8`}
            >
              <img src={asset(stat.icon)} alt={stat.label} loading="lazy" className="mx-auto mb-3 h-12 w-auto sm:mb-4 sm:h-16" />
              <p className="text-2xl font-bold sm:text-3xl">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
