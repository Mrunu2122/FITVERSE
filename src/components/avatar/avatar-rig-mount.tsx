"use client";

import type { GroupProps } from "@react-three/fiber";

export interface AvatarRigMountProps extends GroupProps {
  /**
   * Future path to a GLTF/GLB avatar model inside `/public/assets/models/avatars/`
   */
  avatarModelPath?: string;
}

/**
 * Dedicated 3D Avatar mount group inside `src/components/avatar/`.
 * Ready to load GLTF/GLB humanoid rigs without mixing UI concerns.
 */
export function AvatarRigMount({ children, ...props }: AvatarRigMountProps) {
  return <group name="fitverse-avatar-rig-mount" {...props}>{children}</group>;
}
