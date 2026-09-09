import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AssociateModuleHeader from "./AssociateModuleHeader.jsx";
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

  const isFullWidth =
    location.pathname.startsWith("/dashboard/associate-member/book-order") ||
    location.pathname.startsWith("/dashboard/associate-member/wallet");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="w-full bg-white print:hidden">
        <AssociateModuleHeader user={user} onSignOut={handleSignOut} />
        <div className="w-full">
          <div className="h-[2px] w-full bg-[#a71a00]" />
          <AssociateNavbar />
          <div className="h-[2px] w-full bg-[#a71a00]" />
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
