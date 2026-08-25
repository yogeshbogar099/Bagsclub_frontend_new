import { useMemo } from "react";
import { Printer, X } from "lucide-react";

function formatDateTime(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (Number.isNaN(d.getTime())) return "--";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${month} ${day} ${year} ${hours}:${minutes}${ampm}`;
}

function getMemberId(placedByUser) {
  if (!placedByUser) return "9305";
  if (placedByUser.associateMemberId) return placedByUser.associateMemberId;
  if (placedByUser.id) return String(placedByUser.id).slice(-4).toUpperCase();
  if (placedByUser.mobile) return String(placedByUser.mobile).slice(-4);
  return "9305";
}

export default function TaxInvoiceModal({ order, onClose }) {
  const invoiceNumber = useMemo(() => {
    if (order?.invoiceNumber && order.invoiceNumber !== "--") return order.invoiceNumber;
    const dateSource = order?.orderDateTime || order?.dateTime || order?.createdAt;
    const d = dateSource ? new Date(dateSource) : new Date();
    const validDate = !Number.isNaN(d.getTime()) ? d : new Date();
    const year = validDate.getFullYear();
    const month = String(validDate.getMonth() + 1).padStart(2, "0");
    const day = String(validDate.getDate()).padStart(2, "0");
    const num = order?.orderNumber ? String(order.orderNumber % 1000 || 1).padStart(3, "0") : "001";
    return `INV-${year}${month}${day}-${num}`;
  }, [order?.createdAt, order?.dateTime, order?.invoiceNumber, order?.orderDateTime, order?.orderNumber]);

  const invoiceDateStr = useMemo(() => {
    return formatDateTime(order?.orderDateTime || order?.dateTime || order?.createdAt);
  }, [order?.createdAt, order?.dateTime, order?.orderDateTime]);

  const printTimeStr = useMemo(() => {
    const d = new Date();
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })}`;
  }, []);

  const totalAmount = useMemo(() => {
    const debit = Number(order?.walletDebitAmount || 0);
    if (debit > 0) return debit;
    const base = Number(order?.basePayableAmount || 0);
    const discount = Number(order?.pdfDiscountAmount || 0);
    if (base > 0) return Math.max(0, base - discount);
    const selling = Number(order?.sellingPrice || 0);
    if (selling > 0) return selling;
    return 1226.02;
  }, [order?.basePayableAmount, order?.pdfDiscountAmount, order?.sellingPrice, order?.walletDebitAmount]);

  const stateStr = String(order?.placedByUser?.state || "MAHARASHTRA").trim();
  const isInterstate = stateStr.toLowerCase() !== "rajasthan";

  const taxCalculation = useMemo(() => {
    const taxable = Number((totalAmount / 1.18).toFixed(2));
    const totalTax = Number((totalAmount - taxable).toFixed(2));

    if (isInterstate) {
      return {
        cost: taxable,
        cgst: 0,
        cgstRate: "0%",
        sgst: 0,
        sgstRate: "0%",
        igst: totalTax,
        igstRate: "18.0%",
        subTotal: totalAmount
      };
    } else {
      const halfTax = Number((totalTax / 2).toFixed(2));
      return {
        cost: taxable,
        cgst: halfTax,
        cgstRate: "9.0%",
        sgst: halfTax,
        sgstRate: "9.0%",
        igst: 0,
        igstRate: "0%",
        subTotal: totalAmount
      };
    }
  }, [isInterstate, totalAmount]);

  const billToName = order?.placedByUser?.businessName || order?.placedByUser?.ownerName || order?.customerName || "Sandeep Printers";
  const billToAddress = order?.placedByUser?.fullAddress || order?.placedByUser?.address || "Near Godawari Bakery, Ausa Road";
  const billToCityState = `${order?.placedByUser?.city || "Latur"} , ${stateStr.toUpperCase()}`;
  const billToMobile = order?.customerMobile || order?.placedByUser?.mobileNumber || order?.placedByUser?.mobile || "9975813249";
  const memberIdVal = getMemberId(order?.placedByUser);
  const dispatchIdVal = order?.dispatchId || order?.orderNumber || "280";
  const hsnCode = order?.hsnSac || "48171000";

  const descriptionText = useMemo(() => {
    if (order?.orderDetailsOverview) return order.orderDetailsOverview;
    if (order?.orderDetail) return order.orderDetail;
    const prod = order?.orderName || "ATM Pouch";
    const bag = order?.bagName ? ` - ${order.bagName}` : "";
    const qty = order?.quantity || 1000;
    const print = order?.printSide ? ` Printing:${order.printSide}` : "";
    return `${prod}${bag},Quantity:${qty};${print};`;
  }, [order?.bagName, order?.orderDetail, order?.orderDetailsOverview, order?.orderName, order?.printSide, order?.quantity]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 sm:p-6 print:static print:block print:bg-white print:p-0">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #tax-invoice-printable-area, #tax-invoice-printable-area * {
            visibility: visible !important;
          }
          #tax-invoice-printable-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 15px !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative my-8 w-full max-w-4xl rounded-xl bg-white shadow-2xl print:m-0 print:w-full print:max-w-none print:rounded-none print:shadow-none">
        <div className="no-print flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-800">Tax Invoice View</span>
            <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              #{order?.orderNumber || invoiceNumber}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-full bg-[#305CA7] px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-[#244887]"
            >
              <Printer size={16} />
              Print / Save as PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div
          id="tax-invoice-printable-area"
          className="relative bg-white p-6 font-sans text-[12px] leading-tight text-black sm:p-10"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="w-12"></div>
            <h1 className="text-center text-[16px] font-black uppercase tracking-wider text-black">TAX INVOICE</h1>
            <button
              type="button"
              onClick={handlePrint}
              className="no-print flex h-10 w-10 items-center justify-center rounded-full bg-[#305CA7] text-white shadow transition hover:bg-[#244887]"
              title="Print Invoice"
              aria-label="Print Invoice"
            >
              <Printer size={20} />
            </button>
          </div>

          <div className="mb-6 grid gap-6 sm:grid-cols-2">
            <div className="space-y-1 font-semibold text-slate-900">
              <div><span className="font-bold">IRN :</span> N/A</div>
              <div><span className="font-bold">ACK No. :</span> N/A</div>
              <div><span className="font-bold">ACK Date :</span> N/A</div>
              <div><span className="font-bold">Invoice No. :</span> {invoiceNumber}</div>
              <div><span className="font-bold">Invoice Date :</span> {invoiceDateStr}</div>
              <div><span className="font-bold">E-Way Bill Number :</span> N/A</div>
              <div><span className="font-bold">Packed By :</span> MOOL SINGH</div>
            </div>

            <div className="space-y-1 text-right text-xs leading-normal sm:text-right">
              <div className="font-bold text-slate-900">From:</div>
              <div className="text-[14px] font-black text-black">Bagsclub of India Limited</div>
              <div>Jaipur - Branch</div>
              <div>Regd. Office - Plot No. 57, Jhotwara Industrial Area, Jaipur-12</div>
              <div>Website:- www.printersclub.in</div>
              <div>CIN # U22300RJ2018PLC061080</div>
              <div>TAN # JPRS18860C</div>
              <div>IEC Number ABACS2502D</div>
              <div>MSME UAM No. # UDYAM-RJ-17-0037946</div>
              <div>Dispatch Office :- 8058044206</div>
              <div>GST - 08ABACS2502D1ZX</div>
            </div>
          </div>

          <div className="mb-6 border-t border-slate-300 pt-4">
            <div className="font-extrabold text-black">BILL To:-</div>
            <div className="mt-1 font-bold text-black">{billToName}</div>
            <div>{billToAddress}</div>
            <div>{billToCityState} <span className="font-semibold">Mobile: {billToMobile}</span></div>
            <div>GSTIn - {order?.placedByUser?.gstNumber || ""}</div>
            <div><span className="font-semibold">Member Id :</span> {memberIdVal}</div>
            <div><span className="font-semibold">Dispatch Id :</span> {dispatchIdVal}</div>
          </div>

          <div className="mb-6">
            <div className="mb-1 font-bold text-black">Order Details:-</div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-left text-[11px]">
                <thead>
                  <tr className="border-b border-black bg-slate-100 font-bold text-black">
                    <th className="border-r border-black p-1.5 text-center">S.No</th>
                    <th className="border-r border-black p-1.5">Order Id</th>
                    <th className="border-r border-black p-1.5 text-right">Qty</th>
                    <th className="border-r border-black p-1.5">Description Of Goods</th>
                    <th className="border-r border-black p-1.5">HSN/SAC</th>
                    <th className="border-r border-black p-1.5 text-right">Cost</th>
                    <th className="border-r border-black p-1.5 text-right">C-GST</th>
                    <th className="border-r border-black p-1.5 text-right">S-GST</th>
                    <th className="border-r border-black p-1.5 text-right">I-GST</th>
                    <th className="p-1.5 text-right">Sub-Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black align-top">
                    <td className="border-r border-black p-1.5 text-center">1</td>
                    <td className="border-r border-black p-1.5">{order?.orderNumber || "367865"}</td>
                    <td className="border-r border-black p-1.5 text-right">{order?.quantity || 1000}</td>
                    <td className="border-r border-black p-1.5">{descriptionText}</td>
                    <td className="border-r border-black p-1.5">{hsnCode}</td>
                    <td className="border-r border-black p-1.5 text-right">{taxCalculation.cost.toFixed(2)}</td>
                    <td className="border-r border-black p-1.5 text-right">
                      {taxCalculation.cgst.toFixed(2)}
                      <br />
                      <span className="text-[10px]">({taxCalculation.cgstRate})</span>
                    </td>
                    <td className="border-r border-black p-1.5 text-right">
                      {taxCalculation.sgst.toFixed(2)}
                      <br />
                      <span className="text-[10px]">({taxCalculation.sgstRate})</span>
                    </td>
                    <td className="border-r border-black p-1.5 text-right">
                      {taxCalculation.igst.toFixed(2)}
                      <br />
                      <span className="text-[10px]">({taxCalculation.igstRate})</span>
                    </td>
                    <td className="p-1.5 text-right">{taxCalculation.subTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-1.5 text-right font-black text-black">
              Total Rs.{taxCalculation.subTotal.toFixed(2)}
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-1 font-bold text-black">Ratewise Classification</div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-left text-[11px]">
                <thead>
                  <tr className="border-b border-black bg-slate-100 font-bold text-black">
                    <th className="border-r border-black p-1.5">HSN</th>
                    <th className="border-r border-black p-1.5 text-right">Rate</th>
                    <th className="border-r border-black p-1.5 text-right">Quantity</th>
                    <th className="border-r border-black p-1.5 text-right">Taxable Value</th>
                    <th className="border-r border-black p-1.5 text-right">CGST</th>
                    <th className="border-r border-black p-1.5 text-right">SGST</th>
                    <th className="border-r border-black p-1.5 text-right">IGST</th>
                    <th className="p-1.5 text-right">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-1.5">{hsnCode}</td>
                    <td className="border-r border-black p-1.5 text-right">18.00</td>
                    <td className="border-r border-black p-1.5 text-right">{(Number(order?.quantity) || 1000).toFixed(2)}</td>
                    <td className="border-r border-black p-1.5 text-right">{taxCalculation.cost.toFixed(2)}</td>
                    <td className="border-r border-black p-1.5 text-right">{taxCalculation.cgst.toFixed(2)}</td>
                    <td className="border-r border-black p-1.5 text-right">{taxCalculation.sgst.toFixed(2)}</td>
                    <td className="border-r border-black p-1.5 text-right">{taxCalculation.igst.toFixed(2)}</td>
                    <td className="p-1.5 text-right">{taxCalculation.subTotal.toFixed(2)}</td>
                  </tr>
                  <tr className="font-bold text-black">
                    <td className="border-r border-black p-1.5">Total</td>
                    <td className="border-r border-black p-1.5"></td>
                    <td className="border-r border-black p-1.5 text-right">{(Number(order?.quantity) || 1000).toFixed(2)}</td>
                    <td className="border-r border-black p-1.5 text-right">{taxCalculation.cost.toFixed(2)}</td>
                    <td className="border-r border-black p-1.5 text-right">{taxCalculation.cgst.toFixed(2)}</td>
                    <td className="border-r border-black p-1.5 text-right">{taxCalculation.sgst.toFixed(2)}</td>
                    <td className="border-r border-black p-1.5 text-right">{taxCalculation.igst.toFixed(2)}</td>
                    <td className="p-1.5 text-right">{taxCalculation.subTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6 grid gap-6 sm:grid-cols-2">
            <div className="text-[11px] leading-normal">
              <div className="font-bold text-black">NEFT/RTGS/IMPS to Our Bank</div>
              <div>Bank Name - IDFC First Bank</div>
              <div>Branch : C-Scheme, Jaipur, Rajasthan</div>
              <div>Firm Name - BAGSCLUB OF INDIA LIMITED</div>
              <div>IFSC CODE : IDFB0042127</div>
              <div>A/C NO : 10062876334</div>
            </div>

            <div className="text-[11px] leading-normal">
              <div className="font-bold text-black">Terms and Conditions</div>
              <ol className="list-decimal pl-4 space-y-0.5">
                <li>Subject to Jaipur Jurisdiction Only</li>
                <li>Our responsibility ceases the moment the goods leave our godown.</li>
                <li>
                  All payments should be made in favour of Bagsclub of India Limited only via Bank Transfer or A/c Payee Cheque Only
                </li>
              </ol>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-4 text-center text-[10px] text-slate-700">
            <div>Certified that particulars given above are true and correct.</div>
            <div>This is computer generated Invoice. Printed on {printTimeStr}.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
