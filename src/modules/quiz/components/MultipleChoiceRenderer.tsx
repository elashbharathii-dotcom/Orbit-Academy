import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { QuizQuestion } from '../types';

interface MultipleChoiceRendererProps {
  question?: QuizQuestion;
  options?: string[];
  selectedOption: number | null;
  correctIndex?: number;
  isSubmitted: boolean;
  onSelectOption: (idx: number) => void;
  disabled?: boolean;
}

export const MultipleChoiceRenderer: React.FC<MultipleChoiceRendererProps> = ({
  question,
  options,
  selectedOption,
  correctIndex,
  isSubmitted,
  onSelectOption,
  disabled = false,
}) => {
  const effectiveOptions = options || question?.options || [];
  const effectiveCorrectIndex = correctIndex ?? question?.correctIndex ?? 0;

  return (
    <div className="flex flex-col gap-3">
      {effectiveOptions.map((option, idx) => {
        const letter = String.fromCharCode(65 + idx);
        const isSelected = selectedOption === idx;
        const isCorrect = isSubmitted && idx === effectiveCorrectIndex;
        const isWrong = isSubmitted && isSelected && idx !== effectiveCorrectIndex;

        return (
          <button
            key={idx}
            type="button"
            disabled={isSubmitted || disabled}
            onClick={() => onSelectOption(idx)}
            className={`group relative flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer disabled:cursor-default ${
              isCorrect
                ? 'border-[#34D399] bg-[#34D399]/20 text-white shadow-[0_0_16px_rgba(52,211,153,0.3)]'
                : isWrong
                ? 'border-rose-500 bg-rose-500/20 text-rose-200 shadow-[0_0_16px_rgba(244,63,94,0.3)]'
                : isSelected
                ? 'border-[#A78BFA] bg-[#A78BFA]/15 text-white shadow-[0_0_12px_rgba(167,139,250,0.25)]'
                : 'border-white/10 bg-[#0B1226]/70 text-[#CBD5E1] hover:border-white/25 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold transition-all ${
                  isCorrect
                    ? 'bg-[#34D399] text-[#030611]'
                    : isWrong
                    ? 'bg-rose-500 text-white'
                    : isSelected
                    ? 'bg-[#A78BFA] text-[#030611]'
                    : 'bg-white/10 text-[#94A3B8] group-hover:bg-white/20 group-hover:text-white'
                }`}
              >
                {letter}
              </span>
              <span className="text-sm sm:text-base font-medium">{option}</span>
            </div>

            <div className="shrink-0 ml-3">
              {isCorrect && (
                <div className="flex items-center gap-1.5 font-mono text-xs text-[#34D399] font-bold">
                  <CheckCircle2 className="h-5 w-5 text-[#34D399]" />
                  <span className="hidden sm:inline">CORRECT</span>
                </div>
              )}
              {isWrong && (
                <div className="flex items-center gap-1.5 font-mono text-xs text-rose-400 font-bold">
                  <XCircle className="h-5 w-5 text-rose-400" />
                  <span className="hidden sm:inline">INCORRECT</span>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
