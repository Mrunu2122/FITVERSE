import type { ReactNode } from "react";

export type Vector3Tuple = [number, number, number];

export type AvatarPreviewMode = "stylized" | "realistic";

export type SectionId = "hero" | "jacket" | "sneakers" | "trousers" | "explore";

export interface CameraConfig {
  position: Vector3Tuple;
  fov: number;
  near?: number;
  far?: number;
}

export interface SceneCanvasProps {
  children?: ReactNode;
  camera?: Partial<CameraConfig>;
  className?: string;
  enableOrbitControls?: boolean;
}

export interface AssetModelMetadata {
  id: string;
  name: string;
  category: "avatar" | "clothing" | "environment";
  modelPath: string;
  scale?: Vector3Tuple;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
}

export interface NavItem {
  label: string;
  href: string;
  sectionId?: SectionId;
}

export interface ThemeAccent {
  id: "ice-blue" | "silver" | "charcoal";
  label: string;
  hex: string;
}

export interface ProductFeatureItem {
  id: string;
  title: string;
  description: string;
  icon:
    | "fabric"
    | "layers"
    | "sparkles"
    | "cushion"
    | "feather"
    | "grip"
    | "pockets"
    | "flex"
    | "shield";
}

export interface ProductShowcaseSpec {
  id: "jacket" | "sneakers" | "trousers";
  sectionNumber: string;
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  subtitle: string;
  description: string;
  modelPath: string;
  features: ProductFeatureItem[];
}

export interface ExploreDestinationCard {
  id: string;
  indexLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  badge: string;
}

export interface ScrollChoreographyRefState {
  /** Overall page scroll progress 0..1 */
  globalProgress: number;
  /** Section 01 Hero progress 0..1 (drives 360° scroll rotation) */
  heroProgress: number;
  /** Transition 01->02 3D Fabric Curtain sweep progress 0..1 */
  curtainProgress: number;
  /** Section 02 Jacket progress 0..1 */
  jacketProgress: number;
  /** Transition 02->03 progress 0..1 */
  jacketToSneakersProgress: number;
  /** Section 03 Sneakers progress 0..1 */
  sneakersProgress: number;
  /** Transition 03->04 progress 0..1 */
  sneakersToTrousersProgress: number;
  /** Section 04 Trousers progress 0..1 */
  trousersProgress: number;
  /** Transition 04->05 progress 0..1 */
  trousersToExploreProgress: number;
  /** Section 05 Explore progress 0..1 */
  exploreProgress: number;
  /** Normalized scroll velocity (-1..1) for dynamic cloth wind reaction */
  scrollVelocity: number;
}
