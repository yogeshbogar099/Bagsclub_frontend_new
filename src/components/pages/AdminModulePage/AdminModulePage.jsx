import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  ClipboardList,
  Download,
  FileText,
  LayoutDashboard,
  Mail,
  Package,
  Paperclip,
  UserCircle2,
  Users,
  Wallet,
  X
} from "lucide-react";
import { AdminModuleProvider, useAdminModule } from "../../../context/AdminModuleContext.jsx";
import { AdminAddMoneyLandingView, AdminAutoWalletTopUpView, AdminManualWalletTopUpView } from "../../admin/AdminAddMoneyViews.jsx";
import { AdminAddOrderLandingView, AdminBoxBagDesignOptionsView, AdminDCutBagDesignOptionsView, AdminLoopBagDesignOptionsView, AdminNonWovenBagOrderView, AdminNonWovenBagSelectionView } from "../../admin/AdminAddOrderViews.jsx";
import AdminModuleLayout from "../../admin/AdminModuleLayout.jsx";
import {
  ADMIN_ADD_MONEY_BASE_PATH,
  ADMIN_ADD_ORDER_BASE_PATH,
  ADMIN_ASSOCIATE_MEMBER_DETAILS_BASE_PATH,
  ADMIN_BASE_PATH,
  ADMIN_ORDER_DETAILS_BASE_PATH,
  ADMIN_WALLET_DETAILS_BASE_PATH,
  findAdminRoute
} from "../../admin/adminModuleConfig.js";
import { navigateTo } from "../../../utils/auth.js";
import SharedOrderDetailsView from "../../shared-order/SharedOrderDetailsView.jsx";
import SharedOrderRecordsTable from "../../shared-order/SharedOrderRecordsTable.jsx";
import SharedOrderTableToolbar from "../../shared-order/SharedOrderTableToolbar.jsx";
import SharedUserDetailsView from "../../shared-user/SharedUserDetailsView.jsx";
import {
  downloadGenericRowsAsExcel,
  downloadGenericRowsAsPdf,
  downloadOrderRowsAsExcel,
  downloadOrderRowsAsPdf,
  filterGenericTableItems,
  filterOrderTableItems
} from "../../shared-order/orderTableTools.js";
import { buildApiUrl } from "../../../lib/apiBaseUrl.js";
import {
  getTableBodyRowClassName,
  tableActionButtonClassName,
  tableBodyCellClassName,
  tableBodyCellCenterClassName,
  tableCardClassName,
  tableElementClassName,
  tableHeaderCellCenterClassName,
  tableHeaderCellClassName,
  tableHeaderRowClassName,
  tablePaginationBarClassName,
  tablePaginationButtonClassName,
  tableShellClassName
} from "../../shared-table/tableStyles.js";

const iconLookup = {
  dashboard: LayoutDashboard,
  "associate-members": Users,
  orders: ClipboardList,
  wallet: Wallet,
  production: Package,
  reports: FileText,
  "activity-logs": FileText,
  notifications: Bell,
  profile: UserCircle2
};

const cardAccentPalettes = [
  {
    topBorder: "border-t-cyan-500",
    badgeBg: "from-cyan-500/25 to-cyan-500/10 border-cyan-500/40 text-cyan-400",
    hoverBorder: "hover:border-cyan-500/50",
    valueText: "text-[#38bdf8]",
    subtleBorder: "border-cyan-950/60 hover:border-cyan-500/40"
  },
  {
    topBorder: "border-t-emerald-500",
    badgeBg: "from-emerald-500/25 to-emerald-500/10 border-emerald-500/40 text-emerald-400",
    hoverBorder: "hover:border-emerald-500/50",
    valueText: "text-[#34d399]",
    subtleBorder: "border-emerald-950/60 hover:border-emerald-500/40"
  },
  {
    topBorder: "border-t-orange-500",
    badgeBg: "from-orange-500/25 to-orange-500/10 border-orange-500/40 text-orange-400",
    hoverBorder: "hover:border-orange-500/50",
    valueText: "text-[#fb923c]",
    subtleBorder: "border-orange-950/60 hover:border-orange-500/40"
  },
  {
    topBorder: "border-t-purple-500",
    badgeBg: "from-purple-500/25 to-purple-500/10 border-purple-500/40 text-purple-400",
    hoverBorder: "hover:border-purple-500/50",
    valueText: "text-[#c084fc]",
    subtleBorder: "border-purple-950/60 hover:border-purple-500/40"
  },
  {
    topBorder: "border-t-pink-500",
    badgeBg: "from-pink-500/25 to-pink-500/10 border-pink-500/40 text-pink-400",
    hoverBorder: "hover:border-pink-500/50",
    valueText: "text-[#f472b6]",
    subtleBorder: "border-pink-950/60 hover:border-pink-500/40"
  },
  {
    topBorder: "border-t-sky-500",
    badgeBg: "from-sky-500/25 to-sky-500/10 border-sky-500/40 text-sky-400",
    hoverBorder: "hover:border-sky-500/50",
    valueText: "text-[#38bdf8]",
    subtleBorder: "border-sky-950/60 hover:border-sky-500/40"
  },
  {
    topBorder: "border-t-lime-500",
    badgeBg: "from-lime-500/25 to-lime-500/10 border-lime-500/40 text-lime-400",
    hoverBorder: "hover:border-lime-500/50",
    valueText: "text-[#a3e635]",
    subtleBorder: "border-lime-950/60 hover:border-lime-500/40"
  },
  {
    topBorder: "border-t-rose-500",
    badgeBg: "from-rose-500/25 to-rose-500/10 border-rose-500/40 text-rose-400",
    hoverBorder: "hover:border-rose-500/50",
    valueText: "text-[#fb7185]",
    subtleBorder: "border-rose-950/60 hover:border-rose-500/40"
  }
];

export function getCardRedirectPath(card) {
  if (card?.path) return card.path;
  const title = String(card?.title || "").toLowerCase().trim();

  if (title.includes("user") || title.includes("member")) {
    if (title.includes("active")) return `${ADMIN_BASE_PATH}/associate-members/active`;
    if (title.includes("inactive")) return `${ADMIN_BASE_PATH}/associate-members/inactive`;
    if (title.includes("assigned")) return `${ADMIN_BASE_PATH}/associate-members/assigned`;
    return `${ADMIN_BASE_PATH}/associate-members/all`;
  }

  if (title.includes("wallet") || title.includes("top-up") || title.includes("transaction")) {
    if (title.includes("pending") || title.includes("request")) return `${ADMIN_BASE_PATH}/wallet/top-up-requests`;
    if (title.includes("approved")) return `${ADMIN_BASE_PATH}/wallet/approved-requests`;
    if (title.includes("rejected")) return `${ADMIN_BASE_PATH}/wallet/rejected-requests`;
    return `${ADMIN_BASE_PATH}/wallet/transactions`;
  }

  if (title.includes("order") || title.includes("task")) {
    if (title.includes("pending")) return `${ADMIN_BASE_PATH}/orders/pending`;
    if (title.includes("new")) return `${ADMIN_BASE_PATH}/orders/new`;
    if (title.includes("print")) return `${ADMIN_BASE_PATH}/orders/printing`;
    if (title.includes("pack")) return `${ADMIN_BASE_PATH}/orders/packaging`;
    if (title.includes("dispatch")) return `${ADMIN_BASE_PATH}/orders/dispatch`;
    if (title.includes("complete")) return `${ADMIN_BASE_PATH}/orders/completed`;
    if (title.includes("improper")) return `${ADMIN_BASE_PATH}/orders/improper`;
    if (title.includes("cancel")) return `${ADMIN_BASE_PATH}/orders/cancelled`;
    if (title.includes("reject")) return `${ADMIN_BASE_PATH}/orders/rejected`;
    return `${ADMIN_BASE_PATH}/orders/all`;
  }

  return `${ADMIN_BASE_PATH}/orders/all`;
}

function DashboardCards({ cards = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = iconLookup[card.iconKey] || LayoutDashboard;
        const palette = cardAccentPalettes[index % cardAccentPalettes.length];
        const targetPath = getCardRedirectPath(card);

        return (
          <article
            key={card.title}
            role="button"
            tabIndex={0}
            onClick={() => navigateTo(targetPath)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigateTo(targetPath);
              }
            }}
            aria-label={`View ${card.title} records`}
            className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border ${palette.subtleBorder} border-t-4 ${palette.topBorder} bg-slate-900/90 p-5 shadow-xl shadow-black/30 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-2xl hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-500/50`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{card.title}</p>
                <div className={`rounded-xl border bg-gradient-to-br p-3 shadow-inner transition-transform duration-300 group-hover:scale-110 ${palette.badgeBg}`}>
                  <Icon size={22} />
                </div>
              </div>
              <p className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">{card.value}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
              <p className="text-xs font-medium text-slate-400">{card.note}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                View →
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function isPendingTask(statusValue = "") {
  return ["pending", "pending-review"].includes(String(statusValue || "").trim().toLowerCase());
}

function getDashboardStatusClassName(statusValue = "", isDark = false) {
  const normalized = String(statusValue || "").trim().toLowerCase();
  if (isDark) {
    if (["pending", "pending-review"].includes(normalized)) return "border border-pink-500/40 bg-pink-500/15 text-pink-300 font-bold";
    if (normalized === "printing") return "border border-cyan-500/40 bg-cyan-500/15 text-cyan-300 font-bold";
    if (normalized === "packaging") return "border border-purple-500/40 bg-purple-500/15 text-purple-300 font-bold";
    if (normalized === "dispatched") return "border border-orange-500/40 bg-orange-500/15 text-orange-300 font-bold";
    if (normalized === "completed" || normalized === "approved" || normalized === "active") return "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 font-bold";
    if (normalized === "suspended" || normalized === "rejected" || normalized === "cancelled" || normalized === "improper") return "border border-rose-500/40 bg-rose-500/15 text-rose-300 font-bold";
    return "border border-slate-700 bg-slate-800 text-slate-300 font-bold";
  }
  if (["pending", "pending-review"].includes(normalized)) return "border border-rose-200 bg-rose-50 text-rose-700";
  if (normalized === "printing") return "border border-blue-200 bg-blue-50 text-blue-700";
  if (normalized === "packaging") return "border border-violet-200 bg-violet-50 text-violet-700";
  if (normalized === "dispatched") return "border border-emerald-200 bg-emerald-50 text-emerald-700";
  if (normalized === "completed" || normalized === "approved" || normalized === "active") return "border border-emerald-200 bg-emerald-50 text-emerald-700";
  if (normalized === "suspended" || normalized === "rejected") return "border border-slate-300 bg-slate-100 text-slate-700";
  return "border border-slate-200 bg-slate-100 text-slate-700";
}

function formatCurrency(value) {
  const numericValue = Number(value || 0);
  return Number.isFinite(numericValue) ? `Rs. ${numericValue.toFixed(2)}` : "Rs. 0.00";
}

function RecentTasksSection({ tasks = [] }) {
  if (!tasks.length) {
    return (
      <section className="rounded border border-slate-300 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-bold text-slate-800">Recent Tasks</h2>
        </div>
        <div className="px-4 py-8 text-center text-sm text-slate-500">No recent user, order, or wallet activities are available yet.</div>
      </section>
    );
  }

  return (
    <section className="rounded border border-slate-300 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h2 className="text-sm font-bold text-slate-800">Recent Tasks</h2>
      </div>
      <div className="divide-y divide-slate-200">
        {tasks.map((task) => {
          const pendingTask = isPendingTask(task.statusValue);

          return (
            <button
              key={task.id}
              type="button"
              onClick={() => {
                if (task.path) {
                  navigateTo(task.path);
                }
              }}
              className={`block w-full px-4 py-4 text-left transition ${pendingTask ? "bg-rose-50 hover:bg-rose-100" : "hover:bg-slate-50"
                }`}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{task.module}</span>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${pendingTask ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-700"
                        }`}
                    >
                      {task.statusLabel}
                    </span>
                  </div>
                  <p className={`text-sm font-semibold ${pendingTask ? "text-rose-700" : "text-slate-900"}`}>{task.title}</p>
                  <p className={`text-sm ${pendingTask ? "text-rose-600" : "text-slate-600"}`}>{task.description}</p>
                </div>
                <p className={`shrink-0 text-xs font-medium ${pendingTask ? "text-rose-600" : "text-slate-500"}`}>{task.updatedOn}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}) {
  if (totalItems <= 0) return null;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={tablePaginationBarClassName}>
      <div className="flex flex-wrap items-center gap-3">
        <span>
          Showing <span className="font-bold text-slate-900">{startItem}</span> to{" "}
          <span className="font-bold text-slate-900">{endItem}</span> of{" "}
          <span className="font-bold text-slate-900">{totalItems}</span> records
        </span>
        <div className="flex items-center gap-1.5">
          <label htmlFor="generic-table-page-size" className="text-slate-500">Per page:</label>
          <select
            id="generic-table-page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
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
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={tablePaginationButtonClassName}
        >
          Previous
        </button>
        <span className="px-2 font-bold text-slate-800">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={tablePaginationButtonClassName}
        >
          Next
        </button>
      </div>
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

function DataTable({
  columns = [],
  items = [],
  actionLabel = "Details",
  onAction,
  emptyMessage = "No records available for this section yet.",
  renderCell,
  getRowClassName,
  getActionLabel,
  isDark = false
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

  if (!items.length) {
    return (
      <div className={isDark ? "rounded-xl border border-slate-800 bg-slate-900/90 shadow-lg" : tableCardClassName}>
        <div className={`px-4 py-8 text-center text-sm font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={isDark ? "overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 shadow-lg" : tableCardClassName}>
      <div className={tableShellClassName}>
        <table className={`${tableElementClassName} min-w-full`}>
          <thead>
            <tr className={isDark ? "border-b border-slate-800 bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-400" : tableHeaderRowClassName}>
              {columns.map((column) => (
                <th key={column.key} className={isDark ? "px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400" : tableHeaderCellClassName}>
                  {column.label}
                </th>
              ))}
              {onAction ? <th className={isDark ? "px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-400" : tableHeaderCellCenterClassName}>{actionLabel}</th> : null}
            </tr>
          </thead>
          <tbody className={isDark ? "divide-y divide-slate-800/60" : ""}>
            {paginatedItems.map((item, index) => (
              <tr
                key={item.id || `${item.title || "row"}-${index}`}
                className={getRowClassName ? getRowClassName(item, index) : isDark ? "border-b border-slate-800/60 text-slate-200 transition hover:bg-slate-800/50" : getTableBodyRowClassName(index)}
              >
                {columns.map((column) => (
                  <td key={column.key} className={isDark ? "px-4 py-3.5 text-xs font-medium text-slate-300" : tableBodyCellClassName}>
                    {renderCell
                      ? renderCell(item, column)
                      : column.key === "status"
                        ? renderStatusBadge(item.status)
                        : item[column.key] ?? "--"}
                  </td>
                ))}
                {onAction ? (
                  <td className={isDark ? "px-4 py-3.5 text-center" : tableBodyCellCenterClassName}>
                    <button
                      type="button"
                      onClick={() => onAction(item)}
                      className={
                        isDark
                          ? "inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 shadow-sm transition hover:border-[#a71a00] hover:bg-[#a71a00] hover:text-white"
                          : `${tableActionButtonClassName} italic`
                      }
                    >
                      {getActionLabel ? getActionLabel(item) : actionLabel}
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={safePage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={items.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}

const orderStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "printing", label: "Printing" },
  { value: "packaging", label: "Packaging" },
  { value: "dispatched", label: "Dispatched" },
  { value: "completed", label: "Completed" },
  { value: "improper", label: "Improper" },
  { value: "cancelled", label: "Cancelled" }
];

function normalizeStatusBadge(statusValue) {
  const normalized = String(statusValue || "").toLowerCase();
  if (normalized === "completed") return "bg-emerald-100 text-emerald-800";
  if (normalized === "dispatched") return "bg-sky-100 text-sky-800";
  if (normalized === "printing") return "bg-amber-100 text-amber-800";
  if (normalized === "packaging") return "bg-indigo-100 text-indigo-800";
  if (normalized === "improper") return "bg-rose-100 text-rose-800";
  if (normalized === "cancelled") return "bg-slate-200 text-slate-800";
  return "bg-slate-100 text-slate-700";
}

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

function OrderDetailsModal({
  isOpen,
  order,
  token,
  note,
  selectedStatus,
  onStatusChange,
  onNoteChange,
  onClose,
  onUpdateStatus,
  onOrderUpdated,
  loading
}) {
  if (!isOpen || !order) return null;

  const fileInputRef = useRef(null);
  const [designUploading, setDesignUploading] = useState(false);

  const statusBadge = normalizeStatusBadge(order.currentStatusValue || order.statusValue);
  const designIcon = order.hasFileAttachment ? Paperclip : order.hasEmailDesign ? Mail : FileText;
  const DesignIcon = designIcon;
  const designFileLabel = order.designFileName || order.designFileType || "Design File";
  const canPreview = Boolean(order.designFileUrl);
  const canDownload = Boolean(order.designFileUrl);
  const textColorsValue = Array.isArray(order.textColors) ? order.textColors.filter(Boolean).join(", ") : order.textColors || "--";

  const handleDesignFileChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file || !token) return;

      setDesignUploading(true);
      try {
        const body = new FormData();
        body.append("file", file);

        const response = await fetch(buildApiUrl(`/api/orders/${order.id}/design`), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.message || "Failed to upload design file.");
        }

        if (data?.order) {
          onOrderUpdated?.(data.order);
          window.dispatchEvent(new Event("orderchange"));
          window.dispatchEvent(new Event("dashboardstatschange"));
          window.dispatchEvent(
            new CustomEvent("orderstatuschange", {
              detail: { orderId: order.id }
            })
          );
        }
      } catch (_error) {
        window.alert("Failed to upload design file. Please try again.");
      } finally {
        setDesignUploading(false);
      }
    },
    [onOrderUpdated, order.id, token]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Order {order.orderNumber ? `#${order.orderNumber}` : ""} Details
            </h3>
            <p className="mt-1 text-xs text-slate-500">{order.orderName || "Order"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            <div className="grid gap-4 rounded border border-slate-200 bg-white p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Customer</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{order.customerName || "--"}</p>
                <p className="mt-1 text-sm text-slate-700">{order.mobileNumber || order.customerMobile || "--"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Current Status</p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold">
                  <span className={`inline-flex rounded-full px-3 py-1 ${statusBadge}`}>{order.currentStatus || order.status || "--"}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Order Summary</p>
                <p className="mt-1 text-sm leading-6 text-slate-800">{order.orderDetailsOverview || order.orderSummary || "--"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Placed At</p>
                <p className="mt-1 text-sm text-slate-800">{order.orderDateTime || order.dateTime || "--"}</p>
              </div>
            </div>

            <div className="rounded border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-bold text-slate-800">Order Details</h4>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Bag Type</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{order.bagName || "--"}</p>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Print Side</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{order.printSide || "--"}</p>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Quantity</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{order.quantity ?? "--"}</p>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Size</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{order.bagSize || "--"}</p>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Bag Color</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{order.bagColor || "--"}</p>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Text Color Type</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{order.textColorType || "--"}</p>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3 sm:col-span-2">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Text Colors</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{textColorsValue}</p>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3 sm:col-span-2">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Special Remark</p>
                  <p className="mt-1 text-sm text-slate-800">{order.remark || "--"}</p>
                </div>
              </div>
            </div>

            <div className="rounded border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-bold text-slate-800">Design File</h4>
              <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_220px]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <DesignIcon size={16} className={order.hasEmailDesign ? "text-blue-700" : "text-[#a71a00]"} />
                    <span>{order.designFileSource || order.fileSource || "Not Provided"}</span>
                  </div>
                  <p className="text-xs text-slate-500">File: {designFileLabel}</p>
                  {canPreview && isLikelyImageUrl(order.designFileUrl) ? (
                    <img
                      src={order.designFileUrl}
                      alt={designFileLabel}
                      className="mt-3 max-h-64 w-full rounded border border-slate-200 object-contain"
                    />
                  ) : null}
                  {canPreview && isLikelyPdfUrl(order.designFileUrl) ? (
                    <iframe title="Design preview" src={order.designFileUrl} className="mt-3 h-64 w-full rounded border border-slate-200" />
                  ) : null}
                </div>

                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleDesignFileChange}
                    accept=".pdf,.cdr,.ai,.psd,.jpeg,.jpg,.png"
                  />
                  <button
                    type="button"
                    disabled={!token || designUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {designUploading ? "Uploading..." : canPreview ? "Replace Design File" : "Upload Design File"}
                  </button>
                  <button
                    type="button"
                    disabled={!canPreview}
                    onClick={() => window.open(order.designFileUrl, "_blank", "noopener,noreferrer")}
                    className="w-full rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Preview / Open
                  </button>
                  <button
                    type="button"
                    disabled={!canDownload}
                    onClick={() => downloadFile(order.designFileUrl, order.designFileName || "design-file")}
                    className="inline-flex w-full items-center justify-center gap-2 rounded bg-[#a71a00] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8f1700] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            </div>

            {Array.isArray(order.statusHistory) && order.statusHistory.length ? (
              <div className="rounded border border-slate-200 bg-white p-4">
                <h4 className="text-sm font-bold text-slate-800">Status History</h4>
                <div className="mt-3 space-y-2">
                  {order.statusHistory.slice(0, 8).map((entry) => (
                    <div key={entry.id} className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{entry.status}</span>
                        <span className="text-slate-500">{entry.changedAt || "--"}</span>
                      </div>
                      {entry.note ? <div className="mt-1 text-slate-600">{entry.note}</div> : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-4">
            <div className="rounded border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-bold text-slate-800">Update Status</h4>
              <div className="mt-3 space-y-3">
                <label className="block text-xs font-semibold text-slate-600">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(event) => onStatusChange(event.target.value)}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                >
                  {orderStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <label className="block text-xs font-semibold text-slate-600">Note (optional)</label>
                <textarea
                  value={note}
                  onChange={(event) => onNoteChange(event.target.value)}
                  rows={3}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                  placeholder="Add a note for the associate member..."
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={onUpdateStatus}
                  className="w-full rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Save Status"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function AdminModuleScreen({ session, pathname }) {
  const {
    bootstrap,
    sectionData,
    loading,
    sectionLoading,
    orderLoading,
    error,
    loadBootstrap,
    loadSection,
    fetchOrderDetails,
    fetchAssociateMemberDetails,
    fetchWalletRequestDetails,
    updateOrderStatus,
    updateWalletRequestStatus
  } =
    useAdminModule();
  const currentRoute = useMemo(() => findAdminRoute(pathname), [pathname]);
  const orderDetailsMatch = useMemo(() => pathname.match(new RegExp(`^${ADMIN_ORDER_DETAILS_BASE_PATH}/([^/]+)$`)), [pathname]);
  const orderDetailsId = orderDetailsMatch?.[1] || "";
  const isOrderDetailsRoute = Boolean(orderDetailsId);
  const associateMemberDetailsMatch = useMemo(
    () => pathname.match(new RegExp(`^${ADMIN_ASSOCIATE_MEMBER_DETAILS_BASE_PATH}/([^/]+)$`)),
    [pathname]
  );
  const associateMemberDetailsId = associateMemberDetailsMatch?.[1] || "";
  const isAssociateMemberDetailsRoute = Boolean(associateMemberDetailsId);
  const walletDetailsMatch = useMemo(() => pathname.match(new RegExp(`^${ADMIN_WALLET_DETAILS_BASE_PATH}/([^/]+)$`)), [pathname]);
  const walletDetailsId = walletDetailsMatch?.[1] || "";
  const isWalletDetailsRoute = Boolean(walletDetailsId);
  const isAddOrderRoute = pathname === ADMIN_ADD_ORDER_BASE_PATH;
  const isNonWovenBagRoute = pathname === `${ADMIN_ADD_ORDER_BASE_PATH}/non-woven-bag`;
  const isDCutDesignOptionsRoute = pathname === `${ADMIN_ADD_ORDER_BASE_PATH}/non-woven-bag/d-cut-bag/design-options`;
  const isLoopDesignOptionsRoute = pathname === `${ADMIN_ADD_ORDER_BASE_PATH}/non-woven-bag/loop-bag/design-options`;
  const isBoxDesignOptionsRoute = pathname === `${ADMIN_ADD_ORDER_BASE_PATH}/non-woven-bag/box-bag/design-options`;
  const isNonWovenBagOrderRoute = pathname.startsWith(`${ADMIN_ADD_ORDER_BASE_PATH}/non-woven-bag/`);
  const isAddMoneyRoute = pathname === ADMIN_ADD_MONEY_BASE_PATH;
  const isManualTopUpRoute = pathname === `${ADMIN_ADD_MONEY_BASE_PATH}/manual`;
  const isAutoTopUpRoute = pathname === `${ADMIN_ADD_MONEY_BASE_PATH}/manual/auto`;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedAssociateMember, setSelectedAssociateMember] = useState(null);
  const [selectedWalletRequest, setSelectedWalletRequest] = useState(null);
  const [statusDraft, setStatusDraft] = useState(orderStatusOptions[0].value);
  const [statusNote, setStatusNote] = useState("");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [tableSearchQuery, setTableSearchQuery] = useState("");

  useEffect(() => {
    loadBootstrap();
  }, [loadBootstrap]);

  useEffect(() => {
    if (isOrderDetailsRoute || isAssociateMemberDetailsRoute || isWalletDetailsRoute) return;
    loadSection(currentRoute.section || "dashboard", currentRoute.view || "overview");
  }, [currentRoute.section, currentRoute.view, isAssociateMemberDetailsRoute, isOrderDetailsRoute, isWalletDetailsRoute, loadSection]);

  useEffect(() => {
    setOrderSearchQuery("");
    setTableSearchQuery("");
  }, [currentRoute.path]);

  useEffect(() => {
    if (!isAssociateMemberDetailsRoute || !associateMemberDetailsId) {
      setSelectedAssociateMember(null);
      return;
    }

    let active = true;

    async function loadAssociateMemberForPage() {
      const response = await fetchAssociateMemberDetails(associateMemberDetailsId);
      if (!active) return;
      setSelectedAssociateMember(response?.associateMember || null);
    }

    loadAssociateMemberForPage();

    return () => {
      active = false;
    };
  }, [associateMemberDetailsId, fetchAssociateMemberDetails, isAssociateMemberDetailsRoute]);

  useEffect(() => {
    if (!isWalletDetailsRoute || !walletDetailsId) {
      setSelectedWalletRequest(null);
      return;
    }

    let active = true;

    async function loadWalletRequestForPage() {
      const response = await fetchWalletRequestDetails(walletDetailsId);
      if (!active) return;
      setSelectedWalletRequest(response?.walletRequest || null);
    }

    loadWalletRequestForPage();

    return () => {
      active = false;
    };
  }, [fetchWalletRequestDetails, isWalletDetailsRoute, walletDetailsId]);

  useEffect(() => {
    const refreshAdminScreen = async () => {
      await loadBootstrap();

      if (isOrderDetailsRoute && orderDetailsId) {
        const response = await fetchOrderDetails(orderDetailsId);
        if (response?.order) {
          setSelectedOrder(response.order);
          setStatusDraft(String(response.order.currentStatusValue || response.order.statusValue || "pending").toLowerCase());
        }
        return;
      }

      if (isAssociateMemberDetailsRoute && associateMemberDetailsId) {
        const response = await fetchAssociateMemberDetails(associateMemberDetailsId);
        if (response?.associateMember) {
          setSelectedAssociateMember(response.associateMember);
        }
        return;
      }

      if (isWalletDetailsRoute && walletDetailsId) {
        const response = await fetchWalletRequestDetails(walletDetailsId);
        if (response?.walletRequest) {
          setSelectedWalletRequest(response.walletRequest);
        }
        return;
      }

      if (!isAddOrderRoute && !isNonWovenBagRoute && !isNonWovenBagOrderRoute && !isAddMoneyRoute && !isManualTopUpRoute && !isAutoTopUpRoute) {
        await loadSection(currentRoute.section || "dashboard", currentRoute.view || "overview");
      }
    };

    const events = [
      "focus",
      "dashboardstatschange",
      "orderchange",
      "orderstatuschange",
      "walletchange",
      "adminchange",
      "associatememberchange"
    ];

    events.forEach((eventName) => window.addEventListener(eventName, refreshAdminScreen));

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, refreshAdminScreen));
    };
  }, [
    associateMemberDetailsId,
    currentRoute.section,
    currentRoute.view,
    fetchAssociateMemberDetails,
    fetchOrderDetails,
    fetchWalletRequestDetails,
    isAddMoneyRoute,
    isAddOrderRoute,
    isAssociateMemberDetailsRoute,
    isAutoTopUpRoute,
    isManualTopUpRoute,
    isNonWovenBagOrderRoute,
    isNonWovenBagRoute,
    isOrderDetailsRoute,
    isWalletDetailsRoute,
    loadBootstrap,
    loadSection,
    orderDetailsId,
    walletDetailsId
  ]);

  const openOrderModal = useCallback(
    async (orderId) => {
      const response = await fetchOrderDetails(orderId);
      if (!response?.order) return;
      setSelectedOrder(response.order);
      setStatusDraft(String(response.order.currentStatusValue || response.order.statusValue || "pending").toLowerCase());
      setStatusNote("");
      setOrderModalOpen(true);
    },
    [fetchOrderDetails]
  );

  const closeOrderModal = useCallback(() => {
    setOrderModalOpen(false);
    setSelectedOrder(null);
    setStatusNote("");
  }, []);

  const handleSaveStatus = useCallback(async () => {
    if (!selectedOrder?.id) return;
    const response = await updateOrderStatus(selectedOrder.id, { status: statusDraft, note: statusNote });
    if (response?.order) {
      setSelectedOrder(response.order);
      await loadSection(currentRoute.section || "orders", currentRoute.view || "all");
      window.dispatchEvent(
        new CustomEvent("orderstatuschange", {
          detail: { orderId: selectedOrder.id, status: response.order.currentStatusValue || statusDraft }
        })
      );
      window.dispatchEvent(new Event("orderchange"));
      window.dispatchEvent(new Event("dashboardstatschange"));
    }
  }, [currentRoute.section, currentRoute.view, loadSection, selectedOrder, statusDraft, statusNote, updateOrderStatus]);

  const pageTitle = currentRoute.label;
  const pageDescription = currentRoute.parentDescription || currentRoute.description || "Admin module section";
  const columns = sectionData?.meta?.columns || [];
  const items = sectionData?.items || [];
  const cards = bootstrap?.dashboardCards || [];
  const recentActivities = bootstrap?.recentActivities || { users: [], orders: [], walletTransactions: [] };
  const pendingTasks = bootstrap?.pendingTasks || [];
  const currentBagSlug = isNonWovenBagOrderRoute ? pathname.replace(`${ADMIN_ADD_ORDER_BASE_PATH}/non-woven-bag/`, "").split("/")[0] : "";
  const isAdminOrderTableRoute = currentRoute.section === "orders" && !isAddOrderRoute && !isNonWovenBagRoute && !isNonWovenBagOrderRoute && !isOrderDetailsRoute;
  const isAdminSearchableDataTableRoute = currentRoute.section === "associate-members" || currentRoute.section === "wallet";
  const filteredOrderItems = useMemo(() => filterOrderTableItems(items, orderSearchQuery), [items, orderSearchQuery]);
  const filteredGenericItems = useMemo(
    () => (isAdminSearchableDataTableRoute ? filterGenericTableItems(items, tableSearchQuery, columns.map((column) => column.key)) : items),
    [columns, isAdminSearchableDataTableRoute, items, tableSearchQuery]
  );
  const orderExportBaseName = useMemo(
    () => `${String(currentRoute.label || "order-records").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-records`,
    [currentRoute.label]
  );
  const genericExportColumns = useMemo(
    () => columns.filter((column) => column?.key).map((column) => ({ key: column.key, label: column.label || column.key })),
    [columns]
  );
  const handleOpenDetailsPage = useCallback(
    (orderId) => {
      if (!orderId) return;
      navigateTo(`${ADMIN_ORDER_DETAILS_BASE_PATH}/${orderId}`);
    },
    []
  );
  const handleDownloadOrderPdf = useCallback(() => {
    downloadOrderRowsAsPdf(filteredOrderItems, orderExportBaseName, `${currentRoute.label || "Order"} Records`);
  }, [currentRoute.label, filteredOrderItems, orderExportBaseName]);
  const handleDownloadOrderExcel = useCallback(() => {
    downloadOrderRowsAsExcel(filteredOrderItems, orderExportBaseName);
  }, [filteredOrderItems, orderExportBaseName]);
  const handleDownloadGenericPdf = useCallback(() => {
    downloadGenericRowsAsPdf(
      filteredGenericItems,
      genericExportColumns,
      orderExportBaseName,
      `${currentRoute.label || "Records"}`
    );
  }, [currentRoute.label, filteredGenericItems, genericExportColumns, orderExportBaseName]);
  const handleDownloadGenericExcel = useCallback(() => {
    downloadGenericRowsAsExcel(filteredGenericItems, genericExportColumns, orderExportBaseName);
  }, [filteredGenericItems, genericExportColumns, orderExportBaseName]);
  const handleOpenAssociateMemberDetailsPage = useCallback((item) => {
    if (!item?.id) return;
    navigateTo(`${ADMIN_ASSOCIATE_MEMBER_DETAILS_BASE_PATH}/${item.id}`);
  }, []);
  const handleOpenWalletDetailsPage = useCallback((item) => {
    if (!item?.id) return;
    navigateTo(`${ADMIN_WALLET_DETAILS_BASE_PATH}/${item.id}`);
  }, []);
  const recentUserColumns = [
    { key: "name", label: "User Name" },
    { key: "role", label: "Role" },
    { key: "businessName", label: "Business / Firm" },
    { key: "mobile", label: "Mobile" },
    { key: "status", label: "Status" },
    { key: "updatedOn", label: "Updated On" }
  ];
  const recentOrderColumns = [
    { key: "orderNumber", label: "Order No." },
    { key: "orderName", label: "Order Name" },
    { key: "createdBy", label: "Created By" },
    { key: "status", label: "Status" },
    { key: "updatedOn", label: "Updated On" }
  ];
  const recentWalletColumns = [
    { key: "reference", label: "Reference" },
    { key: "type", label: "Type" },
    { key: "memberName", label: "Member Name" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "businessName", label: "Business / Firm" },
    { key: "updatedOn", label: "Updated On" }
  ];
  const pendingTaskColumns = [
    { key: "module", label: "Module" },
    { key: "title", label: "Pending Task" },
    { key: "status", label: "Status" },
    { key: "updatedOn", label: "Updated On" }
  ];

  const loadOrderDetailsForPage = useCallback(async (orderId) => (await fetchOrderDetails(orderId))?.order || null, [fetchOrderDetails]);
  const updateOrderStatusForPage = useCallback(
    async (orderId, payload) => (await updateOrderStatus(orderId, payload))?.order || null,
    [updateOrderStatus]
  );
  const handleWalletRequestDecision = useCallback(
    async (status) => {
      if (!selectedWalletRequest?.id) return;

      const response = await updateWalletRequestStatus(selectedWalletRequest.id, { status });
      if (!response?.walletRequest) return;

      setSelectedWalletRequest(response.walletRequest);
      window.dispatchEvent(new Event("dashboardstatschange"));
      window.dispatchEvent(new Event("walletchange"));

      if (currentRoute.section === "wallet" && !isWalletDetailsRoute) {
        await loadSection(currentRoute.section || "wallet", currentRoute.view || "transactions");
      }
    },
    [currentRoute.section, currentRoute.view, isWalletDetailsRoute, loadSection, selectedWalletRequest, updateWalletRequestStatus]
  );

  return (
    <AdminModuleLayout session={session} pathname={pathname} bootstrap={bootstrap} onRefresh={loadBootstrap}>
      {currentRoute.section !== "dashboard" ? (
        <section className="mb-6 rounded border border-slate-300 border-l-4 border-l-[#a71a00] bg-white px-4 py-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
              <p className="mt-1 text-xs text-slate-500">{pageDescription}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-600">
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                Role: <span className="font-semibold text-slate-900">Admin</span>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                Records: <span className="font-semibold text-slate-900">{sectionData?.summary?.total ?? items.length}</span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {error ? <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      {loading && !bootstrap ? (
        <div className="rounded border border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm">
          Loading admin module...
        </div>
      ) : null}

      {isOrderDetailsRoute ? (
        <SharedOrderDetailsView
          orderId={orderDetailsId}
          loadOrderDetails={loadOrderDetailsForPage}
          updateOrderStatus={updateOrderStatusForPage}
          backPathFallback={`${ADMIN_BASE_PATH}/orders/all`}
          moduleLabel="Admin Orders"
          statusOptions={orderStatusOptions}
        />
      ) : isAssociateMemberDetailsRoute ? (
        <SharedUserDetailsView
          title="User Details"
          subtitle="Review the selected Associate Member profile with complete account and assignment information."
          loading={sectionLoading && !selectedAssociateMember}
          loadingText="Loading user details..."
          backPathFallback={`${ADMIN_BASE_PATH}/associate-members/all`}
          summaryCards={[
            { label: "Associate Member ID", value: selectedAssociateMember?.associateMemberId },
            { label: "Status", value: selectedAssociateMember?.status },
            { label: "Assigned Admin", value: selectedAssociateMember?.assignedAdminName },
            { label: "Role", value: selectedAssociateMember?.role ? selectedAssociateMember.role.replace(/-/g, " ") : "--" }
          ]}
          informationTitle="Associate Member Information"
          informationFields={[
            { label: "Associate Member Name", value: selectedAssociateMember?.associateMemberName },
            { label: "Mobile Number", value: selectedAssociateMember?.mobileNumber },
            { label: "Email", value: selectedAssociateMember?.email },
            { label: "Business/Firm Name", value: selectedAssociateMember?.businessName },
            { label: "Country", value: selectedAssociateMember?.country },
            { label: "GST Number", value: selectedAssociateMember?.gstNumber },
            { label: "City", value: selectedAssociateMember?.city },
            { label: "District", value: selectedAssociateMember?.district },
            { label: "State", value: selectedAssociateMember?.state },
            { label: "PIN Code", value: selectedAssociateMember?.pinCode },
            { label: "Reference Code", value: selectedAssociateMember?.referenceCode },
            { label: "Address", value: selectedAssociateMember?.address, span: 2 }
          ]}
          extraSections={[
            {
              title: "Assigned Admin Details",
              fields: selectedAssociateMember?.assignedAdmin
                ? [
                  { label: "Admin Name", value: selectedAssociateMember.assignedAdmin.adminName },
                  { label: "Mobile Number", value: selectedAssociateMember.assignedAdmin.mobileNumber },
                  { label: "Email", value: selectedAssociateMember.assignedAdmin.email },
                  { label: "Business/Firm Name", value: selectedAssociateMember.assignedAdmin.businessName },
                  { label: "Status", value: selectedAssociateMember.assignedAdmin.status }
                ]
                : [{ label: "Assignment Status", value: "No Admin is currently assigned to this Associate Member.", span: 2 }]
            }
          ]}
        />
      ) : isWalletDetailsRoute ? (
        <SharedUserDetailsView
          title="Wallet Details"
          subtitle="Review the selected wallet request and update its approval status."
          loading={sectionLoading && !selectedWalletRequest}
          loadingText="Loading wallet request details..."
          backPathFallback={`${ADMIN_BASE_PATH}/wallet/transactions`}
          summaryCards={[
            { label: "Reference", value: selectedWalletRequest?.reference },
            { label: "Amount", value: selectedWalletRequest?.amount ? `Rs. ${selectedWalletRequest.amount}` : "--" },
            { label: "Status", value: selectedWalletRequest?.status },
            { label: "Requested On", value: selectedWalletRequest?.requestedOn }
          ]}
          informationTitle="Wallet Request Information"
          informationFields={[
            { label: "Requested By", value: selectedWalletRequest?.requestedByDisplayName },
            { label: "Requested Role", value: selectedWalletRequest?.requestedByRole },
            { label: "Reviewed By", value: selectedWalletRequest?.reviewedByName || "--" },
            { label: "Reviewed Role", value: selectedWalletRequest?.reviewedByRole || "--" },
            { label: "Reviewed On", value: selectedWalletRequest?.reviewedOn || "--" },
            { label: "Decision Note", value: selectedWalletRequest?.decisionNote || "--", span: 2 },
            { label: "Remarks", value: selectedWalletRequest?.remarks || "--", span: 2 }
          ]}
          extraSections={[
            {
              title: "Requester Information",
              fields: selectedWalletRequest?.requester
                ? [
                  { label: "User Name", value: selectedWalletRequest.requester.name },
                  { label: "Mobile Number", value: selectedWalletRequest.requester.mobileNumber },
                  { label: "Email", value: selectedWalletRequest.requester.email },
                  { label: "Business/Firm Name", value: selectedWalletRequest.requester.businessName },
                  { label: "Country", value: selectedWalletRequest.requester.country },
                  { label: "State", value: selectedWalletRequest.requester.state },
                  { label: "District", value: selectedWalletRequest.requester.district },
                  { label: "City", value: selectedWalletRequest.requester.city },
                  { label: "PIN Code", value: selectedWalletRequest.requester.pinCode },
                  { label: "GST Number", value: selectedWalletRequest.requester.gstNumber },
                  { label: "Account Status", value: selectedWalletRequest.requester.status },
                  { label: "Registration Date", value: selectedWalletRequest.requester.registrationDate },
                  { label: "Address", value: selectedWalletRequest.requester.address, span: 2 }
                ]
                : [{ label: "Requester", value: "No linked member profile is available for this wallet request.", span: 2 }]
            }
          ]}
          sidePanel={
            <div>
              <h3 className="text-sm font-bold text-slate-800">Update Wallet Request</h3>
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  disabled={sectionLoading || selectedWalletRequest?.statusValue === "approved"}
                  onClick={() => handleWalletRequestDecision("approved")}
                  className="w-full rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={sectionLoading || selectedWalletRequest?.statusValue === "rejected"}
                  onClick={() => handleWalletRequestDecision("rejected")}
                  className="w-full rounded border border-rose-600 bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          }
        />
      ) : isAddOrderRoute ? (
        <AdminAddOrderLandingView />
      ) : isNonWovenBagRoute ? (
        <AdminNonWovenBagSelectionView />
      ) : isDCutDesignOptionsRoute ? (
        <AdminDCutBagDesignOptionsView />
      ) : isLoopDesignOptionsRoute ? (
        <AdminLoopBagDesignOptionsView />
      ) : isBoxDesignOptionsRoute ? (
        <AdminBoxBagDesignOptionsView />
      ) : isNonWovenBagOrderRoute ? (
        <AdminNonWovenBagOrderView bagSlug={currentBagSlug} />
      ) : isAddMoneyRoute ? (
        <AdminAddMoneyLandingView />
      ) : isManualTopUpRoute ? (
        <AdminManualWalletTopUpView />
      ) : isAutoTopUpRoute ? (
        <AdminAutoWalletTopUpView />
      ) : currentRoute.section === "dashboard" ? (
        <div className="-mx-4 -my-5 space-y-6 rounded-xl bg-[#0b0f19] px-4 py-6 text-slate-100 shadow-2xl min-h-screen sm:px-6 sm:py-8 lg:px-8">
          <section className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md sm:rounded-2xl sm:p-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 via-orange-500 via-purple-500 to-pink-500"></div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3.5">
                <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-purple-500/10 p-3 text-cyan-400 shadow-inner">
                  <LayoutDashboard size={26} />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{pageTitle}</h1>
                  <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm">{pageDescription}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-2 rounded-xl border border-pink-500/30 bg-pink-500/10 px-4 py-2.5 font-semibold text-slate-300 shadow-inner">
                  <span className="font-medium text-slate-400">Role:</span>
                  <span className="font-extrabold uppercase tracking-wider text-pink-400">Admin</span>
                </div>
                {bootstrap?.dashboardOverview?.accountBalance !== undefined ? (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 font-semibold text-slate-300 shadow-inner">
                    <span className="font-medium text-slate-400">Wallet Balance:</span>
                    <span className="font-extrabold text-emerald-400">Rs. {bootstrap.dashboardOverview.accountBalance}</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 font-semibold text-slate-300 shadow-inner">
                  <span className="font-medium text-slate-400">Records:</span>
                  <span className="font-extrabold text-cyan-300">{sectionData?.summary?.total ?? items.length}</span>
                </div>
              </div>
            </div>
          </section>

          <DashboardCards cards={cards} />
        </div>
      ) : (
        <div className="space-y-6">
          <section>
            <section className="space-y-4">
              {sectionLoading ? (
                <div className="rounded border border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm">
                  Loading section data...
                </div>
              ) : (
                <>
                  {currentRoute.section === "orders" || currentRoute.section === "production" ? (
                    <>
                      {isAdminOrderTableRoute ? (
                        <SharedOrderTableToolbar
                          searchValue={orderSearchQuery}
                          onSearchChange={setOrderSearchQuery}
                          onDownloadPdf={handleDownloadOrderPdf}
                          onDownloadExcel={handleDownloadOrderExcel}
                          filteredCount={filteredOrderItems.length}
                          totalCount={items.length}
                          placeholder="Search by order number, order name, created by, status, or file type"
                        />
                      ) : null}
                      <SharedOrderRecordsTable
                        items={isAdminOrderTableRoute ? filteredOrderItems : items}
                        loading={sectionLoading}
                        loadingMessage="Loading Order records..."
                        emptyMessage="No Order records are available for this section yet."
                        onOpenDetails={handleOpenDetailsPage}
                      />
                    </>
                  ) : (
                    <>
                      {isAdminSearchableDataTableRoute ? (
                        <SharedOrderTableToolbar
                          searchValue={tableSearchQuery}
                          onSearchChange={setTableSearchQuery}
                          onDownloadPdf={handleDownloadGenericPdf}
                          onDownloadExcel={handleDownloadGenericExcel}
                          filteredCount={filteredGenericItems.length}
                          totalCount={items.length}
                          label={`Search ${currentRoute.parentLabel || currentRoute.label}`}
                          placeholder="Search visible records by any table field"
                        />
                      ) : null}
                      <DataTable
                        columns={columns}
                        items={isAdminSearchableDataTableRoute ? filteredGenericItems : items}
                        actionLabel={currentRoute.section === "associate-members" || currentRoute.section === "wallet" ? "Details" : "Action"}
                        onAction={
                          currentRoute.section === "associate-members"
                            ? handleOpenAssociateMemberDetailsPage
                            : currentRoute.section === "wallet"
                              ? handleOpenWalletDetailsPage
                              : undefined
                        }
                      />
                    </>
                  )}

                  <OrderDetailsModal
                    isOpen={orderModalOpen}
                    order={selectedOrder}
                    token={session?.token}
                    note={statusNote}
                    selectedStatus={statusDraft}
                    onStatusChange={setStatusDraft}
                    onNoteChange={setStatusNote}
                    onClose={closeOrderModal}
                    onUpdateStatus={handleSaveStatus}
                    onOrderUpdated={setSelectedOrder}
                    loading={orderLoading}
                  />
                </>
              )}
            </section>
          </section>
        </div>
      )}
    </AdminModuleLayout>
  );
}

export default function AdminModulePage({ session, pathname = "/dashboard/admin" }) {
  return (
    <AdminModuleProvider>
      <AdminModuleScreen session={session} pathname={pathname} />
    </AdminModuleProvider>
  );
}
