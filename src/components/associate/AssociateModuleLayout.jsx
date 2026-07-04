import { useMemo } from "react";
import AssociateModuleFooter from "./AssociateModuleFooter.jsx";
import AssociateModuleHeader from "./AssociateModuleHeader.jsx";
import AssociateModuleNav from "./AssociateModuleNav.jsx";

export default function AssociateModuleLayout({ session, pathname, bootstrap, onRefresh, children }) {
  const headerData = useMemo(() => bootstrap?.header || {}, [bootstrap]);
  const footerData = useMemo(() => bootstrap?.footer || {}, [bootstrap]);

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#333]">
      <AssociateModuleHeader session={session} headerData={headerData} onRefresh={onRefresh} />
      <AssociateModuleNav />
      <main className="mx-auto w-full max-w-7xl px-4 py-5">{children}</main>
      <AssociateModuleFooter footerData={footerData} />
    </div>
  );
}
