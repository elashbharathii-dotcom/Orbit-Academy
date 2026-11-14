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
  {
    id: 'q-es-2',
    category: 'earth-science',
    difficulty: 'Commander',
    question: 'What is the primary heat transport mechanism driving plate tectonics inside Earth’s mantle?',
    options: [
      'Radiative photon emission',
      'Thermal mantle convection currents',
      'Centrifugal rotational forcing',
      'Solar gravitational tidal kneading',
    ],
    correctIndex: 1,
    explanation: 'Sub-surface heat from primordial accretion and radioactive decay (U-238, Th-232, K-40) drives slow plastic convection in the asthenosphere, moving tectonic lithospheric plates.',
    xpReward: 75,
  },
  {
    id: 'q-es-3',
    category: 'earth-science',
    difficulty: 'Astrophysicist',
    question: 'What is the geomagnetic geodynamo effect responsible for generating Earth’s dipole magnetic field?',
    options: [
      'Magnetized solid iron crystals locked in the inner core',
      'Convective swirling currents of molten iron-nickel fluid in the outer core powered by Coriolis forces',
      'Piezoelectric tension in the crust under ocean ridges',
      'Cosmic rays ionizing atmospheric argon gas',
    ],
    correctIndex: 1,
    explanation: 'Thermal convection coupled with Earth’s rapid rotation (Coriolis acceleration) organizes liquid iron flows in the outer core into helical columns, generating a self-sustaining planetary magnetic dipole.',
    xpReward: 100,
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
  {
    id: 'q-ps-2',
    category: 'planetary-science',
    difficulty: 'Cadet',
    question: 'Which Jovian moon is considered one of the most promising candidates in the search for extraterrestrial life due to its vast subsurface saltwater ocean?',
    options: ['Io', 'Europa', 'Callisto', 'Phobos'],
    correctIndex: 1,
    explanation: 'Europa hides a global liquid ocean containing more water than all of Earth’s oceans combined, shielded beneath an icy crust 15 to 25 km thick and warmed by tidal flexure.',
    xpReward: 50,
  },
  {
    id: 'q-ps-3',
    category: 'planetary-science',
    difficulty: 'Astrophysicist',
    question: 'Why does Saturn’s moon Enceladus produce continuous cryogenic plumes erupting from its south polar fractures (Tiger Stripes)?',
    options: [
      'Chemical ignition of hydrogen peroxide caverns',
      'Orbital orbital eccentricity resonance with Dione causing cyclical tidal frictional heating',
      'Direct solar radiation boiling surface nitrogen frost',
      'Mantle tectonic subduction zones',
    ],
    correctIndex: 1,
    explanation: 'A 2:1 mean-motion orbital resonance with Dione excites Enceladus’s orbital eccentricity, producing ongoing tidal dissipation that melts basal ice and vents supersonic saltwater plumes through fractures.',
    xpReward: 100,
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
  {
    id: 'q-sm-2',
    category: 'space-missions',
    difficulty: 'Commander',
    question: 'What revolutionary gravitational maneuver did the Cassini-Huygens spacecraft use to reach Saturn with fuel efficiency?',
    options: [
      'Single direct ion propulsion burn from low-Earth orbit',
      'Venus-Venus-Earth-Jupiter Gravity Assist (VVEJGA) trajectory',
      'Solar photon sail deployment at 0.5 AU',
      'Lunar orbital tether slingshot',
    ],
    correctIndex: 1,
    explanation: 'Cassini performed multiple gravity-assist flybys (twice past Venus, once past Earth, and once past Jupiter) stealing orbital momentum to gain over 18 km/s without consuming propellant.',
    xpReward: 75,
  },
  {
    id: 'q-sm-3',
    category: 'space-missions',
    difficulty: 'Astrophysicist',
    question: 'Why is the James Webb Space Telescope (JWST) positioned in a halo orbit around the Sun-Earth Lagrange Point 2 (L2)?',
    options: [
      'To remain in continuous direct radio contact with Mars rovers',
      'To keep the Sun, Earth, and Moon simultaneously behind its five-layer thermal sunshield, maintaining cryogenic ~40 K infrared detectors',
      'To recharge its lithium-sulfur batteries inside Earth’s Van Allen belt',
      'To harvest lunar solar flare ejecta',
    ],
    correctIndex: 1,
    explanation: 'At L2 (1.5 million km behind Earth), a single orientation shields JWST’s mirrors and NIRCam from the thermal radiation of the Sun, Earth, and Moon simultaneously, chilling instruments below 40 Kelvin.',
    xpReward: 100,
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
  {
    id: 'q-gx-2',
    category: 'galaxies',
    difficulty: 'Cadet',
    question: 'What classification shape does our home galaxy, the Milky Way, belong to?',
    options: ['Irregular dwarf galaxy', 'Barred spiral galaxy (SBbc)', 'Peculiar ring galaxy', 'Giant elliptical galaxy (E0)'],
    correctIndex: 1,
    explanation: 'Modern infrared surveys (Spitzer & Gaia) confirm that the Milky Way is a barred spiral galaxy with a central stellar bar spanning ~27,000 light-years and four major spiral arms.',
    xpReward: 50,
  },
  {
    id: 'q-gx-3',
    category: 'galaxies',
    difficulty: 'Astrophysicist',
    question: 'What empirical astrophysical relation links the flat rotational velocity of stars in spiral galaxies to their total intrinsic baryonic luminosity?',
    options: [
      'The Faber-Jackson relation',
      'The Tully-Fisher relation',
      'The Hertzsprung-Russell relation',
      'The Wien displacement law',
    ],
    correctIndex: 1,
    explanation: 'The Tully-Fisher relation states that L ∝ V_max^4 for spiral galaxies, providing a powerful cosmic distance indicator and early evidence for dark matter halos enveloping galactic disks.',
    xpReward: 100,
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
  {
    id: 'q-aa-2',
    category: 'advanced-astronomy',
    difficulty: 'Cadet',
    question: 'What is a light-year fundamentally a measurement of?',
    options: ['Time elapsed in deep space', 'Distance traveled by light in vacuum in one Julian year', 'Brightness of stellar flares', 'Speed of cosmic rays'],
    correctIndex: 1,
    explanation: 'A light-year is a unit of astronomical distance equal to approximately 9.46 trillion kilometers (5.88 trillion miles), the span light travels across vacuum in 365.25 days.',
    xpReward: 50,
  },
  {
    id: 'q-aa-3',
    category: 'advanced-astronomy',
    difficulty: 'Commander',
    question: 'What optical phenomenon occurs when light from a distant quasar is curved around a foreground massive galaxy cluster?',
    options: ['Gravitational lensing (Einstein Ring)', 'Synchrotron emission', 'Zeeman splitting', 'Rayleigh atmospheric scattering'],
    correctIndex: 0,
    explanation: 'As predicted by Einstein’s General Relativity, immense spacetime curvature warped by mass acts as an astronomical lens, producing magnified arcs, multiple images, and Einstein rings.',
    xpReward: 75,
  },
];

