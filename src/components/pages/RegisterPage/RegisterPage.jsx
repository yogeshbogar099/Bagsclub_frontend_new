import { useEffect, useMemo, useState } from "react";
import {
  AlignLeft,
  Briefcase,
  CheckCircle,
  Compass,
  FileText,
  Globe2,
  Hash,
  Info,
  Lock,
  Mail,
  Map,
  MapPin,
  Menu,
  Phone,
  RefreshCw,
  User,
  UserCheck,
  Users
} from "lucide-react";
import { navItems as landingNavItems } from "../../../data/landingPageData.js";
import logo from "../../../assets/images/logo.png";
import { navigateTo } from "../../../utils/auth.js";
import { buildApiUrl } from "../../../lib/apiBaseUrl.js";

const countries = [
  "Afghanistan",
  "Australia",
  "Bangladesh",
  "Canada",
  "China",
  "France",
  "Germany",
  "India",
  "Indonesia",
  "Italy",
  "Japan",
  "Malaysia",
  "Nepal",
  "Pakistan",
  "Singapore",
  "Sri Lanka",
  "U.A.E.",
  "U.K.",
  "U.S."
];

const states = [
  "ANDAMAN AND NICOBAR ISLANDS",
  "ANDHRA PRADESH",
  "ARUNACHAL PRADESH",
  "ASSAM",
  "BIHAR",
  "CHANDIGARH",
  "CHHATTISGARH",
  "DELHI",
  "GOA",
  "GUJARAT",
  "HARYANA",
  "HIMACHAL PRADESH",
  "JAMMU & KASHMIR",
  "JHARKHAND",
  "KARNATAKA",
  "KERALA",
  "LADAKH",
  "MADHYA PRADESH",
  "MAHARASHTRA",
  "MANIPUR",
  "MEGHALAYA",
  "MIZORAM",
  "NAGALAND",
  "ODISHA",
  "PUDUCHERRY",
  "PUNJAB",
  "RAJASTHAN",
  "SIKKIM",
  "TAMIL NADU",
  "TELANGANA",
  "TRIPURA",
  "UTTAR PRADESH",
  "UTTARAKHAND",
  "WEST BENGAL"
];

const services = [
  {
    key: "printingServices",
    title: "Printing Services",
    color: "text-[#047bed]",
    description: "Join 40,000+ printers across India."
  },
  {
    key: "expo",
    title: "Exhibition Services",
    color: "text-accent",
    description: "Participate in industry expos."
  },
  {
    key: "magazine",
    title: "Magazine Services",
    color: "text-[#1700bc]",
    description: "Free monthly industry trends magazine."
  },
  {
    key: "advertiser",
    title: "Magazine Advertisement",
    color: "text-ink",
    description: "Promote your brand in Printers Club Today."
  }
];

const initialForm = {
  businessName: "",
  ownerName: "",
  mobile: "",
  email: "",
  password: "",
  referenceCode: "",
  country: "India",
  state: "",
  district: "",
  city: "",
  pinCode: "",
  gstNumber: "",
  address: "",
  services: [],
  termsAccepted: false,
  captcha: "",
  captchaChallengeId: ""
};

const usefulLinks = [
  "About Us",
  "Services",
  "Portfolio",
  "Contact Us",
  "Our Location",
  "Terms & Conditions",
  "Sign In"
];

function navigateHome(event) {
  event.preventDefault();
  window.history.pushState({}, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function navigateLogin(event) {
  event.preventDefault();
  window.history.pushState({}, "", "/login");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function navigateToLanding(event, href) {
  event.preventDefault();

  const targetHash = href === "#" ? "" : href;
  const nextUrl = targetHash ? `/${targetHash}` : "/";

  window.history.pushState({}, "", nextUrl);
  window.dispatchEvent(new PopStateEvent("popstate"));

  if (!targetHash) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  window.setTimeout(() => {
    const targetElement = document.querySelector(targetHash);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 50);
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        <a href="/" onClick={navigateHome} className="flex items-center gap-3">
          <img src={logo} alt="BAGSCLUB" className="block h-14 w-auto shrink-0 object-contain sm:h-16 md:h-20" />
          <div className="flex flex-col justify-center">
            <div className="text-lg font-extrabold tracking-wide text-blue-700 sm:text-xl md:text-2xl">BAGSCLUB</div>
            <div className="text-xs font-medium text-slate-600 sm:text-sm">No.1 Bag Printing Service</div>
          </div>
        </a>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-6 text-base font-semibold text-slate-700 lg:flex">
            {landingNavItems.map((item) => (
              <a
                key={item.label}
                href={`/${item.href === "#" ? "" : item.href}`}
                onClick={(event) => navigateToLanding(event, item.href)}
                className="transition-colors duration-200 hover:text-brand"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden h-7 w-px bg-slate-200 lg:block" />

          <a
            href="/login"
            onClick={navigateLogin}
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-ink"
          >
            Login
          </a>

          <button className="rounded-md border border-slate-200 p-2 text-ink transition-colors duration-300 lg:hidden" aria-label="Open menu">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="rounded-b-[50%_20px] bg-gradient-to-br from-primary to-secondary px-4 py-16 text-center text-white sm:py-20">
      <h1 className="text-4xl font-bold tracking-normal sm:text-5xl">Join Our Printer Network</h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
        Access exclusive wholesale benefits and grow your business with Printers Club of India.
      </p>
    </section>
  );
}

function InputGroup({ label, name, value, onChange, icon: Icon, type = "text", note, required, ...props }) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <div className="flex">
        <span className="field-icon">
          <Icon size={18} />
        </span>
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          className="field"
          {...props}
        />
      </div>
      {note ? <p className="mt-1 text-xs text-red-500">{note}</p> : null}
    </div>
  );
}

function SelectGroup({ label, name, value, onChange, icon: Icon, options, placeholder, required }) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <div className="flex">
        <span className="field-icon">
          <Icon size={18} />
        </span>
        <select id={name} name={name} value={value} onChange={onChange} className="field">
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Divider({ children }) {
  return (
    <div className="divider md:col-span-2">
      <span>{children}</span>
    </div>
  );
}

function RegisterForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [captchaText, setCaptchaText] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const selectedServiceCount = form.services.length;

  const errors = useMemo(() => {
    const next = [];
    const mobilePattern = /^(\+91[-\s]?|0)?[6-9]\d{9}$/;
    const pinPattern = /^[1-9][0-9]{5}$/;
    const gstPattern = /^([0][1-9]|[1-2][0-9]|[3][0-7])([A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z])$/;
    const businessPattern = /^[a-zA-Z0-9.,\-/()\s]*$/;

    if (!form.businessName.trim()) next.push("Business Name is required.");
    if (form.businessName && !businessPattern.test(form.businessName)) next.push("Special characters are not allowed in Business Name.");
    if (!form.ownerName.trim()) next.push("Your Name is required.");
    if (!mobilePattern.test(form.mobile.trim())) next.push("Enter a valid 10-digit mobile number.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.push("Enter a valid email address.");
    if (!form.password) next.push("Password is required.");
    if (!form.country) next.push("Country is required.");
    if (!form.state) next.push("State/Region is required.");
    if (!form.district.trim()) next.push("District is required.");
    if (!form.city.trim()) next.push("City is required.");
    if (!pinPattern.test(form.pinCode.trim())) next.push("Invalid PIN Code.");
    if (form.gstNumber && !gstPattern.test(form.gstNumber.trim().toUpperCase())) next.push("Invalid GST format.");
    if (form.address.trim().length < 20) next.push("Address must be at least 20 characters.");
    if (selectedServiceCount === 0) next.push("Please select at least one service.");
    if (!form.termsAccepted) next.push("Please read and accept the Terms & Conditions.");
    if (!form.captchaChallengeId) next.push("CAPTCHA is loading. Please wait a moment and try again.");
    if (captchaText && form.captcha.trim().toUpperCase() !== captchaText) next.push("Incorrect CAPTCHA. Please enter the displayed text.");

    return next;
  }, [form, selectedServiceCount, captchaText]);

  useEffect(() => {
    loadCaptcha();
  }, []);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function toggleService(serviceKey) {
    setForm((current) => ({
      ...current,
      services: current.services.includes(serviceKey)
        ? current.services.filter((item) => item !== serviceKey)
        : [...current.services, serviceKey]
    }));
  }

  async function loadCaptcha() {
    setCaptchaLoading(true);

    try {
      const response = await fetch(buildApiUrl("/api/auth/captcha"));
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load CAPTCHA.");
      }

      setCaptchaText(data.captchaText || "");
      setForm((current) => ({
        ...current,
        captcha: "",
        captchaChallengeId: data.challengeId || ""
      }));
    } catch (error) {
      setCaptchaText("");
      setForm((current) => ({
        ...current,
        captcha: "",
        captchaChallengeId: ""
      }));
      setStatus(error.message || "Failed to load CAPTCHA.");
    } finally {
      setCaptchaLoading(false);
    }
  }

  function refreshCaptcha() {
    setStatus("");
    loadCaptcha();
  }

  async function submitForm(event) {
    event.preventDefault();

    if (errors.length > 0) {
      const captchaError = errors.find((error) => error.includes("CAPTCHA"));
      setStatus(captchaError || "Please fix the highlighted issues before submitting.");
      return;
    }

    setSubmitting(true);
    setStatus("");

    try {
      const response = await fetch(buildApiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed.");
      setStatus(
        data.message ||
          `Account created successfully. Login with Country: ${data.credentials?.country || form.country} and WhatsApp No.: ${data.credentials?.mobileNumber || form.mobile}.`
      );
      setForm(initialForm);
      loadCaptcha();
      window.setTimeout(() => {
        navigateTo("/login");
      }, 1200);
    } catch (error) {
      setStatus(error.message);
      if ((error.message || "").toUpperCase().includes("CAPTCHA")) {
        loadCaptcha();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <form onSubmit={submitForm} className="rounded-2xl border border-white/60 bg-white p-5 shadow-premium sm:p-8 lg:p-10">
        <div className="mb-6 border-b border-slate-200 pb-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-secondary">
            <UserCheck className="text-primary" /> Printer ID Registration
          </h2>
        </div>

        <div className="mb-6 flex gap-3 rounded-lg border-l-4 border-primary bg-primary/10 p-4 text-sm text-slate-700">
          <Info className="mt-0.5 shrink-0 text-primary" size={20} />
          <p>
            <strong>Note:</strong> You are applying for a <strong>Printer ID</strong> for exclusive wholesale benefits. Requests are approved after internal verification, usually within 1-2 working days.
          </p>
        </div>

        {status ? (
          <div className="mb-6 rounded-lg bg-secondary/10 px-4 py-3 text-sm font-semibold text-secondary">
            {status}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <InputGroup label="Business / Firm Name" name="businessName" value={form.businessName} onChange={updateField} icon={Briefcase} required />
          <InputGroup label="Your Name" name="ownerName" value={form.ownerName} onChange={updateField} icon={User} required />
          <InputGroup label="WhatsApp No." name="mobile" value={form.mobile} onChange={updateField} icon={Phone} maxLength={15} note="Do not include 0 or country code" required />
          <InputGroup label="Email Address" name="email" value={form.email} onChange={updateField} icon={Mail} type="email" required />

          <Divider>Security & Reference</Divider>

          <InputGroup label="Create Password" name="password" value={form.password} onChange={updateField} icon={Lock} type="password" maxLength={20} required />
          <InputGroup label="Reference Code" name="referenceCode" value={form.referenceCode} onChange={updateField} icon={Users} maxLength={8} placeholder="Employee Code" />

          <Divider>Location Details</Divider>

          <SelectGroup label="Country" name="country" value={form.country} onChange={updateField} icon={Globe2} options={countries} placeholder="--Select Country--" required />
          <SelectGroup label="State" name="state" value={form.state} onChange={updateField} icon={Map} options={states} placeholder="--Select State--" required />
          <InputGroup label="District" name="district" value={form.district} onChange={updateField} icon={Compass} required />
          <InputGroup label="City" name="city" value={form.city} onChange={updateField} icon={MapPin} required />
          <InputGroup label="PIN Code" name="pinCode" value={form.pinCode} onChange={updateField} icon={Hash} maxLength={10} required />
          <InputGroup
            label="GST / Tax Number"
            name="gstNumber"
            value={form.gstNumber}
            onChange={(event) =>
              setForm((current) => ({ ...current, gstNumber: event.target.value.toUpperCase() }))
            }
            icon={FileText}
            maxLength={15}
          />

          <div className="md:col-span-2">
            <label htmlFor="address" className="field-label">
              Full Address <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <span className="field-icon h-auto min-h-24 items-start pt-3">
                <AlignLeft size={18} />
              </span>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={updateField}
                maxLength={199}
                className="textarea-field"
              />
            </div>
          </div>

          <Divider>Services & Acceptance</Divider>

          <div className="rounded-xl border border-slate-200 border-l-primary border-l-4 bg-white p-5 md:col-span-2">
            <h3 className="mb-4 text-lg font-bold text-secondary">Select Services Interested In:</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((service) => (
                <label key={service.key} className="flex cursor-pointer gap-3 rounded-lg p-2 transition hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={form.services.includes(service.key)}
                    onChange={() => toggleService(service.key)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span>
                    <strong className={service.color}>{service.title}</strong>
                    <br />
                    <small className="text-slate-500">{service.description}</small>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-3 md:col-span-2">
            <input
              name="termsAccepted"
              type="checkbox"
              checked={form.termsAccepted}
              onChange={updateField}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm">
              I accept the company{" "}
              <a href="Terms_And_Conditions.aspx?type=new" target="_blank" className="font-semibold text-primary" rel="noreferrer">
                Terms & Conditions
              </a>.
            </span>
          </label>

          <div className="rounded-lg bg-slate-50 p-4">
            <label htmlFor="captcha" className="field-label">CAPTCHA Test</label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="rounded bg-white px-5 py-2 font-mono text-lg font-bold tracking-[0.3em] text-secondary shadow-sm">
                  {captchaLoading ? "......" : captchaText || "------"}
                </span>
                <button type="button" onClick={refreshCaptcha} className="text-sm font-semibold text-primary">
                  <RefreshCw className="inline" size={14} /> Refresh CAPTCHA
                </button>
              </div>
              <input
                id="captcha"
                name="captcha"
                value={form.captcha}
                onChange={updateField}
                className="h-11 flex-1 rounded-md border border-slate-300 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Enter text"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="h-14 rounded-md bg-primary px-6 text-sm font-bold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 md:self-end"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>

        {errors.length > 0 ? (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            <p className="font-bold">Please fix the following issues:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {errors.slice(0, 5).map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-primary/10 p-4 text-sm font-semibold text-primary">
            <CheckCircle size={18} /> Form looks ready.
          </div>
        )}
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[2fr_1fr] lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold">Printers Club Group of Companies</h2>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-white/70">
              <li>Printers Club of India Limited</li>
              <li>Printers Club Expo Private Limited</li>
              <li>Printers Club Today Private Limited</li>
            </ul>
            <p className="mt-5 text-white/70">Dedicated for development of printing industry.</p>
            <address className="mt-5 not-italic leading-7 text-white/70">
              <strong className="text-white">Head Office:</strong>
              <br />
              Plot No. 57, Jhotwara Industrial Area,
              <br />
              Near Shalimar Circle, Jaipur-302012,
              <br />
              Rajasthan, India
            </address>
          </div>
          <div>
            <h3 className="font-bold">Useful Links</h3>
            <ul className="mt-4 space-y-3 text-white/70">
              {usefulLinks.map((link) => (
                <li key={link}>
                  <a href="/" onClick={navigateHome} className="transition hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <p className="text-4xl font-bold">8,765</p>
          <p className="mt-1 text-white/70">Total Todays Visit</p>
          <form
            className="mt-8"
            onSubmit={(event) => {
              event.preventDefault();
              alert("Subscription received.");
            }}
          >
            <label htmlFor="newsletter" className="font-semibold">
              Subscribe to our newsletter
            </label>
            <div className="mt-3 flex overflow-hidden rounded-lg bg-white">
              <span className="flex items-center px-3 text-slate-500">
                <Mail size={18} />
              </span>
              <input
                id="newsletter"
                type="email"
                required
                placeholder="Enter your Email"
                className="min-w-0 flex-1 px-2 py-3 text-slate-900 outline-none"
              />
              <button className="bg-[#16a085] px-4 text-sm font-semibold text-white transition hover:bg-[#138a72]" type="submit">
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-white/60">
        Copyrights (c) 2026 All Rights Reserved by Printers Club of India Limited.
      </div>
    </footer>
  );
}

export default function RegisterPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Create Account | Printers Club";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <Header />
      <div className="pt-24 sm:pt-28 md:pt-32">
        <Hero />
      </div>
      <RegisterForm />
      <Footer />
    </div>
  );
}
