import { useEffect, useMemo, useState } from "react";
import { CalendarDays, FileText, Hash, ListFilter, Mail, RotateCcw, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAssociateModule } from "../../context/AssociateModuleContext.jsx";
import {
  getTableBodyRowClassName,
  tableActionButtonClassName,
  tableBodyCellClassName,
  tableBodyCellCenterClassName,
  tableCardClassName,
  tableElementClassName,
  tableEmptyCellClassName,
  tableHeaderCellCenterClassName,
  tableHeaderCellClassName,
  tableHeaderRowClassName,
  tableShellClassName
} from "../shared-table/tableStyles.js";

const stageOptions = [
  { label: "Pending", value: "pending" },
  { label: "Printing", value: "printing" },
  { label: "Packing", value: "packaging" },
  { label: "Dispatch", value: "dispatched" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" }
];

const searchContent = {
  "order-number": {
    title: "Search By Order Number",
    description: "Search a specific order by its unique order number and view matching records instantly."
  },
  "order-stage": {
    title: "Search By Order Stage",
    description: "Filter orders by their current production stage such as Pending, Printing, Packing, Dispatch, or Completed."
  },
  "order-date": {
    title: "Search By Order Date",
    description: "Filter orders by a selected order date or date range and show matching records from the database."
  }
};

export default function AssociateOrderStatusSearchPage({ searchType }) {
  const navigate = useNavigate();
  const { searchOrders, sectionLoading } = useAssociateModule();
  const [filters, setFilters] = useState({
    orderNumber: "",
    status: "",
    fromDate: "",
    toDate: ""
  });
  const [results, setResults] = useState({ items: [], summary: {}, meta: {} });
  const content = searchContent[searchType] || searchContent["order-number"];

  const canSearch = useMemo(() => {
    if (searchType === "order-number") return Boolean(filters.orderNumber.trim());
    if (searchType === "order-stage") return Boolean(filters.status);
    if (searchType === "order-date") return Boolean(filters.fromDate || filters.toDate);
    return false;
  }, [filters.fromDate, filters.orderNumber, filters.status, filters.toDate, searchType]);

  useEffect(() => {
    let timerId;

    async function runSearch() {
      if (!canSearch) {
        setResults({ items: [], summary: {}, meta: {} });
        return;
      }

      const data = await searchOrders({
        searchType,
        orderNumber: filters.orderNumber,
        status: filters.status,
        fromDate: filters.fromDate,
        toDate: filters.toDate
      });

      setResults(data || { items: [], summary: {}, meta: {} });
    }

    timerId = window.setTimeout(runSearch, 250);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [canSearch, filters.fromDate, filters.orderNumber, filters.status, filters.toDate, searchOrders, searchType]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function handleReset() {
    setFilters({
      orderNumber: "",
      status: "",
      fromDate: "",
      toDate: ""
    });
    setResults({ items: [], summary: {}, meta: {} });
  }

  function renderControls() {
    if (searchType === "order-number") {
      return (
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
              <Hash size={16} className="text-[#2d58a5]" />
              Order Number
            </span>
            <input
              type="text"
              name="orderNumber"
              value={filters.orderNumber}
              onChange={handleInputChange}
              placeholder="Enter order number"
              className="h-[46px] w-full rounded-[8px] border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-[#2d58a5] focus:ring-2 focus:ring-[#2d58a5]/15"
            />
          </label>
          <button
            type="button"
            onClick={handleReset}
            className="mt-[26px] inline-flex h-[46px] items-center justify-center gap-2 rounded-[8px] border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <RotateCcw size={16} />
            Clear
          </button>
        </div>
      );
    }

    if (searchType === "order-stage") {
      return (
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
              <ListFilter size={16} className="text-[#2d58a5]" />
              Order Stage
            </span>
            <select
              name="status"
              value={filters.status}
              onChange={handleInputChange}
              className="h-[46px] w-full rounded-[8px] border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-[#2d58a5] focus:ring-2 focus:ring-[#2d58a5]/15"
            >
              <option value="">Select stage</option>
              {stageOptions.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={handleReset}
            className="mt-[26px] inline-flex h-[46px] items-center justify-center gap-2 rounded-[8px] border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <RotateCcw size={16} />
            Clear
          </button>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
            <CalendarDays size={16} className="text-[#2d58a5]" />
            From Date
          </span>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleInputChange}
            className="h-[46px] w-full rounded-[8px] border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-[#2d58a5] focus:ring-2 focus:ring-[#2d58a5]/15"
          />
        </label>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
            <CalendarDays size={16} className="text-[#2d58a5]" />
            To Date
          </span>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleInputChange}
            className="h-[46px] w-full rounded-[8px] border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-[#2d58a5] focus:ring-2 focus:ring-[#2d58a5]/15"
          />
        </label>
        <button
          type="button"
          onClick={handleReset}
          className="mt-[26px] inline-flex h-[46px] items-center justify-center gap-2 rounded-[8px] border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw size={16} />
          Clear
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[20px] border border-slate-300 bg-white px-4 py-5 shadow-sm sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#2d58a5]">
              <Search size={16} />
              Order Status
            </div>
            <h1 className="mt-2 text-[28px] font-black uppercase tracking-tight text-slate-900">{content.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{content.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Total</div>
              <div className="mt-1 text-xl font-black text-slate-900">{results?.summary?.total ?? 0}</div>
            </div>
            <div className="rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Pending</div>
              <div className="mt-1 text-xl font-black text-[#d97706]">{results?.summary?.pending ?? 0}</div>
            </div>
            <div className="rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Completed</div>
              <div className="mt-1 text-xl font-black text-[#059669]">{results?.summary?.completed ?? 0}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[20px] border border-slate-300 bg-white p-4 shadow-sm sm:p-6">
        {renderControls()}
      </section>

      <section className={tableCardClassName}>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-lg font-black uppercase tracking-wide text-[#2d58a5]">Order Table</h2>
        </div>

        <div className={tableShellClassName}>
          <table className={`${tableElementClassName} min-w-[1100px]`}>
            <thead>
              <tr className={tableHeaderRowClassName}>
                <th className={tableHeaderCellClassName}>Order No.</th>
                <th className={tableHeaderCellClassName}>Date &amp; Time</th>
                <th className={tableHeaderCellClassName}>Order Name</th>
                <th className={tableHeaderCellClassName}>Order Summary</th>
                <th className={tableHeaderCellClassName}>Current Status</th>
                <th className={tableHeaderCellCenterClassName}>File Type</th>
                <th className={tableHeaderCellCenterClassName}>Details</th>
              </tr>
            </thead>
            <tbody>
              {results.items.map((row, index) => (
                <tr key={row.id} className={getTableBodyRowClassName(index)}>
                  <td className={`${tableBodyCellClassName} font-semibold`}>{row.orderNumber}</td>
                  <td className={tableBodyCellClassName}>{row.dateTime}</td>
                  <td className={tableBodyCellClassName}>{row.orderName}</td>
                  <td className={tableBodyCellClassName}>{row.orderDetail}</td>
                  <td className={tableBodyCellClassName}>{row.status}</td>
                  <td className={tableBodyCellCenterClassName}>
                    {row.fileType === "email" ? (
                      <Mail className="mx-auto" size={28} color="#d93025" />
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
                        <FileText size={20} color="#6b7280" />
                        <span>{row.fileType}</span>
                      </div>
                    )}
                  </td>
                  <td className={tableBodyCellCenterClassName}>
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/associate-member/book-order/details/${row.id}`, { state: { order: row } })}
                      className={`${tableActionButtonClassName} italic`}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}

              {sectionLoading ? (
                <tr>
                  <td colSpan={7} className={tableEmptyCellClassName}>
                    Loading matching records...
                  </td>
                </tr>
              ) : null}

              {!sectionLoading && !canSearch ? (
                <tr>
                  <td colSpan={7} className={tableEmptyCellClassName}>
                    Select a filter to search matching orders.
                  </td>
                </tr>
              ) : null}

              {!sectionLoading && canSearch && !results.items.length ? (
                <tr>
                  <td colSpan={7} className={tableEmptyCellClassName}>
                    No matching orders found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
