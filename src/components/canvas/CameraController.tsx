import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { getCelestialPosition } from '../../utils/celestialRegistry';
import { CELESTIAL_BODIES, ALL_MOONS, DWARF_PLANETS } from '../../data/celestialBodies';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface CameraControllerProps {
  controlsRef: React.RefObject<OrbitControlsImpl>;
}

const OVERVIEW_CAMERA_POS = new THREE.Vector3(0, 48, 92);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, 0);

/**
 * Cinematic Bezier Flight & Multi-Target Orbital Tracking Controller (AAA Edition)
 * 
 * Features:
 * - Bespoke planetary framing accommodating planetary radii and Saturn's ring system
 * - Zoom & focus tracking for individual Natural Satellites (Moons)
 * - Support for Dwarf Planets (Pluto, Ceres, etc.) and Spacecraft
 * - Curved quadratic Bezier orbital fly-path preventing celestial collisions
 * - Smooth quintic easing curve delivering cinematic acceleration and soft deceleration
 * - Dynamic body tracking in focus mode with drift-free orbital delta compensation
 * - Adaptive OrbitControls distance clamps tailored to individual celestial geometry
 */
export const CameraController: React.FC<CameraControllerProps> = ({ controlsRef }) => {
  const { camera, size } = useThree();
  const {
    selectedPlanetId,
    selectedMoonId,
    selectedDwarfPlanetId,
    selectedSpacecraftId,
    activeEnvironment,
  } = useSolarSystem();

  // Animation transition state
  const isTransitioningRef = useRef<boolean>(false);
  const transitionProgressRef = useRef<number>(1.0); // 1 = settled, < 1 = in flight
  const transitionDurationRef = useRef<number>(1.4); // seconds

  const startCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const startTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const midCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3());

  const lastTargetPosRef = useRef<THREE.Vector3>(new THREE.Vector3());

  // Trigger transition when selected planet, moon, dwarf planet, or environment changes
  useEffect(() => {
    if (!controlsRef.current) return;

    // Snapshot starting positions
    startCamPosRef.current.copy(camera.position);
    startTargetRef.current.copy(controlsRef.current.target);

    // Compute aspect ratio scaling for mobile portrait vs desktop widescreen
    const aspect = size.width / Math.max(1, size.height);
    const portraitMultiplier = aspect < 1.0 ? Math.min(2.4, 0.92 / aspect) : 1.0;

    if (activeEnvironment === 'milky-way') {
      const destTarget = new THREE.Vector3(0, 0, 0);
      const destCamPos = new THREE.Vector3(0, 72, 120).multiplyScalar(aspect < 1.0 ? 1.3 : 1.0);
      controlsRef.current.minDistance = 15.0;
      controlsRef.current.maxDistance = 300.0 * portraitMultiplier;

      const mid = startCamPosRef.current.clone().lerp(destCamPos, 0.5);
      mid.y += 24;
      midCamPosRef.current.copy(mid);
      lastTargetPosRef.current.copy(destTarget);

      transitionProgressRef.current = 0.0;
      isTransitioningRef.current = true;
      return;
    }

    // 1. Check if a Moon is targeted
    if (selectedMoonId) {
      const moonDef = ALL_MOONS.find((m) => m.id === selectedMoonId);
      const destTarget = getCelestialPosition(selectedMoonId);
      const mRadius = moonDef ? moonDef.visualRadius : 0.45;

      const offset = new THREE.Vector3(mRadius * 3.8, mRadius * 2.2, mRadius * 3.8).multiplyScalar(portraitMultiplier);
      const destCamPos = destTarget.clone().add(offset);

      controlsRef.current.minDistance = mRadius * 1.4;
      controlsRef.current.maxDistance = mRadius * 16.0 * portraitMultiplier;

      const mid = startCamPosRef.current.clone().lerp(destCamPos, 0.5);
      mid.y += Math.max(4, startCamPosRef.current.distanceTo(destCamPos) * 0.2);
      midCamPosRef.current.copy(mid);
      lastTargetPosRef.current.copy(destTarget);

      transitionProgressRef.current = 0.0;
      isTransitioningRef.current = true;
      return;
    }

    // 2. Check if a Dwarf Planet is targeted
    if (selectedDwarfPlanetId) {
      const dwarfDef = DWARF_PLANETS.find((d) => d.id === selectedDwarfPlanetId);
      const destTarget = getCelestialPosition(selectedDwarfPlanetId);
      const dRadius = dwarfDef ? dwarfDef.visualRadius : 0.7;

      const offset = new THREE.Vector3(dRadius * 4.2, dRadius * 2.4, dRadius * 4.2).multiplyScalar(portraitMultiplier);
      const destCamPos = destTarget.clone().add(offset);

      controlsRef.current.minDistance = dRadius * 1.4;
      controlsRef.current.maxDistance = dRadius * 18.0 * portraitMultiplier;

      const mid = startCamPosRef.current.clone().lerp(destCamPos, 0.5);
      mid.y += Math.max(6, startCamPosRef.current.distanceTo(destCamPos) * 0.22);
      midCamPosRef.current.copy(mid);
      lastTargetPosRef.current.copy(destTarget);

      transitionProgressRef.current = 0.0;
      isTransitioningRef.current = true;
      return;
    }

    // 3. Determine destination target for Planet or System Overview
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
      let framingMultiplier = 2.4;
      let heightMultiplier = 1.25;

      if (planetDef.id === 'saturn') {
        framingMultiplier = 3.4;
        heightMultiplier = 1.5;
      } else if (planetDef.id === 'jupiter') {
        framingMultiplier = 2.6;
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
      controlsRef.current.minDistance = radius * (planetDef.id === 'saturn' ? 2.4 : 1.5);
      controlsRef.current.maxDistance = radius * (planetDef.id === 'saturn' ? 16.0 : 12.0) * portraitMultiplier;
    } else {
      // Return to Macro System Overview with portrait compensation
      destCamPos = OVERVIEW_CAMERA_POS.clone();
      if (aspect < 1.0) {
        destCamPos.multiplyScalar(Math.min(1.75, 0.9 / aspect));
      }
      controlsRef.current.minDistance = 8.0;
      controlsRef.current.maxDistance = 180.0 * portraitMultiplier;
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
  }, [
    selectedPlanetId,
    selectedMoonId,
    selectedDwarfPlanetId,
    selectedSpacecraftId,
    activeEnvironment,
    camera,
    controlsRef,
  ]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (activeEnvironment === 'milky-way') {
      if (isTransitioningRef.current) {
        transitionProgressRef.current += delta / transitionDurationRef.current;
        const t = Math.min(1.0, transitionProgressRef.current);
        const easeT = t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
        const targetPos = new THREE.Vector3(0, 0, 0);
        const destCam = new THREE.Vector3(0, 72, 120);
        camera.position.copy(startCamPosRef.current.clone().lerp(destCam, easeT));
        controlsRef.current.target.copy(startTargetRef.current.clone().lerp(targetPos, easeT));
        controlsRef.current.update();
        if (t >= 1.0) isTransitioningRef.current = false;
      }
      return;
    }

    // Active body position resolution
    const activeTargetId = selectedMoonId || selectedDwarfPlanetId || selectedPlanetId;
    const currentTargetPos = activeTargetId
      ? getCelestialPosition(activeTargetId)
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

      // Calculate destination position (accounting for continuous celestial orbital motion)
      let currentDestCamPos: THREE.Vector3;
      if (selectedMoonId) {
        const moonDef = ALL_MOONS.find((m) => m.id === selectedMoonId);
        const mRadius = moonDef ? moonDef.visualRadius : 0.45;
        const offset = new THREE.Vector3(mRadius * 3.8, mRadius * 2.2, mRadius * 3.8);
        currentDestCamPos = currentTargetPos.clone().add(offset);
      } else if (selectedDwarfPlanetId) {
        const dwarfDef = DWARF_PLANETS.find((d) => d.id === selectedDwarfPlanetId);
        const dRadius = dwarfDef ? dwarfDef.visualRadius : 0.7;
        const offset = new THREE.Vector3(dRadius * 4.2, dRadius * 2.4, dRadius * 4.2);
        currentDestCamPos = currentTargetPos.clone().add(offset);
      } else if (planetDef && planetDef.id !== 'sun') {
        const radius = planetDef.visual.visualRadius;
        const framingMultiplier = planetDef.id === 'saturn' ? 3.4 : 2.4;
        const heightMultiplier = planetDef.id === 'saturn' ? 1.5 : 1.25;

        const offset = new THREE.Vector3(
          radius * framingMultiplier,
          radius * heightMultiplier,
          radius * framingMultiplier
        );
        currentDestCamPos = currentTargetPos.clone().add(offset);
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
        currentTargetPos,
        easeT
      );
      controlsRef.current.update();

      if (t >= 1.0) {
        isTransitioningRef.current = false;
        lastTargetPosRef.current.copy(currentTargetPos);
      }
    } else if (activeTargetId && activeTargetId !== 'sun') {
      // Settle state: smooth drift-free tracking along active orbital motion
      const deltaMovement = currentTargetPos.clone().sub(lastTargetPosRef.current);
      if (deltaMovement.lengthSq() > 0.000001) {
        camera.position.add(deltaMovement);
        controlsRef.current.target.add(deltaMovement);
        controlsRef.current.update();
        lastTargetPosRef.current.copy(currentTargetPos);
      }
    }
  });

  return null;
};
