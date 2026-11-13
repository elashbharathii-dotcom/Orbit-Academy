import React, { useMemo } from 'react';
import * as THREE from 'three';

interface OrbitLineProps {
  radius: number;
  segments?: number;
  color?: string;
  opacity?: number;
}

/**
 * Elegant hairline orbital trajectory loop rendered in the orbital plane (XZ).
 */
export const OrbitLine: React.FC<OrbitLineProps> = ({
  radius,
  segments = 128,
  color = '#94A3B8',
  opacity = 0.16,
}) => {
  const linePoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius, segments]);

  return (
    <lineLoop geometry={linePoints}>
      <lineBasicMaterial
        color={color}
        transparent={true}
        opacity={opacity}
        depthWrite={false}
      />
    </lineLoop>
  );
};

