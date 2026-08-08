import { useNavigate } from "react-router-dom";
import DCutSingleColor from "../../assets/images/D_Cut_Single_Color.jpeg";
import DCutTwoColor from "../../assets/images/D_Cut_Two_Color.jpeg";
import DCutFourColor from "../../assets/images/D_Cut_Four_Color.jpeg";

const designOptions = [
  { key: "single", title: "Single Color", image: DCutSingleColor },
  { key: "two", title: "Two Color", image: DCutTwoColor },
  { key: "four", title: "Four Color", image: DCutFourColor }
];

export default function SharedDCutBagDesignOptions({ basePath }) {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#e8e8e8] pb-10">
      <section className="px-4 py-6 sm:px-6 md:px-0 md:py-8">
        <div className="mx-auto min-w-0 max-w-7xl px-[2vw]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(`${basePath}/non-woven-bag`)}
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
                onClick={() => navigate(`${basePath}/non-woven-bag/d-cut-bag?design=${option.key}`)}
                aria-label={option.title}
              >
                <div className="overflow-hidden bg-white shadow-sm transition-transform duration-200 group-hover:-translate-y-1">
                  <div className="relative aspect-[2040/3061] w-full overflow-hidden">
                    <img src={option.image} alt={option.title} className="absolute inset-0 block h-full w-full object-cover object-center" />
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
