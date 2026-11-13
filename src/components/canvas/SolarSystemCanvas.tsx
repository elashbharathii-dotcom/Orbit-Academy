import React from 'react';
import { Canvas } from '@react-three/fiber';
import { SolarSystemScene } from './SolarSystemScene';

interface SolarSystemCanvasProps {
  speedScale?: number;
}

/**
 * Full-screen 3D WebGL Canvas for ORBIT ACADEMY
 * Features:
 * - Device Pixel Ratio clamping for high-DPI laptops and mobile screens
 * - Clean high-performance WebGL settings
 * - Deep-space background clear color (#05070D)
 */
export const SolarSystemCanvas: React.FC<SolarSystemCanvasProps> = ({
  speedScale = 0.45,
}) => {
  return (
    <div className="absolute inset-0 h-full w-full bg-[#05070D]">
      <Canvas
        shadows
        camera={{
          position: [0, 42, 68],
          fov: 45,
          near: 0.1,
          far: 1200,
        }}
        dpr={[1, 2]} // Performance clamp
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor('#05070D');
          scene.background = null;
        }}
      >
        <SolarSystemScene speedScale={speedScale} />
      </Canvas>
    </div>
  );
};

