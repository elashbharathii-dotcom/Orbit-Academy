import React from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { BasePowerGrid } from '../../types/survivalTypes';
import {
  Zap,
  Sun,
  BatteryCharging,
  BatteryWarning,
  ShieldCheck,
  ShieldAlert,
  X,
  Wind,
  Power,
  RefreshCw,
} from 'lucide-react';

interface CircuitConfig {
  key: keyof BasePowerGrid['facilityCircuits'];
  name: string;
  loadKW: number;
  priority: string;
  desc: string;
}

const CIRCUITS: CircuitConfig[] = [
  {
    key: 'life_support',
    name: 'Life Support & Climate Control',
    loadKW: 3.0,
    priority: 'PRIORITY 1 (CRITICAL)',
    desc: 'Maintains 1.0 ATM habitat pressure, 21°C thermal regulation, and continuous oxygen electrolysis.',
  },
  {
    key: 'living_quarters',
    name: 'Crew Living Quarters & Sleep Pods',
    loadKW: 1.5,
    priority: 'PRIORITY 2 (HIGH)',
    desc: 'Powers crew bunk circadian lighting, acoustic isolation, and crew physiological monitoring.',
  },
  {
    key: 'greenhouse',
    name: 'Hydroponic & Aeroponic Bio-Dome',
    loadKW: 2.5,
    priority: 'PRIORITY 3 (MEDIUM)',
    desc: 'Energizes UV LED horticultural arrays and automated nutrient mist pumps for potato cultivation.',
  },
  {
    key: 'engineering_workshop',
    name: 'Engineering Workshop & Fabricators',
    loadKW: 2.0,
    priority: 'PRIORITY 4 (MODERATE)',
    desc: 'Supplies power to the molecular sintering fabricator and scrap shredder recycling stations.',
  },
  {
    key: 'comm_room',
    name: 'Comms Radar & Telemetry Dish',
    loadKW: 1.5,
    priority: 'PRIORITY 5 (STANDARD)',
    desc: 'Operates 360° roof tracking dish and high-bandwidth laser uplink to Earth Mission Control.',
  },
];

export const PowerGridModal: React.FC = () => {
  const isOpen = useMarsGameStore((state) => state.isPowerGridModalOpen);
  const close = useMarsGameStore((state) => state.closePowerGridModal);
  const powerGrid = useMarsGameStore((state) => state.powerGrid);
  const toggleCircuit = useMarsGameStore((state) => state.toggleFacilityCircuit);
  const refillSuitOxygen = useMarsGameStore((state) => state.refillSuitOxygen);
  const solCycle = useMarsGameStore((state) => state.solCycle);
  const vitals = useMarsGameStore((state) => state.vitals);

  if (!isOpen) return null;

  const netKW = Math.round((powerGrid.solarOutputKW - powerGrid.totalConsumptionKW) * 10) / 10;
  const isCharging = netKW > 0;
  const batteryPct = Math.round((powerGrid.batteryStorageKWh / powerGrid.maxBatteryKWh) * 100);

  // Time estimate
  let estimateText = 'Balanced load';
  if (isCharging) {
    const neededKWh = powerGrid.maxBatteryKWh - powerGrid.batteryStorageKWh;
    if (neededKWh <= 0.1) {
      estimateText = 'Full capacity reached';
    } else {
      const hours = neededKWh / netKW;
      const mins = Math.round(hours * 60);
      estimateText = `Full in ~${mins} mins`;
    }
  } else if (netKW < 0) {
    const hours = powerGrid.batteryStorageKWh / Math.abs(netKW);
    const mins = Math.round(hours * 60);
    estimateText = `Depleted in ~${mins} mins`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md select-none font-mono">
      <div className="relative flex flex-col max-h-[90vh] w-full max-w-3xl rounded-3xl border border-cyan-500/30 bg-[#0A0F1D]/95 p-6 shadow-[0_0_50px_rgba(0,240,255,0.15)] text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-300">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wider text-cyan-400">
                OUTPOST ALPHA — POWER GRID TELEMETRY
              </h2>
              <p className="text-xs text-slate-400">
                Photovoltaic generation, auxiliary storage & circuit breaker distribution
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Blackout Alert Banner */}
        {powerGrid.isBlackout && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-red-500/50 bg-red-950/60 p-3.5 text-xs text-red-200 animate-pulse">
            <BatteryWarning className="h-6 w-6 text-red-400 shrink-0" />
            <div>
              <span className="font-extrabold text-red-300">GRID BLACKOUT ACTIVE:</span> Auxiliary storage battery is depleted. Non-essential and critical systems offline until solar irradiance resumes or loads are reduced.
            </div>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="mt-4 flex flex-col gap-5 overflow-y-auto pr-1">
          {/* Main Gauges: Battery, Solar, Consumption */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Battery Gauge */}
            <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                  {isCharging ? (
                    <BatteryCharging className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <BatteryWarning className="h-4 w-4 text-amber-400" />
                  )}
                  AUX BATTERY
                </span>
                <span
                  className={`font-black text-sm ${
                    batteryPct <= 15 ? 'text-red-400 animate-pulse' : 'text-slate-100'
                  }`}
                >
                  {batteryPct}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    batteryPct <= 15
                      ? 'bg-red-500 animate-pulse'
                      : batteryPct <= 40
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${batteryPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{powerGrid.batteryStorageKWh.toFixed(1)} / {powerGrid.maxBatteryKWh} kWh</span>
                <span className={isCharging ? 'text-emerald-400' : 'text-amber-400'}>
                  {netKW >= 0 ? `+${netKW}` : netKW} kW
                </span>
              </div>
              <div className="text-[10px] text-slate-500 italic text-right">
                {estimateText}
              </div>
            </div>

            {/* 2. Solar PV Output */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Sun className="h-4 w-4" /> SOLAR ARRAY
                </span>
                <span className="text-[10px] text-slate-400">PEAK 14 kW</span>
              </div>
              <div className="my-1 text-2xl font-black text-amber-400">
                {powerGrid.solarOutputKW.toFixed(1)} <span className="text-xs text-slate-300 font-normal">kW</span>
              </div>
              <div className="text-[11px] text-slate-400 flex flex-col gap-0.5">
                <div className="flex justify-between">
                  <span>Irradiance:</span>
                  <span className="text-slate-200">{solCycle.solarIrradiance} W/m²</span>
                </div>
                <div className="flex justify-between">
                  <span>Dust Storm Loss:</span>
                  <span className="text-red-300">
                    -{Math.round(solCycle.dustStormIntensity * 75)}%
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Base Active Load */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <Power className="h-4 w-4" /> ACTIVE LOAD
                </span>
                <span className="text-[10px] text-slate-400">MAX 10.5 kW</span>
              </div>
              <div className="my-1 text-2xl font-black text-cyan-400">
                {powerGrid.totalConsumptionKW.toFixed(1)} <span className="text-xs text-slate-300 font-normal">kW</span>
              </div>
              <div className="text-[11px] text-slate-400 flex flex-col gap-0.5">
                <div className="flex justify-between">
                  <span>Hab Temp:</span>
                  <span className="text-slate-200">{vitals.habTemp}°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Flow:</span>
                  <span className={netKW >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {netKW >= 0 ? `+${netKW}` : netKW} kW
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Circuit Breakers Table */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-cyan-400" /> FACILITY CIRCUIT BREAKERS
              </span>
              <span className="text-[10px] text-slate-400">
                Click switches to shed loads during dust storms or nightfall
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {CIRCUITS.map((cir) => {
                const isEnabled = powerGrid.facilityCircuits[cir.key];
                return (
                  <div
                    key={cir.key}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all ${
                      isEnabled
                        ? 'border-cyan-500/30 bg-cyan-950/20'
                        : 'border-white/5 bg-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100">{cir.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-black/40 text-slate-400">
                          {cir.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 max-w-xl">{cir.desc}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-cyan-300">{cir.loadKW.toFixed(1)} kW</div>
                        <div className="text-[10px] text-slate-500">
                          {isEnabled ? 'Draw nominal' : 'Load shed'}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleCircuit(cir.key)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          isEnabled
                            ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            : 'border border-red-500/40 bg-red-500/20 text-red-300 hover:bg-red-500/30'
                        }`}
                      >
                        {isEnabled ? (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>ON</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="h-3.5 w-3.5" />
                            <span>OFF</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Habitat Services */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-400/10 text-sky-300">
                <Wind className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100">Suit Oxygen Refill Station</div>
                <div className="text-[10px] text-slate-400">
                  Connect EVA suit umbilical to Outpost Alpha high-pressure electrolysis reservoir
                </div>
              </div>
            </div>

            <button
              onClick={() => refillSuitOxygen()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-sky-400/40 bg-sky-500/20 px-4 py-2 text-xs font-bold text-sky-200 hover:bg-sky-500/30 transition-all active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>RECHARGE SUIT O2 [100%]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
