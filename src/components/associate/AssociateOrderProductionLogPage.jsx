import { useEffect, useState } from "react";
import { ArrowLeft, ListOrdered } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAssociateModule } from "../../context/AssociateModuleContext.jsx";
import AssociateProductionLogTimeline from "./AssociateProductionLogTimeline.jsx";

export default function AssociateOrderProductionLogPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const { fetchOrderDetails, orderLoading, sectionLoading } = useAssociateModule();
  const [order, setOrder] = useState(() => location.state?.order || null);
  const [isLoaded, setIsLoaded] = useState(Boolean(location.state?.order));

  useEffect(() => {
    let ignore = false;

    async function resolveOrder() {
      const data = await fetchOrderDetails(orderId);
      if (ignore) return;
      setOrder(data?.order || location.state?.order || null);
      setIsLoaded(true);
    }

    resolveOrder();

    return () => {
      ignore = true;
    };
  }, [fetchOrderDetails, location.state, orderId]);

  if (!isLoaded && (sectionLoading || orderLoading)) {
    return (
      <div className="px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-[28px] bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
          <div className="text-sm font-semibold text-slate-500">Loading production log...</div>
        </div>
      </div>
    );
  }

  if (isLoaded && !order) {
    return (
      <div className="px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-[28px] bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wide text-slate-900">Production Log</h1>
              <p className="mt-2 text-sm text-slate-500">This order could not be found.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/associate-member/book-order")}
              className="inline-flex items-center gap-2 rounded-full bg-[#2d58a5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#244887]"
            >
              <ArrowLeft size={16} />
              Back To Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#dfe3e8] px-4 py-8 sm:px-6 md:px-0">
      <div className="mx-auto max-w-7xl px-[2vw]">
        <div className="rounded-[28px] bg-[#eef1f5] shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
          <div className="px-5 py-5 sm:px-8 sm:py-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(`/dashboard/associate-member/book-order/details/${orderId}`, { state: { order } })}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d6dbe8] bg-white text-[#2d58a5] transition hover:bg-[#eef4ff]"
                aria-label="Back to order details"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#71809b]">
                  <ListOrdered size={14} className="text-[#7c4dff]" />
                  Tracking Log
                </div>
                <h1 className="mt-1 text-[28px] font-black text-[#1f2937] sm:text-[34px]">Order #{order?.orderNumber || "--"}</h1>
              </div>
            </div>
            <div className="rounded-full border border-[#d7dbe7] bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#4b5563] shadow-sm">
              {order?.currentStatus || order?.status || "--"}
            </div>
          </div>

          <div className="mt-6 rounded-[16px] border border-[#d9e4fb] bg-[#f5f8ff] p-4 shadow-sm">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#5b67ea]">Order Summary</div>
            <div className="mt-2 text-sm font-semibold leading-7 text-[#334155]">
              {order?.orderDetailsOverview || order?.orderDetail || "No order summary available."}
            </div>
          </div>

          <div className="mt-8">
            <AssociateProductionLogTimeline order={order} title="Tracking Log" showOrderNumber={false} />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
