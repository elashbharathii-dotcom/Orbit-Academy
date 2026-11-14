import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SpaceButton } from '../../components/ui/SpaceButton';
import { FastForward, Zap, Radio, Shield, Compass } from 'lucide-react';
import { QuizCategoryMeta } from './quizData';

interface CinematicAircraftLaunchProps {
  categoryMeta: QuizCategoryMeta;
  difficulty: string;
  questionCount: number;
  isTimedBlitz: boolean;
  onLaunchComplete: () => void;
}

export const CinematicAircraftLaunch: React.FC<CinematicAircraftLaunchProps> = ({
  categoryMeta,
  difficulty,
  questionCount,
  isTimedBlitz,
  onLaunchComplete,
}) => {
  // Stages: 1 = Init (0-1.2s), 2 = Aircraft Appears & Engines (1.2-2.6s), 3 = Acceleration & Hyperspace (2.6-4.0s), 4 = Transition (4.0-4.3s)
  const [stage, setStage] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Skip handler
  const handleSkip = useCallback(() => {
    onLaunchComplete();
  }, [onLaunchComplete]);

  // Keyboard shortcut: Escape or Space to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Space') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // Stage timeline
  useEffect(() => {
    const t1 = setTimeout(() => setStage(2), 1200);
    const t2 = setTimeout(() => setStage(3), 2600);
    const t3 = setTimeout(() => setStage(4), 3900);
    const t4 = setTimeout(() => onLaunchComplete(), 4300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onLaunchComplete]);

  // High-performance canvas starfield with hyperspace acceleration warp
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize 300 3D starfield particles
    const starCount = 280;
    interface Star3D {
      x: number;
      y: number;
      z: number;
      prevZ: number;
      color: string;
    }

    const stars: Star3D[] = [];
    const colors = ['#FFFFFF', '#38DDF8', '#A78BFA', '#E879F9', '#93C5FD'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        prevZ: Math.random() * width,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let speed = 2.0;

    const render = () => {
      // Speed scales up dramatically during Stage 3 (takeoff)
      if (stage >= 3) {
        speed = Math.min(speed + 1.2, 55.0); // Warp speed!
      } else if (stage === 2) {
        speed = 3.5;
      } else {
        speed = 1.5;
      }

      // Background trail blur
      ctx.fillStyle = stage >= 3 ? 'rgba(3, 6, 17, 0.35)' : 'rgba(3, 6, 17, 0.8)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < starCount; i++) {
        const star = stars[i];
        star.prevZ = star.z;
        star.z -= speed;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
          star.z = width;
          star.prevZ = width;
        }

        const k = 128.0 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const prevK = 128.0 / star.prevZ;
          const prevPx = star.x * prevK + cx;
          const prevPy = star.y * prevK + cy;

          const size = Math.max(1, (1 - star.z / width) * 3);
          const alpha = Math.min(1, Math.max(0.2, (1 - star.z / width) * 1.5));

          ctx.beginPath();
          if (stage >= 3) {
            // Speed streaks!
            ctx.strokeStyle = star.color;
            ctx.lineWidth = size * 1.2;
            ctx.globalAlpha = alpha;
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.stroke();
          } else {
            ctx.fillStyle = star.color;
            ctx.globalAlpha = alpha;
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [stage]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#030611] select-none">
      {/* 1. Warp Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />

      {/* 2. Ambient Nebula Lighting */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
          stage >= 3 ? 'opacity-80' : 'opacity-40'
        }`}
        style={{
          background: `radial-gradient(circle at 50% 60%, ${categoryMeta.glowColor} 0%, rgba(56, 221, 248, 0.15) 30%, transparent 70%)`,
        }}
      />

      {/* 3. Top HUD Navigation / Telemetry Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-[#38DDF8] animate-ping" />
          <div className="flex flex-col">
            <span className="font-mono text-xs text-[#38DDF8] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5" />
              <span>ORBIT ACADEMY FLIGHT PROTOCOL // ACTIVE</span>
            </span>
            <span className="font-mono text-[10px] text-[#94A3B8]">
              TARGET: {categoryMeta.label.toUpperCase()} • TIER: {difficulty.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Skip Animation Button */}
        <SpaceButton
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          icon={FastForward}
          iconPosition="right"
          className="border border-white/20 bg-black/40 backdrop-blur-md text-white hover:bg-white/10 text-xs font-mono"
        >
          Skip Launch [ESC]
        </SpaceButton>
      </div>

      {/* 4. Bottom HUD Systems Diagnostic Bar */}
      <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs z-30 pointer-events-none">
        <div className="flex items-center gap-4 text-[#94A3B8]">
          <span className="flex items-center gap-1.5 text-[#34D399] font-bold">
            <Shield className="h-3.5 w-3.5" />
            <span>HULL DEFLECTORS: 100%</span>
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="flex items-center gap-1.5 text-[#38DDF8] font-bold">
            <Compass className="h-3.5 w-3.5" />
            <span>VECTOR: ORBITAL ASCENT</span>
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="flex items-center gap-1.5 text-[#FBBF24] font-bold">
            <Zap className="h-3.5 w-3.5" />
            <span>CHALLENGES: {questionCount} ARMED</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-white/70">
          <span>MODE:</span>
          <span className="font-bold text-[#38DDF8]">
            {isTimedBlitz ? '60s BLITZ' : 'STANDARD FLIGHT'}
          </span>
        </div>
      </div>

      {/* 5. Center Cinematic Aircraft Presentation */}
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none w-full max-w-4xl px-4">
        
        {/* STAGE 1: Mission Initialization Overlay */}
        {stage === 1 && (
          <div className="text-center space-y-3 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#38DDF8]/40 bg-[#38DDF8]/10 backdrop-blur-xl text-[#38DDF8] font-mono text-xs font-bold tracking-wider">
              <Zap className="h-3.5 w-3.5 animate-spin" />
              <span>MISSION INITIALIZATION IN PROGRESS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Pre-Flight Systems Check
            </h1>

            <p className="font-mono text-sm text-[#A78BFA] tracking-wide">
              Calibrating telemetry for {categoryMeta.label} Arena
            </p>

            {/* Diagnostic checklist */}
            <div className="pt-4 flex flex-wrap justify-center gap-3 font-mono text-xs">
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[#34D399]">
                ✓ ASTRODYNAMICS LINKED
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[#34D399]">
                ✓ AVIONICS SYNCHRONIZED
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[#38DDF8] animate-pulse">
                ► IGNITING MAIN ENGINES...
              </span>
            </div>
          </div>
        )}

        {/* STAGE 2 & 3: Futuristic Aircraft Model & Engine Ignition */}
        {stage >= 2 && (
          <div
            className={`relative flex flex-col items-center transition-all duration-1000 ease-out transform ${
              stage === 2
                ? 'scale-100 translate-y-0 opacity-100'
                : stage === 3
                ? 'scale-[2.4] -translate-y-96 opacity-90 blur-[0.5px]'
                : 'scale-[4] -translate-y-[600px] opacity-0'
            }`}
          >
            {/* Hypersonic Spacecraft Graphic (High-Detail Procedural Vector SVG) */}
            <div className="relative w-72 sm:w-96 h-64 sm:h-80 flex items-center justify-center">
              
              {/* Dual Engine Plasma Exhaust Plumes */}
              <div className="absolute -bottom-8 flex items-center gap-12 sm:gap-16 z-0">
                {/* Left Engine Plume */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-4 sm:w-5 bg-gradient-to-b from-white via-[#38DDF8] to-transparent rounded-full filter blur-[1px] transition-all duration-300 ${
                      stage >= 3
                        ? 'h-36 sm:h-48 shadow-[0_0_40px_#38DDF8]'
                        : 'h-20 sm:h-28 shadow-[0_0_20px_#38DDF8] animate-pulse'
                    }`}
                  />
                  <div className="w-10 h-10 -mt-6 rounded-full bg-[#38DDF8]/40 filter blur-md animate-ping" />
                </div>

                {/* Right Engine Plume */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-4 sm:w-5 bg-gradient-to-b from-white via-[#38DDF8] to-transparent rounded-full filter blur-[1px] transition-all duration-300 ${
                      stage >= 3
                        ? 'h-36 sm:h-48 shadow-[0_0_40px_#38DDF8]'
                        : 'h-20 sm:h-28 shadow-[0_0_20px_#38DDF8] animate-pulse'
                    }`}
                  />
                  <div className="w-10 h-10 -mt-6 rounded-full bg-[#38DDF8]/40 filter blur-md animate-ping" />
                </div>
              </div>

              {/* Spacecraft Body SVG */}
              <svg
                viewBox="0 0 300 240"
                className="w-full h-full filter drop-shadow-[0_10px_35px_rgba(56,221,248,0.4)] relative z-10"
              >
                <defs>
                  <linearGradient id="fuselageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="50%" stopColor="#0F172A" />
                    <stop offset="100%" stopColor="#090D16" />
                  </linearGradient>
                  <linearGradient id="wingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                  <linearGradient id="canopyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38DDF8" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>
                  <linearGradient id="neonTrim" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="50%" stopColor="#38DDF8" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                </defs>

                {/* Left Delta Wing */}
                <polygon points="150,50 30,170 80,185 140,150" fill="url(#wingGrad)" stroke="#475569" strokeWidth="1.5" />
                {/* Left Wing Neon Strip */}
                <line x1="50" y1="165" x2="110" y2="155" stroke="#38DDF8" strokeWidth="2" strokeLinecap="round" />

                {/* Right Delta Wing */}
                <polygon points="150,50 270,170 220,185 160,150" fill="url(#wingGrad)" stroke="#475569" strokeWidth="1.5" />
                {/* Right Wing Neon Strip */}
                <line x1="250" y1="165" x2="190" y2="155" stroke="#38DDF8" strokeWidth="2" strokeLinecap="round" />

                {/* Main Aerospace Fuselage */}
                <polygon points="150,15 175,90 170,195 150,205 130,195 125,90" fill="url(#fuselageGrad)" stroke="#64748B" strokeWidth="2" />

                {/* Cockpit Canopy */}
                <ellipse cx="150" cy="80" rx="14" ry="32" fill="url(#canopyGrad)" opacity="0.9" stroke="#E2E8F0" strokeWidth="1.5" />
                <ellipse cx="150" cy="72" rx="6" ry="16" fill="#FFFFFF" opacity="0.4" />

                {/* Nose Cone Accent */}
                <polygon points="150,15 156,45 144,45" fill="#38DDF8" />

                {/* RCS Maneuvering Thrusters */}
                <circle cx="128" cy="110" r="2.5" fill="#FBBF24" />
                <circle cx="172" cy="110" r="2.5" fill="#FBBF24" />

                {/* Twin Main Engines Nozzles */}
                <rect x="133" y="195" width="10" height="12" rx="2" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
                <rect x="157" y="195" width="10" height="12" rx="2" fill="#475569" stroke="#94A3B8" strokeWidth="1" />

                {/* Avionics Dorsal Spine */}
                <line x1="150" y1="115" x2="150" y2="185" stroke="url(#neonTrim)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>

              {/* Shockwave Rings during Acceleration (Stage 3) */}
              {stage >= 3 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 rounded-full border-2 border-[#38DDF8] animate-ping opacity-60" />
                  <div className="w-80 h-80 rounded-full border border-[#A78BFA] animate-ping opacity-40 delay-150" />
                </div>
              )}
            </div>

            {/* Launch Status Telemetry Caption */}
            <div className="mt-4 text-center">
              <span className="font-mono text-xs font-black uppercase tracking-widest text-[#38DDF8] bg-black/60 px-4 py-1.5 rounded-full border border-[#38DDF8]/40 shadow-[0_0_20px_rgba(56,221,248,0.4)]">
                {stage === 2 ? 'MAIN ENGINES: IGNITION • 100% MAXIMUM THRUST' : 'HYPERSPACE VELOCITY ENGAGED • INSERTING INTO ORBIT'}
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

