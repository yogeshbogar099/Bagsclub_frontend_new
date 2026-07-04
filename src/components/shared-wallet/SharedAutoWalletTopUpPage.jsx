import { useMemo, useState } from "react";
import { getAuthSession, saveAuthSession } from "../../utils/auth.js";

const upiLogos = ["BHIM", "UPI", "GPAY", "PHONEPE", "PAYTM", "AMAZON PAY"];

export default function SharedAutoWalletTopUpPage({ submitTopUp, onRefresh }) {
  const [amount, setAmount] = useState("");
  const [submittedAmount, setSubmittedAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const qrUrl = useMemo(() => {
    if (!submittedAmount) return "";
    const qrData = `BAGSCLUB Wallet Topup - Amount: ${submittedAmount}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrData)}`;
  }, [submittedAmount]);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedAmount = amount.trim();
    if (!trimmedAmount) return;
    setSubmittedAmount(trimmedAmount);
    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const response = await submitTopUp({ amount: Number(trimmedAmount), remarks: "" });
      if (response?.walletBalance) {
        const session = getAuthSession();
        if (session?.user) {
          saveAuthSession({
            ...session,
            user: {
              ...session.user,
              walletBalance: response.walletBalance
            }
          });
        }
      }

      if (typeof onRefresh === "function") {
        await onRefresh();
      }

      window.dispatchEvent(new Event("walletchange"));
      window.dispatchEvent(new Event("dashboardstatschange"));

      setStatusMessage({
        type: "success",
        text: response?.walletBalance
          ? `Wallet recharged successfully. Updated A/C Balance: Rs. ${response.walletBalance}/-`
          : response?.message || "Wallet recharged successfully."
      });
    } catch (error) {
      setStatusMessage({ type: "error", text: error?.message || "Failed to add money to wallet." });
    } finally {
      setLoading(false);
    }
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
              statusMessage.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}
          >
            {statusMessage.text}
          </div>
        ) : null}

        <div
          className={`mx-auto grid max-w-[980px] gap-6 ${
            submittedAmount ? "lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start" : ""
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
                  inputMode="numeric"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="Enter Amount"
                  className="h-[42px] w-full border border-[#dddddd] bg-white px-3 text-[14px] text-[#444] outline-none placeholder:text-[#b5b5b5]"
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="text-[14px] leading-6 text-[#666]">
                  Enter amount and click Generate QR to update wallet balance.
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded bg-[#0d6efd] px-5 py-1.5 text-[13px] font-bold text-white transition hover:bg-[#0b5ed7]"
                >
                  {loading ? "Updating..." : "Generate QR"}
                </button>
              </div>
            </form>
          </div>

          {submittedAmount ? (
            <div className="border border-[#dddddd] bg-white p-5 text-center shadow-sm">
              <div className="mb-4 text-[17px] font-semibold text-[#444] md:text-[19px]">
                {`Pay Amount of Rs. ${submittedAmount} into your Wallet`}
              </div>
              <img src={qrUrl} alt="Wallet Topup QR" className="mx-auto h-[220px] w-[220px]" />
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {upiLogos.map((logo) => (
                  <span
                    key={logo}
                    className="rounded-full border border-[#d9d9d9] bg-[#f7f7f7] px-3 py-1 text-[11px] font-bold tracking-wide text-[#555]"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
