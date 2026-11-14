import * as THREE from 'three';
import { InteractableObject, ResourceNodeData } from '../types/survivalTypes';
import { hasLineOfSight } from './collisionSystem';

export class MarsInteractionSystem {
  /**
   * Discovers the closest valid interactive entity in front of the player
   */
  public static getTargetedInteractable(
    playerPos: [number, number, number],
    camForward: THREE.Vector3,
    doorOpen: boolean,
    isInsideHab: boolean,
    roverPos: [number, number, number],
    controlMode: 'on_foot' | 'driving_rover',
    resourceNodes: ResourceNodeData[]
  ): InteractableObject | null {
    // 1. If currently driving rover, only interactable is dismounting the rover
    if (controlMode === 'driving_rover') {
      return {
        id: 'rover_dismount',
        type: 'rover',
        name: 'Mars Exploration Rover',
        promptText: 'Dismount Rover [E]',
        position: roverPos,
        interactionRadius: 4.0,
      };
    }

    // 2. Build list of potential interactive objects in the world
    const candidateList: InteractableObject[] = [
      // Habitat Outer Airlock Door
      {
        id: 'outpost_airlock_door',
        type: 'airlock_door',
        name: 'Airlock Bulkhead',
        promptText: doorOpen ? 'Close Airlock Door [E]' : 'Open Airlock Door [E]',
        position: [0, 1.4, 9.5],
        interactionRadius: 3.5,
      },
      // Habitat Interior Life-Support Terminal (only accessible inside)
      {
        id: 'habitat_terminal',
        type: 'power_terminal',
        name: 'Outpost Life-Support Console',
        promptText: 'Access Life-Support Telemetry [E]',
        position: [0, 1.0, -3.2],
        interactionRadius: 3.0,
      },
      // Habitat Interior Material Storage Vault
      {
        id: 'habitat_vault_terminal',
        type: 'storage_terminal',
        name: 'Space Center Material Vault',
        promptText: 'Access Material Vault [E]',
        position: [-3.2, 1.0, -2.0],
        interactionRadius: 3.2,
      },
      // Habitat Interior Engineering & Renovation Station
      {
        id: 'habitat_renovation_station',
        type: 'renovation_terminal',
        name: 'Space Center Renovation Station',
        promptText: 'Access Renovation Console [E]',
        position: [3.2, 1.0, -2.0],
        interactionRadius: 3.2,
      },
      // MOXIE Processor (exterior)
      {
        id: 'moxie_processor',
        type: 'moxie_unit',
        name: 'MOXIE Oxygen Generator',
        promptText: 'Check MOXIE Oxygen Reserves [E]',
        position: [-6.2, 1.2, 4.5],
        interactionRadius: 3.8,
      },
      // Solar Array Station
      {
        id: 'solar_inverter',
        type: 'solar_inverter',
        name: 'Photovoltaic Array Inverter',
        promptText: 'Inspect Photovoltaic Output [E]',
        position: [0, 1.2, 18.0],
        interactionRadius: 4.5,
      },
      // Mars Rover (when on foot)
      {
        id: 'mars_rover',
        type: 'rover',
        name: 'Mars Exploration Rover',
        promptText: 'Mount Exploration Rover [E]',
        position: roverPos,
        interactionRadius: 3.8,
      },
    ];

    // Add un-depleted resource nodes
    for (const node of resourceNodes) {
      if (!node.depleted) {
        candidateList.push({
          id: node.id,
          type: 'resource_node',
          name: node.name,
          promptText: `Extract ${node.name} [E] • Info [I]`,
          position: node.position,
          interactionRadius: 3.8,
          resourceData: node,
        });
      }
    }

    // 3. Filter candidates by distance, vision cone, and line of sight
    let bestCandidate: InteractableObject | null = null;
    let closestDist = Infinity;

    const pPos = new THREE.Vector3(...playerPos);

    for (const obj of candidateList) {
      const oPos = new THREE.Vector3(...obj.position);
      const dist = pPos.distanceTo(oPos);

      // Range check
      if (dist > obj.interactionRadius) continue;

      // Interior/Exterior separation check:
      // If object is inside terminal and player is outside, reject
      if (
        (obj.type === 'power_terminal' ||
          obj.type === 'storage_terminal' ||
          obj.type === 'renovation_terminal') &&
        !isInsideHab
      )
        continue;

      // Vision cone check (must be somewhat in front of the camera/character)
      const toObj = new THREE.Vector3().subVectors(oPos, pPos).normalize();
      const dot = camForward.dot(toObj);
      if (dot < 0.25) continue; // within ~75 degree cone

      // Wall line-of-sight check
      const los = hasLineOfSight(playerPos, obj.position, doorOpen);
      if (!los) continue;

      if (dist < closestDist) {
        closestDist = dist;
        bestCandidate = obj;
      }
    }

    return bestCandidate;
  }
}
