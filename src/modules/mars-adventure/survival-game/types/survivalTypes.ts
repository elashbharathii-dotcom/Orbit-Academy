export interface PlayerVitals {
  health: number; // 0 - 100
  oxygen: number; // 0 - 100 (%)
  power: number; // 0 - 100 (%) (suit battery)
  coreTemp: number; // Celsius, nominal 37.0°C
  suitIntegrity: number; // 0 - 100 (%)
  radiationDose: number; // mSv accumulated
}

export type ResourceType =
  | 'scrap_metal'
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
  | 'resource_node'
  | 'storage_terminal'
  | 'renovation_terminal';

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

export interface SolCycle {
  solNumber: number;
  timeOfDay: number; // 0 to 24 (Martian hours, 1 Mars sol ~ 24h 39m)
  surfaceTemp: number; // Celsius (-120°C to +20°C)
  solarIrradiance: number; // W/m^2 (0 at night to ~590 peak)
  dustStormIntensity: number; // 0.0 (clear) to 1.0 (severe storm)
  isDaytime: boolean;
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
  gear: 'D' | 'N' | 'R';
}

export interface GameSettings {
  soundEnabled: boolean;
  visorScanActive: boolean;
  controlMode: ControlMode;
  thirdPerson: boolean;
}
