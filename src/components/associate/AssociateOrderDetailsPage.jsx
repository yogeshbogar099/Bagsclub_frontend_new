import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Download,
  FileImage,
  FileText,
  FolderOpen,
  ListOrdered,
  Mail,
  Tag
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAssociateModule } from "../../context/AssociateModuleContext.jsx";
import AssociateProductionLogTimeline from "./AssociateProductionLogTimeline.jsx";

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
  if (safeName.includes(".")) {
    return safeName.split(".").pop().trim().toUpperCase();
  }

  const safeUrl = String(fileUrl || "").trim().split("?")[0];
  if (safeUrl.includes(".")) {
    return safeUrl.split(".").pop().trim().toUpperCase();
  }

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
  const normalized = String(statusLabel).toLowerCase();
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

export default function AssociateOrderDetailsPage() {
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

  useEffect(() => {
    const refreshOrder = async () => {
      const data = await fetchOrderDetails(orderId);
      setOrder(data?.order || null);
      setIsLoaded(true);
    };

    window.addEventListener("focus", refreshOrder);
    window.addEventListener("orderchange", refreshOrder);
    window.addEventListener("orderstatuschange", refreshOrder);

    return () => {
      window.removeEventListener("focus", refreshOrder);
      window.removeEventListener("orderchange", refreshOrder);
      window.removeEventListener("orderstatuschange", refreshOrder);
    };
  }, [fetchOrderDetails, orderId]);

  const displayStatus = useMemo(() => order?.currentStatus || order?.status || "--", [order?.currentStatus, order?.status]);
  const statusBadgeClass = useMemo(() => getStatusBadgeClass(displayStatus), [displayStatus]);
  const detailSummary = order?.orderDetailsOverview || order?.orderDetail || "--";
  const canPreview = Boolean(order?.designFileUrl);
  const canDownload = Boolean(order?.designFileUrl);
  const textColorsValue = Array.isArray(order?.textColors) && order.textColors.length ? order.textColors.join(", ") : "--";
  const designExtension = useMemo(
    () => getDesignExtension(order?.designFileName, order?.designFileType, order?.designFileUrl),
    [order?.designFileName, order?.designFileType, order?.designFileUrl]
  );
  const isPdfDesign = useMemo(
    () => designExtension === "PDF" || isLikelyPdfUrl(order?.designFileUrl),
    [designExtension, order?.designFileUrl]
  );
  const fileSourceLabel = useMemo(() => {
    if (order?.designFileSource) return order.designFileSource;
    return order?.designSubmissionSource === "email" || order?.fileType === "email" ? "Submitted By Email" : order?.fileOption || "Uploaded Design File";
  }, [order?.designFileSource, order?.designSubmissionSource, order?.fileOption, order?.fileType]);
  const orderByLabel = useMemo(
    () => buildMemberLabel(order?.placedByUser, order?.customerName || "--"),
    [order?.placedByUser, order?.customerName]
  );
  const orderForLabel = useMemo(() => {
    if (order?.assignedAdmin) return buildMemberLabel(order.assignedAdmin, order.assignedAdmin.businessName || order.assignedAdmin.name || "--");
    if (order?.assignedAssociateMember) return buildMemberLabel(order.assignedAssociateMember, order.assignedAssociateMember.businessName || "--");
    return "Assignment Pending";
  }, [order?.assignedAdmin, order?.assignedAssociateMember]);
  const discountAmount = useMemo(() => {
    const storedDiscount = Number(order?.pdfDiscountAmount);
    return Number.isFinite(storedDiscount) && storedDiscount > 0 ? storedDiscount : 0;
  }, [order?.pdfDiscountAmount]);
  const totalAmount = useMemo(() => {
    const storedBaseAmount = Number(order?.basePayableAmount || 0);
    if (storedBaseAmount > 0) return storedBaseAmount;
    const debitAmount = Number(order?.walletDebitAmount || 0);
    if (debitAmount > 0) return debitAmount + discountAmount;
    return 0;
  }, [discountAmount, order?.basePayableAmount, order?.walletDebitAmount]);
  const finalPayableAmount = useMemo(() => {
    const debitAmount = Number(order?.walletDebitAmount || 0);
    if (debitAmount > 0) return debitAmount;
    if (totalAmount > 0) return Math.max(totalAmount - discountAmount, 0);
    return 0;
  }, [discountAmount, order?.walletDebitAmount, totalAmount]);
  const validPdfDiscountLabel = useMemo(() => `₹${formatCurrency(discountAmount)} Discount`, [discountAmount]);
  const invoiceNumber = useMemo(() => order?.invoiceNumber || "--", [order?.invoiceNumber]);
  const orderInfoRows = useMemo(
    () => [
      { label: "Bag Type", value: order?.bagName || "--" },
      { label: "Product Type", value: order?.orderName || "--" },
      { label: "Quantity", value: order?.quantity || 0 },
      { label: "Bag Size", value: order?.bagSize || "--" },
      { label: "Bag Color", value: order?.bagColor || "--" },
      { label: "Print Side", value: order?.printSide || "--" },
      { label: "Text Color Type", value: order?.textColorType || "--" },
      { label: "Text Colors", value: textColorsValue }
    ],
    [order?.bagColor, order?.bagName, order?.bagSize, order?.orderName, order?.printSide, order?.quantity, order?.textColorType, textColorsValue]
  );
  const specificationRows = useMemo(
    () => [
      { label: "Order By", value: orderByLabel, accent: "text-[#7c3aed]" },
      { label: "Order For", value: orderForLabel },
      { label: "Delivery Type", value: order?.deliveryOption || "--" },
      {
        label: "Valid PDF",
        value: validPdfDiscountLabel,
        accent: isPdfDesign ? "text-[#059669]" : "text-[#64748b]"
      },
      { label: "Order Date", value: order?.orderDateTime || order?.dateTime || "--" },
      { label: "Total Amount", value: formatCurrency(totalAmount), accent: "text-[#111827]" },
      { label: "Final Payable", value: formatCurrency(finalPayableAmount), accent: "text-[#10b981]" },
      { label: "Selling Price", value: formatCurrency(order?.sellingPrice || 0), accent: "text-[#111827]" },
      { label: "Job / Plate Charges", value: formatCurrency(order?.jobPlateCharges || 0) },
      { label: "Invoice Number", value: invoiceNumber, accent: "text-[#5b67ea]" }
    ],
    [finalPayableAmount, invoiceNumber, isPdfDesign, order?.dateTime, order?.deliveryOption, order?.jobPlateCharges, order?.orderDateTime, order?.sellingPrice, orderByLabel, orderForLabel, totalAmount, validPdfDiscountLabel]
  );

  if (!isLoaded && (sectionLoading || orderLoading)) {
    return (
      <div className="w-full bg-[#dfe3e8] px-4 py-10 sm:px-6 md:px-0">
        <div className="mx-auto max-w-7xl px-[2vw]">
          <div className="rounded-[28px] bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
            <div className="text-sm font-semibold text-slate-500">Loading order details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoaded && !order) {
    return (
      <div className="w-full bg-[#dfe3e8] px-4 py-10 sm:px-6 md:px-0">
        <div className="mx-auto max-w-5xl px-[2vw]">
        <div className="rounded-[28px] bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wide text-slate-900">Order Details</h1>
              <p className="mt-2 text-sm text-slate-500">This order could not be found in the recent associate member orders list.</p>
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
                onClick={() => navigate("/dashboard/associate-member/book-order")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d6dbe8] bg-white text-[#2d58a5] transition hover:bg-[#eef4ff]"
                aria-label="Back to orders"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex flex-wrap items-baseline gap-2">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#71809b]">Order</div>
                <h1 className="text-[28px] font-black text-[#1f2937] sm:text-[34px]">#{order.orderNumber}</h1>
              </div>
            </div>
            <div className={`rounded-full border px-7 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-sm ${statusBadgeClass}`}>{displayStatus}</div>
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
              {orderInfoRows.map((row) => (
                <div key={row.label} className="rounded-[14px] border border-[#f1d7e1] bg-white/90 px-4 py-3">
                  <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[#b45372]">{row.label}</div>
                  <div className="mt-1 text-sm font-extrabold leading-6 text-[#1f2937]">{row.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-8 xl:grid-cols-[1.35fr_0.9fr] xl:items-start">
            <div className="min-h-[420px]">
              <div className="mb-5 flex items-center gap-3">
                <FolderOpen size={18} className="text-[#7c4dff]" />
                <h2 className="text-[18px] font-black uppercase tracking-tight text-[#1f2937]">Attached Assets</h2>
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

                <div className="mt-2 flex min-h-[420px] items-center justify-center rounded-[20px] bg-[#f4f6fa] p-2">
                  {canPreview && isLikelyImageUrl(order.designFileUrl) ? (
                    <img
                      src={order.designFileUrl}
                      alt={order.designFileName || "Design preview"}
                      className="max-h-[520px] w-full rounded-[18px] object-contain"
                    />
                  ) : null}

                  {canPreview && isLikelyPdfUrl(order.designFileUrl) ? (
                    <iframe title="Design preview" src={order.designFileUrl} className="h-[520px] w-full rounded-[18px] border border-[#dbe4f0] bg-white" />
                  ) : null}

                  {!canPreview ? (
                    <div className="flex h-full min-h-[360px] w-full flex-col items-center justify-center rounded-[18px] border border-dashed border-[#cfd7e3] text-center text-slate-500">
                      <FileImage size={46} className="text-[#c3cede]" />
                      <p className="mt-4 text-base font-semibold text-slate-700">No attached asset available</p>
                      <p className="mt-2 max-w-md text-sm leading-6">
                        Upload preview is not available for this order yet.
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <aside className="flex flex-col">
              <div className="mb-5 flex items-center gap-3">
                <ListOrdered size={18} className="text-[#7c4dff]" />
                <h2 className="text-[18px] font-black uppercase tracking-tight text-[#1f2937]">Order Specifications</h2>
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
                    <div className={`text-sm font-extrabold sm:text-right ${row.accent || "text-[#1f2937]"}`}>{row.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/associate-member/book-order/details/${orderId}/production-log`, { state: { order } })}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6d5efc] to-[#a855f7] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(139,92,246,0.24)] transition hover:opacity-95"
                  >
                    <ListOrdered size={16} />
                    Production Log
                  </button>
                  <button
                    type="button"
                    disabled={!canPreview}
                    onClick={() => window.open(order.designFileUrl, "_blank", "noopener,noreferrer")}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#334155] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(51,65,85,0.24)] transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {order.designSubmissionSource === "email" ? <Mail size={16} /> : <FileText size={16} />}
                    File History
                  </button>
                  <button
                    type="button"
                    disabled={!canDownload}
                    onClick={() => downloadFile(order.designFileUrl, order.designFileName || "design-file")}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(239,68,68,0.22)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download size={16} />
                    Download Complete PDF
                  </button>
                </div>
            </aside>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
