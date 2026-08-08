import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Clock3, Download, FileText, ListOrdered, Mail, Tag, UserRound } from "lucide-react";
import { navigateTo } from "../../utils/auth.js";

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

function formatDateTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function renderFieldList(fields = []) {
  return fields.map((field) => (
    <div key={field.label} className="rounded-[18px] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-4">
      <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#71809b]">{field.label}</div>
      <div className="mt-2 text-sm font-semibold leading-6 text-[#1f2937]">{field.value || "--"}</div>
    </div>
  ));
}

export default function SharedOrderDetailsView({
  orderId = "",
  loadOrderDetails,
  updateOrderStatus,
  backPathFallback = "",
  moduleLabel = "Orders",
  statusOptions = []
}) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [statusDraft, setStatusDraft] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function resolveOrder() {
      if (!orderId || typeof loadOrderDetails !== "function") {
        setLoaded(true);
        return;
      }

      setLoading(true);
      try {
        const data = await loadOrderDetails(orderId);
        if (ignore) return;
        setOrder(data || null);
        setStatusDraft(String(data?.currentStatusValue || data?.statusValue || "").toLowerCase());
      } finally {
        if (!ignore) {
          setLoading(false);
          setLoaded(true);
        }
      }
    }

    resolveOrder();

    return () => {
      ignore = true;
    };
  }, [loadOrderDetails, orderId]);

  useEffect(() => {
    if (!orderId || typeof loadOrderDetails !== "function") return undefined;

    const refreshOrder = async () => {
      const data = await loadOrderDetails(orderId);
      setOrder(data || null);
      setStatusDraft(String(data?.currentStatusValue || data?.statusValue || "").toLowerCase());
    };

    window.addEventListener("focus", refreshOrder);
    window.addEventListener("orderchange", refreshOrder);
    window.addEventListener("orderstatuschange", refreshOrder);

    return () => {
      window.removeEventListener("focus", refreshOrder);
      window.removeEventListener("orderchange", refreshOrder);
      window.removeEventListener("orderstatuschange", refreshOrder);
    };
  }, [loadOrderDetails, orderId]);

  const displayStatus = useMemo(() => order?.currentStatus || order?.status || "--", [order?.currentStatus, order?.status]);
  const statusBadgeClass = useMemo(() => getStatusBadgeClass(displayStatus), [displayStatus]);
  const detailSummary = order?.orderDetailsOverview || order?.orderDetail || "--";
  const canPreview = Boolean(order?.designFileUrl);
  const canDownload = Boolean(order?.designFileUrl);
  const designExtension = useMemo(
    () => getDesignExtension(order?.designFileName, order?.designFileType, order?.designFileUrl),
    [order?.designFileName, order?.designFileType, order?.designFileUrl]
  );
  const isPdfDesign = useMemo(
    () => designExtension === "PDF" || isLikelyPdfUrl(order?.designFileUrl),
    [designExtension, order?.designFileUrl]
  );
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
  const createdByLabel = useMemo(
    () => order?.placedByUser?.name || order?.createdBy || order?.customerName || "--",
    [order?.createdBy, order?.customerName, order?.placedByUser]
  );
  const textColorsLabel = useMemo(
    () => (Array.isArray(order?.textColors) ? order.textColors.filter(Boolean).join(", ") : order?.textColors || "") || "--",
    [order?.textColors]
  );
  const creatorInfoFields = useMemo(
    () => [
      { label: "User Name", value: order?.placedByUser?.name || "--" },
      { label: "Associate Member ID", value: order?.placedByUser?.associateMemberId || "--" },
      { label: "Firm Name", value: order?.placedByUser?.businessName || "--" },
      { label: "Email Address", value: order?.placedByUser?.email || "--" },
      { label: "Mobile Number", value: order?.placedByUser?.mobileNumber || order?.mobileNumber || "--" },
      { label: "Address", value: order?.placedByUser?.fullAddress || order?.placedByUser?.address || "--" },
      { label: "GST Number", value: order?.placedByUser?.gstNumber || "--" },
      { label: "Registration Date", value: formatDateTime(order?.placedByUser?.registrationDate) },
      { label: "Account Status", value: order?.placedByUser?.status || "--" },
      { label: "Reference Code", value: order?.placedByUser?.referenceCode || "--" }
    ],
    [order?.mobileNumber, order?.placedByUser]
  );
  const orderInfoFields = useMemo(
    () => [
      { label: "Order Name", value: order?.orderName || "--" },
      { label: "Order Summary", value: order?.orderDetailsOverview || "--" },
      { label: "Customer Name", value: order?.customerName || "--" },
      { label: "Customer Mobile", value: order?.mobileNumber || "--" },
      { label: "Bag Type", value: order?.bagName || "--" },
      { label: "Print Side", value: order?.printSide || "--" },
      { label: "Quantity", value: String(order?.quantity ?? "--") },
      { label: "Bag Size", value: order?.bagSize || "--" },
      { label: "Bag Color", value: order?.bagColor || "--" },
      { label: "Text Color Type", value: order?.textColorType || "--" },
      { label: "Text Colors", value: textColorsLabel },
      { label: "Printing Press", value: order?.printingPress || "--" },
      { label: "Privacy", value: order?.privacy || "--" },
      { label: "Delivery Option", value: order?.deliveryOption || "--" },
      { label: "File Option", value: order?.fileOption || "--" },
      { label: "Reference Number", value: order?.referenceNo || "--" },
      { label: "Pressline", value: order?.pressline || "--" },
      { label: "Selling Price", value: `₹${formatCurrency(order?.sellingPrice || 0)}` },
      { label: "Base Amount", value: `₹${formatCurrency(order?.basePayableAmount || 0)}` },
      { label: "PDF Discount", value: `₹${formatCurrency(order?.pdfDiscountAmount || discountAmount)}` },
      { label: "Wallet Debit", value: `₹${formatCurrency(order?.walletDebitAmount || finalPayableAmount)}` },
      { label: "Design Source", value: order?.designFileSource || "--" },
      { label: "Design File Name", value: order?.designFileName || "--" },
      { label: "Design File Type", value: designExtension || "--" },
      { label: "Order Notes", value: order?.remark || "--" }
    ],
    [
      designExtension,
      discountAmount,
      finalPayableAmount,
      order?.bagColor,
      order?.bagName,
      order?.bagSize,
      order?.basePayableAmount,
      order?.customerName,
      order?.deliveryOption,
      order?.designFileName,
      order?.designFileSource,
      order?.fileOption,
      order?.mobileNumber,
      order?.orderDetailsOverview,
      order?.orderName,
      order?.pdfDiscountAmount,
      order?.pressline,
      order?.printSide,
      order?.printingPress,
      order?.privacy,
      order?.quantity,
      order?.referenceNo,
      order?.remark,
      order?.sellingPrice,
      order?.textColorType,
      order?.walletDebitAmount,
      textColorsLabel
    ]
  );
  const assignmentFields = useMemo(
    () => [
      {
        label: "Assigned Associate Member",
        value: order?.assignedAssociateMember
          ? `${order.assignedAssociateMember.name || "--"} (${order.assignedAssociateMember.businessName || "--"})`
          : "Not Assigned"
      },
      {
        label: "Assigned Admin",
        value: order?.assignedAdmin ? `${order.assignedAdmin.name || "--"} (${order.assignedAdmin.businessName || "--"})` : "Not Assigned"
      }
    ],
    [order?.assignedAdmin, order?.assignedAssociateMember]
  );

  const specificationRows = useMemo(
    () => [
      { label: "Created By", value: createdByLabel, accent: "text-[#7c3aed]" },
      {
        label: "Assigned To",
        value: order?.assignedAdmin?.businessName || order?.assignedAdmin?.name || order?.assignedAssociateMember?.businessName || "Assignment Pending"
      },
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
      { label: "Invoice Number", value: order?.invoiceNumber || order?.referenceNo || "--", accent: "text-[#5b67ea]" }
    ],
    [
      createdByLabel,
      finalPayableAmount,
      isPdfDesign,
      order?.assignedAdmin,
      order?.assignedAssociateMember,
      order?.dateTime,
      order?.deliveryOption,
      order?.invoiceNumber,
      order?.orderDateTime,
      order?.referenceNo,
      order?.sellingPrice,
      totalAmount,
      validPdfDiscountLabel
    ]
  );

  function handleBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    if (backPathFallback) {
      navigateTo(backPathFallback);
    }
  }

  async function handleStatusUpdate() {
    if (!order?.id || typeof updateOrderStatus !== "function" || !statusDraft) return;

    setStatusSaving(true);
    setStatusMessage("");
    setStatusError("");
    try {
      const updatedOrder = await updateOrderStatus(order.id, { status: statusDraft, note: statusNote });
      if (updatedOrder) {
        setOrder(updatedOrder);
        setStatusDraft(String(updatedOrder.currentStatusValue || updatedOrder.statusValue || statusDraft).toLowerCase());
      }
      setStatusNote("");
      setStatusMessage("Order status updated successfully.");
      window.dispatchEvent(new Event("orderchange"));
      window.dispatchEvent(new Event("dashboardstatschange"));
    } catch (error) {
      setStatusError(error?.message || "Failed to update order status.");
    } finally {
      setStatusSaving(false);
    }
  }

  if (!loaded || loading) {
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

  if (loaded && !order) {
    return (
      <div className="w-full bg-[#dfe3e8] px-4 py-10 sm:px-6 md:px-0">
        <div className="mx-auto max-w-5xl px-[2vw]">
        <div className="rounded-[28px] bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wide text-slate-900">Order Details</h1>
              <p className="mt-2 text-sm text-slate-500">{`This order could not be found in the ${moduleLabel} list.`}</p>
            </div>
            <button
              type="button"
              onClick={handleBack}
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
                onClick={handleBack}
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
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#d14b7c]">Product & Details</div>
                <div className="mt-1 text-[18px] font-black text-[#1f2937]">{order.orderName || "--"}</div>
                <div className="mt-1 text-sm font-semibold text-[#4b5563]">{detailSummary}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <section className="rounded-[24px] border border-[#dde3ee] bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <Tag size={18} className="text-[#7c4dff]" />
                  <h2 className="text-[18px] font-black uppercase tracking-tight text-[#1f2937]">Order Information</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{renderFieldList(orderInfoFields)}</div>
              </section>

              <section className="rounded-[24px] border border-[#dde3ee] bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <UserRound size={18} className="text-[#7c4dff]" />
                  <h2 className="text-[18px] font-black uppercase tracking-tight text-[#1f2937]">Order Creator Information</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">{renderFieldList(creatorInfoFields)}</div>
              </section>

              <section className="rounded-[24px] border border-[#dde3ee] bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <Clock3 size={18} className="text-[#7c4dff]" />
                  <h2 className="text-[18px] font-black uppercase tracking-tight text-[#1f2937]">Status History</h2>
                </div>
                <div className="space-y-3">
                  {(order?.statusHistory || []).length ? (
                    order.statusHistory.map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3 rounded-[20px] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-4">
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#7c4dff] shadow-sm">
                          <Clock3 size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-black text-[#1f2937]">{entry.status}</span>
                            <span className="text-xs font-semibold text-[#71809b]">{formatDateTime(entry.changedAt)}</span>
                          </div>
                          <p className="mt-1 text-sm text-[#475569]">{entry.note || "Status updated."}</p>
                          <p className="mt-1 text-xs font-semibold text-[#71809b]">Updated by: {entry.changedByName || "System"}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[18px] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-5 text-sm text-[#475569]">
                      No status history is available for this order yet.
                    </div>
                  )}
                </div>
              </section>

              {(order?.dispatchHistory || []).length ? (
                <section className="rounded-[24px] border border-[#dde3ee] bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <ListOrdered size={18} className="text-[#7c4dff]" />
                    <h2 className="text-[18px] font-black uppercase tracking-tight text-[#1f2937]">Dispatch History</h2>
                  </div>
                  <div className="space-y-3">
                    {order.dispatchHistory.map((entry) => (
                      <div key={entry.id} className="rounded-[20px] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-black text-[#1f2937]">{entry.status}</span>
                          <span className="text-xs font-semibold text-[#71809b]">{formatDateTime(entry.eventAt)}</span>
                        </div>
                        <p className="mt-2 text-sm text-[#475569]">{entry.note || "Dispatch information updated."}</p>
                        <p className="mt-2 text-xs text-[#71809b]">
                          Courier: {entry.courierName || "Not provided"} | Tracking: {entry.courierTrackingNumber || "Not provided"} | Delivery Status:{" "}
                          {entry.deliveryStatus || "Not provided"}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#71809b]">Updated by: {entry.updatedByName || "System"}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="space-y-4">
              <section className="rounded-[24px] border border-[#dde3ee] bg-white p-6 shadow-sm">
                <div className="mb-4 text-[16px] font-black uppercase tracking-tight text-[#1f2937]">Order Specifications</div>
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
              </section>

              <section className="rounded-[24px] border border-[#dde3ee] bg-white p-6 shadow-sm">
                <div className="mb-4 text-[16px] font-black uppercase tracking-tight text-[#1f2937]">Order Assignment</div>
                <div className="space-y-3">{renderFieldList(assignmentFields)}</div>
              </section>

              <section className="rounded-[24px] border border-[#dde3ee] bg-white p-6 shadow-sm">
                <div className="mb-4 text-[16px] font-black uppercase tracking-tight text-[#1f2937]">Order Status Management</div>
                <div className={`inline-flex rounded-full border px-5 py-2 text-xs font-black uppercase tracking-[0.14em] ${statusBadgeClass}`}>
                  {displayStatus}
                </div>

                {statusOptions.length ? (
                  <div className="mt-4 space-y-3">
                    <select
                      value={statusDraft}
                      onChange={(event) => setStatusDraft(event.target.value)}
                      className="h-11 w-full rounded-[16px] border border-[#d6dbe8] bg-white px-4 text-sm font-semibold text-[#1f2937] outline-none transition focus:border-[#7c4dff]"
                    >
                      <option value="">Select Status</option>
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={statusNote}
                      onChange={(event) => setStatusNote(event.target.value)}
                      rows={4}
                      placeholder="Add status note"
                      className="w-full rounded-[16px] border border-[#d6dbe8] bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#7c4dff]"
                    />
                    {statusError ? <div className="rounded-[14px] bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{statusError}</div> : null}
                    {statusMessage ? <div className="rounded-[14px] bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{statusMessage}</div> : null}
                    <button
                      type="button"
                      disabled={!statusDraft || statusSaving}
                      onClick={handleStatusUpdate}
                      className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#6d5efc] to-[#a855f7] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(139,92,246,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {statusSaving ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 rounded-[18px] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-4 text-sm font-semibold text-[#475569]">
                    Status update actions are not available for this order.
                  </div>
                )}
              </section>

              <section className="rounded-[24px] border border-[#dde3ee] bg-white p-6 shadow-sm">
                <div className="text-[16px] font-black uppercase tracking-tight text-[#1f2937]">Attached Assets</div>
                <div className="mt-4 space-y-3 text-sm text-[#475569]">
                  <div className="flex items-center gap-2 rounded-[16px] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
                    {order.designFileSourceValue === "email" ? <Mail size={16} className="text-[#5b67ea]" /> : <FileText size={16} className="text-[#334155]" />}
                    <span className="font-semibold">{order.designFileSource || "Uploaded Design File"}</span>
                  </div>
                  <div className="rounded-[16px] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#1f2937]">
                    File Name: {order.designFileName || "Not provided"}
                  </div>
                  <button
                    type="button"
                    disabled={!canPreview}
                    onClick={() => window.open(order.designFileUrl, "_blank", "noopener,noreferrer")}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#334155] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(51,65,85,0.24)] transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {order.designFileSourceValue === "email" ? <Mail size={16} /> : <FileText size={16} />}
                    File History
                  </button>
                  <button
                    type="button"
                    disabled={!canDownload}
                    onClick={() => downloadFile(order.designFileUrl, order.designFileName || "design-file")}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(239,68,68,0.22)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download size={16} />
                    Download Complete PDF
                  </button>
                </div>
              </section>

              <section className="rounded-[24px] border border-[#dde3ee] bg-white p-6 shadow-sm">
                <div className="text-[16px] font-black uppercase tracking-tight text-[#1f2937]">Valid PDF</div>
                <div className="mt-4 rounded-[18px] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-4 text-center text-sm font-extrabold text-[#1f2937]">
                  {validPdfDiscountLabel}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
