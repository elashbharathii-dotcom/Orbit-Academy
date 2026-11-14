import React from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { Skull, RotateCcw } from 'lucide-react';

export const GameOverModal: React.FC = () => {
  const isGameOver = useMarsGameStore((state) => state.isGameOver);
  const gameOverReason = useMarsGameStore((state) => state.gameOverReason);
  const restartGame = useMarsGameStore((state) => state.restartGame);

  if (!isGameOver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md font-mono">
      <div className="relative flex w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar flex-col items-center rounded-3xl border border-red-500/40 bg-[#1A0A0A]/95 p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.3)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 mb-4 animate-bounce">
          <Skull className="h-8 w-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-red-500">
          ASTRONAUT VITAL COLLAPSE
        </span>

        <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
          EXPEDITION TERMINATED
        </h2>

        <p className="mt-3 text-xs text-slate-300 leading-relaxed rounded-xl bg-black/40 border border-white/5 p-4">
          {gameOverReason || 'Life support systems ceased function in Jezero Crater.'}
        </p>

        <button
          onClick={restartGame}
          className="mt-6 flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-500 hover:scale-105 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Re-initialize Expedition</span>
        </button>
      </div>
    </div>
  );
};
