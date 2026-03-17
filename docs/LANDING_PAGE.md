# Landing Page — Technical Documentation

## Overview

The landing page (`src/app/page.tsx`) is the public entry point of the ACCESS Web Portal. It is a **single full-viewport hero section** that introduces the organization to visitors.

---

## File Structure

```
src/
├── app/
│   └── page.tsx                    # Landing page route
├── components/
│   └── ui/
│       └── Navbar.tsx              # Shared navbar
└── features/
  ├── effects/
  │   └── components/
  │       └── FloatingBlocks.tsx  # Three.js 3-D animated cubes
  └── landing/
    └── components/             # Landing page sections

public/
└── BG-ACCESS.webp                   # Hero background photo
```

---

## Layer Stack (bottom → top)

| z-order | Element                            | Purpose                                          |
| ------- | ---------------------------------- | ------------------------------------------------ |
| 0       | `BG-ACCESS.webp` (`<Image fill />`) | Full-cover background photo                      |
| 1       | `bg-black/55` overlay              | Darkens photo for text contrast                  |
| 2       | Orange glow divs                   | Radial-gradient warm glow at bottom-right corner |
| 3       | `<FloatingBlocks />`               | Three.js canvas — right half of viewport         |
| 10      | `<Navbar />`                       | Sticky glass navbar                              |
| 10      | Hero copy + CTA buttons            | Heading, subtitle, action buttons                |

---

## Components

### `src/app/page.tsx`

- Wraps everything in a `relative flex min-h-screen` section with `bg-black` fallback.
- The `<FloatingBlocks />` container is pinned `right-0` with responsive widths:
  - `w-full` on mobile, `w-3/4` on `sm`, `w-1/2` on `md+`.
- **Heading gradient** — `linear-gradient(180deg, #fff → #F26223)` applied as a CSS background-clip text effect across the full `<h1>`.
- **Corner glow** — two `pointer-events-none` divs with `radial-gradient` + `filter: blur()`:
  - Primary: large ellipse anchored at `bottom right`, deep orange.
  - Secondary: smaller softer glow at right-center for upper falloff.

### `src/features/effects/components/FloatingBlocks.tsx`

A `"use client"` component that boots a Three.js scene inside a `useEffect`.

#### Scene setup

| Setting    | Value                                                        |
| ---------- | ------------------------------------------------------------ |
| Background | `THREE.Color(0x000000)` solid black                          |
| Fog        | `FogExp2(0x000000, 0.08)`                                    |
| Camera     | `PerspectiveCamera(60°)` at `(-3, 0, 8)` → `lookAt(2, 0, 0)` |
| Renderer   | `WebGLRenderer({ antialias: true })`, PCFSoft shadows        |

#### Lighting rig

| Light   | Type                           | Intensity | Position    |
| ------- | ------------------------------ | --------- | ----------- |
| Ambient | `AmbientLight`                 | 0.15      | —           |
| Key     | `DirectionalLight` (white)     | 2.5       | `-4, 6, 4`  |
| Fill    | `PointLight` (warm `#ffddaa`)  | 0.5       | `3, -2, 3`  |
| Rim     | `DirectionalLight` (`#aaaacc`) | 0.8       | `5, -3, -5` |

#### Cube material

```ts
MeshStandardMaterial({ color: 0x3a2a2a, roughness: 0.55, metalness: 0.15 });
```

#### `BLOCKS` config array

Each entry defines one cube. Edit this array to add, remove, or reposition cubes without touching the renderer logic.

```ts
interface BlockConfig {
  position: [x: number, y: number, z: number]; // world-space position
  size: number; // edge length
  rotation?: [rx: number, ry: number, rz: number]; // initial rotation (radians)
  spin?: [rx: number, ry: number, rz: number]; // rotation delta per frame
  float?: { speed: number; amplitude: number }; // vertical sine bob
}
```

**Example — adding a new cube:**

```ts
{
  position:  [3.0, 1.5, 0.0],
  size:      1.2,
  rotation:  [0.5, 0.8, 0.2],
  spin:      [0.003, 0.005, 0.001],
  float:     { speed: 0.4, amplitude: 0.12 },
},
```

#### Block zones (current layout)

| Zone                  | X range   | Y range     | Count |
| --------------------- | --------- | ----------- | ----- |
| Upper-right cluster   | 3.0 – 7.5 | 2.2 – 4.1   | 7     |
| Mid-right sweep       | 5.9 – 7.2 | −0.7 – 1.5  | 4     |
| Lower sweep to center | 2.8 – 5.7 | −3.4 – −1.2 | 7     |

#### Animation loop

Each frame (via `requestAnimationFrame`):

1. Increments `rotation.x/y/z` by the cube's `spin` values.
2. Sets `position.y` to `baseY + sin(elapsed × speed + index) × amplitude` for the float bob.
3. Calls `renderer.render(scene, camera)`.

Cleanup on unmount cancels the frame loop, removes the canvas DOM node, and calls `renderer.dispose()`.

---

## Responsive Behaviour

| Breakpoint     | FloatingBlocks width | Notes                                            |
| -------------- | -------------------- | ------------------------------------------------ |
| `< sm`         | `w-full`             | Cubes fill full width; text still centred on top |
| `sm` (≥640 px) | `w-3/4`              | Cubes shift right                                |
| `md` (≥768 px) | `w-1/2`              | Left half is completely clear for text           |

---

## Dependencies

| Package          | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `three` `^0.183` | 3-D renderer for floating cubes          |
| `@types/three`   | TypeScript types for Three.js            |
| `next/image`     | Optimised background photo (`fill` mode) |

---

_Last updated: March 15, 2026_
