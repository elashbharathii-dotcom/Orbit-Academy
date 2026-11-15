import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { inputManager } from '../../systems/inputManager';
import {
  resolveCharacterPhysics,
  resolveCameraCollision,
} from '../../systems/collisionSystem';
import { MarsInteractionSystem } from '../../systems/interactionSystem';
import { audioSystem } from '../../systems/audioSynthesizer';
import { getTerrainHeight } from './MarsTerrain';
import { AstronautMesh } from './AstronautMesh';

export const PlayerController: React.FC = () => {
  const { camera, gl } = useThree();
  const playerGroupRef = useRef<THREE.Group>(null);

  // Zustand Store
  const playerPos = useMarsGameStore((state) => state.playerPosition);
  const setPlayerPos = useMarsGameStore((state) => state.setPlayerPosition);
  const roverPos = useMarsGameStore((state) => state.roverPosition);
  const controlMode = useMarsGameStore((state) => state.settings.controlMode);
  const setControlMode = useMarsGameStore((state) => state.setControlMode);
  const isInsideHab = useMarsGameStore((state) => state.isInsideHab);
  const doorOpen = useMarsGameStore((state) => state.doorOpen);
  const toggleAirlockDoor = useMarsGameStore((state) => state.toggleAirlockDoor);
  const gatherResource = useMarsGameStore((state) => state.gatherResource);
  const resourceNodes = useMarsGameStore((state) => state.resourceNodes);
  const visorScanActive = useMarsGameStore((state) => state.settings.visorScanActive);
  const toggleVisorScan = useMarsGameStore((state) => state.toggleVisorScan);
  const setTargetedInteractable = useMarsGameStore((state) => state.setTargetedInteractable);
  const openSubstanceModal = useMarsGameStore((state) => state.openSubstanceModal);
  const togglePauseModal = useMarsGameStore((state) => state.togglePauseModal);
  const isPauseModalOpen = useMarsGameStore((state) => state.isPauseModalOpen);
  const isSubstanceModalOpen = useMarsGameStore((state) => state.isSubstanceModalOpen);
  const isStorageModalOpen = useMarsGameStore((state) => state.isStorageModalOpen);
  const isRenovationModalOpen = useMarsGameStore((state) => state.isRenovationModalOpen);
  const isCraftingModalOpen = useMarsGameStore((state) => state.isCraftingModalOpen);
  const isDisassemblyModalOpen = useMarsGameStore((state) => state.isDisassemblyModalOpen);
  const isPowerGridModalOpen = useMarsGameStore((state) => state.isPowerGridModalOpen);
  const isMissionModalOpen = useMarsGameStore((state) => state.isMissionModalOpen);
  const isMapModalOpen = useMarsGameStore((state) => state.isMapModalOpen);
  const isResearchModalOpen = useMarsGameStore((state) => state.isResearchModalOpen);
  const renovations = useMarsGameStore((state) => state.renovations);
  const openStorageModal = useMarsGameStore((state) => state.openStorageModal);
  const openRenovationModal = useMarsGameStore((state) => state.openRenovationModal);
  const openPowerGridModal = useMarsGameStore((state) => state.openPowerGridModal);
  const openIntelligentBaseModal = useMarsGameStore((state) => state.openIntelligentBaseModal);
  const robotState = useMarsGameStore((state) => state.robotState);
  const setRobotMode = useMarsGameStore((state) => state.setRobotMode);
  const showNotification = useMarsGameStore((state) => state.showNotification);
  const setCameraLook = useMarsGameStore((state) => state.setCameraLook);
  const backpackWeight = useMarsGameStore((state) => state.backpackWeight);
  const maxBackpackCapacity = useMarsGameStore((state) => state.maxBackpackCapacity);

  // Locomotion & Physics dynamics
  const velocity = useRef<THREE.Vector3>(new THREE.Vector3());
  const verticalVelocity = useRef<number>(0);
  const isGrounded = useRef<boolean>(true);
  const justLanded = useRef<boolean>(false);
  const playerHeading = useRef<number>(Math.PI);

  // Animation timers
  const isInteractingTimer = useRef<number>(0);
  const isCollectingTimer = useRef<number>(0);

  // Camera Orbit & Zoom state (spherical angles & boom length)
  const cameraYaw = useRef<number>(Math.PI);
  const cameraPitch = useRef<number>(0.22); // radians
  const currentCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 5, 16));
  const targetBoomDist = useRef<number>(4.6);
  const currentBoomDist = useRef<number>(4.6);
  const roverCameraMode = useRef<'orbit_chase' | 'cockpit_fpv' | 'close_chase'>('orbit_chase');

  // Camera height smoothing to prevent jerky vertical hops during jumps
  const smoothedPivotY = useRef<number>(playerPos[1] + 1.45);

  // Vehicle mount/dismount camera pivot interpolation
  const cameraTransitionPivot = useRef<THREE.Vector3>(new THREE.Vector3(...playerPos));

  const MOUSE_SENSITIVITY = 0.0024;
  const ACCELERATION = 16.0;
  const AIR_ACCELERATION = 6.0;
  const GROUND_FRICTION = 14.0;
  const AIR_DRAG = 1.5;
  const WALK_SPEED = 3.8;
  const SPRINT_SPEED = 6.2;

  // Click on canvas to lock mouse & listen to scroll wheel for camera zoom
  useEffect(() => {
    const canvas = gl.domElement;
    const handleCanvasClick = () => {
      if (
        !isPauseModalOpen &&
        !isSubstanceModalOpen &&
        !isStorageModalOpen &&
        !isRenovationModalOpen &&
        !isCraftingModalOpen &&
        !isDisassemblyModalOpen
      ) {
        inputManager.requestPointerLock(canvas);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (
        isPauseModalOpen ||
        isSubstanceModalOpen ||
        isStorageModalOpen ||
        isRenovationModalOpen ||
        isCraftingModalOpen ||
        isDisassemblyModalOpen ||
        isPowerGridModalOpen ||
        isMissionModalOpen ||
        isMapModalOpen ||
        isResearchModalOpen
      )
        return;
      const zoomSensitivity = 0.0035;
      const minZoom = controlMode === 'driving_rover' ? 4.2 : 2.0;
      const maxZoom = controlMode === 'driving_rover' ? 14.0 : 8.0;

      targetBoomDist.current = THREE.MathUtils.clamp(
        targetBoomDist.current + e.deltaY * zoomSensitivity,
        minZoom,
        maxZoom
      );
    };

    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [gl, isPauseModalOpen, isSubstanceModalOpen, isStorageModalOpen, isRenovationModalOpen, controlMode]);

  // Footstep audio event handler
  const handleFootstep = () => {
    const isSprint = velocity.current.length() > 4.2;
    audioSystem.playFootstep(isInsideHab ? 'metal' : 'regolith', isSprint);
  };

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);

    // Update animation timers
    if (isInteractingTimer.current > 0) {
      isInteractingTimer.current = Math.max(0, isInteractingTimer.current - clampedDelta);
    }
    if (isCollectingTimer.current > 0) {
      isCollectingTimer.current = Math.max(0, isCollectingTimer.current - clampedDelta);
    }

    // 1. Check ESC Key: Toggle Pause Menu & Release Mouse
    if (inputManager.consumeEsc()) {
      if (isSubstanceModalOpen) {
        useMarsGameStore.getState().closeSubstanceModal();
      } else {
        togglePauseModal();
      }
      return;
    }

    if (
      isPauseModalOpen ||
      isSubstanceModalOpen ||
      isStorageModalOpen ||
      isRenovationModalOpen ||
      isCraftingModalOpen ||
      isDisassemblyModalOpen ||
      isPowerGridModalOpen ||
      isMissionModalOpen ||
      isMapModalOpen ||
      isResearchModalOpen
    ) {
      return;
    }

    // 2. Consume Mouse Look Delta for Camera Orbit
    const { deltaX, deltaY } = inputManager.consumeMouseDelta();
    cameraYaw.current -= deltaX * MOUSE_SENSITIVITY;
    cameraPitch.current = THREE.MathUtils.clamp(
      cameraPitch.current + deltaY * MOUSE_SENSITIVITY,
      -0.38, // Looking up (limit ground clip)
      1.25   // Looking down
    );

    // Camera forward and right horizontal unit vectors
    const camForward = new THREE.Vector3(
      Math.sin(cameraYaw.current),
      0,
      Math.cos(cameraYaw.current)
    ).normalize();

    // 3. Contextual Interaction Targeting
    const targeted = MarsInteractionSystem.getTargetedInteractable(
      playerPos,
      camForward,
      doorOpen,
      isInsideHab,
      roverPos,
      controlMode,
      resourceNodes,
      robotState.position,
      robotState.mode
    );
    setTargetedInteractable(targeted);

    // 4. Handle [E] Interaction Key
    if (inputManager.consumeE() && targeted) {
      isInteractingTimer.current = 0.45; // Trigger arm interaction animation pose

      if (targeted.type === 'airlock_door') {
        toggleAirlockDoor();
      } else if (targeted.type === 'rover') {
        if (controlMode === 'driving_rover') {
          const speedKmH = useMarsGameStore.getState().roverTelemetry.speedKmH;
          if (speedKmH > 3.0) {
            audioSystem.playAlarm();
            showNotification('DANGER: Cannot dismount rover at speed! Bring vehicle to a complete stop.');
            return;
          }
          const exitAngle = cameraYaw.current;
          const exitX = roverPos[0] + Math.cos(exitAngle) * 2.3;
          const exitZ = roverPos[2] - Math.sin(exitAngle) * 2.3;
          const exitY = getTerrainHeight(exitX, exitZ);
          audioSystem.playChime(750);
          setControlMode('on_foot');
          setPlayerPos([exitX, exitY, exitZ]);
          showNotification('Dismounted Mars Exploration Rover.');
        } else {
          audioSystem.playChime(950);
          setControlMode('driving_rover');
          showNotification('Mounted Mars Exploration Rover. [W/S/A/D] Drive • [SPACE] Handbrake • [C] Camera • [E] Exit');
        }
      } else if (targeted.type === 'resource_node' && targeted.resourceData) {
        isCollectingTimer.current = 0.65; // Trigger kneeling collection animation pose
        audioSystem.playSuitServo('collect');
        gatherResource(targeted.resourceData.id);
      } else if (targeted.type === 'power_terminal') {
        audioSystem.playSuitServo('interact');
        useMarsGameStore.getState().refillSuitOxygen();
        openPowerGridModal();
      } else if (targeted.type === 'power_grid_console') {
        audioSystem.playSuitServo('interact');
        openPowerGridModal();
      } else if (targeted.type === 'moxie_unit') {
        useMarsGameStore.getState().refillSuitOxygen();
        audioSystem.playChime(950);
        showNotification('MOXIE Processor: Oxygen generation online. EVA suit oxygen pressurized to 100%.');
      } else if (targeted.type === 'solar_inverter') {
        openPowerGridModal();
      } else if (targeted.type === 'storage_terminal') {
        openStorageModal();
      } else if (targeted.type === 'renovation_terminal') {
        openRenovationModal();
      } else if (targeted.type === 'facility_terminal') {
        if (targeted.id === 'command_centre_terminal') {
          const store = useMarsGameStore.getState();
          if (store.campaignChapter === 6 && !store.campaignCompleted) {
            store.triggerDialogue('dia_ch6_final_crossroads');
          } else {
            openRenovationModal('command_centre');
          }
        } else {
          openRenovationModal();
        }
      } else if (targeted.type === 'bunk_bed') {
        const facs = useMarsGameStore.getState().facilityRenovations;
        if (facs.living_quarters >= 1) {
          useMarsGameStore.getState().restInLivingQuarters();
        } else {
          openRenovationModal('living_quarters');
        }
      } else if (targeted.type === 'greenhouse_harvest') {
        const crop = useMarsGameStore.getState().greenhouseCrop;
        const facs = useMarsGameStore.getState().facilityRenovations;
        if (facs.greenhouse < 1) {
          openRenovationModal('greenhouse');
        } else if (crop.stage === 'ready') {
          isCollectingTimer.current = 0.55;
          useMarsGameStore.getState().harvestGreenhouseCrop();
        } else if (crop.stage === 'empty') {
          useMarsGameStore.getState().plantGreenhouseCrop();
        }
      } else if (targeted.type === 'crafting_station') {
        useMarsGameStore.getState().openCraftingModal();
      } else if (targeted.type === 'disassembly_station') {
        useMarsGameStore.getState().openDisassemblyModal();
      } else if (targeted.type === 'intelligent_base_console') {
        openIntelligentBaseModal();
      } else if (targeted.type === 'robot_companion') {
        const nextMode = robotState.mode === 'follow_player' ? 'idle' : 'follow_player';
        setRobotMode(nextMode);
      } else if (targeted.type === 'exploration_landmark') {
        const store = useMarsGameStore.getState();
        const lm = store.landmarks.find((l) => l.id === targeted.id);
        if (lm?.hasSample) {
          isCollectingTimer.current = 0.65;
          store.collectLandmarkSample(targeted.id);
        } else {
          store.scanTarget(targeted.id);
        }
      }
    }

    // 5. Handle [I] Substance Info Key
    if (inputManager.consumeI()) {
      if (targeted?.resourceData) {
        openSubstanceModal();
      } else {
        const discovered = resourceNodes.find((n) => n.scanDiscovered && !n.depleted);
        if (discovered) {
          openSubstanceModal();
        } else {
          showNotification('No substance selected. Activate scanner [V] or approach a mineral node.');
        }
      }
    }

    // 6. Handle [V] Visor Scan Key
    if (inputManager.consumeV()) {
      toggleVisorScan();
      audioSystem.setScannerAudio(!visorScanActive);
    }

    // Rover Camera View Mode Cycle ([C] key)
    if (controlMode === 'driving_rover' && inputManager.consumeC()) {
      audioSystem.playChime(1050);
      if (roverCameraMode.current === 'orbit_chase') {
        roverCameraMode.current = 'cockpit_fpv';
        showNotification('ROVER CAMERA: COCKPIT FIRST-PERSON [FPV]');
      } else if (roverCameraMode.current === 'cockpit_fpv') {
        roverCameraMode.current = 'close_chase';
        showNotification('ROVER CAMERA: CLOSE PURSUIT VIEW');
      } else {
        roverCameraMode.current = 'orbit_chase';
        showNotification('ROVER CAMERA: ORBIT CHASE (FREE LOOK)');
      }
    }

    // 7. LOCOMOTION & CAMERA MODES
    currentBoomDist.current = THREE.MathUtils.lerp(
      currentBoomDist.current,
      targetBoomDist.current,
      clampedDelta * 8.0
    );

    if (controlMode === 'driving_rover') {
      // ---------------- ROVER DRIVING CAMERA TRACKING ----------------
      const targetPivot = new THREE.Vector3(roverPos[0], roverPos[1] + 1.2, roverPos[2]);
      cameraTransitionPivot.current.lerp(targetPivot, clampedDelta * 6.0);
      const pivot = cameraTransitionPivot.current;

      const roverSpeedKmH = useMarsGameStore.getState().roverTelemetry.speedKmH;
      // Speed-dependent camera pull-back for high-speed forward visibility
      const speedPullBack = Math.min(2.2, (roverSpeedKmH / 32.0) * 2.0);

      if (roverCameraMode.current === 'cockpit_fpv') {
        // Cockpit FPV: Position camera directly in driver helmet eye-line
        const fpvEyePos = new THREE.Vector3(pivot.x, pivot.y + 0.35, pivot.z + 0.15);
        const lookTarget = new THREE.Vector3(
          fpvEyePos.x + Math.sin(cameraYaw.current) * 15.0,
          fpvEyePos.y - Math.sin(cameraPitch.current) * 5.0,
          fpvEyePos.z + Math.cos(cameraYaw.current) * 15.0
        );
        currentCamPos.current.lerp(fpvEyePos, 0.35);
        camera.position.copy(currentCamPos.current);
        camera.lookAt(lookTarget);
      } else if (roverCameraMode.current === 'close_chase') {
        // Close Pursuit View
        const closeDist = 3.6 + speedPullBack * 0.5;
        const camX = pivot.x - Math.sin(cameraYaw.current) * Math.cos(cameraPitch.current) * closeDist;
        const camY = pivot.y + Math.sin(cameraPitch.current) * closeDist + 0.85;
        const camZ = pivot.z - Math.cos(cameraYaw.current) * Math.cos(cameraPitch.current) * closeDist;
        const desiredCamPos = new THREE.Vector3(camX, camY, camZ);
        const safeCamPos = resolveCameraCollision(pivot, desiredCamPos, doorOpen);
        currentCamPos.current.lerp(safeCamPos, 0.22);
        camera.position.copy(currentCamPos.current);
        camera.lookAt(pivot.x, pivot.y + 0.45, pivot.z);
      } else {
        // Orbit Chase View with speed pull-back
        const desiredBoomDist = Math.max(currentBoomDist.current, 5.2) + speedPullBack;
        const camX = pivot.x - Math.sin(cameraYaw.current) * Math.cos(cameraPitch.current) * desiredBoomDist;
        const camY = pivot.y + Math.sin(cameraPitch.current) * desiredBoomDist + 1.2;
        const camZ = pivot.z - Math.cos(cameraYaw.current) * Math.cos(cameraPitch.current) * desiredBoomDist;
        const desiredCamPos = new THREE.Vector3(camX, camY, camZ);
        const safeCamPos = resolveCameraCollision(pivot, desiredCamPos, doorOpen);
        currentCamPos.current.lerp(safeCamPos, 0.16);
        camera.position.copy(currentCamPos.current);
        camera.lookAt(pivot.x, pivot.y + 0.6, pivot.z);
      }

      setCameraLook(cameraYaw.current, cameraPitch.current);
      setPlayerPos(roverPos);
    } else {
      // ---------------- ASTRONAUT ON FOOT (0.38g EVA) ----------------
      const { moveForward, moveRight, sprint } = inputManager.getMovementAxes();

      // Encumbrance penalty calculation
      const loadRatio = backpackWeight / Math.max(1, maxBackpackCapacity);
      let loadPenaltyMultiplier = 1.0;
      let effectiveSprint = sprint;

      if (loadRatio > 1.0) {
        effectiveSprint = false;
        loadPenaltyMultiplier = 0.75;
      } else if (loadRatio > 0.70) {
        loadPenaltyMultiplier = Math.max(0.82, 1.0 - (loadRatio - 0.70) * 0.4);
      }

      const targetSpeed = (effectiveSprint ? SPRINT_SPEED : WALK_SPEED) * loadPenaltyMultiplier;

      const camRight = new THREE.Vector3(
        Math.cos(cameraYaw.current),
        0,
        -Math.sin(cameraYaw.current)
      ).normalize();

      const desiredVelocity = new THREE.Vector3();
      if (moveForward !== 0 || moveRight !== 0) {
        desiredVelocity.addScaledVector(camForward, moveForward);
        desiredVelocity.addScaledVector(camRight, moveRight);
        desiredVelocity.normalize().multiplyScalar(targetSpeed);

        const targetHeading = Math.atan2(desiredVelocity.x, desiredVelocity.z);
        let diff = targetHeading - playerHeading.current;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        playerHeading.current += diff * Math.min(1.0, clampedDelta * 14.0);
      }

      const currentAccel = isGrounded.current ? ACCELERATION : AIR_ACCELERATION;
      const currentFriction = isGrounded.current ? GROUND_FRICTION : AIR_DRAG;

      if (desiredVelocity.lengthSq() > 0) {
        velocity.current.lerp(desiredVelocity, clampedDelta * currentAccel);
      } else {
        velocity.current.lerp(new THREE.Vector3(0, 0, 0), clampedDelta * currentFriction);
      }

      // Space key: Jump impulse
      const jumpRequested = inputManager.consumeSpace() && isGrounded.current;
      if (jumpRequested) {
        audioSystem.playJumpThrust();
        audioSystem.playSuitServo('jump');
      }

      // Full physics simulation integration
      const physicsOutput = resolveCharacterPhysics({
        currentPos: playerPos,
        velocity: [velocity.current.x, verticalVelocity.current, velocity.current.z],
        delta: clampedDelta,
        playerRadius: 0.45,
        isInsideHab,
        doorOpen,
        roverPos,
        renovations,
        wasGrounded: isGrounded.current,
        jumpRequested,
      });

      // Sound trigger on touchdown
      if (physicsOutput.justLanded) {
        audioSystem.playSuitServo('land');
      }

      velocity.current.x = physicsOutput.velocity[0];
      verticalVelocity.current = physicsOutput.velocity[1];
      velocity.current.z = physicsOutput.velocity[2];
      isGrounded.current = physicsOutput.isGrounded;
      justLanded.current = physicsOutput.justLanded;

      setPlayerPos(physicsOutput.position);

      // Update 3D Character Mesh
      if (playerGroupRef.current) {
        playerGroupRef.current.position.set(
          physicsOutput.position[0],
          physicsOutput.position[1],
          physicsOutput.position[2]
        );
        playerGroupRef.current.rotation.y = playerHeading.current;
      }

      // ---------------- THIRD-PERSON ORBITAL CAMERA WITH STABLE JUMP DAMPING ----------------
      // Smooth vertical camera tracking so small hops and micro-bumps don't jerk the player view
      const targetY = physicsOutput.position[1] + 1.45;
      smoothedPivotY.current = THREE.MathUtils.lerp(
        smoothedPivotY.current,
        targetY,
        clampedDelta * (isGrounded.current ? 12.0 : 4.5)
      );

      const targetPivot = new THREE.Vector3(
        physicsOutput.position[0],
        smoothedPivotY.current,
        physicsOutput.position[2]
      );
      cameraTransitionPivot.current.lerp(targetPivot, clampedDelta * 8.0);
      const pivot = cameraTransitionPivot.current;

      const desiredBoomDist = currentBoomDist.current;
      const camX = pivot.x - Math.sin(cameraYaw.current) * Math.cos(cameraPitch.current) * desiredBoomDist;
      const camY = pivot.y + Math.sin(cameraPitch.current) * desiredBoomDist;
      const camZ = pivot.z - Math.cos(cameraYaw.current) * Math.cos(cameraPitch.current) * desiredBoomDist;
      const desiredCamPos = new THREE.Vector3(camX, camY, camZ);

      // Anti-Clipping Spring-Arm Camera Collision Probe
      const safeCamPos = resolveCameraCollision(pivot, desiredCamPos, doorOpen);
      currentCamPos.current.lerp(safeCamPos, 0.16);

      camera.position.copy(currentCamPos.current);
      camera.lookAt(pivot.x, pivot.y + 0.15, pivot.z);

      // Synchronize camera orientation with store (feeds compass HUD)
      setCameraLook(cameraYaw.current, cameraPitch.current);
    }
  });

  return (
    <group ref={playerGroupRef} name="AstronautPlayer">
      {controlMode === 'on_foot' && (
        <AstronautMesh
          pose="on_foot"
          movementSpeed={velocity.current.length()}
          isGrounded={isGrounded.current}
          verticalVelocity={verticalVelocity.current}
          justLanded={justLanded.current}
          isScanning={visorScanActive}
          isInteracting={isInteractingTimer.current > 0}
          isCollecting={isCollectingTimer.current > 0}
          onFootstep={handleFootstep}
        />
      )}
    </group>
  );
};
