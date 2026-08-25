import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/Bags_Club.png";
import AssociateNavbar from "./AssociateNavbar.jsx";
import AssociateFooter from "./AssociateFooter.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { AssociateModuleProvider } from "../../context/AssociateModuleContext.jsx";

export default function AssociateLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  async function handleSignOut() {
    await logout();
    navigate("/", { replace: true });
  }

  const userName = user?.ownerName || user?.businessName || "Member";

  let memberId = "N/A";
  if (user?.mobileNumber) {
    memberId = String(user.mobileNumber).slice(-4);
  } else if (user?.mobile) {
    memberId = String(user.mobile).slice(-4);
  }

  const balance = user?.walletBalance || "0.00";

  const isFullWidth =
    location.pathname.startsWith("/dashboard/associate-member/book-order") ||
    location.pathname.startsWith("/dashboard/associate-member/wallet");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="w-full bg-white print:hidden">
        <div className="container mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-4 px-4 py-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="BAGSCLUB" className="block h-12 w-auto shrink-0 object-contain sm:h-14 md:h-16" />
          </div>

          <div className="flex flex-col items-center justify-center text-center my-1 md:my-0">
            <div className="space-y-0.5">
              <p className="text-[14px] sm:text-[15px] font-bold text-gray-900 leading-tight">
                Printing Services Division
              </p>
              <p className="text-[13px] text-gray-700 leading-tight">
                Go to{" "}
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="font-bold text-[#0044cc] hover:text-[#a71a00] hover:underline transition-colors"
                >
                  All Services
                </button>
              </p>
              <div className="flex flex-col items-center justify-center gap-0.5 pt-0.5">
                <p className="text-[12px] text-gray-700 leading-tight flex flex-wrap items-center justify-center gap-1">
                  <span>Printers Registered with Us (India):</span>{" "}
                  <span className="bg-[#fce8e6] text-[#b30000] px-1.5 py-0 rounded text-[12px] font-bold">
                    45389
                  </span>{" "}
                  <span>& increasing...</span>
                </p>
                <p className="text-[12px] text-gray-700 leading-tight flex flex-wrap items-center justify-center gap-1">
                  <span>Printers Registered with Us (Outside India):</span>{" "}
                  <span className="bg-[#fce8e6] text-[#b30000] px-1.5 py-0 rounded text-[12px] font-bold">
                    0
                  </span>{" "}
                  <span>& increasing...</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="flex flex-col items-start space-y-0.5 text-xs sm:text-sm text-gray-700">
              <div className="font-semibold text-gray-900">Hi, Mr/Mrs {userName}</div>
              <div>
                Member ID: <span className="font-medium">{memberId}</span>
              </div>
              <div>
                A/C Balance: <span className="font-bold text-green-600">₹ {balance}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="shrink-0 rounded border border-red-200 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="h-[2px] w-full bg-red-600" />
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <AssociateNavbar />
          </div>
          <div className="h-[2px] w-full bg-red-600" />
        </div>
      </header>

      <main className={isFullWidth ? "w-full print:p-0" : "container mx-auto px-4 py-8 sm:px-6 md:px-[2vw] lg:px-[2.5vw] xl:px-[2.5vw] print:p-0 print:m-0 print:max-w-none"}>
        <AssociateModuleProvider>
          <Outlet />
        </AssociateModuleProvider>
      </main>

      <div className="print:hidden">
        <AssociateFooter />
      </div>
    </div>
  );
}
