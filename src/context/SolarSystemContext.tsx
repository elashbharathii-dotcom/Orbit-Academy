import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CelestialId, SolarSystemInteractionState } from '../types';

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
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const selectPlanet = useCallback((id: CelestialId | null) => {
    setSelectedPlanetId((prev) => {
      if (prev === id) return prev;
      setIsTransitioning(true);

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

  const setHoveredPlanet = useCallback((id: CelestialId | null) => {
    setHoveredPlanetId(id);
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
        isTransitioning,
        selectPlanet,
        setHoveredPlanet,
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

