import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { ADMIN_ADD_MONEY_BASE_PATH, ADMIN_ADD_ORDER_BASE_PATH, ADMIN_BASE_PATH, ADMIN_ORDER_DETAILS_BASE_PATH, adminModuleNavItems } from "./adminModuleConfig.js";

function MenuItemIcon({ item, isActive }) {
  if (isActive && item.activeIcon) {
    const ActiveIconComp = item.activeIcon;
    return <ActiveIconComp size={14} className="shrink-0 text-white" />;
  }
  if (item.emoji) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex shrink-0 items-center justify-center text-[14px] leading-none select-none"
      >
        {item.emoji}
      </span>
    );
  }
  if (item.icon) {
    const IconComp = item.icon;
    return <IconComp size={14} className={`shrink-0 ${isActive ? "text-white" : "text-[#d29a4c]"}`} />;
  }
  return null;
}

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
    hoverTimeoutRef.current = window.setTimeout(() => setOpenMenuId(null), 180);
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

  const activeButtonClasses =
    "border-[#9f2d07] bg-[#b7370c] font-bold text-white shadow-[0_1px_2px_rgba(167,26,0,0.18)]";
  const inactiveButtonClasses =
    "border-transparent bg-transparent text-[#4d4d4d] hover:border-[#e6dfd8] hover:bg-white hover:text-[#a71a00]";

  return (
    <>
      <div className="h-[3px] w-full bg-[#a71a00] shadow-sm box-border" aria-hidden="true" />
      <nav
        aria-label="Admin module primary navigation"
        className="relative w-full bg-white border-b border-[#e7eaec] shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-0 mb-0 text-[13px] lg:text-[14px] leading-[1.42] font-bold box-border font-['Segoe_UI','Helvetica_Neue',sans-serif] min-h-[36px] sm:min-h-[40px] lg:min-h-[36px] rounded"
      >
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:pl-[0.5%] lg:pr-4 box-border">
          <div className="flex h-[38px] sm:h-[42px] lg:h-[36px] w-full items-center justify-between box-border">
            <div className="flex items-center justify-between w-full md:hidden py-1 box-border">
              <button
                type="button"
                onClick={() => onNavigate(ADMIN_BASE_PATH)}
                className="inline-flex items-center gap-2 text-[13px] sm:text-[14px] leading-[1.42] font-bold text-[#4d4d4d] hover:text-[#a71a00] box-border"
              >
                <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center text-[15px] leading-none select-none">🏠</span>
                <span className="font-bold text-[#2f2f2f]">Admin Navigation</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileNavOpen((open) => !open)}
                aria-expanded={mobileNavOpen}
                aria-controls="admin-mobile-nav"
                className="inline-flex h-[32px] px-3 shrink-0 items-center gap-1.5 rounded border border-[#e7eaec] bg-white text-[13px] font-bold text-[#4d4d4d] transition hover:bg-[#faf6f4] hover:text-[#a71a00] box-border"
              >
                <span className="font-bold">{mobileNavOpen ? "Close" : "Menu"}</span>
                {mobileNavOpen ? <X size={15} /> : <Menu size={15} />}
              </button>
            </div>

            <div className="hidden w-full md:flex md:min-h-[36px] md:items-center md:justify-start md:gap-1 xl:gap-1.5 md:overflow-visible no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden whitespace-nowrap box-border">
              {adminModuleNavItems.map((item, index) => {
                const isOpen = openMenuId === item.id;
                const isActive = isPathActiveForItem(item);
                const buttonClass = isActive ? activeButtonClasses : inactiveButtonClasses;
                const chevronClass = isActive ? "text-white" : "text-[#7a7a7a]";
                const dropdownAlignClass = index >= 4 ? "right-0 left-auto" : "left-0 right-auto";

                if (!item.children) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onNavigate(item.path)}
                      className={`inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded border px-2.5 xl:px-3 text-[13px] xl:text-[14px] leading-[1.42] transition-colors duration-300 ease-in-out box-border ${buttonClass}`}
                    >
                      <MenuItemIcon item={item} isActive={isActive} />
                      <span>{item.label}</span>
                    </button>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="relative shrink-0 box-border"
                    onMouseEnter={() => openMenu(item.id)}
                    onMouseLeave={closeMenu}
                  >
                    <div
                      onClick={() => {
                        clearHoverTimeout();
                        onNavigate(item.path);
                      }}
                      className={`flex h-[30px] items-center gap-1.5 rounded border px-2.5 xl:px-3 text-[13px] xl:text-[14px] whitespace-nowrap transition-colors duration-300 ease-in-out box-border cursor-pointer ${buttonClass}`}
                    >
                      <MenuItemIcon item={item} isActive={isActive} />
                      <span className="cursor-pointer">{item.label}</span>
                      <ChevronDown
                        size={14}
                        onClick={(e) => {
                          e.stopPropagation();
                          clearHoverTimeout();
                          setOpenMenuId((current) => (current === item.id ? null : item.id));
                        }}
                        className={`${chevronClass} shrink-0 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>

                    <div
                      className={`absolute ${dropdownAlignClass} top-full z-50 mt-1 w-[min(16rem,calc(100vw-2rem))] overflow-hidden rounded border border-[#e1dbd4] bg-white py-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.12)] sm:w-64 box-border before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:content-[''] transition-all duration-300 ease-out origin-top ${isOpen
                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto visible"
                        : "opacity-0 -translate-y-2.5 scale-[0.98] pointer-events-none invisible"
                        }`}
                    >
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
                            className={`flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] xl:text-[14px] leading-[1.42] transition-all duration-[250ms] ease-out hover:bg-[#faf6f4] hover:text-[#a71a00] box-border ${isChildActive ? "bg-[#faf6f4] font-bold text-[#a71a00]" : "text-[#5f6673]"
                              }`}
                          >
                            <MenuItemIcon item={child} isActive={isChildActive} />
                            <span>{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          id="admin-mobile-nav"
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out md:hidden box-border ${mobileNavOpen ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="border-t border-[#e7eaec] bg-white px-3 sm:px-6 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.08)] box-border">
            <div className="space-y-1 text-[13px] sm:text-[14px] leading-[1.42] font-bold text-[#4d4d4d] box-border">
              {adminModuleNavItems.map((item) => {
                const isActive = isPathActiveForItem(item);
                const buttonClass = isActive ? activeButtonClasses : inactiveButtonClasses;
                const chevronClass = isActive ? "text-white" : "text-[#7a7a7a]";

                if (!item.children) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setMobileNavOpen(false);
                        onNavigate(item.path);
                      }}
                      className={`flex min-h-[44px] w-full items-center gap-2 rounded border px-4 text-left transition-all box-border ${buttonClass}`}
                    >
                      <MenuItemIcon item={item} isActive={isActive} />
                      <span>{item.label}</span>
                    </button>
                  );
                }

                const expanded = mobileExpandedId === item.id;

                return (
                  <div key={item.id} className="space-y-1 box-border">
                    <div className={`flex overflow-hidden rounded border box-border ${isActive ? "border-[#9f2d07]" : "border-[#e7eaec]"}`}>
                      <button
                        type="button"
                        onClick={() => setMobileExpandedId((current) => (current === item.id ? null : item.id))}
                        aria-expanded={expanded}
                        className={`flex min-h-[44px] flex-1 items-center gap-2 px-4 text-left transition-all box-border ${isActive
                          ? "bg-[#b7370c] font-bold text-white"
                          : "bg-white text-[#4d4d4d] hover:bg-[#faf6f4] hover:text-[#a71a00]"
                          }`}
                      >
                        <MenuItemIcon item={item} isActive={isActive} />
                        <span>{item.label}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMobileExpandedId((current) => (current === item.id ? null : item.id))}
                        aria-expanded={expanded}
                        aria-label={`Toggle ${item.label} mobile submenu`}
                        className={`inline-flex min-h-[44px] w-12 shrink-0 items-center justify-center border-l transition box-border ${isActive
                          ? "border-[#7e2405] bg-[#b7370c] text-white"
                          : "border-[#e7eaec] bg-white text-[#7a7a7a] hover:bg-[#faf6f4] hover:text-[#a71a00]"
                          }`}
                      >
                        <ChevronDown size={14} className={`${chevronClass} shrink-0 ${expanded ? "rotate-180 transition" : "transition"}`} />
                      </button>
                    </div>

                    <div
                      className={`overflow-hidden rounded border border-[#e7eaec] bg-[#faf6f4] transition-[max-height] duration-300 ease-in-out box-border ${expanded ? "max-h-[9999px]" : "max-h-0"
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
                              className={`flex min-h-[44px] w-full items-center gap-2 rounded px-4 text-left text-[13px] sm:text-[14px] leading-[1.42] transition-all duration-[300ms] ease-out box-border ${isChildActive
                                ? "bg-[#b7370c] font-bold text-white"
                                : "bg-white text-[#5f6673] hover:bg-[#faf6f4] hover:text-[#a71a00]"
                                }`}
                            >
                              <MenuItemIcon item={child} isActive={isChildActive} />
                              <span>{child.label}</span>
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
