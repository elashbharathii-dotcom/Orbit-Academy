import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMarsGameStore } from '../../store/useMarsGameStore';

export const MarsSky: React.FC = () => {
  const solCycle = useMarsGameStore((state) => state.solCycle);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  // Compute sun elevation angle from timeOfDay (0 - 24.65)
  // Sunrise at ~6h, Sunset at ~18.5h
  const sunAngle = ((solCycle.timeOfDay - 6.0) / 12.5) * Math.PI;
  const isSunUp = solCycle.timeOfDay >= 5.5 && solCycle.timeOfDay <= 19.0;

  const sunX = Math.cos(sunAngle) * 80;
  const sunY = Math.sin(sunAngle) * 65;
  const sunZ = -30;

  useFrame(() => {
    if (sunLightRef.current) {
      if (isSunUp) {
        sunLightRef.current.position.set(sunX, Math.max(0.5, sunY), sunZ);
        // Sun intensity scales with height
        const intensity = Math.max(0.1, Math.sin(sunAngle) * 2.2);
        sunLightRef.current.intensity = intensity;

        // Sunset/sunrise blueish hue, daytime warm amber
        if (sunY < 12) {
          sunLightRef.current.color.set('#93C5FD'); // Martian blue sunset
        } else {
          sunLightRef.current.color.set('#FFFBEB'); // Crisp pale sunlight
        }
      } else {
        sunLightRef.current.intensity = 0.04; // Faint starlight
        sunLightRef.current.color.set('#1E293B');
      }
    }

    if (ambientLightRef.current) {
      if (isSunUp) {
        ambientLightRef.current.intensity = 0.45;
        ambientLightRef.current.color.set('#78350F'); // Martian ground bounce ambient
      } else {
        ambientLightRef.current.intensity = 0.08;
        ambientLightRef.current.color.set('#0F172A'); // Deep space ambient
      }
    }
  });

  return (
    <>
      {/* Martian Atmospheric Fog */}
      <fogExp2
        attach="fog"
        args={[
          isSunUp
            ? sunY < 10
              ? '#4A1D11' // Sunset horizon dusk
              : '#854D0E' // Dusty butterscotch daytime
            : '#05070D', // Starry night void
          0.014 + solCycle.dustStormIntensity * 0.02,
        ]}
      />

      {/* Primary Directional Sunlight with Soft Shadows */}
      <directionalLight
        ref={sunLightRef}
        position={[sunX, Math.max(1, sunY), sunZ]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={200}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0005}
      />

      {/* Atmospheric Ambient Fill */}
      <ambientLight ref={ambientLightRef} />

      {/* Visual Sun Mesh in Sky */}
      {isSunUp && (
        <group position={[sunX * 1.5, Math.max(2, sunY * 1.5), sunZ * 1.5]}>
          {/* Small solar disc (Sun appears smaller on Mars than Earth) */}
          <mesh>
            <sphereGeometry args={[2.2, 16, 16]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          {/* Martian blue glow corona */}
          <mesh>
            <sphereGeometry args={[4.5, 16, 16]} />
            <meshBasicMaterial
              color={sunY < 12 ? '#60A5FA' : '#FDE68A'}
              transparent
              opacity={0.35}
            />
          </mesh>
        </group>
      )}

      {/* Night Sky Stars & Moons */}
      {!isSunUp && (
        <group>
          {/* Phobos moon */}
          <mesh position={[-45, 60, -70]}>
            <sphereGeometry args={[1.2, 8, 8]} />
            <meshStandardMaterial color="#94A3B8" roughness={0.9} />
          </mesh>
          {/* Earth visible as a bright bluish star in Martian night sky */}
          <mesh position={[50, 48, -80]}>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
        </group>
      )}
    </>
  );
};
