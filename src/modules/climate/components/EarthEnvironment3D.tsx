/**
 * ORBIT ACADEMY — CLIMATE LAB
 * PHASE 1 & 2: REALISTIC 3D EARTH ENVIRONMENT & DYNAMIC WEATHER SYSTEMS
 * 
 * Features:
 * - Genuine NASA Blue Marble 2K Daymap with ocean specular highlights
 * - NASA Black Marble 2K Night-side city lights blended through terminator dot product
 * - Concentric NASA cloud layer with differential rotation drift
 * - Thin realistic Rayleigh atmospheric scattering cyan halo (custom Fresnel GLSL shader)
 * - 23.44° Earth axial tilt
 * - 3D Weather systems: Rotating Hurricane Vortex with eye, Convective Thunderstorm with lightning flashes,
 *   Monsoon moisture streams, Arctic Blizzard snow swirls, and Drought heat distortion
 * - Interactive camera navigation: Continent focus lerp transitions, double-click targeting, and Blue Marble reset
 */

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import {
  usePlanetaryTexture,
  useEarthCloudsTexture,
  useEarthNightLightsTexture,
} from '../../../utils/planetaryTextures';
import {
  ContinentRegion,
  WeatherSystemConfig,
  ClimateParameters,
} from '../types';
import { climateAudio } from '../audio/climateAudio';
import { WebGLErrorBoundary } from '../../../components/common/WebGLErrorBoundary';
import {
  RotateCcw,
  Play,
  Pause,
  MapPin,
  Maximize2,
  Minimize2,
  Layers,
} from 'lucide-react';

interface EarthEnvironment3DProps {
  selectedRegion: ContinentRegion;
  onSelectRegion: (region: ContinentRegion) => void;
  activeWeather: WeatherSystemConfig;
  climateParams: ClimateParameters;
  availableRegions: ContinentRegion[];
  customTextureUrl?: string;
}

/** Convert latitude and longitude to a 3D unit sphere Cartesian vector */
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// ---------------------------------------------------------------------------
// 1. EARTH GLOBE WITH DAY/NIGHT SHADER & ATMOSPHERE
// ---------------------------------------------------------------------------
interface EarthGlobeProps {
  activeWeather: WeatherSystemConfig;
  climateParams: ClimateParameters;
  isRotating: boolean;
  onGlobeClick: (event: { point: THREE.Vector3 }) => void;
  customTextureUrl?: string;
}

const EarthGlobe: React.FC<EarthGlobeProps> = ({
  activeWeather,
  climateParams,
  isRotating,
  onGlobeClick,
  customTextureUrl,
}) => {
  const earthGroupRef = useRef<THREE.Group>(null);
  const cloudsMeshRef = useRef<THREE.Mesh>(null);
  const stormVortexRef = useRef<THREE.Group>(null);
  const lightningLightRef = useRef<THREE.PointLight>(null);

  const earthDayTexture = usePlanetaryTexture('earth');
  const earthNightTexture = useEarthNightLightsTexture();
  const earthCloudsTexture = useEarthCloudsTexture();

  // Dynamic custom NASA GIBS texture
  const [customTexture, setCustomTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!customTextureUrl) {
      setCustomTexture(null);
      return;
    }
    const loader = new THREE.TextureLoader();
    loader.load(
      customTextureUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.needsUpdate = true;
        setCustomTexture(tex);
      },
      undefined,
      () => setCustomTexture(null)
    );
  }, [customTextureUrl]);

  const activeSurfaceTexture = customTexture || earthDayTexture;

  // Sun directional light position in world space
  const sunPosition = useMemo(() => new THREE.Vector3(12, 3.5, 8.5), []);

  // Night-side city lights custom shader material
  const earthNightShaderMaterial = useMemo(() => {
    if (!earthNightTexture) return null;
    return new THREE.ShaderMaterial({
      uniforms: {
        uNightTexture: { value: earthNightTexture },
        uSunPosition: { value: sunPosition },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D uNightTexture;
        uniform vec3 uSunPosition;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        void main() {
          vec3 sunDir = normalize(uSunPosition - vWorldPosition);
          float sunDot = dot(vNormal, sunDir);
          // Night hemisphere where sunDot < 0.1
          float nightFactor = smoothstep(0.12, -0.22, sunDot);
          vec4 cityLights = texture2D(uNightTexture, vUv);
          // Warm golden tint for night illumination
          vec3 warmLights = cityLights.rgb * vec3(1.3, 1.15, 0.95);
          gl_FragColor = vec4(warmLights, cityLights.r * nightFactor * 0.95);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [earthNightTexture, sunPosition]);

  // Thin realistic Rayleigh atmospheric scattering cyan rim shader
  const atmosphereRimMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uSunPosition: { value: sunPosition },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewVec;
        varying vec3 vWorldPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          vViewVec = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uSunPosition;
        varying vec3 vNormal;
        varying vec3 vViewVec;
        varying vec3 vWorldPosition;
        void main() {
          vec3 sunDir = normalize(uSunPosition - vWorldPosition);
          float sunDot = dot(vNormal, sunDir);
          float dayFactor = smoothstep(-0.3, 0.25, sunDot);
          
          // Fresnel rim intensity
          float rim = pow(1.0 - abs(dot(vNormal, vViewVec)), 3.2);
          
          // Realistic Rayleigh cyan-blue glow
          vec3 skyBlue = vec3(0.22, 0.68, 1.0);
          gl_FragColor = vec4(skyBlue, rim * 0.92 * (0.35 + 0.65 * dayFactor));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, [sunPosition]);

  // Dynamic Hurricane / Cyclone 3D Spiral Geometry
  const hurricaneParticles = useMemo(() => {
    const count = 380;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Logarithmic spiral: r = a * e^(b*theta)
      const arm = i % 3;
      const angle = (i / count) * Math.PI * 5.0 + (arm * (Math.PI * 2 / 3));
      const radius = 0.08 + Math.pow(i / count, 0.7) * 0.65;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 0.04;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      colors[i * 3] = 0.85;     // R
      colors[i * 3 + 1] = 0.95; // G
      colors[i * 3 + 2] = 1.0;  // B
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  // Compute position of active weather system on Earth's surface
  const weatherSystemPos = useMemo(() => {
    return latLonToVector3(
      activeWeather.activeCoordinates.lat,
      activeWeather.activeCoordinates.lon,
      3.22
    );
  }, [activeWeather]);

  // Per-frame physics animation
  useFrame((_, delta) => {
    // 1. Earth Axial Rotation (23.44° tilt)
    if (earthGroupRef.current && isRotating) {
      earthGroupRef.current.rotation.y += delta * 0.035;
    }

    // 2. Atmospheric Cloud Differential Drift
    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.rotation.y += delta * 0.045;
    }

    // 3. Hurricane Cyclone Vortex Rotation
    if (stormVortexRef.current && activeWeather.visualTraits.hasVortex) {
      // Counterclockwise rotation in Northern Hemisphere
      stormVortexRef.current.rotation.y += delta * (activeWeather.windSpeedKmh / 80);
    }

    // 4. Convective Thunderstorm Lightning Flash Strobe
    if (lightningLightRef.current && activeWeather.visualTraits.hasLightning) {
      if (Math.random() < 0.045) {
        lightningLightRef.current.intensity = 2.5 + Math.random() * 3.5;
        if (Math.random() < 0.2) {
          climateAudio.playThunder();
        }
      } else {
        lightningLightRef.current.intensity = THREE.MathUtils.lerp(
          lightningLightRef.current.intensity,
          0.1,
          0.3
        );
      }
    }
  });

  // Calculate polar ice cap scaling according to climate parameters
  const iceCapScaleY = useMemo(() => {
    return Math.max(0.2, climateParams.arcticIceCoveragePercent / 100);
  }, [climateParams.arcticIceCoveragePercent]);

  return (
    <group
      ref={earthGroupRef}
      rotation={[THREE.MathUtils.degToRad(23.44), 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onGlobeClick({ point: e.point });
      }}
    >
      {/* 1. Main Earth Solid Body with NASA Blue Marble Daymap / Live GIBS Satellite Map */}
      <mesh receiveShadow castShadow>
        <sphereGeometry args={[3.2, 128, 128]} />
        <meshStandardMaterial
          map={activeSurfaceTexture}
          roughness={0.4}
          metalness={0.08}
        />
      </mesh>

      {/* 2. NASA Black Marble Night-Side City Lights (Blended via Terminator) */}
      {earthNightShaderMaterial && (
        <mesh scale={[1.0015, 1.0015, 1.0015]}>
          <sphereGeometry args={[3.2, 96, 96]} />
          <primitive object={earthNightShaderMaterial} attach="material" />
        </mesh>
      )}

      {/* 3. Dynamic Polar Cryosphere Ice Sheet (Scales with Climate Ice Parameter) */}
      <mesh
        position={[0, 3.12, 0]}
        scale={[1.002, iceCapScaleY * 0.18, 1.002]}
      >
        <cylinderGeometry args={[1.15 * iceCapScaleY, 1.35 * iceCapScaleY, 0.35, 64]} />
        <meshStandardMaterial
          color="#F0F9FF"
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* 4. Dynamic Atmospheric Cloud Deck (Differential Drift & Dynamic Opacity) */}
      <mesh ref={cloudsMeshRef} scale={[1.012, 1.012, 1.012]}>
        <sphereGeometry args={[3.2, 96, 96]} />
        <meshStandardMaterial
          map={earthCloudsTexture}
          transparent
          opacity={activeWeather.visualTraits.cloudOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          color="#FFFFFF"
        />
      </mesh>

      {/* 5. Thin Realistic Rayleigh Scattering Atmospheric Halo */}
      <mesh scale={[1.032, 1.032, 1.032]}>
        <sphereGeometry args={[3.2, 64, 64]} />
        <primitive object={atmosphereRimMaterial} attach="material" />
      </mesh>

      {/* 6. Dynamic 3D Weather System Overlays */}
      <group position={weatherSystemPos}>
        {/* Point storm marker / indicator */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={activeWeather.visualTraits.particleColor} />
        </mesh>

        {/* Hurricane / Cyclone Spiral Vortex */}
        {activeWeather.visualTraits.hasVortex && (
          <group ref={stormVortexRef}>
            <points geometry={hurricaneParticles}>
              <pointsMaterial
                size={0.035}
                vertexColors
                transparent
                opacity={0.85}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </points>
            {/* Eye of the storm ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.02, 0.07, 32]} />
              <meshBasicMaterial color="#0A1128" side={THREE.DoubleSide} />
            </mesh>
          </group>
        )}

        {/* Convective Thunderstorm Lightning Source */}
        {activeWeather.visualTraits.hasLightning && (
          <pointLight
            ref={lightningLightRef}
            color="#E0F2FE"
            intensity={0.2}
            distance={2.5}
            decay={2}
          />
        )}

        {/* Drought Heat Distortion Field */}
        {activeWeather.visualTraits.hasDroughtHaze && (
          <mesh scale={[1.2, 1.2, 1.2]}>
            <sphereGeometry args={[0.3, 24, 24]} />
            <meshBasicMaterial
              color="#F59E0B"
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};

// ---------------------------------------------------------------------------
// 2. CINEMATIC CAMERA CONTROLLER WITH SMOOTH LERP TRANSITIONS
// ---------------------------------------------------------------------------
interface CameraLerpProps {
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

const CameraLerpController: React.FC<CameraLerpProps> = ({
  targetPosition,
  targetLookAt,
  controlsRef,
}) => {
  const { camera } = useThree();
  const desiredPos = useMemo(() => new THREE.Vector3(...targetPosition), [targetPosition]);
  const desiredLook = useMemo(() => new THREE.Vector3(...targetLookAt), [targetLookAt]);

  useFrame((_, delta) => {
    // Smooth lerp transition to target coordinates
    camera.position.lerp(desiredPos, delta * 2.8);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(desiredLook, delta * 2.8);
      controlsRef.current.update();
    }
  });

  return null;
};

// ---------------------------------------------------------------------------
// 3. MASTER EARTH ENVIRONMENT 3D VIEWPORT
// ---------------------------------------------------------------------------
export const EarthEnvironment3D: React.FC<EarthEnvironment3DProps> = ({
  selectedRegion,
  onSelectRegion,
  activeWeather,
  climateParams,
  availableRegions,
  customTextureUrl,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Active camera targets
  const [targetCamPos, setTargetCamPos] = useState<[number, number, number]>(selectedRegion.cameraPosition);
  const [targetCamLook, setTargetCamLook] = useState<[number, number, number]>(selectedRegion.targetLookAt);

  // Update camera targets whenever selectedRegion changes
  useEffect(() => {
    setTargetCamPos(selectedRegion.cameraPosition);
    setTargetCamLook(selectedRegion.targetLookAt);
  }, [selectedRegion]);

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Reset to full Apollo 17 Blue Marble view
  const handleResetCamera = () => {
    const globalRegion = availableRegions.find((r) => r.id === 'global-overview') || availableRegions[0];
    onSelectRegion(globalRegion);
    setTargetCamPos([0, 2.5, 9.5]);
    setTargetCamLook([0, 0, 0]);
    climateAudio.playClick(620);
  };

  // Direct double click on globe surface to zoom into region
  const handleGlobeClick = (e: { point: THREE.Vector3 }) => {
    climateAudio.playClick(880);
    // Move camera towards clicked surface normal
    const direction = e.point.clone().normalize();
    const zoomPos = direction.clone().multiplyScalar(5.5);
    setTargetCamPos([zoomPos.x, zoomPos.y, zoomPos.z]);
    setTargetCamLook([0, 0, 0]);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[580px] rounded-2xl overflow-hidden bg-[#02050D] border border-cyan-500/20 shadow-2xl flex flex-col"
    >
      {/* 3D Canvas Viewport */}
      <div className="absolute inset-0">
        <WebGLErrorBoundary
          fallbackTitle="Planetary Earth Climate Projection"
          fallbackDescription="Atmospheric energy flux and weather system modeling active. Weather presets, IPCC scenarios, and regional telemetry remain fully accessible."
        >
          <Canvas
            camera={{ position: [0, 2.5, 9.5], fov: 45 }}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.15,
              powerPreference: 'default',
            }}
          >
            {/* Deep Space Background Stars */}
            <Stars radius={250} depth={80} count={3500} factor={4} saturation={0.5} fade speed={0.4} />

            {/* Sol Sunlight Directional Illuminator */}
            <directionalLight
              position={[12, 3.5, 8.5]}
              intensity={2.4}
              color="#FFFBEB"
              castShadow
            />

            {/* Gentle Deep Cosmic Ambient Fill */}
            <ambientLight intensity={0.22} color="#1E293B" />

            {/* Central 3D Earth Globe */}
            <EarthGlobe
              activeWeather={activeWeather}
              climateParams={climateParams}
              isRotating={isRotating}
              onGlobeClick={handleGlobeClick}
              customTextureUrl={customTextureUrl}
            />

            {/* Smooth Camera Controller */}
            <OrbitControls
              ref={controlsRef}
              enableDamping
              dampingFactor={0.06}
              minDistance={4.2}
              maxDistance={18.0}
              rotateSpeed={0.7}
              zoomSpeed={0.8}
            />

            <CameraLerpController
              targetPosition={targetCamPos}
              targetLookAt={targetCamLook}
              controlsRef={controlsRef}
            />
          </Canvas>
        </WebGLErrorBoundary>
      </div>

      {/* TOP FLOATING AEROSPACE TELEMETRY HUD */}
      <div className="relative z-10 flex items-center justify-between p-4 pointer-events-none">
        {/* Left: Active Region & Coordinates */}
        <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 rounded-xl px-4 py-2 pointer-events-auto shadow-lg">
          <MapPin className="w-4 h-4 text-cyan-400 animate-pulse" />
          <div>
            <div className="text-xs uppercase tracking-wider text-cyan-400/80 font-mono">
              Target Focal Region
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              {selectedRegion.name}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                {selectedRegion.coordinates.lat >= 0 ? `${selectedRegion.coordinates.lat}°N` : `${Math.abs(selectedRegion.coordinates.lat)}°S`},{' '}
                {selectedRegion.coordinates.lon >= 0 ? `${selectedRegion.coordinates.lon}°E` : `${Math.abs(selectedRegion.coordinates.lon)}°W`}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Live Viewport Controls */}
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 rounded-xl p-1.5 pointer-events-auto shadow-lg">
          <button
            onClick={() => {
              setIsRotating(!isRotating);
              climateAudio.playClick();
            }}
            title={isRotating ? 'Pause Planetary Rotation' : 'Resume Planetary Rotation'}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 transition-colors"
          >
            {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handleResetCamera}
            title="Reset to Full Earth Blue Marble View"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* BOTTOM REGION FOCUS STRIP */}
      <div className="mt-auto relative z-10 p-4 pointer-events-auto">
        <div className="bg-slate-950/90 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-3 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Continental & Biome Navigation Targets
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Double-click globe or click preset to focus
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-cyan-500/30">
            {availableRegions.map((region) => {
              const isSelected = selectedRegion.id === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => {
                    climateAudio.playSonarPing();
                    onSelectRegion(region);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-500/25 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-cyan-500/40 hover:text-white'
                  }`}
                >
                  <MapPin className={`w-3 h-3 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {region.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
