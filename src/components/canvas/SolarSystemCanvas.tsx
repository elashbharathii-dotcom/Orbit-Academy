import React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { SolarSystemScene } from './SolarSystemScene';

interface SolarSystemCanvasProps {
  speedScale?: number;
}

/**
 * Full-screen 3D WebGL Canvas for ORBIT ACADEMY (Phase 6C)
 * 
 * Photometric Lighting & Cinematic Renderer Settings:
 * - ACESFilmicToneMapping with calibrated exposure (1.06) for realistic HDR contrast
 * - THREE.SRGBColorSpace output gamma for authentic photographic planetary maps
 * - PCFSoftShadowMap for natural soft contact shadows and ring shadows
 * - Adaptive DPR clamping [1, 2] preventing GPU overheating on Retina and 4K displays
 * - Deep-space void clear color (#030611)
 */
export const SolarSystemCanvas: React.FC<SolarSystemCanvasProps> = ({
  speedScale = 0.45,
}) => {
  return (
    <div className="absolute inset-0 h-full w-full bg-[#030611]">
      <Canvas
        shadows
        camera={{
          position: [0, 48, 92],
          fov: 42,
          near: 0.1,
          far: 1400,
        }}
        dpr={[1, 2]} // Performance clamp for high-DPI laptops and mobile
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor('#030611');
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          scene.background = null;
        }}
      >
        <SolarSystemScene speedScale={speedScale} />
      </Canvas>
    </div>
  );
};
