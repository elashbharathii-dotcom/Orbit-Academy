import React, { useEffect } from 'react';
import { CelestialDestination } from '../../navigation/celestialDestinations';
import { ModuleHeader } from './ModuleHeader';
import { ModuleNavigation } from './ModuleNavigation';
import { useNavigation } from '../../navigation/NavigationProvider';

interface ModuleShellProps {
  destination: CelestialDestination;
  children: React.ReactNode;
  showBottomNav?: boolean;
}

export const ModuleShell: React.FC<ModuleShellProps> = ({
  destination,
  children,
  showBottomNav = true,
}) => {
  const { returnToSolarSystem } = useNavigation();

  // Escape key returns to Solar System
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        returnToSolarSystem();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [returnToSolarSystem]);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#05070D] font-sans text-[#F8FAFC] overflow-x-hidden animate-fade-in">
      {/* Dynamic Atmospheric Glow Backdrop */}
      <div
        className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full blur-[140px] opacity-15"
        style={{ backgroundColor: destination.themeAccent }}
        aria-hidden="true"
      />

      {/* Top Header */}
      <ModuleHeader destination={destination} />

      {/* Main Content Area */}
      <main className="relative flex-1 flex flex-col p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>

      {/* Optional Bottom Quick-Access Module Switcher */}
      {showBottomNav && (
        <footer className="sticky bottom-4 z-20 flex justify-center px-4 py-2 pointer-events-none">
          <ModuleNavigation currentDestination={destination} />
        </footer>
      )}
    </div>
  );
};
