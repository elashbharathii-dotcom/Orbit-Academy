import { create } from 'zustand';
import {
  PlayerVitals,
  ResourceType,
  ResourceItem,
  ResourceNodeData,
  SubstanceDetails,
  InteractableObject,
  RoverTelemetry,
  SolCycle,
  Objective,
  GameSettings,
  ControlMode,
  UpgradeId,
  UpgradeDefinition,
  RenovationStatus,
  StorageContainerType,
  BACKPACK_BASE_CAPACITY,
  BACKPACK_EXPANDED_CAPACITY,
  ROVER_STORAGE_CAPACITY,
  VAULT_STORAGE_CAPACITY,
  RESOURCE_DEFINITIONS,
  BasePowerGrid,
  GreenhouseCropState,
  WeatherType,
} from '../types/survivalTypes';
import {
  MissionDefinition,
  ObjectiveType,
  ExplorationLandmark,
  ScannableTarget,
  ResearchTech,
  WorldEvent,
  INITIAL_MISSIONS,
  INITIAL_LANDMARKS,
  INITIAL_SCANNABLES,
  INITIAL_RESEARCH_TECHS,
} from '../types/missionTypes';
import {
  CRAFTING_RECIPES,
  DISASSEMBLY_RECIPES,
  ActiveCraftingJob,
  CraftingHistoryEntry,
} from '../types/craftingTypes';
import {
  FacilityId,
  RenovationLevel,
  FacilityRenovations,
  INITIAL_FACILITY_RENOVATIONS,
  LEVEL_NAMES,
  FACILITIES_DATABASE,
} from '../types/renovationTypes';
import {
  RoverAIMode,
  RoverAIState,
  RoverDestination,
  RoverNavigationPlan,
  RobotMode,
  RobotState,
  TransportTask,
  BaseAIRecommendation,
  BaseAIAlert,
  INITIAL_ROBOT_STATE,
  PRESET_ROVER_DESTINATIONS,
} from '../types/aiTypes';
import { RoverAISystem } from '../systems/roverAISystem';
import { BaseAISystem, BaseTelemetrySnapshot } from '../systems/baseAISystem';
import { audioSystem } from '../systems/audioSynthesizer';
import { ProceduralTerrainSystem } from '../systems/proceduralTerrainSystem';
import {
  ChapterId,
  ChapterDefinition,
  DialogueNode,
  CampaignEndingId,
} from '../types/storyTypes';
import {
  CAMPAIGN_CHAPTERS,
  CAMPAIGN_DIALOGUES,
  CAMPAIGN_CHOICES,
  CAMPAIGN_ENDINGS,
} from '../data/campaignStoryData';

const INITIAL_VITALS: PlayerVitals = {
  health: 100,
  oxygen: 98,
  food: 85,
  water: 90,
  power: 100,
  coreTemp: 37.0,
  suitTemp: 20.0,
  habTemp: 21.0,
  suitIntegrity: 100,
  radiationDose: 0.12,
};

export const UPGRADES_DATABASE: UpgradeDefinition[] = [
  {
    id: 'power_room',
    name: 'Power Room & Grid Reactivation',
    stageNumber: 1,
    description: 'Rebuild main circuit breakers, energize overhead LED fixtures, and stabilize environmental power coils.',
    cost: [
      { type: 'scrap_metal', count: 5 },
      { type: 'electronic_parts', count: 2 },
    ],
    unlockedBenefits: [
      'Overhead base halogen lighting restored',
      'Reactor core online with humming power coils',
      'Continuous life-support power replenishment',
    ],
  },
  {
    id: 'storage_room',
    name: 'Storage Room & Backpack Expansion',
    stageNumber: 2,
    description: 'Fabricate internal heavy-duty storage lockers and reinforce astronaut EVA backpack with titanium struts.',
    cost: [
      { type: 'scrap_metal', count: 8 },
      { type: 'fasteners', count: 6 },
    ],
    unlockedBenefits: [
      `Astronaut backpack capacity upgraded to ${BACKPACK_EXPANDED_CAPACITY.toFixed(1)} kg`,
      'Physical storage locker bank inside Outpost Alpha',
      'Increased cargo carrying efficiency',
    ],
  },
  {
    id: 'greenhouse',
    name: 'Hydroponic Bio-Dome & Farming',
    stageNumber: 3,
    description: 'Re-pressurize greenhouse bays, restore ultraviolet LED grow-arrays, and seed Martian potato crops.',
    cost: [
      { type: 'scrap_metal', count: 10 },
      { type: 'electronic_parts', count: 4 },
      { type: 'copper_wire', count: 4 },
    ],
    unlockedBenefits: [
      'Active greenhouse bio-dome with growing crops',
      'Magenta UV grow lighting arrays',
      'Sustainable oxygen and biological nourishment',
    ],
  },
  {
    id: 'comm_room',
    name: 'Deep-Space Telemetry & Comms Array',
    stageNumber: 4,
    description: 'Align high-gain parabolic radar dish on habitat roof and activate deep-space uplink transceivers to Earth Mission Control.',
    cost: [
      { type: 'scrap_metal', count: 12 },
      { type: 'electronic_parts', count: 5 },
      { type: 'circuit_board', count: 3 },
    ],
    unlockedBenefits: [
      'Continuous 360° roof radar telemetry tracking',
      'Cyan deep-space laser transmission beacon',
      'Emergency orbital uplink active',
    ],
  },
  {
    id: 'hab_expansion',
    name: 'Secondary Geodesic Habitat Dome Module',
    stageNumber: 5,
    description: 'Decompress and construct an adjacent interconnected habitat dome with pressurized corridor and observation quarters.',
    cost: [
      { type: 'scrap_metal', count: 20 },
      { type: 'electronic_parts', count: 8 },
      { type: 'polymer', count: 6 },
    ],
    unlockedBenefits: [
      'Rear bulkhead corridor opens',
      'Accessible second habitat geodesic dome',
      'Doubled habitable living space and interior colliders',
    ],
  },
];

export const createInitialInventory = (): Record<ResourceType, ResourceItem> => {
  const inv = {} as Record<ResourceType, ResourceItem>;
  for (const key of Object.keys(RESOURCE_DEFINITIONS) as ResourceType[]) {
    const def = RESOURCE_DEFINITIONS[key];
    let starterCount = 0;
    if (key === 'scrap_metal') starterCount = 3;
    else if (key === 'water_ice') starterCount = 2;
    else if (key === 'food_ration') starterCount = 2;
    else if (key === 'water') starterCount = 2;
    else if (key === 'medical_kit') starterCount = 1;
    else if (key === 'copper_wire') starterCount = 2;
    else if (key === 'fasteners') starterCount = 6;

    inv[key] = {
      id: def.id,
      name: def.name,
      count: starterCount,
      description: def.description,
      icon: def.icon,
      weightPerUnit: def.weightPerUnit,
      category: def.category,
      rarity: def.rarity,
      stackLimit: def.stackLimit,
    };
  }
  return inv;
};

export const createEmptyStorage = (): Record<ResourceType, number> => {
  const storage = {} as Record<ResourceType, number>;
  for (const key of Object.keys(RESOURCE_DEFINITIONS) as ResourceType[]) {
    storage[key] = 0;
  }
  return storage;
};

const INITIAL_INVENTORY = createInitialInventory();

const INITIAL_VAULT_STORAGE: Record<ResourceType, number> = {
  ...createEmptyStorage(),
  scrap_metal: 4,
  copper_wire: 4,
  circuit_board: 1,
  fasteners: 10,
  polymer: 2,
  food_ration: 1,
  water: 2,
};

const INITIAL_ROVER_STORAGE: Record<ResourceType, number> = {
  ...createEmptyStorage(),
  scrap_metal: 2,
  battery_cell: 1,
  water: 1,
  food_ration: 1,
};

const INITIAL_RENOVATIONS: RenovationStatus = {
  power_room: false,
  storage_room: false,
  greenhouse: false,
  comm_room: false,
  hab_expansion: false,
};

export function calculateBackpackWeight(inventory: Record<ResourceType, ResourceItem>): number {
  let total = 0;
  for (const key of Object.keys(inventory) as ResourceType[]) {
    const item = inventory[key];
    if (item && item.count > 0) {
      const unitW = item.weightPerUnit ?? RESOURCE_DEFINITIONS[key]?.weightPerUnit ?? 1.0;
      total += item.count * unitW;
    }
  }
  return Math.round(total * 10) / 10;
}

export function calculateStorageWeight(storage: Record<ResourceType, number>): number {
  let total = 0;
  for (const key of Object.keys(storage) as ResourceType[]) {
    const count = storage[key];
    if (count && count > 0) {
      const unitW = RESOURCE_DEFINITIONS[key]?.weightPerUnit ?? 1.0;
      total += count * unitW;
    }
  }
  return Math.round(total * 10) / 10;
}

const STORAGE_KEY = 'mars_frontier_save_v1';

function getStorageKey(slot = 1): string {
  if (slot === 2) return 'mars_frontier_save_v1_slot2';
  if (slot === 3) return 'mars_frontier_save_v1_slot3';
  return 'mars_frontier_save_v1';
}

interface MarsSavedState {
  version?: number;
  saveTimestamp?: string;
  inventory?: Record<ResourceType, ResourceItem>;
  vaultStorage?: Record<ResourceType, number>;
  roverStorage?: Record<ResourceType, number>;
  renovations?: RenovationStatus;
  facilityRenovations?: FacilityRenovations;
  collectedNodeIds?: string[];
  maxBackpackCapacity?: number;
  maxRoverCapacity?: number;
  maxVaultCapacity?: number;
  craftingHistory?: CraftingHistoryEntry[];
  vitals?: PlayerVitals;
  solCycle?: SolCycle;
  powerGrid?: BasePowerGrid;
  greenhouseCrop?: GreenhouseCropState;
  missions?: Record<string, MissionDefinition>;
  activeMissionId?: string | null;
  completedMissionIds?: string[];
  discoveredLandmarkIds?: string[];
  scannedTargetIds?: string[];
  researchDataPoints?: number;
  unlockedTechIds?: string[];
  robotState?: RobotState;
  transportTasks?: TransportTask[];
  baseAlerts?: BaseAIAlert[];
  worldSeed?: number;
  campaignChapter?: ChapterId;
  completedChapters?: ChapterId[];
  unlockedJournalIds?: string[];
  dialogueHistory?: string[];
  playerDecisions?: Record<string, string>;
  campaignEnding?: CampaignEndingId | null;
  campaignCompleted?: boolean;
}

function loadSavedState(slot = 1): MarsSavedState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getStorageKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    // Validate and sanitize data integrity against negative numbers
    if (parsed.inventory && typeof parsed.inventory === 'object') {
      for (const k of Object.keys(parsed.inventory)) {
        if (parsed.inventory[k]?.count < 0) parsed.inventory[k].count = 0;
      }
    }
    if (parsed.vaultStorage && typeof parsed.vaultStorage === 'object') {
      for (const k of Object.keys(parsed.vaultStorage)) {
        if (parsed.vaultStorage[k] < 0) parsed.vaultStorage[k] = 0;
      }
    }
    if (parsed.roverStorage && typeof parsed.roverStorage === 'object') {
      for (const k of Object.keys(parsed.roverStorage)) {
        if (parsed.roverStorage[k] < 0) parsed.roverStorage[k] = 0;
      }
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeSaveState(data: MarsSavedState, slot = 1) {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadSavedState(slot) || {};
    const merged = {
      ...existing,
      ...data,
      version: 2,
      saveTimestamp:
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        ' ' +
        new Date().toLocaleDateString(),
    };
    localStorage.setItem(getStorageKey(slot), JSON.stringify(merged));
  } catch {
    // Ignore storage quota errors
  }
}

const INITIAL_NODES: ResourceNodeData[] = [
  {
    id: 'ice-node-1',
    type: 'water_ice',
    name: 'Delta Glacial Seam',
    chemicalFormula: 'H2O (Ice Ih + hydrated sulfates)',
    category: 'Volatile Ice & Life Support Resource',
    description: 'Subsurface permafrost outcrop preserved beneath insulating iron-oxide regolith in the Jezero paleolake delta.',
    scientificProperties: 'Density: 0.92 g/cm³, Sublimation point: -68°C at 6.1 mbar, Low deuterium-to-hydrogen ratio.',
    marsStationUsefulness: 'Essential feedstock for Sabatier methane rocket propellant synthesis and electrolysis into breathable oxygen.',
    position: [18, 0, -22],
    yieldCount: 3,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'ice-node-2',
    type: 'water_ice',
    name: 'Sub-surface Permafrost Core',
    chemicalFormula: 'H2O • (Clays)',
    category: 'Volatile Ice & Life Support Resource',
    description: 'High-purity crystalline ice matrix trapped in fractured bedrock layers.',
    scientificProperties: 'Purity: 94.2% H2O, 5.8% dissolved perchlorates, structural cubic crystal lattice.',
    marsStationUsefulness: 'Base drinking water purification, greenhouse crop hydration, and fuel production.',
    position: [-28, 0, 15],
    yieldCount: 4,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'hematite-node-1',
    type: 'hematite',
    name: 'Blueberry Concretion Field',
    chemicalFormula: 'Fe2O3 (Iron(III) Oxide)',
    category: 'Iron-Rich Mineral Resource',
    description: 'Spherical concretion nodules ("Martian Blueberries") formed by ancient groundwater percolation through basaltic bedrock.',
    scientificProperties: 'Hardness: 6.0 Mohs, 69.9% elemental iron content by mass, high magnetic susceptibility.',
    marsStationUsefulness: 'Primary ore for solar-smelting structural steel framing, radiation shielding bricks, and oxygen extraction.',
    position: [24, 0, 14],
    yieldCount: 4,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'hematite-node-2',
    type: 'hematite',
    name: 'Iron Ridge Outcrop',
    chemicalFormula: 'Fe2O3 • Fe3O4 (Hematite-Magnetite)',
    category: 'Iron-Rich Mineral Resource',
    description: 'Massive weathered iron-oxide ridge exposing billion-year-old volcanic basalt deposits.',
    scientificProperties: 'Density: 5.26 g/cm³, metallic luster, high electrical and thermal conductivity.',
    marsStationUsefulness: 'Base structural fabrication, heavy ballast, and high-density habitat radiation shielding.',
    position: [-16, 0, -32],
    yieldCount: 5,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'sulfur-node-1',
    type: 'sulfur_mineral',
    name: 'Delta Sulfate Evaporite',
    chemicalFormula: 'CaSO4 • 2H2O (Gypsum / Bassanite)',
    category: 'Sulfur-Bearing Evaporite',
    description: 'Hydrated calcium sulfate evaporite veins precipitated during the gradual drying of Lake Jezero.',
    scientificProperties: 'Hardness: 2.0 Mohs, monoclinic crystal system, releases bound water vapor upon heating to 120°C.',
    marsStationUsefulness: 'Production of anhydrous sulfur concrete for waterless base construction; electrolyte synthesis for batteries.',
    position: [12, 0, 26],
    yieldCount: 3,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'regolith-node-1',
    type: 'regolith',
    name: 'Séítah Smectite Clay Dune',
    chemicalFormula: '(Na,Ca)0.33(Al,Mg)2(Si4O10)(OH)2 • nH2O',
    category: 'Martian Clay & Soil Regolith',
    description: 'Ultra-fine clay sediment rich in smectites and iron-bearing phyllosilicates, ideal for agricultural soil beds.',
    scientificProperties: 'Particle size: 2-5 microns, high cation exchange capacity, rich in trace magnesium and calcium.',
    marsStationUsefulness: 'Growing medium for hydroponic and greenhouse food crops after bioleaching; binder for 3D sintering.',
    position: [-22, 0, -12],
    yieldCount: 4,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'silicate-node-1',
    type: 'silicate_crystal',
    name: 'Séítah Quartz Dune',
    chemicalFormula: 'SiO2 • (Mg,Fe)2SiO4 (Silica-Olivine)',
    category: 'Silicate Aggregate & Optical Material',
    description: 'Pure, wind-sculpted silicate sand crystals accumulated on crests of ancient crater sand dunes.',
    scientificProperties: 'Refractive index: 1.54, extreme dielectric strength, high thermal shock resistance up to 1600°C.',
    marsStationUsefulness: 'Raw glass casting for habitat observation cupolas, solar panel cover slips, and thermal insulating tiles.',
    position: [-32, 0, -18],
    yieldCount: 3,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'probe-crash-1',
    type: 'titanium_scrap',
    name: 'Skycrane Impact Remnant',
    chemicalFormula: 'Ti-6Al-4V (Aerospace Titanium Alloy)',
    category: 'Manufactured Aerospace Alloy',
    description: 'High-strength aerospace debris salvaged from the jettisoned Mars 2020 powered descent stage impact crater.',
    scientificProperties: 'Yield strength: 880 MPa, density: 4.43 g/cm³, non-corrosive, non-magnetic, aerospace grade.',
    marsStationUsefulness: 'Direct CNC milling into custom rover replacement gears, high-pressure airlock fittings, and drilling bits.',
    position: [35, 0, -5],
    yieldCount: 2,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'scrap-node-1',
    type: 'scrap_metal',
    name: 'Salvaged Lander Truss Frame',
    chemicalFormula: 'Al-Li / Ti Alloy',
    category: 'Structural Scrap & Framing',
    description: 'Corrugated aerospace grade framing and stamped shielding salvaged from the landing stage shock mount.',
    scientificProperties: 'Tensile strength: 620 MPa, corrosion resistant, recyclable via solar induction furnace.',
    marsStationUsefulness: 'Primary structural material for outpost structural renovation, wall reinforcement, and storage rack fabrication.',
    position: [15, 0, -10],
    yieldCount: 4,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'scrap-node-2',
    type: 'scrap_metal',
    name: 'Descent Hull Shard',
    chemicalFormula: 'Ti-6Al-4V + Ceramic Tile',
    category: 'Structural Scrap & Framing',
    description: 'Impact-shattered thermal protective hull plating discarded during atmospheric deceleration.',
    scientificProperties: 'High heat tolerance, lightweight composite sandwich structure.',
    marsStationUsefulness: 'Ideal for habitat expansion bulkheads, heavy storage lockers, and power room casing.',
    position: [-20, 0, 22],
    yieldCount: 5,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'scrap-node-3',
    type: 'scrap_metal',
    name: 'Impact Strut Debris',
    chemicalFormula: 'Aerospace Structural Steel',
    category: 'Structural Scrap & Framing',
    description: 'Telescoping landing gear cylinder and cross-braces.',
    scientificProperties: 'Yield stress: 900 MPa, machined hydraulic alloy.',
    marsStationUsefulness: 'Heavy-duty foundation brackets for base renovation.',
    position: [28, 0, 18],
    yieldCount: 4,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'scrap-node-4',
    type: 'scrap_metal',
    name: 'Capsule Pressure Bulkhead',
    chemicalFormula: 'Al-2024 Hardened Alloy',
    category: 'Structural Scrap & Framing',
    description: 'Segmented curved pressure bulkhead fragment with intact seal channels.',
    scientificProperties: 'Ductility: 18%, anodized protective finish.',
    marsStationUsefulness: 'Airlock renovation and greenhouse frame restoration.',
    position: [-10, 0, -26],
    yieldCount: 5,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'scrap-node-5',
    type: 'scrap_metal',
    name: 'Thermal Radiator Shield',
    chemicalFormula: 'Inconel-718 / Titanium',
    category: 'Structural Scrap & Framing',
    description: 'High-emissivity radiator surface paneling.',
    scientificProperties: 'Thermal conductivity: 11.4 W/m-K, non-oxidizing in thin Martian air.',
    marsStationUsefulness: 'Essential heat dissipation framing for habitat power grid.',
    position: [6, 0, 30],
    yieldCount: 6,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'scrap-node-6',
    type: 'scrap_metal',
    name: 'Perimeter Hull Rib',
    chemicalFormula: 'Extruded Titanium Framing',
    category: 'Structural Scrap & Framing',
    description: 'Curved structural rib segment from ancient cargo transport.',
    scientificProperties: 'Ultra-rigid geometric cross-section.',
    marsStationUsefulness: 'Required for Phase 5 secondary habitat dome expansion.',
    position: [-35, 0, -22],
    yieldCount: 6,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'electronic-node-1',
    type: 'electronic_parts',
    name: 'Avionics Logic Core',
    chemicalFormula: 'Si / GaAs Micro-Circuits',
    category: 'Avionics & Electronics',
    description: 'Radiation-hardened microprocessor daughterboard with intact surface-mount telemetry sensors.',
    scientificProperties: 'Tri-modular redundancy, gold-plated bus traces, hermetically sealed.',
    marsStationUsefulness: 'Crucial for Power Room control system, greenhouse computer, and communication array restoration.',
    position: [22, 0, -16],
    yieldCount: 3,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'electronic-node-2',
    type: 'electronic_parts',
    name: 'Telemetry Sensor Module',
    chemicalFormula: 'MEMS Optical & Thermal Chips',
    category: 'Avionics & Electronics',
    description: 'Atmospheric LIDAR and multi-spectral telemetry sensor module package.',
    scientificProperties: 'Multi-channel digital bus, radiation shielded solid-state logic.',
    marsStationUsefulness: 'Restores greenhouse environmental monitoring and comm room tracking computers.',
    position: [-25, 0, -8],
    yieldCount: 4,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'electronic-node-3',
    type: 'electronic_parts',
    name: 'Inverter Control Board',
    chemicalFormula: 'IGBT High-Voltage Switches',
    category: 'Avionics & Electronics',
    description: 'High-current power conversion module salvaged from secondary photovoltaic harness.',
    scientificProperties: 'Handles up to 600V DC-to-AC conversion with 98% thermal efficiency.',
    marsStationUsefulness: 'Required for base power room synchronization and greenhouse UV grow banks.',
    position: [9, 0, 24],
    yieldCount: 3,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'electronic-node-4',
    type: 'electronic_parts',
    name: 'Deep-Space Transceiver Deck',
    chemicalFormula: 'Microwave Traveling-Wave Array',
    category: 'Avionics & Electronics',
    description: 'X-band RF amplifier card and digital phase shifter array.',
    scientificProperties: 'Operates at 8.4 GHz deep space downlink frequency.',
    marsStationUsefulness: 'Direct requirement for Communication Room telemetry restoration.',
    position: [36, 0, -18],
    yieldCount: 4,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'battery-node-1',
    type: 'damaged_battery',
    name: 'Auxiliary Li-S Battery Pack',
    chemicalFormula: 'Li2S (Lithium-Sulfur)',
    category: 'Energy & Power Storage',
    description: 'High-density multi-cell battery module in reinforced impact enclosure.',
    scientificProperties: 'Specific energy: 400 Wh/kg, solid-state electrolyte cells.',
    marsStationUsefulness: 'Reconditionable for outpost backup energy reserves and rover extended range.',
    position: [-14, 0, 12],
    yieldCount: 2,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'battery-node-2',
    type: 'damaged_battery',
    name: 'Emergency Capacitor Bank',
    chemicalFormula: 'Graphene Supercapacitor',
    category: 'Energy & Power Storage',
    description: 'Fast-discharge power buffer salvaged from descent thruster ignition bus.',
    scientificProperties: 'Instantaneous power density: 10 kW/kg, withstands cryogenic temperatures.',
    marsStationUsefulness: 'Absorbs grid spikes during habitat power restoration.',
    position: [32, 0, -12],
    yieldCount: 2,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'mechanical-node-1',
    type: 'mechanical_parts',
    name: 'Rover Drive Actuator',
    chemicalFormula: 'Harmonic Drive / Brushless DC',
    category: 'Mechanical Systems',
    description: 'Precision robotic gearhead actuator designed for extreme planetary dust resistance.',
    scientificProperties: 'Gear ratio: 160:1, titanium casing, sealed ceramic bearings.',
    marsStationUsefulness: 'Repairs heavy mechanical sliding doors and greenhouse ventilation baffles.',
    position: [-8, 0, -18],
    yieldCount: 3,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'mechanical-node-2',
    type: 'mechanical_parts',
    name: 'Hydraulic Suspension Pivot',
    chemicalFormula: 'Hardened Carbon-Steel / Ceramic',
    category: 'Mechanical Systems',
    description: 'Heavy bogie linkage joint and damper assembly.',
    scientificProperties: 'Rated for 15,000 N shock loads, dry fluoropolymer lubricant.',
    marsStationUsefulness: 'Structural mechanical hinges for habitat expansion and airlock mechanisms.',
    position: [18, 0, 8],
    yieldCount: 3,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'science-node-1',
    type: 'scientific_sample',
    name: 'Astrobiology Stromatolite Core',
    chemicalFormula: 'Microbialite Spherulitic Carbonate',
    category: 'Astrobiology & Geochemistry',
    description: 'Finely laminated silica-carbonate sediment core from Jezero delta lakebed with potential microbial fossils.',
    scientificProperties: 'Contains micro-textures resembling terrestrial Archean stromatolites.',
    marsStationUsefulness: 'High-priority science return for Earth sample analysis and base research certification.',
    position: [-32, 0, 8],
    yieldCount: 2,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'science-node-2',
    type: 'scientific_sample',
    name: 'Organic Biomarker Spherule',
    chemicalFormula: 'Aromatic Polycyclic Hydrocarbons in Clay',
    category: 'Astrobiology & Geochemistry',
    description: 'Dark mineral concretion preserving complex organic molecular compounds.',
    scientificProperties: 'Detected via deep-UV Raman spectroscopy at 248 nm emission.',
    marsStationUsefulness: 'Confirms organic chemical preservation in Jezero Crater.',
    position: [25, 0, -28],
    yieldCount: 2,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'copper-node-1',
    type: 'copper_wire',
    name: 'Avionics Wire Loom Debris',
    chemicalFormula: 'Cu (99.9% Electrolytic)',
    category: 'Avionics & Cabling',
    description: 'High-purity braided copper harness thrown clear during descent stage jettison.',
    scientificProperties: 'Ductile copper shielded with fluoropolymer sheath. Zero oxidative patina in CO2.',
    marsStationUsefulness: 'Vital for rewiring habitat life-support breakers and solar tracking conduits.',
    position: [14, 0, -12],
    yieldCount: 4,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'circuit-node-1',
    type: 'circuit_board',
    name: 'Descent Guidance Micro-Board',
    chemicalFormula: 'Si-Cu-Au (Polyimide PCB)',
    category: 'Avionics & Electronics',
    description: 'Gold-plated rad-hardened processor circuit board from lander inertial measurement unit.',
    scientificProperties: 'Quad-core silicon rad-tolerant architecture with micro-printed gold traces.',
    marsStationUsefulness: 'Restores Outpost Alpha computer mainframe and automated radar array.',
    position: [-19, 0, 22],
    yieldCount: 3,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'fasteners-node-1',
    type: 'fasteners',
    name: 'Aerospace Fasteners Box',
    chemicalFormula: 'Ti-6Al-4V Titanium Alloy',
    category: 'Hardware & Structural',
    description: 'Scattered container of titanium hex-bolts, high-shear lock nuts, and structural pins.',
    scientificProperties: 'Grade 5 aerospace alloy with 120,000 psi shear rating.',
    marsStationUsefulness: 'Essential for assembling heavy storage vaults and greenhouse pressure bulkheads.',
    position: [6, 0, 14],
    yieldCount: 6,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'battery-cell-node-1',
    type: 'battery_cell',
    name: 'Solid-State Battery Cell Cache',
    chemicalFormula: 'Li2S-Si Solid Electrolyte',
    category: 'Energy & Power Storage',
    description: 'Intact solid-state lithium-sulfur energy cells salvaged from auxiliary pod.',
    scientificProperties: 'Non-flammable ceramic electrolyte functioning reliably at -80°C.',
    marsStationUsefulness: 'Directly powers rover battery refurbishment and outpost capacitor arrays.',
    position: [-24, 0, -16],
    yieldCount: 3,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'polymer-node-1',
    type: 'polymer',
    name: 'Kapton Thermal Shroud Roll',
    chemicalFormula: '(C22H10N2O5)n Polyimide',
    category: 'Materials & Insulation',
    description: 'Multi-layer aluminized polyimide thermal insulation blanket roll.',
    scientificProperties: 'Emissivity 0.03, reflects 97% of thermal radiation and blocks solar UV.',
    marsStationUsefulness: 'Crucial for habitat dome expansion seals and greenhouse insulation lining.',
    position: [22, 0, -6],
    yieldCount: 4,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'food-node-1',
    type: 'food_ration',
    name: 'Jettisoned Survival Rations',
    chemicalFormula: 'Nutrient Matrix (Lipids & Proteins)',
    category: 'Life Support & Nutrition',
    description: 'Hermetically sealed NASA planetary exploration survival food ration container.',
    scientificProperties: 'Shelf-stable for 25 Earth years, calorie-dense emergency nutrition.',
    marsStationUsefulness: 'Restores +25 health immediately in field conditions.',
    position: [-8, 0, 16],
    yieldCount: 3,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'water-node-1',
    type: 'water',
    name: 'Emergency Hydration Canister',
    chemicalFormula: 'H2O (Sterile Drinking Water)',
    category: 'Life Support & Hydration',
    description: 'Pressurized thermal vacuum flask of potable mineralized water.',
    scientificProperties: 'Ultrapure with magnesium and calcium electrolytes. Nominal pH 7.2.',
    marsStationUsefulness: 'Rehydrates astronaut to stabilize metabolic core temperature and health.',
    position: [16, 0, 20],
    yieldCount: 2,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'medkit-node-1',
    type: 'medical_kit',
    name: 'Emergency Trauma First-Aid Pod',
    chemicalFormula: 'Sterile Hemostatic & Trauma Supply',
    category: 'Medical & Life Support',
    description: 'Hard-case emergency medical kit with coagulant injectors, dermal glue, and suit patches.',
    scientificProperties: 'Biocompatible dermal sealant cures in low pressure in 10 seconds.',
    marsStationUsefulness: 'Restores +50 health and reinforces EVA suit integrity by +20%.',
    position: [-15, 0, -8],
    yieldCount: 2,
    depleted: false,
    scanDiscovered: false,
  },
  // ==========================================
  // PHASE 9 REGIONAL & SUBTERRANEAN RESOURCE NODES
  // ==========================================
  {
    id: 'cave-ice-node-1',
    type: 'water_ice',
    name: 'Ancient Subterranean Glacier Core',
    chemicalFormula: 'H2O (Cryogenic Clathrate Hydrate)',
    category: 'Volatile Ice & Life Support Resource',
    description: 'Billion-year-old subterranean permafrost ice matrix shielded inside the deep lava tube cave.',
    scientificProperties: 'Purity: 99.1% H2O, low cosmic-ray track density, isotopic ratio 0.04% D/H.',
    marsStationUsefulness: 'High-yield water ice for habitat reserves, electrolyzers, and closed-loop hydroponics.',
    position: [-31, -5.2, -67],
    yieldCount: 6,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'cave-silicate-node-1',
    type: 'silicate_crystal',
    name: 'Hydrothermal Quartz Geode',
    chemicalFormula: 'SiO2 (Low-Temperature Hydrothermal)',
    category: 'Silicate Aggregate & Optical Material',
    description: 'Prismatic quartz crystals precipitated from ancient hydrothermal circulation along volcanic faults.',
    scientificProperties: 'Piezoelectric crystalline silicon matrix, optical transparency 94%.',
    marsStationUsefulness: 'High-purity quartz for laser optics, solar cell substrates, and habitat viewports.',
    position: [-28, -5.2, -66],
    yieldCount: 4,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'cave-basalt-node-1',
    type: 'hematite',
    name: 'Deep Volcanic Pyroxene Slab',
    chemicalFormula: '(Fe,Mg)SiO3 • Fe3O4',
    category: 'Iron-Rich Mineral Resource',
    description: 'Dense volcanic cooling slab rich in magnetic titanomagnetite and high-density iron oxides.',
    scientificProperties: 'Density: 4.8 g/cm³, natural radiation attenuation 32%.',
    marsStationUsefulness: 'Dense radiation shielding tile fabrication and structural base reinforcement.',
    position: [-33, -5.0, -64],
    yieldCount: 5,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'canyon-sulfur-node-1',
    type: 'sulfur_mineral',
    name: 'Mawrth Canyon Evaporite Vein',
    chemicalFormula: 'CaSO4 • 2H2O (Gypsum Selenite)',
    category: 'Sulfur-Bearing Evaporite',
    description: 'Extensive evaporite vein traversing the stepped mudstone cliffs of Mawrth Canyon.',
    scientificProperties: 'Monoclinic selenite crystals, soluble sulfate matrix.',
    marsStationUsefulness: 'Waterless sulfur concrete casting and battery electrolyte manufacturing.',
    position: [80, 0, 18],
    yieldCount: 5,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'canyon-scrap-node-1',
    type: 'scrap_metal',
    name: 'Precursor Drill Rig Framing',
    chemicalFormula: 'High-Tensile Structural Steel Alloy',
    category: 'Structural Scrap & Framing',
    description: 'Heavy structural bracing beams salvaged from the Mawrth Canyon drilling rig.',
    scientificProperties: 'Tensile strength: 750 MPa, heat-resistant chrome-moly framing.',
    marsStationUsefulness: 'Heavy load-bearing columns for habitat renovation.',
    position: [84, 0, 14],
    yieldCount: 5,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'borealis-meteorite-1',
    type: 'hematite',
    name: 'Crater Borealis Ejecta Slab',
    chemicalFormula: 'Fe-Ni Kamacite Shard',
    category: 'Iron-Rich Mineral Resource',
    description: 'Aerodynamic metallic projectile fragment blasted outward during meteorite impact.',
    scientificProperties: 'Extremely dense nickel-iron meteorite alloy, 92% Fe.',
    marsStationUsefulness: 'Forging high-grade metal plates and structural frames.',
    position: [26, 0, 84],
    yieldCount: 5,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'skycrane-titanium-1',
    type: 'titanium_scrap',
    name: 'Skycrane Main Truss Bracket',
    chemicalFormula: 'Ti-6Al-4V Grade 5 Titanium',
    category: 'Manufactured Aerospace Alloy',
    description: 'Ultra-lightweight high-strength titanium landing strut recovered from the skycrane crash site.',
    scientificProperties: 'Density: 4.43 g/cm³, non-magnetic, corrosion-free.',
    marsStationUsefulness: 'Machining high-performance rover suspension components and airlock latches.',
    position: [74, 0, -56],
    yieldCount: 4,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'ares-electronics-1',
    type: 'electronic_parts',
    name: 'Ares Meteorological Telemetry Core',
    chemicalFormula: 'GaAs Solid-State Logic Array',
    category: 'Avionics & Electronics',
    description: 'High-frequency telemetry processor from the abandoned weather outpost.',
    scientificProperties: 'Hermetic ceramic DIP package, rad-hardened logic.',
    marsStationUsefulness: 'Restoring long-range base communications array and automated weather alerts.',
    position: [-74, 0, 66],
    yieldCount: 4,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'dunes-regolith-1',
    type: 'regolith',
    name: 'Elysium Windblown Barchan Regolith',
    chemicalFormula: 'Phyllosilicate Clay + Basalt Dust',
    category: 'Martian Clay & Soil Regolith',
    description: 'Extremely fine aeolian dust dunes with optimal mineral nutrient density for greenhouse crops.',
    scientificProperties: 'Mean grain size: 15 microns, rich in trace potassium, phosphorus, and iron.',
    marsStationUsefulness: 'Enriches bio-dome soil beds to accelerate crop maturation.',
    position: [-65, 0, -85],
    yieldCount: 6,
    depleted: false,
    scanDiscovered: false,
  },
  {
    id: 'rift-basalt-1',
    type: 'hematite',
    name: 'Noctis Valley Basalt Chasm',
    chemicalFormula: 'Fe-Ti Basalt Escarpment',
    category: 'Iron-Rich Mineral Resource',
    description: 'Exposed rift bedrock displaying deep tholeiitic magma strata.',
    scientificProperties: 'Rich in iron-titanium oxides with high melting point.',
    marsStationUsefulness: 'Primary smelting ore for heavy outpost industrial fabrication.',
    position: [15, 0, 88],
    yieldCount: 5,
    depleted: false,
    scanDiscovered: false,
  },
];

const INITIAL_OBJECTIVES: Objective[] = [
  {
    id: 'obj-1',
    title: 'Touchdown Telemetry',
    description: 'Disembark from Outpost Alpha and inspect suit life support readings.',
    completed: false,
    category: 'survival',
  },
  {
    id: 'obj-2',
    title: 'Extract Water Ice Seam',
    description: 'Drill and extract water ice from the Jezero Delta outcrop to sustain base reserves.',
    completed: false,
    category: 'science',
    rewardResource: { type: 'water_ice', count: 2 },
  },
  {
    id: 'obj-3',
    title: 'Survey Skycrane Crash Site',
    description: 'Locate the Skycrane impact site (+35m East) and salvage aerospace titanium scrap.',
    completed: false,
    category: 'exploration',
    rewardResource: { type: 'titanium_scrap', count: 2 },
  },
  {
    id: 'obj-4',
    title: 'Inspect Outpost Solar Array',
    description: 'Approach the Outpost Alpha photovoltaic field during peak sunlight to verify battery charging.',
    completed: false,
    category: 'survival',
  },
  {
    id: 'obj-5',
    title: 'Nightfall Endurance',
    description: 'Survive the freezing Martian night (-100°C) with suit heaters or inside the habitat dome.',
    completed: false,
    category: 'survival',
  },
];

const INITIAL_SOL: SolCycle = {
  solNumber: 1,
  timeOfDay: 10.5,
  surfaceTemp: -24,
  solarIrradiance: 520,
  dustStormIntensity: 0.1,
  isDaytime: true,
  weather: 'clear',
  weatherDuration: 240,
};

const INITIAL_POWER_GRID: BasePowerGrid = {
  batteryStorageKWh: 85.0,
  maxBatteryKWh: 100.0,
  solarOutputKW: 12.0,
  totalConsumptionKW: 8.5,
  facilityCircuits: {
    life_support: true,
    living_quarters: true,
    greenhouse: true,
    engineering_workshop: true,
    comm_room: true,
  },
  isBlackout: false,
};

const INITIAL_GREENHOUSE_CROP: GreenhouseCropState = {
  stage: 'growing',
  progressPercent: 35,
  waterSpent: 2,
  growthTimeRemaining: 120,
};

interface MarsGameState {
  vitals: PlayerVitals;
  inventory: Record<ResourceType, ResourceItem>;
  resourceNodes: ResourceNodeData[];
  solCycle: SolCycle;
  powerGrid: BasePowerGrid;
  greenhouseCrop: GreenhouseCropState;
  survivalWarnings: string[];
  objectives: Objective[];
  settings: GameSettings;
  playerPosition: [number, number, number];
  roverPosition: [number, number, number];
  isInsideHab: boolean;
  doorOpen: boolean;
  isGameOver: boolean;
  gameOverReason: string;
  notification: string | null;

  // Backpack, Rover, and Vault Tri-Tier Storage System
  maxBackpackCapacity: number;
  maxRoverCapacity: number;
  maxVaultCapacity: number;
  backpackWeight: number;
  roverStorage: Record<ResourceType, number>;
  roverStorageWeight: number;
  vaultStorage: Record<ResourceType, number>;
  vaultStorageWeight: number;
  activeStorageTab: 'vault' | 'rover';
  setActiveStorageTab: (tab: 'vault' | 'rover') => void;

  facilityRenovations: FacilityRenovations;
  activeFacilityTab: FacilityId;
  setActiveFacilityTab: (tab: FacilityId) => void;
  renovations: RenovationStatus;
  collectedNodeIds: string[];

  // Interaction & Modals State
  targetedInteractable: InteractableObject | null;
  selectedSubstance: SubstanceDetails | null;
  isSubstanceModalOpen: boolean;
  isPauseModalOpen: boolean;
  isStorageModalOpen: boolean;
  isRenovationModalOpen: boolean;
  isCraftingModalOpen: boolean;
  isDisassemblyModalOpen: boolean;
  isPowerGridModalOpen: boolean;
  isMissionModalOpen: boolean;
  isMapModalOpen: boolean;
  isResearchModalOpen: boolean;
  isIntelligentBaseModalOpen: boolean;

  // Phase 8: Autonomous Rover, Intelligent Base & Robot Assistant
  roverAIMode: RoverAIMode;
  roverNavPlan: RoverNavigationPlan;
  robotState: RobotState;
  transportTasks: TransportTask[];
  baseRecommendations: BaseAIRecommendation[];
  baseAlerts: BaseAIAlert[];

  // Missions, Exploration & Research System
  missions: Record<string, MissionDefinition>;
  activeMissionId: string | null;
  completedMissionIds: string[];
  landmarks: ExplorationLandmark[];
  discoveredLandmarkIds: string[];
  scannableTargets: ScannableTarget[];
  scannedTargetIds: string[];
  researchDataPoints: number;
  researchTechs: ResearchTech[];
  unlockedTechIds: string[];
  activeWorldEvent: WorldEvent | null;
  navTarget: { x: number; z: number; name: string } | null;
  scanningState: { active: boolean; targetId: string | null; progress: number };

  // Crafting & Disassembly Simulation
  activeCraftingJob: ActiveCraftingJob | null;
  craftingHistory: CraftingHistoryEntry[];

  // Vehicle Telemetry
  roverTelemetry: RoverTelemetry;

  // Camera orientation
  cameraLook: { yaw: number; pitch: number };

  // Planetary World Generation
  worldSeed: number;
  setWorldSeed: (seed: number) => void;

  // Story & Campaign System (Phase 11)
  campaignChapter: ChapterId;
  completedChapters: ChapterId[];
  unlockedJournalIds: string[];
  activeDialogue: DialogueNode | null;
  dialogueHistory: string[];
  playerDecisions: Record<string, string>;
  activeChoiceModalId: string | null;
  campaignEnding: CampaignEndingId | null;
  campaignCompleted: boolean;
  isJournalModalOpen: boolean;
  isEndingModalOpen: boolean;
  chapterBanner: { chapter: ChapterDefinition; visible: boolean } | null;

  openJournalModal: () => void;
  closeJournalModal: () => void;
  openEndingModal: () => void;
  closeEndingModal: () => void;
  triggerDialogue: (dialogueId: string) => void;
  dismissDialogue: () => void;
  openChoiceModal: (choiceId: string) => void;
  closeChoiceModal: () => void;
  selectPlayerChoice: (choiceId: string, optionId: string) => void;
  advanceChapter: (targetChapter?: ChapterId) => void;
  dismissChapterBanner: () => void;
  unlockJournalEntry: (entryId: string) => void;
  evaluateEndingEligibility: () => { eligibleEndings: CampaignEndingId[]; primaryEnding: CampaignEndingId };
  triggerCampaignEnding: (endingId: CampaignEndingId) => void;

  // Actions
  tick: (deltaSeconds: number) => void;
  gatherResource: (nodeId: string) => void;
  toggleAirlockDoor: () => void;
  enterHab: () => void;
  exitHab: () => void;
  setControlMode: (mode: ControlMode) => void;
  toggleVisorScan: () => void;
  toggleSound: () => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  setRoverPosition: (pos: [number, number, number]) => void;
  setCameraLook: (yaw: number, pitch: number) => void;
  setTargetedInteractable: (interactable: InteractableObject | null) => void;
  openSubstanceModal: (substance?: SubstanceDetails) => void;
  closeSubstanceModal: () => void;
  openStorageModal: (initialTab?: 'vault' | 'rover') => void;
  closeStorageModal: () => void;
  openRenovationModal: (initialFacility?: FacilityId) => void;
  closeRenovationModal: () => void;
  openPowerGridModal: () => void;
  closePowerGridModal: () => void;
  openMissionModal: () => void;
  closeMissionModal: () => void;
  openMapModal: () => void;
  closeMapModal: () => void;
  openResearchModal: () => void;
  closeResearchModal: () => void;
  openIntelligentBaseModal: () => void;
  closeIntelligentBaseModal: () => void;
  setRoverAIMode: (mode: RoverAIMode) => void;
  setRoverDestination: (destination: RoverDestination) => { success: boolean; message: string };
  cancelRoverAutonomous: () => void;
  updateRoverNavPlan: (partial: Partial<RoverNavigationPlan>) => void;
  setRobotMode: (mode: RobotMode) => void;
  assignTransportTask: (
    resourceType: ResourceType,
    count: number,
    source: StorageContainerType,
    destination: StorageContainerType
  ) => { success: boolean; message: string };
  cancelTransportTask: (taskId: string) => { success: boolean; message: string };
  executeAIAction: (recId: string) => { success: boolean; message: string };
  acknowledgeAIRecommendation: (recId: string) => void;
  updateRobotState: (partial: Partial<RobotState>) => void;
  startMission: (missionId: string) => { success: boolean; message: string };
  trackMission: (missionId: string) => void;
  claimMissionReward: (missionId: string) => { success: boolean; message: string };
  setNavTarget: (target: { x: number; z: number; name: string } | null) => void;
  scanTarget: (targetId: string) => { success: boolean; message: string; researchYield: number };
  startScanning: (targetId: string) => void;
  updateScanningProgress: (delta: number) => { completed: boolean };
  cancelScanning: () => void;
  discoverLandmark: (landmarkId: string) => void;
  collectLandmarkSample: (landmarkId: string) => { success: boolean; message: string };
  unlockResearchTech: (techId: string) => { success: boolean; message: string };
  updateObjectiveProgress: (type: ObjectiveType, targetKey?: string, deltaOrValue?: number) => void;
  triggerWorldEvent: (event: WorldEvent) => void;
  dismissWorldEvent: () => void;
  upgradeFacility: (facilityId: FacilityId) => { success: boolean; message: string };
  restInLivingQuarters: () => { success: boolean; message: string };
  harvestGreenhouseCrop: () => { success: boolean; message: string };
  plantGreenhouseCrop: () => { success: boolean; message: string };
  waterGreenhouseCrop: () => { success: boolean; message: string };
  consumeFood: () => { success: boolean; message: string };
  consumeWater: () => { success: boolean; message: string };
  refillSuitOxygen: () => { success: boolean; message: string };
  toggleFacilityCircuit: (circuit: keyof BasePowerGrid['facilityCircuits']) => void;
  applyGarageMaintenance: () => { success: boolean; message: string };
  openCraftingModal: () => void;
  closeCraftingModal: () => void;
  openDisassemblyModal: () => void;
  closeDisassemblyModal: () => void;
  startCrafting: (
    recipeId: string,
    source: 'backpack' | 'vault',
    target: 'backpack' | 'vault'
  ) => { success: boolean; message: string };
  cancelCrafting: () => { success: boolean; message: string };
  disassembleItem: (
    type: ResourceType,
    count: number,
    source: 'backpack' | 'vault',
    target: 'backpack' | 'vault'
  ) => { success: boolean; message: string };
  applyRepairKit: () => { success: boolean; message: string };
  installBatteryPack: () => { success: boolean; message: string };
  transferItem: (
    source: StorageContainerType,
    target: StorageContainerType,
    type: ResourceType,
    count: number
  ) => { success: boolean; message: string };
  transferAll: (source: StorageContainerType, target: StorageContainerType) => void;
  dropItem: (type: ResourceType, count: number) => void;
  useConsumable: (type: ResourceType) => void;
  depositToStorage: (type: ResourceType, count: number) => void;
  depositAllToStorage: () => void;
  withdrawFromStorage: (type: ResourceType, count: number) => void;
  purchaseRenovation: (upgradeId: UpgradeId) => { success: boolean; message: string };
  resetSaveData: () => void;
  togglePauseModal: (open?: boolean) => void;
  updateRoverTelemetry: (speedKmH: number, batteryDelta?: number, gear?: 'D' | 'N' | 'R' | 'P') => void;
  craftOxygenCanister: () => void;
  repairSuitIntegrity: () => void;
  completeObjective: (id: string) => void;
  showNotification: (msg: string) => void;
  clearNotification: () => void;
  restartGame: () => void;

  // Phase 12: Main Menu, Prologue & Calibration Settings
  isMainMenuOpen: boolean;
  isOpeningPrologueOpen: boolean;
  openMainMenu: () => void;
  closeMainMenu: () => void;
  openOpeningPrologue: () => void;
  closeOpeningPrologue: () => void;
  updateSettings: (partial: Partial<GameSettings>) => void;
  saveToSlot: (slot: number) => { success: boolean; message: string };
  loadFromSlot: (slot: number) => { success: boolean; message: string };
  getSaveSlotsInfo: () => Array<{ slot: number; exists: boolean; sol: number; timestamp?: string; chapter?: number }>;
}

const savedData = loadSavedState();
const initialInventory: Record<ResourceType, ResourceItem> = savedData?.inventory
  ? { ...INITIAL_INVENTORY, ...savedData.inventory }
  : { ...INITIAL_INVENTORY };
const initialVaultStorage: Record<ResourceType, number> = savedData?.vaultStorage
  ? { ...INITIAL_VAULT_STORAGE, ...savedData.vaultStorage }
  : { ...INITIAL_VAULT_STORAGE };
const initialRoverStorage: Record<ResourceType, number> = savedData?.roverStorage
  ? { ...INITIAL_ROVER_STORAGE, ...savedData.roverStorage }
  : { ...INITIAL_ROVER_STORAGE };
const initialFacilities: FacilityRenovations = savedData?.facilityRenovations
  ? { ...INITIAL_FACILITY_RENOVATIONS, ...savedData.facilityRenovations }
  : savedData?.renovations
  ? {
      command_centre: savedData.renovations.power_room ? 1 : 0,
      greenhouse: savedData.renovations.greenhouse ? 1 : 0,
      engineering_workshop: savedData.renovations.storage_room ? 2 : savedData.renovations.power_room ? 1 : 0,
      rover_garage: 0,
      living_quarters: savedData.renovations.hab_expansion ? 1 : 0,
      comm_room: savedData.renovations.comm_room ? 1 : 0,
    }
  : { ...INITIAL_FACILITY_RENOVATIONS };

const initialRenovations: RenovationStatus = {
  power_room: initialFacilities.engineering_workshop >= 1,
  storage_room: initialFacilities.engineering_workshop >= 2,
  greenhouse: initialFacilities.greenhouse >= 1,
  comm_room: initialFacilities.comm_room >= 1,
  hab_expansion: initialFacilities.living_quarters >= 1 || initialFacilities.greenhouse >= 1,
};
const initialCollectedIds: string[] = savedData?.collectedNodeIds || [];
const initialCapacity: number =
  savedData?.maxBackpackCapacity ||
  (initialRenovations.storage_room ? BACKPACK_EXPANDED_CAPACITY : BACKPACK_BASE_CAPACITY);
const initialNodes: ResourceNodeData[] = INITIAL_NODES.map((n) =>
  initialCollectedIds.includes(n.id) ? { ...n, depleted: true, scanDiscovered: true } : n
);

const initialPowerGrid: BasePowerGrid = savedData?.powerGrid
  ? { ...INITIAL_POWER_GRID, ...savedData.powerGrid }
  : { ...INITIAL_POWER_GRID };

const initialGreenhouseCrop: GreenhouseCropState = savedData?.greenhouseCrop
  ? { ...INITIAL_GREENHOUSE_CROP, ...savedData.greenhouseCrop }
  : { ...INITIAL_GREENHOUSE_CROP };

const initialVitals: PlayerVitals = savedData?.vitals
  ? { ...INITIAL_VITALS, ...savedData.vitals }
  : { ...INITIAL_VITALS };

const initialSol: SolCycle = savedData?.solCycle
  ? { ...INITIAL_SOL, ...savedData.solCycle }
  : { ...INITIAL_SOL };

const initialMissions: Record<string, MissionDefinition> = savedData?.missions
  ? { ...INITIAL_MISSIONS, ...savedData.missions }
  : { ...INITIAL_MISSIONS };

const initialCompletedMissions: string[] = savedData?.completedMissionIds || [];
const initialDiscoveredLandmarks: string[] = savedData?.discoveredLandmarkIds || [];
const initialScannedTargets: string[] = savedData?.scannedTargetIds || [];
const initialUnlockedTechs: string[] = savedData?.unlockedTechIds || [];

const initialLandmarks: ExplorationLandmark[] = INITIAL_LANDMARKS.map((lm) => ({
  ...lm,
  discovered: initialDiscoveredLandmarks.includes(lm.id),
}));

const initialScannables: ScannableTarget[] = INITIAL_SCANNABLES.map((st) => ({
  ...st,
  scanned: initialScannedTargets.includes(st.id),
}));

const initialResearchTechs: ResearchTech[] = INITIAL_RESEARCH_TECHS.map((tech) => ({
  ...tech,
  unlocked: initialUnlockedTechs.includes(tech.id),
}));

export const useMarsGameStore = create<MarsGameState>((set, get) => ({
  vitals: { ...initialVitals },
  powerGrid: { ...initialPowerGrid },
  greenhouseCrop: { ...initialGreenhouseCrop },
  survivalWarnings: [],
  inventory: initialInventory,
  vaultStorage: initialVaultStorage,
  vaultStorageWeight: calculateStorageWeight(initialVaultStorage),
  roverStorage: initialRoverStorage,
  roverStorageWeight: calculateStorageWeight(initialRoverStorage),
  facilityRenovations: initialFacilities,
  activeFacilityTab: 'command_centre',
  setActiveFacilityTab: (tab: FacilityId) => set({ activeFacilityTab: tab }),
  renovations: initialRenovations,
  collectedNodeIds: initialCollectedIds,
  maxBackpackCapacity: initialCapacity,
  maxRoverCapacity: ROVER_STORAGE_CAPACITY,
  maxVaultCapacity: VAULT_STORAGE_CAPACITY,
  backpackWeight: calculateBackpackWeight(initialInventory),
  activeStorageTab: 'vault',
  setActiveStorageTab: (tab: 'vault' | 'rover') => set({ activeStorageTab: tab }),
  resourceNodes: initialNodes,
  solCycle: { ...initialSol },
  objectives: [...INITIAL_OBJECTIVES],
  settings: {
    soundEnabled: true,
    visorScanActive: false,
    controlMode: 'on_foot',
    thirdPerson: true,
    masterVolume: 1.0,
    musicVolume: 0.7,
    effectsVolume: 0.9,
    graphicsQuality: 'high',
  },
  isMainMenuOpen: true,
  isOpeningPrologueOpen: false,
  playerPosition: [0, 0, 11], // Start outside airlock
  roverPosition: [8, 0, 8],
  isInsideHab: false,
  doorOpen: false,
  isGameOver: false,
  gameOverReason: '',
  notification: 'Jezero Crater Outpost Alpha. Press [V] for Spectral Scanner, [E] to interact, [ESC] for Pause Guide.',

  targetedInteractable: null,
  selectedSubstance: null,
  isSubstanceModalOpen: false,
  isPauseModalOpen: false,
  isStorageModalOpen: false,
  isRenovationModalOpen: false,
  isCraftingModalOpen: false,
  isDisassemblyModalOpen: false,
  isPowerGridModalOpen: false,
  openPowerGridModal: () => set({ isPowerGridModalOpen: true }),
  closePowerGridModal: () => set({ isPowerGridModalOpen: false }),

  worldSeed: savedData?.worldSeed ?? 42,
  setWorldSeed: (seed: number) => {
    ProceduralTerrainSystem.getInstance().setSeed(seed);
    set({ worldSeed: seed });
    writeSaveState({ worldSeed: seed });
  },

  // Story & Campaign System (Phase 11)
  campaignChapter: (savedData?.campaignChapter ?? 1) as ChapterId,
  completedChapters: savedData?.completedChapters ?? [],
  unlockedJournalIds: savedData?.unlockedJournalIds ?? ['journal_sol_01', 'journal_audio_vance_01'],
  activeDialogue: savedData?.campaignChapter ? null : CAMPAIGN_DIALOGUES['dia_ch1_intro'],
  dialogueHistory: savedData?.dialogueHistory ?? [],
  playerDecisions: savedData?.playerDecisions ?? {},
  activeChoiceModalId: null,
  campaignEnding: savedData?.campaignEnding ?? null,
  campaignCompleted: savedData?.campaignCompleted ?? false,
  isJournalModalOpen: false,
  isEndingModalOpen: false,
  chapterBanner: {
    chapter: CAMPAIGN_CHAPTERS.find((c) => c.id === (savedData?.campaignChapter ?? 1)) || CAMPAIGN_CHAPTERS[0],
    visible: true,
  },

  openJournalModal: () => {
    audioSystem.playChime(950);
    set({ isJournalModalOpen: true, isPauseModalOpen: false });
  },
  closeJournalModal: () => set({ isJournalModalOpen: false }),

  openEndingModal: () => {
    audioSystem.playChapterFanfare();
    set({ isEndingModalOpen: true });
  },
  closeEndingModal: () => set({ isEndingModalOpen: false }),

  triggerDialogue: (dialogueId: string) => {
    const node = CAMPAIGN_DIALOGUES[dialogueId];
    if (!node) return;
    if (node.audioTone === 'comm_beep') audioSystem.playCommBeep();
    else if (node.audioTone === 'urgent_alarm') audioSystem.playAlarm();
    else audioSystem.playChime(1100);

    const history = Array.from(new Set([...get().dialogueHistory, dialogueId]));
    set({ activeDialogue: node, dialogueHistory: history });
    writeSaveState({ dialogueHistory: history });
  },

  dismissDialogue: () => set({ activeDialogue: null }),

  openChoiceModal: (choiceId: string) => {
    audioSystem.playChime(1050);
    set({ activeChoiceModalId: choiceId, isPauseModalOpen: false });
  },
  closeChoiceModal: () => set({ activeChoiceModalId: null }),

  selectPlayerChoice: (choiceId: string, optionId: string) => {
    const state = get();
    const choice = CAMPAIGN_CHOICES[choiceId];
    if (!choice) return;
    const option = choice.options.find((o) => o.id === optionId);
    if (!option) return;

    const newDecisions = { ...state.playerDecisions, [choiceId]: optionId };

    let bonusResearch = 0;
    let newBatteryCapacity = state.powerGrid.maxBatteryKWh;
    let newVaultCapacity = state.maxVaultCapacity;
    let newRoverCapacity = state.maxRoverCapacity;

    if (optionId === 'opt_ch2_comms_focus') {
      bonusResearch += 150;
    } else if (optionId === 'opt_ch2_power_focus') {
      newBatteryCapacity += 30;
    } else if (optionId === 'opt_ch3_rover_mobility') {
      newRoverCapacity = 150.0;
    } else if (optionId === 'opt_ch3_base_automation') {
      newVaultCapacity = 600.0;
    } else if (optionId === 'opt_ch5_deep_science') {
      bonusResearch += 300;
    }

    set({
      playerDecisions: newDecisions,
      activeChoiceModalId: null,
      researchDataPoints: state.researchDataPoints + bonusResearch,
      maxVaultCapacity: newVaultCapacity,
      maxRoverCapacity: newRoverCapacity,
      powerGrid: { ...state.powerGrid, maxBatteryKWh: newBatteryCapacity },
      notification: `CAMPAIGN DIRECTIVE ENACTED: [${option.label}]. ${option.consequencesSummary}`,
    });

    writeSaveState({
      playerDecisions: newDecisions,
      researchDataPoints: state.researchDataPoints + bonusResearch,
      maxVaultCapacity: newVaultCapacity,
      maxRoverCapacity: newRoverCapacity,
    });

    if (choiceId === 'choice_ch6_final_destiny') {
      const endingId: CampaignEndingId = optionId === 'opt_ch6_pioneer_colony' ? 'ending_pioneer' : 'ending_scientist';
      get().triggerCampaignEnding(endingId);
    }
  },

  advanceChapter: (targetChapter?: ChapterId) => {
    const state = get();
    const nextChapterId = (targetChapter ?? (state.campaignChapter + 1)) as ChapterId;
    if (nextChapterId > 6) return;

    const completed = Array.from(new Set([...state.completedChapters, state.campaignChapter]));
    const nextDef = CAMPAIGN_CHAPTERS.find((c) => c.id === nextChapterId) || CAMPAIGN_CHAPTERS[0];

    audioSystem.playChapterFanfare();

    set({
      campaignChapter: nextChapterId,
      completedChapters: completed,
      chapterBanner: { chapter: nextDef, visible: true },
      notification: `CAMPAIGN MILESTONE: ${nextDef.title} — ${nextDef.subtitle} UNLOCKED!`,
    });

    writeSaveState({
      campaignChapter: nextChapterId,
      completedChapters: completed,
    });
  },

  dismissChapterBanner: () => {
    set((state) => ({
      chapterBanner: state.chapterBanner ? { ...state.chapterBanner, visible: false } : null,
    }));
  },

  unlockJournalEntry: (entryId: string) => {
    const state = get();
    if (state.unlockedJournalIds.includes(entryId)) return;
    const newUnlocked = [...state.unlockedJournalIds, entryId];
    audioSystem.playCommBeep();
    set({
      unlockedJournalIds: newUnlocked,
      notification: 'NEW FIELD JOURNAL LOG DISCOVERED: Press [J] to review archive.',
    });
    writeSaveState({ unlockedJournalIds: newUnlocked });
  },

  evaluateEndingEligibility: () => {
    const state = get();
    const facs = state.facilityRenovations;
    const eligible: CampaignEndingId[] = [];

    if (facs.command_centre >= 1 && facs.greenhouse >= 1 && facs.engineering_workshop >= 1) {
      eligible.push('ending_pioneer');
    }
    if (state.unlockedTechIds.length >= 2 || state.scannedTargetIds.length >= 4) {
      eligible.push('ending_scientist');
    }
    if (state.discoveredLandmarkIds.length >= 4) {
      eligible.push('ending_explorer');
    }
    if (state.solCycle.solNumber >= 2) {
      eligible.push('ending_survivor');
    }

    if (eligible.length === 0) eligible.push('ending_survivor');

    let primary: CampaignEndingId = eligible[0];
    const decs = Object.values(state.playerDecisions);
    if (decs.includes('opt_ch6_pioneer_colony')) primary = 'ending_pioneer';
    else if (decs.includes('opt_ch6_scientist_preserve')) primary = 'ending_scientist';
    else if (eligible.includes('ending_pioneer')) primary = 'ending_pioneer';

    return { eligibleEndings: eligible, primaryEnding: primary };
  },

  triggerCampaignEnding: (endingId: CampaignEndingId) => {
    audioSystem.playChapterFanfare();
    set({
      campaignEnding: endingId,
      campaignCompleted: true,
      isEndingModalOpen: true,
      notification: `CAMPAIGN CONCLUDED: ${CAMPAIGN_ENDINGS[endingId]?.title}!`,
    });
    writeSaveState({
      campaignEnding: endingId,
      campaignCompleted: true,
    });
  },

  isMissionModalOpen: false,
  isMapModalOpen: false,
  isResearchModalOpen: false,
  openMissionModal: () => set({ isMissionModalOpen: true }),
  closeMissionModal: () => set({ isMissionModalOpen: false }),
  openMapModal: () => set({ isMapModalOpen: true }),
  closeMapModal: () => set({ isMapModalOpen: false }),
  openResearchModal: () => set({ isResearchModalOpen: true }),
  closeResearchModal: () => set({ isResearchModalOpen: false }),
  isIntelligentBaseModalOpen: false,
  openIntelligentBaseModal: () => {
    audioSystem.playChime(950);
    set({ isIntelligentBaseModalOpen: true, isPauseModalOpen: false });
  },
  closeIntelligentBaseModal: () => set({ isIntelligentBaseModalOpen: false }),

  // Phase 8: Autonomous Rover, Intelligent Base & Robot Assistant
  roverAIMode: 'manual' as RoverAIMode,
  roverNavPlan: {
    destination: null,
    waypoints: [],
    currentWaypointIndex: 0,
    totalDistance: 0,
    remainingDistance: 0,
    progressPercent: 0,
    estimatedSecondsRemaining: 0,
    state: 'idle' as RoverAIState,
  },
  robotState: savedData?.robotState
    ? { ...savedData.robotState, mode: 'idle' }
    : { ...INITIAL_ROBOT_STATE },
  transportTasks: savedData?.transportTasks || [],
  baseRecommendations: [],
  baseAlerts: savedData?.baseAlerts || [],

  // Missions, Exploration & Research System
  missions: initialMissions,
  activeMissionId: savedData?.activeMissionId || 'mis_restore_comms',
  completedMissionIds: initialCompletedMissions,
  landmarks: initialLandmarks,
  discoveredLandmarkIds: initialDiscoveredLandmarks,
  scannableTargets: initialScannables,
  scannedTargetIds: initialScannedTargets,
  researchDataPoints: savedData?.researchDataPoints ?? 0,
  researchTechs: initialResearchTechs,
  unlockedTechIds: initialUnlockedTechs,
  activeWorldEvent: null,
  navTarget: null,
  scanningState: { active: false, targetId: null, progress: 0 },
  activeCraftingJob: null,
  craftingHistory: savedData?.craftingHistory || [],

  roverTelemetry: {
    speedKmH: 0,
    batteryPercent: 100,
    gear: 'N',
  },

  cameraLook: { yaw: Math.PI, pitch: 0.15 },

  tick: (deltaSeconds: number) => {
    const state = get();
    if (state.isGameOver || state.isPauseModalOpen) return;

    // 1. Advance Sol clock & diurnal cycle
    const timeDelta = (deltaSeconds * 12) / 3600;
    let newTime = state.solCycle.timeOfDay + timeDelta;
    let newSol = state.solCycle.solNumber;

    if (newTime >= 24.65) {
      newTime -= 24.65;
      newSol += 1;
      state.showNotification(`Sol ${newSol} has arrived. Sunrise over Jezero.`);
    }

    const isDay = newTime >= 6.0 && newTime <= 18.5;
    const solarFactor = isDay ? Math.sin(((newTime - 6.0) / 12.5) * Math.PI) : 0;

    // Check Sol 5 objective (survive night)
    if (!isDay && !state.objectives.find((o) => o.id === 'obj-5')?.completed) {
      state.completeObjective('obj-5');
    }

    // 2. Weather & Martian Dust Storm progression
    let weather: WeatherType = state.solCycle.weather || 'clear';
    let weatherDuration = (state.solCycle.weatherDuration ?? 240) - deltaSeconds;
    let currentDust = state.solCycle.dustStormIntensity;

    if (weatherDuration <= 0) {
      const rand = Math.random();
      if (rand < 0.65) {
        weather = 'clear';
        weatherDuration = 220 + Math.random() * 140;
      } else if (rand < 0.88) {
        weather = 'light_dust';
        weatherDuration = 120 + Math.random() * 90;
        state.showNotification('WEATHER UPDATE: Martian dust clouds gathering across Jezero basin.');
      } else {
        weather = 'heavy_dust';
        weatherDuration = 80 + Math.random() * 70;
        state.showNotification('WEATHER HAZARD: Heavy dust storm active! Atmospheric visibility & solar irradiance severely attenuated.');
      }
    }

    const targetDust = weather === 'heavy_dust' ? 0.85 : weather === 'light_dust' ? 0.42 : 0.08;
    const dustStormIntensity = currentDust + (targetDust - currentDust) * Math.min(1, deltaSeconds * 0.15);
    audioSystem.updateWindIntensity(dustStormIntensity);

    const dustAttenuation = Math.max(0.15, 1.0 - dustStormIntensity * 0.75);
    const irradiance = Math.max(0, Math.round(solarFactor * 590 * dustAttenuation));
    const surfaceTemp = Math.round(-115 + solarFactor * 135);

    // 3. Base Power Grid Simulation (100 kWh storage + 14 kW solar peak)
    const grid = { ...state.powerGrid };
    const hasPVTech = state.unlockedTechIds.includes('tech_pv_coating');
    const maxSolarKW = hasPVTech ? 16.8 : 14.0;
    const solarOutputKW = Math.round((solarFactor * maxSolarKW * dustAttenuation) * 10) / 10;

    const circuitLoads: Record<keyof BasePowerGrid['facilityCircuits'], number> = {
      life_support: 3.0,
      living_quarters: 1.5,
      greenhouse: 2.5,
      engineering_workshop: 2.0,
      comm_room: 1.5,
    };

    let totalConsumptionKW = 0;
    for (const [key, enabled] of Object.entries(grid.facilityCircuits) as [keyof BasePowerGrid['facilityCircuits'], boolean][]) {
      if (enabled) {
        totalConsumptionKW += circuitLoads[key];
      }
    }
    totalConsumptionKW = Math.round(totalConsumptionKW * 10) / 10;

    const netKW = solarOutputKW - totalConsumptionKW;
    const kwhDelta = (netKW * deltaSeconds * 12) / 3600;
    let newBatteryKWh = Math.max(0, Math.min(grid.maxBatteryKWh, grid.batteryStorageKWh + kwhDelta));
    newBatteryKWh = Math.round(newBatteryKWh * 100) / 100;

    let isBlackout = grid.isBlackout;
    if (newBatteryKWh <= 0.05) {
      if (!isBlackout) {
        isBlackout = true;
        audioSystem.playAlarm();
        state.showNotification('BASE POWER BLACKOUT: Outpost Alpha auxiliary battery depleted! Life support offline.');
      }
    } else if (newBatteryKWh > 2.0) {
      if (isBlackout) {
        isBlackout = false;
        state.showNotification('BASE POWER RESTORED: Solar arrays energizing Outpost Alpha grid.');
      }
    }

    grid.solarOutputKW = solarOutputKW;
    grid.totalConsumptionKW = totalConsumptionKW;
    grid.batteryStorageKWh = newBatteryKWh;
    grid.isBlackout = isBlackout;

    // 4. Habitat & Suit Temperature Simulation
    let { health, oxygen, food, water, power, coreTemp, suitTemp, habTemp, suitIntegrity, radiationDose } = state.vitals;

    const habHeatingOnline = !isBlackout && grid.facilityCircuits.life_support;
    if (habHeatingOnline) {
      habTemp = Math.min(21.0, habTemp + deltaSeconds * 0.5);
    } else {
      habTemp = Math.max(surfaceTemp, habTemp - (habTemp - surfaceTemp) * 0.02 * deltaSeconds);
    }
    habTemp = Math.round(habTemp * 10) / 10;

    // 5. Player Vitals Simulation
    if (state.isInsideHab) {
      // Inside pressurized habitat
      const ghBonus = state.facilityRenovations.greenhouse >= 2 ? 2.5 : 0;
      if (habHeatingOnline) {
        oxygen = Math.min(100, oxygen + deltaSeconds * (4.0 + ghBonus));
        power = Math.min(100, power + deltaSeconds * 3.5);
        suitTemp = Math.min(21.0, suitTemp + deltaSeconds * 1.0);
        coreTemp = Math.min(37.0, coreTemp + deltaSeconds * 0.2);
        if (food > 40 && water > 40) {
          health = Math.min(100, health + deltaSeconds * 1.2);
        }
      } else {
        // Hab blackout: cold interior, no oxygen generation
        suitTemp = Math.max(habTemp, suitTemp - (suitTemp - habTemp) * 0.03 * deltaSeconds);
        if (habTemp < 10) {
          coreTemp = Math.max(25, coreTemp - 0.05 * deltaSeconds);
        }
      }
    } else {
      // Outside in EVA Suit
      const hasO2Tech = state.unlockedTechIds.includes('tech_eva_recirculator');
      const o2Burn = (hasO2Tech ? 0.09 : 0.12) * deltaSeconds;
      oxygen = Math.max(0, oxygen - o2Burn);

      const heatingLoad = Math.max(0, (20 - surfaceTemp) * 0.0035);
      const solarRecharge = (irradiance / 590) * 0.08 * (1 - dustStormIntensity);
      const powerDelta = (-0.1 - heatingLoad + solarRecharge) * deltaSeconds;
      power = Math.max(0, Math.min(100, power + powerDelta));

      if (power > 0) {
        suitTemp = Math.min(20.0, suitTemp + deltaSeconds * 0.4);
        coreTemp = Math.min(37.0, coreTemp + 0.05 * deltaSeconds);
      } else {
        // Suit heater failure
        suitTemp = Math.max(surfaceTemp, suitTemp - (suitTemp - surfaceTemp) * 0.06 * deltaSeconds);
        if (suitTemp < 15) {
          coreTemp = Math.max(25, coreTemp - (18 - suitTemp) * 0.015 * deltaSeconds);
        }
      }

      const radRate = 0.0008 * (1 + (1 - dustStormIntensity) * 0.5);
      radiationDose += radRate * deltaSeconds;
    }

    suitTemp = Math.round(suitTemp * 10) / 10;
    coreTemp = Math.round(coreTemp * 10) / 10;

    // Metabolic consumption
    water = Math.max(0, water - 0.032 * deltaSeconds);
    food = Math.max(0, food - 0.018 * deltaSeconds);

    // Health damage penalties (non-instant death)
    if (oxygen <= 0) health -= 5.0 * deltaSeconds;
    if (coreTemp < 32) health -= 3.0 * deltaSeconds;
    if (water <= 0) health -= 1.2 * deltaSeconds;
    if (food <= 0) health -= 0.6 * deltaSeconds;
    if (radiationDose > 250) health -= 1.0 * deltaSeconds;
    health = Math.max(0, Math.min(100, health));

    if (oxygen < 15 || power < 10 || water < 10 || coreTemp < 33) {
      audioSystem.triggerCriticalAlarm(true);
    } else {
      audioSystem.triggerCriticalAlarm(false);
    }

    if (health <= 0) {
      let reason = 'Biological vital collapse.';
      if (oxygen <= 0) reason = 'Asphyxiation — Oxygen tank exhausted in Jezero atmosphere.';
      else if (coreTemp < 32) reason = 'Hypothermia — Suit heating depleted during freezing Martian night.';
      else if (water <= 0) reason = 'Severe Dehydration — Cellular physiological failure.';
      else if (food <= 0) reason = 'Starvation — Caloric energy exhaustion.';
      else if (radiationDose > 250) reason = 'Fatal acute solar cosmic radiation exposure.';

      audioSystem.triggerCriticalAlarm(false);
      set({
        isGameOver: true,
        gameOverReason: reason,
        vitals: { health: 0, oxygen, food, water, power, coreTemp, suitTemp, habTemp, suitIntegrity, radiationDose },
      });
      return;
    }

    // 6. Greenhouse Aeroponic Crop Progression
    const crop = { ...state.greenhouseCrop };
    const greenhousePowered = !isBlackout && grid.facilityCircuits.greenhouse && state.facilityRenovations.greenhouse >= 1;
    if (greenhousePowered && crop.stage === 'growing') {
      const hasBioTech = state.unlockedTechIds.includes('tech_bio_nutrients');
      const growthRate = (state.facilityRenovations.greenhouse >= 3 ? 1.5 : 1.0) * (hasBioTech ? 1.35 : 1.0);
      crop.growthTimeRemaining = Math.max(0, crop.growthTimeRemaining - deltaSeconds * growthRate);
      crop.progressPercent = Math.min(100, Math.round(100 - (crop.growthTimeRemaining / 120) * 100));
      if (crop.growthTimeRemaining <= 0) {
        crop.stage = 'ready';
        state.showNotification('GREENHOUSE READY: Aeroponic potato crop fully matured for harvest [E]!');
      }
    }

    // 7. Dynamic Survival Warnings Compilation
    const warnings: string[] = [];
    if (oxygen < 15) warnings.push('CRITICAL: Suit Oxygen Exhaustion Imminent (<15%)');
    else if (oxygen < 25) warnings.push('WARNING: Low Suit Oxygen (<25%)');

    if (water <= 0) warnings.push('CRITICAL: Dehydration — Cellular Vital Breakdown');
    else if (water < 20) warnings.push('WARNING: Hydration Low (<20%) — Drink Water');

    if (food <= 0) warnings.push('CRITICAL: Starvation — Metabolic Collapse');
    else if (food < 20) warnings.push('WARNING: Caloric Reserve Low (<20%) — Eat Rations');

    if (power <= 0) warnings.push('CRITICAL: Suit Battery Depleted — Heaters Offline');
    else if (power < 15) warnings.push('WARNING: Low Suit Battery (<15%)');

    if (coreTemp < 33) warnings.push('CRITICAL: Severe Hypothermia Detected (<33°C)');
    else if (coreTemp < 35.5) warnings.push('WARNING: Body Core Temperature Dropping');

    if (isBlackout) warnings.push('HABITAT EMERGENCY: Grid Blackout — Auxiliary Battery Depleted');
    if (weather === 'heavy_dust') warnings.push('ENVIRONMENTAL HAZARD: Heavy Dust Storm Active — Solar Yield Reduced');

    // 8. Rover passive solar recharge during daylight + garage rapid induction pad
    let currentRoverBattery = state.roverTelemetry.batteryPercent;
    if (isDay && state.settings.controlMode !== 'driving_rover') {
      currentRoverBattery = Math.min(100, currentRoverBattery + deltaSeconds * 0.2 * dustAttenuation);
    }
    const dGarage = Math.hypot(state.roverPosition[0] - 8.5, state.roverPosition[2] - 4.0);
    if (dGarage < 5.0 && state.facilityRenovations.rover_garage >= 2) {
      const garageRechargeRate = state.facilityRenovations.rover_garage >= 3 ? 5.0 : 2.5;
      currentRoverBattery = Math.min(100, currentRoverBattery + deltaSeconds * garageRechargeRate);
    }

    set({
      vitals: { health, oxygen, food, water, power, coreTemp, suitTemp, habTemp, suitIntegrity, radiationDose },
      powerGrid: grid,
      greenhouseCrop: crop,
      survivalWarnings: warnings,
      roverTelemetry: {
        ...state.roverTelemetry,
        batteryPercent: currentRoverBattery,
      },
      solCycle: {
        solNumber: newSol,
        timeOfDay: newTime,
        surfaceTemp,
        solarIrradiance: irradiance,
        dustStormIntensity,
        isDaytime: isDay,
        weather,
        weatherDuration,
      },
    });

    // 8b. Energy Independence Objective Tracking
    if (solarOutputKW >= 10.0 && newBatteryKWh >= 90.0) {
      state.updateObjectiveProgress('reach_energy', 'solar_and_battery', 1);
    }

    // 8c. Exploration Landmark Proximity Auto-Discovery (<15m)
    const curPos = state.settings.controlMode === 'driving_rover' ? state.roverPosition : state.playerPosition;
    for (const lm of state.landmarks) {
      if (!lm.discovered) {
        const dLandmark = Math.hypot(curPos[0] - lm.coordinates[0], curPos[2] - lm.coordinates[2]);
        if (dLandmark <= lm.discoveryRadius) {
          state.discoverLandmark(lm.id);
        }
      }
    }

    // 8d. Spectral Scanning Progression
    if (state.scanningState.active) {
      state.updateScanningProgress(deltaSeconds);
    }

    // 3. Process active molecular fabrication job if running
    const activeJob = state.activeCraftingJob;
    if (activeJob) {
      const nextProgress = activeJob.progressSeconds + deltaSeconds;
      if (nextProgress >= activeJob.durationSeconds) {
        // Job complete!
        const targetContainer = activeJob.targetStorage;
        const out = activeJob.output;
        const outDef = RESOURCE_DEFINITIONS[out.type];
        const addedMass = out.count * (outDef?.weightPerUnit ?? 1.0);

        const newInv = { ...state.inventory };
        const newVault = { ...state.vaultStorage };
        let actualTarget = targetContainer;

        if (targetContainer === 'backpack') {
          const curW = calculateBackpackWeight(newInv);
          if (curW + addedMass > state.maxBackpackCapacity + 0.001) {
            actualTarget = 'vault';
            newVault[out.type] = (newVault[out.type] ?? 0) + out.count;
            state.showNotification(
              `BACKPACK FULL: Fabricated ${out.count}x ${outDef?.name} diverted to Outpost Vault.`
            );
          } else {
            const it = newInv[out.type];
            newInv[out.type] = { ...it, count: (it?.count ?? 0) + out.count };
          }
        } else {
          newVault[out.type] = (newVault[out.type] ?? 0) + out.count;
        }

        const newBackpackWeight = calculateBackpackWeight(newInv);
        const newVaultWeight = calculateStorageWeight(newVault);

        const historyEntry: CraftingHistoryEntry = {
          id: `hist-${Date.now()}`,
          recipeName: activeJob.recipeName,
          outputType: out.type,
          outputCount: out.count,
          targetStorage: actualTarget,
          timestamp: `Sol ${state.solCycle.solNumber} • ${Math.floor(state.solCycle.timeOfDay).toString().padStart(2, '0')}:${Math.floor((state.solCycle.timeOfDay % 1) * 60).toString().padStart(2, '0')}`,
        };

        audioSystem.playChime(1200);

        set({
          activeCraftingJob: null,
          inventory: newInv,
          vaultStorage: newVault,
          backpackWeight: newBackpackWeight,
          vaultStorageWeight: newVaultWeight,
          craftingHistory: [historyEntry, ...state.craftingHistory].slice(0, 20),
          notification: `FABRICATION FINISHED: +${out.count}x ${outDef?.name || out.type} delivered to ${actualTarget.toUpperCase()}.`,
        });

        writeSaveState({
          inventory: newInv,
          roverStorage: state.roverStorage,
          vaultStorage: newVault,
          renovations: state.renovations,
          collectedNodeIds: state.collectedNodeIds,
          maxBackpackCapacity: state.maxBackpackCapacity,
          maxRoverCapacity: state.maxRoverCapacity,
          maxVaultCapacity: state.maxVaultCapacity,
          craftingHistory: [historyEntry, ...state.craftingHistory].slice(0, 20),
        });
      } else {
        set({
          activeCraftingJob: {
            ...activeJob,
            progressSeconds: nextProgress,
          },
        });
      }
    }

    // 8e. Phase 8: Robot Companion Telemetry & Transport Task Execution
    let updatedRobot = { ...state.robotState };
    let updatedTasks = [...state.transportTasks];
    let invCopy = { ...state.inventory };
    let vaultCopy = { ...state.vaultStorage };
    let roverCopy = { ...state.roverStorage };
    let robotOrTasksChanged = false;

    // Robot battery drainage / recharge
    if (updatedRobot.mode === 'follow_player' || updatedRobot.mode === 'transporting') {
      const newBat = Math.max(0, updatedRobot.batteryPercent - 0.12 * deltaSeconds);
      if (newBat !== updatedRobot.batteryPercent) {
        updatedRobot.batteryPercent = newBat;
        robotOrTasksChanged = true;
      }
      if (newBat <= 15.0) {
        updatedRobot.mode = 'return_to_dock';
        state.showNotification('Aero-Bot battery critical (<15%). Autonomous docking initiated.');
        robotOrTasksChanged = true;
      }
    } else if (
      updatedRobot.isCharging ||
      (updatedRobot.mode === 'idle' &&
        Math.hypot(updatedRobot.position[0] - 0.8, updatedRobot.position[2] - (-3.2)) < 1.6)
    ) {
      if (updatedRobot.batteryPercent < 100) {
        updatedRobot.batteryPercent = Math.min(100, updatedRobot.batteryPercent + 3.5 * deltaSeconds);
        updatedRobot.isCharging = true;
        robotOrTasksChanged = true;
      }
    }

    // Transport task execution
    const activeTaskIdx = updatedTasks.findIndex((t) => t.status === 'pending' || t.status === 'in_progress');
    if (activeTaskIdx !== -1 && updatedRobot.mode === 'transporting') {
      const task = { ...updatedTasks[activeTaskIdx] };
      const resDef = RESOURCE_DEFINITIONS[task.resourceType];
      const unitW = resDef?.weightPerUnit ?? 1.0;
      const totalMass = task.count * unitW;

      if (task.status === 'pending') {
        let hasSufficient = false;
        if (task.source === 'backpack') {
          const avail = invCopy[task.resourceType]?.count || 0;
          if (avail >= task.count) {
            invCopy[task.resourceType] = { ...invCopy[task.resourceType], count: avail - task.count };
            hasSufficient = true;
          }
        } else if (task.source === 'vault') {
          const avail = vaultCopy[task.resourceType] || 0;
          if (avail >= task.count) {
            vaultCopy[task.resourceType] = avail - task.count;
            hasSufficient = true;
          }
        } else if (task.source === 'rover') {
          const avail = roverCopy[task.resourceType] || 0;
          if (avail >= task.count) {
            roverCopy[task.resourceType] = avail - task.count;
            hasSufficient = true;
          }
        }

        if (hasSufficient) {
          task.status = 'in_progress';
          task.progressPercent = 0;
          updatedRobot.payload = {
            type: task.resourceType,
            count: task.count,
            weightKg: totalMass,
            taskId: task.id,
          };
          updatedTasks[activeTaskIdx] = task;
          robotOrTasksChanged = true;
        } else {
          task.status = 'failed';
          updatedTasks[activeTaskIdx] = task;
          state.showNotification(`Transport failed: Insufficient ${resDef?.name || task.resourceType} in ${task.source}.`);
          robotOrTasksChanged = true;
        }
      } else if (task.status === 'in_progress') {
        task.progressPercent = Math.min(100, task.progressPercent + deltaSeconds * 22);
        if (task.progressPercent >= 100) {
          // Deposit into destination container
          if (task.destination === 'backpack') {
            const curW = calculateBackpackWeight(invCopy);
            if (curW + totalMass <= state.maxBackpackCapacity + 0.001) {
              const it = invCopy[task.resourceType];
              invCopy[task.resourceType] = { ...it, count: (it?.count || 0) + task.count };
            } else {
              vaultCopy[task.resourceType] = (vaultCopy[task.resourceType] || 0) + task.count;
              state.showNotification(`Backpack full! Diverted ${task.count}x ${resDef?.name || task.resourceType} to Outpost Vault.`);
            }
          } else if (task.destination === 'vault') {
            vaultCopy[task.resourceType] = (vaultCopy[task.resourceType] || 0) + task.count;
          } else if (task.destination === 'rover') {
            roverCopy[task.resourceType] = (roverCopy[task.resourceType] || 0) + task.count;
          }

          task.status = 'completed';
          task.completedAt = `Sol ${newSol} • ${Math.floor(newTime).toString().padStart(2, '0')}:${Math.floor((newTime % 1) * 60).toString().padStart(2, '0')}`;
          updatedRobot.payload = null;
          updatedTasks[activeTaskIdx] = task;

          audioSystem.playChime(1100);
          state.showNotification(`Aero-Bot delivered ${task.count}x ${resDef?.name || task.resourceType} to ${task.destination.toUpperCase()}.`);

          const morePending = updatedTasks.some((t) => t.status === 'pending');
          if (!morePending) {
            updatedRobot.mode = 'idle';
          }
          robotOrTasksChanged = true;
        } else {
          updatedTasks[activeTaskIdx] = task;
          robotOrTasksChanged = true;
        }
      }
    }

    // 8f. Base AI Telemetry Assessment
    const telemetrySnapshot: BaseTelemetrySnapshot = {
      powerGrid: grid,
      solCycle: {
        solNumber: newSol,
        timeOfDay: newTime,
        surfaceTemp,
        solarIrradiance: irradiance,
        dustStormIntensity,
        isDaytime: isDay,
        weather,
        weatherDuration,
      },
      vitals: { health, oxygen, food, water, power, coreTemp, suitTemp, habTemp, suitIntegrity, radiationDose },
      greenhouseCrop: crop,
      facilityRenovations: state.facilityRenovations,
      roverTelemetry: { ...state.roverTelemetry, batteryPercent: currentRoverBattery },
      roverPosition: state.roverPosition,
      playerPosition: state.playerPosition,
      isInsideHab: state.isInsideHab,
      missions: state.missions,
      researchDataPoints: state.researchDataPoints,
      unlockedTechIds: state.unlockedTechIds,
    };

    const aiRecs = BaseAISystem.evaluateRecommendations(telemetrySnapshot);
    const aiAlerts = BaseAISystem.processAlerts(telemetrySnapshot, state.baseAlerts);

    if (robotOrTasksChanged) {
      set({
        robotState: updatedRobot,
        transportTasks: updatedTasks,
        inventory: invCopy,
        vaultStorage: vaultCopy,
        roverStorage: roverCopy,
        backpackWeight: calculateBackpackWeight(invCopy),
        vaultStorageWeight: calculateStorageWeight(vaultCopy),
        roverStorageWeight: calculateStorageWeight(roverCopy),
        baseRecommendations: aiRecs,
        baseAlerts: aiAlerts,
      });
    } else {
      set({
        baseRecommendations: aiRecs,
        baseAlerts: aiAlerts,
      });
    }
  },

  gatherResource: (nodeId: string) => {
    const state = get();
    const node = state.resourceNodes.find((n) => n.id === nodeId);
    if (!node || node.depleted) return;

    // Check backpack weight capacity
    const item = state.inventory[node.type];
    const unitWeight = item?.weightPerUnit ?? RESOURCE_DEFINITIONS[node.type]?.weightPerUnit ?? 1.0;
    const addedWeight = node.yieldCount * unitWeight;
    const currentWeight = calculateBackpackWeight(state.inventory);

    if (currentWeight + addedWeight > state.maxBackpackCapacity + 0.001) {
      audioSystem.playAlarm();
      state.showNotification(
        `BACKPACK OVERBURDENED! +${addedWeight.toFixed(1)} kg exceeds max capacity (${currentWeight.toFixed(1)}/${state.maxBackpackCapacity.toFixed(1)} kg). Deposit materials at Rover or Vault.`
      );
      return;
    }

    audioSystem.playDrillHarvest();

    const updatedNodes = state.resourceNodes.map((n) =>
      n.id === nodeId ? { ...n, depleted: true, scanDiscovered: true } : n
    );

    const updatedInventory = {
      ...state.inventory,
      [node.type]: {
        ...item,
        count: (item?.count ?? 0) + node.yieldCount,
      },
    };

    const newCollectedIds = state.collectedNodeIds.includes(nodeId)
      ? state.collectedNodeIds
      : [...state.collectedNodeIds, nodeId];

    const newWeight = calculateBackpackWeight(updatedInventory);

    if (node.type === 'water_ice') state.completeObjective('obj-2');
    if (node.type === 'titanium_scrap') state.completeObjective('obj-3');
    state.updateObjectiveProgress('collect_resource', node.type, node.yieldCount);

    // Also update selected substance if currently inspecting this node
    if (state.selectedSubstance && state.selectedSubstance.id === nodeId) {
      set({
        selectedSubstance: {
          ...state.selectedSubstance,
          discoveryStatus: 'Depleted',
          canBeCollected: false,
        },
      });
    }

    set({
      resourceNodes: updatedNodes,
      inventory: updatedInventory,
      collectedNodeIds: newCollectedIds,
      backpackWeight: newWeight,
      notification: `Extracted +${node.yieldCount} ${node.name} (${addedWeight.toFixed(1)} kg). Total: ${newWeight.toFixed(1)}/${state.maxBackpackCapacity.toFixed(1)} kg`,
    });

    writeSaveState({
      inventory: updatedInventory,
      vaultStorage: state.vaultStorage,
      roverStorage: state.roverStorage,
      renovations: state.renovations,
      collectedNodeIds: newCollectedIds,
      maxBackpackCapacity: state.maxBackpackCapacity,
      maxRoverCapacity: state.maxRoverCapacity,
      maxVaultCapacity: state.maxVaultCapacity,
    });
  },

  toggleAirlockDoor: () => {
    const nextState = !get().doorOpen;
    audioSystem.playAirlockCycle();
    set({
      doorOpen: nextState,
      notification: nextState ? 'Airlock Outer Bulkhead: OPEN' : 'Airlock Outer Bulkhead: SEALED',
    });
  },

  enterHab: () => {
    audioSystem.playAirlockCycle();
    set({
      isInsideHab: true,
      notification: 'Pressurized Environment: Habitat Alpha interior [1.0 ATM]. Life support nominal.',
    });
    get().completeObjective('obj-1');
  },

  exitHab: () => {
    audioSystem.playAirlockCycle();
    set({
      isInsideHab: false,
      notification: 'Depressurized Environment: Jezero Crater wilderness [0.38g].',
    });
  },

  setControlMode: (mode: ControlMode) => {
    audioSystem.playChime(660);
    set({
      settings: { ...get().settings, controlMode: mode },
      notification: mode === 'driving_rover' ? 'Cockpit Mounted: Mars Rover System Active' : 'On Foot: Astronaut EVA Suit Active',
    });
  },

  toggleVisorScan: () => {
    const next = !get().settings.visorScanActive;
    audioSystem.playChime(next ? 1200 : 400);

    // If active, mark resources within 35m as scanDiscovered
    let updatedNodes = get().resourceNodes;
    if (next) {
      const pPos = get().playerPosition;
      updatedNodes = updatedNodes.map((node) => {
        const d = Math.hypot(node.position[0] - pPos[0], node.position[2] - pPos[2]);
        return d <= 35 ? { ...node, scanDiscovered: true } : node;
      });
    }

    set({
      settings: { ...get().settings, visorScanActive: next },
      resourceNodes: updatedNodes,
      notification: next
        ? 'SPECTRAL VISOR SCANNER: ONLINE [35m RANGE]'
        : 'SPECTRAL VISOR SCANNER: STANDBY',
    });
  },

  toggleSound: () => {
    const current = get().settings.soundEnabled;
    const next = !current;
    audioSystem.setMuted(!next);
    set({
      settings: { ...get().settings, soundEnabled: next },
    });
  },

  setPlayerPosition: (pos: [number, number, number]) => {
    // Check if player stepped across the interior threshold (Primary dome, corridor, or secondary dome)
    const distToCenter = Math.hypot(pos[0], pos[2]);
    const distToSecondary = Math.hypot(pos[0], pos[2] - (-14.5));
    const isNowInside =
      (distToCenter < 7.2 && pos[2] < 6.2) ||
      (pos[2] <= -6.0 && pos[2] >= -20.0 && (Math.abs(pos[0]) < 1.8 || distToSecondary < 5.4));
    const wasInside = get().isInsideHab;

    if (isNowInside && !wasInside) {
      get().enterHab();
    } else if (!isNowInside && wasInside && pos[2] >= 6.2) {
      get().exitHab();
    }

    // Solar array proximity check for objective 4
    const dSolar = Math.hypot(pos[0] - 0, pos[2] - 18);
    if (dSolar < 8) {
      get().completeObjective('obj-4');
    }

    set({ playerPosition: pos });
  },

  setRoverPosition: (pos: [number, number, number]) => {
    set({ roverPosition: pos });
  },

  setCameraLook: (yaw: number, pitch: number) => {
    set({ cameraLook: { yaw, pitch } });
  },

  setTargetedInteractable: (interactable: InteractableObject | null) => {
    set({ targetedInteractable: interactable });

    // If an interactable resource node is targeted, also cache it as selected substance
    if (interactable?.resourceData) {
      const r = interactable.resourceData;
      set({
        selectedSubstance: {
          id: r.id,
          name: r.name,
          chemicalFormula: r.chemicalFormula,
          category: r.category,
          description: r.description,
          scientificProperties: r.scientificProperties,
          marsStationUsefulness: r.marsStationUsefulness,
          canBeCollected: !r.depleted,
          discoveryStatus: r.depleted ? 'Depleted' : r.scanDiscovered ? 'Analyzed' : 'Discovered',
        },
      });
    }
  },

  openSubstanceModal: (substance?: SubstanceDetails) => {
    const target = substance || get().selectedSubstance;
    if (!target) {
      get().showNotification('No substance targeted. Approach a mineral deposit or activate scanner [V].');
      return;
    }
    audioSystem.playChime(1100);
    set({
      selectedSubstance: target,
      isSubstanceModalOpen: true,
      isCraftingModalOpen: false,
      isDisassemblyModalOpen: false,
    });
  },

  closeSubstanceModal: () => {
    set({ isSubstanceModalOpen: false });
  },

  openStorageModal: (initialTab?: 'vault' | 'rover') => {
    audioSystem.playChime(750);
    set({
      isStorageModalOpen: true,
      activeStorageTab: initialTab || get().activeStorageTab || 'vault',
      isPauseModalOpen: false,
      isRenovationModalOpen: false,
      isSubstanceModalOpen: false,
      isCraftingModalOpen: false,
      isDisassemblyModalOpen: false,
    });
  },

  closeStorageModal: () => {
    audioSystem.playChime(600);
    set({ isStorageModalOpen: false });
  },

  openRenovationModal: (initialFacility?: FacilityId) => {
    audioSystem.playChime(850);
    set({
      isRenovationModalOpen: true,
      activeFacilityTab: initialFacility || get().activeFacilityTab || 'command_centre',
      isPauseModalOpen: false,
      isStorageModalOpen: false,
      isSubstanceModalOpen: false,
      isCraftingModalOpen: false,
      isDisassemblyModalOpen: false,
    });
  },

  closeRenovationModal: () => {
    audioSystem.playChime(600);
    set({ isRenovationModalOpen: false });
  },

  openCraftingModal: () => {
    audioSystem.playChime(900);
    set({
      isCraftingModalOpen: true,
      isDisassemblyModalOpen: false,
      isPauseModalOpen: false,
      isStorageModalOpen: false,
      isRenovationModalOpen: false,
      isSubstanceModalOpen: false,
    });
  },

  closeCraftingModal: () => {
    audioSystem.playChime(600);
    set({ isCraftingModalOpen: false });
  },

  openDisassemblyModal: () => {
    audioSystem.playChime(800);
    set({
      isDisassemblyModalOpen: true,
      isCraftingModalOpen: false,
      isPauseModalOpen: false,
      isStorageModalOpen: false,
      isRenovationModalOpen: false,
      isSubstanceModalOpen: false,
    });
  },

  closeDisassemblyModal: () => {
    audioSystem.playChime(600);
    set({ isDisassemblyModalOpen: false });
  },

  startCrafting: (
    recipeId: string,
    source: 'backpack' | 'vault',
    target: 'backpack' | 'vault'
  ) => {
    const state = get();
    if (state.activeCraftingJob) {
      return {
        success: false,
        message: `Fabrication bay busy processing ${state.activeCraftingJob.recipeName}. Cancel current job first.`,
      };
    }

    const recipe = CRAFTING_RECIPES.find((r) => r.id === recipeId);
    if (!recipe) {
      return { success: false, message: 'Invalid crafting blueprint.' };
    }

    // Verify source has all required ingredients
    for (const ing of recipe.inputs) {
      let have = 0;
      if (source === 'backpack') {
        have = state.inventory[ing.type]?.count ?? 0;
      } else {
        have = state.vaultStorage[ing.type] ?? 0;
      }
      if (have < ing.count) {
        const ingName = RESOURCE_DEFINITIONS[ing.type]?.name ?? ing.type;
        audioSystem.playAlarm();
        return {
          success: false,
          message: `Insufficient ${ingName} in ${source.toUpperCase()}. Have: ${have}x, Need: ${ing.count}x.`,
        };
      }
    }

    // Verify target can accept the output mass
    const outDef = RESOURCE_DEFINITIONS[recipe.output.type];
    const outMass = recipe.output.count * (outDef?.weightPerUnit ?? 1.0);
    if (target === 'backpack') {
      const curW = calculateBackpackWeight(state.inventory);
      if (curW + outMass > state.maxBackpackCapacity + 0.001) {
        audioSystem.playAlarm();
        return {
          success: false,
          message: `Backpack full! Cannot accept +${outMass.toFixed(1)} kg. Target Outpost Vault or free space.`,
        };
      }
    } else {
      const curW = calculateStorageWeight(state.vaultStorage);
      if (curW + outMass > state.maxVaultCapacity + 0.001) {
        audioSystem.playAlarm();
        return {
          success: false,
          message: `Vault full! Cannot accept +${outMass.toFixed(1)} kg output.`,
        };
      }
    }

    // Deduct ingredients from source storage
    const updatedInv = { ...state.inventory };
    const updatedVault = { ...state.vaultStorage };

    for (const ing of recipe.inputs) {
      if (source === 'backpack') {
        const it = updatedInv[ing.type];
        updatedInv[ing.type] = { ...it, count: it.count - ing.count };
      } else {
        updatedVault[ing.type] = (updatedVault[ing.type] ?? 0) - ing.count;
      }
    }

    const newBackpackWeight = calculateBackpackWeight(updatedInv);
    const newVaultWeight = calculateStorageWeight(updatedVault);

    const newJob: ActiveCraftingJob = {
      id: `job-${Date.now()}`,
      recipeId: recipe.id,
      recipeName: recipe.name,
      progressSeconds: 0,
      durationSeconds: recipe.durationSeconds,
      sourceStorage: source,
      targetStorage: target,
      inputs: recipe.inputs,
      output: recipe.output,
    };

    audioSystem.playChime(950);

    set({
      activeCraftingJob: newJob,
      inventory: updatedInv,
      vaultStorage: updatedVault,
      backpackWeight: newBackpackWeight,
      vaultStorageWeight: newVaultWeight,
      notification: `Fabrication bay online: Synthesizing ${recipe.name} (${recipe.durationSeconds}s)...`,
    });

    writeSaveState({
      inventory: updatedInv,
      roverStorage: state.roverStorage,
      vaultStorage: updatedVault,
      renovations: state.renovations,
      collectedNodeIds: state.collectedNodeIds,
      maxBackpackCapacity: state.maxBackpackCapacity,
      maxRoverCapacity: state.maxRoverCapacity,
      maxVaultCapacity: state.maxVaultCapacity,
    });

    return { success: true, message: `Synthesizing ${recipe.name}...` };
  },

  cancelCrafting: () => {
    const state = get();
    const job = state.activeCraftingJob;
    if (!job) {
      return { success: false, message: 'No active fabrication job to cancel.' };
    }

    // 100% material refund back to source storage
    const updatedInv = { ...state.inventory };
    const updatedVault = { ...state.vaultStorage };

    for (const ing of job.inputs) {
      if (job.sourceStorage === 'backpack') {
        const it = updatedInv[ing.type];
        updatedInv[ing.type] = { ...it, count: (it?.count ?? 0) + ing.count };
      } else {
        updatedVault[ing.type] = (updatedVault[ing.type] ?? 0) + ing.count;
      }
    }

    const newBackpackWeight = calculateBackpackWeight(updatedInv);
    const newVaultWeight = calculateStorageWeight(updatedVault);

    audioSystem.playChime(600);

    set({
      activeCraftingJob: null,
      inventory: updatedInv,
      vaultStorage: updatedVault,
      backpackWeight: newBackpackWeight,
      vaultStorageWeight: newVaultWeight,
      notification: `Job cancelled: All ingredients refunded to ${job.sourceStorage.toUpperCase()}.`,
    });

    writeSaveState({
      inventory: updatedInv,
      roverStorage: state.roverStorage,
      vaultStorage: updatedVault,
      renovations: state.renovations,
      collectedNodeIds: state.collectedNodeIds,
      maxBackpackCapacity: state.maxBackpackCapacity,
      maxRoverCapacity: state.maxRoverCapacity,
      maxVaultCapacity: state.maxVaultCapacity,
    });

    return { success: true, message: 'Fabrication job cancelled; materials refunded.' };
  },

  disassembleItem: (
    type: ResourceType,
    count: number,
    source: 'backpack' | 'vault',
    target: 'backpack' | 'vault'
  ) => {
    const state = get();
    if (count <= 0) return { success: false, message: 'Invalid quantity.' };

    const recipe = DISASSEMBLY_RECIPES[type];
    if (!recipe) {
      return { success: false, message: 'Selected item cannot be disassembled.' };
    }

    let available = 0;
    if (source === 'backpack') {
      available = state.inventory[type]?.count ?? 0;
    } else {
      available = state.vaultStorage[type] ?? 0;
    }

    if (available < count) {
      return {
        success: false,
        message: `Insufficient quantity in ${source.toUpperCase()}. Available: ${available}x, Requested: ${count}x.`,
      };
    }

    let totalRecoveredMass = 0;
    for (const out of recipe.outputs) {
      const outDef = RESOURCE_DEFINITIONS[out.type];
      totalRecoveredMass += out.count * count * (outDef?.weightPerUnit ?? 1.0);
    }

    const updatedInv = { ...state.inventory };
    const updatedVault = { ...state.vaultStorage };

    if (source === 'backpack') {
      const it = updatedInv[type];
      updatedInv[type] = { ...it, count: it.count - count };
    } else {
      updatedVault[type] = (updatedVault[type] ?? 0) - count;
    }

    if (target === 'backpack') {
      const currentW = calculateBackpackWeight(updatedInv);
      if (currentW + totalRecoveredMass > state.maxBackpackCapacity + 0.001) {
        audioSystem.playAlarm();
        return {
          success: false,
          message: `Backpack payload full! Space required: +${totalRecoveredMass.toFixed(1)} kg. Target Outpost Vault.`,
        };
      }
    } else {
      const currentW = calculateStorageWeight(updatedVault);
      if (currentW + totalRecoveredMass > state.maxVaultCapacity + 0.001) {
        audioSystem.playAlarm();
        return {
          success: false,
          message: `Vault capacity full! Space required: +${totalRecoveredMass.toFixed(1)} kg.`,
        };
      }
    }

    for (const out of recipe.outputs) {
      const addedQty = out.count * count;
      if (target === 'backpack') {
        const it = updatedInv[out.type];
        updatedInv[out.type] = { ...it, count: (it?.count ?? 0) + addedQty };
      } else {
        updatedVault[out.type] = (updatedVault[out.type] ?? 0) + addedQty;
      }
    }

    const newBackpackWeight = calculateBackpackWeight(updatedInv);
    const newVaultWeight = calculateStorageWeight(updatedVault);

    audioSystem.playDrillHarvest();

    set({
      inventory: updatedInv,
      vaultStorage: updatedVault,
      backpackWeight: newBackpackWeight,
      vaultStorageWeight: newVaultWeight,
      notification: `Disassembled ${count}x ${recipe.name}. Recovered materials deposited into ${target.toUpperCase()}.`,
    });

    writeSaveState({
      inventory: updatedInv,
      roverStorage: state.roverStorage,
      vaultStorage: updatedVault,
      renovations: state.renovations,
      collectedNodeIds: state.collectedNodeIds,
      maxBackpackCapacity: state.maxBackpackCapacity,
      maxRoverCapacity: state.maxRoverCapacity,
      maxVaultCapacity: state.maxVaultCapacity,
    });

    return {
      success: true,
      message: `Disassembled ${count}x ${recipe.name} successfully.`,
    };
  },

  applyRepairKit: () => {
    const state = get();
    let source: 'backpack' | 'vault' | null = null;
    if ((state.inventory.repair_kit?.count ?? 0) > 0) source = 'backpack';
    else if ((state.vaultStorage.repair_kit ?? 0) > 0) source = 'vault';

    if (!source) {
      return { success: false, message: 'No Multi-System Repair Kit available in inventory or vault.' };
    }

    const updatedInv = { ...state.inventory };
    const updatedVault = { ...state.vaultStorage };

    if (source === 'backpack') {
      const it = updatedInv.repair_kit;
      updatedInv.repair_kit = { ...it, count: it.count - 1 };
    } else {
      updatedVault.repair_kit -= 1;
    }

    audioSystem.playChime(1100);

    set({
      inventory: updatedInv,
      vaultStorage: updatedVault,
      backpackWeight: calculateBackpackWeight(updatedInv),
      vaultStorageWeight: calculateStorageWeight(updatedVault),
      vitals: {
        ...state.vitals,
        suitIntegrity: 100,
        health: Math.min(100, state.vitals.health + 30),
      },
      notification: 'Repair Kit applied: Suit seals reinforced to 100% integrity (+30 Health).',
    });

    writeSaveState({
      inventory: updatedInv,
      roverStorage: state.roverStorage,
      vaultStorage: updatedVault,
      renovations: state.renovations,
      collectedNodeIds: state.collectedNodeIds,
      maxBackpackCapacity: state.maxBackpackCapacity,
      maxRoverCapacity: state.maxRoverCapacity,
      maxVaultCapacity: state.maxVaultCapacity,
    });

    return { success: true, message: 'Repair Kit deployed: 100% suit integrity restored.' };
  },

  installBatteryPack: () => {
    const state = get();
    let source: 'backpack' | 'vault' | null = null;
    if ((state.inventory.battery_pack?.count ?? 0) > 0) source = 'backpack';
    else if ((state.vaultStorage.battery_pack ?? 0) > 0) source = 'vault';

    if (!source) {
      return { success: false, message: 'No Auxiliary Battery Pack available.' };
    }

    const updatedInv = { ...state.inventory };
    const updatedVault = { ...state.vaultStorage };

    if (source === 'backpack') {
      const it = updatedInv.battery_pack;
      updatedInv.battery_pack = { ...it, count: it.count - 1 };
    } else {
      updatedVault.battery_pack -= 1;
    }

    const curBatt = state.roverTelemetry.batteryPercent;
    const newBatt = Math.min(100, curBatt + 45);

    audioSystem.playChime(1200);

    set({
      inventory: updatedInv,
      vaultStorage: updatedVault,
      backpackWeight: calculateBackpackWeight(updatedInv),
      vaultStorageWeight: calculateStorageWeight(updatedVault),
      roverTelemetry: {
        ...state.roverTelemetry,
        batteryPercent: newBatt,
      },
      notification: `Auxiliary Battery Pack mounted: Rover power boosted to ${newBatt.toFixed(0)}%.`,
    });

    writeSaveState({
      inventory: updatedInv,
      roverStorage: state.roverStorage,
      vaultStorage: updatedVault,
      renovations: state.renovations,
      collectedNodeIds: state.collectedNodeIds,
      maxBackpackCapacity: state.maxBackpackCapacity,
      maxRoverCapacity: state.maxRoverCapacity,
      maxVaultCapacity: state.maxVaultCapacity,
    });

    return { success: true, message: `Rover battery replenished to ${newBatt.toFixed(0)}%.` };
  },

  transferItem: (
    source: StorageContainerType,
    target: StorageContainerType,
    type: ResourceType,
    count: number
  ) => {
    if (source === target || count <= 0) {
      return { success: false, message: 'Invalid transfer destination or amount.' };
    }
    const state = get();
    const unitWeight = RESOURCE_DEFINITIONS[type]?.weightPerUnit ?? 1.0;
    const itemName = RESOURCE_DEFINITIONS[type]?.name ?? type;

    // 1. Verify Source Item Availability
    let sourceAvailable = 0;
    if (source === 'backpack') {
      sourceAvailable = state.inventory[type]?.count ?? 0;
    } else if (source === 'rover') {
      sourceAvailable = state.roverStorage[type] ?? 0;
    } else if (source === 'vault') {
      sourceAvailable = state.vaultStorage[type] ?? 0;
    }

    if (sourceAvailable < count) {
      return {
        success: false,
        message: `Insufficient quantity in ${source.toUpperCase()}. Available: ${sourceAvailable}x, requested: ${count}x.`,
      };
    }

    // 2. Verify Target Capacity
    const weightToAdd = count * unitWeight;
    let targetCurrentWeight = 0;
    let targetMaxCapacity = 0;

    if (target === 'backpack') {
      targetCurrentWeight = calculateBackpackWeight(state.inventory);
      targetMaxCapacity = state.maxBackpackCapacity;
    } else if (target === 'rover') {
      targetCurrentWeight = calculateStorageWeight(state.roverStorage);
      targetMaxCapacity = state.maxRoverCapacity;
    } else if (target === 'vault') {
      targetCurrentWeight = calculateStorageWeight(state.vaultStorage);
      targetMaxCapacity = state.maxVaultCapacity;
    }

    if (targetCurrentWeight + weightToAdd > targetMaxCapacity + 0.001) {
      const spaceLeft = Math.max(0, targetMaxCapacity - targetCurrentWeight);
      const maxCanFit = Math.floor(spaceLeft / unitWeight);
      audioSystem.playAlarm();
      return {
        success: false,
        message: `${target.toUpperCase()} CAPACITY REACHED! +${weightToAdd.toFixed(1)} kg exceeds max payload. Free space: ${spaceLeft.toFixed(1)} kg (holds ${maxCanFit}x).`,
      };
    }

    // 3. Perform Atomic State Transfer (Zero Duplication, Zero Item Loss)
    const newInventory = { ...state.inventory };
    const newRover = { ...state.roverStorage };
    const newVault = { ...state.vaultStorage };

    // Deduct from Source
    if (source === 'backpack') {
      const it = newInventory[type];
      newInventory[type] = { ...it, count: it.count - count };
    } else if (source === 'rover') {
      newRover[type] = (newRover[type] ?? 0) - count;
    } else if (source === 'vault') {
      newVault[type] = (newVault[type] ?? 0) - count;
    }

    // Add to Target
    if (target === 'backpack') {
      const it = newInventory[type];
      newInventory[type] = { ...it, count: (it?.count ?? 0) + count };
    } else if (target === 'rover') {
      newRover[type] = (newRover[type] ?? 0) + count;
    } else if (target === 'vault') {
      newVault[type] = (newVault[type] ?? 0) + count;
    }

    const newBackpackWeight = calculateBackpackWeight(newInventory);
    const newRoverWeight = calculateStorageWeight(newRover);
    const newVaultWeight = calculateStorageWeight(newVault);

    audioSystem.playChime(950);

    set({
      inventory: newInventory,
      roverStorage: newRover,
      vaultStorage: newVault,
      backpackWeight: newBackpackWeight,
      roverStorageWeight: newRoverWeight,
      vaultStorageWeight: newVaultWeight,
      notification: `Transferred ${count}x ${itemName} (${weightToAdd.toFixed(1)} kg) from ${source.toUpperCase()} to ${target.toUpperCase()}.`,
    });

    writeSaveState({
      inventory: newInventory,
      roverStorage: newRover,
      vaultStorage: newVault,
      renovations: state.renovations,
      collectedNodeIds: state.collectedNodeIds,
      maxBackpackCapacity: state.maxBackpackCapacity,
      maxRoverCapacity: state.maxRoverCapacity,
      maxVaultCapacity: state.maxVaultCapacity,
    });

    return {
      success: true,
      message: `Transferred ${count}x ${itemName} to ${target.toUpperCase()}.`,
    };
  },

  transferAll: (source: StorageContainerType, target: StorageContainerType) => {
    const state = get();
    if (source === target) return;

    const sourceItems: Array<{ type: ResourceType; count: number }> = [];
    if (source === 'backpack') {
      for (const key of Object.keys(state.inventory) as ResourceType[]) {
        const c = state.inventory[key]?.count ?? 0;
        if (c > 0) sourceItems.push({ type: key, count: c });
      }
    } else if (source === 'rover') {
      for (const key of Object.keys(state.roverStorage) as ResourceType[]) {
        const c = state.roverStorage[key] ?? 0;
        if (c > 0) sourceItems.push({ type: key, count: c });
      }
    } else if (source === 'vault') {
      for (const key of Object.keys(state.vaultStorage) as ResourceType[]) {
        const c = state.vaultStorage[key] ?? 0;
        if (c > 0) sourceItems.push({ type: key, count: c });
      }
    }

    if (sourceItems.length === 0) {
      state.showNotification(`${source.toUpperCase()} has no items to transfer.`);
      return;
    }

    let totalMoved = 0;
    for (const item of sourceItems) {
      const unitWeight = RESOURCE_DEFINITIONS[item.type]?.weightPerUnit ?? 1.0;
      let targetCurrentWeight = 0;
      let targetMaxCapacity = 0;

      if (target === 'backpack') {
        targetCurrentWeight = calculateBackpackWeight(get().inventory);
        targetMaxCapacity = get().maxBackpackCapacity;
      } else if (target === 'rover') {
        targetCurrentWeight = calculateStorageWeight(get().roverStorage);
        targetMaxCapacity = get().maxRoverCapacity;
      } else if (target === 'vault') {
        targetCurrentWeight = calculateStorageWeight(get().vaultStorage);
        targetMaxCapacity = get().maxVaultCapacity;
      }

      const spaceLeft = Math.max(0, targetMaxCapacity - targetCurrentWeight);
      const countCanFit = Math.min(item.count, Math.floor(spaceLeft / unitWeight));

      if (countCanFit > 0) {
        const res = get().transferItem(source, target, item.type, countCanFit);
        if (res.success) totalMoved += countCanFit;
      }
    }

    if (totalMoved === 0) {
      audioSystem.playAlarm();
      state.showNotification(`Cannot transfer items: ${target.toUpperCase()} payload capacity is full.`);
    } else {
      audioSystem.playChime(1100);
    }
  },

  dropItem: (type: ResourceType, count: number) => {
    const state = get();
    const item = state.inventory[type];
    if (!item || item.count < count || count <= 0) return;

    const newInventory = {
      ...state.inventory,
      [type]: {
        ...item,
        count: item.count - count,
      },
    };

    const newWeight = calculateBackpackWeight(newInventory);
    const weightRelieved = (count * item.weightPerUnit).toFixed(1);
    audioSystem.playChime(500);

    set({
      inventory: newInventory,
      backpackWeight: newWeight,
      notification: `Jettisoned ${count}x ${item.name} (-${weightRelieved} kg).`,
    });

    writeSaveState({
      inventory: newInventory,
      roverStorage: state.roverStorage,
      vaultStorage: state.vaultStorage,
      renovations: state.renovations,
      collectedNodeIds: state.collectedNodeIds,
      maxBackpackCapacity: state.maxBackpackCapacity,
      maxRoverCapacity: state.maxRoverCapacity,
      maxVaultCapacity: state.maxVaultCapacity,
    });
  },

  useConsumable: (type: ResourceType) => {
    const state = get();
    if (type === 'repair_kit') {
      get().applyRepairKit();
      return;
    }
    if (type === 'battery_pack') {
      get().installBatteryPack();
      return;
    }

    const item = state.inventory[type];
    if (!item || item.count <= 0) {
      state.showNotification('None available in inventory.');
      return;
    }

    const def = RESOURCE_DEFINITIONS[type];
    if (!def || def.category !== 'consumable' || !def.consumableEffect) {
      state.showNotification(`${item.name} is not consumable.`);
      return;
    }

    const fx = def.consumableEffect;
    let newHealth = state.vitals.health;
    let newTemp = state.vitals.coreTemp;
    let newSuit = state.vitals.suitIntegrity;
    let newOxygen = state.vitals.oxygen;
    let newPower = state.vitals.power;
    let newFood = state.vitals.food;
    let newWater = state.vitals.water;

    if (fx.health) newHealth = Math.min(100, newHealth + fx.health);
    if (fx.coreTemp) newTemp = Math.min(37.5, Math.max(36.5, newTemp + (newTemp < 37.0 ? fx.coreTemp : -0.2)));
    if (fx.suitIntegrity) newSuit = Math.min(100, newSuit + fx.suitIntegrity);
    if (fx.oxygen) newOxygen = Math.min(100, newOxygen + fx.oxygen);
    if (fx.power) newPower = Math.min(100, newPower + fx.power);
    if (fx.food) newFood = Math.min(100, newFood + fx.food);
    if (fx.water) newWater = Math.min(100, newWater + fx.water);

    const newInventory = {
      ...state.inventory,
      [type]: {
        ...item,
        count: item.count - 1,
      },
    };

    const newWeight = calculateBackpackWeight(newInventory);
    audioSystem.playChime(1100);

    const updatedVitals = {
      ...state.vitals,
      health: newHealth,
      coreTemp: newTemp,
      suitIntegrity: newSuit,
      oxygen: newOxygen,
      power: newPower,
      food: newFood,
      water: newWater,
    };

    set({
      vitals: updatedVitals,
      inventory: newInventory,
      backpackWeight: newWeight,
      notification: `Administered ${item.name}: Health +${fx.health || 0} • Food +${fx.food || 0} • Water +${fx.water || 0}.`,
    });

    writeSaveState({
      inventory: newInventory,
      roverStorage: state.roverStorage,
      vaultStorage: state.vaultStorage,
      renovations: state.renovations,
      facilityRenovations: state.facilityRenovations,
      collectedNodeIds: state.collectedNodeIds,
      maxBackpackCapacity: state.maxBackpackCapacity,
      maxRoverCapacity: state.maxRoverCapacity,
      maxVaultCapacity: state.maxVaultCapacity,
      vitals: updatedVitals,
      solCycle: state.solCycle,
      powerGrid: state.powerGrid,
      greenhouseCrop: state.greenhouseCrop,
    });
  },

  depositToStorage: (type: ResourceType, count: number) => {
    get().transferItem('backpack', 'vault', type, count);
  },

  depositAllToStorage: () => {
    get().transferAll('backpack', 'vault');
  },

  withdrawFromStorage: (type: ResourceType, count: number) => {
    get().transferItem('vault', 'backpack', type, count);
  },

  upgradeFacility: (facilityId: FacilityId) => {
    const state = get();
    const currentLvl = state.facilityRenovations[facilityId] || 0;
    if (currentLvl >= 3) {
      return { success: false, message: 'Facility has reached maximum Advanced specification (Level 3).' };
    }

    const nextLvl = (currentLvl + 1) as RenovationLevel;
    const facilityDef = FACILITIES_DATABASE[facilityId];
    if (!facilityDef) {
      return { success: false, message: 'Invalid facility specification.' };
    }
    const stage = facilityDef.stages[nextLvl];

    // Verify costs against vaultStorage and inventory
    const missing: string[] = [];
    for (const costItem of stage.cost) {
      const inVault = state.vaultStorage[costItem.type] || 0;
      const inBackpack = state.inventory[costItem.type]?.count || 0;
      const totalHave = inVault + inBackpack;
      if (totalHave < costItem.count) {
        const itemInfo = state.inventory[costItem.type] || RESOURCE_DEFINITIONS[costItem.type];
        const itemName = itemInfo?.name || costItem.type;
        missing.push(`${costItem.count - totalHave}x ${itemName}`);
      }
    }

    if (missing.length > 0) {
      audioSystem.playAlarm();
      return {
        success: false,
        message: `Insufficient materials! Missing: ${missing.join(', ')}. Store materials in Vault or Backpack.`,
      };
    }

    // Deduct materials from vaultStorage first, remainder from inventory
    const updatedVault = { ...state.vaultStorage };
    const updatedInv = { ...state.inventory };

    for (const costItem of stage.cost) {
      let needed = costItem.count;
      const inVault = updatedVault[costItem.type] || 0;
      if (inVault >= needed) {
        updatedVault[costItem.type] = inVault - needed;
        needed = 0;
      } else {
        updatedVault[costItem.type] = 0;
        needed -= inVault;
        const inBackpack = updatedInv[costItem.type]?.count || 0;
        updatedInv[costItem.type] = {
          ...updatedInv[costItem.type],
          count: inBackpack - needed,
        };
      }
    }

    const updatedFacilities: FacilityRenovations = {
      ...state.facilityRenovations,
      [facilityId]: nextLvl,
    };

    const updatedLegacyRenovations: RenovationStatus = {
      power_room: updatedFacilities.engineering_workshop >= 1,
      storage_room: updatedFacilities.engineering_workshop >= 2,
      greenhouse: updatedFacilities.greenhouse >= 1,
      comm_room: updatedFacilities.comm_room >= 1,
      hab_expansion: updatedFacilities.living_quarters >= 1 || updatedFacilities.greenhouse >= 1,
    };

    let newMaxCapacity = state.maxBackpackCapacity;
    if (updatedFacilities.living_quarters >= 1 || updatedFacilities.engineering_workshop >= 2) {
      newMaxCapacity = BACKPACK_EXPANDED_CAPACITY;
    }

    let newMaxRover = state.maxRoverCapacity;
    if (updatedFacilities.rover_garage >= 3) {
      newMaxRover = 150.0;
    }

    const newVaultWeight = calculateStorageWeight(updatedVault);
    const newBackpackWeight = calculateBackpackWeight(updatedInv);
    audioSystem.playFacilityUpgradeFanfare();

    set({
      facilityRenovations: updatedFacilities,
      renovations: updatedLegacyRenovations,
      vaultStorage: updatedVault,
      vaultStorageWeight: newVaultWeight,
      inventory: updatedInv,
      backpackWeight: newBackpackWeight,
      maxBackpackCapacity: newMaxCapacity,
      maxRoverCapacity: newMaxRover,
      notification: `FACILITY RESTORED: ${facilityDef.name} upgraded to Level ${nextLvl} [${LEVEL_NAMES[nextLvl]}]!`,
    });

    get().updateObjectiveProgress('repair_facility', facilityId, nextLvl);

    writeSaveState({
      inventory: updatedInv,
      vaultStorage: updatedVault,
      roverStorage: state.roverStorage,
      renovations: updatedLegacyRenovations,
      facilityRenovations: updatedFacilities,
      collectedNodeIds: state.collectedNodeIds,
      maxBackpackCapacity: newMaxCapacity,
      maxRoverCapacity: newMaxRover,
      maxVaultCapacity: state.maxVaultCapacity,
      craftingHistory: state.craftingHistory,
    });

    return {
      success: true,
      message: `Successfully upgraded ${facilityDef.name} to Level ${nextLvl} (${LEVEL_NAMES[nextLvl]})!`,
    };
  },

  purchaseRenovation: (upgradeId: UpgradeId) => {
    const map: Record<UpgradeId, FacilityId> = {
      power_room: 'engineering_workshop',
      storage_room: 'engineering_workshop',
      greenhouse: 'greenhouse',
      comm_room: 'comm_room',
      hab_expansion: 'living_quarters',
    };
    const targetFacility = map[upgradeId] || 'engineering_workshop';
    return get().upgradeFacility(targetFacility);
  },

  restInLivingQuarters: () => {
    const state = get();
    const lvl = state.facilityRenovations.living_quarters;
    if (lvl < 1) {
      return {
        success: false,
        message: 'Living Quarters must be repaired to Level 1 before bunks can be used.',
      };
    }

    // Advance time by 4 Martian hours
    const newTime = (state.solCycle.timeOfDay + 4.0) % 24.65;
    const solIncrement = state.solCycle.timeOfDay + 4.0 >= 24.65 ? 1 : 0;
    const newSolNumber = state.solCycle.solNumber + solIncrement;

    // Restore vitals based on level
    const vitals = { ...state.vitals };
    vitals.coreTemp = 37.0;
    vitals.power = 100.0;
    vitals.oxygen = 100.0;
    if (lvl >= 2) {
      vitals.health = 100.0;
      vitals.suitIntegrity = Math.min(100.0, vitals.suitIntegrity + 30.0);
    }
    if (lvl >= 3) {
      vitals.radiationDose = 0.0;
    }

    audioSystem.playChime(950);
    set({
      solCycle: {
        ...state.solCycle,
        solNumber: newSolNumber,
        timeOfDay: newTime,
      },
      vitals,
      notification: `REST CYCLE COMPLETE: Rested 4 hours in Living Quarters. Vitals restored${lvl >= 3 ? ' & radiation cleansed' : ''}.`,
    });

    return { success: true, message: 'Rest cycle complete.' };
  },

  harvestGreenhouseCrop: () => {
    const state = get();
    const lvl = state.facilityRenovations.greenhouse;
    if (lvl < 1) {
      return {
        success: false,
        message: 'Greenhouse aeroponics must be repaired to Level 1 or higher to cultivate crops.',
      };
    }
    if (state.greenhouseCrop.stage !== 'ready' && lvl < 2) {
      return {
        success: false,
        message: `Crop is not ready yet (${state.greenhouseCrop.progressPercent}% grown). Requires further incubation.`,
      };
    }

    const yieldCount = lvl >= 3 ? 3 : lvl >= 2 ? 2 : 1;
    const updatedVault = { ...state.vaultStorage };
    updatedVault['food_ration'] = (updatedVault['food_ration'] || 0) + yieldCount;
    const newVaultWeight = calculateStorageWeight(updatedVault);

    audioSystem.playChime(1100);
    set({
      vaultStorage: updatedVault,
      vaultStorageWeight: newVaultWeight,
      greenhouseCrop: {
        stage: 'empty',
        progressPercent: 0,
        waterSpent: 0,
        growthTimeRemaining: 120,
      },
      notification: `HARVEST SUCCESSFUL: +${yieldCount} fresh Martian potato rations stored in Outpost Vault.`,
    });

    get().updateObjectiveProgress('harvest_crop', 'greenhouse_crop', yieldCount);

    writeSaveState({
      inventory: state.inventory,
      vaultStorage: updatedVault,
      roverStorage: state.roverStorage,
      renovations: state.renovations,
      facilityRenovations: state.facilityRenovations,
      collectedNodeIds: state.collectedNodeIds,
      maxBackpackCapacity: state.maxBackpackCapacity,
      maxRoverCapacity: state.maxRoverCapacity,
      maxVaultCapacity: state.maxVaultCapacity,
      craftingHistory: state.craftingHistory,
      vitals: state.vitals,
      solCycle: state.solCycle,
      powerGrid: state.powerGrid,
      greenhouseCrop: {
        stage: 'empty',
        progressPercent: 0,
        waterSpent: 0,
        growthTimeRemaining: 120,
      },
    });

    return { success: true, message: `Harvested ${yieldCount}x Food Rations!` };
  },

  plantGreenhouseCrop: () => {
    const state = get();
    if (state.facilityRenovations.greenhouse < 1) {
      return { success: false, message: 'Greenhouse must be repaired to Level 1 to plant crops.' };
    }
    if (state.greenhouseCrop.stage !== 'empty') {
      return { success: false, message: 'Aeroponic bay already occupied by a growing or harvestable crop.' };
    }

    const waterInBackpack = (state.inventory['water']?.count || 0) >= 1;
    const waterInVault = (state.vaultStorage['water'] || 0) >= 1;

    if (!waterInBackpack && !waterInVault) {
      return { success: false, message: 'Requires 1x Water unit to prime aeroponic nutrient solution.' };
    }

    if (waterInBackpack) {
      const it = state.inventory['water'];
      const newInv = { ...state.inventory, water: { ...it, count: it.count - 1 } };
      set({
        inventory: newInv,
        backpackWeight: calculateBackpackWeight(newInv),
      });
    } else {
      const newVault = { ...state.vaultStorage, water: state.vaultStorage['water'] - 1 };
      set({
        vaultStorage: newVault,
        vaultStorageWeight: calculateStorageWeight(newVault),
      });
    }

    audioSystem.playChime(1100);
    const newCrop: GreenhouseCropState = {
      stage: 'growing',
      progressPercent: 5,
      waterSpent: 1,
      growthTimeRemaining: 120,
    };

    set({
      greenhouseCrop: newCrop,
      notification: 'PLANTED: Seeded Martian potato sprouts into aeroponic misters with nutrient water.',
    });

    return { success: true, message: 'Martian potato crop seeded.' };
  },

  waterGreenhouseCrop: () => {
    const state = get();
    if (state.greenhouseCrop.stage !== 'growing') {
      return { success: false, message: 'No actively growing crop to irrigate.' };
    }
    const waterInBackpack = (state.inventory['water']?.count || 0) >= 1;
    const waterInVault = (state.vaultStorage['water'] || 0) >= 1;
    if (!waterInBackpack && !waterInVault) {
      return { success: false, message: 'Requires 1x Water unit to accelerate growth cycle.' };
    }

    if (waterInBackpack) {
      const it = state.inventory['water'];
      const newInv = { ...state.inventory, water: { ...it, count: it.count - 1 } };
      set({
        inventory: newInv,
        backpackWeight: calculateBackpackWeight(newInv),
      });
    } else {
      const newVault = { ...state.vaultStorage, water: state.vaultStorage['water'] - 1 };
      set({
        vaultStorage: newVault,
        vaultStorageWeight: calculateStorageWeight(newVault),
      });
    }

    const newTime = Math.max(0, state.greenhouseCrop.growthTimeRemaining - 45);
    const newProg = Math.min(100, Math.round(100 - (newTime / 120) * 100));
    audioSystem.playChime(1250);

    const newCrop: GreenhouseCropState = {
      ...state.greenhouseCrop,
      waterSpent: state.greenhouseCrop.waterSpent + 1,
      growthTimeRemaining: newTime,
      progressPercent: newProg,
      stage: newTime <= 0 ? 'ready' : 'growing',
    };

    set({
      greenhouseCrop: newCrop,
      notification: 'IRRIGATED: Added extra hydration. Maturation accelerated by 45s!',
    });

    return { success: true, message: 'Crop irrigated.' };
  },

  consumeFood: () => {
    const state = get();
    const item = state.inventory['food_ration'];
    if (!item || item.count <= 0) {
      return { success: false, message: 'No food rations in backpack.' };
    }
    const newInv = {
      ...state.inventory,
      food_ration: { ...item, count: item.count - 1 },
    };
    const newFood = Math.min(100, state.vitals.food + 45);
    const newHealth = Math.min(100, state.vitals.health + 15);
    const newBackpackWeight = calculateBackpackWeight(newInv);
    audioSystem.playChime(1100);
    set({
      inventory: newInv,
      backpackWeight: newBackpackWeight,
      vitals: { ...state.vitals, food: newFood, health: newHealth },
      notification: 'Consumed 1x Food Ration (+45 Food, +15 Biomedical).',
    });
    return { success: true, message: 'Consumed Food Ration.' };
  },

  consumeWater: () => {
    const state = get();
    const item = state.inventory['water'];
    if (!item || item.count <= 0) {
      return { success: false, message: 'No purified water in backpack.' };
    }
    const newInv = {
      ...state.inventory,
      water: { ...item, count: item.count - 1 },
    };
    const newWater = Math.min(100, state.vitals.water + 50);
    const newHealth = Math.min(100, state.vitals.health + 5);
    const newBackpackWeight = calculateBackpackWeight(newInv);
    audioSystem.playChime(1200);
    set({
      inventory: newInv,
      backpackWeight: newBackpackWeight,
      vitals: { ...state.vitals, water: newWater, health: newHealth },
      notification: 'Consumed 1x Water Pouch (+50 Hydration).',
    });
    return { success: true, message: 'Consumed Water.' };
  },

  refillSuitOxygen: () => {
    audioSystem.playAirlockCycle();
    set((state) => ({
      vitals: { ...state.vitals, oxygen: 100 },
      notification: 'SUIT OXYGEN RECHARGED: Primary & auxiliary EVA tanks replenished to 100%.',
    }));
    return { success: true, message: 'Oxygen tanks refilled.' };
  },

  toggleFacilityCircuit: (circuit: keyof BasePowerGrid['facilityCircuits']) => {
    const state = get();
    const current = state.powerGrid.facilityCircuits[circuit];
    const updatedCircuits = {
      ...state.powerGrid.facilityCircuits,
      [circuit]: !current,
    };
    audioSystem.playChime(!current ? 1000 : 500);
    set({
      powerGrid: {
        ...state.powerGrid,
        facilityCircuits: updatedCircuits,
      },
      notification: `Power Breaker [${circuit.toUpperCase()}]: ${!current ? 'ENERGIZED' : 'SHED / OFFLINE'}`,
    });
  },

  applyGarageMaintenance: () => {
    const state = get();
    const lvl = state.facilityRenovations.rover_garage;
    if (lvl < 1) {
      return {
        success: false,
        message: 'Rover Garage must be repaired to Level 1 to access vehicle service hookups.',
      };
    }

    let rechargeAmount = 30;
    if (lvl >= 2) rechargeAmount = 60;
    if (lvl >= 3) rechargeAmount = 100;

    const currentBat = state.roverTelemetry.batteryPercent;
    const newBat = Math.min(100, currentBat + rechargeAmount);

    audioSystem.playChime(1050);
    set({
      roverTelemetry: {
        ...state.roverTelemetry,
        batteryPercent: newBat,
      },
      notification: `GARAGE SERVICE: Rover battery charged to ${newBat.toFixed(0)}%${lvl >= 3 ? ' and chassis serviced' : ''}.`,
    });

    return { success: true, message: `Rover serviced: Battery charged to ${newBat.toFixed(0)}%.` };
  },

  startMission: (missionId: string) => {
    const state = get();
    const mission = state.missions[missionId];
    if (!mission) return { success: false, message: 'Mission identifier not found in registry.' };
    if (state.completedMissionIds.includes(missionId)) {
      return { success: false, message: 'Mission has already been accomplished.' };
    }
    if (mission.state === 'locked') {
      const prereqs = mission.prerequisiteMissionIds?.join(', ') || 'requirements';
      return { success: false, message: `Mission locked. Requires: ${prereqs}.` };
    }

    const updatedMissions = {
      ...state.missions,
      [missionId]: { ...mission, state: 'active' as const },
    };

    const locObj = mission.objectives.find((o) => (o.type === 'visit_location' || o.type === 'scan_target') && o.targetKey);
    let nav = state.navTarget;
    if (locObj?.targetKey) {
      const lm = state.landmarks.find((l) => l.id === locObj.targetKey);
      if (lm) {
        nav = { x: lm.coordinates[0], z: lm.coordinates[2], name: lm.name };
      }
    }

    audioSystem.playChime(1100);
    set({
      missions: updatedMissions,
      activeMissionId: missionId,
      navTarget: nav,
      notification: `MISSION ACTIVATED: [${mission.title}]. Directives logged to Visor HUD.`,
    });

    writeSaveState({
      missions: updatedMissions,
      activeMissionId: missionId,
    });

    return { success: true, message: `Activated mission: ${mission.title}` };
  },

  trackMission: (missionId: string) => {
    const state = get();
    const mission = state.missions[missionId];
    if (!mission) return;

    const locObj = mission.objectives.find((o) => (o.type === 'visit_location' || o.type === 'scan_target') && o.targetKey);
    let nav = null;
    if (locObj?.targetKey) {
      const lm = state.landmarks.find((l) => l.id === locObj.targetKey);
      if (lm) {
        nav = { x: lm.coordinates[0], z: lm.coordinates[2], name: lm.name };
      }
    }

    set({ activeMissionId: missionId, navTarget: nav });
    state.showNotification(`TRACKING MISSION: ${mission.title}`);
  },

  claimMissionReward: (missionId: string) => {
    const state = get();
    const mission = state.missions[missionId];
    if (!mission) return { success: false, message: 'Mission not found.' };
    if (state.completedMissionIds.includes(missionId)) {
      return { success: false, message: 'Mission reward has already been claimed.' };
    }

    const allObjectivesComplete = mission.objectives.every((o) => o.currentValue >= o.targetValue);
    if (!allObjectivesComplete) {
      return { success: false, message: 'Incomplete mission objectives. Cannot claim reward.' };
    }

    let newInv = { ...state.inventory };
    let newVault = { ...state.vaultStorage };
    const pointsAwarded = mission.rewards.researchPoints || 0;

    if (mission.rewards.resources) {
      for (const res of mission.rewards.resources) {
        const resType = res.type as ResourceType;
        const itemDef = RESOURCE_DEFINITIONS[resType];
        const addedMass = res.count * (itemDef?.weightPerUnit ?? 1.0);
        const curBackpackWeight = calculateBackpackWeight(newInv);

        if (curBackpackWeight + addedMass > state.maxBackpackCapacity + 0.001) {
          newVault[resType] = (newVault[resType] ?? 0) + res.count;
          state.showNotification(`REWARD DIVERTED: +${res.count}x ${resType} routed to Outpost Vault.`);
        } else {
          const it = newInv[resType];
          newInv[resType] = { ...it, count: (it?.count ?? 0) + res.count };
        }
      }
    }

    const newCompletedIds = [...state.completedMissionIds, missionId];
    const newPoints = state.researchDataPoints + pointsAwarded;

    const updatedMissions = { ...state.missions };
    updatedMissions[missionId] = { ...mission, state: 'completed' as const };

    for (const [mid, m] of Object.entries(updatedMissions)) {
      if (m.state === 'locked' && m.prerequisiteMissionIds) {
        const met = m.prerequisiteMissionIds.every((req) => newCompletedIds.includes(req));
        if (met) {
          updatedMissions[mid] = { ...m, state: 'available' as const };
        }
      }
    }

    const nextActive = Object.values(updatedMissions).find((m) => m.state === 'active' && m.id !== missionId)?.id || null;

    audioSystem.playMissionComplete();
    set({
      inventory: newInv,
      vaultStorage: newVault,
      backpackWeight: calculateBackpackWeight(newInv),
      vaultStorageWeight: calculateStorageWeight(newVault),
      completedMissionIds: newCompletedIds,
      researchDataPoints: newPoints,
      missions: updatedMissions,
      activeMissionId: nextActive,
      notification: `MISSION COMPLETE: [${mission.title}]! Awarded +${pointsAwarded} Research Points.`,
    });

    writeSaveState({
      inventory: newInv,
      vaultStorage: newVault,
      completedMissionIds: newCompletedIds,
      researchDataPoints: newPoints,
      missions: updatedMissions,
      activeMissionId: nextActive,
    });

    // Story Campaign Progression Triggers (Phase 11)
    if (missionId === 'mis_restore_comms') {
      get().unlockJournalEntry('journal_transmission_houston_01');
      get().triggerDialogue('dia_ch2_comms_online');
      if (state.campaignChapter <= 2) get().advanceChapter(3);
    } else if (missionId === 'mis_forgotten_rover') {
      get().triggerDialogue('dia_ch3_rover_ready');
    } else if (missionId === 'mis_unidentified_signal' || missionId === 'mis_subterranean_frontier') {
      get().unlockJournalEntry('journal_audio_vance_02');
      get().unlockJournalEntry('journal_discovery_subterranean_ice');
      get().triggerDialogue('dia_ch4_signal_ping');
      if (state.campaignChapter <= 4) get().advanceChapter(5);
    } else if (missionId === 'mis_expand_greenhouse') {
      get().triggerDialogue('dia_ch5_first_harvest');
      if (state.campaignChapter <= 5) get().advanceChapter(6);
    } else if (missionId === 'mis_deep_core_samples') {
      get().unlockJournalEntry('journal_discovery_delta_clay');
    }

    return { success: true, message: `Reward claimed! +${pointsAwarded} Research Points.` };
  },

  setNavTarget: (target: { x: number; z: number; name: string } | null) => {
    set({ navTarget: target });
  },

  scanTarget: (targetId: string) => {
    const state = get();
    if (state.scannedTargetIds.includes(targetId)) {
      return { success: false, message: 'Target already cataloged.', researchYield: 0 };
    }

    const scannable = state.scannableTargets.find((s) => s.id === targetId);
    const landmark = state.landmarks.find((l) => l.id === targetId);

    const targetName = scannable?.name || landmark?.name || 'Geological Specimen';
    const points = scannable?.researchValue || 25;

    const newScannedIds = [...state.scannedTargetIds, targetId];
    const newPoints = state.researchDataPoints + points;

    const updatedScannables = state.scannableTargets.map((s) =>
      s.id === targetId ? { ...s, scanned: true } : s
    );

    audioSystem.playChime(1150);
    set({
      scannedTargetIds: newScannedIds,
      scannableTargets: updatedScannables,
      researchDataPoints: newPoints,
      notification: `SPECTRAL SCAN COMPLETE: [${targetName}] cataloged! +${points} Research Data Points.`,
    });

    get().updateObjectiveProgress('scan_target', targetId, 1);
    get().updateObjectiveProgress('analyze_sample', 'points', points);

    writeSaveState({
      scannedTargetIds: newScannedIds,
      researchDataPoints: newPoints,
    });

    if (targetId === 'scan_paleolake_clay') {
      get().unlockJournalEntry('journal_discovery_delta_clay');
    } else if (targetId === 'scan_cave_ice_core') {
      get().unlockJournalEntry('journal_discovery_subterranean_ice');
    }

    return { success: true, message: `Scanned ${targetName}! +${points} RP.`, researchYield: points };
  },

  startScanning: (targetId: string) => {
    set({ scanningState: { active: true, targetId, progress: 0 } });
  },

  updateScanningProgress: (delta: number) => {
    const state = get();
    if (!state.scanningState.active || !state.scanningState.targetId) {
      return { completed: false };
    }

    const newProg = Math.min(100, state.scanningState.progress + delta * 40);
    if (newProg >= 100) {
      const targetId = state.scanningState.targetId;
      set({ scanningState: { active: false, targetId: null, progress: 100 } });
      get().scanTarget(targetId);
      return { completed: true };
    }

    set({ scanningState: { ...state.scanningState, progress: newProg } });
    return { completed: false };
  },

  cancelScanning: () => {
    set({ scanningState: { active: false, targetId: null, progress: 0 } });
  },

  discoverLandmark: (landmarkId: string) => {
    const state = get();
    if (state.discoveredLandmarkIds.includes(landmarkId)) return;

    const lm = state.landmarks.find((l) => l.id === landmarkId);
    if (!lm) return;

    const newDiscovered = [...state.discoveredLandmarkIds, landmarkId];
    const updatedLandmarks = state.landmarks.map((l) =>
      l.id === landmarkId ? { ...l, discovered: true } : l
    );
    const newPoints = state.researchDataPoints + 15;

    audioSystem.playChime(1250);
    set({
      discoveredLandmarkIds: newDiscovered,
      landmarks: updatedLandmarks,
      researchDataPoints: newPoints,
      notification: `LANDMARK DISCOVERED: [${lm.name}] logged to planetary map! +15 RP.`,
    });

    get().updateObjectiveProgress('visit_location', landmarkId, 1);

    writeSaveState({
      discoveredLandmarkIds: newDiscovered,
      researchDataPoints: newPoints,
    });
  },

  collectLandmarkSample: (landmarkId: string) => {
    const state = get();
    const lm = state.landmarks.find((l) => l.id === landmarkId);
    if (!lm || !lm.hasSample) {
      return { success: false, message: 'No scientific sample available at this landmark.' };
    }

    const newInv = { ...state.inventory };
    const curW = calculateBackpackWeight(newInv);
    const sampleDef = RESOURCE_DEFINITIONS.scientific_sample;
    const addedMass = sampleDef?.weightPerUnit ?? 0.8;

    let targetCont = 'backpack';
    if (curW + addedMass > state.maxBackpackCapacity + 0.001) {
      const newVault = { ...state.vaultStorage, scientific_sample: (state.vaultStorage.scientific_sample || 0) + 1 };
      set({ vaultStorage: newVault, vaultStorageWeight: calculateStorageWeight(newVault) });
      targetCont = 'vault';
    } else {
      const it = newInv.scientific_sample;
      newInv.scientific_sample = { ...it, count: (it?.count ?? 0) + 1 };
      set({ inventory: newInv, backpackWeight: calculateBackpackWeight(newInv) });
    }

    const updatedLandmarks = state.landmarks.map((l) =>
      l.id === landmarkId ? { ...l, hasSample: false } : l
    );
    const newPoints = state.researchDataPoints + 20;

    audioSystem.playChime(1100);
    set({
      landmarks: updatedLandmarks,
      researchDataPoints: newPoints,
      notification: `SCIENTIFIC SAMPLE EXTRACTED: ${lm.name} sample routed to ${targetCont.toUpperCase()}. +20 RP.`,
    });

    get().updateObjectiveProgress('collect_resource', 'scientific_sample', 1);

    writeSaveState({
      researchDataPoints: newPoints,
    });

    return { success: true, message: `Sample collected from ${lm.name}!` };
  },

  unlockResearchTech: (techId: string) => {
    const state = get();
    if (state.unlockedTechIds.includes(techId)) {
      return { success: false, message: 'Technology blueprint already researched.' };
    }

    const tech = state.researchTechs.find((t) => t.id === techId);
    if (!tech) return { success: false, message: 'Research technology not found.' };

    if (state.researchDataPoints < tech.costPoints) {
      return {
        success: false,
        message: `Insufficient research data: need ${tech.costPoints} RP (current: ${state.researchDataPoints} RP).`,
      };
    }

    const newPoints = state.researchDataPoints - tech.costPoints;
    const newUnlocked = [...state.unlockedTechIds, techId];
    const updatedTechs = state.researchTechs.map((t) =>
      t.id === techId ? { ...t, unlocked: true } : t
    );

    audioSystem.playChime(1400);
    set({
      researchDataPoints: newPoints,
      unlockedTechIds: newUnlocked,
      researchTechs: updatedTechs,
      notification: `RESEARCH BLUEPRINT UNLOCKED: [${tech.name}]! Active systems enhanced.`,
    });

    writeSaveState({
      researchDataPoints: newPoints,
      unlockedTechIds: newUnlocked,
    });

    return { success: true, message: `Unlocked ${tech.name}!` };
  },

  updateObjectiveProgress: (type: ObjectiveType, targetKey?: string, deltaOrValue = 1) => {
    const state = get();
    let missionsChanged = false;
    const updatedMissions = { ...state.missions };

    for (const [mid, mission] of Object.entries(updatedMissions)) {
      if (mission.state !== 'active') continue;

      let missionObjectivesChanged = false;
      const updatedObjs = mission.objectives.map((obj) => {
        if (obj.type !== type) return obj;
        if (targetKey && obj.targetKey && obj.targetKey !== targetKey) return obj;

        let nextCurrent = obj.currentValue;
        if (type === 'repair_facility' || type === 'reach_energy') {
          nextCurrent = Math.max(obj.currentValue, deltaOrValue);
        } else {
          nextCurrent = Math.min(obj.targetValue, obj.currentValue + deltaOrValue);
        }

        if (nextCurrent !== obj.currentValue) {
          missionObjectivesChanged = true;
          return {
            ...obj,
            currentValue: nextCurrent,
            completed: nextCurrent >= obj.targetValue,
          };
        }
        return obj;
      });

      if (missionObjectivesChanged) {
        missionsChanged = true;
        updatedMissions[mid] = { ...mission, objectives: updatedObjs };

        const allComplete = updatedObjs.every((o) => o.currentValue >= o.targetValue);
        if (allComplete) {
          state.showNotification(`MISSION DIRECTIVES FULFILLED: [${mission.title}]! Claim reward at Command Centre.`);
          audioSystem.playChime(1300);
        }
      }
    }

    if (missionsChanged) {
      set({ missions: updatedMissions });
      writeSaveState({ missions: updatedMissions });
    }
  },

  triggerWorldEvent: (event: WorldEvent) => {
    audioSystem.playAlarm();
    set({
      activeWorldEvent: event,
      notification: `DYNAMIC MARS EVENT: [${event.title}] — ${event.description}`,
    });
  },

  dismissWorldEvent: () => {
    set({ activeWorldEvent: null });
  },

  setRoverAIMode: (mode: RoverAIMode) => {
    set((state) => {
      if (mode === 'manual') {
        return {
          roverAIMode: 'manual',
          roverNavPlan: { ...state.roverNavPlan, state: 'idle' },
        };
      }
      return { roverAIMode: mode };
    });
  },

  setRoverDestination: (destination: RoverDestination) => {
    const state = get();
    const plan = RoverAISystem.planRoute(state.roverPosition, destination);
    if (plan.waypoints.length === 0) {
      audioSystem.playAlarm();
      return {
        success: false,
        message: plan.failureReason || `Navigation route to ${destination.name} blocked by terrain or structures.`,
      };
    }

    audioSystem.playChime(1100);
    set({
      roverAIMode: 'autonomous',
      roverNavPlan: plan,
      notification: `Autonomous route engaged: ${destination.name} (${plan.totalDistance.toFixed(0)}m, ${plan.waypoints.length} waypoints).`,
    });

    return {
      success: true,
      message: `Navigating to ${destination.name}: ${plan.waypoints.length} waypoints (${plan.totalDistance.toFixed(0)}m).`,
    };
  },

  cancelRoverAutonomous: () => {
    const state = get();
    audioSystem.playChime(600);
    set({
      roverAIMode: 'manual',
      roverNavPlan: {
        ...state.roverNavPlan,
        state: 'idle',
      },
      notification: 'Autonomous rover autopilot disengaged. Manual control restored.',
    });
  },

  updateRoverNavPlan: (partial: Partial<RoverNavigationPlan>) => {
    set((state) => ({
      roverNavPlan: {
        ...state.roverNavPlan,
        ...partial,
      },
    }));
  },

  setRobotMode: (mode: RobotMode) => {
    const state = get();
    if ((mode === 'follow_player' || mode === 'transporting') && state.robotState.batteryPercent <= 15) {
      audioSystem.playAlarm();
      state.showNotification('Cannot engage: Aero-Bot battery critical (<15%). Docking recharge required.');
      return;
    }
    audioSystem.playChime(850);
    set({
      robotState: {
        ...state.robotState,
        mode,
      },
      notification: `Aero-Bot order confirmed: Mode set to ${mode.toUpperCase().replace('_', ' ')}.`,
    });
  },

  assignTransportTask: (
    resourceType: ResourceType,
    count: number,
    source: StorageContainerType,
    destination: StorageContainerType
  ) => {
    const state = get();
    if (source === destination) {
      return { success: false, message: 'Source and destination cannot be the same storage container.' };
    }
    if (count <= 0) {
      return { success: false, message: 'Quantity must be at least 1 unit.' };
    }

    // Validate resource availability at source
    let availableCount = 0;
    if (source === 'backpack') {
      availableCount = state.inventory[resourceType]?.count || 0;
    } else if (source === 'vault') {
      availableCount = state.vaultStorage[resourceType] || 0;
    } else if (source === 'rover') {
      availableCount = state.roverStorage[resourceType] || 0;
    }

    if (availableCount < count) {
      const resName = RESOURCE_DEFINITIONS[resourceType]?.name || resourceType;
      return {
        success: false,
        message: `Insufficient ${resName} in ${source.toUpperCase()} (${availableCount}/${count} available).`,
      };
    }

    // Validate target capacity
    const unitW = RESOURCE_DEFINITIONS[resourceType]?.weightPerUnit ?? 1.0;
    const addedWeight = count * unitW;

    if (destination === 'backpack' && state.backpackWeight + addedWeight > state.maxBackpackCapacity + 0.001) {
      return { success: false, message: 'Target astronaut backpack would be overburdened.' };
    }
    if (destination === 'vault' && state.vaultStorageWeight + addedWeight > state.maxVaultCapacity + 0.001) {
      return { success: false, message: 'Target Outpost Vault storage capacity exceeded.' };
    }
    if (destination === 'rover' && state.roverStorageWeight + addedWeight > state.maxRoverCapacity + 0.001) {
      return { success: false, message: 'Target Rover cargo storage capacity exceeded.' };
    }

    const solTimeStr = `Sol ${state.solCycle.solNumber} • ${Math.floor(state.solCycle.timeOfDay).toString().padStart(2, '0')}:${Math.floor((state.solCycle.timeOfDay % 1) * 60).toString().padStart(2, '0')}`;
    const newTask: TransportTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      resourceType,
      count,
      source,
      destination,
      status: 'pending',
      progressPercent: 0,
      timestamp: solTimeStr,
    };

    audioSystem.playChime(1000);
    const updatedTasks = [...state.transportTasks, newTask];
    const newRobotMode = state.robotState.isCharging || state.robotState.mode === 'idle' ? 'transporting' : state.robotState.mode;

    set({
      transportTasks: updatedTasks,
      robotState: {
        ...state.robotState,
        mode: newRobotMode,
      },
      notification: `Transport Task Dispatched: Move ${count}x ${RESOURCE_DEFINITIONS[resourceType]?.name || resourceType} to ${destination.toUpperCase()}.`,
    });

    writeSaveState({
      transportTasks: updatedTasks,
    });

    return {
      success: true,
      message: `Transport assigned to Aero-Bot: Transferring ${count}x from ${source.toUpperCase()} to ${destination.toUpperCase()}.`,
    };
  },

  cancelTransportTask: (taskId: string) => {
    const state = get();
    const task = state.transportTasks.find((t) => t.id === taskId);
    if (!task) {
      return { success: false, message: 'Transport task not found.' };
    }

    if (task.status === 'completed' || task.status === 'cancelled') {
      return { success: false, message: `Task is already ${task.status}.` };
    }

    // Safety refund: If robot is carrying payload from this task, return items to source
    let newInv = { ...state.inventory };
    let newVault = { ...state.vaultStorage };
    let newRover = { ...state.roverStorage };
    let newPayload = state.robotState.payload;

    if (newPayload && newPayload.taskId === taskId) {
      const pType = newPayload.type;
      const pCount = newPayload.count;
      if (task.source === 'backpack') {
        const it = newInv[pType];
        newInv[pType] = { ...it, count: (it?.count || 0) + pCount };
      } else if (task.source === 'vault') {
        newVault[pType] = (newVault[pType] || 0) + pCount;
      } else if (task.source === 'rover') {
        newRover[pType] = (newRover[pType] || 0) + pCount;
      }
      newPayload = null;
    }

    const updatedTasks = state.transportTasks.map((t) =>
      t.id === taskId ? { ...t, status: 'cancelled' as const } : t
    );

    audioSystem.playChime(650);
    set({
      transportTasks: updatedTasks,
      robotState: {
        ...state.robotState,
        payload: newPayload,
        mode: updatedTasks.some((t) => t.status === 'pending') ? state.robotState.mode : 'idle',
      },
      inventory: newInv,
      vaultStorage: newVault,
      roverStorage: newRover,
      backpackWeight: calculateBackpackWeight(newInv),
      vaultStorageWeight: calculateStorageWeight(newVault),
      roverStorageWeight: calculateStorageWeight(newRover),
      notification: 'Transport task cancelled safely without material loss.',
    });

    writeSaveState({
      transportTasks: updatedTasks,
      inventory: newInv,
      vaultStorage: newVault,
      roverStorage: newRover,
    });

    return {
      success: true,
      message: 'Transport task cancelled safely.',
    };
  },

  executeAIAction: (recId: string) => {
    const state = get();
    const rec = state.baseRecommendations.find((r) => r.id === recId);
    if (!rec) {
      return { success: false, message: 'Advisory recommendation not found.' };
    }

    let result = { success: false, message: 'Action not supported.' };

    if (rec.actionType === 'shed_breakers') {
      const circuits = state.powerGrid.facilityCircuits;
      if (circuits.greenhouse) state.toggleFacilityCircuit('greenhouse');
      if (circuits.comm_room) state.toggleFacilityCircuit('comm_room');
      if (circuits.living_quarters) state.toggleFacilityCircuit('living_quarters');
      if (circuits.engineering_workshop) state.toggleFacilityCircuit('engineering_workshop');
      audioSystem.playChime(1050);
      result = { success: true, message: 'Nonessential facility circuits shed to preserve life support power.' };
    } else if (rec.actionType === 'refill_oxygen') {
      result = state.refillSuitOxygen();
    } else if (rec.actionType === 'harvest_crop') {
      result = state.harvestGreenhouseCrop();
    } else if (rec.actionType === 'recharge_rover') {
      const garageDest = PRESET_ROVER_DESTINATIONS.find((d) => d.id === 'dest_base_garage') || PRESET_ROVER_DESTINATIONS[0];
      result = state.setRoverDestination(garageDest);
    }

    if (result.success) {
      state.acknowledgeAIRecommendation(recId);
    }

    return result;
  },

  acknowledgeAIRecommendation: (recId: string) => {
    set((state) => ({
      baseRecommendations: state.baseRecommendations.map((r) =>
        r.id === recId ? { ...r, acknowledged: true } : r
      ),
    }));
  },

  updateRobotState: (partial: Partial<RobotState>) => {
    set((state) => ({
      robotState: {
        ...state.robotState,
        ...partial,
      },
    }));
  },

  resetSaveData: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    const freshInv = createInitialInventory();
    set({
      vitals: { ...INITIAL_VITALS },
      powerGrid: { ...INITIAL_POWER_GRID },
      greenhouseCrop: { ...INITIAL_GREENHOUSE_CROP },
      survivalWarnings: [],
      inventory: freshInv,
      vaultStorage: { ...INITIAL_VAULT_STORAGE },
      vaultStorageWeight: calculateStorageWeight(INITIAL_VAULT_STORAGE),
      roverStorage: { ...INITIAL_ROVER_STORAGE },
      roverStorageWeight: calculateStorageWeight(INITIAL_ROVER_STORAGE),
      facilityRenovations: { ...INITIAL_FACILITY_RENOVATIONS },
      activeFacilityTab: 'command_centre',
      renovations: { ...INITIAL_RENOVATIONS },
      collectedNodeIds: [],
      maxBackpackCapacity: BACKPACK_BASE_CAPACITY,
      maxRoverCapacity: ROVER_STORAGE_CAPACITY,
      maxVaultCapacity: VAULT_STORAGE_CAPACITY,
      backpackWeight: calculateBackpackWeight(freshInv),
      activeStorageTab: 'vault',
      resourceNodes: [...INITIAL_NODES],
      solCycle: { ...INITIAL_SOL },
      objectives: [...INITIAL_OBJECTIVES],
      playerPosition: [0, 0, 11],
      roverPosition: [8, 0, 8],
      isInsideHab: false,
      doorOpen: false,
      isGameOver: false,
      gameOverReason: '',
      isSubstanceModalOpen: false,
      isPauseModalOpen: false,
      isStorageModalOpen: false,
      isRenovationModalOpen: false,
      isCraftingModalOpen: false,
      isDisassemblyModalOpen: false,
      isPowerGridModalOpen: false,
      isMissionModalOpen: false,
      isMapModalOpen: false,
      isResearchModalOpen: false,
      isIntelligentBaseModalOpen: false,
      campaignChapter: 1 as ChapterId,
      completedChapters: [],
      unlockedJournalIds: ['journal_sol_01', 'journal_audio_vance_01'],
      activeDialogue: CAMPAIGN_DIALOGUES['dia_ch1_intro'],
      dialogueHistory: [],
      playerDecisions: {},
      activeChoiceModalId: null,
      campaignEnding: null,
      campaignCompleted: false,
      isJournalModalOpen: false,
      isEndingModalOpen: false,
      chapterBanner: {
        chapter: CAMPAIGN_CHAPTERS[0],
        visible: true,
      },
      roverAIMode: 'manual',
      roverNavPlan: {
        destination: null,
        waypoints: [],
        currentWaypointIndex: 0,
        totalDistance: 0,
        remainingDistance: 0,
        progressPercent: 0,
        estimatedSecondsRemaining: 0,
        state: 'idle',
      },
      robotState: { ...INITIAL_ROBOT_STATE },
      transportTasks: [],
      baseRecommendations: [],
      baseAlerts: [],
      missions: { ...INITIAL_MISSIONS },
      activeMissionId: 'mis_restore_comms',
      completedMissionIds: [],
      landmarks: INITIAL_LANDMARKS.map((l) => ({ ...l, discovered: false })),
      discoveredLandmarkIds: [],
      scannableTargets: INITIAL_SCANNABLES.map((s) => ({ ...s, scanned: false })),
      scannedTargetIds: [],
      researchDataPoints: 0,
      researchTechs: INITIAL_RESEARCH_TECHS.map((t) => ({ ...t, unlocked: false })),
      unlockedTechIds: [],
      activeWorldEvent: null,
      navTarget: null,
      scanningState: { active: false, targetId: null, progress: 0 },
      activeCraftingJob: null,
      craftingHistory: [],
      targetedInteractable: null,
      selectedSubstance: null,
      cameraLook: { yaw: Math.PI, pitch: 0.15 },
      roverTelemetry: { speedKmH: 0, batteryPercent: 100, gear: 'N' },
      notification: 'Mission & Data Wiped. Fresh Sol 1 touchdown initialized.',
    });
  },

  togglePauseModal: (open?: boolean) => {
    const nextState = open !== undefined ? open : !get().isPauseModalOpen;
    set({ isPauseModalOpen: nextState });
  },

  updateRoverTelemetry: (speedKmH: number, batteryDelta = 0, gear: 'D' | 'N' | 'R' | 'P' = 'D') => {
    const current = get().roverTelemetry;
    const newBattery = Math.max(0, Math.min(100, current.batteryPercent - batteryDelta));
    set({
      roverTelemetry: {
        speedKmH: Math.round(speedKmH),
        batteryPercent: Math.round(newBattery * 10) / 10,
        gear,
      },
    });
  },

  craftOxygenCanister: () => {
    const state = get();
    const ice = state.inventory.water_ice;
    if (!ice || ice.count < 2) {
      state.showNotification('Need 2x Subsurface Water Ice to electrolyze O2.');
      return;
    }

    audioSystem.playChime(1000);
    const updatedInventory = {
      ...state.inventory,
      water_ice: { ...ice, count: ice.count - 2 },
    };
    set({
      inventory: updatedInventory,
      backpackWeight: calculateBackpackWeight(updatedInventory),
      vitals: {
        ...state.vitals,
        oxygen: Math.min(100, state.vitals.oxygen + 45),
      },
      notification: 'Electrolysis complete: +45% Suit Oxygen replenishment.',
    });
  },

  repairSuitIntegrity: () => {
    const state = get();
    const scrap = state.inventory.titanium_scrap;
    if (!scrap || scrap.count < 1) {
      state.showNotification('Need 1x Titanium Scrap for suit patch.');
      return;
    }

    audioSystem.playChime(950);
    const updatedInventory = {
      ...state.inventory,
      titanium_scrap: { ...scrap, count: scrap.count - 1 },
    };
    set({
      inventory: updatedInventory,
      backpackWeight: calculateBackpackWeight(updatedInventory),
      vitals: {
        ...state.vitals,
        suitIntegrity: 100,
      },
      notification: 'Micro-meteorite suit seal patched (100% integrity).',
    });
  },

  completeObjective: (id: string) => {
    const state = get();
    const obj = state.objectives.find((o) => o.id === id);
    if (!obj || obj.completed) return;

    audioSystem.playChime(1100);
    const updated = state.objectives.map((o) => (o.id === id ? { ...o, completed: true } : o));

    let inventory = state.inventory;
    if (obj.rewardResource) {
      const item = inventory[obj.rewardResource.type];
      inventory = {
        ...inventory,
        [obj.rewardResource.type]: {
          ...item,
          count: (item?.count ?? 0) + obj.rewardResource.count,
        },
      };
    }

    set({
      objectives: updated,
      inventory,
      backpackWeight: calculateBackpackWeight(inventory),
      notification: `OBJECTIVE ACCOMPLISHED: ${obj.title}!`,
    });
  },

  showNotification: (msg: string) => {
    set({ notification: msg });
  },

  clearNotification: () => {
    set({ notification: null });
  },

  restartGame: () => {
    const saved = loadSavedState();
    const capacity = saved?.maxBackpackCapacity || BACKPACK_BASE_CAPACITY;
    const inv = saved?.inventory ? { ...INITIAL_INVENTORY, ...saved.inventory } : { ...INITIAL_INVENTORY };
    const vault = saved?.vaultStorage ? { ...INITIAL_VAULT_STORAGE, ...saved.vaultStorage } : { ...INITIAL_VAULT_STORAGE };
    const rover = saved?.roverStorage ? { ...INITIAL_ROVER_STORAGE, ...saved.roverStorage } : { ...INITIAL_ROVER_STORAGE };
    const savedFacilities: FacilityRenovations = saved?.facilityRenovations
      ? { ...INITIAL_FACILITY_RENOVATIONS, ...saved.facilityRenovations }
      : saved?.renovations
      ? {
          command_centre: saved.renovations.power_room ? 1 : 0,
          greenhouse: saved.renovations.greenhouse ? 1 : 0,
          engineering_workshop: saved.renovations.storage_room ? 2 : saved.renovations.power_room ? 1 : 0,
          rover_garage: 0,
          living_quarters: saved.renovations.hab_expansion ? 1 : 0,
          comm_room: saved.renovations.comm_room ? 1 : 0,
        }
      : { ...INITIAL_FACILITY_RENOVATIONS };
    const reno: RenovationStatus = {
      power_room: savedFacilities.engineering_workshop >= 1,
      storage_room: savedFacilities.engineering_workshop >= 2,
      greenhouse: savedFacilities.greenhouse >= 1,
      comm_room: savedFacilities.comm_room >= 1,
      hab_expansion: savedFacilities.living_quarters >= 1 || savedFacilities.greenhouse >= 1,
    };
    const colIds = saved?.collectedNodeIds || [];

    set({
      vitals: { ...INITIAL_VITALS },
      powerGrid: { ...INITIAL_POWER_GRID },
      greenhouseCrop: { ...INITIAL_GREENHOUSE_CROP },
      survivalWarnings: [],
      inventory: inv,
      vaultStorage: vault,
      vaultStorageWeight: calculateStorageWeight(vault),
      roverStorage: rover,
      roverStorageWeight: calculateStorageWeight(rover),
      facilityRenovations: savedFacilities,
      activeFacilityTab: 'command_centre',
      renovations: reno,
      collectedNodeIds: colIds,
      maxBackpackCapacity: capacity,
      maxRoverCapacity: ROVER_STORAGE_CAPACITY,
      maxVaultCapacity: VAULT_STORAGE_CAPACITY,
      backpackWeight: calculateBackpackWeight(inv),
      activeStorageTab: 'vault',
      resourceNodes: INITIAL_NODES.map((n) =>
        colIds.includes(n.id) ? { ...n, depleted: true, scanDiscovered: true } : n
      ),
      solCycle: { ...INITIAL_SOL },
      objectives: [...INITIAL_OBJECTIVES],
      playerPosition: [0, 0, 11],
      roverPosition: [8, 0, 8],
      isInsideHab: false,
      doorOpen: false,
      isGameOver: false,
      gameOverReason: '',
      isSubstanceModalOpen: false,
      isPauseModalOpen: false,
      isStorageModalOpen: false,
      isRenovationModalOpen: false,
      isCraftingModalOpen: false,
      isDisassemblyModalOpen: false,
      isPowerGridModalOpen: false,
      isMissionModalOpen: false,
      isMapModalOpen: false,
      isResearchModalOpen: false,
      isIntelligentBaseModalOpen: false,
      campaignChapter: (saved?.campaignChapter ?? 1) as ChapterId,
      completedChapters: saved?.completedChapters ?? [],
      unlockedJournalIds: saved?.unlockedJournalIds ?? ['journal_sol_01', 'journal_audio_vance_01'],
      activeDialogue: saved?.campaignChapter ? null : CAMPAIGN_DIALOGUES['dia_ch1_intro'],
      dialogueHistory: saved?.dialogueHistory ?? [],
      playerDecisions: saved?.playerDecisions ?? {},
      activeChoiceModalId: null,
      campaignEnding: saved?.campaignEnding ?? null,
      campaignCompleted: saved?.campaignCompleted ?? false,
      isJournalModalOpen: false,
      isEndingModalOpen: false,
      chapterBanner: {
        chapter: CAMPAIGN_CHAPTERS.find((c) => c.id === (saved?.campaignChapter ?? 1)) || CAMPAIGN_CHAPTERS[0],
        visible: true,
      },
      roverAIMode: 'manual',
      roverNavPlan: {
        destination: null,
        waypoints: [],
        currentWaypointIndex: 0,
        totalDistance: 0,
        remainingDistance: 0,
        progressPercent: 0,
        estimatedSecondsRemaining: 0,
        state: 'idle',
      },
      robotState: saved?.robotState ? { ...saved.robotState, mode: 'idle' } : { ...INITIAL_ROBOT_STATE },
      transportTasks: saved?.transportTasks || [],
      baseRecommendations: [],
      baseAlerts: saved?.baseAlerts || [],
      missions: saved?.missions ? { ...INITIAL_MISSIONS, ...saved.missions } : { ...INITIAL_MISSIONS },
      activeMissionId: saved?.activeMissionId || 'mis_restore_comms',
      completedMissionIds: saved?.completedMissionIds || [],
      landmarks: INITIAL_LANDMARKS.map((l) => ({ ...l, discovered: (saved?.discoveredLandmarkIds || []).includes(l.id) })),
      discoveredLandmarkIds: saved?.discoveredLandmarkIds || [],
      scannableTargets: INITIAL_SCANNABLES.map((s) => ({ ...s, scanned: (saved?.scannedTargetIds || []).includes(s.id) })),
      scannedTargetIds: saved?.scannedTargetIds || [],
      researchDataPoints: saved?.researchDataPoints ?? 0,
      researchTechs: INITIAL_RESEARCH_TECHS.map((t) => ({ ...t, unlocked: (saved?.unlockedTechIds || []).includes(t.id) })),
      unlockedTechIds: saved?.unlockedTechIds || [],
      activeWorldEvent: null,
      navTarget: null,
      scanningState: { active: false, targetId: null, progress: 0 },
      activeCraftingJob: null,
      craftingHistory: [],
      targetedInteractable: null,
      selectedSubstance: null,
      cameraLook: { yaw: Math.PI, pitch: 0.15 },
      roverTelemetry: { speedKmH: 0, batteryPercent: 100, gear: 'N' },
      notification: 'Mission Re-initialized. Step out onto Jezero Crater.',
    });
  },

  // Phase 12: Main Menu, Cinematic Prologue & Save Slot System
  openMainMenu: () => set({ isMainMenuOpen: true, isPauseModalOpen: false }),
  closeMainMenu: () => set({ isMainMenuOpen: false }),
  openOpeningPrologue: () => set({ isOpeningPrologueOpen: true, isMainMenuOpen: false }),
  closeOpeningPrologue: () => set({ isOpeningPrologueOpen: false }),

  updateSettings: (partial: Partial<GameSettings>) => {
    set((state) => {
      const updated = { ...state.settings, ...partial };
      if (partial.masterVolume !== undefined) audioSystem.setMasterVolume(partial.masterVolume);
      if (partial.musicVolume !== undefined) audioSystem.setMusicVolume(partial.musicVolume);
      if (partial.effectsVolume !== undefined) audioSystem.setEffectsVolume(partial.effectsVolume);
      return { settings: updated };
    });
  },

  saveToSlot: (slot: number) => {
    const s = get();
    try {
      writeSaveState(
        {
          inventory: s.inventory,
          vaultStorage: s.vaultStorage,
          roverStorage: s.roverStorage,
          facilityRenovations: s.facilityRenovations,
          collectedNodeIds: s.collectedNodeIds,
          maxBackpackCapacity: s.maxBackpackCapacity,
          craftingHistory: s.craftingHistory,
          vitals: s.vitals,
          solCycle: s.solCycle,
          powerGrid: s.powerGrid,
          greenhouseCrop: s.greenhouseCrop,
          missions: s.missions,
          activeMissionId: s.activeMissionId,
          completedMissionIds: s.completedMissionIds,
          discoveredLandmarkIds: s.discoveredLandmarkIds,
          scannedTargetIds: s.scannedTargetIds,
          researchDataPoints: s.researchDataPoints,
          unlockedTechIds: s.unlockedTechIds,
          robotState: s.robotState,
          transportTasks: s.transportTasks,
          worldSeed: s.worldSeed,
          campaignChapter: s.campaignChapter,
          completedChapters: s.completedChapters,
          unlockedJournalIds: s.unlockedJournalIds,
          dialogueHistory: s.dialogueHistory,
          playerDecisions: s.playerDecisions,
          campaignEnding: s.campaignEnding,
          campaignCompleted: s.campaignCompleted,
        },
        slot
      );
      audioSystem.playChime(880);
      return { success: true, message: `Expedition state successfully written to Slot ${slot}.` };
    } catch {
      return { success: false, message: `Failed to write expedition to Slot ${slot}.` };
    }
  },

  loadFromSlot: (slot: number) => {
    const data = loadSavedState(slot);
    if (!data) return { success: false, message: `No expedition data found in Slot ${slot}.` };

    set((state) => ({
      inventory: data.inventory ? { ...INITIAL_INVENTORY, ...data.inventory } : state.inventory,
      vaultStorage: data.vaultStorage ? { ...INITIAL_VAULT_STORAGE, ...data.vaultStorage } : state.vaultStorage,
      vaultStorageWeight: data.vaultStorage ? calculateStorageWeight(data.vaultStorage) : state.vaultStorageWeight,
      roverStorage: data.roverStorage ? { ...INITIAL_ROVER_STORAGE, ...data.roverStorage } : state.roverStorage,
      roverStorageWeight: data.roverStorage ? calculateStorageWeight(data.roverStorage) : state.roverStorageWeight,
      facilityRenovations: data.facilityRenovations ? { ...INITIAL_FACILITY_RENOVATIONS, ...data.facilityRenovations } : state.facilityRenovations,
      collectedNodeIds: data.collectedNodeIds || state.collectedNodeIds,
      maxBackpackCapacity: data.maxBackpackCapacity || state.maxBackpackCapacity,
      backpackWeight: data.inventory ? calculateBackpackWeight(data.inventory) : state.backpackWeight,
      craftingHistory: data.craftingHistory || state.craftingHistory,
      vitals: data.vitals ? { ...INITIAL_VITALS, ...data.vitals } : state.vitals,
      solCycle: data.solCycle ? { ...INITIAL_SOL, ...data.solCycle } : state.solCycle,
      powerGrid: data.powerGrid ? { ...INITIAL_POWER_GRID, ...data.powerGrid } : state.powerGrid,
      greenhouseCrop: data.greenhouseCrop ? { ...INITIAL_GREENHOUSE_CROP, ...data.greenhouseCrop } : state.greenhouseCrop,
      missions: data.missions ? { ...INITIAL_MISSIONS, ...data.missions } : state.missions,
      activeMissionId: data.activeMissionId !== undefined ? data.activeMissionId : state.activeMissionId,
      completedMissionIds: data.completedMissionIds || state.completedMissionIds,
      discoveredLandmarkIds: data.discoveredLandmarkIds || state.discoveredLandmarkIds,
      scannedTargetIds: data.scannedTargetIds || state.scannedTargetIds,
      researchDataPoints: data.researchDataPoints !== undefined ? data.researchDataPoints : state.researchDataPoints,
      unlockedTechIds: data.unlockedTechIds || state.unlockedTechIds,
      robotState: data.robotState ? { ...INITIAL_ROBOT_STATE, ...data.robotState } : state.robotState,
      transportTasks: data.transportTasks || state.transportTasks,
      worldSeed: data.worldSeed ?? state.worldSeed,
      campaignChapter: data.campaignChapter ?? state.campaignChapter,
      completedChapters: data.completedChapters || state.completedChapters,
      unlockedJournalIds: data.unlockedJournalIds || state.unlockedJournalIds,
      dialogueHistory: data.dialogueHistory || state.dialogueHistory,
      playerDecisions: data.playerDecisions || state.playerDecisions,
      campaignEnding: data.campaignEnding ?? null,
      campaignCompleted: data.campaignCompleted ?? false,
      roverAIMode: 'manual',
      roverNavPlan: {
        destination: null,
        waypoints: [],
        currentWaypointIndex: 0,
        totalDistance: 0,
        remainingDistance: 0,
        progressPercent: 0,
        estimatedSecondsRemaining: 0,
        state: 'idle',
      },
      isMainMenuOpen: false,
      isPauseModalOpen: false,
    }));
    audioSystem.playChime(1040);
    return { success: true, message: `Loaded expedition from Slot ${slot} successfully.` };
  },

  getSaveSlotsInfo: () => {
    const slots = [1, 2, 3];
    return slots.map((slot) => {
      const data = loadSavedState(slot);
      if (!data) return { slot, exists: false, sol: 1 };
      return {
        slot,
        exists: true,
        sol: data.solCycle?.solNumber ?? 1,
        timestamp: data.saveTimestamp,
        chapter: (data.campaignChapter as number) ?? 1,
      };
    });
  },
}));
