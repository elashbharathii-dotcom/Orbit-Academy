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
} from '../types/survivalTypes';
import { audioSystem } from '../systems/audioSynthesizer';

const INITIAL_VITALS: PlayerVitals = {
  health: 100,
  oxygen: 98,
  power: 100,
  coreTemp: 37.0,
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
    ],
    unlockedBenefits: [
      'Astronaut backpack capacity upgraded to 35.0 kg',
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
    ],
    unlockedBenefits: [
      'Rear bulkhead corridor opens',
      'Accessible second habitat geodesic dome',
      'Doubled habitable living space and interior colliders',
    ],
  },
];

const INITIAL_INVENTORY: Record<ResourceType, ResourceItem> = {
  scrap_metal: {
    id: 'scrap_metal',
    name: 'Structural Scrap Metal',
    count: 2,
    description: 'Salvaged alloy framing, hull shielding and titanium trusses.',
    icon: 'Wrench',
    weightPerUnit: 1.0,
  },
  electronic_parts: {
    id: 'electronic_parts',
    name: 'Micro-Circuit Components',
    count: 1,
    description: 'Integrated circuits, optical sensors and avionics processor boards.',
    icon: 'Cpu',
    weightPerUnit: 0.5,
  },
  damaged_battery: {
    id: 'damaged_battery',
    name: 'High-Density Cell Battery',
    count: 0,
    description: 'High-capacity lithium-sulfur power cell requiring reconditioning.',
    icon: 'BatteryCharging',
    weightPerUnit: 2.0,
  },
  mechanical_parts: {
    id: 'mechanical_parts',
    name: 'Actuator & Hydraulic Gearing',
    count: 0,
    description: 'Precision stepper gears, pistons and planetary mechanical drives.',
    icon: 'Settings',
    weightPerUnit: 1.5,
  },
  scientific_sample: {
    id: 'scientific_sample',
    name: 'Jezero Astrobiology Core',
    count: 0,
    description: 'Sediment core sample containing organic biomarker signatures.',
    icon: 'Microscope',
    weightPerUnit: 0.8,
  },
  water_ice: {
    id: 'water_ice',
    name: 'Subsurface Water Ice',
    count: 2,
    description: 'Frozen glacial regolith trapped beneath iron dust.',
    icon: 'Droplets',
    weightPerUnit: 1.0,
  },
  hematite: {
    id: 'hematite',
    name: 'Hematite (Fe2O3) Spherules',
    count: 1,
    description: 'Martian "blueberries" rich in iron oxide for structural fabrication.',
    icon: 'Layers',
    weightPerUnit: 2.0,
  },
  silicate_crystal: {
    id: 'silicate_crystal',
    name: 'Silicate Sand Core',
    count: 0,
    description: 'Purified quartz-rich grains for optical lenses and thermal tiles.',
    icon: 'Sparkles',
    weightPerUnit: 0.8,
  },
  sulfur_mineral: {
    id: 'sulfur_mineral',
    name: 'Hydrated Sulfate Mineral',
    count: 0,
    description: 'Evaporite gypsum veins for sulfur-concrete and electrolytes.',
    icon: 'Gem',
    weightPerUnit: 1.2,
  },
  regolith: {
    id: 'regolith',
    name: 'Jezero Smectite Regolith',
    count: 1,
    description: 'Phyllosilicate clay dust for greenhouse plant growth matrix.',
    icon: 'Mountain',
    weightPerUnit: 1.5,
  },
  titanium_scrap: {
    id: 'titanium_scrap',
    name: 'Titanium Debris',
    count: 0,
    description: 'Salvaged aerospace alloy from impact probe remnant.',
    icon: 'Disc',
    weightPerUnit: 1.8,
  },
  solar_cell: {
    id: 'solar_cell',
    name: 'Photovoltaic Wafer',
    count: 0,
    description: 'High-efficiency gallium arsenide solar panel cell.',
    icon: 'Sun',
    weightPerUnit: 0.5,
  },
};

const INITIAL_VAULT_STORAGE: Record<ResourceType, number> = {
  scrap_metal: 3,
  electronic_parts: 1,
  damaged_battery: 0,
  mechanical_parts: 0,
  scientific_sample: 0,
  water_ice: 0,
  hematite: 0,
  silicate_crystal: 0,
  sulfur_mineral: 0,
  regolith: 0,
  titanium_scrap: 0,
  solar_cell: 0,
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
      total += item.count * item.weightPerUnit;
    }
  }
  return Math.round(total * 10) / 10;
}

const STORAGE_KEY = 'mars_frontier_save_v1';

interface MarsSavedState {
  inventory?: Record<ResourceType, ResourceItem>;
  vaultStorage?: Record<ResourceType, number>;
  renovations?: RenovationStatus;
  collectedNodeIds?: string[];
  maxBackpackCapacity?: number;
}

function loadSavedState(): MarsSavedState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeSaveState(data: MarsSavedState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
};

interface MarsGameState {
  vitals: PlayerVitals;
  inventory: Record<ResourceType, ResourceItem>;
  resourceNodes: ResourceNodeData[];
  solCycle: SolCycle;
  objectives: Objective[];
  settings: GameSettings;
  playerPosition: [number, number, number];
  roverPosition: [number, number, number];
  isInsideHab: boolean;
  doorOpen: boolean;
  isGameOver: boolean;
  gameOverReason: string;
  notification: string | null;

  // Backpack & Outpost Vault Storage System
  maxBackpackCapacity: number;
  backpackWeight: number;
  vaultStorage: Record<ResourceType, number>;
  renovations: RenovationStatus;
  collectedNodeIds: string[];

  // Interaction & Modals State
  targetedInteractable: InteractableObject | null;
  selectedSubstance: SubstanceDetails | null;
  isSubstanceModalOpen: boolean;
  isPauseModalOpen: boolean;
  isStorageModalOpen: boolean;
  isRenovationModalOpen: boolean;

  // Vehicle Telemetry
  roverTelemetry: RoverTelemetry;

  // Camera orientation
  cameraLook: { yaw: number; pitch: number };

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
  openStorageModal: () => void;
  closeStorageModal: () => void;
  openRenovationModal: () => void;
  closeRenovationModal: () => void;
  depositToStorage: (type: ResourceType, count: number) => void;
  depositAllToStorage: () => void;
  withdrawFromStorage: (type: ResourceType, count: number) => void;
  purchaseRenovation: (upgradeId: UpgradeId) => { success: boolean; message: string };
  resetSaveData: () => void;
  togglePauseModal: (open?: boolean) => void;
  updateRoverTelemetry: (speedKmH: number, batteryDelta?: number, gear?: 'D' | 'N' | 'R') => void;
  craftOxygenCanister: () => void;
  repairSuitIntegrity: () => void;
  completeObjective: (id: string) => void;
  showNotification: (msg: string) => void;
  clearNotification: () => void;
  restartGame: () => void;
}

const savedData = loadSavedState();
const initialInventory: Record<ResourceType, ResourceItem> = savedData?.inventory
  ? { ...INITIAL_INVENTORY, ...savedData.inventory }
  : { ...INITIAL_INVENTORY };
const initialVaultStorage: Record<ResourceType, number> = savedData?.vaultStorage
  ? { ...INITIAL_VAULT_STORAGE, ...savedData.vaultStorage }
  : { ...INITIAL_VAULT_STORAGE };
const initialRenovations: RenovationStatus = savedData?.renovations
  ? { ...INITIAL_RENOVATIONS, ...savedData.renovations }
  : { ...INITIAL_RENOVATIONS };
const initialCollectedIds: string[] = savedData?.collectedNodeIds || [];
const initialCapacity: number = savedData?.maxBackpackCapacity || (initialRenovations.storage_room ? 35.0 : 20.0);
const initialNodes: ResourceNodeData[] = INITIAL_NODES.map((n) =>
  initialCollectedIds.includes(n.id) ? { ...n, depleted: true, scanDiscovered: true } : n
);

export const useMarsGameStore = create<MarsGameState>((set, get) => ({
  vitals: { ...INITIAL_VITALS },
  inventory: initialInventory,
  vaultStorage: initialVaultStorage,
  renovations: initialRenovations,
  collectedNodeIds: initialCollectedIds,
  maxBackpackCapacity: initialCapacity,
  backpackWeight: calculateBackpackWeight(initialInventory),
  resourceNodes: initialNodes,
  solCycle: { ...INITIAL_SOL },
  objectives: [...INITIAL_OBJECTIVES],
  settings: {
    soundEnabled: true,
    visorScanActive: false,
    controlMode: 'on_foot',
    thirdPerson: true,
  },
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

  roverTelemetry: {
    speedKmH: 0,
    batteryPercent: 100,
    gear: 'N',
  },

  cameraLook: { yaw: Math.PI, pitch: 0.15 },

  tick: (deltaSeconds: number) => {
    const state = get();
    if (state.isGameOver || state.isPauseModalOpen) return;

    // 1. Advance Sol clock
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
    const irradiance = Math.max(0, solarFactor * 590);
    const temp = -115 + solarFactor * 135;

    // Check Sol 5 objective (survive night)
    if (!isDay && !state.objectives.find((o) => o.id === 'obj-5')?.completed) {
      state.completeObjective('obj-5');
    }

    // 2. Compute Player Vitals
    let { health, oxygen, power, coreTemp, suitIntegrity, radiationDose } = state.vitals;

    if (state.isInsideHab) {
      oxygen = Math.min(100, oxygen + deltaSeconds * 4.0);
      power = Math.min(100, power + deltaSeconds * 3.5);
      coreTemp = 37.0;
      health = Math.min(100, health + deltaSeconds * 1.5);
    } else {
      const o2Burn = 0.12 * deltaSeconds;
      oxygen = Math.max(0, oxygen - o2Burn);

      const heatingLoad = Math.max(0, (20 - temp) * 0.0035);
      const solarRecharge = (irradiance / 590) * 0.08 * (1 - state.solCycle.dustStormIntensity);
      const powerDelta = (-0.1 - heatingLoad + solarRecharge) * deltaSeconds;
      power = Math.max(0, Math.min(100, power + powerDelta));

      if (power <= 0) {
        coreTemp = Math.max(-50, coreTemp - 0.25 * deltaSeconds);
      } else {
        coreTemp = Math.min(37.0, coreTemp + 0.05 * deltaSeconds);
      }

      const radRate = 0.0008 * (1 + (1 - state.solCycle.dustStormIntensity) * 0.5);
      radiationDose += radRate * deltaSeconds;

      if (oxygen <= 0) health -= 5.0 * deltaSeconds;
      if (coreTemp < 32) health -= 3.0 * deltaSeconds;
      if (radiationDose > 250) health -= 1.0 * deltaSeconds;
    }

    if (oxygen < 15 || power < 10) {
      audioSystem.triggerCriticalAlarm(true);
    } else {
      audioSystem.triggerCriticalAlarm(false);
    }

    if (health <= 0) {
      let reason = 'Biological vital collapse.';
      if (oxygen <= 0) reason = 'Asphyxiation — Oxygen tank exhausted in Jezero atmosphere.';
      else if (coreTemp < 32) reason = 'Hypothermia — Suit heating depleted during freezing Martian night.';
      else if (radiationDose > 250) reason = 'Fatal acute solar cosmic radiation exposure.';

      audioSystem.triggerCriticalAlarm(false);
      set({
        isGameOver: true,
        gameOverReason: reason,
        vitals: { health: 0, oxygen, power, coreTemp, suitIntegrity, radiationDose },
      });
      return;
    }

    // Rover passive solar recharge during daylight
    let currentRoverBattery = state.roverTelemetry.batteryPercent;
    if (isDay && state.settings.controlMode !== 'driving_rover') {
      currentRoverBattery = Math.min(100, currentRoverBattery + deltaSeconds * 0.2);
    }

    set({
      vitals: { health, oxygen, power, coreTemp, suitIntegrity, radiationDose },
      roverTelemetry: {
        ...state.roverTelemetry,
        batteryPercent: currentRoverBattery,
      },
      solCycle: {
        solNumber: newSol,
        timeOfDay: newTime,
        surfaceTemp: Math.round(temp),
        solarIrradiance: Math.round(irradiance),
        dustStormIntensity: state.solCycle.dustStormIntensity,
        isDaytime: isDay,
      },
    });
  },

  gatherResource: (nodeId: string) => {
    const state = get();
    const node = state.resourceNodes.find((n) => n.id === nodeId);
    if (!node || node.depleted) return;

    // Check backpack weight capacity
    const item = state.inventory[node.type];
    const unitWeight = item?.weightPerUnit ?? 1.0;
    const addedWeight = node.yieldCount * unitWeight;
    const currentWeight = calculateBackpackWeight(state.inventory);

    if (currentWeight + addedWeight > state.maxBackpackCapacity + 0.001) {
      audioSystem.playAlarm();
      state.showNotification(
        `BACKPACK OVERBURDENED! +${addedWeight.toFixed(1)} kg exceeds max capacity (${state.maxBackpackCapacity.toFixed(1)} kg). Deposit materials at Outpost Storage.`
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
        count: item.count + node.yieldCount,
      },
    };

    const newCollectedIds = state.collectedNodeIds.includes(nodeId)
      ? state.collectedNodeIds
      : [...state.collectedNodeIds, nodeId];

    const newWeight = calculateBackpackWeight(updatedInventory);

    if (node.type === 'water_ice') state.completeObjective('obj-2');
    if (node.type === 'titanium_scrap') state.completeObjective('obj-3');

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
      notification: `Extracted +${node.yieldCount} ${node.name} (${addedWeight.toFixed(1)} kg)`,
    });

    writeSaveState({
      inventory: updatedInventory,
      vaultStorage: state.vaultStorage,
      renovations: state.renovations,
      collectedNodeIds: newCollectedIds,
      maxBackpackCapacity: state.maxBackpackCapacity,
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
    // Check if player stepped across the interior threshold (z < 6.0 and radius < 7.2)
    const distToCenter = Math.hypot(pos[0], pos[2]);
    const isNowInside = distToCenter < 7.2 && pos[2] < 6.2;
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
    });
  },

  closeSubstanceModal: () => {
    set({ isSubstanceModalOpen: false });
  },

  openStorageModal: () => {
    audioSystem.playChime(750);
    set({
      isStorageModalOpen: true,
      isPauseModalOpen: false,
      isRenovationModalOpen: false,
      isSubstanceModalOpen: false,
    });
  },

  closeStorageModal: () => {
    audioSystem.playChime(600);
    set({ isStorageModalOpen: false });
  },

  openRenovationModal: () => {
    audioSystem.playChime(850);
    set({
      isRenovationModalOpen: true,
      isPauseModalOpen: false,
      isStorageModalOpen: false,
      isSubstanceModalOpen: false,
    });
  },

  closeRenovationModal: () => {
    audioSystem.playChime(600);
    set({ isRenovationModalOpen: false });
  },

  depositToStorage: (type: ResourceType, count: number) => {
    const state = get();
    const item = state.inventory[type];
    if (!item || item.count < count || count <= 0) return;

    const updatedInventory = {
      ...state.inventory,
      [type]: {
        ...item,
        count: item.count - count,
      },
    };

    const updatedVault = {
      ...state.vaultStorage,
      [type]: (state.vaultStorage[type] || 0) + count,
    };

    const newWeight = calculateBackpackWeight(updatedInventory);
    audioSystem.playChime(950);

    set({
      inventory: updatedInventory,
      vaultStorage: updatedVault,
      backpackWeight: newWeight,
      notification: `Deposited ${count}x ${item.name} to Outpost Vault.`,
    });

    writeSaveState({
      inventory: updatedInventory,
      vaultStorage: updatedVault,
      renovations: state.renovations,
      collectedNodeIds: state.collectedNodeIds,
      maxBackpackCapacity: state.maxBackpackCapacity,
    });
  },

  depositAllToStorage: () => {
    const state = get();
    const updatedInventory = { ...state.inventory };
    const updatedVault = { ...state.vaultStorage };
    let totalMoved = 0;

    for (const key of Object.keys(updatedInventory) as ResourceType[]) {
      const it = updatedInventory[key];
      if (it && it.count > 0) {
        updatedVault[key] = (updatedVault[key] || 0) + it.count;
        totalMoved += it.count;
        updatedInventory[key] = { ...it, count: 0 };
      }
    }

    if (totalMoved === 0) {
      state.showNotification('Backpack is already empty. No materials to deposit.');
      return;
    }

    const newWeight = calculateBackpackWeight(updatedInventory);
    audioSystem.playChime(1100);

    set({
      inventory: updatedInventory,
      vaultStorage: updatedVault,
      backpackWeight: newWeight,
      notification: `Transferred all ${totalMoved} items to Outpost Vault.`,
    });

    writeSaveState({
      inventory: updatedInventory,
      vaultStorage: updatedVault,
      renovations: state.renovations,
      collectedNodeIds: state.collectedNodeIds,
      maxBackpackCapacity: state.maxBackpackCapacity,
    });
  },

  withdrawFromStorage: (type: ResourceType, count: number) => {
    const state = get();
    const available = state.vaultStorage[type] || 0;
    if (available < count || count <= 0) return;

    const item = state.inventory[type];
    const unitWeight = item?.weightPerUnit ?? 1.0;
    const addedWeight = count * unitWeight;
    const currentWeight = calculateBackpackWeight(state.inventory);

    if (currentWeight + addedWeight > state.maxBackpackCapacity + 0.001) {
      audioSystem.playAlarm();
      state.showNotification(
        `BACKPACK CAPACITY EXCEEDED: Cannot withdraw ${count}x (${addedWeight.toFixed(1)} kg). Space left: ${(state.maxBackpackCapacity - currentWeight).toFixed(1)} kg.`
      );
      return;
    }

    const updatedVault = {
      ...state.vaultStorage,
      [type]: available - count,
    };

    const updatedInventory = {
      ...state.inventory,
      [type]: {
        ...item,
        count: item.count + count,
      },
    };

    const newWeight = calculateBackpackWeight(updatedInventory);
    audioSystem.playChime(800);

    set({
      inventory: updatedInventory,
      vaultStorage: updatedVault,
      backpackWeight: newWeight,
      notification: `Withdrew ${count}x ${item.name} into Backpack.`,
    });

    writeSaveState({
      inventory: updatedInventory,
      vaultStorage: updatedVault,
      renovations: state.renovations,
      collectedNodeIds: state.collectedNodeIds,
      maxBackpackCapacity: state.maxBackpackCapacity,
    });
  },

  purchaseRenovation: (upgradeId: UpgradeId) => {
    const state = get();
    if (state.renovations[upgradeId]) {
      return { success: false, message: 'Facility upgrade is already completed and fully operational.' };
    }

    const upgrade = UPGRADES_DATABASE.find((u) => u.id === upgradeId);
    if (!upgrade) {
      return { success: false, message: 'Invalid upgrade sector.' };
    }

    // Verify costs against vaultStorage
    const missing: string[] = [];
    for (const costItem of upgrade.cost) {
      const have = state.vaultStorage[costItem.type] || 0;
      if (have < costItem.count) {
        const itemInfo = state.inventory[costItem.type];
        const itemName = itemInfo?.name || costItem.type;
        missing.push(`${costItem.count - have}x ${itemName}`);
      }
    }

    if (missing.length > 0) {
      audioSystem.playAlarm();
      return {
        success: false,
        message: `Insufficient vault materials! Missing: ${missing.join(', ')}. Deposit required materials into the Vault.`,
      };
    }

    // Deduct materials from vaultStorage
    const updatedVault = { ...state.vaultStorage };
    for (const costItem of upgrade.cost) {
      updatedVault[costItem.type] = (updatedVault[costItem.type] || 0) - costItem.count;
    }

    const updatedRenovations = {
      ...state.renovations,
      [upgradeId]: true,
    };

    let newMaxCapacity = state.maxBackpackCapacity;
    if (upgradeId === 'storage_room') {
      newMaxCapacity = 35.0; // Reinforced storage backpack
    }

    audioSystem.playChime(1300);

    set({
      vaultStorage: updatedVault,
      renovations: updatedRenovations,
      maxBackpackCapacity: newMaxCapacity,
      notification: `OUTPOST UPGRADE COMPLETE: ${upgrade.name} is now ONLINE!`,
    });

    writeSaveState({
      inventory: state.inventory,
      vaultStorage: updatedVault,
      renovations: updatedRenovations,
      collectedNodeIds: state.collectedNodeIds,
      maxBackpackCapacity: newMaxCapacity,
    });

    return { success: true, message: `Successfully upgraded ${upgrade.name}!` };
  },

  resetSaveData: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({
      vitals: { ...INITIAL_VITALS },
      inventory: { ...INITIAL_INVENTORY },
      vaultStorage: { ...INITIAL_VAULT_STORAGE },
      renovations: { ...INITIAL_RENOVATIONS },
      collectedNodeIds: [],
      maxBackpackCapacity: 20.0,
      backpackWeight: calculateBackpackWeight(INITIAL_INVENTORY),
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

  updateRoverTelemetry: (speedKmH: number, batteryDelta = 0, gear: 'D' | 'N' | 'R' = 'D') => {
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
    if (ice.count < 2) {
      state.showNotification('Need 2x Subsurface Water Ice to electrolyze O2.');
      return;
    }

    audioSystem.playChime(1000);
    set({
      inventory: {
        ...state.inventory,
        water_ice: { ...ice, count: ice.count - 2 },
      },
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
    if (scrap.count < 1) {
      state.showNotification('Need 1x Titanium Scrap for suit patch.');
      return;
    }

    audioSystem.playChime(950);
    set({
      inventory: {
        ...state.inventory,
        titanium_scrap: { ...scrap, count: scrap.count - 1 },
      },
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
          count: item.count + obj.rewardResource.count,
        },
      };
    }

    set({
      objectives: updated,
      inventory,
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
    const capacity = saved?.maxBackpackCapacity || 20.0;
    const inv = saved?.inventory ? { ...INITIAL_INVENTORY, ...saved.inventory } : { ...INITIAL_INVENTORY };
    const vault = saved?.vaultStorage ? { ...INITIAL_VAULT_STORAGE, ...saved.vaultStorage } : { ...INITIAL_VAULT_STORAGE };
    const reno = saved?.renovations ? { ...INITIAL_RENOVATIONS, ...saved.renovations } : { ...INITIAL_RENOVATIONS };
    const colIds = saved?.collectedNodeIds || [];

    set({
      vitals: { ...INITIAL_VITALS },
      inventory: inv,
      vaultStorage: vault,
      renovations: reno,
      collectedNodeIds: colIds,
      maxBackpackCapacity: capacity,
      backpackWeight: calculateBackpackWeight(inv),
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
      targetedInteractable: null,
      selectedSubstance: null,
      cameraLook: { yaw: Math.PI, pitch: 0.15 },
      roverTelemetry: { speedKmH: 0, batteryPercent: 100, gear: 'N' },
      notification: 'Mission Re-initialized. Step out onto Jezero Crater.',
    });
  },
}));
