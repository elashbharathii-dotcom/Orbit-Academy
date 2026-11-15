/**
 * ORBIT ACADEMY — CLIMATE LAB
 * PHASE 2: DYNAMIC WEATHER SIMULATION OVERLAY & METEOROLOGICAL CONTROLS
 * 
 * Features:
 * - Dynamic phenomenon switcher (Hurricane, Monsoon, Thunderstorm, Blizzard, Drought, Equilibrium)
 * - Real-time barometric and aerodynamic gauges (Wind speed, Barometric Pressure, Precipitation, Humidity)
 * - Atmospheric thermodynamics explainer cards
 * - Real-time manual perturbation sliders (Adjust wind speed, pressure, surface temp)
 * - Integrated audio triggers
 */

import React from 'react';
import {
  WeatherSystemConfig,
  WeatherPhenomenonId,
} from '../types';
import { WEATHER_PRESETS } from '../climateData';
import { climateAudio } from '../audio/climateAudio';
import {
  Wind,
  Gauge,
  CloudRain,
  Thermometer,
  Zap,
  Flame,
  Snowflake,
  Sun,
  Activity,
  Compass,
} from 'lucide-react';

interface WeatherSimulationOverlayProps {
  activeWeather: WeatherSystemConfig;
  onSelectWeather: (weather: WeatherSystemConfig) => void;
  onUpdateWeatherParam: (key: keyof WeatherSystemConfig, value: number) => void;
}

const WEATHER_ICONS: Record<WeatherPhenomenonId, React.ComponentType<{ className?: string }>> = {
  clear: Sun,
  hurricane: Wind,
  monsoon: CloudRain,
  thunderstorm: Zap,
  blizzard: Snowflake,
  drought: Flame,
};

export const WeatherSimulationOverlay: React.FC<WeatherSimulationOverlayProps> = ({
  activeWeather,
  onSelectWeather,
  onUpdateWeatherParam,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. WEATHER PHENOMENON PRESET SELECTOR */}
      <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs uppercase tracking-wider font-mono text-cyan-300 font-bold">
              Select Atmospheric Phenomenon
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/40">
            Phase 2: Convective Dynamics
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {WEATHER_PRESETS.map((preset) => {
            const isSelected = activeWeather.id === preset.id;
            const Icon = WEATHER_ICONS[preset.id];

            return (
              <button
                key={preset.id}
                onClick={() => {
                  climateAudio.playSonarPing();
                  if (preset.id === 'thunderstorm' || preset.id === 'hurricane') {
                    climateAudio.playThunder();
                  }
                  onSelectWeather(preset);
                }}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                    : 'bg-slate-900/50 border-slate-700/50 text-slate-300 hover:border-cyan-500/40 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {preset.category}
                  </span>
                </div>
                <div className="text-xs font-bold leading-tight line-clamp-1">{preset.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {preset.windSpeedKmh} km/h • {preset.pressureHpa} hPa
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. LIVE METEOROLOGICAL TELEMETRY GAUGES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Wind Speed */}
        <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 rounded-xl p-3 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase">Wind Velocity</span>
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {activeWeather.windSpeedKmh}{' '}
            <span className="text-xs text-cyan-300 font-normal">km/h</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {activeWeather.windSpeedKmh > 200 ? 'Category 5 Gale' : activeWeather.windSpeedKmh > 80 ? 'Gale Force' : 'Moderate Flow'}
          </div>
        </div>

        {/* Barometric Pressure */}
        <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 rounded-xl p-3 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase">Atm. Pressure</span>
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {activeWeather.pressureHpa}{' '}
            <span className="text-xs text-amber-300 font-normal">hPa</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {activeWeather.pressureHpa < 950 ? 'Severe Depression' : activeWeather.pressureHpa > 1020 ? 'Subtropical High' : 'Equilibrium'}
          </div>
        </div>

        {/* Precipitation Rate */}
        <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 rounded-xl p-3 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase">Precipitation</span>
            <CloudRain className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {activeWeather.precipitationMmHr}{' '}
            <span className="text-xs text-blue-300 font-normal">mm/hr</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {activeWeather.precipitationMmHr > 50 ? 'Torrential Downpour' : activeWeather.precipitationMmHr > 0 ? 'Active Rain' : 'Zero Moisture'}
          </div>
        </div>

        {/* Surface Temperature */}
        <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 rounded-xl p-3 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase">Surface Temp</span>
            <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {activeWeather.surfaceTempC > 0 ? `+${activeWeather.surfaceTempC}` : activeWeather.surfaceTempC}{' '}
            <span className="text-xs text-emerald-300 font-normal">°C</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {activeWeather.surfaceTempC > 35 ? 'Extreme Heat Stress' : activeWeather.surfaceTempC < 0 ? 'Cryospheric Freeze' : 'Temperate'}
          </div>
        </div>
      </div>

      {/* 3. THERMODYNAMIC MECHANICS & SCIENTIFIC EXPLANATION */}
      <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-2 text-cyan-300 text-xs font-mono uppercase tracking-wider font-bold">
          <Compass className="w-4 h-4 text-cyan-400" />
          Atmospheric Mechanics & Thermodynamic Process
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          {activeWeather.mechanicsExplanation}
        </p>

        {/* Active Coordinates Callout */}
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400">Primary Occurrence Zone</span>
            <div className="text-xs font-semibold text-white">{activeWeather.activeLocation}</div>
          </div>
          <button
            onClick={() => {
              climateAudio.playThunder();
            }}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-3 h-3" />
            Trigger Lightning Strobe
          </button>
        </div>
      </div>

      {/* 4. INTERACTIVE VARIABLE ADJUSTMENT SLIDERS */}
      <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center justify-between">
          <span>Manual Atmospheric Perturbation</span>
          <span className="text-[10px] text-slate-400 lowercase font-normal">adjust parameters live</span>
        </div>

        {/* Wind Speed Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Wind Velocity</span>
            <span className="text-cyan-400 font-bold">{activeWeather.windSpeedKmh} km/h</span>
          </div>
          <input
            type="range"
            min={10}
            max={320}
            step={5}
            value={activeWeather.windSpeedKmh}
            onChange={(e) => {
              climateAudio.playTick();
              onUpdateWeatherParam('windSpeedKmh', Number(e.target.value));
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Atmospheric Pressure Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Central Barometric Pressure</span>
            <span className="text-amber-400 font-bold">{activeWeather.pressureHpa} hPa</span>
          </div>
          <input
            type="range"
            min={900}
            max={1040}
            step={2}
            value={activeWeather.pressureHpa}
            onChange={(e) => {
              climateAudio.playTick();
              onUpdateWeatherParam('pressureHpa', Number(e.target.value));
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>
      </div>
    </div>
  );
};
