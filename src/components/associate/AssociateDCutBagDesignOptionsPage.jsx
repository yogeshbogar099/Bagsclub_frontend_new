import { useNavigate } from "react-router-dom";

const designOptions = [
  { key: "single", title: "Single Color" },
  { key: "two", title: "Two Color" },
  { key: "four", title: "Four Color" },
  { key: "mix", title: "Mix Color" }
];

export default function AssociateDCutBagDesignOptionsPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#e8e8e8] pb-10">
      <section className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/associate-member/book-order/non-woven-bag")}
              className="rounded bg-[#2d58a5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#244887]"
            >
              Back
            </button>
          </div>

          <h1
            className="mb-2 text-3xl font-black uppercase tracking-tight text-black md:text-4xl"
            style={{ textShadow: "3px 4px 6px rgba(0, 0, 0, 0.25)" }}
          >
            D-Cut Bag
          </h1>
          
          <p className="mb-6 text-sm font-semibold text-gray-600">Choose your design color option to continue.</p>

          <div className="grid justify-items-center gap-x-6 gap-y-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {designOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className="group w-full max-w-[260px] text-left"
                onClick={() => navigate(`/dashboard/associate-member/book-order/non-woven-bag/d-cut-bag?design=${option.key}`)}
              >
                <div className="overflow-hidden bg-white shadow-sm transition-transform duration-200 group-hover:-translate-y-1">
                  <div className="flex h-[240px] w-full items-center justify-center bg-[#6b4324] px-5 text-center sm:h-[260px] md:h-[280px]">
                    <div className="text-[18px] font-extrabold uppercase tracking-wide text-white md:text-[20px]">{option.title}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
