import { useCallback, useEffect, useState } from "react";
import { FileText, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderCarousel from "../associate/OrderCarousel.jsx";
import PrintingServicesCarousel from "./PrintingServicesCarousel.jsx";
import { printingServiceCards } from "./sharedOrderData.js";
import {
  getTableBodyRowClassName,
  tableActionButtonClassName,
  tableBodyCellClassName,
  tableBodyCellCenterClassName,
  tableCardClassName,
  tableElementClassName,
  tableEmptyCellClassName,
  tableHeaderCellCenterClassName,
  tableHeaderCellClassName,
  tableHeaderRowClassName,
  tableShellClassName
} from "../shared-table/tableStyles.js";

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
            <div className="bg-white px-4 py-4 shadow-sm sm:px-6">
              <h2 className="text-center text-2xl font-extrabold uppercase tracking-wide text-[#2d58a5] sm:text-3xl">Recent Orders</h2>
            </div>

            <div className={`${tableCardClassName} min-w-0`}>
              <div className={`${tableShellClassName} w-full`}>
              <table className={`${tableElementClassName} min-w-[980px] xl:min-w-[1100px]`}>
                <thead>
                  <tr className={tableHeaderRowClassName}>
                    <th className={tableHeaderCellClassName}>Order No.</th>
                    <th className={tableHeaderCellClassName}>Date &amp; Time</th>
                    <th className={tableHeaderCellClassName}>Order Name</th>
                    <th className={tableHeaderCellClassName}>Order Summary</th>
                    <th className={tableHeaderCellClassName}>Current Status</th>
                    <th className={tableHeaderCellCenterClassName}>File Type</th>
                    <th className={tableHeaderCellCenterClassName}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((row, idx) => (
                    <tr key={row.id} className={getTableBodyRowClassName(idx)}>
                      <td className={`${tableBodyCellClassName} font-semibold`}>{row.orderNumber}</td>
                      <td className={tableBodyCellClassName}>{row.dateTime}</td>
                      <td className={tableBodyCellClassName}>{row.orderName}</td>
                      <td className={tableBodyCellClassName}>{row.orderDetail}</td>
                      <td className={tableBodyCellClassName}>{row.status}</td>
                      <td className={tableBodyCellCenterClassName}>
                        {row.fileType === "email" ? (
                          <Mail className="mx-auto" size={30} color="#d93025" />
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
                            <FileText size={22} color="#6b7280" />
                            <span>{row.fileType}</span>
                          </div>
                        )}
                      </td>
                      <td className={tableBodyCellCenterClassName}>
                        <button
                          type="button"
                          onClick={() => onOpenDetails?.(row)}
                          className={`${tableActionButtonClassName} italic`}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {loading && !recentOrders.length ? (
                    <tr>
                      <td colSpan={7} className={tableEmptyCellClassName}>
                        Loading...
                      </td>
                    </tr>
                  ) : null}
                  {!loading && !recentOrders.length ? (
                    <tr>
                      <td colSpan={7} className={tableEmptyCellClassName}>
                        No recent orders found.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
