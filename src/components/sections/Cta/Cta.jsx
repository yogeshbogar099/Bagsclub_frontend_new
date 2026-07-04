import { ChevronRight } from "lucide-react";

export default function Cta() {
  return (
    <section id="join" className="bg-ink py-14 text-center text-white">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-3xl font-bold">Join India's Largest Club of Printers</h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/75">
          Get membership today and access wholesale pricing, free software, and a nationwide printing community.
        </p>
        <a
          href="AddFranchise.aspx"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-ink"
        >
          Become a Member <ChevronRight size={18} />
        </a>
      </div>
    </section>
  );
}
