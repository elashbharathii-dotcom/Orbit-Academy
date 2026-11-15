import React from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  Activity,
  Wind,
  Battery,
  Thermometer,
  Radio,
  Droplets,
  Apple,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const VitalGauges: React.FC = () => {
  const vitals = useMarsGameStore((state) => state.vitals);
  const isInsideHab = useMarsGameStore((state) => state.isInsideHab);
  const solCycle = useMarsGameStore((state) => state.solCycle);
  const powerGrid = useMarsGameStore((state) => state.powerGrid);
  const warnings = useMarsGameStore((state) => state.survivalWarnings);
  const inventory = useMarsGameStore((state) => state.inventory);
  const consumeFood = useMarsGameStore((state) => state.consumeFood);
  const consumeWater = useMarsGameStore((state) => state.consumeWater);
  const openPowerGrid = useMarsGameStore((state) => state.openPowerGridModal);

  const foodCount = inventory['food_ration']?.count ?? 0;
  const waterCount = inventory['water']?.count ?? 0;

  const weatherLabel =
    solCycle.weather === 'heavy_dust'
      ? 'HEAVY DUST'
      : solCycle.weather === 'light_dust'
      ? 'LIGHT DUST'
      : 'CLEAR SKY';

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#0A0F1D]/90 p-3.5 backdrop-blur-xl shadow-2xl text-xs font-mono select-none">
      {/* 1. Habitat / Suit Pressurization Status Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isInsideHab
                ? powerGrid.isBlackout
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-[#10B981] animate-pulse'
                : 'bg-[#00F0FF]'
            }`}
          />
          <span className="font-bold tracking-wider text-slate-200 text-[11px]">
            {isInsideHab
              ? powerGrid.isBlackout
                ? 'OUTPOST [BLACKOUT]'
                : 'HABITAT ALPHA [1.0 ATM]'
              : 'EVA SUIT [0.38 ATM]'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded border ${
              solCycle.weather === 'heavy_dust'
                ? 'border-red-500/40 bg-red-500/20 text-red-300 animate-pulse'
                : solCycle.weather === 'light_dust'
                ? 'border-amber-500/40 bg-amber-500/20 text-amber-300'
                : 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
            }`}
          >
            {weatherLabel}
          </span>
          <span className="text-[10px] text-amber-400 font-semibold">
            {solCycle.surfaceTemp}°C
          </span>
        </div>
      </div>

      {/* 2. Active Survival Warnings Carousel / Banner */}
      {warnings.length > 0 && (
        <div className="flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-950/40 px-2 py-1 text-[10px] text-red-300 animate-pulse">
          <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
          <span className="truncate font-semibold">{warnings[0]}</span>
          {warnings.length > 1 && (
            <span className="text-[9px] text-red-400/80 shrink-0">
              (+{warnings.length - 1})
            </span>
          )}
        </div>
      )}

      {/* 3. Primary Telemetry Gauges */}
      <div className="flex flex-col gap-1.5">
        {/* Health */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 text-red-400 font-bold">
              <Activity className="h-3 w-3" /> BIOMEDICAL
            </span>
            <span className="text-slate-300 font-semibold">
              {Math.round(vitals.health)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full transition-all duration-300 rounded-full bg-gradient-to-r from-red-600 to-emerald-500"
              style={{ width: `${vitals.health}%` }}
            />
          </div>
        </div>

        {/* Oxygen */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 text-sky-400 font-bold">
              <Wind className="h-3 w-3" /> SUIT O2
            </span>
            <span
              className={`font-semibold ${
                vitals.oxygen < 20 ? 'text-red-400 animate-pulse font-bold' : 'text-slate-300'
              }`}
            >
              {Math.round(vitals.oxygen)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                vitals.oxygen < 20 ? 'bg-red-500 animate-pulse' : 'bg-sky-500'
              }`}
              style={{ width: `${vitals.oxygen}%` }}
            />
          </div>
        </div>

        {/* Water / Hydration */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 text-cyan-400 font-bold">
              <Droplets className="h-3 w-3" /> HYDRATION
            </span>
            <span
              className={`font-semibold ${
                vitals.water < 20 ? 'text-red-400 animate-pulse font-bold' : 'text-slate-300'
              }`}
            >
              {Math.round(vitals.water)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                vitals.water < 20
                  ? 'bg-red-500 animate-pulse'
                  : vitals.water < 40
                  ? 'bg-amber-500'
                  : 'bg-cyan-500'
              }`}
              style={{ width: `${vitals.water}%` }}
            />
          </div>
        </div>

        {/* Food / Nutrition */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Apple className="h-3 w-3" /> CALORIC
            </span>
            <span
              className={`font-semibold ${
                vitals.food < 20 ? 'text-red-400 animate-pulse font-bold' : 'text-slate-300'
              }`}
            >
              {Math.round(vitals.food)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                vitals.food < 20
                  ? 'bg-red-500 animate-pulse'
                  : vitals.food < 40
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${vitals.food}%` }}
            />
          </div>
        </div>

        {/* Suit Battery */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Battery className="h-3 w-3" /> SUIT BATTERY
            </span>
            <span
              className={`font-semibold ${
                vitals.power < 15 ? 'text-red-400 animate-pulse font-bold' : 'text-slate-300'
              }`}
            >
              {Math.round(vitals.power)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                vitals.power < 15 ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
              }`}
              style={{ width: `${vitals.power}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Sub-vitals (Core Temp, Suit/Hab Temp, Radiation, Grid Status) */}
      <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-2 text-[10px] text-slate-300">
        <div className="flex items-center gap-1">
          <Thermometer className="h-3 w-3 text-cyan-400" />
          <span>Core: {vitals.coreTemp.toFixed(1)}°C</span>
        </div>
        <div className="flex items-center gap-1">
          <Thermometer className="h-3 w-3 text-amber-400" />
          <span>Suit: {vitals.suitTemp.toFixed(1)}°C</span>
        </div>
        <div className="flex items-center gap-1">
          <Radio className="h-3 w-3 text-emerald-400" />
          <span>Rad: {vitals.radiationDose.toFixed(2)} mSv</span>
        </div>
        <button
          onClick={() => openPowerGrid()}
          className="flex items-center gap-1 text-left text-cyan-300 hover:text-cyan-200 transition-colors"
          title="Open Base Power Grid Panel"
        >
          <Zap className="h-3 w-3 text-yellow-400" />
          <span>Grid: {powerGrid.batteryStorageKWh.toFixed(0)} kWh</span>
        </button>
      </div>

      {/* 5. Quick Consumable Hotbar */}
      <div className="grid grid-cols-2 gap-1.5 border-t border-white/10 pt-2">
        <button
          onClick={() => consumeFood()}
          disabled={foodCount <= 0}
          className={`flex items-center justify-between rounded-lg border px-2 py-1 text-[10px] transition-all ${
            foodCount > 0
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 active:scale-95'
              : 'border-white/5 bg-white/5 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span className="flex items-center gap-1 font-bold">
            <Apple className="h-3 w-3" /> EAT
          </span>
          <span className="font-bold">x{foodCount}</span>
        </button>

        <button
          onClick={() => consumeWater()}
          disabled={waterCount <= 0}
          className={`flex items-center justify-between rounded-lg border px-2 py-1 text-[10px] transition-all ${
            waterCount > 0
              ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 active:scale-95'
              : 'border-white/5 bg-white/5 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span className="flex items-center gap-1 font-bold">
            <Droplets className="h-3 w-3" /> DRINK
          </span>
          <span className="font-bold">x{waterCount}</span>
        </button>
      </div>
    </div>
  );
};
