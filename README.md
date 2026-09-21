# Kedar's — cold-pressed & virgin oils

Marketing site for Kedar's, a family-run cold-pressed and virgin edible oil mill in Kapra, Secunderabad.
Static site: Vite + React + TypeScript, Tailwind CSS, react-three-fiber (3D hero), framer-motion.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build & preview

```bash
npm run build      # type-checks, then outputs the static site to dist/
npm run preview    # serves dist/ at http://localhost:4173
npm run lint       # oxlint
```

## Deploy

The build is a plain static site (`dist/`), so any static host works.

**Vercel (recommended)**

```bash
npm i -g vercel
vercel deploy          # preview deployment
vercel deploy --prod   # production
```

Vercel auto-detects Vite: build command `npm run build`, output directory `dist`. No config file needed.

**Netlify**

Build command `npm run build`, publish directory `dist` (or drag-and-drop `dist/` in the Netlify UI).

## Project layout

```
src/
  App.tsx                  section order + MotionConfig (respects reduced motion)
  index.css                Tailwind layers, design tokens (light + dark), shared components
  lib/site.ts              phone, WhatsApp, address, hours, nav — edit contact details here
  lib/device.ts            low-end / software-GL detection → static bottle fallback
  hooks/useReducedMotion   prefers-reduced-motion
  components/
    Header, Hero, StatStrip, ColdPressVsRefined, VirginOilExplainer,
    UsesGrid, Products, Process, Pricing, B2B, Contact, Footer
    BottleStatic.tsx       SVG bottle: 3D fallback, loading placeholder, product-card art
    Reveal.tsx             scroll-reveal wrapper (framer-motion whileInView)
  three/
    BottleScene.tsx        full-bleed hero canvas: camera view-offset anchoring, scroll-linked
                           bottle motion, OrbitControls (slow auto-rotate), DepthOfField + Bloom
    GradientBackdrop.tsx   custom GLSL noise mesh-gradient (amber / olive / cream) behind the hero
    Bottle.tsx             glass (MeshPhysicalMaterial transmission), liquid, label, cap
    Seeds.tsx              orbiting mustard seeds (useFrame)
    Halo.tsx               warm glow that tracks the bottle
    scrollMotion.ts        shared scroll-drift constants
public/
  hdr/studio_small_03_512.hdr   self-hosted studio HDR for reflections (drei "studio" preset, downsampled)
  favicon.svg, robots.txt
```

## Design tokens

Defined once in `tailwind.config.js` (Tailwind colour names: `ivory`, `ivory-2`, `walnut`, `walnut-soft`,
`mustard`, `mustard-deep`, `sesame`, `caution`, `good`, `moss`, `cream`, and dark-mode `dk-*`) and mirrored as
CSS custom properties in `src/index.css` (`--bg`, `--bg-warm`, `--bg-cool`, `--text`, `--accent`, `--secondary`,
`--card-bg`, `--glass`, …).

Colour roles: **mustard** is the primary brand accent, reserved for the hero bottle, the hero/header/pricing
CTAs and the "pressed" word; **moss** (deep olive) is the secondary, used for every positive indicator, icon,
tag and eyebrow; **cream** is the neutral for text-on-dark and glass surfaces. Section backgrounds alternate
between base, `.tone-warm`, `.tone-cool` and `.tone-deep` so the page has tonal rhythm while scrolling. Dark mode follows
`prefers-color-scheme`; `<html data-theme="light|dark">` forces a scheme if a toggle is ever added.

Fonts (Fraunces 600 with the `opsz` axis, Karla 400/600) are Google Fonts, self-hosted via `@fontsource`
so nothing render-blocking leaves the origin.

## The hero

One full-bleed canvas: a GLSL noise mesh-gradient backdrop (drifting amber/olive/cream), the glass bottle
anchored to its layout slot via `camera.setViewOffset` (so OrbitControls drag/auto-rotate still work), a
depth-of-field pass focused on the bottle, low-intensity bloom, and scroll-linked motion (framer-motion
`useScroll` → the bottle turns, sinks and shrinks as the hero leaves). The stat cards are frosted glass
(`backdrop-filter`) overlapping the canvas. Before the scene is live — and on low-end devices — a CSS
ambient gradient and an SVG bottle stand in. Append `?nogl` to the URL to force that static path.

## How the 3D hero stays fast

- The static SVG bottle renders with first paint; the three.js bundle (~285 KB gzip) is a lazy chunk.
- The scene starts only after the page has settled (~3.5 s after `load`) or on the first user interaction,
  whichever comes first, and only if the device qualifies (`hardwareConcurrency >= 4`, no data-saver,
  hardware-accelerated WebGL — SwiftShader/llvmpipe get the static image).
- Pixel ratio is capped at 1.5 on the full-bleed canvas, transmission renders at half resolution, shaders
  are compiled asynchronously, and the render loop pauses when the hero is scrolled out of view.
- `prefers-reduced-motion`: no auto-rotate, no seed animation, no bloom; page reveals lose their transforms.

Lighthouse (production build, `vite preview`): mobile Performance 96 · Accessibility 100 ·
Best Practices 100 · SEO 100; desktop Performance 100.

## Editing content

All copy lives in the section components under `src/components/`; contact details, links and hours
live in `src/lib/site.ts`. Replace the pricing placeholder in `Pricing.tsx` when the price list is ready.
