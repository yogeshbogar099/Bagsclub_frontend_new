import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  Home,
  LifeBuoy,
  PackageSearch,
  PlusCircle,
  Wallet
} from "lucide-react";

export default function AssociateNavbar() {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const basePath = "/dashboard/associate-member";

  const menuItems = [
    { name: "Home", path: "/", icon: Home },
    {
      name: "Order Status",
      icon: PackageSearch,
      dropdown: [
        { name: "Search by Order Number", path: `${basePath}/orders/search/order-number` },
        { name: "Search by Order Stage", path: `${basePath}/orders/search/order-stage` },
        { name: "Search by Order Date", path: `${basePath}/orders/search/order-date` }
      ]
    },
    { name: "Add Money", path: `${basePath}/wallet`, icon: Wallet },
    { name: "Add Order", path: `${basePath}/book-order`, icon: PlusCircle },
    {
      name: "Reports",
      icon: BarChart3,
      dropdown: [
        { name: "Orderwise - Monthly Summary", path: `${basePath}/reports/orderwise-monthly-summary` },
        { name: "Notes Report", path: `${basePath}/reports/notes-report` },
        { name: "Account Transactions Report", path: `${basePath}/reports/account-transactions` },
        { name: "Invoice Report", path: `${basePath}/reports/invoice-report` }
      ]
    },
    {
      name: "Support",
      icon: LifeBuoy,
      dropdown: [
        { name: "Notifications", path: `${basePath}/support/notifications` },
        { name: "Help Desk", path: `${basePath}/support/help` },
        { name: "Terms & Conditions", path: `${basePath}/support/terms` }
      ]
    }
  ];

  return (
    <nav className="border-y border-[#ddd7d0] bg-[#f5f2ef] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
      <ul className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-start gap-1 px-4 py-1.5 text-[12px] font-medium text-[#4d4d4d]">
          {menuItems.map((item, index) => (
            <li
              key={item.name}
              className="relative"
              onMouseEnter={() => item.dropdown && setActiveDropdown(index)}
              onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
            >
              {(() => {
                const isHome = item.name === "Home";
                const isLinkActive = item.path
                  ? isHome
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.path)
                  : false;
                const isDropdownActive = item.dropdown ? item.dropdown.some((sub) => location.pathname.startsWith(sub.path)) : false;
                const isActive = isLinkActive || isDropdownActive;

                if (item.dropdown) {
                  return (
                    <div
                      className={`flex cursor-pointer items-center gap-1.5 rounded-[6px] border px-3 py-[7px] leading-none transition-all ${
                        isActive
                          ? "border-[#9f2d07] bg-[#b7370c] font-semibold text-white shadow-[0_1px_2px_rgba(167,26,0,0.18)]"
                          : "border-transparent bg-transparent text-[#4d4d4d] hover:border-[#e6dfd8] hover:bg-white hover:text-[#a71a00]"
                      }`}
                    >
                      <item.icon size={12} className={isActive ? "text-white" : "text-[#d29a4c]"} />
                      {item.name}
                      <ChevronDown size={12} className={isActive ? "text-white" : "text-[#7a7a7a]"} />
                    </div>
                  );
                }

                return (
                <Link
                  to={item.path}
                  className={`flex items-center gap-1.5 rounded-[6px] border px-3 py-[7px] leading-none transition-all ${
                    isActive
                      ? "border-[#9f2d07] bg-[#b7370c] font-semibold text-white shadow-[0_1px_2px_rgba(167,26,0,0.18)]"
                      : "border-transparent bg-transparent text-[#4d4d4d] hover:border-[#e6dfd8] hover:bg-white hover:text-[#a71a00]"
                  }`}
                >
                  <item.icon size={12} className={isActive ? "text-white" : "text-[#d29a4c]"} />
                  {item.name}
                </Link>
                );
              })()}

              {item.dropdown && activeDropdown === index ? (
                <div className="absolute left-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-[8px] border border-[#e1dbd4] bg-white py-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`block px-4 py-2 text-[12px] text-[#5f6673] transition-colors hover:bg-[#faf6f4] hover:text-[#a71a00] ${
                        location.pathname.startsWith(subItem.path) ? "bg-[#faf6f4] font-semibold text-[#a71a00]" : ""
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
      </ul>
    </nav>
  );
}
