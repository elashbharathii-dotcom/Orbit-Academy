import React, { useState, useEffect } from 'react';
import { PlanetDiscoveryProfile, PlanetaryHotspot } from '../types';
import { discoveryAudio } from '../audio/discoveryAudio';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  MessageSquare,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  MapPin,
  X,
} from 'lucide-react';

interface LauraSpaceGuideProps {
  profile: PlanetDiscoveryProfile;
  selectedHotspot?: PlanetaryHotspot | null;
  onClearHotspot?: () => void;
  onAskQuestion?: (question: string) => Promise<string>;
}

export const LauraSpaceGuide: React.FC<LauraSpaceGuideProps> = ({
  profile,
  selectedHotspot,
  onClearHotspot,
  onAskQuestion,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(discoveryAudio.getIsVoiceMuted());
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [activeNarrationKey, setActiveNarrationKey] = useState<
    'intro' | 'orbitAndScale' | 'atmosphereAndSurface' | 'moonsAndRings' | 'explorationAndSignificance'
  >('intro');
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [isAiExpanded, setIsAiExpanded] = useState<boolean>(false);
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiChatLog, setAiChatLog] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  const activeText = profile.lauraNarration[activeNarrationKey];

  // Stop speech when profile changes
  useEffect(() => {
    discoveryAudio.stopSpeech();
    setIsPlaying(false);
    setCurrentSubtitle(profile.lauraNarration.intro);
    setActiveNarrationKey('intro');
  }, [profile]);

  // When a hotspot is selected, automatically narrate its speech aloud!
  useEffect(() => {
    if (selectedHotspot) {
      setCurrentSubtitle(selectedHotspot.lauraSpeech);
      setIsPlaying(true);
      discoveryAudio.speak(selectedHotspot.lauraSpeech, {
        onStart: () => setIsPlaying(true),
        onEnd: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    }
  }, [selectedHotspot]);

  // Handle Play/Pause Narration
  const handlePlayNarration = (text: string) => {
    if (isPlaying) {
      discoveryAudio.stopSpeech();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setCurrentSubtitle(text);

    discoveryAudio.speak(text, {
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const handleToggleMute = () => {
    const next = discoveryAudio.toggleVoiceMute();
    setIsMuted(next);
    if (next) {
      setIsPlaying(false);
    }
  };

  const handleChangeRate = (rate: number) => {
    setSpeechRate(rate);
    discoveryAudio.setSpeechRate(rate);
    if (isPlaying) {
      discoveryAudio.stopSpeech();
      handlePlayNarration(selectedHotspot ? selectedHotspot.lauraSpeech : activeText);
    }
  };

  // Submit cadet question to Gemini AI backend
  const handleSubmitAiQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = aiQuestion.trim();
    if (!q || isAiThinking) return;

    setAiChatLog((prev) => [...prev, { role: 'user', text: q }]);
    setAiQuestion('');
    setIsAiThinking(true);

    try {
      if (onAskQuestion) {
        const reply = await onAskQuestion(q);
        setAiChatLog((prev) => [...prev, { role: 'assistant', text: reply }]);
      } else {
        // Direct API call to backend
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: q,
            context: `Orbit Academy Discovery Mode: Currently inspecting ${profile.name} (${profile.classification}). Physical diameter: ${profile.physics.equatorialDiameterKm} km, gravity: ${profile.physics.surfaceGravityMs2} m/s², atmosphere: ${profile.atmosphere.description}`,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setAiChatLog((prev) => [...prev, { role: 'assistant', text: data.reply || data.text }]);
        } else {
          // Scientifically grounded fallback
          setAiChatLog((prev) => [
            ...prev,
            {
              role: 'assistant',
              text: `Great question, cadet! On ${profile.name}, surface conditions are dominated by its ${profile.classification}. Scientific missions like ${profile.missions[0]?.name || 'orbital probes'} have revealed that ${profile.scientificSignificance}`,
            },
          ]);
        }
      }
    } catch {
      setAiChatLog((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Great question, cadet! On ${profile.name}, surface conditions are dominated by its ${profile.classification}. Scientific missions like ${profile.missions[0]?.name || 'orbital probes'} have revealed that ${profile.scientificSignificance}`,
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#070C1B]/90 p-4 shadow-2xl backdrop-blur-2xl">
      {/* 1. Header: LAURA AI Space Guide Banner */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#38BDF8] to-[#818CF8] text-[#02050D] shadow-[0_0_15px_#38BDF8]">
            <Sparkles className="h-4 w-4 animate-spin-slow" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-xs font-black text-white tracking-wide">
                LAURA AI GUIDE
              </span>
              <span className="rounded-full bg-[#38BDF8]/15 px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#38BDF8] border border-[#38BDF8]/20">
                ACTIVE
              </span>
            </div>
            <span className="font-mono text-[9.5px] text-[#94A3B8]">
              Voice Space Expedition Companion
            </span>
          </div>
        </div>

        {/* Audio Mute & Speed Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Laura voice' : 'Mute Laura voice'}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-[#38BDF8]" />}
          </button>

          <button
            type="button"
            onClick={() => handleChangeRate(speechRate === 1.0 ? 1.25 : speechRate === 1.25 ? 0.8 : 1.0)}
            className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-all text-[10.5px]"
          >
            {speechRate}x
          </button>
        </div>
      </div>

      {/* 2. Hotspot Analysis Active Spotlight (if a 3D feature is clicked) */}
      {selectedHotspot ? (
        <div className="flex items-center justify-between rounded-xl border border-[#38BDF8]/40 bg-[#38BDF8]/10 p-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="h-4 w-4 text-[#38BDF8] flex-shrink-0 animate-bounce" />
            <div className="min-w-0">
              <div className="font-mono text-[9px] uppercase tracking-wider text-[#38BDF8]">
                TARGET FEATURE ANALYSIS
              </div>
              <div className="font-sans text-xs font-bold text-white truncate">
                {selectedHotspot.title}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => handlePlayNarration(selectedHotspot.lauraSpeech)}
              className="flex items-center gap-1 rounded-lg bg-[#38BDF8] px-2 py-1 font-mono text-[10px] font-bold text-[#02050D] hover:bg-[#7DD3FC] transition-all"
            >
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              <span>{isPlaying ? 'Pause' : 'Explain'}</span>
            </button>

            {onClearHotspot && (
              <button
                type="button"
                onClick={onClearHotspot}
                className="flex h-6 w-6 items-center justify-center rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Educational Topic Chips */
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: 'intro', label: '1. Overview' },
              { id: 'orbitAndScale', label: '2. Orbit & Scale' },
              { id: 'atmosphereAndSurface', label: '3. Atmosphere' },
              { id: 'moonsAndRings', label: '4. Moons & Rings' },
              { id: 'explorationAndSignificance', label: '5. Missions' },
            ] as const
          ).map((topic) => {
            const isActive = activeNarrationKey === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => {
                  setActiveNarrationKey(topic.id);
                  handlePlayNarration(profile.lauraNarration[topic.id]);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[10.5px] transition-all capitalize ${
                  isActive
                    ? 'bg-[#38BDF8] text-[#030611] font-bold shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                    : 'bg-white/5 text-[#94A3B8] hover:text-white hover:bg-white/10'
                }`}
              >
                {topic.label}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Synchronized Live Subtitle & Narration Transcript */}
      <div className="relative rounded-xl border border-white/5 bg-[#030611]/80 p-3.5 flex flex-col gap-2">
        <p className="font-sans text-xs text-[#E2E8F0] leading-relaxed">
          "{currentSubtitle || (selectedHotspot ? selectedHotspot.lauraSpeech : activeText)}"
        </p>

        <div className="flex items-center justify-between border-t border-white/5 pt-2">
          <button
            type="button"
            onClick={() => handlePlayNarration(selectedHotspot ? selectedHotspot.lauraSpeech : activeText)}
            className="flex items-center gap-1.5 rounded-lg bg-[#38BDF8]/20 px-3 py-1 font-mono text-xs font-bold text-[#38BDF8] hover:bg-[#38BDF8]/30 transition-all border border-[#38BDF8]/30"
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            <span>{isPlaying ? 'Pause Narration' : 'Play Narration'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              discoveryAudio.stopSpeech();
              handlePlayNarration(selectedHotspot ? selectedHotspot.lauraSpeech : activeText);
            }}
            className="flex items-center gap-1 font-mono text-[11px] text-[#94A3B8] hover:text-white transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Replay Voice</span>
          </button>
        </div>
      </div>

      {/* 4. Cadet Ask LAURA AI Expandable Drawer */}
      <div className="border-t border-white/5 pt-2">
        <button
          type="button"
          onClick={() => setIsAiExpanded(!isAiExpanded)}
          className="w-full flex items-center justify-between text-left py-1 text-xs font-mono text-[#38BDF8] hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Ask Laura questions about {profile.name}</span>
          </div>
          {isAiExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {isAiExpanded && (
          <div className="mt-2.5 flex flex-col gap-2.5 animate-fade-in">
            {/* Conversation Log */}
            {aiChatLog.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1 font-sans text-xs scrollbar-thin">
                {aiChatLog.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl ${
                      msg.role === 'user'
                        ? 'bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-white ml-4'
                        : 'bg-white/5 border border-white/5 text-[#CBD5E1] mr-4'
                    }`}
                  >
                    <div className="font-mono text-[9px] text-[#94A3B8] mb-0.5 uppercase">
                      {msg.role === 'user' ? 'Cadet Question' : 'Laura AI Answer'}
                    </div>
                    {msg.text}
                  </div>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmitAiQuestion} className="relative flex items-center">
              <input
                type="text"
                placeholder={`Ask anything about ${profile.name}...`}
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                disabled={isAiThinking}
                className="w-full rounded-xl border border-white/10 bg-[#0B1226] pl-3 pr-9 py-1.5 font-sans text-xs text-white placeholder-[#64748B] focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
              />
              <button
                type="submit"
                disabled={!aiQuestion.trim() || isAiThinking}
                className="absolute right-1.5 flex h-6 w-6 items-center justify-center rounded-lg bg-[#38BDF8] text-[#030611] disabled:opacity-30 disabled:hover:bg-[#38BDF8] transition-all"
              >
                {isAiThinking ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
