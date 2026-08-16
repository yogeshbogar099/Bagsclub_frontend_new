import { useNavigate } from "react-router-dom";
import bg02 from "../../assets/images/bg_02.jpg";
import sampleImage from "../../assets/images/8.jpg";
import printingServicesImage from "../../assets/images/login_Printing_Services.png";
import D_Cut from "../../assets/images/D-Cut-bag-card.jpg"
import LoopBag from "../../assets/images/Loop-Bag-Card.jpeg"
import BoxBag from "../../assets/images/Box-Bag-Card.jpeg"

const nonWovenBagCards = [
  { id: 1, title: "D-CUT BAG", slug: "d-cut-bag", image: D_Cut },
  { id: 2, title: "LOOP BAG", slug: "loop-bag", image: LoopBag },
  { id: 3, title: "BOX BAG", slug: "box-bag", image: BoxBag },
  { id: 4, title: "SAMPLE FILE", slug: "sample-file", image: sampleImage, isSample: true }
];

export default function AssociateNonWovenBagPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#e8e8e8] pb-10">
      <section className="px-4 py-6 sm:px-6 md:px-8 lg:px-0">
        <div className="mx-auto max-w-7xl px-[2vw]">
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
            {nonWovenBagCards.map((card) => {
              const CardWrapper = card.isSample ? "div" : "button";
              return (
                <CardWrapper
                  key={card.id}
                  type={card.isSample ? undefined : "button"}
                  className={`group w-full max-w-[220px] text-center ${card.isSample ? "" : "cursor-pointer"}`}
                  onClick={
                    card.isSample
                      ? undefined
                      : () => {
                          if (card.slug === "d-cut-bag") {
                            navigate("/dashboard/associate-member/book-order/non-woven-bag/d-cut-bag/design-options");
                            return;
                          }
                          if (card.slug === "loop-bag") {
                            navigate("/dashboard/associate-member/book-order/non-woven-bag/loop-bag/design-options");
                            return;
                          }
                          if (card.slug === "box-bag") {
                            navigate("/dashboard/associate-member/book-order/non-woven-bag/box-bag/design-options");
                            return;
                          }

                          navigate(`/dashboard/associate-member/book-order/non-woven-bag/${card.slug}`);
                        }
                  }
                >
                  <div className="overflow-hidden bg-white shadow-sm transition-transform duration-200 group-hover:-translate-y-1">
                    <img src={card.image} alt={card.title} className="h-[260px] w-full object-cover sm:h-[280px] md:h-[300px]" />
                  </div>
                  <div className="mt-2 text-[14px] font-bold uppercase leading-5 text-[#2d58a5] md:text-[15px]">{card.title}</div>
                </CardWrapper>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
