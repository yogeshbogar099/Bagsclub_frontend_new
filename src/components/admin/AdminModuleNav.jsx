import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { ADMIN_ADD_MONEY_BASE_PATH, ADMIN_ADD_ORDER_BASE_PATH, ADMIN_BASE_PATH, ADMIN_ORDER_DETAILS_BASE_PATH, adminModuleNavItems } from "./adminModuleConfig.js";

export default function AdminModuleNav({ pathname, openMenuId, setOpenMenuId, onNavigate }) {
  const hoverTimeoutRef = useRef(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileExpandedId, setMobileExpandedId] = useState(null);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const clearHoverTimeout = () => {
    if (!hoverTimeoutRef.current) return;
    window.clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = null;
  };

  const openMenu = (menuId) => {
    clearHoverTimeout();
    setOpenMenuId(menuId);
  };

  const closeMenu = () => {
    clearHoverTimeout();
    hoverTimeoutRef.current = window.setTimeout(() => setOpenMenuId(null), 120);
  };

  const isPathActiveForItem = (item) =>
    pathname === item.path ||
    item.children?.some(
      (child) =>
        pathname === child.path ||
        (child.path === ADMIN_ADD_ORDER_BASE_PATH && pathname.startsWith(`${ADMIN_ADD_ORDER_BASE_PATH}/`)) ||
        (pathname.startsWith(`${ADMIN_ORDER_DETAILS_BASE_PATH}/`) && child.path.startsWith(`${ADMIN_BASE_PATH}/orders/`)) ||
        (child.path === ADMIN_ADD_MONEY_BASE_PATH && pathname.startsWith(`${ADMIN_ADD_MONEY_BASE_PATH}/`))
    );

  return (
    <>
      <div className="h-[3px] w-full bg-[#a71a00] shadow-sm box-border" aria-hidden="true" />
      <nav
        aria-label="Admin module primary navigation"
        className="relative w-full bg-white border-b border-[#e7eaec] shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-0 mb-0 text-[14px] leading-[1.42] font-bold box-border font-['Segoe_UI','Helvetica_Neue',sans-serif] min-h-[34px] rounded"
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 box-border">
          <div className="flex h-[34px] w-full items-center justify-between box-border">
              <button
                type="button"
                onClick={() => setMobileNavOpen((open) => !open)}
                aria-expanded={mobileNavOpen}
                aria-controls="admin-mobile-nav"
                className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded border border-[#e7eaec] bg-white text-slate-700 transition hover:bg-slate-50 hover:text-[#a71a00] box-border md:hidden"
              >
                {mobileNavOpen ? <X size={14} /> : <Menu size={14} />}
                <span className="sr-only">Toggle navigation menu</span>
              </button>

              <div className="hidden w-full md:flex md:min-h-[34px] md:items-center md:justify-start md:gap-1 md:overflow-visible md:whitespace-nowrap box-border">
                {adminModuleNavItems.map((item) => {
                  const isActive = isPathActiveForItem(item);
                  const activeButtonClasses = "border-[#a71a00] bg-[#a71a00] text-white";
                  const inactiveButtonClasses = "border-transparent bg-transparent text-slate-700 hover:bg-slate-50 hover:text-[#a71a00]";
                  const buttonClass = isActive ? activeButtonClasses : inactiveButtonClasses;

                  if (!item.children) {
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onNavigate(item.path)}
                        className={`inline-flex h-[30px] shrink-0 items-center rounded border px-4 text-[14px] leading-[1.42] font-bold transition box-border ${buttonClass}`}
                      >
                        {item.label}
                      </button>
                    );
                  }

                  const isOpen = openMenuId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="relative shrink-0 box-border"
                      onMouseEnter={() => openMenu(item.id)}
                      onMouseLeave={closeMenu}
                    >
                      <div className="flex h-[30px] overflow-hidden rounded border box-border">
                        <button
                          type="button"
                          onClick={() => {
                            clearHoverTimeout();
                            onNavigate(item.path);
                          }}
                          className={`inline-flex items-center px-4 text-[14px] leading-[1.42] font-bold transition box-border ${buttonClass}`}
                        >
                          {item.label}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            clearHoverTimeout();
                            setOpenMenuId((current) => (current === item.id ? null : item.id));
                          }}
                          className={`inline-flex items-center border-l px-3 transition box-border ${
                            isActive
                              ? "border-[#841400] bg-[#a71a00] text-white"
                              : "border-[#e7eaec] bg-white text-slate-700 hover:bg-slate-50 hover:text-[#a71a00]"
                          }`}
                          aria-label={`Toggle ${item.label} submenu`}
                        >
                          <ChevronDown size={14} className={isOpen ? "rotate-180 transition" : "transition"} />
                        </button>
                      </div>

                      {isOpen ? (
                        <div className="absolute left-0 top-full z-40 mt-1 w-[min(16rem,calc(100vw-2rem))] overflow-hidden rounded border-t-2 border-[#a71a00] bg-white shadow-[0_10px_25px_rgba(15,23,42,0.12)] sm:min-w-[240px] sm:w-auto box-border">
                          {item.children.map((child) => {
                            const isChildActive =
                              pathname === child.path ||
                              (child.path === ADMIN_ADD_ORDER_BASE_PATH && pathname.startsWith(`${ADMIN_ADD_ORDER_BASE_PATH}/`)) ||
                              (child.path === `${ADMIN_BASE_PATH}/orders/all` && pathname.startsWith(`${ADMIN_ORDER_DETAILS_BASE_PATH}/`)) ||
                              (child.path === ADMIN_ADD_MONEY_BASE_PATH && pathname.startsWith(`${ADMIN_ADD_MONEY_BASE_PATH}/`));

                            return (
                              <button
                                key={child.id}
                                type="button"
                                onClick={() => {
                                  clearHoverTimeout();
                                  setOpenMenuId(null);
                                  onNavigate(child.path);
                                }}
                                className={`block w-full border-b px-4 py-2.5 text-left text-[14px] leading-[1.42] transition last:border-b-0 box-border ${
                                  isChildActive
                                    ? "border-slate-200 bg-[#a71a00] font-bold text-white"
                                    : "border-slate-100 text-slate-700 hover:bg-rose-50 hover:pl-5 hover:text-[#a71a00]"
                                }`}
                              >
                                {child.label}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div
          id="admin-mobile-nav"
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out md:hidden box-border ${
            mobileNavOpen ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-[#e7eaec] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.08)] sm:px-6 box-border">
            <div className="space-y-1 text-[14px] leading-[1.42] font-bold text-slate-700 box-border">
              {adminModuleNavItems.map((item) => {
                const isActive = isPathActiveForItem(item);
                const activeButtonClasses = "border-[#a71a00] bg-[#a71a00] text-white";
                const inactiveButtonClasses = "border-[#e7eaec] bg-white text-slate-700 hover:bg-slate-50 hover:text-[#a71a00]";

                if (!item.children) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setMobileNavOpen(false);
                        onNavigate(item.path);
                      }}
                      className={`flex min-h-[44px] w-full items-center rounded border px-4 text-left transition box-border ${
                        isActive ? activeButtonClasses : inactiveButtonClasses
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                }

                const expanded = mobileExpandedId === item.id;

                return (
                  <div key={item.id} className="space-y-1 box-border">
                    <div className={`flex overflow-hidden rounded border box-border ${isActive ? "border-[#a71a00]" : "border-[#e7eaec]"}`}>
                      <button
                        type="button"
                        onClick={() => setMobileExpandedId((current) => (current === item.id ? null : item.id))}
                        aria-expanded={expanded}
                        className={`flex min-h-[44px] flex-1 items-center px-4 text-left transition box-border ${
                          isActive
                            ? "bg-[#a71a00] text-white"
                            : "bg-white text-slate-700 hover:bg-slate-50 hover:text-[#a71a00]"
                        }`}
                      >
                        {item.label}
                      </button>
                      <button
                        type="button"
                        onClick={() => setMobileExpandedId((current) => (current === item.id ? null : item.id))}
                        aria-expanded={expanded}
                        aria-label={`Toggle ${item.label} mobile submenu`}
                        className={`inline-flex min-h-[44px] w-12 shrink-0 items-center justify-center border-l transition box-border ${
                          isActive
                            ? "border-[#841400] bg-[#a71a00] text-white"
                            : "border-[#e7eaec] bg-white text-slate-700 hover:bg-slate-50 hover:text-[#a71a00]"
                        }`}
                      >
                        <ChevronDown size={14} className={expanded ? "rotate-180 transition" : "transition"} />
                      </button>
                    </div>

                    <div
                      className={`overflow-hidden rounded border border-[#e7eaec] bg-slate-50 transition-[max-height] duration-300 ease-in-out box-border ${
                        expanded ? "max-h-[9999px]" : "max-h-0"
                      }`}
                    >
                      <div className="space-y-0.5 py-1 pl-4 box-border">
                        {item.children.map((child) => {
                          const isChildActive =
                            pathname === child.path ||
                            (child.path === ADMIN_ADD_ORDER_BASE_PATH && pathname.startsWith(`${ADMIN_ADD_ORDER_BASE_PATH}/`)) ||
                            (child.path === `${ADMIN_BASE_PATH}/orders/all` && pathname.startsWith(`${ADMIN_ORDER_DETAILS_BASE_PATH}/`)) ||
                            (child.path === ADMIN_ADD_MONEY_BASE_PATH && pathname.startsWith(`${ADMIN_ADD_MONEY_BASE_PATH}/`));

                          return (
                            <button
                              key={child.id}
                              type="button"
                              onClick={() => {
                                setMobileNavOpen(false);
                                setMobileExpandedId(null);
                                onNavigate(child.path);
                              }}
                              className={`flex min-h-[44px] w-full items-center rounded px-4 text-left transition box-border ${
                                isChildActive
                                  ? "bg-[#a71a00] font-bold text-white"
                                  : "bg-white text-slate-700 hover:bg-rose-50 hover:text-[#a71a00]"
                              }`}
                            >
                              {child.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      <div className="h-[3px] w-full bg-[#a71a00] shadow-sm box-border" aria-hidden="true" />
    </>
  );
}
