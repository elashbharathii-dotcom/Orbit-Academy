/**
 * ORBIT ACADEMY — Core Type Definitions
 * Aligned with design-system/orbit-academy/MASTER.md
 */

export type CelestialId = 
  | 'sun' 
  | 'mercury' 
  | 'venus' 
  | 'earth' 
  | 'mars' 
  | 'jupiter' 
  | 'saturn' 
  | 'uranus' 
  | 'neptune';

export interface CelestialPhysicalData {
  classification: string;
  realDistanceAU: number;
  realDistanceKm: string;
  realDiameterKm: string;
  orbitalPeriodDays: number;
  rotationPeriodHours: number;
  surfaceGravityMs2: number;
  meanTemperatureC: number;
  moonsCount: number;
  atmosphericComposition: string[];
}

export interface PlanetaryRingDefinition {
  innerRadiusMultiplier: number;
  outerRadiusMultiplier: number;
  opacity: number;
  color: string;
  textureUrl?: string;
  tiltAngleDeg?: number;
}

export interface MoonDefinition {
  id: string;
  name: string;
  parentPlanetId: CelestialId;
  visualRadius: number;
  orbitRadius: number;
  orbitSpeedMultiplier: number;
  primaryColor: string;
  surfaceTextureUrl?: string;
  description: string;
  realDiameterKm: string;
  orbitalPeriodDays: number;
  discoveredYear: string;
  keyFeature: string;
}

export interface CelestialVisualData {
  visualRadius: number;
  visualOrbitRadius: number;
  scientificOrbitRadius?: number;
  scientificRadius?: number;
  orbitSpeedMultiplier: number;
  rotationSpeedMultiplier: number;
  axialTiltDeg: number;
  primaryColor: string;
  secondaryColor?: string;
  hasRings?: boolean;
  rings?: PlanetaryRingDefinition;
  moons?: MoonDefinition[];
}

export interface LearningModuleInfo {
  destinationName: string;
  moduleTitle: string;
  learningCategory: string;
  missionObjective: string;
  path: string;
}

export interface CelestialBodyDefinition {
  id: CelestialId;
  name: string;
  latinName: string;
  tagline: string;
  visual: CelestialVisualData;
  physical: CelestialPhysicalData;
  learningModule: LearningModuleInfo;
}

export type NavigationMode = 'overview' | 'focus';
export type ViewingMode = 'cinematic' | 'scientific';
export type ActiveEnvironment = 'solar-system' | 'milky-way';

export interface SolarSystemInteractionState {
  selectedPlanetId: CelestialId | null;
  hoveredPlanetId: CelestialId | null;
  selectedMoonId?: string | null;
  viewingMode?: ViewingMode;
  activeEnvironment?: ActiveEnvironment;
  timeWarp?: number;
  isTransitioning: boolean;
  selectPlanet: (id: CelestialId | null) => void;
  selectMoon?: (id: string | null) => void;
  setHoveredPlanet: (id: CelestialId | null) => void;
  setViewingMode?: (mode: ViewingMode) => void;
  setActiveEnvironment?: (env: ActiveEnvironment) => void;
  setTimeWarp?: (speed: number) => void;
}
