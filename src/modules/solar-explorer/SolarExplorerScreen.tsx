import React, { useState, useEffect, useRef } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { Thermometer, Orbit, Flame, Snowflake, Play, Pause } from 'lucide-react';

export const SolarExplorerScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('mercury');
  const [selectedBodyId, setSelectedBodyId] = useState<string>('mercury');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeBody = CELESTIAL_BODIES.find((b) => b.id === selectedBodyId) || CELESTIAL_BODIES[1];

  // Interactive Keplerian Orbital Simulation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Sol in center
      const sunGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 24);
      sunGrad.addColorStop(0, '#FFFBF2');
      sunGrad.addColorStop(0.4, '#FDE047');
      sunGrad.addColorStop(0.8, '#F59E0B');
      sunGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');

      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.fill();

      // Draw Orbit Trajectories & Revolving Planets (Mercury, Earth, Jupiter, Neptune)
      const bodiesToSim = [
        { name: 'Mercury', r: 48, speed: 4.74, color: '#94A3B8', size: 4 },
        { name: 'Earth', r: 92, speed: 2.98, color: '#38BDF8', size: 6 },
        { name: 'Jupiter', r: 155, speed: 1.31, color: '#F97316', size: 12 },
        { name: 'Neptune', r: 215, speed: 0.54, color: '#60A5FA', size: 8 },
      ];

      bodiesToSim.forEach((b) => {
        // Orbit ring
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, b.r, 0, Math.PI * 2);
        ctx.stroke();

        // Planet pos
        const theta = angle * (b.speed * 0.02);
        const px = cx + Math.cos(theta) * b.r;
        const py = cy + Math.sin(theta) * b.r;

        // Draw Planet Body
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(px, py, b.size, 0, Math.PI * 2);
        ctx.fill();

        // Halo
        ctx.strokeStyle = `${b.color}80`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#94A3B8';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(`${b.name}`, px + b.size + 4, py + 3);
      });

      if (isPlaying) {
        angle += 1;
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-6 w-full">
        {/* Module Header Banner */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#1E293B] via-[#05070D] to-[#0F172A] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#94A3B8] animate-ping" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#94A3B8]">
                  KEPLERIAN VELOCITY & ORBITAL SCALE CHAMBER
                </span>
              </div>
              <h1 className="mt-1 font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                Mercury & Inner System Physics
              </h1>
              <p className="mt-1 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                Observe Kepler's Third Law in real-time simulation. 
                Mercury orbits at a blistering 47.4 km/s while experiencing a 610°C thermal delta between scorch and permanent ice shadows.
              </p>
            </div>

            {/* Quick Planet Switcher */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CELESTIAL_BODIES.filter((b) => b.id !== 'sun').map((body) => (
                <button
                  key={body.id}
                  type="button"
                  onClick={() => setSelectedBodyId(body.id)}
                  className={`rounded-full px-3 py-1 font-mono text-xs transition-all ${
                    selectedBodyId === body.id
                      ? 'border border-[#94A3B8] bg-[#94A3B8]/20 font-bold text-[#F8FAFC]'
                      : 'border border-white/5 bg-white/[0.02] text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
                  }`}
                >
                  {body.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Kepler Orbit Simulation Canvas */}
          <div className="lg:col-span-2 relative aspect-[16/10] min-h-[320px] rounded-3xl border border-white/10 bg-[#080C1A] shadow-2xl overflow-hidden flex flex-col justify-between p-4">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Orbit className="h-4 w-4 text-[#38BDF8]" />
                <span className="font-mono text-xs font-semibold text-[#F8FAFC]">
                  LIVE KEPLER VELOCITY RADAR
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Resume'}</span>
              </button>
            </div>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={640}
              height={400}
              className="absolute inset-0 h-full w-full"
            />

            {/* Bottom Simulation Telemetry */}
            <div className="z-10 flex items-center justify-between border-t border-white/5 pt-2 text-[10.5px] font-mono text-[#94A3B8]">
              <span>Mercury: 47.4 km/s (88 Earth Days)</span>
              <span>Earth: 29.8 km/s (365.25 Days)</span>
              <span>Neptune: 5.4 km/s (164.8 Years)</span>
            </div>
          </div>

          {/* Right Column: Thermal Delta & Active Planet Dossier */}
          <div className="flex flex-col gap-5">
            {/* Thermal Range Simulator */}
            <div className="rounded-2xl border border-white/10 bg-[#05070D]/85 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Thermometer className="h-4 w-4 text-[#F59E0B]" />
                <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                  Thermal Extremes: Scorched Day vs Cryo-Night
                </h3>
              </div>

              <div className="mt-4 flex flex-col gap-4 font-mono text-xs">
                {/* Day Side */}
                <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-red-400" />
                    <span className="text-[#F8FAFC]">Subsolar Day</span>
                  </div>
                  <span className="font-bold text-red-400">+430°C (800°F)</span>
                </div>

                {/* Night Side */}
                <div className="flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
                  <div className="flex items-center gap-2">
                    <Snowflake className="h-4 w-4 text-blue-400" />
                    <span className="text-[#F8FAFC]">Polar Shadow</span>
                  </div>
                  <span className="font-bold text-blue-400">-180°C (-290°F)</span>
                </div>

                <p className="text-[11px] font-sans text-[#94A3B8] leading-relaxed">
                  With virtually no atmosphere to circulate heat, Mercury experiences the sharpest thermal gradient in the Solar System. Water ice survives undisturbed in deep polar craters!
                </p>
              </div>
            </div>

            {/* Active Body Metrics */}
            <div className="rounded-2xl border border-white/10 bg-[#05070D]/85 p-5 shadow-xl backdrop-blur-xl font-mono text-xs">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: activeBody.visual.primaryColor }}
                />
                <h4 className="font-sans text-sm font-bold text-[#F8FAFC]">
                  {activeBody.name} Astrophysics
                </h4>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#94A3B8]">Distance:</span>
                  <span className="text-[#38BDF8] font-bold">{activeBody.physical.realDistanceAU} AU</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#94A3B8]">Diameter:</span>
                  <span className="text-[#F8FAFC]">{activeBody.physical.realDiameterKm}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#94A3B8]">Surface Gravity:</span>
                  <span className="text-[#F59E0B] font-bold">{activeBody.physical.surfaceGravityMs2} m/s²</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#94A3B8]">Orbital Period:</span>
                  <span className="text-[#10B981] font-bold">{activeBody.physical.orbitalPeriodDays} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
};
