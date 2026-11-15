import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { getTerrainHeight, DETERMINISTIC_ROCKS } from './MarsTerrain';
import { inputManager } from '../../systems/inputManager';
import { resolveRoverCollision } from '../../systems/collisionSystem';
import { RoverAISystem } from '../../systems/roverAISystem';
import { audioSystem } from '../../systems/audioSynthesizer';
import { AstronautMesh } from './AstronautMesh';

/**
 * Probes ground elevation under a wheel contact patch including small climbable rock bumps
 */
function getWheelContactElevation(wx: number, wz: number): number {
  let h = getTerrainHeight(wx, wz);
  for (let i = 0; i < DETERMINISTIC_ROCKS.length; i++) {
    const rock = DETERMINISTIC_ROCKS[i];
    const dx = wx - rock.x;
    const dz = wz - rock.z;
    const distSq = dx * dx + dz * dz;
    const rSq = rock.radius * rock.radius;
    if (distSq < rSq && rock.scale <= 0.6) {
      const dist = Math.sqrt(distSq);
      const bump = (1.0 - dist / rock.radius) * rock.scale * 0.42;
      const rockTop = rock.y + bump;
      if (rockTop > h) {
        h = rockTop;
      }
    }
  }
  return h;
}

/**
 * AAA 6-Wheel Rocker-Bogie Mars Exploration Rover
 * Features:
 * - 6 independent rocker-bogie wheels with dynamic terrain conforming
 * - Individual wheel spinning and front-axle Ackerman steering
 * - Dynamic suspension dive/squat under braking and acceleration
 * - Procedural wheel dust plumes billowing behind tires when driving
 * - Active brake lights and white reverse backup lamps
 * - Continuous Web Audio electric traction motor synthesis
 */
export const RoverVehicle: React.FC = () => {
  const roverGroupRef = useRef<THREE.Group>(null);
  const chassisRef = useRef<THREE.Group>(null);

  // 6 wheel assemblies for independent vertical travel
  const wheelAssemblyRefs = useRef<(THREE.Group | null)[]>([]);

  // Front steered wheel assemblies
  const frontLeftWheelAssemblyRef = useRef<THREE.Group>(null);
  const frontRightWheelAssemblyRef = useRef<THREE.Group>(null);

  // Wheel spin rotation references (6 wheels)
  const wheelSpinRefs = useRef<THREE.Group[]>([]);

  // Brake & Reverse Light references
  const brakeLightMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const reverseLightMatRef = useRef<THREE.MeshStandardMaterial>(null);

  // Tire dust particle system reference
  const dustPointsRef = useRef<THREE.Points>(null);

  const roverPos = useMarsGameStore((state) => state.roverPosition);
  const setRoverPos = useMarsGameStore((state) => state.setRoverPosition);
  const controlMode = useMarsGameStore((state) => state.settings.controlMode);
  const doorOpen = useMarsGameStore((state) => state.doorOpen);
  const solCycle = useMarsGameStore((state) => state.solCycle);
  const updateRoverTelemetry = useMarsGameStore((state) => state.updateRoverTelemetry);
  const isPauseModalOpen = useMarsGameStore((state) => state.isPauseModalOpen);
  const unlockedTechIds = useMarsGameStore((state) => state.unlockedTechIds);
  const hasSuspensionTech = unlockedTechIds.includes('tech_rover_suspension');

  const roverAIMode = useMarsGameStore((state) => state.roverAIMode);
  const setRoverAIMode = useMarsGameStore((state) => state.setRoverAIMode);
  const roverNavPlan = useMarsGameStore((state) => state.roverNavPlan);
  const updateRoverNavPlan = useMarsGameStore((state) => state.updateRoverNavPlan);
  const cancelRoverAutonomous = useMarsGameStore((state) => state.cancelRoverAutonomous);
  const showNotification = useMarsGameStore((state) => state.showNotification);

  const isDriving = controlMode === 'driving_rover';

  // Kinematic state
  const speed = useRef<number>(0); // m/s
  const steerAngle = useRef<number>(0); // radians
  const heading = useRef<number>(0); // vehicle yaw in radians

  // Rocker-Bogie filtered orientation & elevation
  const chassisPitch = useRef<number>(0);
  const chassisRoll = useRef<number>(0);
  const chassisY = useRef<number>(0);

  // Rover physical dynamics constants
  const MAX_SPEED = hasSuspensionTech ? 9.2 : 7.5; // ~33 km/h with suspension upgrade
  const MAX_REVERSE = -2.8;
  const ACCELERATION = hasSuspensionTech ? 5.4 : 4.4;
  const BRAKING = 7.8;
  const HANDBRAKE_DECEL = 15.0;
  const COAST_FRICTION = 1.35;
  const MAX_STEER_ANGLE = 0.54;
  const MARS_GRAVITY = 3.71;

  // 6-wheel local coordinate layout [lx, lz]
  // 0: Front Left, 1: Front Right, 2: Mid Left (Bogie), 3: Mid Right (Bogie), 4: Rear Left, 5: Rear Right
  const wheelOffsets = useMemo(
    () => [
      { lx: -1.38, lz: 1.25 },
      { lx: 1.38, lz: 1.25 },
      { lx: -1.38, lz: 0.05 },
      { lx: 1.38, lz: 0.05 },
      { lx: -1.38, lz: -1.15 },
      { lx: 1.38, lz: -1.15 },
    ],
    []
  );

  // Wheel dust particles pool
  const DUST_COUNT = 64;
  const [dustPositions, dustAges] = useMemo(() => {
    const pos = new Float32Array(DUST_COUNT * 3);
    const ages = new Float32Array(DUST_COUNT);
    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2.4;
      pos[i * 3 + 1] = -5.0; // Hide below ground initially
      pos[i * 3 + 2] = -1.5 - Math.random() * 2.5;
      ages[i] = Math.random();
    }
    return [pos, ages];
  }, []);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);

    // 1. Longitudinal Slope Angle & Gravitational Force Component
    const frontDist = 1.25;
    const rearDist = 1.15;
    const fx = roverPos[0] + Math.sin(heading.current) * frontDist;
    const fz = roverPos[2] + Math.cos(heading.current) * frontDist;
    const fy = getTerrainHeight(fx, fz);

    const rx = roverPos[0] - Math.sin(heading.current) * rearDist;
    const rz = roverPos[2] - Math.cos(heading.current) * rearDist;
    const ry = getTerrainHeight(rx, rz);

    const longitudinalSlope = Math.atan2(fy - ry, frontDist + rearDist);
    const slopeGravityAccel = -MARS_GRAVITY * Math.sin(longitudinalSlope);

    const shouldDrive = (isDriving || roverAIMode === 'autonomous') && !isPauseModalOpen;

    let moveForward = 0;
    let moveRight = 0;
    let handbrakeActive = false;

    if (shouldDrive) {
      const rawInput = inputManager.getMovementAxes();
      const rawHandbrake = inputManager.isHandbrakeActive();
      const hasPlayerInput =
        Math.abs(rawInput.moveForward) > 0.1 || Math.abs(rawInput.moveRight) > 0.1 || rawHandbrake;

      if (isDriving && hasPlayerInput && roverAIMode === 'autonomous') {
        cancelRoverAutonomous();
        showNotification('Manual override: Rover autopilot disengaged.');
        moveForward = rawInput.moveForward;
        moveRight = rawInput.moveRight;
        handbrakeActive = rawHandbrake;
      } else if (roverAIMode === 'autonomous') {
        const aiOutput = RoverAISystem.computeControls(
          roverPos,
          heading.current,
          speed.current,
          roverNavPlan,
          clampedDelta
        );

        moveForward = aiOutput.moveForward;
        moveRight = aiOutput.moveRight;
        handbrakeActive = aiOutput.handbrakeActive;

        if (roverNavPlan.destination) {
          const destCoords = roverNavPlan.destination.position;
          const remDist = Math.hypot(destCoords[0] - roverPos[0], destCoords[2] - roverPos[2]);
          const totalDist = Math.max(1, roverNavPlan.totalDistance);
          const prog = Math.min(100, Math.max(0, ((totalDist - remDist) / totalDist) * 100));
          const estSec =
            Math.abs(speed.current) > 0.5
              ? Math.round(remDist / Math.abs(speed.current))
              : Math.round(remDist / 4.0);

          if (aiOutput.state === 'arrived') {
            setRoverAIMode('manual');
            updateRoverNavPlan({
              state: 'arrived',
              remainingDistance: 0,
              progressPercent: 100,
              estimatedSecondsRemaining: 0,
            });
            showNotification(`Autonomous Rover: Arrived safely at ${roverNavPlan.destination.name}.`);
          } else if (aiOutput.state === 'obstacle_detected') {
            updateRoverNavPlan({
              state: 'obstacle_detected',
              remainingDistance: remDist,
              progressPercent: prog,
              estimatedSecondsRemaining: estSec,
            });
          } else {
            updateRoverNavPlan({
              remainingDistance: remDist,
              progressPercent: prog,
              estimatedSecondsRemaining: estSec,
            });
          }
        }
      } else if (isDriving) {
        moveForward = rawInput.moveForward;
        moveRight = rawInput.moveRight;
        handbrakeActive = rawHandbrake;
      }

      // 2. Throttle, Service Brake & Handbrake Physics
      if (handbrakeActive) {
        if (speed.current > 0) {
          speed.current = Math.max(0, speed.current - HANDBRAKE_DECEL * clampedDelta);
        } else if (speed.current < 0) {
          speed.current = Math.min(0, speed.current + HANDBRAKE_DECEL * clampedDelta);
        }
      } else if (moveForward > 0.1) {
        const engineTorque = ACCELERATION * (1.0 - Math.max(0, speed.current / MAX_SPEED) * 0.4);
        speed.current = Math.min(
          MAX_SPEED,
          speed.current + (engineTorque + slopeGravityAccel) * clampedDelta
        );
      } else if (moveForward < -0.1) {
        if (speed.current > 0.35) {
          speed.current = Math.max(0, speed.current - (BRAKING - slopeGravityAccel) * clampedDelta);
        } else {
          const revTorque = ACCELERATION * 0.65;
          speed.current = Math.max(
            MAX_REVERSE,
            speed.current - (revTorque - slopeGravityAccel) * clampedDelta
          );
        }
      } else {
        if (Math.abs(speed.current) > 0.05) {
          const drag = Math.sign(speed.current) * COAST_FRICTION;
          speed.current += (-drag + slopeGravityAccel) * clampedDelta;
        } else {
          if (Math.abs(slopeGravityAccel) > 0.65) {
            speed.current += slopeGravityAccel * clampedDelta;
          } else {
            speed.current = 0;
          }
        }
      }

      // 3. Speed-Sensitive Steering
      const speedRatio = Math.min(1.0, Math.abs(speed.current) / MAX_SPEED);
      const steerSensitivity = 1.0 - speedRatio * 0.45;
      const targetSteer = -moveRight * MAX_STEER_ANGLE * steerSensitivity;

      steerAngle.current = THREE.MathUtils.lerp(
        steerAngle.current,
        targetSteer,
        clampedDelta * 10.0
      );

      // 4. Vehicle Yaw Kinematics
      if (Math.abs(speed.current) > 0.03) {
        const turnRate = (speed.current / 2.4) * Math.tan(steerAngle.current);
        heading.current += turnRate * clampedDelta;
      }

      // 5. Horizontal Displacement & Collision
      const vx = Math.sin(heading.current) * speed.current * clampedDelta;
      const vz = Math.cos(heading.current) * speed.current * clampedDelta;

      const { newPos, newVelocity, collided } = resolveRoverCollision(
        roverPos,
        [vx, 0, vz],
        doorOpen
      );

      if (collided) {
        speed.current *= 0.45;
      }
      if (vx !== 0 && newVelocity[0] === 0) speed.current = 0;
      if (vz !== 0 && newVelocity[2] === 0) speed.current = 0;

      setRoverPos(newPos);

      // 6. Live Telemetry & Audio
      const speedKmH = Math.round(Math.abs(speed.current * 3.6));
      let gear: 'D' | 'N' | 'R' = 'N';
      if (speed.current > 0.2) gear = 'D';
      else if (speed.current < -0.2) gear = 'R';

      const drainMultiplier = hasSuspensionTech ? 0.75 : 1.0;
      const batteryDrain = (speedKmH > 1 ? 0.055 * drainMultiplier : 0.005) * clampedDelta;
      updateRoverTelemetry(speedKmH, batteryDrain, gear);

      // Real-time audio engine update
      const isBraking = handbrakeActive || (moveForward < -0.1 && speed.current > 0.5);
      audioSystem.updateRoverAudio(speedKmH, isBraking);

      // Brake & Reverse Lights Visual Feedback
      if (brakeLightMatRef.current) {
        brakeLightMatRef.current.emissiveIntensity = isBraking ? 3.5 : 0.4;
      }
      if (reverseLightMatRef.current) {
        reverseLightMatRef.current.emissiveIntensity = gear === 'R' ? 2.5 : 0.0;
      }
    } else {
      speed.current = THREE.MathUtils.lerp(speed.current, 0, clampedDelta * 6.0);
      audioSystem.updateRoverAudio(0, false);
      if (brakeLightMatRef.current) brakeLightMatRef.current.emissiveIntensity = 0.4;
      if (reverseLightMatRef.current) reverseLightMatRef.current.emissiveIntensity = 0.0;
    }

    // 7. Front Steered Wheel Pivot Visuals
    if (frontLeftWheelAssemblyRef.current) {
      frontLeftWheelAssemblyRef.current.rotation.y = steerAngle.current;
    }
    if (frontRightWheelAssemblyRef.current) {
      frontRightWheelAssemblyRef.current.rotation.y = steerAngle.current;
    }

    // 8. Wheel Axle Spin Rotation (All 6 wheels)
    const spinDelta = (speed.current / 0.48) * clampedDelta;
    wheelSpinRefs.current.forEach((wheel) => {
      if (wheel) wheel.rotation.x += spinDelta;
    });

    // 9. Rocker-Bogie Multi-Wheel Contact & Differential Chassis Response (6 Wheels)
    const px = roverPos[0];
    const pz = roverPos[2];

    const cosH = Math.cos(heading.current);
    const sinH = Math.sin(heading.current);

    const wheelWorldHeights: number[] = [];
    for (let i = 0; i < wheelOffsets.length; i++) {
      const { lx, lz } = wheelOffsets[i];
      const wx = px + cosH * lx + sinH * lz;
      const wz = pz - sinH * lx + cosH * lz;
      wheelWorldHeights[i] = getWheelContactElevation(wx, wz);
    }

    // Dynamic Suspension Pitch Dive / Squat
    const accelRate = (speed.current - (moveForward > 0 ? 0 : speed.current)) * 0.012;
    const dynamicDive = THREE.MathUtils.clamp(-accelRate, -0.05, 0.05);

    // Left Rocker vs Right Rocker Pitch
    const leftRockerPitch = Math.atan2(wheelWorldHeights[0] - wheelWorldHeights[4], 2.4);
    const rightRockerPitch = Math.atan2(wheelWorldHeights[1] - wheelWorldHeights[5], 2.4);
    const targetPitch = (leftRockerPitch + rightRockerPitch) * 0.5 + dynamicDive;

    // Lateral Roll Angle
    const leftMean = (wheelWorldHeights[0] + wheelWorldHeights[2] + wheelWorldHeights[4]) / 3.0;
    const rightMean = (wheelWorldHeights[1] + wheelWorldHeights[3] + wheelWorldHeights[5]) / 3.0;
    const targetRoll = Math.atan2(leftMean - rightMean, 2.76);

    // Chassis elevation (average of 6 wheel contacts)
    let sumY = 0;
    for (let i = 0; i < 6; i++) sumY += wheelWorldHeights[i];
    const targetY = sumY / 6.0;

    chassisPitch.current = THREE.MathUtils.lerp(chassisPitch.current, targetPitch, clampedDelta * 12.0);
    chassisRoll.current = THREE.MathUtils.lerp(chassisRoll.current, targetRoll, clampedDelta * 12.0);
    chassisY.current = THREE.MathUtils.lerp(chassisY.current, targetY, clampedDelta * 14.0);

    if (roverGroupRef.current) {
      roverGroupRef.current.position.set(px, chassisY.current, pz);
      roverGroupRef.current.rotation.set(chassisPitch.current, heading.current, chassisRoll.current);
    }

    // 10. Individual Wheel Vertical Travel (conforms all 6 wheels to ground)
    for (let i = 0; i < wheelOffsets.length; i++) {
      const assembly = wheelAssemblyRefs.current[i];
      if (assembly) {
        const { lx, lz } = wheelOffsets[i];
        const chassisAtWheel =
          chassisY.current +
          Math.sin(chassisPitch.current) * lz -
          Math.sin(chassisRoll.current) * lx;

        const suspensionOffset = THREE.MathUtils.clamp(
          wheelWorldHeights[i] - chassisAtWheel,
          -0.2,
          0.24
        );
        assembly.position.y = 0.45 + suspensionOffset;
      }
    }

    // 11. Tire Regolith Dust Plumes Update
    if (dustPointsRef.current) {
      const posAttr = dustPointsRef.current.geometry.attributes.position;
      const isMoving = Math.abs(speed.current) > 0.4;
      const dustSpeed = Math.abs(speed.current) * 0.65;

      for (let i = 0; i < DUST_COUNT; i++) {
        dustAges[i] += clampedDelta * (1.2 + dustSpeed * 0.4);
        if (dustAges[i] > 1.0) {
          if (isMoving) {
            dustAges[i] = 0;
            // Spawn behind left or right rear tire
            const side = i % 2 === 0 ? -1.38 : 1.38;
            posAttr.setXYZ(i, side + (Math.random() - 0.5) * 0.3, 0.1, -1.25);
          } else {
            posAttr.setY(i, -10.0); // Hide
          }
        } else if (posAttr.getY(i) > -5.0) {
          // Billow backwards and rise slightly
          let curZ = posAttr.getZ(i) - dustSpeed * clampedDelta * 1.8;
          let curY = posAttr.getY(i) + clampedDelta * 0.35;
          let curX = posAttr.getX(i) + (Math.random() - 0.5) * clampedDelta * 0.2;
          posAttr.setXYZ(i, curX, curY, curZ);
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  // High-Quality PBR Materials
  const whiteArmorMat = (
    <meshStandardMaterial
      color="#F8FAFC"
      roughness={0.32}
      metalness={0.35}
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

          {/* Active Red Brake Light Strips */}
          <group position={[0, 0.12, -0.51]}>
            {[-0.45, 0.45].map((xOff, i) => (
              <mesh key={i} position={[xOff, 0, 0]}>
                <boxGeometry args={[0.32, 0.06, 0.02]} />
                <meshStandardMaterial
                  ref={i === 0 ? brakeLightMatRef : undefined}
                  color="#EF4444"
                  emissive="#EF4444"
                  emissiveIntensity={0.4}
                />
              </mesh>
            ))}
          </group>

          {/* White Backup Reverse Lamps */}
          <group position={[0, -0.05, -0.51]}>
            {[-0.2, 0.2].map((xOff, i) => (
              <mesh key={i} position={[xOff, 0, 0]}>
                <boxGeometry args={[0.12, 0.04, 0.02]} />
                <meshStandardMaterial
                  ref={i === 0 ? reverseLightMatRef : undefined}
                  color="#FFFFFF"
                  emissive="#FFFFFF"
                  emissiveIntensity={0.0}
                />
              </mesh>
            ))}
          </group>

          {/* Rear Cyan Radiator / Energy Cell Glow */}
          <mesh position={[0, 0.08, -0.51]}>
            <planeGeometry args={[0.7, 0.15]} />
            {cyanGlowMat}
          </mesh>
        </group>

        {/* ---------------- 3. OPEN ASTRONAUT COCKPIT ---------------- */}
        <group position={[0, 0.55, 0]}>
          {/* Ergonomic Driver Bucket Seat */}
          <group position={[0, 0.1, -0.05]}>
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.7, 0.15, 0.65]} />
              {darkChassisMat}
            </mesh>
            <mesh position={[0, 0.42, -0.32]} rotation={[0.15, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.68, 0.7, 0.14]} />
              {darkChassisMat}
            </mesh>
          </group>

          {/* High-Tech Avionics Dashboard */}
          <group position={[0, 0.42, 0.55]} rotation={[-0.32, 0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.05, 0.28, 0.35]} />
              {darkChassisMat}
            </mesh>
            <mesh position={[0, 0.15, 0.08]}>
              <planeGeometry args={[0.65, 0.2]} />
              {cyanGlowMat}
            </mesh>
          </group>

          {/* Seated Astronaut Mesh when driving */}
          {isDriving && (
            <group position={[0, 0.1, -0.05]}>
              <AstronautMesh pose="seated" />
            </group>
          )}

          {/* Heavy Tubular Steel Roll Cage */}
          <group position={[0, 0.6, 0]}>
            {/* Front Arch */}
            <mesh position={[0, 0.38, 0.45]} castShadow>
              <torusGeometry args={[0.72, 0.045, 8, 16, Math.PI]} />
              {darkChassisMat}
            </mesh>
            {/* Rear Arch */}
            <mesh position={[0, 0.38, -0.45]} castShadow>
              <torusGeometry args={[0.72, 0.045, 8, 16, Math.PI]} />
              {darkChassisMat}
            </mesh>
            {/* Longitudinal Stringers */}
            <mesh position={[-0.7, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
              {darkChassisMat}
            </mesh>
            <mesh position={[0.7, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
              {darkChassisMat}
            </mesh>
          </group>
        </group>

        {/* ---------------- 4. ROOFTOP HIGH-OUTPUT HEADLIGHT RIG ---------------- */}
        <group position={[0, 1.62, 0.45]}>
          <mesh castShadow>
            <boxGeometry args={[1.45, 0.15, 0.15]} />
            {darkChassisMat}
          </mesh>
          <mesh position={[-0.55, 0, 0.08]}>
            <boxGeometry args={[0.35, 0.12, 0.05]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.55, 0, 0.08]}>
            <boxGeometry args={[0.35, 0.12, 0.05]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[0.5, 0.06, 0.05]} />
            {cyanGlowMat}
          </mesh>
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

        {/* ---------------- 5. 6-WHEEL ROCKER-BOGIE INDEPENDENT WHEELS ---------------- */}
        {/* WHEEL 0: FRONT LEFT (Steered + Suspended) */}
        <group ref={(el) => { wheelAssemblyRefs.current[0] = el; }} position={[-1.38, 0.45, 1.25]}>
          <group ref={frontLeftWheelAssemblyRef}>
            <mesh position={[0.25, 0.08, 0]} rotation={[0, 0, -Math.PI / 6]}>
              <cylinderGeometry args={[0.04, 0.05, 0.5, 8]} />
              {darkChassisMat}
            </mesh>
            <mesh position={[0.25, 0.08, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.25, 8]} />
              {cyanGlowMat}
            </mesh>
            <group ref={(el) => { if (el) wheelSpinRefs.current[0] = el; }}>
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
        </group>

        {/* WHEEL 1: FRONT RIGHT (Steered + Suspended) */}
        <group ref={(el) => { wheelAssemblyRefs.current[1] = el; }} position={[1.38, 0.45, 1.25]}>
          <group ref={frontRightWheelAssemblyRef}>
            <mesh position={[-0.25, 0.08, 0]} rotation={[0, 0, Math.PI / 6]}>
              <cylinderGeometry args={[0.04, 0.05, 0.5, 8]} />
              {darkChassisMat}
            </mesh>
            <mesh position={[-0.25, 0.08, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.25, 8]} />
              {cyanGlowMat}
            </mesh>
            <group ref={(el) => { if (el) wheelSpinRefs.current[1] = el; }}>
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
        </group>

        {/* WHEEL 2: MIDDLE LEFT (Bogie Linkage) */}
        <group ref={(el) => { wheelAssemblyRefs.current[2] = el; }} position={[-1.38, 0.45, 0.05]}>
          <mesh position={[0.25, 0.08, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.04, 0.05, 0.5, 8]} />
            {darkChassisMat}
          </mesh>
          <mesh position={[0.25, 0.08, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.25, 8]} />
            {cyanGlowMat}
          </mesh>
          <group ref={(el) => { if (el) wheelSpinRefs.current[2] = el; }}>
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

        {/* WHEEL 3: MIDDLE RIGHT (Bogie Linkage) */}
        <group ref={(el) => { wheelAssemblyRefs.current[3] = el; }} position={[1.38, 0.45, 0.05]}>
          <mesh position={[-0.25, 0.08, 0]} rotation={[0, 0, Math.PI / 6]}>
            <cylinderGeometry args={[0.04, 0.05, 0.5, 8]} />
            {darkChassisMat}
          </mesh>
          <mesh position={[-0.25, 0.08, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.25, 8]} />
            {cyanGlowMat}
          </mesh>
          <group ref={(el) => { if (el) wheelSpinRefs.current[3] = el; }}>
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

        {/* WHEEL 4: REAR LEFT */}
        <group ref={(el) => { wheelAssemblyRefs.current[4] = el; }} position={[-1.38, 0.45, -1.15]}>
          <mesh position={[0.25, 0.08, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.04, 0.05, 0.5, 8]} />
            {darkChassisMat}
          </mesh>
          <mesh position={[0.25, 0.08, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.25, 8]} />
            {cyanGlowMat}
          </mesh>
          <group ref={(el) => { if (el) wheelSpinRefs.current[4] = el; }}>
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

        {/* WHEEL 5: REAR RIGHT */}
        <group ref={(el) => { wheelAssemblyRefs.current[5] = el; }} position={[1.38, 0.45, -1.15]}>
          <mesh position={[-0.25, 0.08, 0]} rotation={[0, 0, Math.PI / 6]}>
            <cylinderGeometry args={[0.04, 0.05, 0.5, 8]} />
            {darkChassisMat}
          </mesh>
          <mesh position={[-0.25, 0.08, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.25, 8]} />
            {cyanGlowMat}
          </mesh>
          <group ref={(el) => { if (el) wheelSpinRefs.current[5] = el; }}>
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

        {/* ---------------- 6. TIRE REGOLITH DUST PLUMES (GPU PARTICLES) ---------------- */}
        <points ref={dustPointsRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.28}
            color="#D97706"
            transparent
            opacity={0.42}
            depthWrite={false}
          />
        </points>

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
