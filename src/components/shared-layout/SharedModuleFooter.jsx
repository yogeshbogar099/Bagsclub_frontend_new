import React from "react";
import { FaAngleRight, FaFacebook, FaInstagram, FaLocationDot, FaPhone } from "react-icons/fa6";

export default function SharedModuleFooter({ footerData }) {
  const quickLinks = footerData?.quickLinks || [
    { label: "Dashboard", href: "/" },
    { label: "Orders", href: "/" },
    { label: "Wallet", href: "/" },
    { label: "Profile", href: "/" }
  ];

  return (
    <footer className="mt-8 w-full border-t-4 border-[#f4c400] bg-[linear-gradient(180deg,#08162d_0%,#040c1a_100%)] font-['Arial',sans-serif] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-[60px] sm:px-8 sm:py-[75px] md:grid-cols-[1.6fr_1fr_1.2fr]">
        <div className="space-y-3.5">
          <h3 className="relative pl-[16px] text-[18px] sm:text-[19px] font-bold text-white leading-tight before:absolute before:left-0 before:top-[2px] before:h-[20px] before:w-[3px] before:rounded-full before:bg-[#f4c400] before:content-['']">
            {footerData?.companyName || "Printers Club Group"}
          </h3>
          <p className="text-[13px] leading-[1.8] text-[#a1adcf]">
            {footerData?.companyDescription || "Dedicated to the continuous development and modernization of the printing industry in India."}
          </p>
          <div className="space-y-2 pt-1 text-[13px] text-[#a1adcf]">
            <p className="flex items-center gap-2.5">
              <FaPhone className="text-[#f4c400] shrink-0 text-[15px]" />
              <span>{footerData?.contactPhone || "+91 99758 13249"}</span>
            </p>
            <p className="flex items-start gap-2.5">
              <FaLocationDot className="mt-1 text-[#f4c400] shrink-0 text-[15px]" />
              <span>{footerData?.contactAddress || "Plot No. 57, Jhotwara Industrial Area, Jaipur, Rajasthan"}</span>
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          <h3 className="relative pl-[16px] text-[18px] sm:text-[19px] font-bold text-white leading-tight before:absolute before:left-0 before:top-[2px] before:h-[20px] before:w-[3px] before:rounded-full before:bg-[#f4c400] before:content-['']">
            Quick Links
          </h3>
          <ul className="space-y-2 text-[13px] text-[#a1adcf]">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-1 hover:text-[#f4c400]">
                  <FaAngleRight className="text-[11px] text-[#a1adcf] transition-colors group-hover:text-[#f4c400]" />
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3.5">
          <h3 className="relative pl-[16px] text-[18px] sm:text-[19px] font-bold text-white leading-tight before:absolute before:left-0 before:top-[2px] before:h-[20px] before:w-[3px] before:rounded-full before:bg-[#f4c400] before:content-['']">
            Policy & Portal
          </h3>
          <div className="space-y-2 text-[13px] text-[#a1adcf]">
            <a href={footerData?.termsLink || "Terms_And_Conditions.aspx?type=new"} className="block transition hover:text-[#f4c400]">
              Terms & Policy
            </a>
            <a href="/login" className="block font-bold text-[#f4c400] hover:underline">
              Portal Login
            </a>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white/10 text-[17px] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#f4c400] hover:text-[#040c1a] shadow-sm"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white/10 text-[17px] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#f4c400] hover:text-[#040c1a] shadow-sm"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#030914] py-5 sm:py-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-5 text-center text-[12px] sm:text-[13px] sm:px-8 md:flex-row md:text-left text-[#8e9cb8]">
          <p>
            Copyrights © {new Date().getFullYear()} | All Rights Reserved by{" "}
            <span className="font-semibold text-white">{footerData?.companyName || "Printers Club of India Limited"}</span>
          </p>

          <div className="flex items-center gap-3 sm:gap-4">
            <a href="#" className="text-[#8e9cb8] transition hover:text-white">
              Policy & Terms
            </a>
            <span className="text-[#4a5670]">|</span>
            <a href="/login" className="font-bold text-[#f4c400] transition hover:underline">
              Portal Login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
