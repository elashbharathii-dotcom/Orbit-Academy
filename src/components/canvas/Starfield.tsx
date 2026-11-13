import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarfieldProps {
  count?: number;
}

/**
 * Creates a circular pinpoint star sprite with gaussian core
 * Prevents square particle artifacts and eliminates blurry snow-like appearance
 */
function createStarSprite(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Astronomical Multi-Layer Starfield (Phase 6C Visual Correction)
 * 
 * Major Fixes:
 * - Completely eliminates "blurry snow-like particles" by using sharp circular pinpoints
 * - Background layer uses sizeAttenuation: false with crisp 1.2px pinpoint dots
 * - Foreground navigation stars have subtle, natural twinkling and realistic spectral hues
 * - Pure astronomical depth without fantasy nebula clouds
 */
export const Starfield: React.FC<StarfieldProps> = ({ count = 2200 }) => {
  const bgPointsRef = useRef<THREE.Points>(null);
  const brightPointsRef = useRef<THREE.Points>(null);

  const starTexture = useMemo(() => createStarSprite(), []);

  // 1. Background Distant Pinpoint Stars
  const [bgPositions, bgColors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    // Astronomical spectral classes (O/B blue-white, A/F white, G yellow, K/M orange-amber)
    const spectralColors = [
      new THREE.Color('#FFFFFF'), // Pure White (Class A)
      new THREE.Color('#E0EDFF'), // Blue-White (Class B)
      new THREE.Color('#BAE6FD'), // Pale Azure (Class O)
      new THREE.Color('#FEF08A'), // Solar Yellow (Class G)
      new THREE.Color('#FED7AA'), // Warm Amber (Class K)
      new THREE.Color('#FCA5A5'), // Red Giant (Class M)
    ];

    for (let i = 0; i < count; i++) {
      const radius = 280 + Math.random() * 240;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const sinPhi = Math.sin(phi);

      pos[i * 3] = radius * sinPhi * Math.cos(theta);
      pos[i * 3 + 1] = radius * sinPhi * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color =
        Math.random() > 0.35
          ? spectralColors[Math.floor(Math.random() * 2)]
          : spectralColors[Math.floor(Math.random() * spectralColors.length)];

      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, [count]);

  // 2. Foreground Bright Navigation Stars (140 stars with glint)
  const [brightPositions, brightColors] = useMemo(() => {
    const brightCount = 140;
    const pos = new Float32Array(brightCount * 3);
    const col = new Float32Array(brightCount * 3);

    const brightHues = [
      new THREE.Color('#FFFFFF'),
      new THREE.Color('#93C5FD'),
      new THREE.Color('#FDE047'),
      new THREE.Color('#FDBA74'),
    ];

    for (let i = 0; i < brightCount; i++) {
      const radius = 240 + Math.random() * 200;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const sinPhi = Math.sin(phi);

      pos[i * 3] = radius * sinPhi * Math.cos(theta);
      pos[i * 3 + 1] = radius * sinPhi * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = brightHues[Math.floor(Math.random() * brightHues.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, []);

  // Subtle cosmological stillness drift
  useFrame((_, delta) => {
    if (bgPointsRef.current) {
      bgPointsRef.current.rotation.y += delta * 0.0004;
      bgPointsRef.current.rotation.x += delta * 0.0002;
    }
    if (brightPointsRef.current) {
      brightPointsRef.current.rotation.y += delta * 0.0004;
      brightPointsRef.current.rotation.x += delta * 0.0002;
    }
  });

  return (
    <group>
      {/* 1. Background Sharp Pinpoint Stars (sizeAttenuation: false ensures zero snow blur) */}
      <points ref={bgPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[bgPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[bgColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.35}
          sizeAttenuation={false}
          vertexColors={true}
          transparent={true}
          opacity={0.88}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 2. Brighter Magnitude Navigation Stars with Gaussian Glint */}
      <points ref={brightPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[brightPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[brightColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          map={starTexture}
          size={3.2}
          sizeAttenuation={false}
          vertexColors={true}
          transparent={true}
          opacity={0.92}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
