import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { getTerrainHeight } from './MarsTerrain';
import { inputManager } from '../../systems/inputManager';
import { resolveRoverCollision } from '../../systems/collisionSystem';
import { AstronautMesh } from './AstronautMesh';

/**
 * AAA Mars Exploration Rover
 * Features an open cockpit with seated astronaut, futuristic angular white body,
 * large rugged deep-lug tires, front steering pivots, cyan glowing accents, and
 * multi-point terrain pitch/roll suspension alignment.
 */
export const RoverVehicle: React.FC = () => {
  const roverGroupRef = useRef<THREE.Group>(null);
  const chassisRef = useRef<THREE.Group>(null);

  // Front steered wheel assembly references
  const frontLeftWheelAssemblyRef = useRef<THREE.Group>(null);
  const frontRightWheelAssemblyRef = useRef<THREE.Group>(null);

  // Wheel spin rotation references
  const wheelSpinRefs = useRef<THREE.Group[]>([]);

  const roverPos = useMarsGameStore((state) => state.roverPosition);
  const setRoverPos = useMarsGameStore((state) => state.setRoverPosition);
  const controlMode = useMarsGameStore((state) => state.settings.controlMode);
  const doorOpen = useMarsGameStore((state) => state.doorOpen);
  const solCycle = useMarsGameStore((state) => state.solCycle);
  const updateRoverTelemetry = useMarsGameStore((state) => state.updateRoverTelemetry);
  const isPauseModalOpen = useMarsGameStore((state) => state.isPauseModalOpen);

  const isDriving = controlMode === 'driving_rover';

  // Physics state
  const speed = useRef<number>(0); // m/s
  const steerAngle = useRef<number>(0); // radians
  const heading = useRef<number>(0); // vehicle yaw

  // Vehicle dynamics constants
  const MAX_SPEED = 7.8; // ~28 km/h
  const MAX_REVERSE = -3.2; // ~11.5 km/h
  const ACCELERATION = 4.6;
  const BRAKING = 8.5;
  const COAST_FRICTION = 2.2;
  const MAX_STEER_ANGLE = 0.52; // ~30 degrees

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);

    if (isDriving && !isPauseModalOpen) {
      const { moveForward, moveRight } = inputManager.getMovementAxes();

      // 1. Longitudinal Throttle & Brake
      if (moveForward > 0.1) {
        speed.current = Math.min(MAX_SPEED, speed.current + ACCELERATION * clampedDelta);
      } else if (moveForward < -0.1) {
        if (speed.current > 0.4) {
          // Braking
          speed.current = Math.max(0, speed.current - BRAKING * clampedDelta);
        } else {
          // Reverse
          speed.current = Math.max(MAX_REVERSE, speed.current - ACCELERATION * 0.7 * clampedDelta);
        }
      } else {
        // Natural rolling resistance
        if (speed.current > 0) {
          speed.current = Math.max(0, speed.current - COAST_FRICTION * clampedDelta);
        } else if (speed.current < 0) {
          speed.current = Math.min(0, speed.current + COAST_FRICTION * clampedDelta);
        }
      }

      // 2. Speed-Dependent Steering (Agile at low speeds, stable at high speeds)
      const speedFactor = 1.0 - Math.min(0.55, (Math.abs(speed.current) / MAX_SPEED) * 0.55);
      const targetSteer = -moveRight * MAX_STEER_ANGLE * speedFactor;

      steerAngle.current = THREE.MathUtils.lerp(
        steerAngle.current,
        targetSteer,
        clampedDelta * 8.0
      );

      // Vehicle yaw rate
      if (Math.abs(speed.current) > 0.04) {
        const turnRate = (speed.current / 2.7) * Math.sin(steerAngle.current);
        heading.current += turnRate * clampedDelta;
      }

      // 3. Proposed Displacement & Obstacle Collision
      const vx = Math.sin(heading.current) * speed.current * clampedDelta;
      const vz = Math.cos(heading.current) * speed.current * clampedDelta;

      const { newPos, newVelocity } = resolveRoverCollision(
        roverPos,
        [vx, 0, vz],
        doorOpen
      );

      if (vx !== 0 && newVelocity[0] === 0) speed.current = 0;
      if (vz !== 0 && newVelocity[2] === 0) speed.current = 0;

      setRoverPos(newPos);

      // 4. Telemetry
      const speedKmH = Math.abs(speed.current * 3.6);
      const gear = speed.current > 0.2 ? 'D' : speed.current < -0.2 ? 'R' : 'N';
      const batteryDrain = (speedKmH > 1 ? 0.06 : 0.005) * clampedDelta;
      updateRoverTelemetry(speedKmH, batteryDrain, gear);
    }

    // 5. Front Wheels Steering Visuals
    if (frontLeftWheelAssemblyRef.current) {
      frontLeftWheelAssemblyRef.current.rotation.y = steerAngle.current;
    }
    if (frontRightWheelAssemblyRef.current) {
      frontRightWheelAssemblyRef.current.rotation.y = steerAngle.current;
    }

    // 6. Wheel Axle Spin
    const spinDelta = (speed.current / 0.45) * clampedDelta;
    wheelSpinRefs.current.forEach((wheel) => {
      if (wheel) wheel.rotation.x += spinDelta;
    });

    // 7. Terrain Pitch & Roll Suspension Alignment
    if (roverGroupRef.current) {
      const px = roverPos[0];
      const pz = roverPos[2];
      const cy = getTerrainHeight(px, pz);

      // Sample front and rear heights along vehicle heading
      const frontDist = 1.35;
      const fx = px + Math.sin(heading.current) * frontDist;
      const fz = pz + Math.cos(heading.current) * frontDist;
      const fy = getTerrainHeight(fx, fz);

      const rx = px - Math.sin(heading.current) * frontDist;
      const rz = pz - Math.cos(heading.current) * frontDist;
      const ry = getTerrainHeight(rx, rz);

      // Sample left and right heights along vehicle lateral axis
      const sideDist = 1.1;
      const lx = px - Math.cos(heading.current) * sideDist;
      const lz = pz + Math.sin(heading.current) * sideDist;
      const ly = getTerrainHeight(lx, lz);

      const rightX = px + Math.cos(heading.current) * sideDist;
      const rightZ = pz - Math.sin(heading.current) * sideDist;
      const rightY = getTerrainHeight(rightX, rightZ);

      const targetPitch = Math.atan2(fy - ry, frontDist * 2);
      const targetRoll = Math.atan2(ly - rightY, sideDist * 2);

      roverGroupRef.current.position.set(px, cy, pz);
      roverGroupRef.current.rotation.set(targetPitch, heading.current, targetRoll);
    }
  });

  // Common PBR Materials
  const whiteArmorMat = (
    <meshStandardMaterial
      color="#F8FAFC"
      roughness={0.28}
      metalness={0.4}
    />
  );
  const darkChassisMat = (
    <meshStandardMaterial
      color="#1E293B"
      roughness={0.65}
      metalness={0.5}
    />
  );
  const cyanGlowMat = (
    <meshStandardMaterial
      color="#06B6D4"
      emissive="#06B6D4"
      emissiveIntensity={1.8}
      roughness={0.2}
    />
  );
  const tireRubberMat = (
    <meshStandardMaterial
      color="#111827"
      roughness={0.92}
      metalness={0.08}
    />
  );

  return (
    <group ref={roverGroupRef} position={[roverPos[0], 0, roverPos[2]]} name="MarsExplorationRover">
      <group ref={chassisRef}>
        {/* ---------------- 1. LOWER CHASSIS & SPACEFRAME ---------------- */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.35, 3.2]} />
          {darkChassisMat}
        </mesh>

        {/* ---------------- 2. FUTURISTIC WHITE ANGULAR BODY PANELS ---------------- */}
        {/* Front Nose Hood */}
        <mesh position={[0, 0.72, 1.15]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.42, 0.22, 1.1]} />
          {whiteArmorMat}
        </mesh>

        {/* Side Flank Rocker Armor Panels with Cyan Glow Strips */}
        <group position={[-0.82, 0.6, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.16, 0.32, 2.7]} />
            {whiteArmorMat}
          </mesh>
          {/* Cyan Glow Accent Line */}
          <mesh position={[-0.09, 0, 0]}>
            <boxGeometry args={[0.02, 0.05, 2.5]} />
            {cyanGlowMat}
          </mesh>
        </group>

        <group position={[0.82, 0.6, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.16, 0.32, 2.7]} />
            {whiteArmorMat}
          </mesh>
          <mesh position={[0.09, 0, 0]}>
            <boxGeometry args={[0.02, 0.05, 2.5]} />
            {cyanGlowMat}
          </mesh>
        </group>

        {/* Rear Battery & Generator Deck */}
        <group position={[0, 0.75, -1.1]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.45, 0.45, 1.0]} />
            {whiteArmorMat}
          </mesh>
          {/* Rear Cyan Radiator / Energy Cell Glow */}
          <mesh position={[0, 0.08, -0.51]}>
            <planeGeometry args={[1.1, 0.25]} />
            {cyanGlowMat}
          </mesh>
        </group>

        {/* ---------------- 3. OPEN ASTRONAUT COCKPIT ---------------- */}
        <group position={[0, 0.55, 0]}>
          {/* Ergonomic Driver Bucket Seat */}
          <group position={[0, 0.1, -0.05]}>
            {/* Seat Base */}
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.7, 0.15, 0.65]} />
              {darkChassisMat}
            </mesh>
            {/* Seat Backrest */}
            <mesh position={[0, 0.45, -0.32]} rotation={[0.14, 0, 0]} castShadow>
              <boxGeometry args={[0.65, 0.75, 0.14]} />
              {darkChassisMat}
            </mesh>
            {/* Cyan Seat Accent Trims */}
            <mesh position={[-0.34, 0.45, -0.32]} rotation={[0.14, 0, 0]}>
              <boxGeometry args={[0.03, 0.7, 0.15]} />
              {cyanGlowMat}
            </mesh>
            <mesh position={[0.34, 0.45, -0.32]} rotation={[0.14, 0, 0]}>
              <boxGeometry args={[0.03, 0.7, 0.15]} />
              {cyanGlowMat}
            </mesh>
          </group>

          {/* Protective Tubular Roll Cage Frame */}
          <group position={[0, 0.65, -0.05]}>
            {/* Left Roll Bar */}
            <mesh position={[-0.65, 0, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
              {whiteArmorMat}
            </mesh>
            {/* Right Roll Bar */}
            <mesh position={[0.65, 0, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
              {whiteArmorMat}
            </mesh>
            {/* Top Crossbar */}
            <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 1.34, 8]} />
              {whiteArmorMat}
            </mesh>
          </group>

          {/* Steering Console & Holographic Instrument Dashboard */}
          <group position={[0, 0.35, 0.55]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.85, 0.28, 0.25]} />
              {darkChassisMat}
            </mesh>
            {/* Cyan Holographic Dashboard Display */}
            <mesh position={[0, 0.12, 0.08]} rotation={[-Math.PI / 5, 0, 0]}>
              <planeGeometry args={[0.6, 0.2]} />
              {cyanGlowMat}
            </mesh>
            {/* Twin Steering Joysticks */}
            <mesh position={[-0.22, 0.22, 0.05]} rotation={[-0.2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.025, 0.18, 8]} />
              {whiteArmorMat}
            </mesh>
            <mesh position={[0.22, 0.22, 0.05]} rotation={[-0.2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.025, 0.18, 8]} />
              {whiteArmorMat}
            </mesh>
          </group>

          {/* ---------------- SEATED ASTRONAUT WHEN DRIVING ---------------- */}
          {isDriving && (
            <group position={[0, 0.12, -0.05]}>
              <AstronautMesh pose="seated" />
            </group>
          )}
        </group>

        {/* ---------------- 4. FRONT EXPLORATION LED LIGHT BAR ---------------- */}
        <group position={[0, 0.65, 1.72]}>
          {/* Main Bumper */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.2, 0.15]} />
            {darkChassisMat}
          </mesh>
          {/* Twin High-Intensity LED Projector Lamps */}
          <mesh position={[-0.55, 0, 0.08]}>
            <boxGeometry args={[0.35, 0.12, 0.05]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.55, 0, 0.08]}>
            <boxGeometry args={[0.35, 0.12, 0.05]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          {/* Center Cyan LED Light Strip */}
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[0.5, 0.06, 0.05]} />
            {cyanGlowMat}
          </mesh>

          {/* Forward Spotlight Beams */}
          <spotLight
            position={[0, 0.2, 0.2]}
            target-position={[0, -0.5, 25]}
            angle={0.65}
            penumbra={0.4}
            intensity={!solCycle.isDaytime ? 3.2 : 0.8}
            color="#E0F2FE"
            distance={28}
            castShadow
          />
        </group>

        {/* ---------------- 5. LARGE RUGGED WHEELS & SUSPENSION ---------------- */}
        {/* A. FRONT LEFT WHEEL (With Steering Pivot) */}
        <group
          ref={frontLeftWheelAssemblyRef}
          position={[-1.38, 0.45, 1.25]}
        >
          {/* Suspension A-Arm & Cyan Coilover Damper */}
          <mesh position={[0.25, 0.08, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.04, 0.05, 0.5, 8]} />
            {darkChassisMat}
          </mesh>
          <mesh position={[0.25, 0.08, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.25, 8]} />
            {cyanGlowMat}
          </mesh>

          {/* Rotating Wheel Group */}
          <group
            ref={(el) => {
              if (el) wheelSpinRefs.current[0] = el;
            }}
          >
            {/* Rugged Cleated Tire */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
              <cylinderGeometry args={[0.48, 0.48, 0.44, 24]} />
              {tireRubberMat}
            </mesh>
            {/* White Hub Outer Rim */}
            <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.14, 0, 0]} castShadow>
              <cylinderGeometry args={[0.28, 0.28, 0.2, 16]} />
              {whiteArmorMat}
            </mesh>
            {/* Cyan Glowing Wheel Hub Center */}
            <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.23, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.04, 16]} />
              {cyanGlowMat}
            </mesh>
          </group>
        </group>

        {/* B. FRONT RIGHT WHEEL (With Steering Pivot) */}
        <group
          ref={frontRightWheelAssemblyRef}
          position={[1.38, 0.45, 1.25]}
        >
          <mesh position={[-0.25, 0.08, 0]} rotation={[0, 0, Math.PI / 6]}>
            <cylinderGeometry args={[0.04, 0.05, 0.5, 8]} />
            {darkChassisMat}
          </mesh>
          <mesh position={[-0.25, 0.08, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.25, 8]} />
            {cyanGlowMat}
          </mesh>

          <group
            ref={(el) => {
              if (el) wheelSpinRefs.current[1] = el;
            }}
          >
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
              <cylinderGeometry args={[0.48, 0.48, 0.44, 24]} />
              {tireRubberMat}
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[0.14, 0, 0]} castShadow>
              <cylinderGeometry args={[0.28, 0.28, 0.2, 16]} />
              {whiteArmorMat}
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[0.23, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.04, 16]} />
              {cyanGlowMat}
            </mesh>
          </group>
        </group>

        {/* C. REAR LEFT WHEEL */}
        <group position={[-1.38, 0.45, -1.15]}>
          <mesh position={[0.25, 0.08, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.04, 0.05, 0.5, 8]} />
            {darkChassisMat}
          </mesh>
          <mesh position={[0.25, 0.08, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.25, 8]} />
            {cyanGlowMat}
          </mesh>

          <group
            ref={(el) => {
              if (el) wheelSpinRefs.current[2] = el;
            }}
          >
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
              <cylinderGeometry args={[0.48, 0.48, 0.44, 24]} />
              {tireRubberMat}
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.14, 0, 0]} castShadow>
              <cylinderGeometry args={[0.28, 0.28, 0.2, 16]} />
              {whiteArmorMat}
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.23, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.04, 16]} />
              {cyanGlowMat}
            </mesh>
          </group>
        </group>

        {/* D. REAR RIGHT WHEEL */}
        <group position={[1.38, 0.45, -1.15]}>
          <mesh position={[-0.25, 0.08, 0]} rotation={[0, 0, Math.PI / 6]}>
            <cylinderGeometry args={[0.04, 0.05, 0.5, 8]} />
            {darkChassisMat}
          </mesh>
          <mesh position={[-0.25, 0.08, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.25, 8]} />
            {cyanGlowMat}
          </mesh>

          <group
            ref={(el) => {
              if (el) wheelSpinRefs.current[3] = el;
            }}
          >
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
              <cylinderGeometry args={[0.48, 0.48, 0.44, 24]} />
              {tireRubberMat}
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[0.14, 0, 0]} castShadow>
              <cylinderGeometry args={[0.28, 0.28, 0.2, 16]} />
              {whiteArmorMat}
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[0.23, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.04, 16]} />
              {cyanGlowMat}
            </mesh>
          </group>
        </group>

        {/* Interactive Beacon Halo when on foot */}
        {!isDriving && (
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.4, 2.65, 32]} />
            <meshBasicMaterial color="#06B6D4" transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
    </group>
  );
};
