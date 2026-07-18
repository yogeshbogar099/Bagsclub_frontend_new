import { LogOut, RefreshCcw } from "lucide-react";
import logo from "../../assets/images/Bags_Club.png";
import { clearAuthSession, navigateTo } from "../../utils/auth.js";

export default function AdminModuleHeader({ session, headerData, onRefresh }) {
  const userName = session?.user?.ownerName || session?.user?.businessName || "Admin";
  const memberId = headerData?.memberId || `ADM-${String(session?.user?.mobileNumber || "0000").slice(-4).padStart(4, "0")}`;
  const balance = headerData?.accountBalance || "0.00";

  function handleLogout() {
    clearAuthSession();
    navigateTo("/");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 md:grid-cols-[280px_1fr_280px] md:items-center">
        <div className="flex items-center justify-center md:justify-start">
          <img src={logo} alt="Printers Club" className="h-12 w-auto object-contain sm:h-14 md:h-16" />
        </div>

        <div className="text-center">
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#333]">{headerData?.systemName || "Admin Module"}</p>
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
              {headerData?.systemDescription || "Unified admin control panel for members, orders, wallet, production, and reports."}
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
                <span>A/C Balance :</span>
                <button
                  type="button"
                  onClick={() => navigateTo("/dashboard/admin/wallet/add-money")}
                  className="text-blue-700 transition hover:text-[#a71a00]"
                >
                  {balance}
                </button>
                <button
                  type="button"
                  onClick={onRefresh}
                  className="text-[#a71a00] transition hover:text-blue-700"
                  aria-label="Refresh account balance"
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
