import React from 'react';
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizDebriefCardProps {
  question: QuizQuestion;
  isCorrect: boolean;
  earnedXp: number;
  streakCount: number;
  isLastQuestion: boolean;
  onNext: () => void;
  onOpenLesson?: (lessonId: string) => void;
}

export const QuizDebriefCard: React.FC<QuizDebriefCardProps> = ({
  question,
  isCorrect,
  earnedXp,
  streakCount,
  isLastQuestion,
  onNext,
  onOpenLesson,
}) => {
  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 ${
        isCorrect
          ? 'bg-gradient-to-b from-emerald-950/40 to-[#070c1b]/90 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
          : 'bg-gradient-to-b from-rose-950/40 to-[#070c1b]/90 border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
      }`}
    >
      {/* Debrief Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {isCorrect ? (
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6 animate-pulse" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <XCircle className="w-6 h-6" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm md:text-base font-bold font-mono uppercase tracking-wider ${
                  isCorrect ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {isCorrect ? 'Telemetry Verified // Correct' : 'Scientific Anomaly // Discrepancy'}
              </span>
              {isCorrect && (
                <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-200">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  +{earnedXp} XP
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Topic: {question.topic} • Category: {question.category}
            </p>
          </div>
        </div>

        {/* Streak Indicator */}
        {streakCount > 1 && isCorrect && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-bounce" />
            <span>{streakCount}x Streak Multiplier</span>
          </div>
        )}
      </div>

      {/* Scientific Explanation Body */}
      <div className="py-4 space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
          Scientific Explanation & NASA Analysis:
        </div>
        <p className="text-sm md:text-base text-slate-200 leading-relaxed font-sans">
          {question.explanation}
        </p>

        {/* If question was missed and has standard options, remind the correct option */}
        {!isCorrect && question.options && question.options[question.correctIndex] && (
          <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs font-mono text-rose-200">
            <span className="font-semibold text-rose-300">Verified Correct Answer: </span>
            {question.options[question.correctIndex]}
          </div>
        )}
      </div>

      {/* Citations & Navigation Actions Footer */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        {/* Real NASA Citation */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-slate-500">Source:</span>
          {question.sourceUrl ? (
            <a
              href={question.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
            >
              <span>{question.source}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-slate-300">{question.source}</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {question.relatedLessonId && onOpenLesson && (
            <button
              type="button"
              onClick={() => onOpenLesson(question.relatedLessonId!)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Deepen in Lesson</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs md:text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{isLastQuestion ? 'Review Flight Report' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
