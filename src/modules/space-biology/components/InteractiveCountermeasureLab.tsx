import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Dna,
  Sprout,
  Activity,
  Sliders,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const InteractiveCountermeasureLab: React.FC = () => {
  const [activeChamber, setActiveChamber] = useState<'bone_muscle' | 'radiation' | 'plant'>('bone_muscle');

  // Chamber 1: Bone & Muscle
  const [missionMonths, setMissionMonths] = useState<number>(12);
  const [aredHoursPerDay, setAredHoursPerDay] = useState<number>(1.5);
  const [nutritionalSupport, setNutritionalSupport] = useState<'standard' | 'optimized'>('optimized');

  // Chamber 2: Radiation
  const [shieldingMaterial, setShieldingMaterial] = useState<'aluminum' | 'polyethylene' | 'regolith' | 'water_wall'>('polyethylene');
  const [shieldingThickness, setShieldingThickness] = useState<number>(20); // g/cm²
  const [solarCondition, setSolarCondition] = useState<'solar_min' | 'solar_max' | 'spe_event'>('solar_min');

  // Chamber 3: Plant Growth
  const [gravityG, setGravityG] = useState<number>(0.38); // Mars 0.38g
  const [redBlueRatio, setRedBlueRatio] = useState<number>(3.0); // 3:1 Red to Blue
  const [photoperiodHours, setPhotoperiodHours] = useState<number>(16);

  // --------------------------------------------------------------------------
  // Chamber 1 Calculations (Empirical model based on NASA HRP bone loss data)
  // --------------------------------------------------------------------------
  const boneCalculations = useMemo(() => {
    // Unmitigated loss is ~1.2% per month in microgravity
    const baseLossRate = 1.2;
    // ARED mitigation: 2.5 hrs/day can offset up to 80% of loss
    const aredMitigationFactor = Math.min(0.85, aredHoursPerDay * 0.34);
    // Nutrition mitigation adds an extra 10% protection
    const nutritionFactor = nutritionalSupport === 'optimized' ? 0.12 : 0.04;

    const netLossRatePerMonth = Math.max(0.1, baseLossRate * (1 - aredMitigationFactor - nutritionFactor));
    const totalLossPct = Math.min(45, netLossRatePerMonth * missionMonths);
    const bmdRetention = Math.max(55, 100 - totalLossPct);

    const trabecularIntegrity = Math.max(40, 100 - totalLossPct * 1.3);
    const fractureRiskIndex = (1 + totalLossPct * 0.08).toFixed(2);

    return {
      bmdRetention: bmdRetention.toFixed(1),
      totalLossPct: totalLossPct.toFixed(1),
      trabecularIntegrity: trabecularIntegrity.toFixed(1),
      fractureRiskIndex,
    };
  }, [missionMonths, aredHoursPerDay, nutritionalSupport]);

  // --------------------------------------------------------------------------
  // Chamber 2 Calculations (GCR and SPE physics shielding model)
  // --------------------------------------------------------------------------
  const radiationCalculations = useMemo(() => {
    // Materials effectiveness: Polyethylene and water are richer in hydrogen (better for GCR HZE fragmentation without secondary neutron generation)
    const materialMultipliers = {
      aluminum: 1.0,
      regolith: 0.88,
      polyethylene: 0.72,
      water_wall: 0.65,
    };

    const baseDosePerYear = solarCondition === 'solar_min' ? 380 : solarCondition === 'solar_max' ? 240 : 1200; // mSv/year
    const materialFactor = materialMultipliers[shieldingMaterial];
    const thicknessDampening = Math.exp(-shieldingThickness / 35);

    const annualDose = Math.round(baseDosePerYear * materialFactor * thicknessDampening);
    const dsbPerCellDay = (annualDose * 0.038).toFixed(1);
    const cancerRiskPct = (annualDose * 0.0035).toFixed(2);

    return {
      annualDose,
      dsbPerCellDay,
      cancerRiskPct,
    };
  }, [shieldingMaterial, shieldingThickness, solarCondition]);

  // --------------------------------------------------------------------------
  // Chamber 3 Calculations (Veggie & APH Plant Photomorphogenesis)
  // --------------------------------------------------------------------------
  const plantCalculations = useMemo(() => {
    // Gravity penalty: 0g causes root disorganization; partial gravity (0.16g / 0.38g) partially restores statolith sedimentation
    const gravityFactor = gravityG === 0 ? 0.65 : gravityG === 0.16 ? 0.82 : gravityG === 0.38 ? 0.94 : 1.0;
    // Spectrum optimal ~ 3:1 to 4:1
    const spectrumFactor = 1 - Math.abs(redBlueRatio - 3.5) * 0.12;
    // Photoperiod optimal ~ 16 hrs
    const lightFactor = photoperiodHours / 16;

    const shootBiomass = (12.4 * gravityFactor * spectrumFactor * lightFactor).toFixed(1);
    const rootAsymmetry = Math.round(gravityFactor * 100);
    const seedlingViability = Math.min(99, Math.round(75 * gravityFactor * spectrumFactor + 20));

    return {
      shootBiomass,
      rootAsymmetry,
      seedlingViability,
    };
  }, [gravityG, redBlueRatio, photoperiodHours]);

  return (
    <div className="space-y-6">
      {/* Simulation Banner */}
      <div className="p-4 rounded-2xl bg-[#0B1528] border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                NASA Countermeasure Simulation Laboratory
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                EDUCATIONAL SIMULATION MODEL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Experiment with empirical operational interventions to mitigate microgravity atrophy, radiation damage, and botanical stress.
            </p>
          </div>
        </div>

        {/* Chamber Selector Tabs */}
        <div className="flex bg-[#070C1B] p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveChamber('bone_muscle')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeChamber === 'bone_muscle'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Bone & Muscle
          </button>
          <button
            onClick={() => setActiveChamber('radiation')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeChamber === 'radiation'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Cosmic Radiation
          </button>
          <button
            onClick={() => setActiveChamber('plant')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeChamber === 'plant'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Space Crops
          </button>
        </div>
      </div>

      {/* CHAMBER 1: Bone & Muscle */}
      {activeChamber === 'bone_muscle' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#070C1B] border border-white/10 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              Chamber Parameters
            </h4>

            {/* Mission Duration */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Mission Duration:</span>
                <span className="font-mono font-bold text-cyan-300">{missionMonths} Months</span>
              </div>
              <input
                type="range"
                min="1"
                max="36"
                step="1"
                value={missionMonths}
                onChange={(e) => setMissionMonths(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Mo (ISS Short)</span>
                <span>12 Mo (Standard ISS)</span>
                <span>36 Mo (Mars Return)</span>
              </div>
            </div>

            {/* ARED Training Hours */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">ARED Heavy Resistance Training:</span>
                <span className="font-mono font-bold text-indigo-300">{aredHoursPerDay.toFixed(1)} hrs/day</span>
              </div>
              <input
                type="range"
                min="0"
                max="2.5"
                step="0.1"
                value={aredHoursPerDay}
                onChange={(e) => setAredHoursPerDay(Number(e.target.value))}
                className="w-full accent-indigo-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.0 (Sedentary)</span>
                <span>1.5 (ISS Baseline)</span>
                <span>2.5 (Intensive)</span>
              </div>
            </div>

            {/* Nutrition */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-300 font-medium block">Nutrition & Bisphosphonates:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setNutritionalSupport('standard')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    nutritionalSupport === 'standard'
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                      : 'bg-[#0B1528] border-white/5 text-slate-400'
                  }`}
                >
                  <div className="font-bold">Standard Diet</div>
                  <div className="text-[10px] text-slate-400">1000 mg Ca + 800 IU Vit D</div>
                </button>
                <button
                  onClick={() => setNutritionalSupport('optimized')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    nutritionalSupport === 'optimized'
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                      : 'bg-[#0B1528] border-white/5 text-slate-400'
                  }`}
                >
                  <div className="font-bold">Optimized Protocol</div>
                  <div className="text-[10px] text-slate-400">1200 mg Ca + Bisphosphonates</div>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400 leading-relaxed">
              <strong>Mechanism:</strong> The Advanced Resistive Exercise Device (ARED) provides up to 600 lbs of load simulating squats, deadlifts, and heel raises, delivering axial mechanical strain to osteocytes and preserving lower-limb motor units.
            </div>
          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#070C1B] border border-white/10 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Simulated Physiological Outcomes
            </h4>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                <div className="text-[10px] uppercase font-bold text-slate-400">BMD Retention</div>
                <div className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                  {boneCalculations.bmdRetention}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Loss: -{boneCalculations.totalLossPct}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Trabecular Microarchitecture</div>
                <div className="text-2xl font-mono font-bold text-indigo-300 mt-1">
                  {boneCalculations.trabecularIntegrity}/100
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Structural connectivity</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5 col-span-2 sm:col-span-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Relative Fracture Risk</div>
                <div className="text-2xl font-mono font-bold text-amber-300 mt-1">
                  {boneCalculations.fractureRiskIndex}x
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">vs Pre-flight baseline</div>
              </div>
            </div>

            {/* Visual Retention Progress */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Bone Mineral Density (Baseline 100%)</span>
                <span className="font-mono font-bold text-cyan-300">{boneCalculations.bmdRetention}%</span>
              </div>
              <div className="w-full h-4 rounded-full bg-slate-900 border border-white/10 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-all duration-300"
                  style={{ width: `${boneCalculations.bmdRetention}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1528] border border-cyan-500/20 text-xs text-slate-300 space-y-1.5">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Countermeasure Evaluation:
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {Number(boneCalculations.bmdRetention) >= 90
                  ? 'Excellent mitigation: astronaut bone density remains within safe operational limits for planetary surface operations.'
                  : Number(boneCalculations.bmdRetention) >= 80
                  ? 'Moderate mitigation: slight osteopenia observed; post-landing rehabilitative physical therapy will be required on Mars/Earth.'
                  : 'Critical bone loss alert: unmitigated microgravity exposure leads to high risk of hip/vertebral micro-fractures during high-g re-entry.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CHAMBER 2: Radiation */}
      {activeChamber === 'radiation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#070C1B] border border-white/10 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Radiation & Shielding Parameters
            </h4>

            {/* Shielding Material */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-300 font-medium block">Shielding Material:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['polyethylene', 'water_wall', 'regolith', 'aluminum'] as const).map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setShieldingMaterial(mat)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      shieldingMaterial === mat
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                        : 'bg-[#0B1528] border-white/5 text-slate-400'
                    }`}
                  >
                    <div className="font-bold capitalize">{mat.replace('_', ' ')}</div>
                    <div className="text-[10px] text-slate-500">
                      {mat === 'polyethylene' && 'Hydrogen-rich polymer'}
                      {mat === 'water_wall' && 'Life-support dual use'}
                      {mat === 'regolith' && 'In-situ Martian soil'}
                      {mat === 'aluminum' && 'Aerospace structural Al'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Thickness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Areal Mass Thickness:</span>
                <span className="font-mono font-bold text-cyan-300">{shieldingThickness} g/cm²</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={shieldingThickness}
                onChange={(e) => setShieldingThickness(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5 g/cm² (Thin hull)</span>
                <span>20 g/cm² (Standard habitat)</span>
                <span>40 g/cm² (Storm shelter)</span>
              </div>
            </div>

            {/* Solar Activity Condition */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-300 font-medium block">Heliospheric Solar Cycle:</span>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  onClick={() => setSolarCondition('solar_min')}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    solarCondition === 'solar_min'
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                      : 'bg-[#0B1528] border-white/5 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-[11px]">Solar Minimum</div>
                  <div className="text-[9px] text-slate-500">Peak GCR Flux</div>
                </button>
                <button
                  onClick={() => setSolarCondition('solar_max')}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    solarCondition === 'solar_max'
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                      : 'bg-[#0B1528] border-white/5 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-[11px]">Solar Maximum</div>
                  <div className="text-[9px] text-slate-500">Lower GCR</div>
                </button>
                <button
                  onClick={() => setSolarCondition('spe_event')}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    solarCondition === 'spe_event'
                      ? 'bg-rose-950 border-rose-400 text-rose-200'
                      : 'bg-[#0B1528] border-white/5 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-[11px]">SPE Storm</div>
                  <div className="text-[9px] text-rose-400">Proton Flare</div>
                </button>
              </div>
            </div>
          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#070C1B] border border-white/10 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Dna className="w-4 h-4" />
              Simulated Radiation Dosimetry & Cellular DNA Damage
            </h4>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Annual Effective Dose</div>
                <div className="text-2xl font-mono font-bold text-rose-300 mt-1">
                  {radiationCalculations.annualDose} mSv
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">NASA Career limit: ~600 mSv</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                <div className="text-[10px] uppercase font-bold text-slate-400">DNA DSBs Rate</div>
                <div className="text-2xl font-mono font-bold text-amber-300 mt-1">
                  {radiationCalculations.dsbPerCellDay} /day
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Double-strand breaks/cell</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5 col-span-2 sm:col-span-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Excess Cancer Risk (RECR)</div>
                <div className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                  +{radiationCalculations.cancerRiskPct}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">NASA Standard &lt; 3.0%</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1528] border border-rose-500/20 text-xs text-slate-300 space-y-1.5">
              <div className="font-bold text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                High-Z and High-Energy (HZE) Ion Physics:
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Heavy nuclei (e.g. Iron-56 ions) punch dense ionization tracks through cell nuclei, causing complex non-homologous end joining (NHEJ) errors. Polyethylene and water provide superior hydrogen density, minimizing harmful secondary neutron fragmentation compared to heavy metals.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CHAMBER 3: Plant Crops */}
      {activeChamber === 'plant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#070C1B] border border-white/10 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sprout className="w-4 h-4" />
              Veggie & Advanced Plant Habitat (APH)
            </h4>

            {/* Gravity Level */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-300 font-medium block">Effective Gravity Regime:</span>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {[
                  { label: '0.0G', sub: 'ISS µG', val: 0 },
                  { label: '0.16G', sub: 'Lunar', val: 0.16 },
                  { label: '0.38G', sub: 'Mars', val: 0.38 },
                  { label: '1.0G', sub: 'Earth', val: 1.0 },
                ].map((g) => (
                  <button
                    key={g.label}
                    onClick={() => setGravityG(g.val)}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      gravityG === g.val
                        ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                        : 'bg-[#0B1528] border-white/5 text-slate-400'
                    }`}
                  >
                    <div className="font-bold font-mono text-[11px]">{g.label}</div>
                    <div className="text-[9px] text-slate-500">{g.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Spectrum Ratio */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">LED Red to Blue Ratio:</span>
                <span className="font-mono font-bold text-cyan-300">{redBlueRatio.toFixed(1)} : 1</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.5"
                value={redBlueRatio}
                onChange={(e) => setRedBlueRatio(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1:1 (Vegetative)</span>
                <span>3.5:1 (Optimal Biomass)</span>
                <span>5:1 (High Far-Red)</span>
              </div>
            </div>

            {/* Photoperiod */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Photoperiod Lighting:</span>
                <span className="font-mono font-bold text-amber-300">{photoperiodHours} Hours/day</span>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                step="2"
                value={photoperiodHours}
                onChange={(e) => setPhotoperiodHours(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>12 hrs (Short Day)</span>
                <span>16 hrs (Standard)</span>
                <span>24 hrs (Continuous)</span>
              </div>
            </div>
          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#070C1B] border border-white/10 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Agronomic Yield & Gravitropism
            </h4>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Shoot Biomass Yield</div>
                <div className="text-2xl font-mono font-bold text-emerald-300 mt-1">
                  {plantCalculations.shootBiomass} g
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Dry weight per plant</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Auxin Asymmetry Index</div>
                <div className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                  {plantCalculations.rootAsymmetry}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Root gravitropic steering</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5 col-span-2 sm:col-span-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Seedling Viability</div>
                <div className="text-2xl font-mono font-bold text-amber-300 mt-1">
                  {plantCalculations.seedlingViability}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">ECLSS O2/Food yield</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1528] border border-emerald-500/20 text-xs text-slate-300 space-y-1.5">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                NASA Plant Space Biology Insight (OSD-120):
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                In microgravity, plants utilize blue light phototropism to guide shoots toward lamps when gravity cues are absent. Dense LED red/blue arrays stimulate stomatal opening, anthocyanin production, and chlorophyll synthesis for sustainable lunar and Martian bioregenerative life support systems.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
