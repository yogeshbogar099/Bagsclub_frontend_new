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

export default function SharedOrderRecordsTable({
  items = [],
  loading = false,
  emptyMessage = "No Order records are available for the selected filters.",
  loadingMessage = "Loading Order records...",
  onOpenDetails
}) {
  return (
    <div className={tableCardClassName}>
      <div className={tableShellClassName}>
      <table className={`${tableElementClassName} min-w-[980px] xl:min-w-[1220px]`}>
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
          ) : items.length ? (
            items.map((row, index) => (
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
                <td className={`${tableBodyCellCenterClassName} font-medium`}>{row.status || "--"}</td>
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
    </div>
  );
}
