import { ColoringCategory, ColoringArtwork, ColorDefinition } from './types';

// ============================================================================
// 1. EIGHT CANONICAL COLORING CATEGORIES
// ============================================================================

export const COLORING_CATEGORIES: ColoringCategory[] = [
  {
    id: 'solar-system',
    title: 'Category 1: Solar System',
    shortTitle: 'Solar System',
    description: 'Explore the Sun, terrestrial worlds, gas giants, and the orbital dance of our planetary system.',
    icon: '🪐',
    accentColor: '#F59E0B',
    badgeTone: 'amber',
    itemCount: 5,
  },
  {
    id: 'earth-features',
    title: 'Category 2: Earth & Its Features',
    shortTitle: 'Earth & Features',
    description: 'Color our living Blue Marble from orbit, its continents, geological layers, and shimmering auroras.',
    icon: '🌍',
    accentColor: '#38BDF8',
    badgeTone: 'cyan',
    itemCount: 3,
  },
  {
    id: 'moon-exploration',
    title: 'Category 3: Moon & Exploration',
    shortTitle: 'Moon & Exploration',
    description: 'Journey to Earth’s natural satellite: impact craters, historic Apollo landing sites, and lunar rovers.',
    icon: '🌕',
    accentColor: '#94A3B8',
    badgeTone: 'cyan',
    itemCount: 3,
  },
  {
    id: 'astronauts-space-travel',
    title: 'Category 4: Astronauts & Space Travel',
    shortTitle: 'Astronauts & Travel',
    description: 'Spacewalkers floating in microgravity, pressurized EVA suits, the Space Shuttle, and the ISS.',
    icon: '👨‍🚀',
    accentColor: '#10B981',
    badgeTone: 'emerald',
    itemCount: 3,
  },
  {
    id: 'galaxies-nebulae',
    title: 'Category 5: Galaxies & Nebulae',
    shortTitle: 'Galaxies & Nebulae',
    description: 'Vast cosmic nurseries, swirling spiral arms of the Milky Way, and majestic pillars of ionized gas.',
    icon: '🌌',
    accentColor: '#A855F7',
    badgeTone: 'violet',
    itemCount: 2,
  },
  {
    id: 'rockets-satellites',
    title: 'Category 6: Rockets & Satellites',
    shortTitle: 'Rockets & Satellites',
    description: 'Heavy-lift moon rockets, deep-space observatories like the James Webb Telescope, and orbital probes.',
    icon: '🚀',
    accentColor: '#EF4444',
    badgeTone: 'amber',
    itemCount: 3,
  },
  {
    id: 'mars-alien-worlds',
    title: 'Category 7: Mars & Alien Worlds',
    shortTitle: 'Mars & Alien Worlds',
    description: 'The Red Planet, Perseverance exploration rover, human research biodomes, and exotic exoplanets.',
    icon: '🔴',
    accentColor: '#F87171',
    badgeTone: 'amber',
    itemCount: 3,
  },
  {
    id: 'stars-mysteries',
    title: 'Category 8: Stars & Space Mysteries',
    shortTitle: 'Stars & Mysteries',
    description: 'Supermassive black holes, glowing accretion disks, streaking comets, and meteor showers.',
    icon: '✨',
    accentColor: '#38BDF8',
    badgeTone: 'cyan',
    itemCount: 2,
  },
];

// ============================================================================
// 2. STANDARD ASTRONOMY COLOR PALETTES
// ============================================================================

export const DEFAULT_COLOR_PALETTE: ColorDefinition[] = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Yellow', hex: '#FBBF24' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Light Green', hex: '#84CC16' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Light Blue', hex: '#38BDF8' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Brown', hex: '#854D0E' },
  { name: 'Black', hex: '#0F172A' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Grey', hex: '#94A3B8' },
];

export const ASTRONOMY_PRESET_COLORS: ColorDefinition[] = [
  { name: 'Solar Amber', hex: '#F59E0B' },
  { name: 'Cosmic Cyan', hex: '#06B6D4' },
  { name: 'Mars Rust', hex: '#DC2626' },
  { name: 'Saturn Cream', hex: '#FDE68A' },
  { name: 'Deep Space Navy', hex: '#0B1226' },
  { name: 'Aurora Emerald', hex: '#059669' },
  { name: 'Lunar Regolith', hex: '#64748B' },
  { name: 'Nebula Violet', hex: '#D946EF' },
];

// ============================================================================
// 3. TWENTY-FOUR COMPLETE FUNCTIONAL COLORING ILLUSTRATIONS
// ============================================================================

export const COLORING_ARTWORKS: ColoringArtwork[] = [
  // --------------------------------------------------------------------------
  // CATEGORY 1: SOLAR SYSTEM
  // --------------------------------------------------------------------------
  {
    id: 'saturn-001',
    title: 'Saturn & Majestic Rings',
    category: 'solar-system',
    difficulty: 'Easy',
    description: 'Explore the spectacular ring system and storm belts of the sixth planet from the Sun.',
    educationalFact: 'Saturn’s rings span up to 282,000 km across, yet they are remarkably thin—averaging only about 10 to 30 meters in thickness!',
    additionalFact: 'The rings are composed of 99% pure water ice, ranging from tiny ice grains to school-bus-sized chunks.',
    learningTopic: 'Planetary Ring Dynamics',
    viewBox: '0 0 600 450',
    regions: [
      // Outer A Ring Top Arc
      {
        id: 'sat-ring-a-top',
        name: 'Outer A Ring (Top Arc)',
        path: 'M 70,225 C 70,165 170,120 300,120 C 430,120 530,165 530,225 C 500,210 410,185 300,185 C 190,185 100,210 70,225 Z',
      },
      // Cassini Division Gap
      {
        id: 'sat-cassini-gap',
        name: 'Cassini Division Gap',
        path: 'M 95,225 C 115,198 198,172 300,172 C 402,172 485,198 505,225 C 475,208 395,185 300,185 C 205,185 125,208 95,225 Z',
      },
      // Middle B Ring Top
      {
        id: 'sat-ring-b-top',
        name: 'Main B Ring (Top Arc)',
        path: 'M 125,225 C 145,190 215,165 300,165 C 385,165 455,190 475,225 C 445,205 380,185 300,185 C 220,185 155,205 125,225 Z',
      },
      // Inner C Ring Top
      {
        id: 'sat-ring-c-top',
        name: 'Inner Crepe Ring C',
        path: 'M 160,225 C 180,202 235,185 300,185 C 365,185 420,202 440,225 C 410,212 360,200 300,200 C 240,200 190,212 160,225 Z',
      },
      // Saturn North Polar Cap & Hexagon
      {
        id: 'sat-north-pole',
        name: 'North Polar Hexagon',
        path: 'M 255,175 C 270,160 330,160 345,175 C 335,190 265,190 255,175 Z',
      },
      // Saturn North Temperate Belt
      {
        id: 'sat-north-belt',
        name: 'North Temperate Cloud Belt',
        path: 'M 235,205 C 255,188 345,188 365,205 C 355,220 245,220 235,205 Z',
      },
      // Saturn Equatorial Zone
      {
        id: 'sat-equator',
        name: 'Equatorial Atmosphere Zone',
        path: 'M 220,235 C 240,220 360,220 380,235 C 375,255 225,255 220,235 Z',
      },
      // Ring Shadow on Globe
      {
        id: 'sat-globe-shadow',
        name: 'Ring Shadow on Globe',
        path: 'M 222,252 C 255,245 345,245 378,252 C 370,268 230,268 222,252 Z',
      },
      // Saturn Southern Hemisphere
      {
        id: 'sat-south-globe',
        name: 'Southern Hemisphere Globe',
        path: 'M 230,265 C 250,285 300,310 300,310 C 300,310 350,285 370,265 C 360,290 335,315 300,315 C 265,315 240,290 230,265 Z',
      },
      // Ring Foreground Front Arc B Ring
      {
        id: 'sat-ring-front-b',
        name: 'Front B Ring (Foreground)',
        path: 'M 125,225 C 150,250 215,275 300,275 C 385,275 450,250 475,225 C 455,240 385,260 300,260 C 215,260 145,240 125,225 Z',
      },
      // Ring Foreground Front Arc A Ring
      {
        id: 'sat-ring-front-a',
        name: 'Front A Ring (Foreground)',
        path: 'M 70,225 C 95,265 180,315 300,315 C 420,315 505,265 530,225 C 505,255 425,295 300,295 C 175,295 95,255 70,225 Z',
      },
    ],
  },
  {
    id: 'sun-002',
    title: 'The Sun — Radiant Solar Dynamo',
    category: 'solar-system',
    difficulty: 'Easy',
    description: 'Color our home star, including solar prominences, solar flares, chromosphere, and glowing core.',
    educationalFact: 'The Sun holds 99.86% of all mass in the Solar System. Its core reaches an astonishing 15 million degrees Celsius!',
    additionalFact: 'Light from the Sun takes approximately 8 minutes and 20 seconds to travel 150 million km to Earth.',
    learningTopic: 'Stellar Fusion & Nuclear Dynamics',
    viewBox: '0 0 600 450',
    regions: [
      // Flare Prominence Top Left
      {
        id: 'sun-flare-1',
        name: 'Top-Left Prominence Loop',
        path: 'M 190,120 C 160,80 170,40 210,60 C 230,75 220,110 210,125 Z',
      },
      // Flare Prominence Top Right
      {
        id: 'sun-flare-2',
        name: 'Top-Right Coronal Loop',
        path: 'M 380,115 C 420,70 450,90 440,130 C 430,150 400,140 385,125 Z',
      },
      // Flare Prominence Far Right
      {
        id: 'sun-flare-3',
        name: 'Equatorial Plasma Eruption',
        path: 'M 430,210 C 480,200 500,235 470,260 C 445,265 435,245 430,225 Z',
      },
      // Flare Prominence Bottom
      {
        id: 'sun-flare-4',
        name: 'Southern Polar Spicule Plume',
        path: 'M 290,355 C 285,410 325,415 330,360 C 320,350 300,350 290,355 Z',
      },
      // Flare Prominence Left
      {
        id: 'sun-flare-5',
        name: 'Western Limb Arch',
        path: 'M 160,210 C 105,215 110,260 155,255 C 165,240 165,225 160,210 Z',
      },
      // Outer Solar Corona
      {
        id: 'sun-corona-rim',
        name: 'Outer Coronal Atmosphere',
        path: 'M 300,85 C 380,85 445,150 445,230 C 445,310 380,375 300,375 C 220,375 155,310 155,230 C 155,150 220,85 300,85 Z',
      },
      // Chromosphere Disk
      {
        id: 'sun-chromosphere',
        name: 'Chromosphere Shell',
        path: 'M 300,115 C 363,115 415,167 415,230 C 415,293 363,345 300,345 C 237,345 185,293 185,230 C 185,167 237,115 300,115 Z',
      },
      // Sun Photosphere Surface
      {
        id: 'sun-photosphere',
        name: 'Photosphere Surface',
        path: 'M 300,145 C 347,145 385,183 385,230 C 385,277 347,315 300,315 C 253,315 215,277 215,230 C 215,183 253,145 300,145 Z',
      },
      // Solar Fusion Core
      {
        id: 'sun-core',
        name: 'Nuclear Fusion Core',
        path: 'M 300,185 C 325,185 345,205 345,230 C 345,255 325,275 300,275 C 275,275 255,255 255,230 C 255,205 275,185 300,185 Z',
      },
      // Sunspot Region 1
      {
        id: 'sunspot-alpha',
        name: 'Sunspot Magnetic Cluster Alpha',
        path: 'M 270,195 C 280,190 288,200 282,208 C 272,212 265,202 270,195 Z',
      },
      // Sunspot Region 2
      {
        id: 'sunspot-beta',
        name: 'Sunspot Active Dipole Beta',
        path: 'M 320,245 C 332,240 338,252 330,260 C 322,262 316,252 320,245 Z',
      },
    ],
  },
  {
    id: 'earth-003',
    title: 'Planet Earth — The Living Blue Marble',
    category: 'solar-system',
    difficulty: 'Medium',
    description: 'Color Earth’s rich oceans, continents, atmospheric envelope, and Arctic polar ice caps.',
    educationalFact: 'Earth is the only known planet with active plate tectonics, liquid surface water oceans, and an oxygen-rich biosphere supporting life.',
    additionalFact: 'Approximately 71% of Earth’s surface is covered by ocean waters, holding 96.5% of all planetary water.',
    learningTopic: 'Planetary Habitability & Biosphere',
    viewBox: '0 0 600 450',
    regions: [
      // Outer Atmosphere Glow
      {
        id: 'earth-atmo-halo',
        name: 'Atmospheric Ozone Glow',
        path: 'M 300,65 C 390,65 465,140 465,230 C 465,320 390,395 300,395 C 210,395 135,320 135,230 C 135,140 210,65 300,65 Z',
      },
      // Ocean Surface Globe
      {
        id: 'earth-ocean-basin',
        name: 'Global Ocean Basins',
        path: 'M 300,75 C 385,75 455,145 455,230 C 455,315 385,385 300,385 C 215,385 145,315 145,230 C 145,145 215,75 300,75 Z',
      },
      // North Polar Ice Cap
      {
        id: 'earth-polar-ice',
        name: 'Arctic Polar Ice Cap',
        path: 'M 255,85 C 280,78 320,78 345,85 C 335,105 265,105 255,85 Z',
      },
      // North America Continent
      {
        id: 'earth-north-america',
        name: 'North America Landmass',
        path: 'M 215,120 C 245,110 275,130 265,165 C 245,185 220,180 205,150 C 200,135 210,125 215,120 Z',
      },
      // South America Continent
      {
        id: 'earth-south-america',
        name: 'South America Landmass',
        path: 'M 245,200 C 270,210 280,245 265,285 C 250,305 235,280 230,240 C 230,215 240,205 245,200 Z',
      },
      // Europe & Asia Continent
      {
        id: 'earth-eurasia',
        name: 'Eurasia Landmass',
        path: 'M 310,115 C 360,105 410,130 415,170 C 390,195 345,185 320,165 C 305,145 305,125 310,115 Z',
      },
      // Africa Continent
      {
        id: 'earth-africa',
        name: 'African Continent',
        path: 'M 315,180 C 350,185 365,225 355,270 C 335,295 310,270 305,235 C 300,205 305,185 315,180 Z',
      },
      // Swirling Cloud Spiral 1
      {
        id: 'earth-cloud-storm-1',
        name: 'Atlantic Cyclone Cloud Band',
        path: 'M 275,145 C 305,135 330,150 315,165 C 295,170 270,160 275,145 Z',
      },
      // Swirling Cloud Spiral 2
      {
        id: 'earth-cloud-storm-2',
        name: 'Pacific Trade Winds Swirl',
        path: 'M 175,215 C 205,205 225,225 205,240 C 185,245 165,230 175,215 Z',
      },
    ],
  },
  {
    id: 'jupiter-004',
    title: 'Jupiter & The Great Red Spot',
    category: 'solar-system',
    difficulty: 'Medium',
    description: 'Color Jupiter’s dynamic ammonia cloud belts, alternating atmospheric jet streams, and its ancient storm.',
    educationalFact: 'Jupiter’s Great Red Spot is a persistent anticyclonic storm larger than Earth itself, observed continuously for over 350 years!',
    additionalFact: 'Jupiter rotates faster than any other planet in the Solar System, completing one full day in just 9 hours and 55 minutes.',
    learningTopic: 'Jovian Atmospheric Physics',
    viewBox: '0 0 600 450',
    regions: [
      // North Polar Region
      {
        id: 'jup-north-polar',
        name: 'North Polar Haze Zone',
        path: 'M 235,90 C 275,75 325,75 365,90 C 355,120 245,120 235,90 Z',
      },
      // North Temperate Belt
      {
        id: 'jup-north-temperate',
        name: 'North Temperate Belt (NTB)',
        path: 'M 205,120 C 265,108 335,108 395,120 C 410,150 190,150 205,120 Z',
      },
      // North Equatorial Belt
      {
        id: 'jup-north-equatorial',
        name: 'North Equatorial Belt (NEB)',
        path: 'M 185,150 C 260,138 340,138 415,150 C 425,185 175,185 185,150 Z',
      },
      // Equatorial Zone
      {
        id: 'jup-equator-zone',
        name: 'Equatorial Zone (EZ)',
        path: 'M 175,185 C 255,175 345,175 425,185 C 430,225 170,225 175,185 Z',
      },
      // South Equatorial Belt
      {
        id: 'jup-south-equatorial',
        name: 'South Equatorial Belt (SEB)',
        path: 'M 170,225 C 250,218 350,218 430,225 C 425,270 175,270 170,225 Z',
      },
      // Great Red Spot Outer Anticyclone
      {
        id: 'jup-grs-outer',
        name: 'Great Red Spot Outer Rim',
        path: 'M 335,230 C 375,225 400,240 395,260 C 390,280 345,285 330,270 C 320,255 325,235 335,230 Z',
      },
      // Great Red Spot Inner Core
      {
        id: 'jup-grs-core',
        name: 'Great Red Spot Eye & Core',
        path: 'M 345,242 C 365,238 382,248 380,258 C 375,270 352,272 342,264 C 338,255 340,245 345,242 Z',
      },
      // South Temperate Belt
      {
        id: 'jup-south-temperate',
        name: 'South Temperate Belt (STB)',
        path: 'M 185,270 C 260,265 340,265 415,270 C 400,310 200,310 185,270 Z',
      },
      // South Polar Hood
      {
        id: 'jup-south-polar',
        name: 'South Polar Region',
        path: 'M 205,310 C 265,305 335,305 395,310 C 375,355 225,355 205,310 Z',
      },
    ],
  },
  {
    id: 'solar-system-005',
    title: 'The Solar System Panorama',
    category: 'solar-system',
    difficulty: 'Explorer',
    description: 'Color the central Sun and its planetary family orbiting across celestial space.',
    educationalFact: 'Astronomers estimate the Solar System formed approximately 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud.',
    additionalFact: 'All planets orbit the Sun counterclockwise when viewed from above Earth’s North Pole, sharing a flat orbital plane called the ecliptic.',
    learningTopic: 'Keplerian Orbital Mechanics',
    viewBox: '0 0 600 450',
    regions: [
      // Central Sun
      {
        id: 'sys-sun',
        name: 'Central Sol (Sun)',
        path: 'M 0,150 C 60,150 90,190 90,225 C 90,260 60,300 0,300 Z',
      },
      // Mercury
      {
        id: 'sys-mercury',
        name: 'Mercury Planet Disk',
        path: 'M 115,225 C 115,217 127,217 127,225 C 127,233 115,233 115,225 Z',
      },
      // Venus
      {
        id: 'sys-venus',
        name: 'Venus Planet Disk',
        path: 'M 150,225 C 150,214 168,214 168,225 C 168,236 150,236 150,225 Z',
      },
      // Earth
      {
        id: 'sys-earth',
        name: 'Earth Planet Disk',
        path: 'M 195,225 C 195,213 215,213 215,225 C 215,237 195,237 195,225 Z',
      },
      // Moon
      {
        id: 'sys-moon',
        name: 'Earth’s Moon',
        path: 'M 222,217 C 222,214 227,214 227,217 C 227,220 222,220 222,217 Z',
      },
      // Mars
      {
        id: 'sys-mars',
        name: 'Mars Red Planet Disk',
        path: 'M 245,225 C 245,216 261,216 261,225 C 261,234 245,234 245,225 Z',
      },
      // Jupiter
      {
        id: 'sys-jupiter',
        name: 'Jupiter Giant Globe',
        path: 'M 290,225 C 290,195 340,195 340,225 C 340,255 290,255 290,225 Z',
      },
      // Saturn Globe
      {
        id: 'sys-saturn-body',
        name: 'Saturn Globe',
        path: 'M 380,225 C 380,205 418,205 418,225 C 418,245 380,245 380,225 Z',
      },
      // Saturn Ring
      {
        id: 'sys-saturn-ring',
        name: 'Saturn Ring System',
        path: 'M 365,225 C 365,216 433,216 433,225 C 433,234 365,234 365,225 Z',
      },
      // Uranus
      {
        id: 'sys-uranus',
        name: 'Uranus Ice Giant',
        path: 'M 465,225 C 465,212 489,212 489,225 C 489,238 465,238 465,225 Z',
      },
      // Neptune
      {
        id: 'sys-neptune',
        name: 'Neptune Deep Blue Giant',
        path: 'M 525,225 C 525,213 547,213 547,225 C 547,237 525,237 525,225 Z',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CATEGORY 2: EARTH AND ITS FEATURES
  // --------------------------------------------------------------------------
  {
    id: 'earth-space-006',
    title: 'Earth from Orbit — The Blue Horizon',
    category: 'earth-features',
    difficulty: 'Easy',
    description: 'Color the curved orbital horizon of Earth seen from high altitude, crowned with vibrant twilight glow.',
    educationalFact: 'Astronauts who view Earth from orbit often describe an intense cognitive shift known as the "Overview Effect"—a deep awareness of planet Earth’s fragile beauty and interconnected unity.',
    additionalFact: 'Earth’s atmosphere is so thin relative to the planet’s size that if Earth were the size of a basketball, the breathable air layer would be thinner than a sheet of plastic wrap.',
    learningTopic: 'Orbital Perspective & Atmosphere',
    viewBox: '0 0 600 450',
    regions: [
      // Space Background
      {
        id: 'eorb-deep-space',
        name: 'Deep Space Background',
        path: 'M 0,0 L 600,0 L 600,210 C 450,150 150,150 0,210 Z',
      },
      // Solar Glint on Horizon
      {
        id: 'eorb-sun-glint',
        name: 'Sunrise Glint on Atmospheric Limb',
        path: 'M 260,155 C 285,145 315,145 340,155 C 330,168 270,168 260,155 Z',
      },
      // Outer Atmospheric Rim
      {
        id: 'eorb-atmo-rim',
        name: 'Mesosphere / Ionosphere Halo',
        path: 'M 0,210 C 150,150 450,150 600,210 C 600,225 450,165 0,225 Z',
      },
      // Tropospheric Blue Band
      {
        id: 'eorb-tropo-band',
        name: 'Stratosphere Twilight Glow',
        path: 'M 0,225 C 150,165 450,165 600,225 C 600,240 450,180 0,240 Z',
      },
      // Pacific Ocean Surface
      {
        id: 'eorb-ocean',
        name: 'Pacific Ocean Expanse',
        path: 'M 0,240 C 150,180 450,180 600,240 L 600,450 L 0,450 Z',
      },
      // Continent Archipelago Coast
      {
        id: 'eorb-continent',
        name: 'Continental Coastal Margin',
        path: 'M 180,310 C 230,280 290,295 310,340 C 290,380 230,375 200,345 Z',
      },
      // Swirling Hurricane Cloud System
      {
        id: 'eorb-hurricane',
        name: 'Cyclone Cloud Spiral',
        path: 'M 350,290 C 390,270 440,290 435,330 C 420,360 375,360 360,335 C 350,315 345,300 350,290 Z',
      },
    ],
  },
  {
    id: 'earth-layers-007',
    title: 'Earth’s Geological Layers Cross-Section',
    category: 'earth-features',
    difficulty: 'Medium',
    description: 'Color the nested planetary layers from the rocky surface crust down to the solid iron-nickel inner core.',
    educationalFact: 'Earth’s inner core is a solid sphere of iron and nickel nearly as hot as the surface of the Sun (approx. 5,400°C), kept solid by colossal gravitational pressure!',
    additionalFact: 'The swirling liquid iron in the outer core generates Earth’s powerful geomagnetic field, deflecting hazardous solar wind radiation.',
    learningTopic: 'Geophysics & Planetary Differentiation',
    viewBox: '0 0 600 450',
    regions: [
      // Oceanic & Continental Crust (Outer Rim)
      {
        id: 'elayer-crust',
        name: 'Lithosphere & Crust',
        path: 'M 300,70 C 385,70 455,140 455,225 C 455,310 385,380 300,380 C 215,380 145,310 145,225 C 145,140 215,70 300,70 Z',
      },
      // Upper Mantle (Asthenosphere)
      {
        id: 'elayer-upper-mantle',
        name: 'Upper Mantle (Convection Zone)',
        path: 'M 300,95 C 370,95 430,155 430,225 C 430,295 370,355 300,355 C 230,355 170,295 170,225 C 170,155 230,95 300,95 Z',
      },
      // Lower Mantle (Mesosphere)
      {
        id: 'elayer-lower-mantle',
        name: 'Lower Mantle (Silicate Rocks)',
        path: 'M 300,125 C 355,125 400,170 400,225 C 400,280 355,325 300,325 C 245,325 200,280 200,225 C 200,170 245,125 300,125 Z',
      },
      // Liquid Outer Core
      {
        id: 'elayer-outer-core',
        name: 'Liquid Outer Core (Geomagnetic Dynamo)',
        path: 'M 300,160 C 336,160 365,189 365,225 C 365,261 336,290 300,290 C 264,290 235,261 235,225 C 235,189 264,160 300,160 Z',
      },
      // Solid Inner Core
      {
        id: 'elayer-inner-core',
        name: 'Solid Inner Core (Iron-Nickel Crystal)',
        path: 'M 300,195 C 317,195 330,208 330,225 C 330,242 317,255 300,255 C 283,255 270,242 270,225 C 270,208 283,195 300,195 Z',
      },
    ],
  },
  {
    id: 'aurora-008',
    title: 'Aurora Borealis — Polar Northern Lights',
    category: 'earth-features',
    difficulty: 'Explorer',
    description: 'Color the glowing electromagnetic curtains dancing above snowy arctic mountain peaks and frozen waters.',
    educationalFact: 'Auroras occur when charged particles from solar coronal mass ejections collide with oxygen and nitrogen atoms in Earth’s upper thermosphere.',
    additionalFact: 'Green auroral light is emitted by excited oxygen atoms at 100-300 km altitude, while rare crimson-purple light comes from nitrogen molecules higher up.',
    learningTopic: 'Space Weather & Magnetospheric Physics',
    viewBox: '0 0 600 450',
    regions: [
      // Polar Night Sky
      {
        id: 'aur-sky',
        name: 'Arctic Night Sky Background',
        path: 'M 0,0 L 600,0 L 600,260 L 0,260 Z',
      },
      // Aurora Upper Curtain Violet
      {
        id: 'aur-curtain-top',
        name: 'Upper Nitrogen Violet Glow',
        path: 'M 0,70 C 130,40 220,110 320,60 C 420,10 500,80 600,50 L 600,130 C 500,150 420,90 320,130 C 220,170 120,110 0,140 Z',
      },
      // Aurora Main Ribbon Emerald
      {
        id: 'aur-ribbon-mid',
        name: 'Main Oxygen Emerald Ribbon',
        path: 'M 0,130 C 120,110 220,170 320,130 C 420,90 500,150 600,130 L 600,190 C 510,210 420,160 310,200 C 200,230 110,180 0,200 Z',
      },
      // Aurora Lower Ionized Fringe
      {
        id: 'aur-fringe-low',
        name: 'Lower Ionized Transition Fringe',
        path: 'M 0,190 C 110,180 200,230 310,200 C 420,160 510,210 600,190 L 600,240 C 480,260 380,210 280,250 C 170,270 90,230 0,250 Z',
      },
      // Snowy Mountain Peaks Left
      {
        id: 'aur-mountain-l',
        name: 'Snowy Alpine Peak Left',
        path: 'M 0,330 L 110,240 L 190,320 L 260,250 L 330,340 L 0,340 Z',
      },
      // Snowy Mountain Peaks Right
      {
        id: 'aur-mountain-r',
        name: 'Jagged Glacial Ridge Right',
        path: 'M 290,340 L 370,255 L 450,330 L 520,245 L 600,320 L 600,340 Z',
      },
      // Frozen Arctic Fjord / Lake
      {
        id: 'aur-lake',
        name: 'Mirror Fjord Lake Reflection',
        path: 'M 0,340 L 600,340 L 600,450 L 0,450 Z',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CATEGORY 3: MOON AND EXPLORATION
  // --------------------------------------------------------------------------
  {
    id: 'moon-full-009',
    title: 'Full Moon — Lunar Maria & Craters',
    category: 'moon-exploration',
    difficulty: 'Easy',
    description: 'Color the ancient basaltic lava seas, bright highlands, and radiant impact rays of Earth’s Moon.',
    educationalFact: 'The dark patches on the Moon called "maria" (Latin for "seas") are actually vast basalt plains formed by ancient volcanic eruptions over 3 billion years ago.',
    additionalFact: 'Because the Moon has no atmosphere or weather, astronaut footprints left during the Apollo missions could remain intact for millions of years!',
    learningTopic: 'Lunar Geology & Cratering Dynamics',
    viewBox: '0 0 600 450',
    regions: [
      // Lunar Globe Outer Rim
      {
        id: 'moon-globe',
        name: 'Anorthosite Highland Crust',
        path: 'M 300,70 C 385,70 455,140 455,225 C 455,310 385,380 300,380 C 215,380 145,310 145,225 C 145,140 215,70 300,70 Z',
      },
      // Mare Imbrium (Sea of Rains)
      {
        id: 'moon-mare-imbrium',
        name: 'Mare Imbrium (Basalt Plain)',
        path: 'M 230,130 C 265,115 305,125 315,160 C 295,190 245,190 220,165 C 215,145 220,135 230,130 Z',
      },
      // Mare Serenitatis
      {
        id: 'moon-mare-serenitatis',
        name: 'Mare Serenitatis Basin',
        path: 'M 325,140 C 355,130 385,145 380,175 C 365,195 330,190 320,165 C 315,150 320,142 325,140 Z',
      },
      // Mare Tranquillitatis (Apollo 11 Landing Sea)
      {
        id: 'moon-mare-tranquil',
        name: 'Mare Tranquillitatis (Apollo 11 Site)',
        path: 'M 345,190 C 385,185 415,210 405,245 C 380,265 340,250 335,220 C 330,200 338,192 345,190 Z',
      },
      // Oceanus Procellarum (Ocean of Storms)
      {
        id: 'moon-oceanus-procell',
        name: 'Oceanus Procellarum',
        path: 'M 175,175 C 215,160 225,220 215,270 C 195,300 170,280 165,235 C 160,200 165,185 175,175 Z',
      },
      // Tycho Crater & Ejecta Core
      {
        id: 'moon-crater-tycho',
        name: 'Tycho Crater Impact Center',
        path: 'M 285,320 C 298,315 312,315 320,325 C 315,338 290,338 285,320 Z',
      },
      // Copernicus Crater
      {
        id: 'moon-crater-copernicus',
        name: 'Copernicus Central Peak',
        path: 'M 245,200 C 256,195 268,200 265,210 C 258,218 245,214 245,200 Z',
      },
    ],
  },
  {
    id: 'lunar-rover-010',
    title: 'Apollo Lunar Roving Vehicle (LRV)',
    category: 'moon-exploration',
    difficulty: 'Medium',
    description: 'Color the electric dune buggy that enabled astronauts to explore kilometers across the Moon’s rugged terrain.',
    educationalFact: 'The Lunar Roving Vehicle used woven zinc-coated steel wire mesh tires with titanium chevrons instead of rubber, since rubber becomes brittle in the extreme vacuum of space.',
    additionalFact: 'The Apollo 17 rover reached a top lunar speed of 18 km/h, driven across the Taurus-Littrow valley by astronaut Eugene Cernan.',
    learningTopic: 'Extraterrestrial Mobility Engineering',
    viewBox: '0 0 600 450',
    regions: [
      // Chassis Main Frame
      {
        id: 'lrv-chassis',
        name: 'Tubular Aluminum Chassis',
        path: 'M 150,255 L 430,255 L 420,285 L 160,285 Z',
      },
      // Front Left Wheel Assembly
      {
        id: 'lrv-wheel-fl',
        name: 'Front-Left Wire Mesh Wheel',
        path: 'M 110,310 C 110,280 140,260 170,270 C 185,285 185,325 165,345 C 135,355 110,335 110,310 Z',
      },
      // Front Wheel Hub
      {
        id: 'lrv-hub-fl',
        name: 'Wheel Hub Motor Unit',
        path: 'M 135,310 C 135,298 150,298 150,310 C 150,322 135,322 135,310 Z',
      },
      // Rear Wheel Assembly
      {
        id: 'lrv-wheel-rr',
        name: 'Rear-Right Wire Mesh Wheel',
        path: 'M 390,310 C 390,280 420,260 450,270 C 465,285 465,325 445,345 C 415,355 390,335 390,310 Z',
      },
      // Rear Wheel Hub
      {
        id: 'lrv-hub-rr',
        name: 'Rear Electric Hub Motor',
        path: 'M 415,310 C 415,298 430,298 430,310 C 430,322 415,322 415,310 Z',
      },
      // High-Gain Mesh Umbrella Antenna Dish
      {
        id: 'lrv-antenna-dish',
        name: 'High-Gain Communications Umbrella',
        path: 'M 210,135 C 230,115 285,115 305,135 C 285,155 230,155 210,135 Z',
      },
      // Antenna Mast Support Strut
      {
        id: 'lrv-antenna-mast',
        name: 'Gimbal Antenna Mast',
        path: 'M 252,145 L 260,145 L 260,255 L 252,255 Z',
      },
      // Astronaut Lawn-Chair Seats
      {
        id: 'lrv-seats',
        name: 'Tubular Astronaut Bucket Seat',
        path: 'M 290,210 L 340,210 L 350,255 L 285,255 Z',
      },
      // Lunar Ground Undulation
      {
        id: 'lrv-lunar-ground',
        name: 'Lunar Regolith Surface',
        path: 'M 0,335 Q 150,320 300,340 T 600,330 L 600,450 L 0,450 Z',
      },
    ],
  },
  {
    id: 'moon-landing-011',
    title: 'Apollo Lunar Module & Moon Landing',
    category: 'moon-exploration',
    difficulty: 'Explorer',
    description: 'Color the Apollo Lunar Module "Eagle" resting on the Moon’s Sea of Tranquility, surrounded by stars.',
    educationalFact: 'On July 20, 1969, Apollo 11 astronauts Neil Armstrong and Buzz Aldrin became the first humans to touch the surface of another celestial body.',
    additionalFact: 'The descent stage base remained permanently on the Moon as a launch platform when the ascent module blasted off to rejoin the Command Module.',
    learningTopic: 'Space Flight Architecture & Landing Dynamics',
    viewBox: '0 0 600 450',
    regions: [
      // Ascent Stage Cabin Cockpit
      {
        id: 'lem-ascent-cabin',
        name: 'Ascent Stage Pressurized Cabin',
        path: 'M 230,135 L 370,135 L 390,195 L 210,195 Z',
      },
      // Triangular Cockpit Windows
      {
        id: 'lem-windows',
        name: 'Pilot Forward Windows',
        path: 'M 270,145 L 330,145 L 320,165 L 280,165 Z',
      },
      // Descent Stage Octagonal Body
      {
        id: 'lem-descent-stage',
        name: 'Descent Stage (Gold Foil Clad)',
        path: 'M 195,195 L 405,195 L 425,270 L 175,270 Z',
      },
      // Left Outrigger Landing Leg
      {
        id: 'lem-leg-l',
        name: 'Left Outrigger Strut',
        path: 'M 185,260 L 110,340 L 125,345 L 200,265 Z',
      },
      // Left Footpad Dish
      {
        id: 'lem-footpad-l',
        name: 'Left Lunar Surface Footpad',
        path: 'M 95,340 C 115,335 140,335 150,345 C 130,350 105,350 95,340 Z',
      },
      // Right Outrigger Landing Leg
      {
        id: 'lem-leg-r',
        name: 'Right Outrigger Strut',
        path: 'M 415,260 L 490,340 L 475,345 L 400,265 Z',
      },
      // Right Footpad Dish
      {
        id: 'lem-footpad-r',
        name: 'Right Lunar Surface Footpad',
        path: 'M 450,340 C 470,335 495,335 505,345 C 485,350 460,350 450,340 Z',
      },
      // Center Descent Engine Nozzle
      {
        id: 'lem-engine-bell',
        name: 'Descent Propulsion Engine Bell',
        path: 'M 270,270 L 330,270 L 345,315 L 255,315 Z',
      },
      // Lunar Surface Horizon
      {
        id: 'lem-lunar-ground',
        name: 'Sea of Tranquility Ground',
        path: 'M 0,335 C 180,315 420,315 600,335 L 600,450 L 0,450 Z',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CATEGORY 4: ASTRONAUTS AND SPACE TRAVEL
  // --------------------------------------------------------------------------
  {
    id: 'astronaut-eva-012',
    title: 'Spacewalker — Astronaut EVA in Orbit',
    category: 'astronauts-space-travel',
    difficulty: 'Medium',
    description: 'Color a spacewalker floating freely outside the station, with Earth reflected in the gold-coated helmet visor.',
    educationalFact: 'Spacewalk helmets have a micro-thin layer of real 24-karat gold vapor-deposited onto the visor to protect astronauts’ eyes from blinding, unfiltered solar radiation.',
    additionalFact: 'An Extravehicular Mobility Unit (EMU) spacesuit acts as a miniature personal spacecraft, providing 100% pure oxygen, thermal heating/cooling, and micrometeoroid shielding.',
    learningTopic: 'Human Spaceflight & Life Support Systems',
    viewBox: '0 0 600 450',
    regions: [
      // Helmet Outer Shell
      {
        id: 'astro-helmet',
        name: 'Helmet Pressure Shell',
        path: 'M 250,90 C 250,55 350,55 350,90 C 365,115 365,145 350,165 C 335,175 265,175 250,165 C 235,145 235,115 250,90 Z',
      },
      // Gold Sun Visor (Earth Reflection)
      {
        id: 'astro-visor',
        name: '24K Gold Sun Visor',
        path: 'M 265,95 C 280,82 320,82 335,95 C 348,110 348,135 335,145 C 320,155 280,155 265,145 C 252,135 252,110 265,95 Z',
      },
      // Chest Life Support Control Module (DCM)
      {
        id: 'astro-chest-pack',
        name: 'Display & Control Module (DCM)',
        path: 'M 270,185 L 330,185 L 335,240 L 265,240 Z',
      },
      // Hard Upper Torso (HUT)
      {
        id: 'astro-torso',
        name: 'Hard Upper Torso Suit',
        path: 'M 245,170 C 240,210 240,250 250,270 L 350,270 C 360,250 360,210 355,170 Z',
      },
      // Left Arm Sleeve
      {
        id: 'astro-arm-l',
        name: 'Left Pressurized Arm Sleeve',
        path: 'M 245,185 C 205,195 170,225 155,255 L 180,275 C 195,255 220,230 245,225 Z',
      },
      // Left Glove
      {
        id: 'astro-glove-l',
        name: 'Left Thermal Micrometeoroid Glove',
        path: 'M 145,260 C 130,275 145,305 170,295 C 175,285 165,270 145,260 Z',
      },
      // Right Arm Sleeve
      {
        id: 'astro-arm-r',
        name: 'Right Pressurized Arm Sleeve',
        path: 'M 355,185 C 395,195 430,225 445,255 L 420,275 C 405,255 380,230 355,225 Z',
      },
      // Right Glove
      {
        id: 'astro-glove-r',
        name: 'Right Thermal Micrometeoroid Glove',
        path: 'M 455,260 C 470,275 455,305 430,295 C 425,285 435,270 455,260 Z',
      },
      // Lower Torso & Pants Assembly
      {
        id: 'astro-legs',
        name: 'Lower Torso & Articulated Legs',
        path: 'M 250,270 L 350,270 L 360,370 L 315,370 L 305,310 L 295,310 L 285,370 L 240,370 Z',
      },
      // Left Boot
      {
        id: 'astro-boot-l',
        name: 'Left Lunar / EVA Boot',
        path: 'M 235,370 L 285,370 L 280,395 L 225,395 Z',
      },
      // Right Boot
      {
        id: 'astro-boot-r',
        name: 'Right Lunar / EVA Boot',
        path: 'M 315,370 L 365,370 L 375,395 L 320,395 Z',
      },
    ],
  },
  {
    id: 'iss-space-station-013',
    title: 'International Space Station (ISS)',
    category: 'astronauts-space-travel',
    difficulty: 'Explorer',
    description: 'Color humanity’s football-field-sized microgravity orbital laboratory, complete with giant photovoltaic solar wings.',
    educationalFact: 'The ISS orbits Earth at an average speed of 28,000 km/h (17,500 mph), completing one full circuit of our planet every 90 minutes!',
    additionalFact: 'Crew members aboard the ISS experience 16 sunrises and 16 sunsets every single day as they orbit 400 km above Earth.',
    learningTopic: 'Orbital Habitat Architecture & Microgravity',
    viewBox: '0 0 600 450',
    regions: [
      // Central Truss Beam
      {
        id: 'iss-truss-spine',
        name: 'Integrated Truss Structure (ITS)',
        path: 'M 60,215 L 540,215 L 540,230 L 60,230 Z',
      },
      // Port Solar Array Wing Left Top
      {
        id: 'iss-solar-lt',
        name: 'Port Solar Array Panel (Left Top)',
        path: 'M 80,85 L 145,85 L 145,200 L 80,200 Z',
      },
      // Port Solar Array Wing Left Bottom
      {
        id: 'iss-solar-lb',
        name: 'Port Solar Array Panel (Left Bottom)',
        path: 'M 80,245 L 145,245 L 145,360 L 80,360 Z',
      },
      // Starboard Solar Array Wing Right Top
      {
        id: 'iss-solar-rt',
        name: 'Starboard Solar Array Panel (Right Top)',
        path: 'M 455,85 L 520,85 L 520,200 L 455,200 Z',
      },
      // Starboard Solar Array Wing Right Bottom
      {
        id: 'iss-solar-rb',
        name: 'Starboard Solar Array Panel (Right Bottom)',
        path: 'M 455,245 L 520,245 L 520,360 L 455,360 Z',
      },
      // Central Pressurized Laboratory Modules (Destiny & Columbus)
      {
        id: 'iss-labs-center',
        name: 'Pressurized Science Modules & Node 2',
        path: 'M 270,175 L 330,175 L 330,270 L 270,270 Z',
      },
      // Thermal Radiator Panels
      {
        id: 'iss-radiators',
        name: 'Ammonia Thermal Radiator Fins',
        path: 'M 210,135 L 245,135 L 245,215 L 210,215 Z',
      },
      // Russian Segment (Zvezda & Zarya)
      {
        id: 'iss-russian-modules',
        name: 'Zvezda Service Module & Zarya FGB',
        path: 'M 280,270 L 320,270 L 315,345 L 285,345 Z',
      },
    ],
  },
  {
    id: 'space-shuttle-014',
    title: 'Space Shuttle Orbiter — Gliding Home',
    category: 'astronauts-space-travel',
    difficulty: 'Medium',
    description: 'Color NASA’s iconic winged reusable spaceplane descending through upper atmospheric entry.',
    educationalFact: 'During atmospheric entry, the black carbon-carbon tiles on the belly of the Space Shuttle had to withstand scorching temperatures exceeding 1,650°C (3,000°F).',
    additionalFact: 'The Space Shuttle fleet (Columbia, Challenger, Discovery, Atlantis, and Endeavour) flew a combined 135 orbital missions over three decades.',
    learningTopic: 'Hypersonic Reentry & Aerodynamics',
    viewBox: '0 0 600 450',
    regions: [
      // Nose Cone & Black Thermal Cap
      {
        id: 'shuttle-nose',
        name: 'Reinforced Carbon-Carbon Nose Cone',
        path: 'M 275,60 C 290,45 310,45 325,60 C 335,80 265,80 275,60 Z',
      },
      // Cockpit Flight Deck Windows
      {
        id: 'shuttle-cockpit',
        name: 'Commander & Pilot Flight Deck Windows',
        path: 'M 285,82 L 315,82 L 320,95 L 280,95 Z',
      },
      // Fuselage Body
      {
        id: 'shuttle-fuselage',
        name: 'Forward Fuselage & Payload Bay Doors',
        path: 'M 270,95 L 330,95 L 340,280 L 260,280 Z',
      },
      // Left Double-Delta Wing
      {
        id: 'shuttle-wing-l',
        name: 'Left Double-Delta Wing',
        path: 'M 265,200 L 120,310 L 140,340 L 260,320 Z',
      },
      // Right Double-Delta Wing
      {
        id: 'shuttle-wing-r',
        name: 'Right Double-Delta Wing',
        path: 'M 335,200 L 480,310 L 460,340 L 340,320 Z',
      },
      // Vertical Tail Fin
      {
        id: 'shuttle-tail-fin',
        name: 'Vertical Stabilizer & Speed Brake',
        path: 'M 290,195 L 310,195 L 315,310 L 285,310 Z',
      },
      // Three Space Shuttle Main Engine (SSME) Bells
      {
        id: 'shuttle-engines',
        name: 'Three Main Cryogenic Engine Nozzles',
        path: 'M 275,320 L 325,320 L 330,355 L 270,355 Z',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CATEGORY 5: GALAXIES AND NEBULAE
  // --------------------------------------------------------------------------
  {
    id: 'spiral-galaxy-015',
    title: 'Milky Way Spiral Galaxy',
    category: 'galaxies-nebulae',
    difficulty: 'Medium',
    description: 'Color the grand spiral pinwheel of our home galaxy, packed with hundreds of billions of stars.',
    educationalFact: 'The Milky Way galaxy is approximately 100,000 light-years across. It takes our Sun about 230 million years to complete one single galactic orbit!',
    additionalFact: 'At the exact center of our galaxy lies Sagittarius A*, a supermassive black hole with a mass equal to 4.3 million Suns.',
    learningTopic: 'Galactic Structure & Astrophysics',
    viewBox: '0 0 600 450',
    regions: [
      // Deep Cosmic Background
      {
        id: 'gal-space-bg',
        name: 'Deep Intergalactic Space',
        path: 'M 0,0 L 600,0 L 600,450 L 0,450 Z',
      },
      // Bright Galactic Bulge & Core
      {
        id: 'gal-core-bulge',
        name: 'Central Galactic Bulge (Star Nucleus)',
        path: 'M 300,185 C 335,185 360,205 360,225 C 360,245 335,265 300,265 C 265,265 240,245 240,225 C 240,205 265,185 300,185 Z',
      },
      // Supermassive Black Hole Eye
      {
        id: 'gal-sag-a',
        name: 'Sagittarius A* Center Core',
        path: 'M 300,212 C 312,212 320,218 320,225 C 320,232 312,238 300,238 C 288,238 280,232 280,225 C 280,218 288,212 300,212 Z',
      },
      // Spiral Arm Major 1 (Perseus Arm)
      {
        id: 'gal-arm-perseus',
        name: 'Perseus Spiral Arm (Young Blue Stars)',
        path: 'M 300,185 C 390,170 470,220 460,280 C 445,340 365,365 290,340 C 235,320 215,280 240,250 C 255,270 290,300 340,295 C 400,290 420,240 375,205 C 340,185 315,185 300,185 Z',
      },
      // Spiral Arm Major 2 (Scutum-Centaurus Arm)
      {
        id: 'gal-arm-scutum',
        name: 'Scutum-Centaurus Arm',
        path: 'M 300,265 C 210,280 130,230 140,170 C 155,110 235,85 310,110 C 365,130 385,170 360,200 C 345,180 310,150 260,155 C 200,160 180,210 225,245 C 260,265 285,265 300,265 Z',
      },
      // Outer Halo Star Cluster 1
      {
        id: 'gal-globular-1',
        name: 'Globular Cluster Alpha',
        path: 'M 100,110 C 115,100 130,110 125,125 C 115,135 100,125 100,110 Z',
      },
      // Outer Halo Star Cluster 2
      {
        id: 'gal-globular-2',
        name: 'Globular Cluster Omega',
        path: 'M 490,330 C 505,320 520,330 515,345 C 505,355 490,345 490,330 Z',
      },
    ],
  },
  {
    id: 'pillars-nebula-016',
    title: 'Pillars of Creation — Eagle Nebula',
    category: 'galaxies-nebulae',
    difficulty: 'Explorer',
    description: 'Color the towering interstellar spires of cold molecular hydrogen and dust where baby stars ignite.',
    educationalFact: 'The largest of the "Pillars of Creation" in the Eagle Nebula is roughly 4 to 5 light-years tall—a distance so vast that light takes over 4 years to travel from base to tip!',
    additionalFact: 'Ultraviolet light and stellar winds from massive nearby young stars are slowly eroding the dust pillars into cosmic oblivion.',
    learningTopic: 'Star Formation & Interstellar Medium',
    viewBox: '0 0 600 450',
    regions: [
      // Deep Space Ionized Hydrogen Sky
      {
        id: 'neb-sky',
        name: 'Ionized Hydrogen Background Cloud',
        path: 'M 0,0 L 600,0 L 600,450 L 0,450 Z',
      },
      // Left Tallest Main Pillar
      {
        id: 'neb-pillar-left',
        name: 'Tallest Molecular Gas Pillar',
        path: 'M 140,450 L 150,210 C 145,160 185,120 215,140 C 235,160 210,210 215,260 L 225,450 Z',
      },
      // Left Pillar Crown Finger
      {
        id: 'neb-pillar-tip-l',
        name: 'Evaporating Gaseous Globule Tip',
        path: 'M 180,125 C 195,110 220,115 220,135 C 215,150 195,150 180,125 Z',
      },
      // Middle Pillar
      {
        id: 'neb-pillar-mid',
        name: 'Central Star-Forming Pillar',
        path: 'M 255,450 L 270,250 C 265,220 295,190 320,205 C 335,220 320,260 330,300 L 340,450 Z',
      },
      // Right Pillar Spire
      {
        id: 'neb-pillar-right',
        name: 'Right Gas Column Spire',
        path: 'M 370,450 L 385,310 C 380,285 410,265 430,280 C 445,295 435,335 440,360 L 450,450 Z',
      },
      // Embedded Young Stellar Proto-Star 1
      {
        id: 'neb-protostar-1',
        name: 'Newborn Proto-Star Cluster Alpha',
        path: 'M 195,160 C 205,150 215,160 210,170 C 200,175 190,170 195,160 Z',
      },
      // Embedded Young Stellar Proto-Star 2
      {
        id: 'neb-protostar-2',
        name: 'Newborn Proto-Star Cluster Beta',
        path: 'M 305,230 C 315,220 325,230 320,240 C 310,245 300,240 305,230 Z',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CATEGORY 6: ROCKETS AND SATELLITES
  // --------------------------------------------------------------------------
  {
    id: 'rocket-launch-017',
    title: 'Artemis Heavy Rocket Launch to the Moon',
    category: 'rockets-satellites',
    difficulty: 'Easy',
    description: 'Color the thunderous liftoff of a deep-space lunar rocket with roaring booster exhaust flames and billowing steam.',
    educationalFact: 'At liftoff, NASA’s Space Launch System (SLS) rocket produces 8.8 million pounds of maximum thrust—more power than any operational rocket in history!',
    additionalFact: 'The four RS-25 core engines consume liquid hydrogen and liquid oxygen cooled to -253°C (-423°F), creating a pure water vapor exhaust plume.',
    learningTopic: 'Chemical Rocket Propulsion & Staging',
    viewBox: '0 0 600 450',
    regions: [
      // Launch Sky
      {
        id: 'rkt-sky',
        name: 'Launch Pad Sky',
        path: 'M 0,0 L 600,0 L 600,340 L 0,340 Z',
      },
      // Launch Escape System & Orion Capsule
      {
        id: 'rkt-capsule-les',
        name: 'Orion Crew Capsule & Launch Abort Tower',
        path: 'M 292,40 L 308,40 L 315,100 L 285,100 Z',
      },
      // Core Stage Orange Fuel Tank
      {
        id: 'rkt-core-tank',
        name: 'Core Stage (Orange Cryogenic Foam)',
        path: 'M 285,100 L 315,100 L 318,260 L 282,260 Z',
      },
      // Left Solid Rocket Booster
      {
        id: 'rkt-booster-l',
        name: 'Left 5-Segment Solid Rocket Booster',
        path: 'M 262,120 L 282,140 L 282,260 L 260,260 Z',
      },
      // Left Booster Nose Cone
      {
        id: 'rkt-bcone-l',
        name: 'Left Booster Aerodynamic Nose Cone',
        path: 'M 262,120 L 282,140 L 262,140 Z',
      },
      // Right Solid Rocket Booster
      {
        id: 'rkt-booster-r',
        name: 'Right 5-Segment Solid Rocket Booster',
        path: 'M 338,120 L 318,140 L 318,260 L 340,260 Z',
      },
      // Right Booster Nose Cone
      {
        id: 'rkt-bcone-r',
        name: 'Right Booster Aerodynamic Nose Cone',
        path: 'M 338,120 L 318,140 L 338,140 Z',
      },
      // Booster Exhaust Plume Fire
      {
        id: 'rkt-plume-fire',
        name: 'Hypergolic Ignition Rocket Flame',
        path: 'M 265,260 L 335,260 L 350,340 L 300,380 L 250,340 Z',
      },
      // Billowing Steam & Smoke Cloud
      {
        id: 'rkt-steam-cloud',
        name: 'Launch Pad Sound Suppression Water Steam',
        path: 'M 60,370 C 120,310 200,320 250,340 C 300,380 350,340 400,320 C 470,310 540,360 550,450 L 50,450 Z',
      },
    ],
  },
  {
    id: 'space-telescope-018',
    title: 'James Webb Space Telescope (JWST)',
    category: 'rockets-satellites',
    difficulty: 'Medium',
    description: 'Color the golden hexagonal mirror segments and 5-layer tennis-court-sized sunshield peering into the dawn of time.',
    educationalFact: 'Webb’s 18 hexagonal primary mirror segments are plated with a microscopic layer of pure gold only 100 nanometers thin—optimizing infrared reflectivity.',
    additionalFact: 'JWST orbits around the Sun at Lagrange Point 2 (L2), approximately 1.5 million kilometers away from Earth, keeping its instruments at a cryogenic -233°C.',
    learningTopic: 'Space Optical Astronomy & Infrared Technology',
    viewBox: '0 0 600 450',
    regions: [
      // Primary Mirror Hexagonal Center
      {
        id: 'jwt-mirror-center',
        name: 'Central Beryllium Gold Mirror Array',
        path: 'M 255,140 L 345,140 L 380,205 L 345,270 L 255,270 L 220,205 Z',
      },
      // Secondary Mirror Tripod Strut 1
      {
        id: 'jwt-strut-top',
        name: 'Secondary Mirror Tripod Top Strut',
        path: 'M 300,75 L 303,75 L 303,140 L 297,140 Z',
      },
      // Secondary Mirror Small Hexagon Reflector
      {
        id: 'jwt-secondary-mirror',
        name: 'Secondary Convex Reflector',
        path: 'M 285,65 L 315,65 L 325,82 L 315,95 L 285,95 L 275,82 Z',
      },
      // Sunshield Membrane Layer 1 (Top)
      {
        id: 'jwt-sunshield-1',
        name: 'Kapton Sunshield Membrane Layer 1',
        path: 'M 80,260 L 520,260 L 550,290 L 50,290 Z',
      },
      // Sunshield Membrane Layer 2
      {
        id: 'jwt-sunshield-2',
        name: 'Sunshield Vacuum Gap Layer 2',
        path: 'M 70,290 L 530,290 L 550,315 L 50,315 Z',
      },
      // Sunshield Membrane Layer 3
      {
        id: 'jwt-sunshield-3',
        name: 'Sunshield Radiation Barrier Layer 3',
        path: 'M 60,315 L 540,315 L 555,340 L 45,340 Z',
      },
      // Spacecraft Bus & Solar Power Panel
      {
        id: 'jwt-spacecraft-bus',
        name: 'Cryogenic Spacecraft Bus & Solar Array',
        path: 'M 260,340 L 340,340 L 345,390 L 255,390 Z',
      },
    ],
  },
  {
    id: 'satellite-019',
    title: 'Orbital Communication Satellite',
    category: 'rockets-satellites',
    difficulty: 'Easy',
    description: 'Color a telecommunication satellite relaying high-speed signals across the globe from geostationary orbit.',
    educationalFact: 'Geostationary satellites orbit at exactly 35,786 km above Earth’s equator, matching Earth’s rotation speed so they remain fixed over one spot on the ground.',
    additionalFact: 'Arthur C. Clarke famously proposed the concept of geostationary communications satellites in 1945, years before the first satellite ever launched.',
    learningTopic: 'Satellite Telecommunications & Orbital Altitudes',
    viewBox: '0 0 600 450',
    regions: [
      // Central Satellite Bus Chassis
      {
        id: 'sat-chassis',
        name: 'Hexagonal Satellite Main Bus',
        path: 'M 260,180 L 340,180 L 360,250 L 240,250 Z',
      },
      // Parabolic Communication Dish
      {
        id: 'sat-comm-dish',
        name: 'Parabolic Microwave Dish Antenna',
        path: 'M 250,110 C 275,80 325,80 350,110 C 330,140 270,140 250,110 Z',
      },
      // Left Solar Panel Array 1
      {
        id: 'sat-solar-panel-l1',
        name: 'Port Solar Wing Inner Panel',
        path: 'M 140,195 L 240,195 L 240,240 L 140,240 Z',
      },
      // Left Solar Panel Array 2
      {
        id: 'sat-solar-panel-l2',
        name: 'Port Solar Wing Outer Panel',
        path: 'M 40,195 L 130,195 L 130,240 L 40,240 Z',
      },
      // Right Solar Panel Array 1
      {
        id: 'sat-solar-panel-r1',
        name: 'Starboard Solar Wing Inner Panel',
        path: 'M 360,195 L 460,195 L 460,240 L 360,240 Z',
      },
      // Right Solar Panel Array 2
      {
        id: 'sat-solar-panel-r2',
        name: 'Starboard Solar Wing Outer Panel',
        path: 'M 470,195 L 560,195 L 560,240 L 470,240 Z',
      },
      // Earth Horizon Below
      {
        id: 'sat-earth-rim',
        name: 'Earth Horizon Arc Below',
        path: 'M 0,380 C 180,330 420,330 600,380 L 600,450 L 0,450 Z',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CATEGORY 7: MARS AND ALIEN WORLDS
  // --------------------------------------------------------------------------
  {
    id: 'mars-perseverance-020',
    title: 'NASA Perseverance Rover in Jezero Crater',
    category: 'mars-alien-worlds',
    difficulty: 'Medium',
    description: 'Color the nuclear-powered robotic astrobiology laboratory searching for ancient microbial fossil signs on Mars.',
    educationalFact: 'Perseverance is equipped with a drill that extracts core samples of Martian rocks and seals them in pristine titanium tubes for future return to Earth.',
    additionalFact: 'The rover also carried Ingenuity, the 1.8-kg coaxial helicopter that proved controlled, powered flight is possible in Mars’ ultra-thin atmosphere.',
    learningTopic: 'Martian Astrobiology & Robotic Exploration',
    viewBox: '0 0 600 450',
    regions: [
      // Martian Sky & Jezero Crater Delta Rim
      {
        id: 'per-sky-rim',
        name: 'Jezero Delta Rim & Salmon Sky',
        path: 'M 0,0 L 600,0 L 600,240 L 460,210 L 320,230 L 160,205 L 0,240 Z',
      },
      // SuperCam Remote Sensing Mast
      {
        id: 'per-mast-head',
        name: 'SuperCam Laser & Mastcam-Z Head',
        path: 'M 215,95 L 265,95 L 260,140 L 220,140 Z',
      },
      // Mast Support Tube
      {
        id: 'per-mast-neck',
        name: 'Carbon Fiber Remote Sensing Mast',
        path: 'M 235,140 L 245,140 L 245,210 L 235,210 Z',
      },
      // Main Rover Equipment Deck Body
      {
        id: 'per-rover-deck',
        name: 'Avionics Chassis Warm Electronics Box',
        path: 'M 210,210 L 410,210 L 430,270 L 190,270 Z',
      },
      // Nuclear MMRTG Generator (Aft)
      {
        id: 'per-rtg-generator',
        name: 'Multi-Mission Radioisotope Generator (MMRTG)',
        path: 'M 390,200 L 440,200 L 450,245 L 395,245 Z',
      },
      // Robotic Arm Turret
      {
        id: 'per-robotic-arm',
        name: '2-Meter Robotic Sampling Arm',
        path: 'M 195,235 L 140,250 L 135,290 L 180,275 Z',
      },
      // Front Left Rocker Wheel
      {
        id: 'per-wheel-fl',
        name: 'Front Cleated Aluminum Wheel',
        path: 'M 140,305 C 140,285 160,275 180,285 C 190,300 190,325 175,340 C 155,345 140,330 140,305 Z',
      },
      // Middle Rocker Wheel
      {
        id: 'per-wheel-mid',
        name: 'Middle Bogie Wheel',
        path: 'M 270,310 C 270,290 290,280 310,290 C 320,305 320,330 305,345 C 285,350 270,335 270,310 Z',
      },
      // Rear Drive Wheel
      {
        id: 'per-wheel-rr',
        name: 'Rear Drive Wheel',
        path: 'M 385,310 C 385,290 405,280 425,290 C 435,305 435,330 420,345 C 400,350 385,335 385,310 Z',
      },
      // Martian Regolith Dunes Ground
      {
        id: 'per-ground',
        name: 'Martian Basaltic Sand & Pebbles',
        path: 'M 0,335 Q 200,320 400,340 T 600,330 L 600,450 L 0,450 Z',
      },
    ],
  },
  {
    id: 'mars-base-021',
    title: 'Outpost Alpha — Future Mars Base',
    category: 'mars-alien-worlds',
    difficulty: 'Explorer',
    description: 'Color a pressurized planetary research settlement with bio-domes, solar energy farms, and airlocks.',
    educationalFact: 'A real Mars habitat will likely be sheltered by a layer of Martian regolith or 3D-printed sulfur concrete to shield astronauts from cosmic rays and solar radiation.',
    additionalFact: 'Mars has an atmosphere containing 95% carbon dioxide, so bases will use MOXIE-like oxygen extractors to generate breathable air.',
    learningTopic: 'Planetary Architecture & Off-World ISRU',
    viewBox: '0 0 600 450',
    regions: [
      // Martian Sky Background
      {
        id: 'base-sky',
        name: 'Butterscotch Martian Sky',
        path: 'M 0,0 L 600,0 L 600,280 L 0,280 Z',
      },
      // Primary Geodesic Habitat Bio-Dome
      {
        id: 'base-dome-main',
        name: 'Central Geodesic Habitat Biodome',
        path: 'M 200,280 C 200,165 340,165 340,280 Z',
      },
      // Main Dome Skylight Observation Portal
      {
        id: 'base-dome-window',
        name: 'Pressurized Skylight Portal',
        path: 'M 250,225 C 250,195 290,195 290,225 C 290,240 250,240 250,225 Z',
      },
      // Secondary Greenhouse Hydroponics Pod
      {
        id: 'base-dome-greenhouse',
        name: 'Agricultural Hydroponics Pod',
        path: 'M 350,280 C 350,210 440,210 440,280 Z',
      },
      // Interconnecting Pressurized Airlock Tunnel
      {
        id: 'base-airlock-tunnel',
        name: 'Hermetic Transfer Tunnel & Airlock',
        path: 'M 320,250 L 360,250 L 360,280 L 320,280 Z',
      },
      // Solar Photovoltaic Field Left
      {
        id: 'base-solar-array',
        name: 'Solar Panel Array Farm',
        path: 'M 80,245 L 170,245 L 180,280 L 70,280 Z',
      },
      // Deep Space Communications Tower
      {
        id: 'base-comm-tower',
        name: 'High-Gain Microwave Comms Tower',
        path: 'M 125,160 L 135,160 L 138,245 L 122,245 Z',
      },
      // Red Martian Sand Dunes
      {
        id: 'base-mars-ground',
        name: 'Iron-Oxide Martian Surface',
        path: 'M 0,280 L 600,280 L 600,450 L 0,450 Z',
      },
    ],
  },
  {
    id: 'exoplanet-system-022',
    title: 'TRAPPIST-1 Alien Exoplanets',
    category: 'mars-alien-worlds',
    difficulty: 'Medium',
    description: 'Color rocky alien exoplanets orbiting closely around a cool crimson red-dwarf star in the constellation Aquarius.',
    educationalFact: 'The TRAPPIST-1 system contains seven Earth-sized rocky planets, three of which reside inside the star’s habitable "Goldilocks Zone" where liquid water could exist!',
    additionalFact: 'All seven planets orbit so close together that if you stood on the surface of one planet, the neighboring worlds would appear larger than the full Moon in our sky.',
    learningTopic: 'Exoplanet Detection & Habitable Zones',
    viewBox: '0 0 600 450',
    regions: [
      // Deep Alien Space
      {
        id: 'exo-space',
        name: 'Interstellar Deep Space',
        path: 'M 0,0 L 600,0 L 600,450 L 0,450 Z',
      },
      // Ultra-Cool Red Dwarf Star
      {
        id: 'exo-host-star',
        name: 'TRAPPIST-1 Ultra-Cool Red Dwarf Star',
        path: 'M 0,80 C 80,80 120,150 120,225 C 120,300 80,370 0,370 Z',
      },
      // Alien Planet 1 Body
      {
        id: 'exo-planet-1',
        name: 'TRAPPIST-1e Rocky Exoplanet Globe',
        path: 'M 220,165 C 255,165 285,195 285,230 C 285,265 255,295 220,295 C 185,295 155,265 155,230 C 155,195 185,165 220,165 Z',
      },
      // Alien Planet 1 Continent
      {
        id: 'exo-p1-continent',
        name: 'Exo-Continent Exotic Flora Landmass',
        path: 'M 195,195 C 220,185 245,200 240,230 C 230,250 205,245 195,225 Z',
      },
      // Giant Ringed Exoplanet in Background
      {
        id: 'exo-ringed-planet',
        name: 'Ringed Outer Gas Planet Disc',
        path: 'M 400,120 C 445,120 480,155 480,200 C 480,245 445,280 400,280 C 355,280 320,245 320,200 C 320,155 355,120 400,120 Z',
      },
      // Exoplanet Rings
      {
        id: 'exo-rings',
        name: 'Alien Planetary Ring Belt',
        path: 'M 300,200 C 300,185 500,185 500,200 C 500,215 300,215 300,200 Z',
      },
      // Distant Alien Moon
      {
        id: 'exo-distant-moon',
        name: 'Volcanic Tidal Moon',
        path: 'M 505,100 C 518,100 528,110 528,122 C 528,135 518,145 505,145 C 492,145 482,135 482,122 C 482,110 492,100 505,100 Z',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CATEGORY 8: STARS AND SPACE MYSTERIES
  // --------------------------------------------------------------------------
  {
    id: 'black-hole-023',
    title: 'Supermassive Black Hole & Accretion Disk',
    category: 'stars-mysteries',
    difficulty: 'Explorer',
    description: 'Color the intense gravitational lensing, incandescent accretion disk, and pitch-black event horizon.',
    educationalFact: 'A black hole’s gravitational pull is so immense that inside the event horizon, the escape velocity exceeds the speed of light—meaning nothing, not even light, can escape.',
    additionalFact: 'In 2019, the Event Horizon Telescope captured the first-ever direct image of a black hole’s shadow in the galaxy Messier 87, 55 million light-years away.',
    learningTopic: 'General Relativity & Singularity Physics',
    viewBox: '0 0 600 450',
    regions: [
      // Cosmic Deep Space Void
      {
        id: 'bh-space-void',
        name: 'Spacetime Curvature Void',
        path: 'M 0,0 L 600,0 L 600,450 L 0,450 Z',
      },
      // Upper Gravitationally Lensed Light Halo
      {
        id: 'bh-lensed-halo-top',
        name: 'Upper Gravitational Lensed Ring',
        path: 'M 180,225 C 180,135 420,135 420,225 C 380,165 220,165 180,225 Z',
      },
      // Outer Glowing Accretion Disk Left
      {
        id: 'bh-accretion-outer',
        name: 'Relativistic Accretion Disk (Outer Gas Flow)',
        path: 'M 80,225 C 80,185 220,165 300,165 C 380,165 520,185 520,225 C 520,265 380,285 300,285 C 220,285 80,265 80,225 Z',
      },
      // Inner Hot Plasma Accretion Ring
      {
        id: 'bh-accretion-inner',
        name: 'Innermost Stable Circular Orbit (ISCO)',
        path: 'M 160,225 C 160,195 240,185 300,185 C 360,185 440,195 440,225 C 440,255 360,265 300,265 C 240,265 160,255 160,225 Z',
      },
      // Photon Sphere Glowing Ring
      {
        id: 'bh-photon-sphere',
        name: 'Photon Sphere Ring',
        path: 'M 235,225 C 235,190 365,190 365,225 C 365,260 235,260 235,225 Z',
      },
      // Pure Black Event Horizon (The Shadow)
      {
        id: 'bh-event-horizon',
        name: 'Event Horizon Shadow (Singularity)',
        path: 'M 245,225 C 245,195 355,195 355,225 C 355,255 245,255 245,225 Z',
      },
      // Relativistic Polar Jet Top
      {
        id: 'bh-jet-top',
        name: 'North Relativistic Plasma Jet',
        path: 'M 292,165 L 308,165 L 320,30 L 280,30 Z',
      },
      // Relativistic Polar Jet Bottom
      {
        id: 'bh-jet-bottom',
        name: 'South Relativistic Plasma Jet',
        path: 'M 292,285 L 308,285 L 320,420 L 280,420 Z',
      },
    ],
  },
  {
    id: 'comet-shooting-star-024',
    title: 'Great Comet & Meteor Shower Night',
    category: 'stars-mysteries',
    difficulty: 'Easy',
    description: 'Color a glowing celestial visitor with an icy nucleus, luminous ion gas tail, and streaking meteors.',
    educationalFact: 'Comets are "dirty snowballs" of frozen water, methane, and ammonia mixed with rock and dust left over from the formation of the Solar System 4.6 billion years ago.',
    additionalFact: 'A comet always has two tails: a straight blue ion tail pushed directly away from the Sun by solar wind, and a gently curved white dust tail.',
    learningTopic: 'Small Solar System Bodies & Debris Dynamics',
    viewBox: '0 0 600 450',
    regions: [
      // Deep Night Sky Backdrop
      {
        id: 'com-sky',
        name: 'Starlit Night Sky',
        path: 'M 0,0 L 600,0 L 600,450 L 0,450 Z',
      },
      // Comet Icy Nucleus Core
      {
        id: 'com-nucleus',
        name: 'Icy Comet Nucleus Core',
        path: 'M 440,110 C 455,100 475,110 470,130 C 460,145 435,140 430,125 C 430,118 435,112 440,110 Z',
      },
      // Glowing Coma Gas Cloud
      {
        id: 'com-coma',
        name: 'Sublimating Gas Coma Envelope',
        path: 'M 410,105 C 440,75 490,90 495,130 C 495,170 445,185 410,150 C 395,135 395,120 410,105 Z',
      },
      // Straight Ion Gas Tail (Blue Glow)
      {
        id: 'com-ion-tail',
        name: 'Straight Ionized Gas Tail',
        path: 'M 430,120 L 60,30 L 40,45 L 415,135 Z',
      },
      // Broad Curved Dust Tail
      {
        id: 'com-dust-tail',
        name: 'Broad Curved Solar Radiation Dust Tail',
        path: 'M 420,135 C 310,180 180,260 50,310 C 130,240 280,180 405,140 Z',
      },
      // Meteor 1 (Shooting Star Streak)
      {
        id: 'com-meteor-1',
        name: 'Perseid Meteor Ionization Trail 1',
        path: 'M 540,240 L 460,300 L 465,305 L 545,245 Z',
      },
      // Meteor 2 (Shooting Star Streak)
      {
        id: 'com-meteor-2',
        name: 'Perseid Meteor Ionization Trail 2',
        path: 'M 320,340 L 250,390 L 255,395 L 325,345 Z',
      },
    ],
  },
];
