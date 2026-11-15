import React, { useState } from 'react';
import { VehicleStats } from '../types';
import { SpaceButton } from '../../../components/ui/SpaceButton';
import {
  Activity,
  Flame,
  Weight,
  Gauge,
  HelpCircle,
  Play,
  Square,
  ShieldCheck,
} from 'lucide-react';

interface TelemetryMatrixPanelProps {
  stats: VehicleStats;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onOpenMissionAssessment: () => void;
}

export const TelemetryMatrixPanel: React.FC<TelemetryMatrixPanelProps> = ({
  stats,
  isSimulating,
  onToggleSimulation,
  onOpenMissionAssessment,
}) => {
  const [showFormulaInfo, setShowFormulaInfo] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#F59E0B]" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            Engineering Telemetry Matrix
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowFormulaInfo(!showFormulaInfo)}
          title="Explain Aerospace Formulas"
          className="flex items-center gap-1 font-mono text-[10.5px] text-[#38BDF8] hover:underline"
        >
          <HelpCircle className="h-3 w-3" />
          <span>{showFormulaInfo ? 'Hide Physics' : 'Physics Formula'}</span>
        </button>
      </div>

      {/* Physics Formula Educational Popover */}
      {showFormulaInfo && (
        <div className="rounded-xl border border-[#38BDF8]/30 bg-[#071328]/95 p-3.5 font-mono text-[11px] text-[#CBD5E1] space-y-2 animate-fade-in shadow-lg">
          <div className="flex items-center gap-2 text-[#38BDF8] font-bold">
            <Gauge className="h-3.5 w-3.5" />
            <span>Tsiolkovsky Rocket Equation</span>
          </div>
          <p className="leading-relaxed">
            <span className="text-[#F59E0B] font-bold">Δv = Isp · g₀ · ln(m_wet / m_dry)</span>
          </p>
          <p className="text-[10px] text-[#94A3B8] leading-normal">
            Where <strong className="text-white">g₀ = 9.80665 m/s²</strong>, <strong className="text-white">m_wet</strong> is total launch mass with fuel, and <strong className="text-white">m_dry</strong> is empty structural mass. To reach Earth orbit, a vehicle typically requires at least <strong className="text-[#38BDF8]">9,200 m/s</strong> of delta-V.
          </p>
          <div className="border-t border-white/10 pt-1.5 text-[10px] text-[#94A3B8]">
            <strong className="text-white">Liftoff TWR = Total Thrust (kN) / Sea-Level Weight (kN)</strong>. A TWR &gt; 1.0 is required to leave the pad; 1.20–1.40 is optimal to minimize gravity losses.
          </div>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Metric 1: Delta-V */}
        <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="font-mono text-[10px] uppercase">Mission Delta-V</span>
            <Gauge className="h-3.5 w-3.5 text-[#F59E0B]" />
          </div>
          <span className="font-mono text-base sm:text-lg font-bold text-[#F59E0B] mt-1">
            {stats.deltaV.toLocaleString()}{' '}
            <span className="text-xs text-[#94A3B8] font-normal">m/s</span>
          </span>
        </div>

        {/* Metric 2: Liftoff TWR */}
        <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="font-mono text-[10px] uppercase">Liftoff TWR</span>
            <Flame className="h-3.5 w-3.5 text-[#38BDF8]" />
          </div>
          <span
            className={`font-mono text-base sm:text-lg font-bold mt-1 ${
              stats.isFlightReady ? 'text-[#34D399]' : 'text-amber-400'
            }`}
          >
            {stats.twr.toFixed(2)}{' '}
            <span className="text-[10px] font-normal text-[#94A3B8]">
              {stats.twr >= 1.2 ? '(GO)' : stats.twr >= 1.0 ? '(MARGINAL)' : '(NO-GO)'}
            </span>
          </span>
        </div>

        {/* Metric 3: Total Gross Mass */}
        <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="font-mono text-[10px] uppercase">Gross Mass</span>
            <Weight className="h-3.5 w-3.5 text-[#A78BFA]" />
          </div>
          <span className="font-mono text-xs sm:text-sm font-bold text-white mt-1">
            {(stats.totalGrossMass / 1000).toFixed(1)}{' '}
            <span className="text-[10px] text-[#94A3B8] font-normal">t</span> ({stats.totalGrossMass.toLocaleString()} kg)
          </span>
        </div>

        {/* Metric 4: Vacuum Thrust */}
        <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="font-mono text-[10px] uppercase">Total Thrust</span>
            <Flame className="h-3.5 w-3.5 text-[#F59E0B]" />
          </div>
          <span className="font-mono text-xs sm:text-sm font-bold text-[#F59E0B] mt-1">
            {stats.totalThrustKn.toLocaleString()}{' '}
            <span className="text-[10px] text-[#94A3B8] font-normal">kN</span>
          </span>
        </div>
      </div>

      {/* Secondary Detailed Breakdown Table */}
      <div className="rounded-xl border border-white/5 bg-[#070C1B]/80 p-3 font-mono text-[11px] space-y-2">
        <div className="flex justify-between items-center text-[#94A3B8] border-b border-white/5 pb-1">
          <span>Dry Structural Mass:</span>
          <span className="text-white font-bold">{stats.dryMass.toLocaleString()} kg</span>
        </div>

        <div className="flex justify-between items-center text-[#94A3B8] border-b border-white/5 pb-1">
          <span>Usable Cryo Propellant:</span>
          <span className="text-[#38BDF8] font-bold">{stats.propellantMass.toLocaleString()} kg</span>
        </div>

        <div className="flex justify-between items-center text-[#94A3B8] border-b border-white/5 pb-1">
          <span>Average Specific Impulse:</span>
          <span className="text-[#A78BFA] font-bold">{stats.weightedIsp} s</span>
        </div>

        <div className="flex justify-between items-center text-[#94A3B8] border-b border-white/5 pb-1">
          <span>Net Electrical Balance:</span>
          <span
            className={`font-bold ${
              stats.netPowerKw >= 0 ? 'text-[#34D399]' : 'text-red-400'
            }`}
          >
            {stats.netPowerKw >= 0 ? `+${stats.netPowerKw.toFixed(1)} kW` : `${stats.netPowerKw.toFixed(1)} kW`}
          </span>
        </div>

        <div className="flex justify-between items-center text-[#94A3B8]">
          <span>Flight Stability Index:</span>
          <span
            className={`font-bold ${
              stats.stabilityScore >= 80
                ? 'text-[#34D399]'
                : stats.stabilityScore >= 50
                ? 'text-amber-400'
                : 'text-red-400'
            }`}
          >
            {stats.stabilityScore}%
          </span>
        </div>
      </div>

      {/* Interactive Hot-Fire Test & Mission Assessment Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        <SpaceButton
          variant={isSimulating ? 'danger' : 'primary'}
          size="md"
          onClick={onToggleSimulation}
          icon={isSimulating ? Square : Play}
          data-testid="toggle-sim-btn"
          className="w-full justify-center"
        >
          {isSimulating ? 'Abort Static Hot-Fire Test' : 'Conduct Static Test Fire'}
        </SpaceButton>

        <SpaceButton
          variant="secondary"
          size="sm"
          onClick={onOpenMissionAssessment}
          icon={ShieldCheck}
          className="w-full justify-center text-xs"
        >
          Evaluate Mission Profiles
        </SpaceButton>
      </div>
    </div>
  );
};
