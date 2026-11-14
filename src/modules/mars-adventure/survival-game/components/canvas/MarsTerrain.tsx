import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Procedural elevation formula for Jezero Crater basin and surrounding dunes
 */
export function getTerrainHeight(x: number, z: number): number {
  // Smooth Jezero crater floor
  const r = Math.sqrt(x * x + z * z);
  // Central basin is flat near Outpost Alpha (r < 12)
  if (r < 12) {
    return 0;
  }
  // Dune wave ripples + crater wall elevation
  const duneWave1 = Math.sin(x * 0.12) * Math.cos(z * 0.08) * 0.8;
  const duneWave2 = Math.sin(x * 0.04 + z * 0.05) * 1.5;
  const craterRim = Math.max(0, (r - 45) * 0.25);
  return duneWave1 + duneWave2 + craterRim;
}

export const MarsTerrain: React.FC = () => {
  // 1. Procedural terrain geometry
  const { geometry } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(160, 160, 96, 96);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    const baseColor = new THREE.Color('#9A3412'); // Rich rust ochre
    const ridgeColor = new THREE.Color('#C2410C'); // Sun-baked dune crest
    const shadowColor = new THREE.Color('#451A03'); // Iron-rich basaltic hollow
    const tempColor = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = getTerrainHeight(x, z);
      pos.setY(i, y);

      // Color variation based on height and slopes
      const heightFactor = THREE.MathUtils.clamp((y + 2) / 8, 0, 1);
      tempColor.lerpColors(shadowColor, baseColor, heightFactor);
      if (y > 1.2) {
        tempColor.lerp(ridgeColor, THREE.MathUtils.clamp((y - 1.2) / 3, 0, 1));
      }

      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return { geometry: geo };
  }, []);

  // 2. Scattered Martian boulders and impact rocks (instanced for optimal draw calls)
  const rockTransforms = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const count = 90;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      // Scatter rocks outside immediate landing base
      const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.4);
      const dist = 14 + Math.random() * 55;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const y = getTerrainHeight(x, z);

      dummy.position.set(x, y + 0.2, z);
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      const scale = 0.4 + Math.random() * 1.6;
      dummy.scale.set(scale * 1.2, scale * 0.8, scale);
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
    }
    return matrices;
  }, []);

  const rockInstancedMesh = useMemo(() => {
    const geo = new THREE.DodecahedronGeometry(0.8, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: '#7C2D12',
      roughness: 0.95,
      metalness: 0.1,
    });
    const mesh = new THREE.InstancedMesh(geo, mat, rockTransforms.length);
    rockTransforms.forEach((matrix, index) => {
      mesh.setMatrixAt(index, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }, [rockTransforms]);

  return (
    <group name="MarsTerrainGroup">
      {/* Terrain Mesh */}
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.92}
          metalness={0.15}
          bumpScale={0.06}
        />
      </mesh>

      {/* Scattered Rocks */}
      <primitive object={rockInstancedMesh} />
    </group>
  );
};
