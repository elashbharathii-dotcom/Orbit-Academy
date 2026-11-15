import { ResourceType } from './survivalTypes';

export type FacilityId =
  | 'command_centre'
  | 'greenhouse'
  | 'engineering_workshop'
  | 'rover_garage'
  | 'living_quarters'
  | 'comm_room';

export type RenovationLevel = 0 | 1 | 2 | 3;

export type FacilityRenovations = Record<FacilityId, RenovationLevel>;

export interface FacilityUpgradeCost {
  type: ResourceType;
  count: number;
}

export interface FacilityStageDefinition {
  level: RenovationLevel;
  title: string;
  conditionName: string;
  description: string;
  cost: FacilityUpgradeCost[];
  unlockedBenefits: string[];
  conditionPercent: number;
}

export interface FacilityDefinition {
  id: FacilityId;
  name: string;
  zone: string;
  position: [number, number, number];
  icon: string;
  summary: string;
  stages: Record<RenovationLevel, FacilityStageDefinition>;
}

export const INITIAL_FACILITY_RENOVATIONS: FacilityRenovations = {
  command_centre: 0,
  greenhouse: 0,
  engineering_workshop: 0,
  rover_garage: 0,
  living_quarters: 0,
  comm_room: 0,
};

export const LEVEL_NAMES: Record<RenovationLevel, string> = {
  0: 'ABANDONED',
  1: 'REPAIRED',
  2: 'OPERATIONAL',
  3: 'ADVANCED',
};

export const FACILITIES_DATABASE: Record<FacilityId, FacilityDefinition> = {
  command_centre: {
    id: 'command_centre',
    name: 'Command Centre & Telemetry Hub',
    zone: 'Primary Dome — North Sector [0, 0, -3.6]',
    position: [0, 1.0, -3.6],
    icon: 'Radio',
    summary: 'Central mission coordination deck, atmospheric telemetry analysis, and planetary surface radar.',
    stages: {
      0: {
        level: 0,
        title: 'Abandoned Console Deck',
        conditionName: 'CRITICAL FAILURE',
        description: 'Damaged cathode displays, fried breakers, offline core computing mainframe.',
        cost: [],
        unlockedBenefits: ['Basic emergency backup lighting.'],
        conditionPercent: 15,
      },
      1: {
        level: 1,
        title: 'Repaired Telemetry Terminal',
        conditionName: 'BASIC FUNCTIONALITY',
        description: 'Rewired power relays, patched CRT monitors, active Jezero coordinate telemetry.',
        cost: [
          { type: 'scrap_metal', count: 4 },
          { type: 'copper_wire', count: 3 },
          { type: 'fasteners', count: 4 },
        ],
        unlockedBenefits: [
          'Jezero Crater Sol and atmospheric pressure telemetry restored',
          'Primary overhead fluorescent ceiling luminaires active',
          'Access to Outpost Alpha log archives',
        ],
        conditionPercent: 45,
      },
      2: {
        level: 2,
        title: 'Operational Planetary Holomap',
        conditionName: 'ONLINE & TRACKING',
        description: 'Rotating 3D Mars topographic hologram, long-range resource density scanner.',
        cost: [
          { type: 'metal_plate', count: 3 },
          { type: 'wire_assembly', count: 2 },
          { type: 'circuit_board', count: 2 },
        ],
        unlockedBenefits: [
          'Interactive 3D planetary wireframe holographic projection table',
          'Sector Exploration Radar: highlights uncollected mineral deposits within 100m',
          'Advanced mission telemetry sync with Earth Control',
        ],
        conditionPercent: 75,
      },
      3: {
        level: 3,
        title: 'Advanced Mission Operations Suite',
        conditionName: 'MAXIMUM SPECIFICATION',
        description: 'High-throughput quantum compute array, automated orbital satellite constellation uplink.',
        cost: [
          { type: 'structural_frame', count: 2 },
          { type: 'electronics_module', count: 2 },
          { type: 'battery_pack', count: 1 },
        ],
        unlockedBenefits: [
          'Quantum computing mainframe with particle field visualization',
          'Automated satellite weather forecast: 2-hour early warning for dust storms',
          'Unlocks high-priority orbital research contracts with telemetry bonus rewards',
        ],
        conditionPercent: 100,
      },
    },
  },

  greenhouse: {
    id: 'greenhouse',
    name: 'Hydroponic Bio-Dome & Farm',
    zone: 'Secondary Dome — East Sector [3.2, 0, -14.5]',
    position: [3.2, 1.0, -14.5],
    icon: 'Leaf',
    summary: 'Closed-loop biological life-support facility cultivating Martian potato tubers and Spirulina algae.',
    stages: {
      0: {
        level: 0,
        title: 'Desiccated Growing Bays',
        conditionName: 'DESICCATED & UNPRESSURIZED',
        description: 'Depressurized hydroponic trays, cracked aeroponic plumbing, burned ultraviolet ballasts.',
        cost: [],
        unlockedBenefits: ['Depressurized storage space.'],
        conditionPercent: 10,
      },
      1: {
        level: 1,
        title: 'Repaired Hydroponic Tanks',
        conditionName: 'PRESSURIZED & SEALED',
        description: 'Hydraulic nutrient pumps re-sealed, halogen warmth fixtures restored, water lines purged.',
        cost: [
          { type: 'scrap_metal', count: 5 },
          { type: 'fasteners', count: 6 },
          { type: 'water_ice', count: 3 },
        ],
        unlockedBenefits: [
          'Secondary bio-dome pressurized and sealed with breathable air',
          'Active warm halogen grow lamps',
          'Access to seed stock storage canisters',
        ],
        conditionPercent: 45,
      },
      2: {
        level: 2,
        title: 'Operational Aeroponic Farm',
        conditionName: 'ACTIVE CULTIVATION',
        description: 'Magenta UV LED grow arrays, sprouting Martian potato crops, bubbling nutrient misting.',
        cost: [
          { type: 'metal_plate', count: 3 },
          { type: 'wire_assembly', count: 2 },
          { type: 'water', count: 2 },
        ],
        unlockedBenefits: [
          'Active dual-tier magenta UV grow-arrays with flourishing green potato sprouts',
          'Hydroponic Harvest Action [E]: harvest fresh Food Rations (+1 ration every 0.5 Sol)',
          'Supplemental biological O2 generation (+15% O2 replenishment rate inside base)',
        ],
        conditionPercent: 80,
      },
      3: {
        level: 3,
        title: 'Advanced Automated Biosphere',
        conditionName: 'CLOSED-LOOP ECOLOGY',
        description: 'Automated nutrient dosing robots, Spirulina photobioreactor, genetic bio-stimulators.',
        cost: [
          { type: 'structural_frame', count: 2 },
          { type: 'electronics_module', count: 2 },
          { type: 'repair_kit', count: 1 },
        ],
        unlockedBenefits: [
          'Bubbling vertical algae photobioreactor column with bio-luminescent particles',
          'Doubled crop harvest yield (+2 Food Rations per harvest)',
          'Continuous autonomous oxygen scrub and production for whole outpost',
        ],
        conditionPercent: 100,
      },
    },
  },

  engineering_workshop: {
    id: 'engineering_workshop',
    name: 'Engineering & Fabrication Workshop',
    zone: 'Primary Dome — West Sector [-3.6, 0, 1.0]',
    position: [-3.6, 1.0, 1.0],
    icon: 'Wrench',
    summary: 'Heavy mechanical repair depot, molecular sintering 3D fabricator, and scrap pulverizer.',
    stages: {
      0: {
        level: 0,
        title: 'Damaged Machine Bay',
        conditionName: 'EQUIPMENT OFFLINE',
        description: 'Uncalibrated sintering laser, jammed shredder gears, exposed live electrical conduits.',
        cost: [],
        unlockedBenefits: ['Manual emergency hand-tools only.'],
        conditionPercent: 20,
      },
      1: {
        level: 1,
        title: 'Repaired Fabrication Table',
        conditionName: 'STANDARD OPERATION',
        description: 'Laser gantry aligned, high-torque pulverizer teeth freed, breaker fuses replaced.',
        cost: [
          { type: 'scrap_metal', count: 6 },
          { type: 'copper_wire', count: 3 },
          { type: 'fasteners', count: 4 },
        ],
        unlockedBenefits: [
          'Disassembly Station and Molecular Sintering 3D Fabricator online',
          'Basic component recipes unlocked',
          'Industrial floor safety lighting and tool racks',
        ],
        conditionPercent: 50,
      },
      2: {
        level: 2,
        title: 'Operational Precision Bench',
        conditionName: 'ENERGIZED & TUNED',
        description: 'Overclocked optical laser mirror, harmonic drive calibrator, diagnostic oscilloscopes.',
        cost: [
          { type: 'metal_plate', count: 4 },
          { type: 'wire_assembly', count: 2 },
          { type: 'repair_kit', count: 1 },
        ],
        unlockedBenefits: [
          'Dual animated cathode-ray oscilloscopes and robotic soldering station',
          'Crafting Speed Accelerated: -25% fabrication duration for all recipes',
          'Suit & Equipment Maintenance Bench: restores 100% EVA suit integrity on foot',
        ],
        conditionPercent: 80,
      },
      3: {
        level: 3,
        title: 'Advanced Molecular Foundry',
        conditionName: 'QUANTUM SINTERING',
        description: 'Automated robotic assembly arm, cold-plasma welding gantry, matter compiler.',
        cost: [
          { type: 'structural_frame', count: 3 },
          { type: 'electronics_module', count: 2 },
          { type: 'battery_pack', count: 1 },
        ],
        unlockedBenefits: [
          'High-density laser gantry with localized plasma bloom particles',
          'Material Efficiency Protocol: 20% chance to duplicate finished crafted item',
          'Unlocks Advanced Heavy Blueprints: rover upgrades and reinforced structures',
        ],
        conditionPercent: 100,
      },
    },
  },

  rover_garage: {
    id: 'rover_garage',
    name: 'Rover Maintenance Garage',
    zone: 'Exterior Apron — East Service Bay [8.5, 0, 4.0]',
    position: [8.5, 1.0, 4.0],
    icon: 'Car',
    summary: 'Exterior vehicle service hangar, overhead suspension gantry, and rapid induction recharge depot.',
    stages: {
      0: {
        level: 0,
        title: 'Abandoned Service Apron',
        conditionName: 'NO SERVICE INFRASTRUCTURE',
        description: 'Cracked concrete pad, severed umbilical charging cables, zero weather protection.',
        cost: [],
        unlockedBenefits: ['Open gravel vehicle parking space.'],
        conditionPercent: 10,
      },
      1: {
        level: 1,
        title: 'Repaired Service Slab',
        conditionName: 'FOUNDATION SECURED',
        description: 'Reinforced landing concrete, yellow industrial hazard stripes, manual power tether.',
        cost: [
          { type: 'scrap_metal', count: 6 },
          { type: 'fasteners', count: 8 },
          { type: 'copper_wire', count: 4 },
        ],
        unlockedBenefits: [
          'Heavy industrial service pad with painted yellow hazard perimeters',
          'Night floodlighting illuminates rover docking zone',
          'Manual battery charging cable: +2% battery per 10s when docked',
        ],
        conditionPercent: 40,
      },
      2: {
        level: 2,
        title: 'Operational Cantilever Canopy & Charger',
        conditionName: 'COVERED & CHARGING',
        description: 'Overhead steel protective canopy, wireless induction charging coils in ground deck.',
        cost: [
          { type: 'metal_plate', count: 4 },
          { type: 'wire_assembly', count: 3 },
          { type: 'battery_pack', count: 1 },
        ],
        unlockedBenefits: [
          'Overhead steel cantilever canopy protects parked rover from dust deposition',
          'Wireless Ground Induction Pad: rapid charges rover battery (+10% per minute)',
          'Docked rover cargo capacity link directly into space centre storage',
        ],
        conditionPercent: 75,
      },
      3: {
        level: 3,
        title: 'Advanced Robotic Vehicle Bay',
        conditionName: 'AUTOMATED FLEET DEPOT',
        description: 'Hydraulic maintenance lift, robotic diagnostic scanner gantry, automated tire inflators.',
        cost: [
          { type: 'structural_frame', count: 3 },
          { type: 'electronics_module', count: 2 },
          { type: 'repair_kit', count: 2 },
        ],
        unlockedBenefits: [
          'Automated robotic hull repair arm: restores parked rover hull integrity to 100%',
          'Overclocked Super-Induction Grid: instantly restores rover battery to 100%',
          'Expands Rover Storage Capacity from 100 kg to 150 kg',
        ],
        conditionPercent: 100,
      },
    },
  },

  living_quarters: {
    id: 'living_quarters',
    name: 'Crew Living Quarters & Med-Bay',
    zone: 'Secondary Dome — West Sector [-3.2, 0, -14.5]',
    position: [-3.2, 1.0, -14.5],
    icon: 'Home',
    summary: 'Pressurized astronaut quarters, restorative sleep pods, and life-support bio-regeneration.',
    stages: {
      0: {
        level: 0,
        title: 'Stripped Bunk Bay',
        conditionName: 'UNINHABITABLE',
        description: 'Bare aluminium frames, torn thermal quilts, offline environmental climate control.',
        cost: [],
        unlockedBenefits: ['Empty pressurized room.'],
        conditionPercent: 10,
      },
      1: {
        level: 1,
        title: 'Repaired Crew Bunk',
        conditionName: 'BASIC HABITATION',
        description: 'Cleaned sleeping bunks with insulated sleeping bags, personal gear lockers, soft amber sconces.',
        cost: [
          { type: 'scrap_metal', count: 5 },
          { type: 'fasteners', count: 4 },
          { type: 'food_ration', count: 2 },
        ],
        unlockedBenefits: [
          'Crew Rest Action [E]: sleep in bunk to advance Sol cycle by 4 hours',
          'Resting fully restores astronaut stamina and stabilizes core body temperature',
          'Personal storage locker in quarters (expands astronaut inventory by 5 kg)',
        ],
        conditionPercent: 45,
      },
      2: {
        level: 2,
        title: 'Operational Sleep Pods & Scrubber',
        conditionName: 'COMFORTABLE & REGENERATING',
        description: 'Acoustic dampening tiles, active carbon-dioxide scrubber, circadian lighting cycles.',
        cost: [
          { type: 'metal_plate', count: 3 },
          { type: 'wire_assembly', count: 2 },
          { type: 'medical_kit', count: 1 },
        ],
        unlockedBenefits: [
          'Pressurized sleep capsules with soft cyan circadian lighting',
          'Sleep fully restores player Health to 100% and resets thermal suit stress',
          'CO2 Scrubber stabilizes interior habitat air quality even during heavy dust storms',
        ],
        conditionPercent: 80,
      },
      3: {
        level: 3,
        title: 'Advanced Medical Bay & Sanatorium',
        conditionName: 'MEDICAL-GRADE QUARTERS',
        description: 'Automated diagnostic bio-bed, ultraviolet radiation cleansing shower, luxury amenities.',
        cost: [
          { type: 'structural_frame', count: 2 },
          { type: 'electronics_module', count: 2 },
          { type: 'repair_kit', count: 1 },
        ],
        unlockedBenefits: [
          'Medical Bio-Bed with vital telemetry monitors and holographic health scan',
          'UV Decontamination Shower: completely scrubs accumulated GCR Radiation Dose to 0.0 mSv',
          'Permanent +20% maximum stamina boost during Mars surface exploration',
        ],
        conditionPercent: 100,
      },
    },
  },

  comm_room: {
    id: 'comm_room',
    name: 'Communications Room & Deep-Space Array',
    zone: 'Primary Dome — Upper Deck & Roof [0, 0, 0]',
    position: [0, 1.0, 3.8],
    icon: 'Radio',
    summary: 'Rooftop high-gain parabolic radar array, orbital satellite transceiver, and Earth telemetry relay.',
    stages: {
      0: {
        level: 0,
        title: 'Dead Satellite Transceiver',
        conditionName: 'SIGNAL LOSS',
        description: 'Rooftop dish frozen at ground angle, unpowered interior frequency encoder.',
        cost: [],
        unlockedBenefits: ['Short-range visor radio only (300m).'],
        conditionPercent: 15,
      },
      1: {
        level: 1,
        title: 'Repaired Parabolic Dish',
        conditionName: 'CARRIER DETECTED',
        description: 'Dish elevation motors unjammed, aimed at Martian zenith, frequency carrier wave acquired.',
        cost: [
          { type: 'scrap_metal', count: 5 },
          { type: 'copper_wire', count: 4 },
          { type: 'electronic_parts', count: 2 },
        ],
        unlockedBenefits: [
          'Parabolic dish motorized alignment restored on habitat roof',
          'Interior radio console displays orbital carrier frequency',
          'Earth Mission Control telemetry logs unlocked in Sol Log [M]',
        ],
        conditionPercent: 45,
      },
      2: {
        level: 2,
        title: 'Operational Deep-Space Link',
        conditionName: 'UPLINK ESTABLISHED',
        description: 'Continuous 360° roof radar scanning, high-frequency deep-space laser transmitter beacon.',
        cost: [
          { type: 'metal_plate', count: 4 },
          { type: 'wire_assembly', count: 2 },
          { type: 'circuit_board', count: 2 },
        ],
        unlockedBenefits: [
          'High-power 360-degree rotating radar dish and pulsed cyan orbital laser beam',
          'Spectral Deep-Scan Intel: reveals coordinates of 3 rare high-yield mineral nodes',
          'Continuous telemetry synchronization with Earth ground station',
        ],
        conditionPercent: 80,
      },
      3: {
        level: 3,
        title: 'Advanced Quantum Entanglement Relay',
        conditionName: 'ZERO-LATENCY QUANTUM LINK',
        description: 'Quantum spin-entangled communications transceiver, real-time Earth connection without 14-min light delay.',
        cost: [
          { type: 'structural_frame', count: 2 },
          { type: 'electronics_module', count: 3 },
          { type: 'battery_pack', count: 1 },
        ],
        unlockedBenefits: [
          'Pulsing quantum resonator core with holographic transmission waveform',
          'Zero-latency Earth communications: instant objective completion telemetry verification',
          'Unlocks Orbit Academy Master Survival Astronaut Certification',
        ],
        conditionPercent: 100,
      },
    },
  },
};
