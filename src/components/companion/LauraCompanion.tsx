import React, { useState, useEffect, useCallback } from 'react';
import { LauraStar } from './LauraStar';
import { LauraDialogue } from './LauraDialogue';
import { LAURA_DIALOGUES, LauraEmotion, LauraMessage } from '../../data/lauraDialogues';
import { useSolarSystem } from '../../context/SolarSystemContext';

/**
 * LAURA Companion Controller (Phase 6A)
 * Features:
 * - Reactive awareness of selected planet from SolarSystemContext
 * - Expressive emotional transitions across 5 distinct states:
 *   idle, happy, thinking, laughing, celebrating
 * - Floating presence anchored at bottom-left avoiding HUD and Dossier collisions
 * - Interactive dialogue balloon with educational trivia cycler
 */
export const LauraCompanion: React.FC = () => {
  const { selectedPlanetId } = useSolarSystem();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
  const [emotionOverride, setEmotionOverride] = useState<LauraEmotion | null>(null);

  // Determine message list based on selected celestial body
  const contextKey = selectedPlanetId ? selectedPlanetId : 'overview';
  const messages = LAURA_DIALOGUES[contextKey] || LAURA_DIALOGUES.overview;

  // Reset index & reaction when context changes
  useEffect(() => {
    setCurrentMessageIndex(0);
    setEmotionOverride(null);
    setIsOpen(true);
  }, [selectedPlanetId]);

  const currentMessage: LauraMessage = messages[currentMessageIndex % messages.length];

  // Active emotion: explicit override or context message emotion
  const activeEmotion: LauraEmotion = emotionOverride || currentMessage.emotion;

  // Cycle to next message in current context
  const handleNextMessage = useCallback(() => {
    setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    setEmotionOverride(null);
  }, [messages.length]);

  // Clicking LAURA triggers joyful reaction and opens speech balloon
  const handleLauraClick = useCallback(() => {
    setIsOpen((prev) => !prev);
    // Trigger temporary celebrating or laughing reaction
    setEmotionOverride((prev) => (prev === 'laughing' ? 'celebrating' : 'laughing'));
  }, []);

  return (
    <div
      aria-label="LAURA Celestial Companion Area"
      className="pointer-events-none fixed bottom-24 left-4 z-20 flex flex-col items-start md:bottom-20 md:left-6"
    >
      {/* 1. Speech Balloon Dialogue */}
      <LauraDialogue
        message={currentMessage}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNextMessage={handleNextMessage}
      />

      {/* 2. Interactive Character Button & Status Pill */}
      <div className="pointer-events-auto flex items-center gap-2.5">
        {/* Animated Avatar */}
        <LauraStar
          emotion={activeEmotion}
          size={54}
          onClick={handleLauraClick}
        />

        {/* Companion Presence Pill */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Hide LAURA mission briefing' : 'Read LAURA mission briefing'}
          className="flex items-center gap-2 rounded-xl border border-[rgba(245,158,11,0.25)] bg-[#0A0F1D]/90 px-3 py-1.5 shadow-lg backdrop-blur-md transition-all hover:border-[#F59E0B] hover:bg-[#11182E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
        >
          <span className="font-mono text-xs font-bold text-[#F59E0B]">LAURA</span>
          <span className="font-mono text-[10px] text-[#94A3B8]">
            {isOpen ? 'Minimize' : 'Chat'}
          </span>
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
                activeEmotion === emo
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
