import React, { useMemo, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { OrbitLine } from './OrbitLine';
import { Starfield } from './Starfield';
import { MilkyWayBackground } from './MilkyWayBackground';
import { AsteroidBelt } from './AsteroidBelt';
import { Comet } from './Comet';
import { CameraController } from './CameraController';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { useSolarSystem } from '../../context/SolarSystemContext';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface SolarSystemSceneProps {
  speedScale?: number;
}

/**
 * Core 3D Solar System Scene Graph (Phase 6C Visual Correction)
 * 
 * Major Fixes:
 * - Balanced ambient cosmic lighting (#1E293B at 0.42) prevents Mars and night sides from turning pitch-black
 * - Subordinate, hairline orbit lines (#334155 at 0.075) that no longer overpower the scene
 * - Crisp, pinpoint multi-layer starfield without blurry snow particles
 * - Authentic Gaia Milky Way panorama projection
 * - Real 2K photographic NASA planetary maps with limb darkening on Sol
 * - Dual-layer Earth clouds and night lights; authentic Saturn Cassini rings
 */
export const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({
  speedScale = 0.45,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { selectedPlanetId } = useSolarSystem();

  // Separate Sun from the 8 orbiting planets
  const sunData = useMemo(() => CELESTIAL_BODIES.find((b) => b.id === 'sun'), []);
  const planets = useMemo(() => CELESTIAL_BODIES.filter((b) => b.id !== 'sun'), []);

  // Natural staggered starting angle offsets so planets do not align artificially
  const angleOffsets = useMemo(() => {
    return [0.4, 1.8, 3.2, 4.6, 0.9, 2.5, 5.1, 3.9];
  }, []);

  return (
    <>
      {/* 1. Balanced Cosmic Ambient Light (sculpts dark sides without washing out terminators) */}
      <ambientLight color="#253653" intensity={0.34} />

      {/* 2. Deep Space Gaia Milky Way Survey Panorama */}
      <MilkyWayBackground radius={650} opacity={0.52} />

      {/* 3. Deep Space Multi-Layer Spectral Pinpoint Starfield */}
      <Starfield count={3200} />

      {/* 4. Central Luminous Sun with SDO Photosphere & Point-Light Shadows */}
      {sunData && <Sun radius={sunData.visual.visualRadius} />}

      {/* 5. Main Asteroid Belt between Mars and Jupiter */}
      <AsteroidBelt count={1100} innerRadius={22.5} outerRadius={29.0} />

      {/* 6. Active Eccentric Comet with Glowing Tail */}
      <Comet semiMajorAxis={46} eccentricity={0.72} inclinationDeg={16} />

      {/* 7. Planetary Orbits & Revolving Planets */}
      {planets.map((planet, idx) => (
        <React.Fragment key={planet.id}>
          {/* Subordinate Hairline Orbital Trajectory Path */}
          <OrbitLine
            radius={planet.visual.visualOrbitRadius}
            color="#52749B"
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
        dampingFactor={0.045}
        autoRotate={!selectedPlanetId}
        autoRotateSpeed={0.12}
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
