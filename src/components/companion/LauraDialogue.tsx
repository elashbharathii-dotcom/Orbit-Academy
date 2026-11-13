import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  X,
  Send,
  RotateCcw,
  Bot,
  User,
  Loader2,
  Radio,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  tag?: string;
  timestamp: string;
  isCuriosity?: boolean;
}

interface LauraDialogueProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isThinking: boolean;
  onSendMessage: (messageText: string) => void;
  onClearChat: () => void;
  onNextCuriosity: () => void;
  contextName: string;
  isAiConnected: boolean;
  anchor?: {
    left: number;
    top: number;
    pointerDirection: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  };
}

/**
 * LAURA Dialogue & Interactive Chat Interface (Phase 6D)
 * Aligned with design-system/orbit-academy/MASTER.md
 *
 * Features:
 * - Dynamically anchored relative to LAURA's live flight coordinates
 * - Speech pointer triangle dynamically points toward LAURA
 * - Prevents viewport clipping and never overlaps mission-critical inputs
 * - Real-time conversational interface powered by Google Gemini Developer API
 * - Animated thinking telemetry indicator ("LAURA is gazing into the cosmos... ✦ ✧")
 * - Dedicated "Next Curiosity" button preserving Phase 6A curated trivia cycler
 */
export const LauraDialogue: React.FC<LauraDialogueProps> = ({
  isOpen,
  onClose,
  messages,
  isThinking,
  onSendMessage,
  onClearChat,
  onNextCuriosity,
  contextName,
  isAiConnected,
  anchor,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom whenever messages or thinking state updates
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || isThinking) return;
    onSendMessage(trimmed);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const pointerDir = anchor?.pointerDirection;

  return (
    <div
      role="region"
      aria-label="LAURA Companion Mission Dialogue"
      style={{
        left: anchor ? `${anchor.left}px` : undefined,
        top: anchor ? `${anchor.top}px` : undefined,
      }}
      className={`pointer-events-auto fixed z-30 flex w-[340px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-[rgba(245,158,11,0.35)] bg-[#0A0F1D]/95 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-fade-in sm:w-[390px] md:w-[420px] ${
        !anchor ? 'bottom-20 left-4 sm:left-6' : ''
      }`}
    >
      {/* 1. Header with Status Telemetry & Controls */}
      <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.12)] px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Pulsing Core Indicator */}
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                isAiConnected ? 'bg-[#38BDF8] opacity-75' : 'bg-[#F59E0B] opacity-60'
              }`}
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                isAiConnected ? 'bg-[#38BDF8]' : 'bg-[#F59E0B]'
              }`}
            />
          </span>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#F59E0B]">
              <span>LAURA</span>
              <span className="text-[10px] text-[#94A3B8]">{'//'}</span>
              <span className="text-[10px] text-[#38BDF8]">{contextName}</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[9px] text-[#94A3B8]">
              <Radio className="h-2.5 w-2.5 text-[#38BDF8]" aria-hidden="true" />
              <span>{isAiConnected ? 'Gemini AI Telemetry' : 'Curated Space Logs'}</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Clear Chat & Minimize */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onClearChat}
            title="Reset conversation"
            aria-label="Reset conversation"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#11182E] text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:text-[#38BDF8]"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Minimize LAURA dialogue"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#11182E] text-[#94A3B8] transition-colors hover:border-[#F59E0B] hover:text-[#F8FAFC]"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 2. Conversation Message Stream */}
      <div
        ref={chatScrollRef}
        aria-live="polite"
        className="flex max-h-[260px] min-h-[150px] flex-col gap-3 overflow-y-auto p-4 sm:max-h-[300px]"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender Badge */}
            <div className="mb-1 flex items-center gap-1.5 px-1 font-mono text-[9.5px] text-[#94A3B8]">
              {msg.role === 'user' ? (
                <>
                  <span>Explorer</span>
                  <User className="h-2.5 w-2.5 text-[#38BDF8]" aria-hidden="true" />
                </>
              ) : (
                <>
                  <Bot className="h-2.5 w-2.5 text-[#F59E0B]" aria-hidden="true" />
                  <span className="text-[#F59E0B]">{msg.tag || 'LAURA'}</span>
                  {msg.isCuriosity && (
                    <span className="rounded bg-[#F59E0B]/15 px-1 text-[8px] text-[#FBBF24]">
                      Archive
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`rounded-2xl p-3 text-xs leading-relaxed transition-all ${
                msg.role === 'user'
                  ? 'max-w-[85%] rounded-tr-sm border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#F8FAFC]'
                  : 'max-w-[90%] rounded-tl-sm border border-[rgba(245,158,11,0.25)] bg-[#11182E]/90 text-[#F8FAFC]'
              }`}
            >
              <p className="font-sans whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex flex-col items-start animate-fade-in">
            <div className="mb-1 flex items-center gap-1.5 px-1 font-mono text-[9.5px] text-[#F59E0B]">
              <Sparkles className="h-2.5 w-2.5 animate-spin text-[#F59E0B]" aria-hidden="true" />
              <span>LAURA // OBSERVING</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-2xl rounded-tl-sm border border-[#F59E0B]/30 bg-[#11182E]/90 px-3.5 py-2.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#F59E0B]" aria-hidden="true" />
              <span className="font-sans text-xs italic text-[#FBBF24]">
                LAURA is gazing into the cosmos... ✦ ✧
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Action Toolbar: Curiosity Button */}
      <div className="flex items-center justify-between border-t border-[rgba(148,163,184,0.1)] bg-[#0A0F1D]/60 px-4 py-2">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#94A3B8]">
          <Sparkles className="h-3 w-3 text-[#F59E0B]" aria-hidden="true" />
          <span>Curated Trivia</span>
        </div>

        <button
          type="button"
          onClick={onNextCuriosity}
          aria-label="Cycle to next astronomical fact"
          className="flex items-center gap-1 rounded-lg border border-[rgba(148,163,184,0.2)] bg-[#11182E] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#38BDF8] transition-colors hover:border-[#38BDF8] hover:bg-[#38BDF8]/10 hover:text-[#F8FAFC]"
        >
          <span>Next Curiosity</span>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>

      {/* 4. Interactive Input Field */}
      <div className="border-t border-[rgba(148,163,184,0.12)] p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center gap-2"
        >
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value.slice(0, 500))}
              onKeyDown={handleKeyDown}
              placeholder={`Ask LAURA about ${contextName}...`}
              aria-label={`Ask LAURA about ${contextName}`}
              className="w-full resize-none rounded-xl border border-[rgba(148,163,184,0.2)] bg-[#11182E] px-3 py-2 pr-12 font-sans text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 transition-colors focus:border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]"
            />
            {inputText.length > 350 && (
              <span className="absolute bottom-1 right-2 font-mono text-[9px] text-[#94A3B8]">
                {inputText.length}/500
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            aria-label="Transmit question to LAURA"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#F59E0B] text-[#0A0F1D] shadow-md transition-all hover:bg-[#FBBF24] disabled:opacity-30 disabled:hover:bg-[#F59E0B]"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>

      {/* Dynamic Speech Pointer pointing towards LAURA (when anchored) */}
      {anchor && pointerDir === 'bottom-left' && (
        <div
          className="pointer-events-none absolute -bottom-2 left-6 h-0 w-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#0A0F1D]"
          aria-hidden="true"
        />
      )}
      {anchor && pointerDir === 'bottom-right' && (
        <div
          className="pointer-events-none absolute -bottom-2 right-8 h-0 w-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#0A0F1D]"
          aria-hidden="true"
        />
      )}
      {anchor && pointerDir === 'top-left' && (
        <div
          className="pointer-events-none absolute -top-2 left-6 h-0 w-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#0A0F1D]"
          aria-hidden="true"
        />
      )}
      {anchor && pointerDir === 'top-right' && (
        <div
          className="pointer-events-none absolute -top-2 right-8 h-0 w-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#0A0F1D]"
          aria-hidden="true"
        />
      )}
    </div>
  );
};
