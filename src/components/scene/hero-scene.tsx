"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import dynamic from "next/dynamic";
import { DEFAULT_CAMERA_CONFIG } from "@/lib/constants";
import { useViewportStore } from "@/store/viewport-context";

const ClientSceneCanvas = dynamic(
  () => import("@/components/scene/scene-canvas"),
  { ssr: false }
);

/**
 * Persistent full-viewport interactive 3D stage.
 * Supports full 360° mouse drag and mobile horizontal touch swipe with
 * smooth inertia, damping, and conflict-free arbitration with GSAP ScrollTrigger.
 */
export function HeroScene() {
  const { heroInteractionRef, setHeroZoomed } = useViewportStore();

  const dragStartRef = useRef<{
    active: boolean;
    pointerId: number | null;
    lastX: number;
    lastY: number;
    lastTime: number;
    isHorizontalIntent: boolean | null;
  }>({
    active: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    isHorizontalIntent: null,
  });

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    // Only primary mouse button or touch
    if (e.pointerType === "mouse" && e.button !== 0) return;

    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    dragStartRef.current = {
      active: true,
      pointerId: e.pointerId,
      lastX: e.clientX,
      lastY: e.clientY,
      lastTime: now,
      isHorizontalIntent: e.pointerType === "mouse" ? true : null,
    };

    const state = heroInteractionRef.current;
    state.isDragging = true;
    state.angularVelocity = 0;
    state.lastManualInteractionTime = now;

    if (e.pointerType === "mouse") {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore capture errors on synthetic events
      }
    }
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragStartRef.current;
    if (!drag.active || drag.pointerId !== e.pointerId) return;

    const dx = e.clientX - drag.lastX;
    const dy = e.clientY - drag.lastY;

    // On touch devices, determine whether the user is swiping horizontally (rotate 360°)
    // or scrolling vertically down the page
    if (drag.isHorizontalIntent === null) {
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      drag.isHorizontalIntent = Math.abs(dx) >= Math.abs(dy) * 0.85;
      if (!drag.isHorizontalIntent) {
        drag.active = false;
        heroInteractionRef.current.isDragging = false;
        return;
      }
    }

    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const dt = Math.max((now - drag.lastTime) / 1000, 0.004);

    // Full 360° rotation sensitivity: ~300px drag = 1 full 360° revolution
    const deltaAngle = dx * 0.0115;
    const state = heroInteractionRef.current;
    state.manualOffsetAzimuth += deltaAngle;
    state.angularVelocity = THREE.MathUtils.clamp(deltaAngle / dt, -14, 14);
    state.lastManualInteractionTime = now;

    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    drag.lastTime = now;
  };

  const handlePointerUpOrCancel = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragStartRef.current;
    if (!drag.active) return;

    drag.active = false;
    drag.pointerId = null;
    drag.isHorizontalIntent = null;

    const state = heroInteractionRef.current;
    state.isDragging = false;
    state.lastManualInteractionTime =
      typeof performance !== "undefined" ? performance.now() : Date.now();

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore release errors
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      onDoubleClick={() => setHeroZoomed((prev) => !prev)}
      style={{ touchAction: "pan-y" }}
      className="pointer-events-auto fixed inset-0 z-10 h-screen w-full cursor-grab overflow-hidden active:cursor-grabbing"
      aria-label="Interactive 3D Fashion Campaign Stage — Drag horizontally to rotate 360 degrees"
    >
      <ClientSceneCanvas
        camera={DEFAULT_CAMERA_CONFIG}
        enableOrbitControls={false}
        className="h-full w-full rounded-none border-0 bg-transparent"
      />
    </div>
  );
}

// Local clamp helper so we don't need full THREE import in this wrapper
const THREE = {
  MathUtils: {
    clamp: (val: number, min: number, max: number) =>
      Math.max(min, Math.min(max, val)),
  },
};

export default HeroScene;
