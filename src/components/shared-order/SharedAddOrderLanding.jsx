import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCarousel from "../associate/OrderCarousel.jsx";
import PrintingServicesCarousel from "./PrintingServicesCarousel.jsx";
import RecentOrdersTable from "./RecentOrdersTable.jsx";
import { printingServiceCards } from "./sharedOrderData.js";

export default function SharedAddOrderLanding({ basePath, loadRecentOrders, onOpenDetails }) {
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);

  const refreshRecentOrders = useCallback(async () => {
    if (!loadRecentOrders) return;
    setLoading(true);
    try {
      const data = await loadRecentOrders(5);
      setRecentOrders(Array.isArray(data?.items) ? data.items : []);
    } finally {
      setLoading(false);
    }
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
        navigate(`${basePath}/non-woven-bag`);
      }
    },
    [basePath, navigate]
  );

  const handleServiceNavClick = useCallback((index) => {
    setSelectedServiceIndex(index);
  }, []);

  const handleCarouselIndexChange = useCallback((index) => {
    setSelectedServiceIndex(index);
  }, []);

  return (
    <div className="w-full bg-[#e8e8e8] pb-10">
      <OrderCarousel aspectRatio="706 / 170" />

      <section className="px-4 py-6 sm:px-6 md:px-0 md:py-8">
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
                    className={`group relative bg-transparent px-0 pb-3 text-sm font-normal tracking-normal transition-colors duration-300 sm:text-[15px] ${
                      isActive ? "text-[#305CA7]" : "text-[#5f6673] hover:text-[#305CA7]"
                    }`}
                  >
                    {card.title}
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0 left-0 h-[2px] w-full origin-center rounded-full transition-all duration-300 ease-in-out ${
                        isActive ? "bg-[#305CA7] opacity-100 h-[3px]" : "bg-[#cbd5e1] opacity-100 group-hover:bg-[#94a3b8]"
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
              loading={loading}
              showTitle={true}
              showShowMore={true}
              basePath={basePath}
              onOpenDetails={onOpenDetails}
            />
          </section>
        </div>
      </section>
    </div>
  );
}
