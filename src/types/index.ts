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

export interface CelestialVisualData {
  visualRadius: number;
  visualOrbitRadius: number;
  orbitSpeedMultiplier: number;
  rotationSpeedMultiplier: number;
  axialTiltDeg: number;
  primaryColor: string;
  secondaryColor?: string;
  hasRings?: boolean;
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

