"use client";

import { BRAND_CONFIG } from "@/lib/constants";
import { useViewportStore } from "@/store/viewport-context";

/**
 * Minimal bottom editorial footer bar with copyright, center manifesto, and dynamic section indicator.
 */
export function LandingFooter() {
  const { activeSectionNumber } = useViewportStore();
  const formattedSection = String(activeSectionNumber).padStart(2, "0");

  return (
    <footer className="relative z-30 w-full border-t border-white/[0.08] bg-obsidian/80 px-6 py-5 backdrop-blur-md sm:px-10 lg:px-14">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 text-[10px] font-medium uppercase tracking-[0.28em] text-silver/65 sm:flex-row">
        <span>{BRAND_CONFIG.copyright}</span>
        <span className="text-silver/75">{BRAND_CONFIG.footerTagline}</span>
        <span className="font-mono text-silver/85">
          {formattedSection} — 05
        </span>
      </div>
    </footer>
  );
}

export default LandingFooter;
