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
    <header className="border-b border-[#d8dbe1] bg-[#f9f9fa]">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-3 lg:grid-cols-[240px_minmax(0,1fr)_320px] lg:items-center">
        <div className="flex items-center justify-center lg:justify-start">
          <img src={logo} alt="BAGSCLUB" className="block h-11 w-auto shrink-0 object-contain sm:h-12 md:h-14" />
        </div>

        <div className="min-w-0 text-center">
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-[#3a3a3a]">{headerData?.systemName || "Printing Services Division"}</p>
            <p className="text-[11px] font-medium text-[#666]">
              Go to{" "}
              <button
                type="button"
                onClick={() => navigateTo("/")}
                className="font-semibold text-[#305CA7] transition hover:text-[#a71a00] hover:underline"
              >
                All Services
              </button>
            </p>
            <p className="text-[11px] leading-4 text-[#8b4d44]">
              {headerData?.systemDescription || "Responsive associate member portal with cards, forms, tables, and modal workflows."}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-center justify-center gap-2 lg:items-end">
          <div className="flex w-full max-w-[320px] items-start gap-2 rounded-xl border border-[#e0e2e7] bg-white px-3 py-2 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
            <div className="mt-0.5 rounded-full bg-[#a71a00] p-1.5 text-white">
              <UserCircle2 size={18} />
            </div>
            <div className="min-w-0 text-left text-xs leading-5 text-[#5c5c5c]">
              <p className="font-bold text-[#2f2f2f]">
                Hi, <span>{userName}</span>
              </p>
              <p className="font-semibold text-[#8f4d43]">Member ID - {memberId}</p>
              <div className="inline-flex flex-wrap items-center gap-2 font-semibold text-[#8f4d43]">
                <span className="inline-flex items-center gap-1.5">
                  <Wallet size={13} />
                  <span>A/C Balance :</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigateTo("/dashboard/associate-member/wallet")}
                  className="text-[#305CA7] transition hover:text-[#a71a00]"
                >
                  {balance}
                </button>
                <button
                  type="button"
                  onClick={onRefresh}
                  className="text-[#a71a00] transition hover:text-[#305CA7]"
                  aria-label="Refresh balance"
                >
                  <RefreshCcw size={13} />
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-[#f0c8bd] bg-white px-3 py-1.5 text-xs font-semibold text-[#a71a00] transition hover:border-[#a71a00] hover:bg-[#fff7f4]"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
