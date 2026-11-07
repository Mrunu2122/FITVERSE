"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { SceneCanvasProps } from "@/types";
import { DEFAULT_CAMERA_CONFIG, cn } from "@/lib/constants";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { StudioEnvironment } from "@/components/scene/studio-environment";
import { HeroStageContent } from "@/components/scene/hero-stage-content";

/**
 * Client-only React Three Fiber Canvas wrapper.
 * Prevents SSR hydration mismatches and encapsulates WebGL context creation.
 */
export function SceneCanvas({
  children,
  camera,
  className,
  enableOrbitControls = true,
}: SceneCanvasProps) {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return (
      <div
        className={cn(
          "flex h-full min-h-[260px] w-full items-center justify-center bg-transparent",
          className
        )}
        aria-busy="true"
      />
    );
  }

  const resolvedCamera = {
    ...DEFAULT_CAMERA_CONFIG,
    ...camera,
  };

  return (
    <div
      className={cn(
        "relative h-full min-h-[260px] w-full overflow-hidden",
        className
      )}
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{
          position: resolvedCamera.position,
          fov: resolvedCamera.fov,
          near: resolvedCamera.near,
          far: resolvedCamera.far,
        }}
      >
        <Suspense fallback={null}>
          {children ?? <HeroStageContent />}
          {enableOrbitControls && (
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2.1}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default SceneCanvas;
