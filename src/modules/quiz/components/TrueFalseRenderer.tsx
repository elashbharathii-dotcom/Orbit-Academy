import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { QuizQuestion } from '../types';

interface TrueFalseRendererProps {
  question: QuizQuestion;
  selectedOption: number | null;
  isSubmitted: boolean;
  onSelectOption: (idx: number) => void;
  disabled?: boolean;
}

export const TrueFalseRenderer: React.FC<TrueFalseRendererProps> = ({
  question,
  selectedOption,
  isSubmitted,
  onSelectOption,
  disabled = false,
}) => {
  // Support keyboard hotkeys: 'T' / '1' for True, 'F' / '2' for False
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted || disabled) return;
      const key = e.key.toUpperCase();
      if (key === 'T' || key === '1') {
        e.preventDefault();
        onSelectOption(0);
      } else if (key === 'F' || key === '2') {
        e.preventDefault();
        onSelectOption(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, disabled, onSelectOption]);

  const options = question.options && question.options.length === 2
    ? question.options
    : ['True', 'False'];

  return (
    <div className="space-y-4">
      {/* Hypothesis Statement Box */}
      <div className="p-4 rounded-xl bg-[#070c1b]/80 border border-cyan-500/20 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-300">
            Scientific Hypothesis Evaluation
          </span>
        </div>
        <p className="text-base md:text-lg text-slate-100 font-medium leading-relaxed">
          "{question.question}"
        </p>
        {question.subtitle && (
          <p className="mt-2 text-xs text-slate-400 font-mono">
            Context: {question.subtitle}
          </p>
        )}
      </div>

      {/* Dual Tactical Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === question.correctIndex;
          const isTrueButton = idx === 0;

          let cardStyle = 'border-slate-700/60 bg-[#070c1b]/60 hover:bg-[#0c152e]/80 hover:border-slate-500 text-slate-200';
          let icon = isTrueButton ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-400" />
          );

          if (isSubmitted) {
            if (isCorrect) {
              cardStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.25)]';
              icon = <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-pulse" />;
            } else if (isSelected && !isCorrect) {
              cardStyle = 'border-rose-500 bg-rose-950/40 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.25)]';
              icon = <XCircle className="w-6 h-6 text-rose-400" />;
            } else {
              cardStyle = 'border-slate-800 bg-[#050814]/40 text-slate-500 opacity-50';
            }
          } else if (isSelected) {
            cardStyle = 'border-cyan-400 bg-cyan-950/40 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled || isSubmitted}
              onClick={() => onSelectOption(idx)}
              className={`relative p-5 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-200 text-center select-none group cursor-pointer disabled:cursor-default ${cardStyle}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                  [{isTrueButton ? 'T' : 'F'}]
                </span>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 group-hover:text-cyan-300">
                  {isTrueButton ? 'Affirmative' : 'Negative'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {icon}
                <span className="text-xl md:text-2xl font-bold tracking-wide">
                  {option}
                </span>
              </div>

              {isSubmitted && isCorrect && (
                <span className="text-[11px] font-mono font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-900/40 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  Validated Fact
                </span>
              )}

              {isSubmitted && isSelected && !isCorrect && (
                <span className="text-[11px] font-mono font-semibold tracking-wider text-rose-400 uppercase bg-rose-900/40 px-2.5 py-0.5 rounded-full border border-rose-500/40">
                  Scientific Misconception
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
