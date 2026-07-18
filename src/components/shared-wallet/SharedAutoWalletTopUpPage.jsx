import { useEffect, useMemo, useState } from "react";
import { QrCode, WalletCards } from "lucide-react";

const UPI_ID = "solankesandeep10-2@oksbi";
const UPI_PAYEE_NAME = "Sandeep Satish Solunke";
const QR_VALIDITY_MS = 5 * 60 * 1000;
const paymentMethods = [
  { id: "phonepe", label: "PhonePe", accentClassName: "text-[#5f259f]" },
  { id: "gpay", label: "GPay", accentClassName: "text-[#4285f4]" },
  { id: "upi", label: "UPI", accentClassName: "text-[#0f9d58]" }
];

function formatUpiAmount(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return "";
  }

  return numericValue.toFixed(2).replace(/\.00$/, "");
}

export default function SharedAutoWalletTopUpPage() {
  const [amount, setAmount] = useState("");
  const [qrSession, setQrSession] = useState(null);
  const [timeRemainingMs, setTimeRemainingMs] = useState(0);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

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
      setQrSession(null);
      setTimeRemainingMs(0);
      setStatusMessage({
        type: "error",
        text: "QR code expired after 5 minutes. Please generate a new QR code to continue."
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

    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;
  }, [qrSession]);

  const timeLabel = useMemo(() => {
    if (!timeRemainingMs) return "00:00";

    const totalSeconds = Math.ceil(timeRemainingMs / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [timeRemainingMs]);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedAmount = amount.trim();
    const normalizedAmount = Number(trimmedAmount);
    if (!trimmedAmount || !Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      setStatusMessage({ type: "error", text: "Please enter a valid wallet top-up amount." });
      return;
    }

    setQrSession({
      amount: formatUpiAmount(normalizedAmount),
      createdAt: Date.now(),
      expiresAt: Date.now() + QR_VALIDITY_MS
    });
    setStatusMessage({
      type: "info",
      text: "QR code generated successfully. It will expire automatically after 5 minutes."
    });
  }

  return (
    <section className="min-h-[calc(100vh-300px)] bg-[#efefef] px-4 py-4 md:px-8 md:py-5">
      <div className="mx-auto max-w-[1280px]">
        <h1 className="mb-8 text-center text-[24px] font-bold uppercase tracking-wide text-[#2d58a5] md:text-[40px]">
          Enter Amount To Be Added
        </h1>

        {statusMessage.text ? (
          <div
            className={`mx-auto mb-6 max-w-[980px] rounded-[8px] px-4 py-3 text-sm ${
              statusMessage.type === "error" ? "bg-red-50 text-red-700" : "bg-blue-50 text-[#2d58a5]"
            }`}
          >
            {statusMessage.text}
          </div>
        ) : null}

        <div
          className={`mx-auto grid max-w-[980px] gap-6 ${
            qrSession ? "lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start" : ""
          }`}
        >
          <div className="border border-[#dddddd] bg-[#f3f3f3] shadow-sm">
            <form onSubmit={handleSubmit}>
              <div className="border-b border-[#e6e6e6] px-4 py-3">
                <div className="mb-2 text-[17px] font-semibold text-[#444] md:text-[19px]">
                  Enter wallet top-up amount
                </div>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="Enter Amount"
                  className="h-[42px] w-full border border-[#dddddd] bg-white px-3 text-[14px] text-[#444] outline-none placeholder:text-[#b5b5b5]"
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="text-[14px] leading-6 text-[#666]">
                  After payment verification, wallet balance will be updated manually by the Administrator.
                </div>
                <button
                  type="submit"
                  className="rounded bg-[#0d6efd] px-5 py-1.5 text-[13px] font-bold text-white transition hover:bg-[#0b5ed7]"
                >
                  Generate QR Code
                </button>
              </div>
            </form>
          </div>

          {qrSession ? (
            <div className="border border-[#dddddd] bg-white p-5 text-center shadow-sm">
              <div className="mb-4 text-[17px] font-semibold text-[#444] md:text-[19px]">
                {`Pay Amount of Rs. ${qrSession.amount} into your Wallet`}
              </div>
              <img src={qrUrl} alt="Wallet Topup QR" className="mx-auto h-[220px] w-[220px]" />
              <div className="mt-4 text-[14px] font-semibold text-[#b45309]">{`QR valid for ${timeLabel}`}</div>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center gap-2 rounded-full border border-[#d9d9d9] bg-[#f7f7f7] px-3 py-1 text-[11px] font-bold tracking-wide text-[#555]"
                  >
                    {method.id === "upi" ? (
                      <QrCode size={14} className={method.accentClassName} />
                    ) : (
                      <WalletCards size={14} className={method.accentClassName} />
                    )}
                    <span>{method.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
