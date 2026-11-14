import React, { useState, useEffect, useRef } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { Wind, Flame } from 'lucide-react';

interface StormParticle {
  x: number;
  y: number;
  speed: number;
  size: number;
}

export const NeptuneDiscoveryScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('neptune');

  // Supersonic wind gauge state
  const [windGaugeKmH, setWindGaugeKmH] = useState<number>(2100);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const machSpeed = (windGaugeKmH / 1235).toFixed(1);

  // Interactive Supersonic Shockwave & Dark Spot Storm Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: StormParticle[] = [];

    // Create supersonic methane cloud particles
    for (let i = 0; i < 110; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: (Math.random() * 4 + 6) * (windGaugeKmH / 2100),
        size: Math.random() * 2 + 1,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep Azure Atmospheric Gradient
      const atmoGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      atmoGrad.addColorStop(0, '#031126');
      atmoGrad.addColorStop(0.5, '#0B2545');
      atmoGrad.addColorStop(1, '#031126');
      ctx.fillStyle = atmoGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Great Dark Spot Storm Eye
      const cx = canvas.width * 0.45;
      const cy = canvas.height * 0.52;
      const spotGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 75);
      spotGrad.addColorStop(0, '#020914');
      spotGrad.addColorStop(0.6, '#081D3B');
      spotGrad.addColorStop(1, 'rgba(11, 37, 69, 0)');

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1.8, 1.0);
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 65, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // White Companion Cirrus Clouds (Scooter)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.ellipse(cx + 60, cy - 20, 35, 8, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Supersonic Jet Particles with trailing streaks
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.6)';
      ctx.lineWidth = 1.5;

      particles.forEach((p) => {
        p.speed = (p.speed * 0.95) + ((Math.random() * 3 + 5) * (windGaugeKmH / 2100) * 0.05);
        p.x += p.speed;

        if (p.x > canvas.width) {
          p.x = 0;
          p.y = Math.random() * canvas.height;
        }

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.speed * 3.5, p.y);
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [windGaugeKmH]);

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-6 w-full">
        {/* Module Header Banner */}
        <div className="rounded-3xl border border-[#3B82F6]/30 bg-gradient-to-r from-[#03152E] via-[#05070D] to-[#0A2540] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#3B82F6] animate-ping" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#60A5FA]">
                  SUPERSONIC JET STREAM DYNAMICS & DARK SPOT OBSERVATORY
                </span>
              </div>
              <h1 className="mt-1 font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                Neptune Supersonic Dynamics & Deep Space Gateway
              </h1>
              <p className="mt-1 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                Orbiting at 30 AU at the frontier of the planetary realm, Neptune harbors the most violent supersonic winds in the Solar System, 
                powered by deep primordial heat radiating from its core.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 px-3.5 py-1.5 font-mono text-xs font-bold text-[#60A5FA]">
                2,100 KM/H WINDS // MACH 1.7
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Supersonic Jet Stream Simulation Canvas */}
          <div className="lg:col-span-2 relative aspect-[16/10] min-h-[340px] rounded-3xl border border-white/10 bg-[#020B17] shadow-2xl overflow-hidden flex flex-col justify-between p-4">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-[#60A5FA]" />
                <span className="font-mono text-xs font-semibold text-[#F8FAFC]">
                  SUPERSONIC WIND TUNNEL RADAR
                </span>
              </div>

              <span className="rounded-full bg-black/60 border border-white/10 px-2.5 py-0.5 font-mono text-[10px] text-[#60A5FA]">
                Mach {machSpeed} Velocity
              </span>
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
              <span>Methane Ice Cirrus Clouds (&quot;Scooter&quot;)</span>
              <span>Retrograde Supersonic Equator Flow</span>
              <span>Distance to Sol: 4.5 Billion km (30.1 AU)</span>
            </div>
          </div>

          {/* Right Column: Supersonic Gauge & Internal Heat Dynamo */}
          <div className="flex flex-col gap-5">
            {/* Wind Velocity Controller */}
            <div className="rounded-2xl border border-white/10 bg-[#05070D]/85 p-5 shadow-xl backdrop-blur-xl">
              <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                Atmospheric Jet Velocity Scrubber
              </h3>

              <div className="mt-3 flex flex-col gap-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-[#94A3B8]">Equatorial Wind Speed</span>
                  <span className="font-bold text-[#60A5FA]">{windGaugeKmH} km/h</span>
                </div>
                <input
                  type="range"
                  min="600"
                  max="2400"
                  step="50"
                  value={windGaugeKmH}
                  onChange={(e) => setWindGaugeKmH(parseInt(e.target.value, 10))}
                  aria-label="Equatorial wind velocity in km/h"
                  className="h-2 w-full appearance-none rounded-lg bg-white/10 accent-[#60A5FA] cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[9px] text-[#94A3B8]">
                  <span>Subsonic (600 km/h)</span>
                  <span>Peak Supersonic (2,400 km/h)</span>
                </div>
              </div>

              {/* Physical Telemetry */}
              <div className="mt-4 flex flex-col gap-2 font-mono text-xs border-t border-white/5 pt-3">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#94A3B8]">Mach Ratio:</span>
                  <span className="text-[#F8FAFC] font-bold">Mach {machSpeed}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#94A3B8]">Atmosphere Temp:</span>
                  <span className="text-[#38BDF8] font-bold">-218°C (55 K)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#94A3B8]">Kuiper Belt Portal:</span>
                  <span className="text-[#10B981] font-bold">Triton Retrograde Orbit</span>
                </div>
              </div>
            </div>

            {/* Internal Heat Engine Insight */}
            <div className="rounded-2xl border border-white/10 bg-[#05070D]/85 p-5 shadow-xl backdrop-blur-xl font-mono text-xs">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                <Flame className="h-4 w-4 text-[#F59E0B]" />
                <h4 className="font-sans text-sm font-bold text-[#F8FAFC]">
                  Internal Heat Anomaly
                </h4>
              </div>
              <p className="mt-2.5 text-[11px] font-sans text-[#94A3B8] leading-relaxed">
                Despite being 4.5 billion km from the Sun, Neptune radiates 2.61 times more heat than it receives from sunlight. This internal convective thermal heat engine powers its supersonic jet streams!
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
};
