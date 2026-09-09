import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, QrCode, WalletCards, ArrowLeft, Clock } from "lucide-react";
import { BhimUpiLogo, GooglePayLogo, PhonePeLogo, PaytmLogo, AmazonPayLogo } from "./PaymentLogos.jsx";

const UPI_ID = "solankesandeep10-2@oksbi";
const UPI_PAYEE_NAME = "Sandeep Satish Solunke";
const QR_VALIDITY_MS = 10 * 60 * 1000; // 10 minutes

const paymentMethods = [
  { id: "gpay", label: "Google Pay", accentClassName: "text-[#4285f4]", dotColor: "bg-[#4285f4]" },
  { id: "phonepe", label: "PhonePe", accentClassName: "text-[#5f259f]", dotColor: "bg-[#5f259f]" },
  { id: "paytm", label: "Paytm", accentClassName: "text-[#00baf2]", dotColor: "bg-[#00baf2]" },
  { id: "amazonpay", label: "Amazon Pay", accentClassName: "text-[#ff9900]", dotColor: "bg-[#ff9900]" },
  { id: "bhim", label: "BHIM UPI", accentClassName: "text-[#0f9d58]", isBhim: true }
];

function formatUpiAmount(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return "";
  }

  return numericValue.toFixed(2).replace(/\.00$/, "");
}

export default function SharedAutoWalletTopUpPage({ submitTopUp, onRefresh }) {
  const [amount, setAmount] = useState("");
  const [qrSession, setQrSession] = useState(null);
  const [timeRemainingMs, setTimeRemainingMs] = useState(0);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [utrNumber, setUtrNumber] = useState("");
  const [submittingProof, setSubmittingProof] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState(false);

  useEffect(() => {
    if (!qrSession) {
      setTimeRemainingMs(0);
      return undefined;
    }

    const updateTimeRemaining = () => {
      const remaining = Math.max(qrSession.expiresAt - Date.now(), 0);
      setTimeRemainingMs(remaining);
    };

    updateTimeRemaining();
    const intervalId = window.setInterval(updateTimeRemaining, 1000);
    const expiryId = window.setTimeout(() => {
      setTimeRemainingMs(0);
      setProofSubmitted(false);
      setStatusMessage({
        type: "error",
        text: "Payment QR code has expired after 10 minutes. Click 'Change Amount' or enter amount to generate a new QR."
      });
    }, Math.max(qrSession.expiresAt - Date.now(), 0));

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(expiryId);
    };
  }, [qrSession]);

  const qrUrl = useMemo(() => {
    if (!qrSession?.amount) return "";

    const transactionReference = `WTU${qrSession.createdAt}`;
    const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
      UPI_PAYEE_NAME
    )}&tr=${encodeURIComponent(transactionReference)}&am=${encodeURIComponent(qrSession.amount)}&cu=INR&mode=02`;

    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiUrl)}`;
  }, [qrSession]);

  const timeLabel = useMemo(() => {
    if (!timeRemainingMs) return "00:00";

    const totalSeconds = Math.ceil(timeRemainingMs / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [timeRemainingMs]);

  const isExpired = qrSession ? timeRemainingMs <= 0 : false;

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedAmount = amount.trim();
    const normalizedAmount = Number(trimmedAmount);

    if (!trimmedAmount || !Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      setStatusMessage({ type: "error", text: "Please enter a valid wallet top-up amount (greater than ₹0)." });
      return;
    }

    const formattedAmount = formatUpiAmount(normalizedAmount);
    setQrSession({
      amount: formattedAmount,
      createdAt: Date.now(),
      expiresAt: Date.now() + QR_VALIDITY_MS
    });
    setProofSubmitted(false);
    setUtrNumber("");
    setStatusMessage({
      type: "info",
      text: "QR code generated successfully! Scan & pay with any UPI app."
    });
  }

  function handleChangeAmount() {
    setQrSession(null);
    setTimeRemainingMs(0);
    setStatusMessage({ type: "", text: "" });
  }

  async function handleProofSubmit(event) {
    event.preventDefault();
    if (!submitTopUp) return;

    if (!utrNumber.trim()) {
      setStatusMessage({ type: "error", text: "Please enter UTR / Transaction Reference Number." });
      return;
    }

    setSubmittingProof(true);
    try {
      await submitTopUp({
        amount: Number(qrSession.amount),
        utrNumber: utrNumber.trim(),
        paymentMode: "UPI_QR"
      });
      setProofSubmitted(true);
      setStatusMessage({
        type: "success",
        text: "Top-up request submitted successfully! Administrator will verify and update your wallet."
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err?.message || "Failed to submit top-up request. Please try again."
      });
    } finally {
      setSubmittingProof(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-220px)] w-full bg-[#f8fafc] sm:bg-[#f1f5f9] px-3 sm:px-6 py-6 sm:py-10 flex flex-col items-center justify-start box-border">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        {statusMessage.text ? (
          <div
            className={`w-full max-w-[560px] mb-5 rounded-xl p-4 text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-sm transition-all ${
              statusMessage.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-blue-50 text-[#1d69d8] border border-blue-200"
            }`}
          >
            {statusMessage.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            ) : statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <QrCode className="w-4 h-4 shrink-0 text-[#1d69d8]" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        ) : null}

        {/* Card Container */}
        <div className="w-full max-w-[560px] bg-white rounded-2xl border border-[#cbd5e1] sm:border-[#e2e8f0] shadow-[0_10px_35px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-200 box-border">
          {qrSession ? (
            /* SCREEN 2: QR Payment Screen */
            <>
              {/* Dynamic Header Title */}
              <div className="bg-[#1d69d8] py-4 sm:py-5 px-4 sm:px-6 text-center box-border">
                <h1 className="text-[15px] sm:text-[19px] md:text-[21px] font-extrabold uppercase tracking-wide text-white leading-snug">
                  PAY AMOUNT OF RS. {qrSession.amount} INTO YOUR WALLET
                </h1>
              </div>

              <div className="p-5 sm:p-8 space-y-6 box-border">
                {/* Readonly Amount Field */}
                <div>
                  <label className="block text-[12px] sm:text-[13.5px] font-semibold text-[#475569] mb-2 text-left">
                    ₹ Amount to add to your wallet
                  </label>

                  <div className="flex items-stretch w-full rounded-lg overflow-hidden box-border">
                    <div className="flex items-center justify-center bg-[#e8f0fe] border border-r-0 border-[#cbd5e1] rounded-l-lg px-3.5 sm:px-4 text-[#1d69d8] font-bold text-[18px] sm:text-[20px] select-none shrink-0 min-w-[46px] sm:min-w-[52px]">
                      ₹
                    </div>

                    <input
                      type="text"
                      readOnly
                      value={qrSession.amount}
                      className="flex-1 w-full border border-[#cbd5e1] rounded-r-lg px-3.5 sm:px-4 py-2.5 sm:py-3 text-[15px] sm:text-[17px] font-bold text-[#1e293b] bg-slate-50 outline-none select-none min-h-[46px] sm:min-h-[50px] box-border"
                    />
                  </div>

                  {/* Change Amount Button */}
                  <div className="flex justify-center mt-3">
                    <button
                      type="button"
                      onClick={handleChangeAmount}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 px-4 sm:px-5 py-2 text-[13px] sm:text-[14px] font-semibold text-[#1d69d8] border border-slate-300 transition-all duration-200 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change Amount</span>
                    </button>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center pt-1">
                  <div className={`relative p-3.5 sm:p-4 bg-white rounded-2xl border transition-all ${isExpired ? "border-red-300 bg-red-50/50" : "border-[#cbd5e1] shadow-sm"}`}>
                    {isExpired ? (
                      <div className="flex flex-col items-center justify-center h-[200px] w-[200px] sm:h-[220px] sm:w-[220px] bg-slate-100/90 rounded-xl p-4 text-center space-y-2">
                        <AlertCircle className="w-10 h-10 text-red-500 shrink-0" />
                        <p className="text-[13px] font-bold text-red-600">Payment QR Expired</p>
                        <p className="text-[11px] text-slate-500">Timer reached 00:00. Please click Change Amount to generate a new QR.</p>
                      </div>
                    ) : (
                      <img
                        src={qrUrl}
                        alt="UPI Payment QR Code"
                        className="mx-auto h-[190px] w-[190px] sm:h-[220px] sm:w-[220px] max-w-full object-contain"
                      />
                    )}
                  </div>

                  {/* Text instructions below QR */}
                  <div className="mt-5 text-center space-y-1">
                    <p className="text-[13px] sm:text-[14.5px] font-bold text-[#1e293b]">
                      Scan and pay with any BHIM UPI app
                    </p>
                  </div>

                  {/* Separate and Larger Official BHIM UPI Brand Logo */}
                  <div className="mt-3 flex justify-center">
                    <div className="p-2 sm:p-2.5 rounded-xl border border-slate-200 bg-slate-50/90 shadow-2xs hover:bg-slate-100/80 transition-colors flex items-center justify-center">
                      <BhimUpiLogo className="h-9 sm:h-11 w-auto" />
                    </div>
                  </div>

                  {/* Row of Official Supported Payment App Brand Logos */}
                  <div className="mt-4 flex flex-wrap justify-center items-center gap-2.5 sm:gap-3">
                    <div className="flex items-center justify-center px-3.5 sm:px-4 py-2 rounded-xl border border-slate-200 bg-slate-50/90 shadow-2xs hover:bg-slate-100/80 transition-all">
                      <GooglePayLogo className="h-5 sm:h-6 w-auto" />
                    </div>
                    <div className="flex items-center justify-center px-3.5 sm:px-4 py-2 rounded-xl border border-slate-200 bg-slate-50/90 shadow-2xs hover:bg-slate-100/80 transition-all">
                      <PhonePeLogo className="h-5 sm:h-6 w-auto" />
                    </div>
                    <div className="flex items-center justify-center px-3.5 sm:px-4 py-2 rounded-xl border border-slate-200 bg-slate-50/90 shadow-2xs hover:bg-slate-100/80 transition-all">
                      <PaytmLogo className="h-5 sm:h-6 w-auto" />
                    </div>
                    <div className="flex items-center justify-center px-3.5 sm:px-4 py-2 rounded-xl border border-slate-200 bg-slate-50/90 shadow-2xs hover:bg-slate-100/80 transition-all">
                      <AmazonPayLogo className="h-5 sm:h-6 w-auto" />
                    </div>
                  </div>

                  {/* UTR Form if submitTopUp prop is present */}
                  {submitTopUp && !isExpired ? (
                    <form onSubmit={handleProofSubmit} className="w-full mt-5 pt-4 border-t border-dashed border-[#cbd5e1] text-left space-y-2.5">
                      <label htmlFor="utr-input" className="block text-[12px] font-semibold text-[#475569]">
                        After payment, enter UTR / Transaction Reference No.
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="utr-input"
                          type="text"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          placeholder="Enter 12-digit UTR No."
                          className="flex-1 border border-[#cbd5e1] rounded-lg px-3 py-2 text-[13px] text-[#1e293b] outline-none focus:border-[#1d69d8]"
                          disabled={proofSubmitted}
                        />
                        <button
                          type="submit"
                          disabled={submittingProof || proofSubmitted}
                          className="rounded-lg bg-[#1d69d8] hover:bg-[#1553b5] px-4 py-2 text-[13px] font-bold text-white transition disabled:opacity-50"
                        >
                          {submittingProof ? "Submitting..." : proofSubmitted ? "Submitted" : "Submit UTR"}
                        </button>
                      </div>
                    </form>
                  ) : null}
                </div>
              </div>

              {/* QR Validity Section & 10-Minute Live Countdown at Bottom */}
              <div className={`py-3.5 px-4 sm:px-6 flex items-center justify-between border-t text-[12px] sm:text-[13.5px] font-semibold box-border ${isExpired ? "bg-red-50 text-red-700 border-red-200" : "bg-[#f8fafc] text-slate-700 border-slate-200"}`}>
                <span className="truncate pr-2 flex items-center gap-1.5">
                  <Clock size={15} className={isExpired ? "text-red-600" : "text-[#1d69d8]"} />
                  <span>{isExpired ? "Payment QR Code Has Expired" : "This QR code is valid for 10 minutes only."}</span>
                </span>
                <span className={`px-3 py-1 rounded-full text-[12px] sm:text-[13px] font-bold shrink-0 ${isExpired ? "bg-red-100 text-red-700 border border-red-200" : "bg-amber-100 text-amber-900 border border-amber-200"}`}>
                  {timeLabel}
                </span>
              </div>
            </>
          ) : (
            /* SCREEN 1: Amount Entry Screen */
            <>
              {/* Blue Header Banner */}
              <div className="bg-[#1d69d8] py-4 sm:py-5 px-4 sm:px-6 text-center box-border">
                <h1 className="text-[17px] sm:text-[21px] md:text-[23px] font-extrabold uppercase tracking-wide text-white leading-snug">
                  ENTER AMOUNT TO BE ADDED
                </h1>
              </div>

              {/* Card Form Body */}
              <div className="p-5 sm:p-8 md:p-9 box-border">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="wallet-amount-input" className="block text-[12px] sm:text-[13.5px] font-semibold text-[#475569] mb-2 text-left">
                      ₹ Amount to add to your wallet
                    </label>

                    <div className="flex items-stretch w-full rounded-lg overflow-hidden box-border">
                      {/* Currency Prefix Box */}
                      <div className="flex items-center justify-center bg-[#e8f0fe] border border-r-0 border-[#cbd5e1] rounded-l-lg px-3.5 sm:px-4 text-[#1d69d8] font-bold text-[18px] sm:text-[20px] select-none shrink-0 min-w-[46px] sm:min-w-[52px]">
                        ₹
                      </div>

                      {/* Amount Input Field */}
                      <input
                        id="wallet-amount-input"
                        type="number"
                        min="1"
                        step="any"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="flex-1 w-full border border-[#cbd5e1] rounded-r-lg px-3.5 sm:px-4 py-2.5 sm:py-3 text-[15px] sm:text-[17px] font-normal text-[#1e293b] outline-none transition focus:border-[#1d69d8] focus:ring-1 focus:ring-[#1d69d8] placeholder:text-[#94a3b8] min-h-[46px] sm:min-h-[50px] box-border"
                      />
                    </div>
                  </div>

                  {/* Centered Generate QR Code Button */}
                  <div className="flex justify-center pt-1 sm:pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto min-w-[180px] sm:min-w-[200px] rounded-lg bg-[#0075ff] hover:bg-[#0065dc] active:bg-[#0055c0] px-6 sm:px-8 py-3 text-[14px] sm:text-[15.5px] font-bold text-white shadow-[0_3px_10px_rgba(0,117,255,0.3)] transition-all duration-200 cursor-pointer"
                    >
                      Generate QR Code
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}


