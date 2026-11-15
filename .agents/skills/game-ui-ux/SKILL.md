---
name: game-ui-ux
description: "User interface and user experience design intelligence for the Orbit Academy Mars Survival Game. Directs diegetic curved helmet HUDs, 360-degree compass radars, vital telemetry gauges, interactive raycast prompts, modal inventory architectures, and procedural Web Audio synthesizers."
---

# GAME UI / UX — ORBIT ACADEMY MARS ENGINE

## 1. Role & UI/UX Philosophy

Act as the Lead UI/UX Designer and Diegetic Interface Specialist for the Orbit Academy Mars Survival Game.

Your objective is to design, implement, and maintain an intuitive, visually stunning, and educationally immersive user experience. The interface bridges hard aerospace telemetry with playful, accessible educational interaction.

### Fundamental UX Pillars:
1. **Diegetic Immersion:** The interface represents the heads-up display (HUD) projected directly onto the inner curve of the astronaut's EVA helmet visor. Subtle chromatic aberration, scanlines, and curved corner vignettes reinforce that the player is inside a pressurized spacesuit.
2. **Instant Cognitive Clarity:** Under harsh survival conditions, critical data (oxygen remaining, power reserves, extreme temperature alerts) must be readable in under 200 milliseconds.
3. **Dual Auditory & Visual Feedback:** Every critical state change (oxygen < 15%, resource harvested, airlock sealed) pairs a distinct visual alert with a synthesized procedural audio cue.
4. **Zero Canvas Interference:** 2D interfaces live in DOM overlays above the Canvas, utilizing hardware-accelerated CSS transforms and Tailwind utility classes without triggering WebGL re-renders.

---

## 2. Visor HUD Architecture & Screen Layout

The HUD layout is orchestrated in `src/modules/mars-adventure/survival-game/components/hud/HelmetVisorHUD.tsx`:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [OUTPOST ALPHA]     ◄─── N ── 045° ── E ── 135° ── S ──►      SOL 01   │
│ Irradiance: 420 W/m²                              Temp: -62°C  14:32 MT │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                                                                        │
│                                 [ + ]                                  │
│                        [E] GATHER WATER ICE (1.0 kg)                   │
│                                                                        │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ [HEALTH: 100%]  [OXYGEN: 84%]  [POWER: 92%]     [C] CARGO [14.2/20kg]  │
│ [CORE: 37.0°C]  [SUIT:  100%]  [RAD: 0.18 mSv]  [M] MISSION LOG        │
│                                                 [V] SPECTRAL SCANNER   │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown:
- **Top Bar (`CompassRadar.tsx`):**
  - Continuous 360-degree horizontal compass tape displaying cardinal headings (N, NE, E, SE, S, SW, W, NW).
  - Dynamic radar markers tracking key waypoints: Outpost Alpha (Cyan), Exploration Rover (Amber), Photovoltaic Farm (Yellow), Discovered Minerals (Purple/Emerald).
  - Sol clock telemetry: Sol number, Martian local solar time (24.65 hr sol), ambient temperature, solar irradiance.
- **Center Screen (`InteractionPrompt.tsx`):**
  - Minimalist aiming reticle with dynamic state expansion when hovering over interactable objects within 3.5m radius.
  - Floating action pill showing keybind (`[E]`), action verb (`GATHER`, `OPEN AIRLOCK`, `DRIVE ROVER`), and resource mass.
- **Bottom Left Cluster (`VitalGauges.tsx`):**
  - High-visibility segmented telemetry bars for Health, Oxygen, Suit Power, Core Temperature, Suit Integrity, and Cumulative Radiation.
  - Dynamic alert pulsing when values drop below critical thresholds (<15% O2, <10% Power).
- **Bottom Right Action Bay:**
  - Quick action pills for Cargo Backpack (`[C]`), Mission Log (`[M]`), Spectral Visor Scanner (`[V]`), and Audio Toggle.
- **Perimeter Overlay (`ScannerOverlay.tsx`):**
  - Visor glass edge reflections, subtle scanline shaders, and pulsing emergency red vignette during life-support failures.

---

## 3. Compass Radar & Waypoint Projection UX

The compass tape in `CompassRadar.tsx` translates 3D world vectors into 2D screen positions along the top compass ribbon.

### Math for Heading & Waypoint Ribbon Offset:
1. **Camera Yaw Calculation:**
   Extract player camera yaw $\psi$ in radians from `-PI` to `+PI`.
2. **Target Angle & Delta Wrapping:**
   For a world object at position $(x_t, z_t)$ relative to player $(x_p, z_p)$:
   $$\theta_t = \text{atan2}(x_t - x_p, z_t - z_p)$$
   $$\Delta\theta = (\theta_t - \psi + 3\pi) \pmod{2\pi} - \pi$$
3. **Horizontal Screen Placement:**
   Map $\Delta\theta$ to pixels across the tape width $W_{\text{tape}}$ with field of view angle $\alpha_{\text{fov}} \approx 90^\circ$:
   $$X_{\text{marker}} = \frac{W_{\text{tape}}}{2} + \left(\frac{\Delta\theta}{\alpha_{\text{fov}}}\right) \times \frac{W_{\text{tape}}}{2}$$
   - When $|\Delta\theta| > \alpha_{\text{fov}}/2$, clamp marker with an arrow indicator pointing toward off-screen direction.

### Visual Hierarchy of Radar Waypoints:
- **Outpost Alpha Hub:** 🔷 Cyan (`#00F0FF`) with habitat icon and distance in meters.
- **Exploration Rover:** 🔶 Amber (`#F59E0B`) with vehicle silhouette.
- **Solar Photovoltaic Array:** ☀️ Gold (`#FACC15`).
- **Resource Depletion Nodes:** 🟣 Violet / 🟢 Emerald with distance badge.

---

## 4. Modal Window UX Patterns

Modals pause non-critical interactions while maintaining background simulation continuity. They are styled with an aerospace terminal aesthetic: glassmorphic dark navy backgrounds, subtle cyan borders, and monospaced data grids.

### A. Inventory Drawer (`InventoryDrawer.tsx`)
- **Activation:** `[C]` key or bottom-right backpack pill click.
- **Key UX Elements:**
  - Visual backpack mass meter: `Current kg / Max kg` with progress bar turning amber at 80% and red at 100%.
  - Grid of collected items with count badges, unit mass, and category icons.
  - Instant crafting actions: `[Electrolyze O2]` button (active when $\ge 2$ Water Ice available) and `[Patch Suit]` button.

### B. Outpost Vault Depot (`StorageModal.tsx`)
- **Activation:** Pressing `[E]` at Outpost Alpha's interior storage terminal.
- **Split Two-Column Interface:**
  - Left Column: Astronaut EVA Backpack.
  - Right Column: Outpost Alpha Secure Vault.
  - Center: Single-item transfer arrows (`->` / `<-`) and `[DEPOSIT ALL]` batch shortcut.
  - Instant live updating of both inventories without modal reload.

### C. Renovation Terminal (`RenovationModal.tsx`)
- **Activation:** Pressing `[E]` at the central engineering terminal inside Outpost Alpha.
- **Stage Progression Cards:**
  - Displays Stages 1 through 5 with active state: `COMPLETED` (green check), `READY TO UPGRADE` (pulsing cyan button), or `LOCKED` (grayed out).
  - Material requirements display missing items in bold red (e.g., `Missing 2x Electronic Parts in Vault`).
  - Educational impact summary explaining what technological milestone this upgrade delivers.

### D. Substance Spectral Analyzer (`SubstanceInfoModal.tsx`)
- **Activation:** Triggered when student scans mineral outcrops or inspects samples from inventory.
- **Educational Deep-Dive Content:**
  - Common and chemical names ($Fe_2O_3$, $SiO_2$, etc.).
  - Astrobiological relevance and geological formation context.
  - Practical engineering utility for future human Mars colonies.

---

## 5. Procedural Web Audio API Soundscapes

Orbit Academy generates **100% of sound effects procedurally** via the Web Audio API in `audioSynthesizer.ts`, eliminating large MP3/WAV downloads and ensuring instant playback.

```typescript
// Architectural reference in audioSynthesizer.ts
class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // 1. Chime / UI Interaction Confirmation
  playChime(freq = 880, duration = 0.15) { ... }

  // 2. Airlock Pneumatic Pressure Cycle
  playAirlockCycle() { ... } // Bandpassed white noise sweep

  // 3. Life-Support Critical Alarm
  triggerCriticalAlarm(active: boolean) { ... } // Dual-tone 440Hz / 880Hz oscillation

  // 4. Geiger Counter Ionization Click
  playGeigerClick() { ... } // High-frequency transient burst
}
```

### Sound Design Rules:
1. **Never Blare Harsh Static:** All procedural white noise sweeps must pass through exponential gain envelopes with low-pass filtering ($f_c \le 2500\text{ Hz}$).
2. **Safe Volume Ceiling:** Master gain must never exceed `0.25` to protect student headphone audio.
3. **Instant Mute Honor:** The `toggleSound()` action must immediately suspend or disconnect the master gain node.

---

## 6. Color System & Aerospace Design Tokens

All HUD elements adhere to an aerospace palette defined in Tailwind:

| Token Name | Hex Code | Visual Semantic |
|---|---|---|
| `mars-cyan` | `#00F0FF` | Primary HUD telemetry, nominal indicators, radar reticles |
| `mars-amber` | `#F59E0B` | Warning state, rover telemetry, moderate battery drain |
| `mars-crimson` | `#EF4444` | Critical alarms, life-support failure, damaged components |
| `mars-green` | `#10B981` | Completed objectives, 100% full reserves, verified systems |
| `mars-panel-bg` | `rgba(5, 7, 13, 0.88)` | Backdrop blur for modals, drawers, and visor telemetry cards |
| `mars-border` | `rgba(0, 240, 255, 0.2)` | Subtle cyan bounding strokes for military-grade aerospace glass |

---

## 7. Testing & UX Checklist

- [ ] **Cross-Device Responsiveness:** Test HUD rendering from 1024x768 tablet up to 3840x2160 4K displays. Ensure vital bars do not clip or overlap the compass tape.
- [ ] **Modal Stacking Defense:** Ensure pressing `[Esc]` closes the topmost active modal first before opening `PauseModal`.
- [ ] **Auditory Comfort:** Verify that audio clicks do not clip or produce popping artifacts during rapid interaction.
- [ ] **Keyboard & Pointer Accessibility:** All modal actions must be executable via mouse click or keyboard triggers (`[C]`, `[M]`, `[V]`, `[Esc]`, `[E]`).
- [ ] **Colorblind Contrast:** Verify that critical status bars (Oxygen, Power) use distinct iconography and percentage text alongside colored fills.
