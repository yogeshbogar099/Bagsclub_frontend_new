import { useNavigate } from "react-router-dom";
import bg02 from "../../assets/images/bg_02.jpg";
import sampleImage from "../../assets/images/8.jpg";
import printingServicesImage from "../../assets/images/login_Printing_Services.png";
import D_Cut from "../../assets/images/D_Cut.png"
import LoopBag from "../../assets/images/LoopBag.png"
import BoxBag from "../../assets/images/BoxBag.png"

const nonWovenBagCards = [
  { id: 1, title: "D-CUT BAG", slug: "d-cut-bag", image: D_Cut },
  { id: 2, title: "LOOP BAG", slug: "loop-bag", image: LoopBag },
  { id: 3, title: "BOX BAG", slug: "box-bag", image: BoxBag }
];

export default function AssociateNonWovenBagPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#e8e8e8] pb-10">
      <section className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/associate-member/book-order")}
              className="rounded bg-[#2d58a5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#244887]"
            >
              Back
            </button>
          </div>

          <h1
            className="mb-5 text-3xl font-black uppercase tracking-tight text-black md:text-4xl"
            style={{ textShadow: "3px 4px 6px rgba(0, 0, 0, 0.25)" }}
          >
            Non-Woven Bag
          </h1>

          <div
            className="grid justify-items-center gap-x-6 gap-y-7"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
          >
            {nonWovenBagCards.map((card) => (
              <button
                key={card.id}
                type="button"
                className="group w-full max-w-[220px] text-center"
                onClick={() => navigate(`/dashboard/associate-member/book-order/non-woven-bag/${card.slug}`)}
              >
                <div className="overflow-hidden bg-white shadow-sm transition-transform duration-200 group-hover:-translate-y-1">
                  <img src={card.image} alt={card.title} className="h-[260px] w-full object-cover sm:h-[280px] md:h-[300px]" />
                </div>
                <div className="mt-2 text-[14px] font-bold uppercase leading-5 text-[#2d58a5] md:text-[15px]">{card.title}</div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
