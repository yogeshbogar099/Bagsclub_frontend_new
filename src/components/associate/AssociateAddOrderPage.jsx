import { useCallback, useEffect, useState } from "react";
import { FileText, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAssociateModule } from "../../context/AssociateModuleContext.jsx";
import OrderCarousel from "./OrderCarousel.jsx";
import NonWoven from "../../assets/images/NonWoven.png";
import PlasticBag from "../../assets/images/PlasticBag.png";
import HDPE from "../../assets/images/HDPE.png";
import PaperBag from "../../assets/images/PaperBag.png";
import CanvasBag from "../../assets/images/CanvasBag.png";
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

  return (
    <div className="w-full bg-[#e8e8e8] pb-10">
      <OrderCarousel />

      <section className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h1
            className="mb-5 text-3xl font-black uppercase tracking-tight text-black md:text-4xl"
            style={{ textShadow: "3px 4px 6px rgba(0, 0, 0, 0.25)" }}
          >
            List Of Printing Services
          </h1>

          <div
            className="grid justify-items-center gap-x-6 gap-y-7"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
          >
            {printingServiceCards.map((card) => (
              <button
                key={card.id}
                type="button"
                className="group w-full max-w-[210px] text-center"
                onClick={() => {
                  if (card.title === "NON-WOVEN BAG") {
                    navigate("/dashboard/associate-member/book-order/non-woven-bag");
                  }
                }}
              >
                <div className="overflow-hidden bg-white shadow-sm transition-transform duration-200 group-hover:-translate-y-1">
                  <div className="flex h-[180px] w-full items-center justify-center bg-gradient-to-br from-[#3b2417] via-[#5a3925] to-[#8b684b] p-3 sm:h-[200px] md:h-[220px]">
                    <img src={card.image} alt={card.title} className="h-full w-full object-contain object-center" />
                  </div>
                </div>
                <div className="mt-2 text-[14px] font-bold uppercase leading-5 text-[#2d58a5] md:text-[15px]">{card.title}</div>
              </button>
            ))}
          </div>

          <section className="mt-10">
            <div className="bg-white px-6 py-4 shadow-sm">
              <h2 className="text-center text-3xl font-extrabold uppercase tracking-wide text-[#2d58a5]">Recent Orders</h2>
            </div>

            <div className={tableCardClassName}>
              <div className={tableShellClassName}>
              <table className={`${tableElementClassName} min-w-[1100px]`}>
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
                          onClick={() => navigate(`/dashboard/associate-member/book-order/details/${row.id}`, { state: { order: row } })}
                          className={`${tableActionButtonClassName} italic`}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {sectionLoading && !recentOrders.length ? (
                    <tr>
                      <td colSpan={7} className={tableEmptyCellClassName}>
                        Loading...
                      </td>
                    </tr>
                  ) : null}
                  {!sectionLoading && !recentOrders.length ? (
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
