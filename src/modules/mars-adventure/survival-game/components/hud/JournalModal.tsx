import React, { useState } from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  CAMPAIGN_CHAPTERS,
  INITIAL_JOURNAL_ENTRIES,
  CAMPAIGN_CHOICES,
} from '../../data/campaignStoryData';
import { JournalEntry } from '../../types/storyTypes';
import {
  BookOpen,
  Headphones,
  Sparkles,
  CheckCircle2,
  Compass,
  X,
  Volume2,
  BookmarkCheck,
} from 'lucide-react';
import { audioSystem } from '../../systems/audioSynthesizer';

export const JournalModal: React.FC = () => {
  const isOpen = useMarsGameStore((state) => state.isJournalModalOpen);
  const closeJournalModal = useMarsGameStore((state) => state.closeJournalModal);
  const currentChapterId = useMarsGameStore((state) => state.campaignChapter);
  const completedChapters = useMarsGameStore((state) => state.completedChapters);
  const unlockedJournalIds = useMarsGameStore((state) => state.unlockedJournalIds);
  const playerDecisions = useMarsGameStore((state) => state.playerDecisions);
  const solNumber = useMarsGameStore((state) => state.solCycle.solNumber);

  const [activeTab, setActiveTab] = useState<'chapters' | 'audio_logs' | 'discoveries' | 'decisions'>('chapters');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(INITIAL_JOURNAL_ENTRIES[0]);

  if (!isOpen) return null;

  const currentChapter = CAMPAIGN_CHAPTERS.find((c) => c.id === currentChapterId) || CAMPAIGN_CHAPTERS[0];

  const filteredEntries = INITIAL_JOURNAL_ENTRIES.filter((entry) => {
    const isUnlocked = unlockedJournalIds.includes(entry.id);
    if (!isUnlocked) return false;
    if (activeTab === 'audio_logs') {
      return entry.category === 'audio_log' || entry.category === 'transmission';
    }
    if (activeTab === 'discoveries') {
      return entry.category === 'discovery' || entry.category === 'campaign';
    }
    return true;
  });

  const handlePlayLogAudio = () => {
    audioSystem.playRadioTransmission();
  };

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative flex flex-col h-[85vh] max-h-[820px] w-full max-w-5xl overflow-hidden rounded-2xl border border-cyan-500/40 bg-[#070B16]/95 shadow-[0_0_60px_rgba(0,240,255,0.2)]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-[#0A0F20]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl border border-cyan-500/30 bg-cyan-950/60 text-cyan-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">
                  EXPEDITION TELEMETRY ARCHIVE
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-[10px] text-slate-400">MARS: LAST FRONTIER</span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                ASTRONAUT FIELD JOURNAL & STORY LOG
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] text-amber-400 font-bold">
              SOL {solNumber} • CHAPTER {currentChapterId} / 6
            </span>
            <button
              onClick={() => {
                audioSystem.playChime(600);
                closeJournalModal();
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/40 px-5 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => {
              audioSystem.playChime(900);
              setActiveTab('chapters');
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'chapters'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>CAMPAIGN CHAPTERS ({currentChapterId}/6)</span>
          </button>

          <button
            onClick={() => {
              audioSystem.playChime(900);
              setActiveTab('audio_logs');
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'audio_logs'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Headphones className="h-4 w-4" />
            <span>AUDIO LOGS & TRANSMISSIONS</span>
          </button>

          <button
            onClick={() => {
              audioSystem.playChime(900);
              setActiveTab('discoveries');
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'discoveries'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>ASTROBIOLOGY & DISCOVERIES</span>
          </button>

          <button
            onClick={() => {
              audioSystem.playChime(900);
              setActiveTab('decisions');
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'decisions'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookmarkCheck className="h-4 w-4" />
            <span>PLAYER DIRECTIVES ({Object.keys(playerDecisions).length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'chapters' && (
            <div className="space-y-6">
              {/* Active Chapter Hero */}
              <div className="rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-[#0A1224] to-cyan-950/20 p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                      ACTIVE CAMPAIGN MILESTONE
                    </span>
                    <h3 className="text-lg font-extrabold text-white">
                      {currentChapter.title} — {currentChapter.subtitle}
                    </h3>
                  </div>
                  <span className="text-xs text-amber-400 font-bold bg-amber-950/50 border border-amber-500/30 px-3 py-1 rounded-full self-start">
                    ESTIMATED: {currentChapter.solEstimate}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {currentChapter.overview}
                </p>

                {/* Chapter Objectives Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    CHAPTER DIRECTIVES & OBJECTIVES:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {currentChapter.objectives.map((obj) => (
                      <div
                        key={obj.id}
                        className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-black/40 p-2.5"
                      >
                        <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {obj.title}
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {obj.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline of All 6 Chapters */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  EXPEDITION TIMELINE:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {CAMPAIGN_CHAPTERS.map((ch) => {
                    const isDone = completedChapters.includes(ch.id);
                    const isCurrent = ch.id === currentChapterId;

                    return (
                      <div
                        key={ch.id}
                        className={`rounded-xl border p-3.5 transition-all ${
                          isCurrent
                            ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                            : isDone
                            ? 'border-emerald-500/30 bg-emerald-950/20'
                            : 'border-white/5 bg-black/30 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-slate-400">
                            {ch.title}
                          </span>
                          {isDone ? (
                            <span className="text-[10px] text-emerald-400 font-bold">COMPLETED</span>
                          ) : isCurrent ? (
                            <span className="text-[10px] text-cyan-300 font-bold animate-pulse">IN PROGRESS</span>
                          ) : (
                            <span className="text-[10px] text-slate-500">LOCKED</span>
                          )}
                        </div>
                        <h5 className="text-xs font-bold text-white mb-1">{ch.subtitle}</h5>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{ch.overview}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'audio_logs' || activeTab === 'discoveries') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
              {/* Left Column: Entries List */}
              <div className="md:col-span-1 space-y-2 border-r border-white/10 pr-2 overflow-y-auto max-h-[500px]">
                {filteredEntries.map((entry) => {
                  const isSelected = selectedEntry?.id === entry.id;
                  return (
                    <div
                      key={entry.id}
                      onClick={() => {
                        audioSystem.playChime(1000);
                        setSelectedEntry(entry);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 text-white'
                          : 'border-white/5 bg-black/30 text-slate-400 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-cyan-300 uppercase font-bold">
                          {entry.category.replace('_', ' ')}
                        </span>
                        <span className="text-[9px] text-slate-500">{entry.solDate}</span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-200 leading-snug line-clamp-1">
                        {entry.title}
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                        {entry.preview}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Entry Reader & Audio Player */}
              <div className="md:col-span-2 rounded-xl border border-white/10 bg-black/50 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto max-h-[500px]">
                {selectedEntry ? (
                  <div>
                    <div className="border-b border-white/10 pb-3 mb-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-cyan-400 font-bold uppercase">
                            {selectedEntry.category} •
                          </span>
                          <span className="text-[10px] text-slate-400">{selectedEntry.solDate}</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                          {selectedEntry.title}
                        </h3>
                        <p className="text-[11px] text-slate-400">Author: {selectedEntry.author}</p>
                      </div>

                      {/* Optional Audio Playback simulation */}
                      {(selectedEntry.category === 'audio_log' || selectedEntry.category === 'transmission') && (
                        <button
                          onClick={handlePlayLogAudio}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/20 text-cyan-300 text-xs font-bold hover:bg-cyan-500/35 transition-colors"
                        >
                          <Volume2 className="h-4 w-4" />
                          <span>PLAY AUDIO</span>
                        </button>
                      )}
                    </div>

                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-3 font-mono">
                      {selectedEntry.content}
                    </div>

                    {selectedEntry.coordinates && (
                      <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-sky-400 font-bold">
                        LANDMARK COORDINATES: [{selectedEntry.coordinates.join(', ')}]
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-slate-500">
                    Select an entry on the left to read telemetry transcript.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'decisions' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-slate-300">
                <p>
                  The following formal directives have been enacted by your expedition command. These choices dictate Outpost Alpha resource deployment, facility specialization, and ending eligibility.
                </p>
              </div>

              {Object.keys(playerDecisions).length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-slate-500">
                  No critical directives enacted yet. Directives trigger at pivotal chapter milestones.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(playerDecisions).map(([choiceId, optionId]) => {
                    const choice = CAMPAIGN_CHOICES[choiceId];
                    if (!choice) return null;
                    const option = choice.options.find((o) => o.id === optionId);
                    if (!option) return null;

                    return (
                      <div
                        key={choiceId}
                        className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-4"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] text-amber-400 font-bold">
                            CHAPTER {choice.chapterId} DIRECTIVE
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
                        </div>
                        <h5 className="text-xs font-bold text-white mb-1">{choice.title}</h5>
                        <p className="text-xs text-amber-200 font-bold mb-2">
                          Selection: {option.label}
                        </p>
                        <p className="text-[11px] text-slate-400">{option.consequencesSummary}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 bg-[#0A0F20] text-[11px] text-slate-500">
          <span>Press [J] or [ESC] to toggle journal.</span>
          <span>All telemetry persists in local save state.</span>
        </div>
      </div>
    </div>
  );
};
