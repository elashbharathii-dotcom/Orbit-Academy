/**
 * ORBIT ACADEMY — CLIMATE LAB: AAA ENVIRONMENTAL SCIENCE SIMULATOR
 * Strongly-typed data models and contracts for 3D Earth, Weather, Climate Scenarios,
 * Ecosystem Chambers, and Scientific Experiments.
 */

export type ClimateLabMode =
  | 'earth-orbit'       // Phase 1: Realistic 3D Earth Environment & Geographic Focus
  | 'dashboard'         // Phase 2: Climate Dashboard with Layer Controls, Legends & Search
  | 'weather'           // Phase 3: Dynamic Weather Systems (Hurricanes, Monsoons, Thunderstorms)
  | 'climate-change'    // Phase 4: Interactive Climate Parameters & Future Scenarios
  | 'ecosystems'        // Phase 5: Dedicated 3D Ecosystems (Glacier, Ocean, Forest, Atmosphere)
  | 'experiments'       // Phase 6: 5 Physical Experiments (Greenhouse, Solar, Atmosphere, Temp, Water)
  | 'nasa-gibs'         // Phase 7: NASA GIBS: Satellite imagery & Earthdata monitoring
  | 'earth-mars-comparison' // Phase 8: Comparative Planetology: Earth vs. Mars Climate
  | 'laura-guide';      // Phase 9: Laura AI Climate Science Companion

// --- PHASE 1: GEOGRAPHICAL TARGETS ---
export interface ContinentRegion {
  id: string;
  name: string;
  category: 'continent' | 'ocean' | 'cryosphere' | 'biome';
  coordinates: {
    lat: number;
    lon: number;
  };
  cameraPosition: [number, number, number];
  targetLookAt: [number, number, number];
  zoomLevel: number;
  description: string;
  climateVulnerability: string;
  temperatureTrend: string; // e.g. "+1.8°C since 1900"
  keyPhenomena: string[];
}

// --- PHASE 2: DYNAMIC WEATHER SIMULATION ---
export type WeatherPhenomenonId =
  | 'clear'
  | 'hurricane'
  | 'monsoon'
  | 'thunderstorm'
  | 'blizzard'
  | 'drought';

export interface WeatherSystemConfig {
  id: WeatherPhenomenonId;
  name: string;
  category: 'Tropical Cyclone' | 'Atmospheric Flow' | 'Convective Storm' | 'Polar Cryosphere' | 'Atmospheric Subsidence' | 'Equilibrium';
  windSpeedKmh: number;
  pressureHpa: number;
  precipitationMmHr: number;
  humidityPercent: number;
  surfaceTempC: number;
  activeLocation: string;
  activeCoordinates: { lat: number; lon: number };
  description: string;
  mechanicsExplanation: string;
  visualTraits: {
    hasVortex: boolean;
    hasLightning: boolean;
    hasPrecipitation: boolean;
    hasMoistureStream: boolean;
    hasDroughtHaze: boolean;
    particleColor: string;
    cloudOpacity: number;
  };
}

// --- PHASE 3: CLIMATE CHANGE SIMULATOR PARAMETERS ---
export interface ClimateParameters {
  globalTempAnomaly: number;    // -0.5 to +4.5 °C (baseline 1850-1900)
  co2Ppm: number;               // 280 to 900 ppm
  annualEmissionsGt: number;    // 0 to 65 Gt CO2 / year
  forestCoveragePercent: number;// 40% to 100% (pre-industrial = 100%)
  oceanTempAnomaly: number;     // 0.0 to +3.5 °C
  seaLevelRiseCm: number;       // 0 to 180 cm
  arcticIceCoveragePercent: number; // 15% to 100%
  renewableEnergyPercent: number;   // 10% to 100%
}

export type ClimateScenarioId = 'pre-industrial' | 'present' | 'paris-2050' | 'runaway-2100';

export interface ClimateScenarioPreset {
  id: ClimateScenarioId;
  year: number;
  name: string;
  badge: string;
  tagline: string;
  ipccClassification: string;
  parameters: ClimateParameters;
  summary: string;
  consequences: string[];
  scientificValidation: 'NASA/NOAA Observation' | 'IPCC AR6 SSP1-1.9' | 'IPCC AR6 SSP5-8.5';
}

// --- PHASE 4: DEDICATED 3D ECOSYSTEMS ---
export type EcosystemLabId = 'glacier' | 'ocean' | 'forest' | 'atmosphere';

export interface GlacierLabState {
  iceThicknessMeters: number;     // 50 to 500 m
  meltRateMetersPerYear: number;  // 0.5 to 15 m/yr
  calvingRate: number;            // 0 to 10 scale
  seaLevelContributionMm: number; // calculated
  albedo: number;                 // 0.85 (pure fresh snow) to 0.35 (exposed dirty ice/bedrock)
  ambientTempC: number;           // -15 to +10 °C
  isCalving: boolean;
}

export interface OceanLabState {
  surfaceTempC: number;           // 24 to 34 °C
  waterPh: number;                // 8.25 down to 7.65
  aragoniteSaturation: number;    // 4.2 down to 0.8 (under 1.0 = dissolution)
  coralBleachPercentage: number;  // 0% to 100%
  currentSpeedKmH: number;        // 3.0 to 9.0 km/h
  marineHeatwaveIntensity: 'None' | 'Moderate' | 'Severe' | 'Extreme';
}

export interface ForestLabState {
  canopyDensityPercent: number;   // 20% to 100%
  deforestationRateMha: number;   // 0 to 25 Mha/yr
  carbonSequestrationGt: number;  // 0.5 to 7.5 Gt CO2/yr
  wildfireActive: boolean;
  wildfireIntensity: number;      // 0 to 100
  biodiversityIndex: number;      // 0 to 100
}

export interface AtmosphereLabState {
  co2Ppm: number;
  solarIrradianceWm2: number;      // 1361 W/m² (top of atmosphere)
  terrestrialIrradianceWm2: number;// ~340 W/m² surface average
  trappedInfraredPercent: number;  // 55% to 92%
  hadleyCellCirculation: 'Normal' | 'Expanded' | 'Disrupted';
  ozoneLayerHealthPercent: number; // 70% to 100%
}

// --- PHASE 5: CLIMATE SCIENTIFIC EXPERIMENTS ---
export interface ClimateExperiment {
  id: string;
  number: number;
  title: string;
  question: string;
  hypothesis: string;
  variableName: string;
  variableUnit: string;
  variableMin: number;
  variableMax: number;
  variableStep: number;
  variableDefault: number;
  baselineValue: number;
  scientificLaw: string;
  governingFormula: string;
  objective: string;
  observations: {
    baselineLabel: string;
    baselineDesc: string;
    perturbedLabel: string;
    perturbedDesc: string;
  };
  chartData: {
    xLabels: string[];
    baselineSeries: number[];
    perturbedSeries: number[];
    unitLabel: string;
  };
  scientificExplanation: string;
  learningOutcomes: string[];
  realWorldMitigation: string;
  xpReward: number;
}

// --- PHASE 6: LAURA AI CLIMATE GUIDE ---
export interface LauraClimateDialogue {
  id: string;
  context: ClimateLabMode | 'intro' | 'experiment';
  title: string;
  speechText: string;
  calloutBadges: string[];
  suggestedQuestions: string[];
}

export interface ClimateGlossaryItem {
  term: string;
  phonetic?: string;
  definition: string;
  scientificRole: string;
  realWorldExample: string;
  citation: string;
}

// ==========================================
// STAGE 06: NASA CLIMATE VISUALIZATION LAYERS
// ==========================================
export type ClimateLayerId =
  | 'surface_temp'
  | 'clouds'
  | 'vegetation_ndvi'
  | 'aerosols'
  | 'active_fires'
  | 'ocean_chlorophyll'
  | 'ozone_column'
  | 'true_color';

export interface ClimateLayerDef {
  id: ClimateLayerId;
  name: string;
  shortName: string;
  category: 'temperature' | 'atmosphere' | 'biosphere' | 'hazards' | 'oceans' | 'optical';
  sensor: string;
  satellite: string;
  spatialResolution: string;
  temporalResolution: string;
  units: string;
  range: [number, number];
  description: string;
  scientificSignificance: string;
  legendStops: { value: number; label: string; color: string }[];
  wmsLayerName: string;
  sampleDate: string;
  attribution: string;
}

// ==========================================
// STAGE 06: 5 INTERACTIVE PHYSICAL EXPERIMENTS
// ==========================================
export type PhysicalExperimentId =
  | 'greenhouse_effect'
  | 'solar_radiation'
  | 'atmospheric_composition'
  | 'planetary_temperature'
  | 'water_cycle';

export interface PhysicalExperimentDef {
  id: PhysicalExperimentId;
  title: string;
  question: string;
  hypothesis: string;
  governingEquation: string;
  physicalLaw: string;
  parameters: {
    id: string;
    name: string;
    unit: string;
    min: number;
    max: number;
    step: number;
    default: number;
    description: string;
  }[];
  educationalExplanation: string;
  assumptions: string[];
  nasaDatasetRef?: string;
}

export interface ClimateLocationTelemetry {
  cityName: string;
  coordinates: { lat: number; lon: number };
  temperatureC: number;
  solarFluxWm2: number;
  surfacePressureHpa: number;
  relativeHumidityPct: number;
  windSpeedMs: number;
  dataSource: string;
  timestamp: string;
}

