import React, { useState, useEffect, useRef } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { Zap, Orbit } from 'lucide-react';

interface VortexParticle {
  angle: number;
  radius: number;
  speed: number;
  color: string;
}

export const JupiterLabScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('jupiter');

  // Great Red Spot vortex speed (km/h)
  const [vortexSpeed, setVortexSpeed] = useState<number>(432);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interactive Zonal Jet Streams & Great Red Spot Vortex Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: VortexParticle[] = [];

    // Create vortex particles
    for (let i = 0; i < 90; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 12 + Math.random() * 85,
        speed: (Math.random() * 0.02 + 0.01) * (vortexSpeed / 300),
        color: Math.random() > 0.4 ? '#F97316' : '#EA580C',
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // 1. Zonal Jet Stream Bands across top and bottom
      const bandHeight = 28;
      const totalBands = Math.ceil(canvas.height / bandHeight);
      for (let b = 0; b < totalBands; b++) {
        const isPrograde = b % 2 === 0;
        ctx.fillStyle = isPrograde ? 'rgba(234, 88, 12, 0.08)' : 'rgba(254, 215, 170, 0.04)';
        ctx.fillRect(0, b * bandHeight, canvas.width, bandHeight);

        // Subtle shear flow arrows
        ctx.fillStyle = 'rgba(248, 250, 252, 0.08)';
        ctx.font = '10px JetBrains Mono, monospace';
        const arrow = isPrograde ? '→ → → → → → → → → → →' : '← ← ← ← ← ← ← ← ← ← ←';
        ctx.fillText(arrow, 20, b * bandHeight + 18);
      }

      // 2. Great Red Spot Elliptical Storm Eye
      const spotGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 110);
      spotGrad.addColorStop(0, '#7C2D12');
      spotGrad.addColorStop(0.4, '#C2410C');
      spotGrad.addColorStop(0.8, '#EA580C');
      spotGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1.5, 0.9); // Elliptical anticyclone shape

      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 95, 0, Math.PI * 2);
      ctx.fill();

      // 3. Counter-Clockwise Vortex Swirl
      particles.forEach((p) => {
        p.angle -= p.speed * (vortexSpeed / 350);
        const px = Math.cos(p.angle) * p.radius;
        const py = Math.sin(p.angle) * p.radius;

        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [vortexSpeed]);

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-6 w-full">
        {/* Module Header Banner */}
        <div className="rounded-3xl border border-[#F97316]/30 bg-gradient-to-r from-[#200D04] via-[#05070D] to-[#1A0A02] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#F97316] animate-ping" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#F97316]">
                  JOVIAN FLUID DYNAMICS & ANTICYCLONE LAB
                </span>
              </div>
              <h1 className="mt-1 font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                Jupiter Atmospheric Jet Streams & Great Red Spot
              </h1>
              <p className="mt-1 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                Explore the fluid mechanics of the Solar System's giant planet. 
                Jupiter's 9.93-hour rapid rotation generates powerful counter-rotating zonal wind bands 
                and feeds the 300-year-old anticyclonic vortex: the Great Red Spot.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#F97316]/10 border border-[#F97316]/30 px-3.5 py-1.5 font-mono text-xs font-bold text-[#F97316]">
                16,000 KM STORM DIAMETER
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Experiment Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vortex Simulation Canvas */}
          <div className="lg:col-span-2 relative aspect-[16/10] min-h-[340px] rounded-3xl border border-white/10 bg-[#0A0502] shadow-2xl overflow-hidden flex flex-col justify-between p-4">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#F97316]" />
                <span className="font-mono text-xs font-semibold text-[#F8FAFC]">
                  ANTICYCLONIC SHEAR SIMULATOR
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-black/60 border border-white/10 px-2.5 py-0.5 font-mono text-[10px] text-[#CBD5E1]">
                  Vortex: Counter-Clockwise
                </span>
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
            <div className="z-10 flex items-center justify-between border-t border-white/5 pt-2 text-[10.5px] font-mono text-[#94A3B8]">
              <span>Axial Spin: 9h 55m (Fastest in System)</span>
              <span>Phosphine Chromophore Upwelling</span>
              <span>Storm Lifespan: &gt; 350 Years</span>
            </div>
          </div>

          {/* Right Column: Anticyclone Controls & Jovian Magnetosphere */}
          <div className="flex flex-col gap-5">
            {/* Speed Scrubber */}
            <div className="rounded-2xl border border-white/10 bg-[#05070D]/85 p-5 shadow-xl backdrop-blur-xl">
              <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                Vortex Wind Speed Scrubber
              </h3>

              <div className="mt-3 flex flex-col gap-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-[#94A3B8]">Anticyclonic Jet Speed</span>
                  <span className="font-bold text-[#F97316]">{vortexSpeed} km/h</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="680"
                  step="10"
                  value={vortexSpeed}
                  onChange={(e) => setVortexSpeed(parseInt(e.target.value, 10))}
                  aria-label="Vortex wind speed"
                  className="h-2 w-full appearance-none rounded-lg bg-white/10 accent-[#F97316] cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[9px] text-[#94A3B8]">
                  <span>Calm Haze (200 km/h)</span>
                  <span>Peak Gale (680 km/h)</span>
                </div>
              </div>

              {/* Physical Telemetry */}
              <div className="mt-4 flex flex-col gap-2 font-mono text-xs border-t border-white/5 pt-3">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#94A3B8]">Coriolis Parameter:</span>
                  <span className="text-[#F8FAFC] font-bold">2.4 × 10⁻⁴ s⁻¹</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#94A3B8]">Storm Depth:</span>
                  <span className="text-[#38BDF8] font-bold">300 to 500 km</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#94A3B8]">Earth Volumes:</span>
                  <span className="text-[#10B981] font-bold">1.3 × Earth Diameter</span>
                </div>
              </div>
            </div>

            {/* Jovian Magnetic Dynamo */}
            <div className="rounded-2xl border border-white/10 bg-[#05070D]/85 p-5 shadow-xl backdrop-blur-xl font-mono text-xs">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                <Orbit className="h-4 w-4 text-[#F59E0B]" />
                <h4 className="font-sans text-sm font-bold text-[#F8FAFC]">
                  Metallic Hydrogen Dynamo
                </h4>
              </div>
              <p className="mt-2.5 text-[11px] font-sans text-[#94A3B8] leading-relaxed">
                Deep within Jupiter, pressures exceed 4 million atmospheres, forcing hydrogen into an electrically conducting liquid metal state. This creates a magnetic field 20,000 times stronger than Earth's!
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
};
