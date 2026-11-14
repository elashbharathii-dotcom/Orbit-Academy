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
 * Ultra-Realistic Central Star (Sol) — AAA Cinematic Visual Upgrade
 * 
 * Astrophysics & Volumetric Coronal Shader Pipeline:
 * - Solves flat-yellow sphere with Eddington-Barbier solar limb darkening (hot white-gold core -> deep solar amber limb)
 * - Multi-scale convective photospheric granulation with counter-drifting flows
 * - Volumetric pulsating solar corona with dynamic animated streamers and magnetic prominence loops
 * - Dynamic chromospheric corona rim with exponential Fresnel falloff
 * - Calibrated photometric point light casting soft shadows across the solar system
 * - Delta-time based continuous axial rotation and coronal turbulence
 */
export const Sun: React.FC<SunProps> = ({ radius = 4.6 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerCoronaRef = useRef<THREE.Mesh>(null);
  const outerStreamersRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef<number>(0);

  const { selectedPlanetId, hoveredPlanetId, selectPlanet, setHoveredPlanet } = useSolarSystem();

  const isSelected = selectedPlanetId === 'sun';
  const isHovered = hoveredPlanetId === 'sun';

  // Reactively loaded 2K SDO photosphere map
  const sunTexture = usePlanetaryTexture('sun');

  // 1. Photosphere Shader Material with Authentic Limb Darkening & Granulation
  const sunMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D uSunTexture;
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vWorldPosition;

        // Simplex-inspired fast procedural noise for convective bubbling
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        void main() {
          // Dual-speed convective surface drift
          vec2 uv1 = vec2(vUv.x + uTime * 0.005, vUv.y);
          vec2 uv2 = vec2(vUv.x - uTime * 0.003, vUv.y + sin(uTime * 0.012 + vUv.x * 6.0) * 0.003);

          vec4 tex1 = texture2D(uSunTexture, uv1);
          vec4 tex2 = texture2D(uSunTexture, uv2);
          vec3 baseColor = mix(tex1.rgb, tex2.rgb, 0.35);

          // Dynamic convective granules
          float granules = noise(vUv * 48.0 + vec2(uTime * 0.04, -uTime * 0.02)) * 0.12;
          baseColor += vec3(granules * 0.9, granules * 0.6, granules * 0.1);

          // Astrophysical limb darkening (Eddington-Barbier approximation)
          float mu = max(0.0, dot(vNormal, vViewDir));
          float limbDarkening = 0.40 + 0.60 * pow(mu, 0.75);

          // Center is incandescent white-gold (6,000 K); limb cools to deep solar amber (4,500 K)
          vec3 hotCore = vec3(1.22, 1.10, 0.92);
          vec3 coolLimb = vec3(0.95, 0.45, 0.08);
          vec3 gradientTint = mix(coolLimb, hotCore, pow(mu, 1.1));

          vec3 finalRgb = baseColor * gradientTint * limbDarkening * 1.30;
          gl_FragColor = vec4(finalRgb, 1.0);
        }
      `,
      uniforms: {
        uSunTexture: { value: sunTexture },
        uTime: { value: 0 },
      },
    });
  }, [sunTexture]);

  // Keep texture updated
  sunMaterial.uniforms.uSunTexture.value = sunTexture;

  // 2. Chromospheric Inner Corona Rim (tight exponential Fresnel falloff)
  const innerCoronaMaterial = useMemo(() => {
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
          // Exponential decay hugging the solar horizon tightly
          float glow = pow(fresnel, 3.6) * 0.85;
          vec3 coronaColor = vec3(1.0, 0.65, 0.15);
          gl_FragColor = vec4(coronaColor, glow);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, []);

  // 3. Volumetric Solar Streamers & Prominences Shell (outer pulsating coronal rays)
  const outerStreamersMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec2 vUv;

        // Procedural radial ray noise for solar wind streamers
        float rayNoise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          float fresnel = 1.0 - max(0.0, dot(vNormal, vViewDir));
          
          // Angular ray patterns
          float angle = atan(vNormal.y, vNormal.x);
          float rays1 = sin(angle * 12.0 + uTime * 0.8) * 0.5 + 0.5;
          float rays2 = cos(angle * 24.0 - uTime * 1.2) * 0.5 + 0.5;
          float rayPattern = mix(rays1, rays2, 0.5);

          // Soft volumetric ray falloff
          float alpha = pow(fresnel, 4.2) * rayPattern * 0.45;
          vec3 rayColor = mix(vec3(1.0, 0.68, 0.15), vec3(1.0, 0.35, 0.05), rayPattern);

          gl_FragColor = vec4(rayColor, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
      },
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
    if (outerStreamersMaterial) {
      outerStreamersMaterial.uniforms.uTime.value = timeRef.current;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.022; // Solar axial rotation
    }
    if (innerCoronaRef.current) {
      innerCoronaRef.current.rotation.y -= delta * 0.008;
    }
    if (outerStreamersRef.current) {
      outerStreamersRef.current.rotation.z += delta * 0.015;
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
        intensity={3.4}
        distance={380}
        decay={0.28}
        castShadow
        shadow-bias={-0.0002}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* 2. Soft Chromospheric Fill Light */}
      <pointLight
        color="#FEF08A"
        intensity={0.70}
        distance={140}
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

      {/* 4. Chromospheric Inner Corona Rim */}
      <mesh ref={innerCoronaRef} scale={[1.035, 1.035, 1.035]}>
        <sphereGeometry args={[radius, 48, 48]} />
        <primitive object={innerCoronaMaterial} attach="material" />
      </mesh>

      {/* 5. Volumetric Solar Streamers & Prominences Shell */}
      <mesh ref={outerStreamersRef} scale={[1.085, 1.085, 1.085]}>
        <sphereGeometry args={[radius, 48, 48]} />
        <primitive object={outerStreamersMaterial} attach="material" />
      </mesh>

      {/* 6. Minimal Sol Label (Revealed only on hover or focus) */}
      {(isHovered || isSelected) && (
        <Html
          position={[0, radius * 1.35, 0]}
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
            className="flex items-center gap-1.5 rounded-full border border-[#F59E0B]/50 bg-[#05070D]/90 px-3 py-1 backdrop-blur-md transition-all cursor-pointer shadow-lg animate-fade-in"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="font-mono text-[9.5px] font-semibold tracking-wider text-[#F8FAFC]">
              SOL // MISSION CONTROL
            </span>
          </div>
        </Html>
      )}
    </group>
  );
};
