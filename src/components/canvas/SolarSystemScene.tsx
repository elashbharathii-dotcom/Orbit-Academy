import React, { useMemo } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { OrbitLine } from './OrbitLine';
import { Starfield } from './Starfield';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';

interface SolarSystemSceneProps {
  speedScale?: number;
}

/**
 * Core 3D Solar System Scene Graph
 * Integrates:
 * - Ambient cosmic background lighting
 * - Central luminous Sun with realistic raycasting
 * - Real planetary orbit trajectories
 * - All 8 continuously revolving planets with axial rotation
 * - Deep-space multi-layer starfield
 * - Damped orbital camera interaction
 */
export const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({
  speedScale = 0.45,
}) => {
  // Separate Sun from the 8 orbiting planets
  const sunData = useMemo(() => CELESTIAL_BODIES.find((b) => b.id === 'sun'), []);
  const planets = useMemo(() => CELESTIAL_BODIES.filter((b) => b.id !== 'sun'), []);

  // Calculate natural staggered starting angle offsets so planets don't all align on a line
  const angleOffsets = useMemo(() => {
    return [0.4, 1.8, 3.2, 4.6, 0.9, 2.5, 5.1, 3.9];
  }, []);

  return (
    <>
      {/* 1. Deep Space Cosmic Ambient Light (restrained to keep day/night contrast sharp) */}
      <ambientLight color="#0A1128" intensity={0.18} />

      {/* 2. Deep Space Starfield with Stellar Parallax */}
      <Starfield count={2600} />

      {/* 3. Central Luminous Sun */}
      {sunData && <Sun radius={sunData.visual.visualRadius} />}

      {/* 4. Planetary Orbits & Revolving Planets */}
      {planets.map((planet, idx) => (
        <React.Fragment key={planet.id}>
          {/* Orbital Trajectory Path */}
          <OrbitLine
            radius={planet.visual.visualOrbitRadius}
            color="#94A3B8"
            opacity={0.16}
          />

          {/* 3D Planet Mesh with Axial Tilt and Spin */}
          <Planet
            data={planet}
            speedScale={speedScale}
            initialAngleOffset={angleOffsets[idx % angleOffsets.length]}
          />
        </React.Fragment>
      ))}

      {/* 5. Smooth Camera Navigation Controls */}
      <OrbitControls
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={8}
        maxDistance={140}
        maxPolarAngle={Math.PI / 2 + 0.12} // Allow slightly below the orbital plane
        minPolarAngle={0.08}
      />
    </>
  );
};

