import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { NasaTrekNomenclature, NasaTrekBookmark } from '../../../services/nasa/types';
import { planetaryDataEngine } from '../../../services/planetary-data/planetaryDataEngine';

interface PlanetarySphere3DProps {
  texture: THREE.CanvasTexture | null;
  bodyName: string;
  landmarks: NasaTrekNomenclature[];
  bookmarks: NasaTrekBookmark[];
  selectedLandmarkId: string | null;
  onSelectLandmark: (item: NasaTrekNomenclature | NasaTrekBookmark) => void;
  isRotating?: boolean;
}

interface SphereMeshProps {
  texture: THREE.CanvasTexture | null;
  landmarks: NasaTrekNomenclature[];
  bookmarks: NasaTrekBookmark[];
  selectedLandmarkId: string | null;
  onSelectLandmark: (item: NasaTrekNomenclature | NasaTrekBookmark) => void;
  isRotating?: boolean;
}

const SphereMesh: React.FC<SphereMeshProps> = ({
  texture,
  landmarks,
  bookmarks,
  selectedLandmarkId,
  onSelectLandmark,
  isRotating = true,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const planetRadius = 2.4;

  useFrame((_, delta) => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += delta * 0.08;
    }
  });

  // Calculate 3D marker positions for landmarks
  const landmarkMarkers = useMemo(() => {
    return landmarks.map((lm) => {
      const pos = planetaryDataEngine.latLonToVector3(lm.latitude, lm.longitude, planetRadius + 0.04);
      return { item: lm, pos, isBookmark: false };
    });
  }, [landmarks, planetRadius]);

  // Calculate 3D marker positions for bookmarks
  const bookmarkMarkers = useMemo(() => {
    return bookmarks.map((bm) => {
      const pos = planetaryDataEngine.latLonToVector3(bm.latitude, bm.longitude, planetRadius + 0.05);
      return { item: bm, pos, isBookmark: true };
    });
  }, [bookmarks, planetRadius]);

  return (
    <group ref={meshRef}>
      {/* Planetary Surface Sphere */}
      <mesh receiveShadow castShadow>
        <sphereGeometry args={[planetRadius, 64, 64]} />
        <meshStandardMaterial
          map={texture || undefined}
          color={texture ? '#FFFFFF' : '#C2410C'}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Atmospheric Glow Rim */}
      <mesh>
        <sphereGeometry args={[planetRadius * 1.015, 64, 64]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Nomenclature Landmark Hotspots */}
      {landmarkMarkers.map(({ item, pos }) => {
        const isSelected = selectedLandmarkId === item.id;
        return (
          <group
            key={item.id}
            position={pos}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLandmark(item);
            }}
          >
            {/* Pulsing ring */}
            <mesh>
              <sphereGeometry args={[isSelected ? 0.07 : 0.04, 16, 16]} />
              <meshBasicMaterial color={isSelected ? '#00F0FF' : '#F59E0B'} />
            </mesh>
            <mesh>
              <ringGeometry args={[0.06, 0.09, 24]} />
              <meshBasicMaterial
                color={isSelected ? '#00F0FF' : '#F59E0B'}
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}

      {/* Rover Landing Site Bookmarks */}
      {bookmarkMarkers.map(({ item, pos }) => {
        const isSelected = selectedLandmarkId === item.id;
        return (
          <group
            key={item.id}
            position={pos}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLandmark(item);
            }}
          >
            <mesh>
              <boxGeometry args={[0.08, 0.08, 0.08]} />
              <meshBasicMaterial color={isSelected ? '#00F0FF' : '#10B981'} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export const PlanetarySphere3D: React.FC<PlanetarySphere3DProps> = ({
  texture,
  bodyName,
  landmarks,
  bookmarks,
  selectedLandmarkId,
  onSelectLandmark,
  isRotating = true,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <div className="relative w-full h-full bg-[#02050D] rounded-xl overflow-hidden border border-cyan-500/20">
      <Canvas
        camera={{ position: [0, 1.2, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        {/* Luminous Sun point light creating natural day/night terminator */}
        <directionalLight position={[6, 3, 5]} intensity={1.8} />
        <pointLight position={[-6, -3, -5]} intensity={0.15} color="#38BDF8" />

        <Stars radius={100} depth={50} count={3000} factor={3} saturation={0.5} fade speed={0.5} />

        <SphereMesh
          texture={texture}
          landmarks={landmarks}
          bookmarks={bookmarks}
          selectedLandmarkId={selectedLandmarkId}
          onSelectLandmark={onSelectLandmark}
          isRotating={isRotating}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={3.0}
          maxDistance={8.5}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Overlay controls watermark */}
      <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/20 text-xs text-slate-300 pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>3D {bodyName.toUpperCase()} — DRAG TO ROTATE • SCROLL TO ZOOM</span>
      </div>
    </div>
  );
};
