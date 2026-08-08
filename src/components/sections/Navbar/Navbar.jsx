import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navItems } from "../../../data/landingPageData.js";
import logo from "../../../assets/images/Bags_Club.png";
import { useAuth } from "../../../context/AuthContext.jsx";
import { navigateTo } from "../../../utils/auth.js";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token, logout } = useAuth();
  const mobilePanelRef = useRef(null);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (mobilePanelRef.current && !mobilePanelRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 shadow-sm backdrop-blur" : "bg-transparent"
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-all duration-300 sm:gap-4 sm:px-6 lg:px-8",
          isScrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-4"
        ].join(" ")}
      >
        <a href="#" className="flex shrink-0 items-center">
          <img
            src={logo}
            alt="BAGSCLUB"
            className={[
              "block w-auto shrink-0 object-contain transition-all duration-300",
              isScrolled ? "h-9 sm:h-11 md:h-14" : "h-11 sm:h-14 md:h-16"
            ].join(" ")}
          />
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav
            className={[
              "hidden items-center gap-5 lg:flex xl:gap-7",
              "text-sm font-semibold transition-colors duration-300 md:text-base",
              isScrolled ? "text-slate-700" : "text-white"
            ].join(" ")}
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={[
                  "touch-target whitespace-nowrap py-2 transition-colors duration-200",
                  isScrolled ? "hover:text-brand" : "hover:text-white/90"
                ].join(" ")}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div
            className={[
              "hidden h-7 w-px xl:block",
              isScrolled ? "bg-slate-200" : "bg-white/30"
            ].join(" ")}
          />

          <a
            href={token ? "/" : "/login"}
            onClick={handleAuthClick}
            className={[
              "touch-target hidden rounded-md px-3 py-2 text-sm font-semibold transition-all duration-300 sm:px-4 lg:inline-flex lg:items-center lg:justify-center",
              isScrolled
                ? "bg-brand text-white hover:bg-ink"
                : "border border-white/30 bg-white/10 text-white hover:bg-white hover:text-ink"
            ].join(" ")}
          >
            {token ? "Logout" : "Login"}
          </a>
          <button
            type="button"
            className={[
              "touch-target flex h-11 w-11 items-center justify-center rounded-md p-2 transition-colors duration-300 sm:hidden sm:h-12 sm:w-12 lg:hidden",
              isScrolled ? "border border-slate-200 text-ink" : "border border-white/30 text-white"
            ].join(" ")}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      <div
        ref={mobilePanelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={[
          "fixed right-0 top-0 z-50 flex h-[100svh] w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
          <img src={logo} alt="BAGSCLUB" className="h-10 w-auto object-contain sm:h-12" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="touch-target flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-ink transition hover:bg-slate-50"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 sm:px-5">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="touch-target flex items-center rounded-lg px-4 py-3 text-base font-semibold text-ink transition hover:bg-slate-50 hover:text-brand"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-slate-100 px-4 py-4 sm:px-6">
          <a
            href={token ? "/" : "/login"}
            onClick={(event) => {
              setMobileMenuOpen(false);
              handleAuthClick(event);
            }}
            className="touch-target flex w-full items-center justify-center rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink"
          >
            {token ? "Logout" : "Login"}
          </a>
        </div>
      </div>
    </header>
  );
}
