import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { LauraCommsMessage, SpacecraftFlightState, MissionDefinition } from '../types';

interface LauraMissionControlHUDProps {
  currentMessage: LauraCommsMessage;
  flightState: SpacecraftFlightState;
  mission: MissionDefinition;
}

export const LauraMissionControlHUD: React.FC<LauraMissionControlHUDProps> = ({
  currentMessage,
  flightState,
  mission,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  let toneColor = 'border-cyan-500/40 bg-[#070c1b]/85 text-cyan-200';
  let badgeTone = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
  let icon = <Info className="w-4 h-4 text-cyan-400" />;

  if (currentMessage.tone === 'warning') {
    toneColor = 'border-rose-500/50 bg-[#1c0812]/90 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.25)]';
    badgeTone = 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
    icon = <AlertTriangle className="w-4 h-4 text-rose-400" />;
  } else if (currentMessage.tone === 'guidance') {
    toneColor = 'border-amber-500/40 bg-[#170e06]/90 text-amber-200';
    badgeTone = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    icon = <Sparkles className="w-4 h-4 text-amber-400" />;
  } else if (currentMessage.tone === 'congratulations') {
    toneColor = 'border-emerald-500/50 bg-[#061811]/90 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
    badgeTone = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  }

  return (
    <div
      className={`fixed top-20 right-4 z-30 max-w-sm w-full rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 font-mono ${toneColor}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-widest font-bold ${badgeTone}`}>
                {currentMessage.callsign}
              </span>
              <span className="text-[10px] text-slate-400">
                {currentMessage.timestamp}
              </span>
            </div>
            <span className="text-xs font-bold text-white tracking-wide block mt-0.5">
              Laura Flight Director • {mission.title}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Message Body */}
      {isExpanded && (
        <div className="p-3.5 space-y-2.5">
          <p className="text-xs leading-relaxed font-sans text-slate-100">
            "{currentMessage.message}"
          </p>

          {/* Real-time Flight Principle Context */}
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-300 space-y-1">
            <span className="text-cyan-400 font-bold block text-[10px] uppercase">
              Orbital Mechanics Directive:
            </span>
            <span className="font-sans leading-normal">
              {flightState.flightPhase === 'ascent' &&
                'Maintain prograde pitch-over at 45° to convert vertical launch energy into orbital tangential speed.'}
              {flightState.flightPhase === 'orbital' &&
                'Apoapsis burns raise periapsis. Prograde increases orbit diameter; retrograde drops orbital altitude.'}
              {flightState.flightPhase === 'approach' &&
                'Use RCS translation thrusters (I/K/J/L) to align centerline without changing main vehicle attitude.'}
              {flightState.flightPhase === 'descent' &&
                'Throttling counteracts gravity acceleration. Keep vertical speed under 3.5 m/s before touchdown.'}
              {flightState.flightPhase === 'landed' &&
                'Safe touchdown verified! Mission objectives and delta-v conservation rating calculated.'}
              {flightState.flightPhase === 'docked' &&
                'Hard latch capture confirmed! International Docking Adapter pressurized and locked.'}
              {flightState.flightPhase === 'crashed' &&
                'Structural limit exceeded on impact. Recalibrate descent profile or deploy landing gear.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
