export interface Lesson {
  id: string;
  title: string;
  duration: string;
  xpReward: number;
  summary: string;
  content: string[];
  checkpointQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Course {
  id: string;
  title: string;
  category: string;
  celestialId: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  totalLessons: number;
  xpTotal: number;
  icon: string;
  tagline: string;
  description: string;
  lessons: Lesson[];
}

export const ASTRONOMY_COURSES: Course[] = [
  {
    id: 'course-solar-system',
    title: 'Introduction to the Solar System',
    category: 'Foundations',
    celestialId: 'sun',
    level: 'Beginner',
    totalLessons: 3,
    xpTotal: 300,
    icon: '☀️',
    tagline: 'Gravitational Architecture of our Cosmic Neighborhood',
    description: 'Explore the formation of our planetary system 4.6 billion years ago from a collapsing molecular cloud and learn how gravity organizes orbits.',
    lessons: [
      {
        id: 'ss-1',
        title: 'The Solar Nebula Hypothesis',
        duration: '6 min',
        xpReward: 100,
        summary: 'How an interstellar cloud of gas and dust collapsed under gravity to ignite our Sun.',
        content: [
          '4.6 billion years ago, a shockwave from a nearby supernova triggered the gravitational collapse of a giant molecular cloud.',
          'As the cloud collapsed, conservation of angular momentum caused it to spin faster and flatten into a circumstellar protoplanetary disk.',
          'At the dense center, temperatures and pressures triggered thermonuclear hydrogen fusion, igniting Sol as a Main Sequence star.',
        ],
        checkpointQuestion: {
          question: 'What physical law caused the collapsing solar nebula to flatten into a spinning disk?',
          options: [
            'Conservation of angular momentum',
            'Quantum entanglement',
            'Coulomb repulsive force',
            'Doppler red-shifting',
          ],
          correctIndex: 0,
          explanation: 'Conservation of angular momentum dictates that as the nebula shrinks in radius, its rotational spin accelerates and flattens along the axis of rotation.',
        },
      },
      {
        id: 'ss-2',
        title: 'Terrestrial vs Gas Giant Planets',
        duration: '8 min',
        xpReward: 100,
        summary: 'Why rocky worlds formed close to the Sun while gas giants accreted beyond the frost line.',
        content: [
          'The Frost Line (at approximately 2.7 AU) separated the warm inner Solar System from the cold outer system.',
          'Inside the frost line, only dense refractory materials like silicates and metals could condense, forming small rocky worlds (Mercury, Venus, Earth, Mars).',
          'Beyond the frost line, volatile compounds like water, methane, and ammonia froze into solid ices, allowing giant cores to rapidly capture vast hydrogen-helium envelopes.',
        ],
        checkpointQuestion: {
          question: 'What boundary in the protoplanetary disk determined where ice could condense into planet-building seeds?',
          options: ['The Kuiper Border', 'The Frost Line', 'The Roche Limit', 'The Heliopause'],
          correctIndex: 1,
          explanation: 'The Frost Line (Ice Line) marks the distance from the protostar where temperatures drop low enough for water, methane, and ammonia to freeze into solid grains.',
        },
      },
      {
        id: 'ss-3',
        title: 'Kepler’s Laws of Planetary Motion',
        duration: '10 min',
        xpReward: 100,
        summary: 'The geometric laws governing every orbiting body in the universe.',
        content: [
          'First Law: Planets orbit in ellipses, with the Sun situated at one of the two foci.',
          'Second Law (Equal Areas): A line joining a planet and the Sun sweeps out equal areas during equal intervals of time, moving faster at perihelion.',
          'Third Law (Harmonic Law): The square of a planet’s orbital period is proportional to the cube of the semi-major axis of its orbit (P² = a³).',
        ],
        checkpointQuestion: {
          question: 'According to Kepler’s Second Law, where does an orbiting planet travel fastest along its trajectory?',
          options: ['At aphelion (farthest from Sun)', 'At perihelion (closest to Sun)', 'At the orbital nodes', 'Its speed is completely constant'],
          correctIndex: 1,
          explanation: 'Conservation of angular momentum accelerates the orbiting body as its distance to the central gravitational mass decreases, reaching peak velocity at perihelion.',
        },
      },
    ],
  },

  {
    id: 'course-the-sun',
    title: 'Understanding the Sun',
    category: 'Stellar Physics',
    celestialId: 'sun',
    level: 'Intermediate',
    totalLessons: 2,
    xpTotal: 250,
    icon: '🔥',
    tagline: 'Photospheric Convection, Fusion & the Solar Wind',
    description: 'Investigate the proton-proton chain nuclear reaction inside the solar core and how the magnetic field powers coronal mass ejections.',
    lessons: [
      {
        id: 'sun-1',
        title: 'Thermonuclear Core & Radiative Transfer',
        duration: '7 min',
        xpReward: 125,
        summary: 'Inside the 15-million-degree nuclear furnace powering life on Earth.',
        content: [
          'Every second, the Sun fuses 600 million tons of hydrogen into helium through the proton-proton chain, converting 4 million tons of mass directly into energy via E = mc².',
          'Photons produced in the core take over 100,000 years to slowly random-walk through the dense Radiative Zone to the surface.',
          'In the Convective Zone, hot plasma bubbles upward in convective granules before radiating light into space from the Photosphere.',
        ],
        checkpointQuestion: {
          question: 'Approximately how long does a photon created in the Sun’s core take to reach the surface?',
          options: ['8.3 minutes', '24 hours', 'Over 100,000 years', '1 million seconds'],
          correctIndex: 2,
          explanation: 'Due to the immense density of the Radiative Zone, photons undergo trillions of continuous scattering collisions, requiring over 100,000 years to reach the surface.',
        },
      },
      {
        id: 'sun-2',
        title: 'Solar Cycles, Sunspots & Space Weather',
        duration: '8 min',
        xpReward: 125,
        summary: 'How magnetic reconnection events unleash flares and coronal mass ejections.',
        content: [
          'The Sun undergoes an 11-year magnetic solar cycle driven by differential rotation (equator spins in 25 days, poles in 35 days).',
          'Sunspots are dark regions where intense magnetic flux tubes choke convective heat transfer, cooling the plasma to 4,000 K.',
          'When magnetic field lines snap and reconnect, they eject billions of tons of magnetized plasma into space, creating geomagnetic storms and auroras on Earth.',
        ],
        checkpointQuestion: {
          question: 'Why do sunspots appear darker than the surrounding photosphere?',
          options: [
            'They are solid iron islands',
            'Magnetic fields inhibit convective heat flow, making them 1,500°C cooler',
            'They are holes in the Sun looking into deep space',
            'They are covered by carbon clouds',
          ],
          correctIndex: 1,
          explanation: 'Strong local magnetic fields suppress the upward convection of hot plasma. While still glowing at 4,000 K, they appear dark by contrast with the 5,800 K photosphere.',
        },
      },
    ],
  },

  {
    id: 'course-earth-atmosphere',
    title: "Earth's Atmosphere & Magnetic Shield",
    category: 'Planetary Science',
    celestialId: 'earth',
    level: 'Beginner',
    totalLessons: 2,
    xpTotal: 200,
    icon: '🌍',
    tagline: 'Biosphere Habitability & the Van Allen Belts',
    description: 'Learn how our geomagnetic geodynamo deflects lethal cosmic rays and how the ozone layer shields surface biology.',
    lessons: [
      {
        id: 'earth-1',
        title: 'Atmospheric Stratification',
        duration: '6 min',
        xpReward: 100,
        summary: 'The five concentric atmospheric shells shielding Earth from the void.',
        content: [
          'Troposphere: Contains 75% of atmospheric mass and all weather phenomena (0 to 12 km).',
          'Stratosphere: Houses the protective ozone layer absorbing 98% of solar ultraviolet radiation (12 to 50 km).',
          'Mesosphere: Where incoming meteoroids burn up from compression friction (50 to 85 km).',
          'Thermosphere & Exosphere: Where auroras dance and satellites orbit in Low Earth Orbit.',
        ],
        checkpointQuestion: {
          question: 'In which atmospheric layer does the ozone layer absorb solar ultraviolet radiation?',
          options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Exosphere'],
          correctIndex: 1,
          explanation: 'The Stratosphere houses the ozone layer (O₃), which strongly absorbs lethal ultraviolet-B and ultraviolet-C photons.',
        },
      },
      {
        id: 'earth-2',
        title: 'The Liquid Iron Geodynamo',
        duration: '7 min',
        xpReward: 100,
        summary: 'How Earth’s rotating molten outer core generates our protective magnetosphere.',
        content: [
          'Earth’s molten outer core is composed of turbulent liquid iron and nickel.',
          'Convection currents combined with planetary rotation create self-sustaining electric currents—the Geodynamo.',
          'This generates the geomagnetic field and Van Allen radiation belts, deflecting solar wind protons safely around our planet.',
        ],
        checkpointQuestion: {
          question: 'What physical engine inside Earth produces its planetary magnetic shield?',
          options: [
            'Liquid iron convection in the outer core (Geodynamo)',
            'Radioactive decay in continental crust',
            'Ocean tidal friction',
            'Atmospheric wind circulation',
          ],
          correctIndex: 0,
          explanation: 'Convective motion of electrically conductive liquid iron in Earth’s outer core, coupled with the Coriolis effect, generates the planetary magnetic field.',
        },
      },
    ],
  },

  {
    id: 'course-mars-life',
    title: 'Mars & the Possibility of Life',
    category: 'Astrobiology',
    celestialId: 'mars',
    level: 'Intermediate',
    totalLessons: 2,
    xpTotal: 250,
    icon: '🔴',
    tagline: 'Paleolakes, Clay Minerals & Rover Astrobiology',
    description: 'Follow robotic exploration from Viking to Perseverance investigating whether microbial life ever emerged in ancient Martian rivers.',
    lessons: [
      {
        id: 'mars-1',
        title: 'Ancient Water on Early Mars',
        duration: '7 min',
        xpReward: 125,
        summary: 'Geological evidence of rivers, delta lakes, and ancient shorelines 3.8 billion years ago.',
        content: [
          'Orbital spectrometry and rover imagery reveal extensive dendritic river valleys, alluvial fans, and lake sediment deltas.',
          'Jezero Crater preserves a fossilized river delta where liquid water flowed into a 250-meter-deep paleolake.',
          'Hydrated phyllosilicate clay minerals discovered by rovers only form in prolonged standing water with neutral pH favorable for biology.',
        ],
        checkpointQuestion: {
          question: 'What type of minerals discovered in Jezero Crater provide proof of prolonged neutral liquid water?',
          options: ['Anhydrous basalt', 'Phyllosilicates (Clays)', 'Solid methane clathrates', 'Pure quartz crystals'],
          correctIndex: 1,
          explanation: 'Phyllosilicates (clay minerals) require sustained interaction between rocks and liquid water at neutral to alkaline pH, conditions highly favorable for microbial preservation.',
        },
      },
      {
        id: 'mars-2',
        title: 'Atmospheric Loss & MAVEN Insights',
        duration: '8 min',
        xpReward: 125,
        summary: 'How the death of Mars’ magnetic field allowed the solar wind to strip its atmosphere.',
        content: [
          'Mars is smaller than Earth, causing its metallic core to cool and solidify around 4 billion years ago, shutting down its global dynamo.',
          'Without a magnetic shield, the uninhibited solar wind stripped away 90% of the Martian atmosphere through ion sputtering.',
          'As atmospheric pressure plummeted below the triple point of water (6.1 mbar), liquid surface water either evaporated or froze into subsurface permafrost.',
        ],
        checkpointQuestion: {
          question: 'Why did ancient Mars lose its thick atmosphere and warm surface water?',
          options: [
            'A collision with Jupiter',
            'Its core cooled, the magnetic field died, and solar wind stripped the atmosphere',
            'Plants absorbed all carbon dioxide',
            'Solar flares pushed Mars into a colder orbit',
          ],
          correctIndex: 1,
          explanation: 'When the Martian geodynamo shut down, the unshielded solar wind stripped atmospheric gas ions into space over hundreds of millions of years.',
        },
      },
    ],
  },

  {
    id: 'course-jupiter-grs',
    title: "Jupiter's Great Red Spot",
    category: 'Fluid Mechanics',
    celestialId: 'jupiter',
    level: 'Advanced',
    totalLessons: 2,
    xpTotal: 250,
    icon: '🌪️',
    tagline: 'Anticyclonic Storms & Zonal Jet Banding',
    description: 'Analyze fluid turbulence, high-pressure vortex dynamics, and atmospheric chemistry in the Solar System’s largest storm.',
    lessons: [
      {
        id: 'jup-1',
        title: 'Anatomy of an Anticyclone',
        duration: '8 min',
        xpReward: 125,
        summary: 'Why the Great Red Spot spins counter-clockwise in Jupiter’s southern hemisphere.',
        content: [
          'The Great Red Spot is a high-pressure anticyclone, spinning counter-clockwise in the Southern Hemisphere at speeds up to 680 km/h.',
          'It is trapped between two opposing jet streams: an eastward jet to the south and a westward jet to the north.',
          'These counter-shearing zonal wind belts continuously pump kinetic energy into the storm, sustaining it for over 350 years.',
        ],
        checkpointQuestion: {
          question: 'What continuously feeds kinetic energy into the Great Red Spot to sustain it for centuries?',
          options: [
            'Geothermal volcanoes from Io',
            'Opposing counter-shearing zonal jet streams',
            'Solar ultraviolet radiation',
            'Asteroid impacts',
          ],
          correctIndex: 1,
          explanation: 'The storm is confined between adjacent eastward and westward zonal jet bands that shear against it, feeding vorticity and angular momentum into the vortex.',
        },
      },
      {
        id: 'jup-2',
        title: 'Chromophores & Red Coloration',
        duration: '7 min',
        xpReward: 125,
        summary: 'The chemical mystery behind the storm’s iconic brick-red hue.',
        content: [
          'Jupiter’s underlying cloud deck is composed of white ammonia ice crystals.',
          'Convective upwelling inside the Great Red Spot dredges up compounds like ammonium hydrosulfide and phosphine from deep within the atmosphere.',
          'Solar ultraviolet radiation photolyzes these molecules, creating reddish organic and sulfur complexes called chromophores.',
        ],
        checkpointQuestion: {
          question: 'What process creates the reddish color of the Great Red Spot?',
          options: [
            'Rust dust blown from Mars',
            'Solar UV photolysis of upwelled chemical compounds (chromophores)',
            'Molten lava lakes floating in the clouds',
            'Reflected light from Io’s sulfur',
          ],
          correctIndex: 1,
          explanation: 'Solar ultraviolet light breaks down upwelled atmospheric chemicals (such as ammonium hydrosulfide and hydrocarbons), producing reddish photoproducts called chromophores.',
        },
      },
    ],
  },

  {
    id: 'course-saturn-rings',
    title: "Saturn's Rings & Dynamics",
    category: 'Celestial Mechanics',
    celestialId: 'saturn',
    level: 'Intermediate',
    totalLessons: 2,
    xpTotal: 250,
    icon: '🪐',
    tagline: 'Water-Ice Granulometry & Shepherd Moons',
    description: 'Explore the origin, gravitational clearing, and resonant gaps of the most magnificent ring system in space.',
    lessons: [
      {
        id: 'sat-1',
        title: 'Composition & Scale of the Rings',
        duration: '7 min',
        xpReward: 125,
        summary: 'Why an expanse 282,000 km wide is only 10 meters thick.',
        content: [
          'Spectroscopy by the Cassini spacecraft proved the rings are 99% pure water ice, with traces of tholins and silicates.',
          'Particle sizes range from micrometers to house-sized boulders, with centimeter-to-meter chunks dominating.',
          'Frequent inelastic collisions between particles flatten the disk into an astonishingly thin sheet averaging just 10 meters in vertical thickness.',
        ],
        checkpointQuestion: {
          question: 'What is the primary chemical composition of Saturn’s ring system?',
          options: ['Solid iron-nickel', '99% pure water ice', 'Carbon graphite', 'Frozen nitrogen slush'],
          correctIndex: 1,
          explanation: 'Spectroscopic analysis confirms Saturn’s rings are almost entirely composed of water ice, reflecting over 80% of incident sunlight.',
        },
      },
      {
        id: 'sat-2',
        title: 'Orbital Resonances & the Cassini Division',
        duration: '8 min',
        xpReward: 125,
        summary: 'How shepherd moons Pan, Daphnis, and Mimas sculpt gaps through gravity.',
        content: [
          'The 4,800-km-wide Cassini Division is not empty because of collisions, but because of orbital resonance with moon Mimas.',
          'Particles in the gap complete exactly 2 orbits for every 1 orbit of Mimas (2:1 resonance). The repeated gravitational tug pulls particles out of this zone.',
          'Shepherd moons Pan and Daphnis orbit inside the Encke and Keeler gaps, sculpting razor-sharp ring edges and producing vertical gravity waves.',
        ],
        checkpointQuestion: {
          question: 'What causes the prominent Cassini Division gap between Saturn’s A and B rings?',
          options: [
            'A 2:1 gravitational orbital resonance with the moon Mimas',
            'Atmospheric friction with Saturn',
            'A comet impact that blew a hole in the ring',
            'Magnetic repulsion from Saturn’s poles',
          ],
          correctIndex: 0,
          explanation: 'Particles in the Cassini Division complete 2 orbits for every 1 orbit of the moon Mimas, receiving regular gravitational perturbations that clear the gap.',
        },
      },
    ],
  },

  {
    id: 'course-ice-giants',
    title: 'The Ice Giants: Uranus & Neptune',
    category: 'Planetary Science',
    celestialId: 'uranus',
    level: 'Advanced',
    totalLessons: 2,
    xpTotal: 250,
    icon: '💎',
    tagline: 'Supercritical Mantles, Diamond Rain & Methane Skies',
    description: 'Investigate the interior structures, supersonic winds, and extreme axial dynamics of our system’s outer worlds.',
    lessons: [
      {
        id: 'ice-1',
        title: 'Mantle Physics & Diamond Precipitation',
        duration: '8 min',
        xpReward: 125,
        summary: 'How extreme pressures compress methane into solid diamond rain.',
        content: [
          'Unlike Jupiter and Saturn (gas giants), Uranus and Neptune are Ice Giants: their mass is dominated by heavier volatiles like water, ammonia, and methane.',
          'Deep inside their mantles, pressures reach millions of atmospheres and temperatures exceed 4,000 K, creating a supercritical fluid ocean.',
          'Pyrolysis of methane separates carbon atoms, compressing them into diamond crystals that precipitate downward toward the rocky core.',
        ],
        checkpointQuestion: {
          question: 'Why are Uranus and Neptune classified as "Ice Giants" rather than "Gas Giants"?',
          options: [
            'Their bulk mass is dominated by heavier water, methane, and ammonia volatiles rather than hydrogen-helium',
            'They are completely frozen solid with zero internal heat',
            'They orbit outside the Solar System',
            'They have giant snowstorms on their surface',
          ],
          correctIndex: 0,
          explanation: 'Astrophysicists distinguish ice giants because their interiors are composed primarily of water, methane, and ammonia "ices" under high pressure, unlike the hydrogen-helium dominance of Jupiter and Saturn.',
        },
      },
      {
        id: 'ice-2',
        title: 'Neptune’s Supersonic Winds & Internal Heat',
        duration: '7 min',
        xpReward: 125,
        summary: 'Why the coldest planet in the Solar System unleashes the most violent 2,100 km/h winds.',
        content: [
          'Neptune receives 900 times less sunlight than Earth, yet its equatorial winds roar at Mach 1.7 (2,100 km/h).',
          'Unlike Uranus, Neptune radiates 2.61 times as much energy into space as it absorbs from the Sun.',
          'This deep primordial heat flux drives vigorous internal convection with minimal frictional drag, generating supersonic atmospheric jet streams.',
        ],
        checkpointQuestion: {
          question: 'What powers Neptune’s Mach 1.7 supersonic jet streams despite receiving very little sunlight?',
          options: [
            'Gravitational tides from Pluto',
            'Vigorous internal primordial heat radiation from its core',
            'Solar magnetic field lines',
            'Volcanic eruptions on Triton',
          ],
          correctIndex: 1,
          explanation: 'Neptune emits 2.61 times more heat from its interior than it receives from sunlight, powering powerful convective currents with minimal friction.',
        },
      },
    ],
  },

  {
    id: 'course-milky-way',
    title: 'The Milky Way & Deep Cosmos',
    category: 'Cosmology',
    celestialId: 'sun',
    level: 'Advanced',
    totalLessons: 2,
    xpTotal: 300,
    icon: '🌌',
    tagline: 'Spiral Arms, Sagittarius A* & Cosmic Scales',
    description: 'Travel from our Orion Cygnus arm into the central supermassive black hole at the heart of our home galaxy.',
    lessons: [
      {
        id: 'mw-1',
        title: 'Spiral Structure & the Galactic Year',
        duration: '9 min',
        xpReward: 150,
        summary: 'Our Solar System’s 230-million-year orbit around the Milky Way core.',
        content: [
          'The Milky Way is a barred spiral galaxy spanning 100,000 light-years and containing over 200 billion stars.',
          'Our Solar System is situated in the Orion-Cygnus spur, approximately 26,000 light-years from the galactic center.',
          'At a speed of 230 km/s, it takes our Sun 230 million years to complete one single Galactic Year orbit around the galaxy.',
        ],
        checkpointQuestion: {
          question: 'Approximately how long does it take our Solar System to complete one orbit around the Milky Way (a Galactic Year)?',
          options: ['1 million years', '230 million years', '4.6 billion years', '10,000 years'],
          correctIndex: 1,
          explanation: 'Traveling at approximately 230 km/s (828,000 km/h), the Solar System requires roughly 230 million Earth years to complete one full revolution around the galactic core.',
        },
      },
      {
        id: 'mw-2',
        title: 'Sagittarius A* Supermassive Black Hole',
        duration: '10 min',
        xpReward: 150,
        summary: 'The 4.3-million-solar-mass gravitational anchor of our galaxy.',
        content: [
          'At the precise gravitational center of the Milky Way lies Sagittarius A* (Sgr A*), a supermassive black hole.',
          'Sgr A* contains the mass of 4.3 million Suns compressed within an event horizon radius smaller than Mercury’s orbit.',
          'Direct radio imaging by the Event Horizon Telescope (EHT) confirmed the glowing photon ring of plasma swirling at relativistic speeds around the shadow.',
        ],
        checkpointQuestion: {
          question: 'What is the mass of the supermassive black hole Sagittarius A* at the center of the Milky Way?',
          options: ['100 Suns', '4.3 million solar masses', '1 billion solar masses', 'Equal to the Earth'],
          correctIndex: 1,
          explanation: 'Decades of infrared tracking of stars orbiting Sgr A* (Nobel Prize in Physics 2020) and EHT imaging confirmed its mass is 4.3 million times that of our Sun.',
        },
      },
    ],
  },
];

