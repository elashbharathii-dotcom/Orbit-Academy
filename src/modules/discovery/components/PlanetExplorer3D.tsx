import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { PlanetDiscoveryProfile, MajorMoon, PlanetaryHotspot } from '../types';
import {
  usePlanetaryTexture,
  useEarthCloudsTexture,
  useSaturnRingTexture,
  useNeptuneCirrusTexture,
} from '../../../utils/planetaryTextures';
import { usePlanetaryData } from '../../../services/planetary-data/usePlanetaryData';
import { discoveryAudio } from '../audio/discoveryAudio';
import { WebGLErrorBoundary } from '../../../components/common/WebGLErrorBoundary';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Crosshair,
  MapPin,
  Play,
  Pause,
  ZoomIn,
} from 'lucide-react';

interface PlanetExplorer3DProps {
  profile: PlanetDiscoveryProfile;
  selectedMoonId: string | null;
  onSelectMoon: (moonId: string | null) => void;
  selectedHotspotId?: string | null;
  onSelectHotspot?: (hotspot: PlanetaryHotspot) => void;
}

/**
 * Creates radial UV mapping for planetary rings
 */
function createRadialRingGeometry(innerRadius: number, outerRadius: number, segments: number = 128) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments, 8);
  const pos = geometry.attributes.position;
  const uvs = geometry.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const dist = Math.sqrt(x * x + y * y);
    const u = (dist - innerRadius) / (outerRadius - innerRadius);
    uvs.setXY(i, u, 0.5);
  }
  uvs.needsUpdate = true;
  return geometry;
}

/**
 * Convert latitude and longitude to 3D Cartesian coordinates on a sphere of radius R
 */
function latLonToVector3(latDeg: number, lonDeg: number, radius: number): THREE.Vector3 {
  const phi = (90 - latDeg) * (Math.PI / 180);
  const theta = (lonDeg + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

/**
 * AAA Rayleigh & Mie Atmospheric Scattering Shader Material for Neptune
 */
function createAtmosphericScatteringMaterial(sunPosition: THREE.Vector3) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunDirection: { value: sunPosition.clone().normalize() },
      uAtmosphereColor: { value: new THREE.Color('#38BDF8') }, // Radiant cyan limb
      uDeepColor: { value: new THREE.Color('#1E3A8A') },       // Deep cobalt base
      uPower: { value: 3.2 },
      uIntensity: { value: 1.35 },
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldNormal;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uSunDirection;
      uniform vec3 uAtmosphereColor;
      uniform vec3 uDeepColor;
      uniform float uPower;
      uniform float uIntensity;
      uniform float uTime;

      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldNormal;

      void main() {
        vec3 viewDir = normalize(vViewPosition);
        vec3 norm = normalize(vNormal);
        vec3 sunDir = normalize(uSunDirection);

        // Grazing limb angle
        float vDotN = dot(viewDir, norm);
        float fresnel = 1.0 - max(0.0, vDotN);
        float rim = pow(fresnel, uPower);

        // Day/night terminator illumination with soft twilight gradient
        float sunDot = dot(vWorldNormal, sunDir);
        float dayFactor = smoothstep(-0.25, 0.45, sunDot);

        // Subtle atmospheric breath oscillation
        float wave = 1.0 + 0.035 * sin(uTime * 1.4 + vWorldNormal.y * 3.5);

        // Rayleigh wavelength dispersion (cyan rim fading into deep cobalt)
        vec3 col = mix(uDeepColor, uAtmosphereColor, pow(fresnel, 1.35));

        // Subtle nightside airglow so planet maintains cinematic silhouette in starlight
        float nightGlow = 0.08 * pow(fresnel, 3.2);
        float alpha = clamp((rim * dayFactor * uIntensity * wave) + nightGlow, 0.0, 1.0);

        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.BackSide,
  });
}

/**
 * Dynamic Great Dark Spot Storm Formation (Anticyclonic Vortex at -22° S, 45° Lon)
 */
function DynamicGreatDarkSpot({ radius }: { radius: number }) {
  const vortexRef = useRef<THREE.Group>(null);
  const companionCloudsRef = useRef<THREE.Mesh>(null);

  // Position at latitude -22° S, longitude 45°
  const pos = useMemo(() => latLonToVector3(-22, 45, radius * 1.003), [radius]);
  const normal = useMemo(() => pos.clone().normalize(), [pos]);
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return q;
  }, [normal]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (vortexRef.current) {
      // Anticyclonic counter-clockwise vortex rotation
      vortexRef.current.rotation.z -= delta * 0.18;
      // Gentle storm pulsation
      const s = 1.0 + Math.sin(t * 1.2) * 0.04;
      vortexRef.current.scale.set(s, s * 0.65, 1.0);
    }
    if (companionCloudsRef.current) {
      companionCloudsRef.current.rotation.z -= delta * 0.12;
    }
  });

  return (
    <group position={pos} quaternion={quaternion}>
      {/* 1. Deep Anticyclonic Storm Vortex Hole */}
      <group ref={vortexRef}>
        <mesh>
          <ringGeometry args={[0.02, 0.28, 32]} />
          <meshBasicMaterial
            color="#081026"
            transparent
            opacity={0.88}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Storm Core Eye */}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.12, 24]} />
          <meshBasicMaterial color="#040817" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 2. White Methane Companion Cirrus Arcs skirting the Dark Spot */}
      <mesh ref={companionCloudsRef} position={[0, 0, 0.015]}>
        <ringGeometry args={[0.26, 0.34, 32, 1, Math.PI * 0.25, Math.PI * 0.9]} />
        <meshBasicMaterial
          color="#F0F9FF"
          transparent
          opacity={0.78}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/**
 * Interactive 3D Hotspot Beacon on the Planet's Surface
 */
function PlanetaryHotspotMarker({
  hotspot,
  planetRadius,
  isSelected,
  onSelect,
}: {
  hotspot: PlanetaryHotspot;
  planetRadius: number;
  isSelected: boolean;
  onSelect: (h: PlanetaryHotspot) => void;
}) {
  const markerGroupRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Position anchored slightly above planetary surface
  const pos = useMemo(() => {
    return latLonToVector3(hotspot.latDeg, hotspot.lonDeg, planetRadius * 1.026);
  }, [hotspot.latDeg, hotspot.lonDeg, planetRadius]);

  const normal = useMemo(() => pos.clone().normalize(), [pos]);
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return q;
  }, [normal]);

  const color = useMemo(() => {
    switch (hotspot.category) {
      case 'storm':
        return '#F59E0B'; // Amber storm
      case 'atmosphere':
        return '#38BDF8'; // Cyan atmospheric feature
      case 'moon':
        return '#A855F7'; // Violet moon beacon
      case 'ring':
        return '#EAB308'; // Gold ring feature
      case 'dynamo':
        return '#EC4899'; // Magenta thermal dynamo
      default:
        return '#00E5FF';
    }
  }, [hotspot.category]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (pulseRingRef.current) {
      // Pulsing concentric beacon animation
      const s = 1.0 + Math.sin(t * 3.8 + hotspot.latDeg) * 0.35;
      pulseRingRef.current.scale.set(s, s, 1.0);
    }
  });

  return (
    <group ref={markerGroupRef} position={pos} quaternion={quaternion}>
      {/* 1. Outer Pulsing Beacon Ring */}
      <mesh ref={pulseRingRef}>
        <ringGeometry args={[0.15, 0.22, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.95 : isHovered ? 0.85 : 0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Inner Glowing Core Sphere */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          discoveryAudio.playTelemetryChime(1150);
          onSelect(hotspot);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setIsHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[isSelected ? 0.12 : 0.085, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.9 : 1.1}
        />
      </mesh>

      {/* 3. Reticle Center Ring if selected */}
      {isSelected && (
        <mesh position={[0, 0, 0.02]}>
          <ringGeometry args={[0.26, 0.3, 32]} />
          <meshBasicMaterial color="#FFFFFF" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

/**
 * Ultra-Realistic AAA 3D Planetary Globe with Multi-layer Atmosphere, Clouds, Rings, and Hotspots
 */
function DetailedPlanetGlobe({
  profile,
  customTexture,
  hotspots,
  isAutoRotateActive,
  selectedHotspotId,
  onSelectHotspot,
  onPlanetDoubleClick,
}: {
  profile: PlanetDiscoveryProfile;
  customTexture?: THREE.Texture | null;
  hotspots?: PlanetaryHotspot[];
  isAutoRotateActive: boolean;
  selectedHotspotId?: string | null;
  onSelectHotspot?: (h: PlanetaryHotspot) => void;
  onPlanetDoubleClick: (point: THREE.Vector3) => void;
}) {
  const planetGroupRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const cirrusMeshRef = useRef<THREE.Mesh>(null);
  const earthCloudsMeshRef = useRef<THREE.Mesh>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh>(null);

  const texture = usePlanetaryTexture(profile.id);
  const earthCloudsTexture = useEarthCloudsTexture();
  const neptuneCirrusTexture = useNeptuneCirrusTexture();
  const saturnRingTexture = useSaturnRingTexture();

  const activeTexture = customTexture || texture;
  const activeHotspots = hotspots || profile.hotspots || [];

  // Planet Radius: Sized so that at camera distance 10.5, planet occupies ~72% of viewport
  const radius = 3.25;

  // Axial tilt in radians
  const axialTiltRad = (profile.astronomy.axialTiltDeg * Math.PI) / 180;

  // Saturn ring geometry
  const saturnRingGeometry = useMemo(() => {
    if (profile.id !== 'saturn') return null;
    return createRadialRingGeometry(radius * 1.35, radius * 2.65, 128);
  }, [profile.id, radius]);

  // Uranus ring geometry
  const uranusRingGeometry = useMemo(() => {
    if (profile.id !== 'uranus') return null;
    return createRadialRingGeometry(radius * 1.25, radius * 1.7, 64);
  }, [profile.id, radius]);

  // Neptune ring arcs
  const neptuneRingGeometry = useMemo(() => {
    if (profile.id !== 'neptune') return null;
    return createRadialRingGeometry(radius * 1.28, radius * 1.58, 96);
  }, [profile.id, radius]);

  // Atmospheric scattering shader material
  const sunLightPos = useMemo(() => new THREE.Vector3(18, 6, 14), []);
  const atmosphereShaderMaterial = useMemo(() => {
    return createAtmosphericScatteringMaterial(sunLightPos);
  }, [sunLightPos]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Update atmosphere shader time uniform
    if (atmosphereShaderMaterial.uniforms) {
      atmosphereShaderMaterial.uniforms.uTime.value = t;
    }

    if (!isAutoRotateActive) return;

    const dir = profile.astronomy.isRetrogradeRotation ? -1 : 1;

    // 1. Continuous realistic planetary rotation
    if (planetGroupRef.current) {
      planetGroupRef.current.rotation.y += delta * 0.08 * dir;
    }

    // 2. Neptune high-altitude methane cirrus differential rotation (drifts faster than mantle)
    if (cirrusMeshRef.current) {
      cirrusMeshRef.current.rotation.y += delta * 0.115 * dir;
    }

    // 3. Earth cloud drift
    if (earthCloudsMeshRef.current) {
      earthCloudsMeshRef.current.rotation.y += delta * 0.11;
    }
  });

  return (
    <group rotation={[0, 0, axialTiltRad]}>
      {/* Rotating Planet Group (Hotspots, storms and mantle rotate in unison) */}
      <group ref={planetGroupRef}>
        {/* 1. Planetary Sphere with High-Res Photographic Texture & PBR Shader */}
        <mesh
          ref={planetMeshRef}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onPlanetDoubleClick(e.point);
          }}
        >
          <sphereGeometry args={[radius, 128, 128]} />
          <meshStandardMaterial
            map={activeTexture || null}
            color={activeTexture ? '#FFFFFF' : profile.visuals.primaryColor}
            roughness={profile.id === 'earth' ? 0.6 : profile.id === 'neptune' ? 0.68 : 0.72}
            metalness={profile.id === 'neptune' ? 0.04 : 0.08}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* 2. Neptune High-Altitude Methane Cirrus Cloud Layer (Dynamic Differential Drift) */}
        {profile.id === 'neptune' && (
          <mesh ref={cirrusMeshRef}>
            <sphereGeometry args={[radius * 1.008, 96, 96]} />
            <meshStandardMaterial
              map={neptuneCirrusTexture}
              transparent
              opacity={0.65}
              roughness={0.4}
              metalness={0.05}
              depthWrite={false}
              blending={THREE.NormalBlending}
            />
          </mesh>
        )}

        {/* 3. Dynamic Great Dark Spot Storm Formation */}
        {profile.id === 'neptune' && <DynamicGreatDarkSpot radius={radius} />}

        {/* 4. Earth Clouds Layer */}
        {profile.id === 'earth' && (
          <mesh ref={earthCloudsMeshRef}>
            <sphereGeometry args={[radius * 1.02, 64, 64]} />
            <meshStandardMaterial
              map={earthCloudsTexture || null}
              transparent
              opacity={0.45}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* 5. Interactive 3D Planetary Hotspots */}
        {activeHotspots && activeHotspots.length > 0 && onSelectHotspot && (
          activeHotspots.map((hotspot) => (
            <PlanetaryHotspotMarker
              key={hotspot.id}
              hotspot={hotspot}
              planetRadius={radius}
              isSelected={selectedHotspotId === hotspot.id}
              onSelect={onSelectHotspot}
            />
          ))
        )}
      </group>

      {/* 6. Advanced Rayleigh & Mie Atmospheric Scattering Shell (Unreal-style Limb Scattering) */}
      {profile.atmosphere.hasAtmosphere && (
        <>
          {/* Main atmospheric limb scattering shell */}
          <mesh
            ref={atmosphereMeshRef}
            scale={[1.026, 1.026, 1.026]}
            material={atmosphereShaderMaterial}
          >
            <sphereGeometry args={[radius, 64, 64]} />
          </mesh>

          {/* Outer volumetric exosphere corona (Subtle luminous deep-space halo) */}
          <mesh scale={[1.09, 1.09, 1.09]}>
            <sphereGeometry args={[radius, 48, 48]} />
            <meshBasicMaterial
              color={profile.visuals.glowColor || '#1D4ED8'}
              transparent
              opacity={0.18}
              blending={THREE.AdditiveBlending}
              side={THREE.BackSide}
            />
          </mesh>
        </>
      )}

      {/* 7. Saturn Rings */}
      {profile.id === 'saturn' && saturnRingGeometry && (
        <mesh geometry={saturnRingGeometry} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            map={saturnRingTexture || null}
            color={saturnRingTexture ? '#FFFFFF' : '#EAB308'}
            transparent
            opacity={0.88}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* 8. Uranus Rings */}
      {profile.id === 'uranus' && uranusRingGeometry && (
        <mesh geometry={uranusRingGeometry} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial
            color="#6EE7B7"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* 9. Neptune Ring Arcs (Liberté, Égalité, Fraternité, Courage) */}
      {profile.id === 'neptune' && neptuneRingGeometry && (
        <mesh geometry={neptuneRingGeometry} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial
            color="#93C5FD"
            transparent
            opacity={0.32}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Major Moon Orbiting Body
 */
function OrbitingMoon({
  moon,
  isSelected,
  onSelect,
}: {
  moon: MajorMoon;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Scaled orbital radius for visual clarity
  const orbitRadius = 5.6 + (moon.orbitalDistanceKm / 160000);
  const moonRadius = Math.max(0.2, Math.min(0.52, moon.diameterKm / 9000));

  const angleRef = useRef<number>(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (groupRef.current) {
      angleRef.current += (delta * 0.35) / (moon.orbitalPeriodDays || 1);
      groupRef.current.position.x = Math.cos(angleRef.current) * orbitRadius;
      groupRef.current.position.z = Math.sin(angleRef.current) * orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <>
      {/* Moon Orbit Path Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 96]} />
        <meshBasicMaterial
          color={isSelected ? '#38BDF8' : '#334155'}
          transparent
          opacity={isSelected ? 0.65 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Moon Body */}
      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(moon.id);
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
          }}
        >
          <sphereGeometry args={[moonRadius, 24, 24]} />
          <meshStandardMaterial color={moon.color || '#CBD5E1'} roughness={0.8} />
        </mesh>

        {/* Selected Moon Indicator Ring */}
        {isSelected && (
          <mesh>
            <ringGeometry args={[moonRadius * 1.35, moonRadius * 1.55, 32]} />
            <meshBasicMaterial color="#38BDF8" side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
    </>
  );
}

/**
 * Camera Motion Manager for Smooth Cinematic Focus Transitions & Double-Click Zoom
 */
function CameraCinematicManager({
  targetCamPos,
  targetTargetPos,
  isTransitioning,
  controlsRef,
}: {
  targetCamPos: React.MutableRefObject<THREE.Vector3>;
  targetTargetPos: React.MutableRefObject<THREE.Vector3>;
  isTransitioning: React.MutableRefObject<boolean>;
  controlsRef: React.RefObject<OrbitControlsImpl>;
}) {
  useFrame((state, delta) => {
    if (isTransitioning.current) {
      state.camera.position.lerp(targetCamPos.current, delta * 3.5);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetTargetPos.current, delta * 3.5);
        controlsRef.current.update();
      }
      if (
        state.camera.position.distanceTo(targetCamPos.current) < 0.04 &&
        (!controlsRef.current || controlsRef.current.target.distanceTo(targetTargetPos.current) < 0.04)
      ) {
        isTransitioning.current = false;
      }
    }
  });

  return null;
}

export const PlanetExplorer3D: React.FC<PlanetExplorer3DProps> = ({
  profile,
  selectedMoonId,
  onSelectMoon,
  selectedHotspotId,
  onSelectHotspot,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isZoomedIn, setIsZoomedIn] = useState<boolean>(false);

  // NASA Solar System Treks integration
  const isNasaTrekBody = ['mars', 'moon', 'mercury'].includes(profile.id);
  const {
    layers: nasaLayers,
    activeLayer: activeNasaLayer,
    selectLayerById: selectNasaLayerById,
    nomenclature: nasaNomenclature,
    texture: nasaTexture,
    progress: nasaProgress,
  } = usePlanetaryData({
    initialBody: isNasaTrekBody ? (profile.id as any) : 'mars',
    autoLoadTexture: isNasaTrekBody,
  });

  // Combine profile hotspots with verified NASA nomenclature hotspots
  const allHotspots = useMemo(() => {
    const list: PlanetaryHotspot[] = [...(profile.hotspots || [])];
    if (isNasaTrekBody && nasaNomenclature.length > 0) {
      nasaNomenclature.forEach((nm) => {
        if (!list.some((h) => h.title.toLowerCase() === nm.title.toLowerCase())) {
          list.push({
            id: nm.id,
            title: nm.title,
            shortDesc: `${nm.featureCategory} • Lat ${nm.latitude.toFixed(2)}°, Lon ${nm.longitude.toFixed(2)}°`,
            explanation: nm.description,
            latDeg: nm.latitude,
            lonDeg: nm.longitude,
            category: nm.featureCategory.toLowerCase().includes('crater') ? 'geology' : 'storm',
            lauraSpeech: `${nm.title} is a verified geological feature on ${profile.name}. ${nm.description}`,
          });
        }
      });
    }
    return list;
  }, [profile.hotspots, isNasaTrekBody, nasaNomenclature, profile.name]);

  // Cinematic Camera Target Vectors
  const targetCamPos = useRef(new THREE.Vector3(0, 0, 10.5));
  const targetTargetPos = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef<boolean>(false);

  // Reset Camera to standard heroic framing
  const handleResetCamera = useCallback(() => {
    targetCamPos.current.set(0, 0, 10.5);
    targetTargetPos.current.set(0, 0, 0);
    isTransitioning.current = true;
    setIsZoomedIn(false);
    discoveryAudio.playTelemetryChime(950);
  }, []);

  // Double Click on Planet: Smoothly Zoom In
  const handlePlanetDoubleClick = useCallback((point: THREE.Vector3) => {
    if (isZoomedIn) {
      // Toggle back to master view
      handleResetCamera();
      return;
    }

    const dir = point.clone().normalize();
    targetCamPos.current.copy(dir.clone().multiplyScalar(5.2));
    targetTargetPos.current.copy(point.clone().multiplyScalar(0.3));
    isTransitioning.current = true;
    setIsZoomedIn(true);
    discoveryAudio.playTelemetryChime(1200);
  }, [handleResetCamera, isZoomedIn]);

  // Hotspot selection focus transition (Cinematic Surface Flyover)
  const handleSelectHotspotFocus = useCallback((hotspot: PlanetaryHotspot) => {
    const hPos = latLonToVector3(hotspot.latDeg, hotspot.lonDeg, 3.25);
    const dir = hPos.clone().normalize();
    targetCamPos.current.copy(dir.clone().multiplyScalar(5.2));
    targetTargetPos.current.copy(hPos.clone().multiplyScalar(0.38));
    isTransitioning.current = true;
    setIsZoomedIn(true);

    if (hotspot.lauraSpeech) {
      discoveryAudio.speak(hotspot.lauraSpeech);
    }

    if (onSelectHotspot) {
      onSelectHotspot(hotspot);
    }
  }, [onSelectHotspot]);

  // Toggle Fullscreen API
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  return (
    <div
      ref={containerRef}
      onDoubleClick={(e) => {
        // If double-clicking empty background space while zoomed in, reset camera
        if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'CANVAS') {
          if (isZoomedIn) {
            handleResetCamera();
          }
        }
      }}
      className="relative h-full w-full overflow-hidden bg-[#02050D] select-none"
    >
      {/* 1. Realtime 3D Three.js Viewport */}
      <WebGLErrorBoundary
        fallbackTitle="Planetary Surface Telemetry Active"
        fallbackDescription="Celestial coordinate mapping and geological hotspot data are online. Surface features, atmospheric composition, and NASA Trek elevation remain accessible."
      >
        <Canvas
          camera={{ position: [0, 0, 10.5], fov: 44, near: 0.1, far: 500 }}
          gl={{
            antialias: true,
            powerPreference: 'default',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
        >
          <color attach="background" args={['#02050D']} />

          {/* Physically Based Lighting System */}
          <ambientLight intensity={0.26} />
          {/* Distant Sol Key Light casting crisp planetary day/night terminator */}
          <directionalLight position={[18, 6, 14]} intensity={2.6} color="#FFFFFF" />
          {/* Secondary Cosmic Fill Starlight */}
          <pointLight position={[-16, -10, -14]} intensity={0.35} color="#38BDF8" />

          {/* Deep Cosmic Starfield Background */}
          <Stars radius={220} depth={70} count={6000} factor={3.8} saturation={0.5} fade />

          {/* Camera Cinematic Manager (Lerp transitions & double-click focus) */}
          <CameraCinematicManager
            targetCamPos={targetCamPos}
            targetTargetPos={targetTargetPos}
            isTransitioning={isTransitioning}
            controlsRef={controlsRef}
          />

          {/* Detailed Planetary Globe with Dynamic Clouds, Atmospheric Scattering & Hotspots */}
          <DetailedPlanetGlobe
            profile={profile}
            customTexture={isNasaTrekBody ? nasaTexture : null}
            hotspots={allHotspots}
            isAutoRotateActive={isAutoRotate}
            selectedHotspotId={selectedHotspotId}
            onSelectHotspot={handleSelectHotspotFocus}
            onPlanetDoubleClick={handlePlanetDoubleClick}
          />

          {/* Orbiting Major Moons */}
          {profile.satellites.majorMoons.map((moon) => (
            <OrbitingMoon
              key={moon.id}
              moon={moon}
              isSelected={selectedMoonId === moon.id}
              onSelect={onSelectMoon}
            />
          ))}

          {/* Orbit Controls (Mouse drag to rotate, wheel to zoom, touch gestures) */}
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            minDistance={4.5}
            maxDistance={28}
            dampingFactor={0.05}
            autoRotate={false}
          />
        </Canvas>
      </WebGLErrorBoundary>

      {/* Floating NASA Map Layer Selector for Mars, Moon, Mercury */}
      {isNasaTrekBody && nasaLayers.length > 0 && (
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-[#070C1B]/90 backdrop-blur-xl shadow-xl text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-bold tracking-wider">NASA LAYER:</span>
            <div className="flex items-center gap-1 overflow-x-auto">
              {nasaLayers.slice(0, 4).map((l) => {
                const isSelected = activeNasaLayer?.id === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => selectNasaLayerById(l.id)}
                    className={`px-2 py-0.5 rounded text-[11px] transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {l.title.replace('MGS ', '').replace('Global ', '').slice(0, 18)}
                  </button>
                );
              })}
            </div>
          </div>
          {nasaProgress.stage !== 'idle' && nasaProgress.stage !== 'ready' && (
            <div className="px-3 py-1 rounded-lg bg-slate-950/90 border border-cyan-500/20 text-[10px] font-mono text-cyan-300">
              {nasaProgress.message} ({nasaProgress.percent}%)
            </div>
          )}
        </div>
      )}

      {/* 2. Top-Right Viewport Controls Overlay */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Zoom Level Indicator / Quick Zoom Toggle */}
        <button
          type="button"
          onClick={() => {
            if (isZoomedIn) {
              handleResetCamera();
            } else {
              targetCamPos.current.set(0, 0, 5.2);
              targetTargetPos.current.set(0, 0, 0);
              isTransitioning.current = true;
              setIsZoomedIn(true);
            }
          }}
          title={isZoomedIn ? 'Zoom Out to Overview' : 'Zoom In on Atmosphere (or Double-Click Planet)'}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#070C1B]/80 px-3 py-1.5 font-mono text-xs text-[#94A3B8] hover:border-[#38BDF8]/40 hover:text-white transition-all backdrop-blur-xl shadow-lg"
        >
          <ZoomIn className="h-3.5 w-3.5 text-[#38BDF8]" />
          <span className="hidden sm:inline">{isZoomedIn ? 'Zoom: Close' : 'Zoom: Master'}</span>
        </button>

        {/* Auto-Rotation Toggle */}
        <button
          type="button"
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          title={isAutoRotate ? 'Pause Rotation' : 'Resume Axial Rotation'}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs transition-all backdrop-blur-xl shadow-lg ${
            isAutoRotate
              ? 'border-[#38BDF8]/40 bg-[#070C1B]/80 text-[#38BDF8]'
              : 'border-white/10 bg-[#070C1B]/80 text-[#94A3B8] hover:text-white'
          }`}
        >
          {isAutoRotate ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{isAutoRotate ? 'Rotation: ON' : 'Rotation: OFF'}</span>
        </button>

        {/* Reset Camera Button */}
        <button
          type="button"
          onClick={handleResetCamera}
          title="Reset Camera Framing"
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#070C1B]/80 px-3 py-1.5 font-mono text-xs text-[#94A3B8] hover:border-[#38BDF8]/40 hover:text-white transition-all backdrop-blur-xl shadow-lg"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset View</span>
        </button>

        {/* Fullscreen Exploration Mode Toggle */}
        <button
          type="button"
          onClick={handleToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Exploration Mode'}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#070C1B]/80 px-3 py-1.5 font-mono text-xs text-[#94A3B8] hover:border-[#38BDF8]/40 hover:text-white transition-all backdrop-blur-xl shadow-lg"
        >
          {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
        </button>
      </div>

      {/* 3. Bottom Hotspots Quick-Dock Selector */}
      {allHotspots && allHotspots.length > 0 && onSelectHotspot && (
        <div className="absolute bottom-5 left-4 right-4 z-20 flex flex-col items-center pointer-events-none">
          <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-[#070C1B]/90 p-2 backdrop-blur-2xl shadow-2xl pointer-events-auto max-w-full overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1 px-2 font-mono text-[10px] uppercase tracking-wider text-[#38BDF8] flex-shrink-0">
              <Crosshair className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Surface Landmarks:</span>
            </div>

            {allHotspots.map((hotspot) => {
              const isSelected = selectedHotspotId === hotspot.id;
              return (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => {
                    discoveryAudio.playTelemetryChime(1100);
                    handleSelectHotspotFocus(hotspot);
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#38BDF8] text-[#02050D] font-bold shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                      : 'bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  <MapPin className={`h-3 w-3 ${isSelected ? 'text-[#02050D]' : 'text-[#38BDF8]'}`} />
                  <span>{hotspot.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
