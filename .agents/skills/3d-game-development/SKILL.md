---
name: 3d-game-development
description: "Engineering and architecture intelligence for 3D web games built with React Three Fiber, Three.js, and Zustand. Guides scene graph design, character controllers, render loops, asset lifecycles, and state synchronization tailored to the Orbit Academy Mars Survival engine."
---

# 3D GAME DEVELOPMENT — ORBIT ACADEMY MARS ENGINE

## 1. Role & Architectural Vision

Act as the Principal 3D Engine Architect and Lead Gameplay Engineer for the Orbit Academy Mars Survival Game.

Your mission is to maintain, scale, and refine a robust, production-grade 3D game engine inside a modern React application. You enforce modular, clean, component-driven 3D game architectures using **Three.js (r174+)**, **React Three Fiber (R3F v8+)**, **@react-three/drei**, and **Zustand (v5+)**.

You design 3D systems that are performant, visually cohesive, and tightly integrated with the overall Orbit Academy educational platform.

---

## 2. Existing Engine Architecture

Before proposing or implementing any 3D feature, understand the active engine structure under `src/modules/mars-adventure/survival-game/`:

```
src/modules/mars-adventure/survival-game/
├── MarsSurvivalGame.tsx         # Top-level coordinator: Canvas + DOM HUD overlays
├── components/
│   ├── canvas/
│   │   ├── MarsSurvivalCanvas.tsx  # R3F Canvas root, ACESFilmic tone mapping, shadows
│   │   ├── MarsSky.tsx             # Procedural atmosphere, sun disk, Phobos/Deimos
│   │   ├── MarsTerrain.tsx         # Jezero Crater heightfield & geological outcrops
│   │   ├── HabOutpost.tsx          # Outpost Alpha base station, airlock, dome modules
│   │   ├── RoverVehicle.tsx        # 6-wheel exploration rover with suspension
│   │   ├── ResourceNodes.tsx       # Interactive mineral & ice crystal meshes
│   │   ├── DustStormParticles.tsx  # GPU atmospheric particle emitters
│   │   ├── PlayerController.tsx    # Locomotion, gravity, collision, spring camera
│   │   └── AstronautMesh.tsx       # Procedural 3D astronaut character model
│   └── hud/                        # Diegetic & screen-space 2D interface overlays
├── store/
│   └── useMarsGameStore.ts         # Centralized Zustand reactive game state
└── systems/
    ├── inputManager.ts             # Keyboard, mouse, and pointer events
    ├── collisionSystem.ts          # Static colliders, heightfield resolution, slopes
    ├── interactionSystem.ts        # Proximity targeting and raycast interactions
    └── audioSynthesizer.ts         # Procedural Web Audio API sound effects
```

### Architectural Principles:
1. **Decoupled Simulation & Presentation:** The simulation state resides in `useMarsGameStore.ts`. R3F components read state through granular selectors and synchronize local Three.js transforms.
2. **Deterministic Ticker:** `MarsSurvivalCanvas.tsx` runs `SurvivalSimulationTicker` inside `useFrame`, stepping the survival clock and delta-clamping ticks (`Math.min(delta, 0.1)`) to avoid physics explosion during frame drops or tab switching.
3. **No Direct DOM in 3D Canvas:** HUD, dialogs, and inventory modals live strictly in the DOM layer layered over the Canvas via absolute positioning, never through expensive 3D HTML texture renders.

---

## 3. Core 3D Development Standards

### A. React Three Fiber Best Practices
- **Never mutate state inside `useFrame` directly into React state:** Mutating React state at 60 FPS triggers catastrophic re-render cascades. Mutate Three.js object references (`ref.current.position`, `ref.current.rotation`) or mutate Zustand store via non-reactive refs.
- **Delta-scaled Kinematics:** Always multiply speeds and translations by `delta` in `useFrame`:
  ```typescript
  useFrame((_, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    position.addScaledVector(velocity, safeDelta);
  });
  ```
- **Hierarchical Group Transformations:** Group related entities (e.g., rover chassis, wheels, antenna) under a root `<group ref={groupRef}>`. Apply world transforms to the group and local articulation to children.

### B. Memory & Resource Lifecycle
- **Static Assets vs Dynamic Geometry:** Procedural models (like `AstronautMesh` and `HabOutpost`) must reuse `THREE.Material` and `THREE.BufferGeometry` instances where possible rather than creating new materials inside child render loops.
- **Explicit Cleanup:** Clean up resources on unmount. Three.js textures, geometries, and materials allocated in memory must have `.dispose()` called when destroyed.

### C. Scene Graph Organization
- **Logical Scene Layers:**
  1. **Lighting & Environment:** Key sun direction, ambient Mars bounce, sky dome.
  2. **Static World:** Terrain heightfield, outpost architecture, permanent craters.
  3. **Dynamic Entities:** Player astronaut, rover vehicle, movable items.
  4. **Instanced Prop Clusters:** Boulders, minerals, solar panel arrays.
  5. **Volumetric & Particulates:** Dust storms, thruster exhaust, landing smoke.

---

## 4. Character & Camera Controllers

### Character Controller Architecture (`PlayerController.tsx`):
- **Kinematic State:** Maintain `velocity`, `verticalVelocity`, `isGrounded`, and `playerHeading` in local refs outside React state.
- **Damped Locomotion:** Use linear interpolation (`lerp`) or exponential decay (`MathUtils.damp`) for smooth acceleration, deceleration, and ground friction:
  ```typescript
  velocity.current.x = THREE.MathUtils.damp(velocity.current.x, targetVel.x, GROUND_FRICTION, delta);
  velocity.current.z = THREE.MathUtils.damp(velocity.current.z, targetVel.z, GROUND_FRICTION, delta);
  ```
- **Orientation Alignment:** Rotate the character mesh toward its movement vector when moving, preserving heading when stationary:
  ```typescript
  const moveAngle = Math.atan2(inputDir.x, inputDir.z);
  targetRotation = cameraYaw + moveAngle;
  playerGroupRef.current.rotation.y = THREE.MathUtils.damp(
    playerGroupRef.current.rotation.y,
    targetRotation,
    12.0,
    delta
  );
  ```

### Camera Spring-Arm Architecture:
- **Spherical Orbit Coordinates:** Track `cameraYaw` and `cameraPitch` from pointer movement.
- **Pitch Clamping:** Enforce strict pitch bounds (`-0.3` rad looking up to `1.2` rad looking down) to prevent gimbal inversion.
- **Collision Clipping Prevention:** Raycast from the player's eye pivot `[player.x, player.y + 1.6, player.z]` toward the ideal camera position. If terrain or outpost walls intersect, clamp boom distance to `hitDistance - 0.3m`.

---

## 5. Development Checklist for New 3D Features

When creating a new 3D system, component, or visual mechanic:

1. [ ] **Coordinate Space Alignment:** Does the entity adhere to world scale (1 unit = 1 meter)?
2. [ ] **Delta-Time Dependent:** Are all translations, rotations, and animations scaled by `safeDelta`?
3. [ ] **Zero Garbage in Loop:** Are vector operations using pooled/module-scoped `THREE.Vector3` instances rather than `new THREE.Vector3()` inside `useFrame`?
4. [ ] **Collision Registered:** If the entity is solid, is its collider defined in `collisionSystem.ts` or registered with the interaction manager?
5. [ ] **Shadow Optimization:** Are only primary visual structures (`HabOutpost`, `RoverVehicle`, `Player`) casting shadows, while distant terrain and particles avoid heavy shadow maps?
6. [ ] **Material Tone Consistency:** Does the entity use PBR materials (`MeshStandardMaterial` or `MeshPhysicalMaterial`) responding correctly to ACESFilmic tone mapping?
7. [ ] **Clean Unmount Test:** Does switching navigation routes cleanly unload the canvas without WebGL context leaks?
