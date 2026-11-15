import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { TelemetryBadge } from '../../../components/ui/TelemetryBadge';
import { SpaceButton } from '../../../components/ui/SpaceButton';
import { SOLAR_FLARE_CLASSES, SolarFlareClass } from '../labData';
import {
  Flame,
  Sun,
  Play,
  Pause,
  RotateCcw,
  Radio,
} from 'lucide-react';

interface SolarPhysicsChamberProps {
  onLogTelemetry: (msg: string) => void;
  onMilestoneAchieved: (milestoneId: string) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export const SolarPhysicsChamber: React.FC<SolarPhysicsChamberProps> = ({
  onLogTelemetry,
  onMilestoneAchieved,
}) => {
  // Solar Dynamic Controls
  const [coreActivity, setCoreActivity] = useState<number>(100); // 80% - 150%
  const [magneticField, setMagneticField] = useState<number>(3.5); // 1.0 - 10.0 Tesla equivalent
  const [sunspotCount, setSunspotCount] = useState<number>(45); // 0 - 180 spots
  const [selectedFlareClass, setSelectedFlareClass] = useState<SolarFlareClass>(SOLAR_FLARE_CLASSES[1]); // M-Class

  // Playback & Flare Detonation State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFlareActive, setIsFlareActive] = useState<boolean>(false);
  const [flareProgress, setFlareProgress] = useState<number>(0);

  // Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Scientific Calculated Readouts
  // Photosphere base temperature 5,778 K modulated by core activity
  const photosphereTempK = Math.round(5778 * Math.pow(coreActivity / 100, 0.25));
  // Corona base 1.5M K modulated by magnetic field reconnection
  const coronaTempMK = (1.2 + magneticField * 0.16).toFixed(2);
  // Solar Constant S0 = 1361 W/m^2 modulated
  const solarConstantWm2 = Math.round(1361 * (coreActivity / 100) * (1 + (sunspotCount > 50 ? 0.001 : -0.001)));
  // Solar wind speed (normal: 400 - 500 km/s; flare: up to 1850 km/s)
  const solarWindSpeedKmS = isFlareActive
    ? Math.round(selectedFlareClass.cmeVelocityKmS * (0.8 + flareProgress * 0.4))
    : Math.round(400 + magneticField * 18);

  // Trigger Solar Flare Event
  const handleTriggerFlare = () => {
    setIsFlareActive(true);
    setFlareProgress(0);

    onLogTelemetry(
      `SOLAR_FLUX: Triggered ${selectedFlareClass.name}. Flux: ${selectedFlareClass.peakFlux}, CME speed: ${selectedFlareClass.cmeVelocityKmS} km/s`
    );

    // Trigger milestone if X-Class
    if (selectedFlareClass.grade === 'X') {
      onMilestoneAchieved('solar-flare-trigger');
    }

    // Spawn massive burst of plasma particles
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const burstCount = selectedFlareClass.grade === 'X' ? 180 : selectedFlareClass.grade === 'M' ? 90 : 45;

    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.4;
      const speed = (selectedFlareClass.cmeVelocityKmS / 180) * (0.7 + Math.random() * 0.8);
      particlesRef.current.push({
        x: cx + Math.cos(angle) * 60,
        y: cy + Math.sin(angle) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 60 + Math.random() * 40,
        size: 2.5 + Math.random() * 3,
        color: selectedFlareClass.grade === 'X' ? '#EF4444' : selectedFlareClass.grade === 'M' ? '#F59E0B' : '#38BDF8',
      });
    }

    // Flare duration timeout
    setTimeout(() => {
      setIsFlareActive(false);
      setFlareProgress(0);
    }, 4500);
  };

  // Milestone triggers
  useEffect(() => {
    if (solarConstantWm2 >= 1350 && solarConstantWm2 <= 1375) {
      onMilestoneAchieved('solar-irradiance');
    }
  }, [solarConstantWm2, onMilestoneAchieved]);

  // Reset
  const handleReset = () => {
    setCoreActivity(100);
    setMagneticField(3.5);
    setSunspotCount(45);
    setIsFlareActive(false);
    particlesRef.current = [];
    setIsPlaying(true);
    onLogTelemetry('SOLAR_SIM: Re-initialized quiet Sun baseline parameters');
  };

  // Sun Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let t = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const sunRadius = 68;

      ctx.clearRect(0, 0, w, h);

      // Deep space void
      ctx.fillStyle = '#02050E';
      ctx.fillRect(0, 0, w, h);

      if (isPlaying) t += 0.02;

      // 1. Dynamic Outer Solar Corona Glow
      const coronaScale = 1 + (magneticField / 20) + (isFlareActive ? 0.3 : 0);
      const coronaGrad = ctx.createRadialGradient(
        cx,
        cy,
        sunRadius * 0.9,
        cx,
        cy,
        sunRadius * 3.2 * coronaScale
      );
      coronaGrad.addColorStop(0, '#FEF08A');
      coronaGrad.addColorStop(0.2, '#F59E0B');
      coronaGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.35)');
      coronaGrad.addColorStop(1, 'rgba(3, 6, 17, 0)');

      ctx.save();
      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, sunRadius * 3.2 * coronaScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Coronal Magnetic Loops
      const loopCount = Math.round(6 + magneticField * 1.5);
      ctx.save();
      ctx.strokeStyle = isFlareActive ? '#EF4444' : 'rgba(254, 240, 138, 0.4)';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 8;

      for (let i = 0; i < loopCount; i++) {
        const loopAngle = (i * Math.PI * 2) / loopCount + Math.sin(t * 0.5 + i) * 0.15;
        const p1x = cx + Math.cos(loopAngle - 0.18) * sunRadius;
        const p1y = cy + Math.sin(loopAngle - 0.18) * sunRadius;
        const p2x = cx + Math.cos(loopAngle + 0.18) * sunRadius;
        const p2y = cy + Math.sin(loopAngle + 0.18) * sunRadius;

        const loopHeight = (28 + (magneticField * 6)) * (1 + Math.sin(t * 1.2 + i) * 0.15);
        const cpx = cx + Math.cos(loopAngle) * (sunRadius + loopHeight);
        const cpy = cy + Math.sin(loopAngle) * (sunRadius + loopHeight);

        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.quadraticCurveTo(cpx, cpy, p2x, p2y);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Central Luminous Photosphere Disc
      const sunGrad = ctx.createRadialGradient(cx - 15, cy - 18, 10, cx, cy, sunRadius);
      sunGrad.addColorStop(0, '#FFFFFF');
      sunGrad.addColorStop(0.35, '#FEF08A');
      sunGrad.addColorStop(0.75, '#F59E0B');
      sunGrad.addColorStop(1, '#B45309'); // Limb darkening

      ctx.save();
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 32;
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 4. Sunspots (Magnetic field flux tubes puncture photosphere)
      const visibleSunspots = Math.min(24, Math.round(sunspotCount / 7));
      ctx.save();
      ctx.fillStyle = '#451A03';
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 1;

      for (let s = 0; s < visibleSunspots; s++) {
        // Distribute sunspots across solar active belts (-30 to +30 deg latitude)
        const sAngle = (s * 1.618033) % (Math.PI * 2);
        const sDist = (0.2 + (s % 5) * 0.14) * sunRadius;
        const sx = cx + Math.cos(sAngle) * sDist;
        const sy = cy + Math.sin(sAngle) * sDist * 0.45; // Fore-shortening

        const spotSize = 2 + (s % 3) * 1.5;
        ctx.beginPath();
        ctx.arc(sx, sy, spotSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();

      // 5. Continuous Solar Wind & Flare CME Particle Simulation
      // Spawn ambient solar wind particles
      if (isPlaying && Math.random() < 0.45) {
        const emitAngle = Math.random() * Math.PI * 2;
        const emitSpeed = 1.2 + (magneticField / 5);
        particlesRef.current.push({
          x: cx + Math.cos(emitAngle) * sunRadius,
          y: cy + Math.sin(emitAngle) * sunRadius,
          vx: Math.cos(emitAngle) * emitSpeed,
          vy: Math.sin(emitAngle) * emitSpeed,
          life: 1.0,
          maxLife: 50 + Math.random() * 30,
          size: 1.5 + Math.random() * 1.5,
          color: '#FEF08A',
        });
      }

      // Update & Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 6. Flare Detonation Blast Wave Overlay
      if (isFlareActive) {
        const flareAlpha = Math.max(0, 1 - flareProgress);
        ctx.save();
        ctx.globalAlpha = flareAlpha;
        ctx.strokeStyle = selectedFlareClass.grade === 'X' ? '#EF4444' : '#F59E0B';
        ctx.lineWidth = 4;
        ctx.shadowColor = selectedFlareClass.grade === 'X' ? '#EF4444' : '#F59E0B';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(cx, cy, sunRadius + flareProgress * 180, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [coreActivity, magneticField, sunspotCount, isPlaying, isFlareActive, flareProgress, selectedFlareClass]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Interactive Sun Canvas */}
        <GlassCard
          variant="elevated"
          className="lg:col-span-2 relative aspect-[16/10] min-h-[420px] p-5 flex flex-col justify-between overflow-hidden border-white/10 bg-[#02050E]"
        >
          {/* Header Bar */}
          <div className="z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-[#F59E0B] animate-spin-slow" />
              <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                HELIOPHYSICAL SPECTRAL FURNACE // G2V MAIN-SEQUENCE STAR
              </span>
            </div>

            <div className="flex items-center gap-2">
              <TelemetryBadge
                label="SOLAR CONSTANT"
                value={`${solarConstantWm2} W/m²`}
                tone="amber"
                size="sm"
              />
              <TelemetryBadge
                label={isFlareActive ? 'CME DETONATION' : 'QUIET SUN'}
                tone={isFlareActive ? 'violet' : 'emerald'}
                pulsing={isFlareActive}
                size="sm"
              />
            </div>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={760}
            height={460}
            className="absolute inset-0 h-full w-full pointer-events-none"
          />

          {/* Viewport Playback & Flare Detonation Controls */}
          <div className="z-10 flex flex-wrap items-center justify-between border-t border-white/10 pt-3 gap-3 bg-[#02050E]/80 backdrop-blur-md rounded-xl p-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0B1528] text-[#F8FAFC] hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors"
                title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0B1528] text-[#94A3B8] hover:border-red-400 hover:text-red-400 transition-colors"
                title="Reset Solar Baseline"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              <span className="font-mono text-xs text-[#94A3B8] ml-2">
                Solar Wind Speed: <strong className="text-[#38BDF8]">{solarWindSpeedKmS} km/s</strong>
              </span>
            </div>

            {/* Flare Trigger CTA */}
            <div className="flex items-center gap-2">
              <select
                value={selectedFlareClass.grade}
                onChange={(e) => {
                  const fc = SOLAR_FLARE_CLASSES.find((c) => c.grade === e.target.value);
                  if (fc) setSelectedFlareClass(fc);
                }}
                className="h-8 rounded-lg border border-white/10 bg-[#070C1B] px-2.5 font-mono text-xs text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]"
              >
                {SOLAR_FLARE_CLASSES.map((fc) => (
                  <option key={fc.grade} value={fc.grade}>
                    {fc.name}
                  </option>
                ))}
              </select>

              <SpaceButton
                variant="primary"
                size="sm"
                icon={Flame}
                disabled={isFlareActive}
                onClick={handleTriggerFlare}
              >
                {isFlareActive ? 'BURST IN PROGRESS' : 'TRIGGER FLARE'}
              </SpaceButton>
            </div>
          </div>
        </GlassCard>

        {/* Telemetry Readouts & Sliders */}
        <div className="flex flex-col gap-4">
          <GlassCard variant="elevated" className="p-5 border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                SOLAR ATMOSPHERIC TELEMETRY
              </span>
              <TelemetryBadge
                label="SDO SATELLITE"
                tone="amber"
                size="sm"
              />
            </div>

            {/* Core Fusion Rate Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[#94A3B8]">Core Fusion Activity:</span>
                <span className="font-bold text-[#F59E0B]">{coreActivity}% Baseline</span>
              </div>
              <input
                type="range"
                min="80"
                max="150"
                step="1"
                value={coreActivity}
                onChange={(e) => setCoreActivity(parseInt(e.target.value, 10))}
                className="h-1.5 w-full appearance-none rounded-lg bg-white/10 accent-[#F59E0B] cursor-pointer"
              />
              <span className="font-mono text-[9px] text-[#64748B]">
                Core Proton-Proton Chain: 4 ¹H → ⁴He + 26.7 MeV
              </span>
            </div>

            {/* Magnetic Field Helicity Slider */}
            <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[#94A3B8]">Magnetic Helicity (B):</span>
                <span className="font-bold text-[#38BDF8]">{magneticField.toFixed(1)} Tesla</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.2"
                value={magneticField}
                onChange={(e) => setMagneticField(parseFloat(e.target.value))}
                className="h-1.5 w-full appearance-none rounded-lg bg-white/10 accent-[#38BDF8] cursor-pointer"
              />
              <span className="font-mono text-[9px] text-[#64748B]">
                Parker Spiral Dynamo & Active Region Flux Tubes
              </span>
            </div>

            {/* Sunspot Count Slider */}
            <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[#94A3B8]">Sunspot Number (SSN):</span>
                <span className="font-bold text-[#EF4444]">{sunspotCount} Spots</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={sunspotCount}
                onChange={(e) => setSunspotCount(parseInt(e.target.value, 10))}
                className="h-1.5 w-full appearance-none rounded-lg bg-white/10 accent-[#EF4444] cursor-pointer"
              />
              <span className="font-mono text-[9px] text-[#64748B]">
                11-Year Solar Cycle Phase: {sunspotCount > 90 ? 'Solar Maximum' : 'Solar Minimum'}
              </span>
            </div>

            {/* Temperature & Risk Data Matrix */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-white/[0.03]">
                <span className="text-[#94A3B8]">Photosphere Temp:</span>
                <span className="text-[#F8FAFC] font-bold">{photosphereTempK.toLocaleString()} K</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.03]">
                <span className="text-[#94A3B8]">Corona Gas Temp:</span>
                <span className="text-[#F59E0B] font-bold">{coronaTempMK} Million K</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.03]">
                <span className="text-[#94A3B8]">Solar Constant (1 AU):</span>
                <span className="text-[#38BDF8] font-bold">{solarConstantWm2} W/m²</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#94A3B8]">Space Weather Risk:</span>
                <span
                  className={`font-bold ${
                    isFlareActive ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {isFlareActive ? selectedFlareClass.geomagneticStorm : 'Nominal (G0)'}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Heliophysics Reference Card */}
          <GlassCard variant="elevated" className="p-4 border-white/10">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#F59E0B] font-bold mb-1">
              <Radio className="h-3.5 w-3.5" />
              <span>CORONAL HEATING PARADOX</span>
            </div>
            <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
              While the visible photosphere is ~5,800 K, the tenuous solar corona reaches millions of Kelvin. Magnetohydrodynamic Alfven waves and nanoflares deposit magnetic energy directly into the upper solar atmosphere.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
