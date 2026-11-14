import React, { useEffect } from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { inputManager } from '../../systems/inputManager';
import {
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Compass,
  Keyboard,
} from 'lucide-react';

interface PauseModalProps {
  canvasContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export const PauseModal: React.FC<PauseModalProps> = ({ canvasContainerRef }) => {
  const isPauseModalOpen = useMarsGameStore((state) => state.isPauseModalOpen);
  const togglePauseModal = useMarsGameStore((state) => state.togglePauseModal);
  const restartGame = useMarsGameStore((state) => state.restartGame);
  const resetSaveData = useMarsGameStore((state) => state.resetSaveData);
  const settings = useMarsGameStore((state) => state.settings);
  const toggleSound = useMarsGameStore((state) => state.toggleSound);
  const solCycle = useMarsGameStore((state) => state.solCycle);

  const handleResume = () => {
    togglePauseModal(false);
    if (canvasContainerRef?.current) {
      inputManager.requestPointerLock(canvasContainerRef.current);
    }
  };

  useEffect(() => {
    if (isPauseModalOpen) {
      inputManager.setUIBlocking(true);
      inputManager.exitPointerLock();
    } else {
      inputManager.setUIBlocking(false);
    }
  }, [isPauseModalOpen]);

  if (!isPauseModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md font-mono select-none">
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl border border-red-500/30 bg-[#0A0F1D]/95 p-6 sm:p-8 shadow-[0_0_60px_rgba(239,68,68,0.25)] text-slate-100 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/15 text-red-400 border border-red-500/30">
              <Compass className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-red-400 uppercase">
                MISSION CONTROL SYSTEM
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                EXPEDITION PAUSED
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:text-white transition-colors"
              title="Toggle Audio Synthesizer"
            >
              {settings.soundEnabled ? (
                <Volume2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* Mission Status Bar */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-white/5 bg-[#11182E] p-3 text-center text-xs">
          <div>
            <span className="block text-[10px] text-slate-400">CURRENT SOL</span>
            <span className="font-bold text-amber-400">Sol {solCycle.solNumber}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400">LOCAL TIME</span>
            <span className="font-bold text-sky-400">
              {Math.floor(solCycle.timeOfDay).toString().padStart(2, '0')}:
              {Math.floor((solCycle.timeOfDay % 1) * 60).toString().padStart(2, '0')} LMST
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400">SURFACE TEMP</span>
            <span className="font-bold text-slate-200">{solCycle.surfaceTemp}°C</span>
          </div>
        </div>

        {/* CONTROLS GUIDE (AAA Specification) */}
        <div className="mt-5 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 border-b border-white/10 pb-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Keyboard className="h-4 w-4 text-sky-400" />
            <span>AAA Astronaut & Vehicle Controls Guide</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#11182E] px-3 py-2">
              <span className="text-slate-400">WASD</span>
              <span className="font-bold text-white">Move / Drive</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#11182E] px-3 py-2">
              <span className="text-slate-400">Mouse</span>
              <span className="font-bold text-white">Look Around (360°)</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#11182E] px-3 py-2">
              <span className="text-slate-400">Scroll Wheel</span>
              <span className="font-bold text-sky-400">Camera Zoom In / Out</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#11182E] px-3 py-2">
              <span className="text-slate-400">Space</span>
              <span className="font-bold text-white">Low-G Float Jump</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#11182E] px-3 py-2">
              <span className="text-slate-400">E</span>
              <span className="font-bold text-amber-400">Interact / Door / Rover</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#11182E] px-3 py-2">
              <span className="text-slate-400">MB1</span>
              <span className="font-bold text-white">Select / Inspect</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#11182E] px-3 py-2">
              <span className="text-slate-400">V</span>
              <span className="font-bold text-cyan-400">Resource Scanner</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#11182E] px-3 py-2">
              <span className="text-slate-400">I</span>
              <span className="font-bold text-emerald-400">Substance Information</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#11182E] px-3 py-2">
              <span className="text-slate-400">ESC</span>
              <span className="font-bold text-red-400">Pause / Release Mouse</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                restartGame();
                handleResume();
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 transition-all"
              title="Restart from Sol 1 keeping saved unlocks"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restart Sol</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Wipe all local save data (inventory, storage, and renovations) and start completely fresh?')) {
                  resetSaveData();
                  handleResume();
                }
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/15 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/25 transition-all"
              title="Wipe saved progress from localStorage"
            >
              <span>Wipe Save</span>
            </button>
          </div>

          <button
            onClick={handleResume}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Resume Mission [ESC]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
