import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LauraStar } from './LauraStar';
import { LauraDialogue, ChatMessage } from './LauraDialogue';
import { LauraFlightTrail, StardustParticle } from './LauraFlightTrail';
import { useLauraViewportFlight } from './useLauraViewportFlight';
import { LAURA_DIALOGUES, LauraEmotion } from '../../data/lauraDialogues';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { useSolarSystem } from '../../context/SolarSystemContext';

/**
 * LAURA Autonomous Living Celestial Companion (Milestone 2)
 *
 * Capabilities:
 * - Fluid autonomous floating movement across available screen space
 * - Avoids UI hotspots (top brand bar, bottom planetary dock, active planet dossier)
 * - Emits gentle golden stardust particle trails as she glides
 * - Contextual reactions: accompanies user when selecting planets and reacts with joy/curiosity
 * - Full Google Gemini Developer API conversational telemetry
 * - Complete curated NASA astronomy trivia archive fallback
 * - ZERO developer buttons or emotion test bars
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

  // 1. Autonomous Screen-Space Flight Controller
  const { position, rotation, isGliding } = useLauraViewportFlight({
    selectedPlanetId,
    isChatOpen: isOpen,
  });

  // 2. Stardust particle emissions behind LAURA during active flight
  useEffect(() => {
    if (!isGliding) return;

    const chars = ['✦', '✧', '⋆', '•'];
    const interval = setInterval(() => {
      const newParticle: StardustParticle = {
        id: Date.now() + Math.random(),
        x: position.x + (Math.random() - 0.5) * 28,
        y: position.y + (Math.random() - 0.5) * 28,
        opacity: 0.90,
        scale: 0.75 + Math.random() * 0.45,
        char: chars[Math.floor(Math.random() * chars.length)],
      };

      setParticles((prev) => [...prev.slice(-10), newParticle]);
    }, 120);

    return () => clearInterval(interval);
  }, [isGliding, position.x, position.y]);

  // Gradually fade stardust
  useEffect(() => {
    if (particles.length === 0) return;
    const cleanup = setTimeout(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, opacity: p.opacity - 0.16 }))
          .filter((p) => p.opacity > 0.08)
      );
    }, 120);

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

  // Backend health & AI readiness check
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

  // Contextual reaction on planet selection
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

    if (selectedPlanetId && selectedPlanetId !== 'sun') {
      setActiveEmotion('celebrating');
      const timer = setTimeout(() => setActiveEmotion(greeting.emotion), 2400);
      return () => clearTimeout(timer);
    } else {
      setActiveEmotion(greeting.emotion);
    }
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

      // Context telemetry payload from NASA data
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

  // Cycle to next curated trivia item
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

  // Clicking LAURA triggers a joyful reaction and toggles dialogue
  const handleLauraClick = useCallback(() => {
    setIsOpen((prev) => !prev);
    setEmotionOverride((prev) => (prev === 'laughing' ? 'celebrating' : 'laughing'));
  }, []);

  const displayEmotion: LauraEmotion = emotionOverride || activeEmotion;

  return (
    <>
      {/* 1. Subtle Golden Stardust Flight Trail */}
      <LauraFlightTrail particles={particles} />

      {/* 2. Expandable Ergonomic Mission Dialogue Panel */}
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

      {/* 3. Freely Floating Autonomous Celestial Companion */}
      <div
        role="region"
        aria-label="LAURA Celestial AI Companion"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          transform: `translate3d(${position.x}px, ${position.y}px, 0px) translate(-50%, -50%) rotate(${rotation}deg) scale(${
            isGliding ? 1.06 : 1
          })`,
          transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex: 35,
        }}
        className="pointer-events-none select-none flex flex-col items-center will-change-transform"
      >
        <div className="pointer-events-auto group relative flex items-center gap-1.5 cursor-pointer">
          {/* Living 5-Point Celestial Mascot */}
          <LauraStar
            emotion={displayEmotion}
            size={48}
            onClick={handleLauraClick}
            isFlying={isGliding}
          />

          {/* Minimal Hover Tag */}
          {!isOpen && (
            <div
              onClick={handleLauraClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-[#05070D]/85 px-2.5 py-0.5 backdrop-blur-md shadow-lg"
            >
              <span className="font-mono text-[9px] font-bold text-[#F59E0B]">LAURA</span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isAiConnected ? 'bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]' : 'bg-[#F59E0B]'
                }`}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
