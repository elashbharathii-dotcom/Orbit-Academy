import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AstronautMeshProps {
  pose?: 'on_foot' | 'seated';
  movementSpeed?: number; // m/s (0 for idle, ~3.8 for walk, ~6.2 for sprint)
  isGrounded?: boolean;
}

/**
 * AAA Astronaut Character Mesh
 * Follows the compact white spacesuit design with large glossy black visor,
 * chest-mounted telemetry panel with illuminated red/cyan LEDs, padded limbs, and
 * procedural idle/walk/run/seated animations.
 */
export const AstronautMesh: React.FC<AstronautMeshProps> = ({
  pose = 'on_foot',
  movementSpeed = 0,
  isGrounded = true,
}) => {
  // Animation node references
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);

  // Animation cycle phase timer
  const animTime = useRef<number>(0);

  useFrame((_, delta) => {
    animTime.current += delta;
    const t = animTime.current;

    if (pose === 'seated') {
      // ---------------- SEATED COCKPIT POSE ----------------
      if (torsoRef.current) {
        torsoRef.current.position.set(0, 0.45, -0.05);
        torsoRef.current.rotation.set(-0.12, 0, 0); // Slight recline in bucket seat
      }
      if (headRef.current) {
        headRef.current.rotation.set(0.12 + Math.sin(t * 1.5) * 0.02, 0, 0);
      }
      // Arms reaching forward onto flight joysticks
      if (leftArmRef.current) {
        leftArmRef.current.rotation.set(-0.75, 0.25, -0.15);
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(-0.75, -0.25, 0.15);
      }
      if (leftForearmRef.current) {
        leftForearmRef.current.rotation.set(-0.4, 0, 0);
      }
      if (rightForearmRef.current) {
        rightForearmRef.current.rotation.set(-0.4, 0, 0);
      }
      // Legs bent at hips and knees in driver position
      if (leftLegRef.current) {
        leftLegRef.current.position.set(-0.2, 0.45, 0.05);
        leftLegRef.current.rotation.set(-1.35, 0.1, 0);
      }
      if (rightLegRef.current) {
        rightLegRef.current.position.set(0.2, 0.45, 0.05);
        rightLegRef.current.rotation.set(-1.35, -0.1, 0);
      }
      return;
    }

    // ---------------- ON FOOT PROCEDURAL ANIMATION ----------------
    const speedRatio = Math.min(1.0, movementSpeed / 5.5);
    const isMoving = movementSpeed > 0.1 && isGrounded;

    // Stride frequency scales with velocity
    const strideFreq = 8.5 * Math.max(0.7, speedRatio);
    const walkCycle = Math.sin(t * strideFreq);

    if (isMoving) {
      // 1. Walk / Run Cycles
      const legAmplitude = 0.65 * (0.6 + speedRatio * 0.6);
      const armAmplitude = 0.55 * (0.6 + speedRatio * 0.6);

      // Legs swing in opposite phases
      if (leftLegRef.current) {
        leftLegRef.current.position.set(-0.22, 0.72, 0);
        leftLegRef.current.rotation.x = walkCycle * legAmplitude;
      }
      if (rightLegRef.current) {
        rightLegRef.current.position.set(0.22, 0.72, 0);
        rightLegRef.current.rotation.x = -walkCycle * legAmplitude;
      }

      // Arms swing counter to legs (human gait mechanics)
      if (leftArmRef.current) {
        leftArmRef.current.rotation.set(-walkCycle * armAmplitude, 0, -0.1);
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(walkCycle * armAmplitude, 0, 0.1);
      }

      // Vertical stride bobbing & forward torso lean
      const verticalBob = Math.abs(Math.sin(t * strideFreq)) * 0.06;
      if (torsoRef.current) {
        torsoRef.current.position.set(0, 0.85 + verticalBob, 0);
        torsoRef.current.rotation.set(0.08 + speedRatio * 0.12, 0, Math.sin(t * strideFreq * 0.5) * 0.04);
      }
    } else {
      // 2. Idle Breathing & Micro-sway
      const breathe = Math.sin(t * 2.2);
      if (torsoRef.current) {
        torsoRef.current.position.set(0, 0.85 + breathe * 0.015, 0);
        torsoRef.current.rotation.set(0.02, 0, Math.sin(t * 1.1) * 0.01);
      }
      if (headRef.current) {
        headRef.current.rotation.set(-0.02 + breathe * 0.02, Math.sin(t * 0.8) * 0.03, 0);
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.set(0.05 + breathe * 0.03, 0, -0.12);
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(0.05 + breathe * 0.03, 0, 0.12);
      }
      if (leftLegRef.current) {
        leftLegRef.current.position.set(-0.22, 0.72, 0);
        leftLegRef.current.rotation.set(0, 0, -0.04);
      }
      if (rightLegRef.current) {
        rightLegRef.current.position.set(0.22, 0.72, 0);
        rightLegRef.current.rotation.set(0, 0, 0.04);
      }
    }

    // Airborne / Jump Pose
    if (!isGrounded) {
      if (leftLegRef.current) leftLegRef.current.rotation.set(0.35, 0, -0.1);
      if (rightLegRef.current) rightLegRef.current.rotation.set(-0.2, 0, 0.1);
      if (leftArmRef.current) leftArmRef.current.rotation.set(-0.4, 0, -0.3);
      if (rightArmRef.current) rightArmRef.current.rotation.set(-0.4, 0, 0.3);
    }
  });

  // Materials definitions
  const whiteSuitMat = (
    <meshStandardMaterial
      color="#F8FAFC"
      roughness={0.42}
      metalness={0.12}
    />
  );
  const darkGreyTrimMat = (
    <meshStandardMaterial
      color="#334155"
      roughness={0.5}
      metalness={0.4}
    />
  );
  const glossyBlackVisorMat = (
    <meshStandardMaterial
      color="#030712"
      roughness={0.02}
      metalness={0.96}
    />
  );

  return (
    <group name="AstronautCharacter">
      {/* ---------------- UPPER BODY & HEAD HIERARCHY ---------------- */}
      <group ref={torsoRef} position={[0, 0.85, 0]}>
        {/* Main Padded Torso */}
        <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
          <capsuleGeometry args={[0.34, 0.48, 8, 16]} />
          {whiteSuitMat}
        </mesh>

        {/* Reinforced Shoulder Yoke / Harness */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.38, 0.14, 16]} />
          {darkGreyTrimMat}
        </mesh>

        {/* ---------------- HELMET & GLOSSY BLACK VISOR ---------------- */}
        <group ref={headRef} position={[0, 0.62, 0]}>
          {/* Large Rounded Spacesuit Helmet */}
          <mesh castShadow>
            <sphereGeometry args={[0.38, 24, 24]} />
            {whiteSuitMat}
          </mesh>

          {/* Helmet Base Seal Collar */}
          <mesh position={[0, -0.25, 0]} castShadow>
            <torusGeometry args={[0.32, 0.05, 8, 24]} />
            {darkGreyTrimMat}
          </mesh>

          {/* Large Glossy Dark Reflective Visor Shield */}
          <mesh position={[0, 0.03, 0.18]}>
            <sphereGeometry args={[0.31, 24, 24, 0, Math.PI, 0, Math.PI * 0.72]} />
            {glossyBlackVisorMat}
          </mesh>

          {/* Visor Bezel Frame Rim */}
          <mesh position={[0, 0.03, 0.2]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.29, 0.03, 8, 24]} />
            {darkGreyTrimMat}
          </mesh>

          {/* Side Communication Audio Pods / O2 Filter Valves */}
          <mesh position={[-0.38, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.11, 0.08, 12]} />
            {darkGreyTrimMat}
          </mesh>
          <mesh position={[0.38, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.11, 0.08, 12]} />
            {darkGreyTrimMat}
          </mesh>

          {/* Top Helmet Exploration Spotlight */}
          <group position={[0, 0.36, 0.14]}>
            <mesh castShadow>
              <boxGeometry args={[0.14, 0.08, 0.12]} />
              {darkGreyTrimMat}
            </mesh>
            <mesh position={[0, 0, 0.065]}>
              <circleGeometry args={[0.04, 12]} />
              <meshBasicMaterial color="#FEF08A" />
            </mesh>
            <spotLight
              position={[0, 0, 0.1]}
              angle={0.65}
              penumbra={0.5}
              intensity={1.2}
              color="#FEF08A"
              distance={18}
              castShadow
            />
          </group>
        </group>

        {/* ---------------- CHEST-MOUNTED LIFE-SUPPORT CONTROL PANEL ---------------- */}
        <group position={[0, 0.22, 0.32]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.22, 0.08]} />
            {darkGreyTrimMat}
          </mesh>

          {/* Cyan Telemetry Status Display Screen */}
          <mesh position={[0, 0.04, 0.045]}>
            <planeGeometry args={[0.22, 0.08]} />
            <meshBasicMaterial color="#06B6D4" />
          </mesh>

          {/* Small Illuminated Suit Controls (Red and Cyan LEDs) */}
          <mesh position={[-0.08, -0.06, 0.045]}>
            <circleGeometry args={[0.018, 8]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
          <mesh position={[-0.03, -0.06, 0.045]}>
            <circleGeometry args={[0.018, 8]} />
            <meshBasicMaterial color="#06B6D4" />
          </mesh>
          <mesh position={[0.02, -0.06, 0.045]}>
            <circleGeometry args={[0.018, 8]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>
          <mesh position={[0.07, -0.06, 0.045]}>
            <circleGeometry args={[0.018, 8]} />
            <meshBasicMaterial color="#F59E0B" />
          </mesh>
        </group>

        {/* ---------------- BACKPACK LIFE-SUPPORT SYSTEM (PLSS) ---------------- */}
        <group position={[0, 0.22, -0.34]}>
          <mesh castShadow>
            <boxGeometry args={[0.48, 0.62, 0.24]} />
            {whiteSuitMat}
          </mesh>

          {/* Dual Oxygen Storage Tanks on Backpack */}
          <mesh position={[-0.14, 0, -0.1]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.54, 12]} />
            {darkGreyTrimMat}
          </mesh>
          <mesh position={[0.14, 0, -0.1]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.54, 12]} />
            {darkGreyTrimMat}
          </mesh>

          {/* Emergency Thruster Micro-Nozzles */}
          <mesh position={[-0.18, 0.24, -0.08]} rotation={[Math.PI / 4, 0, 0]}>
            <coneGeometry args={[0.035, 0.07, 8]} />
            {darkGreyTrimMat}
          </mesh>
          <mesh position={[0.18, 0.24, -0.08]} rotation={[Math.PI / 4, 0, 0]}>
            <coneGeometry args={[0.035, 0.07, 8]} />
            {darkGreyTrimMat}
          </mesh>
        </group>

        {/* ---------------- PADDED ARMS & GLOVES ---------------- */}
        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.42, 0.36, 0]}>
          {/* Shoulder Pad */}
          <mesh castShadow>
            <sphereGeometry args={[0.14, 12, 12]} />
            {whiteSuitMat}
          </mesh>
          {/* Upper Arm */}
          <mesh position={[0, -0.18, 0]} castShadow>
            <capsuleGeometry args={[0.11, 0.24, 6, 12]} />
            {whiteSuitMat}
          </mesh>
          {/* Forearm & Glove */}
          <group ref={leftForearmRef} position={[0, -0.32, 0]}>
            <mesh position={[0, -0.14, 0]} castShadow>
              <capsuleGeometry args={[0.1, 0.2, 6, 12]} />
              {whiteSuitMat}
            </mesh>
            {/* Padded Glove */}
            <mesh position={[0, -0.28, 0]} castShadow>
              <sphereGeometry args={[0.11, 8, 8]} />
              {darkGreyTrimMat}
            </mesh>
          </group>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.42, 0.36, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.14, 12, 12]} />
            {whiteSuitMat}
          </mesh>
          <mesh position={[0, -0.18, 0]} castShadow>
            <capsuleGeometry args={[0.11, 0.24, 6, 12]} />
            {whiteSuitMat}
          </mesh>
          <group ref={rightForearmRef} position={[0, -0.32, 0]}>
            <mesh position={[0, -0.14, 0]} castShadow>
              <capsuleGeometry args={[0.1, 0.2, 6, 12]} />
              {whiteSuitMat}
            </mesh>
            <mesh position={[0, -0.28, 0]} castShadow>
              <sphereGeometry args={[0.11, 8, 8]} />
              {darkGreyTrimMat}
            </mesh>
          </group>
        </group>
      </group>

      {/* ---------------- PADDED LEGS & HEAVY BOOTS ---------------- */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.22, 0.72, 0]}>
        {/* Upper Leg with Knee Pad */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.13, 0.28, 6, 12]} />
          {whiteSuitMat}
        </mesh>
        <mesh position={[0, -0.26, 0.12]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.08]} />
          {darkGreyTrimMat}
        </mesh>
        {/* Lower Leg */}
        <mesh position={[0, -0.44, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.22, 6, 12]} />
          {whiteSuitMat}
        </mesh>
        {/* Mars Exploration Heavy Boot */}
        <group position={[0, -0.65, 0.06]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.2, 0.14, 0.32]} />
            {darkGreyTrimMat}
          </mesh>
          {/* Cleated Tread Sole */}
          <mesh position={[0, -0.08, 0]} receiveShadow>
            <boxGeometry args={[0.22, 0.04, 0.34]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.22, 0.72, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.13, 0.28, 6, 12]} />
          {whiteSuitMat}
        </mesh>
        <mesh position={[0, -0.26, 0.12]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.08]} />
          {darkGreyTrimMat}
        </mesh>
        <mesh position={[0, -0.44, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.22, 6, 12]} />
          {whiteSuitMat}
        </mesh>
        <group position={[0, -0.65, 0.06]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.2, 0.14, 0.32]} />
            {darkGreyTrimMat}
          </mesh>
          <mesh position={[0, -0.08, 0]} receiveShadow>
            <boxGeometry args={[0.22, 0.04, 0.34]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
