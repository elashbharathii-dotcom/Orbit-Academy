import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { getCelestialPosition } from '../../utils/celestialRegistry';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface CameraControllerProps {
  controlsRef: React.RefObject<OrbitControlsImpl>;
}

const OVERVIEW_CAMERA_POS = new THREE.Vector3(0, 48, 92);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, 0);

/**
 * Cinematic Bezier Flight & Orbital Tracking Controller (Phase 6C)
 * 
 * Features:
 * - Bespoke planetary framing accommodating planetary radii and Saturn's ring system
 * - Curved quadratic Bezier orbital fly-path preventing celestial collisions
 * - Smooth quintic easing curve delivering cinematic acceleration and soft deceleration
 * - Dynamic planet tracking in focus mode with drift-free orbital delta compensation
 * - Adaptive OrbitControls distance clamps tailored to individual planet geometry
 */
export const CameraController: React.FC<CameraControllerProps> = ({ controlsRef }) => {
  const { camera, size } = useThree();
  const { selectedPlanetId } = useSolarSystem();

  // Animation transition state
  const isTransitioningRef = useRef<boolean>(false);
  const transitionProgressRef = useRef<number>(1.0); // 1 = settled, < 1 = in flight
  const transitionDurationRef = useRef<number>(1.4); // seconds

  const startCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const startTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const midCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3());

  const lastTargetPosRef = useRef<THREE.Vector3>(new THREE.Vector3());

  // Trigger transition when selected planet changes
  useEffect(() => {
    if (!controlsRef.current) return;

    // Snapshot starting positions
    startCamPosRef.current.copy(camera.position);
    startTargetRef.current.copy(controlsRef.current.target);

    // Compute aspect ratio scaling for mobile portrait vs desktop widescreen
    const aspect = size.width / Math.max(1, size.height);
    const portraitMultiplier = aspect < 1.0 ? Math.min(2.4, 0.92 / aspect) : 1.0;

    // Determine destination target & camera offset
    const destTarget = selectedPlanetId
      ? getCelestialPosition(selectedPlanetId)
      : OVERVIEW_TARGET;

    const planetDef = selectedPlanetId
      ? CELESTIAL_BODIES.find((b) => b.id === selectedPlanetId)
      : null;

    let destCamPos: THREE.Vector3;

    if (planetDef && planetDef.id !== 'sun') {
      const radius = planetDef.visual.visualRadius;
      
      // Calculate framing distance: Saturn requires wider framing for its extensive ring system
      let framingMultiplier = 2.5;
      let heightMultiplier = 1.25;

      if (planetDef.id === 'saturn') {
        framingMultiplier = 3.6;
        heightMultiplier = 1.6;
      } else if (planetDef.id === 'jupiter') {
        framingMultiplier = 2.7;
        heightMultiplier = 1.35;
      }

      // Compute outward radial & tangent vectors from Sol to ensure camera looks at illuminated day-side
      const radialDir = destTarget.lengthSq() > 0.001
        ? destTarget.clone().setY(0).normalize()
        : new THREE.Vector3(0.707, 0, 0.707);
      const tangentDir = new THREE.Vector3(-radialDir.z, 0, radialDir.x);

      const offset = radialDir.clone().multiplyScalar(radius * framingMultiplier * 0.75)
        .add(tangentDir.clone().multiplyScalar(radius * framingMultiplier * 0.65))
        .add(new THREE.Vector3(0, radius * heightMultiplier * (aspect < 1.0 ? 1.4 : 1.1), 0))
        .multiplyScalar(portraitMultiplier);

      destCamPos = destTarget.clone().add(offset);

      // Adapt controls zoom limits to the focused body
      controlsRef.current.minDistance = radius * (planetDef.id === 'saturn' ? 2.5 : 1.6);
      controlsRef.current.maxDistance = radius * (planetDef.id === 'saturn' ? 16.0 : 12.0) * portraitMultiplier;
    } else {
      // Return to Macro System Overview with portrait compensation
      destCamPos = OVERVIEW_CAMERA_POS.clone();
      if (aspect < 1.0) {
        destCamPos.multiplyScalar(Math.min(1.75, 0.9 / aspect));
      }
      controlsRef.current.minDistance = 8.0;
      controlsRef.current.maxDistance = 140.0 * portraitMultiplier;
    }

    // Compute arched Bezier midpoint for cinematic swoop
    const mid = startCamPosRef.current.clone().lerp(destCamPos, 0.5);
    const distance = startCamPosRef.current.distanceTo(destCamPos);
    mid.y += Math.min(26, Math.max(10, distance * 0.26));
    midCamPosRef.current.copy(mid);

    lastTargetPosRef.current.copy(destTarget);

    // Initiate flight
    transitionProgressRef.current = 0.0;
    isTransitioningRef.current = true;
  }, [selectedPlanetId, camera, controlsRef]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    const currentPlanetPos = selectedPlanetId
      ? getCelestialPosition(selectedPlanetId)
      : OVERVIEW_TARGET;

    const planetDef = selectedPlanetId
      ? CELESTIAL_BODIES.find((b) => b.id === selectedPlanetId)
      : null;

    if (isTransitioningRef.current) {
      transitionProgressRef.current += delta / transitionDurationRef.current;
      const t = Math.min(1.0, transitionProgressRef.current);

      // Smooth quintic easing curve (cinematic acceleration and soft docking)
      const easeT =
        t < 0.5
          ? 16 * t * t * t * t * t
          : 1 - Math.pow(-2 * t + 2, 5) / 2;

      // Calculate destination position (accounting for continuous planetary orbital motion)
      let currentDestCamPos: THREE.Vector3;
      if (planetDef && planetDef.id !== 'sun') {
        const radius = planetDef.visual.visualRadius;
        const framingMultiplier = planetDef.id === 'saturn' ? 3.6 : 2.5;
        const heightMultiplier = planetDef.id === 'saturn' ? 1.6 : 1.25;

        const offset = new THREE.Vector3(
          radius * framingMultiplier,
          radius * heightMultiplier,
          radius * framingMultiplier
        );
        currentDestCamPos = currentPlanetPos.clone().add(offset);
      } else {
        currentDestCamPos = OVERVIEW_CAMERA_POS;
      }

      // Quadratic Bezier interpolation for camera trajectory:
      const invT = 1.0 - easeT;
      const b0 = invT * invT;
      const b1 = 2.0 * invT * easeT;
      const b2 = easeT * easeT;

      camera.position.x =
        b0 * startCamPosRef.current.x +
        b1 * midCamPosRef.current.x +
        b2 * currentDestCamPos.x;
      camera.position.y =
        b0 * startCamPosRef.current.y +
        b1 * midCamPosRef.current.y +
        b2 * currentDestCamPos.y;
      camera.position.z =
        b0 * startCamPosRef.current.z +
        b1 * midCamPosRef.current.z +
        b2 * currentDestCamPos.z;

      // Interpolate look-at target
      controlsRef.current.target.lerpVectors(
        startTargetRef.current,
        currentPlanetPos,
        easeT
      );
      controlsRef.current.update();

      if (t >= 1.0) {
        isTransitioningRef.current = false;
        lastTargetPosRef.current.copy(currentPlanetPos);
      }
    } else if (selectedPlanetId && planetDef && planetDef.id !== 'sun') {
      // Settle state: smooth tracking along active planetary orbit
      const deltaMovement = currentPlanetPos.clone().sub(lastTargetPosRef.current);
      if (deltaMovement.lengthSq() > 0.000001) {
        camera.position.add(deltaMovement);
        controlsRef.current.target.add(deltaMovement);
        controlsRef.current.update();
        lastTargetPosRef.current.copy(currentPlanetPos);
      }
    }
  });

  return null;
};
