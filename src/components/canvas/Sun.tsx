import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePlanetaryTexture } from '../../utils/planetaryTextures';
import { useSolarSystem } from '../../context/SolarSystemContext';

interface SunProps {
  radius?: number;
}

/**
 * Ultra-Realistic Central Star (Sol) — Phase 6C Visual Correction
 * 
 * Astrophysics & Photometric Improvements:
 * - Solves the "flat yellow sphere" problem via authentic Eddington-Barbier solar limb darkening
 * - Center is brilliant incandescent white-gold; limb naturally cools to deep solar amber
 * - Dynamic dual-layer convective granulation drift revealing actual SDO sunspots and faculae
 * - Restrained, exponential Fresnel corona avoiding opaque blob blowout
 * - Calibrated photometric point light casting soft shadows across the solar system
 */
export const Sun: React.FC<SunProps> = ({ radius = 4.6 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef<number>(0);

  const { selectedPlanetId, hoveredPlanetId, selectPlanet, setHoveredPlanet } = useSolarSystem();

  const isSelected = selectedPlanetId === 'sun';
  const isHovered = hoveredPlanetId === 'sun';

  // Reactively loaded 2K SDO photosphere map
  const sunTexture = usePlanetaryTexture('sun');

  // Photosphere Shader Material with Limb Darkening
  const sunMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-worldPos.xyz);
          gl_Position = projectionMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D uSunTexture;
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          // Dual-speed convective surface drift
          vec2 uv1 = vec2(vUv.x + uTime * 0.006, vUv.y);
          vec2 uv2 = vec2(vUv.x - uTime * 0.003, vUv.y + sin(uTime * 0.015 + vUv.x * 8.0) * 0.003);

          vec4 tex1 = texture2D(uSunTexture, uv1);
          vec4 tex2 = texture2D(uSunTexture, uv2);
          vec3 baseColor = mix(tex1.rgb, tex2.rgb, 0.32);

          // Astrophysical limb darkening (Eddington-Barbier approximation)
          float mu = max(0.0, dot(vNormal, vViewDir));
          float limbDarkening = 0.42 + 0.58 * pow(mu, 0.72);

          // Center is incandescent white-gold; limb is deep solar amber
          vec3 hotCore = vec3(1.18, 1.06, 0.88);
          vec3 coolLimb = vec3(0.92, 0.42, 0.08);
          vec3 gradientTint = mix(coolLimb, hotCore, pow(mu, 1.15));

          vec3 finalRgb = baseColor * gradientTint * limbDarkening * 1.25;
          gl_FragColor = vec4(finalRgb, 1.0);
        }
      `,
      uniforms: {
        uSunTexture: { value: sunTexture },
        uTime: { value: 0 },
      },
    });
  }, [sunTexture]);

  // Keep texture uniform updated if sunTexture changes
  sunMaterial.uniforms.uSunTexture.value = sunTexture;

  // Coronal Limb Shader (Exponential Fresnel falloff)
  const coronaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-worldPos.xyz);
          gl_Position = projectionMatrix * worldPos;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          float fresnel = 1.0 - max(0.0, dot(vNormal, vViewDir));
          // Exponential decay hugging the solar horizon
          float glow = pow(fresnel, 3.2) * 0.85;
          vec3 coronaColor = vec3(0.96, 0.62, 0.12);
          gl_FragColor = vec4(coronaColor, glow);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (sunMaterial) {
      sunMaterial.uniforms.uTime.value = timeRef.current;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.025;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= delta * 0.01;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectPlanet(null);
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHoveredPlanet('sun');
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHoveredPlanet(null);
    document.body.style.cursor = 'default';
  };

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Primary Photometric Point Light Source */}
      <pointLight
        color="#FFFBF2"
        intensity={3.2}
        distance={340}
        decay={0.28}
        castShadow
        shadow-bias={-0.0002}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* 2. Soft Chromospheric Fill Light */}
      <pointLight
        color="#FEF08A"
        intensity={0.65}
        distance={120}
        decay={0.4}
      />

      {/* 3. Photosphere Globe with Limb Darkening Shader */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        <primitive object={sunMaterial} attach="material" />
      </mesh>

      {/* 4. Delicate Coronal Atmosphere Rim (Restrained Fresnel) */}
      <mesh ref={coronaRef} scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[radius, 36, 36]} />
        <primitive object={coronaMaterial} attach="material" />
      </mesh>

      {/* 5. Minimal Sol Label */}
      <Html
        position={[0, radius * 1.38, 0]}
        center
        distanceFactor={38}
        zIndexRange={[10, 30]}
        className="pointer-events-auto select-none"
      >
        <div
          role="button"
          tabIndex={0}
          aria-label="Sol: Mission Control & Home"
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          className={`flex items-center gap-1.5 rounded-md border px-2 py-0.5 backdrop-blur-md transition-all cursor-pointer ${
            isHovered || isSelected
              ? 'border-[#F59E0B] bg-[#0A0F1D]/90 text-[#F59E0B]'
              : 'border-transparent bg-[#0A0F1D]/40 text-[#94A3B8]'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
            SOL // MISSION CONTROL
          </span>
        </div>
      </Html>
    </group>
  );
};
