import SectionHeading from "../../common/SectionHeading/SectionHeading.jsx";
import { services } from "../../../data/landingPageData.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { getDashboardPath, navigateTo } from "../../../utils/auth.js";

export default function Services() {
  const { user } = useAuth();

  function handleServiceClick(event, service) {
    if (service.title !== "Printing Services") {
      return;
    }

    event.preventDefault();
    navigateTo(user?.role ? getDashboardPath(user.role) : "/login");
  }

  return (
    <section id="section-services" className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Our Services"
          subtitle="Everything a printing professional needs under one roof."
        />
        <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const content = (
              <article className="card relative flex h-full flex-col items-center justify-start border-slate-200 text-center hover:border-brand">
                {service.badge ? (
                  <span className="absolute right-4 top-4 rounded-full bg-[#8500ff] px-3 py-1 text-xs font-bold uppercase text-white">
                    {service.badge}
                  </span>
                ) : null}
                <img
                  src={service.image}
                  alt={service.title}
                  className="mx-auto mb-4 h-24 w-auto object-contain"
                />
                <h3 className="text-center text-lg font-semibold text-ink">{service.title}</h3>
                {service.highlight ? (
                  <p className="mt-3 w-full whitespace-pre-line rounded-md bg-gradient-to-br from-[#8500ff] to-[#6a1bd6] px-4 py-3 text-center text-sm font-semibold uppercase text-white">
                    {service.highlight}
                  </p>
                ) : null}
                {service.company ? (
                  <p className="mt-3 text-center text-sm font-semibold text-brand">{service.company}</p>
                ) : null}
                <p className="mt-3 text-center text-sm leading-6 text-slate-600">{service.text}</p>
              </article>
            );

            return service.href ? (
              <a key={service.title} href={service.href} className="block h-full" onClick={(event) => handleServiceClick(event, service)}>
                {content}
              </a>
            ) : (
              <button
                key={service.title}
                type="button"
                className="block h-full w-full text-center"
                onClick={() => alert("Coming Soon !!")}
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
