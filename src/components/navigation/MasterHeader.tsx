import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../navigation/NavigationProvider';
import { ROUTES, AppRoute } from '../../navigation/routes';
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
  RotateCcw,
} from 'lucide-react';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { AccessibleDirectory } from '../common/AccessibleDirectory';

interface NavItem {
  id: string;
  label: string;
  route: AppRoute;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

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

  const NAV_ITEMS: NavItem[] = [
    { id: 'explore', label: 'Explore', route: ROUTES.HOME, icon: Compass, accentColor: '#38BDF8' },
    { id: 'learn', label: 'Learn', route: ROUTES.LEARN, icon: BookOpen, accentColor: '#818CF8' },
    { id: 'draw', label: 'Draw', route: ROUTES.DRAW, icon: Palette, accentColor: '#34D399' },
    { id: 'lab', label: 'Lab', route: ROUTES.LAB, icon: FlaskConical, accentColor: '#F472B6' },
    { id: 'quiz', label: 'Quiz', route: ROUTES.QUIZ, icon: Award, accentColor: '#FBBF24' },
    { id: 'build', label: 'Build', route: ROUTES.BUILD, icon: Hammer, accentColor: '#FB923C' },
  ];

  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-white/[0.08] bg-[#050816]/75 px-3 py-2.5 backdrop-blur-2xl sm:px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* 1. Left Cluster: Brand Logo & Celestial Breadcrumb */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={() => {
            selectPlanet(null);
            navigate(ROUTES.HOME);
          }}
          title="Return to System Overview"
          className="group flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-1.5 transition-all duration-300 hover:border-[#38DDF8]/50 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(56,221,248,0.25)] focus:outline-none"
        >
          {/* Pulsing Core Sensor Emblem */}
          <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38DDF8] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-tr from-[#0284C7] to-[#38DDF8] shadow-[0_0_10px_#38DDF8]" />
          </span>

          <div className="flex flex-col text-left">
            <span className="font-sans text-[11px] font-extrabold tracking-[0.22em] uppercase text-white transition-colors group-hover:text-[#38DDF8]">
              <span className="sm:hidden">ORBIT</span>
              <span className="hidden sm:inline">ORBIT ACADEMY</span>
            </span>
          </div>
        </button>

        {/* Selected Planet Active Context Breadcrumb */}
        {selectedPlanetId && currentRoute === ROUTES.HOME && (
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-[#F59E0B]/35 bg-[#F59E0B]/10 px-3 py-1 font-mono text-[11px] text-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.15)] animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]" />
            <span className="font-semibold uppercase tracking-wider">{selectedPlanetId}</span>
            <button
              type="button"
              onClick={() => selectPlanet(null)}
              title="Return to Solar Overview [Esc]"
              className="ml-1 flex items-center gap-0.5 rounded-full bg-white/10 px-1.5 py-0.5 text-[9.5px] text-[#94A3B8] transition-colors hover:bg-white/20 hover:text-[#F8FAFC]"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              <span>ESC</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Center: Six Core Modes Navigation Bar */}
      <nav
        aria-label="Orbit Academy Core Experiences"
        className="flex items-center gap-1 overflow-x-auto rounded-full border border-white/[0.1] bg-white/[0.04] p-1 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-2xl scrollbar-none mx-1 sm:mx-2"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentRoute === item.route ||
            (item.route === ROUTES.HOME && currentRoute === '/') ||
            (item.route === ROUTES.DRAW && currentRoute === ROUTES.EARTH_DRAWING) ||
            (item.route === ROUTES.QUIZ && currentRoute === ROUTES.URANUS_QUIZ) ||
            (item.route === ROUTES.LAB &&
              (currentRoute === ROUTES.VENUS_CLIMATE || currentRoute === ROUTES.JUPITER_LAB));

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                if (item.route === ROUTES.HOME && currentRoute === ROUTES.HOME && selectedPlanetId) {
                  selectPlanet(null);
                }
                navigate(item.route);
              }}
              className={`group relative flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-xs transition-all duration-300 focus:outline-none ${isActive
                  ? 'border border-[#38DDF8]/60 bg-gradient-to-r from-[#38DDF8]/20 via-[#A78BFA]/15 to-[#38DDF8]/20 font-bold text-white shadow-[0_0_20px_rgba(56,221,248,0.35)]'
                  : 'border border-transparent text-[#94A3B8] hover:bg-white/[0.07] hover:text-white'
                }`}
            >
              <Icon
                className={`h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-[#38DDF8]' : 'text-[#94A3B8]'
                  }`}
              />
              <span className="tracking-wide text-[11.5px]">{item.label}</span>

              {/* Active Indicator Pip */}
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#38DDF8] shadow-[0_0_8px_#38DDF8]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. Right Cluster: Cadet Status, UTC Clock, 2D Accessible Directory */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Student Level & XP Telemetry */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-[#F59E0B]/25 bg-[#F59E0B]/5 px-3 py-1 font-mono text-[11px] text-[#F8FAFC] shadow-sm">
          <Sparkles className="h-3 w-3 text-[#F59E0B]" />
          <span className="font-bold text-[#F59E0B]">Level 3</span>
          <span className="text-[#94A3B8]">•</span>
          <span className="text-[#CBD5E1]">620 XP</span>
        </div>

        {/* Astronomical UTC Clock */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-[#94A3B8] tabular-nums">
          <Clock className="h-3 w-3 text-[#38BDF8]" />
          <span>{utcTime || '00:00:00 UTC'}</span>
        </div>

        {/* Accessible 2D Celestial Directory Modal Trigger */}
        <button
          type="button"
          onClick={() => setIsDirectoryOpen(true)}
          aria-label="Open 2D accessible celestial directory"
          title="Open 2D Celestial Directory [Accessible]"
          className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 sm:px-3 py-1 font-mono text-xs text-[#94A3B8] shadow-sm transition-all duration-200 hover:border-[#38BDF8]/40 hover:bg-white/[0.06] hover:text-[#F8FAFC] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#38BDF8]"
        >
          <ListFilter className="h-3.5 w-3.5 text-[#38BDF8]" />
          <span className="hidden sm:inline text-[11px]">Directory</span>
        </button>
      </div>

      {/* Full-Screen Accessible 2D Solar System Directory Modal */}
      <AccessibleDirectory
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
      />
    </header>
  );
};
