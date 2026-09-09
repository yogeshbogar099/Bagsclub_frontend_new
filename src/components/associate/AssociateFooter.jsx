import React from "react";
import {
  FaAngleRight,
  FaCircleCheck,
  FaInstagram,
  FaLocationDot,
  FaPhone,
  FaYoutube
} from "react-icons/fa6";

export default function AssociateFooter() {
  return (
    <footer className="w-full border-t-4 border-[#f4c400] bg-[linear-gradient(180deg,#08162d_0%,#040c1a_100%)] font-['Arial',sans-serif] text-white">
      {/* Main Footer Container with Increased Vertical Padding & Breathing Space */}
      <div className="mx-auto w-full max-w-[1400px] px-5 py-[60px] sm:px-8 sm:py-[75px] lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.3fr] lg:gap-14">
          {/* Column 1: Company Info */}
          <div className="space-y-4">
            <h2 className="relative pl-[16px] text-[18px] sm:text-[19px] font-bold text-white leading-tight before:absolute before:left-0 before:top-[2px] before:h-[20px] before:w-[3px] before:rounded-full before:bg-[#f4c400] before:content-['']">
              Bagsclub Group
            </h2>

            <p className="max-w-[560px] text-[13px] leading-[1.8] text-[#a1adcf] font-normal">
              Dedicated to the continuous development and modernization of the Bag printing industry in India. Providing quality services and a unified platform for printers nationwide.
            </p>

            <ul className="space-y-2.5 pt-1">
              <li className="flex items-center gap-2.5 text-[13px] font-medium text-slate-100">
                <FaCircleCheck className="text-[13px] text-[#f4c400] shrink-0" />
                <span>Bagsclub of India Limited</span>
              </li>

              <li className="flex items-center gap-2.5 text-[13px] font-medium text-slate-100">
                <FaCircleCheck className="text-[13px] text-[#f4c400] shrink-0" />
                <span>Bagsclub Expo Private Limited</span>
              </li>

              <li className="flex items-center gap-2.5 text-[13px] font-medium text-slate-100">
                <FaCircleCheck className="text-[13px] text-[#f4c400] shrink-0" />
                <span>Bagsclub Today Private Limited</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h2 className="relative pl-[16px] text-[18px] sm:text-[19px] font-bold text-white leading-tight before:absolute before:left-0 before:top-[2px] before:h-[20px] before:w-[3px] before:rounded-full before:bg-[#f4c400] before:content-['']">
              Quick Links
            </h2>

            <ul className="space-y-2.5">
              {["About Us", "Services", "Portfolio", "Contact Us", "Terms & Conditions"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="group flex items-center gap-2 text-[13px] text-[#a1adcf] transition-all duration-300 hover:translate-x-1 hover:text-[#f4c400]"
                  >
                    <FaAngleRight className="text-[11px] text-[#a1adcf] transition-colors group-hover:text-[#f4c400]" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h2 className="relative pl-[16px] text-[18px] sm:text-[19px] font-bold text-white leading-tight before:absolute before:left-0 before:top-[2px] before:h-[20px] before:w-[3px] before:rounded-full before:bg-[#f4c400] before:content-['']">
              Contact Info
            </h2>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <FaLocationDot className="mt-1 text-[16px] text-[#f4c400] shrink-0" />
                <div>
                  <h4 className="text-[14px] font-bold text-white mb-0.5">Head Office:</h4>
                  <p className="text-[13px] leading-[1.6] text-[#a1adcf]">
                    Near Godavari Bakery, Opp Pari Kids Wear, Champai Residency, Latur, Maharashtra-413512
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-0.5">
                <FaPhone className="text-[16px] text-[#f4c400] shrink-0" />
                <div>
                  <a
                    href="tel:+919975813249"
                    className="text-[15px] sm:text-[16px] font-bold text-white transition hover:text-[#f4c400]"
                  >
                    (+91) 9975813249
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Circular Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white/10 text-[17px] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#f4c400] hover:text-[#040c1a] shadow-sm"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white/10 text-[17px] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#f4c400] hover:text-[#040c1a] shadow-sm"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-white/10 bg-[#030914] py-5 sm:py-6">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-3 px-5 text-center text-[12px] sm:text-[13px] sm:px-8 md:flex-row md:text-left">
          <p className="text-[#8e9cb8]">
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
