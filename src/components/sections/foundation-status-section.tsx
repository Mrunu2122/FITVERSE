"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Box, Cpu, FolderTree, Layers } from "lucide-react";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/ui/status-badge";
import { ASSET_PATHS, BRAND_CONFIG } from "@/lib/constants";

const ClientSceneCanvas = dynamic(
  () => import("@/components/scene/scene-canvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[320px] w-full items-center justify-center rounded-xl border border-charcoal-border bg-charcoal/60 font-mono text-xs uppercase tracking-widest text-silver-muted">
        Loading Client-Side 3D Engine...
      </div>
    ),
  }
);

const SYSTEM_MODULES = [
  {
    icon: Cpu,
    title: "Next.js App Router + TypeScript",
    detail: "Strict typing, modular path aliases (@/*), and zero-SSR WebGL boundary.",
  },
  {
    icon: Box,
    title: "Three.js + R3F + Drei",
    detail: "Isolated 3D scene & avatar architecture ready for GLTF/GLB assets.",
  },
  {
    icon: Layers,
    title: "Tailwind Dark Aesthetics + Motion",
    detail: "Obsidian, charcoal, silver, and ice-blue theme tokens with Framer Motion & GSAP.",
  },
  {
    icon: FolderTree,
    title: "Structured Asset Pipeline",
    detail: "Dedicated directories for avatars, clothing, environments, textures, and references.",
  },
];

export function FoundationStatusSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-6 lg:col-span-7"
          >
            <StatusBadge variant="silver">
              Phase 01 // Foundation Initialized
            </StatusBadge>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-silver-bright sm:text-4xl lg:text-5xl">
                {BRAND_CONFIG.name}{" "}
                <span className="font-light text-ice">
                  — {BRAND_CONFIG.tagline}
                </span>
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-silver sm:text-base">
                Project foundation and 3D spatial architecture are online. All
                scene components are isolated from UI layers and configured for
                client-safe rendering. Ready for landing page development and 3D
                garment/avatar integration.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {SYSTEM_MODULES.map((mod) => {
                const IconComponent = mod.icon;
                return (
                  <div
                    key={mod.title}
                    className="rounded-xl border border-charcoal-border bg-charcoal/70 p-4 transition-colors hover:border-ice/40"
                  >
                    <div className="mb-2 flex items-center gap-2.5 text-ice">
                      <IconComponent className="h-4 w-4 shrink-0" />
                      <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-silver-bright">
                        {mod.title}
                      </h2>
                    </div>
                    <p className="text-xs leading-relaxed text-silver-muted">
                      {mod.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl border border-charcoal-border bg-charcoal/90 p-4 shadow-2xl">
              <div className="mb-3 flex items-center justify-between border-b border-charcoal-border pb-2.5">
                <span className="font-mono text-xs uppercase tracking-widest text-silver">
                  R3F Client Viewport Probe
                </span>
                <span className="font-mono text-[11px] text-ice">
                  SSR: Disabled
                </span>
              </div>

              <div className="h-[320px] w-full">
                <ClientSceneCanvas />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px] text-silver-muted">
                <div className="rounded border border-charcoal-border/70 bg-obsidian/60 px-2.5 py-1.5">
                  AVATARS: <span className="text-silver">{ASSET_PATHS.avatars}</span>
                </div>
                <div className="rounded border border-charcoal-border/70 bg-obsidian/60 px-2.5 py-1.5">
                  CLOTHING: <span className="text-silver">{ASSET_PATHS.clothing}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
