import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MarsSky } from './MarsSky';
import { MarsTerrain } from './MarsTerrain';
import { HabOutpost } from './HabOutpost';
import { RoverVehicle } from './RoverVehicle';
import { ResourceNodes } from './ResourceNodes';
import { DustStormParticles } from './DustStormParticles';
import { PlayerController } from './PlayerController';
import { useMarsGameStore } from '../../store/useMarsGameStore';

/**
 * Ticker component inside R3F that drives the survival simulation loop
 */
const SurvivalSimulationTicker: React.FC = () => {
  const tick = useMarsGameStore((state) => state.tick);

  useFrame((_, delta) => {
    // Pass real delta time to survival simulation loop
    tick(Math.min(delta, 0.1));
  });

  return null;
};

export const MarsSurvivalCanvas: React.FC = () => {
  return (
    <div className="relative h-full w-full select-none bg-[#05070D]">
      <Canvas
        shadows
        camera={{
          position: [0, 5, 12],
          fov: 50,
          near: 0.1,
          far: 600,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#05070D');
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        {/* Core Game Loop Simulation Ticker */}
        <SurvivalSimulationTicker />

        {/* Dynamic Martian Atmosphere, Sun & Sky */}
        <MarsSky />

        {/* Jezero Crater Geological Terrain & Rock Outcrops */}
        <MarsTerrain />

        {/* Outpost Alpha Base Station */}
        <HabOutpost />

        {/* 6-Wheel Mars Exploration Rover */}
        <RoverVehicle />

        {/* Crystalline Water Ice & Mineral Nodes */}
        <ResourceNodes />

        {/* Martian Dust Storm Particulates */}
        <DustStormParticles />

        {/* Astronaut Player Controller & Physics */}
        <PlayerController />
      </Canvas>
    </div>
  );
};
