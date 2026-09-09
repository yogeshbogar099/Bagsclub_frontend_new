import { useEffect, useMemo } from "react";
import { useAssociateModule } from "../../context/AssociateModuleContext.jsx";

function formatDateTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatDate(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function buildProfileRows(profile) {
  return [
    { label: "Business Name", value: profile?.businessName || "--" },
    { label: "Registered Mobile No.", value: profile?.mobile || "--" },
    { label: "Country", value: profile?.country || "--" },
    { label: "State", value: profile?.state || "--" },
    { label: "City", value: profile?.city || "--" },
    { label: "GST Number", value: profile?.gstNumber || "--" },
    { label: "District", value: profile?.district || "--" },
    { label: "Contact Person", value: profile?.ownerName || "--", inputLike: true },
    { label: "E-mail", value: profile?.email || "--", inputLike: true },
    { label: "PIN Code", value: profile?.pinCode || "--" },
    { label: "Address", value: profile?.address || "--" },
    { label: "Reference Code", value: profile?.referenceCode || "--" },
    { label: "Registration Date", value: formatDate(profile?.registrationDate) },
    { label: "Account Status", value: profile?.accountStatus || "--" },
    { label: "Associate Access", value: profile?.associateMemberAccess || "--" },
    { label: "Wallet Balance", value: profile?.walletBalance ? `₹ ${profile.walletBalance}` : "--" },
    { label: "Assigned Admin", value: profile?.assignedAdminBusinessName || profile?.assignedAdminName || "--" },
    { label: "Assigned Admin Mobile", value: profile?.assignedAdminMobile || "--" },
    { label: "Last Login", value: formatDateTime(profile?.lastLoginAt) },
    { label: "Last Activity", value: formatDateTime(profile?.lastActivityAt) }
  ];
}

export default function AssociateMyProfilePage() {
  const { bootstrap, loading, loadBootstrap } = useAssociateModule();

  useEffect(() => {
    if (!bootstrap?.profile) {
      loadBootstrap();
    }
  }, [bootstrap?.profile, loadBootstrap]);

  const profile = bootstrap?.profile || {};
  const profileRows = useMemo(() => buildProfileRows(profile), [profile]);

  return (
    <div className="mx-auto max-w-5xl">
      <section className="rounded-[18px] border border-[#d6d9df] bg-white px-3 py-4 shadow-sm sm:px-5 sm:py-6">
        <div className="mb-3 text-center">
          <h1 className="text-[24px] font-black uppercase tracking-[0.06em] text-[#305CA7] sm:text-[30px]">
            Modify Your Information
          </h1>
          <p className="mt-2 text-sm text-slate-500">All profile fields are shown in read-only mode as per your registered account details.</p>
        </div>

        {loading && !bootstrap ? (
          <div className="rounded-[10px] border border-dashed border-[#cfd8e6] bg-[#f8fafc] px-4 py-10 text-center text-sm text-slate-500">
            Loading profile information...
          </div>
        ) : (
          <div className="overflow-hidden border border-[#d7d7d7]">
            {profileRows.map((row, index) => (
              <div
                key={row.label}
                className={`grid grid-cols-1 md:grid-cols-[38%_62%] ${index !== profileRows.length - 1 ? "border-b border-[#d7d7d7]" : ""}`}
              >
                <div className="border-b border-[#d7d7d7] bg-[#fbfbfb] px-3 py-3 text-[15px] font-medium text-[#2f2f2f] md:border-b-0 md:border-r md:px-4">
                  {row.label}
                </div>
                <div className="bg-white px-3 py-2.5 md:px-4">
                  <div
                    className={`min-h-[42px] w-full text-[15px] leading-7 text-[#303030] ${row.inputLike
                        ? "rounded-[4px] border border-[#d4d4d4] bg-[#fcfcfc] px-3 py-2"
                        : "py-1"
                      }`}
                  >
                    {row.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <div className="w-full rounded-[6px] bg-[#28a745] px-4 py-4 text-center text-[15px] font-black uppercase tracking-[0.08em] text-white shadow-[0_4px_10px_rgba(37,99,235,0.2)]">
            Read Only Profile Details
          </div>
        </div>
      </section>
    </div>
  );
}
