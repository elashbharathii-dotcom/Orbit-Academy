import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { getTerrainHeight } from './MarsTerrain';

export const RobotCompanion: React.FC = () => {
  const robotState = useMarsGameStore((state) => state.robotState);
  const playerPos = useMarsGameStore((state) => state.playerPosition);
  const isInsideHab = useMarsGameStore((state) => state.isInsideHab);
  const updateRobotState = useMarsGameStore((state) => state.updateRobotState);

  const groupRef = useRef<THREE.Group>(null);
  const sensorHeadRef = useRef<THREE.Group>(null);
  const manipulatorArmRef = useRef<THREE.Group>(null);
  const eyeLightRef = useRef<THREE.PointLight>(null);
  const wheelRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lastSyncTime = useRef<number>(0);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);
    if (!groupRef.current) return;

    let { position, heading, speed, batteryPercent, mode, isCharging, dockPosition } = robotState;
    let [x, y, z] = position;

    // 1. Charging logic at dock
    const distToDock = Math.hypot(x - dockPosition[0], z - dockPosition[2]);
    if (distToDock < 1.0 && (mode === 'return_to_dock' || mode === 'idle')) {
      isCharging = true;
      batteryPercent = Math.min(100, batteryPercent + clampedDelta * 3.5);
    } else {
      isCharging = false;
      if (speed > 0.05) {
        batteryPercent = Math.max(0, batteryPercent - clampedDelta * 0.12);
      }
    }

    // Auto-return to dock if battery critically low (< 15%)
    if (batteryPercent < 15.0 && mode !== 'return_to_dock' && !isCharging) {
      mode = 'return_to_dock';
      useMarsGameStore.getState().showNotification('AERO-BOT BATTERY LOW: Returning to Outpost Alpha dock for recharge.');
    }

    // 2. Navigation & Autonomous Pathing
    let targetX = x;
    let targetZ = z;
    let stopDist = 1.0;
    const MAX_ROBOT_SPEED = 2.4; // m/s

    if (mode === 'follow_player') {
      targetX = playerPos[0];
      targetZ = playerPos[2];
      stopDist = 2.5; // Keep safe 2.5m distance from astronaut
    } else if (mode === 'return_to_dock') {
      targetX = dockPosition[0];
      targetZ = dockPosition[2];
      stopDist = 0.4;
    } else if (mode === 'transporting') {
      // Handled via transport task updates
      stopDist = 1.0;
    }

    const dx = targetX - x;
    const dz = targetZ - z;
    const distToTarget = Math.hypot(dx, dz);

    if (distToTarget > stopDist && mode !== 'idle') {
      // Turn towards target
      const targetHeading = Math.atan2(dx, dz);
      let angleDiff = targetHeading - heading;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      heading += angleDiff * Math.min(1.0, clampedDelta * 4.5);

      // Accelerate forward
      const targetSpeed = Math.min(MAX_ROBOT_SPEED, (distToTarget - stopDist) * 1.5);
      speed = THREE.MathUtils.lerp(speed, targetSpeed, clampedDelta * 5.0);

      const vx = Math.sin(heading) * speed * clampedDelta;
      const vz = Math.cos(heading) * speed * clampedDelta;

      x += vx;
      z += vz;
    } else {
      // Smooth deceleration to stop
      speed = THREE.MathUtils.lerp(speed, 0, clampedDelta * 6.0);
      if (mode === 'return_to_dock' && distToTarget <= stopDist) {
        mode = 'idle';
      }
    }

    // 3. Terrain Altitude & Interior Level Resolution
    if (isInsideHab) {
      y = 0.85; // Habitat interior deck level
    } else {
      y = getTerrainHeight(x, z) + 0.35;
    }

    // Update 3D Group Transform
    groupRef.current.position.set(x, y, z);
    groupRef.current.rotation.y = heading;

    // 4. Optical Sensor Head Tracking
    if (sensorHeadRef.current) {
      const pDx = playerPos[0] - x;
      const pDz = playerPos[2] - z;
      const playerAngle = Math.atan2(pDx, pDz) - heading;
      sensorHeadRef.current.rotation.y = THREE.MathUtils.clamp(playerAngle, -1.2, 1.2);
    }

    // 5. Wheel Spin Rotation
    const spinDelta = (speed / 0.18) * clampedDelta;
    wheelRefs.current.forEach((w) => {
      if (w) w.rotation.x += spinDelta;
    });

    // 6. Manipulator Arm Idle Hover Oscillation
    if (manipulatorArmRef.current) {
      const t = Date.now() * 0.003;
      manipulatorArmRef.current.rotation.x = 0.2 + Math.sin(t) * 0.08;
    }

    // 7. Eye Glow Pulse
    if (eyeLightRef.current) {
      eyeLightRef.current.intensity = isCharging
        ? 0.4 + Math.sin(Date.now() * 0.005) * 0.3
        : 0.8;
    }

    // Sync back to store throttled at ~7Hz to preserve 60FPS render budget
    const now = performance.now();
    if (now - lastSyncTime.current > 150 || mode !== robotState.mode || isCharging !== robotState.isCharging) {
      lastSyncTime.current = now;
      updateRobotState({
        position: [x, y, z],
        heading,
        speed,
        batteryPercent,
        mode,
        isCharging,
      });
    }
  });

  const getStatusColor = () => {
    if (robotState.isCharging) return '#10B981'; // Green
    if (robotState.batteryPercent < 20) return '#EF4444'; // Red
    if (robotState.mode === 'transporting') return '#F59E0B'; // Amber
    return '#00F0FF'; // Cyan
  };

  const statusColor = getStatusColor();

  return (
    <group ref={groupRef} name="RobotCompanionGroup">
      {/* Robot Main Body Chassis */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.3, 0.9]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Armored Upper Shell */}
      <mesh position={[0, 0.42, -0.05]} castShadow>
        <boxGeometry args={[0.55, 0.14, 0.65]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Status LED Ring Indicator */}
      <mesh position={[0, 0.49, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.22, 24]} />
        <meshBasicMaterial color={statusColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Optical Sensor Mast Head */}
      <group ref={sensorHeadRef} position={[0, 0.52, 0.2]}>
        {/* Swivel Neck */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.12, 16]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Sensor Eyeball Pod */}
        <mesh position={[0, 0.16, 0]} castShadow>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Glowing Optical Camera Lens */}
        <mesh position={[0, 0.16, 0.12]}>
          <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
          <meshBasicMaterial color={statusColor} />
        </mesh>
        <pointLight ref={eyeLightRef} position={[0, 0.16, 0.2]} color={statusColor} intensity={0.7} distance={2.5} />
      </group>

      {/* Front Manipulator Arm */}
      <group ref={manipulatorArmRef} position={[0.22, 0.32, 0.38]}>
        <mesh position={[0, 0, 0.12]} rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.24, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Gripper Pincers */}
        <mesh position={[0, -0.05, 0.24]}>
          <boxGeometry args={[0.08, 0.04, 0.06]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Rear Cargo Container / Material Hopper */}
      <group position={[0, 0.44, -0.28]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.18, 0.28]} />
          <meshStandardMaterial color="#0F172A" metalness={0.5} roughness={0.6} />
        </mesh>
        {/* Payload Visual if transporting */}
        {robotState.payload && (
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.35, 0.12, 0.2]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.3} metalness={0.6} />
          </mesh>
        )}
      </group>

      {/* 4 Heavy-Duty All-Terrain Wheels */}
      {/* Front-Left */}
      <mesh
        ref={(el) => (wheelRefs.current[0] = el)}
        position={[-0.42, 0.14, 0.26]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.16, 0.16, 0.14, 18]} />
        <meshStandardMaterial color="#0A0D14" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Front-Right */}
      <mesh
        ref={(el) => (wheelRefs.current[1] = el)}
        position={[0.42, 0.14, 0.26]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.16, 0.16, 0.14, 18]} />
        <meshStandardMaterial color="#0A0D14" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Rear-Left */}
      <mesh
        ref={(el) => (wheelRefs.current[2] = el)}
        position={[-0.42, 0.14, -0.26]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.16, 0.16, 0.14, 18]} />
        <meshStandardMaterial color="#0A0D14" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Rear-Right */}
      <mesh
        ref={(el) => (wheelRefs.current[3] = el)}
        position={[0.42, 0.14, -0.26]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.16, 0.16, 0.14, 18]} />
        <meshStandardMaterial color="#0A0D14" roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  );
};
