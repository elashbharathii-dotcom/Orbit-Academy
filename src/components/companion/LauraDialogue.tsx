import React from 'react';
import { Sparkles, ChevronRight, X } from 'lucide-react';
import { LauraMessage } from '../../data/lauraDialogues';

interface LauraDialogueProps {
  message: LauraMessage;
  isOpen: boolean;
  onClose: () => void;
  onNextMessage: () => void;
}

/**
 * LAURA Dialogue Bubble (Phase 6A)
 * Features:
 * - Mission-control speech bubble anchored above Laura
 * - Displays authentic astrophysical trivia with educational tags
 * - Next Fact cycler allowing students to explore multiple curiosities
 * - Collapse / minimize controls
 */
export const LauraDialogue: React.FC<LauraDialogueProps> = ({
  message,
  isOpen,
  onClose,
  onNextMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="LAURA Companion Dialogue"
      className="pointer-events-auto absolute bottom-16 left-0 z-30 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-[rgba(245,158,11,0.35)] bg-[#0A0F1D]/95 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-fade-in md:bottom-20 md:w-96 md:p-5"
    >
      {/* 1. Header with Badge & Dismiss Button */}
      <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.12)] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F59E0B] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F59E0B]"></span>
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]">
            LAURA // {message.tag}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Minimize LAURA dialogue"
          className="flex h-6 w-6 items-center justify-center rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#11182E] text-[#94A3B8] transition-colors hover:border-[#F59E0B] hover:text-[#F8FAFC]"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* 2. Educational Speech Text */}
      <div className="mt-3">
        <p className="font-sans text-xs leading-relaxed text-[#F8FAFC]">
          "{message.text}"
        </p>
      </div>

      {/* 3. Action Footer: Next Curiosity Cycler */}
      <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-[rgba(148,163,184,0.1)]">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#94A3B8]">
          <Sparkles className="h-3 w-3 text-[#F59E0B]" aria-hidden="true" />
          <span>Star Companion</span>
        </div>

        <button
          type="button"
          onClick={onNextMessage}
          aria-label="Cycle to next astronomical fact"
          className="flex items-center gap-1.5 rounded-lg border border-[rgba(148,163,184,0.2)] bg-[#11182E] px-2.5 py-1 font-mono text-[10.5px] font-semibold text-[#38BDF8] transition-colors hover:border-[#38BDF8] hover:bg-[#38BDF8]/10 hover:text-[#F8FAFC]"
        >
          <span>Next Curiosity</span>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>

      {/* Speech Triangle Pointer downward pointing towards Laura */}
      <div
        className="pointer-events-none absolute -bottom-2 left-6 h-0 w-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#0A0F1D]"
        aria-hidden="true"
      />
    </div>
  );
};
