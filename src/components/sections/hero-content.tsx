"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Hand,
  Rotate3d,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { BRAND_CONFIG, cn } from "@/lib/constants";
import { useViewportStore } from "@/store/viewport-context";
import type { AvatarPreviewMode } from "@/types";

/**
 * Section 01 — Hero Foreground UI.
 * Matches the FITVERSE visual identity and the multi-section storyboard controls:
 * - Left: Editorial headline (`WEAR YOUR WORLD.`), description, and CTAs.
 * - Center-right floating badge: `360° ROTATE` orbital cue.
 * - Right: Interactive 3D HUD control stack (`DRAG TO ROTATE`, `360° VIEW`, `ZOOM`)
 *   + Avatar mode indicator.
 */
export function HeroContent() {
  const {
    setAvatarMode,
    isHeroZoomed,
    setHeroZoomed,
    triggerHero360Spin,
  } = useViewportStore();

  const handleModeSwitch = (mode: AvatarPreviewMode) => {
    setAvatarMode(mode);
  };

  return (
    <div className="pointer-events-none relative z-20 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-between px-6 pb-10 pt-24 sm:px-10 lg:px-14 lg:pb-12 lg:pt-28">
      {/* Main Split Editorial Row */}
      <div className="my-auto grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left Column: Editorial Headline + Supporting Copy + CTAs */}
        <div className="pointer-events-auto flex flex-col items-start lg:col-span-5">
          {/* Eyebrow Line + Label */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mb-4 flex items-center gap-3.5 sm:mb-6"
          >
            <span
              aria-hidden="true"
              className="h-[1.5px] w-9 bg-violet/80 shadow-[0_0_8px_#818CF8]"
            />
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-violet/90 sm:text-xs">
              {BRAND_CONFIG.subtitle}
            </span>
          </motion.div>

          {/* Editorial Headline: WEAR / YOUR / WORLD. */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col text-left leading-[0.94] tracking-[0.04em] text-silver-bright"
          >
            <span className="text-5xl font-light tracking-[0.08em] sm:text-6xl xl:text-[76px]">
              WEAR
            </span>
            <span className="mt-1 text-5xl font-light tracking-[0.08em] sm:text-6xl xl:text-[76px]">
              YOUR
            </span>
            <span className="mt-1 font-serif text-5xl font-normal italic tracking-[0.06em] text-silver/95 sm:text-6xl xl:text-[80px]">
              WORLD.
            </span>
          </motion.h1>

          {/* Short Supporting Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32, ease: "easeOut" }}
            className="mt-5 max-w-[390px] text-sm font-light leading-relaxed text-silver/80 sm:mt-6 sm:text-[15px]"
          >
            {BRAND_CONFIG.description}
          </motion.p>

          {/* Two CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.42, ease: "easeOut" }}
            className="mt-7 flex flex-wrap items-center gap-4 sm:mt-9"
          >
            <a
              href="#jacket"
              aria-label="Enter Showroom"
              className="group inline-flex items-center gap-3 rounded-full bg-silver-bright px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-obsidian shadow-[0_0_25px_rgba(245,247,250,0.2)] transition-all duration-300 hover:bg-white hover:shadow-[0_0_32px_rgba(245,247,250,0.38)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet sm:px-7"
            >
              <span>ENTER SHOWROOM</span>
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[2] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <a
              href="#explore"
              aria-label="Try It On"
              className="inline-flex items-center justify-center rounded-full border border-silver/30 bg-white/[0.02] px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-silver-bright backdrop-blur-sm transition-all duration-300 hover:border-silver/65 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet sm:px-8"
            >
              TRY IT ON
            </a>
          </motion.div>
        </div>

        {/* Center Column: Spacer for 3D Avatar + Floating 360° ROTATE Indicator */}
        <div className="pointer-events-none relative flex min-h-[320px] items-center justify-end lg:col-span-4 lg:min-h-[460px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="pointer-events-none hidden flex-col items-center text-center lg: mr-[-28px] lg:flex"
          >
            <span className="text-sm font-semibold tracking-[0.14em] text-silver-bright/90">
              360°
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.26em] text-silver/65">
              ROTATE
            </span>
          </motion.div>
        </div>

        {/* Right Column: Interactive 3D HUD Controls (Matching Storyboard) + Avatar Mode */}
        <div className="flex flex-col items-center justify-between gap-6 lg:col-span-3 lg:items-end lg:pr-6">
          {/* 3 Stacked Glassmorphic 3D Control Cards from Storyboard */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.44, ease: "easeOut" }}
            className="pointer-events-auto flex flex-row items-center gap-3 lg:flex-col lg:gap-3.5"
            role="group"
            aria-label="3D Avatar Interactive Controls"
          >
            {/* Card 1: DRAG TO ROTATE */}
            <button
              type="button"
              onClick={triggerHero360Spin}
              aria-label="Drag horizontally on the model to rotate 360 degrees"
              className="group flex h-[76px] w-[86px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-violet/35 bg-obsidian/65 px-2.5 py-2 text-center shadow-[0_0_24px_rgba(129,140,248,0.12)] backdrop-blur-md transition-all duration-300 hover:border-violet/75 hover:bg-violet/[0.12] focus:outline-none focus-visible:ring-1 focus-visible:ring-violet sm:h-[82px] sm:w-[92px]"
            >
              <Hand className="h-5 w-5 text-silver-bright transition-transform duration-300 group-hover:scale-110" />
              <span className="text-[8.5px] font-medium uppercase leading-tight tracking-[0.16em] text-silver/85">
                DRAG TO
                <br />
                ROTATE
              </span>
            </button>

            {/* Card 2: 360° VIEW */}
            <button
              type="button"
              onClick={triggerHero360Spin}
              aria-label="Trigger 360 degree showcase rotation"
              className="group flex h-[76px] w-[86px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-silver/25 bg-obsidian/65 px-2.5 py-2 text-center backdrop-blur-md transition-all duration-300 hover:border-violet/70 hover:bg-violet/[0.12] focus:outline-none focus-visible:ring-1 focus-visible:ring-violet sm:h-[82px] sm:w-[92px]"
            >
              <Rotate3d className="h-5 w-5 text-silver-bright transition-transform duration-500 group-hover:rotate-180" />
              <span className="text-[8.5px] font-medium uppercase tracking-[0.16em] text-silver/85">
                360° VIEW
              </span>
            </button>

            {/* Card 3: ZOOM */}
            <button
              type="button"
              aria-pressed={isHeroZoomed}
              onClick={() => setHeroZoomed((prev) => !prev)}
              aria-label={isHeroZoomed ? "Zoom out to full body view" : "Zoom in on garment details"}
              className={cn(
                "group flex h-[76px] w-[86px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-2.5 py-2 text-center backdrop-blur-md transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-violet sm:h-[82px] sm:w-[92px]",
                isHeroZoomed
                  ? "border-violet bg-violet/20 shadow-[0_0_24px_rgba(129,140,248,0.28)]"
                  : "border-silver/25 bg-obsidian/65 hover:border-violet/70 hover:bg-violet/[0.12]"
              )}
            >
              {isHeroZoomed ? (
                <ZoomOut className="h-5 w-5 text-silver-bright transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <ZoomIn className="h-5 w-5 text-silver-bright transition-transform duration-300 group-hover:scale-110" />
              )}
              <span className="text-[8.5px] font-medium uppercase tracking-[0.16em] text-silver/85">
                {isHeroZoomed ? "RESET ZOOM" : "ZOOM"}
              </span>
            </button>
          </motion.div>

          {/* Compact Avatar Preview Selector Widget */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.52, ease: "easeOut" }}
            className="pointer-events-auto flex flex-col items-center lg:items-end"
          >
            <span
              id="avatar-preview-label"
              className="mb-2 text-[9px] font-medium uppercase tracking-[0.28em] text-silver/65"
            >
              AVATAR PREVIEW
            </span>

            <div
              role="group"
              aria-labelledby="avatar-preview-label"
              className="inline-flex items-center rounded-full border border-silver/25 bg-obsidian/80 p-1 backdrop-blur-md"
            >
              <button
                type="button"
                aria-pressed={true}
                onClick={() => handleModeSwitch("stylized")}
                className="rounded-full bg-silver-bright px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-obsidian shadow-[0_0_16px_rgba(245,247,250,0.22)] transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-violet"
              >
                STYLIZED
              </button>

              <button
                type="button"
                disabled
                aria-disabled="true"
                title="Realistic GLB model coming soon"
                className="cursor-not-allowed rounded-full px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-silver/40 transition-all duration-300"
              >
                REALISTIC
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Row: Minimal Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="pointer-events-auto mt-6 flex items-center justify-between pt-2 lg:mt-0"
      >
        <a
          href="#jacket"
          aria-label="Scroll to discover The Jacket"
          className="group inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.26em] text-silver/70 transition-colors hover:text-silver-bright focus:outline-none"
        >
          <ArrowDown className="h-3.5 w-3.5 text-silver/70 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-silver-bright" />
          <span>SCROLL TO DISCOVER</span>
        </a>

        <span className="hidden font-mono text-[10px] tracking-[0.28em] text-silver/55 sm:inline">
          01 — 05
        </span>
      </motion.div>
    </div>
  );
}

export default HeroContent;
