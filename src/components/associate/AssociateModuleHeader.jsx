import { LogOut, RefreshCcw, UserCircle2, Wallet } from "lucide-react";
import logo from "../../assets/images/Bags_Club.png";
import { clearAuthSession, navigateTo } from "../../utils/auth.js";

export default function AssociateModuleHeader({ session, headerData, onRefresh }) {
  const userName = session?.user?.ownerName || session?.user?.businessName || "Associate Member";
  const memberId = headerData?.memberId || `ASM-${String(session?.user?.mobileNumber || "0000").slice(-4).padStart(4, "0")}`;
  const balance = headerData?.walletBalance || "0.00";

  function handleLogout() {
    clearAuthSession();
    navigateTo("/");
  }

  return (
    <header className="relative w-full bg-white border-b border-[#e7eaec] shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-0 mb-0 text-[14px] leading-[1.42] font-bold box-border font-['Segoe_UI','Helvetica_Neue',sans-serif] rounded">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 box-border">
        <div className="grid gap-4 py-3 lg:grid-cols-[240px_minmax(0,1fr)_320px] lg:items-center box-border">
        <div className="flex items-center justify-center lg:justify-start box-border">
          <img src={logo} alt="BAGSCLUB" className="block h-11 w-auto shrink-0 object-contain sm:h-12 md:h-14 box-border" />
        </div>

        <div className="min-w-0 text-center box-border">
          <div className="space-y-0.5 box-border">
            <p className="text-[14px] leading-[1.42] font-bold text-[#3a3a3a] box-border">{headerData?.systemName || "Printing Services Division"}</p>
            <p className="text-[14px] leading-[1.42] font-bold text-[#666] box-border">
              Go to{" "}
              <button
                type="button"
                onClick={() => navigateTo("/")}
                className="font-bold text-[#305CA7] transition hover:text-[#a71a00] hover:underline box-border"
              >
                All Services
              </button>
            </p>
            <p className="text-[14px] leading-[1.42] text-[#8b4d44] box-border">
              {headerData?.systemDescription || "Responsive associate member portal with cards, forms, tables, and modal workflows."}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-center justify-center gap-2 lg:items-end box-border">
          <div className="flex w-full max-w-[320px] items-start gap-2 rounded border border-[#e0e2e7] bg-white px-3 py-2 shadow-[0_1px_3px_rgba(15,23,42,0.06)] box-border">
            <div className="mt-0.5 rounded-full bg-[#a71a00] p-1.5 text-white box-border">
              <UserCircle2 size={14} />
            </div>
            <div className="min-w-0 text-left text-[14px] leading-[1.42] text-[#5c5c5c] box-border">
              <p className="font-bold text-[#2f2f2f] box-border">
                Hi, <span className="box-border">{userName}</span>
              </p>
              <p className="font-bold text-[#8f4d43] box-border">Member ID - {memberId}</p>
              <div className="inline-flex flex-wrap items-center gap-2 font-bold text-[#8f4d43] box-border">
                <span className="inline-flex items-center gap-1.5 box-border">
                  <Wallet size={14} />
                  <span>A/C Balance :</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigateTo("/dashboard/associate-member/wallet")}
                  className="text-[#305CA7] transition hover:text-[#a71a00] box-border"
                >
                  {balance}
                </button>
                <button
                  type="button"
                  onClick={onRefresh}
                  className="text-[#a71a00] transition hover:text-[#305CA7] box-border"
                  aria-label="Refresh balance"
                >
                  <RefreshCcw size={14} />
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded border border-[#f0c8bd] bg-white px-3 py-1.5 text-[14px] leading-[1.42] font-bold text-[#a71a00] transition hover:border-[#a71a00] hover:bg-[#fff7f4] box-border"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
      </div>
    </header>
  );
}
