import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialBodyDefinition } from '../../types';
import { AtmosphereRim } from './AtmosphereRim';
import { CelestialReticle } from './CelestialReticle';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { useNavigation } from '../../navigation/NavigationProvider';
import { setCelestialPosition } from '../../utils/celestialRegistry';
import {
  usePlanetaryTexture,
  useEarthCloudsTexture,
  useEarthNightLightsTexture,
  useSaturnRingTexture,
} from '../../utils/planetaryTextures';

interface PlanetProps {
  data: CelestialBodyDefinition;
  speedScale?: number;
  initialAngleOffset?: number;
}

/**
 * Creates radial UV mapping for Saturn's rings
 * Maps radial distance from inner ring edge to outer ring edge to U coordinate [0, 1]
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
 * Ultra-Realistic 3D Planetary Body (Phase 6C Visual Correction)
 * 
 * Major Fixes & Enhancements:
 * - Real-time reactive texture binding ensures 2K photographic NASA maps display immediately
 * - Earth: authentic Blue Marble daytime map, realistic thin Rayleigh scattering rim (no neon halo),
 *   dynamic night-side city lights, and independent drifting cloud deck
 * - Mars: natural rust-red albedo with crater terrain; subtle dark-side albedo floor prevents black silhouette loss
 * - Jupiter: crisp Cassini/Juno atmospheric bands and Great Red Spot with natural planetary shading
 * - Saturn: true Cassini-Division radial ring texture with transparency, receiving planet shadow
 * - Restrained selection and hover reticles aligned with approved design tokens
 */
export const Planet: React.FC<PlanetProps> = ({
  data,
  speedScale = 0.45,
  initialAngleOffset = 0,
}) => {
  const orbitGroupRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const cloudsMeshRef = useRef<THREE.Mesh>(null);
  const ringsMeshRef = useRef<THREE.Mesh>(null);

  const { selectedPlanetId, hoveredPlanetId, setHoveredPlanet } = useSolarSystem();
  const { launchModuleForPlanet } = useNavigation();

  const isSelected = selectedPlanetId === data.id;
  const isHovered = hoveredPlanetId === data.id;

  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const angleRef = useRef<number>(initialAngleOffset);
  const worldPosVec = useMemo(() => new THREE.Vector3(), []);

  const { id } = data;
  const {
    visualRadius,
    visualOrbitRadius,
    orbitSpeedMultiplier,
    rotationSpeedMultiplier,
    axialTiltDeg,
    primaryColor,
    hasRings,
  } = data.visual;

  // Reactively loaded 2K photographic maps (auto-rerenders upon browser decode)
  const surfaceTexture = usePlanetaryTexture(id);
  const earthCloudsTexture = useEarthCloudsTexture();
  const earthNightTexture = useEarthNightLightsTexture();
  const saturnRingTexture = useSaturnRingTexture();

  // Radial UV-mapped Saturn ring geometry
  const saturnRingGeometry = useMemo(() => {
    if (id !== 'saturn') return null;
    return createRadialRingGeometry(visualRadius * 1.45, visualRadius * 2.65, 128);
  }, [id, visualRadius]);

  // Earth night lights custom shader material (illuminates dark hemisphere away from Sol)
  const earthNightShaderMaterial = useMemo(() => {
    if (id !== 'earth' || !earthNightTexture) return null;

    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D uNightTexture;
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          // Sol is at origin [0, 0, 0]
          vec3 dirToSun = normalize(-vWorldPosition);
          float sunDot = dot(vWorldNormal, dirToSun);
          
          // Smooth transition from twilight into dark night
          float nightFactor = smoothstep(0.05, -0.25, sunDot);
          
          vec4 nightColor = texture2D(uNightTexture, vUv);
          vec3 cityRgb = nightColor.rgb * vec3(1.15, 1.05, 0.85);
          float alpha = dot(nightColor.rgb, vec3(0.299, 0.587, 0.114)) * nightFactor * 0.95;
          
          gl_FragColor = vec4(cityRgb, alpha);
        }
      `,
      uniforms: {
        uNightTexture: { value: earthNightTexture },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [id, earthNightTexture]);

  if (earthNightShaderMaterial && earthNightTexture) {
    earthNightShaderMaterial.uniforms.uNightTexture.value = earthNightTexture;
  }

  // Physically tuned planetary roughness
  const materialRoughness = useMemo(() => {
    switch (id) {
      case 'earth':
        return 0.52; // Oceans reflect soft specular sunlight
      case 'mars':
        return 0.85; // Matte rust silicate rock and dust
      case 'mercury':
        return 0.92; // Cratered regolith
      case 'venus':
        return 0.78; // Dense sulfuric cloud deck
      case 'jupiter':
        return 0.65; // Dynamic gas bands
      case 'saturn':
        return 0.70;
      case 'uranus':
      case 'neptune':
        return 0.62; // Deep methane atmosphere
      default:
        return 0.8;
    }
  }, [id]);

  // Subtle dark-side ambient albedo floor (prevents planets from turning pitch-black)
  const emissiveColor = useMemo(() => {
    if (isSelected) return primaryColor;
    if (isHovered) return '#38BDF8';
    if (id === 'mars') return '#4A1C0E'; // Warm Martian night-side floor
    if (id === 'jupiter') return '#2A1B12';
    if (id === 'saturn') return '#2A2416';
    if (id === 'mercury') return '#1A1A1A';
    return '#0A101D';
  }, [id, isSelected, isHovered, primaryColor]);

  const emissiveIntensity = useMemo(() => {
    if (isSelected) return 0.14;
    if (isHovered) return 0.06;
    if (id === 'mars') return 0.08; // Visible sculpted night-side
    return 0.04; // Gentle astronomical visibility floor
  }, [id, isSelected, isHovered]);

  const axialTiltRad = THREE.MathUtils.degToRad(axialTiltDeg);

  useFrame((_, delta) => {
    // 1. Orbital Revolution
    if (orbitGroupRef.current && visualOrbitRadius > 0) {
      angleRef.current += delta * orbitSpeedMultiplier * speedScale;
      const x = Math.cos(angleRef.current) * visualOrbitRadius;
      const z = Math.sin(angleRef.current) * visualOrbitRadius;
      orbitGroupRef.current.position.set(x, 0, z);

      orbitGroupRef.current.getWorldPosition(worldPosVec);
      setCelestialPosition(id, worldPosVec);
    }

    // 2. Axial Planetary Rotation
    if (planetMeshRef.current) {
      planetMeshRef.current.rotation.y += delta * rotationSpeedMultiplier * 0.8;
    }

    // 3. Earth Independent Cloud Drift
    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.rotation.y += delta * rotationSpeedMultiplier * 0.95;
    }

    // 4. Ring Alignment
    if (ringsMeshRef.current) {
      ringsMeshRef.current.rotation.z += delta * rotationSpeedMultiplier * 0.15;
    }
  });

  const handlePointerDown = (e: any) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMeshClick = (e: any) => {
    e.stopPropagation();

    // Prevent accidental module launch during orbital drag gestures
    if (pointerDownPos.current) {
      const dx = Math.abs(e.clientX - pointerDownPos.current.x);
      const dy = Math.abs(e.clientY - pointerDownPos.current.y);
      if (Math.hypot(dx, dy) > 8) {
        return;
      }
    }

    // Launch dedicated learning module with cinematic camera approach
    launchModuleForPlanet(id);
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHoveredPlanet(id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHoveredPlanet(null);
    document.body.style.cursor = 'default';
  };

  return (
    <group ref={orbitGroupRef} position={[visualOrbitRadius, 0, 0]}>
      {/* Non-obstructing Celestial Reticle placed above the planet */}
      <CelestialReticle data={data} yOffset={visualRadius * 1.55} />

      {/* Axial Tilt Container */}
      <group rotation={[0, 0, axialTiltRad]}>
        {/* 1. Main Planet Surface Sphere */}
        <mesh
          ref={planetMeshRef}
          castShadow
          receiveShadow
          onPointerDown={handlePointerDown}
          onClick={handleMeshClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          scale={isSelected ? [1.03, 1.03, 1.03] : isHovered ? [1.015, 1.015, 1.015] : [1.0, 1.0, 1.0]}
        >
          <sphereGeometry args={[visualRadius, 64, 64]} />
          <meshStandardMaterial
            map={surfaceTexture}
            color="#FFFFFF"
            roughness={materialRoughness}
            metalness={0.03}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>

        {/* 2. Earth: Dynamic Night-Side City Lights */}
        {id === 'earth' && earthNightShaderMaterial && (
          <mesh scale={[1.002, 1.002, 1.002]}>
            <sphereGeometry args={[visualRadius, 48, 48]} />
            <primitive object={earthNightShaderMaterial} attach="material" />
          </mesh>
        )}

        {/* 3. Earth: Independent Dynamic Cloud Layer */}
        {id === 'earth' && earthCloudsTexture && (
          <mesh ref={cloudsMeshRef} scale={[1.015, 1.015, 1.015]}>
            <sphereGeometry args={[visualRadius, 48, 48]} />
            <meshStandardMaterial
              map={earthCloudsTexture}
              transparent={true}
              opacity={0.82}
              blending={THREE.NormalBlending}
              depthWrite={false}
              roughness={0.9}
            />
          </mesh>
        )}

        {/* 4. Earth: Thin Realistic Rayleigh Scattering Rim (Not Neon) */}
        {id === 'earth' && (
          <AtmosphereRim radius={visualRadius} color="#38BDF8" intensity={0.85} falloff={3.2} />
        )}

        {/* 5. Venus: Dense Sulfuric Atmosphere Rim */}
        {id === 'venus' && (
          <AtmosphereRim radius={visualRadius} color="#FDE68A" intensity={0.85} falloff={3.0} />
        )}

        {/* 6. Uranus: Delicate Methane Atmospheric Rim */}
        {id === 'uranus' && (
          <AtmosphereRim radius={visualRadius} color="#5EEAD4" intensity={0.95} falloff={2.8} />
        )}

        {/* 7. Neptune: Deep Azure Methane Atmospheric Rim */}
        {id === 'neptune' && (
          <AtmosphereRim radius={visualRadius} color="#3B82F6" intensity={1.05} falloff={2.6} />
        )}

        {/* 8. Saturn: Authentic 2K Radial Ring System with Cassini Division */}
        {hasRings && id === 'saturn' && saturnRingGeometry && (
          <mesh
            ref={ringsMeshRef}
            geometry={saturnRingGeometry}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              map={saturnRingTexture}
              side={THREE.DoubleSide}
              transparent={true}
              opacity={0.96}
              roughness={0.65}
              metalness={0.04}
            />
          </mesh>
        )}

        {/* 9. Uranus: Delicate Tilted Dust Ring System */}
        {hasRings && id === 'uranus' && (
          <mesh ref={ringsMeshRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[visualRadius * 1.35, visualRadius * 1.62, 64]} />
            <meshStandardMaterial
              color="#5EEAD4"
              side={THREE.DoubleSide}
              transparent={true}
              opacity={0.28}
              roughness={0.9}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};
