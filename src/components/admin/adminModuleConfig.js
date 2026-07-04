export const ADMIN_BASE_PATH = "/dashboard/admin";
export const ADMIN_ADD_ORDER_BASE_PATH = `${ADMIN_BASE_PATH}/orders/add-order`;
export const ADMIN_ADD_MONEY_BASE_PATH = `${ADMIN_BASE_PATH}/wallet/add-money`;
export const ADMIN_ORDER_DETAILS_BASE_PATH = `${ADMIN_BASE_PATH}/orders/details`;
export const ADMIN_ASSOCIATE_MEMBER_DETAILS_BASE_PATH = `${ADMIN_BASE_PATH}/associate-members/details`;
export const ADMIN_WALLET_DETAILS_BASE_PATH = `${ADMIN_BASE_PATH}/wallet/details`;

export const adminModuleNavItems = [
  {
    id: "home",
    label: "Home",
    path: "/",
    section: "home",
    view: "landing",
    description: "Return to the website landing page."
  },
  {
    id: "dashboard",
    label: "Dashboard",
    path: ADMIN_BASE_PATH,
    section: "dashboard",
    view: "overview",
    description: "Admin dashboard overview and operational summary."
  },
  {
    id: "associate-member-management",
    label: "Associate Member",
    description: "Manage assigned members and account activity.",
    children: [
      { id: "all-associate-members", label: "All Associate Members", path: `${ADMIN_BASE_PATH}/associate-members/all`, section: "associate-members", view: "all" },
      { id: "active-members", label: "Active Members", path: `${ADMIN_BASE_PATH}/associate-members/active`, section: "associate-members", view: "active" },
      { id: "inactive-members", label: "Inactive Members", path: `${ADMIN_BASE_PATH}/associate-members/inactive`, section: "associate-members", view: "inactive" },
      { id: "assigned-members", label: "Assigned Members", path: `${ADMIN_BASE_PATH}/associate-members/assigned`, section: "associate-members", view: "assigned" }
    ]
  },
  {
    id: "order-management",
    label: "Order",
    description: "Track orders across all status buckets.",
    children: [
      { id: "add-order", label: "Add Order", path: ADMIN_ADD_ORDER_BASE_PATH, section: "orders", view: "add-order" },
      { id: "all-orders", label: "All Orders", path: `${ADMIN_BASE_PATH}/orders/all`, section: "orders", view: "all" },
      { id: "new-orders", label: "New Orders", path: `${ADMIN_BASE_PATH}/orders/new`, section: "orders", view: "new" },
      { id: "pending-orders", label: "Pending Orders", path: `${ADMIN_BASE_PATH}/orders/pending`, section: "orders", view: "pending" },
      { id: "printing-orders", label: "Printing Orders", path: `${ADMIN_BASE_PATH}/orders/printing`, section: "orders", view: "printing" },
      { id: "packaging-orders", label: "Packaging Orders", path: `${ADMIN_BASE_PATH}/orders/packaging`, section: "orders", view: "packaging" },
      { id: "dispatch-orders", label: "Dispatch Orders", path: `${ADMIN_BASE_PATH}/orders/dispatch`, section: "orders", view: "dispatch" },
      { id: "completed-orders", label: "Completed Orders", path: `${ADMIN_BASE_PATH}/orders/completed`, section: "orders", view: "completed" },
      { id: "improper-orders", label: "Improper Orders", path: `${ADMIN_BASE_PATH}/orders/improper`, section: "orders", view: "improper" },
      { id: "cancelled-orders", label: "Cancelled Orders", path: `${ADMIN_BASE_PATH}/orders/cancelled`, section: "orders", view: "cancelled" },
      { id: "rejected-orders", label: "Rejected Orders", path: `${ADMIN_BASE_PATH}/orders/rejected`, section: "orders", view: "rejected" }
    ]
  },
  {
    id: "wallet-management",
    label: "Wallet",
    description: "Wallet transactions and top-up requests.",
    children: [
      { id: "add-money", label: "Add Money", path: ADMIN_ADD_MONEY_BASE_PATH, section: "wallet", view: "add-money" },
      { id: "wallet-transactions", label: "Wallet Transactions", path: `${ADMIN_BASE_PATH}/wallet/transactions`, section: "wallet", view: "transactions" },
      { id: "top-up-requests", label: "Top-Up Requests", path: `${ADMIN_BASE_PATH}/wallet/top-up-requests`, section: "wallet", view: "pending" },
      { id: "approved-requests", label: "Approved Requests", path: `${ADMIN_BASE_PATH}/wallet/approved-requests`, section: "wallet", view: "approved" },
      { id: "rejected-requests", label: "Rejected Requests", path: `${ADMIN_BASE_PATH}/wallet/rejected-requests`, section: "wallet", view: "rejected" }
    ]
  },
  { id: "reports", label: "Reports", path: `${ADMIN_BASE_PATH}/reports`, section: "reports", view: "summary", description: "Export-ready reports." },
  { id: "activity-logs", label: "Activity Logs", path: `${ADMIN_BASE_PATH}/activity-logs`, section: "activity-logs", view: "all", description: "Operational audit trail." },
  { id: "notifications", label: "Notifications", path: `${ADMIN_BASE_PATH}/notifications`, section: "notifications", view: "all", description: "Recent admin alerts." },
  { id: "profile", label: "Profile", path: `${ADMIN_BASE_PATH}/profile`, section: "profile", view: "overview", description: "Profile and account settings." }
];

export function flattenAdminRoutes(items = adminModuleNavItems) {
  return items.flatMap((item) => {
    if (item.children) {
      return item.children.map((child) => ({
        ...child,
        parentId: item.id,
        parentLabel: item.label,
        parentDescription: item.description
      }));
    }

    return {
      ...item,
      parentId: item.id,
      parentLabel: item.label,
      parentDescription: item.description
    };
  });
}

export const adminModuleRoutes = flattenAdminRoutes();

export function findAdminRoute(pathname) {
  if (pathname.startsWith(`${ADMIN_WALLET_DETAILS_BASE_PATH}/`)) {
    return {
      id: "wallet-details",
      label: "Wallet Details",
      path: pathname,
      section: "wallet",
      view: "details",
      parentId: "wallet-management",
      parentLabel: "Wallet",
      parentDescription: "Wallet transactions and top-up requests."
    };
  }

  if (pathname.startsWith(`${ADMIN_ASSOCIATE_MEMBER_DETAILS_BASE_PATH}/`)) {
    return {
      id: "associate-member-details",
      label: "User Details",
      path: pathname,
      section: "associate-members",
      view: "details",
      parentId: "associate-member-management",
      parentLabel: "Associate Member",
      parentDescription: "Manage assigned members and account activity."
    };
  }

  if (pathname.startsWith(`${ADMIN_ORDER_DETAILS_BASE_PATH}/`)) {
    return {
      id: "order-details",
      label: "Order Details",
      path: pathname,
      section: "orders",
      view: "details",
      parentId: "order-management",
      parentLabel: "Order Management",
      parentDescription: "Track orders across all status buckets."
    };
  }

  if (pathname === `${ADMIN_ADD_ORDER_BASE_PATH}/non-woven-bag`) {
    return {
      id: "add-order-non-woven-bag",
      label: "Add Order",
      path: pathname,
      section: "orders",
      view: "add-order-non-woven-bag",
      parentId: "order-management",
      parentLabel: "Order Management",
      parentDescription: "Track orders across all status buckets."
    };
  }

  if (pathname.startsWith(`${ADMIN_ADD_ORDER_BASE_PATH}/non-woven-bag/`)) {
    return {
      id: "add-order-non-woven-bag-form",
      label: "Add Order",
      path: pathname,
      section: "orders",
      view: "add-order-non-woven-bag-form",
      parentId: "order-management",
      parentLabel: "Order Management",
      parentDescription: "Track orders across all status buckets."
    };
  }

  if (pathname === `${ADMIN_ADD_MONEY_BASE_PATH}/manual`) {
    return {
      id: "add-money-manual",
      label: "Add Money",
      path: pathname,
      section: "wallet",
      view: "add-money-manual",
      parentId: "wallet-management",
      parentLabel: "Wallet Management",
      parentDescription: "Wallet transactions and top-up requests."
    };
  }

  if (pathname === `${ADMIN_ADD_MONEY_BASE_PATH}/manual/auto`) {
    return {
      id: "add-money-auto",
      label: "Add Money",
      path: pathname,
      section: "wallet",
      view: "add-money-auto",
      parentId: "wallet-management",
      parentLabel: "Wallet Management",
      parentDescription: "Wallet transactions and top-up requests."
    };
  }

  return adminModuleRoutes.find((route) => route.path === pathname) || {
    id: "dashboard",
    label: "Dashboard",
    path: ADMIN_BASE_PATH,
    section: "dashboard",
    view: "overview",
    parentId: "dashboard",
    parentLabel: "Dashboard",
    parentDescription: "Admin dashboard overview and operational summary."
  };
}
