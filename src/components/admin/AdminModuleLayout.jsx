import { useMemo, useState } from "react";
import AdminModuleFooter from "./AdminModuleFooter.jsx";
import AdminModuleHeader from "./AdminModuleHeader.jsx";
import AdminModuleNav from "./AdminModuleNav.jsx";
import { navigateTo } from "../../utils/auth.js";

export default function AdminModuleLayout({ session, pathname, bootstrap, onRefresh, children }) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const headerData = useMemo(() => bootstrap?.header || {}, [bootstrap]);
  const footerData = useMemo(() => bootstrap?.footer || {}, [bootstrap]);

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#333]">
      <AdminModuleHeader session={session} headerData={headerData} onRefresh={onRefresh} />
      <AdminModuleNav pathname={pathname} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} onNavigate={navigateTo} />
      <main className="mx-auto w-full max-w-7xl px-4 py-5">{children}</main>
      <AdminModuleFooter footerData={footerData} />
    </div>
  );
}
