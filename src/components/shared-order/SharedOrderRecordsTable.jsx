import { useMemo, useState, useEffect } from "react";
import { FileText, Mail } from "lucide-react";
import {
  getTableBodyRowClassName,
  tableActionButtonClassName,
  tableBodyCellCenterClassName,
  tableCardClassName,
  tableElementClassName,
  tableEmptyCellClassName,
  tableHeaderCellCenterClassName,
  tableHeaderCellClassName,
  tableHeaderRowClassName,
  tablePaginationBarClassName,
  tablePaginationButtonClassName,
  tableShellClassName
} from "../shared-table/tableStyles.js";

function renderFileTypeCell(row) {
  if (row?.hasEmailDesign) {
    return <Mail size={34} className="mx-auto text-[#d93025]" />;
  }

  return (
    <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
      <FileText size={22} className="text-slate-500" />
      <span>{row?.fileType || row?.fileSource || "File"}</span>
    </div>
  );
}

function renderStatusBadge(statusValue) {
  const normalized = String(statusValue || "").toLowerCase().trim();
  let badgeStyle = "border-slate-300 bg-slate-100 text-slate-700";
  let dotStyle = "bg-slate-500";

  if (["active", "completed", "approved"].includes(normalized)) {
    badgeStyle = "border-emerald-200 bg-emerald-50 text-emerald-700";
    dotStyle = "bg-emerald-500";
  } else if (normalized.includes("print")) {
    badgeStyle = "border-blue-200 bg-blue-50 text-blue-700";
    dotStyle = "bg-blue-500";
  } else if (normalized.includes("pack")) {
    badgeStyle = "border-indigo-200 bg-indigo-50 text-indigo-700";
    dotStyle = "bg-indigo-500";
  } else if (normalized.includes("dispatch")) {
    badgeStyle = "border-purple-200 bg-purple-50 text-purple-700";
    dotStyle = "bg-purple-500";
  } else if (["pending", "pending-review", "pending-verification"].includes(normalized)) {
    badgeStyle = "border-amber-200 bg-amber-50 text-amber-700";
    dotStyle = "bg-amber-500 animate-pulse";
  } else if (["suspended", "rejected", "cancelled", "improper", "inactive"].includes(normalized)) {
    badgeStyle = "border-rose-200 bg-rose-50 text-rose-700";
    dotStyle = "bg-rose-500";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${badgeStyle}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyle}`} />
      {statusValue || "--"}
    </span>
  );
}

export default function SharedOrderRecordsTable({
  items = [],
  loading = false,
  emptyMessage = "No Order records are available for the selected filters.",
  loadingMessage = "Loading Order records...",
  onOpenDetails
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [items, pageSize]);

  const totalPages = Math.ceil(items.length / pageSize) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize]
  );

  return (
    <div className={tableCardClassName}>
      <div className={tableShellClassName}>
        <table className={`${tableElementClassName} w-full min-w-max`}>
          <thead>
            <tr className={tableHeaderRowClassName}>
              <th className={tableHeaderCellClassName}>Order No.</th>
              <th className={tableHeaderCellClassName}>Date</th>
              <th className={tableHeaderCellClassName}>Order Name</th>
              <th className={tableHeaderCellClassName}>Created By</th>
              <th className={tableHeaderCellClassName}>Order Detail</th>
              <th className={tableHeaderCellCenterClassName}>Current Status</th>
              <th className={tableHeaderCellCenterClassName}>File Type</th>
              <th className={tableHeaderCellCenterClassName}>Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className={tableEmptyCellClassName}>
                  {loadingMessage}
                </td>
              </tr>
            ) : paginatedItems.length ? (
              paginatedItems.map((row, index) => (
                <tr key={row.id || `${row.orderNumber}-${index}`} className={getTableBodyRowClassName(index)}>
                  <td className={`${tableBodyCellCenterClassName} font-semibold`}>{row.orderNumber || "--"}</td>
                  <td className={tableBodyCellCenterClassName}>{row.dateTime || "--"}</td>
                  <td className={tableBodyCellCenterClassName}>
                    <div className="mx-auto max-w-[180px] truncate">{row.orderName || "--"}</div>
                  </td>
                  <td className={tableBodyCellCenterClassName}>
                    <div className="mx-auto max-w-[200px] truncate">{row.createdBy || "--"}</div>
                  </td>
                  <td className={tableBodyCellCenterClassName}>
                    <div className="mx-auto max-w-[360px] truncate">{row.orderDetail || "--"}</div>
                  </td>
                  <td className={tableBodyCellCenterClassName}>{renderStatusBadge(row.status)}</td>
                  <td className={tableBodyCellCenterClassName}>{renderFileTypeCell(row)}</td>
                  <td className={tableBodyCellCenterClassName}>
                    <button
                      type="button"
                      onClick={() => onOpenDetails?.(row.id, row)}
                      className={`${tableActionButtonClassName} italic`}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className={tableEmptyCellClassName}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && items.length > 0 ? (
        <div className={tablePaginationBarClassName}>
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Showing <span className="font-bold text-slate-900">{(safePage - 1) * pageSize + 1}</span> to{" "}
              <span className="font-bold text-slate-900">{Math.min(safePage * pageSize, items.length)}</span> of{" "}
              <span className="font-bold text-slate-900">{items.length}</span> records
            </span>
            <div className="flex items-center gap-1.5">
              <label htmlFor="order-table-page-size" className="text-slate-500">Per page:</label>
              <select
                id="order-table-page-size"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage(safePage - 1)}
              className={tablePaginationButtonClassName}
            >
              Previous
            </button>
            <span className="px-2 font-bold text-slate-800">
              Page {safePage} of {totalPages || 1}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage(safePage + 1)}
              className={tablePaginationButtonClassName}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
