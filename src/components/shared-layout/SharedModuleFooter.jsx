export default function SharedModuleFooter({ footerData }) {
  const quickLinks = footerData?.quickLinks || [
    { label: "Dashboard", href: "/" },
    { label: "Orders", href: "/" },
    { label: "Wallet", href: "/" },
    { label: "Profile", href: "/" }
  ];

  return (
    <footer className="mt-8 bg-[#1f2937] text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:px-8 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <h3 className="text-lg font-bold text-white">{footerData?.companyName || "Printers Club Group"}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {footerData?.companyDescription || "Dedicated to the continuous development and modernization of the printing industry in India."}
          </p>
          <div className="mt-4 space-y-1 text-sm text-slate-300">
            <p>{footerData?.contactEmail || "support@printersclub.in"}</p>
            <p>{footerData?.contactPhone || "+91 99758 13249"}</p>
            <p>{footerData?.contactAddress || "Plot No. 57, Jhotwara Industrial Area, Jaipur, Rajasthan"}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Policy & Portal</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <a href={footerData?.termsLink || "Terms_And_Conditions.aspx?type=new"} className="block transition hover:text-white">
              Terms & Policy
            </a>
            <a href="/login" className="block transition hover:text-white">
              Portal Login
            </a>
            <a href="#" className="block transition hover:text-white">
              Facebook
            </a>
            <a href="#" className="block transition hover:text-white">
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 sm:px-6 md:px-8 text-center text-sm text-slate-400">
        Copyrights © {new Date().getFullYear()} | All Rights Reserved by{" "}
        <span className="font-semibold text-slate-200">{footerData?.companyName || "Printers Club of India Limited"}</span>
      </div>
    </footer>
  );
}
