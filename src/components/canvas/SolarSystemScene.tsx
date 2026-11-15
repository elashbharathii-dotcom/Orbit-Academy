import React, { useMemo, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { OrbitLine } from './OrbitLine';
import { Starfield } from './Starfield';
import { MilkyWayBackground } from './MilkyWayBackground';
import { MilkyWayGalaxy3D } from './MilkyWayGalaxy3D';
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
 * Core 3D Solar System & Milky Way Scene Graph (Stage 02)
 * 
 * Features:
 * - Dual-Environment rendering: Solar System vs Dedicated 3D Milky Way Galaxy
 * - Dual-Scale viewing modes: Cinematic (enlarged planets) vs Scientific (proportional AU orbits)
 * - 18 natural satellites (moons) with Keplerian revolutions
 * - Detailed ring systems for Saturn (Cassini division), Uranus (tilted vertical ring), Neptune, and Jupiter
 * - Balanced cosmic ambient lighting (#253653 at 0.34) prevents unlit silhouettes
 */
export const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({
  speedScale = 0.45,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { selectedPlanetId, viewingMode, activeEnvironment, timeWarp = 1.0 } = useSolarSystem();
  const isScientific = viewingMode === 'scientific';
  const effectiveSpeed = speedScale * (timeWarp ?? 1.0);

  // Separate Sun from the 8 orbiting planets
  const sunData = useMemo(() => CELESTIAL_BODIES.find((b) => b.id === 'sun'), []);
  const planets = useMemo(() => CELESTIAL_BODIES.filter((b) => b.id !== 'sun'), []);

  // Natural staggered starting angle offsets so planets do not align artificially
  const angleOffsets = useMemo(() => {
    return [0.4, 1.8, 3.2, 4.6, 0.9, 2.5, 5.1, 3.9];
  }, []);

  if (activeEnvironment === 'milky-way') {
    return (
      <>
        <ambientLight color="#1E1E38" intensity={0.42} />
        <Starfield count={4000} />
        <MilkyWayGalaxy3D speedScale={effectiveSpeed} />
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping={true}
          dampingFactor={0.045}
          autoRotate={true}
          autoRotateSpeed={0.06}
          minDistance={15}
          maxDistance={280}
          maxPolarAngle={Math.PI / 2 + 0.25}
          minPolarAngle={0.05}
        />
        <CameraController controlsRef={controlsRef} />
      </>
    );
  }

  const sunRadius = sunData
    ? (isScientific
        ? (sunData.visual.scientificRadius || sunData.visual.visualRadius * 0.75)
        : sunData.visual.visualRadius)
    : 4.8;

  return (
    <>
      {/* 1. Balanced Cosmic Ambient Light (sculpts dark sides without washing out terminators) */}
      <ambientLight color="#253653" intensity={0.34} />

      {/* 2. Deep Space Gaia Milky Way Survey Panorama */}
      <MilkyWayBackground radius={650} opacity={0.52} />

      {/* 3. Deep Space Multi-Layer Spectral Pinpoint Starfield */}
      <Starfield count={3200} />

      {/* 4. Central Luminous Sun with SDO Photosphere & Point-Light Shadows */}
      {sunData && <Sun radius={sunRadius} />}

      {/* 5. Main Asteroid Belt between Mars and Jupiter */}
      <AsteroidBelt
        count={1100}
        innerRadius={isScientific ? 26.0 : 22.5}
        outerRadius={isScientific ? 34.0 : 29.0}
      />

      {/* 6. Active Eccentric Comet with Glowing Tail */}
      <Comet semiMajorAxis={isScientific ? 56 : 46} eccentricity={0.72} inclinationDeg={16} />

      {/* 7. Planetary Orbits & Revolving Planets */}
      {planets.map((planet, idx) => {
        const orbitRadius = isScientific
          ? (planet.visual.scientificOrbitRadius || planet.visual.visualOrbitRadius * 1.25)
          : planet.visual.visualOrbitRadius;

        return (
          <React.Fragment key={planet.id}>
            {/* Subordinate Hairline Orbital Trajectory Path */}
            <OrbitLine
              radius={orbitRadius}
              color={isScientific ? '#38BDF8' : '#52749B'}
              opacity={isScientific ? 0.28 : 0.16}
            />

            {/* 3D Planet Mesh with Photographic Textures, Axial Tilt, Spin, Moons, and Reticle */}
            <Planet
              data={planet}
              speedScale={effectiveSpeed}
              initialAngleOffset={angleOffsets[idx % angleOffsets.length]}
            />
          </React.Fragment>
        );
      })}

      {/* 8. Smooth Camera Navigation Controls */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping={true}
        dampingFactor={0.045}
        autoRotate={!selectedPlanetId}
        autoRotateSpeed={0.12}
        minDistance={8}
        maxDistance={160}
        maxPolarAngle={Math.PI / 2 + 0.12}
        minPolarAngle={0.08}
      />

      {/* 9. Cinematic Bezier Flight Controller */}
      <CameraController controlsRef={controlsRef} />
    </>
  );
};
