import { useRef } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { ADMIN_ADD_MONEY_BASE_PATH, ADMIN_ADD_ORDER_BASE_PATH, ADMIN_BASE_PATH, ADMIN_ORDER_DETAILS_BASE_PATH, adminModuleNavItems } from "./adminModuleConfig.js";

export default function AdminModuleNav({ pathname, openMenuId, setOpenMenuId, onNavigate }) {
  const hoverTimeoutRef = useRef(null);

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

  return (
    <>
      <div className="h-[3px] w-full bg-[#a71a00] shadow-sm" aria-hidden="true" />
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-1 gap-y-2 px-4 py-2">
          <div className="mr-2 inline-flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 md:hidden">
            <Menu size={16} /> Menu
          </div>
          {adminModuleNavItems.map((item) => {
            const isActive =
              pathname === item.path ||
              item.children?.some(
                (child) =>
                  pathname === child.path ||
                  (child.path === ADMIN_ADD_ORDER_BASE_PATH && pathname.startsWith(`${ADMIN_ADD_ORDER_BASE_PATH}/`)) ||
                  (pathname.startsWith(`${ADMIN_ORDER_DETAILS_BASE_PATH}/`) && child.path.startsWith(`${ADMIN_BASE_PATH}/orders/`)) ||
                  (child.path === ADMIN_ADD_MONEY_BASE_PATH && pathname.startsWith(`${ADMIN_ADD_MONEY_BASE_PATH}/`))
              );

            if (!item.children) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.path)}
                  className={`rounded border px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-[#a71a00] bg-[#a71a00] text-white"
                      : "border-transparent bg-transparent text-slate-700 hover:bg-slate-50 hover:text-[#a71a00]"
                  }`}
                >
                  {item.label}
                </button>
              );
            }

            const isOpen = openMenuId === item.id;

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => openMenu(item.id)}
                onMouseLeave={closeMenu}
              >
                <div className="flex overflow-hidden rounded border">
                  <button
                    type="button"
                    onClick={() => {
                      clearHoverTimeout();
                      setOpenMenuId((current) => (current === item.id ? null : item.id));
                    }}
                    className={`px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "border-[#a71a00] bg-[#a71a00] text-white"
                        : "border-transparent bg-transparent text-slate-700 hover:bg-slate-50 hover:text-[#a71a00]"
                    }`}
                  >
                    {item.label}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearHoverTimeout();
                      setOpenMenuId((current) => (current === item.id ? null : item.id));
                    }}
                    className={`border-l px-2 py-2 transition ${
                      isActive
                        ? "border-[#841400] bg-[#a71a00] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-[#a71a00]"
                    }`}
                    aria-label={`Toggle ${item.label} submenu`}
                  >
                    <ChevronDown size={14} className={isOpen ? "rotate-180 transition" : "transition"} />
                  </button>
                </div>

                {isOpen ? (
                  <div className="absolute left-0 top-full z-20 min-w-[240px] translate-y-1 overflow-hidden rounded-b border-t-2 border-[#a71a00] bg-white shadow-lg">
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
                          className={`block w-full border-b px-4 py-2 text-left text-sm transition last:border-b-0 ${
                            isChildActive
                              ? "border-slate-200 bg-[#a71a00] font-semibold text-white"
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
      </nav>
      <div className="h-[3px] w-full bg-[#a71a00] shadow-sm" aria-hidden="true" />
    </>
  );
}
