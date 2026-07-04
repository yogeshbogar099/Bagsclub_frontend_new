export const tableCardClassName = "overflow-hidden rounded-[18px] border border-slate-300 bg-white shadow-sm";

export const tableShellClassName = "overflow-x-auto bg-white";

export const tableElementClassName = "w-full border-collapse text-sm";

export const tableHeaderRowClassName = "bg-black text-white";

export const tableHeaderCellClassName =
  "border border-black px-4 py-4 text-left text-sm font-extrabold uppercase tracking-[0.08em]";

export const tableHeaderCellCenterClassName =
  "border border-black px-4 py-4 text-center text-sm font-extrabold uppercase tracking-[0.08em]";

export const tableBodyCellClassName = "border border-black px-4 py-4 text-sm text-slate-900 align-middle";

export const tableBodyCellCenterClassName = `${tableBodyCellClassName} text-center`;

export const tableBodyCellMutedClassName = `${tableBodyCellClassName} text-slate-700`;

export const tableEmptyCellClassName = "border border-black px-4 py-8 text-center text-sm text-slate-700";

export const tableActionButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#238f23] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1f7d1f] disabled:cursor-not-allowed disabled:opacity-50";

export const tablePaginationBarClassName =
  "flex flex-col gap-3 border-t border-slate-200 bg-[#f4f4f4] px-4 py-3 text-xs font-semibold text-slate-600 sm:flex-row sm:items-center sm:justify-between";

export const tablePaginationButtonClassName =
  "rounded-[8px] border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50";

export const tableSectionHeaderClassName =
  "flex flex-col gap-2 border-b border-slate-200 bg-gradient-to-b from-white to-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between";

export const tableSectionCountClassName = "text-xs font-semibold text-slate-600";

export function getTableBodyRowClassName(index = 0) {
  return index % 2 === 0 ? "bg-[#efefef] transition-colors hover:bg-[#e6e6e6]" : "bg-white transition-colors hover:bg-[#f8f8f8]";
}
