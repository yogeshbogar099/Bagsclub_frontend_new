import { RefreshCcw, UserCircle2, Wallet } from "lucide-react";
import logo from "../../assets/images/Bags_Club.png";
import { clearAuthSession, navigateTo } from "../../utils/auth.js";

export default function AssociateModuleHeader({ session, headerData, onRefresh, user: propUser, onSignOut }) {
  const currentUser = session?.user || propUser;
  const userName = currentUser?.ownerName || currentUser?.businessName || currentUser?.name || "Associate Member";
  const mobile = currentUser?.mobileNumber || currentUser?.mobile;
  const memberId =
    headerData?.memberId ||
    (mobile ? `ASM-${String(mobile).slice(-4).padStart(4, "0")}` : "ASM-0000");
  const balance = headerData?.walletBalance || currentUser?.walletBalance || "0.00";

  function handleLogout() {
    if (onSignOut) {
      onSignOut();
    } else {
      clearAuthSession();
      navigateTo("/");
    }
  }

  return (
    <header className="relative w-full bg-white border-b border-[#e7eaec] shadow-[0_1px_4px_rgba(0,0,0,0.05)] text-[14px] leading-[1.42] font-bold box-border font-['Segoe_UI','Helvetica_Neue',sans-serif]">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8 lg:px-[0.2%] box-border">
        <div className="grid gap-3 py-2.5 sm:py-3 grid-cols-1 lg:grid-cols-3 lg:items-center box-border">
          {/* Logo Section */}
          <div className="flex items-center justify-center lg:justify-start shrink-0 box-border lg:ml-[0.2%]">
            <img
              src={logo}
              alt="BAGSCLUB"
              className="block h-9 sm:h-10 md:h-12 lg:h-13 xl:h-14 w-auto max-w-[160px] sm:max-w-[200px] md:max-w-none shrink-0 object-contain box-border"
            />
          </div>

          {/* Middle Info Section */}
          <div className="min-w-0 text-center box-border flex flex-col items-center justify-center px-1">
            <div className="space-y-0.5 box-border w-full">
              <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-tight font-bold text-[#111] truncate box-border">
                {headerData?.systemName || "Printing Services Division"}
              </p>
              <p className="text-[12px] sm:text-[13px] leading-tight text-[#333] box-border">
                Go to{" "}
                <button
                  type="button"
                  onClick={() => navigateTo("/")}
                  className="font-bold text-[#0044cc] transition hover:text-[#a71a00] hover:underline box-border inline-block"
                >
                  All Services
                </button>
              </p>
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-0.5 pt-1 sm:pt-0.5 box-border text-[11px] sm:text-[12px] leading-tight text-[#444]">
                <p className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 box-border">
                  <span>Printers Registered with Us (India):</span>{" "}
                  <span className="bg-[#fce8e6] text-[#b30000] px-1.5 py-0.5 sm:py-0 rounded text-[11px] sm:text-[12px] font-bold shrink-0">
                    45389
                  </span>{" "}
                  <span>& increasing...</span>
                </p>
                <p className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 box-border">
                  <span>Printers Registered with Us (Outside India):</span>{" "}
                  <span className="bg-[#fce8e6] text-[#b30000] px-1.5 py-0.5 sm:py-0 rounded text-[11px] sm:text-[12px] font-bold shrink-0">
                    0
                  </span>{" "}
                  <span>& increasing...</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right User Profile & Wallet Section */}
          <div className="flex min-w-0 items-center justify-center lg:justify-end box-border w-full lg:w-auto lg:mr-[0.2%]">
            <div className="flex w-full sm:w-auto max-w-full sm:max-w-[380px] lg:max-w-[360px] items-center justify-between gap-2.5 sm:gap-3 rounded border border-[#e0e2e7] bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-[0_1px_3px_rgba(15,23,42,0.06)] box-border">
              <div className="flex items-center gap-2 min-w-0">
                <div className="rounded-full bg-[#a71a00] p-1.5 text-white shrink-0 box-border">
                  <UserCircle2 className="w-4 h-4 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0 text-left text-[12px] sm:text-[13px] md:text-[14px] leading-snug text-[#5c5c5c] box-border">
                  <p className="font-bold text-[#2f2f2f] truncate box-border">
                    Hi, <span className="box-border">{userName}</span>
                  </p>
                  <p className="font-bold text-[#8f4d43] whitespace-nowrap text-[11px] sm:text-[12px] md:text-[13px] box-border">
                    Member ID - {memberId}
                  </p>
                  <div className="inline-flex flex-wrap items-center gap-1 sm:gap-1.5 font-bold text-[#8f4d43] text-[11px] sm:text-[12px] md:text-[13px] box-border">
                    <span className="inline-flex items-center gap-1 box-border shrink-0">
                      <Wallet className="w-3.5 h-3.5 shrink-0" />
                      <span>A/C Balance :</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateTo("/dashboard/associate-member/wallet")}
                      className="text-[#305CA7] transition hover:text-[#a71a00] shrink-0 box-border"
                    >
                      {balance}
                    </button>
                    <button
                      type="button"
                      onClick={onRefresh}
                      className="text-[#a71a00] transition hover:text-[#305CA7] shrink-0 box-border p-0.5"
                      aria-label="Refresh balance"
                    >
                      <RefreshCcw className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="shrink-0 rounded border border-[#f0c8bd] bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-[12px] md:text-[13px] leading-tight font-bold text-[#a71a00] transition hover:border-[#a71a00] hover:bg-[#fff7f4] box-border whitespace-nowrap"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

