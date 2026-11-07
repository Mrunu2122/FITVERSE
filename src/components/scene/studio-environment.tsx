"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import type { Mesh } from "three";
import { AvatarRigMount } from "@/components/avatar/avatar-rig-mount";

/**
 * Pure 3D scene lighting, spatial reference grid, and calibration gyroscope.
 * Separated strictly from 2D DOM UI components.
 */
export function StudioEnvironment() {
  const calibrationRingRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (calibrationRingRef.current) {
      calibrationRingRef.current.rotation.y += delta * 0.35;
      calibrationRingRef.current.rotation.x += delta * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.4} color="#F2F4F8" />
      <pointLight position={[-3, 2, -2]} intensity={1.2} color="#7DD3FC" />

      <AvatarRigMount position={[0, 0.35, 0]}>
        <mesh ref={calibrationRingRef}>
          <octahedronGeometry args={[0.65, 0]} />
          <meshStandardMaterial
            color="#7DD3FC"
            emissive="#38BDF8"
            emissiveIntensity={0.25}
            wireframe
          />
        </mesh>
      </AvatarRigMount>

      <Grid
        position={[0, -0.6, 0]}
        args={[12, 12]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#1A1C23"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#38BDF8"
        fadeDistance={10}
        fadeStrength={1.5}
        infiniteGrid
      />
    </>
  );
}
