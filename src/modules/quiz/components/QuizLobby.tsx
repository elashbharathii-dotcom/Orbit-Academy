import React from 'react';
import {
  Trophy,
  Zap,
  Flame,
  Volume2,
  VolumeX,
  Target,
  Layers,
  Compass,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  QuizCategory,
  DifficultyTier,
  ArenaGameMode,
  DailyChallengeQuest,
} from '../types';
import {
  QUIZ_CATEGORIES_METADATA,
  CADET_FLIGHT_RANKS,
} from '../quizData';

interface QuizLobbyProps {
  selectedCategory: QuizCategory | 'all';
  selectedDifficulty: DifficultyTier;
  activeGameMode: ArenaGameMode;
  totalXp: number;
  streakCount: number;
  dailyQuests: DailyChallengeQuest[];
  subjectMastery: Record<string, number>;
  isMuted: boolean;
  onToggleMute: () => void;
  onSelectCategory: (cat: QuizCategory | 'all') => void;
  onSelectDifficulty: (diff: DifficultyTier) => void;
  onSelectGameMode: (mode: ArenaGameMode) => void;
  onStartTournament: (cat: QuizCategory | 'all', diff: DifficultyTier) => void;
  onStartBlitz: () => void;
  onOpenScenarios: () => void;
  onOpenAnalytics: () => void;
}

export const QuizLobby: React.FC<QuizLobbyProps> = ({
  selectedCategory,
  selectedDifficulty,
  activeGameMode,
  totalXp,
  streakCount,
  dailyQuests,
  subjectMastery,
  isMuted,
  onToggleMute,
  onSelectCategory,
  onSelectDifficulty,
  onSelectGameMode,
  onStartTournament,
  onStartBlitz,
  onOpenScenarios,
  onOpenAnalytics,
}) => {
  const currentRank = CADET_FLIGHT_RANKS.slice()
    .reverse()
    .find((r: { minXp: number }) => totalXp >= r.minXp) || CADET_FLIGHT_RANKS[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Arena Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0c152e] via-[#070c1b] to-[#040714] border border-cyan-500/30 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-xl shadow-cyan-500/20 shrink-0">
              <Trophy className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Orbit Academy Quiz Arena</span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Stage 08 Certified
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                NASA Science Arena & Gamified Assessment
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1">
                Cadet Standing: <span className="text-amber-300 font-semibold">{currentRank.title}</span> • Callsign: <span className="text-cyan-300">{currentRank.callsign}</span>
              </p>
            </div>
          </div>

          {/* Quick Stats & Audio Control */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{streakCount} Day Streak</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{totalXp} XP</span>
            </div>

            <button
              type="button"
              onClick={onToggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              )}
            </button>
          </div>
        </div>

        {/* Game Mode Navigation Tabs */}
        <div className="relative z-10 pt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-[#050814]/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => onSelectGameMode('tournament')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                activeGameMode === 'tournament'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Grand Tournament</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectGameMode('blitz');
                onStartBlitz();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                activeGameMode === 'blitz'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>60s Blitz Arena</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectGameMode('scenarios');
                onOpenScenarios();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                activeGameMode === 'scenarios'
                  ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Mission Scenarios</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectGameMode('analytics');
                onOpenAnalytics();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                activeGameMode === 'analytics'
                  ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Cadet Telemetry</span>
            </button>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 bg-[#050814]/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
            {(['Cadet', 'Commander', 'Astrophysicist'] as DifficultyTier[]).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => onSelectDifficulty(diff)}
                className={`px-3 py-1.5 rounded-xl transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-white/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Challenge Quests Widget */}
      <div className="p-5 rounded-2xl bg-[#070c1b]/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Daily Tactical Science Quests</span>
          </div>
          <span className="text-slate-400">Refreshes every 24h</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
          {dailyQuests.map((quest) => (
            <div
              key={quest.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${
                quest.isCompleted
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-100'
                  : 'border-slate-800 bg-[#050814]/60 text-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="font-bold text-slate-200">{quest.title}</span>
                  <span className="text-amber-400">+{quest.xpReward} XP</span>
                </div>
                <p className="text-xs text-slate-400 font-sans line-clamp-2">
                  {quest.description}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">
                  Prog: {quest.progress} / {quest.target}
                </span>
                {quest.isCompleted ? (
                  <span className="text-emerald-400 font-bold">Validated</span>
                ) : (
                  <span className="text-cyan-400">In Progress</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All-Discipline Grand Tournament Launch Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/50 via-[#0a1435] to-cyan-950/50 border border-cyan-500/40 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            All-Discipline Grand Tournament
          </span>
          <h2 className="text-xl font-bold text-white">
            10-Question Master Challenge Across All 11 Disciplines
          </h2>
          <p className="text-xs text-slate-300 font-sans max-w-xl">
            Covers Solar System Treks, NASA OSDR astrobiology, DONKI space weather telemetry, and Earth climate dynamics.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onStartTournament('all', selectedDifficulty)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold font-mono text-sm tracking-wider shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.03] active:scale-[0.98] shrink-0"
        >
          <span>Launch Grand Tournament</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 11 Quiz Curriculum Categories Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 text-xs font-mono text-slate-400">
          <span className="uppercase tracking-wider">Select Specific Discipline Track</span>
          <span>11 NASA Science Disciplines</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUIZ_CATEGORIES_METADATA.map((cat) => {
            const mastery = subjectMastery[cat.id] ?? 25;
            const isSelected = selectedCategory === (cat.id as QuizCategory | 'all');

            return (
              <div
                key={cat.id}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between group backdrop-blur-xl ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'border-slate-800 bg-[#070c1b]/80 hover:border-slate-700 hover:bg-[#0c152e]/60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                      {cat.questionCount}+ Questions
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-sans mt-1 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {/* Mastery Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Mastery</span>
                      <span className="text-cyan-300 font-bold">{mastery}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                        style={{ width: `${mastery}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Launch Button */}
                <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.id as QuizCategory | 'all');
                      onStartTournament(cat.id as QuizCategory, selectedDifficulty);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-mono text-xs font-semibold tracking-wider transition-all"
                  >
                    <span>Start Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
