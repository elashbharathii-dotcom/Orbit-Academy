import React from 'react';
import {
  Compass,
  Gauge,
  Radio,
  ShieldAlert,
  ArrowRight,
  Award,
} from 'lucide-react';
import { QuizQuestion } from '../types';

interface MissionScenariosHubProps {
  scenarios: QuizQuestion[];
  onStartScenario: (scenario: QuizQuestion) => void;
  onReturnToLobby: () => void;
}

export const MissionScenariosHub: React.FC<MissionScenariosHubProps> = ({
  scenarios,
  onStartScenario,
  onReturnToLobby,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0c152e] via-[#070c1b] to-[#040714] border border-amber-500/30 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                <span>Flight Director Tactical Simulator</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              NASA Mission Operations & Crisis Scenarios
            </h1>
            <p className="text-sm text-slate-300 font-sans mt-1 max-w-2xl leading-relaxed">
              Step into the role of Mission Flight Director. Evaluate live orbital telemetry, NASA OSDR space biological data, and DONKI heliophysics alerts to execute critical aerospace commands.
            </p>
          </div>

          <button
            type="button"
            onClick={onReturnToLobby}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors shrink-0"
          >
            Back to Arena
          </button>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((scen, idx) => {
          const telemetry = scen.missionTelemetry || {
            spacecraft: 'EXPLORATION PROBE',
            velocityKmS: 'N/A',
            distanceKm: 'N/A',
            subsystemAlert: undefined,
          };

          return (
            <div
              key={scen.id}
              className="p-5 rounded-2xl bg-[#070c1b]/80 border border-slate-800 hover:border-amber-500/50 hover:bg-[#0c152e]/50 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-3">
                {/* Top Badge & Telemetry Bar */}
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/5">
                  <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <Compass className="w-3.5 h-3.5" />
                    <span>{telemetry.spacecraft}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                    Scenario 0{idx + 1}
                  </span>
                </div>

                {/* Subsystem Alert Pill */}
                {telemetry.subsystemAlert && (
                  <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center gap-2 text-[11px] font-mono text-amber-300">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{telemetry.subsystemAlert}</span>
                  </div>
                )}

                {/* Directive & Topic */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                    {scen.topic}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans mt-1 line-clamp-3 leading-relaxed">
                    {scen.missionDirective || scen.question}
                  </p>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{telemetry.velocityKmS}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    <span>+{scen.xpReward} XP</span>
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5 uppercase">
                  {scen.difficulty}
                </span>

                <button
                  type="button"
                  onClick={() => onStartScenario(scen)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-amber-500/20"
                >
                  <span>Authorize Protocol</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
