import React, { useState, useMemo } from 'react';
import { CLIMATE_EXPERIMENTS, PHYSICAL_EXPERIMENTS } from '../climateData';
import { PhysicalExperimentId } from '../types';
import { climateAudio } from '../audio/climateAudio';
import {
  FlaskConical,
  Award,
  CheckCircle2,
  Sliders,
  Info,
  Calculator,
} from 'lucide-react';

interface ClimateExperimentsProps {
  onAwardXp?: (amount: number) => void;
}

export const ClimateExperiments: React.FC<ClimateExperimentsProps> = ({
  onAwardXp,
}) => {
  // Main deck mode: 'physical' (Stage 06 5 physical experiments) vs 'structured' (6 scenarios)
  const [deckMode, setDeckMode] = useState<'physical' | 'structured'>('physical');

  // --------------------------------------------------------------------------
  // PHYSICAL EXPERIMENTS STATE (5 Experiments)
  // --------------------------------------------------------------------------
  const [selectedPhysicalId, setSelectedPhysicalId] = useState<PhysicalExperimentId>('greenhouse_effect');

  // Parameter State for the 5 experiments
  // 1. Greenhouse
  const [co2Ppm, setCo2Ppm] = useState<number>(422);
  const [ch4Ppb, setCh4Ppb] = useState<number>(1920);
  const [waterFeedback, setWaterFeedback] = useState<number>(1.6);

  // 2. Solar
  const [solarConstant, setSolarConstant] = useState<number>(1361);
  const [planetaryAlbedo, setPlanetaryAlbedo] = useState<number>(0.298);
  const [axialObliquity, setAxialObliquity] = useState<number>(23.44);

  // 3. Atmosphere
  const [surfacePressure, setSurfacePressure] = useState<number>(1.0);
  const [oxygenPercent, setOxygenPercent] = useState<number>(21);
  const [co2Percent, setCo2Percent] = useState<number>(0.042);

  // 4. Planetary Temperature
  const [sunDistance, setSunDistance] = useState<number>(1.0);
  const [bondAlbedo, setBondAlbedo] = useState<number>(0.30);
  const [greenhouseEmissivity, setGreenhouseEmissivity] = useState<number>(0.78);

  // 5. Water Cycle
  const [seaSurfaceTemp, setSeaSurfaceTemp] = useState<number>(16.1);
  const [relativeHumidity, setRelativeHumidity] = useState<number>(65);
  const [convectiveUpdraft, setConvectiveUpdraft] = useState<number>(1.0);

  const activePhysicalExp =
    PHYSICAL_EXPERIMENTS.find((e) => e.id === selectedPhysicalId) || PHYSICAL_EXPERIMENTS[0];

  // Calculations for Physical Experiment 1: Greenhouse Effect
  const greenhouseCalculations = useMemo(() => {
    // Delta F = 5.35 * ln(CO2 / 280) + 0.036 * (sqrt(CH4) - sqrt(700))
    const co2Forcing = 5.35 * Math.log(co2Ppm / 280);
    const ch4Forcing = 0.036 * (Math.sqrt(ch4Ppb) - Math.sqrt(700));
    const totalForcing = Math.max(0, co2Forcing + ch4Forcing);
    const tempChange = totalForcing * 0.8 * (waterFeedback / 1.6);
    const trappedInfraredPct = Math.min(94, Math.round(72 + totalForcing * 2.8));
    const downwellingFluxWm2 = (390 + totalForcing * 1.4).toFixed(1);

    return {
      totalForcing: totalForcing.toFixed(2),
      tempChange: tempChange > 0 ? `+${tempChange.toFixed(2)}` : tempChange.toFixed(2),
      trappedInfraredPct,
      downwellingFluxWm2,
    };
  }, [co2Ppm, ch4Ppb, waterFeedback]);

  // Calculations for Physical Experiment 2: Solar Radiation
  const solarCalculations = useMemo(() => {
    // ASR = (S0 / 4) * (1 - albedo)
    const topOfAtmosphereFlux = (solarConstant / 4).toFixed(1);
    const absorbedSolarFlux = ((solarConstant / 4) * (1 - planetaryAlbedo)).toFixed(1);
    const reflectedSolarFlux = ((solarConstant / 4) * planetaryAlbedo).toFixed(1);
    const equatorPoleGradient = (axialObliquity * 2.4).toFixed(1);

    return {
      topOfAtmosphereFlux,
      absorbedSolarFlux,
      reflectedSolarFlux,
      equatorPoleGradient,
    };
  }, [solarConstant, planetaryAlbedo, axialObliquity]);

  // Calculations for Physical Experiment 3: Atmospheric Composition
  const atmosphereCalculations = useMemo(() => {
    // Column mass = P / g = (P * 101325) / 9.80665 kg/m2
    const columnMassKgM2 = Math.round((surfacePressure * 101325) / 9.80665);
    // Scale height H = RT / Mg ~ 8.5 km at 288 K
    const scaleHeightKm = (8.5 * (1.0 / Math.max(0.2, surfacePressure * 0.4 + 0.6))).toFixed(1);
    const blueScatterIntensity = (surfacePressure * 1.0).toFixed(2);
    const meanMolWeight = (28.01 * 0.78 + 32.0 * (oxygenPercent / 100) + 44.01 * (co2Percent / 100) + 39.95 * 0.01).toFixed(2);

    return {
      columnMassKgM2,
      scaleHeightKm,
      blueScatterIntensity,
      meanMolWeight,
    };
  }, [surfacePressure, oxygenPercent, co2Percent]);

  // Calculations for Physical Experiment 4: Planetary Temperature
  const planetaryCalculations = useMemo(() => {
    // S = 1361 / d^2
    const S = 1361 / (sunDistance * sunDistance);
    const sigma = 5.67037e-8;
    // Teq = [ S * (1 - albedo) / (4 * sigma) ]^(1/4)
    const Teq = Math.pow((S * (1 - bondAlbedo)) / (4 * sigma), 0.25);
    // Ts = [ 1 / (1 - eps/2) ]^(1/4) * Teq
    const Ts = Math.pow(1 / Math.max(0.01, 1 - greenhouseEmissivity / 2), 0.25) * Teq;
    const TeqC = Math.round(Teq - 273.15);
    const TsC = Math.round(Ts - 273.15);
    const deltaTgh = TsC - TeqC;

    return {
      solarFluxAtDistance: Math.round(S),
      TeqK: Math.round(Teq),
      TeqC,
      TsK: Math.round(Ts),
      TsC,
      deltaTgh,
    };
  }, [sunDistance, bondAlbedo, greenhouseEmissivity]);

  // Calculations for Physical Experiment 5: Water Cycle
  const waterCalculations = useMemo(() => {
    // e_sat(T) = 6.11 * exp( (17.67 * T) / (T + 243.5) )
    const eSatHpa = 6.11 * Math.exp((17.67 * seaSurfaceTemp) / (seaSurfaceTemp + 243.5));
    // Precipitable water vapor mm ~ 0.15 * e_sat * (RH/100)
    const precipWaterMm = ((eSatHpa * (relativeHumidity / 100)) * 0.85).toFixed(1);
    const annualEvapVolumeKm3 = Math.round(490000 * (eSatHpa / 18.2) * (convectiveUpdraft));
    const latentHeatFluxWm2 = (88 * (eSatHpa / 18.2) * convectiveUpdraft).toFixed(1);

    return {
      eSatHpa: eSatHpa.toFixed(1),
      precipWaterMm,
      annualEvapVolumeKm3,
      latentHeatFluxWm2,
    };
  }, [seaSurfaceTemp, relativeHumidity, convectiveUpdraft]);

  // --------------------------------------------------------------------------
  // STRUCTURED EXPERIMENTS STATE (6 Scenarios)
  // --------------------------------------------------------------------------
  const [selectedStructuredId, setSelectedStructuredId] = useState<string>(CLIMATE_EXPERIMENTS[0].id);
  const [structuredValues, setStructuredValues] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    CLIMATE_EXPERIMENTS.forEach((exp) => {
      map[exp.id] = exp.variableDefault;
    });
    return map;
  });

  const [completedExpIds, setCompletedExpIds] = useState<string[]>([]);
  const activeStructuredExp =
    CLIMATE_EXPERIMENTS.find((e) => e.id === selectedStructuredId) || CLIMATE_EXPERIMENTS[0];
  const currentStructuredVal = structuredValues[activeStructuredExp.id] ?? activeStructuredExp.variableDefault;

  const handleStructuredSlider = (newVal: number) => {
    climateAudio.playTick();
    setStructuredValues((prev) => ({ ...prev, [activeStructuredExp.id]: newVal }));
  };

  const handleCompleteStructured = () => {
    if (!completedExpIds.includes(activeStructuredExp.id)) {
      climateAudio.playAchievementChime();
      setCompletedExpIds((prev) => [...prev, activeStructuredExp.id]);
      if (onAwardXp) {
        onAwardXp(activeStructuredExp.xpReward);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Deck Selector Header */}
      <div className="p-4 rounded-2xl bg-[#0B1528] border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                NASA Climate Science Experimentation Chamber
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                SCIENTIFIC SIMULATION MODEL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Experiment with fundamental physical laws, greenhouse thermodynamics, orbital insolation, and the water cycle.
            </p>
          </div>
        </div>

        {/* Deck Mode Toggle */}
        <div className="flex bg-[#070C1B] p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setDeckMode('physical')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              deckMode === 'physical'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            5 Physical Laws
          </button>
          <button
            onClick={() => setDeckMode('structured')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              deckMode === 'structured'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            6 IPCC Scenarios
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DECK 1: FIVE PHYSICAL EXPERIMENTS                                     */}
      {/* ===================================================================== */}
      {deckMode === 'physical' && (
        <div className="space-y-6">
          {/* Physical Experiment Selector Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {PHYSICAL_EXPERIMENTS.map((exp) => {
              const isSelected = exp.id === selectedPhysicalId;
              return (
                <button
                  key={exp.id}
                  onClick={() => {
                    climateAudio.playTick();
                    setSelectedPhysicalId(exp.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/50 scale-[1.02]'
                      : 'bg-[#070C1B] border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="text-[10px] font-mono text-cyan-400 font-bold">
                    LAW #{PHYSICAL_EXPERIMENTS.indexOf(exp) + 1}
                  </div>
                  <div className="text-xs font-bold text-white truncate mt-0.5">
                    {exp.title.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Experiment Main Container */}
          <div className="p-6 rounded-2xl bg-[#070C1B] border border-white/10 space-y-6">
            {/* Header & Equation */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {activePhysicalExp.physicalLaw}
                </span>
                {activePhysicalExp.nasaDatasetRef && (
                  <span className="text-xs font-mono text-slate-400">
                    Ref: {activePhysicalExp.nasaDatasetRef}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">
                {activePhysicalExp.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {activePhysicalExp.hypothesis}
              </p>

              {/* Governing Mathematical Equation Banner */}
              <div className="mt-3 p-3.5 rounded-xl bg-[#0B1528] border border-cyan-500/20 flex items-center justify-between gap-4 font-mono text-xs">
                <span className="text-slate-400">Governing Equation:</span>
                <span className="text-cyan-300 font-bold truncate">
                  {activePhysicalExp.governingEquation}
                </span>
              </div>
            </div>

            {/* Interactive Sliders & Calculated Outputs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              {/* Sliders Column (5 cols) */}
              <div className="lg:col-span-5 p-5 rounded-xl bg-[#0B1528] border border-white/5 space-y-5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-400">
                  <span>Interactive Parameters</span>
                  <Sliders className="w-4 h-4" />
                </div>

                {/* 1. Greenhouse Controls */}
                {selectedPhysicalId === 'greenhouse_effect' && (
                  <div className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Atmospheric CO2:</span>
                        <span className="text-cyan-300 font-bold">{co2Ppm} ppm</span>
                      </div>
                      <input
                        type="range"
                        min="180"
                        max="1200"
                        step="10"
                        value={co2Ppm}
                        onChange={(e) => setCo2Ppm(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>180 (Ice Age)</span>
                        <span>280 (Pre-Ind)</span>
                        <span>422 (Now)</span>
                        <span>1200 (Extreme)</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Methane (CH4):</span>
                        <span className="text-indigo-300 font-bold">{ch4Ppb} ppb</span>
                      </div>
                      <input
                        type="range"
                        min="700"
                        max="3500"
                        step="50"
                        value={ch4Ppb}
                        onChange={(e) => setCh4Ppb(Number(e.target.value))}
                        className="w-full accent-indigo-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Water Vapor Multiplier:</span>
                        <span className="text-amber-300 font-bold">{waterFeedback.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="2.5"
                        step="0.1"
                        value={waterFeedback}
                        onChange={(e) => setWaterFeedback(Number(e.target.value))}
                        className="w-full accent-amber-400"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Solar Controls */}
                {selectedPhysicalId === 'solar_radiation' && (
                  <div className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Solar Constant (S0):</span>
                        <span className="text-cyan-300 font-bold">{solarConstant} W/m²</span>
                      </div>
                      <input
                        type="range"
                        min="1350"
                        max="1375"
                        step="1"
                        value={solarConstant}
                        onChange={(e) => setSolarConstant(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Global Bond Albedo (α):</span>
                        <span className="text-indigo-300 font-bold">{planetaryAlbedo.toFixed(3)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.15"
                        max="0.50"
                        step="0.01"
                        value={planetaryAlbedo}
                        onChange={(e) => setPlanetaryAlbedo(Number(e.target.value))}
                        className="w-full accent-indigo-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Earth Axial Obliquity:</span>
                        <span className="text-amber-300 font-bold">{axialObliquity.toFixed(2)}°</span>
                      </div>
                      <input
                        type="range"
                        min="21.5"
                        max="24.5"
                        step="0.1"
                        value={axialObliquity}
                        onChange={(e) => setAxialObliquity(Number(e.target.value))}
                        className="w-full accent-amber-400"
                      />
                    </div>
                  </div>
                )}

                {/* 3. Atmosphere Controls */}
                {selectedPhysicalId === 'atmospheric_composition' && (
                  <div className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Surface Pressure:</span>
                        <span className="text-cyan-300 font-bold">{surfacePressure.toFixed(1)} atm</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="3.0"
                        step="0.1"
                        value={surfacePressure}
                        onChange={(e) => setSurfacePressure(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Oxygen (O2) Fraction:</span>
                        <span className="text-indigo-300 font-bold">{oxygenPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="35"
                        step="1"
                        value={oxygenPercent}
                        onChange={(e) => setOxygenPercent(Number(e.target.value))}
                        className="w-full accent-indigo-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Carbon Dioxide (CO2):</span>
                        <span className="text-amber-300 font-bold">{co2Percent.toFixed(3)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.01"
                        max="2.0"
                        step="0.05"
                        value={co2Percent}
                        onChange={(e) => setCo2Percent(Number(e.target.value))}
                        className="w-full accent-amber-400"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Planetary Temperature Controls */}
                {selectedPhysicalId === 'planetary_temperature' && (
                  <div className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Solar Distance:</span>
                        <span className="text-cyan-300 font-bold">{sunDistance.toFixed(2)} AU</span>
                      </div>
                      <input
                        type="range"
                        min="0.6"
                        max="1.8"
                        step="0.02"
                        value={sunDistance}
                        onChange={(e) => setSunDistance(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>0.72 (Venus)</span>
                        <span>1.0 (Earth)</span>
                        <span>1.52 (Mars)</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Bond Albedo (Reflection):</span>
                        <span className="text-indigo-300 font-bold">{bondAlbedo.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.85"
                        step="0.01"
                        value={bondAlbedo}
                        onChange={(e) => setBondAlbedo(Number(e.target.value))}
                        className="w-full accent-indigo-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Greenhouse Emissivity (ε):</span>
                        <span className="text-amber-300 font-bold">{greenhouseEmissivity.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="0.99"
                        step="0.01"
                        value={greenhouseEmissivity}
                        onChange={(e) => setGreenhouseEmissivity(Number(e.target.value))}
                        className="w-full accent-amber-400"
                      />
                    </div>
                  </div>
                )}

                {/* 5. Water Cycle Controls */}
                {selectedPhysicalId === 'water_cycle' && (
                  <div className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Mean Sea Surface Temp (SST):</span>
                        <span className="text-cyan-300 font-bold">{seaSurfaceTemp.toFixed(1)}°C</span>
                      </div>
                      <input
                        type="range"
                        min="14.0"
                        max="22.0"
                        step="0.2"
                        value={seaSurfaceTemp}
                        onChange={(e) => setSeaSurfaceTemp(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Tropospheric Rel. Humidity:</span>
                        <span className="text-indigo-300 font-bold">{relativeHumidity}%</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="85"
                        step="1"
                        value={relativeHumidity}
                        onChange={(e) => setRelativeHumidity(Number(e.target.value))}
                        className="w-full accent-indigo-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Convective Updraft Factor:</span>
                        <span className="text-amber-300 font-bold">{convectiveUpdraft.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.8"
                        max="2.0"
                        step="0.1"
                        value={convectiveUpdraft}
                        onChange={(e) => setConvectiveUpdraft(Number(e.target.value))}
                        className="w-full accent-amber-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Calculated Outputs Column (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" /> Real-Time Physical Thermodynamic Outputs
                </div>

                {/* 1. Greenhouse Outputs */}
                {selectedPhysicalId === 'greenhouse_effect' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Radiative Forcing (ΔF)</span>
                      <div className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                        +{greenhouseCalculations.totalForcing} W/m²
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Above 280 ppm baseline</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Equilibrium Warming (ΔTeq)</span>
                      <div className="text-2xl font-mono font-bold text-rose-300 mt-1">
                        {greenhouseCalculations.tempChange}°C
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">With water vapor feedback</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Trapped Infrared %</span>
                      <div className="text-2xl font-mono font-bold text-amber-300 mt-1">
                        {greenhouseCalculations.trappedInfraredPct}%
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Upwelling thermal radiation</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Downwelling Longwave Flux</span>
                      <div className="text-2xl font-mono font-bold text-indigo-300 mt-1">
                        {greenhouseCalculations.downwellingFluxWm2} W/m²
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Atmospheric back-radiation</div>
                    </div>
                  </div>
                )}

                {/* 2. Solar Outputs */}
                {selectedPhysicalId === 'solar_radiation' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">TOA Mean Flux (S0 / 4)</span>
                      <div className="text-2xl font-mono font-bold text-yellow-300 mt-1">
                        {solarCalculations.topOfAtmosphereFlux} W/m²
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Spherical geometric distribution</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Absorbed Solar Radiation</span>
                      <div className="text-2xl font-mono font-bold text-emerald-300 mt-1">
                        {solarCalculations.absorbedSolarFlux} W/m²
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Energy warming climate</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Direct Reflected Flux (OSR)</span>
                      <div className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                        {solarCalculations.reflectedSolarFlux} W/m²
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Reflected by clouds/ice</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Equator-to-Pole Gradient</span>
                      <div className="text-2xl font-mono font-bold text-indigo-300 mt-1">
                        {solarCalculations.equatorPoleGradient}°C
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Driven by {axialObliquity}° obliquity</div>
                    </div>
                  </div>
                )}

                {/* 3. Atmosphere Outputs */}
                {selectedPhysicalId === 'atmospheric_composition' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Atmospheric Column Mass</span>
                      <div className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                        {atmosphereCalculations.columnMassKgM2.toLocaleString()} kg/m²
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Weight of air column per m²</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Tropospheric Scale Height (H)</span>
                      <div className="text-2xl font-mono font-bold text-indigo-300 mt-1">
                        {atmosphereCalculations.scaleHeightKm} km
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">e-folding pressure drop</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Mean Molecular Weight</span>
                      <div className="text-2xl font-mono font-bold text-amber-300 mt-1">
                        {atmosphereCalculations.meanMolWeight} g/mol
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Standard air = 28.97 g/mol</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Rayleigh Scattering Index</span>
                      <div className="text-2xl font-mono font-bold text-emerald-300 mt-1">
                        {atmosphereCalculations.blueScatterIntensity}x
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Proportional to density / λ⁴</div>
                    </div>
                  </div>
                )}

                {/* 4. Planetary Temperature Outputs */}
                {selectedPhysicalId === 'planetary_temperature' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Bare-Rock Equilibrium (Teq)</span>
                      <div className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                        {planetaryCalculations.TeqK} K ({planetaryCalculations.TeqC}°C)
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Without greenhouse effect</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Greenhouse Surface Temp (Ts)</span>
                      <div className="text-2xl font-mono font-bold text-emerald-300 mt-1">
                        {planetaryCalculations.TsK} K ({planetaryCalculations.TsC > 0 ? `+${planetaryCalculations.TsC}` : planetaryCalculations.TsC}°C)
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Actual surface temperature</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Greenhouse Warming (ΔTgh)</span>
                      <div className="text-2xl font-mono font-bold text-rose-300 mt-1">
                        +{planetaryCalculations.deltaTgh}°C
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Earth = +33°C, Venus = +510°C</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Solar Flux at Distance</span>
                      <div className="text-2xl font-mono font-bold text-amber-300 mt-1">
                        {planetaryCalculations.solarFluxAtDistance} W/m²
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Inverse-square law at {sunDistance} AU</div>
                    </div>
                  </div>
                )}

                {/* 5. Water Cycle Outputs */}
                {selectedPhysicalId === 'water_cycle' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Saturation Vapor Pressure</span>
                      <div className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                        {waterCalculations.eSatHpa} hPa
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Clausius-Clapeyron capacity</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Precipitable Water Column</span>
                      <div className="text-2xl font-mono font-bold text-indigo-300 mt-1">
                        {waterCalculations.precipWaterMm} mm
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Atmospheric moisture content</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Annual Evaporation Volume</span>
                      <div className="text-2xl font-mono font-bold text-emerald-300 mt-1">
                        {waterCalculations.annualEvapVolumeKm3.toLocaleString()} km³
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Global ocean evaporation</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Latent Heat Energy Flux</span>
                      <div className="text-2xl font-mono font-bold text-amber-300 mt-1">
                        {waterCalculations.latentHeatFluxWm2} W/m²
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Atmospheric heat engine</div>
                    </div>
                  </div>
                )}

                {/* Scientific Explanation Box */}
                <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5 space-y-2 text-xs">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-cyan-400" /> Physical Principle & Mechanism:
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {activePhysicalExp.educationalExplanation}
                  </p>

                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Scientific Assumptions:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-400">
                      {activePhysicalExp.assumptions.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DECK 2: SIX STRUCTURED IPCC CLIMATE SCENARIOS                          */}
      {/* ===================================================================== */}
      {deckMode === 'structured' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#070C1B] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                IPCC AR6 Scenario Investigations (6)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                {completedExpIds.length} of 6 Completed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CLIMATE_EXPERIMENTS.map((exp) => {
                const isSelected = activeStructuredExp.id === exp.id;
                const isDone = completedExpIds.includes(exp.id);
                return (
                  <button
                    key={exp.id}
                    onClick={() => setSelectedStructuredId(exp.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md'
                        : 'bg-[#0B1528] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="text-cyan-400 font-bold">EXP #{exp.number}</span>
                      {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    </div>
                    <div className="text-xs font-bold text-white truncate">{exp.title}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Structured Investigation Card */}
          <div className="p-6 rounded-2xl bg-[#070C1B] border border-white/10 space-y-5">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400 mb-1">
                {activeStructuredExp.scientificLaw}
              </div>
              <h3 className="text-lg font-bold text-white">{activeStructuredExp.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeStructuredExp.objective}</p>
            </div>

            {/* Slider */}
            <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">{activeStructuredExp.variableName}:</span>
                <span className="font-bold text-cyan-300">{currentStructuredVal} {activeStructuredExp.variableUnit}</span>
              </div>
              <input
                type="range"
                min={activeStructuredExp.variableMin}
                max={activeStructuredExp.variableMax}
                step={activeStructuredExp.variableStep}
                value={currentStructuredVal}
                onChange={(e) => handleStructuredSlider(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Submit Protocol */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-slate-400">
                Award: <span className="text-amber-400 font-bold">+{activeStructuredExp.xpReward} XP</span>
              </span>
              <button
                onClick={handleCompleteStructured}
                disabled={completedExpIds.includes(activeStructuredExp.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                  completedExpIds.includes(activeStructuredExp.id)
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-md'
                }`}
              >
                {completedExpIds.includes(activeStructuredExp.id) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Protocol Certified!
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" /> Submit Protocol
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
