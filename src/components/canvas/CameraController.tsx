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

const OVERVIEW_CAMERA_POS = new THREE.Vector3(0, 42, 68);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, 0);

/**
 * Cinematic Bezier Camera Navigation Controller
 * Features:
 * - Quadratic Bezier arched camera pathing preventing collision with Sol or orbital planes
 * - Dynamic tracking of orbiting planetary bodies while maintaining centered focus
 * - Seamless interruption when user selects another target or presses Escape
 * - Contextual zoom and orbit limits adapted to planetary radius in focus mode
 */
export const CameraController: React.FC<CameraControllerProps> = ({ controlsRef }) => {
  const { camera } = useThree();
  const { selectedPlanetId } = useSolarSystem();

  // Animation transition state
  const isTransitioningRef = useRef<boolean>(false);
  const transitionProgressRef = useRef<number>(1.0); // 1 = settled, < 1 = in flight
  const transitionDurationRef = useRef<number>(1.3); // seconds

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
      // Position camera at an attractive 3.5 radii angle showing day side & terminator
      const offset = new THREE.Vector3(radius * 2.5, radius * 1.3, radius * 2.5);
      destCamPos = destTarget.clone().add(offset);

      // Adapt controls zoom limits to the focused body
      controlsRef.current.minDistance = radius * 1.8;
      controlsRef.current.maxDistance = radius * 12.0;
    } else {
      // Return to Macro Overview
      destCamPos = OVERVIEW_CAMERA_POS.clone();
      controlsRef.current.minDistance = 8.0;
      controlsRef.current.maxDistance = 140.0;
    }

    // Compute arched Bezier midpoint
    const mid = startCamPosRef.current.clone().lerp(destCamPos, 0.5);
    const distance = startCamPosRef.current.distanceTo(destCamPos);
    mid.y += Math.min(24, Math.max(8, distance * 0.28));
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

      // Cubic smoothstep easing: 3t^2 - 2t^3
      const easeT = t * t * (3.0 - 2.0 * t);

      // Calculate destination positions (accounting for ongoing planetary motion)
      let currentDestCamPos: THREE.Vector3;
      if (planetDef && planetDef.id !== 'sun') {
        const radius = planetDef.visual.visualRadius;
        const offset = new THREE.Vector3(radius * 2.5, radius * 1.3, radius * 2.5);
        currentDestCamPos = currentPlanetPos.clone().add(offset);
      } else {
        currentDestCamPos = OVERVIEW_CAMERA_POS;
      }

      // Quadratic Bezier interpolation for camera position:
      // B(t) = (1-t)^2 * P0 + 2(1-t)t * Pmid + t^2 * P1
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

      // Linear target interpolation
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
      // Settle state: Camera smoothly tracks the planet along its orbital path
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
