"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { BRAND_CONFIG, NAV_ITEMS, cn } from "@/lib/constants";
import { useViewportStore } from "@/store/viewport-context";

/**
 * Minimal luxury FITVERSE top navigation bar matching the storyboard reference.
 * Highlights the active section link with a glowing purple underline.
 */
export function Navbar() {
  const { activeSection } = useViewportStore();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pointer-events-none fixed left-0 right-0 top-0 z-40 w-full bg-gradient-to-b from-obsidian/90 via-obsidian/55 to-transparent px-6 pb-4 pt-5 backdrop-blur-[2px] sm:px-10 lg:px-14 lg:pt-7"
    >
      <nav
        aria-label="Primary Navigation"
        className="pointer-events-auto mx-auto flex max-w-[1440px] items-center justify-between"
      >
        {/* Brand Wordmark + Glowing Violet Dot */}
        <a
          href="#hero"
          aria-label="FITVERSE Home"
          className="group flex items-center gap-2.5 focus:outline-none"
        >
          <span className="text-lg font-semibold tracking-[0.28em] text-silver-bright sm:text-xl">
            {BRAND_CONFIG.name}
          </span>
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full bg-violet shadow-[0_0_12px_#818CF8] transition-transform duration-300 group-hover:scale-125"
          />
        </a>

        {/* Center Navigation Links */}
        <ul className="hidden items-center gap-8 md:flex lg:gap-11">
          {NAV_ITEMS.map((item) => {
            const isActive = item.sectionId === activeSection;
            return (
              <li key={item.label} className="relative">
                <a
                  href={item.href}
                  className={cn(
                    "relative py-1.5 text-[11px] font-medium tracking-[0.2em] transition-colors duration-200 focus:outline-none",
                    isActive
                      ? "text-silver-bright"
                      : "text-silver/70 hover:text-silver-bright"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-violet shadow-[0_0_10px_#818CF8]"
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right Actions: Bag Icon + Explore Store Pill Button */}
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            type="button"
            aria-label="View Shopping Bag"
            className="flex h-9 w-9 items-center justify-center rounded-full text-silver/80 transition-colors hover:text-silver-bright focus:outline-none focus-visible:ring-1 focus-visible:ring-violet"
          >
            <ShoppingBag className="h-[18px] w-[18px] stroke-[1.5]" />
          </button>

          <a
            href="#explore"
            aria-label="Explore Store"
            className="group inline-flex items-center gap-2 rounded-full border border-silver/30 bg-white/[0.03] px-4 py-2 text-[11px] font-medium tracking-[0.18em] text-silver-bright backdrop-blur-md transition-all duration-300 hover:border-silver/60 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-1 focus-visible:ring-violet sm:px-5 sm:py-2.5"
          >
            <span>EXPLORE STORE</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-silver/80 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-silver-bright" />
          </a>
        </div>
      </nav>
    </motion.header>
  );
}

export default Navbar;
