import React from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { Hand, Eye } from 'lucide-react';

export const InteractionPrompt: React.FC = () => {
  const targeted = useMarsGameStore((state) => state.targetedInteractable);

  if (!targeted) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-28 flex flex-col items-center justify-center gap-1.5 font-mono select-none animate-fade-in z-40">
      {/* Primary Interaction Pill */}
      <div className="flex items-center gap-2 rounded-2xl border border-amber-400/50 bg-[#0A0F1D]/90 px-4 py-2 text-xs font-bold text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.25)] backdrop-blur-md">
        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-amber-400 text-black text-[11px] font-black shadow-sm">
          E
        </span>
        <Hand className="h-4 w-4 text-amber-400" />
        <span>{targeted.promptText}</span>
      </div>

      {/* Secondary Substance Information Prompt if resource */}
      {targeted.resourceData && (
        <div className="flex items-center gap-1.5 rounded-xl border border-sky-400/30 bg-[#0A0F1D]/80 px-3 py-1 text-[11px] font-semibold text-sky-300 backdrop-blur-sm">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-sky-400 text-black text-[10px] font-bold">
            I
          </span>
          <Eye className="h-3 w-3 text-sky-400" />
          <span>Inspect Substance Details</span>
        </div>
      )}
    </div>
  );
};
