import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CelestialId,
  SolarSystemInteractionState,
  ViewingMode,
  ActiveEnvironment,
  GraphicsTier,
  DossierMode,
  DwarfPlanetId,
  SpacecraftId,
} from '../types';

const SolarSystemContext = createContext<SolarSystemInteractionState | null>(null);

function getInitialPlanet(): CelestialId | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const p = params.get('planet');
  const validIds: CelestialId[] = [
    'sun',
    'mercury',
    'venus',
    'earth',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
  ];
  return p && validIds.includes(p as CelestialId) ? (p as CelestialId) : null;
}

export const SolarSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPlanetId, setSelectedPlanetId] = useState<CelestialId | null>(getInitialPlanet);
  const [hoveredPlanetId, setHoveredPlanetId] = useState<CelestialId | null>(null);
  const [selectedMoonId, setSelectedMoonId] = useState<string | null>(null);
  const [viewingMode, setViewingModeState] = useState<ViewingMode>('cinematic');
  const [activeEnvironment, setActiveEnvironmentState] = useState<ActiveEnvironment>('solar-system');
  const [timeWarp, setTimeWarpState] = useState<number>(1.0);
  const [graphicsTier, setGraphicsTierState] = useState<GraphicsTier>('high');
  const [dossierMode, setDossierModeState] = useState<DossierMode>('educational');
  const [showAsteroidBelt, setShowAsteroidBeltState] = useState<boolean>(true);
  const [showKuiperBelt, setShowKuiperBeltState] = useState<boolean>(true);
  const [showSpacecraft, setShowSpacecraftState] = useState<boolean>(true);
  const [selectedDwarfPlanetId, setSelectedDwarfPlanetId] = useState<DwarfPlanetId | null>(null);
  const [selectedSpacecraftId, setSelectedSpacecraftId] = useState<SpacecraftId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const selectPlanet = useCallback((id: CelestialId | null) => {
    setSelectedPlanetId((prev) => {
      if (prev === id) return prev;
      setIsTransitioning(true);
      setSelectedMoonId(null); // Clear active moon on planet switch
      setSelectedDwarfPlanetId(null);
      setSelectedSpacecraftId(null);

      // Synchronize search params for shareable URLs
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (id) {
          url.searchParams.set('planet', id);
        } else {
          url.searchParams.delete('planet');
        }
        window.history.replaceState({}, '', url.toString());
      }

      return id;
    });
  }, []);

  const selectMoon = useCallback((id: string | null) => {
    setSelectedMoonId(id);
    if (id) {
      setSelectedDwarfPlanetId(null);
      setSelectedSpacecraftId(null);
    }
  }, []);

  const selectDwarfPlanet = useCallback((id: DwarfPlanetId | null) => {
    setSelectedDwarfPlanetId(id);
    if (id) {
      setSelectedPlanetId(null);
      setSelectedMoonId(null);
      setSelectedSpacecraftId(null);
      setIsTransitioning(true);
    }
  }, []);

  const selectSpacecraft = useCallback((id: SpacecraftId | null) => {
    setSelectedSpacecraftId(id);
    if (id) {
      setSelectedPlanetId(null);
      setSelectedMoonId(null);
      setSelectedDwarfPlanetId(null);
      setIsTransitioning(true);
    }
  }, []);

  const setHoveredPlanet = useCallback((id: CelestialId | null) => {
    setHoveredPlanetId(id);
  }, []);

  const setViewingMode = useCallback((mode: ViewingMode) => {
    setViewingModeState(mode);
  }, []);

  const setActiveEnvironment = useCallback((env: ActiveEnvironment) => {
    setActiveEnvironmentState(env);
  }, []);

  const setTimeWarp = useCallback((speed: number) => {
    setTimeWarpState(speed);
  }, []);

  const setGraphicsTier = useCallback((tier: GraphicsTier) => {
    setGraphicsTierState(tier);
  }, []);

  const setDossierMode = useCallback((mode: DossierMode) => {
    setDossierModeState(mode);
  }, []);

  const setShowAsteroidBelt = useCallback((show: boolean) => {
    setShowAsteroidBeltState(show);
  }, []);

  const setShowKuiperBelt = useCallback((show: boolean) => {
    setShowKuiperBeltState(show);
  }, []);

  const setShowSpacecraft = useCallback((show: boolean) => {
    setShowSpacecraftState(show);
  }, []);

  // Keyboard navigation shortcuts: Escape to overview, 1-8 for planets, 0 for Sun
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Escape') {
        selectPlanet(null);
      } else if (e.key === '0') {
        selectPlanet('sun');
      } else if (e.key === '1') {
        selectPlanet('mercury');
      } else if (e.key === '2') {
        selectPlanet('venus');
      } else if (e.key === '3') {
        selectPlanet('earth');
      } else if (e.key === '4') {
        selectPlanet('mars');
      } else if (e.key === '5') {
        selectPlanet('jupiter');
      } else if (e.key === '6') {
        selectPlanet('saturn');
      } else if (e.key === '7') {
        selectPlanet('uranus');
      } else if (e.key === '8') {
        selectPlanet('neptune');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectPlanet]);

  return (
    <SolarSystemContext.Provider
      value={{
        selectedPlanetId,
        hoveredPlanetId,
        selectedMoonId,
        viewingMode,
        activeEnvironment,
        timeWarp,
        graphicsTier,
        dossierMode,
        showAsteroidBelt,
        showKuiperBelt,
        showSpacecraft,
        selectedDwarfPlanetId,
        selectedSpacecraftId,
        isTransitioning,
        selectPlanet,
        selectMoon,
        setHoveredPlanet,
        setViewingMode,
        setActiveEnvironment,
        setTimeWarp,
        setGraphicsTier,
        setDossierMode,
        setShowAsteroidBelt,
        setShowKuiperBelt,
        setShowSpacecraft,
        selectDwarfPlanet,
        selectSpacecraft,
      }}
    >
      {children}
    </SolarSystemContext.Provider>
  );
};

export function useSolarSystem(): SolarSystemInteractionState {
  const context = useContext(SolarSystemContext);
  if (!context) {
    throw new Error('useSolarSystem must be used within a SolarSystemProvider');
  }
  return context;
}

