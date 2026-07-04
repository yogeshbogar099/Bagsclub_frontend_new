import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  Home,
  LifeBuoy,
  List,
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
    { name: "Rate List", path: `${basePath}/reports/rate-list`, icon: List },
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
    <>
      <div className="h-[3px] w-full bg-[#a71a00]" aria-hidden="true" />
      <nav className="w-full bg-white py-2">
        <ul className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 text-sm font-medium text-gray-700 md:gap-6">
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
                      className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 transition-colors ${
                        isActive ? "bg-red-600 font-bold text-white" : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                      }`}
                    >
                      <item.icon size={18} className={isActive ? "text-white" : "text-red-500"} />
                      {item.name}
                      <ChevronDown size={14} className={isActive ? "text-white" : "text-gray-700"} />
                    </div>
                  );
                }

                return (
                <Link
                  to={item.path}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-2 transition-colors ${
                    isActive ? "bg-red-600 font-bold text-white" : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  <item.icon size={18} className={isActive ? "text-white" : "text-red-500"} />
                  {item.name}
                </Link>
                );
              })()}

              {item.dropdown && activeDropdown === index ? (
                <div className="absolute left-0 top-full z-50 w-64 rounded-md border border-gray-100 bg-white py-2 shadow-lg">
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`block px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#a71a00] ${
                        location.pathname.startsWith(subItem.path) ? "bg-gray-50 font-semibold text-[#a71a00]" : ""
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
      <div className="h-[3px] w-full bg-[#a71a00]" aria-hidden="true" />
    </>
  );
}
