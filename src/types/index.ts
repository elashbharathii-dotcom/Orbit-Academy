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

export type DwarfPlanetId = 'pluto' | 'ceres' | 'haumea' | 'makemake' | 'eris';
export type SpacecraftId = 'voyager1' | 'jwst' | 'new-horizons';
export type GraphicsTier = 'low' | 'medium' | 'high' | 'ultra';
export type DossierMode = 'educational' | 'scientific';

export interface CelestialPhysicalData {
  classification: string;
  realDistanceAU: number;
  realDistanceKm: string;
  realDiameterKm: string;
  realMassKg?: string;
  orbitalPeriodDays: number;
  rotationPeriodHours: number;
  surfaceGravityMs2: number;
  meanTemperatureC: number;
  moonsCount: number;
  atmosphericComposition: string[];
  interestingFacts?: string[];
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
  textureType?: 'cratered' | 'ice' | 'volcanic' | 'grooved' | 'methane' | 'smooth';
  description: string;
  realDiameterKm: string;
  realMassKg?: string;
  surfaceGravityMs2?: number;
  meanTemperatureC?: number;
  orbitalPeriodDays: number;
  discoveredYear: string;
  keyFeature: string;
}

export interface DwarfPlanetDefinition {
  id: DwarfPlanetId;
  name: string;
  tagline: string;
  realDistanceAU: number;
  realDiameterKm: string;
  orbitalPeriodYears: number;
  rotationPeriodHours?: number;
  surfaceGravityMs2?: number;
  meanTemperatureC?: number;
  primaryColor: string;
  orbitRadius: number;
  visualRadius: number;
  moonsCount: number;
  keyFeature: string;
  classification: string;
  description: string;
}

export interface SpacecraftDefinition {
  id: SpacecraftId;
  name: string;
  agency: string;
  launchYear: string;
  missionType: string;
  currentLocation: string;
  keyDiscovery: string;
  orbitRadius: number;
  visualRadius: number;
  primaryColor: string;
  description: string;
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
  graphicsTier?: GraphicsTier;
  dossierMode?: DossierMode;
  showAsteroidBelt?: boolean;
  showKuiperBelt?: boolean;
  showSpacecraft?: boolean;
  selectedDwarfPlanetId?: DwarfPlanetId | null;
  selectedSpacecraftId?: SpacecraftId | null;
  isTransitioning: boolean;
  selectPlanet: (id: CelestialId | null) => void;
  selectMoon?: (id: string | null) => void;
  setHoveredPlanet: (id: CelestialId | null) => void;
  setViewingMode?: (mode: ViewingMode) => void;
  setActiveEnvironment?: (env: ActiveEnvironment) => void;
  setTimeWarp?: (speed: number) => void;
  setGraphicsTier?: (tier: GraphicsTier) => void;
  setDossierMode?: (mode: DossierMode) => void;
  setShowAsteroidBelt?: (show: boolean) => void;
  setShowKuiperBelt?: (show: boolean) => void;
  setShowSpacecraft?: (show: boolean) => void;
  selectDwarfPlanet?: (id: DwarfPlanetId | null) => void;
  selectSpacecraft?: (id: SpacecraftId | null) => void;
}
