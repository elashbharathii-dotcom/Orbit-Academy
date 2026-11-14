import React from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  Activity,
  Wind,
  Battery,
  Thermometer,
  ShieldAlert,
  Radio,
} from 'lucide-react';

export const VitalGauges: React.FC = () => {
  const vitals = useMarsGameStore((state) => state.vitals);
  const isInsideHab = useMarsGameStore((state) => state.isInsideHab);
  const solCycle = useMarsGameStore((state) => state.solCycle);

  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-[#0A0F1D]/85 p-3.5 backdrop-blur-xl shadow-2xl text-xs font-mono">
      {/* Habitat / Pressure Status */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isInsideHab ? 'bg-[#10B981] animate-pulse' : 'bg-[#EF4444]'
            }`}
          />
          <span className="font-bold tracking-wider text-slate-200">
            {isInsideHab ? 'HABITAT ALPHA [1.0 ATM]' : 'EVA SUIT [0.38 ATM]'}
          </span>
        </div>
        <span className="text-[10px] text-amber-400 font-semibold">
          {solCycle.surfaceTemp}°C
        </span>
      </div>

      {/* 1. Health Bar */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-red-400 font-bold">
            <Activity className="h-3.5 w-3.5" /> BIOMEDICAL
          </span>
          <span className="text-slate-300 font-semibold">{Math.round(vitals.health)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full transition-all duration-300 rounded-full bg-gradient-to-r from-red-600 to-emerald-500"
            style={{ width: `${vitals.health}%` }}
          />
        </div>
      </div>

      {/* 2. Oxygen Gauge */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-sky-400 font-bold">
            <Wind className="h-3.5 w-3.5" /> SUIT O2 TANK
          </span>
          <span
            className={`font-semibold ${
              vitals.oxygen < 20 ? 'text-red-400 animate-pulse font-bold' : 'text-slate-300'
            }`}
          >
            {Math.round(vitals.oxygen)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              vitals.oxygen < 20 ? 'bg-red-500 animate-pulse' : 'bg-sky-500'
            }`}
            style={{ width: `${vitals.oxygen}%` }}
          />
        </div>
      </div>

      {/* 3. Battery Power */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Battery className="h-3.5 w-3.5" /> SUIT BATTERY
          </span>
          <span className="text-slate-300 font-semibold">{Math.round(vitals.power)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full transition-all duration-300 rounded-full bg-amber-500"
            style={{ width: `${vitals.power}%` }}
          />
        </div>
      </div>

      {/* 4. Sub-vitals (Core Temp & Radiation) */}
      <div className="mt-1 grid grid-cols-2 gap-2 border-t border-white/10 pt-2 text-[10px]">
        <div className="flex items-center gap-1 text-slate-300">
          <Thermometer className="h-3 w-3 text-cyan-400" />
          <span>Core: {vitals.coreTemp.toFixed(1)}°C</span>
        </div>
        <div className="flex items-center gap-1 text-slate-300">
          <Radio className="h-3 w-3 text-emerald-400" />
          <span>Rad: {vitals.radiationDose.toFixed(2)} mSv</span>
        </div>
      </div>

      {/* 5. Suit Integrity */}
      <div className="flex items-center justify-between border-t border-white/5 pt-1 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldAlert className="h-3 w-3 text-slate-400" /> Hull Shielding
        </span>
        <span className="font-semibold text-slate-200">{Math.round(vitals.suitIntegrity)}%</span>
      </div>
    </div>
  );
};
