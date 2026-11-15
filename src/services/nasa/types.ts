/**
 * ORBIT ACADEMY — OFFICIAL NASA SCIENCE DATA TYPES
 * Strongly-typed definitions for NASA APOD, GIBS, NeoWs, DONKI, Media Library, and Exoplanets.
 */

// --- 1. NASA APOD ---
export interface NasaApod {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  copyright?: string;
  thumbnail_url?: string;
}

// --- 2. NASA GIBS (Global Imagery Browse Services) ---
export interface NasaGibsLayer {
  id: string;
  name: string;
  satellite: string;
  sensor: string;
  category: 'true-color' | 'atmosphere' | 'biosphere' | 'disaster';
  description: string;
  format: 'image/jpeg' | 'image/png';
  tileMatrixSet: string;
  attribution: string;
}

export interface NasaGibsImageryQuery {
  layerId: string;
  date: string; // YYYY-MM-DD
  bbox?: string;
  width?: number;
  height?: number;
}

// --- NASA POWER (Solar Irradiance & Meteorology) ---
export interface NasaPowerPointData {
  latitude: number;
  longitude: number;
  elevationMeters: number;
  timestamp: string;
  source: string;
  parameters: {
    allSkySolarIrradianceWm2: number;
    topOfAtmosphereInsolationWm2: number;
    temperature2mC: number;
    relativeHumidity2mPercent: number;
    windSpeed10mMps: number;
    surfacePressureKpa: number;
  };
}

// --- 3. NASA NeoWs (Near-Earth Asteroids) ---
export interface NasaNeoAsteroid {
  id: string;
  name: string;
  nasaJplUrl: string;
  absoluteMagnitudeH: number;
  estimatedDiameterMeters: {
    min: number;
    max: number;
  };
  isPotentiallyHazardous: boolean;
  closeApproachDate: string;
  relativeVelocityKmh: number;
  missDistanceKm: number;
  missDistanceLunar: number;
  orbitingBody: string;
}

// --- 4. NASA DONKI (Space Weather & Solar Physics) ---
export interface NasaSolarFlare {
  flrId: string;
  beginTime: string;
  peakTime: string;
  endTime?: string;
  classType: string; // e.g. X1.8, M5.4, C8.2
  sourceLocation: string; // e.g. N18E42
  activeRegionNum: number | null;
  link: string;
}

export interface NasaCmeAnalysis {
  time21_5: string;
  latitude: number;
  longitude: number;
  halfAngle: number;
  speed: number;
  type: string;
  isMostAccurate: boolean;
  link: string;
}

export interface NasaCmeEvent {
  activityId: string;
  startTime: string;
  sourceLocation?: string;
  catalog: string;
  speedKmS?: number;
  halfAngle?: number;
  note: string;
  link: string;
  cmeAnalyses?: NasaCmeAnalysis[];
}

export interface NasaGeomagneticStorm {
  gstId: string;
  startTime: string;
  kpIndex: number;
  linkedEvents?: string;
}

export interface NasaSepEvent {
  sepId: string;
  eventTime: string;
  instruments?: string;
  link: string;
}

export interface NasaInterplanetaryShock {
  shockId: string;
  eventTime: string;
  location: string;
  link: string;
}

export interface NasaMagnetopauseCrossing {
  mpcId: string;
  eventTime: string;
  instruments?: string;
  link: string;
}

export interface NasaRadiationBeltEnhancement {
  rbeId: string;
  eventTime: string;
  instruments?: string;
  link: string;
}

export interface NasaHighSpeedStream {
  hssId: string;
  eventTime: string;
  instruments?: string;
  link: string;
}

export interface NasaWsaEnlilSimulation {
  simulationId: string;
  modelCompletionTime: string;
  au: number;
  cmeIDs?: string[];
  estimatedEarthArrival?: string;
  impactList?: Array<{ isGlancingBlow: boolean; location: string; arrivalTime: string }>;
}

export interface NasaSpaceWeatherNotification {
  messageID: string;
  messageType: string;
  messageIssueTime: string;
  messageURL: string;
  messageBody: string;
}

export interface NasaComprehensiveSpaceWeather {
  summary: {
    solarCycle: string;
    sunspotCountEstimate: number;
    solarWindSpeedKmS: number;
    planetaryKpIndex: number;
    imfBzComponentNt: number;
    solarWindDensityProtonsCm3: number;
    dynamicPressureNPa: number;
    magnetopauseStandoffRe: number;
    auroraActivityLevel: 'Low' | 'Moderate' | 'Active' | 'Severe' | 'Extreme';
    spaceWeatherScale: 'G0 Normal' | 'G1 Minor' | 'G2 Moderate' | 'G3 Strong' | 'G4 Severe' | 'G5 Extreme';
  };
  flares: NasaSolarFlare[];
  cmes: NasaCmeEvent[];
  geomagneticStorms: NasaGeomagneticStorm[];
  sepEvents: NasaSepEvent[];
  interplanetaryShocks: NasaInterplanetaryShock[];
  magnetopauseCrossings: NasaMagnetopauseCrossing[];
  radiationBeltEnhancements: NasaRadiationBeltEnhancement[];
  highSpeedStreams: NasaHighSpeedStream[];
  enlilSimulations: NasaWsaEnlilSimulation[];
  notifications: NasaSpaceWeatherNotification[];
}

export interface NasaSpaceWeatherSummary {
  flares: NasaSolarFlare[];
  cmes: NasaCmeEvent[];
  geomagneticStorms: NasaGeomagneticStorm[];
  solarCycle: string;
  sunspotCountEstimate: number;
  solarWindSpeedKmS: number;
}

// --- 5. NASA Image & Video Library ---
export interface NasaMediaAsset {
  nasaId: string;
  title: string;
  description: string;
  dateCreated: string;
  mediaType: 'image' | 'video' | 'audio';
  thumbnailUrl: string;
  center?: string;
  keywords?: string[];
}

// --- 6. NASA Exoplanet Archive ---
export interface NasaExoplanet {
  name: string;
  hostname: string;
  discoveryMethod: string;
  discoveryYear: number;
  orbitalPeriodDays: number | null;
  radiusEarthRadii: number | null;
  massEarthMasses: number | null;
  equilibriumTempK: number | null;
  distanceLightYears: number | null;
  isPotentiallyHabitable: boolean;
}

// --- 7. NASA EPIC (DSCOVR Lagrange-1 Earth Imagery) ---
export interface NasaEpicImage {
  identifier: string;
  caption: string;
  image: string;
  date: string;
  imageUrl: string;
  thumbUrl: string;
  centroidCoordinates: {
    lat: number;
    lon: number;
  };
  distanceKm: number;
}

// --- 8. NASA EONET (Active Natural Events) ---
export interface NasaEonetEvent {
  id: string;
  title: string;
  category: 'wildfires' | 'severeStorms' | 'volcanoes' | 'seaLakeIce' | 'floods' | 'other';
  categoryTitle: string;
  date: string;
  latitude: number;
  longitude: number;
  magnitude?: string;
  sourceUrl?: string;
}

// --- 9. NASA SOLAR SYSTEM TREKS (WMTS, Nomenclature & Bookmarks) ---
export type NasaTrekBody = 'mars' | 'moon' | 'mercury' | 'titan' | 'ceres' | 'vesta';

export interface NasaTrekLayer {
  id: string;
  title: string;
  body: NasaTrekBody;
  projection: 'equirectangular' | 'northpole' | 'southpole';
  crs: string;
  tileMatrixSet: string;
  format: 'jpg' | 'png';
  wmtsTemplate: string;
  sampleTileUrl: string;
  thumbnailUrl: string;
  productCat1?: string;
  productCat2?: string;
  mission: string;
  instrument: string;
  resolution?: string;
  description: string;
  bbox?: string;
}

export interface NasaTrekNomenclature {
  id: string;
  title: string;
  body: NasaTrekBody;
  featureCategory: string;
  latitude: number;
  longitude: number;
  bbox: string;
  shape: string;
  diameterKm?: number;
  description: string;
  origin?: string;
  mission?: string;
  instrument?: string;
}

export interface NasaTrekBookmark {
  id: string;
  title: string;
  body: NasaTrekBody;
  bbox: string;
  latitude: number;
  longitude: number;
  description: string;
  mediaUrl: string[];
  roverPaths?: string[];
  layers?: string[];
  mission: string;
}

export interface NasaTrekBodyCatalog {
  body: NasaTrekBody;
  name: string;
  portalUrl: string;
  primaryProjection: string;
  crs: string;
  defaultLayerId: string;
  curatedLayers: NasaTrekLayer[];
  totalLayersEstimate: number;
}

export interface NasaTrekLayersResult {
  body: NasaTrekBody;
  numFound: number;
  layers: NasaTrekLayer[];
}

export interface NasaTrekNomenclatureResult {
  body: NasaTrekBody;
  features: NasaTrekNomenclature[];
}

export interface NasaTrekBookmarksResult {
  body: NasaTrekBody;
  bookmarks: NasaTrekBookmark[];
}

// --- 9. NASA OSDR (Open Science Data Repository & Space Biology) ---
export interface NasaOsdrDatasetBrief {
  accession: string;
  restUrl: string;
}

export interface NasaOsdrStudyMetadata {
  accession: string;
  title: string;
  description: string;
  spaceProgram: string;
  flightProgram: string;
  missionName: string;
  managingNasaCenter: string;
  organism: string[];
  dataSourceType: 'cgene' | 'alsda' | 'esa' | 'mg_rast' | 'other';
  dataSourceAccession?: string;
  publicReleaseDate: string;
  measurementType: string;
  technologyPlatform: string;
  authoritativeSourceUrl: string;
  publicationTitle?: string;
  publicationAuthors?: string;
  thumbnailUrl?: string;
  factors: string[];
  assaysUrl?: string;
  filesUrl?: string;
}

export interface NasaOsdrAssayItem {
  assayName: string;
  restUrl: string;
  measurementType: string;
  technologyType: string;
  technologyPlatform: string;
  samplesUrl?: string;
}

export interface NasaOsdrFileItem {
  fileName: string;
  restUrl: string;
  downloadUrl: string;
  fileSize?: string;
  fileCategory?: string;
}

export interface NasaOsdrResearchStats {
  totalCuratedStudies: number;
  totalSearchableHits: number;
  geneLabCount: number;
  alsdaCount: number;
  esaCount: number;
  organismsDistribution: { organism: string; count: number; percentage: number }[];
  categoriesDistribution: { category: string; count: number }[];
  missionsDistribution: { mission: string; count: number }[];
  recentStudies: NasaOsdrStudyMetadata[];
  timestamp: string;
  source: string;
}

export interface NasaOsdrSearchHit {
  id: string;
  score: number;
  accession: string;
  title: string;
  description: string;
  organism: string[];
  dataSourceType: string;
  flightProgram: string;
  mission: string;
}

export interface NasaOsdrSearchResult {
  total: number;
  took: number;
  hits: NasaOsdrSearchHit[];
  source: string;
}

// Service response wrapper
export interface NasaApiResponse<T> {
  data: T;
  isCached: boolean;
  fallback: boolean;
  error?: string;
}
