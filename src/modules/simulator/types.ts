/**
 * ORBIT ACADEMY — AAA SPACE MISSION SIMULATOR TYPES
 * Stage 09 Aerospace Simulation & Orbital Mechanics Engine
 */

export type MissionId =
  | 'earth-orbit-insertion'
  | 'iss-rendezvous-docking'
  | 'moon-orbital-recon'
  | 'artemis-lunar-landing'
  | 'mars-transfer-insertion'
  | 'mars-orbital-insertion'
  | 'mars-surface-landing'
  | 'asteroid-bennu-tag'
  | 'voyager-deep-space'
  | 'parker-solar-perihelion';

export type CelestialTarget =
  | 'earth'
  | 'moon'
  | 'mars'
  | 'iss'
  | 'asteroid'
  | 'deep-space'
  | 'sun';

export type FlightPhase =
  | 'prelaunch'
  | 'ascent'
  | 'orbital'
  | 'transfer'
  | 'approach'
  | 'docked'
  | 'descent'
  | 'landed'
  | 'aborted'
  | 'crashed';

export type CameraViewMode = 'cockpit' | 'chase' | 'orbit-map' | 'docking';

export type DifficultyRating = 'Cadet' | 'Commander' | 'Astrophysicist';

export interface MissionObjective {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isFailed?: boolean;
  targetMetric?: {
    type: 'altitude' | 'velocity' | 'distance' | 'eccentricity' | 'relative-speed' | 'touchdown-speed';
    targetValue: number;
    currentValue?: number;
    unit: string;
  };
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface OrbitalElements {
  apoapsisKm: number;
  periapsisKm: number;
  semiMajorAxisKm: number;
  eccentricity: number;
  inclinationDeg: number;
  orbitalPeriodMin: number;
  currentVelocityKmS: number;
  trueAnomalyDeg: number;
}

export interface FlightControls {
  throttle: number; // 0.0 to 1.0
  pitch: number;    // -1.0 to +1.0
  yaw: number;      // -1.0 to +1.0
  roll: number;     // -1.0 to +1.0
  rcsX: number;     // -1.0 to +1.0
  rcsY: number;     // -1.0 to +1.0
  rcsZ: number;     // -1.0 to +1.0
  sasActive: boolean;
  gearDeployed: boolean;
  solarDeployed: boolean;
  commsDeployed: boolean;
  engineIgnited: boolean;
}

export interface SpacecraftFlightState {
  // Spatial Dynamics
  position: Vector3D;
  velocity: Vector3D;
  rotation: Vector3D; // Euler angles in radians: pitch, yaw, roll
  angularVelocity: Vector3D;

  // Mass & Propulsion
  totalMassKg: number;
  dryMassKg: number;
  fuelKg: number;
  maxFuelKg: number;
  monopropKg: number;
  maxMonopropKg: number;
  throttle: number;
  thrustKn: number;
  specificImpulseS: number;
  deltaVRemainingMs: number;
  deltaVExpendedMs: number;

  // Atmospheric & Aerodynamic Telemetry
  altitudeM: number;
  verticalSpeedMs: number;
  horizontalSpeedMs: number;
  dynamicPressureKPa: number;
  atmosphericDensity: number;
  skinTempC: number;

  // Subsystem Deployables
  gearDeployed: boolean;
  solarDeployed: boolean;
  commsDeployed: boolean;
  sasActive: boolean;

  // Mission State
  flightPhase: FlightPhase;
  elapsedSeconds: number;
  gForce: number;
  orbital: OrbitalElements;

  // Proximity to Target (for docking or landing)
  targetDistanceM?: number;
  relativeVelocityMs?: number;
}

export interface MissionDefinition {
  id: MissionId;
  title: string;
  subtitle: string;
  targetBody: CelestialTarget;
  difficulty: DifficultyRating;
  description: string;
  historicalContext: string;
  badge: string;
  icon: string;
  themeAccent: string;

  // Physics Initialization
  initialAltitudeM: number;
  initialVelocityMs: Vector3D;
  initialFuelKg: number;
  maxFuelKg: number;
  initialMonopropKg: number;
  dryMassKg: number;
  maxThrustKn: number;
  vacuumIspS: number;

  // Celestial Environmental Attributes
  celestialRadiusKm: number;
  surfaceGravityMs2: number;
  atmosphereHeightKm: number;
  hasAtmosphere: boolean;

  // Objectives & Star Ratings
  objectives: MissionObjective[];
  deltaVBudgetMs: number;
  starCriteria: {
    threeStars: { maxDeltaVMs: number; maxSeconds: number; maxLandingSpeedMs?: number };
    twoStars: { maxDeltaVMs: number; maxSeconds: number; maxLandingSpeedMs?: number };
  };
  baseXpReward: number;
}

export interface LauraCommsMessage {
  id: string;
  timestamp: string;
  callsign: string;
  message: string;
  tone: 'info' | 'guidance' | 'warning' | 'congratulations';
  audioCue?: 'chime' | 'warning' | 'dock' | 'touchdown';
}

export interface MissionDebriefStats {
  missionId: MissionId;
  missionTitle: string;
  isSuccess: boolean;
  failureReason?: string;
  starRating: 1 | 2 | 3;
  elapsedSeconds: number;
  finalTouchdownSpeedMs?: number;
  deltaVExpendedMs: number;
  fuelRemainingPercent: number;
  scoreXp: number;
  achievementsUnlocked: string[];
}

export interface SimulatorPersistence {
  completedMissionIds: MissionId[];
  missionBestStars: Record<string, number>;
  totalFlightTimeSeconds: number;
  totalLandings: number;
  totalDockings: number;
  totalDeltaVExpendedMs: number;
}
