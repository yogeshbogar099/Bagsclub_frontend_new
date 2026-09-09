import React from "react";
import { useNavigate } from "react-router-dom";

function GmailIcon({ size = 36, className = "" }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.72)}
      viewBox="0 0 24 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`mx-auto inline-block align-middle ${className}`}
    >
      <rect x="1" y="1" width="22" height="15" rx="2" fill="#FFFFFF" stroke="#BBBBBB" strokeWidth="1" />
      <path
        d="M2 2.5L12 9.5L22 2.5"
        stroke="#EA4335"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 14.5V3L8.5 8"
        stroke="#EA4335"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 14.5V3L15.5 8"
        stroke="#EA4335"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function isCancelApplicable(row) {
  if (!row) return false;
  if (row.canCancel !== undefined) return Boolean(row.canCancel);
  const status = String(row.status || row.currentStatusValue || "").toLowerCase().trim();
  if (!status) return true;
  return !(
    status.includes("cancel") ||
    status.includes("dispatch") ||
    status.includes("complete") ||
    status.includes("deliver") ||
    status.includes("reject")
  );
}

function isUploadFileApplicable(row) {
  if (!row) return false;
  if (row.canUpload !== undefined) return Boolean(row.canUpload);
  if (row.fileType === "email" || row.designSubmissionSource === "email") return false;
  const status = String(row.status || row.currentStatusValue || "").toLowerCase().trim();
  if (status.includes("cancel") || status.includes("complete") || status.includes("deliver")) {
    return false;
  }
  const fileOpt = String(row.fileOption || "").toLowerCase();
  if (fileOpt.includes("email") || fileOpt.includes("mail")) return false;
  return true;
}

export default function RecentOrdersTable({
  orders = [],
  loading = false,
  emptyMessage = "No recent orders found.",
  showTitle = false,
  showShowMore = false,
  onOpenDetails,
  onCancelOrder,
  onUploadFile,
  onMailClick,
  onShowMore,
  basePath = "/dashboard/associate-member/book-order"
}) {
  const navigate = useNavigate();

  const handleShowMoreClick = () => {
    if (typeof onShowMore === "function") {
      onShowMore();
      return;
    }

    if (basePath.includes("associate-member")) {
      navigate("/dashboard/associate-member/orders/search/order-date");
    } else if (basePath.includes("admin/orders")) {
      navigate("/dashboard/admin/orders/all");
    } else if (basePath.includes("super-admin")) {
      navigate("/dashboard/super-admin/order-management/all-orders");
    } else {
      navigate("/dashboard/associate-member/orders/search/order-date");
    }
  };

  const handleMailClick = (row) => {
    if (typeof onMailClick === "function") {
      onMailClick(row);
      return;
    }
    if (row.customerEmail || row.email) {
      window.location.href = `mailto:${row.customerEmail || row.email}`;
    } else {
      if (typeof onOpenDetails === "function") {
        onOpenDetails(row);
      }
    }
  };

  const handleCancelClick = (row) => {
    if (typeof onCancelOrder === "function") {
      onCancelOrder(row);
      return;
    }
    if (window.confirm(`Are you sure you want to cancel Order #${row.orderNumber || row.id}?`)) {
      if (typeof onOpenDetails === "function") {
        onOpenDetails(row);
      }
    }
  };

  const handleUploadClick = (row) => {
    if (typeof onUploadFile === "function") {
      onUploadFile(row);
      return;
    }
    if (typeof onOpenDetails === "function") {
      onOpenDetails(row);
    }
  };

  return (
    <div className="w-full space-y-4 font-['Arial',sans-serif]">
      {/* Section Title */}
      {showTitle && (
        <h2 className="text-center text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#2b58a5] py-2">
          RECENT ORDERS
        </h2>
      )}

      {/* Table Container */}
      <div className="w-full overflow-hidden border border-black bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse min-w-[950px] text-[11px] sm:text-xs">
            <thead>
              <tr className="bg-black text-white">
                <th className="border border-black px-2.5 py-2.5 text-center text-[12px] font-bold uppercase tracking-wider">ORDER NO.</th>
                <th className="border border-black px-2.5 py-2.5 text-center text-[12px] font-bold uppercase tracking-wider">DATE</th>
                <th className="border border-black px-2.5 py-2.5 text-center text-[12px] font-bold uppercase tracking-wider">ORDER NAME</th>
                <th className="border border-black px-2.5 py-2.5 text-center text-[12px] font-bold uppercase tracking-wider">ORDER DETAIL</th>
                <th className="border border-black px-2.5 py-2.5 text-center text-[12px] font-bold uppercase tracking-wider">CURRENT STATUS</th>
                <th className="border border-black px-2.5 py-2.5"></th>
                <th className="border border-black px-2.5 py-2.5"></th>
                <th className="border border-black px-2.5 py-2.5"></th>
                <th className="border border-black px-2.5 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((row, idx) => {
                const canCancel = isCancelApplicable(row);
                const canUpload = isUploadFileApplicable(row);
                const isEven = idx % 2 === 0;

                return (
                  <tr
                    key={row.id || `${row.orderNumber}-${idx}`}
                    className={`${isEven ? "bg-white" : "bg-[#f2f2f2]"} hover:bg-slate-100 transition-colors`}
                  >
                    <td className="border border-black px-2.5 py-2 text-center font-normal text-slate-900 whitespace-nowrap text-[11px] sm:text-xs">
                      {row.orderNumber || row.id || "--"}
                    </td>
                    <td className="border border-black px-2.5 py-2 text-center text-[#2b58a5] font-normal whitespace-nowrap text-[11px] sm:text-xs">
                      {row.dateTime || row.date || "--"}
                    </td>
                    <td className="border border-black px-2.5 py-2 text-center font-normal text-slate-900 text-[11px] sm:text-xs">
                      {row.orderName || row.bagName || "ok"}
                    </td>
                    <td className="border border-black px-2.5 py-2 text-center text-slate-800 text-[11px] sm:text-xs">
                      <div className="max-w-[210px] mx-auto truncate" title={row.orderDetail || ""}>
                        {row.orderDetail || "--"}
                      </div>
                    </td>
                    <td className="border border-black px-2.5 py-2 text-center font-normal text-slate-900 whitespace-nowrap text-[11px] sm:text-xs">
                      {row.status || row.currentStatusValue || "--"}
                    </td>
                    <td className="border border-black px-2 py-1.5 text-center">
                      {canCancel ? (
                        <button
                          type="button"
                          onClick={() => handleCancelClick(row)}
                          className="inline-flex items-center justify-center rounded-[5px] bg-[#ff4500] hover:bg-[#e03d00] px-3.5 py-1.5 text-[14px] sm:text-[16px] font-bold italic text-white shadow-sm transition active:scale-95 cursor-pointer"
                          style={{ fontSize: "16px", fontWeight: 700, fontStyle: "italic" }}
                        >
                          Cancel
                        </button>
                      ) : null}
                    </td>
                    <td className="border border-black px-2 py-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleMailClick(row)}
                        title="Send Mail / Mail Details"
                        className="inline-flex items-center justify-center p-0.5 rounded hover:opacity-80 transition cursor-pointer"
                      >
                        <GmailIcon size={36} />
                      </button>
                    </td>
                    <td className="border border-black px-2 py-1.5 text-center">
                      {canUpload ? (
                        <button
                          type="button"
                          onClick={() => handleUploadClick(row)}
                          className="inline-flex items-center justify-center rounded-[5px] bg-[#218838] hover:bg-[#1e7e34] px-3.5 py-1.5 text-[14px] sm:text-[16px] font-bold italic text-white shadow-sm transition active:scale-95 cursor-pointer"
                          style={{ fontSize: "16px", fontWeight: 700, fontStyle: "italic" }}
                        >
                          Upload_File
                        </button>
                      ) : null}
                    </td>
                    <td className="border border-black px-2 py-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => onOpenDetails?.(row)}
                        className="inline-flex items-center justify-center rounded-[5px] bg-[#218838] hover:bg-[#1e7e34] px-4 py-1.5 text-[14px] sm:text-[16px] font-bold italic text-white shadow-sm transition active:scale-95 cursor-pointer"
                        style={{ fontSize: "16px", fontWeight: 700, fontStyle: "italic" }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}

              {loading && !orders.length ? (
                <tr>
                  <td colSpan={9} className="border border-black px-4 py-6 text-center text-xs font-normal text-slate-700">
                    Loading recent orders...
                  </td>
                </tr>
              ) : null}

              {!loading && !orders.length ? (
                <tr>
                  <td colSpan={9} className="border border-black px-4 py-6 text-center text-xs font-normal text-slate-700">
                    {emptyMessage}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Centered Show More... Button */}
      {showShowMore && (
        <div className="flex justify-center pt-2 pb-2">
          <button
            type="button"
            onClick={handleShowMoreClick}
            className="inline-flex items-center justify-center rounded-[5px] bg-[#0097b2] hover:bg-[#00839b] px-8 py-2.5 text-[16px] sm:text-[18px] font-bold text-white shadow transition active:scale-95 cursor-pointer"
            style={{ fontSize: "18px", fontWeight: 700 }}
          >
            Show More...
          </button>
        </div>
      )}
    </div>
  );
}
