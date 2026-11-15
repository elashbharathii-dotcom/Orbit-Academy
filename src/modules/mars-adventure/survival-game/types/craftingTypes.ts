import { ResourceType } from './survivalTypes';

export type CraftingCategory = 'structural' | 'electrical' | 'utility';

export interface CraftingIngredient {
  type: ResourceType;
  count: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  category: CraftingCategory;
  inputs: CraftingIngredient[];
  output: {
    type: ResourceType;
    count: number;
  };
  durationSeconds: number;
  icon: string;
}

export interface DisassemblyRecipe {
  sourceType: ResourceType;
  name: string;
  description: string;
  outputs: CraftingIngredient[];
  durationSeconds: number;
}

export interface ActiveCraftingJob {
  id: string;
  recipeId: string;
  recipeName: string;
  progressSeconds: number;
  durationSeconds: number;
  sourceStorage: 'backpack' | 'vault';
  targetStorage: 'backpack' | 'vault';
  inputs: CraftingIngredient[];
  output: {
    type: ResourceType;
    count: number;
  };
}

export interface CraftingHistoryEntry {
  id: string;
  recipeName: string;
  outputType: ResourceType;
  outputCount: number;
  targetStorage: 'backpack' | 'vault';
  timestamp: string;
}

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'recipe_metal_plate',
    name: 'Machined Metal Plate',
    description: 'Precision-rolled high-tensile structural alloy plate forged from scrap metal.',
    category: 'structural',
    inputs: [
      { type: 'scrap_metal', count: 3 },
    ],
    output: {
      type: 'metal_plate',
      count: 1,
    },
    durationSeconds: 3.5,
    icon: 'Layers',
  },
  {
    id: 'recipe_wire_assembly',
    name: 'Insulated Wire Assembly',
    description: 'Braided conductive copper cabling with crimped aerospace terminals and fluoropolymer sleeve.',
    category: 'electrical',
    inputs: [
      { type: 'copper_wire', count: 2 },
    ],
    output: {
      type: 'wire_assembly',
      count: 1,
    },
    durationSeconds: 2.5,
    icon: 'Cpu',
  },
  {
    id: 'recipe_repair_kit',
    name: 'Multi-System Repair Kit',
    description: 'Comprehensive field restoration kit: restores 100% EVA Suit Integrity or +40% Rover Hull.',
    category: 'utility',
    inputs: [
      { type: 'metal_plate', count: 2 },
      { type: 'wire_assembly', count: 1 },
    ],
    output: {
      type: 'repair_kit',
      count: 1,
    },
    durationSeconds: 5.0,
    icon: 'Wrench',
  },
  {
    id: 'recipe_battery_pack',
    name: 'Auxiliary Battery Pack',
    description: 'High-density solid-state lithium-sulfur power module: recharges Rover battery by +45%.',
    category: 'electrical',
    inputs: [
      { type: 'battery_cell', count: 2 },
      { type: 'wire_assembly', count: 1 },
    ],
    output: {
      type: 'battery_pack',
      count: 1,
    },
    durationSeconds: 6.0,
    icon: 'BatteryCharging',
  },
  {
    id: 'recipe_structural_frame',
    name: 'Welded Structural Frame',
    description: 'Rigid titanium alloy space-frame girder used for station expansions and heavy structural mountings.',
    category: 'structural',
    inputs: [
      { type: 'metal_plate', count: 5 },
      { type: 'fasteners', count: 2 },
    ],
    output: {
      type: 'structural_frame',
      count: 1,
    },
    durationSeconds: 8.0,
    icon: 'Layers',
  },
  {
    id: 'recipe_electronics_module',
    name: 'Avionics Electronics Module',
    description: 'Radiation-hardened microprocessor computing brick for habitat telemetry and radar automation.',
    category: 'electrical',
    inputs: [
      { type: 'circuit_board', count: 2 },
      { type: 'wire_assembly', count: 2 },
    ],
    output: {
      type: 'electronics_module',
      count: 1,
    },
    durationSeconds: 7.0,
    icon: 'Cpu',
  },
];

export const DISASSEMBLY_RECIPES: Record<string, DisassemblyRecipe> = {
  damaged_battery: {
    sourceType: 'damaged_battery',
    name: 'High-Capacity Cell Battery Pack',
    description: 'Dismantle battery housing to salvage structural alloy, copper connectors, and intact lithium cells.',
    outputs: [
      { type: 'scrap_metal', count: 2 },
      { type: 'copper_wire', count: 1 },
      { type: 'battery_cell', count: 1 },
    ],
    durationSeconds: 3.0,
  },
  mechanical_parts: {
    sourceType: 'mechanical_parts',
    name: 'Mechanical Drive Actuator',
    description: 'Strip gearhead down to recover high-tensile alloy teeth and grade 5 titanium fasteners.',
    outputs: [
      { type: 'scrap_metal', count: 2 },
      { type: 'fasteners', count: 4 },
    ],
    durationSeconds: 3.0,
  },
  electronic_parts: {
    sourceType: 'electronic_parts',
    name: 'Micro-Circuit Components',
    description: 'Desolder sensor board to recover pristine integrated circuit substrate and copper traces.',
    outputs: [
      { type: 'circuit_board', count: 1 },
      { type: 'copper_wire', count: 1 },
    ],
    durationSeconds: 2.5,
  },
  solar_cell: {
    sourceType: 'solar_cell',
    name: 'Triple-Junction Solar Cell',
    description: 'Separate optical quartz substrate from conductive backing contacts.',
    outputs: [
      { type: 'silicate_crystal', count: 1 },
      { type: 'copper_wire', count: 1 },
    ],
    durationSeconds: 2.5,
  },
  titanium_scrap: {
    sourceType: 'titanium_scrap',
    name: 'Aerospace Titanium Debris',
    description: 'Cut structural skin backshell into usable structural alloy segments and aerospace fasteners.',
    outputs: [
      { type: 'scrap_metal', count: 2 },
      { type: 'fasteners', count: 2 },
    ],
    durationSeconds: 3.5,
  },
  polymer: {
    sourceType: 'polymer',
    name: 'Composite Polymer Sheet',
    description: 'Extract titanium grommets and inner conductive thermal foil wiring.',
    outputs: [
      { type: 'fasteners', count: 2 },
      { type: 'wire_assembly', count: 1 },
    ],
    durationSeconds: 2.0,
  },
};
