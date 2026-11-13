import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LauraStar } from './LauraStar';
import { LauraDialogue, ChatMessage } from './LauraDialogue';
import { LAURA_DIALOGUES, LauraEmotion } from '../../data/lauraDialogues';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { useSolarSystem } from '../../context/SolarSystemContext';

/**
 * LAURA Companion Controller (Phase 6B: Gemini Free Tier Upgrade)
 *
 * Capabilities:
 * - Real-time conversational AI integration via backend /api/chat endpoint
 * - Verified NASA physical telemetry injection for active celestial body
 * - Expressive emotional transitions across 5 distinct states:
 *   idle, happy, thinking, laughing, celebrating
 * - Graceful fallback to curated offline dialogues if API key is not configured
 * - Preserved "Next Curiosity" educational trivia cycler
 * - Fully responsive placement avoiding HUD and Planet Dossier collisions
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

  // Retrieve selected body data from celestial bodies catalogue
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

  // Reset conversation greeting & curiosity index whenever celestial focus changes
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

      // Extract brief history of recent turns for conversation continuity
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
        // Graceful offline fallback
        const fallbackMsg: ChatMessage = {
          id: `fallback-${Date.now()}`,
          role: 'assistant',
          text: "I'm having trouble connecting with our orbital antenna right now! You can explore my offline curiosities below, or configure the Gemini API key in your server .env file to enable live AI transmissions.",
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
    <div
      aria-label="LAURA Celestial Companion Area"
      className="pointer-events-none fixed bottom-24 left-4 z-20 flex flex-col items-start md:bottom-20 md:left-6"
    >
      {/* 1. Speech Balloon Dialogue & Chat Feed */}
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

      {/* 2. Interactive Character Button & Status Pill */}
      <div className="pointer-events-auto flex items-center gap-2.5">
        {/* Animated Avatar */}
        <LauraStar
          emotion={displayEmotion}
          size={54}
          onClick={handleLauraClick}
        />

        {/* Companion Presence Pill */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Hide LAURA mission briefing' : 'Chat with LAURA'}
          className="flex items-center gap-2 rounded-xl border border-[rgba(245,158,11,0.25)] bg-[#0A0F1D]/90 px-3 py-1.5 shadow-lg backdrop-blur-md transition-all hover:border-[#F59E0B] hover:bg-[#11182E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
        >
          <span className="font-mono text-xs font-bold text-[#F59E0B]">LAURA</span>
          <span className="font-mono text-[10px] text-[#94A3B8]">
            {isOpen ? 'Minimize' : 'Chat'}
          </span>
          {isAiConnected ? (
            <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8]" title="AI Live" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" title="Archive Mode" />
          )}
        </button>

        {/* Emotion Switcher for Quick Verification (idle, happy, thinking, laughing, celebrating) */}
        <div className="hidden items-center gap-1 rounded-lg border border-[rgba(148,163,184,0.12)] bg-[#0A0F1D]/80 p-1 font-mono text-[9px] text-[#94A3B8] backdrop-blur-md lg:flex">
          {(['idle', 'happy', 'thinking', 'laughing', 'celebrating'] as LauraEmotion[]).map((emo) => (
            <button
              key={emo}
              type="button"
              onClick={() => setEmotionOverride(emo)}
              aria-label={`Test ${emo} emotion`}
              className={`rounded px-1.5 py-0.5 transition-colors ${
                displayEmotion === emo
                  ? 'bg-[#F59E0B]/20 text-[#F59E0B] font-bold'
                  : 'hover:text-[#F8FAFC]'
              }`}
            >
              {emo.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
