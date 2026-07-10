// @ts-nocheck
/* eslint-disable */
export default function Footer() {
  return (
    <footer className="w-full bg-[#0e0e0e] border-t border-[#4b4454]">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="ff-display text-sm uppercase tracking-[0.2em] text-[#d5bbff]">
          S&N Institute of Olfactory Sciences
        </p>
        <p className="ff-body text-[11px] tracking-wide text-[#968d9f]">
          © {new Date().getFullYear()} S&N Institute of Olfactory Sciences. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
