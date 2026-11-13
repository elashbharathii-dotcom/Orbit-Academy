export interface QuizQuestion {
  id: string;
  category:
    | 'solar-system'
    | 'earth-science'
    | 'planetary-science'
    | 'astrophysics'
    | 'space-missions'
    | 'galaxies'
    | 'advanced-astronomy';
  difficulty: 'Cadet' | 'Commander' | 'Astrophysicist';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
}

export const QUIZ_CATEGORIES = [
  { id: 'all', label: 'All Arenas', icon: '🏆' },
  { id: 'solar-system', label: 'Solar System', icon: '🪐' },
  { id: 'earth-science', label: 'Earth Science', icon: '🌍' },
  { id: 'planetary-science', label: 'Planetary Science', icon: '🌋' },
  { id: 'astrophysics', label: 'Astrophysics', icon: '⚡' },
  { id: 'space-missions', label: 'Space Missions', icon: '🛰️' },
  { id: 'galaxies', label: 'Galaxies', icon: '🌌' },
  { id: 'advanced-astronomy', label: 'Advanced Astronomy', icon: '🔭' },
] as const;

export const QUIZ_ARENA_QUESTIONS: QuizQuestion[] = [
  // 1. Solar System
  {
    id: 'q-ss-1',
    category: 'solar-system',
    difficulty: 'Cadet',
    question: 'Which planet possesses the most extensive and visually prominent ring system in the Solar System?',
    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    correctIndex: 1,
    explanation: 'While all four gas and ice giants have rings, Saturn’s 282,000-km-wide water-ice ring system is by far the brightest and most massive.',
    xpReward: 50,
  },
  {
    id: 'q-ss-2',
    category: 'solar-system',
    difficulty: 'Commander',
    question: 'Why does Venus experience higher surface temperatures (464°C) than Mercury (430°C), despite being twice as far from the Sun?',
    options: [
      'Venus has active radioactive volcanoes heating the core',
      'A runaway greenhouse effect caused by a dense 96.5% CO₂ atmosphere traps heat',
      'Venus orbits closer to the solar coronal streamers',
      'Tidal heating from its moons',
    ],
    correctIndex: 1,
    explanation: 'Venus’s ultra-dense carbon dioxide atmosphere exerts 92 times Earth’s surface pressure, trapping thermal infrared radiation in a runaway greenhouse effect.',
    xpReward: 75,
  },

  // 2. Earth Science
  {
    id: 'q-es-1',
    category: 'earth-science',
    difficulty: 'Cadet',
    question: 'What creates the colorful dancing auroras (Northern and Southern Lights) near Earth’s poles?',
    options: [
      'Sunlight reflecting off polar ice glaciers',
      'Solar wind charged particles colliding with atmospheric oxygen and nitrogen atoms',
      'Lightning storms trapped in the stratosphere',
      'Volcanic ash from the Ring of Fire',
    ],
    correctIndex: 1,
    explanation: 'Solar wind protons and electrons guided by Earth’s magnetic field collide with oxygen and nitrogen atoms in the thermosphere, exciting them into emitting green and purple photons.',
    xpReward: 50,
  },

  // 3. Planetary Science
  {
    id: 'q-ps-1',
    category: 'planetary-science',
    difficulty: 'Commander',
    question: 'What is the tallest known volcanic mountain in the entire Solar System?',
    options: ['Mount Everest (Earth)', 'Olympus Mons (Mars)', 'Maxwell Montes (Venus)', 'Maat Mons (Venus)'],
    correctIndex: 1,
    explanation: 'Olympus Mons on Mars rises 21.9 km (72,000 ft) high—nearly three times the height of Mount Everest—spanning a base the size of the state of Arizona.',
    xpReward: 75,
  },

  // 4. Astrophysics
  {
    id: 'q-ap-1',
    category: 'astrophysics',
    difficulty: 'Astrophysicist',
    question: 'What physical boundary around a black hole marks the threshold where escape velocity equals the speed of light?',
    options: ['The Ergosphere', 'The Event Horizon (Schwarzschild Radius)', 'The Accretion Disk Edge', 'The Roche Limit'],
    correctIndex: 1,
    explanation: 'The Event Horizon is the mathematically defined boundary where the escape velocity strictly equals the speed of light c; nothing, not even light, can escape.',
    xpReward: 100,
  },
  {
    id: 'q-ap-2',
    category: 'astrophysics',
    difficulty: 'Commander',
    question: 'What process fuels the core of main-sequence stars like our Sun?',
    options: ['Chemical combustion of methane', 'Thermonuclear fusion of hydrogen into helium', 'Gravitational Kelvin-Helmholtz contraction', 'Radioactive uranium fission'],
    correctIndex: 1,
    explanation: 'Stars on the main sequence fuse four hydrogen nuclei (protons) into one helium nucleus via the proton-proton chain, releasing radiant energy via E = mc².',
    xpReward: 75,
  },

  // 5. Space Missions
  {
    id: 'q-sm-1',
    category: 'space-missions',
    difficulty: 'Cadet',
    question: 'Which robotic space probe became the first human-made object to enter interstellar space in 2012?',
    options: ['Hubble Space Telescope', 'Voyager 1', 'Apollo 11', 'New Horizons'],
    correctIndex: 1,
    explanation: 'Launched in 1977, NASA’s Voyager 1 crossed the heliopause in August 2012 at a distance of 121 AU, entering pristine interstellar plasma space.',
    xpReward: 50,
  },

  // 6. Galaxies
  {
    id: 'q-gx-1',
    category: 'galaxies',
    difficulty: 'Commander',
    question: 'Which major spiral galaxy is on a gravitational collision trajectory with our Milky Way in approximately 4.5 billion years?',
    options: ['Triangulum Galaxy (M33)', 'Andromeda Galaxy (M31)', 'Large Magellanic Cloud', 'Whirlpool Galaxy (M51)'],
    correctIndex: 1,
    explanation: 'The Andromeda Galaxy (M31) is approaching the Milky Way at approximately 110 km/s. In 4.5 billion years, their stellar envelopes will merge into a giant elliptical galaxy dubbed Milkomeda.',
    xpReward: 75,
  },

  // 7. Advanced Astronomy
  {
    id: 'q-aa-1',
    category: 'advanced-astronomy',
    difficulty: 'Astrophysicist',
    question: 'What astronomical observation provided the first direct evidence for the accelerating expansion of the universe in 1998?',
    options: [
      'Hubble space telescope pulsar timing',
      'Cosmic microwave background acoustic oscillations',
      'Standard candle distance measurements of distant Type Ia supernovae',
      'Neutrino detection from Supernova 1987A',
    ],
    correctIndex: 2,
    explanation: 'Because Type Ia supernovae detonate with nearly uniform peak luminosity, their measured dimness revealed cosmic acceleration driven by Dark Energy (Nobel Prize in Physics 2011).',
    xpReward: 100,
  },
];

