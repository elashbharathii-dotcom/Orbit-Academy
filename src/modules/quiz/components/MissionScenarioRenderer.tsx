import React, { useEffect } from 'react';
import { AlertTriangle, Radio, Gauge, Compass, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { QuizQuestion } from '../types';

interface MissionScenarioRendererProps {
  question: QuizQuestion;
  selectedOption: number | null;
  isSubmitted: boolean;
  onSelectOption: (idx: number) => void;
  disabled?: boolean;
}

export const MissionScenarioRenderer: React.FC<MissionScenarioRendererProps> = ({
  question,
  selectedOption,
  isSubmitted,
  onSelectOption,
  disabled = false,
}) => {
  // Support numeric hotkeys 1-4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted || disabled) return;
      const key = parseInt(e.key, 10);
      if (key >= 1 && key <= question.options.length) {
        e.preventDefault();
        onSelectOption(key - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, disabled, onSelectOption, question.options.length]);

  const telemetry = question.missionTelemetry || {
    spacecraft: 'EXPLORATION PROBE',
    velocityKmS: 'N/A',
    distanceKm: 'N/A',
    subsystemAlert: undefined,
  };

  return (
    <div className="space-y-4">
      {/* Flight Director Telemetry HUD */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#070c1b] via-[#091024] to-[#070c1b] border border-amber-500/30 backdrop-blur-md relative overflow-hidden">
        {/* Subtle scanning line accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse" />

        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-500/20 text-xs font-mono">
          <div className="flex items-center gap-2 text-amber-300 font-semibold uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-pulse text-amber-400" />
            <span>Flight Director Telemetry Link // ACTIVE</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>CRAFT: {telemetry.spacecraft}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>V_REL: {telemetry.velocityKmS}</span>
            </span>
          </div>
        </div>

        {/* Subsystem Alert Banner if applicable */}
        {telemetry.subsystemAlert && (
          <div className="mt-3 p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/50 flex items-center gap-2.5 text-amber-200 text-xs font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span>{telemetry.subsystemAlert}</span>
          </div>
        )}

        {/* Mission Directive Briefing */}
        <div className="mt-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Mission Directive Brief</span>
          </div>
          <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed">
            {question.missionDirective || question.question}
          </p>
        </div>
      </div>

      {/* Decision Tree Options */}
      <div className="space-y-2.5">
        <div className="text-xs font-mono text-slate-400 flex items-center justify-between px-1">
          <span>Authorize Command Protocol:</span>
          <span>Hotkeys: 1 - {question.options.length}</span>
        </div>

        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === question.correctIndex;
          const optionLetter = String.fromCharCode(65 + idx);

          let buttonStyle = 'border-slate-800 bg-[#070c1b]/60 hover:bg-[#0c152e]/80 hover:border-slate-600 text-slate-200';

          if (isSubmitted) {
            if (isCorrect) {
              buttonStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.25)]';
            } else if (isSelected && !isCorrect) {
              buttonStyle = 'border-rose-500 bg-rose-950/40 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.25)]';
            } else {
              buttonStyle = 'border-slate-800 bg-[#050814]/40 text-slate-500 opacity-60';
            }
          } else if (isSelected) {
            buttonStyle = 'border-amber-400 bg-amber-950/40 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled || isSubmitted}
              onClick={() => onSelectOption(idx)}
              className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 group cursor-pointer disabled:cursor-default ${buttonStyle}`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                  isSubmitted
                    ? isCorrect
                      ? 'bg-emerald-500 text-slate-950'
                      : isSelected
                      ? 'bg-rose-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                    : isSelected
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                }`}
              >
                {optionLetter}
              </span>

              <div className="flex-1 min-w-0">
                <span className="text-sm md:text-base font-medium leading-snug block">
                  {option}
                </span>
              </div>

              {isSubmitted && (
                <div className="shrink-0 pt-0.5">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isSelected ? (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
