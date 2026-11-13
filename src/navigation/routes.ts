/**
 * ORBIT ACADEMY — Application Route Definitions (Phase 7)
 * Centralized, strongly-typed route table mapped to celestial destinations.
 */

export const ROUTES = {
  HOME: '/',
  EXPLORER: '/explorer',
  EARTH_DRAWING: '/learning/earth',
  MARS_ADVENTURE: '/game/mars',
  VENUS_CLIMATE: '/lab/venus',
  JUPITER_LAB: '/lab/jupiter',
  SATURN_ART: '/art/saturn',
  URANUS_QUIZ: '/quiz/uranus',
  NEPTUNE_DISCOVERY: '/discovery/neptune',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * Validates whether a pathname corresponds to an official Orbit Academy route
 */
export function isValidRoute(path: string): path is AppRoute {
  return Object.values(ROUTES).includes(path as AppRoute);
}

/**
 * Canonical route list for routing and sitemap verification
 */
export const ALL_ROUTES: AppRoute[] = [
  ROUTES.HOME,
  ROUTES.EXPLORER,
  ROUTES.EARTH_DRAWING,
  ROUTES.MARS_ADVENTURE,
  ROUTES.VENUS_CLIMATE,
  ROUTES.JUPITER_LAB,
  ROUTES.SATURN_ART,
  ROUTES.URANUS_QUIZ,
  ROUTES.NEPTUNE_DISCOVERY,
];
