import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { SunHeliosphere3D } from './SunHeliosphere3D';
import { EarthMagnetosphere3D } from './EarthMagnetosphere3D';
import { NasaSolarFlare, NasaCmeEvent } from '../../../services/nasa/types';

interface SpaceWeatherCanvasProps {
  viewMode: 'heliosphere' | 'magnetosphere';
  flares: NasaSolarFlare[];
  cmes: NasaCmeEvent[];
  selectedFlare: NasaSolarFlare | null;
  onSelectFlare: (flare: NasaSolarFlare) => void;
  kpIndex: number;
  solarWindSpeedKmS: number;
  imfBz: number;
}

export const SpaceWeatherCanvas: React.FC<SpaceWeatherCanvasProps> = ({
  viewMode,
  flares,
  cmes,
  selectedFlare,
  onSelectFlare,
  kpIndex,
  solarWindSpeedKmS,
  imfBz,
}) => {
  return (
    <div className="relative w-full h-full bg-[#02050D] overflow-hidden">
      <Canvas
        camera={{
          position: viewMode === 'heliosphere' ? [0, 8, 26] : [14, 10, -18],
          fov: 45,
          near: 0.1,
          far: 500,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor('#02050D');
          scene.background = new THREE.Color('#02050D');
        }}
      >
        <Suspense fallback={null}>
          <Stars
            radius={250}
            depth={60}
            count={2400}
            factor={3.5}
            saturation={0.5}
            fade
            speed={0.5}
          />

          {viewMode === 'heliosphere' ? (
            <SunHeliosphere3D
              flares={flares}
              cmes={cmes}
              selectedFlare={selectedFlare}
              onSelectFlare={onSelectFlare}
            />
          ) : (
            <EarthMagnetosphere3D
              kpIndex={kpIndex}
              solarWindSpeedKmS={solarWindSpeedKmS}
              imfBz={imfBz}
            />
          )}

          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.05}
            minDistance={viewMode === 'heliosphere' ? 8 : 6}
            maxDistance={viewMode === 'heliosphere' ? 65 : 45}
            autoRotate
            autoRotateSpeed={0.25}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
