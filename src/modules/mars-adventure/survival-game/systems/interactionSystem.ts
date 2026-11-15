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
    resourceNodes: ResourceNodeData[],
    robotPos?: [number, number, number],
    robotMode?: string
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
        promptText: 'Refill Suit Oxygen & Inspect Grid [E]',
        position: [0, 1.0, -3.2],
        interactionRadius: 3.0,
      },
      // Habitat Interior Base Power Grid & Circuit Breaker Console
      {
        id: 'outpost_power_grid_console',
        type: 'power_grid_console',
        name: 'Base Power Grid & Breakers',
        promptText: 'Manage Power Grid & Circuits [E]',
        position: [-1.8, 1.0, -3.2],
        interactionRadius: 3.2,
      },
      // Habitat Interior Command Centre & Planetary Radar
      {
        id: 'command_centre_terminal',
        type: 'facility_terminal',
        name: 'Command Centre & Telemetry Hub',
        promptText: 'Access Command Centre Console [E]',
        position: [0, 1.0, -3.4],
        interactionRadius: 3.2,
      },
      // Habitat Interior Base AI & Autonomous Systems Hub
      {
        id: 'outpost_ai_console',
        type: 'intelligent_base_console',
        name: 'Base AI & Autonomous Command Hub',
        promptText: 'Access Base AI & Rover Autopilot [E]',
        position: [0, 1.0, -2.6],
        interactionRadius: 3.0,
      },
      // Habitat Interior Mission Command Terminal
      {
        id: 'outpost_mission_terminal',
        type: 'mission_terminal',
        name: 'Mission Operations & Campaign Console',
        promptText: 'Access Mission Campaign Terminal [E]',
        position: [0.8, 1.0, -3.4],
        interactionRadius: 3.2,
      },
      // Habitat Interior Scientific Research Console
      {
        id: 'outpost_research_terminal',
        type: 'research_terminal',
        name: 'Planetary Science & Blueprint Terminal',
        promptText: 'Access Research Laboratory [E]',
        position: [-1.2, 1.0, -3.4],
        interactionRadius: 3.2,
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
      // Habitat Interior Scrap Disassembly & Recycling Station
      {
        id: 'outpost_disassembly_station',
        type: 'disassembly_station',
        name: 'Scrap Disassembly & Recycling Station',
        promptText: 'Access Scrap Disassembly [E]',
        position: [-3.6, 1.0, 1.5],
        interactionRadius: 3.2,
      },
      // Habitat Interior Molecular Sintering Fabrication Unit
      {
        id: 'outpost_crafting_station',
        type: 'crafting_station',
        name: 'Molecular Fabrication Unit',
        promptText: 'Access Component Fabrication [E]',
        position: [3.6, 1.0, 1.5],
        interactionRadius: 3.2,
      },
      // Secondary Dome: Greenhouse Hydroponic Farm (East Wing)
      {
        id: 'greenhouse_harvest_station',
        type: 'greenhouse_harvest',
        name: 'Hydroponic Aeroponic Farm',
        promptText: 'Harvest Hydroponic Crops [E] • Manage Farm [E]',
        position: [3.2, 1.0, -14.5],
        interactionRadius: 3.4,
      },
      // Secondary Dome: Living Quarters & Crew Bunks (West Wing)
      {
        id: 'living_quarters_bunk_station',
        type: 'bunk_bed',
        name: 'Crew Living Quarters & Sleep Pod',
        promptText: 'Rest in Crew Bunk [E] • Manage Quarters [E]',
        position: [-3.2, 1.0, -14.5],
        interactionRadius: 3.4,
      },
      // Exterior Rover Maintenance Garage
      {
        id: 'rover_garage_depot',
        type: 'garage_charger',
        name: 'Rover Maintenance Garage Depot',
        promptText: 'Service Rover & Recharge [E] • Upgrade Garage [E]',
        position: [8.5, 1.0, 4.0],
        interactionRadius: 4.8,
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
      // Exterior 3D Exploration Landmarks
      {
        id: 'loc_abandoned_rover',
        type: 'exploration_landmark',
        name: 'Abandoned Rover ("Opportunity-Beta")',
        promptText: 'Inspect Relic Rover & Extract Sample [E]',
        position: [38, 0, -32],
        interactionRadius: 6.0,
      },
      {
        id: 'loc_lava_tube',
        type: 'exploration_landmark',
        name: 'Subterranean Lava Tube Entrance',
        promptText: 'Investigate Lava Tube Entrance [E]',
        position: [-35, 0, -42],
        interactionRadius: 6.5,
      },
      {
        id: 'loc_comms_tower',
        type: 'exploration_landmark',
        name: 'Deep Space Communications Mast',
        promptText: 'Inspect Comms Relay Tower [E]',
        position: [42, 0, 28],
        interactionRadius: 6.0,
      },
      {
        id: 'loc_delta_outcrop',
        type: 'exploration_landmark',
        name: 'Jezero Paleolake Delta Outcrop',
        promptText: 'Extract Clay Paleolake Core Sample [E]',
        position: [-40, 0, 22],
        interactionRadius: 6.5,
      },
      {
        id: 'loc_meteorite_crater',
        type: 'exploration_landmark',
        name: 'Crater Borealis Nickel-Iron Meteorite',
        promptText: 'Analyze Extraterrestrial Meteorite [E]',
        position: [0, 0, 52],
        interactionRadius: 6.0,
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

    // Add Aero-Bot Robot Companion
    if (robotPos) {
      candidateList.push({
        id: 'robot_companion',
        type: 'robot_companion',
        name: `Aero-Bot (${(robotMode || 'idle').toUpperCase().replace('_', ' ')})`,
        promptText: robotMode === 'follow_player' ? 'Command Aero-Bot: Hold Position [E]' : 'Command Aero-Bot: Follow [E]',
        position: robotPos,
        interactionRadius: 3.2,
      });
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
          obj.type === 'power_grid_console' ||
          obj.type === 'storage_terminal' ||
          obj.type === 'renovation_terminal' ||
          obj.type === 'crafting_station' ||
          obj.type === 'disassembly_station' ||
          obj.type === 'facility_terminal' ||
          obj.type === 'mission_terminal' ||
          obj.type === 'research_terminal' ||
          obj.type === 'bunk_bed' ||
          obj.type === 'greenhouse_harvest') &&
        !isInsideHab
      )
        continue;

      if (
        (obj.type === 'garage_charger' ||
          obj.type === 'moxie_unit' ||
          obj.type === 'solar_inverter' ||
          obj.type === 'exploration_landmark') &&
        isInsideHab
      ) {
        continue;
      }

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
