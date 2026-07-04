import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { navItems } from "../../../data/landingPageData.js";
import logo from "../../../assets/images/logo.png";
import { useAuth } from "../../../context/AuthContext.jsx";
import { navigateTo } from "../../../utils/auth.js";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 shadow-sm backdrop-blur" : "bg-transparent"
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-8",
          isScrolled ? "py-2" : "py-3 sm:py-4"
        ].join(" ")}
      >
        <a href="#" className="flex items-center gap-3">
          <img
            src={logo}
            alt="BAGSCLUB"
            className={[
              "block w-auto shrink-0 object-contain transition-all duration-300",
              isScrolled ? "h-14 sm:h-16 md:h-20" : "h-16 sm:h-20 md:h-24"
            ].join(" ")}
          />
          <div className="flex flex-col justify-center">
            <div
              className={[
                "text-lg font-extrabold tracking-wide transition-colors duration-300 sm:text-xl md:text-2xl",
                isScrolled ? "text-blue-700" : "text-white"
              ].join(" ")}
            >
              BAGSCLUB
            </div>
            <div
              className={[
                "text-xs font-medium transition-colors duration-300 sm:text-sm",
                isScrolled ? "text-slate-600" : "text-white/80"
              ].join(" ")}
            >
              No.1 Bag Printing Service
            </div>
          </div>
        </a>

        <div className="flex items-center gap-3">
          <nav
            className={[
              "hidden items-center gap-6 lg:flex",
              "text-base font-semibold transition-colors duration-300",
              isScrolled ? "text-slate-700" : "text-white"
            ].join(" ")}
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={[
                  "transition-colors duration-200",
                  isScrolled ? "hover:text-brand" : "hover:text-white"
                ].join(" ")}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div
            className={[
              "hidden h-7 w-px lg:block",
              isScrolled ? "bg-slate-200" : "bg-white/30"
            ].join(" ")}
          />

          <a
            href={token ? "/" : "/login"}
            onClick={handleAuthClick}
            className={[
              "rounded-md px-4 py-2 text-sm font-semibold transition-all duration-300",
              isScrolled
                ? "bg-brand text-white hover:bg-ink"
                : "border border-white/30 bg-white/10 text-white hover:bg-white hover:text-ink"
            ].join(" ")}
          >
            {token ? "Logout" : "Login"}
          </a>
          <button
            className={[
              "rounded-md p-2 transition-colors duration-300 lg:hidden",
              isScrolled ? "border border-slate-200 text-ink" : "border border-white/30 text-white"
            ].join(" ")}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
