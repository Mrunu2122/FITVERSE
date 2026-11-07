"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useViewportStore } from "@/store/viewport-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Real-time 3D glossy iridescent silk curtain (Hero -> Product stage transition).
 *
 * Visual target: public/assets/references fabric reference — broad, rolling,
 * liquid-satin folds with bright silver crests, deep violet valleys and soft
 * lavender reflections.
 *
 * Driven by GSAP ScrollTrigger (`curtainProgress: 0 -> 1`, pinned segment):
 * - 0.00 -> 0.50 enters from fully off-screen left, billowing on the wind,
 *   until it completely covers the (still pinned) hero.
 * - 0.50 -> 1.00 keeps travelling and sweeps fully off-screen right.
 * The product presentation only starts once `curtainProgress === 1`.
 * Every value is a pure function of progress, so reverse scrolling replays exactly.
 */
export function FabricCurtainMesh() {
  const { scrollStateRef } = useViewportStore();
  const reducedMotion = useReducedMotion();
  const { viewport } = useThree();

  const isCompact = viewport.width < 3.8;

  const groupRef = useRef<THREE.Group>(null);

  const CLOTH_W = 6.8;
  const CLOTH_H = 4.6;

  const { geometry, basePositions } = useMemo(() => {
    const segX = isCompact ? 50 : 80;
    const segY = isCompact ? 35 : 55;
    const geo = new THREE.PlaneGeometry(CLOTH_W, CLOTH_H, segX, segY);
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const copy = new Float32Array(posAttr.array.length);
    copy.set(posAttr.array as Float32Array);
    geo.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(posAttr.count * 3).fill(1), 3)
    );
    return { geometry: geo, basePositions: copy };
  }, [isCompact]);

  // Liquid satin: high metalness + low roughness + clearcoat give the long silver
  // specular sweeps; light iridescence adds the purple/blue colour shift.
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#FFFFFF"),
        vertexColors: true,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        iridescence: 0.4,
        iridescenceIOR: 1.35,
        iridescenceThicknessRange: [220, 560],
        sheen: 0.3,
        sheenRoughness: 0.3,
        sheenColor: new THREE.Color("#C4B5FD"),
        envMapIntensity: 1.0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1,
      }),
    []
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const t = state.clock.getElapsedTime();
    const scroll = scrollStateRef.current;
    const cp = scroll.curtainProgress;

    const active = cp > 0.002 && cp < 0.998;
    group.visible = active;
    if (!active) return;

    // Start and end completely outside the viewport (half visible width at z≈1.7 ≈ 1.8)
    const travel = CLOTH_W * 0.5 + viewport.width * 0.5 + 1.2;
    const sweepX = THREE.MathUtils.lerp(-travel, travel, cp);
    const lift = Math.sin(cp * Math.PI) * 0.12;
    group.position.set(sweepX, 0.32 + lift, 1.1);
    group.rotation.set(0.06, -0.12 * Math.cos(cp * Math.PI), -0.14 + Math.sin(cp * Math.PI * 2) * 0.05);

    material.opacity = THREE.MathUtils.smoothstep(cp, 0.002, 0.03) *
      (1 - THREE.MathUtils.smoothstep(cp, 0.97, 0.998));

    const velocityBoost = Math.min(Math.abs(scroll.scrollVelocity), 1.2);
    const ph = (reducedMotion ? 0 : t * 0.9) + cp * 9.0;
    const gust = 1 + Math.sin(cp * Math.PI) * 0.35 + velocityBoost * 0.2;

    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const col = geometry.attributes.color as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const carr = col.array as Float32Array;
    const halfW = CLOTH_W * 0.5;

    for (let i = 0; i < pos.count; i++) {
      const k = i * 3;
      const x0 = basePositions[k];
      const y0 = basePositions[k + 1];
      const nx = x0 / halfW; // -1..1 along the wind direction

      // Travelling wind wave along the length of the cloth
      const A = x0 * 0.85 - ph;
      const sA = Math.sin(A);

      // Broad organic folds that run lengthwise and snake up/down (S-curves),
      // like the large flowing pleats in the reference.
      const foldArg = y0 * 2.1 + sA * 1.3 + x0 * 0.45;
      const fold = Math.sin(foldArg);
      // Sharpen crests slightly so highlights read as satin ridges, valleys stay soft
      const crest = fold * 0.42 + Math.pow(0.5 + 0.5 * fold, 3) * 0.16;

      const fine = Math.sin(y0 * 3.0 - x0 * 0.7 + ph * 1.25 + 0.7) * 0.09;
      const billow = sA * 0.32 + Math.sin(x0 * 0.4 + y0 * 0.5 - ph * 0.6) * 0.18;

      // Leading / trailing hems flutter harder than the body
      const hemMask = Math.pow(Math.abs(nx), 2.2);
      const flutter = hemMask * Math.sin(y0 * 3.6 - ph * 2.2 + nx * 3.0) * 0.28;

      // Wind-filled belly in the middle of the sheet
      const belly = Math.max(0, 1 - nx * nx) * Math.sin(cp * Math.PI) * 0.3;

      arr[k] = x0 - Math.cos(foldArg) * 0.06 * gust;
      arr[k + 1] = y0 + Math.cos(foldArg) * 0.13 * gust + Math.sin(x0 * 1.1 - ph * 0.8) * 0.18;
      arr[k + 2] = (crest + fine + billow + flutter) * gust + belly;

      // Colour: deep violet valleys -> royal purple slopes -> silver-lavender crests,
      // with slow purple/silver banding along the cloth like the reference.
      const fold01 = 0.5 + 0.5 * Math.sin(foldArg + 0.55);
      const band = 0.5 + 0.5 * Math.sin(y0 * 0.75 + x0 * 0.45 - ph * 0.35);
      const shade = 0.18 + 0.82 * Math.pow(fold01, 1.8);
      const silver = Math.pow(fold01, 5.0) * (0.25 + 0.75 * band);

      const r = (0.3 + band * 0.18) * shade;
      const g = (0.12 + band * 0.12) * shade;
      const b = (0.72 + band * 0.14) * shade;
      carr[k] = r + silver * (0.86 - r);
      carr[k + 1] = g + silver * (0.84 - g);
      carr[k + 2] = b + silver * (0.95 - b);
    }

    pos.needsUpdate = true;
    col.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Grazing key light -> long liquid-silver highlights along the fold crests */}
      <directionalLight position={[-3.0, 3.2, 3.6]} intensity={2.6} color="#F8FAFC" />
      {/* Violet fill from below-right -> rich purple in the slopes */}
      <directionalLight position={[3.4, -2.0, 2.6]} intensity={2.2} color="#8B5CF6" />
      {/* Cool top kicker for the subtle blue sheen */}
      <directionalLight position={[0.3, 3.6, 1.2]} intensity={1.4} color="#BAE6FD" />
      <mesh geometry={geometry} material={material} />
    </group>
  );
}

export default FabricCurtainMesh;
