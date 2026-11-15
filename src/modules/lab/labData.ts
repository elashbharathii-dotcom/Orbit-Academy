/**
 * ORBIT ACADEMY — SCIENCE LAB DATA & CONSTANTS
 * Comprehensive scientific dataset for the 4 Virtual Science Chambers:
 * 1. Orbital Mechanics (Keplerian orbits, vis-viva, velocities)
 * 2. Solar Physics (Photosphere, corona, flares, sunspots, irradiance)
 * 3. Planetary Geology (Core/mantle/crust cross-sections, atmospheric compositions)
 * 4. Space Environment (Microgravity, atmospheric drag, asteroid impact cratering, radiation)
 */

export type LabChamberId = 'orbital' | 'solar' | 'geology' | 'environment';

export interface ChamberMeta {
  id: LabChamberId;
  name: string;
  tagline: string;
  discipline: string;
  accentColor: string;
  glowTone: 'cyan' | 'amber' | 'emerald' | 'violet';
  description: string;
  telemetry: string;
  apparatus: string;
}

export const LAB_CHAMBERS: ChamberMeta[] = [
  {
    id: 'orbital',
    name: 'Orbital Mechanics Chamber',
    tagline: 'Keplerian Dynamics & Orbital Trajectories',
    discipline: 'Astrodynamics & Celestial Mechanics',
    accentColor: '#38BDF8',
    glowTone: 'cyan',
    description:
      'Simulate planetary orbital insertions and spacecraft trajectories. Adjust velocity vectors, measure orbital periods via Kepler’s 3rd Law, visualize eccentric ellipses, and observe conservation of angular momentum.',
    telemetry: 'Vis-Viva Solver // Keplerian State Vectors',
    apparatus: 'Precision Microgravity Trajectory Simulator',
  },
  {
    id: 'solar',
    name: 'Solar Physics Chamber',
    tagline: 'Heliophysics, Coronal Loops & Flares',
    discipline: 'Heliophysics & Magnetohydrodynamics',
    accentColor: '#F59E0B',
    glowTone: 'amber',
    description:
      'Investigate the dynamic solar atmosphere. Modulate core fusion rates, monitor active sunspot magnetic tangling, trigger Class-X coronal mass ejections, and track real-time solar irradiance and geomagnetic storm risks.',
    telemetry: 'SDO Photosphere // 1.5M K Coronal Spectrometer',
    apparatus: 'Magnetohydrodynamic Solar Furnace',
  },
  {
    id: 'geology',
    name: 'Planetary Geology Chamber',
    tagline: 'Comparative Planetary Interiors & Atmospheres',
    discipline: 'Comparative Planetology & Geophysics',
    accentColor: '#10B981',
    glowTone: 'emerald',
    description:
      'Explore core, mantle, and crust cross-sections across terrestrial worlds. Contrast atmospheric compositions, surface pressures, and tectonic volcanism between Earth, Mars, Venus, Mercury, Moon, and Titan.',
    telemetry: 'Seismic Interior Profiler // Mass Spectrometry',
    apparatus: 'Planetary Geophysical Core Scanner',
  },
  {
    id: 'environment',
    name: 'Space Environment Chamber',
    tagline: 'Microgravity, Aerodynamic Drag, Impacts & Radiation',
    discipline: 'Applied Aerospace Physics',
    accentColor: '#A78BFA',
    glowTone: 'violet',
    description:
      'Subject test masses to vacuum vs atmospheric drag, simulate hypervelocity asteroid kinetic impact cratering with energy scaling in Megatons of TNT, and test radiation shielding against solar proton storms.',
    telemetry: 'Hypervelocity Impact Basin // SPE Dosimeter',
    apparatus: 'Vacuum Drop Shaft & Hypervelocity Impactor',
  },
];

// ---------------------------------------------------------------------------
// 1. ORBITAL MECHANICS CONSTANTS & PRESETS
// ---------------------------------------------------------------------------

export interface CentralBody {
  id: string;
  name: string;
  massKg: number;
  radiusKm: number;
  surfaceG: number;
  color: string;
}

export const CENTRAL_BODIES: Record<string, CentralBody> = {
  earth: {
    id: 'earth',
    name: 'Earth',
    massKg: 5.972e24,
    radiusKm: 6371,
    surfaceG: 9.81,
    color: '#38BDF8',
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    massKg: 6.417e23,
    radiusKm: 3389.5,
    surfaceG: 3.72,
    color: '#EF4444',
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    massKg: 1.898e27,
    radiusKm: 69911,
    surfaceG: 24.79,
    color: '#F97316',
  },
  moon: {
    id: 'moon',
    name: 'Moon',
    massKg: 7.342e22,
    radiusKm: 1737.4,
    surfaceG: 1.62,
    color: '#94A3B8',
  },
};

export interface OrbitPreset {
  id: string;
  name: string;
  bodyId: string;
  altitudeKm: number;
  velocityKmS: number;
  description: string;
}

export const ORBIT_PRESETS: OrbitPreset[] = [
  {
    id: 'leo-circular',
    name: 'Low Earth Orbit (LEO)',
    bodyId: 'earth',
    altitudeKm: 400,
    velocityKmS: 7.67,
    description: 'Circular orbital track matching the International Space Station (ISS) at 400 km altitude.',
  },
  {
    id: 'geo-sync',
    name: 'Geostationary (GEO)',
    bodyId: 'earth',
    altitudeKm: 35786,
    velocityKmS: 3.07,
    description: '24-hour orbital period synchronized exactly with Earth’s axial rotation.',
  },
  {
    id: 'molniya-eccentric',
    name: 'Molniya Orbit (Eccentric)',
    bodyId: 'earth',
    altitudeKm: 600,
    velocityKmS: 10.0,
    description: 'High-eccentricity orbit with long apogee dwell time over high latitudes.',
  },
  {
    id: 'mars-orbit',
    name: 'Areostationary Mars Orbit',
    bodyId: 'mars',
    altitudeKm: 17032,
    velocityKmS: 1.45,
    description: 'Stationary orbital slot above the Martian prime meridian.',
  },
  {
    id: 'escape-hyperbolic',
    name: 'Trans-Lunar Escape',
    bodyId: 'earth',
    altitudeKm: 400,
    velocityKmS: 11.1,
    description: 'Hyperbolic escape trajectory exceeding Earth escape velocity (11.18 km/s).',
  },
];

// ---------------------------------------------------------------------------
// 2. SOLAR PHYSICS CONSTANTS & FLARE CLASSIFICATION
// ---------------------------------------------------------------------------

export interface SolarFlareClass {
  grade: 'C' | 'M' | 'X';
  name: string;
  peakFlux: string;
  cmeVelocityKmS: number;
  geomagneticStorm: string;
  color: string;
  description: string;
}

export const SOLAR_FLARE_CLASSES: SolarFlareClass[] = [
  {
    grade: 'C',
    name: 'C-Class (Minor Solar Flare)',
    peakFlux: '10⁻⁶ – 10⁻⁵ W/m²',
    cmeVelocityKmS: 450,
    geomagneticStorm: 'G1 (Minor Storm)',
    color: '#38BDF8',
    description: 'Small flare with minimal observable terrestrial consequences. Modest auroral enhancement.',
  },
  {
    grade: 'M',
    name: 'M-Class (Moderate Solar Flare)',
    peakFlux: '10⁻⁵ – 10⁻⁴ W/m²',
    cmeVelocityKmS: 820,
    geomagneticStorm: 'G2–G3 (Moderate to Strong)',
    color: '#F59E0B',
    description: 'Can trigger brief radio blackouts over polar regions and notable auroras across mid-latitudes.',
  },
  {
    grade: 'X',
    name: 'X-Class (Extreme Solar Superflare)',
    peakFlux: '10⁻⁴+ W/m²',
    cmeVelocityKmS: 1850,
    geomagneticStorm: 'G4–G5 (Severe to Extreme)',
    color: '#EF4444',
    description: 'Ultra-energetic reconnection event capable of disrupting power grids, satellites, and GPS networks worldwide.',
  },
];

// ---------------------------------------------------------------------------
// 3. PLANETARY GEOLOGY PROFILES
// ---------------------------------------------------------------------------

export interface AtmosphericGas {
  name: string;
  formula: string;
  pct: number;
  color: string;
}

export interface GeologicalLayer {
  name: string;
  depthKm: string;
  tempK: string;
  state: string;
  composition: string;
  color: string;
}

export interface PlanetaryGeologyProfile {
  id: string;
  name: string;
  type: 'Terrestrial' | 'Gas Giant' | 'Moon';
  surfaceGravity: number; // m/s2
  surfacePressureBar: number; // bar
  surfaceTempKelvin: { min: number; mean: number; max: number };
  radiusKm: number;
  densityGcm3: number;
  magneticDynamo: string;
  tectonics: string;
  accentColor: string;
  layers: GeologicalLayer[];
  atmosphere: AtmosphericGas[];
  notableFeatures: string[];
  geologicalSummary: string;
}

export const PLANETARY_GEOLOGY_DATA: PlanetaryGeologyProfile[] = [
  {
    id: 'earth',
    name: 'Earth (Sol-3)',
    type: 'Terrestrial',
    surfaceGravity: 9.81,
    surfacePressureBar: 1.013,
    surfaceTempKelvin: { min: 184, mean: 288, max: 330 },
    radiusKm: 6371,
    densityGcm3: 5.514,
    magneticDynamo: 'Active Liquid Geodynamo (45 µT dipole)',
    tectonics: 'Active Plate Tectonics (Subduction & Rifting)',
    accentColor: '#38BDF8',
    layers: [
      { name: 'Oceanic & Continental Crust', depthKm: '0 – 40 km', tempK: '288 – 700 K', state: 'Brittle Solid', composition: 'Silicate rocks, Basalt, Granite (SiO₂, Al₂O₃)', color: '#38BDF8' },
      { name: 'Upper & Lower Mantle', depthKm: '40 – 2,890 km', tempK: '700 – 3,800 K', state: 'Plastic Viscoelastic', composition: 'Bridgmanite, Olivine, Perovskite ((Mg,Fe)SiO₃)', color: '#10B981' },
      { name: 'Outer Core', depthKm: '2,890 – 5,150 km', tempK: '4,000 – 5,500 K', state: 'Liquid Molten', composition: 'Iron (85%), Nickel (10%), Silicon/Sulfur (5%)', color: '#F59E0B' },
      { name: 'Inner Core', depthKm: '5,150 – 6,371 km', tempK: '5,500 – 6,000 K', state: 'Solid Crystal', composition: 'Crystalline Iron-Nickel alloy (under 360 GPa pressure)', color: '#EF4444' },
    ],
    atmosphere: [
      { name: 'Nitrogen', formula: 'N₂', pct: 78.08, color: '#818CF8' },
      { name: 'Oxygen', formula: 'O₂', pct: 20.95, color: '#38BDF8' },
      { name: 'Argon', formula: 'Ar', pct: 0.93, color: '#94A3B8' },
      { name: 'Carbon Dioxide & Trace', formula: 'CO₂+', pct: 0.04, color: '#F59E0B' },
    ],
    notableFeatures: [
      'Global oceanic hydrosphere covering 71% of surface area',
      'Dynamic subduction zones fueling volcanic arcs and earthquakes',
      'Protective magnetosphere deflecting solar wind particles',
    ],
    geologicalSummary: 'The gold standard for habitable terrestrial planetology: active mantle convection powers continuous crustal recycling.',
  },
  {
    id: 'mars',
    name: 'Mars (Sol-4)',
    type: 'Terrestrial',
    surfaceGravity: 3.72,
    surfacePressureBar: 0.006,
    surfaceTempKelvin: { min: 143, mean: 210, max: 293 },
    radiusKm: 3389.5,
    densityGcm3: 3.934,
    magneticDynamo: 'Extinct Geodynamo (Residual crustal remanence)',
    tectonics: 'Stagnant Single-Lid Regolith',
    accentColor: '#EF4444',
    layers: [
      { name: 'Basaltic Iron-Oxide Crust', depthKm: '0 – 50 km', tempK: '210 – 600 K', state: 'Brittle Rigid', composition: 'Iron(III) oxide regolith, Tholeiitic basalt', color: '#EF4444' },
      { name: 'Silicate Lithospheric Mantle', depthKm: '50 – 1,500 km', tempK: '600 – 1,800 K', state: 'Solidified / Viscous', composition: 'Iron-rich olivine and pyroxenes', color: '#F97316' },
      { name: 'Sulfur-Rich Core', depthKm: '1,500 – 3,390 km', tempK: '1,800 – 2,400 K', state: 'Liquid / Slushy', composition: 'Iron, Nickel with high sulfur fraction (15–18% S)', color: '#FBBF24' },
    ],
    atmosphere: [
      { name: 'Carbon Dioxide', formula: 'CO₂', pct: 95.32, color: '#EF4444' },
      { name: 'Nitrogen', formula: 'N₂', pct: 2.60, color: '#818CF8' },
      { name: 'Argon', formula: 'Ar', pct: 1.90, color: '#94A3B8' },
      { name: 'Oxygen & Water Vapor', formula: 'O₂/H₂O', pct: 0.18, color: '#38BDF8' },
    ],
    notableFeatures: [
      'Olympus Mons: Largest shield volcano in Solar System (21.9 km elevation)',
      'Valles Marineris: Grand canyon spanning 4,000 km across equatorial plateaus',
      'Frozen water ice trapped in polar caps and subsurface permafrost',
    ],
    geologicalSummary: 'A frozen desert world whose core cooled over 3.8 billion years ago, collapsing its protective magnetosphere and allowing solar wind to strip 99% of its atmosphere.',
  },
  {
    id: 'venus',
    name: 'Venus (Sol-2)',
    type: 'Terrestrial',
    surfaceGravity: 8.87,
    surfacePressureBar: 92.0,
    surfaceTempKelvin: { min: 710, mean: 737, max: 750 },
    radiusKm: 6051.8,
    densityGcm3: 5.243,
    magneticDynamo: 'No Intrinsic Dynamo (Induced ionospheric shield)',
    tectonics: 'Periodic Catastrophic Crustal Resurfacing',
    accentColor: '#F59E0B',
    layers: [
      { name: 'Basaltic Granitic Crust', depthKm: '0 – 30 km', tempK: '737 – 900 K', state: 'Hot Ductile', composition: 'Silicates, basalt with pancake volcanic domes', color: '#F59E0B' },
      { name: 'Viscous Silicate Mantle', depthKm: '30 – 2,900 km', tempK: '900 – 3,500 K', state: 'Vigorous Convective', composition: 'Silicates with high volatile dehydration', color: '#FB923C' },
      { name: 'Metallic Core', depthKm: '2,900 – 6,052 km', tempK: '3,500 – 5,000 K', state: 'Partially Liquid', composition: 'Iron-Nickel alloy (lacks thermal convective geodynamo)', color: '#DC2626' },
    ],
    atmosphere: [
      { name: 'Carbon Dioxide', formula: 'CO₂', pct: 96.50, color: '#F59E0B' },
      { name: 'Nitrogen', formula: 'N₂', pct: 3.50, color: '#818CF8' },
      { name: 'Sulfur Dioxide Clouds', formula: 'SO₂', pct: 0.015, color: '#FBBF24' },
    ],
    notableFeatures: [
      'Crushing 92 bar surface pressure (equivalent to 900 meters under Earth’s oceans)',
      'Super-critical runaway greenhouse effect making it the hottest planet',
      'Sulfuric acid upper cloud decks rotating in 4-day super-rotation',
    ],
    geologicalSummary: 'Earth’s twin in mass and radius, but divergent in climate: extreme runaway greenhouse warming melted volatile water reserves, creating a hyper-dense carbon dioxide crucible.',
  },
  {
    id: 'moon',
    name: 'Moon (Luna)',
    type: 'Moon',
    surfaceGravity: 1.62,
    surfacePressureBar: 1e-15,
    surfaceTempKelvin: { min: 40, mean: 220, max: 390 },
    radiusKm: 1737.4,
    densityGcm3: 3.344,
    magneticDynamo: 'Extinct (Ancient 4-billion-year paleo-magnetism)',
    tectonics: 'Dead Single-Plate Body',
    accentColor: '#94A3B8',
    layers: [
      { name: 'Anorthositic Regolith Crust', depthKm: '0 – 60 km', tempK: '40 – 400 K', state: 'Shattered Breccia', composition: 'Plagioclase feldspar, Basaltic Mare, Ilmenite (FeTiO₃)', color: '#94A3B8' },
      { name: 'Lithospheric Mantle', depthKm: '60 – 1,000 km', tempK: '400 – 1,400 K', state: 'Rigid Cold Solid', composition: 'Pyroxene and olivine depleted in volatiles', color: '#64748B' },
      { name: 'Small Metallic Core', depthKm: '1,000 – 1,737 km', tempK: '1,400 – 1,700 K', state: 'Partially Molten Iron', composition: 'Iron-rich core radius only ~350 km (<20% moon radius)', color: '#475569' },
    ],
    atmosphere: [
      { name: 'Helium Exosphere', formula: 'He', pct: 40.0, color: '#FBBF24' },
      { name: 'Neon Exosphere', formula: 'Ne', pct: 35.0, color: '#38BDF8' },
      { name: 'Hydrogen & Argon', formula: 'H₂/Ar', pct: 25.0, color: '#A78BFA' },
    ],
    notableFeatures: [
      'Pristine impact record spanning 4.5 billion years of Solar System bombardment',
      'Dark lunar Maria formed by ancient flood basalt eruptions',
      'Permanently shadowed polar craters harboring water ice deposits in eternal night (40 K)',
    ],
    geologicalSummary: 'Formed from the Giant Impact (Theia collision) with proto-Earth. Its low density and depleted volatiles provide an pristine chronological record of Solar System evolution.',
  },
];

// ---------------------------------------------------------------------------
// 4. SPACE ENVIRONMENT & IMPACT / RADIATION CONSTANTS
// ---------------------------------------------------------------------------

export interface ImpactorPreset {
  id: string;
  name: string;
  diameterM: number;
  velocityKmS: number;
  densityGcm3: number;
  composition: string;
  historicAnalogue: string;
}

export const IMPACTOR_PRESETS: ImpactorPreset[] = [
  {
    id: 'chelyabinsk',
    name: 'Chelyabinsk Superbolide (2013)',
    diameterM: 20,
    velocityKmS: 19.0,
    densityGcm3: 3.3,
    composition: 'LL5 Ordinary Chondrite',
    historicAnalogue: 'Airburst at 29.7 km altitude yielding ~500 kilotons TNT blast wave.',
  },
  {
    id: 'meteor-crater',
    name: 'Barringer Meteor Crater (Arizona)',
    diameterM: 50,
    velocityKmS: 12.8,
    densityGcm3: 7.8,
    composition: 'Iron-Nickel Octahedrite',
    historicAnalogue: 'Carved a 1.2 km wide, 170 m deep impact bowl ~50,000 years ago.',
  },
  {
    id: 'tunguska',
    name: 'Tunguska Event (1908)',
    diameterM: 65,
    velocityKmS: 15.0,
    densityGcm3: 1.5,
    composition: 'Porous Cometary Fragment',
    historicAnalogue: 'Flattened 2,150 km² of Siberian taiga forest with 12 Megatons TNT yield.',
  },
  {
    id: 'chicxulub',
    name: 'Chicxulub Dinosaur Extinction (66 Ma)',
    diameterM: 10000,
    velocityKmS: 20.0,
    densityGcm3: 2.6,
    composition: 'Carbonaceous Asteroid',
    historicAnalogue: 'Excavated 180 km wide crater, releasing 100,000,000 Megatons TNT, ending the Cretaceous period.',
  },
];

export interface RadiationShieldingMaterial {
  id: string;
  name: string;
  densityGcm3: number;
  hydrogenContentPct: number;
  absorptionCoeff: number; // relative absorption factor
  color: string;
  notes: string;
}

export const RADIATION_MATERIALS: RadiationShieldingMaterial[] = [
  { id: 'none', name: 'No Shielding (Deep Space Vacuum)', densityGcm3: 0, hydrogenContentPct: 0, absorptionCoeff: 0.0, color: '#EF4444', notes: 'Unmitigated exposure to Galactic Cosmic Rays (1.5 mSv/day) and lethal SPE protons.' },
  { id: 'suit', name: 'EMU Space Suit Layers (Ortho-Fabric)', densityGcm3: 1.2, hydrogenContentPct: 5, absorptionCoeff: 0.22, color: '#F59E0B', notes: 'Stops alpha particles and soft solar electrons, but penetrable by energetic GCR heavy ions.' },
  { id: 'aluminum', name: 'Aluminum Alloy 6061-T6 (Hull Structure)', densityGcm3: 2.7, hydrogenContentPct: 0, absorptionCoeff: 0.58, color: '#94A3B8', notes: 'Standard spacecraft hull material; heavy nuclei generate secondary Bremsstrahlung scattering.' },
  { id: 'polyethylene', name: 'High-Density Polyethylene (HDPE)', densityGcm3: 0.95, hydrogenContentPct: 14, absorptionCoeff: 0.88, color: '#38BDF8', notes: 'Hydrogen-rich molecular matrix provides exceptional proton stopping power with minimal secondary radiation.' },
  { id: 'water', name: 'Water Wall Storage Jacket (H₂O)', densityGcm3: 1.0, hydrogenContentPct: 11, absorptionCoeff: 0.82, color: '#10B981', notes: 'Dual-purpose life support water tanks surrounding astronaut sleeping quarters.' },
];

// ---------------------------------------------------------------------------
// 5. LABPAD MISSION OBJECTIVES & XP MILESTONES
// ---------------------------------------------------------------------------

export interface LabMilestone {
  id: string;
  chamberId: LabChamberId;
  title: string;
  instruction: string;
  conditionDescription: string;
  xpReward: number;
  scientificCitation: string;
}

export const LAB_MILESTONES: LabMilestone[] = [
  // Orbital Mechanics Chamber
  {
    id: 'orbit-circular',
    chamberId: 'orbital',
    title: 'Achieve Low-Earth Circular Orbit',
    instruction: 'Adjust velocity near ~7.7 km/s to lock orbit eccentricity e < 0.04.',
    conditionDescription: 'Circularized trajectory achieved (e < 0.04)',
    xpReward: 50,
    scientificCitation: 'Keplerian 1st Law: Bound orbits form ellipses with the central body at one focus.',
  },
  {
    id: 'orbit-kepler3',
    chamberId: 'orbital',
    title: 'Verify Kepler’s 3rd Harmonic Law',
    instruction: 'Expand semi-major axis to GEO (>35,000 km) and observe orbital period reach 24 hours.',
    conditionDescription: 'Orbital period T calculated for large semi-major axis',
    xpReward: 50,
    scientificCitation: 'Kepler’s 3rd Law: T² = (4π² / GM) · a³.',
  },
  // Solar Physics Chamber
  {
    id: 'solar-flare-trigger',
    chamberId: 'solar',
    title: 'Trigger Class-X Coronal Superflare',
    instruction: 'Increase magnetic helicity and trigger an X-Class flare to launch a Coronal Mass Ejection.',
    conditionDescription: 'Solar eruption launched with CME > 1000 km/s',
    xpReward: 50,
    scientificCitation: 'Magnetic Reconnection: Rapid reconfiguration of antiparallel magnetic field lines releases up to 10²⁵ Joules.',
  },
  {
    id: 'solar-irradiance',
    chamberId: 'solar',
    title: 'Calibrate Solar Constant Radiance',
    instruction: 'Observe baseline irradiance at 1,361 W/m² and correlate with sunspot activity cycles.',
    conditionDescription: 'Solar flux calculated and verified at 1 AU',
    xpReward: 50,
    scientificCitation: 'Stefan-Boltzmann Law: L = 4π R² σ T⁴.',
  },
  // Planetary Geology Chamber
  {
    id: 'geology-compare',
    chamberId: 'geology',
    title: 'Cross-Analyze Earth vs Venus Greenhouse',
    instruction: 'Inspect the 92-bar runaway carbon dioxide atmosphere of Venus against Earth’s balanced crust.',
    conditionDescription: 'Comparative planetary interior analysis completed',
    xpReward: 50,
    scientificCitation: 'Volatile Evolution: Without plate tectonics to sequester carbon into limestone, greenhouse gases accumulate unchecked.',
  },
  {
    id: 'geology-core',
    chamberId: 'geology',
    title: 'Map Geodynamo Core Stratigraphy',
    instruction: 'Inspect Mars’s solidified interior to understand how its magnetic shield collapsed.',
    conditionDescription: 'Martian interior profile inspected',
    xpReward: 50,
    scientificCitation: 'Planetary Dynamos: Convection of molten iron in the outer core sustains planetary magnetic shields.',
  },
  // Space Environment Chamber
  {
    id: 'env-impact-test',
    chamberId: 'environment',
    title: 'Model Asteroid Impact Kinetic Basin',
    instruction: 'Launch a hypervelocity impact test exceeding 1 Megaton TNT equivalent yield.',
    conditionDescription: 'Kinetic crater scaling calculation completed',
    xpReward: 50,
    scientificCitation: 'Kinetic Energy Scaling: E = ½ m v²; impact crater diameter scales as D ∝ E^0.29.',
  },
  {
    id: 'env-radiation-shield',
    chamberId: 'environment',
    title: 'Deploy Hydrogen-Rich Polyethylene Shield',
    instruction: 'Equip HDPE or water shielding to absorb ionizing space radiation dose by > 60%.',
    conditionDescription: 'Radiation dose attenuated below 0.5 mSv/day',
    xpReward: 50,
    scientificCitation: 'Bethe-Bloch Formula: Low atomic mass nuclei (Hydrogen) absorb charged particles with minimum secondary Bremsstrahlung.',
  },
];

