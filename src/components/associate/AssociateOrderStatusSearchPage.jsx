import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronsUpDown,
  Clock,
  FileText,
  Hash,
  ListFilter,
  Mail,
  Package,
  Printer,
  RotateCcw,
  Search,
  Sparkles,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAssociateModule } from "../../context/AssociateModuleContext.jsx";

const ORDER_STAGES = [
  {
    id: "order-booked",
    label: "Order Booked",
    matcher: (order) => {
      return Boolean(order);
    }
  },
  {
    id: "pending-file-verification",
    label: "Pending File Verification",
    matcher: (order) => {
      const s = String(order?.status || order?.currentStatusValue || "").toLowerCase().trim();
      const fo = String(order?.fileOption || "").toLowerCase().trim();
      return (
        s.includes("verification") ||
        s.includes("verify") ||
        s === "pending-verification" ||
        (s.includes("pending") && (fo.includes("verify") || fo.includes("manual")))
      );
    }
  },
  {
    id: "designing-started",
    label: "Designing Started",
    matcher: (order) => {
      const s = String(order?.status || order?.currentStatusValue || "").toLowerCase().trim();
      return s.includes("design") || s.includes("artwork");
    }
  },
  {
    id: "improper-order",
    label: "Improper Order",
    matcher: (order) => {
      const s = String(order?.status || order?.currentStatusValue || "").toLowerCase().trim();
      return s.includes("improper") || s.includes("issue") || s.includes("flagged") || s.includes("hold");
    }
  },
  {
    id: "file-uploaded",
    label: "File Uploaded",
    matcher: (order) => {
      const s = String(order?.status || order?.currentStatusValue || "").toLowerCase().trim();
      return (
        s.includes("uploaded") ||
        Boolean(order?.designFileName || order?.designFileUrl || order?.fileType === "email")
      );
    }
  },
  {
    id: "under-process",
    label: "Under Process",
    matcher: (order) => {
      const s = String(order?.status || order?.currentStatusValue || "").toLowerCase().trim();
      return s.includes("print") || s.includes("process") || s.includes("production");
    }
  },
  {
    id: "under-packing",
    label: "Under Packing",
    matcher: (order) => {
      const s = String(order?.status || order?.currentStatusValue || "").toLowerCase().trim();
      return s.includes("pack") || s.includes("packaging");
    }
  },
  {
    id: "dispatched",
    label: "Dispatched",
    matcher: (order) => {
      const s = String(order?.status || order?.currentStatusValue || "").toLowerCase().trim();
      return s.includes("dispatch") || s.includes("ship") || s.includes("deliver") || s.includes("complete");
    }
  },
  {
    id: "cancelled",
    label: "Cancelled",
    matcher: (order) => {
      const s = String(order?.status || order?.currentStatusValue || "").toLowerCase().trim();
      return s.includes("cancel") || s.includes("reject");
    }
  }
];

const DEFAULT_PRODUCTS = [
  "D-Cut Non-Woven Bag",
  "Loop Non-Woven Bag",
  "Box Non-Woven Bag",
  "Non-Woven Bag",
  "Paper Bag",
  "Plastic Bag",
  "HDPE Bag",
  "Canvas Bag"
];

function getTodayIso() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getStartOfMonthIso() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

function getStatusBadge(status) {
  const normalized = String(status || "").toLowerCase().trim();
  if (normalized.includes("complete") || normalized.includes("delivered")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        {status}
      </span>
    );
  }
  if (normalized.includes("print")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
        {status}
      </span>
    );
  }
  if (normalized.includes("pack") || normalized.includes("packaging")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
        {status}
      </span>
    );
  }
  if (normalized.includes("dispatch")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 border border-purple-200">
        <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
        {status}
      </span>
    );
  }
  if (normalized.includes("cancel")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
      {status || "Pending"}
    </span>
  );
}

export default function AssociateOrderStatusSearchPage({ searchType }) {
  const navigate = useNavigate();
  const { searchOrders, sectionLoading } = useAssociateModule();

  // Filter states
  const [filters, setFilters] = useState({
    orderNumber: "",
    status: "",
    fromDate: getStartOfMonthIso(),
    toDate: getTodayIso(),
    product: "",
    customerName: "",
    printingPress: ""
  });

  // Stage selection state (for order-stage view)
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [hasStageSearched, setHasStageSearched] = useState(false);

  // Date search state (for order-date view - false initially to hide table by default)
  const [hasDateSearched, setHasDateSearched] = useState(false);

  // Common order data & results state
  const [allOrders, setAllOrders] = useState([]);
  const [results, setResults] = useState({ items: [], summary: {}, meta: {} });
  const [hasSearched, setHasSearched] = useState(false);

  // Load orders for order-stage view
  const loadStageOrders = async () => {
    const data = await searchOrders({
      searchType: "order-stage",
      product: filters.product,
      customerName: filters.customerName
    });
    const items = Array.isArray(data?.items) ? data.items : [];
    setAllOrders(items);
    setResults(data || { items: [], summary: {}, meta: {} });
  };

  // Load orders for order-date view
  const loadDateOrders = async () => {
    setHasDateSearched(true);
    setHasSearched(true);
    const data = await searchOrders({
      searchType: "order-date",
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      printingPress: filters.printingPress
    });
    setResults(data || { items: [], summary: {}, meta: {} });
  };

  useEffect(() => {
    if (searchType === "order-stage") {
      loadStageOrders();
      setSelectedStageId(null);
      setHasStageSearched(false);
    } else if (searchType === "order-date") {
      setHasDateSearched(false);
      setResults({ items: [], summary: {}, meta: {} });
    }
  }, [searchType]);

  // Handle Order Number searches
  useEffect(() => {
    if (searchType !== "order-number") return;

    if (!filters.orderNumber.trim()) {
      setResults({ items: [], summary: {}, meta: {} });
      setHasSearched(false);
      return;
    }

    let timerId;

    async function runOrderNumberSearch() {
      setHasSearched(true);
      const data = await searchOrders({
        searchType: "order-number",
        orderNumber: filters.orderNumber
      });
      setResults(data || { items: [], summary: {}, meta: {} });
    }

    timerId = window.setTimeout(runOrderNumberSearch, 250);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [filters.orderNumber, searchOrders, searchType]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function handleReset() {
    setFilters({
      orderNumber: "",
      status: "",
      fromDate: getStartOfMonthIso(),
      toDate: getTodayIso(),
      product: "",
      customerName: "",
      printingPress: ""
    });
    setResults({ items: [], summary: {}, meta: {} });
    setHasSearched(false);
    setHasStageSearched(false);
    setSelectedStageId(null);
    setHasDateSearched(false);

    if (searchType === "order-stage") {
      loadStageOrders();
    }
  }

  function handleOrderStageSearchSubmit(e) {
    if (e) e.preventDefault();
    setHasStageSearched(true);
    if (!selectedStageId) {
      setSelectedStageId("order-booked");
    }
    loadStageOrders();
  }

  function handleStageClick(stageId) {
    setSelectedStageId(stageId);
    setHasStageSearched(true);
  }

  function handleDateSearchSubmit(e) {
    if (e) e.preventDefault();
    loadDateOrders();
  }

  // Calculate dynamic product options from known list + actual orders
  const productOptions = useMemo(() => {
    const set = new Set(DEFAULT_PRODUCTS);
    allOrders.forEach((o) => {
      if (o.bagName && o.bagName !== "--") set.add(o.bagName);
      if (o.orderName && o.orderName !== "--") set.add(o.orderName);
    });
    return Array.from(set);
  }, [allOrders]);

  // Filter orders by selected Product and Customer Name for stage view
  const baseFilteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      if (filters.product) {
        const pFilter = filters.product.toLowerCase().trim();
        const bName = String(order.bagName || "").toLowerCase();
        const oName = String(order.orderName || "").toLowerCase();
        const oDetail = String(order.orderDetail || "").toLowerCase();
        const matchesProduct =
          bName.includes(pFilter) || oName.includes(pFilter) || oDetail.includes(pFilter);
        if (!matchesProduct) return false;
      }

      if (filters.customerName) {
        const cFilter = filters.customerName.toLowerCase().trim();
        const cName = String(order.customerName || "").toLowerCase();
        const oName = String(order.orderName || "").toLowerCase();
        const matchesCustomer = cName.includes(cFilter) || oName.includes(cFilter);
        if (!matchesCustomer) return false;
      }

      return true;
    });
  }, [allOrders, filters.customerName, filters.product]);

  // Calculate counts for all 9 stages
  const stageCounts = useMemo(() => {
    const counts = {};
    ORDER_STAGES.forEach((stage) => {
      if (stage.id === "order-booked") {
        counts[stage.id] = baseFilteredOrders.length;
      } else {
        counts[stage.id] = baseFilteredOrders.filter((order) => stage.matcher(order)).length;
      }
    });
    return counts;
  }, [baseFilteredOrders]);

  // Get orders for currently selected stage
  const currentStageOrders = useMemo(() => {
    if (!selectedStageId) return [];
    const currentStage = ORDER_STAGES.find((s) => s.id === selectedStageId);
    if (!currentStage || currentStage.id === "order-booked") {
      return baseFilteredOrders;
    }
    return baseFilteredOrders.filter((order) => currentStage.matcher(order));
  }, [baseFilteredOrders, selectedStageId]);

  // Filtered orders for date search
  const dateFilteredOrders = useMemo(() => {
    const items = Array.isArray(results?.items) ? results.items : [];
    if (!filters.printingPress.trim()) return items;
    const pressQuery = filters.printingPress.toLowerCase().trim();
    return items.filter((item) => {
      const press = String(item.printingPress || "").toLowerCase();
      const oName = String(item.orderName || "").toLowerCase();
      return press.includes(pressQuery) || oName.includes(pressQuery);
    });
  }, [filters.printingPress, results.items]);

  // ==========================================
  // VIEW 1: Search by Order Date (Matches Reference Image)
  // ==========================================
  if (searchType === "order-date") {
    const showDateTable = Boolean(hasDateSearched && !sectionLoading && dateFilteredOrders.length > 0);
    const showDateNoRecords = Boolean(hasDateSearched && !sectionLoading && dateFilteredOrders.length === 0);

    return (
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        {/* Date Search Card matching reference image */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
          {/* Header Title */}
          <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-[#2a5298] tracking-wide">
            ORDER HISTORY SORTED BY DATE
          </h1>

          {/* Form Controls */}
          <form
            onSubmit={handleDateSearchSubmit}
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr_auto] gap-3 sm:gap-4 items-end"
          >
            {/* Select From Date */}
            <div>
              <label htmlFor="select-from-date" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Select From Date
              </label>
              <input
                id="select-from-date"
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleInputChange}
                className="h-[40px] w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#2d58a5] focus:ring-1 focus:ring-[#2d58a5]"
              />
            </div>

            {/* To Date */}
            <div>
              <label htmlFor="to-date-input" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                To Date
              </label>
              <input
                id="to-date-input"
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleInputChange}
                className="h-[40px] w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#2d58a5] focus:ring-1 focus:ring-[#2d58a5]"
              />
            </div>

            {/* Search By Printing Press */}
            <div>
              <label htmlFor="printing-press-input" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Search By Printing Press
              </label>
              <input
                id="printing-press-input"
                type="text"
                name="printingPress"
                value={filters.printingPress}
                onChange={handleInputChange}
                placeholder="search"
                className="h-[40px] w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#2d58a5] focus:ring-1 focus:ring-[#2d58a5]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={sectionLoading}
                className="inline-flex h-[40px] items-center justify-center rounded bg-[#dc3545] hover:bg-[#c82333] px-6 text-sm font-bold text-white shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-70"
              >
                {sectionLoading ? "..." : "Show"}
              </button>
              {(filters.printingPress || hasDateSearched) && (
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset date filters"
                  className="inline-flex h-[40px] items-center justify-center rounded border border-slate-300 bg-slate-50 px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                >
                  <RotateCcw size={15} />
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Loading Indicator */}
        {sectionLoading && hasDateSearched && (
          <section className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#2a5298] border-t-transparent"></div>
              <p className="text-sm font-semibold text-slate-700">Loading order history...</p>
            </div>
          </section>
        )}

        {/* No Records Found State */}
        {showDateNoRecords && (
          <section className="rounded-2xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-sm text-center animate-in fade-in duration-300">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
              <Package size={28} />
            </div>
            <h3 className="mt-4 text-base sm:text-lg font-black text-slate-900">No Orders Found</h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              No orders found for the selected date range ({filters.fromDate} to {filters.toDate})
              {filters.printingPress ? ` and printing press "${filters.printingPress}"` : ""}.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <RotateCcw size={14} /> Reset Filter
            </button>
          </section>
        )}

        {/* Order Records Table (Hidden by default, shown upon date search) */}
        {showDateTable && (
          <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2a5298]/10 text-[#2a5298]">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900">
                    Order Records
                  </h2>
                  <p className="text-xs font-bold text-slate-500">
                    {dateFilteredOrders.length} {dateFilteredOrders.length === 1 ? "Order" : "Orders"} Found ({filters.fromDate} to {filters.toDate})
                  </p>
                </div>
              </div>

              {filters.printingPress && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                  <Printer size={13} /> Press: {filters.printingPress}
                </span>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60 text-[12px] font-black uppercase tracking-wider text-slate-600">
                    <th className="py-3.5 px-6">Order No.</th>
                    <th className="py-3.5 px-4">Date &amp; Time</th>
                    <th className="py-3.5 px-4">Printing Press</th>
                    <th className="py-3.5 px-4">Customer Name</th>
                    <th className="py-3.5 px-4">Order Name</th>
                    <th className="py-3.5 px-4">Order Summary</th>
                    <th className="py-3.5 px-4">Current Status</th>
                    <th className="py-3.5 px-4 text-center">File Type</th>
                    <th className="py-3.5 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {dateFilteredOrders.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <span className="inline-flex items-center gap-1">
                          <span className="text-[#2a5298]">#</span>
                          {row.orderNumber}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 text-xs sm:text-sm whitespace-nowrap">{row.dateTime}</td>
                      <td className="py-4 px-4 text-slate-700 font-medium">{row.printingPress || "--"}</td>
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        {row.customerName && row.customerName !== "--" ? (
                          <div className="flex items-center gap-1.5">
                            <User size={14} className="text-slate-400" />
                            <span>{row.customerName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">--</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">{row.orderName || row.bagName}</td>
                      <td className="py-4 px-4 text-slate-600 max-w-xs truncate">{row.orderDetail}</td>
                      <td className="py-4 px-4">{getStatusBadge(row.status)}</td>
                      <td className="py-4 px-4 text-center">
                        {row.fileType === "email" ? (
                          <Mail className="mx-auto" size={22} color="#d93025" />
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700">
                            <FileText size={16} className="text-slate-500" />
                            <span>{row.fileType}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard/associate-member/book-order/details/${row.id}`, { state: { order: row } })}
                          className="inline-flex items-center justify-center rounded-lg bg-[#2a5298] hover:bg-[#1e3c72] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden overflow-x-auto p-2">
              <table className="w-full min-w-[650px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-600">
                    <th className="py-2.5 px-3">Order No.</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Press</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {dateFilteredOrders.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-bold text-slate-900">
                        <span className="text-[#2a5298]">#</span>
                        {row.orderNumber}
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{row.dateTime}</td>
                      <td className="py-3 px-3 font-medium text-slate-700">{row.printingPress || "--"}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{row.customerName || "--"}</td>
                      <td className="py-3 px-3">{getStatusBadge(row.status)}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard/associate-member/book-order/details/${row.id}`, { state: { order: row } })}
                          className="rounded bg-[#2a5298] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: Search by Order Stage (Matches Reference Image)
  // ==========================================
  if (searchType === "order-stage") {
    const activeStageObj = ORDER_STAGES.find((s) => s.id === selectedStageId);
    const showStageTable = Boolean(hasStageSearched && selectedStageId && currentStageOrders.length > 0);
    const showStageNoRecords = Boolean(hasStageSearched && selectedStageId && currentStageOrders.length === 0 && !sectionLoading);

    return (
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        {/* Main Card */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
          {/* Header Title */}
          <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-[#2a5298] tracking-wide">
            ORDER STATUS
          </h1>

          {/* Filter Form */}
          <form
            onSubmit={handleOrderStageSearchSubmit}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-end"
          >
            {/* Select Product */}
            <div className="w-full">
              <label htmlFor="select-product-input" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Select Product
              </label>
              <select
                id="select-product-input"
                name="product"
                value={filters.product}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                className="h-[40px] w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#2d58a5] focus:ring-1 focus:ring-[#2d58a5] cursor-pointer"
              >
                <option value="">--All Products--</option>
                {productOptions.map((prod) => (
                  <option key={prod} value={prod}>
                    {prod}
                  </option>
                ))}
              </select>
            </div>

            {/* Enter Customer Name */}
            <div className="w-full">
              <label htmlFor="customer-name-input" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Enter Customer Name
              </label>
              <div className="flex gap-2">
                <input
                  id="customer-name-input"
                  type="text"
                  name="customerName"
                  value={filters.customerName}
                  onChange={handleInputChange}
                  placeholder="Search All Customers..."
                  className="h-[40px] flex-1 rounded border border-slate-300 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#2d58a5] focus:ring-1 focus:ring-[#2d58a5]"
                />
                <button
                  type="submit"
                  disabled={sectionLoading}
                  className="inline-flex h-[40px] items-center justify-center rounded bg-[#28a745] hover:bg-[#218838] px-5 text-sm font-bold text-white shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-70 shrink-0"
                >
                  {sectionLoading ? "..." : "Search"}
                </button>
                {(filters.product || filters.customerName || selectedStageId) && (
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Reset filters"
                    className="inline-flex h-[40px] items-center justify-center rounded border border-slate-300 bg-slate-50 px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition shrink-0 cursor-pointer"
                  >
                    <RotateCcw size={15} />
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* 9 Order Stage Summary Links */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {ORDER_STAGES.map((stage) => {
                const isSelected = selectedStageId === stage.id;
                const count = stageCounts[stage.id] ?? 0;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => handleStageClick(stage.id)}
                    className={`group text-sm sm:text-[15px] font-bold transition-all text-left cursor-pointer ${
                      isSelected
                        ? "text-[#8b0000] underline decoration-2 underline-offset-4 scale-105"
                        : "text-[#8b0000] hover:underline hover:opacity-85"
                    }`}
                  >
                    <span>{stage.label}</span>{" "}
                    <span className="font-bold text-[#8b0000]">
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Loading Indicator */}
        {sectionLoading && hasStageSearched && (
          <section className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#2a5298] border-t-transparent"></div>
              <p className="text-sm font-semibold text-slate-700">Loading orders...</p>
            </div>
          </section>
        )}

        {/* No Records Found State */}
        {showStageNoRecords && (
          <section className="rounded-2xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-sm text-center animate-in fade-in duration-300">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
              <Package size={28} />
            </div>
            <h3 className="mt-4 text-base sm:text-lg font-black text-slate-900">No Matching Orders Found</h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              No orders found for stage <strong>&quot;{activeStageObj?.label}&quot;</strong>
              {filters.product ? ` and product "${filters.product}"` : ""}
              {filters.customerName ? ` and customer "${filters.customerName}"` : ""}.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <RotateCcw size={14} /> Clear Filter
            </button>
          </section>
        )}

        {/* Selected Stage Order Table */}
        {showStageTable && !sectionLoading && (
          <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2a5298]/10 text-[#2a5298]">
                  <Package size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900">
                    {activeStageObj?.label} Orders
                  </h2>
                  <p className="text-xs font-bold text-slate-500">
                    {currentStageOrders.length} {currentStageOrders.length === 1 ? "Order" : "Orders"} Available
                  </p>
                </div>
              </div>

              {filters.product && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                  Product: {filters.product}
                </span>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60 text-[12px] font-black uppercase tracking-wider text-slate-600">
                    <th className="py-3.5 px-6">Order No.</th>
                    <th className="py-3.5 px-4">Date &amp; Time</th>
                    <th className="py-3.5 px-4">Customer Name</th>
                    <th className="py-3.5 px-4">Order / Bag Name</th>
                    <th className="py-3.5 px-4">Order Summary</th>
                    <th className="py-3.5 px-4">Current Status</th>
                    <th className="py-3.5 px-4 text-center">File Type</th>
                    <th className="py-3.5 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {currentStageOrders.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <span className="inline-flex items-center gap-1">
                          <span className="text-[#2a5298]">#</span>
                          {row.orderNumber}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 text-xs sm:text-sm whitespace-nowrap">{row.dateTime}</td>
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        {row.customerName && row.customerName !== "--" ? (
                          <div className="flex items-center gap-1.5">
                            <User size={14} className="text-slate-400" />
                            <span>{row.customerName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">--</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">{row.orderName || row.bagName}</td>
                      <td className="py-4 px-4 text-slate-600 max-w-xs truncate">{row.orderDetail}</td>
                      <td className="py-4 px-4">{getStatusBadge(row.status)}</td>
                      <td className="py-4 px-4 text-center">
                        {row.fileType === "email" ? (
                          <Mail className="mx-auto" size={22} color="#d93025" />
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700">
                            <FileText size={16} className="text-slate-500" />
                            <span>{row.fileType}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard/associate-member/book-order/details/${row.id}`, { state: { order: row } })}
                          className="inline-flex items-center justify-center rounded-lg bg-[#2a5298] hover:bg-[#1e3c72] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet View */}
            <div className="block md:hidden overflow-x-auto p-2">
              <table className="w-full min-w-[650px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-600">
                    <th className="py-2.5 px-3">Order No.</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {currentStageOrders.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-bold text-slate-900">
                        <span className="text-[#2a5298]">#</span>
                        {row.orderNumber}
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{row.dateTime}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{row.customerName || "--"}</td>
                      <td className="py-3 px-3 font-medium text-slate-800 max-w-[120px] truncate">{row.orderName || row.bagName}</td>
                      <td className="py-3 px-3">{getStatusBadge(row.status)}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard/associate-member/book-order/details/${row.id}`, { state: { order: row } })}
                          className="rounded bg-[#2a5298] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 3: Search by Order Number (Matches Reference Image)
  // ==========================================
  const hasMatchingRecords = Boolean(results?.items && results.items.length > 0);
  const showNoRecords = Boolean(!sectionLoading && filters.orderNumber.trim() && hasSearched && !hasMatchingRecords);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Primary Reference Card: ORDER LOOKUP */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-md transition-shadow hover:shadow-lg">
        {/* Top Purple Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#a855f7]" />

        <div className="px-4 py-8 sm:px-8 sm:py-10">
          {/* Card Title */}
          <h1 className="text-center text-xl sm:text-2xl font-black uppercase tracking-wider text-[#1e1b4b]">
            ORDER LOOKUP
          </h1>

          {/* Search Form Controls */}
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center justify-center">
            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-3.5 max-w-xl">
              <div className="relative w-full flex-1">
                <input
                  type="text"
                  name="orderNumber"
                  value={filters.orderNumber}
                  onChange={handleInputChange}
                  placeholder="Enter Order ID (e.g. 102934)"
                  className="h-[52px] w-full rounded-2xl border-2 border-[#8b5cf6] bg-white pl-5 pr-12 text-sm sm:text-base font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none transition-all focus:border-[#7c3aed] focus:ring-4 focus:ring-[#8b5cf6]/15"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                  <ChevronsUpDown size={20} strokeWidth={2.5} />
                </div>
              </div>

              <button
                type="submit"
                disabled={sectionLoading}
                className="inline-flex h-[52px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] px-7 sm:px-8 text-sm sm:text-base font-bold text-white shadow-md shadow-purple-500/25 transition-all hover:opacity-95 active:scale-[0.98] sm:w-auto shrink-0 cursor-pointer disabled:opacity-70"
              >
                {sectionLoading ? "Searching..." : "Track Order"}
              </button>

              {filters.orderNumber && (
                <button
                  type="button"
                  onClick={handleReset}
                  title="Clear search"
                  className="inline-flex h-[52px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Loading Indicator */}
      {sectionLoading && filters.orderNumber.trim() && (
        <section className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-12 shadow-sm text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#7c3aed] border-t-transparent"></div>
            <p className="text-sm sm:text-base font-bold text-slate-700">Searching orders...</p>
            <p className="text-xs text-slate-400">Fetching matching records from the server</p>
          </div>
        </section>
      )}

      {/* No Records Found Card */}
      {showNoRecords && (
        <section className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <Package size={28} />
          </div>
          <h3 className="mt-4 text-base sm:text-lg font-black text-slate-900">No Matching Orders Found</h3>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            No records found matching Order ID &quot;{filters.orderNumber}&quot;. Please verify the order number and try again.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <RotateCcw size={14} /> Clear Search
          </button>
        </section>
      )}

      {/* Matching Records Section */}
      {hasMatchingRecords && !sectionLoading && (
        <section className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-sm animate-in fade-in duration-300">
          <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/80 px-4 py-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#7c3aed]/10 text-[#7c3aed]">
                <Search size={16} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900">
                  Matching Records
                </h2>
                <p className="text-xs font-bold text-slate-500">
                  {results.items.length} {results.items.length === 1 ? "record" : "records"} found
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-200 shadow-2xs">
                <Package size={14} className="text-slate-500" />
                <span>Total:</span>
                <span className="font-extrabold text-slate-900">{results?.summary?.total ?? results.items.length}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 border border-amber-200 shadow-2xs">
                <Clock size={14} className="text-amber-600" />
                <span>Pending:</span>
                <span className="font-extrabold text-amber-900">{results?.summary?.pending ?? 0}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200 shadow-2xs">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Completed:</span>
                <span className="font-extrabold text-emerald-900">{results?.summary?.completed ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[12px] font-black uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-6">Order No.</th>
                  <th className="py-3.5 px-4">Date &amp; Time</th>
                  <th className="py-3.5 px-4">Order Name</th>
                  <th className="py-3.5 px-4">Order Summary</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4 text-center">File Type</th>
                  <th className="py-3.5 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {results.items.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <span className="inline-flex items-center gap-1">
                        <span className="text-[#7c3aed]">#</span>
                        {row.orderNumber}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-xs sm:text-sm whitespace-nowrap">{row.dateTime}</td>
                    <td className="py-4 px-4 font-semibold text-slate-800">{row.orderName}</td>
                    <td className="py-4 px-4 text-slate-600 max-w-xs truncate">{row.orderDetail}</td>
                    <td className="py-4 px-4">{getStatusBadge(row.status)}</td>
                    <td className="py-4 px-4 text-center">
                      {row.fileType === "email" ? (
                        <Mail className="mx-auto" size={24} color="#d93025" />
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700">
                          <FileText size={18} className="text-slate-500" />
                          <span>{row.fileType}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/associate-member/book-order/details/${row.id}`, { state: { order: row } })}
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#7c3aed] active:scale-95 cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Card View */}
          <div className="block md:hidden p-4 space-y-3">
            {results.items.map((row) => (
              <div
                key={row.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="font-extrabold text-slate-900 text-sm">
                    <span className="text-[#7c3aed]">#</span> {row.orderNumber}
                  </div>
                  <div>{getStatusBadge(row.status)}</div>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">Order Name:</span>
                    <span className="font-semibold text-slate-800">{row.orderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">Date:</span>
                    <span className="text-slate-700">{row.dateTime}</span>
                  </div>
                  {row.orderDetail && (
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-400">Summary:</span>
                      <span className="text-slate-700 text-right truncate max-w-[180px]">{row.orderDetail}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-slate-500">
                    {row.fileType === "email" ? (
                      <span className="inline-flex items-center gap-1 font-bold text-red-600">
                        <Mail size={16} /> Email
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                        <FileText size={16} className="text-slate-400" /> {row.fileType}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/associate-member/book-order/details/${row.id}`, { state: { order: row } })}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#7c3aed] active:scale-95 cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
