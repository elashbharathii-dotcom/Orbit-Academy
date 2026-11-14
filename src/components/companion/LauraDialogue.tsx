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
}

/**
 * LAURA Dialogue & Interactive Chat Interface (Phase 7 Elite Redesign)
 *
 * Features:
 * - Edge-docked bottom-right position matching companion entry point
 * - Minimalist dark glass aesthetic with subtle borders and backdrop blur
 * - Conversational telemetry powered by Google Gemini Developer API
 * - Real-time thinking animation
 * - Curated trivia cycler
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

  return (
    <div
      role="region"
      aria-label="LAURA Companion Mission Dialogue"
      className="pointer-events-auto fixed bottom-20 right-4 sm:right-6 z-40 flex w-[340px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-white/10 bg-[#05070D]/90 shadow-2xl backdrop-blur-2xl transition-all duration-300 animate-fade-in sm:w-[380px]"
    >
      {/* 1. Header with Status Telemetry & Controls */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Pulsing Core Indicator */}
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                isAiConnected ? 'bg-[#38BDF8] opacity-75' : 'bg-[#F59E0B] opacity-60'
              }`}
            />
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
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
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onClearChat}
            title="Reset conversation"
            aria-label="Reset conversation"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:text-[#38BDF8]"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Minimize LAURA dialogue"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#94A3B8] transition-colors hover:border-[#F59E0B] hover:text-[#F8FAFC]"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 2. Conversation Message Stream */}
      <div
        ref={chatScrollRef}
        aria-live="polite"
        className="flex max-h-[260px] min-h-[140px] flex-col gap-2.5 overflow-y-auto p-3.5 sm:max-h-[290px] scrollbar-none"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender Badge */}
            <div className="mb-1 flex items-center gap-1.5 px-1 font-mono text-[9px] text-[#94A3B8]">
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
              className={`rounded-2xl p-2.5 text-xs leading-relaxed transition-all ${
                msg.role === 'user'
                  ? 'max-w-[85%] rounded-tr-sm border border-[#38BDF8]/20 bg-[#38BDF8]/10 text-[#F8FAFC]'
                  : 'max-w-[90%] rounded-tl-sm border border-white/5 bg-white/[0.03] text-[#F8FAFC]'
              }`}
            >
              <p className="font-sans whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex flex-col items-start animate-fade-in">
            <div className="mb-1 flex items-center gap-1.5 px-1 font-mono text-[9px] text-[#F59E0B]">
              <Sparkles className="h-2.5 w-2.5 animate-spin text-[#F59E0B]" aria-hidden="true" />
              <span>LAURA // OBSERVING</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-[#F59E0B]/20 bg-white/[0.03] px-3 py-2">
              <Loader2 className="h-3 w-3 animate-spin text-[#F59E0B]" aria-hidden="true" />
              <span className="font-sans text-[11px] italic text-[#FBBF24]">
                LAURA is analyzing planetary telemetry... ✦
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Action Toolbar: Curiosity Button */}
      <div className="flex items-center justify-between border-t border-white/5 bg-black/20 px-3.5 py-2">
        <div className="flex items-center gap-1.5 font-mono text-[9.5px] text-[#94A3B8]">
          <Sparkles className="h-2.5 w-2.5 text-[#F59E0B]" aria-hidden="true" />
          <span>Curated Trivia</span>
        </div>

        <button
          type="button"
          onClick={onNextCuriosity}
          aria-label="Cycle to next astronomical fact"
          className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[9.5px] font-semibold text-[#38BDF8] transition-colors hover:border-[#38BDF8]/40 hover:bg-[#38BDF8]/10 hover:text-[#F8FAFC]"
        >
          <span>Next Curiosity</span>
          <ChevronRight className="h-2.5 w-2.5" aria-hidden="true" />
        </button>
      </div>

      {/* 4. Interactive Input Field */}
      <div className="border-t border-white/5 p-2.5">
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
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 pr-10 font-sans text-xs text-[#F8FAFC] placeholder-[#94A3B8]/50 transition-colors focus:border-[#F59E0B]/50 focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/30"
            />
            {inputText.length > 350 && (
              <span className="absolute bottom-1 right-2 font-mono text-[8px] text-[#94A3B8]">
                {inputText.length}/500
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            aria-label="Transmit question to LAURA"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#F59E0B] text-[#05070D] shadow-md transition-all hover:bg-[#FBBF24] disabled:opacity-30 disabled:hover:bg-[#F59E0B]"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
};
