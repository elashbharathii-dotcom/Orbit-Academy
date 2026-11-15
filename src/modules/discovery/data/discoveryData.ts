import { PlanetDiscoveryProfile } from '../types';

export const PLANET_DISCOVERY_PROFILES: Record<string, PlanetDiscoveryProfile> = {
  sun: {
    id: 'sun',
    name: 'The Sun',
    latinName: 'Sol',
    classification: 'Yellow Dwarf Star (Spectral Class G2V)',
    tagline: 'The Gravitational & Thermonuclear Anchor of our System',
    overviewSummary:
      'Sol accounts for 99.86% of all mass in the Solar System. Its colossal gravity binds eight major planets, hundreds of moons, and trillions of comets in an eternal cosmic dance.',
    astronomy: {
      semiMajorAxisAU: 0,
      semiMajorAxisKm: '0 km (System Center)',
      perihelionKm: '0 km',
      aphelionKm: '0 km',
      orbitalPeriodDays: 0,
      orbitalPeriodEarthYears: 0,
      orbitalVelocityKmS: 220, // Galactic orbital speed around Milky Way center
      orbitalEccentricity: 0,
      orbitalInclinationDeg: 7.25,
      rotationPeriodHours: 600, // ~25 Earth days differential
      rotationDescription: 'Differential rotation: 25 days at equator, 35 days at poles',
      isRetrogradeRotation: false,
      axialTiltDeg: 7.25,
    },
    physics: {
      equatorialDiameterKm: 1392700,
      diameterEarthRatio: 109.2,
      massKg: '1.989 × 10³⁰ kg',
      massEarthRatio: 333000,
      meanDensityGcm3: 1.41,
      surfaceGravityMs2: 274.0,
      gravityEarthG: 28.0,
      escapeVelocityKmS: 617.7,
      meanTemperatureC: 5505,
      minTemperatureC: 4000, // Sunspots
      maxTemperatureC: 15000000, // Thermonuclear Core
      surfacePressureAtm: 'Photosphere: ~0.868 bar',
      hasMagneticField: true,
      magneticFieldStrength: 'Global: 1–2 Gauss, Sunspots: up to 4,000 Gauss',
    },
    atmosphere: {
      hasAtmosphere: true,
      scaleHeightKm: 500,
      composition: [
        { gas: 'Hydrogen', formula: 'H', percentage: 73.46, color: '#38BDF8' },
        { gas: 'Helium', formula: 'He', percentage: 24.85, color: '#FBBF24' },
        { gas: 'Oxygen', formula: 'O', percentage: 0.77, color: '#34D399' },
        { gas: 'Carbon', formula: 'C', percentage: 0.29, color: '#94A3B8' },
        { gas: 'Iron & Heavy Elements', formula: 'Fe+', percentage: 0.63, color: '#EF4444' },
      ],
      description:
        'The solar atmosphere comprises the photosphere, the chromosphere, and the blazing million-degree corona, which streams out into space as supersonic solar wind.',
    },
    satellites: {
      moonCount: 0,
      majorMoons: [],
      hasRings: false,
    },
    missions: [
      {
        name: 'Parker Solar Probe',
        agency: 'NASA',
        launchYear: 2018,
        type: 'Probe',
        status: 'Operational',
        keyDiscovery: 'First spacecraft to fly directly through the Sun’s corona at speeds exceeding 690,000 km/h.',
      },
      {
        name: 'Solar Dynamics Observatory (SDO)',
        agency: 'NASA',
        launchYear: 2010,
        type: 'Orbiter',
        status: 'Operational',
        keyDiscovery: 'Continuous ultra-high-definition imaging of solar flare magnetic reconnections.',
      },
      {
        name: 'Solar Orbiter',
        agency: 'ESA / NASA',
        launchYear: 2020,
        type: 'Orbiter',
        status: 'Operational',
        keyDiscovery: 'First detailed observations of polar solar magnetic dynamics and campfire microflares.',
      },
    ],
    surfaceFeatures: [
      {
        title: 'Core Fusion Engine',
        description: 'Every second, the core fuses 600 million metric tons of hydrogen into helium, converting 4 million tons directly into radiant energy via Einstein’s E=mc².',
        coordinateOrLocation: 'Radius 0 to 0.25 R☉',
      },
      {
        title: 'Coronal Loops & Solar Flares',
        description: 'Tangled magnetic field lines snap and reconnect, unleashing gigatons of high-energy plasma into interplanetary space.',
        coordinateOrLocation: 'Lower Solar Corona',
      },
      {
        title: 'Sunspot Granulation',
        description: 'Convection cells the size of Texas bubble across the photosphere, where intense magnetic lines inhibit heat convection to create dark, cooler regions.',
        coordinateOrLocation: 'Photospheric Surface',
      },
    ],
    scientificSignificance:
      'Understanding Sol provides the fundamental baseline for all stellar astrophysics across the universe, space weather forecasting, and planetary habitability models.',
    lauraNarration: {
      intro:
        'Welcome to Sol, the glowing golden heart of our celestial family! This colossal yellow dwarf star holds ninety-nine point eight percent of all mass in our entire solar system.',
      orbitAndScale:
        'Sol does not stand still. It carries our entire planetary family around the Milky Way galaxy at a blistering speed of eight hundred and twenty-eight thousand kilometers per hour!',
      atmosphereAndSurface:
        'In its core, crushing pressure and fifteen million degrees Celsius fuse six hundred million tons of hydrogen into helium every second, powering life on Earth.',
      moonsAndRings:
        'While Sol has no moons of its own, its titanic gravitational pull anchors eight planets, five dwarf planets, and trillions of icy comets in continuous orbit.',
      explorationAndSignificance:
        'NASA’s Parker Solar Probe has touched the Sun, braving temperatures over one thousand degrees to sample coronal plasma firsthand. Truly an awe-inspiring celestial powerhouse!',
    },
    visuals: {
      primaryColor: '#FBBF24',
      glowColor: '#F59E0B',
      atmosphereColor: '#FDE68A',
      textureMapUrl: '/assets/textures/sun.jpg',
    },
  },

  mercury: {
    id: 'mercury',
    name: 'Mercury',
    latinName: 'Mercurius',
    classification: 'Terrestrial Planet / Iron-Core Dwarf',
    tagline: 'The Scorched, Cratered Speedster of the Inner Void',
    overviewSummary:
      'Mercury is the smallest planet in our solar system and the closest to the Sun. With virtually no atmosphere to insulate it, Mercury undergoes the most radical temperature swings in the solar system.',
    astronomy: {
      semiMajorAxisAU: 0.387,
      semiMajorAxisKm: '57,909,050 km',
      perihelionKm: '46,001,200 km',
      aphelionKm: '69,816,900 km',
      orbitalPeriodDays: 87.97,
      orbitalPeriodEarthYears: 0.24,
      orbitalVelocityKmS: 47.36,
      orbitalEccentricity: 0.2056,
      orbitalInclinationDeg: 7.0,
      rotationPeriodHours: 1407.6, // 58.6 Earth days
      rotationDescription: '3:2 spin-orbit resonance: 3 rotations for every 2 orbits around Sol',
      isRetrogradeRotation: false,
      axialTiltDeg: 0.034,
    },
    physics: {
      equatorialDiameterKm: 4879.4,
      diameterEarthRatio: 0.383,
      massKg: '3.301 × 10²³ kg',
      massEarthRatio: 0.055,
      meanDensityGcm3: 5.43,
      surfaceGravityMs2: 3.7,
      gravityEarthG: 0.38,
      escapeVelocityKmS: 4.25,
      meanTemperatureC: 167,
      minTemperatureC: -180, // Frigid Night
      maxTemperatureC: 430,  // Scorching Day
      surfacePressureAtm: '< 10⁻¹⁴ bar (Trace Exosphere)',
      hasMagneticField: true,
      magneticFieldStrength: '1.1% of Earth (~300 nT)',
    },
    atmosphere: {
      hasAtmosphere: false,
      scaleHeightKm: 0,
      composition: [
        { gas: 'Oxygen', formula: 'O', percentage: 42.0, color: '#38BDF8' },
        { gas: 'Sodium', formula: 'Na', percentage: 29.0, color: '#FBBF24' },
        { gas: 'Hydrogen', formula: 'H', percentage: 22.0, color: '#60A5FA' },
        { gas: 'Helium', formula: 'He', percentage: 6.0, color: '#F472B6' },
        { gas: 'Potassium', formula: 'K', percentage: 1.0, color: '#A78BFA' },
      ],
      description:
        'Mercury possesses no persistent atmospheric blanket, only a tenuous surface-boundary exosphere constantly replenished by solar wind bombardment and micrometeoroid vaporizations.',
    },
    satellites: {
      moonCount: 0,
      majorMoons: [],
      hasRings: false,
    },
    missions: [
      {
        name: 'MESSENGER',
        agency: 'NASA',
        launchYear: 2004,
        arrivalYear: 2011,
        type: 'Orbiter',
        status: 'Completed',
        keyDiscovery: 'Confirmed water ice trapped inside permanently shadowed polar craters and an unexpectedly enormous metallic iron core.',
      },
      {
        name: 'BepiColombo',
        agency: 'ESA / JAXA',
        launchYear: 2018,
        arrivalYear: 2026,
        type: 'Orbiter',
        status: 'En Route',
        keyDiscovery: 'Dual-orbiter mission scheduled for comprehensive magnetospheric and surface mineralogy cartography.',
      },
      {
        name: 'Mariner 10',
        agency: 'NASA',
        launchYear: 1973,
        arrivalYear: 1974,
        type: 'Flyby',
        status: 'Completed',
        keyDiscovery: 'First spacecraft to visit Mercury, capturing initial high-resolution photographic mosaics of Caloris Basin.',
      },
    ],
    surfaceFeatures: [
      {
        title: 'Caloris Basin',
        description: 'One of the largest impact craters in the solar system, spanning 1,550 kilometers across, ringed by mile-high concentric mountain ridges.',
        coordinateOrLocation: '30.5° N, 189.8° W',
      },
      {
        title: 'Discovery Rupes (Lobate Scarps)',
        description: 'Massive cliff thrust faults up to 3 kilometers high, formed when Mercury’s colossal iron core cooled and contracted, shriveling the outer crust like a dried plum.',
        coordinateOrLocation: '56.3° S, 38.3° W',
      },
      {
        title: 'Permanently Shadowed Polar Ice',
        description: 'Deep craters at Mercury’s poles never see sunlight, preserving billions of tons of pristine water ice and organic volatiles despite proximity to Sol.',
        coordinateOrLocation: 'North Polar Craters',
      },
    ],
    scientificSignificance:
      'Mercury’s oversized core—occupying nearly 85% of its planetary radius—challenges planetary accretion theories, suggesting a cataclysmic collision stripped away its early silicate mantle.',
    lauraNarration: {
      intro:
        'Cadet, prepare for extreme conditions! We have arrived at Mercury, the smallest planet and the fastest sprinter in our solar family.',
      orbitAndScale:
        'Mercury races around the Sun in just eighty-eight Earth days, traveling at forty-seven kilometers per second! Yet, a single day-night cycle on Mercury lasts an incredible one hundred and seventy-six Earth days.',
      atmosphereAndSurface:
        'With no atmosphere to trap heat, Mercury experiences brutal temperature swings: baking at four hundred and thirty degrees Celsius in daylight, and plunging to minus one hundred and eighty degrees at night!',
      moonsAndRings:
        'Mercury has zero moons and no rings. Its landscape resembles our own Moon, peppered with ancient impact basins and towering thrust cliffs.',
      explorationAndSignificance:
        'NASA’s MESSENGER probe made a startling discovery here: frozen water ice hidden inside permanently dark craters at the poles, sheltered forever from the blazing Sun!',
    },
    visuals: {
      primaryColor: '#94A3B8',
      glowColor: '#CBD5E1',
      textureMapUrl: '/assets/textures/mercury.jpg',
    },
  },

  venus: {
    id: 'venus',
    name: 'Venus',
    latinName: 'Lucifer / Hesperus',
    classification: 'Terrestrial Planet / Supercritical Greenhouse',
    tagline: 'The Blistering Sister Planet with a Runaway Greenhouse',
    overviewSummary:
      'Venus is Earth’s twin in size, mass, and bulk composition, but its atmosphere tells a terrifying story. A runaway greenhouse effect has made Venus the hottest planetary surface in the solar system.',
    astronomy: {
      semiMajorAxisAU: 0.723,
      semiMajorAxisKm: '108,208,000 km',
      perihelionKm: '107,477,000 km',
      aphelionKm: '108,939,000 km',
      orbitalPeriodDays: 224.7,
      orbitalPeriodEarthYears: 0.615,
      orbitalVelocityKmS: 35.02,
      orbitalEccentricity: 0.0067,
      orbitalInclinationDeg: 3.39,
      rotationPeriodHours: -5832.5, // 243 Earth days retrograde
      rotationDescription: 'Retrograde spin: Venus rotates backwards, so Sol rises in the west and sets in the east',
      isRetrogradeRotation: true,
      axialTiltDeg: 177.3,
    },
    physics: {
      equatorialDiameterKm: 12103.6,
      diameterEarthRatio: 0.949,
      massKg: '4.867 × 10²⁴ kg',
      massEarthRatio: 0.815,
      meanDensityGcm3: 5.24,
      surfaceGravityMs2: 8.87,
      gravityEarthG: 0.905,
      escapeVelocityKmS: 10.36,
      meanTemperatureC: 464,
      minTemperatureC: 438,
      maxTemperatureC: 482,
      surfacePressureAtm: '92 atm (93 bar) — equivalent to 900 meters ocean depth on Earth',
      hasMagneticField: false,
      magneticFieldStrength: 'Weak induced magnetosphere caused by solar wind ion interaction',
    },
    atmosphere: {
      hasAtmosphere: true,
      scaleHeightKm: 15.9,
      composition: [
        { gas: 'Carbon Dioxide', formula: 'CO₂', percentage: 96.5, color: '#F59E0B' },
        { gas: 'Nitrogen', formula: 'N₂', percentage: 3.5, color: '#38BDF8' },
        { gas: 'Sulfur Dioxide', formula: 'SO₂', percentage: 0.015, color: '#EAB308' },
        { gas: 'Water Vapor', formula: 'H₂O', percentage: 0.002, color: '#60A5FA' },
      ],
      description:
        'A super-dense blanket of carbon dioxide laced with opaque, highly reflective clouds of concentrated sulfuric acid droplets. Surface winds are slow, but upper-level clouds super-rotate around Venus in just 4 days.',
    },
    satellites: {
      moonCount: 0,
      majorMoons: [],
      hasRings: false,
    },
    missions: [
      {
        name: 'Venera 13 & 14',
        agency: 'Soviet Space Program',
        launchYear: 1981,
        arrivalYear: 1982,
        type: 'Lander',
        status: 'Completed',
        keyDiscovery: 'Survived 127 minutes in the inferno to beam back the first color panoramas and soil acoustics of Venus’s orange basalt plains.',
      },
      {
        name: 'Magellan',
        agency: 'NASA',
        launchYear: 1989,
        arrivalYear: 1990,
        type: 'Orbiter',
        status: 'Completed',
        keyDiscovery: 'Used synthetic aperture radar to map 98% of the surface through the thick cloud deck, revealing thousands of volcanoes and tectonic rift valleys.',
      },
      {
        name: 'VERITAS & DAVINCI',
        agency: 'NASA / ESA',
        launchYear: 2029,
        type: 'Orbiter',
        status: 'Planned',
        keyDiscovery: 'Next-generation orbital radar and atmospheric descent probe to analyze noble gases and volcanic resurfacing.',
      },
    ],
    surfaceFeatures: [
      {
        title: 'Maxwell Montes',
        description: 'The highest mountain range on Venus, rising 11 kilometers above the average surface elevation. Its peaks are coated in reflective metallic lead-bismuth frost.',
        coordinateOrLocation: '65.2° N, 3.3° E',
      },
      {
        title: 'Maat Mons Volcano',
        description: 'A colossal 8-kilometer-high shield volcano exhibiting evidence of active recent lava outflows, confirming ongoing geological volcanism.',
        coordinateOrLocation: '0.5° N, 194.6° E',
      },
      {
        title: 'Aphrodite Terra',
        description: 'A continent-sized highland region near the equator stretching over 10,000 kilometers, fractured by extensive ridge belts and tectonic chasms.',
        coordinateOrLocation: 'Equatorial Highland',
      },
    ],
    scientificSignificance:
      'Venus is a crucial natural laboratory for climate modeling. It demonstrates the tipping point where a warm ocean evaporates, filling the atmosphere with water vapor and triggering an irreversible greenhouse trap.',
    lauraNarration: {
      intro:
        'Look upon the shrouded jewel of our inner system: Venus! Often called Earth’s twin due to its similar size and density, Venus took an extraordinarily different path.',
      orbitAndScale:
        'Venus has a bizarre spin: it rotates backwards compared to nearly all other planets, and it turns so slowly that one single Venusian day lasts longer than its entire year!',
      atmosphereAndSurface:
        'Beneath those yellow clouds lies a brutal inferno. Its thick carbon dioxide atmosphere creates a runaway greenhouse effect, locking the surface at four hundred and sixty-four degrees Celsius—hot enough to melt lead!',
      moonsAndRings:
        'Like Mercury, Venus travels through space alone without moons or rings. Its crushing atmospheric pressure is ninety-two times greater than Earth’s at sea level.',
      explorationAndSignificance:
        'Heroic probes like the Soviet Venera landers touched down here, surviving just over an hour before succumbing to the heat and pressure. Venus teaches us how precious and delicate planetary balances truly are.',
    },
    visuals: {
      primaryColor: '#E2BF84',
      glowColor: '#F59E0B',
      atmosphereColor: '#FCD34D',
      textureMapUrl: '/assets/textures/venus_atmosphere.jpg',
    },
  },

  earth: {
    id: 'earth',
    name: 'Earth',
    latinName: 'Terra / Gaia',
    classification: 'Terrestrial Planet / Hydrosphere Oasis',
    tagline: 'The Radiant Blue Cradle of Biology & Intelligent Civilization',
    overviewSummary:
      'Earth is the third planet from the Sun and the only celestial object in the universe known to harbor life. It boasts liquid water oceans, an active nitrogen-oxygen atmosphere, and a dynamic geomagnetic dynamo.',
    astronomy: {
      semiMajorAxisAU: 1.0,
      semiMajorAxisKm: '149,598,261 km',
      perihelionKm: '147,095,000 km',
      aphelionKm: '152,100,000 km',
      orbitalPeriodDays: 365.256,
      orbitalPeriodEarthYears: 1.0,
      orbitalVelocityKmS: 29.78,
      orbitalEccentricity: 0.0167,
      orbitalInclinationDeg: 0.0,
      rotationPeriodHours: 23.934, // 23h 56m 4s sidereal
      rotationDescription: 'Prograde axial rotation once every 23.93 hours, giving 24-hour solar day',
      isRetrogradeRotation: false,
      axialTiltDeg: 23.44,
    },
    physics: {
      equatorialDiameterKm: 12756.2,
      diameterEarthRatio: 1.0,
      massKg: '5.972 × 10²⁴ kg',
      massEarthRatio: 1.0,
      meanDensityGcm3: 5.514,
      surfaceGravityMs2: 9.807,
      gravityEarthG: 1.0,
      escapeVelocityKmS: 11.186,
      meanTemperatureC: 15,
      minTemperatureC: -89.2, // Vostok Station, Antarctica
      maxTemperatureC: 56.7,  // Death Valley, California
      surfacePressureAtm: '1.0 atm (1.013 bar at sea level)',
      hasMagneticField: true,
      magneticFieldStrength: '0.25 to 0.65 Gauss — geodynamo powered by liquid outer iron core',
    },
    atmosphere: {
      hasAtmosphere: true,
      scaleHeightKm: 8.5,
      composition: [
        { gas: 'Nitrogen', formula: 'N₂', percentage: 78.08, color: '#38BDF8' },
        { gas: 'Oxygen', formula: 'O₂', percentage: 20.95, color: '#10B981' },
        { gas: 'Argon', formula: 'Ar', percentage: 0.93, color: '#A78BFA' },
        { gas: 'Carbon Dioxide', formula: 'CO₂', percentage: 0.042, color: '#F59E0B' },
        { gas: 'Water Vapor', formula: 'H₂O', percentage: 0.4, color: '#60A5FA' },
      ],
      description:
        'A multi-layered protective envelope comprising the troposphere, stratosphere (with UV-shielding ozone), mesosphere, thermosphere, and exosphere. Rayleigh scattering of sunlight by nitrogen produces our blue sky.',
    },
    satellites: {
      moonCount: 1,
      majorMoons: [
        {
          id: 'luna',
          name: 'The Moon (Luna)',
          diameterKm: 3474.8,
          orbitalDistanceKm: 384400,
          orbitalPeriodDays: 27.32,
          discoveryYear: -4000,
          discoverer: 'Known since Antiquity',
          description: 'The fifth largest moon in the solar system, gravitationally tidally locked to Earth and stabilizing our 23.4° axial tilt to produce stable seasonal climates.',
          color: '#CBD5E1',
        },
      ],
      hasRings: false,
    },
    missions: [
      {
        name: 'Apollo 11',
        agency: 'NASA',
        launchYear: 1969,
        type: 'Lander',
        status: 'Completed',
        keyDiscovery: 'First humans to step foot on another celestial body, returning 21.6 kilograms of lunar regolith samples.',
      },
      {
        name: 'International Space Station (ISS)',
        agency: 'NASA / ESA / JAXA / CSA / Roscosmos',
        launchYear: 1998,
        type: 'Orbiter',
        status: 'Operational',
        keyDiscovery: 'Continuously occupied microgravity science laboratory conducting cutting-edge biology and physics for over 25 years.',
      },
      {
        name: 'Artemis Program',
        agency: 'NASA / International Partners',
        launchYear: 2022,
        type: 'Sample Return',
        status: 'Operational',
        keyDiscovery: 'Returning humans to the lunar South Pole to establish permanent long-term lunar exploration bases.',
      },
    ],
    surfaceFeatures: [
      {
        title: 'Global Ocean Hydrosphere',
        description: 'Covering 70.8% of Earth’s surface, oceans regulate global heat distribution, drive weather systems, and harbor the vast majority of our biosphere.',
        coordinateOrLocation: 'Pacific, Atlantic, Indian, Arctic, Southern',
      },
      {
        title: 'Mariana Trench (Challenger Deep)',
        description: 'The deepest known point on Earth, plunging 10,994 meters below sea level with over 1,000 atmospheres of hydrostatic pressure.',
        coordinateOrLocation: '11° 21′ N, 142° 12′ E',
      },
      {
        title: 'Plate Tectonics & Continental Drift',
        description: 'Earth is the only planet with active plate tectonics, recycling carbon through subduction zones and continuously renewing continental crust.',
        coordinateOrLocation: 'Global Lithosphere',
      },
    ],
    scientificSignificance:
      'Earth is the cosmic gold standard for the planetary habitability envelope. Its combination of water, magnetic shielding, tectonic recycling, and biomass makes it a beacon of intelligence in the cosmos.',
    lauraNarration: {
      intro:
        'Welcome home to Earth! Look at that breathtaking blue marble shining against the deep cosmic darkness. This is our sanctuary—the only world known to host living organisms.',
      orbitAndScale:
        'Earth sits right in the astronomical Goldilocks zone, exactly one Astronomical Unit from Sol, where temperatures allow water to exist as liquid, vapor, and ice.',
      atmosphereAndSurface:
        'Our atmosphere is seventy-eight percent nitrogen and twenty-one percent oxygen. Sunlight scattering through gas molecules bathes our days in serene cerulean blue!',
      moonsAndRings:
        'We are accompanied by our faithful companion, the Moon. Its gravitational tides stabilize Earth’s axial tilt, preventing wild climate chaos over millions of years.',
      explorationAndSignificance:
        'From Earth, human curiosity has reached every planet in the solar system and even interstellar space with Voyager. As we explore the stars, remember that Earth remains our ultimate home.',
    },
    visuals: {
      primaryColor: '#38BDF8',
      glowColor: '#10B981',
      atmosphereColor: '#60A5FA',
      textureMapUrl: '/assets/textures/earth_daymap.jpg',
      cloudsMapUrl: '/assets/textures/earth_clouds.jpg',
      nightMapUrl: '/assets/textures/earth_nightmap.jpg',
    },
  },

  mars: {
    id: 'mars',
    name: 'Mars',
    latinName: 'Ares',
    classification: 'Terrestrial Planet / Oxidized Desert World',
    tagline: 'The Crimson Frontier of Ancient Lakes and Future Colonies',
    overviewSummary:
      'Mars is the fourth planet from the Sun, famous for its reddish tint caused by oxidized iron dust. It hosts the tallest volcano and the deepest chasm in the solar system, and holds clues to past extraterrestrial water.',
    astronomy: {
      semiMajorAxisAU: 1.524,
      semiMajorAxisKm: '227,939,200 km',
      perihelionKm: '206,669,000 km',
      aphelionKm: '249,209,300 km',
      orbitalPeriodDays: 686.98,
      orbitalPeriodEarthYears: 1.88,
      orbitalVelocityKmS: 24.07,
      orbitalEccentricity: 0.0934,
      orbitalInclinationDeg: 1.85,
      rotationPeriodHours: 24.623, // 24h 37m 22s (1 Sol)
      rotationDescription: 'Martian day (Sol) is remarkably similar to Earth: 24 hours and 37 minutes',
      isRetrogradeRotation: false,
      axialTiltDeg: 25.19,
    },
    physics: {
      equatorialDiameterKm: 6792.4,
      diameterEarthRatio: 0.532,
      massKg: '6.417 × 10²³ kg',
      massEarthRatio: 0.107,
      meanDensityGcm3: 3.933,
      surfaceGravityMs2: 3.721,
      gravityEarthG: 0.38,
      escapeVelocityKmS: 5.027,
      meanTemperatureC: -63,
      minTemperatureC: -140, // Polar Winter Night
      maxTemperatureC: 20,   // Equatorial Summer Noon
      surfacePressureAtm: '0.006 atm (6.1 millibar) — less than 1% of Earth',
      hasMagneticField: false,
      magneticFieldStrength: 'No global dynamo; localized remnant crustal magnetic stripes',
    },
    atmosphere: {
      hasAtmosphere: true,
      scaleHeightKm: 11.1,
      composition: [
        { gas: 'Carbon Dioxide', formula: 'CO₂', percentage: 95.32, color: '#EF4444' },
        { gas: 'Nitrogen', formula: 'N₂', percentage: 2.6, color: '#38BDF8' },
        { gas: 'Argon', formula: 'Ar', percentage: 1.9, color: '#A78BFA' },
        { gas: 'Oxygen', formula: 'O₂', percentage: 0.13, color: '#10B981' },
        { gas: 'Water Vapor', formula: 'H₂O', percentage: 0.03, color: '#60A5FA' },
      ],
      description:
        'A rarefied, dusty atmosphere dominated by CO2. Suspended airborne ferric oxide dust particles tint the Martian sky butterscotch-pink by day, while sunsets glow blue due to forward Mie scattering.',
    },
    satellites: {
      moonCount: 2,
      majorMoons: [
        {
          id: 'phobos',
          name: 'Phobos',
          diameterKm: 22.2,
          orbitalDistanceKm: 9377,
          orbitalPeriodDays: 0.319, // 7.66 hours
          discoveryYear: 1877,
          discoverer: 'Asaph Hall',
          description: 'A heavily cratered potato-shaped captured asteroid orbiting so close to Mars that it will break apart into a ring in ~50 million years.',
          color: '#78716C',
        },
        {
          id: 'deimos',
          name: 'Deimos',
          diameterKm: 12.4,
          orbitalDistanceKm: 23460,
          orbitalPeriodDays: 1.262,
          discoveryYear: 1877,
          discoverer: 'Asaph Hall',
          description: 'The smaller outer moon, covered in a smooth blanket of impact regolith that softens its cratered contours.',
          color: '#A8A29E',
        },
      ],
      hasRings: false,
    },
    missions: [
      {
        name: 'Perseverance Rover & Ingenuity',
        agency: 'NASA',
        launchYear: 2020,
        arrivalYear: 2021,
        type: 'Rover',
        status: 'Operational',
        keyDiscovery: 'Caching rock core samples from Jezero ancient river delta and completing 72 historic powered flights in thin Martian air.',
      },
      {
        name: 'Curiosity Rover',
        agency: 'NASA',
        launchYear: 2011,
        arrivalYear: 2012,
        type: 'Rover',
        status: 'Operational',
        keyDiscovery: 'Discovered ancient organic molecules and evidence that Gale Crater was once a habitable freshwater lake for millions of years.',
      },
      {
        name: 'Mars Reconnaissance Orbiter (MRO)',
        agency: 'NASA',
        launchYear: 2005,
        arrivalYear: 2006,
        type: 'Orbiter',
        status: 'Operational',
        keyDiscovery: 'High-resolution HiRISE imaging tracking active dust avalanches, seasonal carbon dioxide geysers, and glacier flows.',
      },
    ],
    surfaceFeatures: [
      {
        title: 'Olympus Mons',
        description: 'The solar system’s largest shield volcano, towering 21.9 kilometers high—nearly three times higher than Mount Everest—spanning the width of the state of Arizona.',
        coordinateOrLocation: '18.65° N, 226.2° E',
      },
      {
        title: 'Valles Marineris',
        description: 'A grand tectonic canyon system stretching 4,000 kilometers long, 200 kilometers wide, and up to 7 kilometers deep—ten times longer than the Grand Canyon.',
        coordinateOrLocation: '13.9° S, 59.2° W',
      },
      {
        title: 'Jezero Crater Paleolake Delta',
        description: 'An ancient impact crater where a prehistoric river breached the rim, depositing layered clay sediments and organic minerals over 3.5 billion years ago.',
        coordinateOrLocation: '18.38° N, 77.58° E',
      },
    ],
    scientificSignificance:
      'Mars represents humanity’s premier stepping stone toward becoming a multiplanetary species. Its geological strata preserve the conditions of early solar system evolution when life first began.',
    lauraNarration: {
      intro:
        'Welcome to the Red Frontier! We have arrived at Mars, the dusty, rusty desert world that has captivated dreamers and scientists for generations.',
      orbitAndScale:
        'Mars orbits at one point five Astronomical Units. A Martian year is almost twice as long as Earth’s, but a single Martian day—called a Sol—is just twenty-four hours and thirty-seven minutes!',
      atmosphereAndSurface:
        'Its iron-rich dust gives Mars its crimson color. Mars is home to Olympus Mons, the largest volcano in the solar system, standing three times taller than Mount Everest!',
      moonsAndRings:
        'Mars is orbited by two tiny captured asteroids: Phobos and Deimos. Phobos orbits so close that it rises and sets twice every single Martian day.',
      explorationAndSignificance:
        'Robotic rovers like Curiosity and Perseverance have proven that ancient rivers and freshwater lakes once flowed across Mars. Finding traces of past microbial life here would change humanity forever!',
    },
    visuals: {
      primaryColor: '#EF4444',
      glowColor: '#F87171',
      atmosphereColor: '#FCA5A5',
      textureMapUrl: '/assets/textures/mars.jpg',
    },
  },

  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    latinName: 'Iuppiter / Jove',
    classification: 'Gas Giant / Jovian Heavyweight',
    tagline: 'The Colossal Sovereign of Storms and Galilean Moons',
    overviewSummary:
      'Jupiter is the largest planet in our solar system, with more than twice the mass of all other planets combined. Its swirling atmosphere of counter-rotating jet streams is punctuated by the centuries-old Great Red Spot.',
    astronomy: {
      semiMajorAxisAU: 5.204,
      semiMajorAxisKm: '778,570,000 km',
      perihelionKm: '740,520,000 km',
      aphelionKm: '816,620,000 km',
      orbitalPeriodDays: 4332.59,
      orbitalPeriodEarthYears: 11.86,
      orbitalVelocityKmS: 13.07,
      orbitalEccentricity: 0.0484,
      orbitalInclinationDeg: 1.305,
      rotationPeriodHours: 9.925, // Fastest planetary spin
      rotationDescription: 'Fastest spinning planet: a Jovian day is under 10 hours',
      isRetrogradeRotation: false,
      axialTiltDeg: 3.13,
    },
    physics: {
      equatorialDiameterKm: 142984,
      diameterEarthRatio: 11.21,
      massKg: '1.898 × 10²⁷ kg',
      massEarthRatio: 317.8,
      meanDensityGcm3: 1.326,
      surfaceGravityMs2: 24.79,
      gravityEarthG: 2.53,
      escapeVelocityKmS: 59.5,
      meanTemperatureC: -110,
      minTemperatureC: -145, // 1 bar level
      maxTemperatureC: 24000, // Core boundary
      surfacePressureAtm: '> 1000 atm at transition to metallic hydrogen',
      hasMagneticField: true,
      magneticFieldStrength: '14 times stronger than Earth — colossal magnetosphere spanning 7 million km',
    },
    atmosphere: {
      hasAtmosphere: true,
      scaleHeightKm: 27.0,
      composition: [
        { gas: 'Hydrogen', formula: 'H₂', percentage: 89.8, color: '#38BDF8' },
        { gas: 'Helium', formula: 'He', percentage: 10.2, color: '#FBBF24' },
        { gas: 'Methane', formula: 'CH₄', percentage: 0.3, color: '#34D399' },
        { gas: 'Ammonia', formula: 'NH₃', percentage: 0.026, color: '#F472B6' },
      ],
      description:
        'Spectacular colored atmospheric bands driven by high-speed Coriolis winds. White zones are rising clouds of ammonia ice; dark belts are descending warmer gas colored by phosphorus and sulfur compounds.',
    },
    satellites: {
      moonCount: 95,
      majorMoons: [
        {
          id: 'io',
          name: 'Io',
          diameterKm: 3643.2,
          orbitalDistanceKm: 421700,
          orbitalPeriodDays: 1.769,
          discoveryYear: 1610,
          discoverer: 'Galileo Galilei',
          description: 'The most volcanically active body in the solar system, with over 400 active volcanoes driven by intense tidal kneading from Jupiter and Europa.',
          color: '#EAB308',
        },
        {
          id: 'europa',
          name: 'Europa',
          diameterKm: 3121.6,
          orbitalDistanceKm: 670900,
          orbitalPeriodDays: 3.551,
          discoveryYear: 1610,
          discoverer: 'Galileo Galilei',
          description: 'A smooth global ice crust crisscrossed with reddish fractures, concealing a subsurface saltwater ocean with more liquid water than all Earth’s oceans combined.',
          color: '#E2E8F0',
        },
        {
          id: 'ganymede',
          name: 'Ganymede',
          diameterKm: 5268.2,
          orbitalDistanceKm: 1070400,
          orbitalPeriodDays: 7.155,
          discoveryYear: 1610,
          discoverer: 'Galileo Galilei',
          description: 'The largest moon in the solar system—larger even than planet Mercury—and the only moon possessing its own self-generated magnetic field.',
          color: '#94A3B8',
        },
        {
          id: 'callisto',
          name: 'Callisto',
          diameterKm: 4820.6,
          orbitalDistanceKm: 1882700,
          orbitalPeriodDays: 16.689,
          discoveryYear: 1610,
          discoverer: 'Galileo Galilei',
          description: 'The most heavily cratered world in the solar system, preserving an ancient, un-resurfaced icy relic crust from the dawn of planet formation.',
          color: '#64748B',
        },
      ],
      hasRings: true,
      ringDescription: 'Faint dusty ring system composed of microscopic carbonaceous dust kicked off small inner moons.',
      ringSpanKm: '228,000 km',
    },
    missions: [
      {
        name: 'Juno',
        agency: 'NASA',
        launchYear: 2011,
        arrivalYear: 2016,
        type: 'Orbiter',
        status: 'Operational',
        keyDiscovery: 'Discovered geometric polar cyclone clusters, deep atmospheric water abundance, and a diffuse fuzzy core.',
      },
      {
        name: 'Galileo',
        agency: 'NASA',
        launchYear: 1989,
        arrivalYear: 1995,
        type: 'Orbiter',
        status: 'Completed',
        keyDiscovery: 'First spacecraft to orbit a gas giant and deploy an atmospheric probe, discovering evidence of Europa’s subsurface ocean.',
      },
      {
        name: 'Europa Clipper',
        agency: 'NASA',
        launchYear: 2024,
        arrivalYear: 2030,
        type: 'Orbiter',
        status: 'En Route',
        keyDiscovery: 'Dedicated astrobiological mission to perform dozens of close low-altitude flybys to determine Europa’s ocean habitability.',
      },
    ],
    surfaceFeatures: [
      {
        title: 'The Great Red Spot',
        description: 'An anticyclonic storm larger than Earth with winds roaring at 680 km/h, observed continuously through telescopes for over 350 years.',
        coordinateOrLocation: '22° S, System II',
      },
      {
        title: 'Metallic Hydrogen Mantle',
        description: 'Deep within Jupiter, millions of atmospheres of pressure squeeze hydrogen so tightly that electrons flow freely, creating an ocean of liquid metallic hydrogen that powers its magnetic field.',
        coordinateOrLocation: 'Mantle depth > 20,000 km',
      },
      {
        title: 'Polar Cyclone Clusters',
        description: 'Juno revealed a stable, mesmerizing pentagon and octagon arrangement of continent-sized cyclones swirling perpetually over Jupiter’s poles.',
        coordinateOrLocation: 'North and South Poles',
      },
    ],
    hotspots: [
      {
        id: 'great-red-spot',
        title: 'The Great Red Spot',
        shortDesc: 'Centuries-old anticyclonic storm larger than Earth',
        explanation: 'Jupiter’s famous Great Red Spot is an anticyclone towering 8 km above surrounding clouds with counter-clockwise winds reaching 680 km/h.',
        latDeg: -22,
        lonDeg: 120,
        category: 'storm',
        lauraSpeech: "Welcome to Jupiter's legendary Great Red Spot! This colossal crimson anticyclone is larger than our entire planet Earth and has raged relentlessly for more than three centuries.",
      },
      {
        id: 'europa-orbital-resonance',
        title: 'Europa Ice Crust & Ocean Beacon',
        shortDesc: 'Subsurface liquid ocean harbored beneath 20 km of ice',
        explanation: 'Europa is locked in a 1:2:4 Laplace orbital resonance with Io and Ganymede, generating tidal heating that sustains a salty ocean with twice Earth’s water volume.',
        latDeg: 15,
        lonDeg: 45,
        category: 'moon',
        lauraSpeech: "Look towards Jupiter's Galilean satellites! Moon Europa hides a global liquid saltwater ocean beneath its fractured ice shell, making it one of our highest-priority targets for alien life exploration.",
      },
      {
        id: 'jovian-aurora',
        title: 'Jovian Polar Aurora Borealis',
        shortDesc: 'Megawatt auroral curtains fueled by Io volcanic sulfur ions',
        explanation: 'Jupiter’s magnetic field is 20,000 times stronger than Earth’s. Volcanic gas blasted into space by moon Io is ionized into a plasma torus, lighting up permanent ultraviolet and X-ray polar auroras.',
        latDeg: 75,
        lonDeg: 280,
        category: 'atmosphere',
        lauraSpeech: "Stunning atmospheric ionization! Jupiter's colossal magnetosphere channels electrified particles from volcanic moon Io straight into the poles, sparking perpetual auroras hundreds of times more energetic than Earth's.",
      },
    ],
    scientificSignificance:
      'Jupiter acted as the primary gravitational architect of the early solar system, sweeping up planetesimals, shaping the asteroid belt, and shielding the inner terrestrial worlds from devastating comet bombardments.',
    lauraNarration: {
      intro:
        'Behold the undisputed King of the Planets: Jupiter! More than one thousand three hundred Earths could easily fit inside this titanic gas giant.',
      orbitAndScale:
        'Despite its gargantuan size, Jupiter is the fastest spinning world in our solar system. A complete Jovian day lasts less than ten hours!',
      atmosphereAndSurface:
        'Jupiter has no solid surface to walk on. Its clouds are organized into roaring jet streams, crowned by the Great Red Spot—a storm larger than Earth that has raged for centuries.',
      moonsAndRings:
        'Jupiter is a miniature solar system with ninety-five known moons! The four Galilean moons include volcanic Io, ocean-harboring Europa, giant Ganymede, and cratered Callisto.',
      explorationAndSignificance:
        'NASA’s Juno spacecraft has mapped its immense magnetic field, and the Europa Clipper is on its way to investigate whether life could swim in Europa’s dark, warm subsurface ocean!',
    },
    visuals: {
      primaryColor: '#F97316',
      glowColor: '#FBBF24',
      atmosphereColor: '#FDE68A',
      textureMapUrl: '/assets/textures/jupiter.jpg',
    },
  },

  saturn: {
    id: 'saturn',
    name: 'Saturn',
    latinName: 'Saturnus / Cronus',
    classification: 'Gas Giant / Ringed Sovereign',
    tagline: 'The Photometric Jewel of Majestic Ice Rings and Methane Seas',
    overviewSummary:
      'Saturn is the sixth planet from the Sun, celebrated for its spectacular, complex ring system spanning hundreds of thousands of kilometers while being mere meters thick. It is the least dense planet in the solar system.',
    astronomy: {
      semiMajorAxisAU: 9.537,
      semiMajorAxisKm: '1,433,530,000 km',
      perihelionKm: '1,352,550,000 km',
      aphelionKm: '1,514,500,000 km',
      orbitalPeriodDays: 10759.22,
      orbitalPeriodEarthYears: 29.46,
      orbitalVelocityKmS: 9.69,
      orbitalEccentricity: 0.0542,
      orbitalInclinationDeg: 2.485,
      rotationPeriodHours: 10.656,
      rotationDescription: 'Rapid differential rotation completes in approximately 10 hours and 33 minutes',
      isRetrogradeRotation: false,
      axialTiltDeg: 26.73,
    },
    physics: {
      equatorialDiameterKm: 120536,
      diameterEarthRatio: 9.45,
      massKg: '5.683 × 10²⁶ kg',
      massEarthRatio: 95.16,
      meanDensityGcm3: 0.687, // Less dense than water!
      surfaceGravityMs2: 10.44,
      gravityEarthG: 1.065,
      escapeVelocityKmS: 35.5,
      meanTemperatureC: -140,
      minTemperatureC: -185,
      maxTemperatureC: 11700, // Core boundary
      surfacePressureAtm: '> 1000 atm at interior transition',
      hasMagneticField: true,
      magneticFieldStrength: 'Nearly perfect magnetic dipole aligned with its rotational axis',
    },
    atmosphere: {
      hasAtmosphere: true,
      scaleHeightKm: 59.5,
      composition: [
        { gas: 'Hydrogen', formula: 'H₂', percentage: 96.3, color: '#38BDF8' },
        { gas: 'Helium', formula: 'He', percentage: 3.25, color: '#FBBF24' },
        { gas: 'Methane', formula: 'CH₄', percentage: 0.45, color: '#34D399' },
        { gas: 'Ammonia', formula: 'NH₃', percentage: 0.01, color: '#F472B6' },
      ],
      description:
        'A hazy golden atmosphere featuring muted pastel bands and winds exceeding 1,800 km/h. Its north pole exhibits a bizarre, geometrically perfect hexagonal jet stream.',
    },
    satellites: {
      moonCount: 146, // Most moons of any planet
      majorMoons: [
        {
          id: 'titan',
          name: 'Titan',
          diameterKm: 5149.5,
          orbitalDistanceKm: 1221870,
          orbitalPeriodDays: 15.945,
          discoveryYear: 1655,
          discoverer: 'Christiaan Huygens',
          description: 'The second largest moon in the solar system, wrapped in an opaque orange nitrogen smog with liquid methane rain, rivers, and polar seas.',
          color: '#F59E0B',
        },
        {
          id: 'enceladus',
          name: 'Enceladus',
          diameterKm: 504.2,
          orbitalDistanceKm: 238040,
          orbitalPeriodDays: 1.37,
          discoveryYear: 1789,
          discoverer: 'William Herschel',
          description: 'A dazzling white icy world venting towering cryovolcanic geysers of salty water and organic molecules from its south polar tiger stripe fissures.',
          color: '#F8FAFC',
        },
        {
          id: 'mimas',
          name: 'Mimas',
          diameterKm: 396.4,
          orbitalDistanceKm: 185540,
          orbitalPeriodDays: 0.942,
          discoveryYear: 1789,
          discoverer: 'William Herschel',
          description: 'Famous for the colossal 130-kilometer Herschel impact crater that makes it resemble the Death Star.',
          color: '#94A3B8',
        },
      ],
      hasRings: true,
      ringDescription: 'The most extensive ring system in the solar system, composed of 99% pure water ice particles ranging in size from dust grains to house-sized boulders.',
      ringSpanKm: '282,000 km diameter (10 to 30 meters thick)',
    },
    missions: [
      {
        name: 'Cassini-Huygens',
        agency: 'NASA / ESA / ASI',
        launchYear: 1997,
        arrivalYear: 2004,
        type: 'Orbiter',
        status: 'Completed',
        keyDiscovery: '13-year flagship orbital tour discovering Enceladus ocean geysers, landing the Huygens probe on Titan, and executing the daring Grand Finale ring dives in 2017.',
      },
      {
        name: 'Dragonfly',
        agency: 'NASA',
        launchYear: 2028,
        type: 'Lander',
        status: 'Planned',
        keyDiscovery: 'Rotorcraft drone mission to fly between dozens of prebiotic chemistry locations across Titan’s dunes and craters.',
      },
      {
        name: 'Voyager 1 & 2',
        agency: 'NASA',
        launchYear: 1977,
        arrivalYear: 1980,
        type: 'Flyby',
        status: 'Completed',
        keyDiscovery: 'First detailed measurements of ring particle structure, shepherd moons, and Titan’s thick nitrogen atmosphere.',
      },
    ],
    surfaceFeatures: [
      {
        title: 'The Great Ring System & Cassini Division',
        description: 'Spanning 282,000 km across, the rings are partitioned into distinct rings (A, B, C, D) separated by gravitational resonance gaps like the 4,800-km-wide Cassini Division.',
        coordinateOrLocation: 'Equatorial Orbital Plane',
      },
      {
        title: 'North Polar Hexagonal Jet Stream',
        description: 'A persistent six-sided geometric cloud pattern at Saturn’s north pole spanning 30,000 km across, with a central eye vortex roaring at over 300 km/h.',
        coordinateOrLocation: '78° N Pole',
      },
      {
        title: 'Enceladus Tiger Stripe Geysers',
        description: 'Four sub-parallel fractures at the south pole spewing water vapor and silica nanoparticles straight into space, feeding Saturn’s diffuse E-ring.',
        coordinateOrLocation: 'Enceladus South Pole',
      },
    ],
    scientificSignificance:
      'Saturn represents the archetype for ringed worlds across the galaxy. Its low average density (0.687 g/cm³) means Saturn would literally float if placed in an ocean large enough!',
    lauraNarration: {
      intro:
        'Prepare your optical sensors for the jewel of our solar system: Saturn! Its dazzling rings make it one of the most sublime sights in all of astronomy.',
      orbitAndScale:
        'Saturn orbits almost ten times farther from the Sun than Earth, taking nearly thirty Earth years to complete a single celestial circuit.',
      atmosphereAndSurface:
        'Saturn is made almost entirely of hydrogen and helium and has the lowest density of any planet—less dense than liquid water! At its north pole, a bizarre six-sided hurricane hexagon spins perpetually.',
      moonsAndRings:
        'Saturn is the moon champion with one hundred and forty-six confirmed satellites! Titan is larger than Mercury with rivers of liquid methane, while tiny Enceladus sprays saltwater geysers from an underground ocean.',
      explorationAndSignificance:
        'The Cassini spacecraft spent thirteen glorious years exploring Saturn before taking its final plunge into the clouds. Saturn proves that nature produces engineering marvels beyond imagination.',
    },
    visuals: {
      primaryColor: '#FCD34D',
      glowColor: '#F59E0B',
      ringColor: 'rgba(234, 179, 8, 0.75)',
      atmosphereColor: '#FEF08A',
      textureMapUrl: '/assets/textures/saturn.jpg',
    },
  },

  uranus: {
    id: 'uranus',
    name: 'Uranus',
    latinName: 'Caelus / Ouranos',
    classification: 'Ice Giant / Sideways Ice World',
    tagline: 'The Tilted Aquamarine Ice Giant with Extreme Seasons',
    overviewSummary:
      'Uranus is the seventh planet from the Sun, categorized as an ice giant. It is famous for its extreme 97.8-degree axial tilt, causing it to roll along its orbit on its side like a cosmic bowling ball.',
    astronomy: {
      semiMajorAxisAU: 19.191,
      semiMajorAxisKm: '2,870,972,000 km',
      perihelionKm: '2,741,300,000 km',
      aphelionKm: '3,003,620,000 km',
      orbitalPeriodDays: 30685.4,
      orbitalPeriodEarthYears: 84.02,
      orbitalVelocityKmS: 6.8,
      orbitalEccentricity: 0.0463,
      orbitalInclinationDeg: 0.773,
      rotationPeriodHours: -17.24, // Retrograde spin
      rotationDescription: 'Rolls on its side with a 17-hour retrograde rotation period',
      isRetrogradeRotation: true,
      axialTiltDeg: 97.77,
    },
    physics: {
      equatorialDiameterKm: 51118,
      diameterEarthRatio: 4.01,
      massKg: '8.681 × 10²⁵ kg',
      massEarthRatio: 14.54,
      meanDensityGcm3: 1.27,
      surfaceGravityMs2: 8.69,
      gravityEarthG: 0.886,
      escapeVelocityKmS: 21.3,
      meanTemperatureC: -195,
      minTemperatureC: -224, // Coldest planetary atmosphere in the system!
      maxTemperatureC: 4700, // Core boundary
      surfacePressureAtm: '> 100 atm at mantle transition',
      hasMagneticField: true,
      magneticFieldStrength: 'Highly tilted (59°) and offset from planetary center by a third of its radius',
    },
    atmosphere: {
      hasAtmosphere: true,
      scaleHeightKm: 27.7,
      composition: [
        { gas: 'Hydrogen', formula: 'H₂', percentage: 82.5, color: '#38BDF8' },
        { gas: 'Helium', formula: 'He', percentage: 15.2, color: '#FBBF24' },
        { gas: 'Methane', formula: 'CH₄', percentage: 2.3, color: '#2DD4BF' },
        { gas: 'Hydrogen Deuteride', formula: 'HD', percentage: 0.01, color: '#A78BFA' },
      ],
      description:
        'A tranquil pale cyan atmosphere. Methane gas in the upper layers absorbs red wavelengths from sunlight, reflecting back the cool aquamarine light. Features faint seasonal cloud bands and storm spots.',
    },
    satellites: {
      moonCount: 28,
      majorMoons: [
        {
          id: 'miranda',
          name: 'Miranda',
          diameterKm: 471.6,
          orbitalDistanceKm: 129390,
          orbitalPeriodDays: 1.413,
          discoveryYear: 1948,
          discoverer: 'Gerard Kuiper',
          description: 'A bizarre Frankenstein moon with chevron fault lines, giant fault scarps like Verona Rupes (20 km sheer cliff—tallest cliff in the solar system), and jumbled terrain.',
          color: '#CBD5E1',
        },
        {
          id: 'titania',
          name: 'Titania',
          diameterKm: 1577.8,
          orbitalDistanceKm: 435910,
          orbitalPeriodDays: 8.706,
          discoveryYear: 1787,
          discoverer: 'William Herschel',
          description: 'The largest moon of Uranus, scarred by deep tectonic grabens and rift valleys stretching thousands of kilometers.',
          color: '#94A3B8',
        },
        {
          id: 'oberon',
          name: 'Oberon',
          diameterKm: 1522.8,
          orbitalDistanceKm: 583520,
          orbitalPeriodDays: 13.463,
          discoveryYear: 1787,
          discoverer: 'William Herschel',
          description: 'The outermost major moon, heavily cratered with enigmatic dark material flooring its impact basins.',
          color: '#64748B',
        },
      ],
      hasRings: true,
      ringDescription: '13 distinct narrow dark rings composed of boulder-sized dark organic-rich carbonaceous particles.',
      ringSpanKm: '51,000 km',
    },
    missions: [
      {
        name: 'Voyager 2',
        agency: 'NASA',
        launchYear: 1977,
        arrivalYear: 1986,
        type: 'Flyby',
        status: 'Completed',
        keyDiscovery: 'The only spacecraft to ever visit Uranus, discovering 10 new moons, 2 new rings, and its strangely tilted lopsided magnetosphere.',
      },
      {
        name: 'Uranus Orbiter and Probe (UOP)',
        agency: 'NASA / Decadal Survey Priority',
        launchYear: 2031,
        type: 'Orbiter',
        status: 'Planned',
        keyDiscovery: 'Top priority flagship mission to deploy an atmospheric entry probe and tour the ice giant’s satellite system.',
      },
    ],
    surfaceFeatures: [
      {
        title: 'Verona Rupes Cliff (Miranda)',
        description: 'A sheer tectonic cliff face towering 20 kilometers high on moon Miranda. In its low gravity, dropping an object from the top would take over 12 minutes to hit the bottom!',
        coordinateOrLocation: 'Moon Miranda',
      },
      {
        title: 'Sideways Axis Collision Legacy',
        description: 'An ancient protoplanet collision tilted Uranus 98 degrees during the late heavy bombardment, creating 21-year-long polar days and nights.',
        coordinateOrLocation: 'Axial Plane',
      },
      {
        title: 'Off-Center Lopsided Magnetosphere',
        description: 'Unlike Earth or Jupiter, Uranus’s magnetic field does not originate at its core but is generated in shallow convective salty water-ammonia mantle layers.',
        coordinateOrLocation: 'Mantle Boundary',
      },
    ],
    scientificSignificance:
      'Ice giants like Uranus and Neptune are the most common planetary category detected around other stars in our galaxy. Understanding Uranus unlocks the physics of thousands of exoplanets.',
    lauraNarration: {
      intro:
        'Fasten your harness, cadet! We are descending toward Uranus, the serene aquamarine ice giant rolling on its side in the cold outer depths.',
      orbitAndScale:
        'Uranus is almost twenty times farther from Sol than Earth, taking eighty-four Earth years to complete one orbit! Because it is tilted by ninety-eight degrees, each pole spends forty-two years in continuous sunlight followed by forty-two years of frigid darkness.',
      atmosphereAndSurface:
        'Its pale cyan color comes from methane in its upper atmosphere, which absorbs red light. Uranus also holds the record for the coldest recorded atmosphere in the solar system: minus two hundred and twenty-four degrees Celsius!',
      moonsAndRings:
        'Uranus has twenty-eight moons named after characters from Shakespeare and Alexander Pope. Its moon Miranda has the tallest sheer cliff in the solar system, Verona Rupes, dropping twenty kilometers down!',
      explorationAndSignificance:
        'Only one human probe has ever visited Uranus: Voyager 2 in 1986. Planetary scientists around the world consider returning to Uranus with an orbiter their highest priority for the coming decade.',
    },
    visuals: {
      primaryColor: '#6EE7B7',
      glowColor: '#2DD4BF',
      ringColor: 'rgba(45, 212, 191, 0.4)',
      atmosphereColor: '#A7F3D0',
      textureMapUrl: '/assets/textures/uranus.jpg',
    },
  },

  neptune: {
    id: 'neptune',
    name: 'Neptune',
    latinName: 'Neptunus / Poseidon',
    classification: 'Ice Giant / Supersonic Frontier',
    tagline: 'The Azure Sentinel of Supersonic Winds and Triton Geysers',
    overviewSummary:
      'Neptune is the eighth and outermost planet from the Sun, glowing with an intense cobalt-blue hue. Orbiting thirty times farther than Earth, Neptune harbors the most violent supersonic winds in the solar system.',
    astronomy: {
      semiMajorAxisAU: 30.07,
      semiMajorAxisKm: '4,498,396,000 km',
      perihelionKm: '4,459,750,000 km',
      aphelionKm: '4,537,000,000 km',
      orbitalPeriodDays: 60190.0,
      orbitalPeriodEarthYears: 164.79,
      orbitalVelocityKmS: 5.43,
      orbitalEccentricity: 0.0086,
      orbitalInclinationDeg: 1.77,
      rotationPeriodHours: 16.11,
      rotationDescription: 'Rapid 16.1-hour rotation period driving supersonic atmospheric jets',
      isRetrogradeRotation: false,
      axialTiltDeg: 28.32,
    },
    physics: {
      equatorialDiameterKm: 49528,
      diameterEarthRatio: 3.88,
      massKg: '1.024 × 10²⁶ kg',
      massEarthRatio: 17.15,
      meanDensityGcm3: 1.638,
      surfaceGravityMs2: 11.15,
      gravityEarthG: 1.14,
      escapeVelocityKmS: 23.5,
      meanTemperatureC: -201,
      minTemperatureC: -218,
      maxTemperatureC: 7000, // Core boundary
      surfacePressureAtm: '> 100 atm at mantle transition',
      hasMagneticField: true,
      magneticFieldStrength: 'Tilted 47° to the rotation axis and strongly offset from the planet’s center',
    },
    atmosphere: {
      hasAtmosphere: true,
      scaleHeightKm: 19.7,
      composition: [
        { gas: 'Hydrogen', formula: 'H₂', percentage: 80.0, color: '#38BDF8' },
        { gas: 'Helium', formula: 'He', percentage: 19.0, color: '#FBBF24' },
        { gas: 'Methane', formula: 'CH₄', percentage: 1.5, color: '#60A5FA' },
        { gas: 'Hydrogen Deuteride', formula: 'HD', percentage: 0.019, color: '#A78BFA' },
      ],
      description:
        'An intense azure atmosphere fueled by an unknown atmospheric chromophore alongside methane. Features supersonic retrograde equatorial jet streams roaring at over 2,100 km/h and white cirrus clouds of methane ice crystals.',
    },
    satellites: {
      moonCount: 16,
      majorMoons: [
        {
          id: 'triton',
          name: 'Triton',
          diameterKm: 2706.8,
          orbitalDistanceKm: 354760,
          orbitalPeriodDays: -5.877, // Retrograde orbit
          discoveryYear: 1846,
          discoverer: 'William Lassell',
          description: 'A captured Kuiper Belt dwarf planet orbiting backward, featuring active nitrogen ice geysers spewing dark plumes 8 kilometers high into its tenuous atmosphere.',
          color: '#E0F2FE',
        },
        {
          id: 'proteus',
          name: 'Proteus',
          diameterKm: 420.0,
          orbitalDistanceKm: 117647,
          orbitalPeriodDays: 1.122,
          discoveryYear: 1989,
          discoverer: 'Voyager 2 Science Team',
          description: 'A dark, boxy irregular moon that is the largest body possible without being pulled into a sphere by its own gravity.',
          color: '#475569',
        },
        {
          id: 'nereid',
          name: 'Nereid',
          diameterKm: 340.0,
          orbitalDistanceKm: 5513816,
          orbitalPeriodDays: 360.13,
          discoveryYear: 1949,
          discoverer: 'Gerard Kuiper',
          description: 'Possesses one of the most eccentric orbits of any moon in the solar system, swinging from 1.4 million km to 9.6 million km from Neptune.',
          color: '#64748B',
        },
      ],
      hasRings: true,
      ringDescription: 'Faint dusty rings with distinctive bright clumped arcs (Liberté, Égalité, Fraternité, Courage) held together by shepherd moon Galatea.',
      ringSpanKm: '63,000 km',
    },
    missions: [
      {
        name: 'Voyager 2',
        agency: 'NASA',
        launchYear: 1977,
        arrivalYear: 1989,
        type: 'Flyby',
        status: 'Completed',
        keyDiscovery: 'Daring close flyby 4,950 km above Neptune’s north pole, discovering the Great Dark Spot, supersonic wind speeds, ring arcs, and active geysers on Triton.',
      },
      {
        name: 'Hubble Space Telescope',
        agency: 'NASA / ESA',
        launchYear: 1990,
        type: 'Orbiter',
        status: 'Operational',
        keyDiscovery: 'Long-term monitoring of Neptune’s dynamic transient dark spots appearing, drifting, and dissipating over multi-year cycles.',
      },
    ],
    surfaceFeatures: [
      {
        title: 'The Great Dark Spot & Scooter',
        description: 'An Earth-sized anticyclonic storm discovered by Voyager 2, accompanied by rapid white methane cirrus cloud streaks nicknamed "Scooter" zipping around the planet every 16 hours.',
        coordinateOrLocation: '22° S latitude',
      },
      {
        title: 'Supersonic Equatorial Wind Jet',
        description: 'Retrograde atmospheric wind streams whipping around Neptune at speeds up to 2,100 km/h (Mach 1.7)—the fastest winds ever measured in the solar system.',
        coordinateOrLocation: 'Equatorial Jet Stream',
      },
      {
        title: 'Triton Cantaloupe Terrain & Cryogeysers',
        description: 'Triton’s unique crust resembles the wrinkled skin of a cantaloupe melon, punctuated by cryovolcanic vents blasting nitrogen gas and dark organic dust.',
        coordinateOrLocation: 'Moon Triton',
      },
    ],
    hotspots: [
      {
        id: 'great-dark-spot',
        title: 'The Great Dark Spot',
        shortDesc: 'Earth-sized anticyclonic vortex storm system',
        explanation: 'An immense cyclonic vortex measuring 13,000 × 6,600 km, large enough to contain Earth. It is an atmospheric hole punching through upper methane haze, driven by intense internal heat convection.',
        latDeg: -22,
        lonDeg: 45,
        category: 'storm',
        lauraSpeech: "You are looking at The Great Dark Spot. Discovered by NASA's Voyager 2, this titanic cyclonic storm is nearly as large as the entire planet Earth! Its dark coloration is believed to be a vortex hole punching through Neptune's upper methane haze.",
      },
      {
        id: 'scooter-clouds',
        title: 'Scooter Methane Cirrus',
        shortDesc: 'High-speed bright white methane ice formation',
        explanation: 'Nicknamed "Scooter" because it zipped around Neptune faster than any other storm cloud, completing a full orbit every 16 hours. Composed of ultra-cold frozen methane ice crystals.',
        latDeg: -42,
        lonDeg: 120,
        category: 'atmosphere',
        lauraSpeech: "Notice this brilliant white streak! Astronomers nicknamed it Scooter because it races around Neptune faster than any other atmospheric cloud band, zipping across the planet in just sixteen hours.",
      },
      {
        id: 'supersonic-winds',
        title: 'Supersonic Equatorial Jet',
        shortDesc: 'Fastest planetary winds in the solar system (2,100 km/h)',
        explanation: 'Neptune’s equatorial winds blow westwards at speeds up to 2,100 km/h (Mach 1.7). With virtually no solid surface friction, high-altitude jet streams accelerate to supersonic speeds.',
        latDeg: 0,
        lonDeg: 200,
        category: 'atmosphere',
        lauraSpeech: "Incredible telemetry reading! Here at Neptune's equator, winds howl at over two thousand one hundred kilometers per hour. That is supersonic—faster than the speed of sound and the most ferocious winds in the solar system!",
      },
      {
        id: 'ring-arcs',
        title: 'Courage & Liberté Ring Arcs',
        shortDesc: 'Clumped dusty ring structures stabilized by Galatea',
        explanation: 'Neptune possesses five rings with distinct bright arcs named Liberté, Égalité, Fraternité, and Courage. Gravitational resonance from shepherd moon Galatea holds these icy arcs together.',
        latDeg: 12,
        lonDeg: 310,
        category: 'ring',
        lauraSpeech: "Look closely at the orbital plane! Neptune has a delicate ring system with five distinct rings. Unlike Saturn's uniform rings, Neptune's rings form clumped arcs, stabilized by the gravitational shepherd moon Galatea.",
      },
      {
        id: 'triton-beacon',
        title: 'Moon Triton Gravitational Capture',
        shortDesc: 'Retrograde dwarf planet with active nitrogen cryogeysers',
        explanation: 'Triton is Neptune’s largest satellite (2,710 km diameter). It orbits retrograde (backwards), proving it was a Kuiper Belt dwarf planet gravitationally snared by Neptune.',
        latDeg: 55,
        lonDeg: 80,
        category: 'moon',
        lauraSpeech: "Behold Triton, Neptune's largest satellite! Triton is unique in the solar system: it orbits backwards in retrograde motion. It is a captured Kuiper Belt dwarf planet with active cryovolcanoes spewing liquid nitrogen plumes into space.",
      },
      {
        id: 'methane-atmosphere',
        title: 'Methane Absorption & Cobalt Glow',
        shortDesc: 'Upper atmospheric methane absorbs red light, scattering blue',
        explanation: 'Neptune’s vibrant blue hue is created by atmospheric methane (CH₄), which absorbs red sunlight wavelengths and reflects vivid blue and cyan light back into the cosmos.',
        latDeg: -55,
        lonDeg: 270,
        category: 'atmosphere',
        lauraSpeech: "Neptune's mesmerizing azure blue color comes from methane gas in its outer atmosphere. Methane absorbs red light from the sun, reflecting back this deep, luminous cobalt blue into the dark void.",
      },
      {
        id: 'internal-dynamo',
        title: 'Internal Thermal Convection Engine',
        shortDesc: 'Radiates 2.6x more energy than it absorbs from the Sun',
        explanation: 'Despite receiving 900 times less sunlight than Earth, Neptune radiates 2.61 times more heat than it absorbs. An internal supercritical water-ammonia ionic mantle powers violent atmospheric convection.',
        latDeg: -10,
        lonDeg: 155,
        category: 'dynamo',
        lauraSpeech: "Despite being four point five billion kilometers from the Sun, Neptune generates its own internal heat engine! It radiates two point six times more thermal energy than it receives from solar radiation.",
      },
    ],
    scientificSignificance:
      'Despite receiving 900 times less sunlight than Earth, Neptune radiates 2.61 times more heat than it absorbs. This internal convective heat engine powers its supersonic jet streams and dynamic weather at the frontier of the Kuiper Belt.',
    lauraNarration: {
      intro:
        'Welcome to the ultimate frontier of the major planets: Neptune! Glowering in magnificent deep cobalt blue, this ice giant stands sentinel thirty times farther from the Sun than Earth.',
      orbitAndScale:
        'Neptune takes an incredible one hundred and sixty-five Earth years to make a single orbit! In fact, it only completed its first full orbit since discovery in 2011.',
      atmosphereAndSurface:
        'Hold on tight! Neptune holds the solar system record for the most violent weather, with supersonic winds whipping through its methane clouds at over two thousand one hundred kilometers per hour!',
      moonsAndRings:
        'Neptune captured a rogue dwarf planet from the Kuiper Belt: its moon Triton! Triton orbits backwards and has active cryovolcanoes spewing liquid nitrogen geysers into the void.',
      explorationAndSignificance:
        'NASA’s Voyager 2 flew by in 1989, giving us our only close-up view of this azure masterpiece. Beyond Neptune lies the mysterious icy realm of the Kuiper Belt and the deep interstellar void.',
    },
    visuals: {
      primaryColor: '#60A5FA',
      glowColor: '#3B82F6',
      ringColor: 'rgba(59, 130, 246, 0.4)',
      atmosphereColor: '#93C5FD',
      textureMapUrl: '/assets/textures/neptune.jpg',
    },
  },
  moon: {
    id: 'moon' as any,
    name: 'The Moon',
    latinName: 'Luna',
    classification: 'Natural Terrestrial Satellite',
    tagline: 'Earth’s Gravitational Partner & Cosmic Witness',
    overviewSummary:
      'The fifth-largest satellite in the Solar System and the only celestial body beyond Earth visited by humans. Tidally locked to Earth, Luna stabilizes our axial tilt, drives ocean tides, and preserves an pristine billion-year record of Solar System bombardment.',
    astronomy: {
      semiMajorAxisAU: 0.00257,
      semiMajorAxisKm: '384,400 km from Earth',
      perihelionKm: '363,300 km (Perigee)',
      aphelionKm: '405,500 km (Apogee)',
      orbitalPeriodDays: 27.32,
      orbitalPeriodEarthYears: 0.0748,
      orbitalVelocityKmS: 1.022,
      orbitalEccentricity: 0.0549,
      orbitalInclinationDeg: 5.14,
      rotationPeriodHours: 655.7,
      rotationDescription: 'Synchronous 1:1 tidal lock; orbital period matches rotational period exactly',
      isRetrogradeRotation: false,
      axialTiltDeg: 1.54,
    },
    physics: {
      equatorialDiameterKm: 3474.8,
      diameterEarthRatio: 0.2727,
      massKg: '7.342 × 10²² kg',
      massEarthRatio: 0.0123,
      meanDensityGcm3: 3.344,
      surfaceGravityMs2: 1.62,
      gravityEarthG: 0.166,
      escapeVelocityKmS: 2.38,
      meanTemperatureC: -20,
      minTemperatureC: -246, // Permanently shadowed polar craters
      maxTemperatureC: 120, // Lunar noon
      surfacePressureAtm: '3 × 10⁻¹⁵ atm (Surface Boundary Exosphere)',
      hasMagneticField: false,
      magneticFieldStrength: '< 0.0001 Gauss (Remnant crustal paleomagnetism)',
    },
    atmosphere: {
      hasAtmosphere: false,
      scaleHeightKm: 50,
      composition: [
        { gas: 'Argon-40', formula: '⁴⁰Ar', percentage: 40.0, color: '#38BDF8' },
        { gas: 'Helium-4', formula: '⁴He', percentage: 35.0, color: '#FBBF24' },
        { gas: 'Neon-20', formula: '²⁰Ne', percentage: 20.0, color: '#34D399' },
        { gas: 'Hydrogen', formula: 'H₂', percentage: 5.0, color: '#94A3B8' },
      ],
      description:
        'A tenuous surface-boundary exosphere where atoms rarely collide. Trace gases are released via solar wind sputtering, micrometeoroid impacts, and lunar radiogenic outgassing.',
    },
    satellites: {
      moonCount: 0,
      majorMoons: [],
      hasRings: false,
    },
    missions: [
      {
        name: 'Apollo 11',
        agency: 'NASA',
        launchYear: 1969,
        arrivalYear: 1969,
        type: 'Lander',
        status: 'Completed',
        keyDiscovery: 'First crewed landing at Mare Tranquillitatis. Returned 21.6 kg of lunar basaltic rock.',
      },
      {
        name: 'Lunar Reconnaissance Orbiter (LRO)',
        agency: 'NASA',
        launchYear: 2009,
        type: 'Orbiter',
        status: 'Operational',
        keyDiscovery: 'Sub-meter global mapping, discovery of volatile water ice deposits trapped inside permanently shadowed polar craters.',
      },
      {
        name: 'Artemis Program',
        agency: 'NASA / ESA / JAXA',
        launchYear: 2022,
        type: 'Orbiter',
        status: 'Operational',
        keyDiscovery: 'Establishing sustainable human presence and Gateway lunar orbital outpost.',
      },
    ],
    hotspots: [
      {
        id: 'hotspot-tycho',
        title: 'Tycho Crater & Ray System',
        shortDesc: 'Spectacular 86-km impact crater with rays spanning 1,500 km.',
        explanation: 'Formed 108 million years ago by an asteroid impact. The violent collision ejected pulverised anorthosite crust thousands of kilometers in brilliant bright rays across the lunar near side.',
        latDeg: -43.31,
        lonDeg: -11.20,
        category: 'geology',
        lauraSpeech: 'Look at those incredible rays! Tycho is one of the youngest major craters on the Moon, formed during the age of the dinosaurs on Earth.',
      },
      {
        id: 'hotspot-tranquility',
        title: 'Tranquility Base (Apollo 11)',
        shortDesc: 'Historic landing site of Neil Armstrong and Buzz Aldrin in 1969.',
        explanation: 'Located in south-western Mare Tranquillitatis, this basaltic lava plain provided a flat, obstacle-free surface for humanity’s first steps on another celestial world.',
        latDeg: 8.50,
        lonDeg: 31.40,
        category: 'geology',
        lauraSpeech: 'Here at Tranquility Base, humanity first touched another world on July 20, 1969. The Eagle has landed!',
      },
      {
        id: 'hotspot-copernicus',
        title: 'Copernicus Crater',
        shortDesc: '93-km complex crater with terraced walls and central peaks.',
        explanation: 'A classic complex impact crater exhibiting 3.8-km-high terraced rim walls and three central mountain peaks that rebounded from deep within the lunar crust.',
        latDeg: 9.62,
        lonDeg: -20.08,
        category: 'geology',
        lauraSpeech: 'Copernicus showcases the physics of high-energy hypervelocity impacts: the central peaks formed when the lunar floor bounced upward after the collision!',
      },
    ],
    scientificSignificance:
      'The Moon preserves the early bombardment history of the inner Solar System, untouched by atmospheric erosion or plate tectonics. Permanently shadowed polar cold traps hold billions of tons of water ice essential for future deep-space exploration.',
    surfaceFeatures: [
      {
        title: 'Sea of Tranquility (Mare Tranquillitatis)',
        description: 'Ancient basaltic lunar plain and the historic landing site of Apollo 11, where Neil Armstrong and Buzz Aldrin first set foot on July 20, 1969.',
        coordinateOrLocation: '0.67° N, 23.47° E',
      },
      {
        title: 'Copernicus Crater',
        description: 'A prominent 93-kilometer impact crater with terraced walls, massive central peaks, and radiant white ejecta rays spanning hundreds of kilometers.',
        coordinateOrLocation: '9.62° N, 20.08° W',
      },
      {
        title: 'South Pole-Aitken Basin & Shackleton Crater',
        description: 'One of the deepest and oldest impact structures in the Solar System; permanently shadowed interior crater floors conceal extensive deposits of ancient water ice.',
        coordinateOrLocation: '89.9° S, 0.0° E',
      },
    ],
    lauraNarration: {
      intro:
        'Welcome to Luna, our closest celestial neighbor! Tidally locked to Earth, it guides our ocean tides and lights our night skies.',
      orbitAndScale:
        'The Moon orbits Earth at an average distance of 384,400 kilometers, completing an orbit every 27.3 days in synchronous rotation.',
      atmosphereAndSurface:
        'With virtually no atmosphere, temperatures swing from boiling 120°C in sunlight to -246°C in permanently shadowed polar craters.',
      moonsAndRings:
        'The Moon has no moons of its own, but its low-gravity environment (one-sixth of Earth) makes it the ideal springboard for Mars voyages.',
      explorationAndSignificance:
        'Twelve humans walked on its surface during NASA’s Apollo missions. Today, the Artemis program is returning humanity to the Moon to stay.',
    },
    visuals: {
      primaryColor: '#94A3B8',
      glowColor: '#64748B',
      atmosphereColor: 'transparent',
      textureMapUrl: '/assets/textures/moon.jpg',
    },
  },
  'milky-way': {
    id: 'milky-way' as any,
    name: 'The Milky Way Galaxy',
    latinName: 'Via Lactea',
    classification: 'Barred Spiral Galaxy (Hubble Type SBbc)',
    tagline: 'Our Home Island Universe of 100 to 400 Billion Stars',
    overviewSummary:
      'A majestic barred spiral galaxy spanning 100,000 light-years across. Home to our Solar System, situated in the Orion-Cygnus Spur approximately 26,000 light-years from Sagittarius A*, the supermassive black hole at the galactic center.',
    astronomy: {
      semiMajorAxisAU: 1650000000,
      semiMajorAxisKm: '26,000 Light-Years from Core',
      perihelionKm: '24,000 Light-Years',
      aphelionKm: '28,000 Light-Years',
      orbitalPeriodDays: 84000000000,
      orbitalPeriodEarthYears: 230000000, // Galactic Cosmic Year
      orbitalVelocityKmS: 220,
      orbitalEccentricity: 0.07,
      orbitalInclinationDeg: 63.0,
      rotationPeriodHours: 5520000000,
      rotationDescription: 'Differential galactic rotation: inner disc rotates in ~100 Myr, outer disk in ~250 Myr',
      isRetrogradeRotation: false,
      axialTiltDeg: 63.0,
    },
    physics: {
      equatorialDiameterKm: 946073047258080000, // 100,000 Light-Years in km
      diameterEarthRatio: 74200000000,
      massKg: '2.98 × 10⁴² kg (1.5 × 10¹² M☉)',
      massEarthRatio: 500000000000000,
      meanDensityGcm3: 0.000000000000000000001,
      surfaceGravityMs2: 0.000000002,
      gravityEarthG: 0.0000000002,
      escapeVelocityKmS: 550,
      meanTemperatureC: -270, // Cosmic Microwave Background
      minTemperatureC: -273, // Boomerang Nebula
      maxTemperatureC: 10000000, // Supernova remnants & X-ray halo
      surfacePressureAtm: 'Interstellar Vacuum (1 atom/cm³)',
      hasMagneticField: true,
      magneticFieldStrength: '3–5 microGauss galactic dynamo field',
    },
    atmosphere: {
      hasAtmosphere: true,
      scaleHeightKm: 30000000000,
      composition: [
        { gas: 'Atomic & Molecular Hydrogen', formula: 'H / H₂', percentage: 74.0, color: '#38BDF8' },
        { gas: 'Helium', formula: 'He', percentage: 24.0, color: '#FBBF24' },
        { gas: 'Interstellar Dust & Silicates', formula: 'Dust', percentage: 1.0, color: '#F59E0B' },
        { gas: 'Heavy Elements (Oxygen, Carbon, Iron)', formula: 'Metals', percentage: 1.0, color: '#EC4899' },
      ],
      description:
        'The Interstellar Medium (ISM) fills the galactic disk with cold molecular clouds, stellar nurseries, and a hot million-degree circumgalactic gas halo.',
    },
    satellites: {
      moonCount: 59, // Satellite dwarf galaxies (LMC, SMC, Sagittarius Dwarf, etc.)
      majorMoons: [],
      hasRings: false,
    },
    missions: [
      {
        name: 'Gaia Space Telescope',
        agency: 'ESA',
        launchYear: 2013,
        type: 'Orbiter',
        status: 'Operational',
        keyDiscovery: 'Precision 3D astrometric mapping of over 1.8 billion stars, measuring their velocities and galactic orbits.',
      },
      {
        name: 'James Webb Space Telescope (JWST)',
        agency: 'NASA / ESA / CSA',
        launchYear: 2021,
        type: 'Orbiter',
        status: 'Operational',
        keyDiscovery: 'High-resolution infrared imaging of Sagittarius A* and deepest stellar nurseries inside galactic dust clouds.',
      },
    ],
    hotspots: [
      {
        id: 'hotspot-sag-a',
        title: 'Sagittarius A* Supermassive Black Hole',
        shortDesc: 'The gravitational anchor of our galaxy (4.15 million solar masses).',
        explanation: 'Located in the galactic nucleus, Sagittarius A* is a compact radio source powered by a supermassive black hole. Stars orbit it at up to 8% the speed of light.',
        latDeg: -29.00,
        lonDeg: 0.00,
        category: 'dynamo',
        lauraSpeech: 'At the heart of our galaxy lies Sagittarius A*, a four-million-solar-mass black hole whose intense gravity shapes the galactic core!',
      },
      {
        id: 'hotspot-orion-spur',
        title: 'Orion-Cygnus Arm (Our Solar Neighborhood)',
        shortDesc: 'The spiral arm spur containing our Sun and Earth.',
        explanation: 'A localized spiral bridge connecting the Perseus and Sagittarius Arms. Our Sun orbits here at 220 km/s, completing a cosmic revolution every 230 million years.',
        latDeg: 12.00,
        lonDeg: 90.00,
        category: 'geology',
        lauraSpeech: 'This is home! Our Solar System travels through the Orion Spur, sailing in a serene pocket between major spiral density waves.',
      },
    ],
    scientificSignificance:
      'Understanding the Milky Way unlocks the history of stellar nucleosynthesis, galactic collision dynamics, and the distribution of dark matter comprising 85% of its total gravitational mass.',
    surfaceFeatures: [
      {
        title: 'Sagittarius A* (Supermassive Black Hole)',
        description: 'The gravitational anchor of our galaxy, packing 4.15 million solar masses into a compact core region imaged directly by the Event Horizon Telescope.',
        coordinateOrLocation: 'Galactic Center (26,000 Light-Years from Earth)',
      },
      {
        title: 'Orion-Cygnus Arm (Our Cosmic Neighborhood)',
        description: 'A major spiral bridge spur between the Perseus and Sagittarius arms, housing our Sun, the Orion Nebula stellar nursery, and nearby stellar systems.',
        coordinateOrLocation: 'Local Galactic Spur (~8 kpc from Core)',
      },
      {
        title: 'Fermi Bubbles & Galactic Halo',
        description: 'Colossal dual lobes of high-energy gamma-ray and X-ray emission ballooning 25,000 light-years above and below the galactic plane, driven by past central outbursts.',
        coordinateOrLocation: 'North and South Galactic Poles',
      },
    ],
    lauraNarration: {
      intro:
        'Welcome to the grand scale of the cosmos: our home galaxy, the Milky Way! An island universe of hundreds of billions of stars.',
      orbitAndScale:
        'Spanning 100,000 light-years across, our Solar System takes 230 million years to complete a single galactic orbit around the core.',
      atmosphereAndSurface:
        'Vast spiral arms are woven with interstellar gas and dust lanes where newborn stars ignite in dazzling stellar nurseries.',
      moonsAndRings:
        'The Milky Way is orbited by dozens of satellite dwarf galaxies, including the Large and Small Magellanic Clouds.',
      explorationAndSignificance:
        'Space telescopes like Gaia and JWST are mapping the chemical and dynamical tapestry of our cosmic home in unprecedented detail.',
    },
    visuals: {
      primaryColor: '#818CF8',
      glowColor: '#6366F1',
      atmosphereColor: 'rgba(129, 140, 248, 0.3)',
      textureMapUrl: '/assets/textures/galaxy.jpg',
    },
  },
};

export const CELESTIAL_ORDER: string[] = [
  'sun',
  'mercury',
  'venus',
  'earth',
  'moon',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'milky-way',
];
