import React from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';
import { MissionDebriefStats } from '../types';

interface FlightDebriefModalProps {
  stats: MissionDebriefStats;
  onRetry: () => void;
  onNextMission?: () => void;
  onReturnToLobby: () => void;
}

export const FlightDebriefModal: React.FC<FlightDebriefModalProps> = ({
  stats,
  onRetry,
  onNextMission,
  onReturnToLobby,
}) => {
  const isSuccess = stats.isSuccess;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn font-mono text-white">
      <div
        className={`relative w-full max-w-xl p-6 sm:p-8 rounded-3xl border backdrop-blur-2xl shadow-2xl overflow-hidden ${
          isSuccess
            ? 'bg-gradient-to-b from-[#0c1d35] via-[#070c1b] to-[#040714] border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.2)]'
            : 'bg-gradient-to-b from-[#240810] via-[#070c1b] to-[#040714] border-rose-500/40 shadow-[0_0_50px_rgba(244,63,94,0.2)]'
        }`}
      >
        {/* Glow Ambient Accent */}
        <div
          className={`absolute top-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
            isSuccess ? 'bg-cyan-500/15' : 'bg-rose-500/15'
          }`}
        />

        {/* 1. Debrief Header */}
        <div className="relative z-10 flex flex-col items-center text-center pb-5 border-b border-white/10">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-lg ${
              isSuccess
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-9 h-9 animate-pulse" />
            ) : (
              <XCircle className="w-9 h-9" />
            )}
          </div>

          <span
            className={`text-xs uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border mb-1 ${
              isSuccess
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            {isSuccess ? 'Mission Accomplished' : 'Flight Anomaly Recorded'}
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            {stats.missionTitle}
          </h2>

          {stats.failureReason && (
            <p className="mt-1 text-xs text-rose-300 font-sans">
              Cause: {stats.failureReason}
            </p>
          )}

          {/* Star Rating Showcase */}
          {isSuccess && (
            <div className="flex items-center gap-2 mt-3">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-7 h-7 transition-all duration-300 ${
                    starIdx <= stats.starRating
                      ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_8px_#f59e0b]'
                      : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 2. Flight Telemetry Metrics Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-5 border-b border-white/10 text-xs">
          <div className="p-3 rounded-xl bg-[#070c1b]/80 border border-white/5">
            <span className="text-[10px] text-slate-400 block">MET FLIGHT TIME</span>
            <span className="text-sm font-bold text-cyan-300 mt-0.5 block">
              {Math.floor(stats.elapsedSeconds / 60)}m {Math.floor(stats.elapsedSeconds % 60)}s
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#070c1b]/80 border border-white/5">
            <span className="text-[10px] text-slate-400 block">Δv CONSUMED</span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              {Math.round(stats.deltaVExpendedMs)} m/s
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#070c1b]/80 border border-white/5">
            <span className="text-[10px] text-slate-400 block">FUEL REMAINING</span>
            <span className="text-sm font-bold text-amber-300 mt-0.5 block">
              {stats.fuelRemainingPercent}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-950/40 to-blue-950/40 border border-cyan-500/40">
            <span className="text-[10px] text-cyan-300 block">XP AWARDED</span>
            <span className="text-base font-extrabold text-cyan-300 mt-0.5 block">
              +{stats.scoreXp} XP
            </span>
          </div>
        </div>

        {/* Unlocked Achievements if any */}
        {stats.achievementsUnlocked && stats.achievementsUnlocked.length > 0 && (
          <div className="relative z-10 pt-4 pb-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-amber-300 uppercase tracking-wider font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Achievements Unlocked:
            </span>
            {stats.achievementsUnlocked.map((badgeId) => (
              <span
                key={badgeId}
                className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 text-[11px] flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                {badgeId.replace(/-/g, ' ').toUpperCase()}
              </span>
            ))}
          </div>
        )}

        {/* 3. Navigation CTA Buttons */}
        <div className="relative z-10 pt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-Fly Mission</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReturnToLobby}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors"
            >
              Mission Catalog
            </button>

            {isSuccess && onNextMission && (
              <button
                type="button"
                onClick={onNextMission}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wider shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Next Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
