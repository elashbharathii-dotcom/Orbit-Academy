import { ResourceType } from './survivalTypes';

export type MarsBiomeType =
  | 'central_basin'
  | 'crater_field'
  | 'canyon_pass'
  | 'deep_valley'
  | 'volcanic_field'
  | 'delta_escarpment'
  | 'dune_sea'
  | 'mountain_ridge'
  | 'cave_subterranean';

export interface WorldRegionDefinition {
  id: string;
  name: string;
  biome: MarsBiomeType;
  description: string;
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  center: [number, number]; // [x, z]
  baseColor: string;
  crestColor: string;
  shadowColor: string;
  roughness: number;
  elevationOffset: number;
  noiseScale: number;
  characteristicResources: ResourceType[];
}

export interface CaveSection {
  id: string;
  name: string;
  center: [number, number, number]; // [x, y, z]
  radius: number;
  height: number;
  ambientColor: string;
  lightIntensity: number;
  floorY: number;
  ceilingY: number;
}

export interface ProceduralWorldConfig {
  seed: number;
  worldSize: number; // e.g. 360 meters
  stationApronRadius: number; // 18m flat radius around base [0, 0]
  regions: WorldRegionDefinition[];
}

export const MARS_WORLD_REGIONS: WorldRegionDefinition[] = [
  {
    id: 'region_central_basin',
    name: 'Jezero Station Basin',
    biome: 'central_basin',
    description: 'Flat alluvial basin floor surrounding Outpost Alpha, compacted by precursor landing retro-rockets.',
    bounds: { minX: -45, maxX: 45, minZ: -45, maxZ: 45 },
    center: [0, 0],
    baseColor: '#9A3412', // Rich rust ochre
    crestColor: '#C2410C', // Sun-baked dune crest
    shadowColor: '#451A03', // Basaltic hollow
    roughness: 0.88,
    elevationOffset: 0.0,
    noiseScale: 0.08,
    characteristicResources: ['scrap_metal', 'electronic_parts', 'water_ice'],
  },
  {
    id: 'region_crater_borealis',
    name: 'Crater Borealis Impact Field',
    biome: 'crater_field',
    description: 'Ancient meteorite impact bowl displaying raised ejecta rims, shatter cones, and exposed nickel-iron cores.',
    bounds: { minX: -30, maxX: 60, minZ: 40, maxZ: 160 },
    center: [15, 95],
    baseColor: '#78350F', // Sintered impactite
    crestColor: '#B45309', // Raised ejecta berm
    shadowColor: '#1C1917', // Vitrified melt floor
    roughness: 0.94,
    elevationOffset: 1.5,
    noiseScale: 0.09,
    characteristicResources: ['hematite', 'silicate_crystal', 'titanium_scrap'],
  },
  {
    id: 'region_mawrth_canyon',
    name: 'Mawrth Vallis Canyon Pass',
    biome: 'canyon_pass',
    description: 'Stepped gorge carved by catastrophic paleofloods, featuring a navigable sandy wadi floor between sheer cliffs.',
    bounds: { minX: 45, maxX: 170, minZ: -50, maxZ: 50 },
    center: [105, 0],
    baseColor: '#92400E', // Canyon sandstone
    crestColor: '#D97706', // Escarpment lip
    shadowColor: '#381A05', // Deep chasm shadow
    roughness: 0.92,
    elevationOffset: 2.2,
    noiseScale: 0.11,
    characteristicResources: ['copper_wire', 'titanium_scrap', 'electronic_parts'],
  },
  {
    id: 'region_noctis_valley',
    name: 'Noctis Valley Rift Depression',
    biome: 'deep_valley',
    description: 'Tectonic graben depression shielded from upper atmospheric winds, accumulating atmospheric dust and sulfates.',
    bounds: { minX: -60, maxX: 60, minZ: 60, maxZ: 170 },
    center: [0, 115],
    baseColor: '#7C2D12', // Weathered iron sulfate
    crestColor: '#A16207', // Terraced rim
    shadowColor: '#270F03', // Deep basin floor
    roughness: 0.90,
    elevationOffset: -2.8,
    noiseScale: 0.07,
    characteristicResources: ['sulfur_mineral', 'water_ice', 'regolith'],
  },
  {
    id: 'region_volcanic_field',
    name: 'Syrtis Volcanic Basalt Field',
    biome: 'volcanic_field',
    description: 'Columnar basalt cooling joints, thermal vents, and subterranean lava tube caverns.',
    bounds: { minX: -160, maxX: -20, minZ: -160, maxZ: -25 },
    center: [-85, -85],
    baseColor: '#1E293B', // Vitrified basaltic black
    crestColor: '#334155', // Weathered basalt ridge
    shadowColor: '#0F172A', // Volcanic fissure
    roughness: 0.95,
    elevationOffset: 1.8,
    noiseScale: 0.12,
    characteristicResources: ['silicate_crystal', 'hematite', 'battery_cell'],
  },
  {
    id: 'region_delta_escarpment',
    name: 'Jezero Delta Escarpment',
    biome: 'delta_escarpment',
    description: 'Exposed stratigraphy revealing 3.7-billion-year-old river delta clays, mudstones, and hydrated sulfate beds.',
    bounds: { minX: -170, maxX: -35, minZ: -30, maxZ: 70 },
    center: [-100, 20],
    baseColor: '#854D0E', // Mudstone ochre
    crestColor: '#B45309', // Terraced delta crest
    shadowColor: '#451A03', // Sediment shadow
    roughness: 0.89,
    elevationOffset: 3.5,
    noiseScale: 0.08,
    characteristicResources: ['regolith', 'sulfur_mineral', 'scientific_sample'],
  },
  {
    id: 'region_elysium_dunes',
    name: 'Elysium Barchan Dune Sea',
    biome: 'dune_sea',
    description: 'High-amplitude wind-sculpted sand dunes shifting across basaltic bedrock under thin Martian air.',
    bounds: { minX: -150, maxX: 10, minZ: -170, maxZ: -45 },
    center: [-70, -105],
    baseColor: '#C2410C', // Shifting red sand
    crestColor: '#EA580C', // Wind-swept razor crest
    shadowColor: '#7C2D12', // Slipface shadow
    roughness: 0.85,
    elevationOffset: 1.2,
    noiseScale: 0.06,
    characteristicResources: ['water_ice', 'scrap_metal', 'solar_cell'],
  },
  {
    id: 'region_ares_ridge',
    name: 'Ares Mountain Ridge',
    biome: 'mountain_ridge',
    description: 'High-altitude bedrock ridge offering commanding views of Jezero Crater and historical survey relics.',
    bounds: { minX: 45, maxX: 170, minZ: -170, maxZ: -40 },
    center: [105, -105],
    baseColor: '#571D0C', // Ancient oxidized bedrock
    crestColor: '#9A3412', // Sunlit rocky pinnacle
    shadowColor: '#2A0B04', // Deep escarpment shadow
    roughness: 0.96,
    elevationOffset: 6.5,
    noiseScale: 0.10,
    characteristicResources: ['titanium_scrap', 'electronic_parts', 'scientific_sample'],
  },
];
