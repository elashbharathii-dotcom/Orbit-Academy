export type ComponentCategory =
  | 'fuselage'
  | 'cockpit'
  | 'engines'
  | 'thrusters'
  | 'wings'
  | 'solar_panels'
  | 'antennas'
  | 'landing_legs'
  | 'fuel_tanks'
  | 'cargo_modules'
  | 'scientific_instruments'
  | 'communication_equipment'
  // Backward compatibility aliases
  | 'systems'
  | 'modules'
  | 'utility'
  | 'decor';

export type ComponentMountSlot =
  | 'stack'    // Centered vertical/longitudinal stack
  | 'radial'   // Side-mounted (wings, engines, boosters, pods)
  | 'top'      // Top nose mount (probe instruments, canopies)
  | 'bottom';  // Bottom engine mount

export type MaterialFinish =
  | 'titanium'         // Brushed titanium alloy
  | 'aluminum'         // Aerospace aluminum
  | 'carbon_fiber'     // Carbon fiber composite
  | 'ceramic_tiles'    // Ceramic thermal protection
  | 'heat_alloy'       // Heat-resistant Inconel alloy
  | 'glass'            // Specular cockpit glass
  | 'gold_insulation'  // Gold thermal MLI insulation
  | 'metallic_coat'    // Polished metallic coating
  | 'painted_gloss'    // Painted aerospace surface
  | 'solar_cells'      // Crystalline solar-cell material
  // Backward compatibility aliases
  | 'carbon'
  | 'ceramic'
  | 'chrome'
  | 'stealth'
  | 'industrial'
  | 'emissive';

export type TransformMode = 'select' | 'translate' | 'rotate' | 'scale';
export type QualityPreset = 'performance' | 'balanced' | 'high' | 'ultra';
export type ShadingMode = 'lit' | 'unlit' | 'wireframe' | 'cutaway';
export type CameraProjection = 'perspective' | 'orthographic';
export type CameraViewAngle = 'free' | 'front' | 'back' | 'top' | 'side' | 'isometric';
export type LightingEnvironmentMode = 'cleanroom' | 'orbit' | 'eclipse';
export type ShipClass = 'Explorer' | 'Fighter' | 'Cruiser' | 'Hauler' | 'Interceptor';

export interface VehicleComponentDef {
  id: string;
  name: string;
  category: ComponentCategory;
  mountSlot: ComponentMountSlot;
  mass: number;         // Dry structural mass (kg)
  propellant?: number;  // Propellant fuel capacity (kg)
  thrust?: number;      // Vacuum thrust (kN)
  isp?: number;         // Specific impulse (s)
  power: number;        // Net electrical balance (kW or MW)
  height: number;       // Structural height (m)
  width: number;        // Lateral width (m)
  length?: number;      // Longitudinal length (m)
  description: string;
  iconName: string;
  defaultColor?: string;
}

export interface AssembledComponent {
  instanceId: string;
  defId: string;
  name: string;
  category: ComponentCategory;
  mountSlot: ComponentMountSlot;
  mountSide?: 'left' | 'right' | 'both' | 'center';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  mass: number;
  propellantCapacity: number;
  propellantFill: number; // 0.0 to 1.0 (fill percentage)
  thrust: number;
  isp: number;
  power: number;
  height: number;
  width: number;
  length?: number;
  throttleTrim?: number;
}

export interface LiveryOption {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  trimColor: string;
  engineGlowColor: string;
  description: string;
}

export interface Blueprint {
  id: string;
  name: string;
  shipClass: ShipClass;
  createdAt: number;
  updatedAt: number;
  isPreset?: boolean;
  author: string;
  liveryId: string;
  materialFinish: MaterialFinish;
  engineGlowColor: string;
  components: AssembledComponent[];
}

export interface VehicleStats {
  dryMass: number;          // kg
  propellantMass: number;   // kg
  totalGrossMass: number;   // kg
  totalThrustKn: number;    // kN
  weightKn: number;         // kN at Earth sea level (g0 = 9.80665)
  twr: number;              // Thrust to Weight Ratio
  weightedIsp: number;      // Specific impulse (s)
  deltaV: number;           // m/s from Tsiolkovsky rocket equation
  netPowerKw: number;       // kW net electrical generation/draw
  stabilityScore: number;   // 0 - 100% stability alignment
  missionReadiness: number; // 0 - 100% mission readiness
  totalLengthMeters: number;// length (m)
  isFlightReady: boolean;   // true if ready for flight
  validationErrors: string[];
}

export interface MissionProfile {
  id: string;
  name: string;
  destination: string;
  reqDeltaV: number;
  reqTwr: number;
  minPower: number;
  requiresCrewOrProbe: boolean;
  requiresDeepSpaceComms?: boolean;
  description: string;
}

export interface BuilderAchievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  iconName: string;
  unlockedAt?: number;
}

export interface PBRMaterialPreset {
  id: MaterialFinish;
  name: string;
  category: string;
  roughness: number;
  metalness: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  description: string;
  specularShift?: number;
}

export interface TestFlightTelemetry {
  altitudeMeters: number;
  velocityMs: number;
  throttlePercent: number;
  gForce: number;
  fuelRemainingPercent: number;
  missionStatus: 'IDLE' | 'IGNITION' | 'LIFTOFF' | 'MAX_Q' | 'STAGE_BURNOUT' | 'ORBIT_ACHIEVED';
  missionTimeSeconds: number;
}
