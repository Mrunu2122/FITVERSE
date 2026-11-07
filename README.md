# FITVERSE — Wear Your World

A futuristic fashion-tech and interactive 3D digital campaign platform built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, **Three.js**, **React Three Fiber**, **@react-three/drei**, **GSAP (`ScrollTrigger`)**, **Framer Motion**, and **Lucide React**.

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser to experience the 5-section scroll-choreographed 3D fashion editorial campaign.

### 3. Type Check & Production Build

```bash
npm run typecheck
npm run build
```

---

## 3D Model Assets & Campaign Sections

| Section | 3D Asset Path | Description |
| :--- | :--- | :--- |
| **Section 01 — Hero** | `public/assets/models/avatars/fitverse-avatar.glb` | Full-body FITVERSE fashion avatar on glowing circular pedestal with 360° drag/swipe inertia, 360° scroll rotation, and zoom. |
| **Transition 01 → 02** | Procedural 3D Cloth (`FabricCurtainMesh`) | High-subdivision iridescent purple/silver silk curtain mesh with multi-frequency wind waves sweeping across the viewport. |
| **Section 02 — The Jacket** | `public/assets/models/clothing/jacket.glb` | Standalone 3D iridescent silver-purple bomber jacket rotating in 3D with luminous orbital rings and feature callouts. |
| **Section 03 — The Sneakers** | `public/assets/models/clothing/sneakers.glb` | Standalone 3D futuristic white sneaker with close-up detail inspection and sole/upper highlights. |
| **Section 04 — The Trousers** | `public/assets/models/clothing/trouser.glb` | Standalone 3D technical black cargo trousers with subtle fabric sway and utility pocket callouts. |
| **Section 05 — Explore FITVERSE** | Ambient 3D Spatial Portal Rings | Three visual destination portals: *Explore Collection*, *Enter the 3D Showroom*, and *Virtual Try-On*. |

All paths are centralized in `src/lib/constants.ts` under `ASSET_PATHS`, and each 3D model is wrapped in an `ErrorBoundary` and `Suspense` fallback.
