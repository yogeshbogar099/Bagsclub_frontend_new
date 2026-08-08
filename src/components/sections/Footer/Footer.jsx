import { Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";
import { footerLinks } from "../../../data/landingPageData.js";

export default function Footer() {
  return (
    <footer id="footer" className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[2fr_1fr] lg:gap-12 lg:px-8 lg:py-14">
        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <div>
            <h2 className="text-lg font-bold sm:text-xl">Bagsclub Group of Companies</h2>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-white/75 sm:text-base">
              <li>Bagsclub of India Limited</li>
              <li>Bagsclub Expo Private Limited</li>
              <li>Bagsclub Today Private Limited</li>
            </ul>
            <p className="mt-5 text-sm text-white/70 sm:text-base">Dedicated for development of Bag printing industry.</p>
            <address className="mt-6 not-italic leading-7 text-white/75 text-sm sm:text-base">
              <strong className="text-white">Head Office:</strong>
              <br />
              Near Godavari Bakery, Opp Pari Kids Wear, Champai Residency, Latur-413512,
              <br />
              Maharashtra, India
            </address>
            <p className="mt-3 flex items-center gap-2 text-white/75 text-sm sm:text-base">
              <Phone size={16} /> (+91) 9975813249
            </p>
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg">Useful Links</h3>
            <ul className="mt-4 space-y-3 text-white/75 text-sm sm:text-base">
              {footerLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="touch-target inline-flex items-center py-1 transition hover:text-white">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold sm:text-4xl">13,800</p>
          <p className="mt-1 text-sm text-white/75 sm:text-base">Total Visit</p>
          <form
            className="mt-6 sm:mt-8"
            onSubmit={(event) => {
              event.preventDefault();
              alert("Subscription received.");
            }}
          >
            <label htmlFor="footer-email" className="text-sm font-semibold sm:text-base">
              Subscribe to our newsletter
            </label>
            <div className="mt-3 flex flex-col overflow-hidden rounded-md bg-white sm:flex-row">
              <span className="flex items-center justify-center gap-2 border-b border-slate-100 px-3 py-3 text-slate-500 sm:border-b-0 sm:border-r">
                <Mail size={18} />
              </span>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="Enter your Email"
                className="min-h-[48px] min-w-0 flex-1 px-3 py-3 text-sm text-slate-900 outline-none sm:text-base"
              />
              <button
                className="touch-target min-h-[48px] bg-[#16a085] px-4 text-sm font-semibold text-white transition hover:bg-[#138a72] sm:text-base"
                type="submit"
              >
                Subscribe
              </button>
            </div>
          </form>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
            <a
              href="#"
              aria-label="Bagsclub on Instagram"
              className="touch-target flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <Instagram size={18} /> Instagram
            </a>
            <a
              href="#"
              aria-label="Bagsclub on YouTube"
              className="touch-target flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <Youtube size={18} /> YouTube
            </a>
            <a
              href="#"
              aria-label="Bagsclub on Facebook"
              className="touch-target flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <Facebook size={18} /> Facebook
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/60 sm:px-6 sm:py-6 sm:text-sm">
        Copyrights (c) 2026 All Rights Reserved by Bagsclub of India Limited.
      </div>
    </footer>
  );
}
