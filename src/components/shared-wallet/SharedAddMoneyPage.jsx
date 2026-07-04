import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTableBodyRowClassName,
  tableBodyCellClassName,
  tableCardClassName,
  tableElementClassName,
  tableEmptyCellClassName,
  tableHeaderCellClassName,
  tableHeaderRowClassName,
  tableShellClassName
} from "../shared-table/tableStyles.js";

const paymentOptions = [
  {
    id: "automatic",
    title: "AUTOMATIC WALLET TOP-UP",
    points: [
      "GENERATE AND SCAN A QR CODE ONLINE.",
      "PAYMENT IS INSTANTLY UPDATED IN YOUR WALLET."
    ],
    badge: "NEWLY LAUNCHED"
  },
  {
    id: "manual",
    title: "MANUAL WALLET TOP-UP",
    points: [
      "TRANSFER TO OUR BANK ACCOUNT.",
      "SEND SCREENSHOT TO OUR ACCOUNTS DEPARTMENT TO UPDATE YOUR WALLET."
    ]
  }
];

export default function SharedAddMoneyPage({ basePath, loadWalletHistory }) {
  const navigate = useNavigate();
  const [walletHistory, setWalletHistory] = useState({ items: [], summary: {}, meta: { columns: [] } });
  const [historyLoading, setHistoryLoading] = useState(false);

  const refreshWalletHistory = useCallback(async () => {
    if (!loadWalletHistory) return;

    setHistoryLoading(true);
    try {
      const data = await loadWalletHistory();
      setWalletHistory({
        items: Array.isArray(data?.items) ? data.items : [],
        summary: data?.summary || {},
        meta: data?.meta || { columns: [] }
      });
    } catch (_error) {
      setWalletHistory({ items: [], summary: {}, meta: { columns: [] } });
    } finally {
      setHistoryLoading(false);
    }
  }, [loadWalletHistory]);

  useEffect(() => {
    refreshWalletHistory();
  }, [refreshWalletHistory]);

  useEffect(() => {
    if (!loadWalletHistory) return undefined;

    window.addEventListener("focus", refreshWalletHistory);
    window.addEventListener("authchange", refreshWalletHistory);
    window.addEventListener("dashboardstatschange", refreshWalletHistory);
    window.addEventListener("walletchange", refreshWalletHistory);
    const timer = window.setInterval(refreshWalletHistory, 15000);

    return () => {
      window.removeEventListener("focus", refreshWalletHistory);
      window.removeEventListener("authchange", refreshWalletHistory);
      window.removeEventListener("dashboardstatschange", refreshWalletHistory);
      window.removeEventListener("walletchange", refreshWalletHistory);
      window.clearInterval(timer);
    };
  }, [loadWalletHistory, refreshWalletHistory]);

  const historyColumns = walletHistory?.meta?.columns?.length
    ? walletHistory.meta.columns
    : [
        { key: "reference", label: "Reference" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
        { key: "requestedOn", label: "Requested On" }
      ];
  const historySummary = walletHistory?.summary || {};
  const historyItems = walletHistory?.items || [];
  const historyCards = [
    { label: "Total Requests", value: historySummary.total ?? historyItems.length ?? 0 },
    { label: "Pending", value: historySummary.pending ?? 0 },
    { label: "Approved", value: historySummary.approved ?? 0 },
    { label: "Rejected", value: historySummary.rejected ?? 0 }
  ];

  return (
    <section className="min-h-[calc(100vh-300px)] bg-[#efefef] px-3 py-4 md:px-6 md:py-5">
      <div className="w-full">
        <h1 className="mb-14 text-center text-[28px] font-bold uppercase tracking-wide text-[#2d58a5] md:text-[34px]">
          Select Payment Option
        </h1>

        <div className="mx-auto grid max-w-[1250px] gap-12 lg:grid-cols-2 lg:gap-24">
          {paymentOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                navigate(option.id === "manual" ? `${basePath}/manual` : `${basePath}/manual/auto`)
              }
              className="rounded-[14px] border border-[#c7ccde] bg-[#f3f3f3] px-6 py-5 text-left shadow-[0_3px_8px_rgba(45,88,165,0.38)] transition duration-200 hover:-translate-y-0.5"
            >
              <h2 className="mb-2 text-center text-[26px] font-normal uppercase leading-tight text-[#2f2f2f] md:text-[32px]">
                {option.title}
              </h2>

              <ol className="space-y-1 pl-7 text-[17px] uppercase leading-[1.45] text-[#2f2f2f] md:text-[18px]">
                {option.points.map((point) => (
                  <li key={point} className="list-decimal">
                    {point}
                  </li>
                ))}
              </ol>

              {option.badge ? (
                <div className="mt-5 rounded-[6px] bg-[#f29b9b] px-4 py-1 text-center text-[17px] font-bold uppercase tracking-wide text-white">
                  {option.badge}
                </div>
              ) : null}
            </button>
          ))}
        </div>

        {loadWalletHistory ? (
          <section className="mx-auto mt-12 max-w-[1250px]">
            <div className="bg-white px-6 py-4 shadow-sm">
              <h2 className="text-center text-3xl font-extrabold uppercase tracking-wide text-[#2d58a5]">Transaction History</h2>
            </div>

            <div className="grid gap-4 bg-white px-4 py-5 shadow-sm md:grid-cols-4">
              {historyCards.map((card) => (
                <article key={card.label} className="rounded border border-[#d7ddea] bg-[#f7f8fc] px-4 py-3 text-center">
                  <div className="text-xs font-bold uppercase tracking-wide text-[#60739b]">{card.label}</div>
                  <div className="mt-2 text-2xl font-extrabold text-[#2f2f2f]">{card.value}</div>
                </article>
              ))}
            </div>

            <div className={tableCardClassName}>
              <div className={tableShellClassName}>
              <table className={`${tableElementClassName} min-w-[820px]`}>
                <thead>
                  <tr className={tableHeaderRowClassName}>
                    {historyColumns.map((column) => (
                      <th key={column.key} className={tableHeaderCellClassName}>
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historyItems.map((row, index) => (
                    <tr key={row.id || `${row.reference}-${index}`} className={getTableBodyRowClassName(index)}>
                      {historyColumns.map((column) => (
                        <td key={column.key} className={tableBodyCellClassName}>
                          {row[column.key] ?? "--"}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {historyLoading && !historyItems.length ? (
                    <tr>
                      <td colSpan={historyColumns.length} className={tableEmptyCellClassName}>
                        Loading transaction history...
                      </td>
                    </tr>
                  ) : null}
                  {!historyLoading && !historyItems.length ? (
                    <tr>
                      <td colSpan={historyColumns.length} className={tableEmptyCellClassName}>
                        No wallet transactions found yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
