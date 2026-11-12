# Design System Master File — ORBIT ACADEMY

> **LOGIC:** When building or styling a specific page/module, first check `design-system/orbit-academy/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly adhere to the rules below.

---

## 1. Project Metadata

- **Project:** ORBIT ACADEMY
- **Version:** 2.1.0 (Interactive 3D Planetarium & Space Science Platform)
- **Category:** Space Science, Astronomy & Interactive 3D Educational Platform
- **Design Dials:** Variance 5/10 (Balanced / Modern) | Motion 6/10 (Standard Intentional) | Density 5/10 (Balanced Telemetry)
- **Primary Viewport:** Continuously animated, interactive 3D WebGL Solar System Canvas with non-intrusive Mission Control HUD Overlays.

---

## 2. Core Creative Vision & Atmosphere

ORBIT ACADEMY empowers students and young explorers to discover space science through an authentic, continuously animated 3D solar system.
The aesthetic direction is **Scientific Realism & Mission Control Telemetry**:
- **Tone:** Scientifically authentic, cinematic yet restrained, academic, inspiring, and accessible.
- **Audience Experience:** A premium, exciting educational journey suitable for students and young learners without being childish, cartoonish, or arcade-like. Treat learners as future astrophysicists, flight directors, and explorers.
- **Visual Stance:** Avoid generic cyberpunk aesthetics, harsh neon purple/magenta palettes, and opaque milky glassmorphism. Space is a deep, layered cosmic expanse illuminated by natural solar radiance and precise instrument readouts.
- **Primary Visual Focus:** The continuously animated solar system remains the hero of the platform at all times; interface overlays support and elevate the 3D scene rather than competing with it.

---

## 3. Celestial 3D Engine Specification

The primary UI/UX is built around a continuously animated, scientifically inspired 3D solar system—**not a static illustration or background image**.

```
                           [Layered Deep Space Starfield]
                                       │
                      ┌────────────────┴────────────────┐
                      │    Luminous Sol (Sun Core)      │
                      │  Point Light Source + Glow      │
                      └────────────────┬────────────────┘
                                       │
               ┌───────────────────────┼───────────────────────┐
               ▼                       ▼                       ▼
      [Visible Orbit Curves]   [Continuous Revolutions]  [Axial Rotations]
      Hairline celestial paths  Keplerian-inspired paths  Distinct tilt & spin
               │                       │                       │
               └───────────────────────┼───────────────────────┘
                                       ▼
                       [Realistic Solar Lighting & Shadows]
                       Plausible day/night terminator lines
```

### Essential 3D Engine Pillars
1. **Luminous Sol (Sun):** Central primary light source emitting radial illumination across the scene, surrounded by a realistic coronal shader glow.
2. **Continuous Orbital Revolutions:** All celestial bodies continuously revolve along their respective orbital planes around the Sun at harmonized, perceptible speeds.
3. **Axial Planetary Rotation:** Each planet rotates about its own axis with scientifically inspired axial tilts (e.g. Earth at 23.5°, Uranus with its extreme sideways tilt).
4. **Visible Orbital Paths:** Thin, anti-aliased elliptical/circular path lines (`rgba(148, 163, 184, 0.16)`) indicating planetary trajectories without visual clutter.
5. **Layered Depth Starfield:** Multi-tiered background particle starfield featuring faint parallax, astronomical color variations (blue-white giants, red dwarfs), and faint galactic dust.
6. **Realistic Solar Lighting & Shading:** Point-light illumination from Sol creates natural day/night terminator lines and shadows on planetary surfaces.
7. **Distinct Planetary Visuals:** Authentic surface textures, cloud layers with differential rotation (Earth, Jupiter, Saturn), transparent ring systems casting shadows (Saturn), and subtle atmospheric rims (Earth, Uranus, Neptune).

---

## 4. Celestial Scaling: Visual Navigation vs. Real Astronomy

To balance interactive usability with scientific integrity, ORBIT ACADEMY strictly delineates **Visual Navigation Scale** from **Astronomical Measurement Scale**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                    TWO-TIER SCALING ARCHITECTURE                       │
├───────────────────────────────────┬────────────────────────────────────┤
│ 3D Viewport Navigation Scale      │ Scientific Dossier Measurement     │
│ (Interactive Usability)           │ (Astronomical Realism)             │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Normalized logarithmic distances│ • True semi-major axis (AU & km)   │
│ • Scaled planetary diameters      │ • True mean radius & volume        │
│ • Keeps all 8 bodies clickable    │ • Real orbital period (days/years) │
│ • Prevents kilometer-long empty   │ • Real surface gravity & mass      │
│   scroll voids                    │ • Authentic atmospheric chemistry  │
│ • Clear HUD disclaimer provided   │ • Academic precision for learning  │
└───────────────────────────────────┴────────────────────────────────────┘
```

### Scaling Rules & Data Contract
1. **Viewport Usability:** If true physical scale were rendered on a screen, Mercury would be sub-pixel while Neptune would be miles offscreen. The 3D scene uses a curated, visually balanced logarithmic scaling model so every planet is distinctly visible and selectable.
2. **Dossier Scientific Truth:** When a student inspects any planet, all displayed numerical data, scientific telemetry, charts, and educational modules reflect authentic NASA/astronomical measurements.
3. **HUD Telemetry Legend:** A subtle micro-badge on the viewport telemetry frame communicates this clearly to learners:
   `ORBIT SCALE: LOGARITHMIC (INTERACTIVE) // ASTRONOMICAL METRICS: PRECISE NASA STANDARDS`

---

## 5. Progressive Labeling & Interaction States

Planetary markers and telemetry follow progressive disclosure to maintain a clean, cinematic view while offering instant discovery on demand.

```
[Default Minimal State]        ──(Hover / Focus)──>        [Expanded Telemetry Preview]
  • Subtle 6px hollow marker                                  • Reticle brackets expand [ • ]
  • Compact planet name tag                                   • Distance from Sol & orbit speed
  • Zero visual clutter                                       • Target learning module badge
                                                                        │
                                                             (Click / Selection)
                                                                        ▼
                                                           [Cinematic Focus & Dossier]
                                                              • Camera orbits to planet
                                                              • Reticle locks target
                                                              • Dossier drawer slides in
```

### Interaction Tiers
1. **Default State (Passive Observation):**
   - Reticle: Minimal 6px circular outline (`rgba(56, 189, 248, 0.5)`).
   - Label: Clean 11px uppercase monospace text (`#94A3B8`) beneath the body.
   - Occlusion: Fades out automatically when occluded by the Sun or camera frustum.
2. **Hover / Keyboard Focus State:**
   - Reticle: Expands into targeting brackets (`[ ☉ ]`), turns Cool Cyan (`#38BDF8`) with subtle glow.
   - Label: Reveals quick telemetry preview: Latin name, distance in AU, and assigned module (e.g. `MARS // PLANETARY EXPLORATION`).
   - Cursor: `cursor: pointer`.
3. **Selected State:**
   - Reticle: Locks with double-bracket target indicator in Solar Amber (`#F59E0B`).
   - Camera: Initiates cinematic transition (see Section 6).
   - Dossier: The planet's Mission Dossier slides in smoothly from the right (desktop) or bottom (mobile).

---

## 6. Cinematic Camera Choreography

Planet selection triggers a smooth, inspiring camera flight that brings the student into close orbital inspection without causing disorientation or motion sickness.

```
[Macro Solar Overview] ────── Logarithmic Bezier Travel (1.2s - 1.5s) ──────> [Framed Orbital Vantage]
      FOV: 45°                                                                       FOV: 35°
  Distance: ~120 units                                                           Distance: ~3-4 radii
```

### Choreography Specifications
1. **Travel Arc:** Camera sweeps along a curved Bezier arc towards the target planet rather than a linear zoom, providing depth parallax with background stars and neighbor orbits.
2. **Framing & Lighting:** The camera settles at an angled perspective showing both the day side and the atmospheric shadow terminator.
3. **Detail Revelation:** As the camera approaches, geometry transitions to higher fidelity and procedural surface details (craters, storms, ring shadows) become visible.
4. **Target Tracking:** Once arrived, the camera smoothly tracks the planet's slow orbital progress without abrupt repositioning.
5. **Return to Overview:** Pressing `[Esc]` or selecting the Sun / Mission Control pulls the camera back to the macro solar overview.

---

## 7. Performance & Progressive 3D Architecture

ORBIT ACADEMY must run smoothly on everyday student laptops, Chromebooks, and mobile tablets.

### Performance Engineering Standards
1. **Adaptive Pixel Ratio:** Clamp rendering DPR to avoid GPU overload on ultra-high-res displays:
   `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));`
2. **Progressive Texture Loading:**
   - Level 1: Instant load with lightweight procedural materials / compressed low-res base textures.
   - Level 2: Stream 1K/2K detailed texture maps asynchronously only as the user approaches or zooms in.
3. **Draw Call Optimization:**
   - Combine orbital curve geometries where feasible.
   - Use instanced rendering for distant asteroid belt particles and starfields.
4. **Frustum & Occlusion Culling:** Disable rendering and label calculations for off-screen celestial bodies.
5. **Dynamic Resolution Scaling:** If frame rate dips below 45 FPS for more than 3 consecutive seconds, gracefully reduce shadow resolution and disable post-processing bloom passes.
6. **Resource Lifecycle Management:** Strictly dispose of geometry, material shaders, and WebGL textures when leaving the 3D scene or switching tabs to avoid memory leaks.

---

## 8. Global Color Tokens

### A. Deep Space Surfaces (Background & Elevation)

| Token | Hex / Value | CSS Variable | Purpose |
|---|---|---|---|
| Deep Space Base | `#05070D` | `--color-space-deep` | WebGL canvas clear color & base backdrop |
| Mission Navy Surface | `#0A0F1D` | `--color-space-navy` | Primary HUD bars, navigation docks, cards |
| Elevated Surface | `#11182E` | `--color-space-elevated`| Hovered cards, flyout drawers, dropdowns |
| Surface Scrim | `rgba(7, 11, 22, 0.84)` | `--color-space-overlay` | Scrim for modals (subtle 8px backdrop blur) |
| Instrument Border | `rgba(148, 163, 184, 0.14)` | `--color-space-border` | Hairline 1px borders delineating instrument cards |
| Active Border | `rgba(56, 189, 248, 0.40)` | `--color-space-border-active` | Active/focused card outline |

### B. Interface Accents & Telemetry Colors

| Role | Hex | CSS Variable | WCAG Contrast on `#0A0F1D` | Usage |
|---|---|---|---|---|
| Primary Accent / Telemetry | `#38BDF8` | `--color-telemetry-cyan` | **9.2:1 (AAA)** | Focus reticles, active orbits, selection indicators |
| Mission Highlight / CTA | `#F59E0B` | `--color-solar-amber` | **8.4:1 (AAA)** | Primary action buttons ("Launch Module"), Sol telemetry |
| Primary Text | `#F8FAFC` | `--color-text-primary` | **15.8:1 (AAA)** | Planet titles, primary data values, headers |
| Secondary Text | `#94A3B8` | `--color-text-secondary` | **6.7:1 (AA)** | Scientific descriptions, metric labels, coordinates |
| Muted / Structural | `#475569` | `--color-text-muted` | **3.2:1 (UI Boundary)** | Inactive orbit lines, grid markings, subtle timestamps |
| Status Success | `#10B981` | `--color-status-success` | **7.5:1 (AAA)** | Telemetry online, module completed |
| Status Warning | `#F59E0B` | `--color-status-warning` | **8.4:1 (AAA)** | Orbit intersection notice, mission challenge active |
| Status Danger | `#EF4444` | `--color-status-danger` | **5.3:1 (AA)** | Error states, hazardous telemetry warning |

### C. Astronomical Reference Tokens (Harmonized HUD Alignment)
These tokens are strictly calibrated to the real astronomical appearances of celestial bodies:
- **Sol (Sun):** `#FBBF24` (Corona Amber)
- **Earth:** `#38BDF8` (Hydrosphere Blue) & `#34D399` (Biosphere Green)
- **Mars:** `#F87171` (Iron Oxide Rust)
- **Jupiter:** `#FDE68A` (Atmospheric Band Cream) & `#D97706` (Great Red Spot Amber)
- **Saturn:** `#FCD34D` (Ring System Gold)
- **Uranus:** `#6EE7B7` (Methane Aquamarine)
- **Neptune:** `#60A5FA` (Deep Methane Azure)

---

## 9. Typography System

- **Heading & Narrative Font:** `Exo` (Modern geometric sans with aeronautical heritage)
- **Telemetry & Metric Font:** `Roboto Mono` (Monospaced, high-precision technical readouts)
- **Web Font Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Exo:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Roboto+Mono:wght@300;400;500;600&display=swap');
```

### Typographic Scale

| Token | Family | Size | Weight | Line Height | Letter Spacing | Purpose |
|---|---|---|---|---|---|---|
| `--text-display` | `Exo` | `2.25rem` (36px) | 700 | 1.15 | `0.02em` | Mission title / Hero headers |
| `--text-h1` | `Exo` | `1.5rem` (24px) | 600 | 1.25 | `0.01em` | Celestial body name in Dossier |
| `--text-h2` | `Exo` | `1.125rem` (18px)| 600 | 1.35 | `0.01em` | Section headers inside learning cards |
| `--text-body` | `Exo` | `0.9375rem` (15px)| 400 | 1.5 | `0.005em` | Educational descriptions and narrative |
| `--text-telemetry` | `Roboto Mono` | `0.875rem` (14px)| 500 | 1.4 | `-0.01em` | Coordinates, distance, mass, periods |
| `--text-micro` | `Roboto Mono` | `0.6875rem` (11px)| 600 | 1.2 | `0.08em` (UPPER) | Status badges, reticle markers, tags |

---

## 10. Spacing & Spatial Rhythm

Strict 4/8dp baseline grid for UI overlays:

| Token | Value | Purpose |
|---|---|---|
| `--space-xs` | `4px` / `0.25rem` | Micro gaps between badge icons and telemetry labels |
| `--space-sm` | `8px` / `0.5rem` | Standard inline gap, icon padding, chip spacing |
| `--space-md` | `16px` / `1rem` | Card interior padding, input field padding |
| `--space-lg` | `24px` / `1.5rem` | Dossier sections, modal internal gutters |
| `--space-xl` | `32px` / `2rem` | Distance from viewport edges for HUD frames |
| `--space-2xl` | `48px` / `3rem` | Major section division in curriculum drawers |

---

## 11. Depth, Elevation & 3D Coexistence Architecture

To ensure the 3D celestial engine and 2D telemetry HUD interface seamlessly without visual clashing:

```
[Layer 4: Overlays & Modals]          z-index: 50 | Telemetry popups, module modals
[Layer 3: Viewport HUD Frame]         z-index: 30 | Fixed top nav, bottom planet dock
[Layer 2: In-World Celestial Labels]  z-index: 20 | Projected 2D markers anchored to 3D bodies
[Layer 1: 3D Celestial Objects]       z-index: 1  | Three.js / R3F Canvas (planets, orbits, Sol)
[Layer 0: Deep Space Canvas]          z-index: 0  | Starfield shaders, cosmic background
```

### Coexistence Rules
1. **Restrained Instrument Glass:** Panels use high-opacity dark matte backgrounds (`rgba(10, 15, 29, 0.90)`) with subtle backdrop blur (maximum `8px`) and hairline border (`1px solid rgba(148, 163, 184, 0.14)`). No muddy white or blinding frosted glass.
2. **Dynamic Occlusion:** In-world reticle markers automatically hide (`opacity: 0`) when a planet passes behind the Sun's coronal disc or falls outside the camera frustum.
3. **Pointer-Event Disambiguation:** 
   - HUD overlays use `pointer-events: auto`.
   - Empty regions between HUD elements pass through with `pointer-events: none` to preserve smooth 3D orbit dragging.

---

## 12. Component Specifications

### A. Mission Action Button (`.btn-mission`)
```css
.btn-mission {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #F59E0B;
  color: #05070D;
  font-family: 'Exo', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.02em;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background 200ms ease, transform 150ms ease, box-shadow 200ms ease;
}

.btn-mission:hover {
  background: #D97706;
  transform: translateY(-1px);
  box-shadow: 0 0 16px rgba(245, 158, 11, 0.35);
}

.btn-mission:focus-visible {
  outline: 2px solid #38BDF8;
  outline-offset: 2px;
}
```

### B. Telemetry Ghost Button (`.btn-telemetry`)
```css
.btn-telemetry {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(56, 189, 248, 0.08);
  color: #38BDF8;
  font-family: 'Roboto Mono', monospace;
  font-weight: 500;
  font-size: 13px;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid rgba(56, 189, 248, 0.30);
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-telemetry:hover {
  background: rgba(56, 189, 248, 0.18);
  border-color: #38BDF8;
  transform: translateY(-1px);
}
```

### C. Planet Dossier Panel (`.planet-dossier`)
```css
.planet-dossier {
  width: 380px;
  max-width: 90vw;
  background: rgba(10, 15, 29, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 12px;
  padding: 24px;
  color: #F8FAFC;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5);
}
```

### D. Target Reticle & Celestial Label (`.celestial-marker`)
```css
.celestial-marker {
  position: absolute;
  pointer-events: auto;
  cursor: pointer;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 8px;
}

.reticle-ring {
  width: 14px;
  height: 14px;
  border: 1.5px solid #38BDF8;
  border-radius: 50%;
  transition: transform 200ms ease, border-color 200ms ease;
}

.celestial-marker:hover .reticle-ring {
  transform: scale(1.35);
  border-color: #F59E0B;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
}
```

---

## 13. Planetary Navigation Architecture

| Celestial Destination | Learning Module Target | Core Educational Mission |
|---|---|---|
| ☀️ **Sun (Sol)** | **Home / Mission Control** | Central mission dashboard, solar radiation, space weather |
| 🌍 **Earth** | **Science Lab** | Atmospheric composition, magnetic shield, climate science |
| 🔴 **Mars** | **Planetary Exploration** | Rover telemetry, terrain geology, search for ancient water |
| 🪐 **Jupiter** | **Planetary Science & Experiments**| Gas giants, Jovian radiation belts, Galilean moon systems |
| 🪐 **Saturn** | **Drawing & Colouring** | Ring dynamics, ice particles, creative visual expression |
| ⚪ **Uranus** | **Scientific Quizzes** | Axial tilt anomaly, ice giant chemistry, knowledge challenges |
| 🔵 **Neptune** | **Astronomy & Deep Discovery** | Supersonic wind dynamics, Kuiper Belt gateway, exoplanets |

---

## 14. Motion & GSAP Choreography

1. **Camera Orbital Trajectory:**
   - Easing: `power2.inOut` or `expo.out` over `1.2s` to `1.5s`.
   - Never snap or teleport camera abruptly; curve around an elliptical path with damping.
2. **Telemetry Stagger (GSAP):**
   ```js
   gsap.from('.telemetry-metric', {
     opacity: 0,
     x: 12,
     duration: 0.35,
     stagger: 0.05,
     ease: 'power1.out'
   });
   ```
3. **Reduced Motion Compliance (`prefers-reduced-motion: reduce`):**
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
     /* Skip 3D camera travel; jump directly to destination frame */
     /* Freeze idle celestial auto-rotation and orbital movements */
     /* Render static celestial path guides */
   }
   ```

---

## 15. Responsive Cross-Device Matrix

- **Desktop (≥ 1024px):**
  - Full-screen continuously animated 3D orbital space.
  - Floating top Mission Status bar with system telemetry.
  - Persistent bottom Planet Quick-Access dock.
  - Right slide-in Dossier Drawer (380px wide).
- **Tablet (768px – 1023px):**
  - Full-screen 3D with multi-touch pinch-to-zoom and drag-orbit.
  - Touch target hitboxes minimum `48px × 48px`.
  - Floating collapsible right drawer.
- **Mobile (< 768px):**
  - Reduced geometric complexity for mobile GPU performance.
  - Persistent bottom horizontal carousel of celestial bodies for one-thumb switching.
  - Dossier renders as an accessible bottom-sheet modal.
  - Dedicated **"2D Directory Mode"** toggle button prominently displayed in header.

---

## 16. Accessibility (a11y) & Inclusive Learning

- **2D Accessible Fallback:** Instant keyboard-accessible Solar Directory list (`<nav>` / `<ol>`) for screen readers and users who prefer non-3D navigation.
- **Keyboard Shortcut Map:**
  - `[Tab]` / `[Shift+Tab]`: Cycle through celestial markers.
  - `[1]` through `[7]`: Direct switch to Sun through Neptune.
  - `[Space]` or `[Enter]`: Engage focused celestial body & open dossier.
  - `[Esc]`: Reset camera to Solar System overview.
- **Iconography Standard:** Zero emojis as UI icons. Use vector SVGs exclusively (e.g. Phosphor Icons / Lucide) with explicit `aria-hidden="true"` or accessible labels.
- **Color Independence:** All telemetry states combine color with distinct shape/symbol and text identifiers.

---

## 17. Strict Anti-Patterns (Forbidden)

- ❌ **No static planet illustrations or static background images as the main interface:** The solar system must be a live, continuously revolving 3D environment.
- ❌ **No light-mode clinical or corporate themes:** ORBIT ACADEMY is an astronomical observatory experience.
- ❌ **No emojis as UI icons:** Use structured vector SVG icons.
- ❌ **No cyberpunk purple neon / rainbow gradients:** Preserves scientific credibility.
- ❌ **No heavy, muddy frosted glass:** Retains crisp visual fidelity of 3D planets.
- ❌ **No layout-shifting hover effects:** Hover states must never alter sibling element dimensions.
- ❌ **No unannounced 3D camera snaps:** All transitions must be predictable and respect reduced-motion settings.

---

## 18. Pre-Delivery Quality Checklist

Before any component or page is delivered:
- [ ] Contrast ratio verified against space background (≥4.5:1 text, ≥3:1 UI boundaries)
- [ ] No emojis used for system icons or navigation
- [ ] Touch targets verified ≥44px (desktop) / ≥48px (touch devices)
- [ ] Keyboard navigation (`Tab`, `Enter`, `Esc`) tested without mouse dependency
- [ ] 2D semantic directory alternative functional
- [ ] `prefers-reduced-motion` tested (camera motion disabled, transitions immediate)
- [ ] Responsive layout verified at 375px, 768px, 1024px, and 1440px
- [ ] WebGL canvas properly releases resources on component unmount
- [ ] Visual navigation scale clearly distinguished from scientific NASA values
