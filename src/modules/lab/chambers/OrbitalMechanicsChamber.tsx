import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { TelemetryBadge } from '../../../components/ui/TelemetryBadge';
import {
  CENTRAL_BODIES,
  ORBIT_PRESETS,
  OrbitPreset,
  CentralBody,
} from '../labData';
import {
  Play,
  Pause,
  RotateCcw,
  Orbit,
  Zap,
  Sparkles,
} from 'lucide-react';

interface OrbitalMechanicsChamberProps {
  onLogTelemetry: (msg: string) => void;
  onMilestoneAchieved: (milestoneId: string) => void;
}

export const OrbitalMechanicsChamber: React.FC<OrbitalMechanicsChamberProps> = ({
  onLogTelemetry,
  onMilestoneAchieved,
}) => {
  // Central Body State
  const [selectedBodyId, setSelectedBodyId] = useState<string>('earth');
  const body: CentralBody = CENTRAL_BODIES[selectedBodyId] || CENTRAL_BODIES.earth;

  // Orbit Parameters
  const [altitudeKm, setAltitudeKm] = useState<number>(400); // km above surface
  const [velocityKmS, setVelocityKmS] = useState<number>(7.67); // km/s tangential
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Visual Overlays
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showKeplerArea, setShowKeplerArea] = useState<boolean>(true);

  // Canvas Reference
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const trueAnomalyRef = useRef<number>(0);

  // Physics Calculations
  const G = 6.6743e-11; // m^3 kg^-1 s^-2
  const mu = G * body.massKg; // m^3 s^-2
  const r0_m = (body.radiusKm + altitudeKm) * 1000; // m
  const v0_m = velocityKmS * 1000; // m/s

  // Vis-Viva: Specific orbital energy epsilon = v^2/2 - mu/r
  const epsilon = (v0_m * v0_m) / 2 - mu / r0_m;

  // Semi-major axis a = -mu / (2 * epsilon) in meters
  let a_m: number = 0;
  let isBound = false;
  if (epsilon < 0) {
    a_m = -mu / (2 * epsilon);
    isBound = true;
  } else {
    // Parabolic / Hyperbolic
    a_m = Infinity;
    isBound = false;
  }

  // Specific Angular Momentum h = r0 * v0
  const h_ang = r0_m * v0_m;

  // Eccentricity e = sqrt(1 + 2 * epsilon * h^2 / mu^2)
  const e_arg = 1 + (2 * epsilon * h_ang * h_ang) / (mu * mu);
  const eccentricity = e_arg >= 0 ? Math.sqrt(e_arg) : 0;

  // Periapsis and Apoapsis
  let periapsisKm = 0;
  let apoapsisKm = 0;
  if (isBound) {
    const a_km = a_m / 1000;
    periapsisKm = a_km * (1 - eccentricity) - body.radiusKm;
    apoapsisKm = a_km * (1 + eccentricity) - body.radiusKm;
  } else {
    periapsisKm = (r0_m / 1000) - body.radiusKm;
    apoapsisKm = Infinity;
  }

  // Orbital Period via Kepler's 3rd Law: T = 2 * pi * sqrt(a^3 / mu)
  let periodSeconds = 0;
  if (isBound && a_m > 0) {
    periodSeconds = 2 * Math.PI * Math.sqrt(Math.pow(a_m, 3) / mu);
  }

  // Circular speed for this altitude: v_c = sqrt(mu / r)
  const circularSpeedKmS = Math.sqrt(mu / r0_m) / 1000;
  // Escape speed: v_esc = sqrt(2 * mu / r)
  const escapeSpeedKmS = Math.sqrt((2 * mu) / r0_m) / 1000;

  // Milestone triggers
  useEffect(() => {
    if (isBound && eccentricity < 0.04 && altitudeKm <= 800) {
      onMilestoneAchieved('orbit-circular');
    }
    if (isBound && periodSeconds > 80000 && altitudeKm > 30000) {
      onMilestoneAchieved('orbit-kepler3');
    }
  }, [eccentricity, isBound, altitudeKm, periodSeconds, onMilestoneAchieved]);

  // Load Preset
  const handleApplyPreset = (preset: OrbitPreset) => {
    setSelectedBodyId(preset.bodyId);
    setAltitudeKm(preset.altitudeKm);
    setVelocityKmS(preset.velocityKmS);
    trueAnomalyRef.current = 0;
    onLogTelemetry(
      `ORBIT_PRESET: Applied "${preset.name}" (alt=${preset.altitudeKm}km, v=${preset.velocityKmS}km/s)`
    );
  };

  // Reset
  const handleReset = () => {
    setAltitudeKm(400);
    setVelocityKmS(7.67);
    setSelectedBodyId('earth');
    trueAnomalyRef.current = 0;
    setIsPlaying(true);
    onLogTelemetry('ORBIT_SIM: Parameters reset to standard LEO baseline');
  };

  // Canvas Animation Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Deep space grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Visual scaling: scale central body radius to ~32px
      const visualBodyRadius = 34;
      const scale = visualBodyRadius / body.radiusKm; // px per km

      // Determine orbit visual geometry
      // Center of central body at (cx, cy)
      const r_peri_px = Math.max(8, (body.radiusKm + Math.max(-body.radiusKm * 0.9, periapsisKm)) * scale);
      const r_apo_px = isBound && apoapsisKm < 200000
        ? (body.radiusKm + apoapsisKm) * scale
        : Math.min(w * 0.45, r_peri_px * 3.5);

      const a_px = (r_peri_px + r_apo_px) / 2;
      const c_px = a_px * Math.min(0.92, eccentricity); // Focus offset
      const b_px = a_px * Math.sqrt(Math.max(0.01, 1 - Math.min(0.92, eccentricity) * Math.min(0.92, eccentricity)));

      // Ellipse center is shifted by -c_px so that Focus 1 is at (cx, cy)
      const ellipseCenterX = cx - c_px;
      const ellipseCenterY = cy;

      // 1. Kepler Swept Area Sector
      if (showKeplerArea && isBound && eccentricity > 0.05) {
        ctx.save();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);

        // Sweep 35 degree sector around current true anomaly
        const startAngle = trueAnomalyRef.current - 0.25;
        const endAngle = trueAnomalyRef.current + 0.25;
        for (let th = startAngle; th <= endAngle; th += 0.04) {
          const r_th = (a_px * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(th));
          const sx = cx + r_th * Math.cos(th);
          const sy = cy + r_th * Math.sin(th);
          ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Second equal area sector at opposite side (Kepler 2nd law visual demonstration)
        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        const oppStart = Math.PI - 0.15;
        const oppEnd = Math.PI + 0.15;
        for (let th = oppStart; th <= oppEnd; th += 0.03) {
          const r_th = (a_px * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(th));
          const sx = cx + r_th * Math.cos(th);
          const sy = cy + r_th * Math.sin(th);
          ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // 2. Trajectory Ellipse Path
      ctx.save();
      ctx.beginPath();
      if (isBound) {
        ctx.strokeStyle = eccentricity < 0.04 ? '#10B981' : eccentricity < 0.7 ? '#38BDF8' : '#F59E0B';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.ellipse(ellipseCenterX, ellipseCenterY, a_px, b_px, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Hyperbolic escape curve
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 3]);
        ctx.beginPath();
        for (let th = -Math.PI * 0.45; th <= Math.PI * 0.45; th += 0.03) {
          const r_th = (r_peri_px * (1 + eccentricity)) / (1 + eccentricity * Math.cos(th));
          const sx = cx + r_th * Math.cos(th);
          const sy = cy + r_th * Math.sin(th);
          if (th === -Math.PI * 0.45) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }
      ctx.restore();

      // 3. Central Celestial Body
      const bodyGrad = ctx.createRadialGradient(cx - 6, cy - 8, 4, cx, cy, visualBodyRadius);
      bodyGrad.addColorStop(0, '#FFFFFF');
      bodyGrad.addColorStop(0.3, body.color);
      bodyGrad.addColorStop(1, '#070C1B');

      ctx.save();
      ctx.shadowColor = body.color;
      ctx.shadowBlur = 24;
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, visualBodyRadius, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Rim Halo
      ctx.strokeStyle = body.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Body Label
      ctx.fillStyle = '#CBD5E1';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(body.name.toUpperCase(), cx, cy + visualBodyRadius + 14);

      // 4. Satellite Position along Orbit
      // Advance true anomaly according to Keplerian speed: d(theta)/dt = h / r^2
      if (isPlaying) {
        const curR = (a_px * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(trueAnomalyRef.current));
        const normalizedR = Math.max(0.2, curR / a_px);
        const dTheta = ((0.9 * simSpeed) / (normalizedR * normalizedR)) * dt;
        trueAnomalyRef.current = (trueAnomalyRef.current + dTheta) % (Math.PI * 2);
      }

      const satR = (a_px * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(trueAnomalyRef.current));
      const satX = cx + satR * Math.cos(trueAnomalyRef.current);
      const satY = cy + satR * Math.sin(trueAnomalyRef.current);

      // Satellite Halo & Craft Dot
      ctx.save();
      ctx.fillStyle = '#FEF08A';
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(satX, satY, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Solar Panels indicator
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(satX - 9, satY);
      ctx.lineTo(satX + 9, satY);
      ctx.stroke();
      ctx.restore();

      // 5. Velocity and Gravity Force Vectors
      if (showVectors) {
        // Tangent direction for velocity
        const tanAngle = trueAnomalyRef.current + Math.PI / 2 + (eccentricity * Math.sin(trueAnomalyRef.current)) * 0.4;
        const velLen = 32 * (1 + (1 - satR / (a_px * 2)));

        ctx.save();
        // Velocity Vector (Cyan)
        ctx.strokeStyle = '#38BDF8';
        ctx.fillStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(satX, satY);
        ctx.lineTo(satX + velLen * Math.cos(tanAngle), satY + velLen * Math.sin(tanAngle));
        ctx.stroke();

        // Arrow head
        const tipX = satX + velLen * Math.cos(tanAngle);
        const tipY = satY + velLen * Math.sin(tanAngle);
        ctx.beginPath();
        ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Gravity Vector toward center (Amber)
        const gravAngle = Math.atan2(cy - satY, cx - satX);
        const gravLen = 22;
        ctx.strokeStyle = '#F59E0B';
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.moveTo(satX, satY);
        ctx.lineTo(satX + gravLen * Math.cos(gravAngle), satY + gravLen * Math.sin(gravAngle));
        ctx.stroke();

        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText('v⃗', tipX + 5, tipY - 3);
        ctx.restore();
      }

      // Periapsis & Apoapsis Marker Pins
      if (isBound) {
        ctx.fillStyle = '#10B981';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText('Periapsis (r_p)', cx + r_peri_px + 6, cy - 4);

        if (apoapsisKm < 200000) {
          ctx.fillStyle = '#F59E0B';
          ctx.textAlign = 'right';
          ctx.fillText('Apoapsis (r_a)', cx - r_apo_px - 6, cy - 4);
        }
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [body, isBound, eccentricity, periapsisKm, apoapsisKm, isPlaying, simSpeed, showVectors, showKeplerArea]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full">
      {/* Upper Main Simulation Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Viewport Canvas */}
        <GlassCard
          variant="elevated"
          className="lg:col-span-2 relative aspect-[16/10] min-h-[420px] p-5 flex flex-col justify-between overflow-hidden border-white/10 bg-[#02050E]"
        >
          {/* Viewport HUD Header */}
          <div className="z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Orbit className="h-4 w-4 text-[#38BDF8]" />
              <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                ORBITAL TRAJECTORY SIMULATOR // {body.name.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <TelemetryBadge
                label="ECCENTRICITY"
                value={`e = ${eccentricity.toFixed(3)}`}
                tone={eccentricity < 0.04 ? 'emerald' : eccentricity < 0.7 ? 'cyan' : 'amber'}
                size="sm"
              />
              <TelemetryBadge
                label={isBound ? 'BOUND ORBIT' : 'HYPERBOLIC ESCAPE'}
                tone={isBound ? 'cyan' : 'violet'}
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

          {/* Viewport Playback & Display Toggles */}
          <div className="z-10 flex flex-wrap items-center justify-between border-t border-white/10 pt-3 gap-3 bg-[#02050E]/80 backdrop-blur-md rounded-xl p-2.5">
            {/* Play/Pause/Reset Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0B1528] text-[#F8FAFC] hover:border-[#38BDF8] hover:text-[#38BDF8] transition-colors"
                title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0B1528] text-[#94A3B8] hover:border-red-400 hover:text-red-400 transition-colors"
                title="Reset Parameters"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              {/* Sim Speed Selectors */}
              {[0.5, 1.0, 2.0, 5.0].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSimSpeed(s)}
                  className={`px-2 py-1 font-mono text-[10px] rounded-md transition-colors ${
                    simSpeed === s
                      ? 'bg-[#38BDF8] text-[#030611] font-bold'
                      : 'bg-white/5 text-[#94A3B8] hover:bg-white/10'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Visual Feature Toggles */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowVectors((v) => !v)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[10px] border transition-colors ${
                  showVectors
                    ? 'border-[#38BDF8] bg-[#38BDF8]/15 text-[#38BDF8] font-bold'
                    : 'border-white/10 text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Zap className="h-3 w-3" />
                <span>Vectors (v⃗, F⃗)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowKeplerArea((a) => !a)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[10px] border transition-colors ${
                  showKeplerArea
                    ? 'border-[#F59E0B] bg-[#F59E0B]/15 text-[#F59E0B] font-bold'
                    : 'border-white/10 text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Sparkles className="h-3 w-3" />
                <span>Kepler Areas (ΔA)</span>
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Real-time Telemetry & Parameter Sliders */}
        <div className="flex flex-col gap-4">
          <GlassCard variant="elevated" className="p-5 border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                KEPLERIAN CONTROLS
              </span>
              <TelemetryBadge
                label="LIVE SOLVER"
                tone="cyan"
                size="sm"
              />
            </div>

            {/* Central Body Selection */}
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] text-[#94A3B8]">Central Celestial Body:</span>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(CENTRAL_BODIES).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setSelectedBodyId(b.id);
                      onLogTelemetry(`CENTRAL_BODY: Switched gravitational focus to ${b.name}`);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl border font-mono text-xs transition-all ${
                      selectedBodyId === b.id
                        ? 'border-[#38BDF8] bg-[#38BDF8]/15 text-[#F8FAFC] font-bold shadow-sm'
                        : 'border-white/5 bg-[#0B1528]/50 text-[#94A3B8] hover:bg-white/5'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: b.color }} />
                    <span>{b.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Orbital Velocity Slider */}
            <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#94A3B8]">Orbital Velocity (v₀):</span>
                <span className="font-bold text-[#38BDF8]">
                  {velocityKmS.toFixed(2)} km/s
                </span>
              </div>
              <input
                type="range"
                min="4.0"
                max="12.5"
                step="0.05"
                value={velocityKmS}
                onChange={(e) => setVelocityKmS(parseFloat(e.target.value))}
                className="h-1.5 w-full appearance-none rounded-lg bg-white/10 accent-[#38BDF8] cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[9.5px] text-[#64748B]">
                <span>v_c: {circularSpeedKmS.toFixed(2)} km/s</span>
                <span>v_esc: {escapeSpeedKmS.toFixed(2)} km/s</span>
              </div>
            </div>

            {/* Orbital Altitude Slider */}
            <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#94A3B8]">Initial Altitude (h₀):</span>
                <span className="font-bold text-[#F59E0B]">
                  {altitudeKm >= 1000 ? `${(altitudeKm / 1000).toFixed(1)}k km` : `${altitudeKm} km`}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="36000"
                step="200"
                value={altitudeKm}
                onChange={(e) => setAltitudeKm(parseInt(e.target.value, 10))}
                className="h-1.5 w-full appearance-none rounded-lg bg-white/10 accent-[#F59E0B] cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[9.5px] text-[#64748B]">
                <span>LEO: 200–2,000 km</span>
                <span>GEO: 35,786 km</span>
              </div>
            </div>

            {/* Live Measurements Readout Table */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-white/[0.03]">
                <span className="text-[#94A3B8]">Semi-Major Axis (a):</span>
                <span className="text-[#F8FAFC] font-semibold">
                  {isBound ? `${Math.round(a_m / 1000).toLocaleString()} km` : '∞ (Hyperbolic)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.03]">
                <span className="text-[#94A3B8]">Orbital Period (T):</span>
                <span className="text-[#38BDF8] font-bold">
                  {isBound
                    ? periodSeconds > 3600
                      ? `${(periodSeconds / 3600).toFixed(2)} hours`
                      : `${Math.round(periodSeconds / 60)} minutes`
                    : 'N/A (Escape)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.03]">
                <span className="text-[#94A3B8]">Periapsis Alt:</span>
                <span className="text-[#10B981] font-semibold">
                  {Math.round(periapsisKm).toLocaleString()} km
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#94A3B8]">Apoapsis Alt:</span>
                <span className="text-[#F59E0B] font-semibold">
                  {isBound ? `${Math.round(apoapsisKm).toLocaleString()} km` : 'Escape Trajectory'}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Quick Presets Carousel */}
          <GlassCard variant="elevated" className="p-4 border-white/10">
            <span className="font-mono text-[10px] text-[#38BDF8] font-bold uppercase tracking-wider block mb-2">
              ASTRODYNAMICS PRESETS
            </span>
            <div className="flex flex-col gap-1.5">
              {ORBIT_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="flex items-center justify-between p-2 rounded-xl border border-white/5 bg-[#0B1528]/60 hover:bg-[#122242] hover:border-[#38BDF8]/40 transition-colors text-left"
                >
                  <div className="flex flex-col">
                    <span className="font-sans text-xs font-bold text-[#F8FAFC]">{p.name}</span>
                    <span className="font-mono text-[9px] text-[#94A3B8]">
                      {p.altitudeKm} km • {p.velocityKmS} km/s
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#38BDF8] font-bold">LOAD →</span>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
