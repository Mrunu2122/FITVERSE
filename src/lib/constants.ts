import type {
  CameraConfig,
  ExploreDestinationCard,
  NavItem,
  ProductShowcaseSpec,
  SectionId,
} from "@/types";

export const BRAND_CONFIG = {
  name: "FITVERSE",
  tagline: "Wear Your World",
  title: "FITVERSE — Wear Your World",
  subtitle: "A NEW DIMENSION OF FASHION",
  description:
    "Fashion meets technology. Discover your next look in an immersive digital showroom built around you.",
  footerTagline: "FASHION WITHOUT BOUNDARIES",
  copyright: "FITVERSE © 2026",
} as const;

export const NAV_ITEMS: NavItem[] = [
  { label: "HOME", href: "#hero", sectionId: "hero" },
  { label: "COLLECTION", href: "#jacket", sectionId: "jacket" },
  { label: "SHOWROOM", href: "#sneakers", sectionId: "sneakers" },
  { label: "VIRTUAL TRY-ON", href: "#trousers", sectionId: "trousers" },
  { label: "ABOUT", href: "#explore", sectionId: "explore" },
];

export const SECTION_ORDER: Array<{
  id: SectionId;
  number: string;
  label: string;
  href: string;
}> = [
  { id: "hero", number: "01", label: "Hero — The Avatar", href: "#hero" },
  { id: "jacket", number: "02", label: "Our Craft — The Jacket", href: "#jacket" },
  { id: "sneakers", number: "03", label: "Our Craft — The Sneakers", href: "#sneakers" },
  { id: "trousers", number: "04", label: "Our Craft — The Trousers", href: "#trousers" },
  { id: "explore", number: "05", label: "Explore FITVERSE", href: "#explore" },
];

export const ASSET_PATHS = {
  images: "/assets/images",
  avatars: "/assets/models/avatars",
  defaultAvatarModel: "/assets/models/avatars/fitverse-avatar.glb",
  clothing: "/assets/models/clothing",
  jacketModel: "/assets/models/clothing/jacket.glb",
  sneakersModel: "/assets/models/clothing/sneakers.glb",
  trousersModel: "/assets/models/clothing/trouser.glb",
  environment: "/assets/models/environment",
  textures: "/assets/textures",
  fonts: "/assets/fonts",
  references: "/assets/references",
} as const;

export const PRODUCT_SHOWCASE_DATA: Record<
  "jacket" | "sneakers" | "trousers",
  ProductShowcaseSpec
> = {
  jacket: {
    id: "jacket",
    sectionNumber: "02",
    eyebrow: "OUR CRAFT",
    titlePrefix: "THE",
    titleAccent: "JACKET.",
    subtitle: "Iridescent. Technical. Iconic.",
    description: "A statement piece that moves with you.",
    modelPath: ASSET_PATHS.jacketModel,
    features: [
      {
        id: "premium-fabric",
        title: "Premium Fabric",
        description: "Durable and lightweight construction.",
        icon: "fabric",
      },
      {
        id: "layered-comfort",
        title: "Layered Comfort",
        description: "Designed for comfort and movement.",
        icon: "layers",
      },
      {
        id: "iridescent-finish",
        title: "Iridescent Finish",
        description: "A distinctive reflective surface.",
        icon: "sparkles",
      },
    ],
  },
  sneakers: {
    id: "sneakers",
    sectionNumber: "03",
    eyebrow: "OUR CRAFT",
    titlePrefix: "THE",
    titleAccent: "SNEAKERS.",
    subtitle: "Bold steps. Elevated design.",
    description: "Built for style, comfort and everyday movement.",
    modelPath: ASSET_PATHS.sneakersModel,
    features: [
      {
        id: "cushion-technology",
        title: "Cushion Technology",
        description: "Comfort for everyday movement.",
        icon: "cushion",
      },
      {
        id: "lightweight-build",
        title: "Lightweight Build",
        description: "Designed for effortless movement.",
        icon: "feather",
      },
      {
        id: "high-grip-sole",
        title: "High-Grip Sole",
        description: "Stability and control.",
        icon: "grip",
      },
    ],
  },
  trousers: {
    id: "trousers",
    sectionNumber: "04",
    eyebrow: "OUR CRAFT",
    titlePrefix: "THE",
    titleAccent: "TROUSERS.",
    subtitle: "Utility meets modern streetwear.",
    description: "Designed for flexibility, style and versatility.",
    modelPath: ASSET_PATHS.trousersModel,
    features: [
      {
        id: "functional-pockets",
        title: "Functional Pockets",
        description: "Style with purpose.",
        icon: "pockets",
      },
      {
        id: "flexible-fit",
        title: "Flexible Fit",
        description: "Comfort in every move.",
        icon: "flex",
      },
      {
        id: "premium-material",
        title: "Premium Material",
        description: "Breathable and long-lasting.",
        icon: "shield",
      },
    ],
  },
};

export const EXPLORE_DESTINATIONS: ExploreDestinationCard[] = [
  {
    id: "explore-collection",
    indexLabel: "01",
    eyebrow: "DIGITAL ARCHIVE",
    title: "Explore Collection",
    description:
      "Inspect the full Season 01 capsule — holographic outerwear, sculpted footwear, and technical cargo silhouettes crafted for both physical and virtual worlds.",
    ctaLabel: "VIEW CAPSULE",
    href: "#jacket",
    badge: "SEASON 01 // CAPSULE",
  },
  {
    id: "enter-3d-showroom",
    indexLabel: "02",
    eyebrow: "IMMERSIVE SPACE",
    title: "Enter the 3D Showroom",
    description:
      "Step inside our spatial architectural showroom with real-time studio lighting, 360° garment inspection, and interactive material previews.",
    ctaLabel: "LAUNCH SHOWROOM",
    href: "#hero",
    badge: "SPATIAL WEBGL",
  },
  {
    id: "virtual-try-on",
    indexLabel: "03",
    eyebrow: "PERSONAL AVATAR",
    title: "Virtual Try-On",
    description:
      "Experience tailored drape, proportion, and iridescent light response on a personalized 3D avatar calibrated to your silhouette.",
    ctaLabel: "PREVIEW TRY-ON",
    href: "#hero",
    badge: "AVATAR STUDIO",
  },
];

export const DEFAULT_CAMERA_CONFIG: CameraConfig = {
  position: [0, 0.35, 5.2],
  fov: 36,
  near: 0.1,
  far: 100,
};

export function cn(...classes: Array<string | undefined | null | false>): string {
  return classes.filter(Boolean).join(" ");
}
