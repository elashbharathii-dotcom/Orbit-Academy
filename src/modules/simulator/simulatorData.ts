/**
 * ORBIT ACADEMY — AAA SPACE MISSION SIMULATOR DATASET
 * Stage 09 NASA Spaceflight Missions Catalog
 */

import { MissionDefinition } from './types';

export const NASA_MISSIONS: MissionDefinition[] = [
  // =========================================================================
  // MISSION 01: EARTH ORBIT INSERTION
  // =========================================================================
  {
    id: 'earth-orbit-insertion',
    title: 'Earth Orbit Insertion',
    subtitle: 'Ascent Trajectory & Orbital Circularization',
    targetBody: 'earth',
    difficulty: 'Cadet',
    description: 'Pilot an orbital launch vehicle through the dense troposphere, execute a pitch-over gravity turn at Max-Q, and fire the upper-stage vacuum engine at apoapsis to achieve stable low Earth orbit.',
    historicalContext: 'Demonstrated on historic orbital flights from Project Mercury and Gemini to the Saturn V and Falcon 9, achieving orbital insertion requires accelerating to ~7.8 km/s horizontal velocity.',
    badge: 'LEO INSERTION',
    icon: '🚀',
    themeAccent: '#38BDF8',

    initialAltitudeM: 1000,
    initialVelocityMs: { x: 0, y: 320, z: 20 },
    initialFuelKg: 42000,
    maxFuelKg: 42000,
    initialMonopropKg: 800,
    dryMassKg: 6500,
    maxThrustKn: 920,
    vacuumIspS: 348,

    celestialRadiusKm: 6371,
    surfaceGravityMs2: 9.81,
    atmosphereHeightKm: 100,
    hasAtmosphere: true,

    deltaVBudgetMs: 9400,
    starCriteria: {
      threeStars: { maxDeltaVMs: 8900, maxSeconds: 320 },
      twoStars: { maxDeltaVMs: 9400, maxSeconds: 420 },
    },
    baseXpReward: 180,
    objectives: [
      {
        id: 'obj-ascent-80km',
        title: 'Break Atmospheric Boundary',
        description: 'Ascend past the Karman line (80 km) into the exosphere.',
        isCompleted: false,
        targetMetric: { type: 'altitude', targetValue: 80000, unit: 'm' },
      },
      {
        id: 'obj-apoapsis-200km',
        title: 'Establish 200 km Apoapsis',
        description: 'Pitch down to 90° azimuth to raise trajectory apex beyond 200 km.',
        isCompleted: false,
        targetMetric: { type: 'altitude', targetValue: 200000, unit: 'm' },
      },
      {
        id: 'obj-circularize-leo',
        title: 'Circularize Low Earth Orbit',
        description: 'Execute horizontal prograde burn until orbital eccentricity is below 0.05.',
        isCompleted: false,
        targetMetric: { type: 'eccentricity', targetValue: 0.05, unit: 'e' },
      },
    ],
  },

  // =========================================================================
  // MISSION 02: ISS RENDEZVOUS & DOCKING
  // =========================================================================
  {
    id: 'iss-rendezvous-docking',
    title: 'ISS Rendezvous & Soft Docking',
    subtitle: 'Orbital Phasing & International Docking Adapter Capture',
    targetBody: 'iss',
    difficulty: 'Commander',
    description: 'Execute precision orbital proximity operations with the International Space Station at 420 km altitude. Use translational RCS thrusters to navigate the final approach corridor and soft-dock at under 0.2 m/s.',
    historicalContext: 'Docking requires nulling relative velocity within centimeters per second. NASA Apollo-Soyuz (1975), Space Shuttle, and Commercial Crew flights rely on the International Docking System Standard (IDSS).',
    badge: 'STATION DOCKING',
    icon: '🛰️',
    themeAccent: '#34D399',

    initialAltitudeM: 420000,
    initialVelocityMs: { x: 7660, y: 0, z: 40 },
    initialFuelKg: 8500,
    maxFuelKg: 8500,
    initialMonopropKg: 1200,
    dryMassKg: 7800,
    maxThrustKn: 60,
    vacuumIspS: 320,

    celestialRadiusKm: 6371,
    surfaceGravityMs2: 8.65,
    atmosphereHeightKm: 0,
    hasAtmosphere: false,

    deltaVBudgetMs: 1200,
    starCriteria: {
      threeStars: { maxDeltaVMs: 750, maxSeconds: 240, maxLandingSpeedMs: 0.15 },
      twoStars: { maxDeltaVMs: 1100, maxSeconds: 360 },
    },
    baseXpReward: 220,
    objectives: [
      {
        id: 'obj-approach-200m',
        title: 'Approach Keep-Out Sphere',
        description: 'Close distance to the ISS to within 200 meters.',
        isCompleted: false,
        targetMetric: { type: 'distance', targetValue: 200, unit: 'm' },
      },
      {
        id: 'obj-align-docking-axis',
        title: 'Align Docking Port Centerline',
        description: 'Null rotational drift and center crosshairs within ±3° of IDA-2.',
        isCompleted: false,
      },
      {
        id: 'obj-soft-touchdown',
        title: 'Soft Capture Contact',
        description: 'Make contact with docking collar at relative velocity < 0.25 m/s.',
        isCompleted: false,
        targetMetric: { type: 'relative-speed', targetValue: 0.25, unit: 'm/s' },
      },
    ],
  },

  // =========================================================================
  // MISSION 03: MOON ORBITAL RECONNAISSANCE
  // =========================================================================
  {
    id: 'moon-orbital-recon',
    title: 'Lunar Orbital Reconnaissance',
    subtitle: 'Translunar Injection & Polar Mapping',
    targetBody: 'moon',
    difficulty: 'Commander',
    description: 'Depart Earth parking orbit via Translunar Injection (TLI), navigate the 3-day cislunar transfer corridor, and fire the hypergolic service engine to enter a 100 km circular lunar polar orbit.',
    historicalContext: 'Follows the flight profile of Lunar Reconnaissance Orbiter (LRO) and Apollo 8, providing laser altimeter and neutron spectrometer readings of permanently shadowed polar craters.',
    badge: 'LUNAR RECON',
    icon: '🌕',
    themeAccent: '#F59E0B',

    initialAltitudeM: 180000,
    initialVelocityMs: { x: 1650, y: 0, z: -120 },
    initialFuelKg: 14000,
    maxFuelKg: 14000,
    initialMonopropKg: 600,
    dryMassKg: 5200,
    maxThrustKn: 120,
    vacuumIspS: 326,

    celestialRadiusKm: 1737,
    surfaceGravityMs2: 1.62,
    atmosphereHeightKm: 0,
    hasAtmosphere: false,

    deltaVBudgetMs: 3900,
    starCriteria: {
      threeStars: { maxDeltaVMs: 3400, maxSeconds: 280 },
      twoStars: { maxDeltaVMs: 3800, maxSeconds: 380 },
    },
    baseXpReward: 200,
    objectives: [
      {
        id: 'obj-lunar-capture',
        title: 'Execute Lunar Orbit Insertion (LOI)',
        description: 'Burn retrograde at perilune to capture into closed elliptical lunar orbit.',
        isCompleted: false,
      },
      {
        id: 'obj-circularize-lunar-100km',
        title: 'Circularize at 100 km Altitude',
        description: 'Trim periapsis and apoapsis to within 90–110 km.',
        isCompleted: false,
        targetMetric: { type: 'altitude', targetValue: 100000, unit: 'm' },
      },
      {
        id: 'obj-deploy-spectrometer',
        title: 'Activate Polar Laser Altimeter',
        description: 'Deploy scientific sensors to map water-ice volatiles at Shackleton Crater.',
        isCompleted: false,
      },
    ],
  },

  // =========================================================================
  // MISSION 04: ARTEMIS LUNAR LANDING
  // =========================================================================
  {
    id: 'artemis-lunar-landing',
    title: 'Artemis Lunar South Pole Landing',
    subtitle: 'Powered Descent Initiation & Touchdown at Shackleton Rim',
    targetBody: 'moon',
    difficulty: 'Astrophysicist',
    description: 'Initiate powered descent from 15 km perilune down to the lunar regolith. Counter gravity with throttle throttling, deploy hydraulic landing gear, and achieve soft touchdown at under 2.5 m/s.',
    historicalContext: 'Building on Apollo 11’s historic Eagle touchdown and NASA’s Artemis III human landing system, touching down at the lunar South Pole unlocks access to billion-year-old volatiles.',
    badge: 'ARTEMIS TOUCHDOWN',
    icon: '👨‍🚀',
    themeAccent: '#A78BFA',

    initialAltitudeM: 15000,
    initialVelocityMs: { x: 1680, y: -45, z: 0 },
    initialFuelKg: 9500,
    maxFuelKg: 9500,
    initialMonopropKg: 500,
    dryMassKg: 4200,
    maxThrustKn: 85,
    vacuumIspS: 320,

    celestialRadiusKm: 1737,
    surfaceGravityMs2: 1.62,
    atmosphereHeightKm: 0,
    hasAtmosphere: false,

    deltaVBudgetMs: 2100,
    starCriteria: {
      threeStars: { maxDeltaVMs: 1850, maxSeconds: 220, maxLandingSpeedMs: 1.8 },
      twoStars: { maxDeltaVMs: 2050, maxSeconds: 300, maxLandingSpeedMs: 2.8 },
    },
    baseXpReward: 250,
    objectives: [
      {
        id: 'obj-powered-descent',
        title: 'Execute Powered Descent Initiation (PDI)',
        description: 'Fire deep-throttling descent engine retrograde to eliminate horizontal velocity.',
        isCompleted: false,
      },
      {
        id: 'obj-deploy-landing-gear',
        title: 'Deploy Lunar Landing Gear',
        description: 'Extend shock-absorbing landing legs before descending below 500 meters.',
        isCompleted: false,
      },
      {
        id: 'obj-soft-touchdown-moon',
        title: 'Touch Down at Shackleton Rim',
        description: 'Settle on the regolith with vertical speed < 2.5 m/s and pitch error < 6°.',
        isCompleted: false,
        targetMetric: { type: 'touchdown-speed', targetValue: 2.5, unit: 'm/s' },
      },
    ],
  },

  // =========================================================================
  // MISSION 05: MARS TRANSFER INSERTION
  // =========================================================================
  {
    id: 'mars-transfer-insertion',
    title: 'Mars Interplanetary Transfer',
    subtitle: 'Hohmann Elliptical Corridor & Planetary Departure',
    targetBody: 'mars',
    difficulty: 'Commander',
    description: 'Calculate and fire the Trans-Mars Injection (TMI) burn from Earth orbit, leaving Earth’s gravity well to enter a heliocentric transfer ellipse intersecting Mars’ orbit 225 million kilometers away.',
    historicalContext: 'Employed by every robotic Mars mission since Mariner 4 (1964), Viking, Curiosity, and Perseverance, Hohmann transfers maximize payload mass by minimizing required delta-v.',
    badge: 'TMI DEPARTURE',
    icon: '🪐',
    themeAccent: '#FB923C',

    initialAltitudeM: 250000,
    initialVelocityMs: { x: 7750, y: 0, z: 15 },
    initialFuelKg: 28000,
    maxFuelKg: 28000,
    initialMonopropKg: 900,
    dryMassKg: 7200,
    maxThrustKn: 320,
    vacuumIspS: 360,

    celestialRadiusKm: 6371,
    surfaceGravityMs2: 9.1,
    atmosphereHeightKm: 0,
    hasAtmosphere: false,

    deltaVBudgetMs: 4200,
    starCriteria: {
      threeStars: { maxDeltaVMs: 3750, maxSeconds: 240 },
      twoStars: { maxDeltaVMs: 4100, maxSeconds: 340 },
    },
    baseXpReward: 210,
    objectives: [
      {
        id: 'obj-tmi-burn',
        title: 'Execute Trans-Mars Injection Burn',
        description: 'Accelerate prograde until hyperbolic escape velocity reaches 11.2 km/s.',
        isCompleted: false,
      },
      {
        id: 'obj-deploy-solar-cruise',
        title: 'Deploy UltraFlex Solar Arrays',
        description: 'Orient solar arrays towards the Sun for the 7-month cruise phase.',
        isCompleted: false,
      },
      {
        id: 'obj-trajectory-trim',
        title: 'Mid-Course Correction Burn',
        description: 'Null cross-track trajectory drift with RCS to enter Mars’ capture corridor.',
        isCompleted: false,
      },
    ],
  },

  // =========================================================================
  // MISSION 06: MARS ORBITAL INSERTION
  // =========================================================================
  {
    id: 'mars-orbital-insertion',
    title: 'Mars Orbital Aerocapture & Insertion',
    subtitle: 'Retrograde Deceleration into Areocentric Orbit',
    targetBody: 'mars',
    difficulty: 'Commander',
    description: 'Arriving at Mars at 5.7 km/s hyperbolic excess velocity, fire the main bipropellant engine retrograde at 250 km periapsis to bleed energy and capture into stable Martian orbit.',
    historicalContext: 'Mars Reconnaissance Orbiter (MRO) and Mars Odyssey used orbit insertion burns followed by months of subtle aerobraking in Mars’ upper CO2 atmosphere to circularize.',
    badge: 'MARS ORBITER',
    icon: '🔴',
    themeAccent: '#EF4444',

    initialAltitudeM: 600000,
    initialVelocityMs: { x: 5400, y: -280, z: 0 },
    initialFuelKg: 16500,
    maxFuelKg: 16500,
    initialMonopropKg: 750,
    dryMassKg: 4800,
    maxThrustKn: 180,
    vacuumIspS: 330,

    celestialRadiusKm: 3389,
    surfaceGravityMs2: 3.72,
    atmosphereHeightKm: 120,
    hasAtmosphere: true,

    deltaVBudgetMs: 2400,
    starCriteria: {
      threeStars: { maxDeltaVMs: 2150, maxSeconds: 220 },
      twoStars: { maxDeltaVMs: 2350, maxSeconds: 300 },
    },
    baseXpReward: 230,
    objectives: [
      {
        id: 'obj-moi-burn',
        title: 'Execute Mars Orbit Insertion (MOI)',
        description: 'Burn retrograde at periapsis to convert flyby into closed elliptical capture.',
        isCompleted: false,
      },
      {
        id: 'obj-apoapsis-mars-trim',
        title: 'Lower Apoapsis Below 1,500 km',
        description: 'Decelerate at periapsis until orbit eccentricity is below 0.35.',
        isCompleted: false,
      },
      {
        id: 'obj-phobos-recon',
        title: 'Transmit Phobos Orbital Flyby Telemetry',
        description: 'Point high-gain dish to Earth and relay gravity-gradient observations.',
        isCompleted: false,
      },
    ],
  },

  // =========================================================================
  // MISSION 07: MARS SURFACE LANDING (EDL)
  // =========================================================================
  {
    id: 'mars-surface-landing',
    title: 'Mars EDL: Jezero Crater Touchdown',
    subtitle: 'Entry, Descent & Landing in Rarefied Martian Atmosphere',
    targetBody: 'mars',
    difficulty: 'Astrophysicist',
    description: 'Experience the "Seven Minutes of Terror". Enter Mars’ thin CO2 atmosphere with heat shield forward, deploy supersonic parachute, fire terminal retro-rockets, and set down softly in Jezero Crater.',
    historicalContext: 'NASA’s Mars 2020 Perseverance Rover and Curiosity proved terrain relative navigation (TRN) and sky-crane touchdown on the boulder-strewn floor of ancient Jezero lakebed.',
    badge: 'JEZERO TOUCHDOWN',
    icon: '🌋',
    themeAccent: '#DC2626',

    initialAltitudeM: 25000,
    initialVelocityMs: { x: 1450, y: -180, z: 0 },
    initialFuelKg: 6200,
    maxFuelKg: 6200,
    initialMonopropKg: 400,
    dryMassKg: 3800,
    maxThrustKn: 95,
    vacuumIspS: 310,

    celestialRadiusKm: 3389,
    surfaceGravityMs2: 3.72,
    atmosphereHeightKm: 120,
    hasAtmosphere: true,

    deltaVBudgetMs: 3100,
    starCriteria: {
      threeStars: { maxDeltaVMs: 2750, maxSeconds: 260, maxLandingSpeedMs: 2.2 },
      twoStars: { maxDeltaVMs: 3000, maxSeconds: 340, maxLandingSpeedMs: 3.2 },
    },
    baseXpReward: 280,
    objectives: [
      {
        id: 'obj-heat-shield-corridor',
        title: 'Hold Heat Shield Against Entry Plasma',
        description: 'Maintain pitch angle within the safe entry corridor during peak dynamic heating.',
        isCompleted: false,
      },
      {
        id: 'obj-chute-deploy',
        title: 'Jettison Heat Shield & Deploy Retros',
        description: 'Ignite terminal descent engines under 1,500m to eliminate vertical drop.',
        isCompleted: false,
      },
      {
        id: 'obj-soft-jezero-touchdown',
        title: 'Touch Down in Jezero Ancient Delta',
        description: 'Settle softly with vertical velocity < 2.5 m/s and deploy science mast.',
        isCompleted: false,
        targetMetric: { type: 'touchdown-speed', targetValue: 2.5, unit: 'm/s' },
      },
    ],
  },

  // =========================================================================
  // MISSION 08: ASTEROID BENNU PROXIMITY OPS
  // =========================================================================
  {
    id: 'asteroid-bennu-tag',
    title: 'Asteroid Bennu Touch-and-Go',
    subtitle: 'Microgravity Proximity Operations & Regolith Sampling',
    targetBody: 'asteroid',
    difficulty: 'Commander',
    description: 'Navigate in the ultra-weak gravitational field of 500-meter tumbling carbonaceous asteroid Bennu. Station-keep at 50 meters, extend the sampling arm, and execute a Touch-and-Go maneuver.',
    historicalContext: 'Recreating NASA’s OSIRIS-REx mission (2020), which collected 250 grams of pristine primordial organic-rich regolith and returned it safely to Earth in 2023.',
    badge: 'ASTEROID TAG',
    icon: '🪨',
    themeAccent: '#10B981',

    initialAltitudeM: 1200,
    initialVelocityMs: { x: 8, y: -1.2, z: 0.5 },
    initialFuelKg: 2800,
    maxFuelKg: 2800,
    initialMonopropKg: 700,
    dryMassKg: 1800,
    maxThrustKn: 12,
    vacuumIspS: 315,

    celestialRadiusKm: 0.25,
    surfaceGravityMs2: 0.0001,
    atmosphereHeightKm: 0,
    hasAtmosphere: false,

    deltaVBudgetMs: 850,
    starCriteria: {
      threeStars: { maxDeltaVMs: 620, maxSeconds: 180, maxLandingSpeedMs: 0.2 },
      twoStars: { maxDeltaVMs: 800, maxSeconds: 260 },
    },
    baseXpReward: 240,
    objectives: [
      {
        id: 'obj-match-asteroid-rotation',
        title: 'Synchronize Orbit with Asteroid Spin',
        description: 'Match velocity with Nightingale crater surface marker.',
        isCompleted: false,
      },
      {
        id: 'obj-descend-50m',
        title: 'Descend to 50 Meter Hold Point',
        description: 'Maintain station-keeping position using delicate cold-gas RCS bursts.',
        isCompleted: false,
        targetMetric: { type: 'distance', targetValue: 50, unit: 'm' },
      },
      {
        id: 'obj-tag-sample-contact',
        title: 'Execute Touch-and-Go (TAG) Sample',
        description: 'Contact regolith at < 0.2 m/s, fire nitrogen gas bottle, and back away.',
        isCompleted: false,
      },
    ],
  },

  // =========================================================================
  // MISSION 09: VOYAGER DEEP SPACE JOURNEY
  // =========================================================================
  {
    id: 'voyager-deep-space',
    title: 'Voyager Interstellar Trajectory',
    subtitle: 'Gravity Assist & Heliosphere Boundary Crossing',
    targetBody: 'deep-space',
    difficulty: 'Commander',
    description: 'Pilot an interstellar probe through outer planet gravity assists, exceeding solar system escape velocity (16.5 km/s) to cross the heliopause into the undisturbed interstellar medium.',
    historicalContext: 'Launched in 1977, NASA’s Voyager 1 and 2 explored Jupiter, Saturn, Uranus, and Neptune before becoming humanity’s first emissaries to interstellar space.',
    badge: 'INTERSTELLAR PROBE',
    icon: '✨',
    themeAccent: '#6366F1',

    initialAltitudeM: 1500000000, // 1.5 Billion meters
    initialVelocityMs: { x: 14200, y: 0, z: 2400 },
    initialFuelKg: 3500,
    maxFuelKg: 3500,
    initialMonopropKg: 450,
    dryMassKg: 825,
    maxThrustKn: 24,
    vacuumIspS: 310,

    celestialRadiusKm: 0,
    surfaceGravityMs2: 0,
    atmosphereHeightKm: 0,
    hasAtmosphere: false,

    deltaVBudgetMs: 5500,
    starCriteria: {
      threeStars: { maxDeltaVMs: 4800, maxSeconds: 240 },
      twoStars: { maxDeltaVMs: 5300, maxSeconds: 320 },
    },
    baseXpReward: 260,
    objectives: [
      {
        id: 'obj-slingshot-burn',
        title: 'Execute Planetary Slingshot Boost',
        description: 'Burn at close approach to gain orbital kinetic energy from planetary gravity.',
        isCompleted: false,
      },
      {
        id: 'obj-heliosphere-crossing',
        title: 'Cross Heliopause Boundary',
        description: 'Detect sudden rise in galactic cosmic ray intensity and drop in solar wind.',
        isCompleted: false,
      },
      {
        id: 'obj-golden-record-transmission',
        title: 'Transmit Interstellar Plasma Signal',
        description: 'Aim 3.7m high-gain antenna back at NASA Deep Space Network Goldstone.',
        isCompleted: false,
      },
    ],
  },

  // =========================================================================
  // MISSION 10: PARKER SOLAR PROBE PERIHELION
  // =========================================================================
  {
    id: 'parker-solar-perihelion',
    title: 'Parker Solar Probe Extreme Perihelion',
    subtitle: 'Coronal Dive within 9.8 Solar Radii',
    targetBody: 'sun',
    difficulty: 'Astrophysicist',
    description: 'Fly humanity’s fastest spacecraft at 190 km/s through the Sun’s million-degree outer corona. Keep the carbon-composite Thermal Protection Shield locked Sun-ward to measure solar flare plasma waves.',
    historicalContext: 'NASA’s Parker Solar Probe became the first craft to "touch the Sun" in 2021, enduring temperatures of 1,400°C to resolve the mystery of coronal heating.',
    badge: 'SOLAR PERIHELION',
    icon: '☀️',
    themeAccent: '#F97316',

    initialAltitudeM: 25000000000, // 25 Million km
    initialVelocityMs: { x: 125000, y: -22000, z: 0 },
    initialFuelKg: 4200,
    maxFuelKg: 4200,
    initialMonopropKg: 500,
    dryMassKg: 685,
    maxThrustKn: 30,
    vacuumIspS: 320,

    celestialRadiusKm: 696340,
    surfaceGravityMs2: 274,
    atmosphereHeightKm: 0,
    hasAtmosphere: false,

    deltaVBudgetMs: 6800,
    starCriteria: {
      threeStars: { maxDeltaVMs: 5900, maxSeconds: 240 },
      twoStars: { maxDeltaVMs: 6500, maxSeconds: 320 },
    },
    baseXpReward: 300,
    objectives: [
      {
        id: 'obj-solar-dive',
        title: 'Descend to Inner Solar Corona (< 10 R☉)',
        description: 'Navigate intense solar gravitational gradient at over 150 km/s.',
        isCompleted: false,
      },
      {
        id: 'obj-shield-alignment',
        title: 'Maintain TPS Heat Shield Sun-Locked',
        description: 'Keep Sun within the 4.5-inch carbon composite shadow cone to prevent sensor ablation.',
        isCompleted: false,
      },
      {
        id: 'obj-flare-wave-measurement',
        title: 'Sample Coronal Magnetic Switchbacks',
        description: 'Extend FIELDS and SWEAP sensors to record magnetic field reversals in coronal stream.',
        isCompleted: false,
      },
    ],
  },
];
