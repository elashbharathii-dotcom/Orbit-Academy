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
    itemCount: 6,
  },
  {
    id: 'earth-features',
    title: 'Category 2: Earth & Its Features',
    shortTitle: 'Earth & Features',
    description: 'Color our living Blue Marble from orbit, its continents, geological layers, and shimmering auroras.',
    icon: '🌍',
    accentColor: '#38BDF8',
    badgeTone: 'cyan',
    itemCount: 4,
  },
  {
    id: 'moon-exploration',
    title: 'Category 3: Moon & Exploration',
    shortTitle: 'Moon & Exploration',
    description: 'Journey to Earth’s natural satellite: impact craters, historic Apollo landing sites, and lunar rovers.',
    icon: '🌕',
    accentColor: '#94A3B8',
    badgeTone: 'cyan',
    itemCount: 4,
  },
  {
    id: 'astronauts-space-travel',
    title: 'Category 4: Astronauts & Space Travel',
    shortTitle: 'Astronauts & Travel',
    description: 'Spacewalkers floating in microgravity, pressurized EVA suits, the Space Shuttle, and the ISS.',
    icon: '👨‍🚀',
    accentColor: '#10B981',
    badgeTone: 'emerald',
    itemCount: 4,
  },
  {
    id: 'galaxies-nebulae',
    title: 'Category 5: Galaxies & Nebulae',
    shortTitle: 'Galaxies & Nebulae',
    description: 'Vast cosmic nurseries, swirling spiral arms of the Milky Way, and majestic pillars of ionized gas.',
    icon: '🌌',
    accentColor: '#A855F7',
    badgeTone: 'violet',
    itemCount: 3,
  },
  {
    id: 'rockets-satellites',
    title: 'Category 6: Rockets & Satellites',
    shortTitle: 'Rockets & Satellites',
    description: 'Heavy-lift moon rockets, deep-space observatories like the James Webb Telescope, and orbital probes.',
    icon: '🚀',
    accentColor: '#EF4444',
    badgeTone: 'amber',
    itemCount: 4,
  },
  {
    id: 'mars-alien-worlds',
    title: 'Category 7: Mars & Alien Worlds',
    shortTitle: 'Mars & Alien Worlds',
    description: 'The Red Planet, Perseverance exploration rover, human research biodomes, and exotic exoplanets.',
    icon: '🔴',
    accentColor: '#F87171',
    badgeTone: 'amber',
    itemCount: 4,
  },
  {
    id: 'stars-mysteries',
    title: 'Category 8: Stars & Space Mysteries',
    shortTitle: 'Stars & Mysteries',
    description: 'Supermassive black holes, glowing accretion disks, streaking comets, and meteor showers.',
    icon: '✨',
    accentColor: '#38BDF8',
    badgeTone: 'cyan',
    itemCount: 3,
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
// 3. COLORING ARTWORKS (INCLUDING 8 SIGNATURE COLORABLE PLATES)
// ============================================================================

export const COLORING_ARTWORKS: ColoringArtwork[] = [
  // --------------------------------------------------------------------------
  // CATEGORY 1: SOLAR SYSTEM
  // --------------------------------------------------------------------------
  {
    id: 'solar-system-flagship',
    title: 'The Solar System & Cheerful Orbiting Planets',
    category: 'solar-system',
    difficulty: 'Easy',
    description: 'Color a giant, smiling Sun at the center orbited by cheerful planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune) drifting in circular orbits.',
    educationalFact: 'The Sun accounts for 99.86% of all mass in the Solar System, and its gravity keeps all eight planets locked into their elliptical racetracks.',
    additionalFact: 'All the planets in our solar system could easily fit inside the space between Earth and the Moon with room to spare!',
    learningTopic: 'Orbital Mechanics & Planetary Family',
    viewBox: '0 0 500 280',
    underlaySvg: `
      <path d="M 60,190 C 80,100 240,40 400,60 C 470,70 510,120 490,170 C 470,220 350,260 210,250 C 130,245 80,220 60,190" stroke="#0F172A" stroke-width="2.5" stroke-dasharray="4 4" fill="none" />
      <path d="M 90,190 C 120,120 250,75 380,95 C 440,105 470,145 450,185 C 430,225 320,245 220,235 C 150,230 105,210 90,190" stroke="#0F172A" stroke-width="2" stroke-dasharray="3 3" fill="none" />
      <path d="M 120,190 C 140,140 230,105 320,120 C 370,130 395,160 380,190 C 365,220 280,235 210,225" stroke="#0F172A" stroke-width="2" stroke-dasharray="3 3" fill="none" />
      <circle cx="130" cy="100" r="2" fill="#0F172A" />
      <circle cx="480" cy="120" r="2.5" fill="#0F172A" />
      <circle cx="360" cy="70" r="2" fill="#0F172A" />
      <circle cx="160" cy="230" r="2" fill="#0F172A" />
    `,
    overlaySvg: `
      <circle cx="68" cy="188" r="4.5" fill="#0F172A" />
      <circle cx="88" cy="188" r="4.5" fill="#0F172A" />
      <path d="M 68,202 Q 78,214 88,202" stroke="#0F172A" stroke-width="3" stroke-linecap="round" fill="none" />
      <circle cx="162" cy="153" r="1.5" fill="#0F172A" />
      <circle cx="168" cy="153" r="1.5" fill="#0F172A" />
      <path d="M 163,158 Q 165,161 167,158" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" fill="none" />
      <path d="M 205,123 Q 215,120 225,126" stroke="#0F172A" stroke-width="1.5" fill="none" />
      <circle cx="260" cy="103" r="2" fill="#0F172A" />
      <circle cx="270" cy="103" r="2" fill="#0F172A" />
      <path d="M 261,111 Q 265,115 269,111" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none" />
      <circle cx="312" cy="93" r="1.5" fill="#0F172A" />
      <circle cx="318" cy="93" r="1.5" fill="#0F172A" />
      <path d="M 313,99 Q 315,102 317,99" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" fill="none" />
      <circle cx="367" cy="113" r="3" fill="#0F172A" />
      <circle cx="383" cy="113" r="3" fill="#0F172A" />
      <path d="M 370,121 Q 375,126 380,121" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none" />
      <circle cx="419" cy="166" r="2.5" fill="#0F172A" />
      <circle cx="431" cy="166" r="2.5" fill="#0F172A" />
      <path d="M 420,174 Q 425,179 430,174" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none" />
      <circle cx="326" cy="223" r="2" fill="#0F172A" />
      <circle cx="334" cy="223" r="2" fill="#0F172A" />
      <path d="M 327,229 Q 330,233 333,229" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" fill="none" />
      <circle cx="227" cy="243" r="1.5" fill="#0F172A" />
      <circle cx="233" cy="243" r="1.5" fill="#0F172A" />
    `,
    regions: [
      {
        id: 'ss-sun-rays',
        name: 'Radiant Solar Corona Rays',
        path: 'M 65,130 L 72,110 L 80,130 L 98,118 L 100,138 L 120,132 L 115,152 L 135,155 L 125,172 L 142,182 L 128,195 L 140,212 L 122,218 L 130,238 L 110,238 L 112,258 L 95,250 L 90,268 L 78,252 L 68,268 L 62,248 L 45,258 L 48,238 L 30,240 L 38,222 L 20,215 L 32,200 L 18,185 L 32,175 L 22,158 L 40,155 L 35,135 L 55,140 Z',
      },
      {
        id: 'ss-sun-core',
        name: 'Smiling Sun Face & Core',
        path: 'M 78,153 C 101,153 120,172 120,195 C 120,218 101,237 78,237 C 55,237 36,218 36,195 C 36,172 55,153 78,153 Z',
      },
      {
        id: 'ss-sun-cheek-l',
        name: 'Sun Rosy Cheek Left',
        path: 'M 60,196 C 62,196 64,197 64,198 C 64,199 62,200 60,200 C 58,200 56,199 56,198 C 56,197 58,196 60,196 Z',
      },
      {
        id: 'ss-sun-cheek-r',
        name: 'Sun Rosy Cheek Right',
        path: 'M 96,196 C 98,196 100,197 100,198 C 100,199 98,200 96,200 C 94,200 92,199 92,198 C 92,197 94,196 96,196 Z',
      },
      {
        id: 'ss-mercury',
        name: 'Mercury (Innermost Rocky Planet)',
        path: 'M 165,145 C 170,145 175,150 175,155 C 175,160 170,165 165,165 C 160,165 155,160 155,155 C 155,150 160,145 165,145 Z',
      },
      {
        id: 'ss-venus',
        name: 'Venus (Sulfuric Atmosphere World)',
        path: 'M 215,112 C 222,112 228,118 228,125 C 228,132 222,138 215,138 C 208,138 202,132 202,125 C 202,118 208,112 215,112 Z',
      },
      {
        id: 'ss-earth-body',
        name: 'Earth (Living Blue Ocean Planet)',
        path: 'M 265,89 C 274,89 281,96 281,105 C 281,114 274,121 265,121 C 256,121 249,96 249,105 C 249,96 256,89 265,89 Z',
      },
      {
        id: 'ss-earth-continent',
        name: 'Earth Continent Landmass',
        path: 'M 255,100 Q 262,94 270,98 Q 275,108 268,115 Z',
      },
      {
        id: 'ss-mars',
        name: 'Mars (Red Planet with Iron Oxide)',
        path: 'M 315,83 C 322,83 327,88 327,95 C 327,102 322,107 315,107 C 308,107 303,102 303,95 C 303,88 308,83 315,83 Z',
      },
      {
        id: 'ss-jupiter-body',
        name: 'Jupiter (Giant Gas World)',
        path: 'M 375,91 C 388,91 399,102 399,115 C 399,128 388,139 375,139 C 362,139 351,128 351,115 C 351,102 362,91 375,91 Z',
      },
      {
        id: 'ss-jupiter-belt',
        name: 'Jupiter Atmospheric Cloud Belt',
        path: 'M 353,105 Q 375,110 397,105 L 398,125 Q 375,120 352,125 Z',
      },
      {
        id: 'ss-saturn-back-ring',
        name: 'Saturn Back Ring Arc',
        path: 'M 390,162 C 390,148 460,148 460,162 L 460,166 C 460,152 390,152 390,166 Z',
      },
      {
        id: 'ss-saturn-globe',
        name: 'Saturn Golden Globe',
        path: 'M 425,150 C 436,150 445,159 445,170 C 445,181 436,190 425,190 C 414,190 405,181 405,170 C 405,159 414,150 425,150 Z',
      },
      {
        id: 'ss-saturn-front-ring',
        name: 'Saturn Front Giant Ring Belt',
        path: 'M 385,168 C 385,188 465,188 465,168 C 465,162 385,162 385,168 Z',
      },
      {
        id: 'ss-uranus',
        name: 'Uranus (Aquamarine Ice Giant)',
        path: 'M 330,211 C 338,211 344,217 344,225 C 344,233 338,239 330,239 C 322,239 316,233 316,225 C 316,217 322,211 330,211 Z',
      },
      {
        id: 'ss-neptune',
        name: 'Neptune (Deep Cobalt Giant)',
        path: 'M 230,232 C 237,232 243,238 243,245 C 243,252 237,258 230,258 C 223,258 217,252 217,245 C 217,238 223,232 230,232 Z',
      },
      {
        id: 'ss-star-1',
        name: 'Twinkling Star Alpha',
        path: 'M 175,65 L 178,55 L 181,65 L 191,68 L 181,71 L 178,81 L 175,71 L 165,68 Z',
      },
      {
        id: 'ss-star-2',
        name: 'Twinkling Star Beta',
        path: 'M 445,65 L 447,58 L 449,65 L 456,67 L 449,69 L 447,76 L 445,69 L 438,67 Z',
      },
    ],
  },
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
      {
        id: 'sat-ring-a-top',
        name: 'Outer A Ring (Top Arc)',
        path: 'M 70,225 C 70,165 170,120 300,120 C 430,120 530,165 530,225 C 500,210 410,185 300,185 C 190,185 100,210 70,225 Z',
      },
      {
        id: 'sat-cassini-gap',
        name: 'Cassini Division Gap',
        path: 'M 95,225 C 115,198 198,172 300,172 C 402,172 485,198 505,225 C 475,208 395,185 300,185 C 205,185 125,208 95,225 Z',
      },
      {
        id: 'sat-ring-b-top',
        name: 'Main B Ring (Top Arc)',
        path: 'M 125,225 C 145,190 215,165 300,165 C 385,165 455,190 475,225 C 445,205 380,185 300,185 C 220,185 155,205 125,225 Z',
      },
      {
        id: 'sat-north-pole',
        name: 'North Polar Hexagon',
        path: 'M 255,175 C 270,160 330,160 345,175 C 335,190 265,190 255,175 Z',
      },
      {
        id: 'sat-equator',
        name: 'Equatorial Atmosphere Zone',
        path: 'M 220,235 C 240,220 360,220 380,235 C 375,255 225,255 220,235 Z',
      },
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
      {
        id: 'sun-flare-1',
        name: 'Top-Left Prominence Loop',
        path: 'M 190,120 C 160,80 170,40 210,60 C 230,75 220,110 210,125 Z',
      },
      {
        id: 'sun-corona-rim',
        name: 'Outer Coronal Atmosphere',
        path: 'M 300,85 C 380,85 445,150 445,230 C 445,310 380,375 300,375 C 220,375 155,310 155,230 C 155,150 220,85 300,85 Z',
      },
      {
        id: 'sun-photosphere',
        name: 'Photosphere Surface',
        path: 'M 300,145 C 347,145 385,183 385,230 C 385,277 347,315 300,315 C 253,315 215,277 215,230 C 215,183 253,145 300,145 Z',
      },
      {
        id: 'sun-core',
        name: 'Nuclear Fusion Core',
        path: 'M 300,185 C 325,185 345,205 345,230 C 345,255 325,275 300,275 C 275,275 255,255 255,230 C 255,205 275,185 300,185 Z',
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
      {
        id: 'earth-ocean-basin',
        name: 'Global Ocean Basins',
        path: 'M 300,75 C 385,75 455,145 455,230 C 455,315 385,385 300,385 C 215,385 145,315 145,230 C 145,145 215,75 300,75 Z',
      },
      {
        id: 'earth-north-america',
        name: 'North America Landmass',
        path: 'M 215,120 C 245,110 275,130 265,165 C 245,185 220,180 205,150 C 200,135 210,125 215,120 Z',
      },
      {
        id: 'earth-eurasia',
        name: 'Eurasia Landmass',
        path: 'M 310,115 C 360,105 410,130 415,170 C 390,195 345,185 320,165 C 305,145 305,125 310,115 Z',
      },
      {
        id: 'earth-cloud-storm-1',
        name: 'Atlantic Cyclone Cloud Band',
        path: 'M 275,145 C 305,135 330,150 315,165 C 295,170 270,160 275,145 Z',
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
      {
        id: 'jup-north-polar',
        name: 'North Polar Haze Zone',
        path: 'M 235,90 C 275,75 325,75 365,90 C 355,120 245,120 235,90 Z',
      },
      {
        id: 'jup-equator-zone',
        name: 'Equatorial Zone (EZ)',
        path: 'M 175,185 C 255,175 345,175 425,185 C 430,225 170,225 175,185 Z',
      },
      {
        id: 'jup-grs-outer',
        name: 'Great Red Spot Outer Rim',
        path: 'M 335,230 C 375,225 400,240 395,260 C 390,280 345,285 330,270 C 320,255 325,235 335,230 Z',
      },
      {
        id: 'jup-grs-core',
        name: 'Great Red Spot Eye & Core',
        path: 'M 345,242 C 365,238 382,248 380,258 C 375,270 352,272 342,264 C 338,255 340,245 345,242 Z',
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
      {
        id: 'sys-sun',
        name: 'Central Sol (Sun)',
        path: 'M 0,150 C 60,150 90,190 90,225 C 90,260 60,300 0,300 Z',
      },
      {
        id: 'sys-jupiter',
        name: 'Jupiter Giant Globe',
        path: 'M 290,225 C 290,195 340,195 340,225 C 340,255 290,255 290,225 Z',
      },
      {
        id: 'sys-saturn-ring',
        name: 'Saturn Ring System',
        path: 'M 365,225 C 365,216 433,216 433,225 C 433,234 365,234 365,225 Z',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CATEGORY 2: EARTH AND ITS FEATURES
  // --------------------------------------------------------------------------
  {
    id: 'earth-features-flagship',
    title: 'Earth & Orbiting Crescent Moon',
    category: 'earth-features',
    difficulty: 'Easy',
    description: 'Color our giant round Earth with visible playful continents, swirling clouds, a tiny orbiting satellite, and a cozy crescent moon waving in the background.',
    educationalFact: 'From space, Earth glows with a vibrant blue aura created by Rayleigh scattering of sunlight through atmospheric gases.',
    additionalFact: 'Earth is the densest major planet in our solar system, with a metallic core of iron and nickel wrapped in a silicate mantle.',
    learningTopic: 'Planetary Biosphere & Atmosphere',
    viewBox: '0 0 500 280',
    underlaySvg: `
      <circle cx="260" cy="140" r="102" stroke="#0F172A" stroke-width="1.5" stroke-dasharray="5 4" fill="none" />
      <path d="M 140,55 L 143,47 L 146,55 L 154,58 L 146,61 L 143,69 L 140,61 L 132,58 Z" fill="#0F172A" />
      <path d="M 370,195 L 372,189 L 374,195 L 380,197 L 374,199 L 372,205 L 370,199 L 364,197 Z" fill="#0F172A" />
      <circle cx="160" cy="110" r="2.5" fill="#0F172A" />
      <circle cx="180" cy="170" r="2" fill="#0F172A" />
      <circle cx="410" cy="135" r="2" fill="#0F172A" />
    `,
    overlaySvg: `
      <path d="M 185,130 C 210,120 240,125 270,115 C 295,105 320,120 340,125" stroke="#0F172A" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M 210,185 C 240,175 280,185 320,170" stroke="#0F172A" stroke-width="3" stroke-linecap="round" fill="none" />
      <line x1="400" y1="59" x2="400" y2="71" stroke="#0F172A" stroke-width="1.5" />
      <line x1="440" y1="59" x2="440" y2="71" stroke="#0F172A" stroke-width="1.5" />
      <circle cx="420" cy="65" r="3" fill="#0F172A" />
      <circle cx="437" cy="201" r="1.5" fill="#0F172A" />
    `,
    regions: [
      {
        id: 'ef-globe-ocean',
        name: 'Earth Ocean Globe Basin',
        path: 'M 260,45 C 312,45 355,88 355,140 C 355,192 312,235 260,235 C 208,235 165,192 165,140 C 165,88 208,45 260,45 Z',
      },
      {
        id: 'ef-continent-na',
        name: 'North American Continents',
        path: 'M 195,105 C 210,85 230,75 260,80 C 285,85 305,105 300,130 C 295,155 275,165 255,155 C 235,145 230,165 215,155 C 200,145 185,125 195,105 Z',
      },
      {
        id: 'ef-continent-sa',
        name: 'South American Continents',
        path: 'M 230,170 C 245,165 265,175 275,195 C 265,215 240,220 225,205 C 215,195 220,175 230,170 Z',
      },
      {
        id: 'ef-continent-eurasia',
        name: 'Eurasian Landmass',
        path: 'M 285,100 C 305,95 330,110 335,130 C 325,150 305,145 295,125 Z',
      },
      {
        id: 'ef-cloud-upper',
        name: 'Upper Trade Wind Cloud Swirl',
        path: 'M 185,130 C 210,120 240,125 270,115 C 295,105 320,120 340,125 L 340,130 C 320,125 295,110 270,120 C 240,130 210,125 185,135 Z',
      },
      {
        id: 'ef-cloud-lower',
        name: 'Southern Hemisphere Cloud Swirl',
        path: 'M 210,185 C 240,175 280,185 320,170 L 320,175 C 280,190 240,180 210,190 Z',
      },
      {
        id: 'ef-crescent-moon',
        name: 'Smiling Cozy Crescent Moon',
        path: 'M 447,180 C 437,180 427,190 427,203 C 427,216 437,226 450,226 C 441,222 435,213 435,203 C 435,193 440,184 447,180 Z',
      },
      {
        id: 'ef-satellite-body',
        name: 'Orbiting Satellite Chassis',
        path: 'M 410,57 L 430,57 L 430,73 L 410,73 Z',
      },
      {
        id: 'ef-satellite-wing-l',
        name: 'Satellite Solar Wing Left',
        path: 'M 392,59 L 408,59 L 408,71 L 392,71 Z',
      },
      {
        id: 'ef-satellite-wing-r',
        name: 'Satellite Solar Wing Right',
        path: 'M 432,59 L 448,59 L 448,71 L 432,71 Z',
      },
      {
        id: 'ef-star-1',
        name: 'Twinkling Star Alpha',
        path: 'M 140,55 L 143,47 L 146,55 L 154,58 L 146,61 L 143,69 L 140,61 L 132,58 Z',
      },
    ],
  },
  {
    id: 'earth-space-006',
    title: 'Earth from Orbit — The Blue Horizon',
    category: 'earth-features',
    difficulty: 'Easy',
    description: 'Color the curved orbital horizon of Earth seen from high altitude, crowned with vibrant twilight glow.',
    educationalFact: 'Astronauts who view Earth from orbit often describe an intense cognitive shift known as the "Overview Effect".',
    additionalFact: 'Earth’s atmosphere is so thin relative to the planet’s size that it resembles the skin of an apple.',
    learningTopic: 'Orbital Perspective & Atmosphere',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'eorb-atmo-rim',
        name: 'Mesosphere / Ionosphere Halo',
        path: 'M 0,210 C 150,150 450,150 600,210 C 600,225 450,165 0,225 Z',
      },
      {
        id: 'eorb-ocean',
        name: 'Pacific Ocean Expanse',
        path: 'M 0,240 C 150,180 450,180 600,240 L 600,450 L 0,450 Z',
      },
      {
        id: 'eorb-continent',
        name: 'Continental Coastal Margin',
        path: 'M 180,310 C 230,280 290,295 310,340 C 290,380 230,375 200,345 Z',
      },
    ],
  },
  {
    id: 'earth-layers-007',
    title: 'Earth’s Geological Layers Cross-Section',
    category: 'earth-features',
    difficulty: 'Medium',
    description: 'Color the nested planetary layers from the rocky surface crust down to the solid iron-nickel inner core.',
    educationalFact: 'Earth’s inner core is a solid sphere of iron and nickel nearly as hot as the surface of the Sun!',
    additionalFact: 'The swirling liquid iron in the outer core generates Earth’s powerful geomagnetic field.',
    learningTopic: 'Geophysics & Planetary Differentiation',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'elayer-crust',
        name: 'Lithosphere & Crust',
        path: 'M 300,70 C 385,70 455,140 455,225 C 455,310 385,380 300,380 C 215,380 145,310 145,225 C 145,140 215,70 300,70 Z',
      },
      {
        id: 'elayer-upper-mantle',
        name: 'Upper Mantle (Convection Zone)',
        path: 'M 300,95 C 370,95 430,155 430,225 C 430,295 370,355 300,355 C 230,355 170,295 170,225 C 170,155 230,95 300,95 Z',
      },
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
    educationalFact: 'Auroras occur when charged particles from solar coronal mass ejections collide with oxygen and nitrogen atoms.',
    additionalFact: 'Green auroral light is emitted by excited oxygen atoms at 100-300 km altitude.',
    learningTopic: 'Space Weather & Magnetospheric Physics',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'aur-ribbon-mid',
        name: 'Main Oxygen Emerald Ribbon',
        path: 'M 0,130 C 120,110 220,170 320,130 C 420,90 500,150 600,130 L 600,190 C 510,210 420,160 310,200 C 200,230 110,180 0,200 Z',
      },
      {
        id: 'aur-mountain-l',
        name: 'Snowy Alpine Peak Left',
        path: 'M 0,330 L 110,240 L 190,320 L 260,250 L 330,340 L 0,340 Z',
      },
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
    id: 'moon-exploration-flagship',
    title: 'Moon Exploration & Smiling Rover',
    category: 'moon-exploration',
    difficulty: 'Easy',
    description: 'Color the heavily cratered Moon surface with a smiling Lunar Rover, an American/space exploration flag planted on a crater, and astronaut footprints.',
    educationalFact: 'Because the Moon has no atmosphere or wind, astronaut footprints left over 50 years ago remain completely pristine.',
    additionalFact: 'The Moon is in tidal lock with Earth, meaning the exact same face always points toward us!',
    learningTopic: 'Lunar Surface Exploration & Robotics',
    viewBox: '0 0 500 280',
    underlaySvg: `
      <path d="M 380,60 L 382,53 L 384,60 L 391,62 L 384,64 L 382,71 L 380,64 L 373,62 Z" fill="#0F172A" />
      <path d="M 450,110 L 452,105 L 454,110 L 459,112 L 454,114 L 452,119 L 450,114 L 445,112 Z" fill="#0F172A" />
      <circle cx="140" cy="70" r="2" fill="#0F172A" />
    `,
    overlaySvg: `
      <circle cx="240" cy="90" r="10" stroke="#0F172A" stroke-width="1.5" stroke-dasharray="2 2" fill="none" />
      <circle cx="280" cy="145" r="12" stroke="#0F172A" stroke-width="1.5" stroke-dasharray="2 2" fill="none" />
      <circle cx="356" cy="196" r="2.5" fill="#0F172A" />
      <circle cx="368" cy="196" r="2.5" fill="#0F172A" />
      <path d="M 358,202 Q 362,206 366,202" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none" />
      <line x1="382" y1="179" x2="376" y2="187" stroke="#0F172A" stroke-width="2" />
      <circle cx="348" cy="212" r="4" fill="#0F172A" />
      <circle cx="364" cy="212" r="4" fill="#0F172A" />
      <circle cx="380" cy="212" r="4" fill="#0F172A" />
      <circle cx="396" cy="212" r="4" fill="#0F172A" />
      <line x1="440" y1="180" x2="440" y2="225" stroke="#0F172A" stroke-width="2.5" />
      <circle cx="456" cy="195" r="5" stroke="#0F172A" stroke-width="1.5" fill="none" />
      <ellipse cx="456" cy="195" rx="8" ry="2.5" stroke="#0F172A" stroke-width="1.5" fill="none" />
    `,
    regions: [
      {
        id: 'me-moon-body',
        name: 'Cratered Moon Globe',
        path: 'M 265,40 C 306,40 340,74 340,115 C 340,156 306,190 265,190 C 224,190 190,156 190,115 C 190,74 224,40 265,40 Z',
      },
      {
        id: 'me-crater-1',
        name: 'Lunar Impact Crater Alpha',
        path: 'M 240,90 C 248,90 256,98 256,106 C 256,114 248,122 240,122 C 232,122 224,114 224,106 C 224,98 232,90 240,90 Z',
      },
      {
        id: 'me-crater-2',
        name: 'Lunar Impact Crater Beta',
        path: 'M 290,95 C 296,95 302,101 302,107 C 302,113 296,119 290,119 C 284,119 278,113 278,107 C 278,101 284,95 290,95 Z',
      },
      {
        id: 'me-crater-3',
        name: 'Lunar Impact Crater Gamma',
        path: 'M 280,145 C 290,145 298,153 298,163 C 298,173 290,181 280,181 C 270,181 262,173 262,163 C 262,153 270,145 280,145 Z',
      },
      {
        id: 'me-lunar-ground',
        name: 'Lunar Regolith Surface Ground',
        path: 'M 0,230 Q 150,215 300,230 T 500,220 L 500,280 L 0,280 Z',
      },
      {
        id: 'me-rover-chassis',
        name: 'Smiling Lunar Rover Chassis',
        path: 'M 342,187 L 398,187 L 398,207 L 342,207 Z',
      },
      {
        id: 'me-rover-antenna',
        name: 'High-Gain Mesh Umbrella Antenna',
        path: 'M 382,173 C 388,167 398,171 396,183 C 392,185 384,183 382,173 Z',
      },
      {
        id: 'me-rover-wheel-1',
        name: 'Front Wire Mesh Wheel',
        path: 'M 348,202 C 354,202 358,206 358,212 C 358,218 354,222 348,222 C 342,222 338,218 338,212 C 338,206 342,202 348,202 Z',
      },
      {
        id: 'me-rover-wheel-2',
        name: 'Mid-Front Wire Mesh Wheel',
        path: 'M 364,202 C 370,202 374,206 374,212 C 374,218 370,222 364,222 C 358,222 354,218 354,212 C 354,206 358,202 364,202 Z',
      },
      {
        id: 'me-rover-wheel-3',
        name: 'Mid-Rear Wire Mesh Wheel',
        path: 'M 380,202 C 386,202 390,206 390,212 C 390,218 386,222 380,222 C 374,222 370,218 370,212 C 370,206 374,202 380,202 Z',
      },
      {
        id: 'me-rover-wheel-4',
        name: 'Rear Wire Mesh Wheel',
        path: 'M 396,202 C 402,202 406,206 406,212 C 406,218 402,222 396,222 C 390,222 386,218 386,212 C 386,206 390,202 396,202 Z',
      },
      {
        id: 'me-flag-banner',
        name: 'Exploration Flag Banner',
        path: 'M 440,180 L 475,180 L 468,195 L 475,210 L 440,210 Z',
      },
      {
        id: 'me-flag-emblem',
        name: 'Planet Emblem on Flag',
        path: 'M 456,190 C 459,190 461,192 461,195 C 461,198 459,200 456,200 C 453,200 451,198 451,195 C 451,192 453,190 456,190 Z',
      },
      {
        id: 'me-star-1',
        name: 'Twinkling Star Alpha',
        path: 'M 380,60 L 382,53 L 384,60 L 391,62 L 384,64 L 382,71 L 380,64 L 373,62 Z',
      },
    ],
  },
  {
    id: 'moon-full-009',
    title: 'Full Moon — Lunar Maria & Craters',
    category: 'moon-exploration',
    difficulty: 'Easy',
    description: 'Color the ancient basaltic lava seas, bright highlands, and radiant impact rays of Earth’s Moon.',
    educationalFact: 'The dark patches on the Moon called "maria" are vast basalt plains formed by ancient volcanic eruptions.',
    additionalFact: 'Because the Moon has no atmosphere, footprints can remain intact for millions of years.',
    learningTopic: 'Lunar Geology & Cratering Dynamics',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'moon-globe',
        name: 'Anorthosite Highland Crust',
        path: 'M 300,70 C 385,70 455,140 455,225 C 455,310 385,380 300,380 C 215,380 145,310 145,225 C 145,140 215,70 300,70 Z',
      },
      {
        id: 'moon-mare-imbrium',
        name: 'Mare Imbrium (Basalt Plain)',
        path: 'M 230,130 C 265,115 305,125 315,160 C 295,190 245,190 220,165 C 215,145 220,135 230,130 Z',
      },
      {
        id: 'moon-crater-tycho',
        name: 'Tycho Crater Impact Center',
        path: 'M 285,320 C 298,315 312,315 320,325 C 315,338 290,338 285,320 Z',
      },
    ],
  },
  {
    id: 'lunar-rover-010',
    title: 'Apollo Lunar Roving Vehicle (LRV)',
    category: 'moon-exploration',
    difficulty: 'Medium',
    description: 'Color the electric dune buggy that enabled astronauts to explore kilometers across the Moon’s rugged terrain.',
    educationalFact: 'The Lunar Roving Vehicle used woven zinc-coated steel wire mesh tires with titanium chevrons.',
    additionalFact: 'The Apollo 17 rover reached a top lunar speed of 18 km/h.',
    learningTopic: 'Extraterrestrial Mobility Engineering',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'lrv-chassis',
        name: 'Tubular Aluminum Chassis',
        path: 'M 150,255 L 430,255 L 420,285 L 160,285 Z',
      },
      {
        id: 'lrv-antenna-dish',
        name: 'High-Gain Communications Umbrella',
        path: 'M 210,135 C 230,115 285,115 305,135 C 285,155 230,155 210,135 Z',
      },
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
    educationalFact: 'On July 20, 1969, Apollo 11 astronauts became the first humans to touch another celestial body.',
    additionalFact: 'The descent stage remained on the Moon permanently as a launch platform.',
    learningTopic: 'Space Flight Architecture & Landing Dynamics',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'lem-ascent-cabin',
        name: 'Ascent Stage Pressurized Cabin',
        path: 'M 230,135 L 370,135 L 390,195 L 210,195 Z',
      },
      {
        id: 'lem-descent-stage',
        name: 'Descent Stage (Gold Foil Clad)',
        path: 'M 195,195 L 405,195 L 425,270 L 175,270 Z',
      },
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
    id: 'astronauts-travel-flagship',
    title: 'Cute Floating Spacewalker & Space Shuttle',
    category: 'astronauts-space-travel',
    difficulty: 'Easy',
    description: 'Color a cute astronaut floating happily in zero-gravity with a friendly smiling visor, waving glove, chunky spacesuit, and a drifting retro space shuttle.',
    educationalFact: 'In microgravity, astronauts float because they are in continuous freefall around Earth at 28,000 km/h!',
    additionalFact: 'Astronauts grow up to 5 cm taller in space because their spinal discs expand without Earth’s gravity compressing them.',
    learningTopic: 'Microgravity Physics & Human Spaceflight',
    viewBox: '0 0 500 280',
    underlaySvg: `
      <path d="M 285,45 L 288,38 L 291,45 L 298,47 L 291,49 L 288,56 L 285,49 L 278,47 Z" fill="#0F172A" />
      <path d="M 455,50 L 457,44 L 459,50 L 465,52 L 459,54 L 457,60 L 455,54 L 449,52 Z" fill="#0F172A" />
      <circle cx="300" cy="180" r="2" fill="#0F172A" />
    `,
    overlaySvg: `
      <circle cx="363" cy="103" r="3" fill="#0F172A" />
      <circle cx="377" cy="103" r="3" fill="#0F172A" />
      <path d="M 365,111 Q 370,116 375,111" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none" />
      <circle cx="357" cy="108" r="2" fill="#CBD5E1" />
      <circle cx="383" cy="108" r="2" fill="#CBD5E1" />
      <path d="M 352,143 C 335,137 322,125 325,110" stroke="#0F172A" stroke-width="8" stroke-linecap="round" fill="none" />
      <path d="M 388,143 C 402,150 412,160 415,173" stroke="#0F172A" stroke-width="8" stroke-linecap="round" fill="none" />
      <circle cx="366" cy="152" r="2" fill="#0F172A" />
      <circle cx="374" cy="152" r="2" fill="#0F172A" />
      <path d="M 447,200 L 437,199 L 435,207 L 445,208 Z" stroke="#0F172A" stroke-width="1.5" fill="none" />
      <circle cx="441" cy="204" r="1.5" fill="#0F172A" />
    `,
    regions: [
      {
        id: 'at-helmet-shell',
        name: 'Astronaut Helmet Shell',
        path: 'M 370,73 C 388,73 402,87 402,105 C 402,123 388,137 370,137 C 352,137 338,123 338,105 C 338,87 352,73 370,73 Z',
      },
      {
        id: 'at-visor',
        name: 'Clear Bubble Visor',
        path: 'M 350,91 C 350,83 358,77 370,77 C 382,77 390,83 390,91 C 390,107 382,119 370,119 C 358,119 350,107 350,91 Z',
      },
      {
        id: 'at-suit-torso',
        name: 'Pressurized Spacesuit Torso',
        path: 'M 352,135 C 348,145 350,170 355,180 L 385,180 C 390,170 392,145 388,135 Z',
      },
      {
        id: 'at-chest-pack',
        name: 'DCM Chest Life-Support Pack',
        path: 'M 360,145 L 380,145 L 380,160 L 360,160 Z',
      },
      {
        id: 'at-glove-waving',
        name: 'Waving Glove Left',
        path: 'M 325,110 C 330,110 334,114 334,119 C 334,124 330,128 325,128 C 320,128 316,124 316,119 C 316,114 320,110 325,110 Z',
      },
      {
        id: 'at-glove-right',
        name: 'Floating Glove Right',
        path: 'M 415,173 C 420,173 424,177 424,182 C 424,187 420,191 415,191 C 410,191 406,187 406,182 C 406,177 410,173 415,173 Z',
      },
      {
        id: 'at-shuttle-fuselage',
        name: 'Drifting Space Shuttle Body',
        path: 'M 460,205 C 450,193 410,191 390,195 L 385,215 C 410,219 450,217 460,205 Z',
      },
      {
        id: 'at-shuttle-wing',
        name: 'Space Shuttle Delta Wing',
        path: 'M 420,213 L 395,227 L 390,215 Z',
      },
      {
        id: 'at-star-1',
        name: 'Twinkling Star Alpha',
        path: 'M 285,45 L 288,38 L 291,45 L 298,47 L 291,49 L 288,56 L 285,49 L 278,47 Z',
      },
    ],
  },
  {
    id: 'astronaut-eva-012',
    title: 'Spacewalker — Astronaut EVA in Orbit',
    category: 'astronauts-space-travel',
    difficulty: 'Medium',
    description: 'Color a spacewalker floating freely outside the station, with Earth reflected in the gold-coated helmet visor.',
    educationalFact: 'Spacewalk helmets have a micro-thin layer of real 24-karat gold vapor-deposited onto the visor.',
    additionalFact: 'An Extravehicular Mobility Unit spacesuit acts as a miniature personal spacecraft.',
    learningTopic: 'Human Spaceflight & Life Support Systems',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'astro-helmet',
        name: 'Helmet Pressure Shell',
        path: 'M 250,90 C 250,55 350,55 350,90 C 365,115 365,145 350,165 C 335,175 265,175 250,165 C 235,145 235,115 250,90 Z',
      },
      {
        id: 'astro-visor',
        name: '24K Gold Sun Visor',
        path: 'M 265,95 C 280,82 320,82 335,95 C 348,110 348,135 335,145 C 320,155 280,155 265,145 C 252,135 252,110 265,95 Z',
      },
      {
        id: 'astro-torso',
        name: 'Hard Upper Torso Suit',
        path: 'M 245,170 C 240,210 240,250 250,270 L 350,270 C 360,250 360,210 355,170 Z',
      },
    ],
  },
  {
    id: 'iss-space-station-013',
    title: 'International Space Station (ISS)',
    category: 'astronauts-space-travel',
    difficulty: 'Explorer',
    description: 'Color humanity’s football-field-sized microgravity orbital laboratory, complete with giant photovoltaic solar wings.',
    educationalFact: 'The ISS orbits Earth at an average speed of 28,000 km/h, completing one full circuit every 90 minutes!',
    additionalFact: 'Crew members aboard the ISS experience 16 sunrises and 16 sunsets every single day.',
    learningTopic: 'Orbital Habitat Architecture & Microgravity',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'iss-solar-lt',
        name: 'Port Solar Array Panel (Left Top)',
        path: 'M 80,85 L 145,85 L 145,200 L 80,200 Z',
      },
      {
        id: 'iss-solar-rt',
        name: 'Starboard Solar Array Panel (Right Top)',
        path: 'M 455,85 L 520,85 L 520,200 L 455,200 Z',
      },
      {
        id: 'iss-labs-center',
        name: 'Pressurized Science Modules',
        path: 'M 270,175 L 330,175 L 330,270 L 270,270 Z',
      },
    ],
  },
  {
    id: 'space-shuttle-014',
    title: 'Space Shuttle Orbiter — Gliding Home',
    category: 'astronauts-space-travel',
    difficulty: 'Medium',
    description: 'Color NASA’s iconic winged reusable spaceplane descending through upper atmospheric entry.',
    educationalFact: 'During entry, the black carbon-carbon tiles on the belly of the Shuttle withstood temperatures exceeding 1,650°C.',
    additionalFact: 'The Space Shuttle fleet flew a combined 135 orbital missions.',
    learningTopic: 'Hypersonic Reentry & Aerodynamics',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'shuttle-nose',
        name: 'Carbon-Carbon Nose Cone',
        path: 'M 275,60 C 290,45 310,45 325,60 C 335,80 265,80 275,60 Z',
      },
      {
        id: 'shuttle-fuselage',
        name: 'Forward Fuselage & Payload Doors',
        path: 'M 270,95 L 330,95 L 340,280 L 260,280 Z',
      },
      {
        id: 'shuttle-wing-l',
        name: 'Left Double-Delta Wing',
        path: 'M 265,200 L 120,310 L 140,340 L 260,320 Z',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CATEGORY 5: GALAXIES AND NEBULAE
  // --------------------------------------------------------------------------
  {
    id: 'galaxies-nebulae-flagship',
    title: 'Swirling Spiral Galaxy & Cosmic Nursery',
    category: 'galaxies-nebulae',
    difficulty: 'Easy',
    description: 'Color a vast, swirling spiral galaxy (the Milky Way) with glowing arms, huge billowy cosmic nursery clouds, and star clusters.',
    educationalFact: 'A spiral galaxy’s arms are not fixed rigid structures; they are rotating density waves where stars and gas pile up like cars on a crowded highway!',
    additionalFact: 'Our Milky Way galaxy has over 100 billion stars, and new ones are being born inside gaseous nebulae every year.',
    learningTopic: 'Galactic Evolution & Spiral Density Waves',
    viewBox: '0 0 500 280',
    underlaySvg: `
      <path d="M 85,60 L 88,52 L 91,60 L 98,62 L 91,64 L 88,72 L 85,64 L 78,62 Z" fill="#0F172A" />
      <path d="M 425,50 L 427,43 L 429,50 L 436,52 L 429,54 L 427,61 L 425,54 L 418,52 Z" fill="#0F172A" />
      <path d="M 410,210 L 412,204 L 414,210 L 420,212 L 414,214 L 412,220 L 410,214 L 404,212 Z" fill="#0F172A" />
      <circle cx="70" cy="180" r="2.5" fill="#0F172A" />
      <circle cx="110" cy="220" r="2" fill="#0F172A" />
      <circle cx="440" cy="130" r="2.5" fill="#0F172A" />
      <circle cx="360" cy="40" r="2" fill="#0F172A" />
    `,
    overlaySvg: `
      <circle cx="250" cy="140" r="8" fill="#0F172A" />
      <path d="M 250,140 C 270,145 280,125 270,110 C 255,95 215,105 200,130 C 180,160 200,205 240,220 C 290,235 350,205 370,150 C 390,90 340,25 270,10 C 190,-5 110,55 90,135" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M 250,140 C 230,135 220,155 230,170 C 245,185 285,175 300,150 C 320,120 300,75 260,60 C 210,45 150,75 130,130 C 110,190 160,255 230,270 C 310,285 390,225 410,145" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round" fill="none" />
    `,
    regions: [
      {
        id: 'gn-nucleus-center',
        name: 'Central Galactic Core',
        path: 'M 250,124 C 263,124 274,131 274,140 C 274,149 263,156 250,156 C 237,156 226,149 226,140 C 226,131 237,124 250,124 Z',
      },
      {
        id: 'gn-inner-spiral',
        name: 'Inner Pinwheel Spiral Vortex',
        path: 'M 250,140 C 270,145 280,125 270,110 C 255,95 215,105 200,130 C 180,160 200,205 240,220 C 290,235 350,205 370,150 L 375,155 C 352,212 288,242 235,226 C 192,210 172,162 193,128 C 210,100 252,90 268,105 C 278,120 268,140 250,140 Z',
      },
      {
        id: 'gn-outer-spiral',
        name: 'Outer Luminous Galactic Arm',
        path: 'M 250,140 C 230,135 220,155 230,170 C 245,185 285,175 300,150 C 320,120 300,75 260,60 C 210,45 150,75 130,130 L 125,125 C 148,68 212,38 265,54 C 308,70 328,118 307,152 C 290,180 248,190 232,175 C 222,160 232,140 250,140 Z',
      },
      {
        id: 'gn-cloud-top',
        name: 'Billowy Cosmic Gas Cloud Top',
        path: 'M 70,70 C 90,45 120,50 135,65 C 150,50 180,55 190,75 L 180,78 C 172,62 148,58 135,70 C 122,58 98,54 75,75 Z',
      },
      {
        id: 'gn-cloud-bottom',
        name: 'Billowy Cosmic Gas Cloud Bottom',
        path: 'M 330,235 C 350,260 385,255 400,235 C 420,255 450,245 460,225 L 450,222 C 442,238 418,246 400,230 C 382,246 358,250 335,230 Z',
      },
      {
        id: 'gn-star-1',
        name: 'Twinkling Star Alpha',
        path: 'M 85,60 L 88,52 L 91,60 L 98,62 L 91,64 L 88,72 L 85,64 L 78,62 Z',
      },
      {
        id: 'gn-star-2',
        name: 'Twinkling Star Beta',
        path: 'M 425,50 L 427,43 L 429,50 L 436,52 L 429,54 L 427,61 L 425,54 L 418,52 Z',
      },
    ],
  },
  {
    id: 'spiral-galaxy-015',
    title: 'Milky Way Spiral Galaxy',
    category: 'galaxies-nebulae',
    difficulty: 'Medium',
    description: 'Color the grand spiral pinwheel of our home galaxy, packed with hundreds of billions of stars.',
    educationalFact: 'The Milky Way is approximately 100,000 light-years across.',
    additionalFact: 'At the exact center lies Sagittarius A*, a supermassive black hole.',
    learningTopic: 'Galactic Structure & Astrophysics',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'gal-core-bulge',
        name: 'Central Galactic Bulge',
        path: 'M 300,185 C 335,185 360,205 360,225 C 360,245 335,265 300,265 C 265,265 240,245 240,225 C 240,205 265,185 300,185 Z',
      },
      {
        id: 'gal-arm-perseus',
        name: 'Perseus Spiral Arm',
        path: 'M 300,185 C 390,170 470,220 460,280 C 445,340 365,365 290,340 C 235,320 215,280 240,250 C 255,270 290,300 340,295 C 400,290 420,240 375,205 C 340,185 315,185 300,185 Z',
      },
    ],
  },
  {
    id: 'pillars-nebula-016',
    title: 'Pillars of Creation — Eagle Nebula',
    category: 'galaxies-nebulae',
    difficulty: 'Explorer',
    description: 'Color the towering interstellar spires of cold molecular hydrogen and dust where baby stars ignite.',
    educationalFact: 'The largest of the "Pillars of Creation" is roughly 4 to 5 light-years tall.',
    additionalFact: 'Ultraviolet light and stellar winds are slowly eroding the dust pillars.',
    learningTopic: 'Star Formation & Interstellar Medium',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'neb-pillar-left',
        name: 'Tallest Molecular Gas Pillar',
        path: 'M 140,450 L 150,210 C 145,160 185,120 215,140 C 235,160 210,210 215,260 L 225,450 Z',
      },
      {
        id: 'neb-pillar-mid',
        name: 'Central Star-Forming Pillar',
        path: 'M 255,450 L 270,250 C 265,220 295,190 320,205 C 335,220 320,260 330,300 L 340,450 Z',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CATEGORY 6: ROCKETS AND SATELLITES
  // --------------------------------------------------------------------------
  {
    id: 'rockets-satellites-flagship',
    title: 'Moon Rocket Blastoff & Solar Satellite',
    category: 'rockets-satellites',
    difficulty: 'Easy',
    description: 'Color a giant, powerful moon rocket blasting off with big billowy smoke trails, and an orbiting communication satellite with solar panels.',
    educationalFact: 'Rockets work by Newton’s Third Law of Motion: by blasting exhaust gases downward at extreme velocities, the rocket is propelled upward into orbit!',
    additionalFact: 'To escape Earth’s gravitational pull, a rocket must accelerate to an escape velocity of approximately 40,270 km/h (25,020 mph).',
    learningTopic: 'Rocket Propulsion & Staging Dynamics',
    viewBox: '0 0 500 280',
    underlaySvg: `
      <path d="M 235,50 L 237,43 L 239,50 L 246,52 L 239,54 L 237,61 L 235,54 L 228,52 Z" fill="#0F172A" />
      <circle cx="390" cy="45" r="2" fill="#0F172A" />
      <circle cx="470" cy="90" r="2.5" fill="#0F172A" />
    `,
    overlaySvg: `
      <circle cx="320" cy="125" r="10" stroke="#0F172A" stroke-width="1.5" fill="none" />
      <circle cx="317" cy="124" r="1.5" fill="#0F172A" />
      <circle cx="323" cy="124" r="1.5" fill="#0F172A" />
      <path d="M 317,128 Q 320,131 323,128" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" fill="none" />
      <circle cx="440" cy="185" r="4" fill="#0F172A" />
      <line x1="420" y1="179" x2="420" y2="191" stroke="#0F172A" stroke-width="1.5" />
      <line x1="460" y1="179" x2="460" y2="191" stroke="#0F172A" stroke-width="1.5" />
    `,
    regions: [
      {
        id: 'rs-rocket-body',
        name: 'Rocket Main Fuselage',
        path: 'M 315,95 L 345,115 L 320,155 L 290,135 Z',
      },
      {
        id: 'rs-nose-cone',
        name: 'Rocket Aerodynamic Nose Cone',
        path: 'M 315,95 L 330,75 L 345,115 Z',
      },
      {
        id: 'rs-porthole-glass',
        name: 'Astronaut Porthole Window',
        path: 'M 320,115 C 326,115 330,119 330,125 C 330,131 326,135 320,135 C 314,135 310,131 310,125 C 310,119 314,115 320,115 Z',
      },
      {
        id: 'rs-fin-left',
        name: 'Aerodynamic Fin Left',
        path: 'M 290,135 L 270,145 L 295,160 Z',
      },
      {
        id: 'rs-fin-right',
        name: 'Aerodynamic Fin Right',
        path: 'M 320,155 L 335,175 L 310,170 Z',
      },
      {
        id: 'rs-flame',
        name: 'Roaring Rocket Thrust Flame',
        path: 'M 295,150 L 285,175 L 300,165 L 305,185 L 315,165 L 325,175 L 315,155 Z',
      },
      {
        id: 'rs-smoke-cloud',
        name: 'Billowy Exhaust Smoke Cloud',
        path: 'M 315,220 C 300,200 330,180 350,195 C 365,175 400,185 405,205 C 425,195 450,220 440,245 C 425,265 345,265 315,220 Z',
      },
      {
        id: 'rs-satellite-body',
        name: 'Orbiting Satellite Chassis',
        path: 'M 432,177 L 448,177 L 448,193 L 432,193 Z',
      },
      {
        id: 'rs-satellite-wing-l',
        name: 'Satellite Solar Wing Left',
        path: 'M 412,179 L 428,179 L 428,191 L 412,191 Z',
      },
      {
        id: 'rs-satellite-wing-r',
        name: 'Satellite Solar Wing Right',
        path: 'M 452,179 L 468,179 L 468,191 L 452,191 Z',
      },
    ],
  },
  {
    id: 'rocket-launch-017',
    title: 'Artemis Heavy Rocket Launch to the Moon',
    category: 'rockets-satellites',
    difficulty: 'Easy',
    description: 'Color the thunderous liftoff of a deep-space lunar rocket with roaring booster exhaust flames and billowing steam.',
    educationalFact: 'At liftoff, NASA’s Space Launch System rocket produces 8.8 million pounds of maximum thrust!',
    additionalFact: 'The core engines consume liquid hydrogen and liquid oxygen cooled to -253°C.',
    learningTopic: 'Chemical Rocket Propulsion & Staging',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'rkt-core-tank',
        name: 'Core Stage (Orange Cryogenic Foam)',
        path: 'M 285,100 L 315,100 L 318,260 L 282,260 Z',
      },
      {
        id: 'rkt-booster-l',
        name: 'Left Solid Rocket Booster',
        path: 'M 262,120 L 282,140 L 282,260 L 260,260 Z',
      },
      {
        id: 'rkt-booster-r',
        name: 'Right Solid Rocket Booster',
        path: 'M 338,120 L 318,140 L 318,260 L 340,260 Z',
      },
      {
        id: 'rkt-plume-fire',
        name: 'Hypergolic Ignition Rocket Flame',
        path: 'M 265,260 L 335,260 L 350,340 L 300,380 L 250,340 Z',
      },
    ],
  },
  {
    id: 'space-telescope-018',
    title: 'James Webb Space Telescope (JWST)',
    category: 'rockets-satellites',
    difficulty: 'Medium',
    description: 'Color the golden hexagonal mirror segments and 5-layer tennis-court-sized sunshield peering into the dawn of time.',
    educationalFact: 'Webb’s 18 hexagonal primary mirror segments are plated with pure gold only 100 nanometers thin.',
    additionalFact: 'JWST orbits at Lagrange Point 2, keeping its instruments at a cryogenic -233°C.',
    learningTopic: 'Space Optical Astronomy & Infrared Technology',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'jwt-mirror-center',
        name: 'Central Beryllium Gold Mirror Array',
        path: 'M 255,140 L 345,140 L 380,205 L 345,270 L 255,270 L 220,205 Z',
      },
      {
        id: 'jwt-sunshield-1',
        name: 'Kapton Sunshield Membrane Layer 1',
        path: 'M 80,260 L 520,260 L 550,290 L 50,290 Z',
      },
    ],
  },
  {
    id: 'satellite-019',
    title: 'Orbital Communication Satellite',
    category: 'rockets-satellites',
    difficulty: 'Easy',
    description: 'Color a telecommunication satellite relaying high-speed signals across the globe from geostationary orbit.',
    educationalFact: 'Geostationary satellites orbit at exactly 35,786 km above Earth’s equator.',
    additionalFact: 'Arthur C. Clarke famously proposed geostationary communications satellites in 1945.',
    learningTopic: 'Satellite Telecommunications & Orbital Altitudes',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'sat-chassis',
        name: 'Hexagonal Satellite Main Bus',
        path: 'M 260,180 L 340,180 L 360,250 L 240,250 Z',
      },
      {
        id: 'sat-comm-dish',
        name: 'Parabolic Microwave Dish Antenna',
        path: 'M 250,110 C 275,80 325,80 350,110 C 330,140 270,140 250,110 Z',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CATEGORY 7: MARS AND ALIEN WORLDS
  // --------------------------------------------------------------------------
  {
    id: 'mars-alien-flagship',
    title: 'Friendly Mars Rover & Research Biodomes',
    category: 'mars-alien-worlds',
    difficulty: 'Easy',
    description: 'Color the Red Planet’s surface with a cute robot rover exploring, bubble-like human research dome habitats, alien plants, and moons overhead.',
    educationalFact: 'Mars is called the Red Planet because iron minerals in its regolith oxidize (rust), creating the distinct butterscotch-red dust covering its surface.',
    additionalFact: 'Mars has two tiny, potato-shaped moons named Phobos and Deimos, which are thought to be captured asteroids.',
    learningTopic: 'Martian Surface Geology & Habitats',
    viewBox: '0 0 500 280',
    underlaySvg: `
      <path d="M 280,45 C 274,45 268,51 268,60 C 268,69 274,75 282,75 C 276,72 272,66 272,60 C 272,54 276,48 280,45 Z" fill="#0F172A" />
      <path d="M 430,70 L 432,63 L 434,70 L 441,72 L 434,74 L 432,81 L 430,74 L 423,72 Z" fill="#0F172A" />
      <circle cx="350" cy="60" r="2" fill="#0F172A" />
    `,
    overlaySvg: `
      <circle cx="254" cy="151" r="3.5" fill="#0F172A" />
      <circle cx="266" cy="151" r="3.5" fill="#0F172A" />
      <path d="M 256,157 Q 260,160 264,157" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none" />
      <line x1="260" y1="140" x2="260" y2="129" stroke="#0F172A" stroke-width="2" />
      <circle cx="260" cy="127" r="3" fill="#0F172A" />
      <path d="M 282,187 L 298,177 L 304,187" stroke="#0F172A" stroke-width="3" stroke-linecap="round" fill="none" />
      <circle cx="305" cy="187" r="3" fill="#0F172A" />
      <circle cx="240" cy="203" r="4" fill="#0F172A" />
      <circle cx="255" cy="203" r="4" fill="#0F172A" />
      <circle cx="272" cy="203" r="4" fill="#0F172A" />
      <circle cx="287" cy="203" r="4" fill="#0F172A" />
      <path d="M 410,200 C 408,183 414,180 414,190" stroke="#0F172A" stroke-width="2" fill="none" />
      <circle cx="414" cy="183" r="3" fill="#0F172A" />
      <path d="M 430,200 C 428,175 435,172 435,182" stroke="#0F172A" stroke-width="2" fill="none" />
      <circle cx="435" cy="175" r="3.5" fill="#0F172A" />
    `,
    regions: [
      {
        id: 'ma-ground',
        name: 'Martian Dune Horizon Ground',
        path: 'M 0,220 Q 150,195 300,225 T 500,210 L 500,280 L 0,280 Z',
      },
      {
        id: 'ma-crater',
        name: 'Foreground Martian Crater',
        path: 'M 295,245 C 295,238 365,238 365,245 C 365,252 295,252 295,245 Z',
      },
      {
        id: 'ma-rover-head',
        name: 'Smiling Rover Computer Screen Head',
        path: 'M 244,140 L 276,140 L 276,162 L 244,162 Z',
      },
      {
        id: 'ma-rover-chassis',
        name: 'Rover Equipment Chassis',
        path: 'M 234,177 L 286,177 L 286,197 L 234,197 Z',
      },
      {
        id: 'ma-rover-wheel-1',
        name: 'Front Cleated Wheel',
        path: 'M 240,192 C 246,192 251,197 251,203 C 251,209 246,214 240,214 C 234,214 229,209 229,203 C 229,197 234,192 240,192 Z',
      },
      {
        id: 'ma-rover-wheel-2',
        name: 'Mid-Front Wheel',
        path: 'M 255,192 C 261,192 266,197 266,203 C 266,209 261,214 255,214 C 249,214 244,209 244,203 C 244,197 249,192 255,192 Z',
      },
      {
        id: 'ma-rover-wheel-3',
        name: 'Mid-Rear Wheel',
        path: 'M 272,192 C 278,192 283,197 283,203 C 283,209 278,214 272,214 C 266,214 261,209 261,203 C 261,197 266,192 272,192 Z',
      },
      {
        id: 'ma-rover-wheel-4',
        name: 'Rear Wheel',
        path: 'M 287,192 C 293,192 298,197 298,203 C 298,209 293,214 287,214 C 281,214 276,209 276,203 C 276,197 281,192 287,192 Z',
      },
      {
        id: 'ma-dome-main',
        name: 'Geodesic Habitat Biodome',
        path: 'M 350,205 C 350,170 395,170 395,205 Z',
      },
      {
        id: 'ma-dome-greenhouse',
        name: 'Hydroponics Plant Biodome',
        path: 'M 390,205 C 390,155 450,155 450,205 Z',
      },
      {
        id: 'ma-alien-plant-1',
        name: 'Terrarium Plant Alpha',
        path: 'M 410,200 C 408,183 414,180 414,190 C 414,200 410,200 410,200 Z',
      },
      {
        id: 'ma-alien-plant-2',
        name: 'Terrarium Plant Beta',
        path: 'M 430,200 C 428,180 435,177 435,187 C 435,197 430,200 430,200 Z',
      },
      {
        id: 'ma-moon',
        name: 'Overhead Phobos Moon',
        path: 'M 280,45 C 274,45 268,51 268,60 C 268,69 274,75 282,75 C 276,72 272,66 272,60 C 272,54 276,48 280,45 Z',
      },
    ],
  },
  {
    id: 'mars-perseverance-020',
    title: 'NASA Perseverance Rover in Jezero Crater',
    category: 'mars-alien-worlds',
    difficulty: 'Medium',
    description: 'Color the nuclear-powered robotic astrobiology laboratory searching for ancient microbial fossil signs on Mars.',
    educationalFact: 'Perseverance is equipped with a drill that extracts core samples of Martian rocks and seals them in titanium tubes.',
    additionalFact: 'The rover also carried Ingenuity, the first helicopter to fly on another planet.',
    learningTopic: 'Martian Astrobiology & Robotic Exploration',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'per-rover-deck',
        name: 'Avionics Chassis Deck',
        path: 'M 210,210 L 410,210 L 430,270 L 190,270 Z',
      },
      {
        id: 'per-ground',
        name: 'Martian Basaltic Sand',
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
    educationalFact: 'A real Mars habitat will likely be sheltered by regolith to shield astronauts from cosmic rays.',
    additionalFact: 'Mars has an atmosphere containing 95% carbon dioxide, requiring oxygen extraction systems.',
    learningTopic: 'Planetary Architecture & Off-World ISRU',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'base-dome-main',
        name: 'Central Geodesic Habitat Biodome',
        path: 'M 200,280 C 200,165 340,165 340,280 Z',
      },
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
    description: 'Color rocky alien exoplanets orbiting closely around a cool crimson red-dwarf star.',
    educationalFact: 'The TRAPPIST-1 system contains seven Earth-sized rocky planets, three in the habitable zone!',
    additionalFact: 'All seven planets orbit so close together that neighbors appear larger than the full Moon.',
    learningTopic: 'Exoplanet Detection & Habitable Zones',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'exo-host-star',
        name: 'TRAPPIST-1 Red Dwarf Star',
        path: 'M 0,80 C 80,80 120,150 120,225 C 120,300 80,370 0,370 Z',
      },
      {
        id: 'exo-planet-1',
        name: 'TRAPPIST-1e Rocky Exoplanet Globe',
        path: 'M 220,165 C 255,165 285,195 285,230 C 285,265 255,295 220,295 C 185,295 155,265 155,230 C 155,195 185,165 220,165 Z',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CATEGORY 8: STARS AND SPACE MYSTERIES
  // --------------------------------------------------------------------------
  {
    id: 'stars-mysteries-flagship',
    title: 'Swirling Black Hole & Streaking Meteor',
    category: 'stars-mysteries',
    difficulty: 'Easy',
    description: 'Color a swirling, playful black hole with an accretion disk, streaking shooting stars and comets with long tails, and a glowing star nursery.',
    educationalFact: 'A black hole’s gravity is so intense that light itself is bent into a glowing circle around the event horizon called the photon ring.',
    additionalFact: 'Meteors are small pieces of space rock that glow brightly as they burn up in Earth’s atmosphere at speeds of up to 72 km per second!',
    learningTopic: 'Relativistic Gravity & Space Debris',
    viewBox: '0 0 500 280',
    underlaySvg: `
      <path d="M 85,55 L 88,46 L 91,55 L 100,58 L 91,61 L 88,70 L 85,61 L 76,58 Z" fill="#0F172A" />
      <path d="M 125,95 L 127,89 L 129,95 L 135,97 L 129,99 L 127,105 L 125,99 L 119,97 Z" fill="#0F172A" />
      <circle cx="105" cy="140" r="2" fill="#0F172A" />
      <circle cx="150" cy="120" r="2.5" fill="#0F172A" />
    `,
    overlaySvg: `
      <circle cx="370" cy="140" r="14" fill="#000000" />
      <path d="M 370,140 C 388,143 395,128 385,115 C 372,102 340,110 328,132 C 312,158 328,195 362,208 C 404,220 455,195 472,148 C 488,98 446,42 387,30 C 319,18 251,68 234,136" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M 370,140 C 352,137 345,152 355,165 C 368,178 400,170 412,148 C 428,122 412,85 378,72 C 336,60 285,85 268,132 C 252,182 294,238 353,250 C 421,262 489,212 506,144" stroke="#0F172A" stroke-width="3" stroke-linecap="round" fill="none" />
      <circle cx="177" cy="202" r="3" stroke="#0F172A" stroke-width="1.5" fill="none" />
      <circle cx="184" cy="207" r="2.5" stroke="#0F172A" stroke-width="1.5" fill="none" />
      <line x1="187" y1="75" x2="150" y2="75" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round" />
    `,
    regions: [
      {
        id: 'sm-blackhole-center',
        name: 'Event Horizon Shadow (Singularity)',
        path: 'M 370,118 C 382,118 392,128 392,140 C 392,152 382,162 370,162 C 358,162 348,152 348,140 C 348,128 358,118 370,118 Z',
      },
      {
        id: 'sm-accretion-inner',
        name: 'Inner Accretion Photon Ring',
        path: 'M 370,105 C 389,105 405,121 405,140 C 405,159 389,175 370,175 C 351,175 335,159 335,140 C 335,121 351,105 370,105 Z',
      },
      {
        id: 'sm-accretion-arm-1',
        name: 'Relativistic Accretion Arm Alpha',
        path: 'M 370,140 C 388,143 395,128 385,115 C 372,102 340,110 328,132 C 312,158 328,195 362,208 L 366,204 C 336,192 322,160 334,136 C 344,118 370,112 380,122 C 388,132 382,143 370,140 Z',
      },
      {
        id: 'sm-accretion-arm-2',
        name: 'Relativistic Accretion Arm Beta',
        path: 'M 370,140 C 352,137 345,152 355,165 C 368,178 400,170 412,148 C 428,122 412,85 378,72 L 374,76 C 404,88 418,120 406,144 C 396,162 370,168 360,158 C 352,148 358,137 370,140 Z',
      },
      {
        id: 'sm-meteor-nucleus',
        name: 'Streaking Meteor Rock Nucleus',
        path: 'M 180,191 C 188,191 194,197 194,205 C 194,213 188,219 180,219 C 172,219 166,213 166,205 C 166,197 172,191 180,191 Z',
      },
      {
        id: 'sm-meteor-tail',
        name: 'Fiery Meteor Ionization Trail',
        path: 'M 168,197 L 115,180 L 135,200 L 85,195 L 135,210 L 115,230 L 168,213 Z',
      },
      {
        id: 'sm-shooting-star',
        name: 'Diagonal Shooting Star',
        path: 'M 195,67 C 199,67 203,71 203,75 C 203,79 199,83 195,83 C 191,83 187,79 187,75 C 187,71 191,67 195,67 Z',
      },
      {
        id: 'sm-star-cluster',
        name: 'Twinkling Star Cluster',
        path: 'M 85,55 L 88,46 L 91,55 L 100,58 L 91,61 L 88,70 L 85,61 L 76,58 Z',
      },
    ],
  },
  {
    id: 'black-hole-023',
    title: 'Supermassive Black Hole & Accretion Disk',
    category: 'stars-mysteries',
    difficulty: 'Explorer',
    description: 'Color the intense gravitational lensing, incandescent accretion disk, and pitch-black event horizon.',
    educationalFact: 'A black hole’s escape velocity exceeds the speed of light—meaning not even light can escape.',
    additionalFact: 'In 2019, the Event Horizon Telescope captured the first-ever image of a black hole’s shadow in M87.',
    learningTopic: 'General Relativity & Singularity Physics',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'bh-accretion-inner',
        name: 'Innermost Stable Orbit',
        path: 'M 160,225 C 160,195 240,185 300,185 C 360,185 440,195 440,225 C 440,255 360,265 300,265 C 240,265 160,255 160,225 Z',
      },
      {
        id: 'bh-event-horizon',
        name: 'Event Horizon Shadow',
        path: 'M 245,225 C 245,195 355,195 355,225 C 355,255 245,255 245,225 Z',
      },
    ],
  },
  {
    id: 'comet-shooting-star-024',
    title: 'Great Comet & Meteor Shower Night',
    category: 'stars-mysteries',
    difficulty: 'Easy',
    description: 'Color a glowing celestial visitor with an icy nucleus, luminous ion gas tail, and streaking meteors.',
    educationalFact: 'Comets are "dirty snowballs" of frozen water, methane, and ammonia mixed with rock and dust.',
    additionalFact: 'A comet always has two tails: a blue ion tail and a curved dust tail.',
    learningTopic: 'Small Solar System Bodies & Debris Dynamics',
    viewBox: '0 0 600 450',
    regions: [
      {
        id: 'com-coma',
        name: 'Sublimating Gas Coma',
        path: 'M 410,105 C 440,75 490,90 495,130 C 495,170 445,185 410,150 C 395,135 395,120 410,105 Z',
      },
      {
        id: 'com-ion-tail',
        name: 'Straight Ionized Gas Tail',
        path: 'M 430,120 L 60,30 L 40,45 L 415,135 Z',
      },
    ],
  },
];
