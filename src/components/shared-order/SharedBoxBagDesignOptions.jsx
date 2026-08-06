import { useNavigate } from "react-router-dom";
import BoxBagSingleColor60 from "../../assets/images/Box_Bag_Single_Color.jpeg";
import BoxBagTwoColor60 from "../../assets/images/Box_Bag_Two_Color.jpeg";
import BoxBagFourColor60 from "../../assets/images/Box_Bag_Four_Color.jpeg";
import BoxBagSingleColor120 from "../../assets/images/Box_Bag_Single_Color_120gsm.jpeg";
import BoxBagTwoColor120 from "../../assets/images/Box_Bag_Two_Color_120gsm.jpeg";
import BoxBagFourColor120 from "../../assets/images/Box_Bag_Four_Color_120gsm.jpeg";

const designOptions = [
  { id: "single-primary", key: "single", title: "Single Color 60 GSM", image: BoxBagSingleColor60 },
  { id: "two-primary", key: "two", title: "Two Color 60 GSM", image: BoxBagTwoColor60 },
  { id: "four-primary", key: "four", title: "Four Color 60 GSM", image: BoxBagFourColor60 },
  { id: "single-secondary", key: "single", title: "Single Color 120 GSM", image: BoxBagSingleColor120 },
  { id: "two-secondary", key: "two", title: "Two Color 120 GSM", image: BoxBagTwoColor120 },
  { id: "four-secondary", key: "four", title: "Four Color 120 GSM", image: BoxBagFourColor120 }
];

export default function SharedBoxBagDesignOptions({ basePath }) {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#e8e8e8] pb-10">
      <section className="px-3 py-6 sm:px-4 md:px-8">
        <div className="mx-auto min-w-0 max-w-7xl">
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
            Box Bag
          </h1>

          <p className="mb-6 text-sm font-semibold text-gray-600">Choose your printing color option to continue.</p>

          <div className="grid justify-items-center gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {designOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className="group w-full max-w-[260px] text-left"
                onClick={() => navigate(`${basePath}/non-woven-bag/box-bag?design=${option.key}`)}
                aria-label={option.title}
              >
                <div className="overflow-hidden bg-white shadow-sm transition-transform duration-200 group-hover:-translate-y-1">
                  <div className="relative aspect-[2040/3061] w-full overflow-hidden">
                    <img src={option.image} alt={option.title} className="absolute inset-0 block h-full w-full object-contain object-center" />
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
