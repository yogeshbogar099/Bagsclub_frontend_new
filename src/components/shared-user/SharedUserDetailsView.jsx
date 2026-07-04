import { ArrowLeft } from "lucide-react";
import { navigateTo } from "../../utils/auth.js";

function DetailField({ label, value, span = 1 }) {
  return (
    <div className={span > 1 ? "sm:col-span-2" : ""}>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm text-slate-800">{value || "--"}</p>
    </div>
  );
}

export default function SharedUserDetailsView({
  title = "User Details",
  subtitle = "Review the selected user information.",
  loading = false,
  loadingText = "Loading user details...",
  backPathFallback = "/",
  summaryCards = [],
  informationTitle = "User Information",
  informationFields = [],
  extraSections = [],
  sidePanel = null,
  bottomContent = null
}) {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    navigateTo(backPathFallback);
  };

  if (loading) {
    return (
      <section className="rounded border border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500 shadow-sm">
        {loadingText}
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-300 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
          </div>
        </div>
      </section>

      {summaryCards.length ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded border border-slate-300 bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{card.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{card.value || "--"}</p>
            </article>
          ))}
        </section>
      ) : null}

      <section className={`grid gap-6 ${sidePanel ? "lg:grid-cols-[1fr_320px]" : ""}`}>
        <article className="rounded border border-slate-300 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">{informationTitle}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {informationFields.map((field) => (
              <DetailField key={`${field.label}-${field.value || ""}`} label={field.label} value={field.value} span={field.span || 1} />
            ))}
          </div>

          {extraSections.map((section) => (
            <div key={section.title} className="mt-6 rounded border border-slate-200 bg-slate-50 p-4">
              <h4 className="text-sm font-bold text-slate-800">{section.title}</h4>
              {section.content ? (
                <div className="mt-3">{section.content}</div>
              ) : (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {(section.fields || []).map((field) => (
                    <DetailField key={`${section.title}-${field.label}-${field.value || ""}`} label={field.label} value={field.value} span={field.span || 1} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </article>

        {sidePanel ? <aside className="rounded border border-slate-300 bg-white p-4 shadow-sm">{sidePanel}</aside> : null}
      </section>

      {bottomContent ? <section>{bottomContent}</section> : null}
    </div>
  );
}
