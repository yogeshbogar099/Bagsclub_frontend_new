import { LayoutDashboard, LogOut } from "lucide-react";
import { clearAuthSession, navigateTo } from "../../../utils/auth.js";

const moduleContent = {
  "super-admin": {
    title: "Super Admin Module",
    description: "You are logged in as Super Admin. This module controls platform-wide approvals and workflows."
  },
  admin: {
    title: "Admin Module",
    description: "You are logged in as Admin. This module handles role-based approvals assigned by Super Admin."
  },
  "associate-member": {
    title: "Associate Member Module",
    description: "You are logged in as Associate Member. This module shows your account and service access."
  }
};

export default function RoleModulePage({ session }) {
  const role = session?.user?.role || "associate-member";
  const content = moduleContent[role] || moduleContent["associate-member"];

  function handleLogout() {
    clearAuthSession();
    navigateTo("/");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-premium sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Role-Based Access</p>
            <h1 className="mt-2 flex items-center gap-3 text-3xl font-extrabold text-secondary">
              <LayoutDashboard className="text-primary" />
              {content.title}
            </h1>
            <p className="mt-3 text-sm text-slate-600">{content.description}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="mt-8 rounded-2xl bg-primary/10 p-5 text-sm text-slate-700">
          <p>
            Signed in as <span className="font-semibold text-secondary">{session.user.ownerName || session.user.businessName}</span>
          </p>
          <p className="mt-2">
            Country: <span className="font-semibold text-secondary">{session.user.country}</span>
          </p>
          <p className="mt-2">
            Mobile Number: <span className="font-semibold text-secondary">{session.user.mobileNumber}</span>
          </p>
          <p className="mt-2">
            Role: <span className="font-semibold text-secondary">{session.user.role}</span>
          </p>
          <p className="mt-2">
            Status: <span className="font-semibold text-secondary">{session.user.status || "active"}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
