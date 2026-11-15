import React, { useState, useEffect } from 'react';
import { climateAudio } from '../audio/climateAudio';
import { EXPANDED_EARTH_MARS_METRICS } from '../climateData';
import {
  Globe2,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  CloudFog,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const EarthMarsClimateComparison: React.FC = () => {
  const [selectedMetricIdx, setSelectedMetricIdx] = useState<number>(0);

  // Simulation: "What If Mars Had A Thicker Atmosphere?"
  const [simulatedPressureMbar, setSimulatedPressureMbar] = useState<number>(6.1);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const activeMetric = EXPANDED_EARTH_MARS_METRICS[selectedMetricIdx];

  // Mathematical greenhouse warming calculation:
  // Radiative forcing approximation: dT ~ 5.35 * ln(P / 6.1) * 3.8
  const simulatedGreenhouseWarming = Math.min(
    65,
    Math.round(5.35 * Math.log(Math.max(1, simulatedPressureMbar) / 6.1) * 3.8)
  );
  const simulatedTempC = -63 + simulatedGreenhouseWarming;
  const isLiquidWaterStable = simulatedPressureMbar >= 25 && simulatedTempC > 0;

  // Laura Speech Narration
  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const textToSpeak = `${activeMetric.title}. Earth has ${activeMetric.earthValue}. Mars has ${activeMetric.marsValue}. Scientific insight: ${activeMetric.scientificInsight}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    if (isSpeaking && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [selectedMetricIdx]);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#06182C] via-[#0B1528] to-[#1F0E0A] border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              COMPARATIVE PLANETOLOGY
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
              NASA PDS & CURIOSITY/PERSEVERANCE DATA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Earth vs. Mars: Planetary Climate Environments
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Investigate why Earth flourished into a temperate water world while Mars became a frozen, hyper-arid desert despite forming in the same proto-planetary nebula.
          </p>
        </div>

        {/* Laura Narration Button */}
        <button
          onClick={handleToggleSpeak}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
            isSpeaking
              ? 'bg-rose-500/20 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse'
              : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/40 text-cyan-300'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isSpeaking ? 'Mute Briefing' : 'Listen with Laura'}</span>
        </button>
      </div>

      {/* 2. 7 Comparative Parameters Selector Strip */}
      <div className="p-3 rounded-2xl bg-[#070C1B] border border-white/10 space-y-2">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block px-2">
          Select Planetary Environmental Metric (7 Parameters)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {EXPANDED_EARTH_MARS_METRICS.map((metric, idx) => {
            const isSelected = selectedMetricIdx === idx;
            return (
              <button
                key={metric.id}
                onClick={() => {
                  climateAudio.playTick();
                  setSelectedMetricIdx(idx);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-950 to-amber-950 border-cyan-400 text-white shadow-md'
                    : 'bg-[#0B1528] border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="text-[10px] font-mono text-cyan-400 font-bold">
                  0{idx + 1}
                </div>
                <div className="text-xs font-bold truncate mt-0.5">
                  {metric.title.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Side-by-Side Planetary Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EARTH CARD */}
        <div className="p-6 rounded-2xl bg-[#06182C]/90 border border-cyan-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <Globe2 className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">PLANET EARTH</h3>
                <span className="text-[10px] font-mono text-cyan-300">
                  1.000 AU • Orbit: 365.25 Days • Radius: 6,371 km
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              TEMPERATE HABITABLE
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {activeMetric.title}:
              </span>
              <div className="text-lg font-bold font-mono text-cyan-300 mt-1">
                {activeMetric.earthValue}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#0B1528]/80 p-3.5 rounded-xl border border-white/5">
              {activeMetric.earthDetail}
            </p>
          </div>
        </div>

        {/* MARS CARD */}
        <div className="p-6 rounded-2xl bg-[#1A0C08]/90 border border-amber-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Globe2 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">PLANET MARS</h3>
                <span className="text-[10px] font-mono text-amber-300">
                  1.524 AU • Orbit: 687 Days • Radius: 3,389 km
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              HYPER-ARID CRYOSPHERE
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {activeMetric.title}:
              </span>
              <div className="text-lg font-bold font-mono text-amber-300 mt-1">
                {activeMetric.marsValue}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#0B1528]/80 p-3.5 rounded-xl border border-white/5">
              {activeMetric.marsDetail}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Scientific Insight Deep Dive Card */}
      <div className="p-5 rounded-2xl bg-[#070C1B] border border-cyan-500/30 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          Comparative Astrophysics & Planetary Evolution Insight
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {activeMetric.scientificInsight}
        </p>
      </div>

      {/* 5. Interactive Simulation: "What If Mars Had A Thicker Atmosphere?" */}
      <div className="p-6 rounded-2xl bg-[#070C1B] border border-amber-500/30 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" />
              Planetary Atmospheric Simulation Chamber
            </div>
            <h4 className="text-base font-bold text-white">
              Hypothetical Terraforming: What If Mars Had A Thicker Atmosphere?
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust simulated surface atmospheric pressure to model greenhouse radiative trapping and liquid water stability:
            </p>
          </div>

          <button
            onClick={() => {
              climateAudio.playReset();
              setSimulatedPressureMbar(6.1);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Modern Mars (6.1 mbar)
          </button>
        </div>

        {/* Pressure Slider */}
        <div className="space-y-2 bg-[#0B1528] p-4 rounded-xl border border-white/5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Simulated Mars Surface Pressure:</span>
            <span className="font-bold text-amber-300">{simulatedPressureMbar} mbar ({ (simulatedPressureMbar / 1013.25 * 100).toFixed(1) }% of Earth)</span>
          </div>
          <input
            type="range"
            min="6.1"
            max="1200"
            step="10"
            value={simulatedPressureMbar}
            onChange={(e) => setSimulatedPressureMbar(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>6.1 mbar (Modern Mars)</span>
            <span>100 mbar (Armstrong Limit)</span>
            <span>1,013 mbar (Earth Sea Level)</span>
          </div>
        </div>

        {/* Calculated Simulation Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-500">Greenhouse Trapping Delta</span>
            <div className="text-2xl font-mono font-bold text-amber-300 mt-1">
              +{simulatedGreenhouseWarming}°C
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Radiative forcing increase</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-500">Mean Surface Temperature</span>
            <div className={`text-2xl font-mono font-bold mt-1 ${simulatedTempC > 0 ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {simulatedTempC > 0 ? `+${simulatedTempC}°C` : `${simulatedTempC}°C`}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Baseline: -63°C</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-500">Liquid Water Stability</span>
            <div className="text-sm font-bold mt-2 flex items-center gap-1.5">
              {isLiquidWaterStable ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">STABLE LIQUID WATER</span>
                </>
              ) : (
                <>
                  <CloudFog className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-300">BOILS / FREEZES INSTANTLY</span>
                </>
              )}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Triple point: &gt;25 mbar &amp; &gt;0°C</div>
          </div>
        </div>
      </div>
    </div>
  );
};
