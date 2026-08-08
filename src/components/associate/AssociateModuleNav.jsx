import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  Home,
  LifeBuoy,
  Menu,
  PackageSearch,
  PlayCircle,
  PlusCircle,
  Settings,
  Wallet,
  X,
} from "lucide-react";

export default function AssociateNavbar() {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
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

  const basePath = "/dashboard/associate-member";

  const menuItems = [
    { id: "home", name: "Home", path: basePath, icon: Home },
    { id: "add-money", name: "Add Money", path: `${basePath}/wallet`, icon: Wallet },
    { id: "add-order", name: "Add Order", path: `${basePath}/book-order`, icon: PlusCircle },
    {
      id: "order-status",
      name: "Order Status",
      icon: PackageSearch,
      dropdown: [
        { id: "os-order-number", name: "Search by Order Number", path: `${basePath}/orders/search/order-number` },
        { id: "os-order-stage", name: "Search by Order Stage", path: `${basePath}/orders/search/order-stage` },
        { id: "os-order-date", name: "Search by Order Date", path: `${basePath}/orders/search/order-date` }
      ]
    },
    {
      id: "reports",
      name: "Reports",
      icon: BarChart3,
      dropdown: [
        { id: "r-orders-monthly", name: "Orderwise - Monthly Summary", path: `${basePath}/reports/orderwise-monthly-summary` },
        { id: "r-notes", name: "Notes Report", path: `${basePath}/reports/notes-report` },
        { id: "r-account-tx", name: "Account Transactions Report", path: `${basePath}/reports/account-transactions` },
        { id: "r-invoice", name: "Invoice Report", path: `${basePath}/reports/invoice-report` }
      ]
    },
    {
      id: "support",
      name: "Support",
      icon: LifeBuoy,
      dropdown: [
        { id: "s-notifications", name: "Notifications", path: `${basePath}/support/notifications` },
        { id: "s-help-desk", name: "Help Desk", path: `${basePath}/support/help` },
        { id: "s-terms", name: "Terms & Conditions", path: `${basePath}/support/terms` }
      ]
    },
    {
      id: "setting",
      name: "Setting / Setup",
      icon: Settings,
      dropdown: [
        { id: "set-profile", name: "Profile", path: `${basePath}/settings/profile` },
        { id: "set-change-password", name: "Change Password", path: `${basePath}/settings/change-password` }
      ]
    },
    { id: "training-videos", name: "Instruction & Training Videos", path: `${basePath}/training-videos`, icon: PlayCircle }
  ];

  const isItemActive = (item) => {
    if (item.path) {
      if (item.id === "home") {
        if (location.pathname === basePath) return true;
      } else if (location.pathname.startsWith(item.path)) {
        return true;
      }
    }
    if (item.dropdown) {
      return item.dropdown.some((sub) => location.pathname.startsWith(sub.path));
    }
    return false;
  };

  const activeButtonClasses =
    "border-[#9f2d07] bg-[#b7370c] font-bold text-white shadow-[0_1px_2px_rgba(167,26,0,0.18)]";
  const inactiveButtonClasses =
    "border-transparent bg-transparent text-[#4d4d4d] hover:border-[#e6dfd8] hover:bg-white hover:text-[#a71a00]";

  return (
    <nav
      aria-label="Associate Member primary navigation"
      className="relative w-full bg-white border-b border-[#e7eaec] shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-0 mb-0 text-[14px] leading-[1.42] font-bold box-border font-['Segoe_UI','Helvetica_Neue',sans-serif] min-h-[34px] rounded"
    >
      <div className="w-full max-w-none px-0 box-border">
        <div className="flex h-[34px] w-full items-center justify-start box-border">
          <Link
            to="/"
            className="ml-4 sm:ml-6 md:ml-0 inline-flex items-center gap-2 text-[14px] leading-[1.42] font-bold text-[#4d4d4d] hover:text-[#a71a00] box-border md:hidden"
          >
            <Home size={14} className="text-[#d29a4c]" />
            <span className="sr-only md:not-sr-only">Home</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileNavOpen((open) => !open)}
            aria-expanded={mobileNavOpen}
            aria-controls="associate-mobile-nav"
            className="mr-4 sm:mr-6 md:mr-0 inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded border border-[#e7eaec] bg-white text-[#4d4d4d] transition hover:bg-[#faf6f4] hover:text-[#a71a00] box-border md:hidden"
          >
            {mobileNavOpen ? <X size={14} /> : <Menu size={14} />}
            <span className="sr-only">Toggle navigation menu</span>
          </button>

          <div className="hidden w-full md:flex md:min-h-[34px] md:items-center md:justify-start md:gap-1 md:overflow-visible md:whitespace-nowrap md:pl-0 md:pr-0 box-border">
            {menuItems.map((item, index) => {
              const isOpen = activeDropdown === index;
              const isActive = isItemActive(item);
              const buttonClass = isActive ? activeButtonClasses : inactiveButtonClasses;
              const iconClass = isActive ? "text-white" : "text-[#d29a4c]";
              const chevronClass = isActive ? "text-white" : "text-[#7a7a7a]";

              if (!item.dropdown) {
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded border px-3 text-[14px] leading-[1.42] transition-all box-border ${buttonClass}`}
                  >
                    {item.icon ? <item.icon size={14} className={iconClass} /> : null}
                    {item.name}
                  </Link>
                );
              }

              return (
                <div
                  key={item.id}
                  className="relative shrink-0 box-border"
                  onMouseEnter={() => setActiveDropdown(index)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className={`flex h-[30px] items-center gap-1.5 rounded border px-3 whitespace-nowrap transition-all box-border ${buttonClass}`}>
                    {item.icon ? <item.icon size={14} className={iconClass} /> : null}
                    <span className="cursor-default">{item.name}</span>
                    <ChevronDown size={14} className={`${chevronClass} ${isOpen ? "rotate-180 transition" : "transition"}`} />
                  </div>

                  {isOpen ? (
                    <div className="absolute left-0 top-full z-50 mt-1 w-[min(16rem,calc(100vw-2rem))] overflow-hidden rounded border border-[#e1dbd4] bg-white py-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.12)] sm:w-64 box-border">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.id}
                          to={subItem.path}
                          className={`block px-4 py-2 text-[14px] leading-[1.42] text-[#5f6673] transition-colors hover:bg-[#faf6f4] hover:text-[#a71a00] box-border ${
                            location.pathname.startsWith(subItem.path) ? "bg-[#faf6f4] font-bold text-[#a71a00]" : ""
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        id="associate-mobile-nav"
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out md:hidden box-border ${
          mobileNavOpen ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-[#e7eaec] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.08)] sm:px-6 box-border">
          <div className="space-y-1 text-[14px] leading-[1.42] font-bold text-[#4d4d4d] box-border">
            {menuItems.map((item) => {
              const isActive = isItemActive(item);
              const buttonClass = isActive ? activeButtonClasses : inactiveButtonClasses;
              const iconClass = isActive ? "text-white" : "text-[#d29a4c]";
              const chevronClass = isActive ? "text-white" : "text-[#7a7a7a]";

              if (!item.dropdown) {
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex min-h-[44px] w-full items-center gap-2 rounded border px-4 text-left transition-all box-border ${buttonClass}`}
                  >
                    {item.icon ? <item.icon size={14} className={iconClass} /> : null}
                    {item.name}
                  </Link>
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
                      className={`flex min-h-[44px] flex-1 items-center gap-2 px-4 text-left transition-all box-border ${
                        isActive
                          ? "bg-[#b7370c] font-bold text-white"
                          : "bg-white text-[#4d4d4d] hover:bg-[#faf6f4] hover:text-[#a71a00]"
                      }`}
                    >
                      {item.icon ? <item.icon size={14} className={iconClass} /> : null}
                      {item.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileExpandedId((current) => (current === item.id ? null : item.id))}
                      aria-expanded={expanded}
                      aria-label={`Toggle ${item.name} mobile submenu`}
                      className={`inline-flex min-h-[44px] w-12 shrink-0 items-center justify-center border-l transition box-border ${
                        isActive
                          ? "border-[#7e2405] bg-[#b7370c] text-white"
                          : "border-[#e7eaec] bg-white text-[#7a7a7a] hover:bg-[#faf6f4] hover:text-[#a71a00]"
                      }`}
                    >
                      <ChevronDown size={14} className={`${chevronClass} ${expanded ? "rotate-180 transition" : "transition"}`} />
                    </button>
                  </div>

                  <div
                    className={`overflow-hidden rounded border border-[#e7eaec] bg-[#faf6f4] transition-[max-height] duration-300 ease-in-out box-border ${
                      expanded ? "max-h-[9999px]" : "max-h-0"
                    }`}
                  >
                    <div className="space-y-0.5 py-1 pl-4 box-border">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.id}
                          to={subItem.path}
                          onClick={() => {
                            setMobileNavOpen(false);
                            setMobileExpandedId(null);
                          }}
                          className={`flex min-h-[44px] w-full items-center rounded px-4 text-left text-[14px] leading-[1.42] transition box-border ${
                            location.pathname.startsWith(subItem.path)
                              ? "bg-[#b7370c] font-bold text-white"
                              : "bg-white text-[#5f6673] hover:bg-[#faf6f4] hover:text-[#a71a00]"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
