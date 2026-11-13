import React, { useState, useEffect, useRef } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { Thermometer, Wind, Flame, ShieldAlert, Sparkles } from 'lucide-react';

interface Photon {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'solar' | 'infrared';
}

export const VenusClimateScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('venus');

  // Slider state for atmospheric CO2 fraction (0.04% to 96.5%)
  const [co2Percent, setCo2Percent] = useState<number>(96.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compute physical runaway greenhouse properties
  const tFraction = co2Percent / 96.5;
  const surfaceTempC = Math.round(15 + tFraction * 449);
  const pressureBar = (1.0 + tFraction * 91.0).toFixed(1);
  const isLeadMelting = surfaceTempC >= 327;
  const isSupercritical = parseFloat(pressureBar) >= 73.8;

  // Interactive Photon Radiation Simulation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const photons: Photon[] = [];

    // Spawn photons
    const spawnTimer = setInterval(() => {
      if (photons.length < 50) {
        // Incoming visible sunlight photon
        photons.push({
          x: Math.random() * canvas.width,
          y: 0,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 2.5 + Math.random() * 1.5,
          type: 'solar',
        });
      }
    }, 180);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Atmospheric cloud haze gradient
      const hazeGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      const density = (co2Percent / 100) * 0.7;
      hazeGrad.addColorStop(0, `rgba(234, 179, 8, ${0.1 + density * 0.2})`);
      hazeGrad.addColorStop(0.7, `rgba(202, 138, 4, ${0.2 + density * 0.4})`);
      hazeGrad.addColorStop(1, `rgba(180, 83, 9, ${0.4 + density * 0.5})`);
      ctx.fillStyle = hazeGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ground Surface
      ctx.fillStyle = '#261E0A';
      ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
      ctx.strokeStyle = '#EAB308';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 30);
      ctx.lineTo(canvas.width, canvas.height - 30);
      ctx.stroke();

      // Update and draw photons
      for (let i = photons.length - 1; i >= 0; i--) {
        const p = photons[i];
        p.x += p.vx;
        p.y += p.vy;

        // When solar photon strikes surface, convert into thermal infrared photon!
        if (p.type === 'solar' && p.y >= canvas.height - 32) {
          p.type = 'infrared';
          p.vy = -(1.2 + Math.random() * 1.2);
          p.vx = (Math.random() - 0.5) * 3;
        }

        // If infrared photon encounters CO2, chance of reflection back downward
        if (p.type === 'infrared' && p.y < canvas.height - 60 && p.y > 60) {
          const trapProbability = (co2Percent / 100) * 0.045;
          if (Math.random() < trapProbability) {
            p.vy = Math.abs(p.vy); // Reflect back down!
          }
        }

        // Draw photon
        ctx.fillStyle = p.type === 'solar' ? '#FEF08A' : '#EF4444';
        ctx.shadowColor = p.type === 'solar' ? '#FDE047' : '#DC2626';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.type === 'solar' ? 3.5 : 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Remove offscreen
        if (p.y < 0 || p.x < 0 || p.x > canvas.width) {
          photons.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      clearInterval(spawnTimer);
      cancelAnimationFrame(animId);
    };
  }, [co2Percent]);

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-6 w-full">
        {/* Module Header Banner */}
        <div className="rounded-3xl border border-[#EAB308]/30 bg-gradient-to-r from-[#1A1408] via-[#05070D] to-[#261E0A] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#EAB308] animate-ping" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#EAB308]">
                  ATMOSPHERIC SPECTROSCOPY & RUNAWAY GREENHOUSE
                </span>
              </div>
              <h1 className="mt-1 font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                Venus Planetary Climate Station
              </h1>
              <p className="mt-1 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                Investigate how high concentrations of carbon dioxide trap thermal infrared radiation. 
                Surface temperatures exceed 464°C—hot enough to melt metallic lead—while atmospheric pressure converts gases into supercritical fluid.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#EAB308]/10 border border-[#EAB308]/30 px-3.5 py-1.5 font-mono text-xs font-bold text-[#EAB308]">
                96.5% CO₂ CONCENTRATION
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Experiment Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photon Greenhouse Chamber Canvas */}
          <div className="lg:col-span-2 relative aspect-[16/10] min-h-[340px] rounded-3xl border border-white/10 bg-[#080C1A] shadow-2xl overflow-hidden flex flex-col justify-between p-4">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#EAB308]" />
                <span className="font-mono text-xs font-semibold text-[#F8FAFC]">
                  RADIATIVE TRANSFER CHAMBER
                </span>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEF08A]" />
                  <span className="text-[#CBD5E1]">Solar Photons</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                  <span className="text-[#CBD5E1]">Trapped Infrared</span>
                </div>
              </div>
            </div>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={640}
              height={400}
              className="absolute inset-0 h-full w-full"
            />

            {/* Bottom Status */}
            <div className="z-10 flex items-center justify-between border-t border-white/10 pt-2 text-[10.5px] font-mono text-[#94A3B8]">
              <span>Incoming Solar Flux: 2,613 W/m²</span>
              <span>Sulfuric Acid Cloud Deck: 48 - 68 km</span>
              <span>IR Thermal Trap Efficiency: {(co2Percent / 96.5 * 99.2).toFixed(1)}%</span>
            </div>
          </div>

          {/* Right Column: Interactive Sliders & Telemetry Dials */}
          <div className="flex flex-col gap-5">
            {/* Concentration Controller */}
            <div className="rounded-2xl border border-white/10 bg-[#05070D]/85 p-5 shadow-xl backdrop-blur-xl">
              <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                Atmospheric Composition Scrubber
              </h3>

              <div className="mt-3 flex flex-col gap-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-[#94A3B8]">Carbon Dioxide (CO₂)</span>
                  <span className="font-bold text-[#EAB308]">{co2Percent}%</span>
                </div>
                <input
                  type="range"
                  min="0.04"
                  max="96.5"
                  step="0.5"
                  value={co2Percent}
                  onChange={(e) => setCo2Percent(parseFloat(e.target.value))}
                  aria-label="Carbon dioxide percentage"
                  className="h-2 w-full appearance-none rounded-lg bg-white/10 accent-[#EAB308] cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[9px] text-[#94A3B8]">
                  <span>Earth Baseline (0.04%)</span>
                  <span>Venus Extreme (96.5%)</span>
                </div>
              </div>

              {/* Physical Reactions */}
              <div className="mt-4 flex flex-col gap-3 font-mono text-xs border-t border-white/5 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#94A3B8] flex items-center gap-1.5">
                    <Thermometer className="h-3.5 w-3.5 text-[#EF4444]" />
                    <span>Equilibrium Temp:</span>
                  </span>
                  <span className="font-bold text-[#F8FAFC]">{surfaceTempC}°C</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#94A3B8] flex items-center gap-1.5">
                    <Wind className="h-3.5 w-3.5 text-[#38BDF8]" />
                    <span>Surface Pressure:</span>
                  </span>
                  <span className="font-bold text-[#F8FAFC]">{pressureBar} bar</span>
                </div>

                {/* State Indicators */}
                {isLeadMelting && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 p-2.5 text-[11px] text-red-300">
                    <Flame className="h-4 w-4 text-red-400 shrink-0" />
                    <span>Thermal threshold exceeded: Solid lead melts into liquid puddle (327°C)</span>
                  </div>
                )}

                {isSupercritical && (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 p-2.5 text-[11px] text-amber-300">
                    <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Supercritical transition: Gas compressed into dense supercritical fluid</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
};
