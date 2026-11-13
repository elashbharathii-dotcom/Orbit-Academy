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
    | 'solar-system'
    | 'space-adventures'
    | 'friendly-aliens'
    | 'educational-maps'
    | 'earth-science'
    | 'space-cartoons'
    | 'astronomy'
    | 'space-missions';
  categoryLabel: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Explorer';
  description: string;
  educationalFact: string;
  badgeReward: string;
  viewBox: string;
  palette: ColorDefinition[];
  regions: SvgRegion[];
}

export const DRAWING_CATEGORIES = [
  { id: 'solar-system', label: 'Solar System', icon: '🪐' },
  { id: 'space-adventures', label: 'Space Adventures', icon: '🚀' },
  { id: 'friendly-aliens', label: 'Friendly Aliens', icon: '👾' },
  { id: 'educational-maps', label: 'Educational Maps', icon: '🗺️' },
  { id: 'earth-science', label: 'Earth Science', icon: '🌍' },
  { id: 'space-cartoons', label: 'Space Cartoons', icon: '🎨' },
  { id: 'astronomy', label: 'Astronomy', icon: '🔭' },
  { id: 'space-missions', label: 'Space Missions', icon: '🛰️' },
] as const;

export const DRAWING_ACTIVITIES: DrawingActivity[] = [
  // 1. Solar System: Earth, Moon & Sun Trio
  {
    id: 'earth-sun-moon',
    title: 'Earth, Sol & Lunar Dance',
    category: 'solar-system',
    categoryLabel: 'Solar System',
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

  // 2. Space Adventures: Artemis Deep-Space Rocket
  {
    id: 'artemis-rocket',
    title: 'Artemis Lunar Bound Rocket',
    category: 'space-adventures',
    categoryLabel: 'Space Adventures',
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
    category: 'friendly-aliens',
    categoryLabel: 'Friendly Aliens',
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
    category: 'educational-maps',
    categoryLabel: 'Educational Maps',
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
    category: 'earth-science',
    categoryLabel: 'Earth Science',
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
    category: 'space-cartoons',
    categoryLabel: 'Space Cartoons',
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
    category: 'astronomy',
    categoryLabel: 'Astronomy',
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
    category: 'space-missions',
    categoryLabel: 'Space Missions',
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
];

