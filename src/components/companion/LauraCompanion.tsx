import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LauraStar } from './LauraStar';
import { LauraDialogue, ChatMessage } from './LauraDialogue';
import { LauraFlightTrail } from './LauraFlightTrail';
import { useLauraFlight } from './useLauraFlight';
import { LAURA_DIALOGUES, LauraEmotion } from '../../data/lauraDialogues';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { useSolarSystem } from '../../context/SolarSystemContext';

/**
 * LAURA Companion Controller (Phase 6D: Autonomous Celestial Flight)
 *
 * Capabilities:
 * - Fluid full-viewport flight controller with natural pursuit damping and organic hover
 * - Context-aware autonomous navigation (drifts to observatory posts and planet focus waypoints)
 * - Dynamic speech balloon anchoring relative to live flight coordinates without clipping
 * - Expressive banking rotations, squash & stretch, and glittering stardust particle trails
 * - Interactive cursor-glance awareness on desktop
 * - Full reduced-motion accessibility support
 * - Preserved Gemini AI chat, verified telemetry context, and offline curiosities
 */
export const LauraCompanion: React.FC = () => {
  const { selectedPlanetId } = useSolarSystem();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [emotionOverride, setEmotionOverride] = useState<LauraEmotion | null>(null);
  const [activeEmotion, setActiveEmotion] = useState<LauraEmotion>('happy');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [curiosityIndex, setCuriosityIndex] = useState<number>(0);
  const [isAiConnected, setIsAiConnected] = useState<boolean>(false);

  // Initialize Autonomous Flight Controller
  const { flightState } = useLauraFlight({
    selectedPlanetId,
    isChatOpen: isOpen,
    isThinking,
  });

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
      <LauraFlightTrail particles={flightState.particles} />

      {/* 2. Dynamically Anchored Speech Balloon Dialogue */}
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
        anchor={flightState.speechAnchor}
      />

      {/* 3. Freely Flying Celestial Character Container */}
      <div
        aria-label="LAURA Celestial Companion"
        style={{
          position: 'fixed',
          left: `${flightState.x}px`,
          top: `${flightState.y}px`,
          transform: `translate(-50%, -50%) rotate(${flightState.rotation}deg) scale(${flightState.scaleX}, ${flightState.scaleY})`,
          zIndex: 25,
        }}
        className="pointer-events-none select-none flex flex-col items-center transition-transform duration-75 will-change-transform"
      >
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Animated Avatar */}
          <LauraStar
            emotion={displayEmotion}
            size={56}
            onClick={handleLauraClick}
          />

          {/* Mini Status Pill */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Hide LAURA chat' : 'Open LAURA chat'}
            className="flex items-center gap-1.5 rounded-full border border-[rgba(245,158,11,0.25)] bg-[#0A0F1D]/90 px-2.5 py-1 shadow-lg backdrop-blur-md transition-all hover:border-[#F59E0B] hover:bg-[#11182E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
          >
            <span className="font-mono text-[10.5px] font-bold text-[#F59E0B]">LAURA</span>
            {isAiConnected ? (
              <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8]" title="AI Online" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" title="Archive Mode" />
            )}
          </button>
        </div>

        {/* Emotion Verification Controls (Visible on hover/desktop) */}
        <div className="pointer-events-auto mt-1 hidden items-center gap-1 rounded-md border border-[rgba(148,163,184,0.12)] bg-[#0A0F1D]/80 p-0.5 font-mono text-[8.5px] text-[#94A3B8] backdrop-blur-md group-hover:flex lg:flex">
          {(['idle', 'happy', 'thinking', 'laughing', 'celebrating'] as LauraEmotion[]).map((emo) => (
            <button
              key={emo}
              type="button"
              onClick={() => setEmotionOverride(emo)}
              aria-label={`Test ${emo} emotion`}
              className={`rounded px-1 py-0.5 transition-colors ${
                displayEmotion === emo
                  ? 'bg-[#F59E0B]/20 font-bold text-[#F59E0B]'
                  : 'hover:text-[#F8FAFC]'
              }`}
            >
              {emo.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
