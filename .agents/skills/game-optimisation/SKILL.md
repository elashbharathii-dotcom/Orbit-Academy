---
name: game-optimisation
description: "Performance engineering, memory management, and rendering optimization intelligence for the Orbit Academy 3D Mars Game. Enforces 60 FPS performance budgets, draw call minimization (<100 draw calls), GPU instancing, Three.js resource disposal, vector pooling, and Zustand state subscription throttling."
---

# GAME OPTIMISATION — ORBIT ACADEMY MARS ENGINE

## 1. Role & Performance Engineering Vision

Act as the Principal Performance Engineer and Graphics Optimization Specialist for the Orbit Academy 3D Mars Survival Game.

Your objective is to guarantee silky-smooth **60 FPS gameplay** across a wide spectrum of educational hardware: from school Chromebooks and integrated Intel/AMD GPUs to high-refresh desktop gaming rigs.

In web-based 3D applications, performance is not an afterthought; it is an architectural contract. Every component, render pass, state subscription, and geometry allocation must respect strict frame time, memory, and draw call budgets.

---

## 2. Hard Performance Budgets

Every contribution to the 3D Mars codebase must pass these hard limits:

| Metric | Target Budget | Hard Upper Ceiling | Measurement Technique |
|---|---|---|---|
| **Frame Time** | 16.6 ms (60 FPS) | 22.2 ms (45 FPS on low-tier iGPU) | Chrome DevTools Performance / `r3f-perf` |
| **Draw Calls** | < 60 calls | < 100 calls | `gl.info.render.calls` |
| **Triangle Count** | < 80,000 tris | < 150,000 tris | `gl.info.render.triangles` |
| **Texture VRAM** | < 100 MB | < 250 MB | DevTools Memory / `gl.info.memory.textures` |
| **Heap Allocations in Loop** | 0 B / frame | 0 B / frame (Zero GC spikes) | Chrome DevTools Memory Timeline |
| **Shadow Map Passes** | 1 pass (Sun only) | 1 pass (`2048x2048` max) | Three.js WebGLRenderer shadows |
| **DOM Re-renders per Frame** | 0 re-renders | 0 re-renders of Canvas tree | React DevTools Profiler |

---

## 3. GPU Rendering & Draw Call Minimization

Draw calls represent CPU-to-GPU command buffer synchronization. Excessive draw calls (e.g. 500+ individual rocks, crystals, or base struts) create severe CPU bottlenecks regardless of GPU horsepower.

### A. GPU Geometry Instancing (`InstancedMesh`)
Never render repetitive planetary objects as individual `<mesh>` elements. Use `THREE.InstancedMesh` for boulders, geological outcrops, and mineral crystals:

```tsx
// Correct Instanced Batching Pattern
const COUNT = 120;
const dummy = useMemo(() => new THREE.Object3D(), []);

export const InstancedBoulders: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => new THREE.DodecahedronGeometry(1.2, 1), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8A3D22',
    roughness: 0.88,
  }), []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < COUNT; i++) {
      dummy.position.set(boulderData[i].x, boulderData[i].y, boulderData[i].z);
      dummy.scale.setScalar(boulderData[i].scale);
      dummy.rotation.set(0, boulderData[i].rotY, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return <instancedMesh ref={meshRef} args={[geometry, material, COUNT]} castShadow receiveShadow />;
};
```

### B. Shadow Map Optimization
Dynamic shadows are the most computationally intensive aspect of web 3D.
1. **Single Shadow Caster:** Only the directional Sun light casts shadows. The habitat interior point lights and rover headlights must NOT enable `castShadow = true`.
2. **Frustum Tightening:** The directional light shadow frustum must be tightly bounded around the player's immediate perimeter (`left: -35, right: 35, top: 35, bottom: -35, near: 0.5, far: 80`). Shadowing distant horizons wastes GPU rasterization fill rate.
3. **Shadow Bias Tuning:** Set `shadow-bias={-0.0003}` and `shadow-normalBias={0.02}` to eliminate shadow acne without artifacting.

---

## 4. Zero-Allocation Render Loop (GC Elimination)

JavaScript garbage collection pauses are the #1 cause of micro-stutters and frame drops in React Three Fiber. If code allocates memory inside `useFrame`, the browser pauses the main thread for 10–50 ms to collect garbage.

### Strict Rule: Zero Allocations in `useFrame`
Never instantiate objects (`new THREE.Vector3()`, `new THREE.Quaternion()`, array literals `[]`, or object literals `{}`) inside `useFrame`.

```typescript
// BAD: Allocates 60 objects per second, causing GC frame hitching
useFrame(() => {
  const target = new THREE.Vector3(player.x, player.y + 2, player.z + 5);
  camera.position.lerp(target, 0.05);
});

// GOOD: Scratch vector pooling at module or component scope
const _targetVec = new THREE.Vector3();
const _lookVec = new THREE.Vector3();

useFrame(() => {
  _targetVec.set(player.x, player.y + 2, player.z + 5);
  camera.position.lerp(_targetVec, 0.05);
});
```

### Standard Scratch Pool Reference:
Maintain a static module-level scratch pool for matrix math, raycasting, and kinematics:
```typescript
export const MathPool = {
  v1: new THREE.Vector3(),
  v2: new THREE.Vector3(),
  v3: new THREE.Vector3(),
  q1: new THREE.Quaternion(),
  q2: new THREE.Quaternion(),
  m1: new THREE.Matrix4(),
  raycaster: new THREE.Raycaster(),
};
```

---

## 5. Three.js Resource Disposal & Memory Leak Prevention

WebGL is an immediate-mode GPU API. When a React component containing Three.js meshes unmounts, **the GPU memory is NOT released automatically**. Failing to dispose resources leads to memory leaks, browser tab crashes, and WebGL context loss.

### The Golden Disposal Rule:
Every geometry, material, texture, and custom WebGLRenderTarget created via `useMemo` or raw instantiation must have its `.dispose()` method called when the component unmounts.

```tsx
useEffect(() => {
  return () => {
    // Explicit teardown of all allocated GPU buffers
    terrainGeometry.dispose();
    terrainMaterial.dispose();
    if (terrainMaterial.map) terrainMaterial.map.dispose();
    if (terrainMaterial.normalMap) terrainMaterial.normalMap.dispose();
  };
}, [terrainGeometry, terrainMaterial]);
```

### Canvas Root Teardown:
When the user exits the Mars Survival Game to return to Orbit Academy lessons, verify in Chrome DevTools Memory tab that total JS heap and WebGL buffer memory returns to baseline within 2 seconds.

---

## 6. Reactive State & Zustand Subscription Throttling

A frequent performance anti-pattern is subscribing the Canvas root or 3D components to high-frequency state updates.

### A. Granular Selectors
Never consume the whole store inside a 3D component:
```typescript
// BAD: Causes component to re-render whenever ANYTHING in the store changes
const state = useMarsGameStore();

// GOOD: Re-renders ONLY when the specific scalar or reference changes
const isDaytime = useMarsGameStore((state) => state.solCycle.isDaytime);
```

### B. Transient Updates for High-Frequency Coordinates
Player position and camera angles change at 60 FPS. If `playerPosition` updates React state at 60 FPS, all listening DOM components re-render 60 times a second.
- **Solution:** Keep continuous kinematics in Three.js refs or mutable store refs (`useRef`). Synchronize to Zustand only when crossing discrete spatial boundaries (e.g. crossing the habitat airlock threshold or approaching an interaction node).

---

## 7. Device Pixel Ratio (DPR) & Dynamic Scaling

On high-DPI screens (Apple Retina 2x/3x, 4K displays), rendering full native resolution multiplies pixel fragment shading cost by $4\times$ to $9\times$.

### Standard DPR Policy:
Always cap DPR in `Canvas` configuration:
```tsx
<Canvas
  dpr={[1, Math.min(window.devicePixelRatio, 2)]}
  gl={{
    powerPreference: 'high-performance',
    antialias: true,
  }}
>
```

### Adaptive Resolution Degradation:
If consecutive frames take longer than 22 ms (sub-45 FPS), automatically drop DPR to `1.0` and disable PCF soft shadow filtering to safeguard interactive playability.

---

## 8. Performance Diagnostics & Profiling Checklist

Before deploying any feature to the Mars Adventure module, run this verification protocol:

- [ ] **Draw Call Audit:** Open DevTools console and execute `__THREE_DEVTOOLS__.renderers[0].info.render.calls` or inspect `gl.info.render.calls`. Confirm calls do not exceed 80 during full terrain exploration.
- [ ] **60 FPS Frame Stability:** Record a 30-second continuous exploration run (locomotion + rover driving) in Chrome DevTools Performance panel. Confirm 0 Long Tasks (>50ms) and no frame drop clusters.
- [ ] **Memory Leak Check:**
  1. Record Heap Snapshot 1.
  2. Enter Mars Survival Game, explore Jezero Crater, collect 3 nodes, enter habitat.
  3. Exit to Orbit Academy dashboard.
  4. Force Garbage Collection in DevTools and record Heap Snapshot 2.
  5. Verify no detached WebGL buffers, textures, or orphaned event listeners persist.
- [ ] **Tab Switch Defense:** Switch browser tabs for 60 seconds and return. Ensure `SurvivalSimulationTicker` delta clamping prevents simulation acceleration, physical explosions, or vital collapse.
- [ ] **Shadow Acuity:** Verify absence of shimmering shadow acne across terrain ridges and rover wheels.
