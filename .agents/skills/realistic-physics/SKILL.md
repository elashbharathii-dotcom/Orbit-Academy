---
name: realistic-physics
description: "Realistic physics simulation and kinematic math for Mars exploration. Covers Martian 0.38g gravity, terrain collision resolution, 6-wheel rover suspension kinematics, slope sliding, momentum, and React Three Rapier migration paths."
---

# REALISTIC PHYSICS & KINEMATICS — MARS SIMULATION ENGINE

## 1. Role & Physics Philosophy

Act as the Principal Physics Programmer and Vehicle Dynamics Specialist for the Orbit Academy Mars Survival Game.

Your role is to simulate believable Martian physics that balance **scientific realism** with **crisp, responsive game feel**. Mars is not Earth:
- Gravity is roughly 38% of Earth's ($g \approx 3.72 \text{ m/s}^2$).
- Atmospheric density is only 1% of Earth's ($0.020 \text{ kg/m}^3$), meaning air drag on vehicles and astronauts is negligible at walking speeds, but inertia and momentum are unforgiving.
- Regolith is fine, powdery basaltic dust mixed with iron oxide pebbles; traction is lower than terrestrial asphalt, causing wheel slip and downhill skidding on steep grades.

---

## 2. Existing Physics Architecture

The current engine uses a performant, custom kinematic physics and collision system:

```
src/modules/mars-adventure/survival-game/
├── components/canvas/
│   ├── MarsTerrain.tsx       # getTerrainHeight(x, z) analytical continuous heightfield
│   ├── PlayerController.tsx  # Character locomotion, Mars gravity, jump impulse, slope slide
│   └── RoverVehicle.tsx      # 6-wheel rocker-bogie kinematic vehicle controller
└── systems/
    └── collisionSystem.ts    # resolveCharacterCollision, resolveCameraCollision, Static Colliders
```

### Key Mathematical Constants (Tuned for Realism & Playability):
- `MARS_GRAVITY`: `6.2` (scaled for game responsiveness from pure $3.72 \text{ m/s}^2$ to prevent sluggish floatiness).
- `JUMP_FORCE`: `4.4 m/s` (enables lofty, graceful Martian leaps up to ~1.4m clearance).
- `MAX_TRAVERSABLE_SLOPE`: `42°` (~0.73 rad). Slopes steeper than this trigger downhill slip vectors.
- `ROVER_TOP_SPEED`: `8.5 m/s` (~30 km/h) with realistic torque curves and regenerative braking.

---

## 3. Terrain Heightfield & Surface Resolution

### Analytical Heightfield Formula (`MarsTerrain.tsx`):
Terrain elevation is not locked to a static mesh buffer; it is evaluated dynamically at arbitrary $[x, z]$ coordinates:
$$y = h(x, z) = \text{craterHeight}(x, z) + \text{duneNoise}(x, z) + \text{boulderOutcrops}(x, z)$$

### Height Querying & Normal Vector Calculation:
To align rovers or detect steep cliffs, sample three points around the query position:
```typescript
export function getTerrainNormal(x: number, z: number, sampleDist = 0.5): THREE.Vector3 {
  const hL = getTerrainHeight(x - sampleDist, z);
  const hR = getTerrainHeight(x + sampleDist, z);
  const hD = getTerrainHeight(x, z - sampleDist);
  const hU = getTerrainHeight(x, z + sampleDist);

  const normal = new THREE.Vector3(hL - hR, 2.0 * sampleDist, hD - hU).normalize();
  return normal;
}
```

### Slope Angle & Sliding Mechanics:
The slope angle $\theta$ relative to the vertical up-vector is:
$$\cos(\theta) = \mathbf{N} \cdot \mathbf{Up}$$
If $\theta > \theta_{\text{max}}$, apply downhill slip acceleration proportional to $g \cdot \sin(\theta)$ in the direction of the horizontal normal projection:
$$\mathbf{V}_{\text{slide}} = \mathbf{N}_{\text{horizontal}} \cdot g \cdot \sin(\theta) \cdot \Delta t$$

---

## 4. Character Collision & Locomotion

### Collision Pipeline (`resolveCharacterCollision`):
1. **Vertical Grounding:**
   - Query $y_{\text{terrain}} = \text{getTerrainHeight}(x, z)$.
   - If player $y \le y_{\text{terrain}}$, snap player to $y_{\text{terrain}}$, reset vertical velocity to 0, and mark `isGrounded = true`.
2. **Cylinder & Box Static Colliders:**
   - Static base structures (Airlock walls, MOXIE processing unit, solar struts, boulders) use AABB (`BoxCollider`) and radial (`CylinderCollider`) tests.
   - Cylinder collision resolves penetration horizontally along the contact normal:
     $$\mathbf{P}_{\text{new}} = \mathbf{C}_{\text{center}} + \frac{\mathbf{P} - \mathbf{C}}{\|\mathbf{P} - \mathbf{C}\|} \cdot (\text{Radius} + r_{\text{player}})$$
3. **Interior / Exterior Boundary Enclosure:**
   - Outpost Alpha features an airlock transition boundary. If `isInsideHab` is true, enforce interior dome wall constraints ($r \le 7.8\text{m}$).

---

## 5. 6-Wheel Rover Suspension Kinematics (`RoverVehicle.tsx`)

The Mars exploration rover features a NASA-inspired **rocker-bogie 6-wheel suspension**:

### Kinematic Rules:
1. **Independent Wheel Grounding:**
   - Each of the 6 wheels independently samples terrain elevation $y_{i} = \text{getTerrainHeight}(x_i, z_i)$.
   - Wheels articulate vertically relative to the chassis through damped spring math:
     $$\Delta y_{\text{suspension}} = \text{clamp}(y_{\text{terrain}} - y_{\text{chassis}}, -d_{\text{max}}, d_{\text{max}})$$
2. **Chassis Pitch and Roll Equilibrium:**
   - Pitch is derived from the height delta between the front wheel pair and rear wheel pair:
     $$\text{pitch} \approx \text{atan2}(y_{\text{front}} - y_{\text{rear}}, L_{\text{wheelbase}})$$
   - Roll is derived from the height delta between left and right wheel pairs:
     $$\text{roll} \approx \text{atan2}(y_{\text{left}} - y_{\text{right}}, W_{\text{track}})$$
   - Apply continuous damping with `THREE.MathUtils.damp` to prevent high-frequency jitter on rough rocks.
3. **Four-Wheel Ackerman Steering:**
   - Front wheels and rear wheels counter-steer to achieve zero-radius turns when stationary, and standard Ackerman geometry when moving forward.

---

## 6. Camera Collision & Occlusion Resolution

The third-person camera uses a spring-arm boom that prevents geometry clipping:

```typescript
export function resolveCameraCollision(
  targetPos: THREE.Vector3,
  desiredBoomOffset: THREE.Vector3,
  minClearance = 0.4
): THREE.Vector3 {
  // Raymarch or segment-test between targetPos (player head) and desired camera position
  // 1. Terrain elevation clamp
  const idealPos = targetPos.clone().add(desiredBoomOffset);
  const terrainH = getTerrainHeight(idealPos.x, idealPos.z);
  if (idealPos.y < terrainH + minClearance) {
    idealPos.y = terrainH + minClearance;
  }

  // 2. Static Outpost Collider push
  // Shorten boom if ray intersects outpost geometry
  return idealPos;
}
```

---

## 7. React Three Rapier Migration Architecture

When expanding to full rigid-body dynamics via `@react-three/rapier`:

### Architectural Blueprint:
1. **Core Wrap:** Wrap the active simulation inside `<Physics gravity={[0, -3.72, 0]} timeStep={1/60}>`.
2. **Character Controller:** Use `<RigidBody type="kinematicPosition" colliders={false}>` with a `<CapsuleCollider args={[0.6, 0.35]} />`. Keep manual control of velocity and step resolution to preserve precise air control.
3. **Vehicle Simulation:** Use Rapier's raycast vehicle or connect wheels via 6-DoF joint constraints with suspension stiffness and damping parameters.
4. **Hybrid Terrain Coexistence:** Preserve `getTerrainHeight(x, z)` for instantaneous CPU ray queries (e.g. foliage placement, radar math, and HUD projections) while feeding the terrain geometry into `<RigidBody type="fixed" colliders="trimesh">`.

---

## 8. Physics Testing & Debugging Checklist

Before approving any physics change:

1. [ ] **Martian Gravity Verification:** Does the astronaut fall at ~0.38g without abrupt downward snaps or moon-like slow motion?
2. [ ] **Step Climbing Test:** Can the character step over small obstacles (< 0.3m) smoothly without bouncing or catching?
3. [ ] **Cliff Slide Test:** Does walking onto a slope > 42° correctly slide the player downward instead of letting them walk up sheer cliffs?
4. [ ] **Zero Tunneling:** At max sprint speed (6.2 m/s) and max rover speed (8.5 m/s), does the entity ever tunnel through base walls or boulders?
5. [ ] **Camera Anti-Clip Test:** Back the camera into outpost airlocks and boulders; does the boom smoothly pull in without showing the back of the player's skull or empty void?
6. [ ] **Frame Rate Independence:** Does physics behave identically at 30 FPS, 60 FPS, and 120 FPS due to delta-clamping?
