import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { SpacecraftAssembly3D } from './SpacecraftAssembly3D';
import { ShipyardEnvironment3D } from './ShipyardEnvironment3D';
import { WebGLErrorBoundary } from '../../../components/common/WebGLErrorBoundary';
import {
  AssembledComponent,
  LiveryOption,
  MaterialFinish,
  TransformMode,
  QualityPreset,
  ShadingMode,
  CameraProjection,
  CameraViewAngle,
  LightingEnvironmentMode,
} from '../types';

interface BuildCanvas3DProps {
  components: AssembledComponent[];
  isSimulating: boolean;
  livery: LiveryOption;
  materialFinish: MaterialFinish;
  selectedComponentId: string | null;
  onSelectComponent: (instanceId: string | null) => void;
  transformMode: TransformMode;
  onTransformChange: (
    instanceId: string,
    position: [number, number, number],
    rotation: [number, number, number],
    scale: [number, number, number]
  ) => void;
  qualityPreset: QualityPreset;
  shadingMode: ShadingMode;
  cameraProjection: CameraProjection;
  focusTrigger: number;
  cameraViewAngle?: CameraViewAngle;
  lightingEnvironmentMode?: LightingEnvironmentMode;
  explodedFactor?: number;
  showCenterOfMass?: boolean;
  showCenterOfThrust?: boolean;
  showMeasurementCalipers?: boolean;
  onRegisterSpacecraftGroup?: (group: THREE.Group | null) => void;
}

/**
 * Controller to handle camera focus, projection switch, preset viewing angles, and orbit target
 */
const ViewportCameraController: React.FC<{
  controlsRef: React.RefObject<OrbitControlsImpl>;
  selectedComponent: AssembledComponent | null;
  focusTrigger: number;
  cameraViewAngle: CameraViewAngle;
}> = ({ controlsRef, selectedComponent, focusTrigger, cameraViewAngle }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (!controlsRef.current) return;
    if (selectedComponent && focusTrigger > 0) {
      const [tx, ty, tz] = selectedComponent.position;
      controlsRef.current.target.set(tx, ty, tz);
      camera.position.set(tx + 6, ty + 4, tz + 8);
      controlsRef.current.update();
    }
  }, [focusTrigger, selectedComponent, camera, controlsRef]);

  // Handle Preset Camera Angles with Precision Alignment
  useEffect(() => {
    if (!controlsRef.current) return;
    controlsRef.current.target.set(0, 0, 0);

    switch (cameraViewAngle) {
      case 'front':
        camera.position.set(0, 0, 16);
        break;
      case 'back':
        camera.position.set(0, 0, -16);
        break;
      case 'top':
        camera.position.set(0, 18, 0.001);
        break;
      case 'side':
        camera.position.set(18, 0, 0);
        break;
      case 'isometric':
        camera.position.set(12, 9, 12);
        break;
      case 'free':
      default:
        break;
    }
    controlsRef.current.update();
  }, [cameraViewAngle, camera, controlsRef]);

  return null;
};

export const BuildCanvas3D: React.FC<BuildCanvas3DProps> = ({
  components,
  isSimulating,
  livery,
  materialFinish,
  selectedComponentId,
  onSelectComponent,
  transformMode,
  onTransformChange,
  qualityPreset,
  shadingMode,
  cameraProjection,
  focusTrigger,
  cameraViewAngle = 'free',
  lightingEnvironmentMode = 'cleanroom',
  explodedFactor = 0,
  showCenterOfMass = false,
  showCenterOfThrust = false,
  showMeasurementCalipers = false,
  onRegisterSpacecraftGroup,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const selectedComp = components.find((c) => c.instanceId === selectedComponentId) || null;

  const isUltra = qualityPreset === 'ultra';
  const isHighOrUltra = qualityPreset === 'high' || isUltra;
  const isPerformance = qualityPreset === 'performance';

  const isCleanroom = lightingEnvironmentMode === 'cleanroom';
  const isOrbit = lightingEnvironmentMode === 'orbit';
  const isEclipse = lightingEnvironmentMode === 'eclipse';

  const shadowMapSize = isUltra ? 4096 : isHighOrUltra ? 2048 : 1024;

  const handlePointerMissed = () => {
    onSelectComponent(null);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#030611] select-none">
      <WebGLErrorBoundary
        fallbackTitle="Spacecraft Assembly Schematic"
        fallbackDescription="Vehicle structural engineering matrix and mass balance calculations are active. You can inspect components, adjust thrust properties, and manage blueprints."
      >
        <Canvas
          shadows={!isPerformance}
          orthographic={cameraProjection === 'orthographic'}
          camera={
            cameraProjection === 'orthographic'
              ? { position: [10, 6, 12], zoom: 45, near: -100, far: 200 }
              : { position: [8.5, 4.5, 9.5], fov: 40, near: 0.1, far: 250 }
          }
          dpr={isPerformance ? 1 : isUltra ? [1, 2] : [1, 1.5]}
          gl={{
            antialias: !isPerformance,
            powerPreference: 'default',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: isUltra ? 1.25 : 1.15,
          }}
          onPointerMissed={handlePointerMissed}
        >
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableDamping={true}
            dampingFactor={0.06}
            minDistance={2.5}
            maxDistance={45}
          />

          <ViewportCameraController
            controlsRef={controlsRef}
            selectedComponent={selectedComp}
            focusTrigger={focusTrigger}
            cameraViewAngle={cameraViewAngle}
          />

          {/* Photometric Lighting Suite - Configured by Lighting Environment */}
          {isCleanroom && (
            <>
              <ambientLight color="#F8FAFC" intensity={2.0} />
              {!isPerformance && (
                <directionalLight
                  position={[12, 22, 14]}
                  intensity={isUltra ? 3.6 : 3.0}
                  color="#FFFFFF"
                  castShadow
                  shadow-mapSize-width={shadowMapSize}
                  shadow-mapSize-height={shadowMapSize}
                  shadow-bias={-0.0001}
                />
              )}
              <pointLight position={[-14, 12, -12]} intensity={1.6} color="#00E5FF" distance={40} />
              <pointLight position={[0, -2, 0]} intensity={1.2} color="#F27D26" distance={16} />
              <pointLight position={[0, 14, 0]} intensity={2.4} color="#FFFFFF" distance={30} />
            </>
          )}

          {isOrbit && (
            <>
              <ambientLight color="#0F172A" intensity={1.0} />
              {!isPerformance && (
                <directionalLight
                  position={[24, 18, 12]}
                  intensity={4.2}
                  color="#FFFBEB"
                  castShadow
                  shadow-mapSize-width={shadowMapSize}
                  shadow-mapSize-height={shadowMapSize}
                  shadow-bias={-0.0001}
                />
              )}
              <pointLight position={[0, -8, 0]} intensity={2.2} color="#0284C7" distance={35} />
              <pointLight position={[-16, 6, -16]} intensity={0.9} color="#38BDF8" distance={45} />
            </>
          )}

          {isEclipse && (
            <>
              <ambientLight color="#030712" intensity={0.5} />
              {!isPerformance && (
                <directionalLight
                  position={[-18, 14, -22]}
                  intensity={1.4}
                  color="#38BDF8"
                  castShadow
                  shadow-mapSize-width={shadowMapSize}
                  shadow-mapSize-height={shadowMapSize}
                  shadow-bias={-0.0001}
                />
              )}
              <pointLight position={[14, -4, 16]} intensity={2.0} color="#F27D26" distance={30} />
              <pointLight position={[0, 12, 0]} intensity={1.2} color="#00E5FF" distance={25} />
            </>
          )}

          {/* AAA Shipyard Orbital Hangar Environment */}
          <ShipyardEnvironment3D quality={qualityPreset} />

          {/* Spacecraft Assembly Mesh */}
          <SpacecraftAssembly3D
            components={components}
            isSimulating={isSimulating}
            livery={livery}
            materialFinish={materialFinish}
            selectedComponentId={selectedComponentId}
            onSelectComponent={onSelectComponent}
            transformMode={transformMode}
            onTransformChange={onTransformChange}
            shadingMode={shadingMode}
            onRegisterRootGroup={onRegisterSpacecraftGroup}
            explodedFactor={explodedFactor}
            showCenterOfMass={showCenterOfMass}
            showCenterOfThrust={showCenterOfThrust}
            showMeasurementCalipers={showMeasurementCalipers}
          />

          {/* 3D Orientation Gizmo in Top-Right Corner */}
          <GizmoHelper
            alignment="top-right"
            margin={[70, 70]}
          >
            <GizmoViewport
              axisColors={['#EF4444', '#10B981', '#38BDF8']}
              labelColor="#FFFFFF"
            />
          </GizmoHelper>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
};
