import React, { useState, useEffect, useRef } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { Disc } from 'lucide-react';

interface RingZone {
  name: string;
  radiusKm: string;
  thickness: string;
  opticalDepth: string;
  description: string;
  color: string;
  innerR: number;
  outerR: number;
}

const RING_ZONES: RingZone[] = [
  {
    name: 'C Ring (Crepe Ring)',
    radiusKm: '74,658 – 92,000 km',
    thickness: '5 meters thin',
    opticalDepth: '0.12 (Semi-transparent)',
    description: 'Translucent amber ring containing darker, silicate-polluted water ice particles.',
    color: '#D97706',
    innerR: 50,
    outerR: 75,
  },
  {
    name: 'B Ring (Densest & Brightest)',
    radiusKm: '92,000 – 117,580 km',
    thickness: '5 to 10 meters',
    opticalDepth: '2.50 (Opaque & reflective)',
    description: 'The most massive ring component; casts deep, crisp shadows onto Saturn’s atmosphere.',
    color: '#FDE047',
    innerR: 75,
    outerR: 120,
  },
  {
    name: 'Cassini Division',
    radiusKm: '117,580 – 122,170 km',
    thickness: '4,590 km wide gap',
    opticalDepth: '0.08 (Cleared resonance gap)',
    description: 'Gravitational 2:1 orbital resonance with moon Mimas clears particles out of this channel.',
    color: '#080C1A',
    innerR: 120,
    outerR: 130,
  },
  {
    name: 'A Ring',
    radiusKm: '122,170 – 136,775 km',
    thickness: '10 to 30 meters',
    opticalDepth: '0.60 (Bright outer band)',
    description: 'Houses the Encke Gap (325 km wide) kept open by the tiny shepherd moon Pan.',
    color: '#FCD34D',
    innerR: 130,
    outerR: 165,
  },
];

interface RingParticle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  alpha: number;
}

export const SaturnArtScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('saturn');
  const [activeZone, setActiveZone] = useState<RingZone>(RING_ZONES[1]); // B Ring default
  const [iceGrainSize, setIceGrainSize] = useState<number>(25); // cm
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interactive Ring Particle Dynamics Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: RingParticle[] = [];

    // Spawn 180 ring particles across concentric orbits
    for (let i = 0; i < 220; i++) {
      const isGap = Math.random() < 0.08;
      const radius = isGap
        ? 120 + Math.random() * 10 // Cassini division gap (sparse)
        : 50 + Math.random() * 115;

      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius,
        speed: (2.4 / Math.sqrt(radius)) * 0.035, // Keplerian orbital velocity v ~ 1/sqrt(r)
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // 1. Saturn Central Globe
      const saturnGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 38);
      saturnGrad.addColorStop(0, '#FEF08A');
      saturnGrad.addColorStop(0.6, '#F59E0B');
      saturnGrad.addColorStop(1, '#92400E');

      ctx.fillStyle = saturnGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.fill();

      // Shadow on Saturn Globe from Rings
      ctx.fillStyle = 'rgba(5, 7, 13, 0.45)';
      ctx.beginPath();
      ctx.arc(cx, cy, 38, -Math.PI * 0.15, Math.PI * 0.15);
      ctx.fill();

      // 2. Concentric Ring Structure Bands
      RING_ZONES.forEach((zone) => {
        const isFocused = zone.name === activeZone.name;
        ctx.strokeStyle = isFocused ? `${zone.color}90` : `${zone.color}25`;
        ctx.lineWidth = zone.outerR - zone.innerR;
        ctx.beginPath();
        ctx.arc(cx, cy, (zone.innerR + zone.outerR) / 2, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 3. Render and animate individual water-ice particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.radius;
        const py = cy + Math.sin(p.angle) * p.radius;

        // Check if inside active zone
        const inActiveZone = p.radius >= activeZone.innerR && p.radius <= activeZone.outerR;

        ctx.fillStyle = inActiveZone ? '#FFFFFF' : '#FDE68A';
        ctx.globalAlpha = inActiveZone ? 0.95 : p.alpha * 0.5;
        ctx.beginPath();
        ctx.arc(px, py, inActiveZone ? p.size * (iceGrainSize / 20) : p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeZone, iceGrainSize]);

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-6 w-full">
        {/* Module Header Banner */}
        <div className="rounded-3xl border border-[#F59E0B]/30 bg-gradient-to-r from-[#201804] via-[#05070D] to-[#1A1202] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#F59E0B] animate-ping" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#F59E0B]">
                  SATURNIAN RING DYNAMICS & CASSINI RESONANCE
                </span>
              </div>
              <h1 className="mt-1 font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                Saturn Ring Architecture & Ice Particle Acoustics
              </h1>
              <p className="mt-1 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                Analyze the most exquisite ring system in the Solar System. 
                Spanning 282,000 km across yet averaging just 10 meters thick, 
                Saturn's rings are 99% pure water ice particles carved by gravitational orbital resonances.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-3.5 py-1.5 font-mono text-xs font-bold text-[#F59E0B]">
                282,000 KM DIAMETER // 10M THIN
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ring Particle Dynamics Canvas */}
          <div className="lg:col-span-2 relative aspect-[16/10] min-h-[340px] rounded-3xl border border-white/10 bg-[#080C1A] shadow-2xl overflow-hidden flex flex-col justify-between p-4">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Disc className="h-4 w-4 text-[#F59E0B]" />
                <span className="font-mono text-xs font-semibold text-[#F8FAFC]">
                  KEPLERIAN RING PARTICLE RADAR
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-black/60 border border-white/10 px-2.5 py-0.5 font-mono text-[10px] text-[#CBD5E1]">
                  Active Focus: {activeZone.name}
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
              <span>Composition: 99% Pure H₂O Ice</span>
              <span>Gravitational Shepherd: Moon Pan in Encke Gap</span>
              <span>Ring Mass: 1.5 × 10¹⁹ kg</span>
            </div>
          </div>

          {/* Right Column: Ring Zone Selector & Ice Granulometry */}
          <div className="flex flex-col gap-5">
            {/* Zone Selector */}
            <div className="rounded-2xl border border-white/10 bg-[#05070D]/85 p-5 shadow-xl backdrop-blur-xl">
              <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                Ring Zone Structural Analysis
              </h3>

              <div className="mt-3 flex flex-col gap-2">
                {RING_ZONES.map((zone) => (
                  <button
                    key={zone.name}
                    type="button"
                    onClick={() => setActiveZone(zone)}
                    className={`flex flex-col text-left rounded-xl border p-2.5 transition-all ${
                      activeZone.name === zone.name
                        ? 'border-[#F59E0B] bg-[#F59E0B]/15 shadow-md'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-xs font-bold text-[#F8FAFC]">
                        {zone.name}
                      </span>
                      <span className="font-mono text-[9.5px] text-[#94A3B8]">
                        {zone.thickness}
                      </span>
                    </div>
                    <span className="mt-1 font-mono text-[10px] text-[#38BDF8]">
                      {zone.radiusKm}
                    </span>
                    <p className="mt-1 text-[11px] font-sans text-[#94A3B8] leading-tight">
                      {zone.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Granulometry Slider */}
              <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-3">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-[#94A3B8]">Ice Particle Mean Diameter</span>
                  <span className="font-bold text-[#F59E0B]">{iceGrainSize} cm</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={iceGrainSize}
                  onChange={(e) => setIceGrainSize(parseInt(e.target.value, 10))}
                  aria-label="Ice grain size in centimeters"
                  className="h-2 w-full appearance-none rounded-lg bg-white/10 accent-[#F59E0B] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
};
