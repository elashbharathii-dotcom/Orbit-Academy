---
name: mars-environment-design
description: "Atmospheric science, geological landscape generation, and environmental visual direction for Mars simulation. Guides realistic Martian sky scattering, Jezero Crater terrain math, dust storms, diurnal solar cycles, and Outpost Alpha architectural integration."
---

# MARS ENVIRONMENT DESIGN — GEOLOGY & ATMOSPHERE SPECIFICATION

## 1. Role & Scientific Realism Standards

Act as the Principal Technical Artist, Martian Geologist, and Environmental Director for Orbit Academy.

Your mandate is to craft a scientifically grounded, visually breathtaking simulation of the Red Planet. You draw directly from **NASA Perseverance/Curiosity rover imagery**, **MOLA elevation telemetry**, and **atmospheric radiative transfer models**:
- **Not a generic red desert:** Mars features iron-oxide-coated basaltic sands, rich ochre dunes, banded sedimentary escarpments, and specular crystalline ice pockets in shadowed craters.
- **Atmospheric Optics:** Mars skies are butterscotch-tan during the day due to suspended micron-sized airborne dust. Sunsets reverse Earth's optics: scattering dust creates a **pale blue solar halo** surrounded by a dusty rust sky.
- **Diurnal Environment:** Temperature swings from $-80^\circ\text{C}$ at night to $+2^\circ\text{C}$ at noon, drastically affecting player suit power consumption and station solar arrays.

---

## 2. Existing Environmental Architecture

Under `src/modules/mars-adventure/survival-game/components/canvas/`:

```
canvas/
├── MarsSky.tsx             # Diurnal sun trajectory, Mie scattering colors, Phobos/Deimos
├── MarsTerrain.tsx         # Analytical Jezero Crater elevation, geological materials, rocks
├── HabOutpost.tsx          # Geodesic domes, airlock seals, solar arrays, interior lights
├── ResourceNodes.tsx       # Crystalline ice, hematite outcrops, scrap salvage nodes
└── DustStormParticles.tsx  # Dynamic GPU particle storm system tied to store weather
```

---

## 3. Atmospheric Lighting & Color Palette

### Chromatic Standards (Calibrated for ACESFilmic Tone Mapping):

| Environment State | Ambient Light | Directional Sun | Fog Color | Sky Gradient |
|---|---|---|---|---|
| **High Noon** | `#452A18` (0.45 intensity) | `#FFF0D4` (1.8 intensity) | `#854422` (density 0.0035) | `#C27848` to `#4D2512` |
| **Blue Twilight / Sunset** | `#1A1B2E` (0.22 intensity) | `#60A5FA` (1.2 intensity) | `#2A1608` (density 0.005) | `#38BDF8` halo into `#581C10` |
| **Martian Midnight** | `#070A18` (0.12 intensity) | None (Phobos `#94A3B8` 0.08) | `#05070D` (density 0.004) | Deep void `#030611` with Milky Way |
| **Dust Storm Warning** | `#3B1A0E` (0.55 intensity) | `#D97706` (0.35 intensity) | `#78350F` (density 0.022) | `#92400E` to `#451A03` |

### Lighting Rules:
1. **No Pure Black Shadows:** Mars has a thin atmosphere, but airborne dust creates ambient fill light. Ambient light must never fall below `0.1` intensity, or shadowed crevices become unreadable pitch-black voids.
2. **Sharp Solar Limb:** The Sun appears ~32% smaller in the Martian sky than on Earth due to orbital distance (1.52 AU). Render the sun disk as a focused, high-intensity flare with Mie halo scattering.
3. **Phobos & Deimos Moons:** Phobos travels west-to-east rapidly (completing an orbit in 7.6 hours), while tiny Deimos moves slowly east-to-west.

---

## 4. Geological Terrain Engineering (`MarsTerrain.tsx`)

The landing zone is modeled after **Jezero Crater**, an ancient river delta:

### Procedural Layering Architecture:
1. **Regional Crater Rim Basin:**
   A radial parabolic dip centered around the base station:
   $$y_{\text{basin}} = -D_{\text{crater}} \cdot \exp\left(-\frac{r^2}{2\sigma_{\text{crater}}^2}\right) + H_{\text{rim}} \cdot \exp\left(-\frac{(r - R_{\text{rim}})^2}{2\sigma_{\text{rim}}^2}\right)$$
2. **Multi-Octave Dune Ridges:**
   Superimposed Perlin/Simplex noise simulating wind-shaped barchan dunes:
   $$y_{\text{dune}} = \sum_{k=1}^{3} A_k \cdot \sin(\mathbf{P} \cdot \mathbf{W}_k) \cdot \text{noise}(\mathbf{P} \cdot f_k)$$
3. **Smooth Station Apron:**
   A flat, compressed regolith zone around Outpost Alpha ($r < 18\text{m}$) where base construction has smoothed the surface for astronaut and rover traffic.
4. **Basalt Boulder Placement:**
   Deterministic distribution of scattered rock outcrops. Boulders are instanced and scale-jittered along ridge crests, serving as natural cover and navigational landmarks.

---

## 5. Dynamic Weather & Dust Storm Particles (`DustStormParticles.tsx`)

### Dust Storm Progression Phases:
1. **Clear Weather (`weather = 'clear'`):**
   - Visibility: 400m+.
   - Solar Array Efficiency: 100%.
   - Ambient particle count: low drifting red dust motes.
2. **Dust Devil Activity (`weather = 'dust_devil'`):**
   - Localized spinning vortices lifting surface particles.
3. **Severe Global Storm (`weather = 'storm'`):**
   - Visibility: drops to 30–45m.
   - Fog density rises to `0.022`.
   - Solar Array Output: collapses to 15–20% (forces reliance on station batteries and fuel cells).
   - Audio: howling wind resonance and suit visor static.

### Particle Optimization:
- Use `THREE.Points` with a single `BufferGeometry` holding 800–1,500 particles.
- Update positions in GPU vertex shader or wrap particles in a local bounding box centered on the player so particles are never wasted in empty desert.

---

## 6. Architectural Design: Outpost Alpha

The base architecture follows modern NASA/ESA Martian habitation specifications:

1. **In-Situ Regolith Shielding:** Geodesic dome hulls are coated in sintered Martian regolith bricks to shield astronauts from deadly galactic cosmic radiation (GCR) and solar particle events.
2. **Airlock Protocols:** Dual-door interlock system with cycling pumps and pressure gauges. Cycling the airlock consumes oxygen from the station buffer.
3. **Hydroponic Greenhouse:** Visible transparent aerogel dome glowing with violet-red horticultural LED spectrum ($450\text{nm}$ blue + $660\text{nm}$ deep red).
4. **Modular Renovation Nodes:** Power generator wing, storage silo, and communications mast articulate dynamically when upgraded via the renovation terminal.

---

## 7. Environment Verification Checklist

Before approving any visual or environmental change:

1. [ ] **Color Grading Audit:** Does the terrain avoid neon orange or cartoonish saturated red? It should reflect natural iron-oxide rust (`#854422` to `#A34A28`).
2. [ ] **Sun-Fog Alignment:** Does the fog color smoothly transition with diurnal sun elevation without ugly visual clipping at the far plane?
3. [ ] **Specular Balance:** Does dry regolith have high roughness ($> 0.85$), while water ice nodes exhibit high specularity and subtle transmission?
4. [ ] **Indoor Atmospheric Transition:** When entering the HabOutpost airlock, does the outdoor dust fog smoothly diminish to clear pressurized interior air?
5. [ ] **Performance Under Storms:** Does the frame rate maintain 60 FPS when particle count, storm audio, and fog density reach peak intensity?
