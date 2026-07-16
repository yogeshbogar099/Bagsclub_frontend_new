import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Menu,
  Phone,
  Tag,
  TrendingUp,
  Users
} from "lucide-react";
import { navItems as landingNavItems } from "../../../data/landingPageData.js";
import logo from "../../../assets/images/Bags_Club.png";
import { getAuthSession, getDashboardPath, navigateTo, saveAuthSession } from "../../../utils/auth.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { buildApiUrl } from "../../../lib/apiBaseUrl.js";

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts & Nevis",
  "Saint Lucia",
  "Samoa",
  "San Marino",
  "Sao Tome & Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "St. Vincent & Grenadines",
  "State of Palestine",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "U.K.",
  "U.S.",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Viet Nam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

const benefits = [
  {
    title: "Wholesale Rates",
    description: "Get the best prices in the industry directly.",
    icon: Tag
  },
  {
    title: "Live Tracking",
    description: "Real-time updates on all your print jobs.",
    icon: TrendingUp
  },
  {
    title: "Pan-India Reach",
    description: "Service available in all major cities.",
    icon: MapPin
  },
  {
    title: "Expert Support",
    description: "Dedicated team for all your printing needs.",
    icon: Users
  }
];

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

function navigateRegister(event) {
  event.preventDefault();
  window.history.pushState({}, "", "/register");
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
  const { token, logout } = useAuth();

  function handleAuthClick(event) {
    event.preventDefault();

    if (token) {
      logout();
      navigateTo("/");
      return;
    }

    navigateTo("/login");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        <a href="/" onClick={navigateHome} className="flex items-center">
          <img src={logo} alt="BAGSCLUB" className="block h-14 w-auto shrink-0 object-contain sm:h-16 md:h-20" />
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
            href={token ? "/" : "/login"}
            onClick={handleAuthClick}
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-ink"
          >
            {token ? "Logout" : "Login"}
          </a>

          <button className="rounded-md border border-slate-200 p-2 text-ink transition-colors duration-300 lg:hidden" aria-label="Open menu">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

function LoginPanel() {
  const [form, setForm] = useState({
    country: "",
    mobileNumber: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedCountries = useMemo(() => [...countries].sort((a, b) => a.localeCompare(b)), []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.country || !form.mobileNumber || !form.password) {
      setStatus("Please select a country, enter mobile number, and enter password.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch(buildApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      saveAuthSession({
        token: data.token,
        user: data.user
      });
      setStatus(data.message || "Login successful.");
      window.setTimeout(() => {
        navigateTo(getDashboardPath(data.user.role));
      }, 800);
    } catch (error) {
      setStatus(error.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-white p-8 sm:p-10 lg:p-14">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-ink">Welcome!</h1>
        <p className="mt-2 text-muted">Log in to access your dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="country" className="field-label">
            Select Country
          </label>
          <select
            id="country"
            name="country"
            value={form.country}
            onChange={updateField}
            className="form-field"
          >
            <option value="">--Select Country--</option>
            {sortedCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mobileNumber" className="field-label">
            Mobile Number
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              autoFocus
              value={form.mobileNumber}
              onChange={updateField}
              className="form-field pl-11"
              placeholder="Enter mobile number"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-muted">
              Password
            </label>
            <a href="ForgotPassword.aspx" className="text-xs font-semibold text-primary transition hover:text-secondary">
              Forgot?
            </a>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={updateField}
              className="form-field px-11"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {status ? (
          <p className="rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
            {status}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-[55px] w-full rounded-xl bg-primary text-lg font-bold uppercase tracking-wide text-white transition hover:bg-[#1e4180] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </section>
  );
}

function JoinPanel() {
  return (
    <aside className="relative overflow-hidden bg-gradient-to-br from-[#ff8989] to-[#1a3a6d] p-8 text-white sm:p-10 lg:p-14">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" />
      <div className="relative">
        <h2 className="text-3xl font-extrabold uppercase tracking-wide text-black">New User?</h2>
        <div className="mt-8 space-y-5">
          {benefits.map(({ title, description, icon: Icon }) => (
            <div key={title} className="flex gap-4">
              <div className="benefit-icon">
                <Icon size={19} />
              </div>
              <div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm text-white/75">{description}</p>
              </div>
            </div>
          ))}
        </div>
        <a
          href="/register"
          onClick={navigateRegister}
          className="mt-9 inline-flex rounded-full border-2 border-white px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:border-secondary hover:bg-secondary hover:text-black hover:shadow-lg"
        >
          Create Account
        </a>
      </div>
    </aside>
  );
}

function LoginPageContent() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#f4f7fa] px-4 pb-12 pt-32 sm:pt-36">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[20px] bg-white shadow-premium lg:grid-cols-2">
        <LoginPanel />
        <JoinPanel />
      </div>
    </main>
  );
}

function Footer() {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[2fr_1fr] lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold">Bagslub Group of Companies</h2>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-white/70">
              <li>Bagsclub of India Limited</li>
              <li>Bagslub Expo Private Limited</li>
              <li>Bagsclub Today Private Limited</li>
            </ul>
            <p className="mt-5 text-white/70">Dedicated for development of Bag printing industry.</p>
            <address className="mt-5 not-italic leading-7 text-white/70">
              <strong className="text-white">Head Office:</strong>
              <br />
              Sandeep Printers, Behind Godavari Hotel , Latur-413512,
              <br />
             
        Maharashtra, India
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
          <p className="text-4xl font-bold">13,800</p>
          <p className="mt-1 text-white/70">Total Visit</p>
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
        Copyrights (c) 2026 All Rights Reserved by Bagsclub of India Limited.
      </div>
    </footer>
  );
}

export default function LoginPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Login | Printers Club";

    const session = getAuthSession();

    if (session?.token) {
      navigateTo(getDashboardPath(session.user.role));
    }

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div>
      <Header />
      <LoginPageContent />
      <Footer />
    </div>
  );
}
