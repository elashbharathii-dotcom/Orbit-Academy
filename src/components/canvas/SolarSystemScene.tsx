import React, { useMemo, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { OrbitLine } from './OrbitLine';
import { Starfield } from './Starfield';
import { MilkyWayBackground } from './MilkyWayBackground';
import { CameraController } from './CameraController';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface SolarSystemSceneProps {
  speedScale?: number;
}

/**
 * Core 3D Solar System Scene Graph (Phase 6C: Cinematic Realism)
 * 
 * Integrates:
 * - Restrained photometric cosmic ambient light (preserves deep shadow terminators)
 * - Deep-space Gaia Milky Way all-sky survey panorama
 * - Multi-layer spectral starfield with astronomical color distribution
 * - Luminous central Sun with 2K SDO photosphere, dynamic convection, and soft corona
 * - All 8 revolving planets with 2K photographic NASA/USGS/JPL maps
 * - Earth with dynamic clouds, night city lights, and Rayleigh scattering
 * - Saturn with 2K radial ring alpha and Cassini Division
 * - Real-time planetary shadows (planet shadow on rings, ring shadow on planet)
 * - Cinematic Bezier Camera Navigation Controller with planetary tracking
 */
export const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({
  speedScale = 0.45,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Separate Sun from the 8 orbiting planets
  const sunData = useMemo(() => CELESTIAL_BODIES.find((b) => b.id === 'sun'), []);
  const planets = useMemo(() => CELESTIAL_BODIES.filter((b) => b.id !== 'sun'), []);

  // Natural staggered starting angle offsets so planets do not align artificially
  const angleOffsets = useMemo(() => {
    return [0.4, 1.8, 3.2, 4.6, 0.9, 2.5, 5.1, 3.9];
  }, []);

  return (
    <>
      {/* 1. Deep Space Cosmic Ambient Light (calibrated for sharp day/night terminators) */}
      <ambientLight color="#0B132B" intensity={0.22} />

      {/* 2. Deep Space Gaia Milky Way Survey Panorama */}
      <MilkyWayBackground radius={650} opacity={0.42} />

      {/* 3. Deep Space Multi-Layer Spectral Starfield */}
      <Starfield count={2200} />

      {/* 4. Central Luminous Sun with SDO Photosphere & Point-Light Shadows */}
      {sunData && <Sun radius={sunData.visual.visualRadius} />}

      {/* 5. Planetary Orbits & Revolving Planets */}
      {planets.map((planet, idx) => (
        <React.Fragment key={planet.id}>
          {/* Orbital Trajectory Path */}
          <OrbitLine
            radius={planet.visual.visualOrbitRadius}
            color="#94A3B8"
            opacity={0.16}
          />

          {/* 3D Planet Mesh with Photographic Textures, Axial Tilt, Spin, and Reticle */}
          <Planet
            data={planet}
            speedScale={speedScale}
            initialAngleOffset={angleOffsets[idx % angleOffsets.length]}
          />
        </React.Fragment>
      ))}

      {/* 6. Smooth Camera Navigation Controls */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={8}
        maxDistance={140}
        maxPolarAngle={Math.PI / 2 + 0.12}
        minPolarAngle={0.08}
      />

      {/* 7. Cinematic Bezier Flight Controller */}
      <CameraController controlsRef={controlsRef} />
    </>
  );
};
