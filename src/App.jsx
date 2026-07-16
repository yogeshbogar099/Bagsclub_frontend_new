import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AdminModulePage from "./components/pages/AdminModulePage/AdminModulePage.jsx";
import AssociateAddOrderPage from "./components/associate/AssociateAddOrderPage.jsx";
import AssociateAutoWalletTopUpPage from "./components/associate/AssociateAutoWalletTopUpPage.jsx";
import AssociateBoxBagDesignOptionsPage from "./components/associate/AssociateBoxBagDesignOptionsPage.jsx";
import AssociateAddMoneyPage from "./components/associate/AssociateAddMoneyPage.jsx";
import AssociateChangePasswordPage from "./components/associate/AssociateChangePasswordPage.jsx";
import AssociateLayout from "./components/associate/AssociateLayout.jsx";
import AssociateManualWalletTopUpPage from "./components/associate/AssociateManualWalletTopUpPage.jsx";
import AssociateDCutBagDesignOptionsPage from "./components/associate/AssociateDCutBagDesignOptionsPage.jsx";
import AssociateLoopBagDesignOptionsPage from "./components/associate/AssociateLoopBagDesignOptionsPage.jsx";
import AssociateNonWovenBagPage from "./components/associate/AssociateNonWovenBagPage.jsx";
import AssociateNonWovenBagOrderPage from "./components/associate/AssociateNonWovenBagOrderPage.jsx";
import AssociateOrderDetailsPage from "./components/associate/AssociateOrderDetailsPage.jsx";
import AssociateOrderProductionLogPage from "./components/associate/AssociateOrderProductionLogPage.jsx";
import AssociateOrderStatusSearchPage from "./components/associate/AssociateOrderStatusSearchPage.jsx";
import AssociateMyProfilePage from "./components/associate/AssociateMyProfilePage.jsx";
import LoginPage from "./components/pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./components/pages/RegisterPage/RegisterPage.jsx";
import RoleModulePage from "./components/pages/RoleModulePage/RoleModulePage.jsx";
import SuperAdminPage from "./components/pages/SuperAdminPage/SuperAdminPage.jsx";
import About from "./components/sections/About/About.jsx";
import Cta from "./components/sections/Cta/Cta.jsx";
import Dedicated from "./components/sections/Dedicated/Dedicated.jsx";
import Footer from "./components/sections/Footer/Footer.jsx";
import Hero from "./components/sections/Hero/Hero.jsx";
import Navbar from "./components/sections/Navbar/Navbar.jsx";
import Portfolio from "./components/sections/Portfolio/Portfolio.jsx";
import Principles from "./components/sections/Principles/Principles.jsx";
import Reach from "./components/sections/Reach/Reach.jsx";
import Reasons from "./components/sections/Reasons/Reasons.jsx";
import Services from "./components/sections/Services/Services.jsx";
import { getAuthSession, getDashboardPath } from "./utils/auth.js";

function LandingPage() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Reach />
        <Portfolio />
        <Principles />
        <Reasons />
        <Cta />
        <Dedicated />
      </main>
      <Footer />
    </div>
  );
}

function DashboardPage({ session, pathname }) {
  const expectedPath = getDashboardPath(session.user.role);

  if (session.user.role === "super-admin") {
    if (!pathname.startsWith(expectedPath)) {
      return <Navigate to={expectedPath} replace />;
    }

    return <SuperAdminPage session={session} pathname={pathname} />;
  }

  if (session.user.role === "admin") {
    if (!pathname.startsWith(expectedPath)) {
      return <Navigate to={expectedPath} replace />;
    }

    return <AdminModulePage session={session} pathname={pathname} />;
  }

  if (pathname !== expectedPath) {
    return <Navigate to={expectedPath} replace />;
  }

  return <RoleModulePage session={session} />;
}

export default function App() {
  const location = useLocation();
  const [session, setSession] = useState(getAuthSession());
  const pathname = location.pathname;

  useEffect(() => {
    const handleAuthChange = () => {
      setSession(getAuthSession());
    };

    window.addEventListener("authchange", handleAuthChange);

    return () => {
      window.removeEventListener("authchange", handleAuthChange);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard/super-admin/*"
        element={session?.token ? <DashboardPage session={session} pathname={pathname} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard/admin/*"
        element={session?.token ? <DashboardPage session={session} pathname={pathname} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard/associate-member/*"
        element={
          session?.token ? (
            session?.user?.role === "associate-member" ? (
              <AssociateLayout />
            ) : (
              <Navigate to={getDashboardPath(session.user.role)} replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Navigate to="book-order" replace />} />
        <Route path="wallet" element={<AssociateAddMoneyPage />} />
        <Route path="wallet/manual" element={<AssociateManualWalletTopUpPage />} />
        <Route path="wallet/manual/auto" element={<AssociateAutoWalletTopUpPage />} />
        <Route path="orders/search/order-number" element={<AssociateOrderStatusSearchPage searchType="order-number" />} />
        <Route path="orders/search/order-stage" element={<AssociateOrderStatusSearchPage searchType="order-stage" />} />
        <Route path="orders/search/order-date" element={<AssociateOrderStatusSearchPage searchType="order-date" />} />
        <Route path="settings/change-password" element={<AssociateChangePasswordPage />} />
        <Route path="settings/profile" element={<AssociateMyProfilePage />} />
        <Route path="book-order" element={<AssociateAddOrderPage />} />
        <Route path="book-order/details/:orderId" element={<AssociateOrderDetailsPage />} />
        <Route path="book-order/details/:orderId/production-log" element={<AssociateOrderProductionLogPage />} />
        <Route path="book-order/non-woven-bag" element={<AssociateNonWovenBagPage />} />
        <Route path="book-order/non-woven-bag/d-cut-bag/design-options" element={<AssociateDCutBagDesignOptionsPage />} />
        <Route path="book-order/non-woven-bag/loop-bag/design-options" element={<AssociateLoopBagDesignOptionsPage />} />
        <Route path="book-order/non-woven-bag/box-bag/design-options" element={<AssociateBoxBagDesignOptionsPage />} />
        <Route path="book-order/non-woven-bag/:bagSlug" element={<AssociateNonWovenBagOrderPage />} />
        <Route path="*" element={<></>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
