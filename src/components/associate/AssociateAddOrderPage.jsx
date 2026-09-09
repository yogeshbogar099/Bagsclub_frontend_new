import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssociateModule } from "../../context/AssociateModuleContext.jsx";
import OrderCarousel from "./OrderCarousel.jsx";
import PrintingServicesCarousel from "../shared-order/PrintingServicesCarousel.jsx";
import RecentOrdersTable from "../shared-order/RecentOrdersTable.jsx";
import NonWoven from "../../assets/images/Non_Woven_Bag.png";
import PlasticBag from "../../assets/images/Plastic_Bag.png";
import HDPE from "../../assets/images/HDPE_Bag.png";
import PaperBag from "../../assets/images/Paper_Bag.png";
import CanvasBag from "../../assets/images/Canvas_Bag.png";

const printingServiceCards = [
  { id: 1, title: "NON-WOVEN BAG", image: NonWoven },
  { id: 2, title: "PAPER BAG", image: PaperBag },
  { id: 3, title: "PLASTIC BAG", image: PlasticBag },
  { id: 4, title: "HDPE BAG", image: HDPE },
  { id: 5, title: "CANVAS BAG", image: CanvasBag }
];

export default function AssociateAddOrderPage() {
  const navigate = useNavigate();
  const { sectionLoading, loadRecentOrders } = useAssociateModule();
  const [recentOrders, setRecentOrders] = useState([]);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);

  const refreshRecentOrders = useCallback(async () => {
    const data = await loadRecentOrders(5);
    setRecentOrders(Array.isArray(data?.items) ? data.items : []);
  }, [loadRecentOrders]);

  useEffect(() => {
    refreshRecentOrders();
  }, [refreshRecentOrders]);

  useEffect(() => {
    window.addEventListener("focus", refreshRecentOrders);
    window.addEventListener("orderstatuschange", refreshRecentOrders);
    const timer = window.setInterval(refreshRecentOrders, 15000);

    return () => {
      window.removeEventListener("focus", refreshRecentOrders);
      window.removeEventListener("orderstatuschange", refreshRecentOrders);
      window.clearInterval(timer);
    };
  }, [refreshRecentOrders]);

  const handleSelectService = useCallback(
    (card) => {
      if (card.title === "NON-WOVEN BAG") {
        navigate("/dashboard/associate-member/book-order/non-woven-bag");
      }
    },
    [navigate]
  );

  const handleServiceNavClick = useCallback((index) => {
    setSelectedServiceIndex(index);
  }, []);

  const handleCarouselIndexChange = useCallback((index) => {
    setSelectedServiceIndex(index);
  }, []);

  const handleOpenDetails = useCallback(
    (row) => {
      navigate(`/dashboard/associate-member/book-order/details/${row.id}`, { state: { order: row } });
    },
    [navigate]
  );

  return (
    <div className="w-full bg-[#e8e8e8] pb-10">
      <OrderCarousel aspectRatio="706 / 170" />

      <section className="px-4 py-6 sm:px-6 md:px-8 lg:px-0">
        <div className="mx-auto min-w-0 max-w-7xl px-[2vw]">
          <h1
            className="mb-5 text-center text-3xl font-black uppercase tracking-tight text-black md:text-4xl"
            style={{ textShadow: "3px 4px 6px rgba(0, 0, 0, 0.25)" }}
          >
            List Of Printing Services
          </h1>

          <div className="mb-6 overflow-x-auto pb-2">
            <div className="mx-auto flex min-w-max items-center justify-start gap-5 sm:justify-center sm:gap-7 md:gap-9">
              {printingServiceCards.map((card, index) => {
                const isActive = index === selectedServiceIndex;

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleServiceNavClick(index)}
                    className={`group relative bg-transparent px-0 pb-3 text-sm font-normal tracking-normal transition-colors duration-300 sm:text-[15px] ${isActive ? "text-[#305CA7]" : "text-[#5f6673] hover:text-[#305CA7]"
                      }`}
                  >
                    {card.title}
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0 left-0 h-[2px] w-full origin-center rounded-full transition-all duration-300 ease-in-out ${isActive ? "bg-[#305CA7] opacity-100 h-[3px]" : "bg-[#cbd5e1] opacity-100 group-hover:bg-[#94a3b8]"
                        }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-w-0">
            <PrintingServicesCarousel
              cards={printingServiceCards}
              initialSelectedId={printingServiceCards[0]?.id}
              activeIndex={selectedServiceIndex}
              onActiveIndexChange={handleCarouselIndexChange}
              onSelectCard={handleSelectService}
            />
          </div>

          <section className="mt-10">
            <RecentOrdersTable
              orders={recentOrders}
              loading={sectionLoading}
              showTitle={true}
              showShowMore={true}
              basePath="/dashboard/associate-member/book-order"
              onOpenDetails={handleOpenDetails}
              onShowMore={() => navigate("/dashboard/associate-member/orders/search/order-date")}
            />
          </section>
        </div>
      </section>
    </div>
  );
}
