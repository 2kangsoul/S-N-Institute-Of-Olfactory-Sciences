// @ts-nocheck
/* eslint-disable */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export default function DesktopNav() {
  const [isPerfumeOpen, setIsPerfumeOpen] = useState(false);

  return (
    <nav className="hidden lg:flex items-center gap-4 text-xs font-medium">
      <div
        className="relative"
        onMouseEnter={() => setIsPerfumeOpen(true)}
        onMouseLeave={() => setIsPerfumeOpen(false)}
      >
        <button
          type="button"
          className="hover:text-gray-300 text-white transition-colors"
          onClick={() => setIsPerfumeOpen((open) => !open)}
        >
          Perfume
        </button>
        <AnimatePresence>
          {isPerfumeOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute left-0 top-full z-50 mt-3 min-w-36 rounded-xl border border-white/10 bg-[#131313] py-2 shadow-lg"
            >
              <Link
                href="/products"
                className="block px-4 py-2 text-white transition-colors hover:bg-white/10 hover:text-gray-300"
              >
                Product
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Link href="/team" className="hover:text-gray-300 text-white transition-colors">
        Team
      </Link>
      <Link href="/blog" className="hover:text-gray-300 text-white transition-colors">
        Blog
      </Link>
      <Link href="/aboutus" className="hover:text-gray-300 text-white transition-colors">
        About Us
      </Link>
    </nav>
  );
}
