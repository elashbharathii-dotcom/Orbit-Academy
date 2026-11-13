import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../navigation/NavigationProvider';
import { ROUTES } from '../../navigation/routes';
import {
  Compass,
  BookOpen,
  Palette,
  FlaskConical,
  Award,
  Hammer,
  Clock,
  Sparkles,
  ListFilter,
} from 'lucide-react';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { AccessibleDirectory } from '../common/AccessibleDirectory';

export const MasterHeader: React.FC = () => {
  const { currentRoute, navigate } = useNavigation();
  const { selectedPlanetId, selectPlanet } = useSolarSystem();
  const [utcTime, setUtcTime] = useState<string>('');
  const [isDirectoryOpen, setIsDirectoryOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const NAV_ITEMS = [
    { label: 'Explore', route: ROUTES.HOME, icon: Compass },
    { label: 'Learn', route: ROUTES.LEARN, icon: BookOpen },
    { label: 'Draw', route: ROUTES.DRAW, icon: Palette },
    { label: 'Lab', route: ROUTES.LAB, icon: FlaskConical },
    { label: 'Quiz', route: ROUTES.QUIZ, icon: Award },
    { label: 'Build', route: ROUTES.BUILD, icon: Hammer },
  ];

  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-white/5 bg-[#030712]/85 px-4 py-2.5 backdrop-blur-2xl sm:px-6">
      {/* 1. Brand Logo & Celestial Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            selectPlanet(null);
            navigate(ROUTES.HOME);
          }}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 transition-all hover:border-[#38BDF8]/40 hover:bg-white/10"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38BDF8] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38BDF8]" />
          </span>
          <span className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-[#F8FAFC]">
            ORBIT ACADEMY
          </span>
        </button>

        {selectedPlanetId && currentRoute === ROUTES.HOME && (
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-3 py-0.5 font-mono text-[11px] text-[#F59E0B] animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
            <span className="font-semibold uppercase">{selectedPlanetId}</span>
            <button
              type="button"
              onClick={() => selectPlanet(null)}
              className="ml-1 text-[10px] text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              [ESC]
            </button>
          </div>
        )}
      </div>

      {/* 2. Six Primary Core Experiences Navigation Bar */}
      <nav
        aria-label="Orbit Academy Core Experiences"
        className="flex items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-[#080F1D]/80 p-1 shadow-lg backdrop-blur-xl scrollbar-none"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentRoute === item.route ||
            (item.route === ROUTES.HOME && currentRoute === '/') ||
            (item.route === ROUTES.DRAW && currentRoute === ROUTES.EARTH_DRAWING) ||
            (item.route === ROUTES.QUIZ && currentRoute === ROUTES.URANUS_QUIZ) ||
            (item.route === ROUTES.LAB && (currentRoute === ROUTES.VENUS_CLIMATE || currentRoute === ROUTES.JUPITER_LAB));

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                if (item.route === ROUTES.HOME && currentRoute === ROUTES.HOME && selectedPlanetId) {
                  selectPlanet(null);
                }
                navigate(item.route);
              }}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-xs transition-all duration-200 ${
                isActive
                  ? 'border border-[#38BDF8]/50 bg-[#38BDF8]/15 font-semibold text-[#F8FAFC] shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                  : 'border border-transparent text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. Right Status: Student XP Progress & UTC Time */}
      <div className="flex items-center gap-3">
        {/* Student Progression Badge */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-[#F59E0B]/20 bg-[#F59E0B]/5 px-3 py-1 font-mono text-[11px] text-[#F8FAFC]">
          <Sparkles className="h-3 w-3 text-[#F59E0B]" />
          <span className="font-bold text-[#F59E0B]">Level 3</span>
          <span className="text-[#94A3B8]">•</span>
          <span className="text-[#CBD5E1]">620 XP</span>
        </div>

        {/* Astronomical UTC Clock */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 py-1 font-mono text-[11px] text-[#94A3B8] tabular-nums">
          <Clock className="h-3 w-3 text-[#38BDF8]" />
          <span>{utcTime || '00:00:00 UTC'}</span>
        </div>

        {/* 2D Accessible Celestial Directory Button */}
        <button
          type="button"
          onClick={() => setIsDirectoryOpen(true)}
          aria-label="Open 2D accessible celestial directory"
          title="Open 2D Celestial Directory [Accessible]"
          className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-[#94A3B8] shadow-sm transition-all hover:border-[#38BDF8]/40 hover:text-[#F8FAFC]"
        >
          <ListFilter className="h-3.5 w-3.5 text-[#38BDF8]" />
          <span className="hidden xl:inline">2D Directory</span>
        </button>
      </div>

      {/* Accessible Directory Modal */}
      <AccessibleDirectory
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
      />
    </header>
  );
};
