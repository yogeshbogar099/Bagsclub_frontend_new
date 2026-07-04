import { useMemo, useState } from "react";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAssociateModule } from "../../context/AssociateModuleContext.jsx";

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
};

export default function AssociateChangePasswordPage() {
  const navigate = useNavigate();
  const { changePassword, submitting } = useAssociateModule();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const validationMessage = useMemo(() => {
    if (!form.newPassword) return "";
    if (form.newPassword.length < 8) return "Password must be at least 8 characters long.";
    return "";
  }, [form.newPassword]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setStatusMessage({ type: "", text: "" });
  }

  function togglePassword(field) {
    setShowPassword((current) => ({ ...current, [field]: !current[field] }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setStatusMessage({ type: "error", text: "Please complete all password fields." });
      return;
    }

    if (form.newPassword.length < 8) {
      setStatusMessage({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setStatusMessage({ type: "error", text: "New password and confirm new password do not match." });
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setStatusMessage({ type: "error", text: "New password must be different from the current password." });
      return;
    }

    try {
      const response = await changePassword(form);
      setStatusMessage({ type: "success", text: response?.message || "Password updated successfully." });
      setForm(initialForm);
    } catch (error) {
      setStatusMessage({ type: "error", text: error?.message || "Failed to update password." });
    }
  }

  function PasswordField({ label, name, placeholder }) {
    const isVisible = showPassword[name];

    return (
      <div className="grid grid-cols-1 border-b border-[#d7d7d7] md:grid-cols-[39%_61%]">
        <div className="border-b border-[#d7d7d7] bg-[#fbfbfb] px-3 py-4 text-[15px] font-medium text-[#2f2f2f] md:border-b-0 md:border-r md:px-4">
          {label}
        </div>
        <div className="bg-white px-3 py-3 md:px-4">
          <div className="relative">
            <input
              type={isVisible ? "text" : "password"}
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="h-[50px] w-full rounded-[6px] border border-[#d4d4d4] bg-[#fcfcfc] px-4 pr-12 text-[15px] text-[#303030] outline-none transition focus:border-[#305CA7] focus:ring-2 focus:ring-[#305CA7]/15"
            />
            <button
              type="button"
              onClick={() => togglePassword(name)}
              className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-slate-500 transition hover:text-[#305CA7]"
              aria-label={isVisible ? `Hide ${label}` : `Show ${label}`}
            >
              {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <section className="rounded-[18px] border border-[#d6d9df] bg-white px-3 py-4 shadow-sm sm:px-5 sm:py-6">
        <div className="mb-4 text-center">
          <h1 className="text-[24px] font-black uppercase tracking-[0.06em] text-[#305CA7] sm:text-[38px]">
            Change Your Password
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="overflow-hidden border border-[#d7d7d7]">
          <PasswordField label="Current Password" name="currentPassword" placeholder="Enter current password" />

          <div className="border-b border-[#d7d7d7] bg-white px-3 py-3 text-sm text-[#ff4d1f] md:px-4">
            {validationMessage || "Password must be at least 8 characters long."}
          </div>

          <PasswordField label="New Password" name="newPassword" placeholder="Enter new password" />
          <PasswordField label="Confirm New Password" name="confirmPassword" placeholder="Confirm new password" />

          {statusMessage.text ? (
            <div
              className={`border-b border-[#d7d7d7] px-4 py-3 text-sm ${
                statusMessage.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
              }`}
            >
              {statusMessage.text}
            </div>
          ) : null}

          <div className="grid gap-4 bg-[#fafafa] px-3 py-3 md:grid-cols-2 md:px-4 md:py-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#28a745] px-6 py-4 text-[18px] font-black uppercase tracking-[0.06em] text-white transition hover:bg-[#23913c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <ShieldCheck size={20} />
              {submitting ? "Updating..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/associate-member/book-order")}
              className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#ffc107] px-6 py-4 text-[18px] font-black uppercase tracking-[0.06em] text-[#1f2937] transition hover:bg-[#e8af00]"
            >
              <LockKeyhole size={20} />
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
