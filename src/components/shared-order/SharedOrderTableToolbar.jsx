import { Search } from "lucide-react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa6";
import { tableCardClassName } from "../shared-table/tableStyles.js";

export default function SharedOrderTableToolbar({
  searchValue = "",
  onSearchChange,
  onDownloadPdf,
  onDownloadExcel,
  filteredCount = 0,
  totalCount = 0,
  placeholder = "Search orders...",
  label = "Search Orders"
}) {
  const showActions = Boolean(onDownloadPdf || onDownloadExcel);

  return (
    <section className={`${tableCardClassName} p-4`}>
      <div className={`flex flex-col gap-4 ${showActions ? "xl:flex-row xl:items-end xl:justify-between" : ""}`}>
        <div className="w-full xl:max-w-xl">
          <label className="mb-2 block text-sm font-extrabold uppercase tracking-[0.08em] text-slate-800">{label}</label>
          <div className="relative">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder={placeholder}
              className="h-12 w-full rounded-[10px] border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">
            Showing {filteredCount} of {totalCount} records
          </p>
        </div>

        {showActions ? (
          <div className="flex flex-wrap gap-3">
            {onDownloadPdf ? (
              <button
                type="button"
                onClick={onDownloadPdf}
                className="inline-flex h-12 items-center gap-2 rounded-[10px] border border-red-600 bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                <FaFilePdf className="text-base" />
                Download PDF
              </button>
            ) : null}
            {onDownloadExcel ? (
              <button
                type="button"
                onClick={onDownloadExcel}
                className="inline-flex h-12 items-center gap-2 rounded-[10px] border border-emerald-600 bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                <FaFileExcel className="text-base" />
                Download Excel
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
