export interface TrekLandmarkFeature {
  name: string;
  lat: number;
  lon: number;
  elevationKm?: number;
  description: string;
  scientificSignificance: string;
}

export interface VocabularyTerm {
  term: string;
  definition: string;
  lauraAnalogy?: string;
}

export interface ScientificDiagram {
  title: string;
  type: string;
  caption: string;
  elements: Array<{ label: string; description: string; value?: string; color?: string }>;
}

export interface RealMissionExample {
  missionName: string;
  launchYear: string;
  agency: string;
  keyContribution: string;
}

export interface Lesson3DVisualizationConfig {
  type:
    | 'trek-surface'
    | 'solar-corona'
    | 'planetary-cutaway'
    | 'spacecraft-orbit'
    | 'dna-molecule'
    | 'magnetosphere'
    | 'milky-way';
  targetBody?: string;
  title?: string;
  annotations?: Array<{ label: string; position: [number, number, number]; note: string }>;
}

export interface OsdrStudyRef {
  accession: string;
  title: string;
  organism: string;
  mission: string;
  assayType: string;
  keyFinding: string;
  osdrUrl: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  xpReward: number;
  summary: string;
  content: string[];
  objectives?: string[];
  disciplineId?: string;
  visualization3D?: Lesson3DVisualizationConfig;
  nasaImagery?: {
    url: string;
    title: string;
    credit: string;
    caption: string;
    datasetSource?: string;
  };
  scientificDiagram?: ScientificDiagram;
  realMissionExamples?: RealMissionExample[];
  missions?: string[];
  discoveries?: string[];
  references?: string[];
  trekBody?: 'mars' | 'moon' | 'mercury' | 'titan' | 'ceres' | 'vesta';
  trekFeatures?: TrekLandmarkFeature[];
  vocabulary?: VocabularyTerm[];
  osdrStudy?: OsdrStudyRef;
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
  disciplineId?: string;
  celestialId: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  totalLessons: number;
  xpTotal: number;
  icon: string;
  tagline: string;
  description: string;
  lessons: Lesson[];
}

export interface DisciplineCategory {
  id: string;
  label: string;
  icon: string;
  badgeTone: 'cyan' | 'amber' | 'violet' | 'emerald' | 'blue';
  description: string;
}

export const DISCIPLINE_CATEGORIES: DisciplineCategory[] = [
  { id: 'all', label: 'All Disciplines', icon: '🌌', badgeTone: 'cyan', description: 'Complete NASA-powered space science curriculum' },
  { id: 'astronomy', label: 'Astronomy', icon: '🔭', badgeTone: 'cyan', description: 'Astrophysics, electromagnetic spectrum & stellar lifecycles' },
  { id: 'solar-system', label: 'Solar System', icon: '🪐', badgeTone: 'cyan', description: 'Nebula accretion, frost line & gravitational mechanics' },
  { id: 'sun', label: 'The Sun', icon: '☀️', badgeTone: 'amber', description: 'Nuclear fusion, coronal loops & solar plasma dynamo' },
  { id: 'planets', label: 'Planets', icon: '🪐', badgeTone: 'cyan', description: 'Comparative planetology, differentiation & atmospheres' },
  { id: 'moons', label: 'Moons', icon: '🌕', badgeTone: 'cyan', description: 'Ocean worlds, cryovolcanism & lunar regolith geology' },
  { id: 'milky-way', label: 'Milky Way', icon: '🌌', badgeTone: 'violet', description: 'Sagittarius A* supermassive core & galactic spiral dynamics' },
  { id: 'geology', label: 'Planetary Geology', icon: '🌋', badgeTone: 'amber', description: 'Volcanism, impact cratering & tectonic rift systems' },
  { id: 'exploration', label: 'Space Exploration', icon: '🚀', badgeTone: 'blue', description: 'Hohmann transfer orbits, gravity assists & deep space telemetry' },
  { id: 'space-biology', label: 'Space Biology', icon: '🧬', badgeTone: 'emerald', description: 'NASA OSDR, GeneLab & cellular microgravity genetics' },
  { id: 'climate', label: 'Climate Science', icon: '🌍', badgeTone: 'emerald', description: 'Planetary radiative balance, greenhouse gases & NASA GIBS' },
  { id: 'space-weather', label: 'Space Weather', icon: '⚡', badgeTone: 'amber', description: 'CMEs, geomagnetic storm Kp alerts & NASA DONKI' },
  { id: 'human-spaceflight', label: 'Human Spaceflight', icon: '👨‍🚀', badgeTone: 'blue', description: 'ECLSS life support loops, radiation shielding & habitats' },
];

export const ASTRONOMY_COURSES: Course[] = [
  // 1. Astronomy
  {
    id: 'course-astronomy',
    title: 'Observational Astronomy & Astrophysical Foundations',
    category: 'Astronomy',
    disciplineId: 'astronomy',
    celestialId: 'astronomy',
    level: 'Intermediate',
    totalLessons: 2,
    xpTotal: 300,
    icon: '🔭',
    tagline: 'Multi-Wavelength Astrophysics & Stellar Lifecycles',
    description: 'Investigate the electromagnetic spectrum, space observatories (Hubble, JWST, Chandra), and the Hertzsprung-Russell diagram of stellar evolution.',
    lessons: [
      {
        id: 'astro-1',
        title: 'The Electromagnetic Spectrum & Space Telescopes',
        duration: '7 min',
        xpReward: 150,
        disciplineId: 'astronomy',
        summary: 'Why modern astrophysics relies on infrared, X-ray, and ultraviolet space telescopes to penetrate interstellar dust.',
        objectives: [
          'Explain how light wavelengths vary across the electromagnetic spectrum',
          'Describe atmospheric absorption windows that necessitate space observatories',
          'Analyze infrared penetration through interstellar molecular clouds with JWST',
        ],
        visualization3D: {
          type: 'milky-way',
          title: 'Deep Space Galaxy & Cosmic Redshift',
          annotations: [
            { label: 'Galactic Core', position: [0, 0, 0], note: 'Supermassive black hole emission region visible in radio and X-ray.' },
            { label: 'Spiral Arm Dust', position: [2.5, 0, 1.2], note: 'Dense polycyclic aromatic hydrocarbons opaque to visible photons.' },
          ],
        },
        scientificDiagram: {
          title: 'Electromagnetic Spectrum & Transmission Windows',
          type: 'spectrum',
          caption: 'Atmospheric opacity across gamma, X-ray, UV, visible, infrared, and radio bands.',
          elements: [
            { label: 'Gamma & X-Ray', description: 'Completely blocked by atmosphere; observed by Chandra & Fermi.', value: 'λ < 10 nm', color: '#8B5CF6' },
            { label: 'Ultraviolet', description: 'Blocked by stratospheric ozone; observed by Hubble STIS.', value: '10 - 400 nm', color: '#3B82F6' },
            { label: 'Visible Light', description: 'Narrow optical atmospheric window reaching Earth ground.', value: '400 - 700 nm', color: '#10B981' },
            { label: 'Infrared', description: 'Partially absorbed by water vapor; observed by JWST & Spitzer.', value: '0.7 - 300 μm', color: '#F59E0B' },
          ],
        },
        realMissionExamples: [
          { missionName: 'James Webb Space Telescope (JWST)', launchYear: '2021', agency: 'NASA / ESA / CSA', keyContribution: 'First high-resolution infrared spectra of atmospheric carbon dioxide and water on exoplanets.' },
          { missionName: 'Hubble Space Telescope', launchYear: '1990', agency: 'NASA / ESA', keyContribution: 'Determined the expansion rate of the universe (Hubble constant).' },
        ],
        nasaImagery: {
          url: 'https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg',
          title: 'Carina Nebula Pillars of Creation in Deep Infrared',
          credit: 'NASA, ESA, CSA, and STScI',
          caption: 'JWST NIRCam composite revealing star formation embedded inside gas pillars.',
        },
        vocabulary: [
          { term: 'Cosmological Redshift', definition: 'The lengthening of light waves caused by the metric expansion of spacetime.', lauraAnalogy: 'Think of drawing waves on a rubber balloon—as you inflate the balloon, the waves stretch out to longer, redder sizes.' },
          { term: 'Interstellar Extinction', definition: 'The scattering and absorption of photons by microscopic dust grains in the interstellar medium.', lauraAnalogy: 'Like driving through dense fog with headlights—blue light scatters, but long infrared rays cut right through.' },
        ],
        content: [
          'Photons are ripples in electromagnetic fields ranging from picometer-wavelength gamma rays to kilometer-long radio waves.',
          'Earth’s atmosphere protects life by shielding harmful ionizing gamma, X-ray, and ultraviolet radiation, but this same shielding blinds ground-based astronomers to most of the cosmic symphony.',
          'By placing telescopes like Hubble, Chandra, and JWST beyond atmospheric absorption bands, NASA captures pristine data across all wavelengths, unveiling early protogalaxies and cold interstellar chemistry.',
        ],
        checkpointQuestion: {
          question: 'Why are infrared space telescopes like JWST uniquely capable of observing newborn stars inside dust clouds?',
          options: [
            'Infrared wavelengths are longer and pass through dust grains without scattering',
            'Infrared cameras make space colder so telescopes run faster',
            'Visible light cannot travel through a vacuum',
            'Dust clouds absorb all radio waves but emit gamma rays',
          ],
          correctIndex: 0,
          explanation: 'Interstellar dust grains are roughly the size of visible light wavelengths, causing heavy scattering. Longer infrared photons pass directly through without being scattered.',
        },
      },
      {
        id: 'astro-2',
        title: 'Stellar Evolution & the Hertzsprung-Russell Diagram',
        duration: '8 min',
        xpReward: 150,
        disciplineId: 'astronomy',
        summary: 'How mass dictates a star’s birth, Main Sequence fusion, and ultimate fate as a white dwarf, neutron star, or black hole.',
        objectives: [
          'Map stellar temperature versus luminosity on the H-R diagram',
          'Describe hydrostatic equilibrium balancing gravity and thermal radiation pressure',
          'Contrast the lifespans of massive O-type stars with low-mass red M-dwarfs',
        ],
        visualization3D: {
          type: 'solar-corona',
          title: 'Main Sequence Stellar Plasma & Core Fusion',
          annotations: [
            { label: 'Radiative Shell', position: [0, 0, 0], note: 'Photons take 100,000 years to diffuse outward through dense plasma.' },
            { label: 'Photosphere', position: [2.2, 0, 0], note: 'The 5,778 K visible emission surface of a G-type Main Sequence star.' },
          ],
        },
        scientificDiagram: {
          title: 'Hertzsprung-Russell Diagram Tracks',
          type: 'hr-diagram',
          caption: 'Stellar luminosity vs surface temperature for Main Sequence, Giants, and White Dwarfs.',
          elements: [
            { label: 'Main Sequence', description: 'Core hydrogen fusion in hydrostatic equilibrium (90% of stellar life).', value: 'Sun, Vega, Proxima', color: '#38BDF8' },
            { label: 'Red Giants', description: 'Core hydrogen exhausted; shell burning causes envelope expansion.', value: 'Betelgeuse, Aldebaran', color: '#EF4444' },
            { label: 'White Dwarfs', description: 'Electron-degenerate carbon-oxygen cores radiating residual heat.', value: 'Sirius B', color: '#E0E7FF' },
          ],
        },
        realMissionExamples: [
          { missionName: 'ESA Gaia Astrometry Mission', launchYear: '2013', agency: 'ESA / NASA participation', keyContribution: 'Charted precise distance and luminosity for 1.8 billion stars, refining the observational H-R diagram.' },
          { missionName: 'Kepler Space Telescope', launchYear: '2009', agency: 'NASA', keyContribution: 'Surveyed stellar variability and discovered thousands of transiting exoplanets.' },
        ],
        vocabulary: [
          { term: 'Hydrostatic Equilibrium', definition: 'The stable balance between inward gravitational force and outward thermal radiation pressure in a star.', lauraAnalogy: 'Like a beach ball held underwater—the upward pressure of the water balances the downward force pushing it down.' },
          { term: 'Chandrasekhar Limit', definition: 'The maximum mass (~1.44 solar masses) of a stable white dwarf supported by electron degeneracy pressure.', lauraAnalogy: 'The absolute structural weight limit before the atomic foundations give way.' },
        ],
        content: [
          'A star spends 90% of its active life on the Main Sequence, fusing hydrogen into helium in its core while maintained in hydrostatic equilibrium.',
          'A star’s initial mass is its absolute destiny: massive O-type stars burn through their fuel in a few million years and explode as core-collapse supernovae, while modest stars like our Sun live for 10 billion years before gently expelling planetary nebulae.',
          'The remaining core cools forever as a dense, Earth-sized white dwarf supported by quantum electron degeneracy pressure.',
        ],
        checkpointQuestion: {
          question: 'What physical condition keeps a Main Sequence star at a constant radius for billions of years?',
          options: [
            'Hydrostatic equilibrium between inward gravity and outward thermal radiation pressure',
            'Magnetic containment from galactic spiral arms',
            'Centrifugal force from rapid rotation',
            'Electrostatic repulsion of planetary orbits',
          ],
          correctIndex: 0,
          explanation: 'Hydrostatic equilibrium occurs when the inward gravitational pull is precisely balanced by the outward thermal gas and radiation pressure generated by core nuclear fusion.',
        },
      },
    ],
  },

  // 2. Solar System
  {
    id: 'course-solar-system',
    title: 'Introduction to the Solar System',
    category: 'Solar System',
    disciplineId: 'solar-system',
    celestialId: 'solar-system',
    level: 'Beginner',
    totalLessons: 3,
    xpTotal: 300,
    icon: '🪐',
    tagline: 'Gravitational Architecture of our Cosmic Neighborhood',
    description: 'Explore the formation of our planetary system 4.6 billion years ago from a collapsing molecular cloud and learn how gravity organizes orbits.',
    lessons: [
      {
        id: 'ss-1',
        title: 'The Solar Nebula Hypothesis',
        duration: '6 min',
        xpReward: 100,
        disciplineId: 'solar-system',
        summary: 'How an interstellar cloud of gas and dust collapsed under gravity to ignite our Sun.',
        objectives: [
          'Explain the gravitational collapse of a giant molecular cloud',
          'Describe how angular momentum conservation forms a circumstellar accretion disk',
          'Identify the threshold conditions required for thermonuclear hydrogen fusion',
        ],
        visualization3D: {
          type: 'spacecraft-orbit',
          title: 'Circumstellar Accretion Disk Model',
          annotations: [
            { label: 'Protostellar Core', position: [0, 0, 0], note: 'Dense gravitational center accumulating 99.8% of system mass.' },
            { label: 'Accretion Plane', position: [3, 0, 0], note: 'Keplerian disk where planetesimals collide and grow.' },
          ],
        },
        scientificDiagram: {
          title: 'Solar Nebula Collapse Sequence',
          type: 'process-flow',
          caption: 'Transition from diffuse molecular cloud to rotating protoplanetary disk.',
          elements: [
            { label: 'Giant Molecular Cloud', description: 'Cold diffuse interstellar gas destabilized by nearby supernova shock.', value: 'T ~ 10-20 K', color: '#60A5FA' },
            { label: 'Gravitational Infall', description: 'Conservation of angular momentum accelerates rotational spin.', value: 'Spin Up', color: '#F59E0B' },
            { label: 'Protostar Ignition', description: 'Core compression pushes temperature past 10 million Kelvin.', value: 'T > 10^7 K', color: '#EF4444' },
          ],
        },
        missions: ['IRAS Infrared Astronomical Satellite', 'Spitzer Space Telescope', 'ALMA Protoplanetary Survey'],
        discoveries: [
          'Direct imaging of HL Tauri protoplanetary dust rings by ALMA',
          'Primitive chondritic meteorites retaining primordial solar nebula isotopic ratios',
        ],
        references: ['NASA Planetary Data System (PDS)', 'Safronov (1972) Evolution of Protoplanetary Cloud'],
        vocabulary: [
          { term: 'Protoplanetary Disk', definition: 'A rotating circumstellar disk of dense gas and dust surrounding a newly formed protostar.', lauraAnalogy: 'Like spinning pizza dough—the faster you spin it, the flatter and wider it spreads out.' },
          { term: 'Angular Momentum', definition: 'A conserved physical quantity in rotating systems proportional to mass, radius, and rotation rate.', lauraAnalogy: 'Like an ice skater pulling her arms inward to spin dramatically faster.' },
        ],
        content: [
          '4.6 billion years ago, a shockwave from a nearby supernova triggered the gravitational collapse of a giant molecular cloud in the interstellar medium.',
          'As the cloud collapsed, conservation of angular momentum caused it to spin faster and flatten into a circumstellar protoplanetary disk spanning tens of astronomical units.',
          'At the dense center, gravitational compression drove core temperatures past 10 million Kelvin, triggering thermonuclear hydrogen fusion and igniting Sol as a Main Sequence star.',
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
        disciplineId: 'solar-system',
        summary: 'Why rocky worlds formed close to the Sun while gas giants accreted beyond the frost line.',
        objectives: [
          'Locate the thermodynamic frost line in the primordial solar nebula',
          'Differentiate condensation temperatures of silicates versus volatile ices',
          'Understand core accretion runaway gas capture for Jupiter and Saturn',
        ],
        visualization3D: {
          type: 'planetary-cutaway',
          title: 'Planetary Density Differentiation',
          annotations: [
            { label: 'Metallic Core', position: [0, 0, 0], note: 'Dense iron-nickel segregated under early gravitational melting.' },
            { label: 'Silicate Mantle', position: [1.5, 0, 0], note: 'Solid rocky layer forming rocky inner terrestrial worlds.' },
          ],
        },
        scientificDiagram: {
          title: 'Thermodynamic Frost Line Partition',
          type: 'frost-line',
          caption: 'Inner refractory silicate worlds vs outer volatile hydrogen/helium gas giants.',
          elements: [
            { label: 'Silicate Zone', description: 'Refractory metals and rocky minerals condense at T > 500 K.', value: '< 2.7 AU', color: '#EF4444' },
            { label: 'Frost Line', description: 'Thermal threshold where water, methane, and ammonia freeze solid.', value: '~2.7 AU', color: '#00E5FF' },
            { label: 'Gas Giant Zone', description: 'Abundant ices build 10-Earth-mass cores that capture vast envelopes.', value: '> 2.7 AU', color: '#38BDF8' },
          ],
        },
        missions: ['Voyager 1 & 2', 'Pioneer 10 & 11', 'Juno Mission to Jupiter'],
        discoveries: [
          'Identification of the 2.7 AU snow line dividing inner silicates from volatile clathrates',
          'Juno gravity measurements confirming a diffuse, dilute core inside Jupiter',
        ],
        references: ['Lodders (2003) Solar System Abundances and Condensation Temperatures', 'NASA Solar System Exploration'],
        content: [
          'The Frost Line (at approximately 2.7 AU) separated the warm inner Solar System from the cold outer system.',
          'Inside the frost line, only dense refractory materials like silicates, iron, and nickel could condense, forming small rocky worlds (Mercury, Venus, Earth, Mars).',
          'Beyond the frost line, volatile compounds like water, methane, and ammonia froze into solid ices, providing 10 times more solid mass and allowing giant proto-cores to rapidly capture vast hydrogen-helium envelopes.',
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
        title: 'The Kuiper Belt, Oort Cloud & Asteroid Dynamics',
        duration: '7 min',
        xpReward: 100,
        disciplineId: 'solar-system',
        summary: 'The frozen remnants of planet formation orbiting on the fringes of interstellar space.',
        objectives: [
          'Distinguish the Main Asteroid Belt from the trans-Neptunian Kuiper Belt',
          'Explain the spherical morphology and Oort cloud comet reservoirs',
          'Detail the New Horizons encounter with Pluto and Arrokoth',
        ],
        visualization3D: {
          type: 'spacecraft-orbit',
          title: 'Outer Orbital Reservoirs & Comet Trajectories',
        },
        missions: ['New Horizons', 'Dawn Mission (Vesta & Ceres)', 'Rosetta & Philae'],
        discoveries: [
          'New Horizons high-res images of contact-binary planetesimal Arrokoth',
          'Dawn discovery of subsurface brine reservoirs and cryomagma on dwarf planet Ceres',
        ],
        references: ['Stern et al. (2019) Initial results from New Horizons exploration of 2014 MU69, Science'],
        content: [
          'The Solar System does not end at Neptune. Beyond 30 AU lies the Kuiper Belt, a vast disc of icy remnants including dwarf planets Pluto, Haumea, and Makemake.',
          'Even further out, stretching nearly halfway to the nearest star (100,000 AU), lies the hypothetical Oort Cloud, a giant spherical shell containing trillions of icy cometesimals.',
        ],
        checkpointQuestion: {
          question: 'Which NASA spacecraft provided the first close-up exploration of Pluto and the Kuiper Belt object Arrokoth?',
          options: ['Voyager 1', 'New Horizons', 'Cassini', 'Galileo'],
          correctIndex: 1,
          explanation: 'NASA’s New Horizons flew past Pluto in July 2015 and later flew past the primordial Kuiper Belt contact binary Arrokoth in January 2019.',
        },
      },
    ],
  },

  // 3. The Sun
  {
    id: 'course-the-sun',
    title: 'Understanding the Sun: Solar Physics & Plasma Dynamics',
    category: 'The Sun',
    disciplineId: 'sun',
    celestialId: 'sun',
    level: 'Intermediate',
    totalLessons: 2,
    xpTotal: 250,
    icon: '☀️',
    tagline: 'Thermonuclear Core, Coronal Heating & Space Weather',
    description: 'Explore the nuclear fusion furnace at the heart of our star, its convective plasma dynamo, and the solar wind.',
    lessons: [
      {
        id: 'sun-1',
        title: 'The Core & Thermonuclear Fusion',
        duration: '7 min',
        xpReward: 125,
        disciplineId: 'sun',
        summary: 'How 600 million tons of hydrogen are fused into helium every second in the solar core.',
        objectives: [
          'Trace the step-by-step proton-proton (p-p) nuclear fusion chain',
          'Calculate solar energy generation from mass defect using E = mc²',
          'Explain how radiative diffusion takes ~100,000 years for photons to escape to the surface',
        ],
        visualization3D: {
          type: 'solar-corona',
          title: 'Solar Core & Coronal Field Arcs',
          annotations: [
            { label: 'Thermonuclear Core', position: [0, 0, 0], note: '15.7 million K; pressure 250 billion atm.' },
            { label: 'Convection Zone', position: [1.8, 0, 0], note: 'Boiling plasma cells carrying thermal energy upward.' },
          ],
        },
        scientificDiagram: {
          title: 'Proton-Proton Nuclear Fusion Chain',
          type: 'nuclear-fusion',
          caption: 'Fusion of 4 protons into Helium-4 releasing positrons, neutrinos, and gamma photons.',
          elements: [
            { label: 'Proton Collision', description: 'Two ¹H protons overcome Coulomb repulsion via quantum tunneling.', value: '¹H + ¹H', color: '#38BDF8' },
            { label: 'Deuterium Formation', description: 'One proton undergoes beta decay into a neutron, emitting a positron and neutrino.', value: '²H + e⁺ + νₑ', color: '#10B981' },
            { label: 'Helium-3 Creation', description: 'Deuteron captures another proton to form Helium-3 and gamma ray.', value: '³He + γ', color: '#F59E0B' },
            { label: 'Helium-4 Synthesis', description: 'Two ³He nuclei fuse into stable ⁴He, ejecting two free protons.', value: '⁴He + 2 ¹H', color: '#EF4444' },
          ],
        },
        missions: ['Parker Solar Probe', 'SOHO (Solar and Heliospheric Observatory)', 'Solar Dynamics Observatory (SDO)'],
        discoveries: [
          'Detection of solar neutrinos confirming core thermonuclear fusion rates',
          'Parker Solar Probe direct flight through the Alfvén critical surface into the corona (2021)',
        ],
        references: ['Bahcall (1989) Neutrino Astrophysics, Cambridge University Press', 'NASA Heliophysics System Observatory'],
        vocabulary: [
          { term: 'Quantum Tunneling', definition: 'A quantum mechanical phenomenon where subatomic particles cross a potential energy barrier higher than their kinetic energy.', lauraAnalogy: 'Like walking straight through a solid brick wall because your wave probability allows you to appear on the other side.' },
          { term: 'Radiative Zone', definition: 'The interior solar shell where energy travels outward primarily through photon radiative diffusion.', lauraAnalogy: 'Like trying to walk through a stadium packed with millions of jostling fans—you bounce around for thousands of steps before reaching an exit.' },
        ],
        content: [
          'At the center of our star, temperatures exceed 15.7 million Kelvin and pressure reaches 250 billion times atmospheric pressure on Earth.',
          'Under these conditions, quantum tunneling allows protons to overcome mutual electrostatic repulsion, initiating the proton-proton fusion chain.',
          'Every second, the Sun converts 600 million tons of hydrogen into 596 million tons of helium. The missing 4 million tons of mass are converted into pure radiant energy ($E = mc^2$).',
        ],
        checkpointQuestion: {
          question: 'What happens to the 4 million tons of mass lost by the Sun every second during core fusion?',
          options: [
            'It is converted into pure radiant energy according to E = mc²',
            'It falls into a mini black hole at the center',
            'It evaporates into dark energy',
            'It transforms into heavy iron meteorites',
          ],
          correctIndex: 0,
          explanation: 'Mass defect: the fused Helium-4 nucleus has 0.7% less mass than the four individual protons combined. This mass difference is converted directly into energy via Einstein’s equation E = mc².',
        },
      },
      {
        id: 'sun-2',
        title: 'The Magnetic Dynamo & Parker Solar Probe',
        duration: '8 min',
        xpReward: 125,
        disciplineId: 'sun',
        summary: 'How differential solar rotation winds magnetic field lines, triggering sunspots, flares, and CMEs.',
        objectives: [
          'Explain the solar dynamo mechanism caused by differential rotation (tachocline)',
          'Track the 11-year solar sunspot cycle and magnetic polarity reversals',
          'Analyze Parker Solar Probe data on magnetic switchbacks and coronal heating',
        ],
        visualization3D: {
          type: 'solar-corona',
          title: 'Dynamic Coronal Magnetic Loop System',
        },
        missions: ['Parker Solar Probe', 'Solar Orbiter (ESA/NASA)', 'STEREO'],
        discoveries: [
          'Parker Solar Probe discovery of magnetic switchbacks in the inner solar wind',
          'Solar Orbiter high-resolution imaging of ubiquitous coronal "campfires"',
        ],
        references: ['Bale et al. (2019) Highly structured slow solar wind emerging from an equatorial coronal hole, Nature'],
        content: [
          'Because the Sun is gaseous plasma rather than solid rock, its equator rotates faster (25 days) than its poles (35 days). This differential rotation drags and twists magnetic field lines like coiled rubber bands.',
          'Eventually, the twisted magnetic flux ropes erupt through the photosphere, suppressing convection and creating cool, dark sunspots with intense local fields.',
          'When these field lines suddenly snap and reconnect, they unleash solar flares and coronal mass ejections that blast trillions of tons of ionized plasma across the solar system.',
        ],
        checkpointQuestion: {
          question: 'What causes the Sun’s magnetic field lines to become violently twisted every 11 years?',
          options: [
            'Differential rotation: the equator spins faster than the poles',
            'Gravitational pull from distant Jupiter',
            'Radioactive decay of solar iron',
            'Seasonal changes in solar orbit',
          ],
          correctIndex: 0,
          explanation: 'The Sun rotates differentially (faster at the equator than at the poles), which continually shears, twists, and winds magnetic field lines until they become unstable and trigger the 11-year solar cycle.',
        },
      },
    ],
  },

  // 4. Planetary Geology
  {
    id: 'course-planetary-geology',
    title: 'Planetary Geology: Volcanism, Tectonics & Cartography',
    category: 'Planetary Geology',
    disciplineId: 'geology',
    celestialId: 'geology',
    level: 'Advanced',
    totalLessons: 2,
    xpTotal: 300,
    icon: '🌋',
    tagline: 'Calderas, Rift Valleys & Impact Stratigraphy',
    description: 'Explore extraterrestrial geological landforms using USGS and NASA Trek high-resolution elevation datasets.',
    lessons: [
      {
        id: 'geo-1',
        title: 'Shield Calderas & Volcanism on Mars',
        duration: '9 min',
        xpReward: 150,
        disciplineId: 'geology',
        summary: 'Why Olympus Mons grew three times taller than Mount Everest and how stationary mantle plumes operate.',
        objectives: [
          'Contrast basaltic shield volcanism with explosive silica-rich stratovolcanoes',
          'Examine the absence of plate tectonics on Mars and stationary mantle hotspot plumes',
          'Explore NASA Mars Trek digital elevation models of the Olympus Mons summit caldera',
        ],
        visualization3D: {
          type: 'trek-surface',
          targetBody: 'mars',
          title: 'Mars Global Topography & Volcanoes',
          annotations: [
            { label: 'Olympus Mons', position: [2.1, 0.4, 0.5], note: '22 km elevation; 600 km basal diameter.' },
            { label: 'Tharsis Montes', position: [1.8, -0.2, 0.8], note: 'Three aligned shield volcanoes on the Tharsis volcanic plateau.' },
          ],
        },
        scientificDiagram: {
          title: 'Volcanic Caldera Stacking Mechanism',
          type: 'geology-cutaway',
          caption: 'Stationary Martian hotspot vs migrating Earth plate tectonic hotspot chain.',
          elements: [
            { label: 'Martian Stationary Hotspot', description: 'Mantle plume feeds the exact same surface location for 500+ million years.', value: 'Olympus Mons (22 km)', color: '#EF4444' },
            { label: 'Earth Migrating Plate', description: 'Moving lithosphere creates a chain of smaller volcanoes (Hawaiian-Emperor chain).', value: 'Mauna Kea (10.2 km base-to-peak)', color: '#38BDF8' },
          ],
        },
        trekBody: 'mars',
        trekFeatures: [
          {
            name: 'Olympus Mons Caldera',
            lat: 18.65,
            lon: -133.8,
            elevationKm: 21.9,
            description: 'The largest known volcano in the Solar System, covering an area the size of France.',
            scientificSignificance: 'Demonstrates low gravity (0.38 g) and the absence of crustal plate motion on ancient Mars.',
          },
          {
            name: 'Ascraeus Mons',
            lat: 11.9,
            lon: -104.5,
            elevationKm: 18.2,
            description: 'The northernmost volcano of the Tharsis Montes volcanic chain.',
            scientificSignificance: 'Exhibits complex nested summit calderas formed through repeated magma chamber drainages.',
          },
        ],
        missions: ['Mars Reconnaissance Orbiter (HiRISE)', 'Mars Express (HRSC)', 'Mars Global Surveyor (MOLA)'],
        discoveries: [
          'MOLA laser altimeter measurement confirming Olympus Mons summit rises 21.9 km above Mars datum',
          'Radar detection of lava tube skylights that could shelter future human explorers',
        ],
        references: ['Carr (2006) The Surface of Mars, Cambridge Planetary Science', 'NASA Mars Trek Portal'],
        vocabulary: [
          { term: 'Shield Volcano', definition: 'A broad, domed volcano with gently sloping sides formed by low-viscosity basaltic lava flows.', lauraAnalogy: 'Like pouring warm pancake syrup onto a table—it spreads out wide and flat rather than building a steep peak.' },
          { term: 'Mantle Plume', definition: 'An upwelling of abnormally hot rock within the planetary mantle that melts crust to create localized volcanism.', lauraAnalogy: 'Like a blowtorch held beneath a sheet of metal.' },
        ],
        content: [
          'Rising 22 kilometers above the surrounding plains, Olympus Mons is the undisputed king of volcanism in our Solar System.',
          'On Earth, tectonic plates continuously glide over mantle hotspots, producing chains of separate islands like Hawaii. On Mars, the thick, rigid crust remained stationary over a fixed mantle plume for hundreds of millions of years.',
          'Combined with Mars’s lower gravity (0.38 g), basaltic lava poured out across the same coordinates over and over, building an immense shield structure 600 kilometers in diameter.',
        ],
        checkpointQuestion: {
          question: 'Why was Olympus Mons able to grow to over 21 kilometers in height compared to Earth’s volcanoes?',
          options: [
            'Mars lacks mobile tectonic plates, so lava stacked in one location over a stationary hotspot for millions of years',
            'Martian lava is lighter than air and floated upward',
            'Solar wind deposited rocky dust directly onto the mountain peak',
            'Alien civilizations quarried and constructed the mountain',
          ],
          correctIndex: 0,
          explanation: 'Because Mars lacks plate tectonics, its crust never moved away from the underlying mantle plume hotspot, allowing continuous lava flows to stack up over hundreds of millions of years in lower gravity.',
        },
      },
      {
        id: 'geo-2',
        title: 'Valles Marineris: The Grand Canyon of Mars',
        duration: '8 min',
        xpReward: 150,
        disciplineId: 'geology',
        summary: 'A 4,000 km tectonic rift valley that cuts across a quarter of the Martian circumference.',
        objectives: [
          'Analyze the tectonic extensional forces that tore open Valles Marineris',
          'Inspect landslide debris lobes and wall stratigraphy using NASA Trek',
          'Evaluate ancient hydrologic activity and layered sulfate deposits in canyon floor chasmata',
        ],
        visualization3D: {
          type: 'trek-surface',
          targetBody: 'mars',
          title: 'Valles Marineris Chasma Topography',
        },
        trekBody: 'mars',
        trekFeatures: [
          {
            name: 'Melas Chasma',
            lat: -9.8,
            lon: -76.4,
            elevationKm: -8.5,
            description: 'The widest and deepest central depression of the Valles Marineris system.',
            scientificSignificance: 'Rich in layered sulfate minerals formed in ancient standing bodies of water.',
          },
        ],
        missions: ['Viking 1 & 2', 'Mars Odyssey (THEMIS)', 'Mars Reconnaissance Orbiter (CRISM)'],
        discoveries: [
          'CRISM detection of hydrated minerals confirming localized water interaction in canyon floors',
          'Evidence of catastrophic giant mega-landslides spanning hundreds of square kilometers',
        ],
        references: ['Lucchitta et al. (1992) The Valles Marineris, Mars Book, University of Arizona Press'],
        content: [
          'Valles Marineris stretches over 4,000 kilometers long, spans up to 200 kilometers wide, and plunges 7 kilometers deep—ten times longer and four times deeper than Earth’s Grand Canyon.',
          'Unlike the Grand Canyon, which was carved by river water erosion, Valles Marineris originated as a colossal tectonic rift (graben). As the Tharsis volcanic province bulged upward with magma, the brittle crust tore open under extensional tension.',
          'Subsequent erosion, catastrophic canyon-wall collapses, and groundwater sapping enlarged the chasms into the canyon system we see today.',
        ],
        checkpointQuestion: {
          question: 'What primary geological process created the grand canyon system of Valles Marineris on Mars?',
          options: [
            'Tectonic crustal rifting caused by the swelling of the Tharsis volcanic province',
            'A gentle river flowing slowly for 10 billion years',
            'A single giant asteroid impact that carved a trench',
            'Wind dust storms blowing sand for centuries',
          ],
          correctIndex: 0,
          explanation: 'Valles Marineris is a tectonic rift valley (graben) formed when extensional stresses from the bulging Tharsis volcanic bulge tore the Martian lithosphere apart.',
        },
      },
    ],
  },

  // 5. Space Exploration
  {
    id: 'course-space-exploration',
    title: 'Space Exploration: Astrodynamics & Orbital Transfers',
    category: 'Space Exploration',
    disciplineId: 'exploration',
    celestialId: 'exploration',
    level: 'Advanced',
    totalLessons: 2,
    xpTotal: 300,
    icon: '🚀',
    tagline: 'Hohmann Transfers, Gravity Assists & Deep Space Trajectories',
    description: 'Learn the physics of navigating spacecraft across interplanetary space using orbital energy conservation.',
    lessons: [
      {
        id: 'explor-1',
        title: 'Hohmann Transfer Orbits & Delta-V',
        duration: '9 min',
        xpReward: 150,
        disciplineId: 'exploration',
        summary: 'The most fuel-efficient elliptical trajectory connecting two planetary orbits.',
        objectives: [
          'Derive the semi-major axis of a Hohmann transfer ellipse',
          'Calculate injection and circularization burns (Delta-v)',
          'Explain synodic periods and interplanetary launch windows',
        ],
        visualization3D: {
          type: 'spacecraft-orbit',
          title: 'Earth-to-Mars Hohmann Transfer Orbit',
          annotations: [
            { label: 'Departure Burn (Δv₁)', position: [1.8, 0, 0], note: 'Prograde burn at periapsis boosting aphelion to Mars orbit.' },
            { label: 'Arrival Insertion (Δv₂)', position: [-3.4, 0, 0], note: 'Capture burn circularizing spacecraft into destination orbit.' },
          ],
        },
        scientificDiagram: {
          title: 'Hohmann Elliptical Orbit Geometry',
          type: 'orbit-transfer',
          caption: 'Elliptical transfer orbit tangent to both departure and target orbits.',
          elements: [
            { label: 'Initial Orbit', description: 'Earth circular orbit at r₁ = 1.0 AU.', value: 'r₁ = 1.0 AU', color: '#38BDF8' },
            { label: 'Transfer Ellipse', description: 'Semi-major axis a = (r₁ + r₂) / 2 = 1.26 AU; time of flight ~8.5 months.', value: 'a = 1.26 AU', color: '#00E5FF' },
            { label: 'Target Orbit', description: 'Mars circular orbit at r₂ = 1.524 AU.', value: 'r₂ = 1.524 AU', color: '#EF4444' },
          ],
        },
        missions: ['Mariner 4', 'Viking 1', 'Curiosity (MSL)', 'Perseverance (Mars 2020)'],
        discoveries: [
          'Demonstration of precision interplanetary navigation targeting within 5 km after a 480-million-km flight',
        ],
        references: ['Curtis (2014) Orbital Mechanics for Engineering Students, Elsevier', 'NASA Jet Propulsion Laboratory Basics of Space Flight'],
        vocabulary: [
          { term: 'Delta-V (Δv)', definition: 'The total change in velocity required to perform an orbital maneuver, directly proportional to propellant required via Tsiolkovsky’s rocket equation.', lauraAnalogy: 'The orbital currency you spend from your fuel tank to change your flight path.' },
          { term: 'Oberth Effect', definition: 'The phenomenon where an engine burn is significantly more efficient when performed at high speed (low altitude / periapsis).', lauraAnalogy: 'Pushing a child on a swing at the very bottom of the arc when they are moving fastest imparts maximum momentum.' },
        ],
        content: [
          'In orbital mechanics, spacecraft do not fly in straight lines. They coast along Keplerian orbits determined by the Sun’s gravitational pull.',
          'To travel from Earth to Mars with minimum propellant, Walter Hohmann calculated that an elliptical transfer orbit tangent to both planetary orbits consumes the lowest theoretical delta-v.',
          'The spacecraft fires its engines once to leave Earth orbit, coasts along the transfer ellipse for roughly 8.5 months, and fires a second time upon arrival at Mars to enter orbit or land.',
        ],
        checkpointQuestion: {
          question: 'Where must a spacecraft fire its engines to enter a Hohmann transfer orbit from Earth to Mars?',
          options: [
            'Prograde (forward along its orbital motion) at periapsis',
            'Directly towards the center of the Sun',
            'Backwards against its velocity vector',
            'Straight upward perpendicular to the ecliptic plane',
          ],
          correctIndex: 0,
          explanation: 'To expand the outer apoapsis of an orbit, a spacecraft fires prograde (in the direction of travel) at periapsis, maximizing energy gained via the Oberth effect.',
        },
      },
      {
        id: 'explor-2',
        title: 'Gravitational Slingshots & The Grand Tour',
        duration: '8 min',
        xpReward: 150,
        disciplineId: 'exploration',
        summary: 'How Voyager and Cassini stole orbital momentum from giant planets to cross interstellar distances.',
        objectives: [
          'Explain momentum exchange between a moving planet and a spacecraft',
          'Calculate hyperbolic excess velocity changes in heliocentric frames',
          'Detail the rare 176-year planetary alignment that enabled the Voyager Grand Tour',
        ],
        visualization3D: {
          type: 'spacecraft-orbit',
          title: 'Planetary Flyby Velocity Vector Transformation',
        },
        missions: ['Voyager 1 & 2', 'Cassini-Huygens', 'New Horizons', 'BepiColombo'],
        discoveries: [
          'Voyager 2 successful four-planet flyby (Jupiter, Saturn, Uranus, Neptune) saving 30 years of transit time',
          'Voyager 1 reaching interstellar space at 17 km/s with zero onboard propulsion remaining',
        ],
        references: ['Flandro (1966) Fast reconnaissance missions to the outer solar system utilizing energy derived from the gravitational field of Jupiter'],
        content: [
          'In a gravity assist (or gravitational slingshot), a spacecraft dives behind a planet along its direction of orbital motion around the Sun.',
          'In the planet’s frame of reference, the spacecraft leaves at the exact same speed it entered. But in the Sun’s frame of reference, the spacecraft gains twice the planet’s orbital velocity, stealing a tiny, imperceptible fraction of the giant planet’s orbital momentum.',
          'This ingenious technique allowed Voyager 2 to visit Jupiter, Saturn, Uranus, and Neptune in one mission, cutting travel time by over 30 years.',
        ],
        checkpointQuestion: {
          question: 'From where does a spacecraft gain kinetic energy during a successful gravitational slingshot flyby?',
          options: [
            'It steals an infinitesimal fraction of the planet’s orbital momentum around the Sun',
            'The planet’s magnetic field generates electricity to power ionic thrusters',
            'Solar panels absorb more light during closest approach',
            'Atmospheric friction pushes the vehicle forward',
          ],
          correctIndex: 0,
          explanation: 'Conservation of momentum dictates that the speed gained by the spacecraft is stolen directly from the planet’s orbital momentum around the Sun, slowing the planet by an immeasurably tiny amount.',
        },
      },
    ],
  },

  // 6. Space Biology
  {
    id: 'course-space-biology',
    title: 'NASA Space Biology: GeneLab, OSDR & Microgravity',
    category: 'Space Biology',
    disciplineId: 'space-biology',
    celestialId: 'space-biology',
    level: 'Advanced',
    totalLessons: 2,
    xpTotal: 300,
    icon: '🧬',
    tagline: 'Genomics, Epigenetics & Physiological Countermeasures',
    description: 'Investigate how the spaceflight environment impacts living cells, DNA integrity, and astronaut health using NASA OSDR datasets.',
    lessons: [
      {
        id: 'bio-1',
        title: 'Microgravity Transcriptomics & DNA Repair',
        duration: '9 min',
        xpReward: 150,
        disciplineId: 'space-biology',
        summary: 'How zero hydrostatic pressure alters cellular mechanotransduction and mitochondrial gene regulation.',
        objectives: [
          'Explain cellular mechanotransduction in the absence of gravitational shear forces',
          'Analyze NASA OSDR study OSD-379 regarding mitochondrial dysregulation in spaceflight',
          'Evaluate cosmic radiation double-strand DNA breaks and cellular repair pathways',
        ],
        visualization3D: {
          type: 'dna-molecule',
          title: '3D DNA Double Helix & Radiation Damage Sites',
          annotations: [
            { label: 'Double-Strand Break', position: [0, 0, 0], note: 'High-LET cosmic iron ion strike severing both sugar-phosphate backbones.' },
            { label: 'Epigenetic Methylation Site', position: [1.1, 1.2, 0], note: 'Transcription factor access altered by microgravity fluid dynamics.' },
          ],
        },
        scientificDiagram: {
          title: 'Cellular Mechanotransduction Cascade in Microgravity',
          type: 'cell-signaling',
          caption: 'From physical unloading of integrin receptors to nuclear chromatin remodeling.',
          elements: [
            { label: 'Mechanical Unloading', description: 'Loss of gravity-dependent hydrostatic compression on cell membrane.', value: '0 g', color: '#38BDF8' },
            { label: 'Cytoskeleton Disruption', description: 'Actin microfilaments and microtubule network depolymerize.', value: 'Cytoskeleton', color: '#F59E0B' },
            { label: 'Mitochondrial Stress', description: 'Electron transport chain efficiency drops, releasing reactive oxygen species (ROS).', value: 'ROS ↑', color: '#EF4444' },
            { label: 'Transcriptomic Shift', description: 'Altered gene expression across immune, muscle, and inflammatory pathways.', value: 'GeneLab OSD-379', color: '#10B981' },
          ],
        },
        osdrStudy: {
          accession: 'OSD-379',
          title: 'Comprehensive Multi-Omics Analysis of Rodent Research Spaceflight Tissues',
          organism: 'Mus musculus (Mouse)',
          mission: 'ISS Rodent Research (RR-1, RR-3)',
          assayType: 'RNA-Seq Transcriptomics, Proteomics, Metabolomics',
          keyFinding: 'Identified systemic mitochondrial suppression and cellular senescence across liver, muscle, and ocular tissues during long-duration orbital flight.',
          osdrUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-379',
        },
        missions: ['NASA GeneLab Multi-Omics Project', 'ISS Rodent Research', 'Bion-M1'],
        discoveries: [
          'Discovery that mitochondrial dysfunction is the primary master regulator of spaceflight health risks (Cell, 2020)',
          'Epigenetic DNA methylation shifts in plants proving plants adapt to spaceflight without gravity guidance',
        ],
        references: ['da Silveira et al. (2020) Comprehensive Multi-omics Analysis Reveals Mitochondrial Dysfunction as a Key Central Mechanism for Spaceflight Biology, Cell'],
        vocabulary: [
          { term: 'Mechanotransduction', definition: 'The molecular process by which living cells convert physical mechanical stimuli (like gravity) into biochemical signals.', lauraAnalogy: 'Like a touch-screen sensor on your phone—it takes physical pressure on the glass and converts it into digital computer code.' },
          { term: 'Transcriptomics', definition: 'The comprehensive quantification of all messenger RNA (mRNA) transcripts produced in a cell, revealing active gene expression.', lauraAnalogy: 'Checking the live printout of which recipes the master chef is actually cooking in the kitchen right now.' },
        ],
        content: [
          'On Earth, every single terrestrial cell evolved under a constant 1-g gravitational vector. In orbit, the sudden absence of gravitational unloading disrupts cellular mechanotransduction.',
          'Using RNA sequencing and multi-omics analysis, NASA GeneLab researchers analyzing open datasets like OSD-379 revealed that microgravity suppresses mitochondrial electron transport, triggering cellular oxidative stress.',
          'Simultaneously, without geomagnetic shielding, galactic cosmic rays cause double-strand breaks in DNA, challenging cellular repair mechanisms and requiring advanced astronaut protective countermeasures.',
        ],
        checkpointQuestion: {
          question: 'What central biological mechanism did NASA OSDR multi-omics studies discover is systematically disrupted across tissues in spaceflight?',
          options: [
            'Mitochondrial function and cellular energy metabolism',
            'Blood group antigen production',
            'Hearing frequency perception',
            'Fingerprint ridge formations',
          ],
          correctIndex: 0,
          explanation: 'In 2020, NASA GeneLab scientists analyzing dozens of spaceflight datasets discovered that mitochondrial dysfunction and oxidative stress is the master pathway impacted across diverse tissues during space missions.',
        },
      },
      {
        id: 'bio-2',
        title: 'Musculoskeletal Remodeling & Astronaut Countermeasures (ALSDA)',
        duration: '8 min',
        xpReward: 150,
        disciplineId: 'space-biology',
        summary: 'How NASA uses the Advanced Resistive Exercise Device (ARED) to prevent bone mineral loss.',
        objectives: [
          'Quantify cancellous bone mineral density resorption rates in microgravity',
          'Compare osteoblast bone synthesis with osteoclast resorption in unloading',
          'Evaluate the efficacy of resistive exercise and bisphosphonate countermeasures',
        ],
        visualization3D: {
          type: 'planetary-cutaway',
          title: 'Trabecular Bone Density Remodeling',
        },
        osdrStudy: {
          accession: 'OSD-137',
          title: 'Skeletal Remodeling and Muscle Loss in Spaceflight Mice',
          organism: 'Mus musculus',
          mission: 'STS-135 / ISS',
          assayType: 'Micro-CT Imaging & Histomorphometry',
          keyFinding: 'Documented 15-20% decrease in trabecular bone volume fraction in weight-bearing bones within 13 days of spaceflight.',
          osdrUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-137',
        },
        missions: ['NASA Twins Study (Scott & Mark Kelly)', 'ISS Human Research Facility', 'Skylab Medical Experiments'],
        discoveries: [
          'ARED resistive exercise reduces bone mineral density loss from 1.5%/month to near-terrestrial levels',
          'NASA Twins Study confirmed 91.3% of spaceflight-induced gene expression changes returned to normal within 6 months post-landing',
        ],
        references: ['Garrett-Bakelman et al. (2019) The NASA Twins Study: A multidimensional analysis of a year-long human spaceflight, Science'],
        content: [
          'Without the constant mechanical strain of bearing body weight against gravity, human bones trigger a rapid demineralization process.',
          'Osteoclasts break down bone matrix calcium and phosphorus, which enters the bloodstream and increases kidney stone risk, while osteoblasts slow new bone formation.',
          'To counter this, NASA astronauts on the ISS exercise for two hours every day using the Advanced Resistive Exercise Device (ARED), which uses vacuum cylinders to apply up to 2,600 Newtons (600 pounds) of simulated load on the skeleton.',
        ],
        checkpointQuestion: {
          question: 'Why do astronauts on the International Space Station perform two hours of intense resistance exercise every day?',
          options: [
            'To provide the mechanical load needed to prevent severe bone mineral density loss and muscle atrophy',
            'To burn excess calories because space food has too much sugar',
            'To generate electricity for the space station solar batteries',
            'To pass time because space travel has no work to do',
          ],
          correctIndex: 0,
          explanation: 'In microgravity, bones and muscles rapidly decondition without mechanical strain. Two hours of daily high-resistance loading on ARED preserves skeletal bone density and muscular strength.',
        },
      },
    ],
  },

  // 7. Climate Science
  {
    id: 'course-climate-science',
    title: 'Climate Science: Planetary Radiative Equilibrium & NASA GIBS',
    category: 'Climate Science',
    disciplineId: 'climate',
    celestialId: 'climate',
    level: 'Intermediate',
    totalLessons: 2,
    xpTotal: 300,
    icon: '🌍',
    tagline: 'Radiative Budgets, Greenhouse Dynamics & Satellite Observations',
    description: 'Master the physics of planetary heat balance, comparative planetology (Earth vs Venus vs Mars), and real NASA GIBS Earth observation feeds.',
    lessons: [
      {
        id: 'clim-1',
        title: 'Planetary Radiative Balance & The Greenhouse Effect',
        duration: '8 min',
        xpReward: 150,
        disciplineId: 'climate',
        summary: 'How incoming solar shortwave flux balances outgoing terrestrial longwave infrared radiation.',
        objectives: [
          'Derive effective planetary blackbody temperature using the Stefan-Boltzmann law',
          'Explain greenhouse gas molecular absorption bands in the thermal infrared',
          'Contrast Earth’s habitable climate with Venus’s runaway greenhouse furnace',
        ],
        visualization3D: {
          type: 'planetary-cutaway',
          title: 'Atmospheric Radiative Absorption Shell',
        },
        scientificDiagram: {
          title: 'Earth Planetary Energy Budget',
          type: 'energy-balance',
          caption: 'Solar shortwave input (340 W/m²) vs outgoing thermal longwave radiation balance.',
          elements: [
            { label: 'Incoming Solar Radiation', description: 'Total solar irradiance averaged over Earth spherical surface.', value: '340 W/m²', color: '#F59E0B' },
            { label: 'Planetary Albedo', description: 'Solar energy reflected back into space by clouds, ice, and bright land.', value: '100 W/m² (30%)', color: '#38BDF8' },
            { label: 'Surface Absorption', description: 'Solar energy absorbed by land and ocean warming the surface.', value: '160 W/m²', color: '#10B981' },
            { label: 'Greenhouse Trapping', description: 'Water vapor, CO2, and CH4 absorb outgoing infrared and re-radiate downward.', value: '330 W/m²', color: '#EF4444' },
          ],
        },
        missions: ['NASA Terra (CERES & MODIS)', 'Aqua (AIRS)', 'Venus Express', 'Mars Climate Sounder'],
        discoveries: [
          'CERES satellite measurements confirming an Earth energy imbalance of +0.87 W/m² driving ocean warming',
          'Venus Express confirmation that runaway greenhouse completely boiled away an ancient ocean',
        ],
        references: ['Trenberth et al. (2009) Earth’s Global Energy Budget, Bulletin of the American Meteorological Society'],
        vocabulary: [
          { term: 'Albedo', definition: 'The fraction of incident solar radiation reflected by a planetary surface or atmospheric layer.', lauraAnalogy: 'Wearing a white t-shirt on a sunny day reflects heat and keeps you cool, while a black shirt absorbs heat.' },
          { term: 'Thermal Infrared', definition: 'Electromagnetic radiation emitted by planetary surfaces at typical terrestrial temperatures (~300 K, wavelengths 4-50 μm).', lauraAnalogy: 'The invisible warmth you feel radiating off a hot asphalt parking lot at night.' },
        ],
        content: [
          'A planet’s climate is governed by fundamental thermodynamics: the energy absorbed from its host star must exactly equal the thermal infrared radiation it emits back to space.',
          'Without any atmosphere, Earth’s bare effective blackbody temperature would be a frozen -18°C (255 K).',
          'Naturally occurring greenhouse gases (primarily water vapor, carbon dioxide, and methane) absorb outgoing thermal infrared and re-radiate it in all directions, raising Earth’s surface temperature by +33°C to a life-sustaining +15°C.',
        ],
        checkpointQuestion: {
          question: 'What would Earth’s average surface temperature be without its natural greenhouse effect?',
          options: [
            'A frozen -18°C (0°F), with all oceans turned to solid ice',
            '+100°C, boiling the oceans away',
            'Exactly the same as it is today',
            'Absolute zero (-273°C)',
          ],
          correctIndex: 0,
          explanation: 'Without the natural greenhouse effect trapping outgoing thermal infrared radiation, Earth’s radiative equilibrium temperature would drop from +15°C to a freezing -18°C.',
        },
      },
      {
        id: 'clim-2',
        title: 'Atmospheric Circulation & NASA GIBS Earth Observation',
        duration: '7 min',
        xpReward: 150,
        disciplineId: 'climate',
        summary: 'How Coriolis deflection drives Hadley cells, jet streams, and how NASA monitors Earth with GIBS.',
        objectives: [
          'Diagram the three-cell atmospheric circulation model (Hadley, Ferrel, Polar cells)',
          'Explain Coriolis deflection creating trade winds and mid-latitude westerlies',
          'Inspect NASA GIBS live imagery layers for aerosol optical depth and thermal signatures',
        ],
        visualization3D: {
          type: 'trek-surface',
          targetBody: 'mars',
          title: 'Planetary Atmospheric Dynamics',
        },
        missions: ['Suomi NPP (VIIRS)', 'Sentinel-5P TROPOMI', 'Terra & Aqua MODIS'],
        discoveries: [
          'Continuous real-time monitoring of trans-oceanic dust storms fertilizing marine ecosystems',
        ],
        references: ['NASA GIBS Portal Documentation', 'Hartmann (2016) Global Physical Climatology'],
        content: [
          'Because the tropics receive much more direct solar energy than the polar regions, the atmosphere operates as a giant thermodynamic heat engine, transporting warmth poleward.',
          'As warm equatorial air rises, planetary rotation exerts a Coriolis acceleration, breaking simple pole-to-pole circulation into three distinct cells: Hadley, Ferrel, and Polar.',
          'Using NASA GIBS (Global Imagery Browse Services), researchers and students can inspect full-resolution satellite imagery updated within hours of capture to observe cyclones, aerosol transport, and continental vegetation cycles.',
        ],
        checkpointQuestion: {
          question: 'What physical force breaks Earth’s atmospheric circulation into three distinct cells per hemisphere instead of one giant loop?',
          options: [
            'The Coriolis force caused by Earth’s planetary rotation',
            'The Moon’s tidal gravitational pull',
            'The solar magnetic field reversal',
            'Friction from ocean coral reefs',
          ],
          correctIndex: 0,
          explanation: 'Earth’s rapid 24-hour rotation deflects moving air masses via the Coriolis effect, breaking simple equator-to-pole convection into three distinct circulation cells (Hadley, Ferrel, Polar).',
        },
      },
    ],
  },

  // 8. Space Weather
  {
    id: 'course-space-weather',
    title: 'Space Weather: Solar Wind, CMEs & NASA DONKI',
    category: 'Space Weather',
    disciplineId: 'space-weather',
    celestialId: 'space-weather',
    level: 'Advanced',
    totalLessons: 2,
    xpTotal: 300,
    icon: '⚡',
    tagline: 'Solar Wind, Coronal Mass Ejections & Geomagnetic Storms',
    description: 'Explore the energetic plasma environment driven by the Sun, Earth’s protective magnetosphere, and live NASA DONKI event monitoring.',
    lessons: [
      {
        id: 'spw-1',
        title: 'Coronal Mass Ejections & NASA DONKI Heliophysics',
        duration: '8 min',
        xpReward: 150,
        disciplineId: 'space-weather',
        summary: 'How billions of tons of magnetized plasma are ejected into interplanetary space at supersonic speeds.',
        objectives: [
          'Distinguish solar flares (electromagnetic radiation) from CMEs (plasma particle mass)',
          'Interpret NASA DONKI CME speeds, propagation directions, and shock half-angles',
          'Analyze the Carrington Event of 1859 and modern power grid vulnerability',
        ],
        visualization3D: {
          type: 'solar-corona',
          title: 'Solar Flare Reconnection & CME Eruption',
        },
        missions: ['NASA DONKI Database', 'Parker Solar Probe', 'SOHO LASCO Coronagraph', 'SDO'],
        discoveries: [
          'Detection of coronal shock speeds exceeding 3,000 km/s in extreme solar events',
        ],
        references: ['Gopalswamy et al. (2009) Coronal Mass Ejections and Space Weather, Cambridge'],
        vocabulary: [
          { term: 'Coronal Mass Ejection (CME)', definition: 'A massive eruption of magnetized plasma and magnetic flux ropes ejected from the solar corona into interplanetary space at speeds of 250 to 3,000 km/s.', lauraAnalogy: 'Like the Sun sneezing a billion-ton ball of magnetized lightning straight into the solar system.' },
          { term: 'Solar Flare', definition: 'An intense flash of electromagnetic radiation across X-ray and ultraviolet bands caused by magnetic reconnection.', lauraAnalogy: 'The flash of the camera, while the CME is the cannonball that arrives days later.' },
        ],
        content: [
          'Space weather originates with dynamic instabilities in the solar magnetic field.',
          'While a solar flare travels at the speed of light, reaching Earth in just 8.3 minutes as ionizing X-ray radiation, a Coronal Mass Ejection (CME) is a colossal physical cloud of plasma containing billions of tons of protons and electrons.',
          'NASA’s DONKI (Space Weather Database of Notifications, Knowledge, and Information) tracks CME propagation vectors in real-time to alert spacecraft operators and civil power grids.',
        ],
        checkpointQuestion: {
          question: 'What is the key difference between a solar flare and a Coronal Mass Ejection (CME)?',
          options: [
            'A flare is electromagnetic light traveling at light speed; a CME is a physical cloud of plasma traveling at hundreds of km/s',
            'A flare happens only on Earth; a CME happens only on the Sun',
            'Flares are cold ice crystals; CMEs are hot rocks',
            'There is no difference; they are identical terms',
          ],
          correctIndex: 0,
          explanation: 'A solar flare is an intense burst of electromagnetic radiation (light speed), while a CME is an eruption of actual magnetized plasma particles traveling between 250 and 3,000 km/s.',
        },
      },
      {
        id: 'spw-2',
        title: 'The Magnetosphere, Auroras & Kp Index Alerts',
        duration: '8 min',
        xpReward: 150,
        disciplineId: 'space-weather',
        summary: 'How Earth’s magnetic shield deflects solar wind and channels energetic electrons into polar auroral displays.',
        objectives: [
          'Diagram the bow shock, magnetopause, and Van Allen radiation belts',
          'Explain atomic excitation emission lines responsible for green (557.7 nm) and red auroras',
          'Interpret the planetary Kp index scale (0 to 9) for geomagnetic storm warnings',
        ],
        visualization3D: {
          type: 'magnetosphere',
          title: 'Earth Magnetosphere Bow Shock & Van Allen Belts',
          annotations: [
            { label: 'Bow Shock', position: [2.2, 0, 0], note: 'Supersonic solar wind decelerates from 400 km/s to subsonic speeds.' },
            { label: 'Radiation Belts', position: [0, 0, 0], note: 'Toroidal zones trapping relativistic protons and electrons.' },
          ],
        },
        scientificDiagram: {
          title: 'Geomagnetic Storm Kp Severity Scale',
          type: 'kp-scale',
          caption: 'Planetary K-index indicating geomagnetic disturbance level.',
          elements: [
            { label: 'Kp 0 - 2 (Quiet)', description: 'Nominal solar wind conditions; auroras confined to Arctic circle.', value: 'Quiet', color: '#10B981' },
            { label: 'Kp 3 - 4 (Unsettled)', description: 'Minor solar wind stream impact; auroral displays at high latitudes.', value: 'Unsettled', color: '#38BDF8' },
            { label: 'Kp 5 - 6 (Minor-Moderate Storm)', description: 'G1-G2 geomagnetic storm; weak power grid fluctuations; auroras visible at 55° latitude.', value: 'G1-G2 Alert', color: '#F59E0B' },
            { label: 'Kp 7 - 9 (Severe-Extreme Storm)', description: 'G4-G5 storm; transformer voltage alarms, satellite surface charging; auroras visible down to 40° latitude.', value: 'G4-G5 Warning', color: '#EF4444' },
          ],
        },
        missions: ['NASA MMS (Magnetospheric Multiscale)', 'THEMIS', 'Van Allen Probes'],
        discoveries: [
          'MMS direct measurement of explosive electron magnetic reconnection in sub-second timescales',
        ],
        references: ['Kivelson & Russell (1995) Introduction to Space Physics, Cambridge University Press'],
        content: [
          'Earth is protected by a magnetic shield generated by the molten iron geodynamo in its outer core.',
          'When the supersonic solar wind strikes this shield, it forms a curved bow shock that deflects the vast majority of plasma around the planet.',
          'However, when a CME magnetic field connects with Earth’s field, particles funnel down polar magnetic cusp lines, colliding with atmospheric oxygen and nitrogen atoms. The excited oxygen atoms emit photons, painting the sky with ethereal emerald-green and crimson auroras.',
        ],
        checkpointQuestion: {
          question: 'What atomic element in Earth’s upper atmosphere emits the iconic bright green light of the aurora borealis?',
          options: [
            'Excited atomic oxygen at an altitude of approximately 100 to 150 km',
            'Helium gas from deep space',
            'Water droplets reflecting moonlight',
            'Radioactive uranium dust in the stratosphere',
          ],
          correctIndex: 0,
          explanation: 'When energetic magnetospheric electrons collide with atomic oxygen at altitudes between 100 and 150 km, the oxygen atoms emit light at a precise wavelength of 557.7 nm (emerald green).',
        },
      },
    ],
  },

  // 9. Human Spaceflight
  {
    id: 'course-human-spaceflight',
    title: 'Human Spaceflight: ECLSS, Habitats & Deep Space Life Support',
    category: 'Human Spaceflight',
    disciplineId: 'human-spaceflight',
    celestialId: 'human-spaceflight',
    level: 'Advanced',
    totalLessons: 2,
    xpTotal: 300,
    icon: '👨‍🚀',
    tagline: 'Life Support Systems, Radiation Shielding & Artemis EVA',
    description: 'Investigate the engineering systems that keep humans alive in the vacuum of space, closed-loop resource recycling, and spacesuits.',
    lessons: [
      {
        id: 'hsf-1',
        title: 'Environmental Control & Life Support Systems (ECLSS)',
        duration: '8 min',
        xpReward: 150,
        disciplineId: 'human-spaceflight',
        summary: 'How the ISS recycles 98% of all water and regenerates breathable oxygen from exhaled carbon dioxide.',
        objectives: [
          'Trace the mass-balance loops of water recovery, urine distillation, and CO2 scrubbing',
          'Calculate Sabatier catalytic reactor chemistry (CO2 + 4H2 -> CH4 + 2H2O)',
          'Explain oxygen generation via water electrolysis',
        ],
        visualization3D: {
          type: 'spacecraft-orbit',
          title: 'ISS Habitation Module & ECLSS Integration',
        },
        scientificDiagram: {
          title: 'ECLSS Closed-Loop Chemical Cycle',
          type: 'eclss-loop',
          caption: 'Regeneration of water and oxygen on long-duration orbital habitats.',
          elements: [
            { label: 'Exhaled CO2 Scrubbing', description: 'Thermal amine beds scrub astronaut CO2 from cabin atmosphere.', value: 'CO2 Removal', color: '#38BDF8' },
            { label: 'Sabatier Reduction', description: 'CO2 reacts with hydrogen at 400°C over nickel catalyst to produce water and methane.', value: 'CO2 + 4H2 -> CH4 + 2H2O', color: '#10B981' },
            { label: 'Water Electrolysis (OGS)', description: 'Recycled water is split into breathable oxygen and byproduct hydrogen.', value: '2H2O -> 2H2 + O2', color: '#F59E0B' },
            { label: 'Urine Processor (UPA)', description: 'Vacuum rotary distillation extracts potable pure water from human waste.', value: '> 98% Recovery', color: '#8B5CF6' },
          ],
        },
        missions: ['International Space Station (ISS)', 'Apollo 13', 'Artemis Gateway', 'Orion Crew Capsule'],
        discoveries: [
          'Achievement of 98% water recovery milestone on the ISS in 2023, critical for Mars transit feasibility',
        ],
        references: ['Wieland (1998) Designing for Human Presence in Space: An Introduction to ECLSS, NASA Reference Publication 1324'],
        vocabulary: [
          { term: 'Sabatier Reaction', definition: 'A chemical reaction that combines carbon dioxide and hydrogen gas at high temperatures to yield methane and water.', lauraAnalogy: 'Like a high-tech recycling oven that turns exhaled breath into pure fresh drinking water.' },
          { term: 'Urine Processor Assembly (UPA)', definition: 'A vacuum distillation centrifuge that boils urine at low temperatures to recover ultra-pure water.', lauraAnalogy: 'Today’s coffee is literally tomorrow’s coffee on the space station.' },
        ],
        content: [
          'In deep space, resupply from Earth is impossible. A human consumes roughly 0.84 kg of oxygen and 3.5 kg of water every day.',
          'The ISS Environmental Control and Life Support System (ECLSS) transforms the station into a self-contained biological ecosystem.',
          'Using rotary vacuum distillation and catalytic Sabatier reactors, the system recovers over 98% of all moisture (including sweat and urine), recycling it into water purer than municipal tap water on Earth.',
        ],
        checkpointQuestion: {
          question: 'What chemical process is used on the ISS to turn exhaled carbon dioxide and hydrogen into water?',
          options: [
            'The Sabatier catalytic reduction reaction',
            'Photosynthesis by giant trees in the airlock',
            'Nuclear fission of hydrogen atoms',
            'Condensation on the exterior solar panels',
          ],
          correctIndex: 0,
          explanation: 'The Sabatier reaction uses a nickel catalyst at 400°C to react carbon dioxide with hydrogen gas (produced by water electrolysis), yielding water and methane: CO2 + 4H2 -> CH4 + 2H2O.',
        },
      },
      {
        id: 'hsf-2',
        title: 'Deep Space Radiation Shielding & Artemis xEMU Spacesuits',
        duration: '8 min',
        xpReward: 150,
        disciplineId: 'human-spaceflight',
        summary: 'How astronauts survive the extreme thermal swings (-150°C to +120°C) and cosmic radiation beyond Earth’s magnetic shield.',
        objectives: [
          'Differentiate Galactic Cosmic Rays (GCR) from Solar Particle Events (SPE)',
          'Evaluate material radiation shielding: hydrogenous polyethylene versus lead',
          'Detail the multi-layer fabric architecture of the Artemis Extravehicular Mobility Unit (xEMU)',
        ],
        visualization3D: {
          type: 'spacecraft-orbit',
          title: 'Spacesuit Multi-Layer Protective Architecture',
        },
        missions: ['Apollo Lunar Surface EVA', 'Artemis Program', 'NASA Human Research Program'],
        discoveries: [
          'Measurements on Mars surface by Curiosity RAD confirming a cumulative round-trip dose of ~0.66 Sieverts',
          'Confirmation that hydrogen-rich polymers (polyethylene) shield GCR far more effectively than dense metals',
        ],
        references: ['Zeitlin et al. (2013) Measurements of Energetic Particle Radiation in Transit to Mars on the Mars Science Laboratory, Science'],
        content: [
          'Leaving low Earth orbit means leaving the protective canopy of Earth’s magnetosphere.',
          'Galactic Cosmic Rays (GCR)—atomic nuclei stripped of electrons traveling at near-light speeds—can penetrate metal hulls. When heavy iron nuclei strike dense metals like lead, they shatter into dangerous cascades of secondary neutrons.',
          'To protect astronauts on Artemis lunar and Martian missions, engineers use lightweight, hydrogen-dense materials like high-density polyethylene and water walls, while advanced spacesuits utilize 16 distinct protective layers against micrometeoroids and vacuum.',
        ],
        checkpointQuestion: {
          question: 'Why are lightweight hydrogen-rich materials (like polyethylene) preferred over heavy lead for cosmic radiation shielding in space?',
          options: [
            'Light atoms absorb high-energy cosmic ions without producing dangerous secondary neutron showers, and save launch weight',
            'Lead is magnetic and would attract solar flares',
            'Polyethylene produces its own artificial gravity',
            'Lead melts in the vacuum of space',
          ],
          correctIndex: 0,
          explanation: 'Heavy metals like lead produce dangerous showers of secondary neutrons when struck by relativistic cosmic rays. Hydrogen atoms have nearly identical mass to protons, dissipating energy efficiently without fragmentation.',
        },
      },
    ],
  },

  // 10. Milky Way & Deep Cosmos
  {
    id: 'course-milky-way',
    title: 'The Milky Way & Deep Cosmos: Sagittarius A* & Galactic Scales',
    category: 'Milky Way',
    disciplineId: 'milky-way',
    celestialId: 'milky-way',
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
        disciplineId: 'milky-way',
        summary: 'Our Solar System’s 230-million-year orbit around the Milky Way core.',
        objectives: [
          'Describe the morphology of the Milky Way as a barred spiral galaxy (SBbc type)',
          'Map the primary spiral arms (Perseus, Scutum-Centaurus) and our Orion-Cygnus spur',
          'Calculate the galactic orbital period (230 million years at 230 km/s)',
        ],
        visualization3D: {
          type: 'milky-way',
          title: 'Milky Way Spiral Arms & Solar Position',
          annotations: [
            { label: 'Orion-Cygnus Spur', position: [2.1, 0, 1.2], note: 'Current position of our Sun, 26,000 light-years from the center.' },
            { label: 'Sagittarius A*', position: [0, 0, 0], note: 'Supermassive black hole gravitational anchor.' },
          ],
        },
        missions: ['Gaia Satellite (ESA Astrometry)', 'Spitzer Space Telescope Infrared Surveys', 'Fermi Gamma-ray Space Telescope'],
        discoveries: [
          'Gaia precision mapping of 1.8 billion stellar parallax vectors and galactic rotation curves',
          'Discovery of the giant Fermi Bubbles extending 25,000 light-years above and below the galactic plane',
        ],
        references: ['Gaia Collaboration (2021) Gaia Early Data Release 3', 'Bland-Hawthorn & Gerhard (2016) The Galaxy in Context'],
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
        disciplineId: 'milky-way',
        summary: 'The 4.3-million-solar-mass gravitational anchor of our galaxy.',
        objectives: [
          'Trace the stellar orbits of the S-stars (e.g. S2) proving the existence of a supermassive compact mass',
          'Analyze Event Horizon Telescope (EHT) millimeter-wave interferometry imaging of Sgr A*',
          'Understand relativistic photon orbits, the event horizon shadow, and gravitational redshift',
        ],
        visualization3D: {
          type: 'milky-way',
          title: 'Event Horizon Shadow & Relativistic Accretion Ring',
        },
        missions: ['Event Horizon Telescope (EHT)', 'Chandra X-ray Observatory', 'VLT GRAVITY Interferometer'],
        discoveries: [
          'First direct shadow image of Sagittarius A* published by the Event Horizon Telescope Collaboration in 2022',
          'Detection of relativistic precession in star S2’s orbit matching Einstein’s General Relativity (2020 Nobel Prize in Physics)',
        ],
        references: ['EHT Collaboration (2022) First Sagittarius A* Event Horizon Telescope Results, ApJL', 'Genzel et al. (2010) The Galactic Center Black Hole'],
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

  // 11. Moons & Ocean Worlds
  {
    id: 'course-moons',
    title: 'Moons: Ocean Worlds, Cryovolcanism & Regolith',
    category: 'Moons',
    disciplineId: 'moons',
    celestialId: 'moon',
    level: 'Intermediate',
    totalLessons: 2,
    xpTotal: 250,
    icon: '🌕',
    tagline: 'Europa, Titan, Enceladus & The Lunar Surface',
    description: 'Explore the icy moons harboring subsurface liquid oceans and the geological genesis of our own Moon.',
    lessons: [
      {
        id: 'moon-1',
        title: 'The Moon: Impact Cratering & Regolith Genesis',
        duration: '7 min',
        xpReward: 125,
        disciplineId: 'moons',
        summary: 'How billions of years of micrometeorite bombardment pulverized the lunar crust into powdery regolith.',
        objectives: [
          'Explain the Giant Impact Hypothesis (Theia collision) for lunar formation',
          'Contrast dark basaltic maria with ancient anorthositic highlands',
          'Analyze impact crater morphology: simple bowl, complex central peak, multi-ring basin',
        ],
        visualization3D: {
          type: 'trek-surface',
          targetBody: 'moon',
          title: 'NASA Moon Trek Topography',
        },
        trekBody: 'moon',
        trekFeatures: [
          {
            name: 'Tycho Crater',
            lat: -43.3,
            lon: -11.2,
            elevationKm: -4.8,
            description: 'Prominent young impact crater with ray systems extending 1,500 km.',
            scientificSignificance: 'Sampled by Apollo 17; established crater age calibration for inner solar system.',
          },
          {
            name: 'Shackleton Crater',
            lat: -89.9,
            lon: 0.0,
            elevationKm: -4.2,
            description: 'Permanently shadowed South Pole crater containing water ice deposits.',
            scientificSignificance: 'Primary target for NASA Artemis polar landings and in-situ resource utilization.',
          },
        ],
        missions: ['Apollo 11-17', 'Lunar Reconnaissance Orbiter (LRO)', 'Artemis Program'],
        discoveries: [
          'LRO LCROSS impact confirmation of water ice in permanently shadowed polar craters (2009)',
        ],
        references: ['Heiken et al. (1991) Lunar Sourcebook: A User’s Guide to the Moon, Cambridge'],
        content: [
          '4.5 billion years ago, a Mars-sized protoplanet named Theia collided with the proto-Earth, expelling debris into orbit that coalesced to form the Moon.',
          'With no atmosphere or liquid water, lunar weathering is driven exclusively by mechanical impact: micrometeoroids traveling at 20 km/s strike the surface, pulverizing basalt into jagged, microscopic shards of lunar regolith.',
          'At the lunar poles, deep craters cast permanent shadows where temperatures hover around -240°C, preserving billions of tons of water ice for future Artemis explorers.',
        ],
        checkpointQuestion: {
          question: 'What creates the powdery lunar regolith that covers the surface of the Moon?',
          options: [
            'Billions of years of micrometeorite bombardment smashing surface rock into tiny jagged grains',
            'Water waves eroding sea shores that dried up',
            'Windstorms blowing sand across the plains',
            'Volcanic ash from eruptions occurring today',
          ],
          correctIndex: 0,
          explanation: 'Without an atmosphere to burn up incoming space debris, continuous micrometeoroid bombardment over 4.5 billion years pulverized the lunar surface into powdery, glass-rich regolith.',
        },
      },
      {
        id: 'moons-2',
        title: 'Ocean Worlds: Europa & Enceladus Subsurface Seas',
        duration: '8 min',
        xpReward: 125,
        disciplineId: 'moons',
        summary: 'How tidal flexure maintains liquid oceans beneath icy crusts, creating prime targets for astrobiology.',
        objectives: [
          'Explain tidal heating caused by Laplace orbital resonance with Jupiter',
          'Analyze Cassini measurements of Enceladus hydrothermal vent cryovolcanic plumes',
          'Evaluate the habitability potential of Europa’s salty subsurface ocean',
        ],
        visualization3D: {
          type: 'planetary-cutaway',
          title: 'Europa Ice Shell & Subsurface Ocean Cutaway',
        },
        missions: ['Galileo', 'Cassini-Huygens', 'Europa Clipper (NASA)'],
        discoveries: [
          'Cassini mass spectrometer detection of molecular hydrogen, methane, and organics in Enceladus geysers',
          'Europa Clipper mission launched in 2024 to determine Europa ice shell thickness and habitability',
        ],
        references: ['Kivelson et al. (2000) Galileo Magnetometer Measurements: A Subsurface Ocean on Europa, Science'],
        content: [
          'Deep in the outer Solar System where surface temperatures plunge below -170°C, liquid oceans thrive inside frozen moons.',
          'As Europa orbits Jupiter in an eccentric resonance with Io and Ganymede, Jupiter’s colossal gravity continually squeezes and flexes its rocky core, generating internal tidal friction and heat.',
          'This tidal heat prevents the interior from freezing, maintaining a global liquid water ocean containing more water than all of Earth’s oceans combined beneath an icy crust.',
        ],
        checkpointQuestion: {
          question: 'What energy source keeps Europa’s interior ocean warm and liquid despite being far from the Sun?',
          options: [
            'Tidal heating: gravitational flexing from Jupiter continually squeezing the moon’s interior',
            'Direct solar radiation penetrating the ice',
            'Combustion of fossil fuels inside the core',
            'Atmospheric greenhouse heating',
          ],
          correctIndex: 0,
          explanation: 'Tidal flexure caused by Jupiter’s immense gravitational pull and orbital resonance with Io and Ganymede kneads Europa’s rocky mantle, generating immense frictional heat that maintains a liquid subsurface ocean.',
        },
      },
    ],
  },

  // 12. Planets: Comparative Planetology
  {
    id: 'course-planets',
    title: 'Planets: Comparative Planetology & Atmospheric Evolution',
    category: 'Planets',
    disciplineId: 'planets',
    celestialId: 'planets',
    level: 'Intermediate',
    totalLessons: 2,
    xpTotal: 300,
    icon: '🪐',
    tagline: 'Internal Differentiation, Atmospheres & Magnetic Dynamos',
    description: 'Compare the rocky inner worlds (Mercury, Venus, Earth, Mars) with the gas and ice giants (Jupiter, Saturn, Uranus, Neptune).',
    lessons: [
      {
        id: 'planets-1',
        title: 'Comparative Atmospheres: Runaway Venus vs Frozen Mars',
        duration: '8 min',
        xpReward: 150,
        disciplineId: 'planets',
        summary: 'How planet size, magnetic shielding, and solar distance led Earth to life while Venus turned to acid and Mars froze.',
        objectives: [
          'Contrast atmospheric mass and surface pressures: Venus (92 bar) vs Earth (1 bar) vs Mars (0.006 bar)',
          'Explain how the loss of a planetary magnetic dynamo allows solar wind sputtering to strip atmospheres',
          'Evaluate runaway greenhouse feedback mechanisms',
        ],
        visualization3D: {
          type: 'planetary-cutaway',
          title: 'Comparative Atmospheric Density & Layers',
        },
        missions: ['MAVEN (Mars Atmosphere and Volatile Evolution)', 'Venus Express', 'Akatsuki', 'MESSENGER'],
        discoveries: [
          'MAVEN measurements proving solar wind stripping rates spiked by a factor of 10 during ancient solar storms',
        ],
        references: ['Jakosky et al. (2017) Mars atmospheric history derived from MAVEN measurements, Science'],
        content: [
          'Earth, Venus, and Mars began 4.5 billion years ago with similar primordial volatile inventories. Yet today they represent three radically divergent planetary climates.',
          'Venus, closer to the Sun, experienced a runaway greenhouse where oceans boiled into the atmosphere, creating a suffocating 92-bar carbon dioxide furnace with clouds of sulfuric acid.',
          'Mars, being smaller, saw its core cool rapidly, extinguishing its magnetic dynamo. Without a magnetic shield, solar wind sputtering stripped away 99% of its atmosphere, leaving a cold, hyper-arid desert with a surface pressure of only 6 millibars.',
        ],
        checkpointQuestion: {
          question: 'Why did ancient Mars lose most of its atmosphere while Earth retained its thick atmosphere?',
          options: [
            'Mars cooled quickly and lost its magnetic field, allowing solar wind to strip its atmosphere away',
            'Mars was sucked into the Sun',
            'Astronauts consumed all the Martian oxygen',
            'Mars collided with the Moon and lost its air',
          ],
          correctIndex: 0,
          explanation: 'Because Mars is smaller than Earth, its core solidified early and shut down its protective magnetic dynamo. Without magnetic shielding, the solar wind stripped away the Martian atmosphere.',
        },
      },
      {
        id: 'planets-2',
        title: 'Gas & Ice Giants: Jupiter, Saturn, Uranus & Neptune',
        duration: '8 min',
        xpReward: 150,
        disciplineId: 'planets',
        summary: 'Metallic hydrogen dynamos, supersonic atmospheric zonal jets, and ring systems.',
        objectives: [
          'Describe the transition from molecular to liquid metallic hydrogen under megabar pressures',
          'Analyze Jupiter’s Great Red Spot anticyclone longevity',
          'Compare the mantle compositions of Uranus and Neptune (supercritical water, methane, ammonia ices)',
        ],
        visualization3D: {
          type: 'planetary-cutaway',
          title: 'Gas Giant Metallic Hydrogen Interior',
        },
        missions: ['Juno', 'Cassini-Huygens', 'Voyager 1 & 2'],
        discoveries: [
          'Juno microwave radiometer discovery that Jupiter’s Great Red Spot extends 300 to 500 km deep into the atmosphere',
          'Cassini measurement confirming Saturn’s rings are 99% pure water ice losing mass at hundreds of kg/sec',
        ],
        references: ['Bolton et al. (2017) Jupiter’s interior and deep atmosphere: The initial results from the Juno spacecraft, Science'],
        content: [
          'Jupiter and Saturn are predominantly composed of hydrogen and helium. Under the immense pressure of millions of atmospheres, hydrogen is squeezed so tightly that electrons are liberated, transforming into liquid metallic hydrogen that conducts electricity and powers gigantic magnetic fields.',
          'Uranus and Neptune, by contrast, are Ice Giants: their interiors are rich in heavier volatile ices (water, ammonia, methane) surrounding rocky silicate cores.',
          'Neptune features the fastest winds recorded in the Solar System, exceeding 2,100 km/h in supersonic retro-grade equatorial jets.',
        ],
        checkpointQuestion: {
          question: 'What exotic state of matter inside Jupiter conducts electricity and generates its colossal magnetic field?',
          options: [
            'Liquid metallic hydrogen',
            'Molten gold',
            'Solid diamond ice',
            'Liquid nitrogen',
          ],
          correctIndex: 0,
          explanation: 'Deep inside Jupiter at pressures exceeding 2 million atmospheres, hydrogen molecules are crushed into a degenerate liquid metallic state that conducts electrical currents, generating its immense magnetic field.',
        },
      },
    ],
  },
];
