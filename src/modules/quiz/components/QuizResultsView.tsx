import React, { useState } from 'react';
import {
  Trophy,
  Target,
  Zap,
  Sparkles,
  RotateCcw,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { QuestionSubmissionResult } from '../types';
import { CADET_FLIGHT_RANKS } from '../quizData';

interface QuizResultsViewProps {
  results: QuestionSubmissionResult[];
  categoryTitle: string;
  totalXpEarned: number;
  baseXp: number;
  streakBonusXp: number;
  speedBonusXp: number;
  maxStreak: number;
  isBlitz: boolean;
  unlockedAchievements?: string[];
  onPlayAgain: () => void;
  onRetestMistakes?: () => void;
  onReturnToLobby: () => void;
  onOpenLesson?: (lessonId: string) => void;
  onViewAnalytics?: () => void;
}

export const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  results,
  categoryTitle,
  totalXpEarned,
  baseXp,
  streakBonusXp,
  speedBonusXp,
  maxStreak,
  isBlitz,
  unlockedAchievements = [],
  onPlayAgain,
  onRetestMistakes,
  onReturnToLobby,
  onOpenLesson,
  onViewAnalytics,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'mistakes' | 'correct'>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const totalQuestions = results.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const accuracyPercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const mistakeCount = totalQuestions - correctCount;

  // Determine current flight rank tier
  const currentRank = CADET_FLIGHT_RANKS.slice()
    .reverse()
    .find((r: { minXp: number }) => totalXpEarned >= r.minXp) || CADET_FLIGHT_RANKS[0];

  const filteredResults = results.filter((r) => {
    if (filterMode === 'mistakes') return !r.isCorrect;
    if (filterMode === 'correct') return r.isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Flight Mission Evaluation Card */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0c152e] via-[#070c1b] to-[#040714] border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20 shrink-0">
              <Trophy className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">
                  Mission Complete • {isBlitz ? 'Blitz Arena' : 'Tournament'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {categoryTitle}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {accuracyPercent >= 80
                  ? 'Exemplary Trajectory'
                  : accuracyPercent >= 50
                  ? 'Mission Objectives Met'
                  : 'Telemetry Discrepancies Recorded'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
                Cadet Rank Standing: <span className="text-amber-300 font-semibold">{currentRank.title}</span> ({currentRank.callsign})
              </p>
            </div>
          </div>

          {/* Accuracy Radial Badge */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#050814]/80 border border-cyan-500/30 shrink-0 min-w-[140px]">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Accuracy
            </span>
            <span
              className={`text-4xl font-extrabold font-mono tracking-tight mt-0.5 ${
                accuracyPercent >= 80
                  ? 'text-emerald-400'
                  : accuracyPercent >= 50
                  ? 'text-cyan-400'
                  : 'text-rose-400'
              }`}
            >
              {accuracyPercent}%
            </span>
            <span className="text-[11px] font-mono text-slate-400 mt-1">
              {correctCount} / {totalQuestions} Correct
            </span>
          </div>
        </div>

        {/* Telemetry XP & Rewards Breakdown Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 py-6 border-b border-white/10">
          <div className="p-3.5 rounded-xl bg-[#070c1b]/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Base XP</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-100">
              +{baseXp}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070c1b]/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Streak Bonus</span>
            </div>
            <div className="text-xl font-bold font-mono text-amber-300">
              +{streakBonusXp} ({maxStreak}x)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070c1b]/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Speed & Accuracy</span>
            </div>
            <div className="text-xl font-bold font-mono text-emerald-300">
              +{speedBonusXp}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/40 to-blue-950/40 border border-cyan-500/40">
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 mb-1">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Total XP Awarded</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-cyan-300">
              +{totalXpEarned}
            </div>
          </div>
        </div>

        {/* Unlocked Badges Showcase if any */}
        {unlockedAchievements.length > 0 && (
          <div className="relative z-10 pt-5 flex items-center gap-3">
            <div className="text-xs font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Achievements Unlocked:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {unlockedAchievements.map((badgeId) => (
                <span
                  key={badgeId}
                  className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-mono flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {badgeId.replace(/-/g, ' ').toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onPlayAgain}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs sm:text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Challenge</span>
          </button>

          {mistakeCount > 0 && onRetestMistakes && (
            <button
              type="button"
              onClick={onRetestMistakes}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-mono text-xs sm:text-sm transition-colors"
            >
              <Target className="w-4 h-4 text-rose-400" />
              <span>Retest {mistakeCount} Mistakes</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {onViewAnalytics && (
            <button
              type="button"
              onClick={onViewAnalytics}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-mono text-xs sm:text-sm transition-colors"
            >
              <span>Cadet Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onReturnToLobby}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-mono text-xs sm:text-sm transition-colors"
          >
            <span>Return to Lobby</span>
          </button>
        </div>
      </div>

      {/* Interactive Review Drawer Section */}
      <div className="p-6 rounded-2xl bg-[#070c1b]/80 border border-slate-800 backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Scientific Flight Debrief & Mistake Review
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Inspect questions, correct answers, and real NASA scientific citations
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#050814] p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterMode === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({totalQuestions})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('mistakes')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterMode === 'mistakes'
                  ? 'bg-rose-500/20 text-rose-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Missed ({mistakeCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterMode === 'correct'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Correct ({correctCount})
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-3">
          {filteredResults.map((result, idx) => {
            const isExpanded = expandedIndex === idx;
            const q = result.question;

            return (
              <div
                key={q.id + idx}
                className={`rounded-xl border transition-all ${
                  result.isCorrect
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-rose-500/30 bg-rose-950/10'
                }`}
              >
                {/* Header row */}
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-white/[0.02] rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {result.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <div className="truncate">
                      <span className="text-xs font-mono text-slate-400 block truncate">
                        {q.topic} • {q.type}
                      </span>
                      <span className="text-sm font-semibold text-slate-100 truncate block">
                        {q.question}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                        result.isCorrect
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {result.isCorrect ? `+${result.xpEarned} XP` : 'Missed'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 space-y-3 border-t border-white/5 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-[#050814]/80 border border-slate-800/80 space-y-2">
                      <div className="text-slate-300 font-sans leading-relaxed">
                        <span className="text-cyan-400 font-semibold block mb-1">
                          NASA Analysis & Explanation:
                        </span>
                        {q.explanation}
                      </div>

                      {q.options && q.options[q.correctIndex] && (
                        <div className="pt-2 border-t border-white/10 text-emerald-300">
                          <span className="text-slate-400">Correct Answer: </span>
                          <span className="font-semibold">{q.options[q.correctIndex]}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Source:</span>
                        {q.sourceUrl ? (
                          <a
                            href={q.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-1"
                          >
                            <span>{q.source}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span>{q.source}</span>
                        )}
                      </div>

                      {q.relatedLessonId && onOpenLesson && (
                        <button
                          type="button"
                          onClick={() => onOpenLesson(q.relatedLessonId!)}
                          className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Study Related Lesson</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
