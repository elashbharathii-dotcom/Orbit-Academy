import React from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { X, CheckCircle2, Circle, Award, Compass } from 'lucide-react';

interface MissionLogModalProps {
  onClose: () => void;
}

export const MissionLogModal: React.FC<MissionLogModalProps> = ({ onClose }) => {
  const objectives = useMarsGameStore((state) => state.objectives);
  const solCycle = useMarsGameStore((state) => state.solCycle);

  const completedCount = objectives.filter((o) => o.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[88vh] w-full max-w-xl flex-col rounded-3xl border border-white/10 bg-[#0A0F1D]/95 p-6 shadow-2xl font-mono text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold tracking-wider text-white">
              MISSION TELEMETRY & SOL LOG
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sol Status Card */}
        <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
          <div>
            <span className="block text-[10px] text-slate-400">MISSION SOL</span>
            <span className="text-lg font-bold text-amber-400">Sol {solCycle.solNumber}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400">MARS LOCAL TIME</span>
            <span className="text-lg font-bold text-sky-400">
              {Math.floor(solCycle.timeOfDay).toString().padStart(2, '0')}:
              {Math.floor((solCycle.timeOfDay % 1) * 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400">OBJECTIVES</span>
            <span className="text-lg font-bold text-emerald-400">
              {completedCount} / {objectives.length}
            </span>
          </div>
        </div>

        {/* Objectives List */}
        <div className="mt-4 flex flex-col gap-2.5 overflow-y-auto pr-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Survival Protocols & Field Operations:
          </span>

          {objectives.map((obj) => (
            <div
              key={obj.id}
              className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
                obj.completed
                  ? 'border-emerald-500/30 bg-emerald-500/10'
                  : 'border-white/5 bg-[#11182E]'
              }`}
            >
              <div className="mt-0.5">
                {obj.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-500" />
                )}
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-xs font-bold ${
                    obj.completed ? 'text-emerald-300 line-through' : 'text-slate-100'
                  }`}
                >
                  {obj.title}
                </span>
                <p className="mt-0.5 text-[11px] text-slate-400 leading-relaxed">
                  {obj.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Scientific Context Footer */}
        <div className="mt-4 rounded-xl border border-white/5 bg-[#05070D] p-3 text-[10px] text-slate-400 flex items-center gap-3">
          <Compass className="h-6 w-6 text-sky-400 shrink-0" />
          <span>
            Jezero Crater is a 45-km-wide impact crater featuring an ancient river delta that preserved clays and carbonate deposits from ~3.7 billion years ago.
          </span>
        </div>
      </div>
    </div>
  );
};
