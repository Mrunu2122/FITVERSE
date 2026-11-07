"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useViewportStore } from "@/store/viewport-context";
import { FashionAvatar } from "@/components/avatar/fashion-avatar";
import { FabricCurtainMesh } from "@/components/scene/fabric-curtain-mesh";
import { ProductStageModels } from "@/components/scene/product-stage-models";

/**
 * Generates a soft radial canvas texture for the glowing pedestal halo on the floor
 * (avoids rectangular plane artifacts).
 */
function createRadialGlowTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  grad.addColorStop(0, "rgba(129, 140, 248, 0.48)");
  grad.addColorStop(0.45, "rgba(99, 102, 241, 0.24)");
  grad.addColorStop(0.75, "rgba(56, 189, 248, 0.07)");
  grad.addColorStop(1, "rgba(5, 5, 9, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Master 3D Stage Content for the FITVERSE campaign:
 * - Section 01: Hero Avatar (`fitverse-avatar.glb`) with 360° drag/swipe inertia,
 *   360° scroll-synchronized rotation, conflict-free arbitration, and zoom.
 * - Transition 01 -> 02: 3D Iridescent Silk Fabric Curtain (`FabricCurtainMesh`).
 * - Sections 02, 03, 04: Standalone 3D Product Showcases (`ProductStageModels`).
 * - Section 05: Ambient spatial portal rings for Explore FITVERSE.
 */
export function HeroStageContent() {
  const {
    avatarMode,
    isHeroZoomed,
    scrollStateRef,
    heroInteractionRef,
  } = useViewportStore();
  const { viewport, camera } = useThree();

  const heroGroupRef = useRef<THREE.Group>(null);
  const characterRigRef = useRef<THREE.Group>(null);
  const luminousArcRef = useRef<THREE.Group>(null);
  const neonBaseRingRef = useRef<THREE.Mesh>(null);
  const orbitGuideGroupRef = useRef<THREE.Group>(null);
  const explorePortalGroupRef = useRef<THREE.Group>(null);

  // Responsive framing: shift slightly right on wide desktop screens so the left headline never overlaps,
  // and center cleanly on mobile/tablet screens.
  const isCompactViewport = viewport.width < 3.6;
  const stageOffsetX = isCompactViewport ? 0 : 0.14;
  const stageOffsetY = isCompactViewport ? 0.06 : 0.08;
  const stageScale = isCompactViewport ? 0.84 : 0.96;

  // Custom tapered crescent arc geometry so the ends fade smoothly like the reference image
  const crescentGeometries = useMemo(() => {
    const createTaperedArc = (radius: number, maxTube: number, arcSpan = Math.PI * 1.12) => {
      const geo = new THREE.TorusGeometry(radius, maxTube, 16, 120, arcSpan);
      const pos = geo.attributes.position;
      const uv = geo.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        const u = uv.getX(i);
        const angle = u * arcSpan;
        const centerX = radius * Math.cos(angle);
        const centerY = radius * Math.sin(angle);
        const taper = Math.pow(Math.sin(u * Math.PI), 0.75);
        const dx = pos.getX(i) - centerX;
        const dy = pos.getY(i) - centerY;
        const dz = pos.getZ(i);
        pos.setXYZ(i, centerX + dx * taper, centerY + dy * taper, dz * taper);
      }
      geo.computeVertexNormals();
      return geo;
    };

    return {
      core: createTaperedArc(0.86, 0.005),
      innerGlow: createTaperedArc(0.86, 0.015),
      outerHalo: createTaperedArc(0.86, 0.036),
      orbitArcFront: createTaperedArc(0.66, 0.0035, Math.PI * 0.72),
    };
  }, []);

  const floorGlowTexture = useMemo(() => createRadialGlowTexture(), []);

  const stageMaterials = useMemo(() => {
    const neonRim = new THREE.MeshBasicMaterial({
      color: "#E0E7FF",
    });

    const neonMidGlow = new THREE.MeshBasicMaterial({
      color: "#818CF8",
      transparent: true,
      opacity: 0.7,
    });

    const arcCore = new THREE.MeshBasicMaterial({
      color: "#E0E7FF",
    });

    const arcInnerGlow = new THREE.MeshBasicMaterial({
      color: "#93C5FD",
      transparent: true,
      opacity: 0.45,
    });

    const arcHalo = new THREE.MeshBasicMaterial({
      color: "#818CF8",
      transparent: true,
      opacity: 0.18,
    });

    const orbitArcMat = new THREE.MeshBasicMaterial({
      color: "#C4B5FD",
      transparent: true,
      opacity: 0.55,
    });

    return {
      neonRim,
      neonMidGlow,
      arcCore,
      arcInnerGlow,
      arcHalo,
      orbitArcMat,
    };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const scroll = scrollStateRef.current;
    const interaction = heroInteractionRef.current;
    const clampedDelta = Math.min(delta, 0.05);

    // =========================================================================
    // 1. CAMERA ZOOM CHOREOGRAPHY (Hero Zoom Toggle + Section Framing)
    // =========================================================================
    const isHeroActive = scroll.curtainProgress < 0.52;
    const targetCamZ = isHeroActive && isHeroZoomed ? 3.55 : 5.2;
    const targetCamY = isHeroActive && isHeroZoomed ? 0.54 : 0.35;

    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetCamZ,
      clampedDelta * 4.5
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      targetCamY,
      clampedDelta * 4.5
    );

    // =========================================================================
    // 2. HERO AVATAR VISIBILITY & 360° ROTATION (Manual Drag + Inertia + Scroll)
    // =========================================================================
    if (heroGroupRef.current) {
      // Hide Hero avatar cleanly once the 3D silk curtain covers the viewport (curtainProgress >= 0.50)
      heroGroupRef.current.visible = isHeroActive;
    }

    // Apply angular inertia damping when user releases a drag or triggers 360° spin
    if (!interaction.isDragging && Math.abs(interaction.angularVelocity) > 0.0005) {
      interaction.manualOffsetAzimuth += interaction.angularVelocity * clampedDelta;
      // Exponential damping for silky luxury turntable feel
      interaction.angularVelocity *= Math.exp(-3.8 * clampedDelta);
    } else if (!interaction.isDragging) {
      interaction.angularVelocity = 0;
    }

    // ONE shared rotation state: total yaw = scroll angle (exactly 360° across the pinned
    // hero segment) + accumulated manual drag offset. Both are additive, so dragging never
    // fights the scroll timeline and scrolling resumes from wherever the user left the model.
    const rawScrollAngle = scroll.heroProgress * Math.PI * 2;
    interaction.smoothedScrollAzimuth = THREE.MathUtils.lerp(
      interaction.smoothedScrollAzimuth,
      rawScrollAngle,
      Math.min(1, clampedDelta * 8.0)
    );

    if (characterRigRef.current && isHeroActive) {
      // Subtle pointer parallax only when not dragging
      const pointerParallaxY = interaction.isDragging ? 0 : state.pointer.x * 0.22;
      const pointerParallaxX = interaction.isDragging ? 0 : -state.pointer.y * 0.03;

      const totalTargetY =
        interaction.manualOffsetAzimuth +
        interaction.smoothedScrollAzimuth +
        pointerParallaxY;

      characterRigRef.current.rotation.y = THREE.MathUtils.lerp(
        characterRigRef.current.rotation.y,
        totalTargetY,
        interaction.isDragging ? Math.min(1, clampedDelta * 18) : clampedDelta * 6.5
      );
      characterRigRef.current.rotation.x = THREE.MathUtils.lerp(
        characterRigRef.current.rotation.x,
        pointerParallaxX,
        clampedDelta * 4.0
      );
    }

    // Subtle rotation on the 360° orbital guide ring around the avatar
    if (orbitGuideGroupRef.current && isHeroActive) {
      orbitGuideGroupRef.current.rotation.y =
        t * 0.25 + (interaction.manualOffsetAzimuth + interaction.smoothedScrollAzimuth) * 0.35;
    }

    // Subtle parallax & breathing on the luminous background arc
    if (luminousArcRef.current && isHeroActive) {
      const arcTargetX = 0.24 + state.pointer.x * -0.05;
      const arcTargetY = 0.34 + Math.sin(t * 0.8) * 0.02;
      luminousArcRef.current.position.x = THREE.MathUtils.lerp(
        luminousArcRef.current.position.x,
        arcTargetX,
        clampedDelta * 2.5
      );
      luminousArcRef.current.position.y = THREE.MathUtils.lerp(
        luminousArcRef.current.position.y,
        arcTargetY,
        clampedDelta * 2.5
      );
    }

    // Subtle pulsing on the pedestal neon ring
    if (neonBaseRingRef.current && isHeroActive) {
      const scalePulse = 1 + Math.sin(t * 2.2) * 0.006;
      neonBaseRingRef.current.scale.set(scalePulse, scalePulse, 1);
    }

    // =========================================================================
    // 3. SECTION 05 — EXPLORE PORTAL RINGS
    // =========================================================================
    const exploreVisibility = THREE.MathUtils.smoothstep(
      scroll.trousersToExploreProgress,
      0.35,
      0.95
    );
    if (explorePortalGroupRef.current) {
      explorePortalGroupRef.current.visible = exploreVisibility > 0.01;
      if (explorePortalGroupRef.current.visible) {
        explorePortalGroupRef.current.rotation.z = t * 0.14;
        explorePortalGroupRef.current.rotation.x = Math.sin(t * 0.5) * 0.12;
        explorePortalGroupRef.current.scale.setScalar(
          THREE.MathUtils.lerp(0.6, 1.15, exploreVisibility)
        );
      }
    }
  });

  return (
    <>
      {/* ================= GLOBAL STUDIO LIGHTING ================= */}
      <ambientLight intensity={1.18} color="#F1F5F9" />
      <hemisphereLight args={["#FFFFFF", "#312E81", 1.15]} />

      {/* Front-center neutral white editorial key light */}
      <directionalLight
        position={[0.6, 2.6, 4.2]}
        intensity={2.85}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Top-right cool ice-blue highlight for iridescent sheen */}
      <spotLight
        position={[2.6, 3.4, 2.8]}
        angle={0.6}
        penumbra={0.9}
        intensity={4.2}
        color="#BAE6FD"
      />

      {/* Left soft lavender-violet rim light */}
      <pointLight
        position={[-2.4, 1.5, 2.2]}
        intensity={2.8}
        color="#C4B5FD"
        distance={7.5}
      />

      {/* Back rim light to separate silhouette from dark background */}
      <pointLight
        position={[0.4, 2.0, -2.2]}
        intensity={3.2}
        color="#93C5FD"
        distance={6.5}
      />

      {/* Upward subtle violet-indigo bounce light */}
      <pointLight
        position={[0, -1.0, 0.9]}
        intensity={1.6}
        color="#818CF8"
        distance={4.0}
      />

      {/* ================= SECTION 01: HERO AVATAR STAGE ================= */}
      <group
        ref={heroGroupRef}
        position={[stageOffsetX, stageOffsetY, 0]}
        scale={stageScale}
        name="section-01-hero-stage"
      >
        {/* Luminous Crescent Arc Behind Avatar */}
        <group
          ref={luminousArcRef}
          position={[0.24, 0.34, -0.45]}
          rotation={[0, 0, -0.92]}
        >
          <mesh
            geometry={crescentGeometries.core}
            material={stageMaterials.arcCore}
          />
          <mesh
            geometry={crescentGeometries.innerGlow}
            material={stageMaterials.arcInnerGlow}
          />
          <mesh
            geometry={crescentGeometries.outerHalo}
            material={stageMaterials.arcHalo}
          />
        </group>

        {/* Subtle 360° Orbital Ring Indicator Around Avatar (Matching Storyboard) */}
        <group ref={orbitGuideGroupRef} position={[0, -0.18, 0]} rotation={[0.14, 0, 0]}>
          <mesh
            geometry={crescentGeometries.orbitArcFront}
            material={stageMaterials.orbitArcMat}
            rotation={[Math.PI / 2, 0, -0.35]}
          />
          <mesh
            geometry={crescentGeometries.orbitArcFront}
            material={stageMaterials.orbitArcMat}
            rotation={[Math.PI / 2, 0, Math.PI - 0.35]}
          />
        </group>

        {/* Avatar Rig (Includes Embedded Circular Pedestal in GLB) */}
        <group ref={characterRigRef}>
          <FashionAvatar
            mode={avatarMode}
            targetHeight={2.32}
            groundY={-1.115}
          />
        </group>

        {/* Glowing Pedestal Base Ring & Floor Halo */}
        <group position={[0, -1.11, 0]}>
          <mesh
            ref={neonBaseRingRef}
            material={stageMaterials.neonRim}
            position={[0, 0.008, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.678, 0.009, 16, 96]} />
          </mesh>

          <mesh
            material={stageMaterials.neonMidGlow}
            position={[0, 0.005, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.684, 0.022, 16, 96]} />
          </mesh>

          {floorGlowTexture && (
            <mesh position={[0, -0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.5, 2.1]} />
              <meshBasicMaterial
                map={floorGlowTexture}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          )}
        </group>
      </group>

      {/* ================= SECTIONS 02, 03, 04: STANDALONE 3D PRODUCT MODELS ================= */}
      <ProductStageModels />

      {/* ================= SECTION 05: AMBIENT SPATIAL PORTAL RINGS ================= */}
      <group
        ref={explorePortalGroupRef}
        position={[0, 0.1, -0.8]}
        visible={false}
        name="section-05-explore-stage"
      >
        <mesh
          geometry={crescentGeometries.core}
          material={stageMaterials.arcInnerGlow}
          scale={1.45}
        />
        <mesh
          geometry={crescentGeometries.innerGlow}
          material={stageMaterials.arcHalo}
          rotation={[0, 0, Math.PI]}
          scale={1.15}
        />
      </group>

      {/* ================= 3D IRIDESCENT SILK FABRIC CURTAIN TRANSITION ================= */}
      <FabricCurtainMesh />

      {/* ================= ATMOSPHERIC PARTICLES ================= */}
      <Sparkles
        count={28}
        scale={[4.8, 3.6, 2.5]}
        position={[0.1, 0.3, -0.8]}
        size={1.0}
        speed={0.16}
        opacity={0.32}
        color="#A5B4FC"
      />
    </>
  );
}

export default HeroStageContent;
