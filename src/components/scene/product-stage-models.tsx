"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ASSET_PATHS } from "@/lib/constants";
import { useViewportStore } from "@/store/viewport-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ProductErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ProductErrorBoundaryState {
  hasError: boolean;
}

class ProductErrorBoundary extends Component<
  ProductErrorBoundaryProps,
  ProductErrorBoundaryState
> {
  constructor(props: ProductErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ProductErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[FITVERSE] Product GLB fallback activated:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Minimal luminous calibration ring while a product GLB streams in.
 */
function ProductLoadingRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 1.6;
      ringRef.current.rotation.x += delta * 0.7;
    }
  });

  return (
    <mesh ref={ringRef}>
      <octahedronGeometry args={[0.25, 1]} />
      <meshBasicMaterial color="#A5B4FC" wireframe transparent opacity={0.45} />
    </mesh>
  );
}

/**
 * Normalized GLB loader: centers the model at (0,0,0) without cloning the
 * high-poly buffers, scales its largest dimension to `targetSize`, and applies
 * a non-destructive orientation correction on wrapper groups (Y yaw innermost,
 * then X pitch, then Z roll). The original GLB geometry is never modified.
 */
function NormalizedGlbProduct({
  url,
  targetSize,
  baseRotation = [0, 0, 0],
  envIntensity = 1.45,
  onLoaded,
}: {
  url: string;
  targetSize: number;
  baseRotation?: [number, number, number];
  envIntensity?: number;
  onLoaded?: () => void;
}) {
  const { scene } = useGLTF(url, true, true);
  const { gl } = useThree();

  const { scale, centeredOffset } = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const uniformScale = targetSize / maxDim;
    return {
      scale: uniformScale,
      centeredOffset: [
        -center.x * uniformScale,
        -center.y * uniformScale,
        -center.z * uniformScale,
      ] as [number, number, number],
    };
  }, [scene, targetSize]);

  useEffect(() => {
    const maxAnisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          if (mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.map.anisotropy = maxAnisotropy;
          }
          if (mat.normalMap) mat.normalMap.anisotropy = maxAnisotropy;
          mat.envMapIntensity = envIntensity;
          mat.needsUpdate = true;
        }
      }
    });
    onLoaded?.();
  }, [scene, gl, envIntensity, onLoaded]);

  return (
    <group rotation={[0, 0, baseRotation[2]]}>
      <group rotation={[baseRotation[0], 0, 0]}>
        <group rotation={[0, baseRotation[1], 0]}>
          <primitive object={scene} scale={scale} position={centeredOffset} />
        </group>
      </group>
    </group>
  );
}

/**
 * Local timeline of every product presentation (0..1 of its own pinned segment).
 * Text reveal happens in the DOM during [0, ENTER_START] (see campaign-scroll-experience.tsx).
 */
const PRODUCT_PHASES = {
  enterStart: 0.1,
  enterEnd: 0.26,
  rotateEnd: 0.78,
  exitEnd: 0.92,
} as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutCubic = (v: number) => 1 - Math.pow(1 - v, 3);
const easeInCubic = (v: number) => v * v * v;
const easeInOutSine = (v: number) => -(Math.cos(Math.PI * v) - 1) / 2;

type ProductKey = "jacket" | "sneakers" | "trousers";

interface ProductStageConfig {
  /** Resting centre in world units (camera looks along -Z from y = 0.35) */
  center: [number, number];
  /** Off-screen entry direction (multiples of viewport width / height) */
  enterFrom: [number, number];
  /** Off-screen exit direction (multiples of viewport width / height) */
  exitTo: [number, number];
  /** Constant presentation tilt toward camera (radians) for an elevated Â¾ view */
  tilt: number;
}

const STAGE_CONFIG: Record<ProductKey, ProductStageConfig> = {
  jacket: { center: [0, 0.34], enterFrom: [0.85, 0], exitTo: [-0.85, 0], tilt: 0.04 },
  sneakers: { center: [0, 0.3], enterFrom: [-0.85, 0], exitTo: [0.85, 0], tilt: 0.2 },
  trousers: { center: [0, 0.16], enterFrom: [0, -1.05], exitTo: [0, 1.05], tilt: 0.03 },
};

/**
 * Pinned product presentation stage for Sections 02â€“04.
 *
 * STRICT ONE-AT-A-TIME RULE: each product reads only its own local progress.
 * Segments are disjoint and every model is invisible outside
 * (enterStart, exitEnd), where it is also positioned completely off-screen,
 * so two products can never share the viewport, in either scroll direction.
 */
export function ProductStageModels() {
  const { isSceneReady, scrollStateRef } = useViewportStore();
  const reducedMotion = useReducedMotion();
  const { viewport } = useThree();

  const isCompact = viewport.width < 3.8;
  const stageScale = isCompact ? 0.62 : 1.0;

  // Sequential streaming: Avatar -> Jacket -> Sneakers -> Trousers (one copy each)
  const [mountJacket, setMountJacket] = useState(false);
  const [mountSneakers, setMountSneakers] = useState(false);
  const [mountTrousers, setMountTrousers] = useState(false);

  useEffect(() => {
    if (isSceneReady) setMountJacket(true);
  }, [isSceneReady]);

  const groupRefs = {
    jacket: useRef<THREE.Group>(null),
    sneakers: useRef<THREE.Group>(null),
    trousers: useRef<THREE.Group>(null),
  };
  const turntableRefs = {
    jacket: useRef<THREE.Group>(null),
    sneakers: useRef<THREE.Group>(null),
    trousers: useRef<THREE.Group>(null),
  };
  const productLightsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scroll = scrollStateRef.current;

    const locals: Record<ProductKey, number> = {
      jacket: scroll.jacketProgress,
      sneakers: scroll.sneakersProgress,
      trousers: scroll.trousersProgress,
    };

    // Safety: make sure a product is mounted before its segment is reached
    if (!mountJacket && scroll.curtainProgress > 0.05) setMountJacket(true);
    if (!mountSneakers && locals.jacket > 0.5) setMountSneakers(true);
    if (!mountTrousers && locals.sneakers > 0.5) setMountTrousers(true);

    let anyVisible = false;

    (Object.keys(STAGE_CONFIG) as ProductKey[]).forEach((key) => {
      const group = groupRefs[key].current;
      const turntable = turntableRefs[key].current;
      if (!group || !turntable) return;

      const q = locals[key];
      const cfg = STAGE_CONFIG[key];
      const visible = q > PRODUCT_PHASES.enterStart && q < PRODUCT_PHASES.exitEnd;
      group.visible = visible;
      if (!visible) return;
      anyVisible = true;

      const enterT = easeOutCubic(
        clamp01((q - PRODUCT_PHASES.enterStart) / (PRODUCT_PHASES.enterEnd - PRODUCT_PHASES.enterStart))
      );
      const exitT = easeInCubic(
        clamp01((q - PRODUCT_PHASES.rotateEnd) / (PRODUCT_PHASES.exitEnd - PRODUCT_PHASES.rotateEnd))
      );
      const rotT = easeInOutSine(
        clamp01((q - PRODUCT_PHASES.enterEnd) / (PRODUCT_PHASES.rotateEnd - PRODUCT_PHASES.enterEnd))
      );

      const offW = viewport.width;
      const offH = viewport.height;
      const floatY = reducedMotion ? 0 : Math.sin(t * 1.4) * 0.025;
      const centerY = isCompact ? cfg.center[1] - 0.25 : cfg.center[1];

      group.position.set(
        cfg.center[0] + (1 - enterT) * cfg.enterFrom[0] * offW + exitT * cfg.exitTo[0] * offW,
        centerY + floatY + (1 - enterT) * cfg.enterFrom[1] * offH + exitT * cfg.exitTo[1] * offH,
        0
      );
      group.scale.setScalar(stageScale);

      // Exactly one full 360Â° revolution while the product rests at centre stage.
      // A gentle lead-in / lead-out sweep makes the entrance and exit feel carried by motion.
      const sweepDir = cfg.enterFrom[0] >= 0 ? 1 : -1;
      const spin =
        rotT * Math.PI * 2 + (1 - enterT) * 0.7 * sweepDir - exitT * 0.7 * sweepDir;
      const fabricSway =
        key === "trousers" && !reducedMotion ? Math.sin(t * 1.8) * 0.015 : 0;
      turntable.rotation.set(cfg.tilt, spin, fabricSway);
    });

    if (productLightsRef.current) productLightsRef.current.visible = anyVisible;
  });

  return (
    <>
      {/* Product photography lighting (active only while a product is on stage):
          neutral white key keeps white/lavender materials true, purple rim + silver kicker add the FITVERSE glow. */}
      <group ref={productLightsRef} visible={false}>
        <spotLight
          position={[1.6, 3.6, 4.2]}
          angle={0.55}
          penumbra={0.85}
          intensity={5.5}
          color="#FFFFFF"
          castShadow
        />
        <directionalLight position={[-3.2, 1.4, -2.6]} intensity={2.6} color="#A78BFA" />
        <directionalLight position={[3.4, 0.6, -1.8]} intensity={1.6} color="#E2E8F0" />
      </group>

      {/* ==================== SECTION 02: THE JACKET ==================== */}
      <group ref={groupRefs.jacket} visible={false} name="section-02-jacket-stage">
        <group ref={turntableRefs.jacket}>
          {mountJacket ? (
            <ProductErrorBoundary fallback={<ProductLoadingRing />}>
              <Suspense fallback={<ProductLoadingRing />}>
                <NormalizedGlbProduct
                  url={ASSET_PATHS.jacketModel}
                  targetSize={2.3}
                  baseRotation={[0, Math.PI * 0.72, 0]}
                  envIntensity={1.85}
                  onLoaded={() => setMountSneakers(true)}
                />
              </Suspense>
            </ProductErrorBoundary>
          ) : (
            <ProductLoadingRing />
          )}
        </group>
      </group>

      {/* ==================== SECTION 03: THE SNEAKERS ====================
          sneakers.glb = ONE mesh containing both shoes, already Y-up in the file
          (soles at -Y, shoes separated along X, toes toward -Z). A single yaw on the
          wrapper turns the toes toward camera-left for a front-side Â¾ view and puts the
          pair side by side with a slight depth stagger; the turntable spins the pair
          together around its vertical axis and only tilts it slightly toward camera. */}
      <group ref={groupRefs.sneakers} visible={false} name="section-03-sneakers-stage">
        <group ref={turntableRefs.sneakers}>
          {mountSneakers ? (
            <ProductErrorBoundary fallback={<ProductLoadingRing />}>
              <Suspense fallback={<ProductLoadingRing />}>
                <NormalizedGlbProduct
                  url={ASSET_PATHS.sneakersModel}
                  targetSize={1.8}
                  baseRotation={[0, Math.PI * 0.78, 0]}
                  envIntensity={1.1}
                  onLoaded={() => setMountTrousers(true)}
                />
              </Suspense>
            </ProductErrorBoundary>
          ) : (
            <ProductLoadingRing />
          )}
        </group>
      </group>

      {/* ==================== SECTION 04: THE TROUSERS ==================== */}
      <group ref={groupRefs.trousers} visible={false} name="section-04-trousers-stage">
        <group ref={turntableRefs.trousers}>
          {mountTrousers ? (
            <ProductErrorBoundary fallback={<ProductLoadingRing />}>
              <Suspense fallback={<ProductLoadingRing />}>
                <NormalizedGlbProduct
                  url={ASSET_PATHS.trousersModel}
                  targetSize={2.35}
                  baseRotation={[0, -Math.PI / 2, 0]}
                  envIntensity={1.45}
                />
              </Suspense>
            </ProductErrorBoundary>
          ) : (
            <ProductLoadingRing />
          )}
        </group>
      </group>
    </>
  );
}

export default ProductStageModels;
