import { Navbar } from "@/components/layout/navbar";
import { SectionPagination } from "@/components/layout/section-pagination";
import { LandingFooter } from "@/components/layout/landing-footer";
import { HeroScene } from "@/components/scene/hero-scene";
import { CampaignScrollExperience } from "@/components/sections/campaign-scroll-experience";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-obsidian bg-cyber-grid">
      {/* Persistent Atmospheric Lighting Overlays */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* Top-center subtle spotlight glow */}
        <div className="animate-ambient-glow absolute left-[52%] top-[-12%] h-[520px] w-[620px] -translate-x-1/2 rounded-full bg-violet/15 blur-[135px]" />
        {/* Pedestal / stage floor reflection glow */}
        <div className="absolute bottom-[6%] left-[52%] h-[240px] w-[540px] -translate-x-1/2 rounded-full bg-ice/10 blur-[110px]" />
      </div>

      {/* Fixed Top Navigation */}
      <Navbar />

      {/* Fixed Right-Edge Section Pagination Dots (01 .. 05) */}
      <SectionPagination />

      {/* Persistent Interactive 3D Campaign Stage (Avatar, 3D Silk Curtain, Jacket, Sneakers, Trousers) */}
      <HeroScene />

      {/* Multi-Section GSAP Scroll-Choreographed Editorial Foreground */}
      {/* pointer-events-none lets mouse drag / touch swipe reach the 3D model behind the UI;
          interactive controls opt back in with pointer-events-auto. */}
      <main className="pointer-events-none relative z-20 flex flex-1 flex-col">
        <CampaignScrollExperience />
      </main>

      {/* Minimal Bottom Footer */}
      <LandingFooter />
    </div>
  );
}
