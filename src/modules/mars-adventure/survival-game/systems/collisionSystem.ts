import * as THREE from 'three';
import { getTerrainHeight } from '../components/canvas/MarsTerrain';

export interface BoxCollider {
  type: 'box';
  id: string;
  min: [number, number, number];
  max: [number, number, number];
}

export interface CylinderCollider {
  type: 'cylinder';
  id: string;
  center: [number, number]; // [x, z]
  radius: number;
  minY: number;
  maxY: number;
}

export type StaticCollider = BoxCollider | CylinderCollider;

/**
 * Static environmental colliders around Outpost Alpha & Jezero Crater
 */
export const OUTPOST_COLLIDERS: StaticCollider[] = [
  // 1. Airlock Left Tunnel Wall
  {
    type: 'box',
    id: 'airlock_left_wall',
    min: [-1.8, 0, 6.1],
    max: [-1.4, 3.2, 9.6],
  },
  // 2. Airlock Right Tunnel Wall
  {
    type: 'box',
    id: 'airlock_right_wall',
    min: [1.4, 0, 6.1],
    max: [1.8, 3.2, 9.6],
  },
  // 3. MOXIE Processing Unit & Oxygen Tanks
  {
    type: 'box',
    id: 'moxie_unit',
    min: [-7.6, 0, 3.8],
    max: [-4.8, 2.8, 5.8],
  },
  // 4. Solar Array Mounting Bases (3 units along z = 18)
  {
    type: 'cylinder',
    id: 'solar_strut_left',
    center: [-4, 18],
    radius: 0.7,
    minY: 0,
    maxY: 3.5,
  },
  {
    type: 'cylinder',
    id: 'solar_strut_center',
    center: [0, 18],
    radius: 0.7,
    minY: 0,
    maxY: 3.5,
  },
  {
    type: 'cylinder',
    id: 'solar_strut_right',
    center: [4, 18],
    radius: 0.7,
    minY: 0,
    maxY: 3.5,
  },
  // 5. Major Martian Boulders around landing perimeter
  {
    type: 'cylinder',
    id: 'boulder_1',
    center: [14, -16],
    radius: 1.8,
    minY: -2,
    maxY: 4,
  },
  {
    type: 'cylinder',
    id: 'boulder_2',
    center: [-15, 16],
    radius: 2.0,
    minY: -2,
    maxY: 4,
  },
  {
    type: 'cylinder',
    id: 'boulder_3',
    center: [22, 10],
    radius: 1.6,
    minY: -2,
    maxY: 4,
  },
  {
    type: 'cylinder',
    id: 'boulder_4',
    center: [-18, -26],
    radius: 2.2,
    minY: -2,
    maxY: 4,
  },
  {
    type: 'cylinder',
    id: 'boulder_5',
    center: [32, -12],
    radius: 1.9,
    minY: -2,
    maxY: 4,
  },
];

/**
 * Dynamic Closed Door Collider: Blocks passage at airlock outer doorway
 */
export const CLOSED_DOOR_COLLIDER: BoxCollider = {
  type: 'box',
  id: 'closed_airlock_door',
  min: [-1.4, 0, 9.4],
  max: [1.4, 2.6, 9.7],
};

export const CLOSED_REAR_DOOR_COLLIDER: BoxCollider = {
  type: 'box',
  id: 'closed_expansion_door',
  min: [-1.4, 0, -7.6],
  max: [1.4, 2.6, -7.2],
};

/**
 * Resolves character movement against environment with sliding plane physics
 */
export function resolveCharacterCollision(
  currentPos: [number, number, number],
  displacement: [number, number, number],
  playerRadius = 0.45,
  isInsideHab = false,
  doorOpen = false,
  roverPos?: [number, number, number],
  renovations?: {
    power_room: boolean;
    storage_room: boolean;
    greenhouse: boolean;
    comm_room: boolean;
    hab_expansion: boolean;
  }
): [number, number, number] {
  let [x, y, z] = currentPos;
  let [dx, dy, dz] = displacement;

  const HAB_DOME_RADIUS = 7.5;
  const HAB_INNER_RADIUS = 7.2;
  const SECONDARY_DOME_Z = -14.5;
  const SECONDARY_DOME_RADIUS = 5.5;
  const SECONDARY_INNER_RADIUS = 5.2;

  // 1. Solve X and Z movement with sliding
  let proposedX = x + dx;
  let proposedZ = z + dz;

  // List of active colliders for this frame
  const colliders: StaticCollider[] = [...OUTPOST_COLLIDERS];
  if (!doorOpen) {
    colliders.push(CLOSED_DOOR_COLLIDER);
  }
  if (!renovations?.hab_expansion) {
    colliders.push(CLOSED_REAR_DOOR_COLLIDER);
  }
  if (roverPos) {
    colliders.push({
      type: 'cylinder',
      id: 'rover_obstacle',
      center: [roverPos[0], roverPos[2]],
      radius: 1.5,
      minY: 0,
      maxY: 3,
    });
  }

  // Interior Fixed Equipment Colliders
  if (isInsideHab) {
    colliders.push(
      {
        type: 'box',
        id: 'telemetry_console',
        min: [-1.0, 0, -3.6],
        max: [1.0, 1.4, -2.8],
      },
      {
        type: 'box',
        id: 'vault_terminal_col',
        min: [-3.8, 0, -2.5],
        max: [-2.6, 1.4, -1.5],
      },
      {
        type: 'box',
        id: 'renovation_terminal_col',
        min: [2.6, 0, -2.5],
        max: [3.8, 1.4, -1.5],
      }
    );

    if (renovations?.storage_room) {
      colliders.push({
        type: 'box',
        id: 'storage_lockers_bank',
        min: [-5.8, 0, -0.6],
        max: [-4.8, 2.5, 1.6],
      });
    }

    if (renovations?.greenhouse) {
      colliders.push({
        type: 'box',
        id: 'greenhouse_hydro_trays',
        min: [4.6, 0, -0.6],
        max: [5.6, 1.8, 1.6],
      });
    }

    if (renovations?.hab_expansion) {
      colliders.push({
        type: 'cylinder',
        id: 'expansion_holo_table',
        center: [0, SECONDARY_DOME_Z],
        radius: 1.05,
        minY: 0,
        maxY: 1.4,
      });
    }
  }

  // Iterate up to 2 passes to handle corner sliding
  for (let pass = 0; pass < 2; pass++) {
    // A. Habitat Dome Perimeter Collision
    const distToCenter = Math.hypot(proposedX, proposedZ);
    const inAirlockCorridor = Math.abs(proposedX) < 1.4 && proposedZ >= 5.5 && proposedZ <= 10.0;
    const inExpansionCorridor =
      renovations?.hab_expansion &&
      Math.abs(proposedX) < 1.3 &&
      proposedZ <= -6.0 &&
      proposedZ >= -9.5;
    const distToSecondary = Math.hypot(proposedX, proposedZ - SECONDARY_DOME_Z);

    if (!isInsideHab) {
      // Outside looking in: cannot cross primary outer dome wall
      if (distToCenter < HAB_DOME_RADIUS + playerRadius && !inAirlockCorridor) {
        const normalX = proposedX / (distToCenter || 1);
        const normalZ = proposedZ / (distToCenter || 1);
        const penetration = HAB_DOME_RADIUS + playerRadius - distToCenter;

        proposedX += normalX * penetration;
        proposedZ += normalZ * penetration;

        const dot = dx * normalX + dz * normalZ;
        dx -= dot * normalX;
        dz -= dot * normalZ;
      }

      // Outside looking in: cannot cross secondary dome wall
      if (distToSecondary < SECONDARY_DOME_RADIUS + playerRadius) {
        const normalX = proposedX / (distToSecondary || 1);
        const normalZ = (proposedZ - SECONDARY_DOME_Z) / (distToSecondary || 1);
        const penetration = SECONDARY_DOME_RADIUS + playerRadius - distToSecondary;

        proposedX += normalX * penetration;
        proposedZ += normalZ * penetration;

        const dot = dx * normalX + dz * normalZ;
        dx -= dot * normalX;
        dz -= dot * normalZ;
      }
    } else {
      // Inside looking out:
      if (proposedZ < -9.5 && renovations?.hab_expansion) {
        // Inside secondary dome
        if (
          distToSecondary > SECONDARY_INNER_RADIUS - playerRadius &&
          !(Math.abs(proposedX) < 1.3 && proposedZ >= -10.0)
        ) {
          const normalX = -(proposedX / (distToSecondary || 1));
          const normalZ = -((proposedZ - SECONDARY_DOME_Z) / (distToSecondary || 1));
          const penetration = distToSecondary - (SECONDARY_INNER_RADIUS - playerRadius);

          proposedX += normalX * penetration;
          proposedZ += normalZ * penetration;

          const dot = dx * normalX + dz * normalZ;
          dx -= dot * normalX;
          dz -= dot * normalZ;
        }
      } else if (!inExpansionCorridor) {
        // Inside primary dome
        if (distToCenter > HAB_INNER_RADIUS - playerRadius && !inAirlockCorridor) {
          const normalX = -(proposedX / (distToCenter || 1));
          const normalZ = -(proposedZ / (distToCenter || 1));
          const penetration = distToCenter - (HAB_INNER_RADIUS - playerRadius);

          proposedX += normalX * penetration;
          proposedZ += normalZ * penetration;

          const dot = dx * normalX + dz * normalZ;
          dx -= dot * normalX;
          dz -= dot * normalZ;
        }
      }
    }

    // B. Check Static Box & Cylinder Colliders
    for (const col of colliders) {
      if (col.type === 'box') {
        // Expand box by player radius
        const minX = col.min[0] - playerRadius;
        const maxX = col.max[0] + playerRadius;
        const minZ = col.min[2] - playerRadius;
        const maxZ = col.max[2] + playerRadius;

        if (proposedX > minX && proposedX < maxX && proposedZ > minZ && proposedZ < maxZ) {
          // Find closest exit edge
          const distLeft = proposedX - minX;
          const distRight = maxX - proposedX;
          const distBack = proposedZ - minZ;
          const distFront = maxZ - proposedZ;

          const minDist = Math.min(distLeft, distRight, distBack, distFront);

          if (minDist === distLeft) {
            proposedX = minX;
            dx = 0;
          } else if (minDist === distRight) {
            proposedX = maxX;
            dx = 0;
          } else if (minDist === distBack) {
            proposedZ = minZ;
            dz = 0;
          } else {
            proposedZ = maxZ;
            dz = 0;
          }
        }
      } else if (col.type === 'cylinder') {
        const cdx = proposedX - col.center[0];
        const cdz = proposedZ - col.center[1];
        const dist = Math.hypot(cdx, cdz);
        const combinedR = col.radius + playerRadius;

        if (dist < combinedR) {
          const nx = cdx / (dist || 1);
          const nz = cdz / (dist || 1);
          const pen = combinedR - dist;

          proposedX += nx * pen;
          proposedZ += nz * pen;

          const dot = dx * nx + dz * nz;
          dx -= dot * nx;
          dz -= dot * nz;
        }
      }
    }
  }

  // 2. Vertical Ground Height
  const groundY = isInsideHab ? 0.05 : getTerrainHeight(proposedX, proposedZ);
  let proposedY = y + dy;
  if (proposedY <= groundY) {
    proposedY = groundY;
  }

  return [proposedX, proposedY, proposedZ];
}

/**
 * Resolves Rover vehicle collision against world obstacles
 */
export function resolveRoverCollision(
  roverPos: [number, number, number],
  roverVelocity: [number, number, number],
  doorOpen = false
): { newPos: [number, number, number]; newVelocity: [number, number, number] } {
  const [x, , z] = roverPos;
  let [vx, vy, vz] = roverVelocity;
  let proposedX = x + vx;
  let proposedZ = z + vz;

  const ROVER_COLLISION_RADIUS = 1.6;
  const HAB_DOME_RADIUS = 7.5;

  // List of obstacles
  const colliders: StaticCollider[] = [...OUTPOST_COLLIDERS];
  if (!doorOpen) colliders.push(CLOSED_DOOR_COLLIDER);

  // 1. Habitat Dome Collision (Rover cannot enter habitat dome)
  const distToCenter = Math.hypot(proposedX, proposedZ);
  if (distToCenter < HAB_DOME_RADIUS + ROVER_COLLISION_RADIUS) {
    const nx = proposedX / (distToCenter || 1);
    const nz = proposedZ / (distToCenter || 1);
    const pen = HAB_DOME_RADIUS + ROVER_COLLISION_RADIUS - distToCenter;
    proposedX += nx * pen;
    proposedZ += nz * pen;
    vx = -vx * 0.2; // Slight rebound
    vz = -vz * 0.2;
  }

  // Secondary Dome Collision (Rover cannot enter secondary habitat dome)
  const SECONDARY_DOME_Z = -14.5;
  const distToSecondary = Math.hypot(proposedX, proposedZ - SECONDARY_DOME_Z);
  if (distToSecondary < 5.5 + ROVER_COLLISION_RADIUS) {
    const nx = proposedX / (distToSecondary || 1);
    const nz = (proposedZ - SECONDARY_DOME_Z) / (distToSecondary || 1);
    const pen = 5.5 + ROVER_COLLISION_RADIUS - distToSecondary;
    proposedX += nx * pen;
    proposedZ += nz * pen;
    vx = -vx * 0.2;
    vz = -vz * 0.2;
  }

  // 2. Obstacle Colliders
  for (const col of colliders) {
    if (col.type === 'box') {
      const minX = col.min[0] - ROVER_COLLISION_RADIUS;
      const maxX = col.max[0] + ROVER_COLLISION_RADIUS;
      const minZ = col.min[2] - ROVER_COLLISION_RADIUS;
      const maxZ = col.max[2] + ROVER_COLLISION_RADIUS;

      if (proposedX > minX && proposedX < maxX && proposedZ > minZ && proposedZ < maxZ) {
        proposedX = x;
        proposedZ = z;
        vx = 0;
        vz = 0;
        break;
      }
    } else if (col.type === 'cylinder') {
      const cdx = proposedX - col.center[0];
      const cdz = proposedZ - col.center[1];
      const dist = Math.hypot(cdx, cdz);
      const combinedR = col.radius + ROVER_COLLISION_RADIUS;

      if (dist < combinedR) {
        const nx = cdx / (dist || 1);
        const nz = cdz / (dist || 1);
        proposedX = col.center[0] + nx * combinedR;
        proposedZ = col.center[1] + nz * combinedR;
        vx = -vx * 0.25;
        vz = -vz * 0.25;
      }
    }
  }

  const terrainY = getTerrainHeight(proposedX, proposedZ);
  return {
    newPos: [proposedX, terrainY, proposedZ],
    newVelocity: [vx, vy, vz],
  };
}

/**
 * Raycasts between two points to verify unobstructed line of sight (no solid walls)
 */
export function hasLineOfSight(
  from: [number, number, number],
  to: [number, number, number],
  doorOpen = false
): boolean {
  const p1 = new THREE.Vector3(from[0], from[1], from[2]);
  const p2 = new THREE.Vector3(to[0], to[1], to[2]);
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const maxDistance = dir.length();
  dir.normalize();

  // Test against habitat outer shell if one is inside and other is outside
  const r1 = Math.hypot(from[0], from[2]);
  const r2 = Math.hypot(to[0], to[2]);
  const isOneInside = (r1 < 7.2 && r2 > 7.5) || (r2 < 7.2 && r1 > 7.5);
  if (isOneInside && !doorOpen) {
    return false;
  }

  // Check airlock tunnel walls
  const ray = new THREE.Ray(p1, dir);
  const wallBoxes: BoxCollider[] = [
    { type: 'box', id: 'left', min: [-1.8, 0, 6.1], max: [-1.4, 3.2, 9.6] },
    { type: 'box', id: 'right', min: [1.4, 0, 6.1], max: [1.8, 3.2, 9.6] },
  ];
  if (!doorOpen) {
    wallBoxes.push(CLOSED_DOOR_COLLIDER);
  }

  for (const box of wallBoxes) {
    const aabb = new THREE.Box3(
      new THREE.Vector3(...box.min),
      new THREE.Vector3(...box.max)
    );
    const hit = ray.intersectBox(aabb, new THREE.Vector3());
    if (hit && p1.distanceTo(hit) < maxDistance - 0.2) {
      return false;
    }
  }

  return true;
}

/**
 * Camera Collision Raycast / Obstacle Probe:
 * Prevents camera from passing through terrain, habitat dome, or solid objects.
 */
export function resolveCameraCollision(
  pivotPos: THREE.Vector3,
  desiredCamPos: THREE.Vector3,
  doorOpen = false
): THREE.Vector3 {
  const rayDir = new THREE.Vector3().subVectors(desiredCamPos, pivotPos);
  const desiredDistance = rayDir.length();
  rayDir.normalize();

  let maxAllowedDistance = desiredDistance;
  const ray = new THREE.Ray(pivotPos, rayDir);

  // 1. Terrain Height Sample along camera ray
  const steps = 8;
  for (let i = 1; i <= steps; i++) {
    const testDist = (desiredDistance * i) / steps;
    const testPoint = new THREE.Vector3().copy(pivotPos).addScaledVector(rayDir, testDist);
    const terrainHeight = getTerrainHeight(testPoint.x, testPoint.z);
    if (testPoint.y <= terrainHeight + 0.35) {
      maxAllowedDistance = Math.min(maxAllowedDistance, Math.max(0.6, testDist - 0.3));
      break;
    }
  }

  // 2. Habitat Dome Shell
  const colliders: StaticCollider[] = [...OUTPOST_COLLIDERS];
  if (!doorOpen) colliders.push(CLOSED_DOOR_COLLIDER);

  for (const col of colliders) {
    if (col.type === 'box') {
      const aabb = new THREE.Box3(
        new THREE.Vector3(...col.min),
        new THREE.Vector3(...col.max)
      );
      const hit = ray.intersectBox(aabb, new THREE.Vector3());
      if (hit) {
        const hitDist = pivotPos.distanceTo(hit);
        if (hitDist < maxAllowedDistance) {
          maxAllowedDistance = Math.max(0.6, hitDist - 0.25);
        }
      }
    } else if (col.type === 'cylinder') {
      // Cylinder bounding box check
      const aabb = new THREE.Box3(
        new THREE.Vector3(col.center[0] - col.radius, col.minY, col.center[1] - col.radius),
        new THREE.Vector3(col.center[0] + col.radius, col.maxY, col.center[1] + col.radius)
      );
      const hit = ray.intersectBox(aabb, new THREE.Vector3());
      if (hit) {
        const hitDist = pivotPos.distanceTo(hit);
        if (hitDist < maxAllowedDistance) {
          maxAllowedDistance = Math.max(0.6, hitDist - 0.25);
        }
      }
    }
  }

  return new THREE.Vector3().copy(pivotPos).addScaledVector(rayDir, maxAllowedDistance);
}
