import { LogOut, RefreshCcw, Wallet } from "lucide-react";
import logo from "../../assets/images/logo.png";
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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 md:grid-cols-[280px_1fr_280px] md:items-center">
        <div className="flex items-center justify-center gap-3 md:justify-start">
          <img src={logo} alt="BAGSCLUB" className="block h-14 w-auto shrink-0 object-contain sm:h-16 md:h-20" />
          <div className="flex flex-col justify-center">
            <p className="text-lg font-extrabold tracking-wide text-blue-700 sm:text-xl md:text-2xl">BAGSCLUB</p>
            <p className="text-xs font-medium text-slate-600 sm:text-sm">No.1 Bag Printing Service</p>
          </div>
        </div>

        <div className="text-center">
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#333]">{headerData?.systemName || "Printing Services Division"}</p>
            <p className="text-xs text-[#a71a00]">
              Go to{" "}
              <button
                type="button"
                onClick={() => navigateTo("/")}
                className="font-semibold text-blue-700 transition hover:text-[#a71a00] hover:underline"
              >
                All Services
              </button>
            </p>
            <p className="text-xs leading-5 text-[#a71a00]">
              {headerData?.systemDescription || "Responsive associate member portal with cards, forms, tables, and modal workflows."}
            </p>
          </div>
        </div>

        <div className="text-center md:text-right">
          <div className="space-y-1 text-sm">
            <p className="font-bold">
              Hi, <span>{userName}</span>
            </p>
            <div className="text-xs font-bold text-[#a71a00]">
              <p>Member ID - {memberId}</p>
              <p className="inline-flex items-center gap-2">
                <Wallet size={14} />
                <span>A/C Balance :</span>
                <button
                  type="button"
                  onClick={() => navigateTo("/dashboard/associate-member/wallet")}
                  className="text-blue-700 transition hover:text-[#a71a00]"
                >
                  {balance}
                </button>
                <button
                  type="button"
                  onClick={onRefresh}
                  className="text-[#a71a00] transition hover:text-blue-700"
                  aria-label="Refresh balance"
                >
                  <RefreshCcw size={14} />
                </button>
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-[#a71a00]"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
