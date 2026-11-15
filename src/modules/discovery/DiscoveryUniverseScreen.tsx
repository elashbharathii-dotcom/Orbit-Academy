import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CelestialId } from '../../types';
import { PlanetDiscoveryProfile, PlanetaryHotspot } from './types';
import { PLANET_DISCOVERY_PROFILES } from './data/discoveryData';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { PlanetExplorer3D } from './components/PlanetExplorer3D';
import { PlanetTelemetryDossier } from './components/PlanetTelemetryDossier';
import { LauraSpaceGuide } from './components/LauraSpaceGuide';
import { PlanetComparisonModal } from './components/PlanetComparisonModal';
import { DiscoveryAchievements } from './components/DiscoveryAchievements';
import { NasaDiscoveryHub } from './components/NasaDiscoveryHub';
import { PlanetaryDestinationDeck } from './components/PlanetaryDestinationDeck';
import { SpacecraftJourney3D } from './components/SpacecraftJourney3D';
import { discoveryAudio } from './audio/discoveryAudio';
import {
  ChevronLeft,
  Trophy,
  Rocket,
  Scale,
  PanelRightClose,
  PanelRightOpen,
  Telescope,
  Globe2,
  X,
} from 'lucide-react';
import './discovery-space.css';

interface DiscoveryUniverseScreenProps {
  initialPlanetId?: CelestialId;
}

const STORAGE_KEY_DISCOVERY = 'orbit_discovery_cadet_progress';

type SpaceEduPlanetKey = 'earth' | 'venus' | 'mars';

interface SpaceEduPlanetSpec {
  id: SpaceEduPlanetKey;
  name: string;
  videoClip: string;
  stillPoster: string;
  cutoutUrl: string;
  ledeHtml: string;
  buttonLabel: string;
}

const ORDER: SpaceEduPlanetKey[] = ['earth', 'venus', 'mars'];

const PLANETS_SPEC: Record<SpaceEduPlanetKey, SpaceEduPlanetSpec> = {
  earth: {
    id: 'earth',
    name: 'EARTH',
    videoClip:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202422_3ffb4889-c520-432d-8458-038009eb40df.mp4',
    stillPoster:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202133_508c64b8-a31e-4290-bdfc-1187df70e0a6.png',
    cutoutUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202005_3346cc4d-ec3b-44ab-825c-b18e49f5021a.png',
    ledeHtml:
      'Learn more about the fascinating details that we call our home, Planet Earth. Course enrollment <br>starts today. Early Bird tickets typically last a week, don&rsquo;t miss out!',
    buttonLabel: 'EXPLORE EARTH',
  },
  venus: {
    id: 'venus',
    name: 'VENUS',
    videoClip:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202422_b211cd74-013b-4dd3-bfd0-64491d8696fa.mp4',
    stillPoster:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202133_cf55d1d8-7b59-4a64-80da-d72052ae974e.png',
    cutoutUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202012_640b239a-d08a-4200-adb2-741bbe129ac8.png',
    ledeHtml:
      'The hottest world in our solar system, wrapped in clouds of sulfuric acid. Course enrollment <br>starts today. Early Bird tickets typically last a week, don&rsquo;t miss out!',
    buttonLabel: 'EXPLORE VENUS',
  },
  mars: {
    id: 'mars',
    name: 'MARS',
    videoClip:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202422_51eae59a-2459-4c84-907c-cc5edfe5fea7.mp4',
    stillPoster:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202133_0ba6de7c-285d-43dc-b7ab-8c54c73707cb.png',
    cutoutUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202018_3d559490-f613-4ed7-a3bb-3b7e9fc90fb8.png',
    ledeHtml:
      'The rust-red desert world, home to the tallest volcano we know of. Course enrollment <br>starts today. Early Bird tickets typically last a week, don&rsquo;t miss out!',
    buttonLabel: 'EXPLORE MARS',
  },
};

export const DiscoveryUniverseScreen: React.FC<DiscoveryUniverseScreenProps> = ({
  initialPlanetId,
}) => {
  // 1. Featured SpaceEdu Planet State (Earth, Venus, Mars)
  const [featuredPlanet, setFeaturedPlanet] = useState<SpaceEduPlanetKey>(() => {
    if (initialPlanetId === 'venus') return 'venus';
    if (initialPlanetId === 'mars') return 'mars';
    return 'earth';
  });

  // 2. View Mode: 'hero' (SpaceEdu design) vs '3d-explorer' (Full 3D WebGL scientific environment) vs 'journey'
  const [viewMode, setViewMode] = useState<'hero' | '3d-explorer' | 'journey'>('hero');
  const [activePlanetId, setActivePlanetId] = useState<CelestialId>(() => {
    return (initialPlanetId as CelestialId) || 'earth';
  });

  // 3. Navigation Drawer & Interactive Modals State
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isNasaHubOpen, setIsNasaHubOpen] = useState<boolean>(false);
  const [isDestinationDeckOpen, setIsDestinationDeckOpen] = useState<boolean>(false);
  const [isTelemetryVisible, setIsTelemetryVisible] = useState<boolean>(true);

  // 4. Explorer Sub-state
  const [selectedMoonId, setSelectedMoonId] = useState<string | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<PlanetaryHotspot | null>(null);

  // 5. Video Element References
  const videoRefs = useRef<Record<SpaceEduPlanetKey, HTMLVideoElement | null>>({
    earth: null,
    venus: null,
    mars: null,
  });

  // 6. Cadet Progress Persistence
  const [exploredPlanets, setExploredPlanets] = useState<CelestialId[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DISCOVERY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.exploredPlanets || [];
      }
    } catch {}
    return ['earth'];
  });

  const [journeysCount, setJourneysCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DISCOVERY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.journeysCount || 0;
      }
    } catch {}
    return 1;
  });

  // Calculate flanking slot planets (re-fills with the remaining two in ORDER)
  const remaining = ORDER.filter((p) => p !== featuredPlanet);
  const slotLeft = remaining[0];
  const slotRight = remaining[1];

  // --------------------------------------------------------------------------
  // ENTRANCE ANIMATION: .anim -> .play -> clean static state after 2150ms
  // --------------------------------------------------------------------------
  const [animClass, setAnimClass] = useState<string>('anim');

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setAnimClass('');
      return;
    }

    let timeoutPlay: number;
    let timeoutCleanup: number;

    const startAnimation = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimClass('anim play');
          timeoutCleanup = window.setTimeout(() => {
            setAnimClass('');
          }, 2150);
        });
      });
    };

    if (typeof document !== 'undefined' && 'fonts' in document) {
      Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]).then(startAnimation);
    } else {
      timeoutPlay = window.setTimeout(startAnimation, 100);
    }

    return () => {
      clearTimeout(timeoutPlay);
      clearTimeout(timeoutCleanup);
    };
  }, []);

  // --------------------------------------------------------------------------
  // WARMING & PRELOADING CLIPS
  // --------------------------------------------------------------------------
  const warmPlanet = useCallback((pKey: SpaceEduPlanetKey) => {
    const vid = videoRefs.current[pKey];
    if (vid) {
      if (!vid.src && vid.dataset.src) {
        vid.preload = 'auto';
        vid.src = vid.dataset.src;
        vid.load();
      }
    }
  }, []);

  useEffect(() => {
    // Idle preloading of remaining planetary videos after first paint
    const handleIdleWarm = () => {
      ORDER.forEach((p) => warmPlanet(p));
    };

    const win = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
    };
    if (typeof window !== 'undefined' && win.requestIdleCallback) {
      win.requestIdleCallback(handleIdleWarm, { timeout: 4000 });
    } else {
      setTimeout(handleIdleWarm, 2500);
    }
  }, [warmPlanet]);

  // --------------------------------------------------------------------------
  // PLANET SWITCHER FUNCTION (<2ms Artwork Swap + .22s Video Crossfade)
  // --------------------------------------------------------------------------
  const showPlanet = useCallback(
    (next: SpaceEduPlanetKey) => {
      if (next === featuredPlanet) return;

      // 1. Warm and activate matching video
      ORDER.forEach((p) => {
        const vid = videoRefs.current[p];
        if (vid) {
          if (p === next) {
            if (!vid.src && vid.dataset.src) {
              vid.src = vid.dataset.src;
              vid.load();
            }
            vid.classList.add('is-active');
            vid.play().catch(() => {});
          } else {
            vid.classList.remove('is-active');
            vid.pause();
          }
        }
      });

      // 2. Set featured planet state
      setFeaturedPlanet(next);
      setActivePlanetId(next as CelestialId);
      discoveryAudio.playTelemetryChime(next === 'mars' ? 440 : next === 'venus' ? 587 : 659);
    },
    [featuredPlanet]
  );

  // Mark explored planet in cadet persistence
  const markPlanetExplored = useCallback(
    (planetId: CelestialId) => {
      setExploredPlanets((prev) => {
        if (!prev.includes(planetId)) {
          const next = [...prev, planetId];
          try {
            localStorage.setItem(
              STORAGE_KEY_DISCOVERY,
              JSON.stringify({ exploredPlanets: next, journeysCount })
            );
          } catch {}
          return next;
        }
        return prev;
      });
    },
    [journeysCount]
  );

  const handleLaunch3DExplorer = (planetId?: CelestialId) => {
    const target = planetId || (featuredPlanet as CelestialId);
    setActivePlanetId(target);
    markPlanetExplored(target);
    setViewMode('3d-explorer');
    discoveryAudio.stopSpeech();
  };

  const handleReplayJourney = () => {
    discoveryAudio.stopSpeech();
    setViewMode('journey');
  };

  const handleJourneyComplete = () => {
    setJourneysCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(
          STORAGE_KEY_DISCOVERY,
          JSON.stringify({ exploredPlanets, journeysCount: next })
        );
      } catch {}
      return next;
    });
    markPlanetExplored(activePlanetId);
    setViewMode('3d-explorer');
  };

  const activeProfile: PlanetDiscoveryProfile =
    PLANET_DISCOVERY_PROFILES[activePlanetId] || PLANET_DISCOVERY_PROFILES.earth;

  return (
    <div className="relative h-screen w-full flex flex-col bg-[#04101f] font-sans text-white overflow-hidden select-none">
      {/* 1. Universal Master Header (Preserves Exploration, Learning, Lab, Quiz, Build) */}
      <div className="flex-none z-50">
        <MasterHeader />
      </div>

      {/* 2. Main Discovery Experience Viewport */}
      <main className="relative flex-1 w-full min-h-0 overflow-hidden">
        {/* ================================================================= */}
        {/* VIEW A: SPACEEDU REPLICATED HERO VIEW (The Required Attached UI)  */}
        {/* ================================================================= */}
        {viewMode === 'hero' && (
          <div className={`discovery-space-root ${animClass} relative w-full h-full`}>
            <div className="stage">
              {/* Sky Background: Looping Videos + Fallback Still Poster */}
              <div
                className="sky"
                style={{
                  backgroundImage: `url(${PLANETS_SPEC[featuredPlanet].stillPoster})`,
                }}
              >
                {/* Earth Background Video */}
                <video
                  ref={(el) => (videoRefs.current.earth = el)}
                  data-planet="earth"
                  className={featuredPlanet === 'earth' ? 'is-active' : ''}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  src={PLANETS_SPEC.earth.videoClip}
                  poster={PLANETS_SPEC.earth.stillPoster}
                  aria-hidden="true"
                />

                {/* Venus Background Video */}
                <video
                  ref={(el) => (videoRefs.current.venus = el)}
                  data-planet="venus"
                  className={featuredPlanet === 'venus' ? 'is-active' : ''}
                  muted
                  loop
                  playsInline
                  preload="none"
                  data-src={PLANETS_SPEC.venus.videoClip}
                  poster={PLANETS_SPEC.venus.stillPoster}
                  aria-hidden="true"
                />

                {/* Mars Background Video */}
                <video
                  ref={(el) => (videoRefs.current.mars = el)}
                  data-planet="mars"
                  className={featuredPlanet === 'mars' ? 'is-active' : ''}
                  muted
                  loop
                  playsInline
                  preload="none"
                  data-src={PLANETS_SPEC.mars.videoClip}
                  poster={PLANETS_SPEC.mars.stillPoster}
                  aria-hidden="true"
                />
              </div>

              {/* UI Overlay: Navbar, Hero Typography, Flanking Cutouts, Call to Action */}
              <div className="ui">
                {/* Header Navbar */}
                <header className="navbar">
                  <div className="navrow" data-open={isNavOpen ? 'true' : 'false'}>
                    <a
                      className="logo"
                      href="#/discovery"
                      onClick={(e) => {
                        e.preventDefault();
                        showPlanet('earth');
                      }}
                    >
                      orbit<i>academy</i>
                    </a>

                    {/* Navigation Links */}
                    <nav className="links" id="site-nav">
                      <button
                        type="button"
                        className="nav-link"
                        aria-current="page"
                        onClick={() => setIsNavOpen(false)}
                      >
                        Planets
                      </button>
                      <button
                        type="button"
                        className="nav-link"
                        onClick={() => {
                          setIsNavOpen(false);
                          handleLaunch3DExplorer();
                        }}
                      >
                        3D Explorer
                      </button>
                      <button
                        type="button"
                        className="nav-link"
                        onClick={() => {
                          setIsNavOpen(false);
                          setIsDestinationDeckOpen(true);
                        }}
                      >
                        All Worlds
                      </button>
                      <button
                        type="button"
                        className="nav-link"
                        onClick={() => {
                          setIsNavOpen(false);
                          setIsComparisonOpen(true);
                        }}
                      >
                        Compare
                      </button>
                      <button
                        type="button"
                        className="enroll"
                        onClick={() => {
                          setIsNavOpen(false);
                          setIsNasaHubOpen(true);
                        }}
                      >
                        NASA Hub
                      </button>
                    </nav>

                    {/* Mobile Hamburger Burger Button */}
                    <button
                      className="burger"
                      type="button"
                      aria-label={isNavOpen ? 'Close navigation' : 'Open navigation'}
                      aria-expanded={isNavOpen ? 'true' : 'false'}
                      aria-controls="site-nav"
                      onClick={() => setIsNavOpen(!isNavOpen)}
                    >
                      <span />
                      <span />
                      <span />
                    </button>
                  </div>
                </header>

                {/* Hero Centered Copy */}
                <div className="copy">
                  {/* Eyebrow */}
                  <div className="col eyebrow">
                    <span className="ent-mask">
                      <span className="ent-line">PLANET</span>
                    </span>
                  </div>

                  {/* Huge Serif Headline Title */}
                  <h1 className="col title">
                    <span className="ent-mask">
                      <span className="ent-line">{PLANETS_SPEC[featuredPlanet].name}</span>
                    </span>
                  </h1>

                  {/* Cyan Divider Rule */}
                  <div className="col rule">
                    <span />
                  </div>

                  {/* Paragraph Lede Description */}
                  <p
                    className="col lede"
                    dangerouslySetInnerHTML={{
                      __html: PLANETS_SPEC[featuredPlanet].ledeHtml,
                    }}
                  />

                  {/* Call-to-Action Row & Flanking Cutout Slots */}
                  <div className="col cta">
                    {/* Left Planet Slot */}
                    <button
                      className="planet planet-l"
                      type="button"
                      data-slot="l"
                      data-planet={slotLeft}
                      aria-label={`Show ${PLANETS_SPEC[slotLeft].name}`}
                      onPointerEnter={() => warmPlanet(slotLeft)}
                      onFocus={() => warmPlanet(slotLeft)}
                      onClick={() => showPlanet(slotLeft)}
                    >
                      {ORDER.map((p) => (
                        <img
                          key={p}
                          data-planet={p}
                          alt=""
                          src={PLANETS_SPEC[p].cutoutUrl}
                          className={slotLeft === p ? 'is-shown' : ''}
                        />
                      ))}
                    </button>

                    {/* Right Planet Slot */}
                    <button
                      className="planet planet-r"
                      type="button"
                      data-slot="r"
                      data-planet={slotRight}
                      aria-label={`Show ${PLANETS_SPEC[slotRight].name}`}
                      onPointerEnter={() => warmPlanet(slotRight)}
                      onFocus={() => warmPlanet(slotRight)}
                      onClick={() => showPlanet(slotRight)}
                    >
                      {ORDER.map((p) => (
                        <img
                          key={p}
                          data-planet={p}
                          alt=""
                          src={PLANETS_SPEC[p].cutoutUrl}
                          className={slotRight === p ? 'is-shown' : ''}
                        />
                      ))}
                    </button>

                    {/* Glossy White Pill CTA Button */}
                    <button
                      type="button"
                      className="cta-pill"
                      onClick={() => handleLaunch3DExplorer()}
                    >
                      {PLANETS_SPEC[featuredPlanet].buttonLabel}
                    </button>

                    {/* Serif Dynamic Planet Labels */}
                    <span className="label label-l">{PLANETS_SPEC[slotLeft].name}</span>
                    <span className="label label-r">{PLANETS_SPEC[slotRight].name}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Circular Scroll Action Control */}
              <button
                className="scroll"
                type="button"
                aria-label="Explore 3D Planetary Environment"
                onClick={() => handleLaunch3DExplorer()}
              >
                <svg viewBox="0 0 26 33" fill="none" aria-hidden="true">
                  <path
                    d="M13 1.5 V31.5 M1.9 20.4 L13 31.5 L24.1 20.4"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW B: FULL 3D PLANET EXPLORER & SCIENTIFIC TELEMETRY SUITE      */}
        {/* ================================================================= */}
        {viewMode === '3d-explorer' && (
          <div className="relative w-full h-full overflow-hidden bg-[#02050D]">
            {/* Realtime 3D Three.js Planetary Viewport */}
            <div className="absolute inset-0 z-0">
              <PlanetExplorer3D
                profile={activeProfile}
                selectedMoonId={selectedMoonId}
                onSelectMoon={setSelectedMoonId}
                selectedHotspotId={selectedHotspot?.id || null}
                onSelectHotspot={(h) => setSelectedHotspot(h)}
              />
            </div>

            {/* Top Command Toolbar */}
            <div className="absolute top-4 left-4 z-30 flex flex-wrap items-center gap-2 pointer-events-auto">
              {/* Return to Cinematic Planet Hero */}
              <button
                type="button"
                onClick={() => {
                  discoveryAudio.stopSpeech();
                  setViewMode('hero');
                }}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#070C1B]/90 px-3 py-1.5 font-mono text-xs text-[#94A3B8] hover:border-[#79dce8] hover:text-white transition-all backdrop-blur-xl shadow-lg"
              >
                <ChevronLeft className="h-4 w-4 text-[#79dce8]" />
                <span>Planet Hero</span>
              </button>

              {/* Replay Spacecraft Transit Journey */}
              <button
                type="button"
                onClick={handleReplayJourney}
                className="flex items-center gap-1.5 rounded-xl border border-[#79dce8]/40 bg-[#79dce8]/15 px-3 py-1.5 font-mono text-xs font-bold text-[#79dce8] hover:bg-[#79dce8]/25 hover:text-white transition-all backdrop-blur-xl shadow-lg"
              >
                <Rocket className="h-3.5 w-3.5" />
                <span>Replay Journey</span>
              </button>

              {/* Multi-World Selector Deck */}
              <button
                type="button"
                onClick={() => setIsDestinationDeckOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/70 px-3 py-1.5 font-mono text-xs font-bold text-cyan-300 hover:bg-cyan-900/60 hover:text-white transition-all backdrop-blur-xl shadow-lg"
              >
                <Globe2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>Switch Planet (11)</span>
              </button>

              {/* Compare Scale Modal */}
              <button
                type="button"
                onClick={() => setIsComparisonOpen(true)}
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#070C1B]/90 px-3 py-1.5 font-mono text-xs text-[#94A3B8] hover:border-[#79dce8] hover:text-white transition-all backdrop-blur-xl shadow-lg"
              >
                <Scale className="h-3.5 w-3.5 text-[#79dce8]" />
                <span>Compare Scale</span>
              </button>

              {/* Achievements & Cadet Badges */}
              <button
                type="button"
                onClick={() => setIsAchievementsOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#070C1B]/90 px-3 py-1.5 font-mono text-xs text-[#F59E0B] hover:border-[#F59E0B]/40 hover:text-white transition-all backdrop-blur-xl shadow-lg"
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>Badges ({exploredPlanets.length}/11)</span>
              </button>

              {/* NASA Media Hub */}
              <button
                type="button"
                onClick={() => setIsNasaHubOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/70 px-3 py-1.5 font-mono text-xs font-bold text-cyan-300 hover:bg-cyan-900/60 hover:text-white transition-all backdrop-blur-xl shadow-lg"
              >
                <Telescope className="h-3.5 w-3.5 text-cyan-400" />
                <span>NASA Media Archive</span>
              </button>

              {/* Toggle Telemetry Dossier Panel */}
              <button
                type="button"
                onClick={() => setIsTelemetryVisible(!isTelemetryVisible)}
                title={isTelemetryVisible ? 'Hide Dossier Panel' : 'Show Dossier Panel'}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#070C1B]/90 px-3 py-1.5 font-mono text-xs text-[#94A3B8] hover:border-[#79dce8] hover:text-white transition-all backdrop-blur-xl shadow-lg"
              >
                {isTelemetryVisible ? (
                  <>
                    <PanelRightClose className="h-3.5 w-3.5 text-[#79dce8]" />
                    <span className="hidden xl:inline">Hide Dossier</span>
                  </>
                ) : (
                  <>
                    <PanelRightOpen className="h-3.5 w-3.5 text-[#79dce8]" />
                    <span className="hidden xl:inline">Show Dossier</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Floating Scientific Dossier & Laura AI Space Guide */}
            {isTelemetryVisible && (
              <div className="absolute top-16 right-4 bottom-12 w-[380px] sm:w-[420px] max-w-[calc(100vw-32px)] z-20 flex flex-col gap-3 overflow-y-auto pr-1 pointer-events-auto scrollbar-thin">
                {/* Laura AI Space Guide */}
                <LauraSpaceGuide
                  profile={activeProfile}
                  selectedHotspot={selectedHotspot}
                  onClearHotspot={() => setSelectedHotspot(null)}
                />

                {/* NASA Telemetry Dossier */}
                <PlanetTelemetryDossier
                  profile={activeProfile}
                  selectedMoonId={selectedMoonId}
                  onSelectMoon={setSelectedMoonId}
                  onOpenComparison={() => setIsComparisonOpen(true)}
                  onReplayJourney={handleReplayJourney}
                />
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW C: CINEMATIC SPACECRAFT JOURNEY TRANSIT                      */}
        {/* ================================================================= */}
        {viewMode === 'journey' && (
          <div className="relative w-full h-full">
            <SpacecraftJourney3D
              destinationId={activePlanetId}
              onComplete={handleJourneyComplete}
              onCancel={() => setViewMode('3d-explorer')}
            />
          </div>
        )}
      </main>

      {/* Side-by-side Planet Comparison Modal */}
      <PlanetComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        primaryProfile={activeProfile}
      />

      {/* Discovery Achievements & Badges Modal */}
      <DiscoveryAchievements
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        exploredPlanets={exploredPlanets}
        journeysCount={journeysCount}
      />

      {/* Planetary Destination Selector Deck (11 Worlds) */}
      {isDestinationDeckOpen && (
        <PlanetaryDestinationDeck
          activePlanetId={activePlanetId}
          onSelectPlanet={(planetId) => {
            setActivePlanetId(planetId);
            setSelectedMoonId(null);
            setSelectedHotspot(null);
            setIsDestinationDeckOpen(false);
            if (['earth', 'venus', 'mars'].includes(planetId)) {
              setFeaturedPlanet(planetId as SpaceEduPlanetKey);
            }
            handleLaunch3DExplorer(planetId);
          }}
          exploredPlanets={exploredPlanets}
          onClose={() => setIsDestinationDeckOpen(false)}
        />
      )}

      {/* NASA Media Library & Exoplanet Archive Modal */}
      {isNasaHubOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#070C1B] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl scrollbar-thin scrollbar-thumb-cyan-500/30">
            <button
              onClick={() => setIsNasaHubOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <NasaDiscoveryHub />
          </div>
        </div>
      )}
    </div>
  );
};
