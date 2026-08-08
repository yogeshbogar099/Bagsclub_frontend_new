export const ASSOCIATE_BASE_PATH = "/dashboard/associate-member";

export const associateModuleNavItems = [
  {
    id: "home",
    label: "Home",
    path: ASSOCIATE_BASE_PATH,
    section: "dashboard",
    view: "overview",
    description: "Associate member home and product selection overview."
  },
  {
    id: "add-money",
    label: "Add Money",
    path: `${ASSOCIATE_BASE_PATH}/wallet`,
    section: "wallet",
    view: "summary",
    description: "Topup your wallet."
  },
  {
    id: "add-order",
    label: "Add Order",
    path: `${ASSOCIATE_BASE_PATH}/book-order`,
    section: "book-order",
    view: "new",
    description: "Add order and categorywise product selection."
  },
  {
    id: "order-status",
    label: "Order Status",
    description: "Search orders by number, stage, and order date.",
    children: [
      { id: "search-order-number", label: "Search by Order Number", path: `${ASSOCIATE_BASE_PATH}/orders/search/order-number`, section: "order-search", view: "order-number" },
      { id: "search-order-stage", label: "Search by Order Stage", path: `${ASSOCIATE_BASE_PATH}/orders/search/order-stage`, section: "order-search", view: "order-stage" },
      { id: "search-order-date", label: "Search by Order Date", path: `${ASSOCIATE_BASE_PATH}/orders/search/order-date`, section: "order-search", view: "order-date" }
    ]
  },
  {
    id: "reports",
    label: "Reports",
    description: "Account, notes, invoice, and orderwise reports.",
    children: [
      { id: "orderwise-monthly-summary", label: "Orderwise - Monthly Summary", path: `${ASSOCIATE_BASE_PATH}/reports/orderwise-monthly-summary`, section: "reports", view: "orderwise-monthly-summary" },
      { id: "notes-report", label: "Notes Report", path: `${ASSOCIATE_BASE_PATH}/reports/notes-report`, section: "reports", view: "notes-report" },
      { id: "account-transactions-report", label: "Account Transactions Report", path: `${ASSOCIATE_BASE_PATH}/reports/account-transactions`, section: "wallet", view: "summary" },
      { id: "invoice-report", label: "Invoice Report", path: `${ASSOCIATE_BASE_PATH}/reports/invoice-report`, section: "reports", view: "invoice-report" }
    ]
  },
  {
    id: "support",
    label: "Support",
    description: "Help and system support updates.",
    children: [
      { id: "support-notifications", label: "Notifications", path: `${ASSOCIATE_BASE_PATH}/support/notifications`, section: "notifications", view: "all" },
      { id: "support-help", label: "Help Desk", path: `${ASSOCIATE_BASE_PATH}/support/help`, section: "support", view: "help" },
      { id: "support-terms", label: "Terms & Conditions", path: `${ASSOCIATE_BASE_PATH}/support/terms`, section: "support", view: "terms" }
    ]
  },
  {
    id: "setting",
    label: "Setting / Setup",
    description: "Profile, password, and account configuration.",
    children: [
      { id: "setting-profile", label: "Profile", path: `${ASSOCIATE_BASE_PATH}/settings/profile`, section: "profile", view: "overview" },
      { id: "setting-change-password", label: "Change Password", path: `${ASSOCIATE_BASE_PATH}/settings/change-password`, section: "settings", view: "change-password" }
    ]
  },
  {
    id: "training-videos",
    label: "Instruction & Training Videos",
    path: `${ASSOCIATE_BASE_PATH}/training-videos`,
    section: "training",
    view: "videos",
    description: "Step-by-step instruction and training video guides."
  }
];

export function flattenAssociateRoutes(items = associateModuleNavItems) {
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

export const associateModuleRoutes = flattenAssociateRoutes();

export function findAssociateRoute(pathname) {
  return associateModuleRoutes.find((route) => route.path === pathname) || {
    id: "dashboard",
    label: "Dashboard",
    path: ASSOCIATE_BASE_PATH,
    section: "dashboard",
    view: "overview",
    parentId: "dashboard",
    parentLabel: "Dashboard",
    parentDescription: "Associate member overview dashboard."
  };
}
