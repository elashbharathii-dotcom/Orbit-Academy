# MARS SURVIVAL — MASTER DEVELOPMENT RULES

## Project Vision
Develop an immersive, realistic 3D Mars survival and exploration simulator integrated into the Orbit Academy educational ecosystem.

## Core Principles
1. **Realistic physics over arcade-style movement:** Kinematics must adhere to true Martian gravity ($0.38g$), momentum, surface friction, slope limits ($32^\circ$), and 6-wheel rocker-bogie rover suspension mechanics.
2. **Functional gameplay over decorative placeholders:** Every interactive object, node, terminal, or life-support unit must have real, working simulation logic—no cosmetic-only interactions or fake progress bars.
3. **Consistent visual design throughout the game:** Diegetic curved astronaut helmet visor HUD, aerospace typography (`font-mono`), cohesive color tokens (Cyan `#00F0FF`, Amber `#F59E0B`, Crimson `#EF4444`), and authentic Jezero Crater Martian atmospheric palette.
4. **Modular, maintainable architecture:** Decoupled architecture where the simulation state lives in Zustand (`useMarsGameStore.ts`), R3F canvas components handle 3D rendering (`components/canvas/`), and 2D interfaces live in DOM overlays (`components/hud/`).
5. **Performance optimisation without sacrificing visual quality:** Strict 60 FPS budgets ($\le 16.6\text{ ms}$ frame time, $< 60$ draw calls, GPU instancing for rock/mineral clusters, zero memory allocations in `useFrame`, and complete Three.js resource disposal).
6. **Every gameplay system must interact with relevant existing systems:** New features must connect with player vitals, backpack encumbrance, time-of-day sol cycle, power grids, vault inventory, and mission progression.

## Development Rules
- **Inspect existing code before modifying it:** Always examine relevant files in `src/modules/mars-adventure/survival-game/` and dependent systems prior to making changes.
- **Preserve working functionality:** Never break or regress existing locomotion, rover driving, resource harvesting, storage, airlock sealing, or renovation systems.
- **Avoid duplicate components and dependencies:** Reuse shared utilities, Three.js geometries/materials, and UI patterns rather than adding redundant libraries or duplicate meshes.
- **Test every major gameplay change:** Run builds (`npm run build`), verify render loops at 60 FPS, and test keyboard/touch controls across scenarios.
- **Ensure collision detection works for all solid objects:** Outpost Alpha walls, airlock doors, solar arrays, boulders, and terrain elevation bounds must reliably block player and vehicle clipping.
- **Maintain consistent game state across scenes:** Ensure player vitals, Sol cycle time, collected nodes, base upgrades, and storage persist properly in `localStorage ('mars_frontier_save_v1')`.
- **Never claim functionality is complete without testing:** Validate in code and runtime before reporting completion.

## Gameplay Systems
- **Astronaut movement and interaction:** 0.38g jumping, sprint stamina/O2 trade-offs, continuous terrain heightfield resolution, slope sliding, and raycast interaction prompt within 3.5m.
- **Rover exploration:** 6-wheel rocker-bogie suspension conforming to ground normals, throttle/braking kinematics, battery consumption, daytime solar recharging, and mobile pressurized shelter.
- **Backpack and inventory:** Mass-constrained backpack (20 kg base, expandable to 35 kg), real-time mass calculation, encumbrance limits, and category organization.
- **Resource collection and processing:** 12 authentic Martian substances (manufactured mission debris and planetary minerals like hematite, water ice, gypsum, and smectite regolith) with analytical mass spectrometer data.
- **Farming and survival:** Dynamic life-support loop (O2 depletion, suit heating load based on ambient surface temperature, core body homeostasis, and GCR radiation exposure), water ice electrolysis, and Outpost Alpha bio-dome hydroponics.
- **Space centre renovation:** 5-stage modular restoration of Outpost Alpha (Power Room, Storage Locker Expansion, Hydroponic Greenhouse, Comms Radar Array, and Secondary Geodesic Dome).
- **Mission progression:** Structured Sol objectives across survival, exploration, and planetary science milestones with telemetry log rewards.
- **Environmental simulation:** 24.65-hour diurnal Martian Sol clock, solar irradiance calculations ($0\text{ to }590\ \text{W/m}^2$), dynamic surface temperature ($-115^\circ\text{C}\text{ to }+20^\circ\text{C}$), and atmospheric dust storms attenuating solar power and visibility.

## Quality Standard
Every new feature should improve immersion, playability, realism, or performance.

## Dedicated Workspace Agent Skills
When implementing features, reference the specialized skill directives under `.agents/skills/`:
- `3d-game-development`
- `realistic-physics`
- `mars-environment-design`
- `survival-game-design`
- `game-ui-ux`
- `game-optimisation`
