"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import type {
  AvatarPreviewMode,
  ScrollChoreographyRefState,
  SectionId,
} from "@/types";

export interface HeroInteractionRefState {
  /** Accumulated manual horizontal drag offset in radians */
  manualOffsetAzimuth: number;
  /** Angular velocity (radians/sec) for smooth post-drag inertia */
  angularVelocity: number;
  /** Whether user is currently dragging the 3D stage */
  isDragging: boolean;
  /** Timestamp (performance.now()) when user last dragged or spun manually */
  lastManualInteractionTime: number;
  /** Last scroll progress recorded during manual drag so scroll delta resumes cleanly */
  scrollAngleAtDragEnd: number;
  /** Current smoothed scroll rotation contribution */
  smoothedScrollAzimuth: number;
}

interface ViewportState {
  isSceneReady: boolean;
  setSceneReady: (ready: boolean) => void;
  wireframeMode: boolean;
  setWireframeMode: (enabled: boolean) => void;
  avatarMode: AvatarPreviewMode;
  setAvatarMode: (mode: AvatarPreviewMode) => void;
  hasCustomGlb: boolean;
  setHasCustomGlb: (available: boolean) => void;
  /** Active section ID ("hero" | "jacket" | "sneakers" | "trousers" | "explore") */
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
  /** Active 1-based section number (1..5) */
  activeSectionNumber: number;
  setActiveSectionNumber: (num: number) => void;
  /** Hero zoom toggle state */
  isHeroZoomed: boolean;
  setHeroZoomed: (zoomed: boolean | ((prev: boolean) => boolean)) => void;
  /** Trigger a smooth 360-degree showcase spin on the Hero avatar */
  triggerHero360Spin: () => void;
  /** High-frequency mutable scroll progress ref read inside Three.js useFrame */
  scrollStateRef: MutableRefObject<ScrollChoreographyRefState>;
  /** High-frequency mutable hero drag/inertia/scroll arbitration ref */
  heroInteractionRef: MutableRefObject<HeroInteractionRefState>;
}

const ViewportContext = createContext<ViewportState | undefined>(undefined);

export function ViewportProvider({ children }: { children: ReactNode }) {
  const [isSceneReady, setSceneReady] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [avatarMode, setAvatarMode] = useState<AvatarPreviewMode>("stylized");
  const [hasCustomGlb, setHasCustomGlb] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [activeSectionNumber, setActiveSectionNumber] = useState<number>(1);
  const [isHeroZoomed, setHeroZoomed] = useState<boolean>(false);

  const scrollStateRef = useRef<ScrollChoreographyRefState>({
    globalProgress: 0,
    heroProgress: 0,
    curtainProgress: 0,
    jacketProgress: 0,
    jacketToSneakersProgress: 0,
    sneakersProgress: 0,
    sneakersToTrousersProgress: 0,
    trousersProgress: 0,
    trousersToExploreProgress: 0,
    exploreProgress: 0,
    scrollVelocity: 0,
  });

  const heroInteractionRef = useRef<HeroInteractionRefState>({
    manualOffsetAzimuth: 0,
    angularVelocity: 0,
    isDragging: false,
    lastManualInteractionTime: 0,
    scrollAngleAtDragEnd: 0,
    smoothedScrollAzimuth: 0,
  });

  const triggerHero360Spin = useCallback(() => {
    const state = heroInteractionRef.current;
    // Impart a smooth 360° angular velocity impulse
    state.angularVelocity = Math.PI * 2.6;
    state.lastManualInteractionTime =
      typeof performance !== "undefined" ? performance.now() : Date.now();
  }, []);

  return (
    <ViewportContext.Provider
      value={{
        isSceneReady,
        setSceneReady,
        wireframeMode,
        setWireframeMode,
        avatarMode,
        setAvatarMode,
        hasCustomGlb,
        setHasCustomGlb,
        activeSection,
        setActiveSection,
        activeSectionNumber,
        setActiveSectionNumber,
        isHeroZoomed,
        setHeroZoomed,
        triggerHero360Spin,
        scrollStateRef,
        heroInteractionRef,
      }}
    >
      {children}
    </ViewportContext.Provider>
  );
}

export function useViewportStore(): ViewportState {
  const context = useContext(ViewportContext);
  if (!context) {
    throw new Error("useViewportStore must be used within a ViewportProvider");
  }
  return context;
}
