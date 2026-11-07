"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { AvatarPreviewMode } from "@/types";
import { ASSET_PATHS } from "@/lib/constants";
import { useViewportStore } from "@/store/viewport-context";

export interface FashionAvatarProps {
  mode?: AvatarPreviewMode;
  modelUrl?: string;
  /**
   * Target world height in scene units (from base of model to top of head).
   * Preserves exact uniform aspect ratio without stretching or deforming.
   */
  targetHeight?: number;
  /**
   * Y coordinate of the pedestal surface where the base of the GLB model sits.
   */
  groundY?: number;
  /**
   * Base Y-axis orientation offset in radians.
   * The Meshy/Tripo GLB faces +X natively, so -Math.PI / 2 rotates it to face the camera (+Z).
   */
  orientationOffsetY?: number;
}

interface AvatarErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface AvatarErrorBoundaryState {
  hasError: boolean;
}

class AvatarErrorBoundary extends Component<
  AvatarErrorBoundaryProps,
  AvatarErrorBoundaryState
> {
  constructor(props: AvatarErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): AvatarErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[FITVERSE] Failed to load 3D avatar GLB:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Minimal luminous wireframe calibration ring displayed while the GLB streams in.
 */
function AvatarLoadingFallback({ groundY = -1.11 }: { groundY?: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 1.4;
      ringRef.current.rotation.x += delta * 0.5;
    }
  });

  return (
    <group position={[0, groundY + 1.15, 0]}>
      <mesh ref={ringRef}>
        <octahedronGeometry args={[0.28, 1]} />
        <meshBasicMaterial color="#A5B4FC" wireframe transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

/**
 * Loads `public/assets/models/avatars/fitverse-avatar.glb` using `@react-three/drei`'s `useGLTF`
 * (with Meshopt decompression enabled for `EXT_meshopt_compression`), inspects its exact
 * bounding box (`size.y = 0.9811`), centers X/Z on the stage, rotates it from +X to +Z
 * (`orientationOffsetY = -Math.PI / 2 - 0.06`), and aligns it cleanly with the pedestal.
 */
function LoadedFitverseAvatar({
  url,
  targetHeight = 2.32,
  groundY = -1.115,
  orientationOffsetY = -Math.PI / 2 - 0.06,
}: {
  url: string;
  targetHeight?: number;
  groundY?: number;
  orientationOffsetY?: number;
}) {
  const { scene } = useGLTF(url, true, true);
  const { gl } = useThree();
  const { setSceneReady } = useViewportStore();
  const idleGroupRef = useRef<THREE.Group>(null);

  const { uniformScale, groundedPosition } = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const rawHeight = size.y > 0.0001 ? size.y : 1;
    const scale = targetHeight / rawHeight;

    const posX = -center.x * scale;
    const posY = groundY - box.min.y * scale;
    const posZ = -center.z * scale;

    return {
      uniformScale: scale,
      groundedPosition: [posX, posY, posZ] as [number, number, number],
    };
  }, [scene, targetHeight, groundY]);

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
            mat.map.needsUpdate = true;
          }
          if (mat.normalMap) {
            mat.normalMap.anisotropy = maxAnisotropy;
            mat.normalMap.needsUpdate = true;
          }
          if (mat.roughnessMap) {
            mat.roughnessMap.anisotropy = maxAnisotropy;
            mat.roughnessMap.needsUpdate = true;
          }
          if (mat.metalnessMap) {
            mat.metalnessMap.anisotropy = maxAnisotropy;
            mat.metalnessMap.needsUpdate = true;
          }
          mat.envMapIntensity = 1.45;
          mat.needsUpdate = true;
        }
      }
    });

    // Notify store that Hero GLB is ready so downstream product GLBs can load sequentially
    setSceneReady(true);
  }, [scene, gl, setSceneReady]);

  // Subtle idle breathing / poise movement
  useFrame((state) => {
    if (!idleGroupRef.current) return;
    const t = state.clock.getElapsedTime();
    idleGroupRef.current.position.y = Math.sin(t * 1.25) * 0.004;
    idleGroupRef.current.rotation.y =
      orientationOffsetY + Math.sin(t * 0.5) * 0.025;
  });

  return (
    <group
      ref={idleGroupRef}
      name="fitverse-glb-avatar-root"
      rotation={[0, orientationOffsetY, 0]}
    >
      <primitive
        object={scene}
        scale={uniformScale}
        position={groundedPosition}
      />
    </group>
  );
}

/**
 * Reusable FashionAvatar component.
 * Wraps the actual GLB model in Suspense and an ErrorBoundary.
 */
export function FashionAvatar({
  modelUrl = ASSET_PATHS.defaultAvatarModel,
  targetHeight = 2.32,
  groundY = -1.115,
  orientationOffsetY = -Math.PI / 2 - 0.06,
}: FashionAvatarProps) {
  return (
    <AvatarErrorBoundary fallback={<AvatarLoadingFallback groundY={groundY} />}>
      <Suspense fallback={<AvatarLoadingFallback groundY={groundY} />}>
        <LoadedFitverseAvatar
          url={modelUrl}
          targetHeight={targetHeight}
          groundY={groundY}
          orientationOffsetY={orientationOffsetY}
        />
      </Suspense>
    </AvatarErrorBoundary>
  );
}

// Preload the Hero avatar immediately
useGLTF.preload(ASSET_PATHS.defaultAvatarModel, true, true);

export default FashionAvatar;
