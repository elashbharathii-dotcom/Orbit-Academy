import React from 'react';
import { ArrowUp, ArrowDown, GripVertical, Check, AlertCircle } from 'lucide-react';
import { QuizQuestion, OrderingItem } from '../types';
import { quizAudio } from '../audio/quizAudio';

interface OrderingChallengeRendererProps {
  question: QuizQuestion;
  orderedItemIds: string[];
  onChangeOrder: (newOrderIds: string[]) => void;
  isSubmitted: boolean;
  disabled?: boolean;
}

export const OrderingChallengeRenderer: React.FC<OrderingChallengeRendererProps> = ({
  question,
  orderedItemIds,
  onChangeOrder,
  isSubmitted,
  disabled = false,
}) => {
  const itemsMap = React.useMemo(() => {
    const map = new Map<string, OrderingItem>();
    question.orderingItems?.forEach((item) => map.set(item.id, item));
    return map;
  }, [question.orderingItems]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (disabled || isSubmitted) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedItemIds.length) return;

    const newOrder = [...orderedItemIds];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    quizAudio.playSlide();
    onChangeOrder(newOrder);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-[#070c1b]/60 p-3 rounded-lg border border-slate-800">
        <span className="flex items-center gap-2 text-cyan-300">
          <GripVertical className="w-4 h-4" />
          Sequence Calibration: Arrange items from top to bottom
        </span>
        <span>{orderedItemIds.length} Sequence Steps</span>
      </div>

      <div className="space-y-2.5">
        {orderedItemIds.map((itemId, index) => {
          const item = itemsMap.get(itemId);
          if (!item) return null;

          const isFirst = index === 0;
          const isLast = index === orderedItemIds.length - 1;
          const isCorrectPosition = isSubmitted && item.correctOrder === index;
          const isWrongPosition = isSubmitted && item.correctOrder !== index;

          let cardStyle = 'border-slate-800 bg-[#070c1b]/70 text-slate-200 hover:border-slate-700';

          if (isSubmitted) {
            if (isCorrectPosition) {
              cardStyle = 'border-emerald-500/80 bg-emerald-950/30 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.2)]';
            } else if (isWrongPosition) {
              cardStyle = 'border-rose-500/80 bg-rose-950/30 text-rose-100 shadow-[0_0_12px_rgba(244,63,94,0.2)]';
            }
          }

          return (
            <div
              key={itemId}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all duration-200 ${cardStyle}`}
            >
              {/* Position Indicator Badge */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    isSubmitted
                      ? isCorrectPosition
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-rose-500 text-slate-950'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  {index + 1}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-wide text-slate-100">
                    {item.label}
                  </span>
                  {item.detail && (
                    <span className="text-xs text-slate-400 font-mono">
                      {item.detail}
                    </span>
                  )}
                </div>
              </div>

              {/* Status or Reorder Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                {isSubmitted ? (
                  isCorrectPosition ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                      <Check className="w-3.5 h-3.5" />
                      <span>Correct Step {index + 1}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-900/40 border border-rose-500/40 text-rose-300 text-xs font-mono">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Target: Step {item.correctOrder + 1}</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-1 bg-[#050814] p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      disabled={isFirst || disabled}
                      onClick={() => moveItem(index, 'up')}
                      title="Move Up"
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={isLast || disabled}
                      onClick={() => moveItem(index, 'down')}
                      title="Move Down"
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
