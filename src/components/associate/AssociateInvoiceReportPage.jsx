import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, FileSpreadsheet, Loader2, Printer } from "lucide-react";
import { useAssociateModule } from "../../context/AssociateModuleContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const monthsList = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

export default function AssociateInvoiceReportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchInvoiceReport, sectionLoading, error: contextError } = useAssociateModule();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));

  const [reportData, setReportData] = useState(null);
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(true);

  const yearOptions = useMemo(() => {
    const currentYr = now.getFullYear();
    const yrs = [];
    for (let y = currentYr - 2; y <= currentYr + 2; y++) {
      yrs.push(String(y));
    }
    return yrs;
  }, [now]);

  const displayedUserName = useMemo(() => {
    return (
      user?.businessName ||
      user?.ownerName ||
      user?.name ||
      "User"
    ).toUpperCase();
  }, [user]);

  async function loadReport(m = selectedMonth, y = selectedYear) {
    setLocalError("");
    setLoading(true);

    const data = await fetchInvoiceReport({
      month: m,
      year: y
    });

    if (data) {
      setReportData(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadReport(selectedMonth, selectedYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleShow() {
    loadReport(selectedMonth, selectedYear);
  }

  function handlePrint() {
    window.print();
  }

  function handleExportExcel() {
    if (!reportData) return;

    const period = reportData.periodLabel || "Report";
    const summary = reportData.summary || {};

    const rows = [
      ["USER NAME", `"${displayedUserName}"`],
      ["REPORT", `"INVOICE REPORT - ${period}"`],
      ["TOTAL TAXABLE", summary.totalTaxableFormatted || "0.00"],
      ["TOTAL CGST", summary.totalCgstFormatted || "0.00"],
      ["TOTAL SGST", summary.totalSgstFormatted || "0.00"],
      ["TOTAL IGST", summary.totalIgstFormatted || "0.00"],
      ["TOTAL AMOUNT", summary.totalAmountFormatted || "0.00"],
      [],
      ["INVOICE NO", "INVOICE DATE", "SUPPLIER", "SUPPLIER GST", "GST SCHEME", "TAXABLE AMOUNT", "TAX RATE", "CGST AMOUNT", "SGST AMOUNT", "IGST AMOUNT"]
    ];

    const invs = reportData.invoices || [];
    invs.forEach((inv) => {
      rows.push([
        `"${inv.invoiceNo || ""}"`,
        `"${inv.invoiceDate || ""}"`,
        `"${inv.supplier || ""}"`,
        `"${inv.supplierGst || ""}"`,
        `"${inv.gstScheme || ""}"`,
        inv.taxableAmount || "0.00",
        `"${inv.taxRate || "18.00%"}"`,
        inv.cgstAmount || "0.00",
        inv.sgstAmount || "0.00",
        inv.igstAmount || "0.00"
      ]);
    });

    const csvContent = "\uFEFF" + rows.map((e) => e.join(",")).join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Invoice_Report_${period.replace(/[^a-zA-Z0-9]/g, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const selectedMonthObj = monthsList.find((m) => m.value === selectedMonth);
  const selectedMonthName = selectedMonthObj ? selectedMonthObj.label.toUpperCase() : "AUGUST";
  const reportTitle = reportData?.periodLabel
    ? `INVOICE REPORT - ${reportData.periodLabel}`
    : `INVOICE REPORT - ${selectedMonthName} ${selectedYear}`;

  const invoices = reportData?.invoices || [];
  const summary = reportData?.summary || {
    totalTaxableFormatted: "0.00",
    totalCgstFormatted: "0.00",
    totalSgstFormatted: "0.00",
    totalIgstFormatted: "0.00",
    totalAmountFormatted: "0.00"
  };

  const activeLoading = loading || sectionLoading;

  return (
    <div className="w-full min-h-[calc(100vh-180px)] bg-white p-4 sm:p-6 font-['Segoe_UI','Helvetica_Neue',sans-serif] text-[#222] box-border print:p-0 print:bg-transparent">
      {/* Top Header Row */}
      <div className="relative flex flex-col sm:flex-row items-center justify-between pb-3 sm:pb-4 gap-3 print:pb-2">
        <div className="hidden sm:block sm:w-24" />

        <h1 className="text-center text-[20px] sm:text-[24px] md:text-[26px] font-extrabold text-[#2b4c80] tracking-wide uppercase leading-tight print:text-[22px] print:text-black">
          {reportTitle}
        </h1>

        {/* Action Buttons: Print & Excel */}
        <div className="flex items-center gap-2 print:hidden self-end sm:self-center">
          <button
            type="button"
            onClick={handlePrint}
            title="Print Invoice Report"
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
        {/* Month & Year Filter */}
        <div className="flex flex-wrap items-end gap-3 print:hidden">
          <div className="flex flex-col gap-0.5">
            <label htmlFor="invoice-select-month" className="text-[12px] font-bold text-[#333]">
              Select Month
            </label>
            <select
              id="invoice-select-month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="h-[32px] w-[140px] rounded border border-[#bbb] bg-white px-2.5 text-center text-[13px] font-medium text-[#222] shadow-inner outline-none transition focus:border-[#2b4c80] focus:ring-1 focus:ring-[#2b4c80]"
            >
              {monthsList.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-0.5">
            <label htmlFor="invoice-select-year" className="text-[12px] font-bold text-[#333]">
              Year
            </label>
            <select
              id="invoice-select-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="h-[32px] w-[110px] rounded border border-[#bbb] bg-white px-2.5 text-center text-[13px] font-medium text-[#222] shadow-inner outline-none transition focus:border-[#2b4c80] focus:ring-1 focus:ring-[#2b4c80]"
            >
              {yearOptions.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
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

        {/* Financial Summary on the right */}
        <div className="text-[12.5px] sm:text-[13.5px] font-semibold text-[#333] lg:text-right leading-relaxed">
          <span>Taxable - </span>
          <span className="font-bold text-[#c02a1b]">₹{summary.totalTaxableFormatted}</span>
          <span>, CGST - </span>
          <span className="font-bold text-[#c02a1b]">₹{summary.totalCgstFormatted}</span>
          <span>, SGST - </span>
          <span className="font-bold text-[#c02a1b]">₹{summary.totalSgstFormatted}</span>
          <span>, IGST - </span>
          <span className="font-bold text-[#c02a1b]">₹{summary.totalIgstFormatted}</span>
          <span>, Total - </span>
          <span className="font-bold text-[#c02a1b]">₹{summary.totalAmountFormatted}</span>
        </div>
      </div>

      {/* Error alert */}
      {(localError || contextError) && (
        <div className="mb-4 flex items-center gap-2 rounded border border-red-200 bg-red-50 p-3 text-[13px] font-medium text-red-700">
          <AlertCircle size={16} className="shrink-0" />
          <span>{localError || contextError}</span>
        </div>
      )}

      {/* Invoice Report Table */}
      <div className="w-full overflow-x-auto rounded border border-black shadow-sm print:border-black print:shadow-none">
        <table className="w-full min-w-[950px] border-collapse text-[12px] font-medium text-[#222]">
          <thead>
            <tr className="bg-black text-white text-[12px] font-bold uppercase tracking-wider">
              <th className="border-r border-black py-2.5 px-3 text-center">INVOICE NO</th>
              <th className="border-r border-black py-2.5 px-3 text-center">INVOICE DATE</th>
              <th className="border-r border-black py-2.5 px-3 text-center">SUPPLIER</th>
              <th className="border-r border-black py-2.5 px-3 text-center">SUPPLIER GST</th>
              <th className="border-r border-black py-2.5 px-3 text-center">GST SCHEME</th>
              <th className="border-r border-black py-2.5 px-3 text-center">TAXABLE AMOUNT</th>
              <th className="border-r border-black py-2.5 px-3 text-center">TAX RATE</th>
              <th className="border-r border-black py-2.5 px-3 text-center">CGST AMOUNT</th>
              <th className="border-r border-black py-2.5 px-3 text-center">SGST AMOUNT</th>
              <th className="py-2.5 px-3 text-center">IGST AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {activeLoading && invoices.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-gray-500">
                  <div className="inline-flex items-center gap-2 font-medium">
                    <Loader2 size={18} className="animate-spin text-[#2b4c80]" />
                    <span>Loading invoice report records...</span>
                  </div>
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-10 text-center text-gray-500 font-medium">
                  No invoice records found for {selectedMonthName} {selectedYear}.
                </td>
              </tr>
            ) : (
              invoices.map((inv, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <tr
                    key={inv.orderId || idx}
                    className={`border-t border-black transition-colors ${isEven ? "bg-white" : "bg-[#f9fafb]"
                      } hover:bg-[#f0f4f9] print:bg-white`}
                  >
                    {/* INVOICE NO */}
                    <td className="border-r border-black py-2 px-3 text-center font-bold text-[#0055cc]">
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/associate-member/book-order/details/${inv.orderId}/invoice`)}
                        className="underline underline-offset-2 transition hover:text-[#c02a1b]"
                        title="Click to view Tax Invoice"
                      >
                        {inv.invoiceNo}
                      </button>
                    </td>

                    {/* INVOICE DATE */}
                    <td className="border-r border-black py-2 px-3 text-center whitespace-nowrap">
                      {inv.invoiceDate}
                    </td>

                    {/* SUPPLIER */}
                    <td className="border-r border-black py-2 px-3 text-center font-semibold text-black">
                      {inv.supplier}
                    </td>

                    {/* SUPPLIER GST */}
                    <td className="border-r border-black py-2 px-3 text-center whitespace-nowrap">
                      {inv.supplierGst}
                    </td>

                    {/* GST SCHEME */}
                    <td className="border-r border-black py-2 px-3 text-center">
                      {inv.gstScheme}
                    </td>

                    {/* TAXABLE AMOUNT */}
                    <td className="border-r border-black py-2 px-3 text-right font-semibold text-[#111] whitespace-nowrap">
                      ₹{inv.taxableAmount}
                    </td>

                    {/* TAX RATE */}
                    <td className="border-r border-black py-2 px-3 text-center">
                      {inv.taxRate}
                    </td>

                    {/* CGST AMOUNT */}
                    <td className="border-r border-black py-2 px-3 text-right font-semibold text-[#111] whitespace-nowrap">
                      ₹{inv.cgstAmount}
                    </td>

                    {/* SGST AMOUNT */}
                    <td className="border-r border-black py-2 px-3 text-right font-semibold text-[#111] whitespace-nowrap">
                      ₹{inv.sgstAmount}
                    </td>

                    {/* IGST AMOUNT */}
                    <td className="py-2 px-3 text-right font-semibold text-[#111] whitespace-nowrap">
                      ₹{inv.igstAmount}
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
