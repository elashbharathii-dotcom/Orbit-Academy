import {
  BaseAIRecommendation,
  BaseAIAlert,
} from '../types/aiTypes';
import {
  BasePowerGrid,
  SolCycle,
  PlayerVitals,
  GreenhouseCropState,
  RoverTelemetry,
} from '../types/survivalTypes';
import { FacilityRenovations } from '../types/renovationTypes';
import { MissionDefinition } from '../types/missionTypes';

export interface BaseTelemetrySnapshot {
  powerGrid: BasePowerGrid;
  solCycle: SolCycle;
  vitals: PlayerVitals;
  greenhouseCrop: GreenhouseCropState;
  facilityRenovations: FacilityRenovations;
  roverTelemetry: RoverTelemetry;
  roverPosition: [number, number, number];
  playerPosition: [number, number, number];
  isInsideHab: boolean;
  missions: Record<string, MissionDefinition>;
  researchDataPoints: number;
  unlockedTechIds: string[];
}

export class BaseAISystem {
  /**
   * Evaluates all base telemetry streams and synthesizes prioritized, actionable recommendations
   */
  public static evaluateRecommendations(snapshot: BaseTelemetrySnapshot): BaseAIRecommendation[] {
    const recs: BaseAIRecommendation[] = [];
    const solTimeStr = `Sol ${snapshot.solCycle.solNumber} • ${Math.floor(snapshot.solCycle.timeOfDay).toString().padStart(2, '0')}:${Math.floor((snapshot.solCycle.timeOfDay % 1) * 60).toString().padStart(2, '0')}`;

    // 1. Grid Blackout Emergency
    if (snapshot.powerGrid.isBlackout) {
      recs.push({
        id: 'rec_grid_blackout',
        fingerprint: 'power_blackout_active',
        priority: 'critical',
        category: 'power',
        title: 'OUTPOST ALPHA GRID BLACKOUT',
        description: 'Auxiliary battery reserve is completely exhausted (0.0 kWh). Life-support and habitat heating are offline.',
        actionType: 'shed_breakers',
        actionLabel: 'SHED NONESSENTIAL CIRCUITS',
        timestamp: solTimeStr,
        acknowledged: false,
      });
    }

    // 2. Battery Depletion Risk during Nightfall
    else if (!snapshot.solCycle.isDaytime && snapshot.powerGrid.batteryStorageKWh < 25.0) {
      recs.push({
        id: 'rec_night_power_depletion',
        fingerprint: `power_low_night_${Math.floor(snapshot.powerGrid.batteryStorageKWh / 5)}`,
        priority: 'critical',
        category: 'power',
        title: 'CRITICAL BATTERY DEPLETION RISK',
        description: `Auxiliary battery at ${snapshot.powerGrid.batteryStorageKWh.toFixed(1)} kWh during freezing Martian night. Shed Living Quarters & Comm Room circuits to protect Life Support.`,
        actionType: 'shed_breakers',
        actionLabel: 'SHED NONESSENTIAL CIRCUITS',
        timestamp: solTimeStr,
        acknowledged: false,
      });
    }

    // 3. Astronaut Oxygen Depletion Outdoors
    if (!snapshot.isInsideHab && snapshot.vitals.oxygen < 25.0) {
      recs.push({
        id: 'rec_eva_oxygen_low',
        fingerprint: `eva_o2_low_${Math.floor(snapshot.vitals.oxygen / 5)}`,
        priority: 'critical',
        category: 'vitals',
        title: 'EVA SUIT OXYGEN LOW (<25%)',
        description: `Suit primary tank at ${snapshot.vitals.oxygen.toFixed(0)}%. Infiltrate Outpost Alpha airlock or synthesize emergency oxygen replenishment.`,
        actionType: 'refill_oxygen',
        actionLabel: 'DEPLOY O2 ELECTROLYSIS',
        timestamp: solTimeStr,
        acknowledged: false,
      });
    }

    // 4. Greenhouse Crop Ready for Harvest
    if (snapshot.greenhouseCrop.stage === 'ready') {
      recs.push({
        id: 'rec_crop_ready',
        fingerprint: 'greenhouse_crop_matured',
        priority: 'high',
        category: 'greenhouse',
        title: 'AEROPONIC CROP FULLY MATURED',
        description: 'Greenhouse aeroponic potato crop has reached 100% maturity. Harvest immediately to replenish base caloric rations.',
        actionType: 'harvest_crop',
        actionLabel: 'HARVEST POTATO CROP',
        timestamp: solTimeStr,
        acknowledged: false,
      });
    }

    // 5. Rover Battery Low while Distant
    const distToGarage = Math.hypot(snapshot.roverPosition[0] - 8.5, snapshot.roverPosition[2] - 4.0);
    if (snapshot.roverTelemetry.batteryPercent < 30.0 && distToGarage > 12.0) {
      recs.push({
        id: 'rec_rover_battery_low',
        fingerprint: `rover_bat_low_${Math.floor(snapshot.roverTelemetry.batteryPercent / 5)}`,
        priority: 'high',
        category: 'rover',
        title: 'ROVER BATTERY DEPLETING (<30%)',
        description: `Mars Rover at ${snapshot.roverTelemetry.batteryPercent.toFixed(0)}% charge, ${Math.round(distToGarage)}m from Outpost Alpha. Return to Garage induction pad before battery exhaustion.`,
        actionType: 'recharge_rover',
        actionLabel: 'ENGAGE AUTONOMOUS RETURN',
        timestamp: solTimeStr,
        acknowledged: false,
      });
    }

    // 6. Dust Storm Power Attenuation
    if (snapshot.solCycle.weather === 'heavy_dust' && snapshot.solCycle.isDaytime) {
      recs.push({
        id: 'rec_dust_storm_attenuation',
        fingerprint: 'dust_storm_attenuation_active',
        priority: 'medium',
        category: 'weather',
        title: 'SEVERE DUST STORM ACTIVE',
        description: `Atmospheric dust intensity ${(snapshot.solCycle.dustStormIntensity * 100).toFixed(0)}% is severely attenuating solar array generation (${snapshot.powerGrid.solarOutputKW.toFixed(1)} kW).`,
        timestamp: solTimeStr,
        acknowledged: false,
      });
    }

    // 7. Research Blueprint Unlocks Available
    if (snapshot.researchDataPoints >= 60 && snapshot.unlockedTechIds.length < 4) {
      recs.push({
        id: 'rec_research_available',
        fingerprint: `research_points_${Math.floor(snapshot.researchDataPoints / 20)}`,
        priority: 'info',
        category: 'facility',
        title: 'TECHNOLOGY BLUEPRINT UNLOCKS AVAILABLE',
        description: `Laboratory has accumulated ${snapshot.researchDataPoints} Research Points. Inspect Engineering Workshop research terminal to unlock system upgrades.`,
        timestamp: solTimeStr,
        acknowledged: false,
      });
    }

    // Sort by priority hierarchy
    const priorityWeight = { critical: 4, high: 3, medium: 2, info: 1 };
    return recs.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  }

  /**
   * Compiles recent system alerts with fingerprint deduplication to avoid repetitive notification spam
   */
  public static processAlerts(
    snapshot: BaseTelemetrySnapshot,
    existingAlerts: BaseAIAlert[]
  ): BaseAIAlert[] {
    const newAlerts: BaseAIAlert[] = [];
    const solTimeStr = `Sol ${snapshot.solCycle.solNumber} • ${Math.floor(snapshot.solCycle.timeOfDay).toString().padStart(2, '0')}:${Math.floor((snapshot.solCycle.timeOfDay % 1) * 60).toString().padStart(2, '0')}`;

    const addAlert = (fingerprint: string, message: string, severity: 'info' | 'caution' | 'hazard') => {
      // Check if alert with same fingerprint occurred recently
      const alreadyPresent = existingAlerts.some((a) => a.fingerprint === fingerprint);
      if (!alreadyPresent) {
        newAlerts.push({
          id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          fingerprint,
          message,
          severity,
          timestamp: solTimeStr,
        });
      }
    };

    if (snapshot.powerGrid.isBlackout) {
      addAlert('alert_blackout', 'Outpost Alpha primary grid blackout detected.', 'hazard');
    }
    if (snapshot.vitals.oxygen < 20 && !snapshot.isInsideHab) {
      addAlert('alert_low_oxygen', 'EVA Suit oxygen depleted below 20%.', 'hazard');
    }
    if (snapshot.solCycle.weather === 'heavy_dust') {
      addAlert('alert_storm', 'Severe Jezero dust storm active.', 'caution');
    }
    if (snapshot.greenhouseCrop.stage === 'ready') {
      addAlert('alert_crop_ready', 'Greenhouse aeroponic potato crop ready for harvest.', 'info');
    }

    return [...newAlerts, ...existingAlerts].slice(0, 30);
  }
}
