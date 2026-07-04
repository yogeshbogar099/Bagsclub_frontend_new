import { Instagram, Mail, Phone, Youtube } from "lucide-react";
import { footerLinks } from "../../../data/landingPageData.js";

export default function Footer() {
  return (
    <footer id="footer" className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[2fr_1fr] lg:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold">Bagsclub Group of Companies</h2>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-white/75">
              <li>Bagsclub of India Limited</li>
              <li>Bagsclub Expo Private Limited</li>
              <li>Bagsclub Today Private Limited</li>
            </ul>
            <p className="mt-5 text-white/70">Dedicated for development of Bag printing industry.</p>
            <address className="mt-6 not-italic leading-7 text-white/75">
              <strong className="text-white">Head Office:</strong>
              <br />
             Sandeep Printers, 
              <br />
             behind Godavari Hotel , Latur-413512,
              <br />
              Maharashtra, India
            </address>
            <p className="mt-3 flex items-center gap-2 text-white/75">
              <Phone size={16} /> (+91) 9975813249
            </p>
          </div>
          <div>
            <h3 className="font-bold">Useful Links</h3>
            <ul className="mt-4 space-y-3 text-white/75">
              {footerLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="transition hover:text-white">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <p className="text-4xl font-bold">13,800</p>
          <p className="mt-1 text-white/75">Total Visit</p>
          <form
            className="mt-8"
            onSubmit={(event) => {
              event.preventDefault();
              alert("Subscription received.");
            }}
          >
            <label htmlFor="email" className="font-semibold">
              Subscribe to our newsletter
            </label>
            <div className="mt-3 flex overflow-hidden rounded-md bg-white">
              <span className="flex items-center px-3 text-slate-500">
                <Mail size={18} />
              </span>
              <input
                id="email"
                type="email"
                required
                placeholder="Enter your Email"
                className="min-w-0 flex-1 px-2 py-3 text-slate-900 outline-none"
              />
              <button className="bg-[#16a085] px-4 font-semibold text-white hover:bg-[#138a72]" type="submit">
                Subscribe
              </button>
            </div>
          </form>
          <div className="mt-8 flex gap-4">
            <a
              href="#"
              className="flex items-center gap-2 text-white/80 hover:text-white"
            >
              <Instagram size={20} /> Instagram
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-white/80 hover:text-white"
            >
              <Youtube size={20} /> YouTube
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-sm text-white/60">
        Copyrights (c) 2026 All Rights Reserved by Bagsclub of India Limited.
      </div>
    </footer>
  );
}
