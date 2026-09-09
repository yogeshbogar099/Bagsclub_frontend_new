import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, FileSpreadsheet, Loader2, Printer } from "lucide-react";
import { useAssociateModule } from "../../context/AssociateModuleContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const upperMonthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function formatToInputDate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${monthNames[date.getMonth()]}-${pad(date.getDate())}-${date.getFullYear()}`;
}

function parseInputDate(str) {
  if (!str) return null;
  const s = String(str).trim();

  const partsHyphen = s.split("-");
  if (partsHyphen.length === 3) {
    const mIndex = monthNames.findIndex((m) => m.toLowerCase() === partsHyphen[0].toLowerCase());
    if (mIndex >= 0) {
      const day = parseInt(partsHyphen[1], 10);
      const year = parseInt(partsHyphen[2], 10);
      if (!isNaN(day) && !isNaN(year)) {
        return new Date(year, mIndex, day);
      }
    }
    if (partsHyphen[0].length === 4) {
      const year = parseInt(partsHyphen[0], 10);
      const month = parseInt(partsHyphen[1], 10) - 1;
      const day = parseInt(partsHyphen[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
  }

  const partsSlash = s.split("/");
  if (partsSlash.length === 3) {
    const day = parseInt(partsSlash[0], 10);
    const month = parseInt(partsSlash[1], 10) - 1;
    const year = parseInt(partsSlash[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  const direct = new Date(s);
  return isNaN(direct.getTime()) ? null : direct;
}

function formatDateForApi(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export default function AssociateAccountTransactionReportsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchAccountTransactionsReport, sectionLoading, error: contextError } = useAssociateModule();

  const defaultDates = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      from: formatToInputDate(start),
      to: formatToInputDate(end)
    };
  }, []);

  const [fromDateInput, setFromDateInput] = useState(defaultDates.from);
  const [toDateInput, setToDateInput] = useState(defaultDates.to);
  const [reportData, setReportData] = useState(null);
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(true);

  const displayedUserName = useMemo(() => {
    return (
      reportData?.userName ||
      reportData?.companyName ||
      user?.businessName ||
      user?.ownerName ||
      user?.name ||
      "User"
    ).toUpperCase();
  }, [reportData, user]);

  async function loadReport(fromStr = fromDateInput, toStr = toDateInput) {
    setLocalError("");
    setLoading(true);

    const fromParsed = parseInputDate(fromStr);
    const toParsed = parseInputDate(toStr);

    if (!fromParsed) {
      setLocalError("Please enter a valid From Date (e.g. Aug-01-2026).");
      setLoading(false);
      return;
    }
    if (!toParsed) {
      setLocalError("Please enter a valid To Date (e.g. Aug-31-2026).");
      setLoading(false);
      return;
    }
    if (fromParsed > toParsed) {
      setLocalError("From Date cannot be after To Date.");
      setLoading(false);
      return;
    }

    const data = await fetchAccountTransactionsReport({
      fromDate: formatDateForApi(fromParsed),
      toDate: formatDateForApi(toParsed)
    });

    if (data) {
      setReportData(data);
      if (data.formattedFromDate) setFromDateInput(data.formattedFromDate);
      if (data.formattedToDate) setToDateInput(data.formattedToDate);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadReport(defaultDates.from, defaultDates.to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleShow() {
    loadReport(fromDateInput, toDateInput);
  }

  function handlePrint() {
    window.print();
  }

  function handleExportExcel() {
    if (!reportData) return;

    const summary = reportData.summary || {};
    const title = reportData.statementTitle || "ACCOUNT STATEMENT";
    const from = reportData.formattedFromDate || fromDateInput;
    const to = reportData.formattedToDate || toDateInput;

    const rows = [
      ["USER NAME", `"${displayedUserName}"`],
      ["STATEMENT", `"${title}"`],
      ["PERIOD", `"${from} to ${to}"`],
      ["OPENING BALANCE", summary.openingBalanceFormatted || "0.00"],
      ["TOTAL CREDITED", summary.creditedFormatted || "0.00"],
      ["TOTAL DEBITED", summary.debitedFormatted || "0.00"],
      ["CLOSING BALANCE", summary.closingBalanceFormatted || "0.00"],
      [],
      ["DATE", "DESCRIPTION", "CREDIT", "DEBIT"]
    ];

    const txs = reportData.transactions || [];
    txs.forEach((tx) => {
      rows.push([
        `"${tx.formattedDate || ""}"`,
        `"${String(tx.description || "").replace(/"/g, '""')}"`,
        tx.credit ? tx.credit : "",
        tx.debit ? tx.debit : ""
      ]);
    });

    const csvContent = "\uFEFF" + rows.map((e) => e.join(",")).join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Account_Statement_${from.replace(/[^a-zA-Z0-9]/g, "_")}_to_${to.replace(/[^a-zA-Z0-9]/g, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const statementTitle = useMemo(() => {
    if (reportData?.statementTitle) return reportData.statementTitle;
    const fromParsed = parseInputDate(fromDateInput);
    const toParsed = parseInputDate(toDateInput);
    if (!fromParsed || !toParsed) {
      const now = new Date();
      return `ACCOUNT STATEMENT - ${upperMonthNames[now.getMonth()]}-${now.getFullYear()}`;
    }
    const m1 = upperMonthNames[fromParsed.getMonth()];
    const y1 = fromParsed.getFullYear();
    const m2 = upperMonthNames[toParsed.getMonth()];
    const y2 = toParsed.getFullYear();

    if (m1 === m2 && y1 === y2) {
      return `ACCOUNT STATEMENT - ${m1}-${y1}`;
    }
    if (y1 === y2) {
      return `ACCOUNT STATEMENT - ${m1}-${m2} ${y1}`;
    }
    return `ACCOUNT STATEMENT - ${m1}-${y1} - ${m2}-${y2}`;
  }, [fromDateInput, reportData?.statementTitle, toDateInput]);
  const summary = reportData?.summary || {
    openingBalanceFormatted: "0.00",
    creditedFormatted: "0.00",
    debitedFormatted: "0.00",
    closingBalanceFormatted: "0.00"
  };
  const transactions = reportData?.transactions || [];
  const activeLoading = loading || sectionLoading;

  return (
    <div className="w-full min-h-[calc(100vh-180px)] bg-white p-4 sm:p-6 font-['Segoe_UI','Helvetica_Neue',sans-serif] text-[#222] box-border print:p-0 print:bg-transparent">
      {/* Top Header Row with dynamic Title and Action Icons */}
      <div className="relative flex flex-col sm:flex-row items-center justify-between pb-3 sm:pb-4 gap-3 print:pb-2">
        <div className="hidden sm:block sm:w-24" />

        <h1 className="text-center text-[20px] sm:text-[24px] md:text-[26px] font-extrabold text-[#2b4c80] tracking-wide uppercase leading-tight print:text-[22px] print:text-black">
          {statementTitle}
        </h1>

        {/* Action Buttons: Print & Excel */}
        <div className="flex items-center gap-2 print:hidden self-end sm:self-center">
          <button
            type="button"
            onClick={handlePrint}
            title="Print Account Statement"
            aria-label="Print Statement"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#3069b3] text-white shadow-sm transition hover:bg-[#204a87] hover:scale-105 active:scale-95"
          >
            <Printer size={18} />
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            title="Export to Excel"
            aria-label="Export to Excel"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#107c41] text-white shadow-sm transition hover:bg-[#0d6535] hover:scale-105 active:scale-95"
          >
            <FileSpreadsheet size={18} />
          </button>
        </div>
      </div>

      {/* User Name on the left */}
      <div className="mb-3 print:mb-2">
        <h2 className="text-[20px] sm:text-[24px] font-bold text-[#204a87] tracking-tight uppercase leading-none print:text-[18px] print:text-black">
          {displayedUserName}
        </h2>
      </div>

      {/* Filter and Summary Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4 pb-2 border-b border-gray-100 print:border-none print:mb-2">
        {/* Date Filter */}
        <div className="flex flex-wrap items-end gap-3 print:hidden">
          <div className="flex flex-col gap-0.5">
            <label htmlFor="statement-from-date" className="text-[12px] font-bold text-[#333]">
              From Date
            </label>
            <input
              id="statement-from-date"
              type="text"
              value={fromDateInput}
              onChange={(e) => setFromDateInput(e.target.value)}
              placeholder="MMM-DD-YYYY"
              className="h-[32px] w-[130px] rounded border border-[#bbb] bg-white px-2.5 text-center text-[13px] font-medium text-[#222] shadow-inner outline-none transition focus:border-[#2b4c80] focus:ring-1 focus:ring-[#2b4c80]"
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <label htmlFor="statement-to-date" className="text-[12px] font-bold text-[#333]">
              To Date
            </label>
            <input
              id="statement-to-date"
              type="text"
              value={toDateInput}
              onChange={(e) => setToDateInput(e.target.value)}
              placeholder="MMM-DD-YYYY"
              className="h-[32px] w-[130px] rounded border border-[#bbb] bg-white px-2.5 text-center text-[13px] font-medium text-[#222] shadow-inner outline-none transition focus:border-[#2b4c80] focus:ring-1 focus:ring-[#2b4c80]"
            />
          </div>

          <button
            type="button"
            onClick={handleShow}
            disabled={activeLoading}
            className="h-[32px] px-5 rounded bg-[#c02a1b] text-white text-[13px] font-bold tracking-wide transition hover:bg-[#a0180c] active:scale-95 disabled:opacity-50 shadow-sm"
          >
            {activeLoading ? "Loading..." : "Show"}
          </button>
        </div>

        {/* Print-only date range display */}
        <div className="hidden print:block text-[13px] font-semibold text-black">
          Period: {reportData?.formattedFromDate || fromDateInput} to {reportData?.formattedToDate || toDateInput}
        </div>

        {/* Financial Summary on the right */}
        <div className="text-[13px] sm:text-[14px] font-semibold text-[#333] lg:text-right leading-relaxed">
          <span>Op Balance - </span>
          <span className="font-bold text-[#c02a1b]">{summary.openingBalanceFormatted}</span>
          <span>, Credited - </span>
          <span className="font-bold text-[#c02a1b]">{summary.creditedFormatted}</span>
          <span>, Debited - </span>
          <span className="font-bold text-[#c02a1b]">{summary.debitedFormatted}</span>
          <span>, Balance - </span>
          <span className="font-bold text-[#c02a1b]">{summary.closingBalanceFormatted}</span>
        </div>
      </div>

      {/* Error alert */}
      {(localError || contextError) && (
        <div className="mb-4 flex items-center gap-2 rounded border border-red-200 bg-red-50 p-3 text-[13px] font-medium text-red-700">
          <AlertCircle size={16} className="shrink-0" />
          <span>{localError || contextError}</span>
        </div>
      )}

      {/* Transaction Table */}
      <div className="w-full overflow-x-auto rounded border border-black shadow-sm print:border-black print:shadow-none">
        <table className="w-full min-w-[700px] border-collapse text-[13px] font-medium text-[#222]">
          <thead>
            <tr className="bg-black text-white text-[13px] font-bold uppercase tracking-wider">
              <th className="w-[20%] border-r border-black py-2.5 px-3 text-center">DATE</th>
              <th className="w-[50%] border-r border-black py-2.5 px-4 text-center">DESCRIPTION</th>
              <th className="w-[15%] border-r border-black py-2.5 px-3 text-center">CREDIT</th>
              <th className="w-[15%] py-2.5 px-3 text-center">DEBIT</th>
            </tr>
          </thead>
          <tbody>
            {activeLoading && transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-500">
                  <div className="inline-flex items-center gap-2 font-medium">
                    <Loader2 size={18} className="animate-spin text-[#2b4c80]" />
                    <span>Loading account transactions...</span>
                  </div>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-500 font-medium">
                  No account transactions found for the selected period.
                </td>
              </tr>
            ) : (
              transactions.map((tx, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <tr
                    key={tx.id || idx}
                    className={`border-t border-black transition-colors ${isEven ? "bg-white" : "bg-[#f9fafb]"
                      } hover:bg-[#f0f4f9] print:bg-white`}
                  >
                    {/* DATE */}
                    <td className="border-r border-black py-2 px-3 text-center text-[12.5px] font-medium whitespace-nowrap">
                      {tx.formattedDate}
                    </td>

                    {/* DESCRIPTION */}
                    <td className="border-r border-black py-2 px-4 text-center text-[13px]">
                      <span>{tx.description}</span>
                      {tx.orderId && (
                        <Link
                          to={`/dashboard/associate-member/book-order/details/${tx.orderId}`}
                          className="ml-1.5 font-bold italic text-[#0055cc] transition hover:text-[#c02a1b] hover:underline"
                        >
                          Detail
                        </Link>
                      )}
                    </td>

                    {/* CREDIT */}
                    <td className="border-r border-black py-2 px-4 text-center sm:text-right font-semibold text-[#111] whitespace-nowrap">
                      {tx.credit ? tx.credit : ""}
                    </td>

                    {/* DEBIT */}
                    <td className="py-2 px-4 text-center sm:text-right font-semibold text-[#111] whitespace-nowrap">
                      {tx.debit ? tx.debit : ""}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
