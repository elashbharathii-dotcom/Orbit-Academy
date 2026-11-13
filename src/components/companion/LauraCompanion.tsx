import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navigation, Sparkles } from 'lucide-react';
import { LauraStar } from './LauraStar';
import { LauraDialogue, ChatMessage } from './LauraDialogue';
import { LauraFlightTrail, StardustParticle } from './LauraFlightTrail';
import { useLauraViewportFlight, FlightDestinationId } from './useLauraViewportFlight';
import { LAURA_DIALOGUES, LauraEmotion } from '../../data/lauraDialogues';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { useSolarSystem } from '../../context/SolarSystemContext';

/**
 * LAURA Companion Controller (Phase 6D: LAURA 3.0 Viewport Flight & Redesign)
 *
 * Capabilities:
 * - True screen-space full-viewport flight controller across hundreds of pixels
 * - Decoupled ergonomic HUD dialogue panel (prevents frame thrashing & jumpiness)
 * - Hardware-accelerated CSS cubic-bezier transitions with dynamic banking rotation
 * - Original sculpted 5-point celestial character with living eye/mouth animations
 * - Mission Control developer flight test waypoints: [Home], [Top-Left], [Top-Right], [Center], [Bottom-Right]
 * - Context-aware navigation (accompanies student to Planet Dossier on selection)
 * - Retains full Google Gemini AI live telemetry chat and curated NASA astronomy archive
 */
export const LauraCompanion: React.FC = () => {
  const { selectedPlanetId } = useSolarSystem();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [emotionOverride, setEmotionOverride] = useState<LauraEmotion | null>(null);
  const [activeEmotion, setActiveEmotion] = useState<LauraEmotion>('happy');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [curiosityIndex, setCuriosityIndex] = useState<number>(0);
  const [isAiConnected, setIsAiConnected] = useState<boolean>(false);
  const [particles, setParticles] = useState<StardustParticle[]>([]);

  // Initialize True Full-Viewport Flight Controller
  const {
    position,
    rotation,
    isGliding,
    activeDestination,
    flyToDestination,
  } = useLauraViewportFlight({
    selectedPlanetId,
    isChatOpen: isOpen,
  });

  // Stardust particle emissions during active flight traversal
  useEffect(() => {
    if (!isGliding) return;

    const chars = ['✦', '✧', '⋆', '•'];
    const interval = setInterval(() => {
      const newParticle: StardustParticle = {
        id: Date.now() + Math.random(),
        x: position.x + (Math.random() - 0.5) * 36,
        y: position.y + (Math.random() - 0.5) * 36,
        opacity: 0.95,
        scale: 0.8 + Math.random() * 0.5,
        char: chars[Math.floor(Math.random() * chars.length)],
      };

      setParticles((prev) => [...prev.slice(-12), newParticle]);
    }, 110);

    return () => clearInterval(interval);
  }, [isGliding, position.x, position.y]);

  // Gradually fade out stardust trail
  useEffect(() => {
    if (particles.length === 0) return;
    const cleanup = setTimeout(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, opacity: p.opacity - 0.18 }))
          .filter((p) => p.opacity > 0.1)
      );
    }, 140);

    return () => clearTimeout(cleanup);
  }, [particles]);

  // Retrieve active celestial body data
  const currentBody = useMemo(() => {
    if (!selectedPlanetId) return null;
    return CELESTIAL_BODIES.find((b) => b.id === selectedPlanetId) || null;
  }, [selectedPlanetId]);

  const contextKey = selectedPlanetId || 'overview';
  const contextName = currentBody ? currentBody.name : 'Solar System Overview';
  const curatedList = LAURA_DIALOGUES[contextKey] || LAURA_DIALOGUES.overview;

  // Initial backend health & AI readiness check
  useEffect(() => {
    let isMounted = true;
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error('Health check error');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setIsAiConnected(Boolean(data.hasApiKey));
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAiConnected(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // React to planet selection change
  useEffect(() => {
    const greeting = curatedList[0];
    const initialMessage: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      text: greeting.text,
      tag: greeting.tag,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([initialMessage]);
    setCuriosityIndex(0);
    setActiveEmotion(greeting.emotion);
    setEmotionOverride(null);
  }, [selectedPlanetId, curatedList]);

  // Handle student asking a question (AI transmission via Gemini backend)
  const handleSendMessage = useCallback(
    async (messageText: string) => {
      const userMessageId = `user-${Date.now()}`;
      const userMsg: ChatMessage = {
        id: userMessageId,
        role: 'user',
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);
      setActiveEmotion('thinking');

      // Prepare context telemetry payload from NASA data
      const contextTelemetry = currentBody
        ? {
            id: currentBody.id,
            name: currentBody.name,
            latinName: currentBody.latinName,
            classification: currentBody.physical.classification,
            realDistanceKm: currentBody.physical.realDistanceKm,
            realDistanceAU: currentBody.physical.realDistanceAU,
            realDiameterKm: currentBody.physical.realDiameterKm,
            surfaceGravityMs2: currentBody.physical.surfaceGravityMs2,
            orbitalPeriodDays: currentBody.physical.orbitalPeriodDays,
            rotationPeriodHours: currentBody.physical.rotationPeriodHours,
            meanTemperatureC: currentBody.physical.meanTemperatureC,
            moonsCount: currentBody.physical.moonsCount,
            atmosphericComposition: currentBody.physical.atmosphericComposition,
            missionObjective: currentBody.learningModule.missionObjective,
          }
        : undefined;

      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.text,
      }));

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageText,
            history: historyPayload,
            context: contextTelemetry,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`);
        }

        const data = await response.json();

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: data.response || 'Astronomical transmission received.',
          tag: data.fallback ? 'SPACE ARCHIVE' : 'GEMINI TELEMETRY',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, assistantMsg]);

        if (data.emotion && typeof data.emotion === 'string') {
          setActiveEmotion(data.emotion as LauraEmotion);
        } else {
          setActiveEmotion('happy');
        }

        if (data.fallback && data.error === 'API_KEY_NOT_CONFIGURED') {
          setIsAiConnected(false);
        }
      } catch {
        const fallbackMsg: ChatMessage = {
          id: `fallback-${Date.now()}`,
          role: 'assistant',
          text: "I'm having trouble contacting our deep-space antenna right now! You can explore my offline curiosities below, or configure your free GEMINI_API_KEY in server/.env to enable live AI transmissions.",
          tag: 'LOCAL ARCHIVE',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, fallbackMsg]);
        setActiveEmotion('thinking');
        setIsAiConnected(false);
      } finally {
        setIsThinking(false);
      }
    },
    [currentBody, messages]
  );

  // Cycle to next curated trivia item from offline scientific dialogues
  const handleNextCuriosity = useCallback(() => {
    const nextIndex = (curiosityIndex + 1) % curatedList.length;
    setCuriosityIndex(nextIndex);

    const fact = curatedList[nextIndex];
    const factMsg: ChatMessage = {
      id: `curiosity-${Date.now()}`,
      role: 'assistant',
      text: fact.text,
      tag: fact.tag,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCuriosity: true,
    };

    setMessages((prev) => [...prev, factMsg]);
    setActiveEmotion(fact.emotion);
    setEmotionOverride(null);
  }, [curiosityIndex, curatedList]);

  // Reset conversation to initial greeting
  const handleClearChat = useCallback(() => {
    const greeting = curatedList[0];
    const initialMessage: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      text: greeting.text,
      tag: greeting.tag,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([initialMessage]);
    setCuriosityIndex(0);
    setActiveEmotion(greeting.emotion);
    setEmotionOverride(null);
  }, [curatedList]);

  // Clicking LAURA triggers joyful reaction and toggles dialogue balloon
  const handleLauraClick = useCallback(() => {
    setIsOpen((prev) => !prev);
    setEmotionOverride((prev) => (prev === 'laughing' ? 'celebrating' : 'laughing'));
  }, []);

  const displayEmotion: LauraEmotion = emotionOverride || activeEmotion;

  return (
    <>
      {/* 1. Sparkling Stardust Particle Flight Trail */}
      <LauraFlightTrail particles={particles} />

      {/* 2. Decoupled Ergonomic Mission Dialogue Panel */}
      <LauraDialogue
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isThinking={isThinking}
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
        onNextCuriosity={handleNextCuriosity}
        contextName={contextName}
        isAiConnected={isAiConnected}
      />

      {/* 3. Freely Flying Celestial Mascot Container with Hardware GPU Transitions */}
      <div
        role="region"
        aria-label="LAURA Celestial Mascot"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          transform: `translate3d(${position.x}px, ${position.y}px, 0px) translate(-50%, -50%) rotate(${rotation}deg) scale(${
            isGliding ? 1.08 : 1
          })`,
          transition: 'transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex: 35,
        }}
        className="pointer-events-none select-none flex flex-col items-center will-change-transform"
      >
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Sculpted 3D Animated Avatar */}
          <LauraStar
            emotion={displayEmotion}
            size={58}
            onClick={handleLauraClick}
          />

          {/* Mini Status Pill / Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close LAURA dialogue' : 'Open LAURA dialogue'}
            className="group flex items-center gap-1.5 rounded-full border border-[rgba(245,158,11,0.35)] bg-[#0A0F1D]/90 px-3 py-1 shadow-xl backdrop-blur-md transition-all hover:border-[#F59E0B] hover:bg-[#11182E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
          >
            <span className="font-mono text-[11px] font-bold text-[#F59E0B]">LAURA</span>
            {isAiConnected ? (
              <span
                className="h-2 w-2 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]"
                title="Gemini AI Telemetry Active"
              />
            ) : (
              <span
                className="h-2 w-2 rounded-full bg-[#F59E0B]"
                title="Curated Space Archive"
              />
            )}
          </button>
        </div>
      </div>

      {/* 4. Mission Control Developer Flight & Emotion HUD Panel */}
      <aside
        aria-label="LAURA Developer Flight Telemetry"
        className="pointer-events-auto fixed bottom-14 left-4 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.16)] bg-[#0A0F1D]/88 px-3 py-1.5 font-mono text-[10px] text-[#94A3B8] shadow-xl backdrop-blur-md transition-all sm:left-6"
      >
        {/* Flight Waypoints Section */}
        <div className="flex items-center gap-1.5 text-[#F59E0B]">
          <Navigation className="h-3 w-3 animate-pulse" aria-hidden="true" />
          <span className="font-bold tracking-wider">NAV:</span>
        </div>

        <div className="flex items-center gap-1">
          {[
            { id: 'home', label: 'Home' },
            { id: 'upper-left', label: 'Top-Left' },
            { id: 'center', label: 'Center' },
            { id: 'upper-right', label: 'Top-Right' },
            { id: 'lower-right', label: 'Bottom-Right' },
          ].map((wp) => (
            <button
              key={wp.id}
              type="button"
              aria-label={`Fly LAURA to ${wp.label} waypoint`}
              onClick={() => flyToDestination(wp.id as FlightDestinationId)}
              className={`rounded-lg px-2 py-0.5 transition-all ${
                activeDestination === wp.id
                  ? 'border border-[#F59E0B] bg-[#F59E0B]/20 font-bold text-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                  : 'border border-[rgba(148,163,184,0.15)] bg-[#11182E] text-[#94A3B8] hover:border-[#38BDF8] hover:text-[#F8FAFC]'
              }`}
            >
              {wp.label}
            </button>
          ))}
        </div>

        <span className="hidden h-3.5 w-px bg-[rgba(148,163,184,0.2)] md:inline-block" />

        {/* Emotion Selectors */}
        <div className="hidden items-center gap-1 md:flex">
          <Sparkles className="h-2.5 w-2.5 text-[#38BDF8]" aria-hidden="true" />
          <span className="font-bold text-[#38BDF8]">MOOD:</span>
          {(['idle', 'happy', 'thinking', 'laughing', 'celebrating'] as LauraEmotion[]).map((emo) => (
            <button
              key={emo}
              type="button"
              aria-label={`Set LAURA emotion to ${emo}`}
              onClick={() => setEmotionOverride(emo)}
              className={`rounded-lg px-1.5 py-0.5 transition-all ${
                displayEmotion === emo
                  ? 'border border-[#38BDF8] bg-[#38BDF8]/20 font-bold text-[#38BDF8]'
                  : 'border border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {emo.charAt(0).toUpperCase() + emo.slice(1)}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};
