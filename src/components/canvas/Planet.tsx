import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialBodyDefinition } from '../../types';
import { AtmosphereRim } from './AtmosphereRim';
import { CelestialReticle } from './CelestialReticle';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { setCelestialPosition } from '../../utils/celestialRegistry';
import {
  getPlanetarySurfaceTexture,
  getEarthCloudsTexture,
  getEarthNightLightsTexture,
  getSaturnRingAlphaTexture,
} from '../../utils/planetaryTextures';

interface PlanetProps {
  data: CelestialBodyDefinition;
  speedScale?: number;
  initialAngleOffset?: number;
}

/**
 * Creates radial UV mapping for Saturn's rings
 * Maps radial distance (inner to outer) to horizontal U coordinate of the 2K ring texture
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
 * Ultra-Realistic 3D Planetary Body (Phase 6C)
 * 
 * Capabilities:
 * - Genuine 2K photographic NASA & Solar System Scope planetary equirectangular maps
 * - Dynamic Earth realism: photographic Blue Marble day map, city night lights on unlit hemisphere,
 *   independent rotating cloud layer, and Rayleigh atmospheric scattering rim
 * - Mars realism: USGS/Viking true-color albedo map, matte silicate roughness, craters, polar caps
 * - Jupiter realism: Cassini/Juno belt zones and Great Red Spot
 * - Saturn realism: High-detail equatorial atmosphere + 2K radial ring alpha with Cassini Division
 * - Real-time shadows: planet shadow on rings, ring shadow on planet equator
 * - Precise physical inclinations, smooth orbital revolution, and non-obtrusive mission-control reticles
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

  const { selectedPlanetId, hoveredPlanetId, selectPlanet, setHoveredPlanet } = useSolarSystem();

  const isSelected = selectedPlanetId === data.id;
  const isHovered = hoveredPlanetId === data.id;

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

  // Retrieve cached 2K photographic texture with procedural fallback
  const surfaceTexture = useMemo(() => getPlanetarySurfaceTexture(id), [id]);
  const earthCloudsTexture = useMemo(() => (id === 'earth' ? getEarthCloudsTexture() : null), [id]);
  const earthNightTexture = useMemo(() => (id === 'earth' ? getEarthNightLightsTexture() : null), [id]);
  const saturnRingTexture = useMemo(() => (id === 'saturn' ? getSaturnRingAlphaTexture() : null), [id]);

  // Saturn radial ring geometry with calibrated UV coordinates
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
          // Sol is at system origin [0, 0, 0]
          vec3 dirToSun = normalize(-vWorldPosition);
          float sunDot = dot(vWorldNormal, dirToSun);
          
          // Twilight smoothstep: night lights emerge as dusk settles
          float nightFactor = smoothstep(0.06, -0.22, sunDot);
          
          vec4 nightSample = texture2D(uNightTexture, vUv);
          vec3 lightRgb = nightSample.rgb * vec3(1.15, 1.05, 0.88);
          float alpha = dot(nightSample.rgb, vec3(0.299, 0.587, 0.114)) * nightFactor * 0.95;
          
          gl_FragColor = vec4(lightRgb, alpha);
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

  // Calibrate material roughness per planetary type
  const materialRoughness = useMemo(() => {
    switch (id) {
      case 'earth':
        return 0.55; // Oceans reflect specular sunlight
      case 'mars':
        return 0.88; // Matte silicate dust and rock
      case 'mercury':
        return 0.92; // Cratered regolith
      case 'venus':
        return 0.82; // Dense sulfuric clouds
      case 'jupiter':
        return 0.72; // Gaseous atmosphere
      case 'saturn':
        return 0.75;
      case 'uranus':
      case 'neptune':
        return 0.65; // Methane haze
      default:
        return 0.8;
    }
  }, [id]);

  const axialTiltRad = THREE.MathUtils.degToRad(axialTiltDeg);

  useFrame((_, delta) => {
    // 1. Planetary Orbital Revolution
    if (orbitGroupRef.current && visualOrbitRadius > 0) {
      angleRef.current += delta * orbitSpeedMultiplier * speedScale;
      const x = Math.cos(angleRef.current) * visualOrbitRadius;
      const z = Math.sin(angleRef.current) * visualOrbitRadius;
      orbitGroupRef.current.position.set(x, 0, z);

      orbitGroupRef.current.getWorldPosition(worldPosVec);
      setCelestialPosition(id, worldPosVec);
    }

    // 2. Planetary Axial Spin
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

  const handleMeshClick = (e: any) => {
    e.stopPropagation();
    selectPlanet(isSelected ? null : id);
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
            metalness={0.04}
            emissive={isSelected ? primaryColor : isHovered ? '#38BDF8' : '#000000'}
            emissiveIntensity={isSelected ? 0.12 : isHovered ? 0.05 : 0}
          />
        </mesh>

        {/* 2. Earth: City Night Lights on Dark Hemisphere */}
        {id === 'earth' && earthNightShaderMaterial && (
          <mesh scale={[1.002, 1.002, 1.002]}>
            <sphereGeometry args={[visualRadius, 48, 48]} />
            <primitive object={earthNightShaderMaterial} attach="material" />
          </mesh>
        )}

        {/* 3. Earth: Independent Dynamic Cloud Layer */}
        {id === 'earth' && earthCloudsTexture && (
          <mesh ref={cloudsMeshRef} scale={[1.016, 1.016, 1.016]}>
            <sphereGeometry args={[visualRadius, 48, 48]} />
            <meshStandardMaterial
              map={earthCloudsTexture}
              transparent={true}
              opacity={0.85}
              blending={THREE.NormalBlending}
              depthWrite={false}
              roughness={0.9}
            />
          </mesh>
        )}

        {/* 4. Earth: Rayleigh Atmospheric Scattering Rim */}
        {id === 'earth' && (
          <AtmosphereRim radius={visualRadius} color="#38BDF8" intensity={1.15} falloff={2.6} />
        )}

        {/* 5. Venus: Dense Sulfuric Atmosphere Rim */}
        {id === 'venus' && (
          <AtmosphereRim radius={visualRadius} color="#FDE68A" intensity={0.92} falloff={2.9} />
        )}

        {/* 6. Uranus: Aquamarine Methane Atmospheric Rim */}
        {id === 'uranus' && (
          <AtmosphereRim radius={visualRadius} color="#5EEAD4" intensity={1.08} falloff={2.5} />
        )}

        {/* 7. Neptune: Royal Azure Methane Atmospheric Rim */}
        {id === 'neptune' && (
          <AtmosphereRim radius={visualRadius} color="#3B82F6" intensity={1.22} falloff={2.4} />
        )}

        {/* 8. Saturn: 2K Radial Ring Alpha System with Cassini Division */}
        {hasRings && id === 'saturn' && saturnRingGeometry && (
          <mesh
            ref={ringsMeshRef}
            geometry={saturnRingGeometry}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              map={saturnRingTexture || undefined}
              side={THREE.DoubleSide}
              transparent={true}
              opacity={0.94}
              roughness={0.65}
              metalness={0.05}
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
              opacity={0.32}
              roughness={0.9}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};
