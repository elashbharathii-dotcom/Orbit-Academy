import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppRoute, ROUTES, isValidRoute } from './routes';
import { CelestialDestination, getDestinationByPlanetId, getDestinationByRoute } from './celestialDestinations';
import { CelestialId } from '../types';
import { useSolarSystem } from '../context/SolarSystemContext';

interface NavigationContextType {
  currentRoute: AppRoute;
  activeDestination: CelestialDestination;
  isTransitioning: boolean;
  pendingPlanetId: CelestialId | null;
  navigate: (route: AppRoute, options?: { replace?: boolean }) => void;
  launchModuleForPlanet: (planetId: CelestialId, options?: { immediate?: boolean }) => void;
  returnToSolarSystem: (options?: { clearSelection?: boolean }) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

function getInitialRoute(): AppRoute {
  if (typeof window === 'undefined') return ROUTES.HOME;
  const path = window.location.pathname;
  return isValidRoute(path) ? path : ROUTES.HOME;
}

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [pendingPlanetId, setPendingPlanetId] = useState<CelestialId | null>(null);

  const { selectPlanet, selectedPlanetId } = useSolarSystem();

  // Active destination based on route or selected planet
  const activeDestination =
    getDestinationByRoute(currentRoute) ||
    getDestinationByPlanetId(selectedPlanetId || 'sun');

  // Handle browser Back / Forward history
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (isValidRoute(path)) {
        setCurrentRoute(path);
        const dest = getDestinationByRoute(path);
        if (dest && dest.celestialId !== 'sun') {
          selectPlanet(dest.celestialId);
        } else if (path === ROUTES.HOME) {
          // Do not necessarily unselect planet if user was inspecting in 3D
        }
      } else {
        setCurrentRoute(ROUTES.HOME);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectPlanet]);

  // Primary navigation dispatcher
  const navigate = useCallback((route: AppRoute, options?: { replace?: boolean }) => {
    if (!isValidRoute(route)) return;

    if (options?.replace) {
      window.history.replaceState({}, '', route);
    } else {
      window.history.pushState({}, '', route);
    }

    setCurrentRoute(route);
    setIsTransitioning(false);
    setPendingPlanetId(null);

    // Synchronize celestial body selection
    const dest = getDestinationByRoute(route);
    if (dest && dest.celestialId !== 'sun') {
      selectPlanet(dest.celestialId);
    }
  }, [selectPlanet]);

  // Launch module with optional camera flight transition
  const launchModuleForPlanet = useCallback(
    (planetId: CelestialId, options?: { immediate?: boolean }) => {
      const dest = getDestinationByPlanetId(planetId);
      if (!dest) return;

      selectPlanet(planetId);

      if (options?.immediate || planetId === 'sun') {
        navigate(dest.route);
        return;
      }

      // Start transition: Camera flies toward planet for 1.35 seconds
      setIsTransitioning(true);
      setPendingPlanetId(planetId);

      setTimeout(() => {
        navigate(dest.route);
      }, 1350);
    },
    [selectPlanet, navigate]
  );

  // Return to 3D Solar System View
  const returnToSolarSystem = useCallback(
    (options?: { clearSelection?: boolean }) => {
      if (options?.clearSelection) {
        selectPlanet(null);
      }
      navigate(ROUTES.HOME);
    },
    [selectPlanet, navigate]
  );

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        activeDestination,
        isTransitioning,
        pendingPlanetId,
        navigate,
        launchModuleForPlanet,
        returnToSolarSystem,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

