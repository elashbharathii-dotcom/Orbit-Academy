export interface PlayerVitals {
  health: number; // 0 - 100
  oxygen: number; // 0 - 100 (%)
  food: number; // 0 - 100 (%)
  water: number; // 0 - 100 (%)
  power: number; // 0 - 100 (%) (suit battery)
  coreTemp: number; // Celsius, nominal 37.0°C
  suitTemp: number; // Celsius, nominal 20.0°C inside suit
  habTemp: number; // Celsius, nominal 21.0°C inside habitat
  suitIntegrity: number; // 0 - 100 (%)
  radiationDose: number; // mSv accumulated
}

export type ResourceCategory = 'material' | 'component' | 'mineral' | 'consumable';
export type ResourceRarity = 'common' | 'uncommon' | 'rare' | 'exotic';

export type ResourceType =
  // Initial Survival & Crafting Resources
  | 'scrap_metal'
  | 'copper_wire'
  | 'circuit_board'
  | 'fasteners'
  | 'battery_cell'
  | 'polymer'
  | 'food_ration'
  | 'water'
  | 'medical_kit'
  // Phase 4 Processed & Manufactured Components
  | 'metal_plate'
  | 'wire_assembly'
  | 'repair_kit'
  | 'battery_pack'
  | 'structural_frame'
  | 'electronics_module'
  // Native Planetary Science & Station Debris Resources
  | 'electronic_parts'
  | 'damaged_battery'
  | 'mechanical_parts'
  | 'scientific_sample'
  | 'water_ice'
  | 'hematite'
  | 'silicate_crystal'
  | 'sulfur_mineral'
  | 'regolith'
  | 'titanium_scrap'
  | 'solar_cell';

export interface ConsumableEffect {
  health?: number;
  food?: number;
  water?: number;
  oxygen?: number;
  power?: number;
  coreTemp?: number;
  suitIntegrity?: number;
}

export interface ResourceDefinition {
  id: ResourceType;
  name: string;
  chemicalFormula?: string;
  category: ResourceCategory;
  weightPerUnit: number; // in kg
  stackLimit: number;
  icon: string;
  rarity: ResourceRarity;
  description: string;
  scientificProperties?: string;
  marsStationUsefulness?: string;
  consumableEffect?: ConsumableEffect;
}

export const BACKPACK_BASE_CAPACITY = 25.0; // kg
export const BACKPACK_EXPANDED_CAPACITY = 40.0; // kg
export const ROVER_STORAGE_CAPACITY = 100.0; // kg
export const VAULT_STORAGE_CAPACITY = 500.0; // kg

export type StorageContainerType = 'backpack' | 'rover' | 'vault';

export const RESOURCE_DEFINITIONS: Record<ResourceType, ResourceDefinition> = {
  scrap_metal: {
    id: 'scrap_metal',
    name: 'Structural Scrap Metal',
    chemicalFormula: 'Fe-Al-Ti Structural Alloy',
    category: 'material',
    weightPerUnit: 0.8,
    stackLimit: 50,
    icon: 'Wrench',
    rarity: 'common',
    description: 'High-tensile structural alloy framing salvaged from landed heat shields and descent stages.',
    scientificProperties: 'Tensile yield strength: 850 MPa, corrosion resistant in carbon-dioxide atmospheres.',
    marsStationUsefulness: 'Primary construction feedstock for base bulkhead repair, door frames, and storage lockers.',
  },
  copper_wire: {
    id: 'copper_wire',
    name: 'Copper Wiring Harness',
    chemicalFormula: 'Cu (99.9% Electrolytic)',
    category: 'component',
    weightPerUnit: 0.3,
    stackLimit: 60,
    icon: 'Cable',
    rarity: 'common',
    description: 'Ductile high-conductivity copper cabling salvaged from avionics wiring harnesses.',
    scientificProperties: 'Resistivity: 1.68 × 10^-8 Ω•m, shielded in fluoropolymer insulation.',
    marsStationUsefulness: 'Crucial for rewiring habitat power distribution grids and sensor telemetry channels.',
  },
  circuit_board: {
    id: 'circuit_board',
    name: 'Integrated Circuit Board',
    chemicalFormula: 'Si-Cu-Au (Polyimide PCB)',
    category: 'component',
    weightPerUnit: 0.2,
    stackLimit: 40,
    icon: 'Cpu',
    rarity: 'uncommon',
    description: 'Radiation-hardened multi-layer printed circuit board from probe guidance pods.',
    scientificProperties: 'Rad-hardened to 100 krad, high clock frequency signal bus with gold-plated trace contacts.',
    marsStationUsefulness: 'Essential for computer logic modules, life-support microcontrollers, and radar arrays.',
  },
  fasteners: {
    id: 'fasteners',
    name: 'Titanium Fasteners',
    chemicalFormula: 'Ti-6Al-4V Grade 5',
    category: 'material',
    weightPerUnit: 0.1,
    stackLimit: 100,
    icon: 'Screw',
    rarity: 'common',
    description: 'Aerospace-grade high-shear titanium bolts, blind rivets, and quick-lock fasteners.',
    scientificProperties: 'Density: 4.43 g/cm³, exceptional shear resistance under cryogenic thermal cycling.',
    marsStationUsefulness: 'Used in every structural assembly, mounting brackets, and airlock pressure seals.',
  },
  battery_cell: {
    id: 'battery_cell',
    name: 'Solid-State Battery Cell',
    chemicalFormula: 'Li2S-Si (Lithium-Sulfur Solid State)',
    category: 'component',
    weightPerUnit: 0.7,
    stackLimit: 30,
    icon: 'BatteryCharging',
    rarity: 'uncommon',
    description: 'High-density solid-state battery cell capable of continuous sub-zero operation.',
    scientificProperties: 'Energy density: 450 Wh/kg, ceramic electrolyte prevents dendrite formation.',
    marsStationUsefulness: 'Rebuilds rover power banks, portable field analyzers, and habitat auxiliary backup systems.',
  },
  polymer: {
    id: 'polymer',
    name: 'Composite Polymer Sheet',
    chemicalFormula: '(C22H10N2O5)n (Kapton / Kevlar)',
    category: 'material',
    weightPerUnit: 0.4,
    stackLimit: 50,
    icon: 'FileText',
    rarity: 'common',
    description: 'Flexible radiation-shielding Kapton film and Kevlar woven ballistic composite layers.',
    scientificProperties: 'Thermal stability from -269°C to +400°C, zero outgassing in vacuum.',
    marsStationUsefulness: 'Seals inflatable habitat modules, patches astronaut EVA suits, and lines hydroponic bays.',
  },
  food_ration: {
    id: 'food_ration',
    name: 'Emergency Food Ration',
    chemicalFormula: 'Nutrient-Dense Carbohydrates & Proteins',
    category: 'consumable',
    weightPerUnit: 0.3,
    stackLimit: 40,
    icon: 'UtensilsCrossed',
    rarity: 'common',
    description: 'Vacuum-sealed freeze-dried metabolic sustenance pack engineered for planetary field exploration.',
    scientificProperties: 'Caloric density: 3,200 kcal/pack, fortified with electrolytes and Vitamin D3.',
    marsStationUsefulness: 'Restores +15 astronaut health and +45 food calories to prevent starvation during arduous EVAs.',
    consumableEffect: { health: 15, food: 45 },
  },
  water: {
    id: 'water',
    name: 'Potable Water Pack',
    chemicalFormula: 'H2O (Sterile Drinking Water)',
    category: 'consumable',
    weightPerUnit: 0.5,
    stackLimit: 30,
    icon: 'Droplet',
    rarity: 'common',
    description: 'Hermetically sealed insulated flask of ultrapure drinking water with dissolved mineral salts.',
    scientificProperties: 'TDS: 120 ppm, free of perchlorates and micro-contaminants.',
    marsStationUsefulness: 'Restores +50 hydration and stabilizes internal core body temperature homeostasis.',
    consumableEffect: { health: 5, water: 50, coreTemp: 0.5 },
  },
  medical_kit: {
    id: 'medical_kit',
    name: 'Emergency Trauma Medkit',
    chemicalFormula: 'Coagulants, Dermal Gel & Antibiotics',
    category: 'consumable',
    weightPerUnit: 0.6,
    stackLimit: 20,
    icon: 'HeartPulse',
    rarity: 'rare',
    description: 'Field trauma kit containing fast-acting fibrin sealant, analgesic auto-injectors, and dermal patches.',
    scientificProperties: 'Accelerates wound closure, prevents septic infection, and patches minor suit puncture micro-leaks.',
    marsStationUsefulness: 'Restores +50 astronaut health and reinforces EVA suit integrity by +20%.',
    consumableEffect: { health: 50, suitIntegrity: 20 },
  },
  electronic_parts: {
    id: 'electronic_parts',
    name: 'Micro-Circuit Components',
    chemicalFormula: 'Si-GaAs Sensor Microcontroller',
    category: 'component',
    weightPerUnit: 0.4,
    stackLimit: 50,
    icon: 'Cpu',
    rarity: 'uncommon',
    description: 'Integrated circuits, optical sensors, and avionics processor boards.',
    scientificProperties: 'High-current power conversion module handling up to 600V DC-to-AC conversion.',
    marsStationUsefulness: 'Required for base power room synchronization, rover repairs, and greenhouse arrays.',
  },
  damaged_battery: {
    id: 'damaged_battery',
    name: 'High-Capacity Cell Battery',
    chemicalFormula: 'Li-Ion Auxiliary Module',
    category: 'component',
    weightPerUnit: 1.5,
    stackLimit: 20,
    icon: 'Battery',
    rarity: 'common',
    description: 'Degraded multi-cell rover battery pack requiring reconditioning and cell rebalancing.',
    scientificProperties: 'Specific energy: 280 Wh/kg, solid-state impact enclosure.',
    marsStationUsefulness: 'Reconditionable for outpost backup energy reserves and rover extended range.',
  },
  mechanical_parts: {
    id: 'mechanical_parts',
    name: 'Mechanical Drive Actuator',
    chemicalFormula: 'Steel-NdFeB Harmonic Gearhead',
    category: 'component',
    weightPerUnit: 1.2,
    stackLimit: 25,
    icon: 'Settings',
    rarity: 'uncommon',
    description: 'Precision robotic gearhead actuator designed for extreme planetary dust resistance.',
    scientificProperties: 'Gear ratio: 160:1, titanium casing, sealed ceramic bearings.',
    marsStationUsefulness: 'Repairs heavy mechanical sliding doors and greenhouse ventilation baffles.',
  },
  scientific_sample: {
    id: 'scientific_sample',
    name: 'Jezero Astrobiology Core',
    chemicalFormula: 'SiO2-Fe-Carbonate Micro-matrix',
    category: 'mineral',
    weightPerUnit: 0.5,
    stackLimit: 30,
    icon: 'Microscope',
    rarity: 'rare',
    description: 'Sediment core sample from Jezero Crater delta containing potential organic biomarker signatures.',
    scientificProperties: 'Preserves micro-textures resembling terrestrial Archean stromatolites.',
    marsStationUsefulness: 'High-priority science return for Earth sample analysis and base research certification.',
  },
  water_ice: {
    id: 'water_ice',
    name: 'Subsurface Water Ice',
    chemicalFormula: 'H2O (Ice Ih + hydrated clays)',
    category: 'mineral',
    weightPerUnit: 1.0,
    stackLimit: 40,
    icon: 'Droplets',
    rarity: 'common',
    description: 'Excavated permafrost glacio-lacustrine ice preserved beneath insulating regolith.',
    scientificProperties: 'Purity: 94.2% H2O, sublimation point -68°C at 6.1 mbar.',
    marsStationUsefulness: 'Electrolyzed into breathable suit oxygen or purified into habitat drinking water.',
  },
  hematite: {
    id: 'hematite',
    name: 'Crystalline Hematite (Fe2O3)',
    chemicalFormula: 'Fe2O3 (Iron(III) Oxide)',
    category: 'mineral',
    weightPerUnit: 1.2,
    stackLimit: 40,
    icon: 'Layers',
    rarity: 'common',
    description: 'Spherical concretion nodules ("Martian Blueberries") formed by ancient groundwater percolation.',
    scientificProperties: 'Hardness: 6.0 Mohs, 69.9% elemental iron content by mass.',
    marsStationUsefulness: 'Primary ore for solar-smelting structural steel and radiation shielding bricks.',
  },
  silicate_crystal: {
    id: 'silicate_crystal',
    name: 'Silicate Quartz Crystal',
    chemicalFormula: 'SiO2 (Silicon Dioxide)',
    category: 'mineral',
    weightPerUnit: 0.8,
    stackLimit: 30,
    icon: 'Sparkles',
    rarity: 'uncommon',
    description: 'Pure quartz-family crystalline silicon dioxide core suitable for high-precision optical mirrors.',
    scientificProperties: 'Hardness: 7.0 Mohs, piezoelectric properties, transparent in visual spectrum.',
    marsStationUsefulness: 'Optical lenses for solar concentrators, laser comms, and viewport pressure tiles.',
  },
  sulfur_mineral: {
    id: 'sulfur_mineral',
    name: 'Hydrated Sulfate Mineral',
    chemicalFormula: 'CaSO4 • 2H2O (Gypsum / Bassanite)',
    category: 'mineral',
    weightPerUnit: 0.7,
    stackLimit: 40,
    icon: 'Gem',
    rarity: 'uncommon',
    description: 'Hydrated calcium sulfate evaporite veins precipitated during the drying of ancient Lake Jezero.',
    scientificProperties: 'Hardness: 2.0 Mohs, releases bound water vapor upon heating to 120°C.',
    marsStationUsefulness: 'Production of anhydrous sulfur concrete for waterless construction; electrolyte synthesis.',
  },
  regolith: {
    id: 'regolith',
    name: 'Jezero Smectite Regolith',
    chemicalFormula: 'Al2Si4O10(OH)2 • Fe Smectite',
    category: 'mineral',
    weightPerUnit: 1.5,
    stackLimit: 50,
    icon: 'Mountain',
    rarity: 'common',
    description: 'Phyllosilicate clay dust and volcanic ash forming the fertile Martian surface soil matrix.',
    scientificProperties: 'Grain size < 50 μm, rich in clay silicates with high cation exchange capacity.',
    marsStationUsefulness: 'Plant growth medium inside greenhouse bio-domes and exterior thermal mass shielding.',
  },
  titanium_scrap: {
    id: 'titanium_scrap',
    name: 'Aerospace Titanium Debris',
    chemicalFormula: 'Ti-6Al-4V Aerospace Debris',
    category: 'material',
    weightPerUnit: 1.1,
    stackLimit: 30,
    icon: 'Disc',
    rarity: 'rare',
    description: 'Salvaged aerospace grade 5 titanium structural panel from descent stage backshell remnants.',
    scientificProperties: 'Density: 4.43 g/cm³, superior strength-to-weight ratio.',
    marsStationUsefulness: 'Crucial for patching suit micro-punctures and reinforcing habitat airlocks.',
  },
  solar_cell: {
    id: 'solar_cell',
    name: 'Triple-Junction Solar Cell',
    chemicalFormula: 'GaInP / GaAs / Ge',
    category: 'component',
    weightPerUnit: 0.3,
    stackLimit: 30,
    icon: 'Sun',
    rarity: 'rare',
    description: 'High-efficiency triple-junction photovoltaic wafer recovered from solar wing arrays.',
    scientificProperties: 'Solar conversion efficiency: 32% under Mars AM0/AM1.5 spectrum.',
    marsStationUsefulness: 'Reconstructs high-output photovoltaic arrays and habitat solar tracker wings.',
  },
  metal_plate: {
    id: 'metal_plate',
    name: 'Machined Metal Plate',
    chemicalFormula: 'Fe-Al-Ti Consolidated Alloy',
    category: 'material',
    weightPerUnit: 1.8,
    stackLimit: 40,
    icon: 'Layers',
    rarity: 'common',
    description: 'Precision-rolled high-tensile structural alloy sheet forged from raw scrap metal.',
    scientificProperties: 'Surface planarity < 0.1 mm, cold-weld resistance in vacuum.',
    marsStationUsefulness: 'Primary component for frames, repair kits, and outpost reinforcements.',
  },
  wire_assembly: {
    id: 'wire_assembly',
    name: 'Insulated Wire Assembly',
    chemicalFormula: 'Cu Loom with PTFE Shield',
    category: 'component',
    weightPerUnit: 0.5,
    stackLimit: 50,
    icon: 'Cpu',
    rarity: 'common',
    description: 'Braided conductive copper cabling harness with crimped aerospace terminals.',
    scientificProperties: 'High-current transmission bus, rated for cryogenic thermal extremes.',
    marsStationUsefulness: 'Essential for battery packs, power distribution, and robotics.',
  },
  repair_kit: {
    id: 'repair_kit',
    name: 'Multi-System Repair Kit',
    chemicalFormula: 'Titanium-Patch & Sealant Array',
    category: 'consumable',
    weightPerUnit: 1.4,
    stackLimit: 15,
    icon: 'Wrench',
    rarity: 'uncommon',
    description: 'Comprehensive field restoration kit: fully restores EVA suit integrity or repairs rover mechanics.',
    scientificProperties: 'Rapid pressure curing, composite adhesive bond strength > 20 MPa.',
    marsStationUsefulness: 'Instantly restores 100% Suit Integrity and fixes rover mechanical faults.',
    consumableEffect: { suitIntegrity: 100 },
  },
  battery_pack: {
    id: 'battery_pack',
    name: 'Auxiliary Battery Pack',
    chemicalFormula: 'Li2S Solid-State Multi-Cell',
    category: 'component',
    weightPerUnit: 1.6,
    stackLimit: 20,
    icon: 'BatteryCharging',
    rarity: 'uncommon',
    description: 'High-density solid-state lithium-sulfur power module: replenishes rover power by +45%.',
    scientificProperties: 'Capacity: 1.2 kWh, integrated thermal management circuit.',
    marsStationUsefulness: 'Mountable auxiliary battery to boost rover expedition endurance.',
  },
  structural_frame: {
    id: 'structural_frame',
    name: 'Welded Structural Frame',
    chemicalFormula: 'Ti-6Al-4V Space Frame Girder',
    category: 'material',
    weightPerUnit: 4.5,
    stackLimit: 15,
    icon: 'Layers',
    rarity: 'rare',
    description: 'Rigid aerospace titanium-alloy space-frame girder welded from machined plates and fasteners.',
    scientificProperties: 'Load bearing: 80 kN, structural rigidity across extreme temperature swings.',
    marsStationUsefulness: 'Key building block for habitat dome expansions and heavy storage lockers.',
  },
  electronics_module: {
    id: 'electronics_module',
    name: 'Avionics Electronics Module',
    chemicalFormula: 'Si-Au Multi-Chip Computing Core',
    category: 'component',
    weightPerUnit: 1.2,
    stackLimit: 25,
    icon: 'Cpu',
    rarity: 'rare',
    description: 'Radiation-hardened microprocessor computing brick for habitat telemetry and radar automation.',
    scientificProperties: 'Tri-redundant radiation-hardened logic, 100 krad total ionizing dose rating.',
    marsStationUsefulness: 'Required for deep-space telemetry arrays and autonomous station systems.',
  },
};

export interface SubstanceDetails {
  id: string;
  name: string;
  chemicalFormula: string;
  category: string;
  description: string;
  scientificProperties: string;
  marsStationUsefulness: string;
  canBeCollected: boolean;
  discoveryStatus: 'Discovered' | 'Analyzed' | 'Depleted';
}

export interface ResourceItem {
  id: ResourceType;
  name: string;
  count: number;
  description: string;
  icon: string;
  weightPerUnit: number; // kg
  category: ResourceCategory;
  rarity: ResourceRarity;
  stackLimit: number;
}

export interface ResourceNodeData {
  id: string;
  type: ResourceType;
  name: string;
  chemicalFormula: string;
  category: string;
  description: string;
  scientificProperties: string;
  marsStationUsefulness: string;
  position: [number, number, number];
  yieldCount: number;
  depleted: boolean;
  scanDiscovered: boolean;
}

export type InteractableType =
  | 'airlock_door'
  | 'power_terminal'
  | 'moxie_unit'
  | 'solar_inverter'
  | 'rover'
  | 'rover_storage'
  | 'resource_node'
  | 'storage_terminal'
  | 'renovation_terminal'
  | 'crafting_station'
  | 'disassembly_station'
  | 'facility_terminal'
  | 'bunk_bed'
  | 'greenhouse_harvest'
  | 'garage_charger'
  | 'power_grid_console'
  | 'mission_terminal'
  | 'research_terminal'
  | 'exploration_landmark'
  | 'scannable_target'
  | 'intelligent_base_console'
  | 'robot_companion';

export type UpgradeId =
  | 'power_room'
  | 'storage_room'
  | 'greenhouse'
  | 'comm_room'
  | 'hab_expansion';

export interface UpgradeCostItem {
  type: ResourceType;
  count: number;
}

export interface UpgradeDefinition {
  id: UpgradeId;
  name: string;
  stageNumber: number;
  description: string;
  cost: UpgradeCostItem[];
  unlockedBenefits: string[];
}

export interface RenovationStatus {
  power_room: boolean;
  storage_room: boolean;
  greenhouse: boolean;
  comm_room: boolean;
  hab_expansion: boolean;
}

export interface InteractableObject {
  id: string;
  type: InteractableType;
  name: string;
  promptText: string;
  position: [number, number, number];
  interactionRadius: number;
  resourceData?: ResourceNodeData;
}

export type WeatherType = 'clear' | 'light_dust' | 'heavy_dust';

export interface SolCycle {
  solNumber: number;
  timeOfDay: number; // 0 to 24.65 (Martian hours, 1 Mars sol ~ 24h 39m)
  surfaceTemp: number; // Celsius (-120°C to +20°C)
  solarIrradiance: number; // W/m^2 (0 at night to ~590 peak)
  dustStormIntensity: number; // 0.0 (clear) to 1.0 (severe storm)
  isDaytime: boolean;
  weather: WeatherType;
  weatherDuration: number; // Seconds remaining in current weather state
}

export interface BasePowerGrid {
  batteryStorageKWh: number; // 0 to 100 kWh
  maxBatteryKWh: number; // 100 kWh
  solarOutputKW: number; // Generation from photovoltaic array
  totalConsumptionKW: number; // Total active consumption
  facilityCircuits: {
    life_support: boolean; // 3.0 kW
    living_quarters: boolean; // 1.5 kW
    greenhouse: boolean; // 2.5 kW
    engineering_workshop: boolean; // 2.0 kW
    comm_room: boolean; // 1.5 kW
  };
  isBlackout: boolean;
}

export type CropStage = 'empty' | 'planted' | 'growing' | 'ready';

export interface GreenhouseCropState {
  stage: CropStage;
  progressPercent: number; // 0 - 100
  waterSpent: number;
  growthTimeRemaining: number; // In-game seconds
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: 'survival' | 'exploration' | 'science';
  rewardResource?: { type: ResourceType; count: number };
}

export type ControlMode = 'on_foot' | 'driving_rover';

export interface RoverTelemetry {
  speedKmH: number;
  batteryPercent: number;
  gear: 'D' | 'N' | 'R' | 'P';
}

export interface GameSettings {
  soundEnabled: boolean;
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  graphicsQuality: 'low' | 'medium' | 'high';
  visorScanActive: boolean;
  controlMode: ControlMode;
  thirdPerson: boolean;
}
