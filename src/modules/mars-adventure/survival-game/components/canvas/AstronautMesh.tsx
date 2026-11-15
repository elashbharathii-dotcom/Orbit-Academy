import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type AstronautAnimState =
  | 'idle'
  | 'walking'
  | 'running'
  | 'jumping'
  | 'falling'
  | 'landing'
  | 'interacting'
  | 'scanning'
  | 'collecting'
  | 'entering_rover'
  | 'exiting_rover'
  | 'seated';

export interface AstronautMeshProps {
  pose?: 'on_foot' | 'seated';
  animState?: AstronautAnimState;
  movementSpeed?: number; // m/s (0 for idle, ~3.8 for walk, ~6.2 for sprint)
  isGrounded?: boolean;
  verticalVelocity?: number;
  justLanded?: boolean;
  isScanning?: boolean;
  isInteracting?: boolean;
  isCollecting?: boolean;
  onFootstep?: (isLeftFoot: boolean) => void;
}

/**
 * AAA Astronaut Character Mesh with 11-State Procedural Kinematics
 * Features:
 * - Smooth multi-layer animation blending (Idle, Walk, Run, Jump, Fall, Land, Interact, Scan, Collect, Seated)
 * - Dynamic stride frequency locked to physics velocity
 * - Ground footfall detection for procedural footstep audio
 * - PBR materials with high-specular visor, ballistic nylon suit weave, and illuminated LED telemetry
 */
export const AstronautMesh: React.FC<AstronautMeshProps> = ({
  pose = 'on_foot',
  animState,
  movementSpeed = 0,
  isGrounded = true,
  verticalVelocity = 0,
  justLanded = false,
  isScanning = false,
  isInteracting = false,
  isCollecting = false,
  onFootstep,
}) => {
  // Rigged hierarchy references
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);
  const scannerToolRef = useRef<THREE.Group>(null);
  const visorGlowRef = useRef<THREE.Mesh>(null);

  // Animation cycle phase timer & smooth transition blend weights
  const animTime = useRef<number>(0);
  const moveWeight = useRef<number>(0);
  const runWeight = useRef<number>(0);
  const jumpWeight = useRef<number>(0);
  const fallWeight = useRef<number>(0);
  const landWeight = useRef<number>(0);
  const scanWeight = useRef<number>(0);
  const interactWeight = useRef<number>(0);
  const collectWeight = useRef<number>(0);

  const prevWalkCycle = useRef<number>(0);
  const prevGrounded = useRef<boolean>(true);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);
    animTime.current += clampedDelta;
    const t = animTime.current;

    // Detect landing impact event
    if ((!prevGrounded.current && isGrounded) || justLanded) {
      landWeight.current = 1.0;
    }
    prevGrounded.current = isGrounded;

    // Decay landing compression spring
    if (landWeight.current > 0) {
      landWeight.current = Math.max(0, landWeight.current - clampedDelta * 4.8);
    }

    if (pose === 'seated') {
      // ---------------- SEATED COCKPIT POSE ----------------
      if (torsoRef.current) {
        torsoRef.current.position.set(0, 0.45, -0.05);
        torsoRef.current.rotation.set(-0.12, 0, 0); // Slight recline in bucket seat
      }
      if (headRef.current) {
        headRef.current.rotation.set(0.12 + Math.sin(t * 1.5) * 0.02, 0, 0);
      }
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

    // ---------------- ACTIVE STATE WEIGHT TARGETS ----------------
    // Automatically infer state if not explicitly forced
    const targetMove = isGrounded && movementSpeed > 0.15 ? 1.0 : 0.0;
    const targetRun = isGrounded && movementSpeed > 4.2 ? 1.0 : 0.0;
    const isJumping = !isGrounded && verticalVelocity > 0.2;
    const isFalling = !isGrounded && verticalVelocity <= 0.2;
    const targetJump = isJumping ? 1.0 : 0.0;
    const targetFall = isFalling ? 1.0 : 0.0;
    const targetScan = isScanning || animState === 'scanning' ? 1.0 : 0.0;
    const targetInteract = isInteracting || animState === 'interacting' ? 1.0 : 0.0;
    const targetCollect = isCollecting || animState === 'collecting' ? 1.0 : 0.0;

    // Smooth lerp blend weights
    moveWeight.current = THREE.MathUtils.lerp(moveWeight.current, targetMove, clampedDelta * 12.0);
    runWeight.current = THREE.MathUtils.lerp(runWeight.current, targetRun, clampedDelta * 10.0);
    jumpWeight.current = THREE.MathUtils.lerp(jumpWeight.current, targetJump, clampedDelta * 14.0);
    fallWeight.current = THREE.MathUtils.lerp(fallWeight.current, targetFall, clampedDelta * 12.0);
    scanWeight.current = THREE.MathUtils.lerp(scanWeight.current, targetScan, clampedDelta * 10.0);
    interactWeight.current = THREE.MathUtils.lerp(interactWeight.current, targetInteract, clampedDelta * 12.0);
    collectWeight.current = THREE.MathUtils.lerp(collectWeight.current, targetCollect, clampedDelta * 10.0);

    const mw = moveWeight.current;
    const rw = runWeight.current;
    const jw = jumpWeight.current;
    const fw = fallWeight.current;
    const land = landWeight.current;
    const sw = scanWeight.current;
    const iw = interactWeight.current;
    const cw = collectWeight.current;

    // 1. Idle Base Layer (Breathing & Micro-sway)
    const breathe = Math.sin(t * 2.2);
    const idleTorsoY = 0.85 + breathe * 0.014;
    const idleTorsoRotX = 0.02;
    const idleTorsoRotZ = Math.sin(t * 1.1) * 0.012;
    const idleHeadRotX = -0.02 + breathe * 0.02;
    const idleHeadRotY = Math.sin(t * 0.8) * 0.03;
    const idleLeftArmRotX = 0.05 + breathe * 0.03;
    const idleRightArmRotX = 0.05 + breathe * 0.03;

    // 2. Walk / Run Cycles
    const speedRatio = Math.min(1.0, movementSpeed / 5.5);
    const strideFreq = 8.5 * Math.max(0.7, speedRatio);
    const walkCycle = Math.sin(t * strideFreq);

    // Footstep event detection on stride zero crossing
    if (mw > 0.4 && isGrounded) {
      if (prevWalkCycle.current < 0 && walkCycle >= 0) {
        onFootstep?.(false); // Right foot contact
      } else if (prevWalkCycle.current > 0 && walkCycle <= 0) {
        onFootstep?.(true); // Left foot contact
      }
    }
    prevWalkCycle.current = walkCycle;

    const legAmp = (0.58 + rw * 0.32) * (0.6 + speedRatio * 0.6);
    const armAmp = (0.52 + rw * 0.28) * (0.6 + speedRatio * 0.6);
    const verticalBob = Math.abs(Math.sin(t * strideFreq)) * (0.05 + rw * 0.03);

    const locTorsoY = 0.85 + verticalBob;
    const locTorsoRotX = 0.08 + speedRatio * 0.16;
    const locTorsoRotZ = Math.sin(t * strideFreq * 0.5) * 0.045;

    // 3. Jump (Upward) vs Fall (Downward) Poses
    const jumpLegLeftRotX = 0.38;
    const jumpLegRightRotX = -0.25;
    const jumpArmRotX = -0.55;

    // Falling descent: limbs splayed outward, body braced
    const fallLegLeftRotX = 0.15;
    const fallLegRightRotX = 0.12;
    const fallArmLeftRotX = -0.35;
    const fallArmRightRotX = -0.35;
    const fallArmZ = 0.45; // Arms out wide for air balance

    // 4. Landing Impact Compression
    const landHipDrop = -0.14 * land;
    const landTorsoLean = 0.22 * land;
    const landKneeBend = 0.35 * land;

    // 5. Interacting / Pressing Console
    const interactArmX = -1.15; // Right arm reaching straight forward
    const interactArmY = -0.2;

    // 6. Scanning Pose (Left arm raised to chest, looking at wrist HUD)
    const scanArmX = -1.25;
    const scanForearmX = -0.85;
    const scanHeadRotX = 0.25; // Looking down at scanner display

    // 7. Collecting / Crouching Pose
    const collectHipDrop = -0.38 * cw;
    const collectTorsoLean = 0.45 * cw;
    const collectRightArmX = -0.85 * cw; // Hand reaching to ground

    // Composite Weighted Pose Integration
    // Torso Position & Rotation
    if (torsoRef.current) {
      const baseY = THREE.MathUtils.lerp(idleTorsoY, locTorsoY, mw);
      const airY = THREE.MathUtils.lerp(baseY, 0.88, Math.max(jw, fw));
      const finalY = airY + landHipDrop + collectHipDrop;

      const baseRotX = THREE.MathUtils.lerp(idleTorsoRotX, locTorsoRotX, mw);
      const airRotX = THREE.MathUtils.lerp(baseRotX, jw * -0.08 + fw * 0.12, Math.max(jw, fw));
      const finalRotX = airRotX + landTorsoLean + collectTorsoLean;

      torsoRef.current.position.set(0, finalY, 0);
      torsoRef.current.rotation.set(
        finalRotX,
        0,
        THREE.MathUtils.lerp(idleTorsoRotZ, locTorsoRotZ, mw)
      );
    }

    // Head
    if (headRef.current) {
      headRef.current.rotation.set(
        THREE.MathUtils.lerp(idleHeadRotX, scanHeadRotX, sw),
        THREE.MathUtils.lerp(idleHeadRotY, 0, mw),
        0
      );
    }

    // Legs
    if (leftLegRef.current) {
      const walkRotX = walkCycle * legAmp;
      const baseLegX = THREE.MathUtils.lerp(0, walkRotX, mw);
      const airLegX = THREE.MathUtils.lerp(baseLegX, jw * jumpLegLeftRotX + fw * fallLegLeftRotX, Math.max(jw, fw));
      const collectLegBend = cw * 0.75;
      leftLegRef.current.position.set(-0.22, 0.72 + landHipDrop * 0.6 + collectHipDrop * 0.5, 0);
      leftLegRef.current.rotation.set(airLegX + landKneeBend + collectLegBend, 0, -0.04);
    }

    if (rightLegRef.current) {
      const walkRotX = -walkCycle * legAmp;
      const baseLegX = THREE.MathUtils.lerp(0, walkRotX, mw);
      const airLegX = THREE.MathUtils.lerp(baseLegX, jw * jumpLegRightRotX + fw * fallLegRightRotX, Math.max(jw, fw));
      const collectLegBend = cw * 1.1; // Kneeling forward
      rightLegRef.current.position.set(0.22, 0.72 + landHipDrop * 0.6 + collectHipDrop * 0.5, 0);
      rightLegRef.current.rotation.set(airLegX + landKneeBend + collectLegBend, 0, 0.04);
    }

    // Left Arm
    if (leftArmRef.current) {
      const walkArmX = -walkCycle * armAmp;
      const baseArmX = THREE.MathUtils.lerp(idleLeftArmRotX, walkArmX, mw);
      const airArmX = THREE.MathUtils.lerp(baseArmX, jw * jumpArmRotX + fw * fallArmLeftRotX, Math.max(jw, fw));
      const finalArmX = THREE.MathUtils.lerp(airArmX, scanArmX, sw);
      const finalArmZ = THREE.MathUtils.lerp(-0.12, -fallArmZ, fw);
      leftArmRef.current.rotation.set(finalArmX, sw * 0.35, finalArmZ);
    }

    if (leftForearmRef.current) {
      leftForearmRef.current.rotation.set(sw * scanForearmX, 0, 0);
    }

    // Right Arm
    if (rightArmRef.current) {
      const walkArmX = walkCycle * armAmp;
      const baseArmX = THREE.MathUtils.lerp(idleRightArmRotX, walkArmX, mw);
      const airArmX = THREE.MathUtils.lerp(baseArmX, jw * jumpArmRotX + fw * fallArmRightRotX, Math.max(jw, fw));
      const actionArmX = THREE.MathUtils.lerp(airArmX, interactArmX, iw);
      const finalArmX = THREE.MathUtils.lerp(actionArmX, collectRightArmX, cw);
      const finalArmZ = THREE.MathUtils.lerp(0.12, fallArmZ, fw);
      rightArmRef.current.rotation.set(finalArmX, iw * interactArmY, finalArmZ);
    }

    // Visor HUD Reflection Glow
    if (visorGlowRef.current) {
      const targetOpacity = sw > 0.1 ? 0.85 : 0.15;
      const mat = visorGlowRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, clampedDelta * 10.0);
      }
    }
  });

  // Common High-Fidelity PBR Materials
  const whiteSuitMat = (
    <meshStandardMaterial
      color="#F8FAFC"
      roughness={0.38}
      metalness={0.08}
    />
  );
  const darkGreyTrimMat = (
    <meshStandardMaterial
      color="#1E293B"
      roughness={0.55}
      metalness={0.35}
    />
  );
  const glossyBlackVisorMat = (
    <meshStandardMaterial
      color="#050811"
      roughness={0.03}
      metalness={0.96}
    />
  );
  const goldTrimMat = (
    <meshStandardMaterial
      color="#F59E0B"
      roughness={0.25}
      metalness={0.8}
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

        {/* Chest Telemetry Avionics Panel */}
        <group position={[0, 0.24, 0.32]}>
          <mesh castShadow>
            <boxGeometry args={[0.32, 0.24, 0.08]} />
            {darkGreyTrimMat}
          </mesh>
          {/* LED Status Indicators */}
          <mesh position={[-0.1, 0.05, 0.045]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
          <mesh position={[0, 0.05, 0.045]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>
          <mesh position={[0.1, 0.05, 0.045]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color="#F59E0B" />
          </mesh>
          {/* Life Support Vitals Gauge Screen */}
          <mesh position={[0, -0.04, 0.045]}>
            <planeGeometry args={[0.24, 0.08]} />
            <meshBasicMaterial color="#0284C7" />
          </mesh>
        </group>

        {/* Life-Support Backpack (PLSS) */}
        <group position={[0, 0.25, -0.32]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.62, 0.26]} />
            {whiteSuitMat}
          </mesh>
          {/* Dual O2 Pressure Cylinders on top */}
          {[-0.12, 0.12].map((xOff, i) => (
            <mesh key={i} position={[xOff, 0.32, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.07, 0.22, 12]} />
              {goldTrimMat}
            </mesh>
          ))}
          {/* Radiator Vent Grille */}
          <mesh position={[0, -0.1, -0.135]}>
            <planeGeometry args={[0.36, 0.22]} />
            {darkGreyTrimMat}
          </mesh>
        </group>

        {/* Shoulder Harness Pads */}
        {[-0.34, 0.34].map((xOff, i) => (
          <mesh key={i} position={[xOff, 0.38, 0]} castShadow>
            <boxGeometry args={[0.14, 0.1, 0.22]} />
            {darkGreyTrimMat}
          </mesh>
        ))}

        {/* ---------------- HELMET & VISOR ---------------- */}
        <group ref={headRef} position={[0, 0.62, 0]}>
          {/* Spherical Helmet Shell */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.29, 20, 20]} />
            {whiteSuitMat}
          </mesh>

          {/* Large Glossy Visor Bubble */}
          <mesh position={[0, 0.02, 0.14]} rotation={[0.1, 0, 0]}>
            <sphereGeometry args={[0.23, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
            {glossyBlackVisorMat}
          </mesh>

          {/* Visor HUD Cyan Holographic Reflection */}
          <mesh ref={visorGlowRef} position={[0, 0.02, 0.15]} rotation={[0.1, 0, 0]}>
            <sphereGeometry args={[0.228, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshBasicMaterial
              color="#00F0FF"
              wireframe
              transparent
              opacity={0.15}
            />
          </mesh>

          {/* Twin Helmet EVA Spotlights */}
          {[-0.26, 0.26].map((xOff, i) => (
            <group key={i} position={[xOff, 0.05, 0.08]} rotation={[0, xOff > 0 ? -0.15 : 0.15, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.035, 0.045, 0.08, 10]} />
                {darkGreyTrimMat}
              </mesh>
              <mesh position={[0, 0.042, 0]}>
                <circleGeometry args={[0.032, 12]} />
                <meshBasicMaterial color="#E0F2FE" />
              </mesh>
            </group>
          ))}
        </group>

        {/* ---------------- ARMS ---------------- */}
        {/* Left Arm Assembly */}
        <group ref={leftArmRef} position={[-0.42, 0.38, 0]}>
          <mesh castShadow receiveShadow position={[0, -0.14, 0]}>
            <cylinderGeometry args={[0.095, 0.085, 0.28, 12]} />
            {whiteSuitMat}
          </mesh>
          <mesh position={[0, -0.28, 0]}>
            <sphereGeometry args={[0.085, 10, 10]} />
            {darkGreyTrimMat}
          </mesh>
          {/* Left Forearm (With Wrist Scanner Display) */}
          <group ref={leftForearmRef} position={[0, -0.28, 0]}>
            <mesh castShadow receiveShadow position={[0, -0.14, 0]}>
              <cylinderGeometry args={[0.08, 0.075, 0.26, 12]} />
              {whiteSuitMat}
            </mesh>
            {/* Wrist HUD Hologram Tool */}
            <group ref={scannerToolRef} position={[-0.04, -0.1, 0.06]} rotation={[0.2, 0, 0]}>
              <mesh>
                <boxGeometry args={[0.08, 0.12, 0.03]} />
                {darkGreyTrimMat}
              </mesh>
              <mesh position={[0, 0, 0.02]}>
                <planeGeometry args={[0.06, 0.09]} />
                <meshBasicMaterial color="#00F0FF" />
              </mesh>
            </group>
            {/* Glove */}
            <mesh castShadow position={[0, -0.28, 0]}>
              <sphereGeometry args={[0.075, 10, 10]} />
              {darkGreyTrimMat}
            </mesh>
          </group>
        </group>

        {/* Right Arm Assembly */}
        <group ref={rightArmRef} position={[0.42, 0.38, 0]}>
          <mesh castShadow receiveShadow position={[0, -0.14, 0]}>
            <cylinderGeometry args={[0.095, 0.085, 0.28, 12]} />
            {whiteSuitMat}
          </mesh>
          <mesh position={[0, -0.28, 0]}>
            <sphereGeometry args={[0.085, 10, 10]} />
            {darkGreyTrimMat}
          </mesh>
          {/* Right Forearm & Glove */}
          <group ref={rightForearmRef} position={[0, -0.28, 0]}>
            <mesh castShadow receiveShadow position={[0, -0.14, 0]}>
              <cylinderGeometry args={[0.08, 0.075, 0.26, 12]} />
              {whiteSuitMat}
            </mesh>
            <mesh castShadow position={[0, -0.28, 0]}>
              <sphereGeometry args={[0.075, 10, 10]} />
              {darkGreyTrimMat}
            </mesh>
          </group>
        </group>
      </group>

      {/* ---------------- LOWER LEGS & BOOTS ---------------- */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.22, 0.72, 0]}>
        {/* Thigh */}
        <mesh castShadow receiveShadow position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.115, 0.095, 0.32, 12]} />
          {whiteSuitMat}
        </mesh>
        {/* Knee Joint */}
        <mesh position={[0, -0.32, 0.02]}>
          <sphereGeometry args={[0.095, 10, 10]} />
          {darkGreyTrimMat}
        </mesh>
        {/* Calf */}
        <mesh castShadow receiveShadow position={[0, -0.48, 0]}>
          <cylinderGeometry args={[0.095, 0.09, 0.32, 12]} />
          {whiteSuitMat}
        </mesh>
        {/* Heavy Tread EVA Boot */}
        <group position={[0, -0.66, 0.06]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.18, 0.14, 0.34]} />
            {darkGreyTrimMat}
          </mesh>
          {/* Deep Cleated Boot Sole */}
          <mesh position={[0, -0.08, 0]}>
            <boxGeometry args={[0.19, 0.04, 0.35]} />
            <meshStandardMaterial color="#0B0F19" roughness={0.95} />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.22, 0.72, 0]}>
        {/* Thigh */}
        <mesh castShadow receiveShadow position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.115, 0.095, 0.32, 12]} />
          {whiteSuitMat}
        </mesh>
        {/* Knee Joint */}
        <mesh position={[0, -0.32, 0.02]}>
          <sphereGeometry args={[0.095, 10, 10]} />
          {darkGreyTrimMat}
        </mesh>
        {/* Calf */}
        <mesh castShadow receiveShadow position={[0, -0.48, 0]}>
          <cylinderGeometry args={[0.095, 0.09, 0.32, 12]} />
          {whiteSuitMat}
        </mesh>
        {/* Heavy Tread EVA Boot */}
        <group position={[0, -0.66, 0.06]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.18, 0.14, 0.34]} />
            {darkGreyTrimMat}
          </mesh>
          <mesh position={[0, -0.08, 0]}>
            <boxGeometry args={[0.19, 0.04, 0.35]} />
            <meshStandardMaterial color="#0B0F19" roughness={0.95} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
