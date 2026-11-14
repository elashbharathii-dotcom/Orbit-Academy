export interface ColorDefinition {
  number: number;
  name: string;
  hex: string;
}

export interface SvgRegion {
  id: string;
  path: string;
  targetColorNumber: number;
  labelPos: { x: number; y: number };
}

export interface DrawingActivity {
  id: string;
  title: string;
  category:
    | 'planets'
    | 'astronauts'
    | 'rockets'
    | 'spacecraft'
    | 'galaxies'
    | 'alien-characters'
    | 'cosmic-landscapes'
    | 'color-by-number'
    | 'space-discovery';
  categoryLabel: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Explorer';
  description: string;
  educationalFact: string;
  badgeReward: string;
  thumbnailUrl?: string;
  lineArtOverlayUrl?: string;
  viewBox: string;
  palette: ColorDefinition[];
  regions: SvgRegion[];
}

export const DRAWING_CATEGORIES = [
  { id: 'planets', label: 'Planets', icon: '🪐' },
  { id: 'astronauts', label: 'Astronauts', icon: '👨‍🚀' },
  { id: 'rockets', label: 'Rockets', icon: '🚀' },
  { id: 'spacecraft', label: 'Spacecraft', icon: '🛰️' },
  { id: 'galaxies', label: 'Galaxies', icon: '🌌' },
  { id: 'alien-characters', label: 'Alien Characters', icon: '👾' },
  { id: 'cosmic-landscapes', label: 'Cosmic Landscapes', icon: '✨' },
  { id: 'space-discovery', label: 'Space Discovery', icon: '🔭' },
] as const;

export const DRAWING_ACTIVITIES: DrawingActivity[] = [
  // 1. Planets: Earth, Moon & Sun Trio
  {
    id: 'earth-sun-moon',
    title: 'Earth, Sol & Lunar Dance',
    category: 'planets',
    categoryLabel: 'Planets',
    difficulty: 'Beginner',
    description: 'Color the cosmic dance between our radiant Sun, living Blue Planet, and orbiting Moon.',
    educationalFact: 'The Sun accounts for 99.86% of all mass in the Solar System, holding Earth and Moon in orbit.',
    badgeReward: 'Celestial Navigator',
    viewBox: '0 0 600 450',
    palette: [
      { number: 1, name: 'Solar Gold', hex: '#F59E0B' },
      { number: 2, name: 'Sun Core', hex: '#FEF08A' },
      { number: 3, name: 'Ocean Azure', hex: '#0284C7' },
      { number: 4, name: 'Biosphere Green', hex: '#10B981' },
      { number: 5, name: 'Atmosphere Cyan', hex: '#38BDF8' },
      { number: 6, name: 'Lunar Regolith', hex: '#94A3B8' },
      { number: 7, name: 'Crater Shadow', hex: '#475569' },
      { number: 8, name: 'Deep Cosmic Void', hex: '#0B1329' },
    ],
    regions: [
      // Cosmic Background
      {
        id: 'bg-space',
        path: 'M 0,0 L 600,0 L 600,450 L 0,450 Z',
        targetColorNumber: 8,
        labelPos: { x: 40, y: 40 },
      },
      // Sun Outer Corona
      {
        id: 'sun-corona',
        path: 'M 100,60 C 130,30 170,30 200,60 C 230,90 230,130 200,160 C 170,190 130,190 100,160 C 70,130 70,90 100,60 Z',
        targetColorNumber: 1,
        labelPos: { x: 150, y: 75 },
      },
      // Sun Radiant Core
      {
        id: 'sun-core',
        path: 'M 120,85 C 138,65 162,65 180,85 C 198,105 198,125 180,140 C 162,155 138,155 120,140 C 105,125 105,105 120,85 Z',
        targetColorNumber: 2,
        labelPos: { x: 150, y: 112 },
      },
      // Earth Atmosphere Outer Ring
      {
        id: 'earth-atmo',
        path: 'M 350,220 C 410,220 460,270 460,330 C 460,390 410,440 350,440 C 290,440 240,390 240,330 C 240,270 290,220 350,220 Z',
        targetColorNumber: 5,
        labelPos: { x: 350, y: 236 },
      },
      // Earth Ocean Globe
      {
        id: 'earth-oceans',
        path: 'M 350,232 C 404,232 448,276 448,330 C 448,384 404,428 350,428 C 296,428 252,384 252,330 C 252,276 296,232 350,232 Z',
        targetColorNumber: 3,
        labelPos: { x: 320, y: 310 },
      },
      // Earth Continents
      {
        id: 'earth-land-1',
        path: 'M 310,265 C 330,255 360,260 375,275 C 370,295 345,310 325,305 C 310,300 300,280 310,265 Z',
        targetColorNumber: 4,
        labelPos: { x: 340, y: 285 },
      },
      {
        id: 'earth-land-2',
        path: 'M 335,335 C 365,325 395,340 405,370 C 390,395 360,405 345,390 C 330,375 325,350 335,335 Z',
        targetColorNumber: 4,
        labelPos: { x: 370, y: 365 },
      },
      // Moon Sphere
      {
        id: 'moon-body',
        path: 'M 490,120 C 518,120 540,142 540,170 C 540,198 518,220 490,220 C 462,220 440,198 440,170 C 440,142 462,120 490,120 Z',
        targetColorNumber: 6,
        labelPos: { x: 490, y: 155 },
      },
      // Moon Crater 1
      {
        id: 'moon-crater-1',
        path: 'M 465,155 C 475,155 482,162 482,170 C 482,178 475,185 465,185 C 455,185 448,178 448,170 C 448,162 455,155 465,155 Z',
        targetColorNumber: 7,
        labelPos: { x: 465, y: 170 },
      },
      // Moon Crater 2
      {
        id: 'moon-crater-2',
        path: 'M 505,175 C 513,175 519,180 519,186 C 519,192 513,197 505,197 C 497,197 491,192 491,186 C 491,180 497,175 505,175 Z',
        targetColorNumber: 7,
        labelPos: { x: 505, y: 186 },
      },
    ],
  },

  // 2. Rockets: Artemis Deep-Space Rocket
  {
    id: 'artemis-rocket',
    title: 'Artemis Lunar Bound Rocket',
    category: 'rockets',
    categoryLabel: 'Rockets',
    difficulty: 'Intermediate',
    description: 'Fuel and launch the next-generation human exploration rocket toward cislunar space.',
    educationalFact: 'The SLS rocket generates 8.8 million pounds of maximum thrust, 15% more than Apollo Saturn V!',
    badgeReward: 'Flight Director',
    viewBox: '0 0 600 450',
    palette: [
      { number: 1, name: 'Thermal White', hex: '#F8FAFC' },
      { number: 2, name: 'NASA Orange', hex: '#EA580C' },
      { number: 3, name: 'Carbon Shield', hex: '#334155' },
      { number: 4, name: 'Flame Amber', hex: '#F59E0B' },
      { number: 5, name: 'Plasma Yellow', hex: '#FDE047' },
      { number: 6, name: 'Stellar Azure', hex: '#38BDF8' },
      { number: 7, name: 'Night Sky', hex: '#070C1B' },
    ],
    regions: [
      {
        id: 'space-bg',
        path: 'M 0,0 L 600,0 L 600,450 L 0,450 Z',
        targetColorNumber: 7,
        labelPos: { x: 50, y: 50 },
      },
      // Rocket Capsule / Nose
      {
        id: 'rocket-nose',
        path: 'M 300,50 L 330,110 L 270,110 Z',
        targetColorNumber: 1,
        labelPos: { x: 300, y: 85 },
      },
      // Capsule Window
      {
        id: 'capsule-window',
        path: 'M 292,85 C 292,80 308,80 308,85 C 308,90 292,90 292,85 Z',
        targetColorNumber: 6,
        labelPos: { x: 300, y: 86 },
      },
      // Main Core Stage
      {
        id: 'main-core',
        path: 'M 270,110 L 330,110 L 330,280 L 270,280 Z',
        targetColorNumber: 2,
        labelPos: { x: 300, y: 195 },
      },
      // Left Solid Rocket Booster
      {
        id: 'booster-left',
        path: 'M 240,140 L 265,140 L 265,290 L 240,290 L 235,270 Z',
        targetColorNumber: 1,
        labelPos: { x: 252, y: 215 },
      },
      // Right Solid Rocket Booster
      {
        id: 'booster-right',
        path: 'M 335,140 L 360,140 L 365,270 L 360,290 L 335,290 Z',
        targetColorNumber: 1,
        labelPos: { x: 348, y: 215 },
      },
      // Booster Nosecones
      {
        id: 'booster-cone-l',
        path: 'M 240,140 L 252,110 L 265,140 Z',
        targetColorNumber: 3,
        labelPos: { x: 252, y: 128 },
      },
      {
        id: 'booster-cone-r',
        path: 'M 335,140 L 348,110 L 360,140 Z',
        targetColorNumber: 3,
        labelPos: { x: 348, y: 128 },
      },
      // Exhaust Flame Inner
      {
        id: 'flame-inner',
        path: 'M 285,280 L 315,280 L 300,370 Z',
        targetColorNumber: 5,
        labelPos: { x: 300, y: 320 },
      },
      // Exhaust Flame Outer Plume
      {
        id: 'flame-outer',
        path: 'M 265,280 L 285,280 L 300,420 L 315,280 L 335,280 L 315,390 L 300,440 L 285,390 Z',
        targetColorNumber: 4,
        labelPos: { x: 300, y: 400 },
      },
    ],
  },

  // 3. Friendly Aliens: Cosmo the Starlight Sprite
  {
    id: 'cosmo-alien',
    title: 'Cosmo the Stardust Sprite',
    category: 'alien-characters',
    categoryLabel: 'Alien Characters',
    difficulty: 'Beginner',
    description: 'Bring Cosmo to life as they explore icy Europa with their glowing biological starlight antennas.',
    educationalFact: 'Astrobiologists search icy moons like Europa and Enceladus for extraterrestrial microbial life!',
    badgeReward: 'Xenobiologist',
    viewBox: '0 0 600 450',
    palette: [
      { number: 1, name: 'Sprite Teal', hex: '#2DD4BF' },
      { number: 2, name: 'Emerald Glow', hex: '#10B981' },
      { number: 3, name: 'Biolum Violet', hex: '#A855F7' },
      { number: 4, name: 'Star Eyes', hex: '#F8FAFC' },
      { number: 5, name: 'Antenna Glow', hex: '#FDE047' },
      { number: 6, name: 'Europa Ice', hex: '#38BDF8' },
      { number: 7, name: 'Space Horizon', hex: '#0F172A' },
    ],
    regions: [
      {
        id: 'alien-sky',
        path: 'M 0,0 L 600,0 L 600,340 L 0,340 Z',
        targetColorNumber: 7,
        labelPos: { x: 50, y: 50 },
      },
      // Europa Ice Ground
      {
        id: 'ice-ground',
        path: 'M 0,340 Q 300,300 600,340 L 600,450 L 0,450 Z',
        targetColorNumber: 6,
        labelPos: { x: 300, y: 390 },
      },
      // Alien Body
      {
        id: 'alien-body',
        path: 'M 250,220 C 230,260 230,320 270,340 C 300,350 330,340 350,310 C 370,270 360,230 330,210 C 300,195 270,200 250,220 Z',
        targetColorNumber: 1,
        labelPos: { x: 300, y: 280 },
      },
      // Alien Head
      {
        id: 'alien-head',
        path: 'M 240,150 C 240,110 360,110 360,150 C 370,190 350,220 300,220 C 250,220 230,190 240,150 Z',
        targetColorNumber: 2,
        labelPos: { x: 300, y: 160 },
      },
      // Left Eye
      {
        id: 'eye-left',
        path: 'M 265,145 C 265,135 280,135 280,145 C 280,155 265,155 265,145 Z',
        targetColorNumber: 4,
        labelPos: { x: 272, y: 145 },
      },
      // Right Eye
      {
        id: 'eye-right',
        path: 'M 320,145 C 320,135 335,135 335,145 C 335,155 320,155 320,145 Z',
        targetColorNumber: 4,
        labelPos: { x: 327, y: 145 },
      },
      // Left Antenna Bulb
      {
        id: 'antenna-bulb-l',
        path: 'M 235,90 C 235,80 250,80 250,90 C 250,100 235,100 235,90 Z',
        targetColorNumber: 5,
        labelPos: { x: 242, y: 90 },
      },
      // Right Antenna Bulb
      {
        id: 'antenna-bulb-r',
        path: 'M 350,90 C 350,80 365,80 365,90 C 365,100 350,100 350,90 Z',
        targetColorNumber: 5,
        labelPos: { x: 357, y: 90 },
      },
      // Belly Patch
      {
        id: 'belly-patch',
        path: 'M 280,260 C 280,245 320,245 320,260 C 325,285 315,310 300,310 C 285,310 275,285 280,260 Z',
        targetColorNumber: 3,
        labelPos: { x: 300, y: 275 },
      },
    ],
  },

  // 4. Educational Maps: Earth's Atmospheric Layers
  {
    id: 'atmospheric-layers',
    title: "Earth's Atmospheric Shield",
    category: 'cosmic-landscapes',
    categoryLabel: 'Cosmic Landscapes',
    difficulty: 'Explorer',
    description: 'Chart the concentric protective layers of Earth from the troposphere to the outer exosphere.',
    educationalFact: 'The ozone layer in the stratosphere absorbs up to 98% of the Sun’s harmful ultraviolet radiation.',
    badgeReward: 'Master Cartographer',
    viewBox: '0 0 600 450',
    palette: [
      { number: 1, name: 'Troposphere (Weather)', hex: '#38BDF8' },
      { number: 2, name: 'Stratosphere (Ozone)', hex: '#2563EB' },
      { number: 3, name: 'Mesosphere (Meteors)', hex: '#4F46E5' },
      { number: 4, name: 'Thermosphere (Auroras)', hex: '#9333EA' },
      { number: 5, name: 'Exosphere (Satellites)', hex: '#1E1B4B' },
      { number: 6, name: 'Earth Surface', hex: '#10B981' },
      { number: 7, name: 'Mantle Core', hex: '#EA580C' },
    ],
    regions: [
      // Exosphere
      {
        id: 'layer-exosphere',
        path: 'M 0,0 L 600,0 L 600,90 L 0,90 Z',
        targetColorNumber: 5,
        labelPos: { x: 300, y: 45 },
      },
      // Thermosphere
      {
        id: 'layer-thermosphere',
        path: 'M 0,90 L 600,90 L 600,170 L 0,170 Z',
        targetColorNumber: 4,
        labelPos: { x: 300, y: 130 },
      },
      // Mesosphere
      {
        id: 'layer-mesosphere',
        path: 'M 0,170 L 600,170 L 600,250 L 0,250 Z',
        targetColorNumber: 3,
        labelPos: { x: 300, y: 210 },
      },
      // Stratosphere
      {
        id: 'layer-stratosphere',
        path: 'M 0,250 L 600,250 L 600,320 L 0,320 Z',
        targetColorNumber: 2,
        labelPos: { x: 300, y: 285 },
      },
      // Troposphere
      {
        id: 'layer-troposphere',
        path: 'M 0,320 L 600,320 L 600,380 L 0,380 Z',
        targetColorNumber: 1,
        labelPos: { x: 300, y: 350 },
      },
      // Earth Crust
      {
        id: 'layer-crust',
        path: 'M 0,380 L 600,380 L 600,420 L 0,420 Z',
        targetColorNumber: 6,
        labelPos: { x: 300, y: 400 },
      },
      // Mantle
      {
        id: 'layer-mantle',
        path: 'M 0,420 L 600,420 L 600,450 L 0,450 Z',
        targetColorNumber: 7,
        labelPos: { x: 300, y: 435 },
      },
    ],
  },

  // 5. Earth Science: Ocean Magnetosphere & Aurora
  {
    id: 'aurora-borealis',
    title: 'Geomagnetic Aurora Australis',
    category: 'cosmic-landscapes',
    categoryLabel: 'Cosmic Landscapes',
    difficulty: 'Intermediate',
    description: 'Color the dancing polar aurora lights powered by solar protons colliding with atmospheric gases.',
    educationalFact: 'Green auroras are produced by excited atomic oxygen at 100-300 km altitude, while nitrogen glows purple!',
    badgeReward: 'Geomagnetic Specialist',
    viewBox: '0 0 600 450',
    palette: [
      { number: 1, name: 'Aurora Emerald', hex: '#10B981' },
      { number: 2, name: 'Aurora Violet', hex: '#8B5CF6' },
      { number: 3, name: 'Solar Particle Beam', hex: '#FDE047' },
      { number: 4, name: 'Polar Ice Cap', hex: '#E2E8F0' },
      { number: 5, name: 'Southern Ocean', hex: '#0369A1' },
      { number: 6, name: 'Polar Night Sky', hex: '#030712' },
    ],
    regions: [
      {
        id: 'polar-sky',
        path: 'M 0,0 L 600,0 L 600,300 L 0,300 Z',
        targetColorNumber: 6,
        labelPos: { x: 50, y: 50 },
      },
      // Aurora Curtain 1
      {
        id: 'aurora-band-1',
        path: 'M 0,80 C 150,140 250,50 400,110 C 500,150 550,100 600,130 L 600,210 C 520,180 420,230 300,170 C 180,120 100,190 0,160 Z',
        targetColorNumber: 1,
        labelPos: { x: 280, y: 135 },
      },
      // Aurora Curtain 2
      {
        id: 'aurora-band-2',
        path: 'M 0,160 C 100,190 180,120 300,170 C 420,230 520,180 600,210 L 600,250 C 480,220 380,260 250,210 C 120,170 50,220 0,200 Z',
        targetColorNumber: 2,
        labelPos: { x: 300, y: 205 },
      },
      // Mountain Silhouette / Ice
      {
        id: 'polar-ice',
        path: 'M 0,300 L 120,270 L 220,310 L 340,260 L 480,310 L 600,280 L 600,360 L 0,360 Z',
        targetColorNumber: 4,
        labelPos: { x: 300, y: 310 },
      },
      // Ocean
      {
        id: 'polar-ocean',
        path: 'M 0,360 L 600,360 L 600,450 L 0,450 Z',
        targetColorNumber: 5,
        labelPos: { x: 300, y: 405 },
      },
    ],
  },

  // 6. Space Cartoons: Astro-Bunny & Moon Carrot
  {
    id: 'astro-bunny',
    title: 'Astro-Bunny Lunar Harvest',
    category: 'astronauts',
    categoryLabel: 'Astronauts',
    difficulty: 'Beginner',
    description: 'Join Astro-Bunny on their low-gravity garden mission on the rim of Shackleton Crater.',
    educationalFact: 'Astronauts on the Moon weighed only 1/6th of their Earth weight, allowing huge bunny hops!',
    badgeReward: 'Cosmic Gardener',
    viewBox: '0 0 600 450',
    palette: [
      { number: 1, name: 'Spacesuit White', hex: '#F8FAFC' },
      { number: 2, name: 'Gold Visor', hex: '#F59E0B' },
      { number: 3, name: 'Cosmic Carrot', hex: '#EA580C' },
      { number: 4, name: 'Carrot Sprout', hex: '#22C55E' },
      { number: 5, name: 'Moon Surface', hex: '#64748B' },
      { number: 6, name: 'Starry Sky', hex: '#090D1A' },
    ],
    regions: [
      {
        id: 'bunny-sky',
        path: 'M 0,0 L 600,0 L 600,320 L 0,320 Z',
        targetColorNumber: 6,
        labelPos: { x: 50, y: 50 },
      },
      // Moon Ground
      {
        id: 'bunny-ground',
        path: 'M 0,320 Q 300,280 600,320 L 600,450 L 0,450 Z',
        targetColorNumber: 5,
        labelPos: { x: 300, y: 390 },
      },
      // Bunny Helmet
      {
        id: 'bunny-helmet',
        path: 'M 240,140 C 240,90 360,90 360,140 C 360,190 240,190 240,140 Z',
        targetColorNumber: 1,
        labelPos: { x: 300, y: 110 },
      },
      // Bunny Visor
      {
        id: 'bunny-visor',
        path: 'M 265,135 C 265,115 335,115 335,135 C 335,165 265,165 265,135 Z',
        targetColorNumber: 2,
        labelPos: { x: 300, y: 140 },
      },
      // Left Ear Suit
      {
        id: 'ear-left',
        path: 'M 255,100 C 240,40 280,30 285,90 Z',
        targetColorNumber: 1,
        labelPos: { x: 265, y: 65 },
      },
      // Right Ear Suit
      {
        id: 'ear-right',
        path: 'M 315,90 C 320,30 360,40 345,100 Z',
        targetColorNumber: 1,
        labelPos: { x: 335, y: 65 },
      },
      // Bunny Body Suit
      {
        id: 'bunny-body',
        path: 'M 260,185 L 340,185 L 355,300 L 245,300 Z',
        targetColorNumber: 1,
        labelPos: { x: 300, y: 245 },
      },
      // Cosmic Carrot
      {
        id: 'space-carrot',
        path: 'M 380,240 L 410,240 L 395,330 Z',
        targetColorNumber: 3,
        labelPos: { x: 395, y: 270 },
      },
      // Carrot Top
      {
        id: 'carrot-greens',
        path: 'M 385,240 C 375,215 415,215 405,240 Z',
        targetColorNumber: 4,
        labelPos: { x: 395, y: 228 },
      },
    ],
  },

  // 7. Astronomy: James Webb Deep Field Nebula
  {
    id: 'deep-space-nebula',
    title: 'James Webb Cosmic Pillars',
    category: 'galaxies',
    categoryLabel: 'Galaxies',
    difficulty: 'Explorer',
    description: 'Illuminate towering interstellar gas clouds where newborn proto-stars ignite in nuclear fusion.',
    educationalFact: 'The James Webb Space Telescope observes the universe in infrared light, peering through dense dust clouds.',
    badgeReward: 'Astrophysics Scholar',
    viewBox: '0 0 600 450',
    palette: [
      { number: 1, name: 'Hydrogen Red', hex: '#EF4444' },
      { number: 2, name: 'Oxygen Cyan', hex: '#06B6D4' },
      { number: 3, name: 'Sulfur Amber', hex: '#F59E0B' },
      { number: 4, name: 'Infrared Magenta', hex: '#D946EF' },
      { number: 5, name: 'Proto-Star Core', hex: '#FEF08A' },
      { number: 6, name: 'Interstellar Void', hex: '#05070D' },
    ],
    regions: [
      {
        id: 'nebula-bg',
        path: 'M 0,0 L 600,0 L 600,450 L 0,450 Z',
        targetColorNumber: 6,
        labelPos: { x: 40, y: 40 },
      },
      // Main Pillar
      {
        id: 'pillar-main',
        path: 'M 180,450 L 220,180 C 230,120 280,120 290,180 L 310,450 Z',
        targetColorNumber: 1,
        labelPos: { x: 250, y: 280 },
      },
      // Secondary Pillar
      {
        id: 'pillar-secondary',
        path: 'M 310,450 L 340,240 C 345,190 395,190 400,240 L 430,450 Z',
        targetColorNumber: 3,
        labelPos: { x: 370, y: 320 },
      },
      // Gas Cloud Upper Curtain
      {
        id: 'cloud-top',
        path: 'M 0,0 L 600,0 L 600,160 C 450,110 350,210 200,130 C 100,75 50,140 0,90 Z',
        targetColorNumber: 2,
        labelPos: { x: 480, y: 80 },
      },
      // Proto-star Cluster
      {
        id: 'star-ignite-1',
        path: 'M 250,110 C 240,110 240,130 250,130 C 260,130 260,110 250,110 Z',
        targetColorNumber: 5,
        labelPos: { x: 250, y: 120 },
      },
      {
        id: 'star-ignite-2',
        path: 'M 370,180 C 360,180 360,200 370,200 C 380,200 380,180 370,180 Z',
        targetColorNumber: 5,
        labelPos: { x: 370, y: 190 },
      },
      // Ionized Gas Swirl
      {
        id: 'ionized-swirl',
        path: 'M 80,240 C 140,200 160,320 80,360 C 20,380 30,280 80,240 Z',
        targetColorNumber: 4,
        labelPos: { x: 85, y: 295 },
      },
    ],
  },

  // 8. Space Missions: Perseverance Scanning Jezero Crater
  {
    id: 'perseverance-mission',
    title: 'Perseverance Rover on Mars',
    category: 'spacecraft',
    categoryLabel: 'Spacecraft',
    difficulty: 'Intermediate',
    description: 'Paint the Perseverance robotic geologist as it drills for biosignatures on the ancient lakebed of Mars.',
    educationalFact: 'Perseverance carries the Ingenuity helicopter, which completed 72 historic powered flights on Mars!',
    badgeReward: 'Mars Exploration Veteran',
    viewBox: '0 0 600 450',
    palette: [
      { number: 1, name: 'Rover Chassis', hex: '#F1F5F9' },
      { number: 2, name: 'Robotic Arm Gold', hex: '#F59E0B' },
      { number: 3, name: 'Martian Basalt', hex: '#B91C1C' },
      { number: 4, name: 'Jezero Dust Sand', hex: '#EA580C' },
      { number: 5, name: 'Carbon Wheels', hex: '#334155' },
      { number: 6, name: 'Salmon Martian Sky', hex: '#FED7AA' },
    ],
    regions: [
      // Martian Sky
      {
        id: 'mars-sky',
        path: 'M 0,0 L 600,0 L 600,240 L 0,240 Z',
        targetColorNumber: 6,
        labelPos: { x: 50, y: 50 },
      },
      // Jezero Crater Rim Mountains
      {
        id: 'crater-rim',
        path: 'M 0,240 L 150,190 L 300,230 L 450,180 L 600,220 L 600,290 L 0,290 Z',
        targetColorNumber: 3,
        labelPos: { x: 250, y: 235 },
      },
      // Crater Floor Dust
      {
        id: 'crater-floor',
        path: 'M 0,290 L 600,290 L 600,450 L 0,450 Z',
        targetColorNumber: 4,
        labelPos: { x: 300, y: 410 },
      },
      // Rover Main Deck
      {
        id: 'rover-deck',
        path: 'M 220,270 L 380,270 L 370,330 L 230,330 Z',
        targetColorNumber: 1,
        labelPos: { x: 300, y: 300 },
      },
      // MastCam Mast & Camera Head
      {
        id: 'rover-mast',
        path: 'M 250,210 L 270,210 L 265,270 L 255,270 Z',
        targetColorNumber: 1,
        labelPos: { x: 260, y: 240 },
      },
      // Robotic Arm
      {
        id: 'rover-arm',
        path: 'M 360,290 L 430,260 L 450,310 L 440,315 L 370,305 Z',
        targetColorNumber: 2,
        labelPos: { x: 410, y: 285 },
      },
      // Wheel Front
      {
        id: 'wheel-f',
        path: 'M 350,330 C 350,315 380,315 380,330 C 380,360 350,360 350,330 Z',
        targetColorNumber: 5,
        labelPos: { x: 365, y: 335 },
      },
      // Wheel Mid
      {
        id: 'wheel-m',
        path: 'M 290,335 C 290,320 320,320 320,335 C 320,365 290,365 290,335 Z',
        targetColorNumber: 5,
        labelPos: { x: 305, y: 340 },
      },
      // Wheel Rear
      {
        id: 'wheel-r',
        path: 'M 230,330 C 230,315 260,315 260,330 C 260,360 230,360 230,330 Z',
        targetColorNumber: 5,
        labelPos: { x: 245, y: 335 },
      },
    ],
  },

  // 9. Space Discovery: Young Astronomers
  {
    id: 'young-astronomers',
    title: 'Young Astronomers: Space Discovery',
    category: 'space-discovery',
    categoryLabel: 'Space Discovery',
    difficulty: 'Beginner',
    description:
      'Join two young astronomers on an exciting night of space discovery. Color planets, stars, rockets, telescopes, and their amazing astronomy adventure.',
    educationalFact:
      'Astronomy inspires scientific wonder: through telescopes and space missions, young explorers unlock the ancient secrets of planets, lunar craters, and distant stars.',
    badgeReward: 'Cosmic Explorer',
    thumbnailUrl: '/artwork/young-astronomers.png',
    lineArtOverlayUrl: '/artwork/young-astronomers.png',
    viewBox: '0 0 474 732',
    palette: [
      { number: 1, name: 'Deep Space Void', hex: '#0B1226' },
      { number: 2, name: 'Cosmic Orange', hex: '#EA580C' },
      { number: 3, name: 'Solar Gold', hex: '#F59E0B' },
      { number: 4, name: 'Starlight Bright', hex: '#FEF08A' },
      { number: 5, name: 'Comet Cyan', hex: '#38BDF8' },
      { number: 6, name: 'Astronaut Suit White', hex: '#F8FAFC' },
      { number: 7, name: 'Lunar Regolith Grey', hex: '#94A3B8' },
      { number: 8, name: 'Crater Shadow Slate', hex: '#475569' },
      { number: 9, name: 'Astronaut Hair Honey', hex: '#D97706' },
      { number: 10, name: 'Warm Skin Glow', hex: '#FDBA74' },
    ],
    regions: [
      // Deep Space Void Sky
      {
        id: 'ya-sky',
        path: 'M 18,18 L 456,18 C 456,18 456,200 456,410 C 370,395 320,405 280,410 C 230,415 150,415 90,415 C 50,420 30,420 18,425 Z',
        targetColorNumber: 1,
        labelPos: { x: 370, y: 110 },
      },
      // Gas Giant Planet Base
      {
        id: 'ya-planet-body',
        path: 'M 88,67 A 49,49 0 1,0 88,165 A 49,49 0 1,0 88,67 Z',
        targetColorNumber: 2,
        labelPos: { x: 88, y: 85 },
      },
      // Planet Cloud Bands
      {
        id: 'ya-planet-band-1',
        path: 'M 40,105 Q 65,95 90,110 T 136,105 L 137,120 Q 110,130 85,118 T 39,120 Z',
        targetColorNumber: 3,
        labelPos: { x: 88, y: 118 },
      },
      {
        id: 'ya-planet-band-2',
        path: 'M 42,130 Q 65,122 90,135 T 135,130 L 132,146 Q 110,154 85,142 T 44,146 Z',
        targetColorNumber: 3,
        labelPos: { x: 88, y: 138 },
      },
      // Meteor Head
      {
        id: 'ya-meteor-core',
        path: 'M 315,136 A 14,14 0 1,0 315,164 A 14,14 0 1,0 315,136 Z',
        targetColorNumber: 4,
        labelPos: { x: 315, y: 150 },
      },
      // Meteor Tail & Speed Streak
      {
        id: 'ya-meteor-tail',
        path: 'M 326,140 L 435,52 L 420,45 L 310,132 Z',
        targetColorNumber: 5,
        labelPos: { x: 375, y: 90 },
      },
      // Stars
      {
        id: 'ya-star-1',
        path: 'M 182,56 L 186,66 L 196,67 L 188,74 L 191,84 L 182,78 L 173,84 L 176,74 L 168,67 L 178,66 Z',
        targetColorNumber: 4,
        labelPos: { x: 182, y: 70 },
      },
      {
        id: 'ya-star-2',
        path: 'M 222,180 L 227,192 L 239,193 L 230,202 L 233,214 L 222,207 L 211,214 L 214,202 L 205,193 L 217,192 Z',
        targetColorNumber: 4,
        labelPos: { x: 222, y: 197 },
      },
      {
        id: 'ya-star-3',
        path: 'M 300,75 L 303,82 L 310,83 L 305,88 L 307,95 L 300,91 L 293,95 L 295,88 L 290,83 L 297,82 Z',
        targetColorNumber: 4,
        labelPos: { x: 300, y: 85 },
      },
      {
        id: 'ya-star-4',
        path: 'M 298,206 L 302,214 L 310,215 L 304,220 L 306,228 L 298,224 L 290,228 L 292,220 L 286,215 L 294,214 Z',
        targetColorNumber: 4,
        labelPos: { x: 298, y: 217 },
      },
      {
        id: 'ya-star-5',
        path: 'M 388,218 L 392,226 L 400,227 L 394,232 L 396,240 L 388,236 L 380,240 L 382,232 L 376,227 L 384,226 Z',
        targetColorNumber: 4,
        labelPos: { x: 388, y: 229 },
      },
      {
        id: 'ya-star-6',
        path: 'M 416,172 L 419,178 L 426,179 L 421,183 L 423,190 L 416,186 L 409,190 L 411,183 L 406,179 L 413,178 Z',
        targetColorNumber: 4,
        labelPos: { x: 416, y: 181 },
      },
      {
        id: 'ya-star-7',
        path: 'M 415,522 L 419,530 L 428,531 L 421,536 L 424,545 L 415,540 L 406,545 L 409,536 L 402,531 L 411,530 Z',
        targetColorNumber: 4,
        labelPos: { x: 415, y: 533 },
      },
      // Rocket Nosecone
      {
        id: 'ya-rocket-nose',
        path: 'M 78,132 C 78,132 50,185 42,205 L 114,205 C 106,185 78,132 78,132 Z',
        targetColorNumber: 2,
        labelPos: { x: 78, y: 175 },
      },
      // Rocket Body
      {
        id: 'ya-rocket-body',
        path: 'M 42,205 L 42,370 C 42,382 114,382 114,370 L 114,205 Z',
        targetColorNumber: 6,
        labelPos: { x: 78, y: 335 },
      },
      // Rocket Porthole Outer Ring
      {
        id: 'ya-rocket-porthole-ring',
        path: 'M 78,244 A 24,24 0 1,0 78,292 A 24,24 0 1,0 78,244 Z',
        targetColorNumber: 7,
        labelPos: { x: 78, y: 252 },
      },
      // Rocket Porthole Glass
      {
        id: 'ya-rocket-porthole-glass',
        path: 'M 78,252 A 16,16 0 1,0 78,284 A 16,16 0 1,0 78,252 Z',
        targetColorNumber: 5,
        labelPos: { x: 78, y: 268 },
      },
      // Rocket Left Fin
      {
        id: 'ya-rocket-fin-left',
        path: 'M 42,280 C 30,300 18,340 18,390 C 26,385 36,380 42,375 Z',
        targetColorNumber: 2,
        labelPos: { x: 28, y: 345 },
      },
      // Rocket Right Fin
      {
        id: 'ya-rocket-fin-right',
        path: 'M 114,280 C 126,300 138,340 138,385 C 130,380 120,378 114,375 Z',
        targetColorNumber: 2,
        labelPos: { x: 126, y: 345 },
      },
      // Astronaut Outer Helmet
      {
        id: 'ya-astro-helmet',
        path: 'M 210,218 C 160,218 122,258 122,308 C 122,358 160,398 210,398 C 260,398 298,358 298,308 C 298,258 260,218 210,218 Z',
        targetColorNumber: 6,
        labelPos: { x: 210, y: 232 },
      },
      // Astronaut Visor Bubble Glass
      {
        id: 'ya-astro-visor',
        path: 'M 210,230 C 168,230 135,264 135,308 C 135,352 168,386 210,386 C 252,386 285,352 285,308 C 285,264 252,230 210,230 Z',
        targetColorNumber: 5,
        labelPos: { x: 156, y: 275 },
      },
      // Astronaut Hair
      {
        id: 'ya-astro-hair',
        path: 'M 160,285 C 160,250 200,240 230,245 C 255,250 262,275 260,295 C 245,285 235,285 220,288 C 205,290 190,280 175,292 C 168,290 162,288 160,285 Z',
        targetColorNumber: 9,
        labelPos: { x: 210, y: 268 },
      },
      // Astronaut Face
      {
        id: 'ya-astro-face',
        path: 'M 165,295 C 175,285 235,285 255,295 C 258,325 245,360 210,360 C 175,360 162,325 165,295 Z',
        targetColorNumber: 10,
        labelPos: { x: 210, y: 320 },
      },
      // Astronaut Torso Suit
      {
        id: 'ya-astro-torso',
        path: 'M 152,385 C 152,385 140,430 155,465 C 190,470 235,470 265,465 C 275,430 265,385 265,385 Z',
        targetColorNumber: 6,
        labelPos: { x: 180, y: 415 },
      },
      // Astronaut Chest Control Panel
      {
        id: 'ya-astro-chestpack',
        path: 'M 205,398 L 250,398 L 250,432 L 205,432 Z',
        targetColorNumber: 7,
        labelPos: { x: 227, y: 415 },
      },
      // Astronaut Right Arm & Hand
      {
        id: 'ya-astro-arm-right',
        path: 'M 155,395 C 145,415 155,450 178,455 C 190,455 198,435 195,415 C 190,405 178,400 168,400 Z',
        targetColorNumber: 6,
        labelPos: { x: 172, y: 435 },
      },
      // Astronaut Left Arm & Grip
      {
        id: 'ya-astro-arm-left',
        path: 'M 260,395 C 280,400 310,410 320,430 C 322,442 308,452 295,448 C 285,442 275,430 262,420 Z',
        targetColorNumber: 6,
        labelPos: { x: 290, y: 425 },
      },
      // Astronaut Waist Belt
      {
        id: 'ya-astro-belt',
        path: 'M 156,462 L 264,462 L 260,480 L 160,480 Z',
        targetColorNumber: 7,
        labelPos: { x: 210, y: 471 },
      },
      // Astronaut Kneeling Legs
      {
        id: 'ya-astro-legs',
        path: 'M 160,480 C 135,490 120,520 135,545 C 160,545 185,530 200,505 C 220,530 250,545 285,535 C 285,510 265,485 240,480 Z',
        targetColorNumber: 6,
        labelPos: { x: 210, y: 510 },
      },
      // Astronaut Boots
      {
        id: 'ya-astro-boots',
        path: 'M 115,512 C 110,530 125,550 152,550 C 160,540 155,520 142,515 Z M 240,530 C 240,555 270,565 305,560 C 310,545 295,530 270,528 Z',
        targetColorNumber: 7,
        labelPos: { x: 275, y: 546 },
      },
      // Flagpole
      {
        id: 'ya-flag-pole',
        path: 'M 314,195 L 322,195 L 310,555 L 302,555 Z',
        targetColorNumber: 7,
        labelPos: { x: 312, y: 210 },
      },
      // Flag Banner Cloth
      {
        id: 'ya-flag-cloth',
        path: 'M 322,225 C 360,230 400,215 440,232 L 436,335 C 395,315 360,335 320,320 Z',
        targetColorNumber: 6,
        labelPos: { x: 395, y: 245 },
      },
      // Flag Saturn Planet Emblem
      {
        id: 'ya-flag-saturn',
        path: 'M 380,258 A 22,22 0 1,0 380,302 A 22,22 0 1,0 380,258 Z',
        targetColorNumber: 3,
        labelPos: { x: 380, y: 272 },
      },
      // Flag Saturn Ring Emblem
      {
        id: 'ya-flag-ring',
        path: 'M 342,282 C 342,272 418,272 418,282 C 418,292 342,292 342,282 Z',
        targetColorNumber: 5,
        labelPos: { x: 355, y: 282 },
      },
      // Lunar Horizon Surface Terrain
      {
        id: 'ya-moon-surface',
        path: 'M 18,425 C 90,415 150,415 200,420 C 260,425 340,395 456,410 L 456,717 L 18,717 Z',
        targetColorNumber: 7,
        labelPos: { x: 210, y: 585 },
      },
      // Lunar Craters
      {
        id: 'ya-crater-1',
        path: 'M 40,460 C 40,448 95,448 95,460 C 95,472 40,472 40,460 Z',
        targetColorNumber: 8,
        labelPos: { x: 68, y: 460 },
      },
      {
        id: 'ya-crater-2',
        path: 'M 375,490 C 375,480 430,480 430,490 C 430,500 375,500 375,490 Z',
        targetColorNumber: 8,
        labelPos: { x: 402, y: 490 },
      },
      {
        id: 'ya-crater-3',
        path: 'M 40,580 C 40,565 100,565 100,580 C 100,595 40,595 40,580 Z',
        targetColorNumber: 8,
        labelPos: { x: 70, y: 580 },
      },
      {
        id: 'ya-crater-4',
        path: 'M 135,620 C 135,605 200,605 200,620 C 200,635 135,635 135,620 Z',
        targetColorNumber: 8,
        labelPos: { x: 168, y: 620 },
      },
      {
        id: 'ya-crater-5',
        path: 'M 265,645 C 265,632 325,632 325,645 C 325,658 265,658 265,645 Z',
        targetColorNumber: 8,
        labelPos: { x: 295, y: 645 },
      },
      {
        id: 'ya-crater-6',
        path: 'M 60,700 C 60,685 125,685 125,700 C 125,715 60,715 60,700 Z',
        targetColorNumber: 8,
        labelPos: { x: 92, y: 700 },
      },
      {
        id: 'ya-crater-7',
        path: 'M 190,705 C 190,690 255,690 255,705 C 255,720 190,720 190,705 Z',
        targetColorNumber: 8,
        labelPos: { x: 222, y: 705 },
      },
      {
        id: 'ya-crater-8',
        path: 'M 380,712 C 380,698 440,698 440,712 C 440,726 380,726 380,712 Z',
        targetColorNumber: 8,
        labelPos: { x: 410, y: 712 },
      },
    ],
  },
];

