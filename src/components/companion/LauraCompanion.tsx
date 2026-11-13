import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LauraStar } from './LauraStar';
import { LauraDialogue, ChatMessage } from './LauraDialogue';
import { LAURA_DIALOGUES, LauraEmotion } from '../../data/lauraDialogues';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { useSolarSystem } from '../../context/SolarSystemContext';

/**
 * LAURA Companion Controller (Elite Minimalist UI/UX)
 *
 * Capabilities:
 * - Discreet, non-intrusive floating celestial guide docked at bottom-right
 * - Full Google Gemini Developer API conversational telemetry
 * - Complete curated NASA astronomy trivia archive fallback
 * - Planetary context-awareness: dynamically tunes telemetry & responses to selected planet
 * - Zero developer clutter: removes waypoints bar & mood override panels
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

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    setEmotionOverride((prev) => (prev === 'laughing' ? 'celebrating' : 'laughing'));
  }, []);

  const displayEmotion: LauraEmotion = emotionOverride || activeEmotion;

  return (
    <>
      {/* 1. Ergonomic Floating Mission Dialogue Panel */}
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

      {/* 2. Discreet, Edge-Docked Celestial Guide Trigger (Bottom-Right) */}
      <div
        className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6"
        role="region"
        aria-label="LAURA Celestial AI Guide"
      >
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close LAURA dialogue' : 'Open LAURA AI celestial guide'}
          className="group relative flex items-center gap-2 rounded-full border border-white/10 bg-[#05070D]/80 p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-[#F59E0B]/50 hover:bg-[#05070D]/95 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F59E0B]"
        >
          {/* Subtle Glowing Character Emblem */}
          <div className="relative flex h-10 w-10 items-center justify-center">
            <LauraStar
              emotion={displayEmotion}
              size={36}
            />
          </div>

          {/* Minimal Label & AI Status Light */}
          <div className="hidden pr-2 text-left sm:flex sm:flex-col">
            <div className="flex items-center gap-1.5 font-sans text-xs font-semibold tracking-wide text-[#F8FAFC] group-hover:text-[#F59E0B]">
              <span>LAURA</span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isAiConnected ? 'bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]' : 'bg-[#F59E0B]'
                }`}
                title={isAiConnected ? 'Gemini AI Telemetry Active' : 'Curated Space Logs'}
              />
            </div>
            <span className="font-mono text-[9px] text-[#94A3B8]">
              {isOpen ? 'Tap to close' : 'Ask AI'}
            </span>
          </div>
        </button>
      </div>
    </>
  );
};
