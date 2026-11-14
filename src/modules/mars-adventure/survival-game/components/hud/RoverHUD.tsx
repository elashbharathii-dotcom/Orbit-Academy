import React from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  Gauge,
  BatteryCharging,
  Compass,
  Activity,
  Zap,
} from 'lucide-react';

export const RoverHUD: React.FC = () => {
  const controlMode = useMarsGameStore((state) => state.settings.controlMode);
  const telemetry = useMarsGameStore((state) => state.roverTelemetry);
  const roverPos = useMarsGameStore((state) => state.roverPosition);

  if (controlMode !== 'driving_rover') return null;

  // Approximate heading angle for directional indicator
  const headingDeg = Math.round((Math.atan2(roverPos[0], roverPos[2]) * 180) / Math.PI + 180) % 360;

  return (
    <div className="pointer-events-none absolute bottom-5 inset-x-0 flex flex-col items-center gap-2 z-40 select-none font-mono">
      {/* Upper Status Banner */}
      <div className="flex items-center gap-3 rounded-full border border-cyan-500/30 bg-[#0A0F1D]/80 px-4 py-1 text-[10px] text-cyan-300 backdrop-blur-md shadow-lg">
        <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-bold tracking-widest uppercase">
          MARS ROVER EXPLORATION SYSTEM • ACTIVE TELEMETRY
        </span>
        <span className="text-slate-500">|</span>
        <span className="flex items-center gap-1 text-slate-300">
          <Activity className="h-3 w-3 text-cyan-400" /> 4-WHEEL ALL-TERRAIN DRIVE
        </span>
      </div>

      {/* Main Aerospace Cockpit Dashboard */}
      <div className="flex items-center gap-5 sm:gap-7 rounded-3xl border border-cyan-500/40 bg-[#0A0F1D]/90 px-6 py-3.5 backdrop-blur-xl shadow-[0_0_35px_rgba(6,182,212,0.2)]">
        {/* 1. Digital Speedometer & Curved Velocity Fill */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Gauge className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              GROUND VELOCITY
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white tracking-tight">
                {telemetry.speedKmH}
              </span>
              <span className="text-[11px] font-bold text-cyan-400">KM/H</span>
            </div>
            {/* Speed Bar (0 to 30 km/h) */}
            <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-sky-300 transition-all duration-150 rounded-full"
                style={{ width: `${Math.min(100, (telemetry.speedKmH / 30) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="h-10 w-[1px] bg-white/10" />

        {/* 2. Transmission Gear Selector */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
            GEAR
          </span>
          <div className="flex gap-1.5 text-xs font-bold">
            {(['R', 'N', 'D'] as const).map((g) => (
              <span
                key={g}
                className={`flex h-7 w-7 items-center justify-center rounded-xl transition-all ${
                  telemetry.gear === g
                    ? 'bg-cyan-400 text-black font-black shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                    : 'bg-white/5 text-slate-400'
                }`}
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        <div className="h-10 w-[1px] bg-white/10" />

        {/* 3. Solar Battery Accumulator */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <BatteryCharging className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              BATTERY PACK
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">
                {Math.round(telemetry.batteryPercent)}%
              </span>
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${telemetry.batteryPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="h-10 w-[1px] bg-white/10" />

        {/* 4. Small Compass Directional Indicator */}
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">HEADING</span>
            <span className="text-sm font-bold text-white">{headingDeg}°</span>
          </div>
        </div>

        <div className="h-10 w-[1px] bg-white/10" />

        {/* 5. Dismount Prompt */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-400 text-black text-xs font-black shadow-md">
            E
          </span>
          <span>Dismount Rover</span>
        </div>
      </div>
    </div>
  );
};
