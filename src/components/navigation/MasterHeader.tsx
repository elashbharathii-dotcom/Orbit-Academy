import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigation } from '../../navigation/NavigationProvider';
import { ROUTES, AppRoute } from '../../navigation/routes';
import {
  Compass,
  Telescope,
  BookOpen,
  Palette,
  FlaskConical,
  Award,
  Hammer,
  Rocket,
  Clock,
  Sparkles,
  ListFilter,
  RotateCcw,
  Menu,
  X,
  Volume2,
  VolumeX,
  Flame,
  ChevronDown,
  Globe2,
  Dna,
  Radio,
  Sun,
  User,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { useStudentProgress, ALL_ACHIEVEMENTS } from '../../services/studentProgressService';
import { AccessibleDirectory } from '../common/AccessibleDirectory';

interface NavItem {
  id: string;
  label: string;
  route: AppRoute;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  description: string;
}

interface NasaResourceItem {
  id: string;
  label: string;
  subtitle: string;
  route: AppRoute;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
  badge?: string;
}

export const MasterHeader: React.FC = () => {
  const { currentRoute, navigate } = useNavigation();
  const { selectedPlanetId, selectPlanet } = useSolarSystem();
  const { progress } = useStudentProgress();

  const [utcTime, setUtcTime] = useState<string>('');
  const [isDirectoryOpen, setIsDirectoryOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isNasaDropdownOpen, setIsNasaDropdownOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const [isMasterMuted, setIsMasterMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('orbit_audio_master_muted') === 'true';
    }
    return false;
  });

  const nasaDropdownRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Dynamic cadet level (1 level every 250 XP)
  const cadetLevel = Math.floor(progress.totalXp / 250) + 1;

  // Real-time Astronomical UTC Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Primary 8 Navigation Items (Always visible in horizontal row on desktop)
  const NAV_ITEMS: NavItem[] = [
    { id: 'explore', label: 'Explore', route: ROUTES.HOME, icon: Compass, accentColor: '#38BDF8', description: '3D Solar System & Deep Space Navigation' },
    { id: 'discovery', label: 'Discovery', route: ROUTES.DISCOVERY, icon: Telescope, accentColor: '#60A5FA', description: 'Planetary Exploration & Trek Elevation' },
    { id: 'learn', label: 'Learn', route: ROUTES.LEARN, icon: BookOpen, accentColor: '#818CF8', description: 'NASA-Powered 12-Discipline Curriculum' },
    { id: 'draw', label: 'Draw', route: ROUTES.DRAW, icon: Palette, accentColor: '#34D399', description: 'Creative Precision Drawing & Ring Particle Art' },
    { id: 'lab', label: 'Lab', route: ROUTES.LAB, icon: FlaskConical, accentColor: '#F472B6', description: 'Orbital Mechanics, Climate & Space Biology' },
    { id: 'quiz', label: 'Quiz', route: ROUTES.QUIZ, icon: Award, accentColor: '#FBBF24', description: 'NASA Science Quiz Arena & Gamified Challenges' },
    { id: 'build', label: 'Build', route: ROUTES.BUILD, icon: Hammer, accentColor: '#FB923C', description: 'Spacecraft Assembly & Test Flight Simulation' },
    { id: 'simulator', label: 'Simulate', route: ROUTES.SIMULATOR, icon: Rocket, accentColor: '#22D3EE', description: 'AAA 6-DOF Space Flight & Orbit Insertion' },
  ];

  // NASA Resources Dropdown Items
  const NASA_RESOURCES: NasaResourceItem[] = [
    {
      id: 'space-weather',
      label: 'Space Weather',
      subtitle: 'Real-time Solar Flares & Geomagnetic Storms',
      route: ROUTES.SPACE_WEATHER,
      icon: Sun,
      accentColor: '#F59E0B',
      badge: 'LIVE',
    },
    {
      id: 'nasa-trek',
      label: 'NASA Trek',
      subtitle: 'Planetary Cartography & Elevation GIS',
      route: ROUTES.TREK_PREVIEW,
      icon: Globe2,
      accentColor: '#38BDF8',
      badge: '3D GIS',
    },
    {
      id: 'nasa-osdr',
      label: 'NASA OSDR',
      subtitle: 'Open Science Data Repository & Omics',
      route: ROUTES.RESEARCH,
      icon: Dna,
      accentColor: '#C084FC',
      badge: '138K STUDIES',
    },
    {
      id: 'nasa-donki',
      label: 'NASA DONKI',
      subtitle: 'Database of Notifications & Enlil CMEs',
      route: ROUTES.SPACE_WEATHER,
      icon: Radio,
      accentColor: '#FB923C',
      badge: 'TELEMETRY',
    },
    {
      id: 'nasa-apod',
      label: 'NASA APOD',
      subtitle: 'Astronomy Picture of the Day Feed',
      route: ROUTES.LEARN,
      icon: Sparkles,
      accentColor: '#7FFFD4',
      badge: 'DAILY',
    },
  ];

  // Check if current route is within NASA resources
  const isNasaRouteActive =
    currentRoute === ROUTES.SPACE_WEATHER ||
    currentRoute === ROUTES.TREK_PREVIEW ||
    currentRoute === ROUTES.RESEARCH ||
    currentRoute === ROUTES.NASA_HUB;

  // Master Global Audio Mute Toggle
  const toggleMasterAudio = useCallback(() => {
    const next = !isMasterMuted;
    setIsMasterMuted(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('orbit_audio_master_muted', String(next));
      localStorage.setItem('orbit_flight_audio_muted', String(next));
      localStorage.setItem('orbit_quiz_audio_muted', String(next));
      localStorage.setItem('orbit_climate_audio_muted', String(next));
      window.dispatchEvent(new CustomEvent('orbit-master-audio-toggled', { detail: { muted: next } }));
    }
  }, [isMasterMuted]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (nasaDropdownRef.current && !nasaDropdownRef.current.contains(target)) {
        setIsNasaDropdownOpen(false);
      }
      if (achievementsRef.current && !achievementsRef.current.contains(target)) {
        setIsAchievementsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Keyboard Navigation (1-8 for modules, Esc for overview, M for mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'Escape') {
        setIsNasaDropdownOpen(false);
        setIsAchievementsOpen(false);
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
        if (selectedPlanetId) {
          selectPlanet(null);
        } else if (currentRoute !== ROUTES.HOME) {
          navigate(ROUTES.HOME);
        }
      } else if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        toggleMasterAudio();
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        const keyNum = parseInt(e.key, 10);
        if (keyNum >= 1 && keyNum <= NAV_ITEMS.length) {
          const item = NAV_ITEMS[keyNum - 1];
          if (item) {
            navigate(item.route);
            setIsMobileMenuOpen(false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlanetId, currentRoute, navigate, selectPlanet, toggleMasterAudio, NAV_ITEMS]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#070C1B]/90 backdrop-blur-2xl transition-all">
      <div className="w-full flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-5 lg:px-6 py-2 max-w-[1920px] mx-auto">
        {/* ══════════════════════════════════════════════════════════
            SECTION 1 (LEFT): Orbit Academy Logo & Context Breadcrumb
            ══════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              selectPlanet(null);
              navigate(ROUTES.HOME);
            }}
            title="Return to System Overview [Esc]"
            className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 transition-all duration-200 hover:border-[#38BDF8]/50 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#38BDF8]"
          >
            {/* Core Sensor Glowing Indicator */}
            <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38BDF8] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
            </span>

            <div className="flex flex-col text-left">
              <span className="font-sans text-[11.5px] font-bold tracking-[0.22em] uppercase text-[#F8FAFC] transition-colors group-hover:text-white">
                <span className="sm:hidden">ORBIT</span>
                <span className="hidden sm:inline">ORBIT ACADEMY</span>
              </span>
            </div>
          </button>

          {/* Active Celestial Context Breadcrumb */}
          {selectedPlanetId && currentRoute === ROUTES.HOME && (
            <div className="hidden xl:flex items-center gap-2 rounded-full border border-[#F59E0B]/35 bg-[#F59E0B]/10 px-3 py-1 font-mono text-[11px] text-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.15)] animate-fade-in">
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

        {/* ══════════════════════════════════════════════════════════
            SECTION 2 (CENTER): Main Horizontal Navigation Bar
            ══════════════════════════════════════════════════════════ */}
        <nav
          aria-label="Orbit Academy Core Experiences"
          className="hidden lg:flex items-center gap-0.5 xl:gap-1 rounded-full border border-white/[0.08] bg-[#0B1226]/85 p-1 shadow-2xl backdrop-blur-xl shrink-0"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentRoute === item.route ||
              (item.route === ROUTES.HOME && currentRoute === '/') ||
              (item.route === ROUTES.DISCOVERY &&
                (currentRoute === ROUTES.DISCOVERY || currentRoute === ROUTES.NEPTUNE_DISCOVERY)) ||
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
                className={`group relative flex items-center gap-1.5 rounded-full px-2.5 xl:px-3 py-1 font-sans text-xs transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#38BDF8] whitespace-nowrap ${
                  isActive
                    ? 'border border-[#38BDF8]/40 bg-gradient-to-r from-[#38BDF8]/15 via-[#818CF8]/12 to-[#38BDF8]/15 font-semibold text-[#F8FAFC] shadow-[0_0_16px_rgba(56,189,248,0.22)]'
                    : 'border border-transparent text-[#94A3B8] hover:bg-white/[0.05] hover:text-[#F8FAFC]'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-[#38BDF8]' : 'text-[#94A3B8]'
                  }`}
                />
                <span className="tracking-wide text-[11.5px]">{item.label}</span>

                {isActive && (
                  <span className="h-1 w-1 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]" />
                )}
              </button>
            );
          })}

          {/* NASA Resources Dropdown Button */}
          <div className="relative" ref={nasaDropdownRef}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={isNasaDropdownOpen}
              onClick={() => setIsNasaDropdownOpen(!isNasaDropdownOpen)}
              className={`group relative flex items-center gap-1.5 rounded-full px-2.5 xl:px-3 py-1 font-sans text-xs transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#38BDF8] whitespace-nowrap ${
                isNasaRouteActive || isNasaDropdownOpen
                  ? 'border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 font-semibold text-[#F8FAFC] shadow-[0_0_14px_rgba(56,189,248,0.2)]'
                  : 'border border-transparent text-[#94A3B8] hover:bg-white/[0.05] hover:text-[#F8FAFC]'
              }`}
            >
              <Globe2
                className={`h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110 ${
                  isNasaRouteActive ? 'text-cyan-400' : 'text-[#94A3B8]'
                }`}
              />
              <span className="tracking-wide text-[11.5px]">NASA Resources</span>
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-200 text-[#94A3B8] ${
                  isNasaDropdownOpen ? 'rotate-180 text-cyan-400' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Popover */}
            {isNasaDropdownOpen && (
              <div
                role="menu"
                aria-label="NASA Resources Menu"
                className="absolute left-0 mt-2 w-72 rounded-2xl border border-white/15 bg-[#080B14]/95 p-2 shadow-2xl backdrop-blur-2xl animate-fade-in z-50"
              >
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#7FFFD4] font-bold block">
                    OFFICIAL NASA SCIENTIFIC DATASETS
                  </span>
                  <span className="font-sans text-[11px] text-[#94A3B8] block">
                    Verified open astronomy and planetary telemetry
                  </span>
                </div>

                <div className="space-y-1">
                  {NASA_RESOURCES.map((item) => {
                    const ItemIcon = item.icon;
                    const isItemActive = currentRoute === item.route;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          navigate(item.route);
                          setIsNasaDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all ${
                          isItemActive
                            ? 'bg-white/10 text-white font-semibold'
                            : 'hover:bg-white/[0.05] text-[#CBD5E1] hover:text-white'
                        }`}
                      >
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10"
                          style={{ backgroundColor: `${item.accentColor}15`, color: item.accentColor }}
                        >
                          <ItemIcon className="h-4 w-4" />
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-xs font-semibold">{item.label}</span>
                            {item.badge && (
                              <span
                                className="font-mono text-[8.5px] uppercase font-bold px-1.5 py-0.2 rounded border border-white/10"
                                style={{ color: item.accentColor }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <span className="font-sans text-[10.5px] text-[#94A3B8] truncate">
                            {item.subtitle}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* ══════════════════════════════════════════════════════════
            SECTION 3 (RIGHT): XP, Level, Achievements, Sound, Profile
            ══════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 justify-end">
          {/* Dynamic Cadet Level & XP Telemetry Badge */}
          <div
            title={`Cadet Rank: Level ${cadetLevel} (${progress.totalXp} Total XP)`}
            className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-2.5 sm:px-3 py-1 font-mono text-[10.5px] sm:text-[11px] text-[#F8FAFC] shadow-[0_0_12px_rgba(245,158,11,0.18)]"
          >
            <Sparkles className="h-3 w-3 text-[#F59E0B] animate-pulse shrink-0" />
            <span className="font-bold text-[#F59E0B] whitespace-nowrap">Lvl {cadetLevel}</span>
            <span className="text-[#94A3B8] hidden sm:inline">•</span>
            <span className="text-[#CBD5E1] font-semibold whitespace-nowrap hidden sm:inline">
              {progress.totalXp.toLocaleString()} XP
            </span>
            {progress.dailyStreakDays > 0 && (
              <>
                <span className="text-[#94A3B8] hidden md:inline">•</span>
                <span className="text-amber-400 hidden md:flex items-center gap-0.5 font-bold">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>{progress.dailyStreakDays}d</span>
                </span>
              </>
            )}
          </div>

          {/* Achievements Trigger & Popover */}
          <div className="relative" ref={achievementsRef}>
            <button
              type="button"
              aria-label="View Achievements"
              title="Cadet Achievements & Medals"
              onClick={() => setIsAchievementsOpen(!isAchievementsOpen)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] transition-all ${
                isAchievementsOpen
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'border-white/10 bg-white/[0.03] text-[#94A3B8] hover:border-amber-400/40 hover:text-white'
              }`}
            >
              <Award className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline font-semibold">
                {progress.unlockedAchievementIds?.length || 0}
              </span>
            </button>

            {isAchievementsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/15 bg-[#080B14]/95 p-3.5 shadow-2xl backdrop-blur-2xl animate-fade-in z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400" />
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      CADET ACHIEVEMENTS
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-amber-400 font-bold">
                    {progress.unlockedAchievementIds?.length || 0} / {ALL_ACHIEVEMENTS.length}
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {ALL_ACHIEVEMENTS.slice(0, 6).map((ach) => {
                    const isUnlocked = progress.unlockedAchievementIds?.includes(ach.id);
                    return (
                      <div
                        key={ach.id}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                          isUnlocked
                            ? 'border-amber-400/30 bg-amber-500/10 text-white'
                            : 'border-white/5 bg-white/[0.02] text-[#64748B]'
                        }`}
                      >
                        <span className="text-xl shrink-0">{ach.icon}</span>
                        <div className="flex flex-col min-w-0">
                          <span className={`text-xs font-semibold truncate ${isUnlocked ? 'text-white' : 'text-[#94A3B8]'}`}>
                            {ach.title}
                          </span>
                          <span className="text-[10px] text-[#94A3B8] line-clamp-1">
                            {ach.description}
                          </span>
                        </div>
                        {isUnlocked && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 ml-auto shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Master Global Audio Mute Toggle */}
          <button
            type="button"
            onClick={toggleMasterAudio}
            aria-label={isMasterMuted ? 'Unmute master spaceflight audio' : 'Mute master spaceflight audio'}
            title={isMasterMuted ? 'Unmute All Audio Synthesizers [M]' : 'Mute All Audio Synthesizers [M]'}
            className={`flex items-center justify-center h-8 w-8 rounded-full border transition-all ${
              isMasterMuted
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.2)]'
                : 'border-white/10 bg-white/[0.03] text-cyan-400 hover:border-cyan-400/40 hover:bg-white/[0.06]'
            }`}
          >
            {isMasterMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>

          {/* Cadet Profile Controls & Dossier Popover */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              aria-label="Cadet Profile & Telemetry"
              title="Cadet Profile & Rank"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center justify-center h-8 w-8 rounded-full border transition-all ${
                isProfileOpen
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                  : 'border-white/10 bg-white/[0.03] text-[#94A3B8] hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/15 bg-[#080B14]/95 p-4 shadow-2xl backdrop-blur-2xl animate-fade-in z-50 space-y-3">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 text-white font-bold text-sm shadow-md">
                    C{cadetLevel}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-xs font-bold text-white">Cadet Explorer</span>
                    <span className="font-mono text-[10px] text-cyan-400">Level {cadetLevel} • NASA Flight Cadet</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[9.5px] text-[#64748B] block">TOTAL XP</span>
                    <span className="font-bold text-amber-400">{progress.totalXp.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[9.5px] text-[#64748B] block">STREAK</span>
                    <span className="font-bold text-orange-400">{progress.dailyStreakDays} Days</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[9.5px] text-[#64748B] block">SOLVED UNITS</span>
                    <span className="font-bold text-cyan-400">{progress.completedLessonIds?.length || 0}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[9.5px] text-[#64748B] block">STUDY TIME</span>
                    <span className="font-bold text-emerald-400">{progress.learningTimeMinutes || 0}m</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#94A3B8]">Status: Operational</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Synchronized</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Astronomical UTC Clock (Large screens) */}
          <div className="hidden 2xl:flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-[#94A3B8] tabular-nums">
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

          {/* Mobile Navigation Drawer Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open mobile navigation menu"
            className="flex lg:hidden items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-400/40 hover:text-white"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ACCESSIBLE MODAL & RESPONSIVE MOBILE DRAWER
          ══════════════════════════════════════════════════════════ */}
      <AccessibleDirectory
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
      />

      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
          className="fixed inset-0 z-50 flex lg:hidden bg-black/85 backdrop-blur-2xl animate-fade-in"
        >
          <div className="relative w-full max-w-xs h-full bg-[#070C1B] border-r border-white/15 p-5 flex flex-col shadow-2xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38BDF8]" />
                <span className="font-sans font-bold text-sm tracking-wider uppercase text-white">ORBIT ACADEMY</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Dynamic Cadet Progress Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-cyan-300 font-bold">CADET RANK</span>
                <span className="font-mono text-amber-300 font-bold">LEVEL {cadetLevel}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{progress.totalXp.toLocaleString()} Total XP</span>
                {progress.dailyStreakDays > 0 && <span>🔥 {progress.dailyStreakDays}d Streak</span>}
              </div>
            </div>

            {/* Primary Core Destinations List */}
            <nav className="mt-5 space-y-1.5 flex-1" aria-label="Mobile Core Navigation">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block px-2 pb-1">
                PRIMARY EXPERIENCES
              </span>
              {NAV_ITEMS.map((item, idx) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.route === ROUTES.HOME && currentRoute === ROUTES.HOME && selectedPlanetId) {
                        selectPlanet(null);
                      }
                      navigate(item.route);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold">{item.label}</span>
                      <span className="text-[10px] text-slate-400 truncate">{item.description}</span>
                    </div>
                    <span className="ml-auto font-mono text-[10px] text-slate-400 border border-white/10 px-1.5 py-0.5 rounded shrink-0">
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* NASA Scientific Resources Section */}
            <div className="pt-4 border-t border-white/10 space-y-2 mt-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7FFFD4] block px-2">
                NASA SCIENTIFIC RESOURCES
              </span>
              {NASA_RESOURCES.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      navigate(item.route);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-slate-200 text-xs font-mono hover:bg-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <ItemIcon className="w-3.5 h-3.5" style={{ color: item.accentColor }} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-bold" style={{ color: item.accentColor }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Controls & Mute Footer */}
            <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={toggleMasterAudio}
                className="flex items-center gap-2 text-xs font-mono text-slate-300"
              >
                {isMasterMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                <span>{isMasterMuted ? 'Audio Muted' : 'Audio Active'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsDirectoryOpen(true);
                }}
                className="text-xs font-mono text-cyan-300 underline"
              >
                2D Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default MasterHeader;
