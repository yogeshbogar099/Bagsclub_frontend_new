import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  Copy,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Package,
  Settings,
  UserCircle2,
  Wallet
} from "lucide-react";
import { useAssociateModule } from "../../../context/AssociateModuleContext.jsx";
import { findAssociateRoute } from "../../associate/associateModuleConfig.js";
import OrderCarousel from "../../associate/OrderCarousel.jsx";
import categoryPlaceholder from "../../../assets/images/bg_02.jpg";
import {
  getTableBodyRowClassName,
  tableBodyCellClassName,
  tableCardClassName,
  tableElementClassName,
  tableEmptyCellClassName,
  tableHeaderCellClassName,
  tableHeaderRowClassName,
  tableShellClassName
} from "../../shared-table/tableStyles.js";

const iconLookup = {
  dashboard: LayoutDashboard,
  "book-order": ClipboardList,
  "my-orders": Package,
  wallet: Wallet,
  notifications: Bell,
  profile: UserCircle2,
  reports: FileText,
  settings: Settings,
  support: HelpCircle
};

const initialOrderForm = {
  orderName: "BILL BOOKS",
  customerName: "",
  customerMobile: "",
  orderDetailsOverview: "",
  designSubmissionSource: "online-upload",
  designFileName: "",
  designFileUrl: "",
  referenceNo: "",
  isUrgent: false
};

const initialTopUpForm = {
  amount: "",
  remarks: ""
};

const productCategories = [
  "BILL BOOKS",
  "STICKERS & LABELS",
  "LETTER HEADS",
  "ENVELOPES",
  "DIGITAL PAPER PRINTING",
  "ATM POUCHES",
  "PAMPHLET / POSTERS",
  "GARMENTS TAGS",
  "FILES"
];

function DashboardCards({ cards = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = iconLookup[card.iconKey] || LayoutDashboard;

        return (
          <article key={card.title} className="rounded border border-slate-300 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.title}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
              </div>
              <div className="rounded-full bg-[#a71a00]/10 p-3 text-[#a71a00]">
                <Icon size={22} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">{card.note}</p>
          </article>
        );
      })}
    </div>
  );
}

function DataTable({ columns = [], items = [] }) {
  if (!items.length) {
    return (
      <div className={tableCardClassName}>
        <div className="px-4 py-8 text-center text-sm text-slate-500">
        No records available for this section yet.
        </div>
      </div>
    );
  }

  return (
    <div className={tableCardClassName}>
      <div className={tableShellClassName}>
      <table className={`${tableElementClassName} min-w-full`}>
        <thead>
          <tr className={tableHeaderRowClassName}>
            {columns.map((column) => (
              <th key={column.key} className={tableHeaderCellClassName}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id || `${item.title || "row"}-${index}`} className={getTableBodyRowClassName(index)}>
              {columns.map((column) => (
                <td key={column.key} className={`${tableBodyCellClassName} whitespace-nowrap`}>
                  {item[column.key] ?? "--"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

function CategoryGrid({ selectedCategory, onSelect }) {
  return (
    <section className="rounded border border-slate-300 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h2 className="text-sm font-bold text-slate-800">Add Order Product Selection</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 xl:grid-cols-5">
        {productCategories.map((category) => {
          const isActive = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className={`group rounded border bg-white p-3 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                isActive ? "border-[#a71a00] ring-2 ring-[#a71a00]/20" : "border-slate-200"
              }`}
            >
              <img
                src={categoryPlaceholder}
                alt={category}
                className="mx-auto h-24 w-full rounded object-cover md:h-28"
              />
              <div className="horizontal-align-center mt-3">
                <b className="text-[15px] font-bold text-[#305CA7]">{category}</b>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function EmailMessageBox() {
  async function handleCopy() {
    const emailText = "direct@printersclub.in";

    try {
      await navigator.clipboard.writeText(emailText);
    } catch (_error) {
      const tempInput = document.createElement("input");
      tempInput.value = emailText;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      tempInput.remove();
    }
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-slate-700">
      <div className="font-semibold text-amber-700">Please send your design file via email</div>
      <div className="mt-2">
        Send to: <span className="font-bold text-slate-900">direct@printersclub.in</span>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-3 inline-flex items-center gap-2 rounded bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
      >
        <Copy size={14} />
        Copy Email
      </button>
      <div className="mt-3 text-xs leading-5 text-slate-600">
        <strong>Important:</strong> Please mention your order number in the email subject line.
      </div>
    </div>
  );
}

function SuccessModal({ isOpen, title, message, showEmailBox, onBookSame, onBookDifferent, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="relative bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-5 text-center text-white">
          <button type="button" onClick={onClose} className="absolute right-4 top-3 text-2xl font-bold text-white/80 hover:text-white">
            ×
          </button>
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <CheckCircle2 size={34} />
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <div className="px-6 py-8 text-center">
          <p className="text-sm leading-6 text-slate-600">{message}</p>
          {showEmailBox ? <div className="mt-5 text-left"><EmailMessageBox /></div> : null}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onBookSame}
              className="flex items-center justify-between rounded-xl bg-[#a71a00] px-4 py-3 text-left text-white transition hover:bg-[#8f1700]"
            >
              <span>
                <span className="block text-xs opacity-85">Book Another</span>
                <span className="block text-sm font-semibold">Same Category</span>
              </span>
              <span className="text-lg">→</span>
            </button>
            <button
              type="button"
              onClick={onBookDifferent}
              className="flex items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50"
            >
              <span>
                <span className="block text-xs opacity-80">Book Another</span>
                <span className="block text-sm font-semibold">Different Category</span>
              </span>
              <span className="text-lg">→</span>
            </button>
          </div>
          <button type="button" onClick={onClose} className="mt-5 text-sm font-semibold text-[#305CA7] hover:text-[#a71a00]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function AssociateMemberScreen() {
  const {
    bootstrap,
    sectionData,
    loading,
    sectionLoading,
    submitting,
    error,
    loadBootstrap,
    loadSection,
    submitOrder,
    submitTopUp,
    updateProfile
  } = useAssociateModule();
  const location = useLocation();
  const pathname = location.pathname;
  const currentRoute = useMemo(() => findAssociateRoute(pathname), [pathname]);
  const [orderForm, setOrderForm] = useState(initialOrderForm);
  const [topUpForm, setTopUpForm] = useState(initialTopUpForm);
  const [profileForm, setProfileForm] = useState({
    ownerName: "",
    businessName: "",
    email: "",
    mobile: "",
    country: "",
    state: "",
    district: "",
    city: "",
    pinCode: "",
    address: ""
  });
  const [modalState, setModalState] = useState({ isOpen: false, title: "", message: "", showEmailBox: false });
  const [selectedCategory, setSelectedCategory] = useState(productCategories[0]);

  useEffect(() => {
    loadBootstrap();
  }, [loadBootstrap]);

  useEffect(() => {
    loadSection(currentRoute.section || "dashboard", currentRoute.view || "overview");
  }, [currentRoute.section, currentRoute.view, loadSection]);

  useEffect(() => {
    if (currentRoute.section !== "my-orders") return;

    const refresh = () => loadSection("my-orders", currentRoute.view || "all");
    refresh();

    const timer = window.setInterval(refresh, 10000);
    window.addEventListener("focus", refresh);
    window.addEventListener("orderstatuschange", refresh);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("orderstatuschange", refresh);
    };
  }, [currentRoute.section, currentRoute.view, loadSection]);

  useEffect(() => {
    const refreshCurrentSection = () => {
      loadSection(currentRoute.section || "dashboard", currentRoute.view || "overview");
    };

    const events = [
      "focus",
      "dashboardstatschange",
      "orderchange",
      "orderstatuschange",
      "walletchange",
      "adminchange",
      "associatememberchange"
    ];

    events.forEach((eventName) => window.addEventListener(eventName, refreshCurrentSection));

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, refreshCurrentSection));
    };
  }, [currentRoute.section, currentRoute.view, loadSection]);

  useEffect(() => {
    if (bootstrap?.profileDefaults) {
      setProfileForm(bootstrap.profileDefaults);
    }
  }, [bootstrap]);

  function openModal(title, message) {
    setModalState({
      isOpen: true,
      title,
      message,
      showEmailBox: orderForm.designSubmissionSource === "email"
    });
  }

  async function handleOrderSubmit(event) {
    event.preventDefault();
    try {
      const response = await submitOrder(orderForm);
      setOrderForm(initialOrderForm);
      openModal("Order Booked Successfully", response.message || "Your order has been created successfully.");
      await loadBootstrap();
      window.dispatchEvent(new Event("orderchange"));
      window.dispatchEvent(new Event("dashboardstatschange"));
    } catch (_error) {
      // Context already exposes the error banner; keep the page state intact.
    }
  }

  async function handleTopUpSubmit(event) {
    event.preventDefault();
    try {
      const response = await submitTopUp(topUpForm);
      setTopUpForm(initialTopUpForm);
      openModal("Top-Up Request Submitted", response.message || "Your wallet top-up request has been submitted.");
      await loadBootstrap();
      await loadSection("wallet", "summary");
      window.dispatchEvent(new Event("walletchange"));
      window.dispatchEvent(new Event("dashboardstatschange"));
    } catch (_error) {
      // Context already exposes the error banner; keep the page state intact.
    }
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    try {
      const response = await updateProfile(profileForm);
      openModal("Profile Updated", response.message || "Your profile has been updated.");
      await loadBootstrap();
      await loadSection("profile", "overview");
      window.dispatchEvent(new Event("associatememberchange"));
      window.dispatchEvent(new Event("dashboardstatschange"));
    } catch (_error) {
      // Context already exposes the error banner; keep the page state intact.
    }
  }

  const pageTitle = currentRoute.label;
  const pageDescription = currentRoute.parentDescription || currentRoute.description || "Associate member module section";
  const columns = sectionData?.meta?.columns || [];
  const items = sectionData?.items || [];
  const cards = bootstrap?.dashboardCards || [];

  function renderDashboard() {
    return (
      <div className="space-y-6">
        <OrderCarousel />
        <DashboardCards cards={cards} />
        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelect={(category) => {
            setSelectedCategory(category);
            setOrderForm((current) => ({ ...current, orderName: category }));
          }}
        />

        <section className="rounded border border-slate-300 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h2 className="text-sm font-bold text-slate-800">Services & Workflows</h2>
          </div>
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {(bootstrap?.serviceCards || []).map((card) => (
              <article key={card.title} className="rounded border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-bold text-slate-900">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{card.description}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#a71a00]">{card.meta}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded border border-slate-300 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h2 className="text-sm font-bold text-slate-800">Recent Orders</h2>
          </div>
          <div className="p-4">
            <DataTable columns={bootstrap?.recentOrderColumns || []} items={bootstrap?.recentOrders || []} />
          </div>
        </section>
      </div>
    );
  }

  function renderOrderForm() {
    return (
      <div className="space-y-6">
        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelect={(category) => {
            setSelectedCategory(category);
            setOrderForm((current) => ({ ...current, orderName: category }));
          }}
        />

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded border border-slate-300 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h2 className="text-sm font-bold text-slate-800">Place Order for Selected Category</h2>
          </div>
          <form onSubmit={handleOrderSubmit} className="space-y-4 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="field-label">Order Name</label>
                <input
                  className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm"
                  value={orderForm.orderName}
                  onChange={(event) => setOrderForm((current) => ({ ...current, orderName: event.target.value }))}
                  placeholder="e.g. BILL BOOKS"
                />
              </div>
              <div>
                <label className="field-label">Reference No.</label>
                <input
                  className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm"
                  value={orderForm.referenceNo}
                  onChange={(event) => setOrderForm((current) => ({ ...current, referenceNo: event.target.value }))}
                  placeholder="Optional internal reference"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="field-label">Customer Name</label>
                <input
                  className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm"
                  value={orderForm.customerName}
                  onChange={(event) => setOrderForm((current) => ({ ...current, customerName: event.target.value }))}
                />
              </div>
              <div>
                <label className="field-label">Customer Mobile</label>
                <input
                  className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm"
                  value={orderForm.customerMobile}
                  onChange={(event) => setOrderForm((current) => ({ ...current, customerMobile: event.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="field-label">Order Details Overview</label>
              <textarea
                className="min-h-32 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={orderForm.orderDetailsOverview}
                onChange={(event) => setOrderForm((current) => ({ ...current, orderDetailsOverview: event.target.value }))}
                placeholder="Describe size, quantity, material, finishing, and delivery notes."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="field-label">Design Submission Source</label>
                <select
                  className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm"
                  value={orderForm.designSubmissionSource}
                  onChange={(event) => setOrderForm((current) => ({ ...current, designSubmissionSource: event.target.value }))}
                >
                  <option value="online-upload">Online Upload</option>
                  <option value="email">Send Design via Email</option>
                </select>
              </div>
              <div>
                <label className="field-label">Design File Name</label>
                <input
                  className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm"
                  value={orderForm.designFileName}
                  onChange={(event) => setOrderForm((current) => ({ ...current, designFileName: event.target.value }))}
                  placeholder="e.g. bag-artwork.pdf"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Design File URL</label>
              <input
                className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm"
                value={orderForm.designFileUrl}
                onChange={(event) => setOrderForm((current) => ({ ...current, designFileUrl: event.target.value }))}
                placeholder="https://example.com/design.pdf"
              />
            </div>

            {orderForm.designSubmissionSource === "email" ? <EmailMessageBox /> : null}

            <label className="inline-flex items-center gap-3 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={orderForm.isUrgent}
                onChange={(event) => setOrderForm((current) => ({ ...current, isUrgent: event.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              Mark this order as urgent
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-[#a71a00] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8f1700] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Booking Order..." : "Book Order"}
            </button>
          </form>
          </section>

          <section className="space-y-6">
            <section className="rounded border border-slate-300 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <h2 className="text-sm font-bold text-slate-800">Interested Services</h2>
              </div>
              <div className="grid gap-4 p-4">
                {(bootstrap?.serviceCards || []).map((card) => (
                  <div key={card.title} className="rounded border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-bold text-slate-900">{card.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{card.description}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded border border-slate-300 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <h2 className="text-sm font-bold text-slate-800">Support</h2>
              </div>
              <div className="space-y-3 p-4 text-sm text-slate-600">
                <p>For design or order support, reach out to the direct production team.</p>
                <EmailMessageBox />
              </div>
            </section>
          </section>
        </div>
      </div>
    );
  }

  function renderWallet() {
    return (
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <section className="rounded border border-slate-300 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h2 className="text-sm font-bold text-slate-800">Top-Up Wallet</h2>
          </div>
          <form onSubmit={handleTopUpSubmit} className="space-y-4 p-4">
            <div className="rounded border border-l-4 border-l-[#a71a00] bg-[#fff7f5] px-4 py-3 text-sm text-slate-700">
              Wallet balance and request history are synchronized with the backend API.
            </div>
            <div>
              <label className="field-label">Top-Up Amount</label>
              <input
                type="number"
                min="1"
                step="0.01"
                className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm"
                value={topUpForm.amount}
                onChange={(event) => setTopUpForm((current) => ({ ...current, amount: event.target.value }))}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="field-label">Remarks</label>
              <textarea
                className="min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={topUpForm.remarks}
                onChange={(event) => setTopUpForm((current) => ({ ...current, remarks: event.target.value }))}
                placeholder="Optional payment note"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-[#a71a00] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8f1700] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Submitting..." : "Submit Top-Up Request"}
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {Object.entries(sectionData?.summary || {}).map(([key, value]) => (
              <div key={key} className="rounded border border-slate-300 bg-white px-4 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{key.replace(/([A-Z])/g, " $1")}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{String(value)}</p>
              </div>
            ))}
          </div>
          <DataTable columns={columns} items={items} />
        </section>
      </div>
    );
  }

  function renderProfile() {
    return (
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded border border-slate-300 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h2 className="text-sm font-bold text-slate-800">Profile Details</h2>
          </div>
          <form onSubmit={handleProfileSubmit} className="space-y-4 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="field-label">Your Name</label>
                <input className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm" value={profileForm.ownerName} onChange={(event) => setProfileForm((current) => ({ ...current, ownerName: event.target.value }))} />
              </div>
              <div>
                <label className="field-label">Business / Firm Name</label>
                <input className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm" value={profileForm.businessName} onChange={(event) => setProfileForm((current) => ({ ...current, businessName: event.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="field-label">Email Address</label>
                <input className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm" value={profileForm.email} onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))} />
              </div>
              <div>
                <label className="field-label">WhatsApp Number</label>
                <input className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm" value={profileForm.mobile} onChange={(event) => setProfileForm((current) => ({ ...current, mobile: event.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="field-label">Country</label>
                <input className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm" value={profileForm.country} onChange={(event) => setProfileForm((current) => ({ ...current, country: event.target.value }))} />
              </div>
              <div>
                <label className="field-label">State</label>
                <input className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm" value={profileForm.state} onChange={(event) => setProfileForm((current) => ({ ...current, state: event.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="field-label">District</label>
                <input className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm" value={profileForm.district} onChange={(event) => setProfileForm((current) => ({ ...current, district: event.target.value }))} />
              </div>
              <div>
                <label className="field-label">City</label>
                <input className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm" value={profileForm.city} onChange={(event) => setProfileForm((current) => ({ ...current, city: event.target.value }))} />
              </div>
              <div>
                <label className="field-label">PIN Code</label>
                <input className="form-field !h-11 !rounded-md !border !border-slate-300 !bg-white !px-3 !text-sm" value={profileForm.pinCode} onChange={(event) => setProfileForm((current) => ({ ...current, pinCode: event.target.value }))} />
              </div>
            </div>
            <div>
              <label className="field-label">Full Address</label>
              <textarea
                className="min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={profileForm.address}
                onChange={(event) => setProfileForm((current) => ({ ...current, address: event.target.value }))}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-[#a71a00] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8f1700] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </section>

        <section className="rounded border border-slate-300 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h2 className="text-sm font-bold text-slate-800">Profile Summary</h2>
          </div>
          <div className="p-4">
            <DataTable columns={columns} items={items} />
          </div>
        </section>
      </div>
    );
  }

  function renderSection() {
    if (currentRoute.section === "dashboard") return renderDashboard();
    if (currentRoute.section === "book-order") return renderOrderForm();
    if (currentRoute.section === "wallet") return renderWallet();
    if (currentRoute.section === "profile") return renderProfile();

    return (
      <div className="space-y-6">
        <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="rounded border border-slate-300 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h2 className="text-sm font-bold text-slate-800">Section Summary</h2>
            </div>
            <div className="space-y-3 p-4 text-sm text-slate-600">
              {Object.entries(sectionData?.summary || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="font-semibold text-slate-900">{String(value)}</span>
                </div>
              ))}
              {!Object.keys(sectionData?.summary || {}).length ? <p>No summary metrics available.</p> : null}
            </div>
          </aside>

          <section className="space-y-4">
            {sectionLoading ? (
              <div className="rounded border border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm">
                Loading section data...
              </div>
            ) : (
              <DataTable columns={columns} items={items} />
            )}
          </section>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-300 border-l-4 border-l-[#a71a00] bg-white px-4 py-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
            <p className="mt-1 text-xs text-slate-500">{pageDescription}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-600">
            <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
              Role: <span className="font-semibold text-slate-900">Associate Member</span>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
              Records: <span className="font-semibold text-slate-900">{sectionData?.summary?.total ?? items.length}</span>
            </div>
          </div>
        </div>
      </section>

      {error ? <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      {loading && !bootstrap ? (
        <div className="rounded border border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm">
          Loading associate member module...
        </div>
      ) : null}

      {renderSection()}

      <SuccessModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        showEmailBox={modalState.showEmailBox}
        onBookSame={() => setModalState((current) => ({ ...current, isOpen: false }))}
        onBookDifferent={() => {
          setSelectedCategory(productCategories[0]);
          setOrderForm(() => ({ ...initialOrderForm, orderName: productCategories[0] }));
          setModalState({ isOpen: false, title: "", message: "", showEmailBox: false });
        }}
        onClose={() => setModalState({ isOpen: false, title: "", message: "", showEmailBox: false })}
      />
    </div>
  );
}

export default function AssociateMemberPage() {
  return <AssociateMemberScreen />;
}
