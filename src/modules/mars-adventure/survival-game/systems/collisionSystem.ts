import * as THREE from 'three';
import {
  getTerrainHeight,
  getTerrainNormal,
  DETERMINISTIC_ROCKS,
} from '../components/canvas/MarsTerrain';
import { ProceduralTerrainSystem } from './proceduralTerrainSystem';

export const MARS_GRAVITY = 3.71; // Authentic Mars surface gravity (m/s^2)
export const MAX_SLOPE_ANGLE_RAD = 32 * (Math.PI / 180); // 32° Martian sand/gravel angle of repose (~0.5585 rad)

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
  // Exploration Landmarks Colliders
  {
    type: 'cylinder',
    id: 'abandoned_rover_relic',
    center: [38, -32],
    radius: 1.8,
    minY: -2,
    maxY: 4,
  },
  {
    type: 'cylinder',
    id: 'lava_tube_mouth',
    center: [-35, -42],
    radius: 2.8,
    minY: -2,
    maxY: 6,
  },
  {
    type: 'cylinder',
    id: 'damaged_comms_tower',
    center: [42, 28],
    radius: 1.8,
    minY: -2,
    maxY: 5,
  },
  {
    type: 'cylinder',
    id: 'delta_paleolake_shelf',
    center: [-40, 22],
    radius: 2.8,
    minY: -2,
    maxY: 5,
  },
  {
    type: 'cylinder',
    id: 'meteorite_monolith',
    center: [0, 52],
    radius: 1.8,
    minY: -2,
    maxY: 4,
  },
  // 6. Space Centre Interior Heavy Machinery
  {
    type: 'cylinder',
    id: 'hab_disassembly_machine',
    center: [-3.6, 1.5],
    radius: 0.8,
    minY: 0,
    maxY: 2.2,
  },
  {
    type: 'cylinder',
    id: 'hab_fabrication_unit',
    center: [3.6, 1.5],
    radius: 0.8,
    minY: 0,
    maxY: 2.2,
  },
  {
    type: 'box',
    id: 'hab_electronics_workbench',
    min: [-0.9, 0, 3.6],
    max: [0.9, 2.0, 4.4],
  },
  {
    type: 'cylinder',
    id: 'hab_storage_shelves',
    center: [-4.6, -2.0],
    radius: 0.75,
    minY: 0,
    maxY: 2.6,
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

export interface CharacterPhysicsInput {
  currentPos: [number, number, number];
  velocity: [number, number, number]; // [vx, vy, vz]
  delta: number;
  playerRadius?: number;
  isInsideHab?: boolean;
  doorOpen?: boolean;
  roverPos?: [number, number, number];
  renovations?: {
    power_room: boolean;
    storage_room: boolean;
    greenhouse: boolean;
    comm_room: boolean;
    hab_expansion: boolean;
  };
  wasGrounded?: boolean;
  jumpRequested?: boolean;
}

export interface CharacterPhysicsOutput {
  position: [number, number, number];
  velocity: [number, number, number];
  isGrounded: boolean;
  justLanded: boolean;
  onSlope: boolean;
  slopeAngleDeg: number;
  groundNormal: [number, number, number];
  hitObstacle: boolean;
}

const _scratchNorm = new THREE.Vector3();

/**
 * Physics-Grade Character Controller with contact sliding, slope dynamics, and ground snapping
 */
export function resolveCharacterPhysics(
  params: CharacterPhysicsInput
): CharacterPhysicsOutput {
  const {
    currentPos,
    velocity,
    delta,
    playerRadius = 0.45,
    isInsideHab = false,
    doorOpen = false,
    roverPos,
    renovations,
    wasGrounded = true,
    jumpRequested = false,
  } = params;

  let [x, y, z] = currentPos;
  let [vx, vy, vz] = velocity;

  const HAB_DOME_RADIUS = 7.5;
  const HAB_INNER_RADIUS = 7.2;
  const SECONDARY_DOME_Z = -14.5;
  const SECONDARY_DOME_RADIUS = 5.5;
  const SECONDARY_INNER_RADIUS = 5.2;

  // 1. Terrain Slope & Ground Normal Query
  getTerrainNormal(x, z, _scratchNorm);
  const groundNormal: [number, number, number] = isInsideHab
    ? [0, 1, 0]
    : [_scratchNorm.x, _scratchNorm.y, _scratchNorm.z];

  const slopeCos = THREE.MathUtils.clamp(groundNormal[1], -1, 1);
  const slopeAngleRad = Math.acos(slopeCos);
  const slopeAngleDeg = slopeAngleRad * (180 / Math.PI);
  const onSlope = !isInsideHab && slopeAngleDeg > 4.0;
  const isSteepSlope = !isInsideHab && slopeAngleRad > MAX_SLOPE_ANGLE_RAD;

  // 2. Slope Handling & Granular Sliding
  if (isSteepSlope) {
    // Cannot climb slopes steeper than 32°: project movement off the uphill normal
    const uphillDot = vx * groundNormal[0] + vz * groundNormal[2];
    if (uphillDot < 0) {
      // Trying to move uphill: remove uphill velocity component
      vx -= uphillDot * groundNormal[0];
      vz -= uphillDot * groundNormal[2];
    }
    // Induce gravity slide downhill along terrain gradient
    const slideAccel = MARS_GRAVITY * Math.sin(slopeAngleRad) * 1.35;
    vx += -groundNormal[0] * slideAccel * delta;
    vz += -groundNormal[2] * slideAccel * delta;
  }

  // 3. Horizontal Displacement with Multi-Pass Sliding Plane Collision
  let dx = vx * delta;
  let dz = vz * delta;
  let proposedX = x + dx;
  let proposedZ = z + dz;
  let hitObstacle = false;

  // Compile active obstacles (base colliders + doors + rover + interior + nearby deterministic rocks)
  const colliders: StaticCollider[] = [...OUTPOST_COLLIDERS];
  if (!doorOpen) {
    colliders.push(CLOSED_DOOR_COLLIDER);
  }
  const isExpansionUnlocked = Boolean(
    renovations?.hab_expansion ||
      (renovations as any)?.living_quarters >= 1 ||
      (renovations as any)?.greenhouse >= 1
  );
  if (!isExpansionUnlocked) {
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

  // Add nearby deterministic scattered rocks for physical collision
  if (!isInsideHab) {
    for (let i = 0; i < DETERMINISTIC_ROCKS.length; i++) {
      const rock = DETERMINISTIC_ROCKS[i];
      if (Math.abs(proposedX - rock.x) < 4.5 && Math.abs(proposedZ - rock.z) < 4.5) {
        colliders.push({
          type: 'cylinder',
          id: rock.id,
          center: [rock.x, rock.z],
          radius: rock.radius,
          minY: rock.y - 1.2,
          maxY: rock.y + rock.scale * 1.6,
        });
      }
    }
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

    if (isExpansionUnlocked) {
      colliders.push(
        {
          type: 'cylinder',
          id: 'expansion_holo_table',
          center: [0, SECONDARY_DOME_Z],
          radius: 1.05,
          minY: 0,
          maxY: 1.4,
        },
        {
          type: 'box',
          id: 'secondary_dome_greenhouse_beds',
          min: [2.3, 0, SECONDARY_DOME_Z - 1.5],
          max: [4.1, 1.8, SECONDARY_DOME_Z + 1.5],
        },
        {
          type: 'box',
          id: 'secondary_dome_living_bunks',
          min: [-4.1, 0, SECONDARY_DOME_Z - 1.5],
          max: [-2.3, 1.8, SECONDARY_DOME_Z + 1.5],
        }
      );
    }
  }

  // Multi-pass iterative contact relaxation (handles corners and tight crevices)
  for (let pass = 0; pass < 3; pass++) {
    // A. Habitat Dome Shell Boundaries
    const distToCenter = Math.hypot(proposedX, proposedZ);
    const inAirlockCorridor = Math.abs(proposedX) < 1.4 && proposedZ >= 5.5 && proposedZ <= 10.0;
    const inExpansionCorridor =
      isExpansionUnlocked &&
      Math.abs(proposedX) < 1.3 &&
      proposedZ <= -6.0 &&
      proposedZ >= -9.5;
    const distToSecondary = Math.hypot(proposedX, proposedZ - SECONDARY_DOME_Z);

    if (!isInsideHab) {
      // Primary outer dome perimeter
      if (distToCenter < HAB_DOME_RADIUS + playerRadius && !inAirlockCorridor) {
        hitObstacle = true;
        const nx = proposedX / (distToCenter || 1);
        const nz = proposedZ / (distToCenter || 1);
        const pen = HAB_DOME_RADIUS + playerRadius - distToCenter;
        proposedX += nx * pen;
        proposedZ += nz * pen;

        const dot = vx * nx + vz * nz;
        if (dot < 0) {
          vx -= dot * nx;
          vz -= dot * nz;
        }
      }

      // Secondary outer dome perimeter
      if (distToSecondary < SECONDARY_DOME_RADIUS + playerRadius) {
        hitObstacle = true;
        const nx = proposedX / (distToSecondary || 1);
        const nz = (proposedZ - SECONDARY_DOME_Z) / (distToSecondary || 1);
        const pen = SECONDARY_DOME_RADIUS + playerRadius - distToSecondary;
        proposedX += nx * pen;
        proposedZ += nz * pen;

        const dot = vx * nx + vz * nz;
        if (dot < 0) {
          vx -= dot * nx;
          vz -= dot * nz;
        }
      }
    } else {
      // Inside habitat domes: constrain inside interior boundaries
      if (proposedZ < -9.5 && isExpansionUnlocked) {
        if (
          distToSecondary > SECONDARY_INNER_RADIUS - playerRadius &&
          !(Math.abs(proposedX) < 1.3 && proposedZ >= -10.0)
        ) {
          hitObstacle = true;
          const nx = -(proposedX / (distToSecondary || 1));
          const nz = -((proposedZ - SECONDARY_DOME_Z) / (distToSecondary || 1));
          const pen = distToSecondary - (SECONDARY_INNER_RADIUS - playerRadius);
          proposedX += nx * pen;
          proposedZ += nz * pen;

          const dot = vx * nx + vz * nz;
          if (dot < 0) {
            vx -= dot * nx;
            vz -= dot * nz;
          }
        }
      } else if (!inExpansionCorridor) {
        if (distToCenter > HAB_INNER_RADIUS - playerRadius && !inAirlockCorridor) {
          hitObstacle = true;
          const nx = -(proposedX / (distToCenter || 1));
          const nz = -(proposedZ / (distToCenter || 1));
          const pen = distToCenter - (HAB_INNER_RADIUS - playerRadius);
          proposedX += nx * pen;
          proposedZ += nz * pen;

          const dot = vx * nx + vz * nz;
          if (dot < 0) {
            vx -= dot * nx;
            vz -= dot * nz;
          }
        }
      }
    }

    // B. Box & Cylinder Obstacles
    for (const col of colliders) {
      if (col.type === 'box') {
        const minX = col.min[0] - playerRadius;
        const maxX = col.max[0] + playerRadius;
        const minZ = col.min[2] - playerRadius;
        const maxZ = col.max[2] + playerRadius;

        if (proposedX > minX && proposedX < maxX && proposedZ > minZ && proposedZ < maxZ) {
          hitObstacle = true;
          const distLeft = proposedX - minX;
          const distRight = maxX - proposedX;
          const distBack = proposedZ - minZ;
          const distFront = maxZ - proposedZ;

          const minDist = Math.min(distLeft, distRight, distBack, distFront);

          if (minDist === distLeft) {
            proposedX = minX;
            if (vx > 0) vx = 0;
          } else if (minDist === distRight) {
            proposedX = maxX;
            if (vx < 0) vx = 0;
          } else if (minDist === distBack) {
            proposedZ = minZ;
            if (vz > 0) vz = 0;
          } else {
            proposedZ = maxZ;
            if (vz < 0) vz = 0;
          }
        }
      } else if (col.type === 'cylinder') {
        const cdx = proposedX - col.center[0];
        const cdz = proposedZ - col.center[1];
        const dist = Math.hypot(cdx, cdz);
        const combinedR = col.radius + playerRadius;

        if (dist < combinedR) {
          hitObstacle = true;
          const nx = cdx / (dist || 1);
          const nz = cdz / (dist || 1);
          const pen = combinedR - dist;

          proposedX += nx * pen;
          proposedZ += nz * pen;

          const dot = vx * nx + vz * nz;
          if (dot < 0) {
            vx -= dot * nx;
            vz -= dot * nz;
          }
        }
      }
    }
  }

  // 4. Vertical Integration, Ground Snapping & Controlled Jump Mechanics
  const groundElevation = isInsideHab ? 0.05 : getTerrainHeight(proposedX, proposedZ);
  let resolvedY = y;
  let resolvedVy = vy;
  let isGrounded = wasGrounded;
  let justLanded = false;

  const STEP_DOWN_MAX = 0.38; // Max step height down before entering airborne fall state

  if (jumpRequested && wasGrounded) {
    // Controlled Martian Jump Impulse (0.38g float)
    resolvedVy = 3.65;
    isGrounded = false;
    resolvedY = y + resolvedVy * delta;
  } else if (wasGrounded) {
    // Ground Sticking / Step-Down Probing:
    // If the player walked onto slightly lower terrain within step distance, snap down smoothly
    const dropDist = y - groundElevation;
    if (dropDist >= -0.05 && dropDist <= STEP_DOWN_MAX) {
      resolvedY = groundElevation;
      resolvedVy = 0;
      isGrounded = true;
    } else if (dropDist < -0.05) {
      // Walking uphill: conform to ground elevation
      resolvedY = groundElevation;
      resolvedVy = 0;
      isGrounded = true;
    } else {
      // Stepped over an edge / cliff higher than STEP_DOWN_MAX: begin airborne fall
      isGrounded = false;
      resolvedVy -= MARS_GRAVITY * delta;
      resolvedY = y + resolvedVy * delta;
    }
  } else {
    // Currently airborne: integrate Martian gravity
    resolvedVy -= MARS_GRAVITY * delta;
    const candidateY = y + resolvedVy * delta;

    if (candidateY <= groundElevation) {
      // Touchdown / Impact
      resolvedY = groundElevation;
      resolvedVy = 0;
      isGrounded = true;
      justLanded = true;
    } else {
      resolvedY = candidateY;
      isGrounded = false;
    }
  }

  // Cave Interior Ceiling Collision Check (prevents jumping through cave rock roof)
  if (!isInsideHab && ProceduralTerrainSystem.getInstance().isPointInCave(proposedX, proposedZ)) {
    const ceilHeight = ProceduralTerrainSystem.getInstance().getCaveCeilingHeight(proposedX, proposedZ);
    if (resolvedY > ceilHeight - 1.8) {
      resolvedY = ceilHeight - 1.8;
      if (resolvedVy > 0) resolvedVy = 0;
    }
  }

  return {
    position: [proposedX, resolvedY, proposedZ],
    velocity: [vx, resolvedVy, vz],
    isGrounded,
    justLanded,
    onSlope,
    slopeAngleDeg,
    groundNormal,
    hitObstacle,
  };
}

/**
 * Resolves character movement against environment with sliding plane physics
 * (Preserved for backwards compatibility with existing calls)
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
  const dt = 0.016;
  const result = resolveCharacterPhysics({
    currentPos,
    velocity: [displacement[0] / dt, displacement[1] / dt, displacement[2] / dt],
    delta: dt,
    playerRadius,
    isInsideHab,
    doorOpen,
    roverPos,
    renovations,
    wasGrounded: true,
    jumpRequested: false,
  });

  return result.position;
}

/**
 * Resolves Rover vehicle collision against world obstacles and deterministic rocks
 */
export function resolveRoverCollision(
  roverPos: [number, number, number],
  roverVelocity: [number, number, number],
  doorOpen = false
): { newPos: [number, number, number]; newVelocity: [number, number, number]; collided: boolean } {
  const [x, , z] = roverPos;
  let [vx, vy, vz] = roverVelocity;
  let proposedX = x + vx;
  let proposedZ = z + vz;
  let collided = false;

  const ROVER_COLLISION_RADIUS = 1.6;
  const HAB_DOME_RADIUS = 7.5;

  // List of obstacles
  const colliders: StaticCollider[] = [...OUTPOST_COLLIDERS];
  if (!doorOpen) colliders.push(CLOSED_DOOR_COLLIDER);

  // Add nearby deterministic rocks to rover obstacle list
  for (let i = 0; i < DETERMINISTIC_ROCKS.length; i++) {
    const rock = DETERMINISTIC_ROCKS[i];
    if (Math.abs(proposedX - rock.x) < 5.2 && Math.abs(proposedZ - rock.z) < 5.2) {
      colliders.push({
        type: 'cylinder',
        id: rock.id,
        center: [rock.x, rock.z],
        radius: rock.radius,
        minY: rock.y - 1.0,
        maxY: rock.y + rock.scale * 1.5,
      });
    }
  }

  // 1. Habitat Dome Collision (Rover cannot enter primary habitat dome)
  const distToCenter = Math.hypot(proposedX, proposedZ);
  if (distToCenter < HAB_DOME_RADIUS + ROVER_COLLISION_RADIUS) {
    collided = true;
    const nx = proposedX / (distToCenter || 1);
    const nz = proposedZ / (distToCenter || 1);
    const pen = HAB_DOME_RADIUS + ROVER_COLLISION_RADIUS - distToCenter;
    proposedX += nx * pen;
    proposedZ += nz * pen;
    const dot = vx * nx + vz * nz;
    if (dot < 0) {
      vx -= 1.25 * dot * nx;
      vz -= 1.25 * dot * nz;
    }
  }

  // Secondary Dome Collision (Rover cannot enter secondary habitat dome)
  const SECONDARY_DOME_Z = -14.5;
  const distToSecondary = Math.hypot(proposedX, proposedZ - SECONDARY_DOME_Z);
  if (distToSecondary < 5.5 + ROVER_COLLISION_RADIUS) {
    collided = true;
    const nx = proposedX / (distToSecondary || 1);
    const nz = (proposedZ - SECONDARY_DOME_Z) / (distToSecondary || 1);
    const pen = 5.5 + ROVER_COLLISION_RADIUS - distToSecondary;
    proposedX += nx * pen;
    proposedZ += nz * pen;
    const dot = vx * nx + vz * nz;
    if (dot < 0) {
      vx -= 1.25 * dot * nx;
      vz -= 1.25 * dot * nz;
    }
  }

  // 2. Static Obstacle & Rock Colliders
  for (const col of colliders) {
    if (col.type === 'box') {
      const minX = col.min[0] - ROVER_COLLISION_RADIUS;
      const maxX = col.max[0] + ROVER_COLLISION_RADIUS;
      const minZ = col.min[2] - ROVER_COLLISION_RADIUS;
      const maxZ = col.max[2] + ROVER_COLLISION_RADIUS;

      if (proposedX > minX && proposedX < maxX && proposedZ > minZ && proposedZ < maxZ) {
        collided = true;
        const distLeft = proposedX - minX;
        const distRight = maxX - proposedX;
        const distBack = proposedZ - minZ;
        const distFront = maxZ - proposedZ;

        const minDist = Math.min(distLeft, distRight, distBack, distFront);
        if (minDist === distLeft) {
          proposedX = minX;
          vx = -vx * 0.2;
        } else if (minDist === distRight) {
          proposedX = maxX;
          vx = -vx * 0.2;
        } else if (minDist === distBack) {
          proposedZ = minZ;
          vz = -vz * 0.2;
        } else {
          proposedZ = maxZ;
          vz = -vz * 0.2;
        }
      }
    } else if (col.type === 'cylinder') {
      const cdx = proposedX - col.center[0];
      const cdz = proposedZ - col.center[1];
      const dist = Math.hypot(cdx, cdz);
      const combinedR = col.radius + ROVER_COLLISION_RADIUS;

      if (dist < combinedR) {
        collided = true;
        const nx = cdx / (dist || 1);
        const nz = cdz / (dist || 1);
        const pen = combinedR - dist;
        proposedX += nx * pen;
        proposedZ += nz * pen;

        const dot = vx * nx + vz * nz;
        if (dot < 0) {
          vx -= 1.25 * dot * nx;
          vz -= 1.25 * dot * nz;
        }
      }
    }
  }

  const terrainY = getTerrainHeight(proposedX, proposedZ);
  return {
    newPos: [proposedX, terrainY, proposedZ],
    newVelocity: [vx, vy, vz],
    collided,
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

  // 1. Terrain Height & Subterranean Cave Ceiling Sample along camera ray
  const steps = 12;
  const terrainSys = ProceduralTerrainSystem.getInstance();
  for (let i = 1; i <= steps; i++) {
    const testDist = (desiredDistance * i) / steps;
    const testPoint = new THREE.Vector3().copy(pivotPos).addScaledVector(rayDir, testDist);
    if (terrainSys.isPointInCave(testPoint.x, testPoint.z)) {
      const floorH = terrainSys.getCaveFloorHeight(testPoint.x, testPoint.z);
      const ceilH = terrainSys.getCaveCeilingHeight(testPoint.x, testPoint.z);
      if (testPoint.y <= floorH + 0.35 || testPoint.y >= ceilH - 0.35) {
        maxAllowedDistance = Math.min(maxAllowedDistance, Math.max(0.65, testDist - 0.35));
        break;
      }
    } else {
      const terrainHeight = terrainSys.getSurfaceTerrainHeight(testPoint.x, testPoint.z);
      if (testPoint.y <= terrainHeight + 0.42) {
        maxAllowedDistance = Math.min(maxAllowedDistance, Math.max(0.65, testDist - 0.35));
        break;
      }
    }
  }

  // 2. Habitat Dome Shell & Environmental Colliders
  const colliders: StaticCollider[] = [...OUTPOST_COLLIDERS];
  if (!doorOpen) colliders.push(CLOSED_DOOR_COLLIDER);

  // Add nearby deterministic rocks to camera ray test
  for (let i = 0; i < DETERMINISTIC_ROCKS.length; i++) {
    const rock = DETERMINISTIC_ROCKS[i];
    if (
      Math.abs(pivotPos.x - rock.x) < desiredDistance + 3 &&
      Math.abs(pivotPos.z - rock.z) < desiredDistance + 3
    ) {
      colliders.push({
        type: 'cylinder',
        id: rock.id,
        center: [rock.x, rock.z],
        radius: rock.radius + 0.25,
        minY: rock.y - 1.0,
        maxY: rock.y + rock.scale * 1.6,
      });
    }
  }

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
          maxAllowedDistance = Math.max(0.65, hitDist - 0.28);
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
          maxAllowedDistance = Math.max(0.65, hitDist - 0.28);
        }
      }
    }
  }

  const resultPos = new THREE.Vector3().copy(pivotPos).addScaledVector(rayDir, maxAllowedDistance);
  // Guarantee camera does not sink below terrain or clip cave roof at final position
  if (terrainSys.isPointInCave(resultPos.x, resultPos.z)) {
    const floorH = terrainSys.getCaveFloorHeight(resultPos.x, resultPos.z);
    const ceilH = terrainSys.getCaveCeilingHeight(resultPos.x, resultPos.z);
    if (resultPos.y < floorH + 0.35) resultPos.y = floorH + 0.35;
    if (resultPos.y > ceilH - 0.35) resultPos.y = ceilH - 0.35;
  } else {
    const groundY = terrainSys.getSurfaceTerrainHeight(resultPos.x, resultPos.z);
    if (resultPos.y < groundY + 0.42) {
      resultPos.y = groundY + 0.42;
    }
  }

  return resultPos;
}
