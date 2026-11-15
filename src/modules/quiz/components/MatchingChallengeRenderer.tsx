import React, { useState, useEffect } from 'react';
import { MatchingPair, QuizQuestion } from '../types';
import { Link2, CheckCircle2, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import { quizAudio } from '../audio/quizAudio';

interface MatchingChallengeRendererProps {
  question?: QuizQuestion;
  matchingPairs?: MatchingPair[];
  selectedPairs?: Record<string, string>;
  onChangePairs?: (pairs: Record<string, string>) => void;
  isSubmitted: boolean;
  onCompleteMatching?: (isAllCorrect: boolean) => void;
  disabled?: boolean;
}

const PAIR_COLORS = [
  { border: 'border-cyan-400', bg: 'bg-cyan-500/20', text: 'text-cyan-300' },
  { border: 'border-amber-400', bg: 'bg-amber-500/20', text: 'text-amber-300' },
  { border: 'border-violet-400', bg: 'bg-violet-500/20', text: 'text-violet-300' },
  { border: 'border-emerald-400', bg: 'bg-emerald-500/20', text: 'text-emerald-300' },
];

export const MatchingChallengeRenderer: React.FC<MatchingChallengeRendererProps> = ({
  question,
  matchingPairs: propsPairs,
  selectedPairs,
  onChangePairs,
  isSubmitted,
  onCompleteMatching,
  disabled = false,
}) => {
  const effectivePairs: MatchingPair[] = propsPairs || question?.matchingPairs || [];
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [internalMatches, setInternalMatches] = useState<Record<string, string>>({}); // leftId -> rightText
  const [shuffledRights, setShuffledRights] = useState<{ id: string; text: string }[]>([]);

  const userMatches = selectedPairs || internalMatches;

  // Shuffle right items once so answers aren't parallel
  useEffect(() => {
    const rights = effectivePairs.map((p) => ({ id: p.id, text: p.rightText }));
    const shuffled = [...rights].sort((a, b) => a.text.localeCompare(b.text));
    setShuffledRights(shuffled);
    setInternalMatches({});
    setSelectedLeftId(null);
  }, [effectivePairs]);

  const updateMatches = (newMatches: Record<string, string>) => {
    setInternalMatches(newMatches);
    onChangePairs?.(newMatches);

    if (Object.keys(newMatches).length === effectivePairs.length) {
      const isAllCorrect = effectivePairs.every(
        (pair) => newMatches[pair.id] === pair.rightText
      );
      onCompleteMatching?.(isAllCorrect);
    }
  };

  const handleSelectLeft = (id: string) => {
    if (isSubmitted || disabled) return;
    quizAudio.playClick(840);
    setSelectedLeftId(id === selectedLeftId ? null : id);
  };

  const handleSelectRight = (targetRightText: string) => {
    if (isSubmitted || disabled) return;
    if (!selectedLeftId) return;

    // Remove targetRightText if already assigned elsewhere
    const updated = { ...userMatches };
    Object.keys(updated).forEach((k) => {
      if (updated[k] === targetRightText) {
        delete updated[k];
      }
    });

    updated[selectedLeftId] = targetRightText;
    quizAudio.playMatchSuccess();
    setSelectedLeftId(null);
    updateMatches(updated);
  };

  const handleResetMatches = () => {
    if (isSubmitted || disabled) return;
    updateMatches({});
    setSelectedLeftId(null);
    quizAudio.playClick();
  };

  const allMatched = Object.keys(userMatches).length === effectivePairs.length;

  return (
    <div className="flex flex-col gap-5">
      {/* Interactive Helper Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#070C1B]/80 border border-slate-800 font-mono text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-cyan-400" />
          <span>
            {isSubmitted
              ? 'Correlation Verification Telemetry'
              : allMatched
              ? 'All concept pairs linked! Review assignments or submit telemetry.'
              : selectedLeftId
              ? 'Select matching definition on the right'
              : 'Select a term on the left to begin correlation link'}
          </span>
        </div>

        {!isSubmitted && Object.keys(userMatches).length > 0 && (
          <button
            type="button"
            onClick={handleResetMatches}
            disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Links</span>
          </button>
        )}
      </div>

      {/* Dual Column Correlation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Scientific Concepts */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 px-1 font-bold">
            Concepts / Entities ({effectivePairs.length})
          </span>
          {effectivePairs.map((pair, idx) => {
            const isSelected = selectedLeftId === pair.id;
            const matchedRightText = userMatches[pair.id];
            const hasMatch = Boolean(matchedRightText);
            const isCorrect = isSubmitted && matchedRightText === pair.rightText;
            const isWrong = isSubmitted && hasMatch && matchedRightText !== pair.rightText;
            const colorTone = PAIR_COLORS[idx % PAIR_COLORS.length];

            return (
              <button
                key={pair.id}
                type="button"
                disabled={isSubmitted || disabled}
                onClick={() => handleSelectLeft(pair.id)}
                className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-500 bg-emerald-950/20 text-emerald-100'
                      : isWrong
                      ? 'border-rose-500 bg-rose-950/20 text-rose-100'
                      : 'border-slate-800 bg-[#070c1b]/50 text-slate-500'
                    : isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 text-white ring-2 ring-cyan-400/30'
                    : hasMatch
                    ? `${colorTone.border} ${colorTone.bg} text-white`
                    : 'border-slate-800 bg-[#070C1B]/80 text-slate-300 hover:border-slate-700 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center font-mono text-xs font-bold text-slate-300">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold">{pair.leftText}</span>
                </div>

                <div className="shrink-0">
                  {isSubmitted ? (
                    isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )
                  ) : hasMatch ? (
                    <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Definitions / Research Observations */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 px-1 font-bold">
            NASA Findings / Attributes
          </span>
          {shuffledRights.map((rightItem, rIdx) => {
            const assignedLeftId = Object.keys(userMatches).find(
              (k) => userMatches[k] === rightItem.text
            );
            const isAssigned = Boolean(assignedLeftId);
            const parentPairIndex = effectivePairs.findIndex((p) => p.id === assignedLeftId);
            const colorTone = parentPairIndex >= 0 ? PAIR_COLORS[parentPairIndex % PAIR_COLORS.length] : null;

            return (
              <button
                key={rIdx}
                type="button"
                disabled={isSubmitted || disabled}
                onClick={() => handleSelectRight(rightItem.text)}
                className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${
                  isSubmitted
                    ? isAssigned
                      ? effectivePairs.find((p) => p.id === assignedLeftId)?.rightText === rightItem.text
                        ? 'border-emerald-500 bg-emerald-950/20 text-emerald-100'
                        : 'border-rose-500 bg-rose-950/20 text-rose-100'
                      : 'border-slate-800 bg-[#070c1b]/50 text-slate-500'
                    : isAssigned && colorTone
                    ? `${colorTone.border} ${colorTone.bg} text-white`
                    : 'border-slate-800 bg-[#070C1B]/80 text-slate-300 hover:border-slate-700 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center font-mono text-xs font-bold text-slate-400">
                    {String.fromCharCode(65 + rIdx)}
                  </span>
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">
                    {rightItem.text}
                  </span>
                </div>

                {isAssigned && parentPairIndex >= 0 && (
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/40 border border-white/10 text-cyan-300 shrink-0">
                    Linked #{parentPairIndex + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
