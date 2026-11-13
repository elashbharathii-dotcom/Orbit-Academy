import React, { useState, Suspense } from 'react';
import { SolarSystemProvider } from './context/SolarSystemContext';
import { NavigationProvider, useNavigation } from './navigation/NavigationProvider';
import { ROUTES } from './navigation/routes';
import { MissionControlScreen } from './modules/mission-control/MissionControlScreen';
import { ModuleLoading } from './components/modules/ModuleLoading';
import { LauraCompanion } from './components/companion/LauraCompanion';
import { Loader2 } from 'lucide-react';

// Code-split modular learning applications
const EarthDrawingScreen = React.lazy(() =>
  import('./modules/earth-drawing/EarthDrawingScreen').then((m) => ({ default: m.EarthDrawingScreen }))
);
const MarsAdventureScreen = React.lazy(() =>
  import('./modules/mars-adventure/MarsAdventureScreen').then((m) => ({ default: m.MarsAdventureScreen }))
);
const SolarExplorerScreen = React.lazy(() =>
  import('./modules/solar-explorer/SolarExplorerScreen').then((m) => ({ default: m.SolarExplorerScreen }))
);
const VenusClimateScreen = React.lazy(() =>
  import('./modules/venus-climate/VenusClimateScreen').then((m) => ({ default: m.VenusClimateScreen }))
);
const JupiterLabScreen = React.lazy(() =>
  import('./modules/jupiter-lab/JupiterLabScreen').then((m) => ({ default: m.JupiterLabScreen }))
);
const SaturnArtScreen = React.lazy(() =>
  import('./modules/saturn-art/SaturnArtScreen').then((m) => ({ default: m.SaturnArtScreen }))
);
const UranusQuizScreen = React.lazy(() =>
  import('./modules/uranus-quiz/UranusQuizScreen').then((m) => ({ default: m.UranusQuizScreen }))
);
const NeptuneDiscoveryScreen = React.lazy(() =>
  import('./modules/neptune-discovery/NeptuneDiscoveryScreen').then((m) => ({ default: m.NeptuneDiscoveryScreen }))
);

/**
 * Module Suspense Fallback Loader
 */
const ScreenSuspenseFallback: React.FC = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#05070D] font-mono text-xs text-[#94A3B8]">
    <Loader2 className="h-8 w-8 animate-spin text-[#38BDF8] mb-3" />
    <span>INITIALIZING CELESTIAL ENVIRONMENT...</span>
  </div>
);

/**
 * Main Application Viewport Coordinator
 */
const AppViewport: React.FC = () => {
  const [speedScale, setSpeedScale] = useState<number>(0.45);
  const { currentRoute, isTransitioning, pendingPlanetId } = useNavigation();

  const isHome = currentRoute === ROUTES.HOME;

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-[#05070D] font-sans text-[#F8FAFC]">
      {/* 1. Persistent 3D Solar System Canvas (Always kept warm in DOM) */}
      <div
        style={{ display: isHome ? 'block' : 'none' }}
        className="fixed inset-0 z-0"
      >
        <MissionControlScreen
          speedScale={speedScale}
          onSpeedChange={setSpeedScale}
        />
      </div>

      {/* 2. Educational Learning Module Views */}
      {!isHome && (
        <div className="relative z-10 min-h-screen w-full">
          <Suspense fallback={<ScreenSuspenseFallback />}>
            {currentRoute === ROUTES.EARTH_DRAWING && <EarthDrawingScreen />}
            {currentRoute === ROUTES.MARS_ADVENTURE && <MarsAdventureScreen />}
            {currentRoute === ROUTES.EXPLORER && <SolarExplorerScreen />}
            {currentRoute === ROUTES.VENUS_CLIMATE && <VenusClimateScreen />}
            {currentRoute === ROUTES.JUPITER_LAB && <JupiterLabScreen />}
            {currentRoute === ROUTES.SATURN_ART && <SaturnArtScreen />}
            {currentRoute === ROUTES.URANUS_QUIZ && <UranusQuizScreen />}
            {currentRoute === ROUTES.NEPTUNE_DISCOVERY && <NeptuneDiscoveryScreen />}
          </Suspense>
        </div>
      )}

      {/* 3. Cinematic Celestial Approach Overlay */}
      {isTransitioning && <ModuleLoading planetId={pendingPlanetId} />}

      {/* 4. LAURA — Companion AI Guide across all screens */}
      <LauraCompanion />
    </div>
  );
};

/**
 * ORBIT ACADEMY Root Entry Point
 * Phase 7: Planet-to-Application Navigation & Educational Module Architecture
 */
export default function App(): React.JSX.Element {
  return (
    <SolarSystemProvider>
      <NavigationProvider>
        <AppViewport />
      </NavigationProvider>
    </SolarSystemProvider>
  );
}
