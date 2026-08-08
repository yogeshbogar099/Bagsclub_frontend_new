import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const phoneNumber = "919975813249";
  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    "Hi Bagsclub! I would like to know more about your printing services."
  )}`;

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed bottom-20 right-4 z-40 transition-all duration-300 sm:bottom-24 sm:right-6 md:bottom-6 ${
          isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="mb-3 flex items-center justify-end gap-2 sm:mb-4">
          <div
            className={`max-w-[240px] overflow-hidden rounded-xl bg-white px-4 py-3 text-sm text-slate-700 shadow-xl ring-1 ring-slate-200 transition-all duration-300 sm:max-w-xs ${
              isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <p className="font-semibold text-ink">Need Help?</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Chat with us on WhatsApp. We typically reply within a few minutes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="touch-target flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50"
            aria-label={isExpanded ? "Close chat prompt" : "Open chat prompt"}
          >
            {isExpanded ? <X size={18} /> : <MessageCircle size={18} />}
          </button>
        </div>

        <div className="flex justify-end">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Chat with Bagsclub on WhatsApp"
            className="group touch-target relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl sm:h-14 sm:w-14"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366]/50" />
            <MessageCircle size={24} className="relative z-10 sm:h-7 sm:w-7" strokeWidth={2.2} />
          </a>
        </div>
      </div>
    </>
  );
}
