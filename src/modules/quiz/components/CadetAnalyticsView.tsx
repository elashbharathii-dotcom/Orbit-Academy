import React from 'react';
import {
  Trophy,
  Target,
  Zap,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CADET_FLIGHT_RANKS, QUIZ_CATEGORIES_METADATA } from '../quizData';
import { ACHIEVEMENTS_LIST } from '../../../services/studentProgressService';

interface CadetAnalyticsViewProps {
  totalXp: number;
  quizzesTaken: number;
  quizzesWon: number;
  correctAnswersCount: number;
  totalAnswersCount: number;
  maxStreak: number;
  unlockedAchievementIds: string[];
  subjectMastery: Record<string, number>;
  onReturnToLobby: () => void;
  onOpenLesson?: (destinationId: string) => void;
}

export const CadetAnalyticsView: React.FC<CadetAnalyticsViewProps> = ({
  totalXp,
  quizzesTaken,
  quizzesWon,
  correctAnswersCount,
  totalAnswersCount,
  maxStreak,
  unlockedAchievementIds,
  subjectMastery,
  onReturnToLobby,
  onOpenLesson,
}) => {
  const overallAccuracy = totalAnswersCount > 0 ? Math.round((correctAnswersCount / totalAnswersCount) * 100) : 0;

  // Determine current flight certification rank
  const currentRank = CADET_FLIGHT_RANKS.slice()
    .reverse()
    .find((r: { minXp: number }) => totalXp >= r.minXp) || CADET_FLIGHT_RANKS[0];

  const nextRank = CADET_FLIGHT_RANKS.find((r: { minXp: number }) => r.minXp > totalXp);
  const nextRankProgress = nextRank
    ? Math.min(100, Math.round(((totalXp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100))
    : 100;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0c152e] via-[#070c1b] to-[#040714] border border-cyan-500/30 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10 shrink-0">
              <ShieldCheck className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">
                  Cadet Flight Certification
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Callsign: {currentRank.callsign}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentRank.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1">
                {currentRank.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onReturnToLobby}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors shrink-0"
          >
            Back to Arena
          </button>
        </div>

        {/* Rank Progression Bar */}
        <div className="relative z-10 pt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              Current Rank Progress to {nextRank ? nextRank.title : 'Supreme Admiral'}
            </span>
            <span className="text-cyan-300 font-semibold">{nextRankProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${nextRankProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* High-Level Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#070c1b]/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Overall Accuracy</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {overallAccuracy}%
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">
            {correctAnswersCount} / {totalAnswersCount} items
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#070c1b]/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>Accumulated XP</span>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {totalXp}
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">
            Academic Score
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#070c1b]/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Arenas Won</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {quizzesWon} / {quizzesTaken}
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">
            Tournaments passed
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#070c1b]/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1">
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Maximum Streak</span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-300">
            {maxStreak}x
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">
            Consecutive correct
          </div>
        </div>
      </div>

      {/* 11-Discipline Mastery Breakdown */}
      <div className="p-6 rounded-2xl bg-[#070c1b]/80 border border-slate-800 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Space-Science Discipline Telemetry
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Mastery across all 11 scientific curriculum tracks
            </p>
          </div>
          <TrendingUp className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUIZ_CATEGORIES_METADATA.map((cat: { id: string; title: string; icon: string }) => {
            const mastery = subjectMastery[cat.id] ?? 25;

            return (
              <div
                key={cat.id}
                className="p-3.5 rounded-xl bg-[#050814]/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <span className="font-semibold text-slate-200">
                      {cat.title}
                    </span>
                  </div>
                  <span className="font-mono text-cyan-300 font-bold">
                    {mastery}%
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${mastery}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlocked Badges Showcase */}
      <div className="p-6 rounded-2xl bg-[#070c1b]/80 border border-slate-800 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Cadet Honor Badges & Achievements
            </h3>
            <p className="text-xs font-mono text-slate-400">
              {unlockedAchievementIds.length} of {ACHIEVEMENTS_LIST.length} unlocked
            </p>
          </div>
          <Award className="w-5 h-5 text-amber-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS_LIST.map((ach) => {
            const isUnlocked = unlockedAchievementIds.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-colors ${
                  isUnlocked
                    ? 'border-amber-500/40 bg-amber-950/20 text-slate-100'
                    : 'border-slate-800/60 bg-[#050814]/40 text-slate-500 opacity-60'
                }`}
              >
                <span className="text-2xl shrink-0">{ach.icon}</span>
                <div className="min-w-0">
                  <span className="text-xs font-bold block truncate text-slate-200">
                    {ach.title}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 block truncate">
                    {ach.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized Learning Recommendations */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#070c1b] to-purple-950/40 border border-blue-500/30 backdrop-blur-xl space-y-3">
        <div className="flex items-center gap-2 text-blue-300 text-xs font-mono uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Flight Director Recommendation</span>
        </div>
        <h4 className="text-base font-bold text-white">
          Reinforce Knowledge Checkpoints in the Learning Portal
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
          Based on your recent assessment telemetry, deep-dive into interactive 3D planetary models, NASA OSDR gene expression datasets, and DONKI space weather timelines.
        </p>
        {onOpenLesson && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onOpenLesson('solar-system')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold font-mono text-xs tracking-wider transition-all"
            >
              <span>Launch Learning Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
