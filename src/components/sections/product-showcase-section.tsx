"use client";

import {
  Box,
  Feather,
  Footprints,
  Grid,
  Layers,
  Maximize2,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import type { ProductFeatureItem, ProductShowcaseSpec } from "@/types";

function FeatureIcon({ icon }: { icon: ProductFeatureItem["icon"] }) {
  const iconClass = "h-5 w-5 text-violet stroke-[1.6]";
  switch (icon) {
    case "fabric":
      return <Grid className={iconClass} />;
    case "layers":
      return <Layers className={iconClass} />;
    case "sparkles":
      return <Sparkles className={iconClass} />;
    case "cushion":
      return <Waves className={iconClass} />;
    case "feather":
      return <Feather className={iconClass} />;
    case "grip":
      return <Footprints className={iconClass} />;
    case "pockets":
      return <Box className={iconClass} />;
    case "flex":
      return <Maximize2 className={iconClass} />;
    case "shield":
      return <ShieldCheck className={iconClass} />;
  }
}

export interface ProductShowcaseSectionProps {
  spec: ProductShowcaseSpec;
}

/**
 * Editorial Product Showcase Section used for:
 * - Section 02: THE JACKET
 * - Section 03: THE SNEAKERS
 * - Section 04: THE TROUSERS
 *
 * Matches the visual storyboard layout with left editorial typography,
 * a central 3D product stage window, and right-aligned feature highlights.
 */
export function ProductShowcaseSection({ spec }: ProductShowcaseSectionProps) {
  return (
    <section
      data-section-id={spec.id}
      aria-labelledby={`${spec.id}-heading`}
      className="pointer-events-none relative z-20 flex h-full w-full items-center py-20 lg:py-24"
    >
      {/* Subtle section top/bottom atmospheric separator glow */}
      <div
        aria-hidden="true"
        className="hidden"
      />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-between px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left Editorial Column (Shifted slightly right on xl to accommodate 3D left silk drape) */}
          <div className="pointer-events-auto flex flex-col items-start lg:col-span-4">
            {/* Eyebrow Line + OUR CRAFT */}
            <div
              data-gsap-reveal="eyebrow"
              className="mb-4 flex items-center gap-3.5"
            >
              <span
                aria-hidden="true"
                className="h-[1.5px] w-8 bg-violet/85 shadow-[0_0_8px_#818CF8]"
              />
              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-silver/85">
                {spec.eyebrow}
              </span>
            </div>

            {/* Large Editorial Title: THE / JACKET. */}
            <h2
              id={`${spec.id}-heading`}
              data-gsap-reveal="title"
              className="flex flex-col text-left leading-[0.95] text-silver-bright"
            >
              <span className="font-serif text-4xl font-normal tracking-[0.06em] sm:text-5xl xl:text-[58px]">
                {spec.titlePrefix}
              </span>
              <span className="mt-1 font-serif text-5xl font-normal italic tracking-[0.05em] text-violet/90 drop-shadow-[0_0_28px_rgba(129,140,248,0.28)] sm:text-6xl xl:text-[68px]">
                {spec.titleAccent}
              </span>
            </h2>

            {/* Supporting Lead & Description */}
            <div
              data-gsap-reveal="copy"
              className="mt-6 max-w-[330px] space-y-1.5 text-sm font-light leading-relaxed text-silver/80 sm:text-[15px]"
            >
              <p className="font-normal text-silver-bright/95">{spec.subtitle}</p>
              <p>{spec.description}</p>
            </div>

            {/* Section Index Pill */}
            <div
              data-gsap-reveal="copy"
              className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-obsidian/65 px-4 py-1.5 backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet shadow-[0_0_8px_#818CF8]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-silver/70">
                SECTION {spec.sectionNumber} // 3D ARTIFACT
              </span>
            </div>
          </div>

          {/* Center 3D Product Window (Open space for the floating 3D GLB model) */}
          <div className="pointer-events-none relative flex min-h-[300px] flex-col items-center justify-end lg:col-span-4 lg:min-h-[460px]">
            <div className="rounded-full border border-white/[0.08] bg-obsidian/55 px-4 py-1.5 text-[9px] font-medium uppercase tracking-[0.26em] text-silver/60 backdrop-blur-md">
              360° INTERACTIVE 3D MODEL
            </div>
          </div>

          {/* Right Feature Highlights Column */}
          <div className="pointer-events-auto flex flex-col gap-6 lg:col-span-4 lg:items-start lg:pl-8 xl:pl-12">
            {spec.features.map((feature) => (
              <div
                key={feature.id}
                data-gsap-reveal="feature"
                className="group flex w-full max-w-[360px] items-center gap-4 rounded-2xl border border-white/[0.06] bg-obsidian/55 p-3.5 backdrop-blur-md transition-all duration-300 hover:border-violet/45 hover:bg-obsidian/80 sm:gap-5 sm:p-4"
              >
                {/* Circular Glass Icon Badge matching Storyboard */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet/40 bg-violet/[0.08] shadow-[0_0_18px_rgba(129,140,248,0.18)] transition-transform duration-300 group-hover:scale-105 group-hover:border-violet/75">
                  <FeatureIcon icon={feature.icon} />
                </div>

                {/* Feature Title & Description */}
                <div className="flex flex-col">
                  <h3 className="text-sm font-medium tracking-[0.03em] text-silver-bright sm:text-[15px]">
                    {feature.title}
                  </h3>
                  <p className="mt-0.5 text-xs font-light leading-relaxed text-silver/70 sm:text-[13px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductShowcaseSection;
