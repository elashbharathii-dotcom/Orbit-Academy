import { ResourceType } from './survivalTypes';
import { FacilityId } from './renovationTypes';

export type MissionCategory = 'story' | 'scientific' | 'exploration' | 'recovery' | 'optional';
export type MissionState = 'locked' | 'available' | 'active' | 'completed' | 'failed';

export type ObjectiveType =
  | 'collect_resource'
  | 'visit_location'
  | 'scan_target'
  | 'repair_facility'
  | 'reach_energy'
  | 'harvest_crop'
  | 'analyze_sample';

export interface MissionObjective {
  id: string;
  title: string;
  description: string;
  type: ObjectiveType;
  targetKey?: string; // Target location ID, resource type, facility ID, or scannable ID
  targetValue: number; // Required count, level, kW, or boolean (1)
  currentValue: number;
  completed: boolean;
  isOptional?: boolean;
}

export interface MissionReward {
  resources?: Array<{ type: ResourceType; count: number }>;
  researchPoints?: number;
  unlockedTechId?: string;
  title?: string;
}

export interface MissionDefinition {
  id: string;
  title: string;
  category: MissionCategory;
  description: string;
  loreBriefing: string;
  objectives: MissionObjective[];
  rewards: MissionReward;
  state: MissionState;
  prerequisiteMissionIds?: string[];
  requiredFacilityLevels?: Partial<Record<FacilityId, number>>;
  waypointCoordinates?: [number, number, number];
  completedTimestamp?: string;
}

export interface ExplorationLandmark {
  id: string;
  name: string;
  code: string;
  category: 'outpost' | 'anomaly' | 'geology' | 'relic' | 'crater';
  description: string;
  coordinates: [number, number, number]; // Actual 3D coordinates [x, y, z]
  discoveryRadius: number;
  discovered: boolean;
  hasSample: boolean;
  sampleYield?: { type: ResourceType; count: number; name: string };
  scannableTargetId?: string;
}

export interface ScannableTarget {
  id: string;
  name: string;
  category: 'mineral' | 'geological' | 'equipment' | 'soil' | 'atmosphere';
  chemicalFormula?: string;
  description: string;
  geologicalAge?: string;
  spectrometryData: string;
  researchValue: number;
  position: [number, number, number];
  scanned: boolean;
}

export interface ResearchTech {
  id: string;
  name: string;
  category: 'suit' | 'solar' | 'rover' | 'bio';
  description: string;
  costPoints: number;
  unlocked: boolean;
  effects: {
    oxygenEfficiency?: number; // e.g. 0.25 (25% reduction in O2 drain)
    solarBoost?: number; // e.g. 0.20 (20% increase in PV output)
    roverSpeedBoost?: number; // e.g. 0.25 (25% increase in top speed & motor efficiency)
    greenhouseGrowthBoost?: number; // e.g. 0.35 (35% faster crop incubation)
  };
}

export interface WorldEvent {
  id: string;
  title: string;
  description: string;
  type: 'storm_warning' | 'transponder_ping' | 'solar_flare' | 'delta_tremor' | 'rover_diagnostic';
  severity: 'info' | 'caution' | 'hazard';
  durationSeconds: number;
  remainingSeconds: number;
  coordinates?: [number, number, number];
  bonusEffect?: string;
}

export const INITIAL_LANDMARKS: ExplorationLandmark[] = [
  {
    id: 'loc_outpost_alpha',
    name: 'Outpost Alpha Habitat',
    code: 'BASE-01',
    category: 'outpost',
    description: 'Pressurized geodesic central habitat, life-support reactor, and communications hub.',
    coordinates: [0, 0, 0],
    discoveryRadius: 15,
    discovered: true,
    hasSample: false,
  },
  {
    id: 'loc_abandoned_rover',
    name: 'Abandoned Rover ("Opportunity-Beta")',
    code: 'RELIC-07',
    category: 'relic',
    description: 'Weathered precursor exploration rover partially submerged in iron-oxide drifts with salvageable avionics.',
    coordinates: [38, 0, -32],
    discoveryRadius: 14,
    discovered: false,
    hasSample: true,
    sampleYield: { type: 'electronic_parts', count: 3, name: 'Precursor Flight Avionics' },
    scannableTargetId: 'scan_rover_avionics',
  },
  {
    id: 'loc_lava_tube',
    name: 'Ancient Subterranean Lava Tube',
    code: 'GEO-04',
    category: 'geology',
    description: 'Cavernous volcanic basalt mouth with thermal venting, shielding against cosmic radiation.',
    coordinates: [-35, 0, -42],
    discoveryRadius: 16,
    discovered: false,
    hasSample: true,
    sampleYield: { type: 'silicate_crystal', count: 3, name: 'Basalt Glass Specimen' },
    scannableTargetId: 'scan_basalt_spires',
  },
  {
    id: 'loc_comms_tower',
    name: 'Damaged Comms Relay Tower',
    code: 'RELIC-02',
    category: 'relic',
    description: 'Overturned deep-space transmission lattice mast with intermittent emergency beacon transmissions.',
    coordinates: [42, 0, 28],
    discoveryRadius: 14,
    discovered: false,
    hasSample: true,
    sampleYield: { type: 'circuit_board', count: 2, name: 'Relay Transponder Array' },
    scannableTargetId: 'scan_relay_transceiver',
  },
  {
    id: 'loc_delta_outcrop',
    name: 'Jezero Paleolake Delta Outcrop',
    code: 'GEO-09',
    category: 'geology',
    description: 'Exposed stratigraphy revealing 3.7-billion-year-old river delta clays and smectite sedimentary layers.',
    coordinates: [-40, 0, 22],
    discoveryRadius: 15,
    discovered: false,
    hasSample: true,
    sampleYield: { type: 'scientific_sample', count: 3, name: 'Delta Clay Core Sample' },
    scannableTargetId: 'scan_paleolake_clay',
  },
  {
    id: 'loc_meteorite_crater',
    name: 'Crater Borealis Meteorite Impact',
    code: 'CRATER-03',
    category: 'crater',
    description: 'Recent meteorite impact bowl displaying sintered glass walls and an exposed nickel-iron metallic core.',
    coordinates: [0, 0, 52],
    discoveryRadius: 16,
    discovered: false,
    hasSample: true,
    sampleYield: { type: 'hematite', count: 4, name: 'Nickel-Iron Meteorite Shard' },
    scannableTargetId: 'scan_meteorite_core',
  },
  {
    id: 'loc_cave_interior',
    name: 'Subterranean Lava Tube Cavern',
    code: 'CAVE-DEEP-01',
    category: 'geology',
    description: 'Deep radiation-shielded geothermal basalt vault with subterranean permafrost ice wall and hydrothermal vent mineral crystals.',
    coordinates: [-30, -5.2, -68],
    discoveryRadius: 18,
    discovered: false,
    hasSample: true,
    sampleYield: { type: 'silicate_crystal', count: 4, name: 'Subterranean Quartz Geode' },
    scannableTargetId: 'scan_cave_ice_core',
  },
  {
    id: 'loc_skycrane_crash',
    name: 'Skycrane Impact Crater',
    code: 'CRASH-SKY-01',
    category: 'relic',
    description: 'Shattered titanium descent stage frame and hypergolic propellant tanks from the original landing mission.',
    coordinates: [75, 0, -55],
    discoveryRadius: 16,
    discovered: false,
    hasSample: true,
    sampleYield: { type: 'titanium_scrap', count: 4, name: 'Skycrane Titanium Truss' },
    scannableTargetId: 'scan_skycrane_propellant',
  },
  {
    id: 'loc_ares_survey_station',
    name: 'Ares Geological Survey Outpost',
    code: 'SURVEY-ALPHA-02',
    category: 'outpost',
    description: 'Abandoned automated weather station and seismic monitoring mast perched on the highland ridge.',
    coordinates: [-75, 0, 65],
    discoveryRadius: 16,
    discovered: false,
    hasSample: true,
    sampleYield: { type: 'electronic_parts', count: 3, name: 'Ares Station Transponder' },
    scannableTargetId: 'scan_ares_seismometer',
  },
  {
    id: 'loc_canyon_drill_site',
    name: 'Mawrth Canyon Deep-Core Rig',
    code: 'RIG-CORE-04',
    category: 'relic',
    description: 'Heavy pneumatic rotary drilling derrick erected to tap ancient Noachian groundwater beneath Mawrth Canyon.',
    coordinates: [85, 0, 15],
    discoveryRadius: 16,
    discovered: false,
    hasSample: true,
    sampleYield: { type: 'scrap_metal', count: 5, name: 'Rotary Drill Bit Casting' },
    scannableTargetId: 'scan_canyon_core_drill',
  },
];

export const INITIAL_SCANNABLES: ScannableTarget[] = [
  {
    id: 'scan_ice_delta',
    name: 'Delta Glacial Seam Outcrop',
    category: 'mineral',
    chemicalFormula: 'H2O • (hydrated sulfates)',
    description: 'Permafrost lens preserved beneath insulating regolith in Jezero delta basin.',
    geologicalAge: 'Late Noachian (~3.8 Ga)',
    spectrometryData: '94.2% H2O, 5.8% Mg-sulfates, 0.08% D/H isotopic ratio.',
    researchValue: 50,
    position: [18, 0, -22],
    scanned: false,
  },
  {
    id: 'scan_hematite_blueberries',
    name: 'Hematite Concretion Field',
    category: 'geological',
    chemicalFormula: 'Fe2O3 (Hematite)',
    description: 'Spherical concretions weathered from ancient neutral groundwater percolation.',
    geologicalAge: 'Early Hesperian (~3.6 Ga)',
    spectrometryData: '69.9% Elemental Iron, crystalline rhombohedral matrix.',
    researchValue: 40,
    position: [24, 0, 14],
    scanned: false,
  },
  {
    id: 'scan_sulfur_chimney',
    name: 'Hydrothermal Sulfur Chimney',
    category: 'mineral',
    chemicalFormula: 'S8 • FeS2 (Pyrite-Sulfur)',
    description: 'Prehistoric volcanic geothermal fumarole deposit rich in native sulfur.',
    geologicalAge: 'Hesperian (~3.5 Ga)',
    spectrometryData: '88.4% Elemental Sulfur, high electro-affinity and dielectric stability.',
    researchValue: 45,
    position: [-22, 0, -18],
    scanned: false,
  },
  {
    id: 'scan_rover_avionics',
    name: 'Opportunity-Beta Avionics Core',
    category: 'equipment',
    chemicalFormula: 'Si-Au-GaAs Microelectronics',
    description: 'Radiation-hardened flight guidance computer from an early exploratory rover.',
    geologicalAge: 'Mission Sol -1820',
    spectrometryData: 'Gallium arsenide logic gates, intact ROM telemetry partitions.',
    researchValue: 80,
    position: [38, 0, -32],
    scanned: false,
  },
  {
    id: 'scan_basalt_spires',
    name: 'Subterranean Basalt Cave Spires',
    category: 'geological',
    chemicalFormula: 'SiO2-Al2O3-CaO Tholeiitic Basalt',
    description: 'Columnar basalt cooling joints forming natural radiation-shielded tunnel architectures.',
    geologicalAge: 'Early Noachian (~4.0 Ga)',
    spectrometryData: '49.2% SiO2, 13.8% FeO, exceptionally low radioactive thorium signature.',
    researchValue: 65,
    position: [-35, 0, -42],
    scanned: false,
  },
  {
    id: 'scan_meteorite_core',
    name: 'Nickel-Iron Meteorite Core',
    category: 'mineral',
    chemicalFormula: 'Fe-Ni (Kamacite & Taenite)',
    description: 'Extraterrestrial metallic core fragment survived atmospheric ablation.',
    geologicalAge: 'Asteroidal Origin (~4.56 Ga)',
    spectrometryData: '91.2% Fe, 8.4% Ni, 0.4% Co, Widmanstätten crystallization pattern.',
    researchValue: 90,
    position: [0, 0, 52],
    scanned: false,
  },
  {
    id: 'scan_relay_transceiver',
    name: 'Overturned Relay Transceiver',
    category: 'equipment',
    chemicalFormula: 'Al-Be-Cu Aerospace Antenna',
    description: 'Deep-space parabolic steerable feedhorn with intact beryllium reflector dishes.',
    geologicalAge: 'Mission Sol -1400',
    spectrometryData: 'X-band 8.4 GHz cavity resonance, high-gain directional amplifier intact.',
    researchValue: 75,
    position: [42, 0, 28],
    scanned: false,
  },
  {
    id: 'scan_paleolake_clay',
    name: 'Jezero Smectite Clay Stratum',
    category: 'soil',
    chemicalFormula: '(Na,Ca)0.33(Al,Mg)2(Si4O10)(OH)2•nH2O',
    description: 'Hydrated phyllosilicate clay sediment capable of preserving ancient organic biosignatures.',
    geologicalAge: 'Late Noachian (~3.75 Ga)',
    spectrometryData: 'Cation-exchange capacity: 85 meq/100g, presence of layered octahedral alumina.',
    researchValue: 85,
    position: [-40, 0, 22],
    scanned: false,
  },
  {
    id: 'scan_cave_ice_core',
    name: 'Ancient Subterranean Permafrost Glacier',
    category: 'mineral',
    chemicalFormula: 'H2O • Prebiotic Clathrate Hydrates',
    description: 'Pristine subterranean glacial ice sheet shielded from cosmic rays for 3.9 billion years.',
    geologicalAge: 'Early Noachian (~3.9 Ga)',
    spectrometryData: '99.1% H2O, 0.6% methane clathrate, ultra-depleted cosmogenic radionuclide signature.',
    researchValue: 120,
    position: [-30, -5.2, -68],
    scanned: false,
  },
  {
    id: 'scan_skycrane_propellant',
    name: 'Hydrazine Reaction Control Thruster',
    category: 'equipment',
    chemicalFormula: 'N2H4 / MMH Titanium Casing',
    description: 'Charred monopropellant catalytic chamber with beryllium combustion throat.',
    geologicalAge: 'Mission Sol -2100',
    spectrometryData: 'Residual hydrazine vapor 12 ppm, iridium catalytic mesh structural integrity 84%.',
    researchValue: 85,
    position: [75, 0, -55],
    scanned: false,
  },
  {
    id: 'scan_ares_seismometer',
    name: 'Broadband Planetary Seismometer',
    category: 'equipment',
    chemicalFormula: 'Fused Silica Spring & Capacitive Sensor',
    description: 'High-frequency ground-motion accelerometer recording marsquakes and microseismic tremor waves.',
    geologicalAge: 'Mission Sol -1650',
    spectrometryData: 'Triaxial displacement sensor online, recorded 142 micro-seismic events in Ares Ridge.',
    researchValue: 95,
    position: [-75, 0, 65],
    scanned: false,
  },
  {
    id: 'scan_canyon_core_drill',
    name: 'Tungsten-Carbide Deep-Core Drill Head',
    category: 'mineral',
    chemicalFormula: 'WC-Co (Tungsten Carbide Matrix)',
    description: 'Industrial rotary drill stem with sintered polycrystalline diamond cutters embedded in mudstone.',
    geologicalAge: 'Mission Sol -1200',
    spectrometryData: 'Hardness: 9.5 Mohs, compressive strength: 4.8 GPa, stratified clay core extracted.',
    researchValue: 90,
    position: [85, 0, 15],
    scanned: false,
  },
];

export const INITIAL_RESEARCH_TECHS: ResearchTech[] = [
  {
    id: 'tech_eva_recirculator',
    name: 'Enhanced EVA Oxygen Recirculator',
    category: 'suit',
    description: 'Upgrades astronaut spacesuit CO2 scrubbers with closed-loop potassium superoxide canisters, reducing outdoor EVA oxygen consumption by 25%.',
    costPoints: 120,
    unlocked: false,
    effects: { oxygenEfficiency: 0.25 },
  },
  {
    id: 'tech_pv_coating',
    name: 'Anti-Dust Photovoltaic Coating',
    category: 'solar',
    description: 'Applies transparent electro-hydrodynamic repellent films across Outpost Alpha solar arrays, boosting solar generation by 20% and reducing dust storm loss.',
    costPoints: 160,
    unlocked: false,
    effects: { solarBoost: 0.2 },
  },
  {
    id: 'tech_rover_suspension',
    name: 'Titanium Bogie Suspension Struts',
    category: 'rover',
    description: 'Reinforces 6-wheel rocker-bogie differential joints with lightweight titanium spars, boosting rover top speed and battery efficiency by 25%.',
    costPoints: 180,
    unlocked: false,
    effects: { roverSpeedBoost: 0.25 },
  },
  {
    id: 'tech_bio_nutrients',
    name: 'Synthesized Aeroponic Growth Formula',
    category: 'bio',
    description: 'Formulates concentrated micronutrient potassium-phosphate solution for bio-dome mister nozzles, accelerating potato crop growth by 35%.',
    costPoints: 150,
    unlocked: false,
    effects: { greenhouseGrowthBoost: 0.35 },
  },
];

export const INITIAL_MISSIONS: Record<string, MissionDefinition> = {
  mis_restore_comms: {
    id: 'mis_restore_comms',
    title: 'MISSION 01 — Restore Communications',
    category: 'story',
    description: 'Repair the Communications Room inside Outpost Alpha to Level 1 and activate the high-gain telemetry uplink.',
    loreBriefing: 'Mission Control on Earth lost telemetry contact with Outpost Alpha following Sol 24 dust squalls. Our roof parabolic dish must be aligned to establish real-time packet exchange.',
    state: 'active',
    objectives: [
      {
        id: 'obj_comm_repair',
        title: 'Repair Communications Room to Level 1',
        description: 'Gather required scrap metal and electronics, then renovate Comms Room.',
        type: 'repair_facility',
        targetKey: 'comm_room',
        targetValue: 1,
        currentValue: 0,
        completed: false,
      },
      {
        id: 'obj_comm_activate',
        title: 'Establish Earth Uplink at Comms Console',
        description: 'Inspect the newly online high-gain transceiver inside the Comms Room.',
        type: 'visit_location',
        targetKey: 'loc_outpost_alpha',
        targetValue: 1,
        currentValue: 0,
        completed: false,
      },
    ],
    rewards: {
      resources: [
        { type: 'circuit_board', count: 3 },
        { type: 'battery_cell', count: 2 },
        { type: 'copper_wire', count: 4 },
      ],
      researchPoints: 100,
      title: 'Communications Officer',
    },
    waypointCoordinates: [0, 0, 0],
  },

  mis_energy_independence: {
    id: 'mis_energy_independence',
    title: 'MISSION 02 — Energy Independence',
    category: 'story',
    description: 'Achieve stable photovoltaic generation and accumulate 90 kWh in auxiliary battery storage.',
    loreBriefing: 'With sub-zero Martian nights reaching -115°C, suit heaters and life-support cryocoolers demand substantial kilowatt-hour reserves. Align arrays and build capacity.',
    state: 'available',
    prerequisiteMissionIds: ['mis_restore_comms'],
    objectives: [
      {
        id: 'obj_solar_peak',
        title: 'Achieve >= 10.0 kW Instantaneous Solar Generation',
        description: 'Monitor solar generation around midday (LMST 11:00 - 14:00) during clear skies.',
        type: 'reach_energy',
        targetKey: 'solar',
        targetValue: 10.0,
        currentValue: 0,
        completed: false,
      },
      {
        id: 'obj_battery_reserve',
        title: 'Store >= 90.0 kWh in Base Auxiliary Batteries',
        description: 'Balance circuit breaker loads until storage reaches 90 kWh.',
        type: 'reach_energy',
        targetKey: 'battery',
        targetValue: 90.0,
        currentValue: 0,
        completed: false,
      },
    ],
    rewards: {
      resources: [
        { type: 'battery_pack', count: 2 },
        { type: 'copper_wire', count: 4 },
        { type: 'fasteners', count: 6 },
      ],
      researchPoints: 120,
      title: 'Power Systems Specialist',
    },
    waypointCoordinates: [0, 0, 18],
  },

  mis_scientific_survey: {
    id: 'mis_scientific_survey',
    title: 'MISSION 03 — First Scientific Survey',
    category: 'scientific',
    description: 'Deploy your visor scanner [V] to analyze 5 unique geological formations or mineral nodes in Jezero Crater.',
    loreBriefing: 'NASA and Orbit Academy require analytical mass-spectrometry of native volatile ice, iron-oxide concretions, and volcanic sulfur formations to evaluate in-situ resource utilization.',
    state: 'available',
    objectives: [
      {
        id: 'obj_scan_five',
        title: 'Spectrally Scan 5 Geological Objects',
        description: 'Approach mineral formations and hold scanning reticle to catalog spectrometry.',
        type: 'scan_target',
        targetValue: 5,
        currentValue: 0,
        completed: false,
      },
    ],
    rewards: {
      resources: [
        { type: 'food_ration', count: 3 },
        { type: 'water', count: 3 },
      ],
      researchPoints: 150,
      title: 'Field Geologist',
    },
    waypointCoordinates: [18, 0, -22],
  },

  mis_forgotten_rover: {
    id: 'mis_forgotten_rover',
    title: 'MISSION 04 — The Forgotten Rover',
    category: 'recovery',
    description: 'Locate the abandoned precursor rover ("Opportunity-Beta") at [38, 0, -32] and salvage its avionics core.',
    loreBriefing: 'Orbital high-resolution images show an early uncrewed exploration rover stranded in a boulder basin northeast of Outpost Alpha. Its radiation-shielded avionics can be recovered.',
    state: 'available',
    prerequisiteMissionIds: ['mis_scientific_survey'],
    objectives: [
      {
        id: 'obj_find_rover',
        title: 'Locate Abandoned Rover Site at [38, 0, -32]',
        description: 'Traverse northeast by foot or in your rover until Opportunity-Beta is in view.',
        type: 'visit_location',
        targetKey: 'loc_abandoned_rover',
        targetValue: 1,
        currentValue: 0,
        completed: false,
      },
      {
        id: 'obj_salvage_avionics',
        title: 'Scan or Salvage the Rover Avionics Core',
        description: 'Extract the scientific avionics payload from the chassis.',
        type: 'scan_target',
        targetKey: 'scan_rover_avionics',
        targetValue: 1,
        currentValue: 0,
        completed: false,
      },
    ],
    rewards: {
      resources: [
        { type: 'scrap_metal', count: 8 },
        { type: 'electronic_parts', count: 4 },
        { type: 'repair_kit', count: 1 },
      ],
      researchPoints: 160,
      title: 'Salvage Pioneer',
    },
    waypointCoordinates: [38, 0, -32],
  },

  mis_expand_greenhouse: {
    id: 'mis_expand_greenhouse',
    title: 'MISSION 05 — Expand the Greenhouse',
    category: 'story',
    description: 'Renovate the Hydroponic Bio-Dome to Level 2 (Operational) and successfully harvest an aeroponic potato crop.',
    loreBriefing: 'Packaged ration reserves will not sustain prolonged habitation. Level 2 aeroponics introduces pressurized multi-tiered vertical racking and high-intensity ultraviolet grow arrays.',
    state: 'available',
    prerequisiteMissionIds: ['mis_energy_independence'],
    objectives: [
      {
        id: 'obj_greenhouse_lvl2',
        title: 'Upgrade Greenhouse to Level 2 (Operational)',
        description: 'Provide required materials at the Space Center Renovation station.',
        type: 'repair_facility',
        targetKey: 'greenhouse',
        targetValue: 2,
        currentValue: 0,
        completed: false,
      },
      {
        id: 'obj_harvest_crop',
        title: 'Plant, Irrigate and Harvest a Crop',
        description: 'Seed potato sprouts with 1x Water, let grow, and harvest rations.',
        type: 'harvest_crop',
        targetValue: 1,
        currentValue: 0,
        completed: false,
      },
    ],
    rewards: {
      resources: [
        { type: 'food_ration', count: 4 },
        { type: 'water_ice', count: 3 },
      ],
      researchPoints: 140,
      title: 'Botanical Engineer',
    },
    waypointCoordinates: [3.2, 0, -14.5],
  },

  mis_unidentified_signal: {
    id: 'mis_unidentified_signal',
    title: 'MISSION 06 — The Unidentified Signal',
    category: 'exploration',
    description: 'Investigate the subterranean Lava Tube Cave entrance at [-35, 0, -42] and scan the basalt spires.',
    loreBriefing: 'Deep-space radar detected an anomalous low-frequency periodic harmonic echoing from the southern basalt lava tube cave. Investigate this subterranean formation to uncover its source.',
    state: 'available',
    prerequisiteMissionIds: ['mis_forgotten_rover'],
    objectives: [
      {
        id: 'obj_reach_lavatube',
        title: 'Discover Ancient Lava Tube Cave at [-35, 0, -42]',
        description: 'Drive southwest through the dune corridor to reach the arched cavern opening.',
        type: 'visit_location',
        targetKey: 'loc_lava_tube',
        targetValue: 1,
        currentValue: 0,
        completed: false,
      },
      {
        id: 'obj_scan_spires',
        title: 'Spectrally Scan Ancient Basalt Cave Spires',
        description: 'Aim your scanner at the cavern basalt spire formations to analyze composition.',
        type: 'scan_target',
        targetKey: 'scan_basalt_spires',
        targetValue: 1,
        currentValue: 0,
        completed: false,
      },
    ],
    rewards: {
      resources: [
        { type: 'scrap_metal', count: 10 },
        { type: 'copper_wire', count: 6 },
        { type: 'circuit_board', count: 3 },
      ],
      researchPoints: 250,
      title: 'Subterranean Explorer',
    },
    waypointCoordinates: [-35, 0, -42],
  },

  mis_deep_core_samples: {
    id: 'mis_deep_core_samples',
    title: 'MISSION 07 — Paleolake Clay Core Sampling',
    category: 'scientific',
    description: 'Traverse to the Jezero Paleolake Delta Outcrop [-40, 0, 22] and extract ancient sedimentary clay samples.',
    loreBriefing: 'The Jezero delta preserves billion-year-old hydrated phyllosilicate smectites formed in neutral freshwater. Recovering these samples provides foundational evidence for ancient Martian water.',
    state: 'available',
    objectives: [
      {
        id: 'obj_visit_delta',
        title: 'Reach Paleolake Delta at [-40, 0, 22]',
        description: 'Traverse west onto the elevated delta sediment shelves.',
        type: 'visit_location',
        targetKey: 'loc_delta_outcrop',
        targetValue: 1,
        currentValue: 0,
        completed: false,
      },
      {
        id: 'obj_scan_clay',
        title: 'Spectrally Scan Smectite Clay Stratum',
        description: 'Complete spectral scan of the delta clay layer.',
        type: 'scan_target',
        targetKey: 'scan_paleolake_clay',
        targetValue: 1,
        currentValue: 0,
        completed: false,
      },
    ],
    rewards: {
      resources: [
        { type: 'scientific_sample', count: 3 },
        { type: 'food_ration', count: 2 },
      ],
      researchPoints: 175,
      title: 'Paleohydrologist',
    },
    waypointCoordinates: [-40, 0, 22],
  },

  mis_subterranean_frontier: {
    id: 'mis_subterranean_frontier',
    title: 'MISSION 08 — Subterranean Frontier',
    category: 'exploration',
    description: 'Venture deep inside the Lava Tube system, descend to the Cavern Vault at [-30, -5.2, -68], and analyze the subterranean glacial ice core.',
    loreBriefing: 'Orbital ground-penetrating radar indicates a massive subterranean geothermal cavern complex underlying Syrtis Basalt. Protected from solar flares and cosmic radiation, this vault contains ancient pristine permafrost.',
    state: 'available',
    objectives: [
      {
        id: 'obj_enter_cavern_vault',
        title: 'Descend into Cavern Vault at [-30, -5.2, -68]',
        description: 'Navigate down the entrance ramp and lava conduit into the deep vault.',
        type: 'visit_location',
        targetKey: 'loc_cave_interior',
        targetValue: 1,
        currentValue: 0,
        completed: false,
      },
      {
        id: 'obj_scan_ancient_ice',
        title: 'Scan Ancient Subterranean Glacier Core',
        description: 'Deploy visor scanner to analyze prebiotic clathrate ice strata.',
        type: 'scan_target',
        targetKey: 'scan_cave_ice_core',
        targetValue: 1,
        currentValue: 0,
        completed: false,
      },
    ],
    rewards: {
      resources: [
        { type: 'water_ice', count: 6 },
        { type: 'silicate_crystal', count: 4 },
        { type: 'battery_pack', count: 2 },
      ],
      researchPoints: 220,
      title: 'Speleological Specialist',
    },
    waypointCoordinates: [-30, -5.2, -68],
  },

  mis_planetary_expedition: {
    id: 'mis_planetary_expedition',
    title: 'MISSION 09 — Planetary Horizon Expedition',
    category: 'exploration',
    description: 'Mount a long-range survey across the expanded 360m terrain: survey the Mawrth Canyon Core Rig [85, 0, 15] and Skycrane Crash [75, 0, -55].',
    loreBriefing: 'To prepare Outpost Alpha for multi-year autonomy, survey remote precursor sites in Mawrth Canyon and recover salvageable titanium from the supersonic descent skycrane.',
    state: 'available',
    objectives: [
      {
        id: 'obj_survey_canyon_rig',
        title: 'Survey Mawrth Canyon Drill Rig at [85, 0, 15]',
        description: 'Drive or hike through Mawrth Canyon wadi pass to locate the heavy drill derrick.',
        type: 'visit_location',
        targetKey: 'loc_canyon_drill_site',
        targetValue: 1,
        currentValue: 0,
        completed: false,
      },
      {
        id: 'obj_scan_skycrane',
        title: 'Spectrally Scan Skycrane Thruster Assembly',
        description: 'Inspect the descent stage impact crater at [75, 0, -55].',
        type: 'scan_target',
        targetKey: 'scan_skycrane_propellant',
        targetValue: 1,
        currentValue: 0,
        completed: false,
      },
    ],
    rewards: {
      resources: [
        { type: 'titanium_scrap', count: 5 },
        { type: 'structural_frame', count: 2 },
        { type: 'repair_kit', count: 2 },
      ],
      researchPoints: 260,
      title: 'Planetary Pathfinder',
    },
    waypointCoordinates: [85, 0, 15],
  },
};
