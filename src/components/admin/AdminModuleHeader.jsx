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
    <header className="relative w-full bg-white border-b border-[#e7eaec] shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-0 mb-0 text-[14px] leading-[1.42] font-bold box-border font-['Segoe_UI','Helvetica_Neue',sans-serif] rounded">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 box-border">
        <div className="grid gap-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)_280px] lg:items-center box-border">
        <div className="flex items-center justify-center lg:justify-start box-border">
          <img src={logo} alt="Printers Club" className="h-12 w-auto object-contain sm:h-14 md:h-16 box-border" />
        </div>

        <div className="min-w-0 text-center box-border">
          <div className="space-y-1 box-border">
            <p className="text-[14px] leading-[1.42] font-bold text-[#333] box-border">{headerData?.systemName || "Admin Module"}</p>
            <p className="text-[14px] leading-[1.42] text-[#a71a00] box-border">
              Go to{" "}
              <button
                type="button"
                onClick={() => navigateTo("/")}
                className="font-bold text-blue-700 transition hover:text-[#a71a00] hover:underline box-border"
              >
                All Services
              </button>
            </p>
            <p className="text-[14px] leading-[1.42] text-[#a71a00] box-border">
              {headerData?.systemDescription || "Unified admin control panel for members, orders, wallet, production, and reports."}
            </p>
          </div>
        </div>

        <div className="min-w-0 text-center lg:text-right box-border">
          <div className="space-y-1 text-[14px] leading-[1.42] box-border">
            <p className="font-bold box-border">
              Hi, <span className="box-border">{userName}</span>
            </p>
            <div className="text-[14px] leading-[1.42] font-bold text-[#a71a00] box-border">
              <p className="box-border">Member ID - {memberId}</p>
              <p className="inline-flex flex-wrap items-center justify-center gap-2 lg:justify-end box-border">
                <span className="box-border">A/C Balance :</span>
                <button
                  type="button"
                  onClick={() => navigateTo("/dashboard/admin/wallet/add-money")}
                  className="text-blue-700 transition hover:text-[#a71a00] box-border"
                >
                  {balance}
                </button>
                <button
                  type="button"
                  onClick={onRefresh}
                  className="text-[#a71a00] transition hover:text-blue-700 box-border"
                  aria-label="Refresh account balance"
                >
                  <RefreshCcw size={14} />
                </button>
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-[14px] leading-[1.42] font-bold text-blue-700 transition hover:text-[#a71a00] box-border"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
        </div>
      </div>
    </header>
  );
}
