import React from 'react';
import {
  SpacecraftFlightState,
  FlightControls,
  MissionDefinition,
  CameraViewMode,
} from '../types';
import { NavBallHUD } from './NavBallHUD';
import {
  Flame,
  Gauge,
  Radio,
  Compass,
} from 'lucide-react';

interface FlightInstrumentsOverlayProps {
  flightState: SpacecraftFlightState;
  flightControls: FlightControls;
  mission: MissionDefinition;
  cameraMode: CameraViewMode;
  onSetThrottle: (val: number) => void;
  onToggleIgnition: () => void;
  onToggleSas: () => void;
  onToggleGear: () => void;
  onToggleSolar: () => void;
  onToggleComms: () => void;
  onSetCameraMode: (mode: CameraViewMode) => void;
  onAbortMission: () => void;
}

export const FlightInstrumentsOverlay: React.FC<FlightInstrumentsOverlayProps> = ({
  flightState,
  flightControls,
  mission,
  cameraMode,
  onSetThrottle,
  onToggleIgnition,
  onToggleSas,
  onToggleGear,
  onToggleSolar,
  onToggleComms,
  onSetCameraMode,
  onAbortMission,
}) => {
  const fuelPercent = Math.round((flightState.fuelKg / flightState.maxFuelKg) * 100);
  const monopropPercent = Math.round((flightState.monopropKg / flightState.maxMonopropKg) * 100);

  const formatMET = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = Math.floor(totalSec % 60);
    return `T+${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none font-mono text-white z-20">
      {/* =================================================================== */}
      {/* 1. TOP AVIONICS STATUS BAR                                          */}
      {/* =================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Mission Identification Badge */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#070c1b]/80 border border-white/15 backdrop-blur-xl shadow-lg">
          <span className="text-xl p-1.5 rounded-xl bg-white/5 border border-white/10">
            {mission.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                {mission.badge}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                {flightState.flightPhase}
              </span>
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              {mission.title}
            </h2>
          </div>
        </div>

        {/* MET Clock & Telemetry Badges */}
        <div className="flex items-center gap-2">
          <div className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#070c1b]/80 border border-white/15 backdrop-blur-xl flex items-center gap-2">
            <span className="text-xs text-slate-400">MET:</span>
            <span className="text-sm font-bold text-cyan-300">
              {formatMET(flightState.elapsedSeconds)}
            </span>
          </div>

          <div className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#070c1b]/80 border border-white/15 backdrop-blur-xl flex items-center gap-2">
            <span className="text-xs text-slate-400">G-FORCE:</span>
            <span className={`text-sm font-bold ${flightState.gForce > 3.5 ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
              {flightState.gForce}G
            </span>
          </div>

          {/* Camera View Mode Selector */}
          <div className="flex items-center bg-[#050814]/90 p-1 rounded-xl border border-white/15 text-xs">
            {(['cockpit', 'chase', 'orbit-map'] as CameraViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onSetCameraMode(mode)}
                className={`px-2.5 py-1 rounded-lg transition-colors capitalize ${
                  cameraMode === mode
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Abort Flight Button */}
          <button
            type="button"
            onClick={onAbortMission}
            className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-xs font-bold text-rose-300 transition-colors"
          >
            Abort
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. CENTER MID-SECTION: PFD FLIGHT TAPES & OBJECTIVES CHECKLIST      */}
      {/* =================================================================== */}
      <div className="flex items-center justify-between pointer-events-none my-auto">
        {/* Left PFD Airspeed & Throttle Control Tape */}
        <div className="pointer-events-auto flex flex-col gap-2 p-3.5 rounded-2xl bg-[#070c1b]/70 border border-white/10 backdrop-blur-md max-w-[170px]">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-white/10 pb-1 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-cyan-400" />
            <span>Velocity Tape</span>
          </span>

          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">TOTAL SPD</span>
            <span className="text-xl font-bold text-cyan-300">
              {Math.round(Math.sqrt(flightState.velocity.x * flightState.velocity.x + flightState.velocity.y * flightState.velocity.y + flightState.velocity.z * flightState.velocity.z))} m/s
            </span>
          </div>

          <div className="flex flex-col border-t border-white/5 pt-1">
            <span className="text-[11px] text-slate-400">VERT SPD (VSI)</span>
            <span className={`text-sm font-bold ${flightState.verticalSpeedMs < -6 ? 'text-rose-400' : 'text-emerald-300'}`}>
              {flightState.verticalSpeedMs > 0 ? `+${flightState.verticalSpeedMs}` : flightState.verticalSpeedMs} m/s
            </span>
          </div>

          {flightState.dynamicPressureKPa > 0.5 && (
            <div className="flex flex-col border-t border-white/5 pt-1">
              <span className="text-[10px] text-amber-400">DYN PRESSURE</span>
              <span className="text-xs font-bold text-amber-300">
                {flightState.dynamicPressureKPa} kPa Q
              </span>
            </div>
          )}

          {/* Interactive Throttle Slider */}
          <div className="border-t border-white/10 pt-2 space-y-1">
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>THROTTLE</span>
              <span className="font-bold text-cyan-300">
                {Math.round(flightControls.throttle * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={flightControls.throttle}
              onChange={(e) => onSetThrottle(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />

            <div className="flex items-center gap-1 pt-1">
              <button
                type="button"
                onClick={onToggleIgnition}
                className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                  flightControls.engineIgnited
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {flightControls.engineIgnited ? 'IGNITED' : 'IGNITE'}
              </button>

              <button
                type="button"
                onClick={() => onSetThrottle(0)}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-slate-400 hover:text-white"
              >
                MECO
              </button>
            </div>
          </div>
        </div>

        {/* Right PFD Altitude & Orbital Telemetry Tape */}
        <div className="pointer-events-auto flex flex-col gap-2 p-3.5 rounded-2xl bg-[#070c1b]/70 border border-white/10 backdrop-blur-md max-w-[180px]">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-white/10 pb-1 flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>Altimeter Tape</span>
          </span>

          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">RADAR ALT (AGL)</span>
            <span className="text-xl font-bold text-cyan-300">
              {flightState.altitudeM >= 100000
                ? `${Math.round(flightState.altitudeM / 1000)} km`
                : `${Math.round(flightState.altitudeM)} m`}
            </span>
          </div>

          <div className="flex flex-col border-t border-white/5 pt-1">
            <span className="text-[10px] text-slate-400">APOAPSIS (Ap)</span>
            <span className="text-xs font-bold text-slate-200">
              {flightState.orbital.apoapsisKm} km
            </span>
          </div>

          <div className="flex flex-col border-t border-white/5 pt-1">
            <span className="text-[10px] text-slate-400">PERIAPSIS (Pe)</span>
            <span className="text-xs font-bold text-slate-200">
              {flightState.orbital.periapsisKm} km
            </span>
          </div>

          <div className="flex flex-col border-t border-white/5 pt-1">
            <span className="text-[10px] text-slate-400">ORBIT PERIOD</span>
            <span className="text-xs font-bold text-cyan-300">
              {flightState.orbital.orbitalPeriodMin} min
            </span>
          </div>

          {flightState.skinTempC > 150 && (
            <div className="flex flex-col border-t border-white/5 pt-1">
              <span className="text-[10px] text-rose-400">HEAT SHIELD</span>
              <span className="text-xs font-bold text-rose-300">
                {flightState.skinTempC}°C
              </span>
            </div>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. BOTTOM COCKPIT AVIONICS: NAVBALL, SUBSYSTEMS & FUEL GAUGES        */}
      {/* =================================================================== */}
      <div className="flex flex-col items-center gap-3 pointer-events-auto">
        {/* Centered Flight Director HUD Capsule */}
        <div className="flex flex-wrap items-center justify-center gap-4 p-3 rounded-3xl bg-[#070c1b]/85 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl">
          {/* Subsystem Toggles Left: SAS & Gear */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onToggleSas}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                flightControls.sasActive
                  ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'border-white/10 bg-white/5 text-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${flightControls.sasActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
              <span>SAS [T]</span>
            </button>

            <button
              type="button"
              onClick={onToggleGear}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                flightControls.gearDeployed
                  ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'border-white/10 bg-white/5 text-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${flightControls.gearDeployed ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <span>GEAR [G]</span>
            </button>
          </div>

          {/* Centered NavBall Sphere */}
          <NavBallHUD flightState={flightState} size={150} />

          {/* Subsystem Toggles Right: Solar & Comms */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onToggleSolar}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                flightControls.solarDeployed
                  ? 'border-amber-400 bg-amber-950/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'border-white/10 bg-white/5 text-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${flightControls.solarDeployed ? 'bg-amber-400' : 'bg-slate-600'}`} />
              <span>SOLAR [P]</span>
            </button>

            <button
              type="button"
              onClick={onToggleComms}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                flightControls.commsDeployed
                  ? 'border-purple-400 bg-purple-950/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                  : 'border-white/10 bg-white/5 text-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${flightControls.commsDeployed ? 'bg-purple-400' : 'bg-slate-600'}`} />
              <span>COMMS [C]</span>
            </button>
          </div>
        </div>

        {/* Propellant & Delta-v Fuel Bar Status */}
        <div className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-[#070c1b]/80 border border-white/10 backdrop-blur-md text-xs">
          {/* Main Propellant Gauge */}
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">FUEL:</span>
            <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-150 ${
                  fuelPercent > 30 ? 'bg-amber-400' : 'bg-rose-500 animate-pulse'
                }`}
                style={{ width: `${fuelPercent}%` }}
              />
            </div>
            <span className="font-bold text-amber-300">{fuelPercent}%</span>
          </div>

          {/* RCS Monopropellant Gauge */}
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">RCS:</span>
            <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-150"
                style={{ width: `${monopropPercent}%` }}
              />
            </div>
            <span className="font-bold text-cyan-300">{monopropPercent}%</span>
          </div>

          {/* Delta-V Remaining */}
          <div className="border-l border-white/10 pl-4 text-slate-300">
            <span className="text-slate-400">Δv REMAINING: </span>
            <span className="font-bold text-emerald-400">
              {flightState.deltaVRemainingMs} m/s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
