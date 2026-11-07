"use client";

import { ArrowUpRight, Compass, Layers, Sparkles } from "lucide-react";
import { EXPLORE_DESTINATIONS } from "@/lib/constants";

/**
 * Section 05 — EXPLORE FITVERSE
 * Final visual destination portal with three luxury interactive navigation cards:
 * 1. Explore Collection
 * 2. Enter the 3D Showroom
 * 3. Virtual Try-On
 */
export function ExploreFitverseSection() {
  const getPortalIcon = (id: string) => {
    const cls = "h-5 w-5 text-violet stroke-[1.6]";
    if (id === "explore-collection") return <Layers className={cls} />;
    if (id === "enter-3d-showroom") return <Compass className={cls} />;
    return <Sparkles className={cls} />;
  };

  return (
    <section
      id="explore"
      data-section-id="explore"
      aria-labelledby="explore-fitverse-heading"
      className="pointer-events-none relative z-20 flex min-h-screen w-full flex-col justify-center border-t border-white/[0.06] py-24 lg:py-28"
    >
      {/* Top separator glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent"
      />

      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-14">
        {/* Section Header */}
        <div className="pointer-events-auto mx-auto max-w-2xl text-center">
          <div
            data-gsap-reveal="eyebrow"
            className="mb-4 inline-flex items-center gap-3"
          >
            <span
              aria-hidden="true"
              className="h-[1.5px] w-7 bg-violet/80 shadow-[0_0_8px_#818CF8]"
            />
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-violet/90">
              SECTION 05 // DESTINATION PORTALS
            </span>
            <span
              aria-hidden="true"
              className="h-[1.5px] w-7 bg-violet/80 shadow-[0_0_8px_#818CF8]"
            />
          </div>

          <h2
            id="explore-fitverse-heading"
            data-gsap-reveal="title"
            className="text-4xl font-light tracking-[0.06em] text-silver-bright sm:text-5xl xl:text-6xl"
          >
            EXPLORE{" "}
            <span className="font-serif italic text-violet/95">FITVERSE.</span>
          </h2>

          <p
            data-gsap-reveal="copy"
            className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-silver/75 sm:text-[15px]"
          >
            Step beyond static lookbooks. Choose your portal into the FITVERSE
            spatial fashion ecosystem.
          </p>
        </div>

        {/* Three Visual Destination Portal Cards */}
        <div className="pointer-events-auto mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
          {EXPLORE_DESTINATIONS.map((card) => (
            <a
              key={card.id}
              href={card.href}
              data-gsap-reveal="feature"
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.1] bg-obsidian/75 p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-violet/60 hover:bg-obsidian/90 hover:shadow-[0_0_40px_rgba(129,140,248,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet sm:p-8"
            >
              {/* Subtle top-right radial glow on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-violet/15 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              />

              <div>
                {/* Top Row: Index + Badge + Icon */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-violet/35 bg-violet/[0.08] px-3 py-1 font-mono text-[10px] tracking-[0.22em] text-silver/85">
                    {card.badge}
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] transition-colors duration-300 group-hover:border-violet/50 group-hover:bg-violet/15">
                    {getPortalIcon(card.id)}
                  </div>
                </div>

                {/* Eyebrow & Title */}
                <div className="mt-7">
                  <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-violet/85">
                    {card.eyebrow}
                  </span>
                  <h3 className="mt-1.5 font-serif text-2xl font-normal italic tracking-[0.03em] text-silver-bright sm:text-3xl">
                    {card.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="mt-3.5 text-xs font-light leading-relaxed text-silver/75 sm:text-sm">
                  {card.description}
                </p>
              </div>

              {/* Bottom CTA Row */}
              <div className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-silver-bright group-hover:text-white">
                  {card.ctaLabel}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-silver/25 bg-white/[0.03] transition-all duration-300 group-hover:border-silver-bright group-hover:bg-silver-bright group-hover:text-obsidian">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExploreFitverseSection;
