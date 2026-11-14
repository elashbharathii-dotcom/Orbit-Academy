import React, { useEffect } from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  X,
  Atom,
  FlaskConical,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Pickaxe,
} from 'lucide-react';

export const SubstanceInfoModal: React.FC = () => {
  const isSubstanceModalOpen = useMarsGameStore((state) => state.isSubstanceModalOpen);
  const substance = useMarsGameStore((state) => state.selectedSubstance);
  const closeSubstanceModal = useMarsGameStore((state) => state.closeSubstanceModal);
  const gatherResource = useMarsGameStore((state) => state.gatherResource);

  // Close on ESC or I key
  useEffect(() => {
    if (!isSubstanceModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyI') {
        closeSubstanceModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubstanceModalOpen, closeSubstanceModal]);

  if (!isSubstanceModalOpen || !substance) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md font-mono select-none">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-sky-500/40 bg-[#0A0F1D]/95 p-6 sm:p-8 shadow-[0_0_50px_rgba(56,189,248,0.25)] text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
              <Atom className="h-6 w-6 animate-spin [animation-duration:12s]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400">
                JEZERO SURFACE SPECTRAL DOSSIER
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {substance.name}
              </h2>
            </div>
          </div>

          <button
            onClick={closeSubstanceModal}
            className="rounded-xl border border-white/10 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 flex flex-col gap-4 overflow-y-auto pr-1">
          {/* Key Classification Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/5 bg-[#11182E] p-3.5">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                Resource Category
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Layers className="h-3.5 w-3.5" />
                {substance.category}
              </span>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#11182E] p-3.5">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                Chemical Formula
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <FlaskConical className="h-3.5 w-3.5" />
                {substance.chemicalFormula}
              </span>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#11182E] p-3.5">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                Discovery Status
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {substance.discoveryStatus}
              </span>
            </div>
          </div>

          {/* Geological Description */}
          <div className="rounded-2xl border border-white/5 bg-[#11182E] p-4">
            <span className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Geological Context & Composition
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {substance.description}
            </p>
          </div>

          {/* Scientific Properties */}
          <div className="rounded-2xl border border-white/5 bg-[#11182E] p-4">
            <span className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Physical & Crystallographic Properties
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {substance.scientificProperties}
            </p>
          </div>

          {/* Mars Station Usefulness */}
          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-1.5">
              <Sparkles className="h-4 w-4" /> Potential Application in Mars Research Station
            </span>
            <p className="text-xs text-sky-200 leading-relaxed font-sans">
              {substance.marsStationUsefulness}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 text-xs">
            {substance.canBeCollected ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="h-4 w-4" /> Available for Sampling / Extraction
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-400 font-bold">
                <AlertCircle className="h-4 w-4" /> Deposit Depleted or Inactive
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {substance.canBeCollected && (
              <button
                onClick={() => {
                  gatherResource(substance.id);
                  closeSubstanceModal();
                }}
                className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400 transition-all hover:scale-105 active:scale-95"
              >
                <Pickaxe className="h-4 w-4" />
                <span>Extract Sample [E]</span>
              </button>
            )}

            <button
              onClick={closeSubstanceModal}
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Close [ESC / I]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
