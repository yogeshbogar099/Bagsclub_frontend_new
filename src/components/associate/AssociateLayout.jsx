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
      <header className="w-full bg-white">
        <div className="container mx-auto flex items-start justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="BAGSCLUB" className="block h-14 w-auto shrink-0 object-contain sm:h-16 md:h-20" />
          </div>

          <div className="flex flex-col items-end space-y-1 text-sm text-gray-700">
            <div className="font-semibold text-gray-900">Hi, Mr/Mrs {userName}</div>
            <div>
              Member ID: <span className="font-medium">{memberId}</span>
            </div>
            <div>
              A/C Balance: <span className="font-bold text-green-600">₹ {balance}</span>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-1 rounded border border-red-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="h-[2px] w-full bg-red-600" />
          <div className="container mx-auto">
            <AssociateNavbar />
          </div>
          <div className="h-[2px] w-full bg-red-600" />
        </div>
      </header>

      <main className={isFullWidth ? "w-full" : "container mx-auto px-4 py-8"}>
        <AssociateModuleProvider>
          <Outlet />
        </AssociateModuleProvider>
      </main>

      <AssociateFooter />
    </div>
  );
}
