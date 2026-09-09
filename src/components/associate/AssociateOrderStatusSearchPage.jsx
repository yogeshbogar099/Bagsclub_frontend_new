import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronsUpDown,
  Clock,
  Download,
  FileImage,
  FileText,
  FolderOpen,
  Hash,
  ListFilter,
  ListOrdered,
  Mail,
  Package,
  Printer,
  RotateCcw,
  Search,
  Sparkles,
  Tag,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAssociateModule } from "../../context/AssociateModuleContext.jsx";
import RecentOrdersTable from "../shared-order/RecentOrdersTable.jsx";

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

const DETAIL_CARD_COLOR_SCHEMES = [
  { bg: "bg-blue-50/90 hover:bg-blue-50", border: "border-blue-200/90", label: "text-blue-700", value: "text-blue-950" },
  { bg: "bg-emerald-50/90 hover:bg-emerald-50", border: "border-emerald-200/90", label: "text-emerald-700", value: "text-emerald-950" },
  { bg: "bg-purple-50/90 hover:bg-purple-50", border: "border-purple-200/90", label: "text-purple-700", value: "text-purple-950" },
  { bg: "bg-amber-50/90 hover:bg-amber-50", border: "border-amber-200/90", label: "text-amber-800", value: "text-amber-950" },
  { bg: "bg-rose-50/90 hover:bg-rose-50", border: "border-rose-200/90", label: "text-rose-700", value: "text-rose-950" },
  { bg: "bg-cyan-50/90 hover:bg-cyan-50", border: "border-cyan-200/90", label: "text-cyan-800", value: "text-cyan-950" },
  { bg: "bg-indigo-50/90 hover:bg-indigo-50", border: "border-indigo-200/90", label: "text-indigo-700", value: "text-indigo-950" },
  { bg: "bg-orange-50/90 hover:bg-orange-50", border: "border-orange-200/90", label: "text-orange-800", value: "text-orange-950" }
];

function isLikelyImageUrl(url = "") {
  const safe = String(url);
  if (safe.startsWith("data:image/")) return true;
  return /\.(png|jpe?g|webp|gif)$/i.test(safe.split("?")[0]);
}

function isLikelyPdfUrl(url = "") {
  const safe = String(url);
  if (safe.startsWith("data:application/pdf")) return true;
  return /\.pdf$/i.test(safe.split("?")[0]);
}

function getDesignExtension(fileName = "", fileType = "", fileUrl = "") {
  const explicitType = String(fileType || "").trim();
  if (explicitType) return explicitType.toUpperCase();
  const safeName = String(fileName || "").trim();
  if (safeName.includes(".")) return safeName.split(".").pop().trim().toUpperCase();
  const safeUrl = String(fileUrl || "").trim().split("?")[0];
  if (safeUrl.includes(".")) return safeUrl.split(".").pop().trim().toUpperCase();
  return "";
}

async function downloadFile(url, fileName) {
  const safeUrl = String(url || "").trim();
  if (!safeUrl) return;
  try {
    const response = await fetch(safeUrl);
    if (!response.ok) {
      window.open(safeUrl, "_blank", "noopener,noreferrer");
      return;
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = fileName || "design-file";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  } catch (_error) {
    window.open(safeUrl, "_blank", "noopener,noreferrer");
  }
}

function getStatusBadgeClass(statusLabel = "") {
  const normalized = String(statusLabel || "").toLowerCase();
  if (normalized.includes("dispatch")) return "border-[#cfd1ff] bg-[#f3f3ff] text-[#5b67ea]";
  if (normalized.includes("print")) return "border-[#ffe3b3] bg-[#fff7e7] text-[#d97706]";
  if (normalized.includes("pack")) return "border-[#ddd6fe] bg-[#f5f3ff] text-[#7c3aed]";
  if (normalized.includes("complete")) return "border-[#b7f0d0] bg-[#ecfdf5] text-[#059669]";
  if (normalized.includes("cancel") || normalized.includes("reject")) return "border-[#fecaca] bg-[#fff1f2] text-[#dc2626]";
  return "border-[#d7dbe7] bg-white text-[#4b5563]";
}

function formatCurrency(value) {
  return Number(value || 0).toFixed(2);
}

function getShortMemberId(entity) {
  return entity?.id ? String(entity.id).slice(-5).toUpperCase() : "";
}

function buildMemberLabel(entity, fallbackText) {
  if (!entity) return fallbackText;
  const primaryLabel = entity.businessName || entity.name || fallbackText;
  const shortId = getShortMemberId(entity);
  return shortId ? `${primaryLabel} (MID - ${shortId})` : primaryLabel;
}

function InlineOrderDetails({ order, navigate }) {
  if (!order) return null;

  const orderId = order.id || order._id || order.orderNumber;
  const displayStatus = order.currentStatus || order.status || "Pending";
  const statusBadgeClass = getStatusBadgeClass(displayStatus);
  const detailSummary = order.orderDetailsOverview || order.orderDetail || order.orderName || "--";
  const canPreview = Boolean(order.designFileUrl);
  const canDownload = Boolean(order.designFileUrl);
  const textColorsValue = Array.isArray(order.textColors) && order.textColors.length ? order.textColors.join(", ") : "--";
  const designExtension = getDesignExtension(order.designFileName, order.designFileType, order.designFileUrl);
  const isPdfDesign = designExtension === "PDF" || isLikelyPdfUrl(order.designFileUrl);
  const fileSourceLabel = order.designFileSource || (order.designSubmissionSource === "email" || order.fileType === "email" ? "Submitted By Email" : order.fileOption || "Uploaded Design File");
  const orderByLabel = buildMemberLabel(order.placedByUser, order.customerName || "--");
  const orderForLabel = order.assignedAdmin
    ? buildMemberLabel(order.assignedAdmin, order.assignedAdmin.businessName || order.assignedAdmin.name || "--")
    : order.assignedAssociateMember
    ? buildMemberLabel(order.assignedAssociateMember, order.assignedAssociateMember.businessName || "--")
    : "Assignment Pending";

  const discountAmount = (() => {
    const storedDiscount = Number(order.pdfDiscountAmount);
    return Number.isFinite(storedDiscount) && storedDiscount > 0 ? storedDiscount : 0;
  })();

  const totalAmount = (() => {
    const storedBaseAmount = Number(order.basePayableAmount || 0);
    if (storedBaseAmount > 0) return storedBaseAmount;
    const debitAmount = Number(order.walletDebitAmount || 0);
    if (debitAmount > 0) return debitAmount + discountAmount;
    return 0;
  })();

  const finalPayableAmount = (() => {
    const debitAmount = Number(order.walletDebitAmount || 0);
    if (debitAmount > 0) return debitAmount;
    if (totalAmount > 0) return Math.max(totalAmount - discountAmount, 0);
    return 0;
  })();

  const validPdfDiscountLabel = `₹${formatCurrency(discountAmount)} Discount`;
  const invoiceNumber = (() => {
    if (order.invoiceNumber && order.invoiceNumber !== "--") return order.invoiceNumber;
    if (order.orderDateTime || order.dateTime || order.createdAt || order.orderNumber) {
      const dateSource = order.orderDateTime || order.dateTime || order.createdAt;
      const d = dateSource ? new Date(dateSource) : new Date();
      const validDate = !Number.isNaN(d.getTime()) ? d : new Date();
      const year = validDate.getFullYear();
      const month = String(validDate.getMonth() + 1).padStart(2, "0");
      const day = String(validDate.getDate()).padStart(2, "0");
      const dateStr = `${year}${month}${day}`;
      const num = order.orderNumber ? String(order.orderNumber % 1000 || 1).padStart(3, "0") : "001";
      return `INV-${dateStr}-${num}`;
    }
    return "--";
  })();

  const orderInfoRows = [
    { label: "Bag Type", value: order.bagName || "--" },
    { label: "Product Type", value: order.orderName || "--" },
    { label: "Quantity", value: order.quantity || 0 },
    { label: "Bag Size", value: order.bagSize || "--" },
    { label: "Bag Color", value: order.bagColor || "--" },
    { label: "Print Side", value: order.printSide || "--" },
    { label: "Text Color Type", value: order.textColorType || "--" },
    { label: "Text Colors", value: textColorsValue }
  ];

  const specificationRows = [
    { label: "Order By", value: orderByLabel, accent: "text-[#7c3aed]" },
    { label: "Order For", value: orderForLabel },
    { label: "Delivery Type", value: order.deliveryOption || "--" },
    { label: "Valid PDF", value: validPdfDiscountLabel, accent: isPdfDesign ? "text-[#059669]" : "text-[#64748b]" },
    { label: "Order Date", value: order.orderDateTime || order.dateTime || "--" },
    { label: "Total Amount", value: formatCurrency(totalAmount), accent: "text-[#111827]" },
    { label: "Final Payable", value: formatCurrency(finalPayableAmount), accent: "text-[#10b981]" },
    { label: "Selling Price", value: formatCurrency(order.sellingPrice || 0), accent: "text-[#111827]" },
    { label: "Job / Plate Charges", value: formatCurrency(order.jobPlateCharges || 0) },
    { label: "Invoice Number", value: invoiceNumber, accent: "text-[#5b67ea]" }
  ];

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[#eef1f5] shadow-lg animate-in fade-in duration-300">
      <div className="px-5 py-5 sm:px-8 sm:py-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#71809b]">Order</span>
              <h2 className="text-[28px] font-black text-[#1f2937] sm:text-[34px]">#{order.orderNumber}</h2>
            </div>
          </div>
          <div className={`rounded-full border px-7 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-sm ${statusBadgeClass}`}>
            {displayStatus}
          </div>
        </div>

        <div className="mt-6 rounded-[16px] border border-[#efd4df] bg-[#f8eaf0] p-4 shadow-sm">
          <div className="flex items-start gap-4 rounded-[14px] border border-[#efd4df] bg-[#f9eef3] px-3 py-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-white text-[#d14b7c] shadow-sm">
              <Tag size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#d14b7c]">Product &amp; Details</p>
              <p className="mt-1 text-sm font-extrabold leading-7 text-[#8b1e4b] sm:text-[17px]">{detailSummary}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {orderInfoRows.map((row, index) => {
              const scheme = DETAIL_CARD_COLOR_SCHEMES[index % DETAIL_CARD_COLOR_SCHEMES.length];
              return (
                <div
                  key={row.label}
                  className={`rounded-[14px] border ${scheme.border} ${scheme.bg} px-4 py-3 shadow-xs transition-colors`}
                >
                  <div className={`text-[11px] font-black uppercase tracking-[0.12em] ${scheme.label}`}>{row.label}</div>
                  <div className={`mt-1 text-sm font-extrabold leading-6 ${scheme.value}`}>{row.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.35fr_0.9fr] xl:items-start">
          <div className="min-h-[380px]">
            <div className="mb-5 flex items-center gap-3">
              <FolderOpen size={18} className="text-[#7c4dff]" />
              <h3 className="text-[18px] font-black uppercase tracking-tight text-[#1f2937]">Attached Assets</h3>
            </div>

            <div className="rounded-[24px] border border-[#dde3ee] bg-[#f4f6fa] p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 pb-4">
                <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#2d58a5]">
                  {fileSourceLabel}
                </span>
                <span className="rounded-full bg-[#f4f6fa] px-3 py-1 text-xs font-semibold text-slate-600">
                  {order.designFileName || order.designFileType || "No file name available"}
                </span>
              </div>

              <div className="mt-2 flex min-h-[360px] items-center justify-center rounded-[20px] bg-[#f4f6fa] p-2">
                {canPreview && isLikelyImageUrl(order.designFileUrl) ? (
                  <img
                    src={order.designFileUrl}
                    alt={order.designFileName || "Design preview"}
                    className="max-h-[480px] w-full rounded-[18px] object-contain"
                  />
                ) : null}

                {canPreview && isLikelyPdfUrl(order.designFileUrl) ? (
                  <iframe title="Design preview" src={order.designFileUrl} className="h-[480px] w-full rounded-[18px] border border-[#dbe4f0] bg-white" />
                ) : null}

                {!canPreview ? (
                  <div className="flex h-full min-h-[300px] w-full flex-col items-center justify-center rounded-[18px] border border-dashed border-[#cfd7e3] text-center text-slate-500">
                    <FileImage size={46} className="text-[#c3cede]" />
                    <p className="mt-4 text-base font-semibold text-slate-700">No attached asset available</p>
                    <p className="mt-2 max-w-md text-sm leading-6">Upload preview is not available for this order yet.</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <aside className="flex flex-col">
            <div className="mb-5 flex items-center gap-3">
              <ListOrdered size={18} className="text-[#7c4dff]" />
              <h3 className="text-[18px] font-black uppercase tracking-tight text-[#1f2937]">Order Specifications</h3>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-[#dde3ee] bg-[#f8fafc] shadow-sm">
              {specificationRows.map((row, index) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-1 gap-2 border-b border-[#e5eaf2] px-5 py-4 sm:grid-cols-[145px_1fr] sm:items-center ${
                    index === specificationRows.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <div className="text-[13px] font-semibold text-[#71809b]">{row.label}</div>
                  {row.label === "Invoice Number" && row.value !== "--" ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/associate-member/book-order/details/${orderId}/invoice`, { state: { order } })}
                      className="inline-flex items-center gap-1.5 font-extrabold text-[#5b67ea] underline underline-offset-2 transition hover:text-[#3f4bbf] focus:outline-none sm:ml-auto cursor-pointer"
                      title="Click to view Tax Invoice Page"
                    >
                      <span>{row.value}</span>
                      <FileText size={15} />
                    </button>
                  ) : (
                    <div className={`text-sm font-extrabold sm:text-right ${row.accent || "text-[#1f2937]"}`}>{row.value}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => navigate(`/dashboard/associate-member/book-order/details/${orderId}/production-log`, { state: { order } })}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6d5efc] to-[#a855f7] px-4 py-3 text-xs font-bold text-white shadow-[0_10px_24px_rgba(139,92,246,0.24)] transition hover:opacity-95 cursor-pointer"
              >
                <ListOrdered size={15} />
                Production Log
              </button>
              <button
                type="button"
                disabled={!canPreview}
                onClick={() => window.open(order.designFileUrl, "_blank", "noopener,noreferrer")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#334155] px-4 py-3 text-xs font-bold text-white shadow-[0_10px_24px_rgba(51,65,85,0.24)] transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {order.designSubmissionSource === "email" ? <Mail size={15} /> : <FileText size={15} />}
                File History
              </button>
              <button
                type="button"
                disabled={!canDownload}
                onClick={() => downloadFile(order.designFileUrl, order.designFileName || "design-file")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-4 py-3 text-xs font-bold text-white shadow-[0_10px_24px_rgba(239,68,68,0.22)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                <Download size={15} />
                Download PDF
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

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
  const [selectedStageId, setSelectedStageId] = useState("order-booked");
  const [hasStageSearched, setHasStageSearched] = useState(true);

  // Date search state (for order-date view - false initially to hide table by default)
  const [hasDateSearched, setHasDateSearched] = useState(false);

  // Common order data & results state
  const [allOrders, setAllOrders] = useState([]);
  const [results, setResults] = useState({ items: [], summary: {}, meta: {} });
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

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
      setSelectedStageId("order-booked");
      setHasStageSearched(true);
    } else if (searchType === "order-date") {
      setHasDateSearched(false);
      setResults({ items: [], summary: {}, meta: {} });
    }
  }, [searchType]);

  // Handle Order Number searches inline without page navigation
  useEffect(() => {
    if (searchType !== "order-number") return;

    if (!filters.orderNumber.trim()) {
      setResults({ items: [], summary: {}, meta: {} });
      setHasSearched(false);
      setSelectedOrderIndex(0);
      return;
    }

    let timerId;

    async function runOrderNumberSearch() {
      const queryStr = filters.orderNumber.trim();
      if (!queryStr) return;

      setHasSearched(true);
      const data = await searchOrders({
        searchType: "order-number",
        orderNumber: queryStr
      });

      setResults(data || { items: [], summary: {}, meta: {} });
      setSelectedOrderIndex(0);
    }

    timerId = window.setTimeout(runOrderNumberSearch, 300);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [filters.orderNumber, searchOrders, searchType]);

  const handleOrderNumberSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    const queryStr = filters.orderNumber.trim();
    if (!queryStr) return;

    setHasSearched(true);
    const data = await searchOrders({
      searchType: "order-number",
      orderNumber: queryStr
    });

    setResults(data || { items: [], summary: {}, meta: {} });
    setSelectedOrderIndex(0);
  };

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
    if (name === "orderNumber") {
      setSelectedOrderIndex(0);
    }
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
    setHasStageSearched(true);
    setSelectedStageId("order-booked");
    setHasDateSearched(false);
    setSelectedOrderIndex(0);

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
  // VIEW 1: Search by Order Date (Reuses RecentOrdersTable)
  // ==========================================
  if (searchType === "order-date") {
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

        {/* Date-wise Orders Table reusing RecentOrdersTable */}
        {hasDateSearched && (
          <section className="animate-in fade-in duration-300">
            <RecentOrdersTable
              orders={dateFilteredOrders}
              loading={sectionLoading}
              emptyMessage={`No orders found for the selected date range (${filters.fromDate} to ${filters.toDate})${filters.printingPress ? ` and printing press "${filters.printingPress}"` : ""}.`}
              basePath="/dashboard/associate-member/book-order"
              onOpenDetails={(row) => {
                const targetId = row.id || row._id || row.orderNumber;
                navigate(`/dashboard/associate-member/book-order/details/${targetId}`, {
                  state: { order: row }
                });
              }}
            />
          </section>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: Search by Order Stage (Reuses RecentOrdersTable)
  // ==========================================
  if (searchType === "order-stage") {
    const activeStageObj = ORDER_STAGES.find((s) => s.id === selectedStageId);

    return (
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        {/* Main Search & Stage Filter Card */}
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
                onChange={handleInputChange}
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

          {/* 9 Order Stage Navigation Chips */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {ORDER_STAGES.map((stage) => {
                const isSelected = selectedStageId === stage.id;
                const count = stageCounts[stage.id] ?? 0;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => handleStageClick(stage.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#8b0000] text-white shadow-md scale-[1.02] ring-2 ring-[#8b0000]/30"
                        : "bg-slate-100 text-[#8b0000] hover:bg-slate-200"
                    }`}
                  >
                    <span>{stage.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                        isSelected ? "bg-white/25 text-white" : "bg-rose-100 text-[#8b0000]"
                      }`}
                    >
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stage-wise Orders Table reusing RecentOrdersTable */}
        <section className="animate-in fade-in duration-300">
          <RecentOrdersTable
            orders={currentStageOrders}
            loading={sectionLoading}
            emptyMessage={`No orders found for stage "${activeStageObj?.label || "Selected Stage"}".`}
            basePath="/dashboard/associate-member/book-order"
            onOpenDetails={(row) => {
              const targetId = row.id || row._id || row.orderNumber;
              navigate(`/dashboard/associate-member/book-order/details/${targetId}`, {
                state: { order: row }
              });
            }}
            onShowMore={() => navigate("/dashboard/associate-member/orders/search/order-date")}
          />
        </section>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: Search by Order Number (Inline Order Details)
  // ==========================================
  const hasMatchingRecords = Boolean(results?.items && results.items.length > 0);
  const showNoRecords = Boolean(!sectionLoading && filters.orderNumber.trim() && hasSearched && !hasMatchingRecords);
  const activeOrder = hasMatchingRecords ? results.items[selectedOrderIndex] || results.items[0] : null;

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
          <form onSubmit={handleOrderNumberSearchSubmit} className="mt-6 flex flex-col items-center justify-center">
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

      {/* Multiple Matching Records Selection Chips */}
      {hasMatchingRecords && results.items.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 mr-2">Multiple Matches Found:</span>
          {results.items.map((item, idx) => (
            <button
              key={item.id || item._id || idx}
              type="button"
              onClick={() => setSelectedOrderIndex(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                (selectedOrderIndex === idx || (!selectedOrderIndex && idx === 0))
                  ? "bg-[#7c3aed] text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Order #{item.orderNumber || item.id}
            </button>
          ))}
        </div>
      )}

      {/* Inline Order Details Content Rendered Directly Below Search Box */}
      {hasMatchingRecords && activeOrder && !sectionLoading && (
        <InlineOrderDetails order={activeOrder} navigate={navigate} />
      )}
    </div>
  );
}

