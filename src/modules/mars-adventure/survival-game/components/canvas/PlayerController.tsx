import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { inputManager } from '../../systems/inputManager';
import {
  resolveCharacterCollision,
  resolveCameraCollision,
} from '../../systems/collisionSystem';
import { MarsInteractionSystem } from '../../systems/interactionSystem';
import { audioSystem } from '../../systems/audioSynthesizer';
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
  const toggleVisorScan = useMarsGameStore((state) => state.toggleVisorScan);
  const setTargetedInteractable = useMarsGameStore((state) => state.setTargetedInteractable);
  const openSubstanceModal = useMarsGameStore((state) => state.openSubstanceModal);
  const togglePauseModal = useMarsGameStore((state) => state.togglePauseModal);
  const isPauseModalOpen = useMarsGameStore((state) => state.isPauseModalOpen);
  const isSubstanceModalOpen = useMarsGameStore((state) => state.isSubstanceModalOpen);
  const isStorageModalOpen = useMarsGameStore((state) => state.isStorageModalOpen);
  const isRenovationModalOpen = useMarsGameStore((state) => state.isRenovationModalOpen);
  const renovations = useMarsGameStore((state) => state.renovations);
  const openStorageModal = useMarsGameStore((state) => state.openStorageModal);
  const openRenovationModal = useMarsGameStore((state) => state.openRenovationModal);
  const showNotification = useMarsGameStore((state) => state.showNotification);

  // Locomotion & Physics dynamics
  const velocity = useRef<THREE.Vector3>(new THREE.Vector3());
  const verticalVelocity = useRef<number>(0);
  const isGrounded = useRef<boolean>(true);
  const playerHeading = useRef<number>(Math.PI);

  // Camera Orbit & Zoom state (spherical angles & boom length)
  const cameraYaw = useRef<number>(Math.PI);
  const cameraPitch = useRef<number>(0.22); // radians
  const currentCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 5, 16));
  const targetBoomDist = useRef<number>(4.6);
  const currentBoomDist = useRef<number>(4.6);

  const MOUSE_SENSITIVITY = 0.0024;
  const MARS_GRAVITY = 6.2; // 0.38g tuned float feel
  const ACCELERATION = 18.0;
  const GROUND_FRICTION = 14.0;
  const WALK_SPEED = 3.8;
  const SPRINT_SPEED = 6.2;

  // Click on canvas to lock mouse & listen to scroll wheel for camera zoom
  useEffect(() => {
    const canvas = gl.domElement;
    const handleCanvasClick = () => {
      // Only lock if not interacting with UI modals
      if (!isPauseModalOpen && !isSubstanceModalOpen && !isStorageModalOpen && !isRenovationModalOpen) {
        inputManager.requestPointerLock(canvas);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isPauseModalOpen || isSubstanceModalOpen || isStorageModalOpen || isRenovationModalOpen) return;
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
  }, [gl, isPauseModalOpen, isSubstanceModalOpen, controlMode]);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);

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
      isRenovationModalOpen
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

    const camRight = new THREE.Vector3(
      Math.cos(cameraYaw.current),
      0,
      -Math.sin(cameraYaw.current)
    ).normalize();

    // 3. Contextual Interaction Targeting
    const targeted = MarsInteractionSystem.getTargetedInteractable(
      playerPos,
      camForward,
      doorOpen,
      isInsideHab,
      roverPos,
      controlMode,
      resourceNodes
    );
    setTargetedInteractable(targeted);

    // 4. Handle [E] Interaction Key
    if (inputManager.consumeE() && targeted) {
      if (targeted.type === 'airlock_door') {
        toggleAirlockDoor();
      } else if (targeted.type === 'rover') {
        if (controlMode === 'driving_rover') {
          setControlMode('on_foot');
          setPlayerPos([roverPos[0] + 2.2, 0, roverPos[2]]);
        } else {
          setControlMode('driving_rover');
        }
      } else if (targeted.type === 'resource_node' && targeted.resourceData) {
        gatherResource(targeted.resourceData.id);
      } else if (targeted.type === 'power_terminal') {
        audioSystem.playChime(1100);
        showNotification('Habitat Life Support: Nominal. Reactor core online, 100% capacity.');
      } else if (targeted.type === 'moxie_unit') {
        audioSystem.playChime(950);
        showNotification('MOXIE Processor: Ambient CO2 extraction rate nominal (10 g/hr).');
      } else if (targeted.type === 'solar_inverter') {
        audioSystem.playChime(880);
        showNotification('Solar Arrays: 3-Axis trackers aligned. Photovoltaic yield: 520 W/m².');
      } else if (targeted.type === 'storage_terminal') {
        openStorageModal();
      } else if (targeted.type === 'renovation_terminal') {
        openRenovationModal();
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
    }

    // 7. LOCOMOTION & CAMERA MODES
    // Smooth camera boom zoom distance interpolation via mouse scroll wheel
    currentBoomDist.current = THREE.MathUtils.lerp(
      currentBoomDist.current,
      targetBoomDist.current,
      clampedDelta * 8.0
    );

    if (controlMode === 'driving_rover') {
      // ---------------- ROVER DRIVING CAMERA TRACKING ----------------
      const pivot = new THREE.Vector3(roverPos[0], roverPos[1] + 1.2, roverPos[2]);
      const desiredBoomDist = Math.max(currentBoomDist.current, 5.2);

      const camX = pivot.x - Math.sin(cameraYaw.current) * Math.cos(cameraPitch.current) * desiredBoomDist;
      const camY = pivot.y + Math.sin(cameraPitch.current) * desiredBoomDist + 1.2;
      const camZ = pivot.z - Math.cos(cameraYaw.current) * Math.cos(cameraPitch.current) * desiredBoomDist;
      const desiredCamPos = new THREE.Vector3(camX, camY, camZ);

      // Camera collision probe
      const safeCamPos = resolveCameraCollision(pivot, desiredCamPos, doorOpen);
      currentCamPos.current.lerp(safeCamPos, 0.15);

      camera.position.copy(currentCamPos.current);
      camera.lookAt(pivot.x, pivot.y + 0.6, pivot.z);

      // Player follows rover coordinates
      setPlayerPos(roverPos);
    } else {
      // ---------------- ASTRONAUT ON FOOT (0.38g EVA) ----------------
      const { moveForward, moveRight, sprint } = inputManager.getMovementAxes();
      const targetSpeed = sprint ? SPRINT_SPEED : WALK_SPEED;

      // Desired velocity relative to camera horizontal orientation
      const desiredVelocity = new THREE.Vector3();
      if (moveForward !== 0 || moveRight !== 0) {
        desiredVelocity.addScaledVector(camForward, moveForward);
        desiredVelocity.addScaledVector(camRight, moveRight);
        desiredVelocity.normalize().multiplyScalar(targetSpeed);

        // Turn character mesh towards movement direction
        const targetHeading = Math.atan2(desiredVelocity.x, desiredVelocity.z);
        playerHeading.current = THREE.MathUtils.lerp(
          playerHeading.current,
          targetHeading,
          clampedDelta * 12.0
        );
      }

      // Smooth horizontal acceleration and friction
      if (desiredVelocity.lengthSq() > 0) {
        velocity.current.lerp(desiredVelocity, clampedDelta * ACCELERATION);
      } else {
        velocity.current.lerp(new THREE.Vector3(0, 0, 0), clampedDelta * GROUND_FRICTION);
      }

      // Mars Jump Physics (0.38g)
      if (inputManager.consumeSpace() && isGrounded.current) {
        verticalVelocity.current = 4.2; // High floaty jump
        isGrounded.current = false;
        audioSystem.playJumpThrust();
      }

      if (!isGrounded.current) {
        verticalVelocity.current -= MARS_GRAVITY * clampedDelta;
      }

      // Proposed displacement
      const displacement: [number, number, number] = [
        velocity.current.x * clampedDelta,
        verticalVelocity.current * clampedDelta,
        velocity.current.z * clampedDelta,
      ];

      // Physical Collision Resolution with Sliding Plane math
      const resolvedPos = resolveCharacterCollision(
        playerPos,
        displacement,
        0.45,
        isInsideHab,
        doorOpen,
        roverPos,
        renovations
      );

      // Grounding Check
      if (resolvedPos[1] <= playerPos[1] + displacement[1]) {
        // Landed on terrain or floor
        verticalVelocity.current = 0;
        isGrounded.current = true;
      }

      setPlayerPos(resolvedPos);

      // Update 3D Character Mesh
      if (playerGroupRef.current) {
        playerGroupRef.current.position.set(resolvedPos[0], resolvedPos[1], resolvedPos[2]);
        playerGroupRef.current.rotation.y = playerHeading.current;
      }

      // ---------------- THIRD-PERSON ORBITAL CAMERA ----------------
      const pivot = new THREE.Vector3(resolvedPos[0], resolvedPos[1] + 1.45, resolvedPos[2]);
      const desiredBoomDist = currentBoomDist.current;

      const camX = pivot.x - Math.sin(cameraYaw.current) * Math.cos(cameraPitch.current) * desiredBoomDist;
      const camY = pivot.y + Math.sin(cameraPitch.current) * desiredBoomDist;
      const camZ = pivot.z - Math.cos(cameraYaw.current) * Math.cos(cameraPitch.current) * desiredBoomDist;
      const desiredCamPos = new THREE.Vector3(camX, camY, camZ);

      // Anti-Clipping Spring-Arm Camera Collision Probe
      const safeCamPos = resolveCameraCollision(pivot, desiredCamPos, doorOpen);
      currentCamPos.current.lerp(safeCamPos, 0.16);

      camera.position.copy(currentCamPos.current);
      camera.lookAt(pivot.x, pivot.y + 0.2, pivot.z);
    }
  });

  return (
    <group ref={playerGroupRef} name="AstronautPlayer">
      {controlMode === 'on_foot' && (
        <AstronautMesh
          pose="on_foot"
          movementSpeed={velocity.current.length()}
          isGrounded={isGrounded.current}
        />
      )}
    </group>
  );
};
