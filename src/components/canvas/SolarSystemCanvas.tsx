import React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { SolarSystemScene } from './SolarSystemScene';
import { WebGLErrorBoundary } from '../common/WebGLErrorBoundary';
import { useSolarSystem } from '../../context/SolarSystemContext';

interface SolarSystemCanvasProps {
  speedScale?: number;
}

/**
 * Full-screen 3D WebGL Canvas for ORBIT ACADEMY (AAA Edition)
 * 
 * Photometric Lighting & Cinematic Renderer Settings:
 * - Dynamic DPR clamping adapted to selected Graphics Quality Tier [low, medium, high, ultra]
 * - ACESFilmicToneMapping with calibrated exposure (1.12) for realistic HDR contrast
 * - THREE.SRGBColorSpace output gamma for authentic photographic planetary maps
 * - PCFSoftShadowMap for natural soft contact shadows and ring shadows
 * - Deep-space void clear color (#030611)
 */
export const SolarSystemCanvas: React.FC<SolarSystemCanvasProps> = ({
  speedScale = 0.45,
}) => {
  const { graphicsTier = 'high' } = useSolarSystem();

  // Dynamic DPR clamp based on performance tier
  const dprRange: [number, number] =
    graphicsTier === 'low'
      ? [0.75, 1.0]
      : graphicsTier === 'medium'
      ? [1.0, 1.25]
      : graphicsTier === 'ultra'
      ? [1.0, 2.0]
      : [1.0, 1.75]; // 'high' default

  return (
    <div className="absolute inset-0 h-full w-full bg-[#030611]">
      <WebGLErrorBoundary
        fallbackTitle="Solar System Mission Overview"
        fallbackDescription="Celestial orbital mechanics and planetary trajectory calculations are active. You can select any planet using the 2D Directory or numerical navigation keys."
      >
        <Canvas
          shadows={graphicsTier !== 'low'}
          camera={{
            position: [0, 48, 92],
            fov: 42,
            near: 0.1,
            far: 1400,
          }}
          dpr={dprRange}
          gl={{
            antialias: graphicsTier !== 'low',
            powerPreference: graphicsTier === 'ultra' ? 'high-performance' : 'default',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.12,
          }}
          onCreated={({ gl, scene }) => {
            gl.setClearColor('#030611');
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.shadowMap.enabled = graphicsTier !== 'low';
            gl.shadowMap.type =
              graphicsTier === 'low'
                ? THREE.BasicShadowMap
                : THREE.PCFSoftShadowMap;
            scene.background = new THREE.Color('#030611');
          }}
        >
          <SolarSystemScene speedScale={speedScale} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
};
