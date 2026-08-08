import { ChevronRight } from "lucide-react";

export default function Cta() {
  return (
    <section id="join" className="bg-ink py-10 text-center text-white sm:py-12 md:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">Join India's Largest Club of Printers</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/75 sm:mt-4 sm:text-base">
          Get membership today and access wholesale pricing, free software, and a nationwide printing community.
        </p>
        <a
          href="AddFranchise.aspx"
          className="mt-6 inline-flex touch-target items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-ink sm:mt-8 sm:px-6 sm:text-base"
        >
          Become a Member <ChevronRight size={18} />
        </a>
      </div>
    </section>
  );
}
