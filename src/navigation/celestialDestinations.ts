import { CelestialId } from '../types';
import { ROUTES, AppRoute } from './routes';

export type ModuleAvailability = 'available' | 'prototype' | 'in-development';

export interface CelestialDestination {
  celestialId: CelestialId;
  moduleId: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  learningObjective: string;
  category: string;
  route: AppRoute;
  themeAccent: string;
  secondaryAccent: string;
  iconName: string;
  availability: ModuleAvailability;
  badge: string;
  buttonText: string;
}

/**
 * CELESTIAL DESTINATION REGISTRY
 * Maps every celestial body to its dedicated learning application.
 */
export const CELESTIAL_DESTINATIONS: Record<CelestialId, CelestialDestination> = {
  sun: {
    celestialId: 'sun',
    moduleId: 'mission-control',
    name: 'Mission Control & Academy Home',
    shortName: 'Mission Control',
    tagline: 'Solar System Command Center',
    description: 'Central command interface overseeing celestial orbital telemetry, solar dynamics, and Academy navigation.',
    learningObjective: 'Observe real-time planetary orbital synchronization, solar limb physics, and system overview.',
    category: 'Core Command',
    route: ROUTES.HOME,
    themeAccent: '#F59E0B',
    secondaryAccent: '#FBBF24',
    iconName: 'Sun',
    availability: 'available',
    badge: 'MISSION CONTROL',
    buttonText: 'Return to Command',
  },
  mercury: {
    celestialId: 'mercury',
    moduleId: 'solar-explorer',
    name: 'Solar System Explorer',
    shortName: 'Solar Explorer',
    tagline: 'Scale, Gravity & Thermal Extremes',
    description: 'Interactive astronomical scale comparator and orbital velocity telemetry station.',
    learningObjective: 'Analyze orbital speeds, mass and density ratios, and extreme daytime/nighttime temperature differentials.',
    category: 'Astrophysics & Scale',
    route: ROUTES.EXPLORER,
    themeAccent: '#94A3B8',
    secondaryAccent: '#CBD5E1',
    iconName: 'Compass',
    availability: 'available',
    badge: 'INTERACTIVE EXPLORER',
    buttonText: 'Launch Explorer',
  },
  venus: {
    celestialId: 'venus',
    moduleId: 'venus-climate',
    name: 'Climate & Atmosphere Lab',
    shortName: 'Climate Lab',
    tagline: 'Supercritical Atmospheres & Runaway Greenhouse',
    description: 'Atmospheric laboratory simulating greenhouse thermal retention, supercritical CO2 pressures, and sulfuric cloud decks.',
    learningObjective: 'Investigate the physics of the runaway greenhouse effect and compare Venusian pressure with Earth.',
    category: 'Atmospheric Science',
    route: ROUTES.VENUS_CLIMATE,
    themeAccent: '#EAB308',
    secondaryAccent: '#CA8A04',
    iconName: 'Thermometer',
    availability: 'available',
    badge: 'INTERACTIVE LAB',
    buttonText: 'Enter Climate Lab',
  },
  earth: {
    celestialId: 'earth',
    moduleId: 'earth-drawing',
    name: 'Drawing & Colouring Studio',
    shortName: 'Drawing Studio',
    tagline: 'Astro-Art & Biosphere Illustration Canvas',
    description: 'Full-featured creative drawing canvas with space palettes, brush tools, eraser, and export for young astronomers.',
    learningObjective: 'Illustrate Earth magnetic field lines, cloud patterns, continental plates, and orbital satellites.',
    category: 'Creative Arts & Science',
    route: ROUTES.EARTH_DRAWING,
    themeAccent: '#38BDF8',
    secondaryAccent: '#10B981',
    iconName: 'Palette',
    availability: 'available',
    badge: 'CREATIVE STUDIO',
    buttonText: 'Open Drawing Studio',
  },
  mars: {
    celestialId: 'mars',
    moduleId: 'mars-adventure',
    name: 'Mars Rover Adventure',
    shortName: 'Rover Adventure',
    tagline: 'Jezero Crater Robotic Exploration',
    description: 'Cinematic expedition briefing and interactive rover sensor scanner probing Martian geology and water-ice signatures.',
    learningObjective: 'Examine rover spectrometer telemetry, ancient sediment layers, and subsurface ice detection in Jezero Crater.',
    category: 'Planetary Robotics',
    route: ROUTES.MARS_ADVENTURE,
    themeAccent: '#EF4444',
    secondaryAccent: '#DC2626',
    iconName: 'Gamepad2',
    availability: 'prototype',
    badge: 'EXPEDITION PROTOTYPE',
    buttonText: 'Start Expedition',
  },
  jupiter: {
    celestialId: 'jupiter',
    moduleId: 'jupiter-lab',
    name: 'Planetary Science Lab',
    shortName: 'Jovian Lab',
    tagline: 'Gas Giant Dynamics & Magnetospheric Physics',
    description: 'Interactive Jovian fluid simulation exploring Great Red Spot anticyclonic wind speeds and tidal forces on Galilean moons.',
    learningObjective: 'Model high-velocity storm bands, core density compression, and orbital resonances of Io, Europa, Ganymede, and Callisto.',
    category: 'Fluid Mechanics',
    route: ROUTES.JUPITER_LAB,
    themeAccent: '#F97316',
    secondaryAccent: '#D97706',
    iconName: 'FlaskConical',
    availability: 'available',
    badge: 'INTERACTIVE LAB',
    buttonText: 'Enter Science Lab',
  },
  saturn: {
    celestialId: 'saturn',
    moduleId: 'saturn-art',
    name: 'Space Art & Ring Studio',
    shortName: 'Ring Studio',
    tagline: 'Celestial Ring Acoustics & Photometric Art',
    description: 'Astro-optical studio analyzing Cassini Division light transmittance, ice particulate ring density, and shepherd moon dynamics.',
    learningObjective: 'Chart particulate ice-dust absorption, resonance gaps, and orbital ring wave propagation.',
    category: 'Optical Astronomy',
    route: ROUTES.SATURN_ART,
    themeAccent: '#FBBF24',
    secondaryAccent: '#D97706',
    iconName: 'Sparkles',
    availability: 'available',
    badge: 'INTERACTIVE STUDIO',
    buttonText: 'Open Ring Studio',
  },
  uranus: {
    celestialId: 'uranus',
    moduleId: 'uranus-quiz',
    name: 'Astronomy Quiz Arena',
    shortName: 'Quiz Arena',
    tagline: 'Extreme Axial Tilt & Deep Space Knowledge',
    description: 'Dynamic 5-question astronomy challenge arena with instant scientific explanations, scoring, and cosmic rank certificates.',
    learningObjective: 'Demonstrate comprehension of planetary classification, orbital mechanics, distance scales, and ice giant physics.',
    category: 'Knowledge Arena',
    route: ROUTES.URANUS_QUIZ,
    themeAccent: '#2DD4BF',
    secondaryAccent: '#14B8A6',
    iconName: 'HelpCircle',
    availability: 'available',
    badge: 'QUIZ ARENA',
    buttonText: 'Enter Quiz Arena',
  },
  neptune: {
    celestialId: 'neptune',
    moduleId: 'neptune-discovery',
    name: 'Cosmic Discovery Center',
    shortName: 'Discovery Center',
    tagline: 'Supersonic Winds & Kuiper Belt Gateway',
    description: 'Deep astronomy research station tracking supersonic storm telemetry (2,100 km/h) and charting Kuiper Belt boundaries.',
    learningObjective: 'Analyze methane absorption bands, Triton cryovolcanism, and outer heliospheric interstellar boundaries.',
    category: 'Deep Astronomy',
    route: ROUTES.NEPTUNE_DISCOVERY,
    themeAccent: '#60A5FA',
    secondaryAccent: '#3B82F6',
    iconName: 'Compass',
    availability: 'available',
    badge: 'DISCOVERY CENTER',
    buttonText: 'Enter Discovery Center',
  },
};

/**
 * Retrieve destination metadata by planet identifier
 */
export function getDestinationByPlanetId(planetId: CelestialId): CelestialDestination {
  return CELESTIAL_DESTINATIONS[planetId] || CELESTIAL_DESTINATIONS.sun;
}

/**
 * Retrieve destination metadata by URL route path
 */
export function getDestinationByRoute(route: string): CelestialDestination | undefined {
  return Object.values(CELESTIAL_DESTINATIONS).find((dest) => dest.route === route);
}

/**
 * Retrieve all registered celestial destinations
 */
export function getAllDestinations(): CelestialDestination[] {
  return Object.values(CELESTIAL_DESTINATIONS);
}

