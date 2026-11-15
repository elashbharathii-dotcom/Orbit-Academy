import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PlanetaryRingDefinition } from '../../types';
import { useSaturnRingTexture } from '../../utils/planetaryTextures';

interface PlanetaryRingsProps {
  planetId: string;
  visualRadius: number;
  config: PlanetaryRingDefinition;
}

/**
 * Creates radial UV mapping for planetary rings
 * Maps radial distance from inner ring edge to outer ring edge to U coordinate [0, 1]
 */
function createRadialRingGeometry(innerRadius: number, outerRadius: number, segments: number = 128) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments, 8);
  const pos = geometry.attributes.position;
  const uvs = geometry.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const dist = Math.sqrt(x * x + y * y);
    const u = (dist - innerRadius) / (outerRadius - innerRadius);
    uvs.setXY(i, u, 0.5);
  }
  uvs.needsUpdate = true;
  return geometry;
}

export const PlanetaryRings: React.FC<PlanetaryRingsProps> = ({
  planetId,
  visualRadius,
  config,
}) => {
  const saturnRingTexture = useSaturnRingTexture();

  const innerRadius = visualRadius * config.innerRadiusMultiplier;
  const outerRadius = visualRadius * config.outerRadiusMultiplier;

  const ringGeometry = useMemo(() => {
    return createRadialRingGeometry(innerRadius, outerRadius, 128);
  }, [innerRadius, outerRadius]);

  const rotation: [number, number, number] = useMemo(() => {
    if (config.tiltAngleDeg) {
      // Tilt for Uranus (approx 97.8 degrees)
      const rad = THREE.MathUtils.degToRad(config.tiltAngleDeg);
      return [rad, 0, 0];
    }
    return [Math.PI / 2, 0, 0];
  }, [config.tiltAngleDeg]);

  const isSaturn = planetId === 'saturn';

  return (
    <mesh
      geometry={ringGeometry}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        map={isSaturn ? saturnRingTexture : undefined}
        color={isSaturn ? '#FFFFFF' : config.color}
        side={THREE.DoubleSide}
        shadowSide={THREE.DoubleSide}
        transparent={true}
        opacity={config.opacity}
        roughness={0.7}
        metalness={0.02}
        depthWrite={false}
      />
    </mesh>
  );
};
