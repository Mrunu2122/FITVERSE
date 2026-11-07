"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRODUCT_SHOWCASE_DATA } from "@/lib/constants";
import { useViewportStore } from "@/store/viewport-context";
import { HeroContent } from "@/components/sections/hero-content";
import { ProductShowcaseSection } from "@/components/sections/product-showcase-section";
import { ExploreFitverseSection } from "@/components/sections/explore-fitverse-section";
import type { SectionId } from "@/types";

/**
 * Scroll budget (in viewport heights) of every pinned cinematic segment.
 * All segments play inside ONE pinned full-screen stage, strictly in sequence:
 *
 *   HERO 360° ROTATION -> SILK CURTAIN SWEEP -> JACKET -> SNEAKERS -> TROUSERS
 *
 * Segments never overlap, so only one presentation ever owns the viewport.
 */
const SEGMENT_VH = {
  heroRotation: 200,
  curtain: 160,
  jacket: 320,
  sneakers: 320,
  trousers: 320,
} as const;

const PRODUCT_ORDER = ["jacket", "sneakers", "trousers"] as const;

/** Offsets (vh) where each segment begins inside the pinned stage scroll range. */
const SEG_START = {
  heroRotation: 0,
  curtain: SEGMENT_VH.heroRotation,
  jacket: SEGMENT_VH.heroRotation + SEGMENT_VH.curtain,
  sneakers: SEGMENT_VH.heroRotation + SEGMENT_VH.curtain + SEGMENT_VH.jacket,
  trousers:
    SEGMENT_VH.heroRotation +
    SEGMENT_VH.curtain +
    SEGMENT_VH.jacket +
    SEGMENT_VH.sneakers,
} as const;

const TOTAL_PINNED_VH = SEG_START.trousers + SEGMENT_VH.trousers;

/**
 * Per-product local timeline phases (0..1 within the product's own segment).
 * Text reveals first, then the model enters, rotates 360°, exits, then text leaves.
 * Kept in sync with `PRODUCT_PHASES` in product-stage-models.tsx.
 */
const TEXT_IN_END = 0.1;
const TEXT_OUT_START = 0.93;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

/** Anchor positions (vh) used by navbar / pagination hash links. */
const ANCHORS: Array<{ id: SectionId; topVh: number }> = [
  { id: "hero", topVh: 0 },
  { id: "jacket", topVh: SEG_START.jacket + SEGMENT_VH.jacket * 0.4 },
  { id: "sneakers", topVh: SEG_START.sneakers + SEGMENT_VH.sneakers * 0.4 },
  { id: "trousers", topVh: SEG_START.trousers + SEGMENT_VH.trousers * 0.4 },
];

/**
 * Orchestrates the FITVERSE scroll campaign with a single GSAP ScrollTrigger pin.
 *
 * Why one pin: the previous implementation used ordinary stacked sections with
 * overlapping trigger ranges, so the outgoing and incoming 3D products were
 * visible at the same time and the text scrolled with the document. Now every
 * presentation shares the same pinned viewport and is driven from one
 * deterministic progress value, which makes overlap impossible and reverse
 * scrolling exact.
 */
export function CampaignScrollExperience() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroLayerRef = useRef<HTMLDivElement>(null);
  const productLayerRefs = useRef<Array<HTMLDivElement | null>>([]);

  const { setActiveSection, setActiveSectionNumber, scrollStateRef } =
    useViewportStore();

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    if (!wrapper || !stage) return;

    let lastSection: SectionId | null = null;
    const publishSection = (id: SectionId, num: number) => {
      if (lastSection === id) return;
      lastSection = id;
      setActiveSection(id);
      setActiveSectionNumber(num);
    };

    const applyProgress = (progress: number, velocity: number) => {
      const state = scrollStateRef.current;
      const s = progress * TOTAL_PINNED_VH; // scrolled distance in vh

      state.globalProgress = progress;
      state.scrollVelocity = Math.max(-1.5, Math.min(1.5, velocity / 2400));
      state.heroProgress = clamp01((s - SEG_START.heroRotation) / SEGMENT_VH.heroRotation);
      state.curtainProgress = clamp01((s - SEG_START.curtain) / SEGMENT_VH.curtain);
      state.jacketProgress = clamp01((s - SEG_START.jacket) / SEGMENT_VH.jacket);
      state.sneakersProgress = clamp01((s - SEG_START.sneakers) / SEGMENT_VH.sneakers);
      state.trousersProgress = clamp01((s - SEG_START.trousers) / SEGMENT_VH.trousers);

      // Hero UI stays perfectly still during rotation and is wiped away only
      // while the silk curtain passes over it.
      if (heroLayerRef.current) {
        const heroFade = 1 - smooth(clamp01((state.curtainProgress - 0.18) / 0.27));
        heroLayerRef.current.style.opacity = String(heroFade);
        heroLayerRef.current.style.visibility = heroFade < 0.01 ? "hidden" : "visible";
      }

      // Product editorial layers: stationary, opacity-only reveal so text never moves with scroll.
      const locals = [state.jacketProgress, state.sneakersProgress, state.trousersProgress];
      locals.forEach((q, i) => {
        const el = productLayerRefs.current[i];
        if (!el) return;
        const fadeIn = smooth(clamp01(q / TEXT_IN_END));
        const fadeOut = 1 - smooth(clamp01((q - TEXT_OUT_START) / (1 - TEXT_OUT_START)));
        const active = q > 0 && q < 1;
        const opacity = active ? fadeIn * fadeOut : 0;
        el.style.opacity = String(opacity);
        el.style.visibility = opacity < 0.01 ? "hidden" : "visible";
        // Staggered card reveal (cards only fade, they do not drift)
        el.querySelectorAll<HTMLElement>('[data-gsap-reveal="feature"]').forEach((card, ci) => {
          const cardIn = smooth(clamp01((q - 0.02 - ci * 0.02) / 0.07));
          card.style.opacity = String(cardIn);
        });
      });

      // Active section indicator
      if (s < SEG_START.curtain + SEGMENT_VH.curtain * 0.5) publishSection("hero", 1);
      else if (s < SEG_START.sneakers) publishSection("jacket", 2);
      else if (s < SEG_START.trousers) publishSection("sneakers", 3);
      else publishSection("trousers", 4);
    };

    const ctx = gsap.context(() => {
      // ONE pinned stage drives the whole hero -> curtain -> product sequence.
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        pin: stage,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => applyProgress(self.progress, self.getVelocity()),
        onRefresh: (self) => applyProgress(self.progress, 0),
      });

      // Section 05 hand-off (normal document flow after the pinned stage)
      const exploreEl = document.querySelector("#explore");
      if (exploreEl) {
        ScrollTrigger.create({
          trigger: exploreEl,
          start: "top 95%",
          end: "top 22%",
          scrub: true,
          onUpdate: (self) => {
            scrollStateRef.current.trousersToExploreProgress = self.progress;
          },
        });
        ScrollTrigger.create({
          trigger: exploreEl,
          start: "top 60%",
          end: "bottom bottom",
          onEnter: () => publishSection("explore", 5),
          onLeaveBack: () => publishSection("trousers", 4),
          onUpdate: (self) => {
            scrollStateRef.current.exploreProgress = self.progress;
          },
        });
      }
    }, wrapper);

    return () => ctx.revert();
  }, [scrollStateRef, setActiveSection, setActiveSectionNumber]);

  const products = PRODUCT_ORDER.map((key) => PRODUCT_SHOWCASE_DATA[key]);

  return (
    <div className="relative w-full">
      <div
        ref={wrapperRef}
        className="relative w-full"
        style={{ height: `${TOTAL_PINNED_VH + 100}vh` }}
      >
        {/* Hash-link anchors for navbar & pagination (stage itself is pinned) */}
        {ANCHORS.map((a) => (
          <div
            key={a.id}
            id={a.id}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 h-px w-px"
            style={{ top: `${a.topVh}vh` }}
          />
        ))}

        {/* ===== PINNED FULL-SCREEN PRESENTATION STAGE ===== */}
        <div ref={stageRef} className="relative h-screen w-full overflow-hidden">
          {/* SECTION 01 — HERO */}
          <section
            ref={heroLayerRef}
            data-section-id="hero"
            aria-label="Section 01 — Hero Fashion Avatar"
            className="absolute inset-0"
          >
            <HeroContent />
          </section>

          {/* SECTIONS 02–04 — one product layer at a time, same viewport */}
          {products.map((spec, i) => (
            <div
              key={spec.id}
              ref={(el) => {
                productLayerRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ opacity: 0, visibility: "hidden" }}
            >
              <ProductShowcaseSection spec={spec} />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 05 — EXPLORE FITVERSE */}
      <div className="pointer-events-auto relative">
        <ExploreFitverseSection />
      </div>
    </div>
  );
}

export default CampaignScrollExperience;
