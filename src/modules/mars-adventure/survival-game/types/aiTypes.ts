import { ResourceType } from './survivalTypes';

export type RoverAIMode = 'manual' | 'autonomous';

export type RoverAIState =
  | 'idle'
  | 'planning'
  | 'navigating'
  | 'obstacle_detected'
  | 'recalculating'
  | 'waiting'
  | 'arrived'
  | 'failed';

export interface RoverDestination {
  id: string;
  name: string;
  position: [number, number, number];
  category: 'base' | 'landmark' | 'waypoint' | 'custom';
}

export interface RoverNavigationPlan {
  destination: RoverDestination | null;
  state: RoverAIState;
  waypoints: [number, number][]; // Sequence of [x, z] path coordinates
  currentWaypointIndex: number;
  totalDistance: number;
  remainingDistance: number;
  progressPercent: number;
  estimatedSecondsRemaining?: number;
  failureReason?: string;
  obstacleNotice?: string;
}

export type RobotMode = 'idle' | 'follow_player' | 'return_to_dock' | 'transporting';

export interface RobotPayload {
  type: ResourceType;
  count: number;
  weightKg: number;
  taskId?: string;
}

export interface RobotState {
  id: string;
  name: string;
  position: [number, number, number];
  heading: number; // yaw radians
  speed: number; // current velocity m/s
  batteryPercent: number;
  mode: RobotMode;
  payload: RobotPayload | null;
  maxPayloadKg: number;
  isCharging: boolean;
  dockPosition: [number, number, number];
  currentTaskId: string | null;
}

export type StorageLocation = 'vault' | 'rover' | 'backpack' | 'workshop';

export interface TransportTask {
  id: string;
  resourceType: ResourceType;
  count: number;
  source: StorageLocation;
  destination: StorageLocation;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
  progressPercent: number;
  failureReason?: string;
  timestamp: string;
  completedAt?: string;
}

export type AIRecommendationCategory =
  | 'power'
  | 'weather'
  | 'greenhouse'
  | 'rover'
  | 'vitals'
  | 'facility'
  | 'missions';

export interface BaseAIRecommendation {
  id: string;
  fingerprint: string;
  priority: 'critical' | 'high' | 'medium' | 'info';
  category: AIRecommendationCategory;
  title: string;
  description: string;
  actionType?: 'shed_breakers' | 'recharge_rover' | 'harvest_crop' | 'refill_oxygen' | 'recall_robot';
  actionLabel?: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface BaseAIAlert {
  id: string;
  fingerprint: string;
  message: string;
  severity: 'info' | 'caution' | 'hazard';
  timestamp: string;
}

export const INITIAL_ROBOT_STATE: RobotState = {
  id: 'robot_companion_01',
  name: 'Aero-Bot ("Opportunity-Junior")',
  position: [1.2, 0.85, 2.5], // Resting near interior airlock dock
  heading: 0,
  speed: 0,
  batteryPercent: 92,
  mode: 'idle',
  payload: null,
  maxPayloadKg: 15.0,
  isCharging: false,
  dockPosition: [1.2, 0.85, 2.5],
  currentTaskId: null,
};

export const PRESET_ROVER_DESTINATIONS: RoverDestination[] = [
  {
    id: 'dest_base_garage',
    name: 'Outpost Alpha Rover Garage',
    position: [8.5, 0, 4.0],
    category: 'base',
  },
  {
    id: 'dest_airlock_entrance',
    name: 'Outpost Alpha Main Airlock',
    position: [0, 0, 11.5],
    category: 'base',
  },
  {
    id: 'dest_solar_array',
    name: 'Photovoltaic Array Inverter Field',
    position: [0, 0, 18.0],
    category: 'base',
  },
  {
    id: 'dest_abandoned_rover',
    name: 'Abandoned Rover ("Opportunity-Beta")',
    position: [38, 0, -32],
    category: 'landmark',
  },
  {
    id: 'dest_lava_tube',
    name: 'Subterranean Lava Tube Cave',
    position: [-35, 0, -42],
    category: 'landmark',
  },
  {
    id: 'dest_comms_tower',
    name: 'Deep Space Communications Mast',
    position: [42, 0, 28],
    category: 'landmark',
  },
  {
    id: 'dest_delta_outcrop',
    name: 'Jezero Paleolake Delta Outcrop',
    position: [-40, 0, 22],
    category: 'landmark',
  },
  {
    id: 'dest_meteorite_crater',
    name: 'Crater Borealis Nickel-Iron Meteorite',
    position: [0, 0, 52],
    category: 'landmark',
  },
  {
    id: 'dest_skycrane_crash',
    name: 'Skycrane Impact Crater',
    position: [75, 0, -55],
    category: 'landmark',
  },
  {
    id: 'dest_ares_survey_station',
    name: 'Ares Geological Survey Outpost',
    position: [-75, 0, 65],
    category: 'landmark',
  },
  {
    id: 'dest_canyon_drill_site',
    name: 'Mawrth Canyon Deep-Core Rig',
    position: [85, 0, 15],
    category: 'landmark',
  },
];
