import React from 'react';
import { MISSION_PROFILES } from '../buildData';
import { VehicleStats, AssembledComponent } from '../types';
import {
  X,
  Target,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

interface MissionReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: VehicleStats;
  components: AssembledComponent[];
}

export const MissionReadinessModal: React.FC<MissionReadinessModalProps> = ({
  isOpen,
  onClose,
  stats,
  components,
}) => {
  if (!isOpen) return null;

  const hasDeepSpaceComms = components.some((c) => c.defId === 'u-antenna-dish');
  const hasCrewOrProbe = components.some((c) => c.category === 'cockpit');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mission-readiness-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[#070C1B] p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#A78BFA]/40 bg-[#A78BFA]/10 text-[#A78BFA]">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="mission-readiness-title"
                className="font-sans text-lg sm:text-xl font-extrabold text-white"
              >
                Mission Reachability Certification
              </h2>
              <p className="font-mono text-xs text-[#94A3B8]">
                Flight Profile Flight Certification Matrix &amp; Trajectory Validation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close dialog"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#94A3B8] transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Current Vehicle Baseline Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 font-mono text-xs">
          <div>
            <span className="text-[#94A3B8] text-[10px] block">CURRENT DELTA-V</span>
            <span className="font-bold text-[#F59E0B] text-sm">
              {stats.deltaV.toLocaleString()} m/s
            </span>
          </div>
          <div>
            <span className="text-[#94A3B8] text-[10px] block">LIFTOFF TWR</span>
            <span
              className={`font-bold text-sm ${
                stats.isFlightReady ? 'text-[#34D399]' : 'text-amber-400'
              }`}
            >
              {stats.twr.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[#94A3B8] text-[10px] block">NET ELECTRICAL</span>
            <span
              className={`font-bold text-sm ${
                stats.netPowerKw >= 0 ? 'text-[#34D399]' : 'text-red-400'
              }`}
            >
              {stats.netPowerKw >= 0 ? `+${stats.netPowerKw.toFixed(1)} kW` : `${stats.netPowerKw.toFixed(1)} kW`}
            </span>
          </div>
          <div>
            <span className="text-[#94A3B8] text-[10px] block">DEEP-SPACE COMMS</span>
            <span
              className={`font-bold text-sm ${
                hasDeepSpaceComms ? 'text-[#34D399]' : 'text-[#94A3B8]'
              }`}
            >
              {hasDeepSpaceComms ? 'ONLINE' : 'UNMOUNTED'}
            </span>
          </div>
        </div>

        {/* Mission Profiles Cards */}
        <div className="space-y-3">
          {MISSION_PROFILES.map((profile) => {
            const hasDv = stats.deltaV >= profile.reqDeltaV;
            const hasTwr = stats.twr >= profile.reqTwr;
            const hasPower = stats.netPowerKw >= profile.minPower;
            const hasComms = !profile.requiresDeepSpaceComms || hasDeepSpaceComms;
            const hasCore = !profile.requiresCrewOrProbe || hasCrewOrProbe;

            const isGo = hasDv && hasTwr && hasPower && hasComms && hasCore;

            return (
              <div
                key={profile.id}
                className={`flex flex-col gap-3 rounded-xl border p-4 transition-all ${
                  isGo
                    ? 'border-[#34D399]/40 bg-[#34D399]/10'
                    : 'border-white/10 bg-[#070C1B]/90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm font-bold text-white">
                        {profile.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#A78BFA] bg-[#A78BFA]/10 px-2 py-0.5 rounded-full border border-[#A78BFA]/30">
                        {profile.destination}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-[#94A3B8] mt-1">
                      {profile.description}
                    </p>
                  </div>

                  {/* GO / NO-GO Badge */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase shrink-0 border ${
                      isGo
                        ? 'border-[#34D399]/50 bg-[#34D399]/20 text-[#34D399]'
                        : 'border-amber-400/40 bg-amber-400/10 text-amber-400'
                    }`}
                  >
                    {isGo ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>GO FOR MISSION</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4" />
                        <span>HOLD // CRITERIA UNMET</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Sub-Criteria Checklist */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 font-mono text-[11px]">
                  {/* Delta-V */}
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasDv ? 'text-[#34D399]' : 'text-red-400'
                    }`}
                  >
                    {hasDv ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span>
                      Δv ≥ {profile.reqDeltaV.toLocaleString()} m/s
                    </span>
                  </div>

                  {/* TWR */}
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasTwr ? 'text-[#34D399]' : 'text-red-400'
                    }`}
                  >
                    {hasTwr ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span>TWR ≥ {profile.reqTwr}</span>
                  </div>

                  {/* Power */}
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasPower ? 'text-[#34D399]' : 'text-red-400'
                    }`}
                  >
                    {hasPower ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span>Power ≥ {profile.minPower} kW</span>
                  </div>

                  {/* Comms */}
                  {profile.requiresDeepSpaceComms ? (
                    <div
                      className={`flex items-center gap-1.5 ${
                        hasComms ? 'text-[#34D399]' : 'text-red-400'
                      }`}
                    >
                      {hasComms ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 shrink-0" />
                      )}
                      <span>Deep Comms Dish</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[#34D399]">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>Comms Ready</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-1.5 font-sans text-xs font-semibold text-white hover:bg-white/10"
          >
            Close Assessment
          </button>
        </div>
      </div>
    </div>
  );
};
