import React, { useMemo } from 'react';
import * as THREE from 'three';
import {
  ProceduralTerrainSystem,
  getTerrainHeight,
  getTerrainNormal,
} from '../../systems/proceduralTerrainSystem';

// Re-export core terrain functions so all dependent systems retain zero-break imports
export { getTerrainHeight, getTerrainNormal };

export interface RockInstanceData {
  id: string;
  x: number;
  y: number;
  z: number;
  scale: number;
  radius: number;
  matrix: THREE.Matrix4;
}

/**
 * Deterministic pseudo-random helper for consistent rock placement across the 360m x 360m world
 */
function seededRandom(seed: number): number {
  const v = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return v - Math.floor(v);
}

/**
 * Pre-computed deterministic scattered rocks shared between visuals and collision system
 * Dispersed across all 8 planetary regions with exclusion zone around Outpost Alpha (r < 13.5m)
 */
export const DETERMINISTIC_ROCKS: RockInstanceData[] = (() => {
  const rocks: RockInstanceData[] = [];
  const count = 160;
  const dummy = new THREE.Object3D();

  for (let i = 0; i < count; i++) {
    const seed = i + 1;
    const angle = (i / count) * Math.PI * 2 + seededRandom(seed * 1.3) * 0.5;
    // Radial distribution: 15m to 160m from center
    const dist = 14 + seededRandom(seed * 2.7) * 145;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    // Do not spawn rocks directly inside cave entrance corridor or station apron
    if (Math.hypot(x, z) < 13.5) continue;
    if (x >= -40 && x <= -28 && z >= -50 && z <= -38) continue; // Cave mouth clearance

    const y = getTerrainHeight(x, z);
    const scale = 0.45 + seededRandom(seed * 3.7) * 1.65;
    const rotX = seededRandom(seed * 4.9) * Math.PI;
    const rotY = seededRandom(seed * 5.2) * Math.PI;
    const rotZ = seededRandom(seed * 6.4) * Math.PI;

    dummy.position.set(x, y + 0.18 * scale, z);
    dummy.rotation.set(rotX, rotY, rotZ);
    dummy.scale.set(scale * 1.15, scale * 0.85, scale);
    dummy.updateMatrix();

    rocks.push({
      id: `scattered_rock_${i}`,
      x,
      y,
      z,
      scale,
      radius: scale * 0.82,
      matrix: dummy.matrix.clone(),
    });
  }

  return rocks;
})();

export const MarsTerrain: React.FC = () => {
  // 1. Procedural 360m x 360m planetary terrain geometry with regional vertex coloring
  const { geometry } = useMemo(() => {
    // 360m x 360m plane with 180 x 180 divisions (2.0m vertex pitch, high-density slope normal accuracy)
    const geo = new THREE.PlaneGeometry(360, 360, 180, 180);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    const terrainSys = ProceduralTerrainSystem.getInstance();
    const tempColor = new THREE.Color();
    const regionColor = new THREE.Color();
    const accentColor = new THREE.Color();
    const shadowColor = new THREE.Color('#2A1105'); // Basaltic shadow in crevices

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = terrainSys.getSurfaceTerrainHeight(x, z);
      pos.setY(i, y);

      // Biome-specific coloring
      const region = terrainSys.getRegionAt(x, z);
      regionColor.set(region.baseColor);
      accentColor.set(region.crestColor);
      if (region.shadowColor) {
        shadowColor.set(region.shadowColor);
      }

      // Height and slope gradient tinting
      const heightFactor = THREE.MathUtils.clamp((y + 3) / 12, 0, 1);
      tempColor.lerpColors(shadowColor, regionColor, 0.4 + heightFactor * 0.6);

      // Sun-baked ridge highlight for elevated crests
      if (y > 2.0) {
        const crestFactor = THREE.MathUtils.clamp((y - 2.0) / 6.0, 0, 1);
        tempColor.lerp(accentColor, crestFactor * 0.7);
      }

      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return { geometry: geo };
  }, []);

  // 2. Instanced Mesh using deterministic rock data
  const rockInstancedMesh = useMemo(() => {
    const geo = new THREE.DodecahedronGeometry(0.8, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: '#6B2A0C',
      roughness: 0.95,
      metalness: 0.1,
    });
    const mesh = new THREE.InstancedMesh(geo, mat, DETERMINISTIC_ROCKS.length);
    DETERMINISTIC_ROCKS.forEach((rock, index) => {
      mesh.setMatrixAt(index, rock.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }, []);

  // 3. Distant Horizon Mountain Silhouettes (Ring at r = 175m to 240m)
  const mountainHorizonGeo = useMemo(() => {
    const segments = 96;
    const ringGeo = new THREE.CylinderGeometry(230, 175, 42, segments, 4, true);
    const pos = ringGeo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);

      if (vy > 0) {
        // Jagged mountain crags on top ring
        const angle = Math.atan2(vz, vx);
        const crag1 = Math.sin(angle * 7) * 8.5;
        const crag2 = Math.cos(angle * 13) * 5.2;
        const crag3 = Math.sin(angle * 29) * 3.1;
        pos.setY(i, vy + crag1 + crag2 + crag3 + 4);
      } else {
        // Embed lower ring base into terrain
        pos.setY(i, -6);
      }
    }

    ringGeo.computeVertexNormals();
    return ringGeo;
  }, []);

  return (
    <group name="MarsTerrainGroup">
      {/* 360m x 360m Procedural Surface Terrain Mesh */}
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.92}
          metalness={0.14}
          bumpScale={0.06}
        />
      </mesh>

      {/* Scattered Rocks across all Biomes */}
      <primitive object={rockInstancedMesh} />

      {/* Distant Martian Mountain Horizon Rim */}
      <mesh geometry={mountainHorizonGeo} position={[0, 12, 0]} receiveShadow>
        <meshStandardMaterial
          color="#602208"
          roughness={0.98}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
