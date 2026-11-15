/**
 * ORBIT ACADEMY — CLIMATE LAB
 * PHASE 4: DEDICATED 3D ENVIRONMENTAL ECOSYSTEMS
 * 
 * Features 4 dedicated simulation laboratories:
 * A. Glacier Lab: 3D interactive glacier with melting animation, iceberg calving, and sea level gauge
 * B. Ocean Lab: Thermohaline circulation, coral reef bleaching stages, and ocean acidification
 * C. Forest Lab: 3D forest canopy, deforestation, wildfire simulation, and carbon sequestration
 * D. Atmosphere Lab: Atmospheric layers cross-section, solar radiation, and greenhouse infrared trapping
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  EcosystemLabId,
  GlacierLabState,
  OceanLabState,
  ForestLabState,
  AtmosphereLabState,
} from '../types';
import { climateAudio } from '../audio/climateAudio';
import {
  Snowflake,
  Waves,
  TreePine,
  Cloud,
  Flame,
  Layers,
  Sparkles,
} from 'lucide-react';

interface EcosystemLabsProps {
  initialLab?: EcosystemLabId;
}

export const EcosystemLabs: React.FC<EcosystemLabsProps> = ({
  initialLab = 'glacier',
}) => {
  const [activeLab, setActiveLab] = useState<EcosystemLabId>(initialLab);

  // --- GLACIER LAB STATE ---
  const [glacier, setGlacier] = useState<GlacierLabState>({
    iceThicknessMeters: 280,
    meltRateMetersPerYear: 3.5,
    calvingRate: 2,
    seaLevelContributionMm: 12.4,
    albedo: 0.78,
    ambientTempC: 1.5,
    isCalving: false,
  });

  // --- OCEAN LAB STATE ---
  const [ocean, setOcean] = useState<OceanLabState>({
    surfaceTempC: 28.5,
    waterPh: 8.08,
    aragoniteSaturation: 3.2,
    coralBleachPercentage: 35,
    currentSpeedKmH: 5.5,
    marineHeatwaveIntensity: 'Moderate',
  });

  // --- FOREST LAB STATE ---
  const [forest, setForest] = useState<ForestLabState>({
    canopyDensityPercent: 75,
    deforestationRateMha: 10.5,
    carbonSequestrationGt: 3.8,
    wildfireActive: false,
    wildfireIntensity: 0,
    biodiversityIndex: 72,
  });

  // --- ATMOSPHERE LAB STATE ---
  const [atmosphere, setAtmosphere] = useState<AtmosphereLabState>({
    co2Ppm: 424,
    solarIrradianceWm2: 1361,
    terrestrialIrradianceWm2: 340,
    trappedInfraredPercent: 68,
    hadleyCellCirculation: 'Normal',
    ozoneLayerHealthPercent: 94,
  });

  // Canvas Refs for 2D/3D procedural ecosystem renders
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calve Iceberg Trigger
  const triggerCalving = () => {
    climateAudio.playGlacierCalving();
    setGlacier((prev) => ({
      ...prev,
      isCalving: true,
      calvingRate: prev.calvingRate + 1,
      seaLevelContributionMm: Number((prev.seaLevelContributionMm + 0.8).toFixed(1)),
    }));
    setTimeout(() => {
      setGlacier((prev) => ({ ...prev, isCalving: false }));
    }, 1200);
  };

  // Wildfire Trigger
  const toggleWildfire = () => {
    const nextState = !forest.wildfireActive;
    if (nextState) {
      climateAudio.playThunder();
    } else {
      climateAudio.playClick();
    }
    setForest((prev) => ({
      ...prev,
      wildfireActive: nextState,
      wildfireIntensity: nextState ? 75 : 0,
      carbonSequestrationGt: nextState ? 0.8 : 3.8,
      biodiversityIndex: nextState ? 45 : 72,
    }));
  };

  // Interactive Ecosystem Canvas Animator
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (activeLab === 'glacier') {
        // Glacier Mountain Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
        skyGrad.addColorStop(0, '#0F172A');
        skyGrad.addColorStop(1, '#1E293B');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);

        // Fjord Ocean Water
        const waterGrad = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
        waterGrad.addColorStop(0, '#0284C7');
        waterGrad.addColorStop(1, '#0C4A6E');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);

        // Glacier Ice Shelf
        const iceThickness = (glacier.iceThicknessMeters / 500) * (canvas.height * 0.5);
        ctx.fillStyle = '#E0F2FE';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.6 - iceThickness);
        ctx.lineTo(canvas.width * 0.6, canvas.height * 0.6 - iceThickness * 0.85);
        ctx.lineTo(canvas.width * 0.58, canvas.height * 0.6);
        ctx.lineTo(0, canvas.height * 0.6);
        ctx.closePath();
        ctx.fill();

        // Craggy serac highlights
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Calving Iceberg Chunk
        if (glacier.isCalving) {
          ctx.fillStyle = '#BAE6FD';
          const dropY = canvas.height * 0.6 + Math.sin(t * 8) * 15;
          ctx.fillRect(canvas.width * 0.62, dropY - 20, 35, 25);

          // Water splash rings
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(canvas.width * 0.65, canvas.height * 0.6, (t * 25) % 40, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (activeLab === 'ocean') {
        // Ocean Depth Gradient
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, ocean.marineHeatwaveIntensity === 'Extreme' ? '#E11D48' : '#0284C7');
        grad.addColorStop(0.5, '#0369A1');
        grad.addColorStop(1, '#082F49');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Thermohaline Conveyor Belt Flow
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 10) {
          const y = canvas.height * 0.35 + Math.sin(x * 0.02 + t) * 18;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Coral Reef Structures at Sea Floor
        const bleachRatio = ocean.coralBleachPercentage / 100;
        const coralColor = bleachRatio > 0.6 ? '#E2E8F0' : bleachRatio > 0.3 ? '#FDE047' : '#F43F5E';
        ctx.fillStyle = coralColor;
        for (let i = 0; i < 8; i++) {
          const cx = 50 + i * (canvas.width / 8);
          ctx.beginPath();
          ctx.arc(cx, canvas.height - 20, 25, Math.PI, 0);
          ctx.fill();
        }
      } else if (activeLab === 'forest') {
        // Sky
        ctx.fillStyle = forest.wildfireActive ? '#451A03' : '#064E3B';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ground
        ctx.fillStyle = '#14532D';
        ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

        // Trees
        const treeCount = Math.round((forest.canopyDensityPercent / 100) * 14);
        for (let i = 0; i < treeCount; i++) {
          const tx = 30 + i * (canvas.width / 14);
          // Trunk
          ctx.fillStyle = '#78350F';
          ctx.fillRect(tx - 3, canvas.height - 65, 6, 25);
          // Foliage
          ctx.fillStyle = forest.wildfireActive ? '#EA580C' : '#22C55E';
          ctx.beginPath();
          ctx.arc(tx, canvas.height - 75, 18, 0, Math.PI * 2);
          ctx.fill();
        }

        // Wildfire smoke particles
        if (forest.wildfireActive) {
          ctx.fillStyle = 'rgba(251, 146, 60, 0.5)';
          for (let p = 0; p < 12; p++) {
            const px = (p * 45 + t * 40) % canvas.width;
            const py = canvas.height - 80 - ((t * 30 + p * 20) % 100);
            ctx.beginPath();
            ctx.arc(px, py, 12, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (activeLab === 'atmosphere') {
        // Atmosphere Strata
        const layers = [
          { name: 'Thermosphere (85-600 km)', color: '#0F172A', h: 0.25 },
          { name: 'Mesosphere (50-85 km)', color: '#1E1B4B', h: 0.25 },
          { name: 'Stratosphere (12-50 km)', color: '#1E3A8A', h: 0.25 },
          { name: 'Troposphere (0-12 km)', color: '#0284C7', h: 0.25 },
        ];

        let currentY = 0;
        layers.forEach((l) => {
          const lh = canvas.height * l.h;
          ctx.fillStyle = l.color;
          ctx.fillRect(0, currentY, canvas.width, lh);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.font = '10px monospace';
          ctx.fillText(l.name, 15, currentY + 16);
          currentY += lh;
        });

        // Incoming Solar Photons (Yellow)
        ctx.fillStyle = '#FBBF24';
        for (let i = 0; i < 6; i++) {
          const sx = 60 + i * 80;
          const sy = (t * 80 + i * 40) % canvas.height;
          ctx.beginPath();
          ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Trapped Terrestrial Infrared Photons (Red)
        ctx.fillStyle = '#EF4444';
        for (let i = 0; i < 8; i++) {
          const rx = 100 + i * 60;
          const ry = canvas.height - ((t * 50 + i * 30) % (canvas.height * 0.4));
          ctx.beginPath();
          ctx.arc(rx, ry, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeLab, glacier, ocean, forest, atmosphere]);

  return (
    <div className="space-y-4">
      {/* 1. ECOSYSTEM LAB SELECTOR BAR */}
      <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs uppercase tracking-wider font-mono text-cyan-300 font-bold">
              Phase 4: Dedicated 3D Environmental Ecosystems
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
            4 Interactive Biome Chambers
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Glacier Lab Button */}
          <button
            onClick={() => {
              climateAudio.playSonarPing();
              setActiveLab('glacier');
            }}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeLab === 'glacier'
                ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900/50 border-slate-700/50 text-slate-300 hover:border-cyan-500/40'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeLab === 'glacier' ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
              <Snowflake className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold">Glacier Lab</div>
              <div className="text-[10px] font-mono text-slate-400">Cryosphere & Melt</div>
            </div>
          </button>

          {/* Ocean Lab Button */}
          <button
            onClick={() => {
              climateAudio.playSonarPing();
              setActiveLab('ocean');
            }}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeLab === 'ocean'
                ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900/50 border-slate-700/50 text-slate-300 hover:border-cyan-500/40'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeLab === 'ocean' ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold">Ocean Lab</div>
              <div className="text-[10px] font-mono text-slate-400">Corals & Acidification</div>
            </div>
          </button>

          {/* Forest Lab Button */}
          <button
            onClick={() => {
              climateAudio.playSonarPing();
              setActiveLab('forest');
            }}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeLab === 'forest'
                ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900/50 border-slate-700/50 text-slate-300 hover:border-cyan-500/40'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeLab === 'forest' ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
              <TreePine className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold">Forest Lab</div>
              <div className="text-[10px] font-mono text-slate-400">Canopy & Wildfire</div>
            </div>
          </button>

          {/* Atmosphere Lab Button */}
          <button
            onClick={() => {
              climateAudio.playSonarPing();
              setActiveLab('atmosphere');
            }}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeLab === 'atmosphere'
                ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900/50 border-slate-700/50 text-slate-300 hover:border-cyan-500/40'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeLab === 'atmosphere' ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold">Atmosphere Lab</div>
              <div className="text-[10px] font-mono text-slate-400">Infrared Trapping</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. DEDICATED VISUAL SIMULATION VIEWPORT */}
      <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
            Simulated Dynamic Biome Canvas
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Real-time Procedural Physics</span>
        </div>

        <div className="h-56 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative">
          <canvas ref={canvasRef} width={640} height={224} className="w-full h-full object-cover" />

          {/* Overlay controls for active lab */}
          {activeLab === 'glacier' && (
            <div className="absolute top-3 right-3">
              <button
                onClick={triggerCalving}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/50 text-white border border-cyan-400 text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                Calve Iceberg!
              </button>
            </div>
          )}

          {activeLab === 'forest' && (
            <div className="absolute top-3 right-3">
              <button
                onClick={toggleWildfire}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all active:scale-95 ${
                  forest.wildfireActive
                    ? 'bg-rose-500/40 border-rose-400 text-white'
                    : 'bg-amber-500/30 border-amber-400 text-amber-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                {forest.wildfireActive ? 'Extinguish Wildfire' : 'Ignite Wildfire Event'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. DEDICATED PARAMETER CONTROLS PER LAB */}
      <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 shadow-xl">
        {activeLab === 'glacier' && (
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
              Glacier Dynamics & Calving Controls
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Ambient Temp</span>
                <div className="text-base font-bold text-white font-mono">+{glacier.ambientTempC} °C</div>
                <input
                  type="range"
                  min={-15}
                  max={10}
                  step={0.5}
                  value={glacier.ambientTempC}
                  onChange={(e) => {
                    climateAudio.playTick();
                    setGlacier((prev) => ({ ...prev, ambientTempC: Number(e.target.value) }));
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 mt-2"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Ice Thickness</span>
                <div className="text-base font-bold text-white font-mono">{glacier.iceThicknessMeters} m</div>
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={10}
                  value={glacier.iceThicknessMeters}
                  onChange={(e) => {
                    climateAudio.playTick();
                    setGlacier((prev) => ({ ...prev, iceThicknessMeters: Number(e.target.value) }));
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 mt-2"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Sea Level Contribution</span>
                <div className="text-base font-bold text-cyan-400 font-mono">+{glacier.seaLevelContributionMm} mm</div>
                <div className="text-[10px] text-slate-500 mt-2">Cumulative meltwater discharge</div>
              </div>
            </div>
          </div>
        )}

        {activeLab === 'ocean' && (
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
              Ocean Chemistry & Coral Reef Bleaching
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Sea Surface Temp</span>
                <div className="text-base font-bold text-white font-mono">{ocean.surfaceTempC} °C</div>
                <input
                  type="range"
                  min={24}
                  max={34}
                  step={0.2}
                  value={ocean.surfaceTempC}
                  onChange={(e) => {
                    climateAudio.playTick();
                    const temp = Number(e.target.value);
                    const bleach = Math.max(0, Math.min(100, Math.round((temp - 27) * 16)));
                    setOcean((prev) => ({ ...prev, surfaceTempC: temp, coralBleachPercentage: bleach }));
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 mt-2"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Ocean Acidification (pH)</span>
                <div className="text-base font-bold text-rose-400 font-mono">{ocean.waterPh} pH</div>
                <input
                  type="range"
                  min={7.65}
                  max={8.25}
                  step={0.01}
                  value={ocean.waterPh}
                  onChange={(e) => {
                    climateAudio.playTick();
                    const ph = Number(e.target.value);
                    const arag = Number(((ph - 7.0) * 2.8).toFixed(1));
                    setOcean((prev) => ({ ...prev, waterPh: ph, aragoniteSaturation: arag }));
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400 mt-2"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Coral Bleaching</span>
                <div className="text-base font-bold text-amber-400 font-mono">{ocean.coralBleachPercentage}%</div>
                <div className="text-[10px] text-slate-500 mt-2">Aragonite Ω: {ocean.aragoniteSaturation}</div>
              </div>
            </div>
          </div>
        )}

        {activeLab === 'forest' && (
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
              Forest Biomass & Carbon Sink Sequestration
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Canopy Density</span>
                <div className="text-base font-bold text-white font-mono">{forest.canopyDensityPercent} %</div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={5}
                  value={forest.canopyDensityPercent}
                  onChange={(e) => {
                    climateAudio.playTick();
                    const dens = Number(e.target.value);
                    setForest((prev) => ({
                      ...prev,
                      canopyDensityPercent: dens,
                      carbonSequestrationGt: Number((dens * 0.05).toFixed(1)),
                      biodiversityIndex: Math.round(dens * 0.95),
                    }));
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 mt-2"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Carbon Uptake</span>
                <div className="text-base font-bold text-emerald-400 font-mono">+{forest.carbonSequestrationGt} Gt CO2/yr</div>
                <div className="text-[10px] text-slate-500 mt-2">Terrestrial biosphere sink</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Biodiversity Index</span>
                <div className="text-base font-bold text-cyan-400 font-mono">{forest.biodiversityIndex} / 100</div>
                <div className="text-[10px] text-slate-500 mt-2">Habitat integrity metric</div>
              </div>
            </div>
          </div>
        )}

        {activeLab === 'atmosphere' && (
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
              Atmospheric Stratification & Quantum Infrared Trapping
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">CO2 Concentration</span>
                <div className="text-base font-bold text-white font-mono">{atmosphere.co2Ppm} ppm</div>
                <input
                  type="range"
                  min={280}
                  max={900}
                  step={10}
                  value={atmosphere.co2Ppm}
                  onChange={(e) => {
                    climateAudio.playTick();
                    const co2 = Number(e.target.value);
                    const trap = Math.round(55 + (co2 - 280) * 0.05);
                    setAtmosphere((prev) => ({ ...prev, co2Ppm: co2, trappedInfraredPercent: trap }));
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 mt-2"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Trapped Infrared</span>
                <div className="text-base font-bold text-rose-400 font-mono">{atmosphere.trappedInfraredPercent} %</div>
                <div className="text-[10px] text-slate-500 mt-2">15 μm vibrational resonance</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Solar Constant</span>
                <div className="text-base font-bold text-yellow-400 font-mono">{atmosphere.solarIrradianceWm2} W/m²</div>
                <div className="text-[10px] text-slate-500 mt-2">Top of atmosphere flux</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
