import * as THREE from 'three';
import {
  getTerrainNormal,
  DETERMINISTIC_ROCKS,
} from '../components/canvas/MarsTerrain';
import {
  OUTPOST_COLLIDERS,
  CLOSED_DOOR_COLLIDER,
  StaticCollider,
} from './collisionSystem';
import {
  RoverDestination,
  RoverNavigationPlan,
  RoverAIState,
} from '../types/aiTypes';

export interface RoverAIControlOutput {
  moveForward: number; // -1 to 1 (throttle / brake)
  moveRight: number; // -1 to 1 (steering)
  handbrakeActive: boolean;
  state: RoverAIState;
  obstacleNotice?: string;
}

export class RoverAISystem {
  private static readonly ROVER_WIDTH = 2.4;
  private static readonly SAFETY_MARGIN = 2.0;
  private static readonly MAX_SAFE_SLOPE_RAD = 30 * (Math.PI / 180); // 30 degrees maximum safe incline

  /**
   * Evaluates if a 2D line segment between p1 and p2 collides with static world obstacles
   */
  public static isSegmentBlocked(
    p1: [number, number],
    p2: [number, number]
  ): { blocked: boolean; obstacleName?: string; point?: [number, number] } {
    const colliders: StaticCollider[] = [...OUTPOST_COLLIDERS, CLOSED_DOOR_COLLIDER];

    // Dome obstacles (habitat main dome + secondary greenhouse dome)
    const domes = [
      { id: 'hab_main_dome', center: [0, 0] as [number, number], radius: 8.2 },
      { id: 'hab_secondary_dome', center: [0, -14.5] as [number, number], radius: 6.2 },
    ];

    const dx = p2[0] - p1[0];
    const dz = p2[1] - p1[1];
    const segmentLen = Math.hypot(dx, dz);
    if (segmentLen < 0.1) return { blocked: false };

    const samples = Math.max(5, Math.ceil(segmentLen / 1.5));

    for (let s = 1; s <= samples; s++) {
      const t = s / samples;
      const x = p1[0] + dx * t;
      const z = p1[1] + dz * t;

      // 1. Check domes
      for (const dome of domes) {
        const distToDome = Math.hypot(x - dome.center[0], z - dome.center[1]);
        if (distToDome < dome.radius + this.ROVER_WIDTH * 0.5) {
          return { blocked: true, obstacleName: 'Outpost Alpha Dome Perimeter', point: [x, z] };
        }
      }

      // 2. Check static cylinder/box colliders
      for (const c of colliders) {
        if (c.type === 'cylinder') {
          const d = Math.hypot(x - c.center[0], z - c.center[1]);
          if (d < c.radius + this.ROVER_WIDTH * 0.5 + this.SAFETY_MARGIN * 0.5) {
            return { blocked: true, obstacleName: c.id, point: [x, z] };
          }
        } else if (c.type === 'box') {
          const pad = this.ROVER_WIDTH * 0.5 + 0.6;
          if (
            x >= c.min[0] - pad &&
            x <= c.max[0] + pad &&
            z >= c.min[2] - pad &&
            z <= c.max[2] + pad
          ) {
            return { blocked: true, obstacleName: c.id, point: [x, z] };
          }
        }
      }

      // 3. Check major deterministic rocks
      for (let r = 0; r < DETERMINISTIC_ROCKS.length; r++) {
        const rock = DETERMINISTIC_ROCKS[r];
        if (rock.scale > 1.2) {
          const dRock = Math.hypot(x - rock.x, z - rock.z);
          if (dRock < rock.scale * 1.5 + this.ROVER_WIDTH * 0.5) {
            return { blocked: true, obstacleName: `Rock Cluster #${rock.id}`, point: [x, z] };
          }
        }
      }

      // 4. Check terrain slope gradient
      const normal = getTerrainNormal(x, z);
      const slopeAngle = Math.acos(THREE.MathUtils.clamp(normal.y, -1, 1));
      if (slopeAngle > this.MAX_SAFE_SLOPE_RAD) {
        return { blocked: true, obstacleName: `Extreme Slope Incline (${Math.round(slopeAngle * (180 / Math.PI))}°)`, point: [x, z] };
      }
    }

    return { blocked: false };
  }

  /**
   * Plans a navigable waypoint route from start to destination, routing around Outpost Alpha
   * and major terrain barriers.
   */
  public static planRoute(
    start: [number, number, number],
    dest: RoverDestination
  ): RoverNavigationPlan {
    const start2D: [number, number] = [start[0], start[2]];
    const dest2D: [number, number] = [dest.position[0], dest.position[2]];

    const totalDist = Math.hypot(dest2D[0] - start2D[0], dest2D[1] - start2D[1]);

    // Check direct line-of-sight path
    const directCheck = this.isSegmentBlocked(start2D, dest2D);

    if (!directCheck.blocked) {
      return {
        destination: dest,
        state: 'navigating',
        waypoints: [dest2D],
        currentWaypointIndex: 0,
        totalDistance: totalDist,
        remainingDistance: totalDist,
        progressPercent: 0,
      };
    }

    // Direct path is blocked — generate intermediate detour waypoints around central Outpost
    // Outpost Alpha spans from X [-9, 9], Z [-20, 11].
    // Navigable clearance ring coordinates around Outpost Alpha:
    const clearanceNodes: [number, number][] = [
      [14, 14],   // South-East transit corridor
      [14, 0],    // East perimeter
      [14, -14],  // North-East corridor
      [-14, -14], // North-West corridor
      [-14, 0],   // West perimeter
      [-14, 14],  // South-West corridor
      [0, 22],    // South transit (behind solar field)
      [0, -26],   // North transit (behind secondary dome)
    ];

    // Pick optimal detour waypoint that creates two unblocked segments
    let bestRoute: [number, number][] | null = null;
    let shortestDist = Infinity;

    for (const node of clearanceNodes) {
      const leg1 = this.isSegmentBlocked(start2D, node);
      const leg2 = this.isSegmentBlocked(node, dest2D);

      if (!leg1.blocked && !leg2.blocked) {
        const d = Math.hypot(node[0] - start2D[0], node[1] - start2D[1]) +
                  Math.hypot(dest2D[0] - node[0], dest2D[1] - node[1]);
        if (d < shortestDist) {
          shortestDist = d;
          bestRoute = [node, dest2D];
        }
      }
    }

    // If single detour node wasn't enough, try two-node transit perimeter ring
    if (!bestRoute) {
      for (const n1 of clearanceNodes) {
        if (this.isSegmentBlocked(start2D, n1).blocked) continue;
        for (const n2 of clearanceNodes) {
          if (n1 === n2) continue;
          if (this.isSegmentBlocked(n1, n2).blocked) continue;
          if (this.isSegmentBlocked(n2, dest2D).blocked) continue;

          const d = Math.hypot(n1[0] - start2D[0], n1[1] - start2D[1]) +
                    Math.hypot(n2[0] - n1[0], n2[1] - n1[1]) +
                    Math.hypot(dest2D[0] - n2[0], dest2D[1] - n2[1]);
          if (d < shortestDist) {
            shortestDist = d;
            bestRoute = [n1, n2, dest2D];
          }
        }
      }
    }

    if (bestRoute) {
      return {
        destination: dest,
        state: 'navigating',
        waypoints: bestRoute,
        currentWaypointIndex: 0,
        totalDistance: shortestDist,
        remainingDistance: shortestDist,
        progressPercent: 0,
      };
    }

    // Path obstructed and could not find safe corridor
    return {
      destination: dest,
      state: 'failed',
      waypoints: [],
      currentWaypointIndex: 0,
      totalDistance: totalDist,
      remainingDistance: totalDist,
      progressPercent: 0,
      failureReason: `Terrain path to ${dest.name} blocked by ${directCheck.obstacleName || 'obstacle'}.`,
    };
  }

  /**
   * Computes throttle, steering, and braking control inputs for the Rover physics engine
   */
  public static computeControls(
    roverPos: [number, number, number],
    roverHeading: number, // vehicle yaw in radians
    roverSpeed: number, // current speed in m/s
    plan: RoverNavigationPlan,
    delta: number
  ): RoverAIControlOutput {
    if (plan.state !== 'navigating' || !plan.destination || plan.waypoints.length === 0) {
      return {
        moveForward: 0,
        moveRight: 0,
        handbrakeActive: plan.state === 'arrived',
        state: plan.state,
      };
    }

    const currentWaypoint = plan.waypoints[plan.currentWaypointIndex];
    if (!currentWaypoint) {
      return {
        moveForward: 0,
        moveRight: 0,
        handbrakeActive: true,
        state: 'arrived',
      };
    }

    const dx = currentWaypoint[0] - roverPos[0];
    const dz = currentWaypoint[1] - roverPos[2];
    const distToWaypoint = Math.hypot(dx, dz);

    const isFinalWaypoint = plan.currentWaypointIndex === plan.waypoints.length - 1;

    // Check if intermediate or final waypoint arrived
    if (isFinalWaypoint && distToWaypoint < 2.8) {
      // Arrived at destination! Gently apply service brake & handbrake to full stop
      if (Math.abs(roverSpeed) < 0.45) {
        return {
          moveForward: 0,
          moveRight: 0,
          handbrakeActive: true,
          state: 'arrived',
        };
      } else {
        return {
          moveForward: -0.8, // Service brake
          moveRight: 0,
          handbrakeActive: false,
          state: 'navigating',
        };
      }
    } else if (!isFinalWaypoint && distToWaypoint < 3.8) {
      // Advance to next waypoint
      plan.currentWaypointIndex++;
      return this.computeControls(roverPos, roverHeading, roverSpeed, plan, delta);
    }

    // Forward lookahead obstacle check in front of rover
    const lookaheadDist = Math.max(3.0, Math.min(6.5, roverSpeed * 1.5));
    const lookX = roverPos[0] + Math.sin(roverHeading) * lookaheadDist;
    const lookZ = roverPos[2] + Math.cos(roverHeading) * lookaheadDist;

    const lookCheck = this.isSegmentBlocked([roverPos[0], roverPos[2]], [lookX, lookZ]);
    if (lookCheck.blocked) {
      return {
        moveForward: -0.6, // Brake before collision
        moveRight: 0,
        handbrakeActive: false,
        state: 'obstacle_detected',
        obstacleNotice: `Obstacle Detected: ${lookCheck.obstacleName || 'Unknown barrier'} ahead.`,
      };
    }

    // Kinematic steering calculations (Ackerman target angle)
    const targetHeading = Math.atan2(dx, dz);
    let headingDiff = targetHeading - roverHeading;

    // Normalize angle to [-PI, PI]
    while (headingDiff > Math.PI) headingDiff -= Math.PI * 2;
    while (headingDiff < -Math.PI) headingDiff += Math.PI * 2;

    // Deadband to eliminate high-frequency steering chatter
    let steerAxis = 0;
    if (Math.abs(headingDiff) > 0.04) {
      steerAxis = THREE.MathUtils.clamp(-headingDiff * 1.6, -1.0, 1.0);
    }

    // Forward throttle planning
    let forwardAxis = 1.0;

    // If heading alignment is off by > 45 degrees, reduce throttle to turn sharply
    if (Math.abs(headingDiff) > 0.8) {
      forwardAxis = 0.35;
    } else if (Math.abs(headingDiff) > 0.4) {
      forwardAxis = 0.65;
    }

    // Ease throttle as we approach final destination
    if (isFinalWaypoint && distToWaypoint < 10.0) {
      forwardAxis = Math.max(0.25, distToWaypoint / 10.0);
    }

    return {
      moveForward: forwardAxis,
      moveRight: steerAxis,
      handbrakeActive: false,
      state: 'navigating',
    };
  }
}
