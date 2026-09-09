import { Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";
import { footerLinks } from "../../../data/landingPageData.js";

export default function Footer() {
  return (
    <footer id="footer" className="w-full border-t-4 border-[#f4c400] bg-[linear-gradient(180deg,#08162d_0%,#040c1a_100%)] font-['Arial',sans-serif] text-white">
      {/* Main Container with Increased Vertical Padding */}
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-[60px] sm:px-8 sm:py-[75px] lg:grid-cols-[2fr_1fr] lg:gap-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="relative pl-[16px] text-[18px] sm:text-[19px] font-bold text-white leading-tight before:absolute before:left-0 before:top-[2px] before:h-[20px] before:w-[3px] before:rounded-full before:bg-[#f4c400] before:content-['']">
              Bagsclub Group of Companies
            </h2>

            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13px] text-[#a1adcf]">
              <li>Bagsclub of India Limited</li>
              <li>Bagsclub Expo Private Limited</li>
              <li>Bagsclub Today Private Limited</li>
            </ul>

            <p className="mt-3 text-[13px] leading-[1.8] text-[#a1adcf]">
              Dedicated for development of Bag printing industry.
            </p>

            <address className="mt-4 not-italic text-[13px] leading-[1.6] text-[#a1adcf]">
              <strong className="text-white font-bold">Head Office:</strong>
              <br />
              Near Godavari Bakery, Opp Pari Kids Wear, Champai Residency, Latur-413512,
              <br />
              Maharashtra, India
            </address>

            <p className="mt-3 flex items-center gap-2 text-[13px] text-white font-semibold">
              <Phone size={15} className="text-[#f4c400]" /> (+91) 9975813249
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="relative pl-[16px] text-[18px] sm:text-[19px] font-bold text-white leading-tight before:absolute before:left-0 before:top-[2px] before:h-[20px] before:w-[3px] before:rounded-full before:bg-[#f4c400] before:content-['']">
              Useful Links
            </h3>

            <ul className="mt-3 space-y-2 text-[13px] text-[#a1adcf]">
              {footerLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="touch-target inline-flex items-center py-0.5 transition hover:text-[#f4c400]">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-3xl font-extrabold text-white sm:text-4xl">13,800</p>
            <p className="mt-1 text-[13px] text-[#a1adcf]">Total Visit</p>
          </div>

          <form
            className="mt-3"
            onSubmit={(event) => {
              event.preventDefault();
              alert("Subscription received.");
            }}
          >
            <label htmlFor="footer-email" className="text-[13px] font-bold text-white">
              Subscribe to our newsletter
            </label>

            <div className="mt-2.5 flex flex-col overflow-hidden rounded-md bg-white sm:flex-row shadow-sm">
              <span className="flex items-center justify-center gap-2 border-b border-slate-100 px-3 py-2.5 text-slate-500 sm:border-b-0 sm:border-r">
                <Mail size={16} />
              </span>

              <input
                id="footer-email"
                type="email"
                required
                placeholder="Enter your Email"
                className="min-h-[44px] min-w-0 flex-1 px-3.5 py-2 text-[13px] text-slate-900 outline-none"
              />

              <button
                className="touch-target min-h-[44px] bg-[#16a085] px-4.5 text-[13px] font-bold text-white transition hover:bg-[#138a72]"
                type="submit"
              >
                Subscribe
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3 pt-1">
            <a
              href="#"
              aria-label="Bagsclub on Instagram"
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#f4c400] hover:text-[#040c1a] shadow-sm"
            >
              <Instagram size={17} />
            </a>

            <a
              href="#"
              aria-label="Bagsclub on YouTube"
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#f4c400] hover:text-[#040c1a] shadow-sm"
            >
              <Youtube size={17} />
            </a>

            <a
              href="#"
              aria-label="Bagsclub on Facebook"
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#f4c400] hover:text-[#040c1a] shadow-sm"
            >
              <Facebook size={17} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#030914] py-5 sm:py-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-5 text-center text-[12px] sm:text-[13px] sm:px-8 md:flex-row md:text-left text-[#8e9cb8]">
          <p>
            Copyrights © 2026 | All Rights Reserved by{" "}
            <span className="font-semibold text-white">Bagsclub of India Limited</span>
          </p>

          <div className="flex items-center gap-3 sm:gap-4">
            <a href="#" className="text-[#8e9cb8] transition hover:text-white">
              Policy & Terms
            </a>

            <span className="text-[#4a5670]">|</span>

            <a href="#" className="font-bold text-[#f4c400] transition hover:underline">
              Portal Login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
