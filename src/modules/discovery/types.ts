import { CelestialId } from '../../types';

export type DiscoveryViewMode = 'galaxy' | 'solar-system' | 'journey' | 'planet-explorer';

export type JourneyCameraMode = 'chase' | 'cockpit' | 'flyby' | 'orbit';

export interface MajorMoon {
  id: string;
  name: string;
  diameterKm: number;
  orbitalDistanceKm: number;
  orbitalPeriodDays: number;
  discoveryYear: number;
  discoverer: string;
  description: string;
  color: string;
}

export interface ExplorationMission {
  name: string;
  agency: string;
  launchYear: number;
  arrivalYear?: number;
  type: 'Orbiter' | 'Flyby' | 'Lander' | 'Rover' | 'Sample Return' | 'Probe';
  status: 'Completed' | 'Operational' | 'En Route' | 'Planned';
  keyDiscovery: string;
}

export interface AtmosphericComponent {
  gas: string;
  formula: string;
  percentage: number;
  color: string;
}

export interface PlanetaryHotspot {
  id: string;
  title: string;
  shortDesc: string;
  explanation: string;
  latDeg: number;
  lonDeg: number;
  category: 'storm' | 'atmosphere' | 'moon' | 'ring' | 'geology' | 'dynamo';
  lauraSpeech: string;
}

export interface PlanetDiscoveryProfile {
  id: CelestialId;
  name: string;
  latinName: string;
  classification: string;
  tagline: string;
  overviewSummary: string;
  
  // Astronomical Telemetry
  astronomy: {
    semiMajorAxisAU: number;
    semiMajorAxisKm: string;
    perihelionKm: string;
    aphelionKm: string;
    orbitalPeriodDays: number;
    orbitalPeriodEarthYears: number;
    orbitalVelocityKmS: number;
    orbitalEccentricity: number;
    orbitalInclinationDeg: number;
    rotationPeriodHours: number;
    rotationDescription: string;
    isRetrogradeRotation: boolean;
    axialTiltDeg: number;
  };

  // Physical & Planetary Characteristics
  physics: {
    equatorialDiameterKm: number;
    diameterEarthRatio: number;
    massKg: string;
    massEarthRatio: number;
    meanDensityGcm3: number;
    surfaceGravityMs2: number;
    gravityEarthG: number;
    escapeVelocityKmS: number;
    meanTemperatureC: number;
    minTemperatureC: number;
    maxTemperatureC: number;
    surfacePressureAtm: string;
    hasMagneticField: boolean;
    magneticFieldStrength: string;
  };

  // Atmosphere
  atmosphere: {
    hasAtmosphere: boolean;
    scaleHeightKm: number;
    composition: AtmosphericComponent[];
    description: string;
  };

  // Moons & Rings
  satellites: {
    moonCount: number;
    majorMoons: MajorMoon[];
    hasRings: boolean;
    ringDescription?: string;
    ringSpanKm?: string;
  };

  // Exploration History
  missions: ExplorationMission[];

  // Features & Scientific Highlights
  surfaceFeatures: {
    title: string;
    description: string;
    coordinateOrLocation?: string;
  }[];

  hotspots?: PlanetaryHotspot[];

  scientificSignificance: string;

  // Laura Educational Audio Scripts (for speech synthesis & subtitles)
  lauraNarration: {
    intro: string;
    orbitAndScale: string;
    atmosphereAndSurface: string;
    moonsAndRings: string;
    explorationAndSignificance: string;
  };

  // Color & Aesthetic Tokens
  visuals: {
    primaryColor: string;
    glowColor: string;
    ringColor?: string;
    atmosphereColor?: string;
    textureMapUrl: string;
    cloudsMapUrl?: string;
    nightMapUrl?: string;
    bumpMapUrl?: string;
  };
}

export interface DiscoveryCadetProgress {
  planetsExplored: CelestialId[];
  journeysCompleted: number;
  triviaQuestionsAnswered: number;
  unlockedBadges: string[];
  totalDiscoveryXp: number;
}
