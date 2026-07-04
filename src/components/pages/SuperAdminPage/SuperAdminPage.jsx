import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Clock3,
  ChevronDown,
  ClipboardList,
  Eye,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Paperclip,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import { clearAuthSession, navigateTo } from "../../../utils/auth.js";
import AssociateFooter from "../../associate/AssociateFooter.jsx";
import SharedOrderRecordsTable from "../../shared-order/SharedOrderRecordsTable.jsx";
import SharedOrderDetailsView from "../../shared-order/SharedOrderDetailsView.jsx";
import SharedOrderTableToolbar from "../../shared-order/SharedOrderTableToolbar.jsx";
import SharedUserDetailsView from "../../shared-user/SharedUserDetailsView.jsx";
import {
  downloadGenericRowsAsExcel,
  downloadGenericRowsAsPdf,
  downloadOrderRowsAsExcel,
  downloadOrderRowsAsPdf,
  filterGenericTableItems,
  filterOrderTableItems
} from "../../shared-order/orderTableTools.js";
import {
  getTableBodyRowClassName,
  tableActionButtonClassName,
  tableBodyCellClassName,
  tableBodyCellCenterClassName,
  tableBodyCellMutedClassName,
  tableCardClassName,
  tableElementClassName,
  tableEmptyCellClassName,
  tableHeaderCellCenterClassName,
  tableHeaderCellClassName,
  tableHeaderRowClassName,
  tablePaginationBarClassName,
  tablePaginationButtonClassName,
  tableSectionCountClassName,
  tableSectionHeaderClassName,
  tableShellClassName
} from "../../shared-table/tableStyles.js";
import { SuperAdminAddMoneyLandingView, SuperAdminAutoWalletTopUpView, SuperAdminManualWalletTopUpView } from "../../super-admin/SuperAdminAddMoneyViews.jsx";
import { SuperAdminAddOrderLandingView, SuperAdminNonWovenBagOrderView, SuperAdminNonWovenBagSelectionView } from "../../super-admin/SuperAdminAddOrderViews.jsx";
import logo from "../../../assets/images/logo.png";

const primaryNavItems = [
  {
    id: "home",
    label: "Home",
    path: "/",
    description: "Go back to the public website landing page."
  },
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard/super-admin",
    description: "Centralized overview of users, orders, wallets, reports, and audit activity."
  },
  {
    id: "users",
    label: "User Management",
    path: "/dashboard/super-admin/user-management",
    description: "Manage admin users and associate member accounts from one place.",
    children: [
      {
        id: "admin-management",
        label: "Admin Management",
        path: "/dashboard/super-admin/user-management/admin-management",
        description: "Create, update, and monitor admin access and status."
      },
      {
        id: "associate-member-management",
        label: "Associate Member Management",
        path: "/dashboard/super-admin/user-management/associate-member-management",
        description: "Review member onboarding, verification, and account lifecycle."
      }
    ]
  },
  {
    id: "orders",
    label: "Order",
    path: "/dashboard/super-admin/order-management",
    description: "Track the full printing workflow from new orders to final delivery.",
    children: [
      {
        id: "add-order",
        label: "Add Order",
        path: "/dashboard/super-admin/order-management/add-order",
        description: "Create a new order with the same add-order workflow used across modules."
      },
      {
        id: "all-orders",
        label: "All Orders",
        path: "/dashboard/super-admin/order-management/all-orders",
        description: "Complete order listing across every production status."
      },
      {
        id: "pending-orders",
        label: "Pending Orders",
        path: "/dashboard/super-admin/order-management/pending-orders",
        description: "Orders waiting for approval, files, or payment confirmation."
      },
      {
        id: "printing-orders",
        label: "Printing Orders",
        path: "/dashboard/super-admin/order-management/printing-orders",
        description: "Jobs currently scheduled or running in production."
      },
      {
        id: "packaging-orders",
        label: "Packaging Orders",
        path: "/dashboard/super-admin/order-management/packaging-orders",
        description: "Orders ready for packing, labeling, and dispatch prep."
      },
      {
        id: "dispatch-orders",
        label: "Dispatch Orders",
        path: "/dashboard/super-admin/order-management/dispatch-orders",
        description: "Orders moving to courier handoff and shipment confirmation."
      },
      {
        id: "completed-orders",
        label: "Completed Orders",
        path: "/dashboard/super-admin/order-management/completed-orders",
        description: "Finished orders delivered and closed successfully."
      },
      {
        id: "improper-orders",
        label: "Improper Orders",
        path: "/dashboard/super-admin/order-management/improper-orders",
        description: "Orders flagged for data, design, or process mismatch."
      },
      {
        id: "cancelled-orders",
        label: "Cancelled Orders",
        path: "/dashboard/super-admin/order-management/cancelled-orders",
        description: "Cancelled jobs maintained for review and reporting."
      },
      {
        id: "rejected-orders",
        label: "Rejected Orders",
        path: "/dashboard/super-admin/order-management/rejected-orders",
        description: "Rejected order requests with reasons and corrective notes."
      }
    ]
  },
  {
    id: "wallet",
    label: "Wallet",
    path: "/dashboard/super-admin/wallet-management",
    description: "Monitor wallet transactions and top-up request states.",
    children: [
      {
        id: "add-money",
        label: "Add Money",
        path: "/dashboard/super-admin/wallet-management/add-money",
        description: "Top up the Super Admin wallet using the same payment workflow as other modules."
      },
      {
        id: "wallet-transactions",
        label: "Wallet Transactions",
        path: "/dashboard/super-admin/wallet-management/wallet-transactions",
        description: "Audit inflow and outflow across every wallet account."
      },
      {
        id: "topup-requests",
        label: "Top-up Requests",
        path: "/dashboard/super-admin/wallet-management/top-up-requests",
        description: "Approve or reject pending wallet recharge requests."
      },
      {
        id: "approved-requests",
        label: "Approved Requests",
        path: "/dashboard/super-admin/wallet-management/approved-requests",
        description: "Review approved wallet top-up requests."
      },
      {
        id: "rejected-requests",
        label: "Rejected Requests",
        path: "/dashboard/super-admin/wallet-management/rejected-requests",
        description: "Review rejected wallet top-up requests."
      }
    ]
  },
  {
    id: "products",
    label: "Product Management",
    path: "/dashboard/super-admin/product-management",
    description: "Manage products, categories, pricing, and availability."
  },
  {
    id: "reports",
    label: "Reports",
    path: "/dashboard/super-admin/reports",
    description: "View operational summaries, export reports, and compare performance."
  },
  {
    id: "audit",
    label: "Audit Logs",
    path: "/dashboard/super-admin/audit-logs",
    description: "Track user actions, approvals, role changes, and system events."
  },
  {
    id: "setting",
    label: "Setting",
    path: "/dashboard/super-admin/setting",
    description: "Configure module rules, notification defaults, and platform controls."
  },
  {
    id: "profile",
    label: "Profile",
    path: "/dashboard/super-admin/profile",
    description: "Review profile information, security preferences, and account details."
  }
];

const activityRecords = [
  {
    refNo: "PRD-1001",
    module: "Product Management",
    moduleKey: "products",
    modulePath: "/dashboard/super-admin/product-management",
    routePath: "/dashboard/super-admin/product-management",
    userOrder: "Product catalogue update",
    status: "active",
    updatedBy: "Super Admin",
    updatedOn: "17 Jun 2026",
    dateValue: "2026-06-17"
  },
  {
    refNo: "ADM-1001",
    module: "User Management",
    moduleKey: "users",
    modulePath: "/dashboard/super-admin/user-management",
    routePath: "/dashboard/super-admin/user-management/admin-management",
    userOrder: "Admin Management",
    status: "active",
    updatedBy: "Super Admin",
    updatedOn: "17 Jun 2026",
    dateValue: "2026-06-17"
  },
  {
    refNo: "ASM-2044",
    module: "User Management",
    moduleKey: "users",
    modulePath: "/dashboard/super-admin/user-management",
    routePath: "/dashboard/super-admin/user-management/associate-member-management",
    userOrder: "Associate Member Management",
    status: "pending",
    updatedBy: "Verification Desk",
    updatedOn: "17 Jun 2026",
    dateValue: "2026-06-17"
  },
  {
    refNo: "ORD-7801",
    module: "Order Management",
    moduleKey: "orders",
    modulePath: "/dashboard/super-admin/order-management",
    routePath: "/dashboard/super-admin/order-management/all-orders",
    userOrder: "All Orders",
    status: "active",
    updatedBy: "Order Desk",
    updatedOn: "17 Jun 2026",
    dateValue: "2026-06-17"
  },
  {
    refNo: "ORD-7842",
    module: "Order Management",
    moduleKey: "orders",
    modulePath: "/dashboard/super-admin/order-management",
    routePath: "/dashboard/super-admin/order-management/pending-orders",
    userOrder: "Pending Orders",
    status: "pending",
    updatedBy: "Order Desk",
    updatedOn: "17 Jun 2026",
    dateValue: "2026-06-17"
  },
  {
    refNo: "ORD-7849",
    module: "Order Management",
    moduleKey: "orders",
    modulePath: "/dashboard/super-admin/order-management",
    routePath: "/dashboard/super-admin/order-management/printing-orders",
    userOrder: "Printing Orders",
    status: "active",
    updatedBy: "Production Team",
    updatedOn: "17 Jun 2026",
    dateValue: "2026-06-17"
  },
  {
    refNo: "ORD-7854",
    module: "Order Management",
    moduleKey: "orders",
    modulePath: "/dashboard/super-admin/order-management",
    routePath: "/dashboard/super-admin/order-management/packaging-orders",
    userOrder: "Packaging Orders",
    status: "active",
    updatedBy: "Packaging Team",
    updatedOn: "16 Jun 2026",
    dateValue: "2026-06-16"
  },
  {
    refNo: "ORD-7856",
    module: "Order Management",
    moduleKey: "orders",
    modulePath: "/dashboard/super-admin/order-management",
    routePath: "/dashboard/super-admin/order-management/dispatch-orders",
    userOrder: "Dispatch Orders",
    status: "completed",
    updatedBy: "Dispatch Desk",
    updatedOn: "16 Jun 2026",
    dateValue: "2026-06-16"
  },
  {
    refNo: "ORD-7862",
    module: "Order Management",
    moduleKey: "orders",
    modulePath: "/dashboard/super-admin/order-management",
    routePath: "/dashboard/super-admin/order-management/completed-orders",
    userOrder: "Completed Orders",
    status: "completed",
    updatedBy: "Support Team",
    updatedOn: "15 Jun 2026",
    dateValue: "2026-06-15"
  },
  {
    refNo: "ORD-7868",
    module: "Order Management",
    moduleKey: "orders",
    modulePath: "/dashboard/super-admin/order-management",
    routePath: "/dashboard/super-admin/order-management/improper-orders",
    userOrder: "Improper Orders",
    status: "blocked",
    updatedBy: "Quality Control",
    updatedOn: "15 Jun 2026",
    dateValue: "2026-06-15"
  },
  {
    refNo: "ORD-7870",
    module: "Order Management",
    moduleKey: "orders",
    modulePath: "/dashboard/super-admin/order-management",
    routePath: "/dashboard/super-admin/order-management/cancelled-orders",
    userOrder: "Cancelled Orders",
    status: "completed",
    updatedBy: "Customer Support",
    updatedOn: "15 Jun 2026",
    dateValue: "2026-06-15"
  },
  {
    refNo: "ORD-7874",
    module: "Order Management",
    moduleKey: "orders",
    modulePath: "/dashboard/super-admin/order-management",
    routePath: "/dashboard/super-admin/order-management/rejected-orders",
    userOrder: "Rejected Orders",
    status: "blocked",
    updatedBy: "File Review Desk",
    updatedOn: "14 Jun 2026",
    dateValue: "2026-06-14"
  },
  {
    refNo: "WLT-2282",
    module: "Wallet Management",
    moduleKey: "wallet",
    modulePath: "/dashboard/super-admin/wallet-management",
    routePath: "/dashboard/super-admin/wallet-management/wallet-transactions",
    userOrder: "Wallet Transactions",
    status: "completed",
    updatedBy: "Finance Team",
    updatedOn: "17 Jun 2026",
    dateValue: "2026-06-17"
  },
  {
    refNo: "WLT-2290",
    module: "Wallet Management",
    moduleKey: "wallet",
    modulePath: "/dashboard/super-admin/wallet-management",
    routePath: "/dashboard/super-admin/wallet-management/top-up-requests",
    userOrder: "Top-up Requests",
    status: "pending",
    updatedBy: "Wallet Team",
    updatedOn: "16 Jun 2026",
    dateValue: "2026-06-16"
  },
  {
    refNo: "WLT-2296",
    module: "Wallet Management",
    moduleKey: "wallet",
    modulePath: "/dashboard/super-admin/wallet-management",
    routePath: "/dashboard/super-admin/wallet-management/approved-requests",
    userOrder: "Approved Requests",
    status: "completed",
    updatedBy: "Finance Admin",
    updatedOn: "16 Jun 2026",
    dateValue: "2026-06-16"
  },
  {
    refNo: "WLT-2301",
    module: "Wallet Management",
    moduleKey: "wallet",
    modulePath: "/dashboard/super-admin/wallet-management",
    routePath: "/dashboard/super-admin/wallet-management/rejected-requests",
    userOrder: "Rejected Requests",
    status: "rejected",
    updatedBy: "Finance Admin",
    updatedOn: "16 Jun 2026",
    dateValue: "2026-06-16"
  },
  {
    refNo: "RPT-5048",
    module: "Reports",
    moduleKey: "reports",
    modulePath: "/dashboard/super-admin/reports",
    routePath: "/dashboard/super-admin/reports",
    userOrder: "Operational Summary",
    status: "completed",
    updatedBy: "Analytics Desk",
    updatedOn: "16 Jun 2026",
    dateValue: "2026-06-16"
  },
  {
    refNo: "AUD-5048",
    module: "Audit Logs",
    moduleKey: "audit",
    modulePath: "/dashboard/super-admin/audit-logs",
    routePath: "/dashboard/super-admin/audit-logs",
    userOrder: "Role permission update",
    status: "completed",
    updatedBy: "Super Admin",
    updatedOn: "16 Jun 2026",
    dateValue: "2026-06-16"
  },
  {
    refNo: "SET-1142",
    module: "Setting",
    moduleKey: "setting",
    modulePath: "/dashboard/super-admin/setting",
    routePath: "/dashboard/super-admin/setting",
    userOrder: "Notification defaults",
    status: "active",
    updatedBy: "Platform Admin",
    updatedOn: "15 Jun 2026",
    dateValue: "2026-06-15"
  },
  {
    refNo: "PRO-7118",
    module: "Profile",
    moduleKey: "profile",
    modulePath: "/dashboard/super-admin/profile",
    routePath: "/dashboard/super-admin/profile",
    userOrder: "Profile security update",
    status: "completed",
    updatedBy: "Super Admin",
    updatedOn: "15 Jun 2026",
    dateValue: "2026-06-15"
  }
];

const orderStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "printing", label: "Printing" },
  { value: "packaging", label: "Packaging" },
  { value: "dispatched", label: "Dispatched" },
  { value: "completed", label: "Completed" },
  { value: "improper", label: "Improper" },
  { value: "cancelled", label: "Cancelled" },
  { value: "rejected", label: "Rejected" }
];

async function parseApiResponse(response, fallbackMessage) {
  const contentType = response.headers.get("content-type") || "";
  const responseText = await response.text();
  let data = {};

  if (responseText) {
    if (contentType.includes("application/json")) {
      try {
        data = JSON.parse(responseText);
      } catch (_error) {
        throw new Error(fallbackMessage);
      }
    } else {
      const trimmedText = responseText.trim();

      if (trimmedText.startsWith("<!DOCTYPE") || trimmedText.startsWith("<html")) {
        throw new Error("API returned HTML instead of JSON. Please restart the backend server and try again.");
      }

      data = { message: trimmedText };
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      const message = data?.message || fallbackMessage;
      if (message === "Invalid or expired token." || message === "Authorization token is required.") {
        clearAuthSession();
        navigateTo("/login");
        throw new Error("Session expired. Please login again.");
      }
    }

    throw new Error(data?.message || fallbackMessage);
  }

  return data;
}

const statusClassNames = {
  active: "bg-emerald-600 text-white",
  pending: "bg-amber-500 text-white",
  completed: "bg-[#a71a00] text-white",
  blocked: "bg-slate-500 text-white"
};

const orderStatusClassNames = {
  pending: "bg-amber-100 text-amber-700",
  printing: "bg-blue-100 text-blue-700",
  packaging: "bg-violet-100 text-violet-700",
  dispatched: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
  improper: "bg-orange-100 text-orange-700",
  completed: "bg-teal-100 text-teal-700",
  rejected: "bg-slate-200 text-slate-700"
};

const dashboardStatusClassNames = {
  "pending-review": "border border-rose-200 bg-rose-50 text-rose-700",
  pending: "border border-rose-200 bg-rose-50 text-rose-700",
  printing: "border border-blue-200 bg-blue-50 text-blue-700",
  packaging: "border border-violet-200 bg-violet-50 text-violet-700",
  dispatched: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border border-teal-200 bg-teal-50 text-teal-700",
  approved: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border border-slate-300 bg-slate-100 text-slate-700",
  suspended: "border border-slate-300 bg-slate-100 text-slate-700",
  active: "border border-emerald-200 bg-emerald-50 text-emerald-700"
};

const moduleFilterOptions = [
  { value: "users", label: "User Management" },
  { value: "orders", label: "Order Management" },
  { value: "wallet", label: "Wallet Management" },
  { value: "products", label: "Product Management" },
  { value: "reports", label: "Reports" },
  { value: "audit", label: "Audit Logs" },
  { value: "setting", label: "Setting" },
  { value: "profile", label: "Profile" }
];

const standaloneRouteRedirects = {
  "/dashboard/super-admin/user-management": "/dashboard/super-admin/user-management/admin-management",
  "/dashboard/super-admin/order-management": "/dashboard/super-admin/order-management/all-orders",
  "/dashboard/super-admin/wallet-management": "/dashboard/super-admin/wallet-management/wallet-transactions"
};

const routeLookup = buildRouteLookup(primaryNavItems);

function buildRouteLookup(items) {
  const lookup = {};

  items.forEach((item) => {
    lookup[item.path] = {
      ...item,
      parentId: item.id,
      parentLabel: item.label,
      parentPath: item.path,
      isChild: false
    };

    if (item.children) {
      item.children.forEach((child) => {
        lookup[child.path] = {
          ...child,
          parentId: item.id,
          parentLabel: item.label,
          parentPath: item.path,
          isChild: true
        };
      });
    }
  });

  return lookup;
}

function normalizeRole(role) {
  return role
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatCurrency(value) {
  const numericValue = Number(value || 0);
  return Number.isFinite(numericValue) ? `Rs. ${numericValue.toFixed(2)}` : "Rs. 0.00";
}

function getDashboardStatusClassName(statusValue = "") {
  return dashboardStatusClassNames[String(statusValue || "").trim().toLowerCase()] || "border border-slate-200 bg-slate-100 text-slate-700";
}

function isPendingDashboardStatus(statusValue = "") {
  return ["pending", "pending-review"].includes(String(statusValue || "").trim().toLowerCase());
}

function getRouteByPath(pathname) {
  if (pathname.startsWith("/dashboard/super-admin/wallet-management/details/")) {
    return {
      id: "wallet-details",
      label: "Wallet Details",
      path: pathname,
      description: "Review the selected wallet request and update its approval status.",
      parentId: "wallet-management",
      parentLabel: "Wallet Management",
      isChild: true
    };
  }

  if (pathname.startsWith("/dashboard/super-admin/user-management/associate-member-management/details/")) {
    return {
      id: "associate-member-details",
      label: "User Details",
      path: pathname,
      description: "Review complete Associate Member profile and assignment information.",
      parentId: "associate-members",
      parentLabel: "User Management",
      isChild: true
    };
  }

  if (pathname.startsWith("/dashboard/super-admin/user-management/admin-management/details/")) {
    return {
      id: "admin-details",
      label: "User Details",
      path: pathname,
      description: "Review complete Admin profile, access controls, and linked Associate Members.",
      parentId: "associate-members",
      parentLabel: "User Management",
      isChild: true
    };
  }

  if (pathname.startsWith("/dashboard/super-admin/order-management/details/")) {
    return {
      id: "order-details",
      label: "Order Details",
      path: pathname,
      description: "Review complete order information and creator details.",
      parentId: "orders",
      parentLabel: "Order",
      isChild: true
    };
  }

  if (pathname === "/dashboard/super-admin/order-management/add-order/non-woven-bag") {
    return {
      id: "add-order-non-woven-bag",
      label: "Add Order",
      path: pathname,
      description: "Select a non-woven bag product to continue order creation.",
      parentId: "orders",
      parentLabel: "Order",
      isChild: true
    };
  }

  if (pathname.startsWith("/dashboard/super-admin/order-management/add-order/non-woven-bag/")) {
    return {
      id: "add-order-non-woven-bag-form",
      label: "Add Order",
      path: pathname,
      description: "Create a non-woven bag order using the shared module workflow.",
      parentId: "orders",
      parentLabel: "Order",
      isChild: true
    };
  }

  if (pathname === "/dashboard/super-admin/wallet-management/add-money/manual") {
    return {
      id: "add-money-manual",
      label: "Add Money",
      path: pathname,
      description: "Manual wallet top-up instructions and bank details.",
      parentId: "wallet",
      parentLabel: "Wallet",
      isChild: true
    };
  }

  if (pathname === "/dashboard/super-admin/wallet-management/add-money/manual/auto") {
    return {
      id: "add-money-auto",
      label: "Add Money",
      path: pathname,
      description: "Generate QR and update wallet using the automatic top-up flow.",
      parentId: "wallet",
      parentLabel: "Wallet",
      isChild: true
    };
  }

  return routeLookup[pathname] || routeLookup["/dashboard/super-admin"];
}

function getParentItem(route) {
  return primaryNavItems.find((item) => item.id === route.parentId) || primaryNavItems[0];
}

function getRouteRecords(route) {
  if (route.path === "/dashboard/super-admin") {
    return activityRecords;
  }

  if (route.isChild) {
    return activityRecords.filter((record) => record.routePath === route.path);
  }

  return activityRecords.filter((record) => record.modulePath === route.path || record.routePath === route.path);
}

function renderActivityTable(records) {
  return (
    <div className={tableCardClassName}>
      <div className={tableShellClassName}>
      <table className={`${tableElementClassName} min-w-full`}>
        <caption className="sr-only">Administrative records for the selected Super Admin route.</caption>
        <thead>
          <tr className={tableHeaderRowClassName}>
            <th className={tableHeaderCellClassName}>Ref No.</th>
            <th className={tableHeaderCellClassName}>Module</th>
            <th className={tableHeaderCellClassName}>User / Order</th>
            <th className={tableHeaderCellClassName}>Status</th>
            <th className={tableHeaderCellClassName}>Updated By</th>
            <th className={tableHeaderCellClassName}>Updated On</th>
            <th className={tableHeaderCellCenterClassName}>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((record, index) => (
              <tr key={record.refNo} className={getTableBodyRowClassName(index)}>
                <td className={tableBodyCellClassName}>{record.refNo}</td>
                <td className={tableBodyCellClassName}>{record.module}</td>
                <td className={tableBodyCellClassName}>{record.userOrder}</td>
                <td className={tableBodyCellClassName}>
                  <span
                    className={`inline-flex rounded px-2 py-1 text-xs font-bold capitalize ${
                      statusClassNames[record.status]
                    }`}
                  >
                    {record.statusLabel || record.status}
                  </span>
                </td>
                <td className={tableBodyCellClassName}>{record.updatedBy}</td>
                <td className={tableBodyCellClassName}>{record.updatedOn}</td>
                <td className={tableBodyCellCenterClassName}>
                  <button
                    type="button"
                    onClick={() => navigateTo(record.detailsPath || record.routePath)}
                    className={tableActionButtonClassName}
                  >
                    {record.detailsPath ? "Details" : "View"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className={tableEmptyCellClassName}>
                No activity records are available for this page yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}

function DataTable({
  columns = [],
  items = [],
  actionLabel = "Details",
  onAction,
  emptyMessage = "No records available for this section yet.",
  renderCell,
  getRowClassName,
  getActionLabel
}) {
  if (!items.length) {
    return (
      <div className={tableCardClassName}>
        <div className="px-4 py-8 text-center text-sm text-slate-500">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={tableCardClassName}>
      <div className={tableShellClassName}>
        <table className={`${tableElementClassName} min-w-full`}>
          <caption className="sr-only">Administrative records for the selected Super Admin route.</caption>
          <thead>
            <tr className={tableHeaderRowClassName}>
              {columns.map((column) => (
                <th key={column.key} className={tableHeaderCellClassName}>
                  {column.label}
                </th>
              ))}
              {onAction ? <th className={tableHeaderCellCenterClassName}>{actionLabel}</th> : null}
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((record, index) => (
                <tr
                  key={record.id || `${record.title || "row"}-${index}`}
                  className={getRowClassName ? getRowClassName(record, index) : getTableBodyRowClassName(index)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={tableBodyCellClassName}>
                      {renderCell ? renderCell(record, column) : record[column.key] ?? "--"}
                    </td>
                  ))}
                  {onAction ? (
                    <td className={tableBodyCellCenterClassName}>
                      <button type="button" onClick={() => onAction(record)} className={`${tableActionButtonClassName} italic`}>
                        {getActionLabel ? getActionLabel(record) : actionLabel}
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (onAction ? 1 : 0)} className={tableEmptyCellClassName}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SuperAdminPage({ session, pathname = "/dashboard/super-admin" }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuHoverTimeoutRef = useRef(null);
  const [filters, setFilters] = useState({
    module: "",
    search: "",
    status: "",
    fromDate: "",
    toDate: ""
  });
  const [dashboardSummary, setDashboardSummary] = useState({
    overview: {
      totalUsers: null,
      totalAdmins: null,
      totalAssociateMembers: null,
      totalOrders: null,
      pendingOrders: null,
      printingOrders: null,
      packagingOrders: null,
      dispatchOrders: null,
      completedOrders: null,
      totalWalletBalance: null,
      totalWalletTransactions: null,
      pendingWalletRequests: null,
      activeTodayUsers: null
    },
    recentActivities: {
      users: [],
      orders: [],
      walletTransactions: []
    },
    pendingTasks: [],
    isLoading: true,
    errorMessage: ""
  });
  const [adminFilters, setAdminFilters] = useState({
    search: "",
    name: "",
    mobile: "",
    adminId: "",
    businessName: "",
    status: "",
    associateAccess: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10
  });
  const [adminManagement, setAdminManagement] = useState({
    items: [],
    pagination: {
      page: 1,
      limit: 10,
      totalRecords: 0,
      totalPages: 1
    },
    isLoading: false,
    errorMessage: "",
    actionMessage: ""
  });
  const [selectedAdminDetails, setSelectedAdminDetails] = useState(null);
  const [isAdminDetailsLoading, setIsAdminDetailsLoading] = useState(false);
  const [orderFilters, setOrderFilters] = useState({
    search: "",
    orderNumber: "",
    orderName: "",
    customerName: "",
    mobileNumber: "",
    status: "",
    designFileSource: "",
    fromDate: "",
    toDate: "",
    sortBy: "orderedAt",
    sortOrder: "desc",
    page: 1,
    limit: 10
  });
  const [orderManagement, setOrderManagement] = useState({
    items: [],
    pagination: {
      page: 1,
      limit: 10,
      totalRecords: 0,
      totalPages: 1
    },
    isLoading: false,
    errorMessage: "",
    actionMessage: ""
  });
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isOrderDetailsLoading, setIsOrderDetailsLoading] = useState(false);
  const [isOrderDesignUploading, setIsOrderDesignUploading] = useState(false);
  const [walletManagement, setWalletManagement] = useState({
    columns: [],
    items: [],
    summary: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    },
    isLoading: false,
    errorMessage: ""
  });
  const [selectedWalletDetails, setSelectedWalletDetails] = useState(null);
  const [isWalletDetailsLoading, setIsWalletDetailsLoading] = useState(false);
  const [orderQuickSearch, setOrderQuickSearch] = useState("");
  const [associateQuickSearch, setAssociateQuickSearch] = useState("");
  const [adminQuickSearch, setAdminQuickSearch] = useState("");
  const [walletQuickSearch, setWalletQuickSearch] = useState("");
  const [associateFilters, setAssociateFilters] = useState({
    search: "",
    associateMemberId: "",
    businessName: "",
    name: "",
    mobile: "",
    district: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10
  });
  const [associateManagement, setAssociateManagement] = useState({
    items: [],
    pagination: {
      page: 1,
      limit: 10,
      totalRecords: 0,
      totalPages: 1
    },
    isLoading: false,
    errorMessage: "",
    actionMessage: ""
  });
  const [selectedAssociateDetails, setSelectedAssociateDetails] = useState(null);
  const [isAssociateDetailsLoading, setIsAssociateDetailsLoading] = useState(false);
  const [adminOptions, setAdminOptions] = useState([]);
  const [selectedAssociateAdminId, setSelectedAssociateAdminId] = useState("");
  const orderDesignInputRef = useRef(null);
  const accountBalance = session?.user?.walletBalance || "0.00";

  const currentRoute = getRouteByPath(pathname);
  const currentParentItem = getParentItem(currentRoute);
  const relatedRoutes = currentParentItem.children || [];
  const isDashboardRoute = currentRoute.path === "/dashboard/super-admin";
  const shellOnlyRoutePaths = new Set([
    "/dashboard/super-admin/order-management",
    "/dashboard/super-admin/product-management",
    "/dashboard/super-admin/reports",
    "/dashboard/super-admin/audit-logs",
    "/dashboard/super-admin/setting",
    "/dashboard/super-admin/profile"
  ]);
  const isShellOnlyRoute = shellOnlyRoutePaths.has(currentRoute.path);
  const isAllOrdersRoute = currentRoute.path === "/dashboard/super-admin/order-management/all-orders";
  const isAddOrderRoute = currentRoute.path === "/dashboard/super-admin/order-management/add-order";
  const isAddOrderNonWovenRoute = currentRoute.path === "/dashboard/super-admin/order-management/add-order/non-woven-bag";
  const isAddOrderNonWovenFormRoute = currentRoute.path.startsWith("/dashboard/super-admin/order-management/add-order/non-woven-bag/");
  const isAddMoneyRoute = currentRoute.path === "/dashboard/super-admin/wallet-management/add-money";
  const isManualTopUpRoute = currentRoute.path === "/dashboard/super-admin/wallet-management/add-money/manual";
  const isAutoTopUpRoute = currentRoute.path === "/dashboard/super-admin/wallet-management/add-money/manual/auto";
  const isPendingOrdersRoute = currentRoute.path === "/dashboard/super-admin/order-management/pending-orders";
  const isPrintingOrdersRoute = currentRoute.path === "/dashboard/super-admin/order-management/printing-orders";
  const isPackagingOrdersRoute = currentRoute.path === "/dashboard/super-admin/order-management/packaging-orders";
  const isDispatchedOrdersRoute = currentRoute.path === "/dashboard/super-admin/order-management/dispatch-orders";
  const isCompletedOrdersRoute = currentRoute.path === "/dashboard/super-admin/order-management/completed-orders";
  const isImproperOrdersRoute = currentRoute.path === "/dashboard/super-admin/order-management/improper-orders";
  const isCancelledOrdersRoute = currentRoute.path === "/dashboard/super-admin/order-management/cancelled-orders";
  const isRejectedOrdersRoute = currentRoute.path === "/dashboard/super-admin/order-management/rejected-orders";
  const isWalletTransactionsRoute = currentRoute.path === "/dashboard/super-admin/wallet-management/wallet-transactions";
  const isTopUpRequestsRoute = currentRoute.path === "/dashboard/super-admin/wallet-management/top-up-requests";
  const isApprovedWalletRequestsRoute = currentRoute.path === "/dashboard/super-admin/wallet-management/approved-requests";
  const isRejectedWalletRequestsRoute = currentRoute.path === "/dashboard/super-admin/wallet-management/rejected-requests";
  const walletDetailsMatch = useMemo(() => pathname.match(/^\/dashboard\/super-admin\/wallet-management\/details\/([^/]+)$/), [pathname]);
  const walletDetailsId = walletDetailsMatch?.[1] || "";
  const isWalletDetailsRoute = Boolean(walletDetailsId);
  const isWalletActivityRoute =
    currentRoute.parentId === "wallet" &&
    !isAddMoneyRoute &&
    !isManualTopUpRoute &&
    !isAutoTopUpRoute &&
    !isWalletDetailsRoute;
  const orderDetailsMatch = useMemo(() => pathname.match(/^\/dashboard\/super-admin\/order-management\/details\/([^/]+)$/), [pathname]);
  const orderDetailsId = orderDetailsMatch?.[1] || "";
  const isOrderDetailsRoute = Boolean(orderDetailsId);
  const associateDetailsMatch = useMemo(
    () => pathname.match(/^\/dashboard\/super-admin\/user-management\/associate-member-management\/details\/([^/]+)$/),
    [pathname]
  );
  const associateDetailsId = associateDetailsMatch?.[1] || "";
  const isAssociateDetailsRoute = Boolean(associateDetailsId);
  const adminDetailsMatch = useMemo(
    () => pathname.match(/^\/dashboard\/super-admin\/user-management\/admin-management\/details\/([^/]+)$/),
    [pathname]
  );
  const adminDetailsId = adminDetailsMatch?.[1] || "";
  const isAdminDetailsRoute = Boolean(adminDetailsId);
  const isOrderModuleRoute =
    isAllOrdersRoute ||
    isAddOrderRoute ||
    isAddOrderNonWovenRoute ||
    isAddOrderNonWovenFormRoute ||
    isPendingOrdersRoute ||
    isPrintingOrdersRoute ||
    isPackagingOrdersRoute ||
    isDispatchedOrdersRoute ||
    isCompletedOrdersRoute ||
    isImproperOrdersRoute ||
    isCancelledOrdersRoute ||
    isRejectedOrdersRoute ||
    isOrderDetailsRoute;
  const currentAddOrderBagSlug = isAddOrderNonWovenFormRoute
    ? currentRoute.path.replace("/dashboard/super-admin/order-management/add-order/non-woven-bag/", "").split("/")[0]
    : "";

  useEffect(() => {
    const redirectPath = standaloneRouteRedirects[pathname];
    if (redirectPath) {
      navigateTo(redirectPath);
    }
  }, [pathname]);

  const orderTableItems = useMemo(
    () =>
      (orderManagement.items || []).map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber || "--",
        dateTime: formatDateTime(order.orderDateTime),
        orderName: order.orderName || "--",
        createdBy: order.placedByUser?.name || order.customerName || "--",
        orderDetail: order.orderDetailsOverview || "--",
        status: order.currentStatus || "--",
        fileType: order.designFileSource || "File",
        hasEmailDesign: Boolean(order.hasEmailDesign)
      })),
    [orderManagement.items]
  );
  const filteredOrderTableItems = useMemo(() => filterOrderTableItems(orderTableItems, orderQuickSearch), [orderQuickSearch, orderTableItems]);
  const filteredAssociateTableItems = useMemo(
    () =>
      filterGenericTableItems(associateManagement.items, associateQuickSearch, [
        "associateMemberId",
        "businessName",
        "associateMemberName",
        "mobileNumber",
        "district"
      ]),
    [associateManagement.items, associateQuickSearch]
  );
  const filteredAdminTableItems = useMemo(
    () =>
      filterGenericTableItems(adminManagement.items, adminQuickSearch, [
        "adminId",
        "adminName",
        "mobileNumber",
        "adminAddress",
        "businessName",
        "status",
        "associateMemberAccessStatus"
      ]),
    [adminManagement.items, adminQuickSearch]
  );
  const associateExportColumns = useMemo(
    () => [
      { key: "associateMemberId", label: "Associate Member ID" },
      { key: "businessName", label: "Firm Name" },
      { key: "associateMemberName", label: "User Name" },
      { key: "mobileNumber", label: "WhatsApp Number" },
      { key: "district", label: "District Name" }
    ],
    []
  );
  const adminExportColumns = useMemo(
    () => [
      { key: "adminId", label: "Admin ID" },
      { key: "adminName", label: "Admin Name" },
      { key: "mobileNumber", label: "Mobile Number" },
      { key: "adminAddress", label: "Admin Address" },
      { key: "businessName", label: "Business/Firm Name" },
      { key: "status", label: "Status" },
      { key: "associateMemberAccessStatus", label: "Associate Member Access Status" }
    ],
    []
  );
  const walletExportColumns = useMemo(
    () => walletManagement.columns.filter((column) => column?.key).map((column) => ({ key: column.key, label: column.label || column.key })),
    [walletManagement.columns]
  );
  const scopedOrderRouteConfig = isPendingOrdersRoute
    ? {
        apiBasePath: "/api/super-admin/orders/pending",
        recordsTitle: "Pending Order Records",
        exportBaseName: "pending-orders"
      }
    : isPrintingOrdersRoute
      ? {
          apiBasePath: "/api/super-admin/orders/printing",
          recordsTitle: "Printing Order Records",
          exportBaseName: "printing-orders"
        }
      : isPackagingOrdersRoute
        ? {
            apiBasePath: "/api/super-admin/orders/packaging",
            recordsTitle: "Packaging Order Records",
            exportBaseName: "packaging-orders"
          }
        : isDispatchedOrdersRoute
          ? {
              apiBasePath: "/api/super-admin/orders/dispatched",
              recordsTitle: "Dispatched Order Records",
              exportBaseName: "dispatched-orders"
            }
          : isCompletedOrdersRoute
            ? {
                apiBasePath: "/api/super-admin/orders/completed",
                recordsTitle: "Completed Order Records",
                exportBaseName: "completed-orders"
              }
            : isImproperOrdersRoute
              ? {
                  apiBasePath: "/api/super-admin/orders/improper",
                  recordsTitle: "Improper Order Records",
                  exportBaseName: "improper-orders"
                }
              : isCancelledOrdersRoute
                ? {
                    apiBasePath: "/api/super-admin/orders/cancelled",
                    recordsTitle: "Cancelled Order Records",
                    exportBaseName: "cancelled-orders"
                  }
                : isRejectedOrdersRoute
                  ? {
                      apiBasePath: "/api/super-admin/orders/rejected",
                      recordsTitle: "Rejected Order Records",
                      exportBaseName: "rejected-orders"
                    }
                  : {
                      apiBasePath: "/api/super-admin/orders",
                      recordsTitle: "All Order Records",
                      exportBaseName: "all-orders"
                    };
  const orderApiBasePath = scopedOrderRouteConfig.apiBasePath;
  const orderRecordsTitle = scopedOrderRouteConfig.recordsTitle;
  const orderExportBaseName = scopedOrderRouteConfig.exportBaseName;

  const loadOrderDetailsForPage = useCallback(
    async (orderId) => {
      const response = await fetch(`${orderApiBasePath}/${orderId}`, {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      });
      const data = await parseApiResponse(response, "Failed to load Order details.");
      return data?.order || null;
    },
    [orderApiBasePath, session.token]
  );
  const isAdminManagementRoute = currentRoute.path === "/dashboard/super-admin/user-management/admin-management";
  const isAssociateMemberManagementRoute =
    currentRoute.path === "/dashboard/super-admin/user-management/associate-member-management" && !isShellOnlyRoute;
  const orderQueryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(orderFilters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.set(key, String(value));
      }
    });
    return params.toString();
  }, [orderFilters]);
  const adminQueryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(adminFilters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.set(key, String(value));
      }
    });
    return params.toString();
  }, [adminFilters]);
  const associateExportBaseName = "associate-member-records";
  const adminExportBaseName = "admin-records";
  const walletExportBaseName = useMemo(
    () => `${String(currentRoute.label || "wallet-records").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-records`,
    [currentRoute.label]
  );
  const handleDownloadAssociatePdf = useCallback(() => {
    downloadGenericRowsAsPdf(
      filteredAssociateTableItems,
      associateExportColumns,
      associateExportBaseName,
      "Associate Member Records"
    );
  }, [associateExportColumns, filteredAssociateTableItems]);
  const handleDownloadAssociateExcel = useCallback(() => {
    downloadGenericRowsAsExcel(filteredAssociateTableItems, associateExportColumns, associateExportBaseName);
  }, [associateExportColumns, filteredAssociateTableItems]);
  const handleDownloadAdminPdf = useCallback(() => {
    downloadGenericRowsAsPdf(filteredAdminTableItems, adminExportColumns, adminExportBaseName, "Admin Records");
  }, [adminExportColumns, filteredAdminTableItems]);
  const handleDownloadAdminExcel = useCallback(() => {
    downloadGenericRowsAsExcel(filteredAdminTableItems, adminExportColumns, adminExportBaseName);
  }, [adminExportColumns, filteredAdminTableItems]);
  const associateQueryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(associateFilters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.set(key, String(value));
      }
    });
    return params.toString();
  }, [associateFilters]);

  useEffect(() => {
    setOrderQuickSearch("");
    setAssociateQuickSearch("");
    setAdminQuickSearch("");
    setWalletQuickSearch("");
  }, [currentRoute.path]);

  useEffect(() => {
    if (!isAssociateDetailsRoute || !associateDetailsId) {
      setSelectedAssociateDetails(null);
      setSelectedAssociateAdminId("");
      return;
    }

    fetchAssociateMemberDetails(associateDetailsId);
  }, [associateDetailsId, isAssociateDetailsRoute]);

  useEffect(() => {
    if (!isAdminDetailsRoute || !adminDetailsId) {
      setSelectedAdminDetails(null);
      return;
    }

    fetchAdminDetails(adminDetailsId);
  }, [adminDetailsId, isAdminDetailsRoute]);
  useEffect(() => {
    if (!isWalletDetailsRoute || !walletDetailsId) {
      setSelectedWalletDetails(null);
      return;
    }

    fetchWalletRequestDetails(walletDetailsId);
  }, [isWalletDetailsRoute, walletDetailsId]);
  useEffect(() => {
    const refreshOpenDetails = () => {
      if (isAssociateDetailsRoute && associateDetailsId) {
        fetchAssociateMemberDetails(associateDetailsId);
      }

      if (isAdminDetailsRoute && adminDetailsId) {
        fetchAdminDetails(adminDetailsId);
      }

      if (isWalletDetailsRoute && walletDetailsId) {
        fetchWalletRequestDetails(walletDetailsId);
      }
    };

    window.addEventListener("focus", refreshOpenDetails);
    window.addEventListener("adminchange", refreshOpenDetails);
    window.addEventListener("associatememberchange", refreshOpenDetails);
    window.addEventListener("walletchange", refreshOpenDetails);
    window.addEventListener("dashboardstatschange", refreshOpenDetails);

    return () => {
      window.removeEventListener("focus", refreshOpenDetails);
      window.removeEventListener("adminchange", refreshOpenDetails);
      window.removeEventListener("associatememberchange", refreshOpenDetails);
      window.removeEventListener("walletchange", refreshOpenDetails);
      window.removeEventListener("dashboardstatschange", refreshOpenDetails);
    };
  }, [adminDetailsId, associateDetailsId, isAdminDetailsRoute, isAssociateDetailsRoute, isWalletDetailsRoute, walletDetailsId]);
  const associateDetailsSidePanel = selectedAssociateDetails ? (
    <div>
      <h3 className="text-sm font-bold text-slate-800">Manage Associate Member</h3>
      <div className="mt-4 space-y-3">
        <button
          type="button"
          onClick={() =>
            updateAssociateMemberRecord(selectedAssociateDetails.id, "status", {
              status: selectedAssociateDetails.statusValue === "active" ? "deactive" : "active"
            })
          }
          className={`w-full rounded border px-4 py-2 text-sm font-semibold text-white transition ${
            selectedAssociateDetails.statusValue === "active"
              ? "border-[#a71a00] bg-[#a71a00] hover:bg-[#841400]"
              : "border-emerald-600 bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {selectedAssociateDetails.statusValue === "active" ? "Deactivate Associate Member" : "Activate Associate Member"}
        </button>

        <div className="space-y-2">
          <label htmlFor="associateAssignedAdminDetailsSelect" className="text-xs font-bold text-slate-700">
            Change Assigned Admin
          </label>
          <select
            id="associateAssignedAdminDetailsSelect"
            value={selectedAssociateAdminId}
            onChange={(event) => setSelectedAssociateAdminId(event.target.value)}
            className="h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Not Assigned</option>
            {adminOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} ({option.mobileNumber})
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() =>
            updateAssociateMemberRecord(selectedAssociateDetails.id, "assign-admin", {
              adminId: selectedAssociateAdminId || null
            })
          }
          className="w-full rounded border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Update Assigned Admin
        </button>

        {selectedAssociateDetails.role === "associate-member" ? (
          <button
            type="button"
            onClick={() => updateAssociateMemberRecord(selectedAssociateDetails.id, "promote", {})}
            className="w-full rounded border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            Promote To Admin
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              updateAssociateMemberRecord(selectedAssociateDetails.id, "revert-role", {
                adminId: selectedAssociateAdminId || null
              })
            }
            className="w-full rounded border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            Revoke Admin Privileges
          </button>
        )}
      </div>
    </div>
  ) : null;
  const adminDetailsSidePanel = selectedAdminDetails ? (
    <div>
      <h3 className="text-sm font-bold text-slate-800">Manage Admin</h3>
      <div className="mt-4 space-y-3">
        <button
          type="button"
          onClick={() =>
            updateAdminRecord(selectedAdminDetails.id, "status", {
              status: selectedAdminDetails.statusValue === "active" ? "deactive" : "active"
            })
          }
          className={`w-full rounded border px-4 py-2 text-sm font-semibold text-white transition ${
            selectedAdminDetails.statusValue === "active"
              ? "border-[#a71a00] bg-[#a71a00] hover:bg-[#841400]"
              : "border-emerald-600 bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {selectedAdminDetails.statusValue === "active" ? "Deactivate Admin" : "Activate Admin"}
        </button>
        <button
          type="button"
          onClick={() =>
            updateAdminRecord(selectedAdminDetails.id, "associate-access", {
              enabled: !selectedAdminDetails.associateMemberAccessEnabled
            })
          }
          className="w-full rounded border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          {selectedAdminDetails.associateMemberAccessEnabled ? "Disable Associate Member Access" : "Enable Associate Member Access"}
        </button>
      </div>
    </div>
  ) : null;
  const walletDetailsSidePanel = selectedWalletDetails ? (
    <div>
      <h3 className="text-sm font-bold text-slate-800">Update Wallet Request</h3>
      <div className="mt-4 space-y-3">
        <button
          type="button"
          disabled={isWalletDetailsLoading || selectedWalletDetails.statusValue === "approved"}
          onClick={() => updateWalletRequestStatus(selectedWalletDetails.id, { status: "approved" })}
          className="w-full rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={isWalletDetailsLoading || selectedWalletDetails.statusValue === "rejected"}
          onClick={() => updateWalletRequestStatus(selectedWalletDetails.id, { status: "rejected" })}
          className="w-full rounded border border-rose-600 bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  ) : null;
  const linkedAssociateMembersContent = selectedAdminDetails ? (
    <article className={tableCardClassName}>
      <div className={tableSectionHeaderClassName}>
        <h3 className="text-sm font-bold text-slate-800">Linked Associate Members</h3>
        <div className={tableSectionCountClassName}>{selectedAdminDetails.associateMemberCount || 0} linked records</div>
      </div>
      <div className={tableShellClassName}>
        <table className={`${tableElementClassName} min-w-full`}>
          <thead>
            <tr className={tableHeaderRowClassName}>
              <th className={tableHeaderCellClassName}>Member Name</th>
              <th className={tableHeaderCellClassName}>Business</th>
              <th className={tableHeaderCellClassName}>Mobile Number</th>
              <th className={tableHeaderCellClassName}>Location</th>
              <th className={tableHeaderCellClassName}>Status</th>
            </tr>
          </thead>
          <tbody>
            {selectedAdminDetails.associateMembers?.length ? (
              selectedAdminDetails.associateMembers.map((member, index) => (
                <tr key={member.id} className={getTableBodyRowClassName(index)}>
                  <td className={tableBodyCellClassName}>{member.ownerName}</td>
                  <td className={tableBodyCellClassName}>{member.businessName}</td>
                  <td className={tableBodyCellClassName}>{member.mobileNumber}</td>
                  <td className={tableBodyCellClassName}>{member.location || "-"}</td>
                  <td className={tableBodyCellClassName}>{member.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={tableEmptyCellClassName}>
                  No Associate Members are linked to this Admin yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </article>
  ) : null;
  const orderStatusActionOptions = [
    { label: "Set Printing", value: "printing", className: "border-blue-700 bg-blue-700 hover:bg-blue-800" },
    { label: "Set Packaging", value: "packaging", className: "border-violet-700 bg-violet-700 hover:bg-violet-800" },
    { label: "Set Dispatched", value: "dispatched", className: "border-emerald-600 bg-emerald-600 hover:bg-emerald-700" },
    { label: "Set Cancelled", value: "cancelled", className: "border-rose-600 bg-rose-600 hover:bg-rose-700" },
    { label: "Set Improper", value: "improper", className: "border-orange-500 bg-orange-500 hover:bg-orange-600" }
  ];

  useEffect(() => {
    if (!session?.token) return;

    let activeController = null;

    async function loadDashboardSummary() {
      if (activeController) {
        activeController.abort();
      }

      const controller = new AbortController();
      activeController = controller;

      setDashboardSummary((current) => ({
        ...current,
        isLoading: current.overview.totalUsers === null,
        errorMessage: ""
      }));

      try {
        const response = await fetch("/api/super-admin/stats", {
          headers: {
            Authorization: `Bearer ${session.token}`
          },
          signal: controller.signal
        });

        const data = await parseApiResponse(response, "Failed to load dashboard statistics.");

        setDashboardSummary({
          overview: {
            totalUsers: data?.overview?.totalUsers ?? 0,
            totalAdmins: data?.overview?.totalAdmins ?? 0,
            totalAssociateMembers: data?.overview?.totalAssociateMembers ?? 0,
            totalOrders: data?.overview?.totalOrders ?? 0,
            pendingOrders: data?.overview?.pendingOrders ?? 0,
            printingOrders: data?.overview?.printingOrders ?? 0,
            packagingOrders: data?.overview?.packagingOrders ?? 0,
            dispatchOrders: data?.overview?.dispatchOrders ?? 0,
            completedOrders: data?.overview?.completedOrders ?? 0,
            totalWalletBalance: data?.overview?.totalWalletBalance ?? "0.00",
            totalWalletTransactions: data?.overview?.totalWalletTransactions ?? 0,
            pendingWalletRequests: data?.overview?.pendingWalletRequests ?? 0,
            activeTodayUsers: data?.overview?.activeTodayUsers ?? 0
          },
          recentActivities: {
            users: Array.isArray(data?.recentActivities?.users) ? data.recentActivities.users : [],
            orders: Array.isArray(data?.recentActivities?.orders) ? data.recentActivities.orders : [],
            walletTransactions: Array.isArray(data?.recentActivities?.walletTransactions) ? data.recentActivities.walletTransactions : []
          },
          pendingTasks: Array.isArray(data?.pendingTasks) ? data.pendingTasks : [],
          isLoading: false,
          errorMessage: ""
        });
      } catch (error) {
        if (error?.name === "AbortError") return;

        setDashboardSummary((current) => ({
          ...current,
          isLoading: false,
          errorMessage: error?.message || "Failed to load dashboard statistics."
        }));
      }
    }

    loadDashboardSummary();

    const intervalId = window.setInterval(loadDashboardSummary, 10000);
    const handleFocus = () => loadDashboardSummary();
    const handleAdminChange = () => loadDashboardSummary();
    const handleAssociateChange = () => loadDashboardSummary();
    const handleWalletChange = () => loadDashboardSummary();
    const handleDashboardStatsChange = () => loadDashboardSummary();
    const handleOrderStatusChange = () => loadDashboardSummary();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("adminchange", handleAdminChange);
    window.addEventListener("associatememberchange", handleAssociateChange);
    window.addEventListener("walletchange", handleWalletChange);
    window.addEventListener("dashboardstatschange", handleDashboardStatsChange);
    window.addEventListener("orderstatuschange", handleOrderStatusChange);
    window.addEventListener("orderchange", handleOrderStatusChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("adminchange", handleAdminChange);
      window.removeEventListener("associatememberchange", handleAssociateChange);
      window.removeEventListener("walletchange", handleWalletChange);
      window.removeEventListener("dashboardstatschange", handleDashboardStatsChange);
      window.removeEventListener("orderstatuschange", handleOrderStatusChange);
      window.removeEventListener("orderchange", handleOrderStatusChange);
      activeController?.abort();
    };
  }, [session?.token]);

  useEffect(() => {
    if (!session?.token || !isOrderModuleRoute) return;

    let activeController = null;

    async function loadOrderRecords() {
      if (activeController) {
        activeController.abort();
      }

      const controller = new AbortController();
      activeController = controller;

      setOrderManagement((current) => ({
        ...current,
        isLoading: true,
        errorMessage: ""
      }));

      try {
        const response = await fetch(`${orderApiBasePath}?${orderQueryString}`, {
          headers: {
            Authorization: `Bearer ${session.token}`
          },
          signal: controller.signal
        });
        const data = await parseApiResponse(response, "Failed to load Order records.");

        setOrderManagement((current) => ({
          ...current,
          items: data.items || [],
          pagination: data.pagination || current.pagination,
          isLoading: false,
          errorMessage: ""
        }));
      } catch (error) {
        if (error?.name === "AbortError") return;

        setOrderManagement((current) => ({
          ...current,
          isLoading: false,
          errorMessage: error?.message || "Failed to load Order records."
        }));
      }
    }

    loadOrderRecords();

    const intervalId = window.setInterval(loadOrderRecords, 10000);
    const handleFocus = () => loadOrderRecords();
    const handleOrderChange = () => loadOrderRecords();
    const handleOrderStatusChange = () => loadOrderRecords();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("orderchange", handleOrderChange);
    window.addEventListener("orderstatuschange", handleOrderStatusChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("orderchange", handleOrderChange);
      window.removeEventListener("orderstatuschange", handleOrderStatusChange);
      activeController?.abort();
    };
  }, [isOrderModuleRoute, orderApiBasePath, orderQueryString, session?.token]);

  useEffect(() => {
    if (!session?.token || !isAdminManagementRoute) return;

    let activeController = null;

    async function loadAdminRecords() {
      if (activeController) {
        activeController.abort();
      }

      const controller = new AbortController();
      activeController = controller;

      setAdminManagement((current) => ({
        ...current,
        isLoading: true,
        errorMessage: ""
      }));

      try {
        const response = await fetch(`/api/super-admin/admins?${adminQueryString}`, {
          headers: {
            Authorization: `Bearer ${session.token}`
          },
          signal: controller.signal
        });
        const data = await parseApiResponse(response, "Failed to load Admin records.");

        setAdminManagement((current) => ({
          ...current,
          items: data.items || [],
          pagination: data.pagination || current.pagination,
          isLoading: false,
          errorMessage: ""
        }));
      } catch (error) {
        if (error?.name === "AbortError") return;

        setAdminManagement((current) => ({
          ...current,
          isLoading: false,
          errorMessage: error?.message || "Failed to load Admin records."
        }));
      }
    }

    loadAdminRecords();

    const intervalId = window.setInterval(loadAdminRecords, 10000);
    const handleFocus = () => loadAdminRecords();
    const handleAdminChange = () => loadAdminRecords();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("adminchange", handleAdminChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("adminchange", handleAdminChange);
      activeController?.abort();
    };
  }, [adminQueryString, isAdminManagementRoute, session?.token]);

  useEffect(() => {
    if (!session?.token || !isAssociateMemberManagementRoute) return;

    let activeController = null;

    async function loadAssociateMemberRecords() {
      if (activeController) {
        activeController.abort();
      }

      const controller = new AbortController();
      activeController = controller;

      setAssociateManagement((current) => ({
        ...current,
        isLoading: true,
        errorMessage: ""
      }));

      try {
        const response = await fetch(`/api/super-admin/associate-members?${associateQueryString}`, {
          headers: {
            Authorization: `Bearer ${session.token}`
          },
          signal: controller.signal
        });
        const data = await parseApiResponse(response, "Failed to load Associate Member records.");

        setAssociateManagement((current) => ({
          ...current,
          items: data.items || [],
          pagination: data.pagination || current.pagination,
          isLoading: false,
          errorMessage: ""
        }));
      } catch (error) {
        if (error?.name === "AbortError") return;

        setAssociateManagement((current) => ({
          ...current,
          isLoading: false,
          errorMessage: error?.message || "Failed to load Associate Member records."
        }));
      }
    }

    async function loadAdminOptions() {
      try {
        const response = await fetch("/api/super-admin/admins/options", {
          headers: {
            Authorization: `Bearer ${session.token}`
          }
        });
        const data = await parseApiResponse(response, "Failed to load Admin options.");
        setAdminOptions(data.items || []);
      } catch (error) {
        setAssociateManagement((current) => ({
          ...current,
          actionMessage: error?.message || "Failed to load Admin options."
        }));
      }
    }

    loadAssociateMemberRecords();
    loadAdminOptions();

    const intervalId = window.setInterval(loadAssociateMemberRecords, 10000);
    const handleFocus = () => loadAssociateMemberRecords();
    const handleAssociateMemberChange = () => loadAssociateMemberRecords();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("associatememberchange", handleAssociateMemberChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("associatememberchange", handleAssociateMemberChange);
      activeController?.abort();
    };
  }, [associateQueryString, isAssociateMemberManagementRoute, session?.token]);

  useEffect(() => {
    if (!session?.token || !isWalletActivityRoute) return;

    let activeController = null;

    async function loadWalletRecords() {
      if (activeController) {
        activeController.abort();
      }

      const controller = new AbortController();
      activeController = controller;

      setWalletManagement((current) => ({
        ...current,
        isLoading: true,
        errorMessage: ""
      }));

      try {
        const walletView = isTopUpRequestsRoute
          ? "pending"
          : isApprovedWalletRequestsRoute
            ? "approved"
            : isRejectedWalletRequestsRoute
              ? "rejected"
              : "transactions";
        const requestUrl = `/api/super-admin/wallet/requests?view=${walletView}`;
        const response = await fetch(requestUrl, {
          headers: {
            Authorization: `Bearer ${session.token}`
          },
          signal: controller.signal
        });
        const data = await parseApiResponse(response, "Failed to load wallet records.");

        setWalletManagement({
          columns: Array.isArray(data?.meta?.columns) ? data.meta.columns : [],
          items: Array.isArray(data?.items) ? data.items : [],
          summary:
            data?.summary && typeof data.summary === "object"
              ? data.summary
              : {
                  total: 0,
                  pending: 0,
                  approved: 0,
                  rejected: 0
                },
          isLoading: false,
          errorMessage: ""
        });
      } catch (error) {
        if (error?.name === "AbortError") return;

        setWalletManagement({
          columns: [],
          items: [],
          summary: {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0
          },
          isLoading: false,
          errorMessage: error?.message || "Failed to load wallet records."
        });
      }
    }

    loadWalletRecords();

    const intervalId = window.setInterval(loadWalletRecords, 10000);
    const handleFocus = () => loadWalletRecords();
    const handleWalletChange = () => loadWalletRecords();
    const handleDashboardStatsChange = () => loadWalletRecords();
    const handleOrderChange = () => loadWalletRecords();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("walletchange", handleWalletChange);
    window.addEventListener("dashboardstatschange", handleDashboardStatsChange);
    window.addEventListener("orderchange", handleOrderChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("walletchange", handleWalletChange);
      window.removeEventListener("dashboardstatschange", handleDashboardStatsChange);
      window.removeEventListener("orderchange", handleOrderChange);
      activeController?.abort();
    };
  }, [
    currentRoute.path,
    isApprovedWalletRequestsRoute,
    isRejectedWalletRequestsRoute,
    isTopUpRequestsRoute,
    isWalletActivityRoute,
    session?.token
  ]);

  useEffect(() => {
    return () => {
      if (menuHoverTimeoutRef.current) {
        window.clearTimeout(menuHoverTimeoutRef.current);
      }
    };
  }, []);

  function clearMenuHoverTimeout() {
    if (menuHoverTimeoutRef.current) {
      window.clearTimeout(menuHoverTimeoutRef.current);
      menuHoverTimeoutRef.current = null;
    }
  }

  function handleMenuMouseEnter(menuId) {
    clearMenuHoverTimeout();
    menuHoverTimeoutRef.current = window.setTimeout(() => {
      setOpenMenuId(menuId);
    }, 120);
  }

  function handleMenuMouseLeave(menuId) {
    clearMenuHoverTimeout();
    menuHoverTimeoutRef.current = window.setTimeout(() => {
      setOpenMenuId((current) => (current === menuId ? null : current));
    }, 180);
  }

  function handleLogout() {
    clearAuthSession();
    navigateTo("/");
  }

  function handleNavigate(path) {
    clearMenuHoverTimeout();
    setOpenMenuId(null);
    navigateTo(standaloneRouteRedirects[path] || path);
  }

  function updateOrderFilter(name, value) {
    setOrderFilters((current) => ({
      ...current,
      [name]: value,
      page: name === "page" ? value : 1
    }));
  }

  function updateAdminFilter(name, value) {
    setAdminFilters((current) => ({
      ...current,
      [name]: value,
      page: name === "page" ? value : 1
    }));
  }

  function updateAssociateFilter(name, value) {
    setAssociateFilters((current) => ({
      ...current,
      [name]: value,
      page: name === "page" ? value : 1
    }));
  }

  async function fetchOrderDetails(orderId) {
    setIsOrderDetailsLoading(true);
    setSelectedOrderDetails(null);

    try {
      const response = await fetch(`${orderApiBasePath}/${orderId}`, {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      });
      const data = await parseApiResponse(response, "Failed to load Order details.");

      setSelectedOrderDetails(data.order);
    } catch (error) {
      setOrderManagement((current) => ({
        ...current,
        actionMessage: error?.message || "Failed to load Order details."
      }));
    } finally {
      setIsOrderDetailsLoading(false);
    }
  }

  async function updateOrderRecord(orderId, payload) {
    try {
      const response = await fetch(`${orderApiBasePath}/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await parseApiResponse(response, "Failed to update Order status.");

      setSelectedOrderDetails(data.order || null);
      setOrderManagement((current) => ({
        ...current,
        actionMessage: data.message || "Order status updated successfully.",
        errorMessage: ""
      }));
      window.dispatchEvent(new Event("orderchange"));
      window.dispatchEvent(new Event("dashboardstatschange"));
      return data.order || null;
    } catch (error) {
      setOrderManagement((current) => ({
        ...current,
        actionMessage: error?.message || "Failed to update Order status."
      }));
      throw error;
    }
  }

  function isLikelyImageUrl(url = "") {
    const safe = String(url);
    if (safe.startsWith("data:image/")) return true;
    return /\.(png|jpe?g|webp|gif)$/i.test(safe.split("?")[0]);
  }

  function isLikelyPdfUrl(url = "") {
    const safe = String(url);
    if (safe.startsWith("data:application/pdf")) return true;
    return /\.pdf$/i.test(safe.split("?")[0]);
  }

  async function downloadFile(url, fileName) {
    const safeUrl = String(url || "").trim();
    if (!safeUrl) return;

    try {
      const response = await fetch(safeUrl);
      if (!response.ok) {
        window.open(safeUrl, "_blank", "noopener,noreferrer");
        return;
      }
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = fileName || "design-file";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (_error) {
      window.open(safeUrl, "_blank", "noopener,noreferrer");
    }
  }

  async function uploadOrderDesignFile(file) {
    if (!file || !selectedOrderDetails?.id) return;
    if (!session?.token) return;

    setIsOrderDesignUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch(`/api/orders/${selectedOrderDetails.id}/design`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`
        },
        body
      });

      const data = await parseApiResponse(response, "Failed to upload design file.");
      setSelectedOrderDetails(data.order || null);
      setOrderManagement((current) => ({
        ...current,
        actionMessage: data.message || "Design file uploaded successfully.",
        errorMessage: ""
      }));
      window.dispatchEvent(new Event("orderchange"));
      window.dispatchEvent(new Event("dashboardstatschange"));
      window.dispatchEvent(new Event("orderstatuschange"));
    } catch (error) {
      setOrderManagement((current) => ({
        ...current,
        actionMessage: error?.message || "Failed to upload design file."
      }));
    } finally {
      setIsOrderDesignUploading(false);
    }
  }

  async function fetchAdminDetails(adminId) {
    setIsAdminDetailsLoading(true);
    setSelectedAdminDetails(null);

    try {
      const response = await fetch(`/api/super-admin/admins/${adminId}`, {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      });
      const data = await parseApiResponse(response, "Failed to load Admin details.");

      setSelectedAdminDetails(data.admin);
    } catch (error) {
      setAdminManagement((current) => ({
        ...current,
        actionMessage: error?.message || "Failed to load Admin details."
      }));
    } finally {
      setIsAdminDetailsLoading(false);
    }
  }

  async function updateAdminRecord(adminId, endpoint, payload) {
    try {
      const response = await fetch(`/api/super-admin/admins/${adminId}/${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await parseApiResponse(response, "Failed to update Admin record.");

      setSelectedAdminDetails(data.admin || null);
      setAdminManagement((current) => ({
        ...current,
        actionMessage: data.message || "Admin record updated successfully.",
        errorMessage: ""
      }));
      window.dispatchEvent(new Event("adminchange"));
      window.dispatchEvent(new Event("dashboardstatschange"));
    } catch (error) {
      setAdminManagement((current) => ({
        ...current,
        actionMessage: error?.message || "Failed to update Admin record."
      }));
    }
  }

  async function fetchAssociateMemberDetails(associateMemberId) {
    setIsAssociateDetailsLoading(true);
    setSelectedAssociateDetails(null);
    setSelectedAssociateAdminId("");

    try {
      const response = await fetch(`/api/super-admin/associate-members/${associateMemberId}`, {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      });
      const data = await parseApiResponse(response, "Failed to load Associate Member details.");

      setSelectedAssociateDetails(data.associateMember);
      setSelectedAssociateAdminId(data.associateMember?.assignedAdminId || "");
    } catch (error) {
      setAssociateManagement((current) => ({
        ...current,
        actionMessage: error?.message || "Failed to load Associate Member details."
      }));
    } finally {
      setIsAssociateDetailsLoading(false);
    }
  }

  async function updateAssociateMemberRecord(associateMemberId, endpoint, payload) {
    try {
      const response = await fetch(`/api/super-admin/associate-members/${associateMemberId}/${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await parseApiResponse(response, "Failed to update Associate Member record.");

      if (data.associateMember) {
        setSelectedAssociateDetails(data.associateMember);
        setSelectedAssociateAdminId(data.associateMember.assignedAdminId || "");
      } else if (endpoint === "promote") {
        setSelectedAssociateDetails((current) =>
          current
            ? {
                ...current,
                role: "admin",
                assignedAdminId: "",
                assignedAdminName: "Not Assigned",
                assignedAdmin: null
              }
            : current
        );
        setSelectedAssociateAdminId("");
      } else if (endpoint === "revert-role") {
        setSelectedAssociateDetails((current) =>
          current
            ? {
                ...current,
                role: "associate-member",
                assignedAdminId: payload?.adminId || "",
                assignedAdminName:
                  adminOptions.find((option) => option.id === payload?.adminId)?.name || "Not Assigned",
                assignedAdmin: payload?.adminId
                  ? {
                      id: payload.adminId,
                      adminName: adminOptions.find((option) => option.id === payload.adminId)?.name || "Not Assigned",
                      mobileNumber: adminOptions.find((option) => option.id === payload.adminId)?.mobileNumber || "",
                      email: "",
                      businessName: "",
                      status: adminOptions.find((option) => option.id === payload.adminId)?.status || ""
                    }
                  : null
              }
            : current
        );
      }

      setAssociateManagement((current) => ({
        ...current,
        actionMessage: data.message || "Associate Member record updated successfully.",
        errorMessage: ""
      }));
      window.dispatchEvent(new Event("associatememberchange"));
      window.dispatchEvent(new Event("dashboardstatschange"));
    } catch (error) {
      setAssociateManagement((current) => ({
        ...current,
        actionMessage: error?.message || "Failed to update Associate Member record."
      }));
    }
  }

  async function fetchWalletRequestDetails(requestId) {
    setIsWalletDetailsLoading(true);
    setSelectedWalletDetails(null);

    try {
      const response = await fetch(`/api/super-admin/wallet/requests/${requestId}`, {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      });
      const data = await parseApiResponse(response, "Failed to load wallet request details.");

      setSelectedWalletDetails(data.walletRequest || null);
    } catch (error) {
      setWalletManagement((current) => ({
        ...current,
        errorMessage: error?.message || "Failed to load wallet request details."
      }));
    } finally {
      setIsWalletDetailsLoading(false);
    }
  }

  async function updateWalletRequestStatus(requestId, payload) {
    try {
      const response = await fetch(`/api/super-admin/wallet/requests/${requestId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await parseApiResponse(response, "Failed to update wallet request status.");

      setSelectedWalletDetails(data.walletRequest || null);
      setWalletManagement((current) => ({
        ...current,
        errorMessage: ""
      }));
      window.dispatchEvent(new Event("walletchange"));
      window.dispatchEvent(new Event("dashboardstatschange"));
    } catch (error) {
      setWalletManagement((current) => ({
        ...current,
        errorMessage: error?.message || "Failed to update wallet request status."
      }));
    }
  }

  const filteredDashboardRecords = useMemo(() => {
    return activityRecords.filter((record) => {
      const searchTerm = filters.search.trim().toLowerCase();
      const matchesModule = !filters.module || record.moduleKey === filters.module;
      const matchesStatus = !filters.status || record.status === filters.status;
      const matchesSearch =
        !searchTerm ||
        [record.refNo, record.module, record.userOrder, record.updatedBy].some((value) =>
          value.toLowerCase().includes(searchTerm)
        );
      const matchesFromDate = !filters.fromDate || record.dateValue >= filters.fromDate;
      const matchesToDate = !filters.toDate || record.dateValue <= filters.toDate;

      return matchesModule && matchesStatus && matchesSearch && matchesFromDate && matchesToDate;
    });
  }, [filters]);

  const pageRecords = isDashboardRoute ? filteredDashboardRecords : isWalletActivityRoute ? walletManagement.items : getRouteRecords(currentRoute);
  const walletSearchKeys = useMemo(
    () => walletManagement.columns.map((column) => column?.key).filter(Boolean),
    [walletManagement.columns]
  );
  const filteredWalletPageRecords = useMemo(
    () => (isWalletActivityRoute ? filterGenericTableItems(pageRecords, walletQuickSearch, walletSearchKeys) : pageRecords),
    [isWalletActivityRoute, pageRecords, walletQuickSearch, walletSearchKeys]
  );
  const displayedPageRecords = isWalletActivityRoute ? filteredWalletPageRecords : pageRecords;
  const handleDownloadWalletPdf = useCallback(() => {
    downloadGenericRowsAsPdf(displayedPageRecords, walletExportColumns, walletExportBaseName, `${currentRoute.label} Records`);
  }, [currentRoute.label, displayedPageRecords, walletExportBaseName, walletExportColumns]);
  const handleDownloadWalletExcel = useCallback(() => {
    downloadGenericRowsAsExcel(displayedPageRecords, walletExportColumns, walletExportBaseName);
  }, [displayedPageRecords, walletExportBaseName, walletExportColumns]);

  const pageMetricCards = [
    {
      label: "Current Page",
      value: currentRoute.label,
      icon: currentRoute.path === "/dashboard/super-admin" ? LayoutDashboard : FileText
    },
    {
      label: "Parent Module",
      value: currentRoute.parentLabel,
      icon: currentRoute.parentId === "setting" ? Settings : UserCog
    },
    {
      label: "Visible Records",
      value: String(displayedPageRecords.length),
      icon: ClipboardList
    }
  ];

  const dashboardOverview = dashboardSummary.overview;
  const dashboardCards = [
    {
      key: "total-users",
      label: "Total Users",
      value: dashboardSummary.isLoading ? "..." : String(dashboardOverview.totalUsers ?? 0),
      note: dashboardSummary.isLoading ? "System-wide accounts" : `Active today: ${dashboardOverview.activeTodayUsers ?? 0}`,
      icon: Users
    },
    {
      key: "admins",
      label: "Total Admins",
      value: dashboardSummary.isLoading ? "..." : String(dashboardOverview.totalAdmins ?? 0),
      note: "Administrative accounts across the system",
      icon: ShieldCheck
    },
    {
      key: "associate-members",
      label: "Total Associate Members",
      value: dashboardSummary.isLoading ? "..." : String(dashboardOverview.totalAssociateMembers ?? 0),
      note: "Associate member network size",
      icon: Users
    },
    {
      key: "total-orders",
      label: "Total Orders",
      value: dashboardSummary.isLoading ? "..." : String(dashboardOverview.totalOrders ?? 0),
      note: "All booked orders in the system",
      icon: ClipboardList
    },
    {
      key: "pending-orders",
      label: "Pending Orders",
      value: dashboardSummary.isLoading ? "..." : String(dashboardOverview.pendingOrders ?? 0),
      note: "Orders waiting for review or processing",
      icon: ClipboardList
    },
    {
      key: "printing-orders",
      label: "Printing Orders",
      value: dashboardSummary.isLoading ? "..." : String(dashboardOverview.printingOrders ?? 0),
      note: "Orders currently in printing",
      icon: FileText
    },
    {
      key: "packaging-orders",
      label: "Packaging Orders",
      value: dashboardSummary.isLoading ? "..." : String(dashboardOverview.packagingOrders ?? 0),
      note: "Orders waiting in packaging",
      icon: FileText
    },
    {
      key: "dispatch-orders",
      label: "Dispatch Orders",
      value: dashboardSummary.isLoading ? "..." : String(dashboardOverview.dispatchOrders ?? 0),
      note: "Orders ready for dispatch tracking",
      icon: Clock3
    },
    {
      key: "completed-orders",
      label: "Completed Orders",
      value: dashboardSummary.isLoading ? "..." : String(dashboardOverview.completedOrders ?? 0),
      note: "Completed order deliveries",
      icon: ClipboardList
    },
    {
      key: "wallet-balance",
      label: "Total Wallet Balance",
      value: dashboardSummary.isLoading ? "..." : formatCurrency(dashboardOverview.totalWalletBalance ?? 0),
      note: "Net wallet balance across the system",
      icon: Wallet
    },
    {
      key: "wallet-transactions",
      label: "Total Wallet Transactions",
      value: dashboardSummary.isLoading ? "..." : String(dashboardOverview.totalWalletTransactions ?? 0),
      note: "Credits and debits recorded system-wide",
      icon: Wallet
    },
    {
      key: "pending-wallet-requests",
      label: "Pending Wallet Requests",
      value: dashboardSummary.isLoading ? "..." : String(dashboardOverview.pendingWalletRequests ?? 0),
      note: "Top-up requests awaiting review",
      icon: Wallet
    }
  ];

  const recentUserColumns = [
    { key: "name", label: "User Name" },
    { key: "role", label: "Role" },
    { key: "businessName", label: "Business / Firm" },
    { key: "status", label: "Status" },
    { key: "updatedOn", label: "Updated On" }
  ];
  const recentOrderColumns = [
    { key: "orderNumber", label: "Order No." },
    { key: "orderName", label: "Order Name" },
    { key: "createdBy", label: "Created By" },
    { key: "status", label: "Status" },
    { key: "orderedOn", label: "Ordered On" }
  ];
  const recentWalletColumns = [
    { key: "reference", label: "Reference" },
    { key: "type", label: "Type" },
    { key: "memberName", label: "Member Name" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "businessName", label: "Business / Firm" },
    { key: "updatedOn", label: "Updated On" }
  ];
  const pendingTaskColumns = [
    { key: "module", label: "Module" },
    { key: "title", label: "Pending Task" },
    { key: "status", label: "Status" },
    { key: "updatedOn", label: "Updated On" }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f6f8] text-[#333]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 md:grid-cols-[320px_1fr_280px] md:items-center">
          <div className="flex justify-center md:justify-start">
            <div id="ctl00_imgLogo" className="flex items-center gap-3">
              <img
                src={logo}
                alt="BAGSCLUB"
                className="block h-14 w-auto shrink-0 object-contain sm:h-16 md:h-20"
              />
              <div className="flex flex-col justify-center">
                <div className="text-lg font-extrabold tracking-wide text-blue-700 sm:text-xl md:text-2xl">
                  BAGSCLUB
                </div>
                <div className="text-xs font-medium text-slate-600 sm:text-sm">No.1 Bag Printing Service</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div id="partnerTypeContainer" className="space-y-1">
              <p className="text-sm font-bold text-[#333]">Super Admin Module</p>
              <p className="text-xs text-[#a71a00]">
                Go to{" "}
                <button
                  type="button"
                  onClick={() => handleNavigate("/dashboard/super-admin")}
                  className="font-semibold text-blue-700 underline-offset-2 transition hover:text-[#a71a00] hover:underline"
                >
                  Dashboard
                </button>
              </p>
              <p className="text-xs leading-5 text-[#a71a00]">
                Centralized control panel for users, orders, wallets, reports, and audit activity.
              </p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <div id="ctl00_divUserInfo" className="space-y-1 text-sm">
              <p className="font-bold">
                Hi, <span id="lbLoginUserName">{session.user.name || "Super Admin"}</span>
              </p>
              <div id="ctl00_lbDistAccountDetails" className="text-xs font-bold text-[#a71a00]">
                <p>Role - {normalizeRole(session.user.role)}</p>
                <p>
                  A/C Balance :{" "}
                  <button
                    type="button"
                    onClick={() => handleNavigate("/dashboard/super-admin/wallet-management/add-money")}
                    className="text-blue-700 transition hover:text-[#a71a00]"
                  >
                    {accountBalance}
                  </button>
                </p>
                <p>
                  Session :{" "}
                  <span id="spnBalance" className="cursor-pointer text-blue-700">
                    Active
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-[#a71a00]"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="h-[3px] w-full bg-[#a71a00] shadow-sm" aria-hidden="true" />

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-1 gap-y-2 px-4 py-2">
          {primaryNavItems.map((item) => {
            const isOpen = openMenuId === item.id;
            const isActive =
              pathname === item.path ||
              item.children?.some(
                (child) =>
                  child.path === pathname ||
                  (child.path === "/dashboard/super-admin/order-management/add-order" &&
                    pathname.startsWith("/dashboard/super-admin/order-management/add-order/")) ||
                  (child.path === "/dashboard/super-admin/order-management/all-orders" &&
                    pathname.startsWith("/dashboard/super-admin/order-management/details/")) ||
                  (child.path === "/dashboard/super-admin/user-management/associate-member-management" &&
                    pathname.startsWith("/dashboard/super-admin/user-management/associate-member-management/details/")) ||
                  (child.path === "/dashboard/super-admin/user-management/admin-management" &&
                    pathname.startsWith("/dashboard/super-admin/user-management/admin-management/details/")) ||
                  (child.path === "/dashboard/super-admin/wallet-management/add-money" &&
                    pathname.startsWith("/dashboard/super-admin/wallet-management/add-money/"))
              );
            const buttonClassName = isActive
              ? "border-[#a71a00] bg-[#a71a00] text-white"
              : "border-transparent bg-transparent text-slate-700 hover:bg-slate-50 hover:text-[#a71a00]";

            if (!item.children) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={`rounded border px-3 py-2 text-sm font-semibold transition ${buttonClassName}`}
                >
                  {item.label}
                </button>
              );
            }

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => handleMenuMouseEnter(item.id)}
                onMouseLeave={() => handleMenuMouseLeave(item.id)}
              >
                <div className="flex overflow-hidden rounded border">
                  <button
                    type="button"
                    onClick={() => handleNavigate(item.path)}
                    className={`px-3 py-2 text-sm font-semibold transition ${buttonClassName}`}
                  >
                    {item.label}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearMenuHoverTimeout();
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
                  <div className="absolute left-0 top-full z-20 mt-1 min-w-[240px] overflow-hidden rounded-b border-t-2 border-[#a71a00] bg-white shadow-lg">
                    {item.children.map((child) => {
                      const isChildActive =
                        pathname === child.path ||
                        (child.path === "/dashboard/super-admin/order-management/add-order" &&
                          pathname.startsWith("/dashboard/super-admin/order-management/add-order/")) ||
                        (child.path === "/dashboard/super-admin/order-management/all-orders" &&
                          pathname.startsWith("/dashboard/super-admin/order-management/details/")) ||
                        (child.path === "/dashboard/super-admin/user-management/associate-member-management" &&
                          pathname.startsWith("/dashboard/super-admin/user-management/associate-member-management/details/")) ||
                        (child.path === "/dashboard/super-admin/user-management/admin-management" &&
                          pathname.startsWith("/dashboard/super-admin/user-management/admin-management/details/")) ||
                        (child.path === "/dashboard/super-admin/wallet-management/add-money" &&
                          pathname.startsWith("/dashboard/super-admin/wallet-management/add-money/"));

                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => handleNavigate(child.path)}
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

      {isAddOrderRoute ? (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5">
          <section className="rounded border border-slate-300 border-l-4 border-l-[#a71a00] bg-white px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <LayoutDashboard className="text-[#a71a00]" size={24} />
                  {currentRoute.label}
                </h1>
                <p className="mt-1 text-xs text-slate-500">{currentRoute.description}</p>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Role: <span className="font-semibold text-slate-900">{normalizeRole(session.user.role)}</span>
              </div>
            </div>
          </section>
          <SuperAdminAddOrderLandingView />
        </main>
      ) : isAddMoneyRoute ? (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5">
          <section className="rounded border border-slate-300 border-l-4 border-l-[#a71a00] bg-white px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <LayoutDashboard className="text-[#a71a00]" size={24} />
                  {currentRoute.label}
                </h1>
                <p className="mt-1 text-xs text-slate-500">{currentRoute.description}</p>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Role: <span className="font-semibold text-slate-900">{normalizeRole(session.user.role)}</span>
              </div>
            </div>
          </section>
          <SuperAdminAddMoneyLandingView />
        </main>
      ) : isManualTopUpRoute ? (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5">
          <section className="rounded border border-slate-300 border-l-4 border-l-[#a71a00] bg-white px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <LayoutDashboard className="text-[#a71a00]" size={24} />
                  {currentRoute.label}
                </h1>
                <p className="mt-1 text-xs text-slate-500">{currentRoute.description}</p>
              </div>
            </div>
          </section>
          <SuperAdminManualWalletTopUpView />
        </main>
      ) : isAutoTopUpRoute ? (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5">
          <section className="rounded border border-slate-300 border-l-4 border-l-[#a71a00] bg-white px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <LayoutDashboard className="text-[#a71a00]" size={24} />
                  {currentRoute.label}
                </h1>
                <p className="mt-1 text-xs text-slate-500">{currentRoute.description}</p>
              </div>
            </div>
          </section>
          <SuperAdminAutoWalletTopUpView />
        </main>
      ) : isAddOrderNonWovenRoute ? (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5">
          <section className="rounded border border-slate-300 border-l-4 border-l-[#a71a00] bg-white px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <LayoutDashboard className="text-[#a71a00]" size={24} />
                  {currentRoute.label}
                </h1>
                <p className="mt-1 text-xs text-slate-500">{currentRoute.description}</p>
              </div>
            </div>
          </section>
          <SuperAdminNonWovenBagSelectionView />
        </main>
      ) : isAddOrderNonWovenFormRoute ? (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5">
          <section className="rounded border border-slate-300 border-l-4 border-l-[#a71a00] bg-white px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <LayoutDashboard className="text-[#a71a00]" size={24} />
                  {currentRoute.label}
                </h1>
                <p className="mt-1 text-xs text-slate-500">{currentRoute.description}</p>
              </div>
            </div>
          </section>
          <SuperAdminNonWovenBagOrderView bagSlug={currentAddOrderBagSlug} />
        </main>
      ) : isAssociateDetailsRoute ? (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5">
          <section className="rounded border border-slate-300 border-l-4 border-l-[#a71a00] bg-white px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <LayoutDashboard className="text-[#a71a00]" size={24} />
                  {currentRoute.label}
                </h1>
                <p className="mt-1 text-xs text-slate-500">{currentRoute.description}</p>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Role: <span className="font-semibold text-slate-900">{normalizeRole(session.user.role)}</span>
              </div>
            </div>
          </section>
          <SharedUserDetailsView
            title="User Details"
            subtitle="Review the selected Associate Member profile, assignment details, and account controls."
            loading={isAssociateDetailsLoading && !selectedAssociateDetails}
            loadingText="Loading Associate Member details..."
            backPathFallback="/dashboard/super-admin/user-management/associate-member-management"
            summaryCards={[
              { label: "Associate Member ID", value: selectedAssociateDetails?.associateMemberId },
              { label: "Status", value: selectedAssociateDetails?.status },
              { label: "Assigned Admin", value: selectedAssociateDetails?.assignedAdminName },
              { label: "Role", value: selectedAssociateDetails?.role ? normalizeRole(selectedAssociateDetails.role) : "--" }
            ]}
            informationTitle="Associate Member Information"
            informationFields={[
              { label: "Associate Member Name", value: selectedAssociateDetails?.associateMemberName },
              { label: "Mobile Number", value: selectedAssociateDetails?.mobileNumber },
              { label: "Email", value: selectedAssociateDetails?.email },
              { label: "Business/Firm Name", value: selectedAssociateDetails?.businessName },
              { label: "Country", value: selectedAssociateDetails?.country },
              { label: "GST Number", value: selectedAssociateDetails?.gstNumber },
              { label: "City", value: selectedAssociateDetails?.city },
              { label: "District", value: selectedAssociateDetails?.district },
              { label: "State", value: selectedAssociateDetails?.state },
              { label: "PIN Code", value: selectedAssociateDetails?.pinCode },
              { label: "Reference Code", value: selectedAssociateDetails?.referenceCode },
              { label: "Address", value: selectedAssociateDetails?.address, span: 2 }
            ]}
            extraSections={[
              {
                title: "Assigned Admin Details",
                fields: selectedAssociateDetails?.assignedAdmin
                  ? [
                      { label: "Admin Name", value: selectedAssociateDetails.assignedAdmin.adminName },
                      { label: "Mobile Number", value: selectedAssociateDetails.assignedAdmin.mobileNumber },
                      { label: "Email", value: selectedAssociateDetails.assignedAdmin.email },
                      { label: "Business/Firm Name", value: selectedAssociateDetails.assignedAdmin.businessName },
                      { label: "Status", value: selectedAssociateDetails.assignedAdmin.status }
                    ]
                  : [{ label: "Assignment Status", value: "No Admin is currently assigned to this Associate Member.", span: 2 }]
              }
            ]}
            sidePanel={associateDetailsSidePanel}
          />
        </main>
      ) : isAdminDetailsRoute ? (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5">
          <section className="rounded border border-slate-300 border-l-4 border-l-[#a71a00] bg-white px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <LayoutDashboard className="text-[#a71a00]" size={24} />
                  {currentRoute.label}
                </h1>
                <p className="mt-1 text-xs text-slate-500">{currentRoute.description}</p>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Role: <span className="font-semibold text-slate-900">{normalizeRole(session.user.role)}</span>
              </div>
            </div>
          </section>
          <SharedUserDetailsView
            title="User Details"
            subtitle="Review the selected Admin profile, access controls, and linked Associate Member records."
            loading={isAdminDetailsLoading && !selectedAdminDetails}
            loadingText="Loading Admin details..."
            backPathFallback="/dashboard/super-admin/user-management/admin-management"
            summaryCards={[
              { label: "Admin ID", value: selectedAdminDetails?.adminId },
              { label: "Status", value: selectedAdminDetails?.status },
              { label: "Associate Member Access", value: selectedAdminDetails?.associateMemberAccessStatus },
              { label: "Linked Associate Members", value: selectedAdminDetails?.associateMemberCount }
            ]}
            informationTitle="Admin Information"
            informationFields={[
              { label: "Admin Name", value: selectedAdminDetails?.adminName },
              { label: "Mobile Number", value: selectedAdminDetails?.mobileNumber },
              { label: "Email", value: selectedAdminDetails?.email },
              { label: "Business/Firm Name", value: selectedAdminDetails?.businessName },
              { label: "Admin Address", value: selectedAdminDetails?.adminAddress, span: 2 }
            ]}
            sidePanel={adminDetailsSidePanel}
            bottomContent={linkedAssociateMembersContent}
          />
        </main>
      ) : isWalletDetailsRoute ? (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5">
          <section className="rounded border border-slate-300 border-l-4 border-l-[#a71a00] bg-white px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <LayoutDashboard className="text-[#a71a00]" size={24} />
                  {currentRoute.label}
                </h1>
                <p className="mt-1 text-xs text-slate-500">{currentRoute.description}</p>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Role: <span className="font-semibold text-slate-900">{normalizeRole(session.user.role)}</span>
              </div>
            </div>
          </section>
          <SharedUserDetailsView
            title="Wallet Details"
            subtitle="Review the selected wallet request, requester information, and approval status."
            loading={isWalletDetailsLoading && !selectedWalletDetails}
            loadingText="Loading wallet request details..."
            backPathFallback="/dashboard/super-admin/wallet-management/wallet-transactions"
            summaryCards={[
              { label: "Reference", value: selectedWalletDetails?.reference },
              { label: "Amount", value: selectedWalletDetails?.amount ? `Rs. ${selectedWalletDetails.amount}` : "--" },
              { label: "Status", value: selectedWalletDetails?.status },
              { label: "Requested On", value: selectedWalletDetails?.requestedOn }
            ]}
            informationTitle="Wallet Request Information"
            informationFields={[
              { label: "Requested By", value: selectedWalletDetails?.requestedByDisplayName },
              { label: "Requested Role", value: selectedWalletDetails?.requestedByRole },
              { label: "Reviewed By", value: selectedWalletDetails?.reviewedByName || "--" },
              { label: "Reviewed Role", value: selectedWalletDetails?.reviewedByRole || "--" },
              { label: "Reviewed On", value: selectedWalletDetails?.reviewedOn || "--" },
              { label: "Decision Note", value: selectedWalletDetails?.decisionNote || "--", span: 2 },
              { label: "Remarks", value: selectedWalletDetails?.remarks || "--", span: 2 }
            ]}
            extraSections={[
              {
                title: "Requester Information",
                fields: selectedWalletDetails?.requester
                  ? [
                      { label: "User Name", value: selectedWalletDetails.requester.name },
                      { label: "Mobile Number", value: selectedWalletDetails.requester.mobileNumber },
                      { label: "Email", value: selectedWalletDetails.requester.email },
                      { label: "Business/Firm Name", value: selectedWalletDetails.requester.businessName },
                      { label: "Country", value: selectedWalletDetails.requester.country },
                      { label: "State", value: selectedWalletDetails.requester.state },
                      { label: "District", value: selectedWalletDetails.requester.district },
                      { label: "City", value: selectedWalletDetails.requester.city },
                      { label: "PIN Code", value: selectedWalletDetails.requester.pinCode },
                      { label: "GST Number", value: selectedWalletDetails.requester.gstNumber },
                      { label: "Account Status", value: selectedWalletDetails.requester.status },
                      { label: "Registration Date", value: selectedWalletDetails.requester.registrationDate },
                      { label: "Address", value: selectedWalletDetails.requester.address, span: 2 }
                    ]
                  : [{ label: "Requester", value: "No linked user profile is available for this wallet request.", span: 2 }]
              }
            ]}
            sidePanel={walletDetailsSidePanel}
          />
        </main>
      ) : isWalletActivityRoute ? (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5">
          <div className="space-y-6">
            {walletManagement.errorMessage ? (
              <article className="rounded border border-red-200 bg-red-50 p-4 shadow-sm">
                <p className="text-sm font-medium text-red-700">{walletManagement.errorMessage}</p>
              </article>
            ) : null}

            {walletManagement.isLoading ? (
              <article className="rounded border border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm">
                Loading wallet records...
              </article>
            ) : (
              <>
                <SharedOrderTableToolbar
                  searchValue={walletQuickSearch}
                  onSearchChange={setWalletQuickSearch}
                  onDownloadPdf={handleDownloadWalletPdf}
                  onDownloadExcel={handleDownloadWalletExcel}
                  filteredCount={filteredWalletPageRecords.length}
                  totalCount={walletManagement.items.length}
                  label={`Search ${currentRoute.parentLabel || currentRoute.label}`}
                  placeholder="Search visible records by any table field"
                />
                <DataTable
                  columns={walletManagement.columns}
                  items={filteredWalletPageRecords}
                  actionLabel="Details"
                  onAction={(item) => {
                    if (!item?.id) return;
                    handleNavigate(`/dashboard/super-admin/wallet-management/details/${item.id}`);
                  }}
                />
              </>
            )}
          </div>
        </main>
      ) : isShellOnlyRoute ? (
        <main className="flex-1" />
      ) : isOrderModuleRoute ? (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5">
          <section className="rounded border border-slate-300 border-l-4 border-l-[#a71a00] bg-white px-4 py-4 shadow-sm">
            <div>
              <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                <LayoutDashboard className="text-[#a71a00]" size={24} />
                {currentRoute.label}
              </h1>
              <p className="mt-1 text-xs text-slate-500">{currentRoute.description}</p>
            </div>
          </section>

          {isOrderDetailsRoute ? (
            <SharedOrderDetailsView
              orderId={orderDetailsId}
              loadOrderDetails={loadOrderDetailsForPage}
              updateOrderStatus={updateOrderRecord}
              backPathFallback="/dashboard/super-admin/order-management/all-orders"
              moduleLabel="Super Admin Orders"
              statusOptions={orderStatusOptions}
            />
          ) : (
            <section className="space-y-6">
              {(orderManagement.errorMessage || orderManagement.actionMessage) && (
                <article className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                  <p className={`text-sm font-medium ${orderManagement.errorMessage ? "text-red-600" : "text-emerald-600"}`}>
                    {orderManagement.errorMessage || orderManagement.actionMessage}
                  </p>
                </article>
              )}

              <article className={tableCardClassName}>
                <div className={tableSectionHeaderClassName}>
                  <h2 className="text-sm font-bold text-slate-800">{orderRecordsTitle}</h2>
                  <div className={tableSectionCountClassName}>
                    Showing {filteredOrderTableItems.length} of {orderManagement.pagination.totalRecords} Order records
                  </div>
                </div>
                <div className="border-b border-slate-200 px-4 py-4">
                  <SharedOrderTableToolbar
                    searchValue={orderQuickSearch}
                    onSearchChange={setOrderQuickSearch}
                    onDownloadPdf={() => downloadOrderRowsAsPdf(filteredOrderTableItems, orderExportBaseName, orderRecordsTitle)}
                    onDownloadExcel={() => downloadOrderRowsAsExcel(filteredOrderTableItems, orderExportBaseName)}
                    filteredCount={filteredOrderTableItems.length}
                    totalCount={orderManagement.items.length}
                    placeholder="Search by order number, order name, created by, status, or file type"
                  />
                </div>
                <div className="overflow-x-auto">
                  <SharedOrderRecordsTable
                    items={filteredOrderTableItems}
                    loading={orderManagement.isLoading}
                    loadingMessage="Loading Order records..."
                    emptyMessage="No Order records are available for the selected filters."
                    onOpenDetails={(orderId) => handleNavigate(`/dashboard/super-admin/order-management/details/${orderId}`)}
                  />
                </div>
                <div className={tablePaginationBarClassName}>
                  <span>
                    Page {orderManagement.pagination.page} of {orderManagement.pagination.totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={orderManagement.pagination.page <= 1}
                      onClick={() => updateOrderFilter("page", Math.max(orderManagement.pagination.page - 1, 1))}
                      className={tablePaginationButtonClassName}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={orderManagement.pagination.page >= orderManagement.pagination.totalPages}
                      onClick={() =>
                        updateOrderFilter(
                          "page",
                          Math.min(orderManagement.pagination.page + 1, orderManagement.pagination.totalPages)
                        )
                      }
                      className={tablePaginationButtonClassName}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </article>
            </section>
          )}

          {(selectedOrderDetails || isOrderDetailsLoading) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8">
              <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded border border-slate-300 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-b from-white to-slate-100 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Order Details</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Review complete order information, design source, timeline, and assigned team members.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedOrderDetails(null)}
                    className="rounded border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>

                <div className="max-h-[calc(90vh-72px)] overflow-y-auto p-4">
                  {isOrderDetailsLoading || !selectedOrderDetails ? (
                    <div className="py-10 text-center text-sm text-slate-500">Loading Order details...</div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Order Number</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">{selectedOrderDetails.orderNumber}</p>
                        </div>
                        <div className="rounded border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Current Status</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">{selectedOrderDetails.currentStatus}</p>
                        </div>
                        <div className="rounded border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Design Source</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">{selectedOrderDetails.designFileSource}</p>
                        </div>
                        <div className="rounded border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Order Date & Time</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">
                            {formatDateTime(selectedOrderDetails.orderDateTime)}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                        <div className="space-y-6">
                          <div className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Order Name</p>
                                <p className="mt-2 text-sm text-slate-800">{selectedOrderDetails.orderName}</p>
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Customer Name</p>
                                <p className="mt-2 text-sm text-slate-800">{selectedOrderDetails.customerName || "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Mobile Number</p>
                                <p className="mt-2 text-sm text-slate-800">{selectedOrderDetails.mobileNumber || "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Reference No.</p>
                                <p className="mt-2 text-sm text-slate-800">{selectedOrderDetails.referenceNo || "-"}</p>
                              </div>
                              <div className="sm:col-span-2">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Order Details Overview</p>
                                <p className="mt-2 text-sm leading-6 text-slate-800">
                                  {selectedOrderDetails.orderDetailsOverview}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800">Assignment Details</h3>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                              <div className="rounded border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Assigned Associate Member</p>
                                <p className="mt-2 text-sm font-semibold text-slate-900">
                                  {selectedOrderDetails.assignedAssociateMember?.name || "Not Assigned"}
                                </p>
                                <p className="mt-1 text-xs text-slate-600">
                                  {selectedOrderDetails.assignedAssociateMember?.mobileNumber || "-"}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {selectedOrderDetails.assignedAssociateMember?.businessName || "-"}
                                </p>
                              </div>
                              <div className="rounded border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Assigned Admin</p>
                                <p className="mt-2 text-sm font-semibold text-slate-900">
                                  {selectedOrderDetails.assignedAdmin?.name || "Not Assigned"}
                                </p>
                                <p className="mt-1 text-xs text-slate-600">
                                  {selectedOrderDetails.assignedAdmin?.mobileNumber || "-"}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {selectedOrderDetails.assignedAdmin?.businessName || "-"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800">Order Timeline</h3>
                            <div className="mt-4 space-y-3">
                              {(selectedOrderDetails.statusHistory || []).length > 0 ? (
                                selectedOrderDetails.statusHistory.map((entry) => (
                                  <div
                                    key={entry.id}
                                    className="flex items-start gap-3 rounded border border-slate-200 bg-slate-50 p-3"
                                  >
                                    <div className="rounded-full bg-white p-2 text-[#a71a00] shadow-sm">
                                      <Clock3 size={14} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-900">{entry.status}</span>
                                        <span className="text-xs text-slate-500">{formatDateTime(entry.changedAt)}</span>
                                      </div>
                                      <p className="mt-1 text-xs text-slate-600">{entry.note || "Status updated."}</p>
                                      <p className="mt-1 text-xs text-slate-500">Updated by: {entry.changedByName || "System"}</p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                                  No status history is available for this order yet.
                                </div>
                              )}
                            </div>
                          </div>

                          {isDispatchedOrdersRoute && (
                            <div className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                              <h3 className="text-sm font-bold text-slate-800">Dispatch History</h3>
                              <div className="mt-4 space-y-3">
                                {(selectedOrderDetails.dispatchHistory || []).length > 0 ? (
                                  selectedOrderDetails.dispatchHistory.map((entry) => (
                                    <div
                                      key={entry.id}
                                      className="flex items-start gap-3 rounded border border-slate-200 bg-slate-50 p-3"
                                    >
                                      <div className="rounded-full bg-white p-2 text-emerald-600 shadow-sm">
                                        <Clock3 size={14} />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <span className="text-sm font-semibold text-slate-900">{entry.status}</span>
                                          <span className="text-xs text-slate-500">{formatDateTime(entry.eventAt)}</span>
                                        </div>
                                        <p className="mt-1 text-xs text-slate-600">
                                          {entry.note || "Dispatch information updated."}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                          Courier: {entry.courierName || "Not provided"} | Tracking:{" "}
                                          {entry.courierTrackingNumber || "Not provided"} | Delivery Status:{" "}
                                          {entry.deliveryStatus || "Not provided"}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                          Updated by: {entry.updatedByName || "System"}
                                        </p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                                    No dispatch history is available for this order yet.
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-6">
                          {orderStatusActionOptions.length > 0 && (
                            <div className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                              <h3 className="text-sm font-bold text-slate-800">Manage Order</h3>
                              <div className="mt-4 space-y-3">
                                {orderStatusActionOptions.map((statusOption) => (
                                  <button
                                    key={statusOption.value}
                                    type="button"
                                    onClick={() =>
                                      updateOrderRecord(selectedOrderDetails.id, {
                                        status: statusOption.value,
                                        note: `Status changed to ${statusOption.label.replace("Set ", "")}.`
                                      })
                                    }
                                    className={`w-full rounded border px-4 py-2 text-sm font-semibold text-white transition ${statusOption.className}`}
                                  >
                                    {statusOption.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800">Order Details</h3>
                            <div className="mt-4 grid gap-3 text-sm text-slate-700">
                              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Bag Type</p>
                                <p className="mt-1 font-semibold text-slate-900">{selectedOrderDetails.bagName || "--"}</p>
                              </div>
                              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Print Side</p>
                                <p className="mt-1 font-semibold text-slate-900">{selectedOrderDetails.printSide || "--"}</p>
                              </div>
                              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Quantity</p>
                                <p className="mt-1 font-semibold text-slate-900">{selectedOrderDetails.quantity ?? "--"}</p>
                              </div>
                              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Size</p>
                                <p className="mt-1 font-semibold text-slate-900">{selectedOrderDetails.bagSize || "--"}</p>
                              </div>
                              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Bag Color</p>
                                <p className="mt-1 font-semibold text-slate-900">{selectedOrderDetails.bagColor || "--"}</p>
                              </div>
                              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Text Color Type</p>
                                <p className="mt-1 font-semibold text-slate-900">{selectedOrderDetails.textColorType || "--"}</p>
                              </div>
                              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Text Colors</p>
                                <p className="mt-1 font-semibold text-slate-900">
                                  {Array.isArray(selectedOrderDetails.textColors)
                                    ? selectedOrderDetails.textColors.filter(Boolean).join(", ") || "--"
                                    : selectedOrderDetails.textColors || "--"}
                                </p>
                              </div>
                              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Special Remark</p>
                                <p className="mt-1 text-slate-800">{selectedOrderDetails.remark || "--"}</p>
                              </div>
                            </div>
                          </div>

                          {isDispatchedOrdersRoute && (
                            <div className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                              <h3 className="text-sm font-bold text-slate-800">Dispatch Information</h3>
                              <div className="mt-4 grid gap-4 text-sm text-slate-700">
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Courier Name</p>
                                  <p className="mt-1 text-sm text-slate-800">{selectedOrderDetails.courierName || "Not provided"}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Tracking Number</p>
                                  <p className="mt-1 text-sm text-slate-800">
                                    {selectedOrderDetails.courierTrackingNumber || "Not provided"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Dispatch Date & Time</p>
                                  <p className="mt-1 text-sm text-slate-800">
                                    {formatDateTime(selectedOrderDetails.dispatchDateTime)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Delivery Status</p>
                                  <p className="mt-1 text-sm text-slate-800">{selectedOrderDetails.deliveryStatus || "Not provided"}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Delivery Date & Time</p>
                                  <p className="mt-1 text-sm text-slate-800">
                                    {formatDateTime(selectedOrderDetails.deliveryDateTime)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Dispatch Notes</p>
                                  <p className="mt-1 text-sm leading-6 text-slate-800">
                                    {selectedOrderDetails.dispatchNotes || "No dispatch notes available."}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  disabled={!selectedOrderDetails.courierTrackingUrl}
                                  onClick={() =>
                                    window.open(selectedOrderDetails.courierTrackingUrl, "_blank", "noopener,noreferrer")
                                  }
                                  className="w-full rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  View Courier Tracking
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800">Design File</h3>
                            <div className="mt-4 space-y-3 text-sm text-slate-700">
                              <input
                                ref={orderDesignInputRef}
                                type="file"
                                className="hidden"
                                accept=".pdf,.cdr,.ai,.psd,.jpeg,.jpg,.png"
                                onChange={(event) => {
                                  const file = event.target.files?.[0];
                                  event.target.value = "";
                                  uploadOrderDesignFile(file);
                                }}
                              />
                              <div className="flex items-center gap-2">
                                {selectedOrderDetails.hasFileAttachment ? (
                                  <Paperclip size={16} className="text-[#a71a00]" />
                                ) : selectedOrderDetails.hasEmailDesign ? (
                                  <Mail size={16} className="text-blue-700" />
                                ) : (
                                  <FileText size={16} className="text-slate-400" />
                                )}
                                <span>{selectedOrderDetails.designFileSource}</span>
                              </div>
                              <p className="text-xs text-slate-500">
                                File Name: {selectedOrderDetails.designFileName || "Not provided"}
                              </p>
                              <button
                                type="button"
                                disabled={isOrderDesignUploading}
                                onClick={() => orderDesignInputRef.current?.click()}
                                className="w-full rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isOrderDesignUploading
                                  ? "Uploading..."
                                  : selectedOrderDetails.designFileUrl
                                    ? "Replace Design File"
                                    : "Upload Design File"}
                              </button>
                              {selectedOrderDetails.designFileUrl && isLikelyImageUrl(selectedOrderDetails.designFileUrl) ? (
                                <img
                                  src={selectedOrderDetails.designFileUrl}
                                  alt={selectedOrderDetails.designFileName || "Design File"}
                                  className="w-full rounded border border-slate-200 object-contain"
                                />
                              ) : null}
                              {selectedOrderDetails.designFileUrl && isLikelyPdfUrl(selectedOrderDetails.designFileUrl) ? (
                                <iframe
                                  title="Design preview"
                                  src={selectedOrderDetails.designFileUrl}
                                  className="h-64 w-full rounded border border-slate-200"
                                />
                              ) : null}
                              <button
                                type="button"
                                disabled={!selectedOrderDetails.designFileUrl}
                                onClick={() => window.open(selectedOrderDetails.designFileUrl, "_blank", "noopener,noreferrer")}
                                className="w-full rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                View Uploaded Design File
                              </button>
                              <button
                                type="button"
                                disabled={!selectedOrderDetails.designFileUrl}
                                onClick={() => downloadFile(selectedOrderDetails.designFileUrl, selectedOrderDetails.designFileName || "design-file")}
                                className="w-full rounded bg-[#a71a00] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#841400] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Download Design File
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      ) : isAssociateMemberManagementRoute ? (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5">
          <section className="rounded border border-slate-300 border-l-4 border-l-[#a71a00] bg-white px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <LayoutDashboard className="text-[#a71a00]" size={24} />
                  {currentRoute.label}
                </h1>
                <p className="mt-1 text-xs text-slate-500">{currentRoute.description}</p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                  Total Associate Members:{" "}
                  <span className="font-semibold text-slate-900">{associateManagement.pagination.totalRecords}</span>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                  Page:{" "}
                  <span className="font-semibold text-slate-900">
                    {associateManagement.pagination.page} / {associateManagement.pagination.totalPages}
                  </span>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                  Role: <span className="font-semibold text-slate-900">{normalizeRole(session.user.role)}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
              {(associateManagement.errorMessage || associateManagement.actionMessage) && (
                <article className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                  <p
                    className={`text-sm font-medium ${
                      associateManagement.errorMessage ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {associateManagement.errorMessage || associateManagement.actionMessage}
                  </p>
                </article>
              )}

              <article className={tableCardClassName}>
                <div className={tableSectionHeaderClassName}>
                  <h2 className="text-sm font-bold text-slate-800">Associate Member Records</h2>
                  <div className={tableSectionCountClassName}>
                    Showing {filteredAssociateTableItems.length} of {associateManagement.pagination.totalRecords} Associate
                    Member records
                  </div>
                </div>
                <div className="border-b border-slate-200 px-4 py-4">
                  <SharedOrderTableToolbar
                    searchValue={associateQuickSearch}
                    onSearchChange={setAssociateQuickSearch}
                    onDownloadPdf={handleDownloadAssociatePdf}
                    onDownloadExcel={handleDownloadAssociateExcel}
                    filteredCount={filteredAssociateTableItems.length}
                    totalCount={associateManagement.items.length}
                    label="Search Associate Members"
                    placeholder="Search by associate member ID, firm name, user name, mobile number, or district"
                  />
                </div>
                <div className={tableShellClassName}>
                  <table className={`${tableElementClassName} min-w-full text-left`}>
                    <thead>
                      <tr>
                        {[
                          { label: "Associate Member ID", sortBy: "associateMemberId" },
                          { label: "Firm Name", sortBy: "businessName" },
                          { label: "User Name", sortBy: "name" },
                          { label: "WhatsApp Number", sortBy: "mobile" },
                          { label: "District Name", sortBy: "district" },
                          { label: "Action", sortBy: "" }
                        ].map((column) => (
                          <th key={column.label} className={tableHeaderCellClassName}>
                            {column.sortBy ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const nextSortOrder =
                                    associateFilters.sortBy === column.sortBy && associateFilters.sortOrder === "asc"
                                      ? "desc"
                                      : "asc";
                                  setAssociateFilters((current) => ({
                                    ...current,
                                    sortBy: column.sortBy,
                                    sortOrder: nextSortOrder,
                                    page: 1
                                  }));
                                }}
                                className="inline-flex items-center gap-1 transition hover:text-[#d9d9d9]"
                              >
                                {column.label}
                                <span className="text-[10px] text-slate-400">
                                  {associateFilters.sortBy === column.sortBy
                                    ? associateFilters.sortOrder === "asc"
                                      ? "▲"
                                      : "▼"
                                    : "↕"}
                                </span>
                              </button>
                            ) : (
                              column.label
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {associateManagement.isLoading ? (
                        <tr>
                          <td colSpan="6" className={tableEmptyCellClassName}>
                            Loading Associate Member records...
                          </td>
                        </tr>
                      ) : filteredAssociateTableItems.length > 0 ? (
                        filteredAssociateTableItems.map((associateMember, index) => (
                          <tr key={associateMember.id} className={getTableBodyRowClassName(index)}>
                            <td className={`${tableBodyCellClassName} whitespace-nowrap font-semibold`}>
                              {associateMember.associateMemberId}
                            </td>
                            <td className={`${tableBodyCellClassName} font-medium`}>
                              {associateMember.businessName || "--"}
                            </td>
                            <td className={tableBodyCellClassName}>{associateMember.associateMemberName}</td>
                            <td className={`${tableBodyCellClassName} whitespace-nowrap`}>
                              {associateMember.mobileNumber}
                            </td>
                            <td className={`${tableBodyCellClassName} whitespace-nowrap`}>
                              {associateMember.district || "--"}
                            </td>
                            <td className={tableBodyCellCenterClassName}>
                              <button
                                type="button"
                                onClick={() => navigateTo(`/dashboard/super-admin/user-management/associate-member-management/details/${associateMember.id}`)}
                                className={tableActionButtonClassName}
                              >
                                <Eye size={14} />
                                Details
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className={tableEmptyCellClassName}>
                            No Associate Member records are available for the selected filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className={tablePaginationBarClassName}>
                  <span>
                    Page {associateManagement.pagination.page} of {associateManagement.pagination.totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={associateManagement.pagination.page <= 1}
                      onClick={() => updateAssociateFilter("page", Math.max(associateManagement.pagination.page - 1, 1))}
                      className={tablePaginationButtonClassName}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={associateManagement.pagination.page >= associateManagement.pagination.totalPages}
                      onClick={() =>
                        updateAssociateFilter(
                          "page",
                          Math.min(
                            associateManagement.pagination.page + 1,
                            associateManagement.pagination.totalPages
                          )
                        )
                      }
                      className={tablePaginationButtonClassName}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </article>
          </section>

          {(selectedAssociateDetails || isAssociateDetailsLoading) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8">
              <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded border border-slate-300 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-b from-white to-slate-100 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Associate Member Details</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Review Associate Member profile, assigned Admin, and account controls.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAssociateDetails(null);
                      setSelectedAssociateAdminId("");
                    }}
                    className="rounded border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>

                <div className="max-h-[calc(90vh-72px)] overflow-y-auto p-4">
                  {isAssociateDetailsLoading || !selectedAssociateDetails ? (
                    <div className="py-10 text-center text-sm text-slate-500">Loading Associate Member details...</div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Associate Member ID</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">
                            {selectedAssociateDetails.associateMemberId}
                          </p>
                        </div>
                        <div className="rounded border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Status</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">{selectedAssociateDetails.status}</p>
                        </div>
                        <div className="rounded border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Assigned Admin</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">
                            {selectedAssociateDetails.assignedAdminName}
                          </p>
                        </div>
                        <div className="rounded border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Role</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">
                            {normalizeRole(selectedAssociateDetails.role)}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                        <div className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                Associate Member Name
                              </p>
                              <p className="mt-2 text-sm text-slate-800">{selectedAssociateDetails.associateMemberName}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Mobile Number</p>
                              <p className="mt-2 text-sm text-slate-800">{selectedAssociateDetails.mobileNumber}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</p>
                              <p className="mt-2 text-sm text-slate-800">{selectedAssociateDetails.email}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Business/Firm Name</p>
                              <p className="mt-2 text-sm text-slate-800">{selectedAssociateDetails.businessName}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Address</p>
                              <p className="mt-2 text-sm text-slate-800">{selectedAssociateDetails.address}</p>
                            </div>
                          </div>

                          <div className="mt-6 rounded border border-slate-200 bg-slate-50 p-4">
                            <h3 className="text-sm font-bold text-slate-800">Assigned Admin Details</h3>
                            {selectedAssociateDetails.assignedAdmin ? (
                              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Admin Name</p>
                                  <p className="mt-1 text-sm text-slate-800">
                                    {selectedAssociateDetails.assignedAdmin.adminName}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Mobile Number</p>
                                  <p className="mt-1 text-sm text-slate-800">
                                    {selectedAssociateDetails.assignedAdmin.mobileNumber}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</p>
                                  <p className="mt-1 text-sm text-slate-800">
                                    {selectedAssociateDetails.assignedAdmin.email}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Status</p>
                                  <p className="mt-1 text-sm text-slate-800">
                                    {selectedAssociateDetails.assignedAdmin.status}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <p className="mt-3 text-sm text-slate-600">No Admin is currently assigned to this Associate Member.</p>
                            )}
                          </div>
                        </div>

                        <div className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                          <h3 className="text-sm font-bold text-slate-800">Manage Associate Member</h3>
                          <div className="mt-4 space-y-3">
                            <button
                              type="button"
                              onClick={() =>
                                updateAssociateMemberRecord(selectedAssociateDetails.id, "status", {
                                  status: selectedAssociateDetails.statusValue === "active" ? "deactive" : "active"
                                })
                              }
                              className={`w-full rounded border px-4 py-2 text-sm font-semibold text-white transition ${
                                selectedAssociateDetails.statusValue === "active"
                                  ? "border-[#a71a00] bg-[#a71a00] hover:bg-[#841400]"
                                  : "border-emerald-600 bg-emerald-600 hover:bg-emerald-700"
                              }`}
                            >
                              {selectedAssociateDetails.statusValue === "active"
                                ? "Deactivate Associate Member"
                                : "Activate Associate Member"}
                            </button>

                            <div className="space-y-2">
                              <label htmlFor="associateAssignedAdminSelect" className="text-xs font-bold text-slate-700">
                                Change Assigned Admin
                              </label>
                              <select
                                id="associateAssignedAdminSelect"
                                value={selectedAssociateAdminId}
                                onChange={(event) => setSelectedAssociateAdminId(event.target.value)}
                                className="h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                              >
                                <option value="">Not Assigned</option>
                                {adminOptions.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.name} ({option.mobileNumber})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                updateAssociateMemberRecord(selectedAssociateDetails.id, "assign-admin", {
                                  adminId: selectedAssociateAdminId || null
                                })
                              }
                              className="w-full rounded border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                            >
                              Update Assigned Admin
                            </button>

                            {selectedAssociateDetails.role === "associate-member" ? (
                              <button
                                type="button"
                                onClick={() => updateAssociateMemberRecord(selectedAssociateDetails.id, "promote", {})}
                                className="w-full rounded border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
                              >
                                Promote To Admin
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  updateAssociateMemberRecord(selectedAssociateDetails.id, "revert-role", {
                                    adminId: selectedAssociateAdminId || null
                                  })
                                }
                                className="w-full rounded border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
                              >
                                Revoke Admin Privileges
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      ) : isAdminManagementRoute ? (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5">
          <section className="rounded border border-slate-300 border-l-4 border-l-[#a71a00] bg-white px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <LayoutDashboard className="text-[#a71a00]" size={24} />
                  {currentRoute.label}
                </h1>
                <p className="mt-1 text-xs text-slate-500">{currentRoute.description}</p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                  Total Admins: <span className="font-semibold text-slate-900">{adminManagement.pagination.totalRecords}</span>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                  Page:{" "}
                  <span className="font-semibold text-slate-900">
                    {adminManagement.pagination.page} / {adminManagement.pagination.totalPages}
                  </span>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                  Role: <span className="font-semibold text-slate-900">{normalizeRole(session.user.role)}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
              {(adminManagement.errorMessage || adminManagement.actionMessage) && (
                <article className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                  <p className={`text-sm font-medium ${adminManagement.errorMessage ? "text-red-600" : "text-emerald-600"}`}>
                    {adminManagement.errorMessage || adminManagement.actionMessage}
                  </p>
                </article>
              )}

              <article className={tableCardClassName}>
                <div className={tableSectionHeaderClassName}>
                  <h2 className="text-sm font-bold text-slate-800">Admin Records</h2>
                  <div className={tableSectionCountClassName}>Showing {filteredAdminTableItems.length} of {adminManagement.pagination.totalRecords} Admin records</div>
                </div>
                <div className="border-b border-slate-200 px-4 py-4">
                  <SharedOrderTableToolbar
                    searchValue={adminQuickSearch}
                    onSearchChange={setAdminQuickSearch}
                    onDownloadPdf={handleDownloadAdminPdf}
                    onDownloadExcel={handleDownloadAdminExcel}
                    filteredCount={filteredAdminTableItems.length}
                    totalCount={adminManagement.items.length}
                    label="Search Admin Records"
                    placeholder="Search by admin ID, admin name, mobile number, address, business name, or status"
                  />
                </div>
                <div className={tableShellClassName}>
                  <table className={`${tableElementClassName} min-w-full text-left`}>
                    <thead>
                      <tr>
                        {[
                          { label: "Admin ID", sortBy: "adminId" },
                          { label: "Admin Name", sortBy: "name" },
                          { label: "Mobile Number", sortBy: "mobile" },
                          { label: "Admin Address", sortBy: "address" },
                          { label: "Business/Firm Name", sortBy: "businessName" },
                          { label: "Status", sortBy: "status" },
                          { label: "Associate Member Access Status", sortBy: "associateAccess" },
                          { label: "Actions", sortBy: "" }
                        ].map((column) => (
                          <th key={column.label} className={tableHeaderCellClassName}>
                            {column.sortBy ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const nextSortOrder =
                                    adminFilters.sortBy === column.sortBy && adminFilters.sortOrder === "asc" ? "desc" : "asc";
                                  setAdminFilters((current) => ({
                                    ...current,
                                    sortBy: column.sortBy,
                                    sortOrder: nextSortOrder,
                                    page: 1
                                  }));
                                }}
                                className="inline-flex items-center gap-1 transition hover:text-[#d9d9d9]"
                              >
                                {column.label}
                                <span className="text-[10px] text-slate-400">
                                  {adminFilters.sortBy === column.sortBy ? (adminFilters.sortOrder === "asc" ? "▲" : "▼") : "↕"}
                                </span>
                              </button>
                            ) : (
                              column.label
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {adminManagement.isLoading ? (
                        <tr>
                          <td colSpan="8" className={tableEmptyCellClassName}>
                            Loading Admin records...
                          </td>
                        </tr>
                      ) : filteredAdminTableItems.length > 0 ? (
                        filteredAdminTableItems.map((admin, index) => (
                          <tr key={admin.id} className={getTableBodyRowClassName(index)}>
                            <td className={`${tableBodyCellClassName} font-semibold`}>{admin.adminId}</td>
                            <td className={tableBodyCellClassName}>{admin.adminName}</td>
                            <td className={tableBodyCellClassName}>{admin.mobileNumber}</td>
                            <td className={tableBodyCellMutedClassName}>{admin.adminAddress}</td>
                            <td className={tableBodyCellClassName}>{admin.businessName}</td>
                            <td className={tableBodyCellClassName}>
                              <span
                                className={`inline-flex rounded px-2 py-1 text-xs font-bold ${
                                  admin.statusValue === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                }`}
                              >
                                {admin.status}
                              </span>
                            </td>
                            <td className={tableBodyCellClassName}>
                              <span
                                className={`inline-flex rounded px-2 py-1 text-xs font-bold ${
                                  admin.associateMemberAccessEnabled
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-200 text-slate-700"
                                }`}
                              >
                                {admin.associateMemberAccessStatus}
                              </span>
                            </td>
                            <td className={tableBodyCellCenterClassName}>
                              <button
                                type="button"
                                onClick={() => navigateTo(`/dashboard/super-admin/user-management/admin-management/details/${admin.id}`)}
                                className={tableActionButtonClassName}
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className={tableEmptyCellClassName}>
                            No Admin records are available for the selected filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className={tablePaginationBarClassName}>
                  <span>
                    Page {adminManagement.pagination.page} of {adminManagement.pagination.totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={adminManagement.pagination.page <= 1}
                      onClick={() => updateAdminFilter("page", Math.max(adminManagement.pagination.page - 1, 1))}
                      className={tablePaginationButtonClassName}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={adminManagement.pagination.page >= adminManagement.pagination.totalPages}
                      onClick={() =>
                        updateAdminFilter(
                          "page",
                          Math.min(adminManagement.pagination.page + 1, adminManagement.pagination.totalPages)
                        )
                      }
                      className={tablePaginationButtonClassName}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </article>
          </section>

          {(selectedAdminDetails || isAdminDetailsLoading) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8">
              <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded border border-slate-300 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-b from-white to-slate-100 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Admin Details</h2>
                    <p className="mt-1 text-xs text-slate-500">Review Admin profile, access controls, and linked Associate Members.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAdminDetails(null)}
                    className="rounded border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>

                <div className="max-h-[calc(90vh-72px)] overflow-y-auto p-4">
                  {isAdminDetailsLoading || !selectedAdminDetails ? (
                    <div className="py-10 text-center text-sm text-slate-500">Loading Admin details...</div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Admin ID</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">{selectedAdminDetails.adminId}</p>
                        </div>
                        <div className="rounded border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Status</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">{selectedAdminDetails.status}</p>
                        </div>
                        <div className="rounded border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Associate Member Access</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">{selectedAdminDetails.associateMemberAccessStatus}</p>
                        </div>
                        <div className="rounded border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Linked Associate Members</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">{selectedAdminDetails.associateMemberCount}</p>
                        </div>
                      </div>

                      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                        <div className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Admin Name</p>
                              <p className="mt-2 text-sm text-slate-800">{selectedAdminDetails.adminName}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Mobile Number</p>
                              <p className="mt-2 text-sm text-slate-800">{selectedAdminDetails.mobileNumber}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</p>
                              <p className="mt-2 text-sm text-slate-800">{selectedAdminDetails.email}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Business/Firm Name</p>
                              <p className="mt-2 text-sm text-slate-800">{selectedAdminDetails.businessName}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Admin Address</p>
                              <p className="mt-2 text-sm text-slate-800">{selectedAdminDetails.adminAddress}</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                          <h3 className="text-sm font-bold text-slate-800">Manage Admin</h3>
                          <div className="mt-4 space-y-3">
                            <button
                              type="button"
                              onClick={() =>
                                updateAdminRecord(selectedAdminDetails.id, "status", {
                                  status: selectedAdminDetails.statusValue === "active" ? "deactive" : "active"
                                })
                              }
                              className={`w-full rounded border px-4 py-2 text-sm font-semibold text-white transition ${
                                selectedAdminDetails.statusValue === "active"
                                  ? "border-[#a71a00] bg-[#a71a00] hover:bg-[#841400]"
                                  : "border-emerald-600 bg-emerald-600 hover:bg-emerald-700"
                              }`}
                            >
                              {selectedAdminDetails.statusValue === "active" ? "Deactivate Admin" : "Activate Admin"}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateAdminRecord(selectedAdminDetails.id, "associate-access", {
                                  enabled: !selectedAdminDetails.associateMemberAccessEnabled
                                })
                              }
                              className="w-full rounded border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                            >
                              {selectedAdminDetails.associateMemberAccessEnabled
                                ? "Disable Associate Member Access"
                                : "Enable Associate Member Access"}
                            </button>
                          </div>
                        </div>
                      </div>

                      <article className="overflow-hidden rounded border border-slate-300 bg-white shadow-sm">
                        <div className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-100 px-4 py-3">
                          <h3 className="text-sm font-bold text-slate-800">Linked Associate Members</h3>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                              <tr>
                                <th className="border-b border-slate-200 px-4 py-3 font-bold">Member Name</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-bold">Business</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-bold">Mobile Number</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-bold">Location</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-bold">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedAdminDetails.associateMembers?.length ? (
                                selectedAdminDetails.associateMembers.map((member) => (
                                  <tr key={member.id}>
                                    <td className="border-b border-slate-200 px-4 py-3">{member.ownerName}</td>
                                    <td className="border-b border-slate-200 px-4 py-3">{member.businessName}</td>
                                    <td className="border-b border-slate-200 px-4 py-3">{member.mobileNumber}</td>
                                    <td className="border-b border-slate-200 px-4 py-3">{member.location || "-"}</td>
                                    <td className="border-b border-slate-200 px-4 py-3">{member.status}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="5" className="px-4 py-8 text-center text-sm text-slate-500">
                                    No Associate Members are linked to this Admin yet.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </article>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      ) : (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5">
          <section className="rounded border border-slate-300 border-l-4 border-l-[#a71a00] bg-white px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <LayoutDashboard className="text-[#a71a00]" size={24} />
                  {currentRoute.label}
                </h1>
                <p className="mt-1 text-xs text-slate-500">{currentRoute.description}</p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                  Country: <span className="font-semibold text-slate-900">{session.user.country}</span>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                  Mobile: <span className="font-semibold text-slate-900">{session.user.mobileNumber}</span>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                  Role: <span className="font-semibold text-slate-900">{normalizeRole(session.user.role)}</span>
                </div>
              </div>
            </div>
          </section>

          {isDashboardRoute ? (
            <section className="space-y-6">
              {dashboardSummary.errorMessage ? (
                <article className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                  {dashboardSummary.errorMessage}
                </article>
              ) : null}

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardCards.map(({ key, label, value, note, icon: Icon }) => (
                  <article key={key} className="rounded border border-slate-300 border-t-[3px] border-t-[#a71a00] bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                        <p className="mt-2 text-3xl font-bold leading-none text-slate-900">{value}</p>
                        <p className="mt-2 text-xs font-semibold text-[#a71a00]">{note}</p>
                      </div>
                      <div className="rounded-full bg-rose-50 p-3 text-[#a71a00]">
                        <Icon size={20} />
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                <article className="overflow-hidden rounded border border-slate-300 bg-white shadow-sm">
                  <div className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-100 px-4 py-3">
                    <h2 className="text-sm font-bold text-slate-800">Recent User Activities</h2>
                  </div>
                  <DataTable
                    columns={recentUserColumns}
                    items={dashboardSummary.recentActivities.users}
                    actionLabel="Details"
                    emptyMessage="No recent user activities are available yet."
                    renderCell={(record, column) =>
                      column.key === "status" ? (
                        <span className={`inline-flex rounded px-2 py-1 text-xs font-bold ${getDashboardStatusClassName(record.statusValue)}`}>
                          {record.status}
                        </span>
                      ) : (
                        record[column.key] ?? "--"
                      )
                    }
                    onAction={(item) => {
                      if (!item?.detailsPath) return;
                      handleNavigate(item.detailsPath);
                    }}
                  />
                </article>

                <article className="overflow-hidden rounded border border-slate-300 bg-white shadow-sm">
                  <div className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-100 px-4 py-3">
                    <h2 className="text-sm font-bold text-slate-800">Recent Orders</h2>
                  </div>
                  <DataTable
                    columns={recentOrderColumns}
                    items={dashboardSummary.recentActivities.orders}
                    actionLabel="Details"
                    emptyMessage="No recent order records are available yet."
                    renderCell={(record, column) =>
                      column.key === "status" ? (
                        <span className={`inline-flex rounded px-2 py-1 text-xs font-bold ${getDashboardStatusClassName(record.statusValue)}`}>
                          {record.status}
                        </span>
                      ) : (
                        record[column.key] ?? "--"
                      )
                    }
                    onAction={(item) => {
                      if (!item?.detailsPath) return;
                      handleNavigate(item.detailsPath);
                    }}
                  />
                </article>
              </section>

              <article className="overflow-hidden rounded border border-slate-300 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-100 px-4 py-3">
                  <h2 className="text-sm font-bold text-slate-800">Recent Wallet Transactions</h2>
                </div>
                <DataTable
                  columns={recentWalletColumns}
                  items={dashboardSummary.recentActivities.walletTransactions}
                  actionLabel="Details"
                  emptyMessage="No recent wallet transactions are available yet."
                  renderCell={(record, column) => {
                    if (column.key === "amount") return formatCurrency(record.amount);
                    if (column.key === "status") {
                      return (
                        <span className={`inline-flex rounded px-2 py-1 text-xs font-bold ${getDashboardStatusClassName(record.statusValue)}`}>
                          {record.status}
                        </span>
                      );
                    }
                    if (column.key === "type") {
                      return (
                        <span
                          className={`inline-flex rounded px-2 py-1 text-xs font-bold ${
                            String(record.type || "").toLowerCase() === "credit"
                              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border border-rose-200 bg-rose-50 text-rose-700"
                          }`}
                        >
                          {record.type}
                        </span>
                      );
                    }
                    return record[column.key] ?? "--";
                  }}
                  onAction={(item) => {
                    if (!item?.detailsPath) return;
                    handleNavigate(item.detailsPath);
                  }}
                />
              </article>

              <article className="overflow-hidden rounded border border-rose-200 bg-white shadow-sm">
                <div className="border-b border-rose-200 bg-rose-50 px-4 py-3">
                  <h2 className="text-sm font-bold text-rose-700">Pending Tasks</h2>
                </div>
                <DataTable
                  columns={pendingTaskColumns}
                  items={dashboardSummary.pendingTasks}
                  actionLabel="Review"
                  emptyMessage="No pending tasks are waiting for action."
                  getRowClassName={(record) =>
                    isPendingDashboardStatus(record.statusValue)
                      ? "border-b border-rose-100 bg-rose-50/60 transition"
                      : "border-b border-slate-200 bg-white transition"
                  }
                  renderCell={(record, column) =>
                    column.key === "status" ? (
                      <span className={`inline-flex rounded px-2 py-1 text-xs font-bold ${getDashboardStatusClassName(record.statusValue)}`}>
                        {record.status}
                      </span>
                    ) : (
                      record[column.key] ?? "--"
                    )
                  }
                  getActionLabel={(record) => record.actionLabel || "Review"}
                  onAction={(item) => {
                    if (!item?.routePath) return;
                    handleNavigate(item.routePath);
                  }}
                />
              </article>
            </section>
          ) : (
            <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <article className="rounded border border-slate-300 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900">{currentRoute.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{currentRoute.description}</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    {pageMetricCards.map(({ label, value, icon: Icon }) => (
                      <div key={label} className="rounded border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-[#a71a00]">
                          <Icon size={16} />
                          <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
                        </div>
                        <p className="mt-3 text-base font-bold text-slate-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="overflow-hidden rounded border border-slate-300 bg-white shadow-sm">
                  <div className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-100 px-4 py-3">
                    <h2 className="text-sm font-bold text-slate-800">Page Activity</h2>
                  </div>
                  {isWalletActivityRoute ? (
                    <div className="border-b border-slate-200 px-4 py-4">
                      <SharedOrderTableToolbar
                        searchValue={walletQuickSearch}
                        onSearchChange={setWalletQuickSearch}
                        onDownloadPdf={handleDownloadWalletPdf}
                        onDownloadExcel={handleDownloadWalletExcel}
                        filteredCount={displayedPageRecords.length}
                        totalCount={pageRecords.length}
                        label={isWalletTransactionsRoute ? "Search Wallet Transactions" : "Search Wallet Records"}
                        placeholder={
                          isWalletTransactionsRoute
                            ? "Search by reference, type, actor, business, amount, status, or reviewer"
                            : "Search wallet records by reference, module, status, date, or updated by"
                        }
                      />
                    </div>
                  ) : null}
                  {isWalletActivityRoute && walletManagement.errorMessage ? (
                    <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{walletManagement.errorMessage}</div>
                  ) : null}
                  {renderActivityTable(displayedPageRecords)}
                  <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                    {walletManagement.isLoading && isWalletActivityRoute
                      ? "Loading wallet records from the database..."
                      : `This is a dedicated route page for \`${currentRoute.label}\` inside the Super Admin module.`}
                  </div>
                </article>
              </div>

              <div className="space-y-6">
                <article className="overflow-hidden rounded border border-slate-300 bg-white shadow-sm">
                  <div className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-100 px-4 py-3">
                    <h2 className="text-sm font-bold text-slate-800">Related Pages</h2>
                  </div>
                  <div className="space-y-2 p-4">
                    <button
                      type="button"
                      onClick={() => handleNavigate(currentParentItem.path)}
                      className={`block w-full rounded border px-3 py-2 text-left text-sm font-semibold transition ${
                        pathname === currentParentItem.path
                          ? "border-[#a71a00] bg-[#a71a00] text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {currentParentItem.label}
                    </button>
                    {relatedRoutes.map((route) => (
                      <button
                        key={route.id}
                        type="button"
                        onClick={() => handleNavigate(route.path)}
                        className={`block w-full rounded border px-3 py-2 text-left text-sm font-semibold transition ${
                          pathname === route.path
                            ? "border-[#a71a00] bg-[#a71a00] text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {route.label}
                      </button>
                    ))}
                  </div>
                </article>

                <article className="rounded border border-slate-300 bg-white p-4 shadow-sm">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <Users size={16} className="text-[#a71a00]" />
                    Page Notes
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    <li>Top navbar buttons now redirect to separate Super Admin URLs.</li>
                    <li>Dropdown submenu items open their own page routes.</li>
                    <li>The active menu or submenu remains highlighted in red.</li>
                  </ul>
                </article>
              </div>
            </section>
          )}
        </main>
      )}

      <AssociateFooter />
    </div>
  );
}
