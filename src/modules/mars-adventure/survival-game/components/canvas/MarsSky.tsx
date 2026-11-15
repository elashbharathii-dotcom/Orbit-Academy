import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMarsGameStore } from '../../store/useMarsGameStore';

export const MarsSky: React.FC = () => {
  const solCycle = useMarsGameStore((state) => state.solCycle);
  const playerPos = useMarsGameStore((state) => state.playerPosition);
  const roverPos = useMarsGameStore((state) => state.roverPosition);
  const controlMode = useMarsGameStore((state) => state.settings.controlMode);
  const graphicsQuality = useMarsGameStore((state) => state.settings.graphicsQuality ?? 'high');

  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  const shadowResolution = graphicsQuality === 'low' ? 512 : graphicsQuality === 'medium' ? 1024 : 2048;

  // Compute sun elevation angle from timeOfDay (0 - 24.65)
  // Sunrise at ~6h, Sunset at ~18.5h
  const sunAngle = ((solCycle.timeOfDay - 6.0) / 12.5) * Math.PI;
  const isSunUp = solCycle.timeOfDay >= 5.5 && solCycle.timeOfDay <= 19.0;

  const sunX = Math.cos(sunAngle) * 85;
  const sunY = Math.sin(sunAngle) * 70;
  const sunZ = -35;

  useFrame(() => {
    // Dynamic Shadow Tracking: Center directional sunlight camera over active player/rover
    // This provides 2048x2048 ultra-crisp shadows everywhere across the 360m world without performance drops!
    const targetX = controlMode === 'driving_rover' ? roverPos[0] : playerPos[0];
    const targetZ = controlMode === 'driving_rover' ? roverPos[2] : playerPos[2];

    if (sunLightRef.current) {
      if (isSunUp) {
        sunLightRef.current.position.set(targetX + sunX, Math.max(1.0, sunY), targetZ + sunZ);
        sunLightRef.current.target.position.set(targetX, 0, targetZ);
        sunLightRef.current.target.updateMatrixWorld();

        // Sunlight intensity scales with elevation and dust storm attenuation
        const stormFade = 1.0 - solCycle.dustStormIntensity * 0.55;
        const baseIntensity = Math.max(0.12, Math.sin(sunAngle) * 2.3) * stormFade;
        sunLightRef.current.intensity = baseIntensity;

        // Sunset/sunrise blueish hue, midday crisp pale sunlight
        if (sunY < 14) {
          sunLightRef.current.color.set('#93C5FD'); // Martian blue sunset/sunrise
        } else {
          sunLightRef.current.color.set('#FFFBEB'); // Crisp pale solar rays
        }
      } else {
        sunLightRef.current.intensity = 0.04; // Faint starlight
        sunLightRef.current.color.set('#1E293B');
      }
    }

    if (ambientLightRef.current) {
      if (isSunUp) {
        // Ground bounce ambient illumination
        const stormWarmth = solCycle.dustStormIntensity * 0.2;
        ambientLightRef.current.intensity = 0.42 + stormWarmth;
        ambientLightRef.current.color.set(solCycle.dustStormIntensity > 0.4 ? '#9A3412' : '#78350F');
      } else {
        ambientLightRef.current.intensity = 0.08;
        ambientLightRef.current.color.set('#0F172A'); // Deep space ambient
      }
    }
  });

  return (
    <>
      {/* Dynamic Atmospheric Fog with Dust Storm Haze */}
      <fogExp2
        attach="fog"
        args={[
          isSunUp
            ? sunY < 12
              ? '#4A1D11' // Sunset horizon dusk
              : solCycle.dustStormIntensity > 0.3
                ? '#92400E' // Heavy dust storm haze
                : '#78350F' // Dusty butterscotch daytime
            : '#05070D', // Starry night void
          0.009 + solCycle.dustStormIntensity * 0.024,
        ]}
      />

      {/* Primary Directional Sunlight with High-Fidelity Cascading Shadows */}
      <directionalLight
        ref={sunLightRef}
        position={[sunX, Math.max(1, sunY), sunZ]}
        castShadow={graphicsQuality !== 'low'}
        shadow-mapSize-width={shadowResolution}
        shadow-mapSize-height={shadowResolution}
        shadow-camera-near={0.5}
        shadow-camera-far={220}
        shadow-camera-left={-42}
        shadow-camera-right={42}
        shadow-camera-top={42}
        shadow-camera-bottom={-42}
        shadow-bias={-0.00035}
      />

      {/* Atmospheric Ambient Fill */}
      <ambientLight ref={ambientLightRef} />

      {/* Visual Sun Mesh in Sky */}
      {isSunUp && (
        <group position={[sunX * 1.5, Math.max(2, sunY * 1.5), sunZ * 1.5]}>
          {/* Solar disc (Sun appears smaller on Mars than Earth) */}
          <mesh>
            <sphereGeometry args={[2.2, 16, 16]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          {/* Martian blue glow corona */}
          <mesh>
            <sphereGeometry args={[4.8, 16, 16]} />
            <meshBasicMaterial
              color={sunY < 14 ? '#60A5FA' : '#FDE68A'}
              transparent
              opacity={0.32}
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
