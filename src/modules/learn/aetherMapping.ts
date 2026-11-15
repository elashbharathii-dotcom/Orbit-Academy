export interface AetherDisciplineMeta {
  fig: string;
  designation: string;
  accent: string;
  accentClass: 'earth' | 'rust' | 'ice' | 'gas';
  imageSrc: string;
  videoSrc?: string;
  surveyFocus: string;
  dataFeed: string;
}

export const AETHER_DISCIPLINE_METAS: Record<string, AetherDisciplineMeta> = {
  'course-astronomy': {
    fig: 'FIG. 01',
    designation: 'AE-01 // OBSERVATIONAL ASTROPHYSICS',
    accent: '#7FFFD4',
    accentClass: 'earth',
    imageSrc: '/assets/aether/img/aether-nebula.jpg',
    videoSrc: '/assets/aether/video/aether-spin.mp4',
    surveyFocus: 'Deep Field Surveys & Multi-Wavelength Observatories',
    dataFeed: 'JWST • HUBBLE • CHANDRA X-RAY',
  },
  'course-solar-system': {
    fig: 'FIG. 02',
    designation: 'AE-02 // SOLAR SYSTEM DYNAMICS',
    accent: '#8FD3FF',
    accentClass: 'ice',
    imageSrc: '/assets/aether/img/aether-earth.jpg',
    videoSrc: '/assets/aether/video/aether-spin.mp4',
    surveyFocus: 'Protoplanetary Accretion & Orbital Gravitational Architecture',
    dataFeed: 'NASA HORIZONS • KEPLER ORBITS',
  },
  'course-the-sun': {
    fig: 'FIG. 03',
    designation: 'AE-03 // HELIOPHYSICS & PLASMA DYNAMO',
    accent: '#FFC46B',
    accentClass: 'gas',
    imageSrc: '/assets/aether/img/aether-gas.jpg',
    surveyFocus: 'Core Thermonuclear Fusion & Coronal Mass Ejection Emitters',
    dataFeed: 'SDO AIA 171Å • PARKER SOLAR PROBE',
  },
  'course-planets': {
    fig: 'FIG. 04',
    designation: 'AE-04 // COMPARATIVE PLANETOLOGY',
    accent: '#FF8A3D',
    accentClass: 'rust',
    imageSrc: '/assets/aether/img/aether-rust.jpg',
    surveyFocus: 'Terrestrial Mantle Differentiation & Jovian Gas Shells',
    dataFeed: 'MARS RECONNAISSANCE • JUNO MAGNETOMETRY',
  },
  'course-moons': {
    fig: 'FIG. 05',
    designation: 'AE-05 // NATURAL SATELLITES & CRYO-OCEANS',
    accent: '#8FD3FF',
    accentClass: 'ice',
    imageSrc: '/assets/aether/img/aether-ice.jpg',
    surveyFocus: 'Sub-surface Oceans, Tidal Dissipation & Hydrocarbon Seas',
    dataFeed: 'EUROPA CLIPPER • CASSINI RADAR',
  },
  'course-milky-way': {
    fig: 'FIG. 06',
    designation: 'AE-06 // GALACTIC MORPHOLOGY & SGR A*',
    accent: '#7FFFD4',
    accentClass: 'earth',
    imageSrc: '/assets/aether/img/aether-nebula.jpg',
    surveyFocus: 'Barred Spiral Kinematics & Supermassive Black Hole Physics',
    dataFeed: 'GAIA EDR3 • EVENT HORIZON TELESCOPE',
  },
  'course-planetary-geology': {
    fig: 'FIG. 07',
    designation: 'AE-07 // TREK CARTOGRAPHY & GEOMORPHOLOGY',
    accent: '#FF8A3D',
    accentClass: 'rust',
    imageSrc: '/assets/aether/img/aether-surface.jpg',
    videoSrc: '/assets/aether/video/aether-fly.mp4',
    surveyFocus: 'Valles Marineris Rifting, Olympus Mons & Lunar Regolith',
    dataFeed: 'NASA TREK GIS • LRO LOLA ALTIMETRY',
  },
  'course-space-exploration': {
    fig: 'FIG. 08',
    designation: 'AE-08 // ASTRODYNAMICS & TRAJECTORIES',
    accent: '#8FD3FF',
    accentClass: 'ice',
    imageSrc: '/assets/aether/img/aether-surface.jpg',
    videoSrc: '/assets/aether/video/aether-fly.mp4',
    surveyFocus: 'Hohmann Energy Transfers, Gravity Slingshots & Ion Drives',
    dataFeed: 'DSN GOLDSTONE • VOYAGER TELEMETRY',
  },
  'course-space-biology': {
    fig: 'FIG. 09',
    designation: 'AE-09 // MICROGRAVITY GENOMICS & OSDR',
    accent: '#7FFFD4',
    accentClass: 'earth',
    imageSrc: '/assets/aether/img/aether-earth.jpg',
    surveyFocus: 'Cellular Radiation Stress, Telomere Dynamics & GeneLab Omics',
    dataFeed: 'NASA OSDR • ALSDA • GENELAB METRIC',
  },
  'course-climate-science': {
    fig: 'FIG. 10',
    designation: 'AE-10 // EARTH OBSERVATION & RADIATIVE FLUX',
    accent: '#8FD3FF',
    accentClass: 'ice',
    imageSrc: '/assets/aether/img/aether-earth.jpg',
    surveyFocus: 'Planetary Albedo, Greenhouse Forcing & Real-Time Imagery',
    dataFeed: 'NASA GIBS • MODIS SURFACE • CERES FLUX',
  },
  'course-space-weather': {
    fig: 'FIG. 11',
    designation: 'AE-11 // SOLAR ERUPTIONS & DONKI TELEMETRY',
    accent: '#FFC46B',
    accentClass: 'gas',
    imageSrc: '/assets/aether/img/aether-gas.jpg',
    surveyFocus: 'Interplanetary Magnetic Fields, Geomagnetic Kp Storms & Auroras',
    dataFeed: 'NASA DONKI • GOES MAGNETOMETER',
  },
  'course-human-spaceflight': {
    fig: 'FIG. 12',
    designation: 'AE-12 // LIFE SUPPORT & ARTEMIS ARCHITECTURE',
    accent: '#FF8A3D',
    accentClass: 'rust',
    imageSrc: '/assets/aether/img/aether-ice.jpg',
    surveyFocus: 'Closed-Loop ECLSS, Extravehicular Mobility & Lunar Gateway',
    dataFeed: 'ISS TELEMETRY • ARTEMIS ORION SPECS',
  },
};
