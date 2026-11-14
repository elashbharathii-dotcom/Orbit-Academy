import React from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { TelemetryBadge } from '../../components/ui/TelemetryBadge';
import { PlayerLevel, PlayerProfile, getLevelProgress, PLAYER_LEVELS } from './quizStore';
import { CockpitCanvas } from './CockpitCanvas';
import {
  Rocket,
  Trophy,
  Sparkles,
  Zap,
  Radio,
  ArrowRight,
  Shield,
  Activity,
  Edit2,
  Check,
} from 'lucide-react';

interface SpaceshipHangarProps {
  playerProfile: PlayerProfile;
  currentLevel: PlayerLevel;
  onBoardSpacecraft: () => void;
  onOpenLeaderboard: () => void;
  onUpdateCallSign: (newName: string) => void;
}

export const SpaceshipHangar: React.FC<SpaceshipHangarProps> = ({
  playerProfile,
  currentLevel,
  onBoardSpacecraft,
  onOpenLeaderboard,
  onUpdateCallSign,
}) => {
  const levelProgress = getLevelProgress(playerProfile.totalXp);
  const [isEditingCallSign, setIsEditingCallSign] = React.useState(false);
  const [callSignInput, setCallSignInput] = React.useState(playerProfile.name);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!callSignInput.trim()) return;
    onUpdateCallSign(callSignInput.trim());
    setIsEditingCallSign(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Dynamic Animated Hangar Runway Canvas */}
      <CockpitCanvas mode="hangar" />

      {/* Top Hangar Banner & Pilot Status */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-4">
        <GlassCard
          variant="elevated"
          className="p-4 sm:p-6 border-glow-cyan bg-gradient-to-r from-[#070C1B]/95 via-[#0B1226]/90 to-[#0A1628]/95"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <TelemetryBadge
                  label="BAY DOCK"
                  value="HANGAR-7 ORBITAL BAY"
                  tone="cyan"
                  pulsing
                  icon={Rocket}
                  size="sm"
                />
                <TelemetryBadge
                  label="VESSEL"
                  value="ORBIT-X CELESTIAL SCOUT"
                  tone="violet"
                  size="sm"
                />
                <TelemetryBadge
                  label="REACTOR"
                  value="ION CORE 100%"
                  tone="amber"
                  icon={Zap}
                  size="sm"
                />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>Spacecraft Flight Hangar</span>
                <Sparkles className="h-5 w-5 text-[#38BDF8] animate-pulse" />
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl">
                The ORBIT-X starcraft stands fueled on the magnetic catapult runway. Board your vessel to engage in deep-space astrophysics challenges.
              </p>
            </div>

            {/* Pilot Profile & Level Telemetry */}
            <div className="flex flex-col gap-2 shrink-0 lg:w-80">
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="bg-[#030611]/80 rounded-xl border border-white/10 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#94A3B8] uppercase">Pilot</span>
                    {!isEditingCallSign && (
                      <button
                        type="button"
                        onClick={() => {
                          setCallSignInput(playerProfile.name);
                          setIsEditingCallSign(true);
                        }}
                        className="text-[#94A3B8] hover:text-[#38BDF8]"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  {!isEditingCallSign ? (
                    <span className="font-bold text-white truncate block mt-0.5">
                      {playerProfile.name}
                    </span>
                  ) : (
                    <form onSubmit={handleSave} className="flex items-center gap-1 mt-0.5">
                      <input
                        type="text"
                        maxLength={18}
                        value={callSignInput}
                        onChange={(e) => setCallSignInput(e.target.value)}
                        className="w-full bg-black/80 border border-[#38BDF8] rounded px-1 py-0.5 text-xs text-white"
                        autoFocus
                      />
                      <button type="submit" className="bg-[#38BDF8] text-slate-950 p-1 rounded">
                        <Check className="h-3 w-3" />
                      </button>
                    </form>
                  )}
                </div>

                <div className="bg-[#030611]/80 rounded-xl border border-white/10 p-2.5">
                  <span className="text-[10px] text-[#94A3B8] uppercase block">Flight XP</span>
                  <span className="font-bold text-[#F59E0B] text-sm mt-0.5 block">
                    {playerProfile.totalXp.toLocaleString()} XP
                  </span>
                </div>
              </div>

              {/* Level Progress */}
              <div className="bg-[#030611]/80 rounded-xl border border-white/10 p-2.5 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#38BDF8] font-bold">
                    Level {currentLevel.level}: {currentLevel.name}
                  </span>
                  <span className="text-[#94A3B8]">{levelProgress.percent}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#38BDF8] to-[#A78BFA] transition-all duration-300 rounded-full"
                    style={{ width: `${levelProgress.percent}%` }}
                  />
                </div>
                {currentLevel.nextLevelXp && (
                  <span className="text-[9px] font-mono text-[#94A3B8] text-right">
                    {levelProgress.remainingXp.toLocaleString()} XP to {PLAYER_LEVELS[currentLevel.level]?.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Centerpiece: Cinematic ORBIT-X Starfighter Visualization */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-6">
        <div className="relative w-full max-w-2xl flex flex-col items-center">
          
          {/* Reactor Energy Aura Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#38BDF8]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#A78BFA]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Futuristic Spaceship Vector Graphic */}
          <div className="relative w-72 sm:w-96 md:w-[460px] transition-transform duration-500 hover:scale-105">
            <svg
              viewBox="0 0 500 320"
              className="w-full h-auto drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Runway Shadow */}
              <ellipse cx="250" cy="290" rx="180" ry="14" fill="rgba(0,0,0,0.6)" filter="blur(8px)" />

              {/* Main Fuselage Hull */}
              <path
                d="M 250 20 L 285 140 L 330 230 L 290 260 L 250 245 L 210 260 L 170 230 L 215 140 Z"
                fill="url(#hullGradient)"
                stroke="#38BDF8"
                strokeWidth="2"
              />

              {/* Delta Wings Left & Right */}
              <path
                d="M 215 150 L 50 220 L 70 245 L 175 220 Z"
                fill="url(#wingGradientLeft)"
                stroke="rgba(56, 189, 248, 0.6)"
                strokeWidth="1.5"
              />
              <path
                d="M 285 150 L 450 220 L 430 245 L 325 220 Z"
                fill="url(#wingGradientRight)"
                stroke="rgba(56, 189, 248, 0.6)"
                strokeWidth="1.5"
              />

              {/* Wingtip Plasma Torches */}
              <circle cx="50" cy="220" r="3" fill="#38BDF8" className="animate-ping" />
              <circle cx="450" cy="220" r="3" fill="#38BDF8" className="animate-ping" />

              {/* Cockpit Canopy Glass */}
              <path
                d="M 250 50 L 268 120 L 250 145 L 232 120 Z"
                fill="url(#canopyGradient)"
                stroke="#67E8F9"
                strokeWidth="1.5"
              />

              {/* Canopy Glint Highlights */}
              <path d="M 248 55 L 260 115" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />

              {/* Ion Engine Thruster Nozzles */}
              <rect x="235" y="246" width="30" height="12" rx="3" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
              <rect x="215" y="252" width="16" height="10" rx="2" fill="#0F172A" stroke="#F59E0B" strokeWidth="1" />
              <rect x="269" y="252" width="16" height="10" rx="2" fill="#0F172A" stroke="#F59E0B" strokeWidth="1" />

              {/* Engine Exhaust Plasma Plumes */}
              <path
                d="M 238 258 Q 250 310 262 258 Z"
                fill="url(#exhaustGradientCenter)"
                className="animate-pulse"
              />
              <path
                d="M 218 262 Q 223 290 228 262 Z"
                fill="url(#exhaustGradientSide)"
                className="animate-pulse"
              />
              <path
                d="M 272 262 Q 277 290 282 262 Z"
                fill="url(#exhaustGradientSide)"
                className="animate-pulse"
              />

              {/* Gradients */}
              <defs>
                <linearGradient id="hullGradient" x1="250" y1="20" x2="250" y2="260" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="50%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#090D16" />
                </linearGradient>
                <linearGradient id="wingGradientLeft" x1="50" y1="220" x2="215" y2="150" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0B132B" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
                <linearGradient id="wingGradientRight" x1="450" y1="220" x2="285" y2="150" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0B132B" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
                <linearGradient id="canopyGradient" x1="250" y1="50" x2="250" y2="145" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#0891B2" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#0E7490" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="exhaustGradientCenter" x1="250" y1="258" x2="250" y2="310" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="30%" stopColor="#F59E0B" />
                  <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="exhaustGradientSide" x1="250" y1="262" x2="250" y2="290" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Holographic Ship Specs Capsule */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-[#94A3B8]">
            <span className="px-2.5 py-1 rounded-full border border-white/10 bg-[#0B1226]/80 flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-[#34D399]" />
              Deflector Shields: 100%
            </span>
            <span className="px-2.5 py-1 rounded-full border border-white/10 bg-[#0B1226]/80 flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-[#38BDF8]" />
              Ion Reactor: Synced
            </span>
            <span className="px-2.5 py-1 rounded-full border border-white/10 bg-[#0B1226]/80 flex items-center gap-1.5">
              <Radio className="h-3 w-3 text-[#F59E0B]" />
              Telemetry: DSN Online
            </span>
          </div>

          {/* Big Prominent BOARD SPACECRAFT Launch Action */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={onBoardSpacecraft}
              data-testid="board-spacecraft-btn"
              className="group relative flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-sans text-base sm:text-lg font-black tracking-wider text-slate-950 bg-gradient-to-r from-[#38BDF8] via-[#67E8F9] to-[#38BDF8] hover:from-[#67E8F9] hover:to-[#38BDF8] shadow-[0_0_35px_rgba(56,189,248,0.5)] hover:shadow-[0_0_55px_rgba(56,189,248,0.8)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
            >
              <Rocket className="h-6 w-6 text-slate-950 transition-transform group-hover:-translate-y-1 group-hover:rotate-12" />
              <span>BOARD SPACECRAFT</span>
              <ArrowRight className="h-5 w-5 text-slate-950 transition-transform group-hover:translate-x-1" />

              {/* Pulsing outer aura ring */}
              <span className="absolute -inset-1 rounded-2xl border-2 border-[#38BDF8] opacity-50 animate-ping pointer-events-none" />
            </button>

            <div className="flex items-center gap-4 text-xs font-mono">
              <button
                type="button"
                onClick={onOpenLeaderboard}
                className="text-[#94A3B8] hover:text-[#F59E0B] flex items-center gap-1.5 transition-colors"
              >
                <Trophy className="h-3.5 w-3.5 text-[#F59E0B]" />
                <span>View Flight Leaderboard</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Telemetry Footer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-4 border-t border-white/5">
        <span>ORBIT ACADEMY FLIGHT SIMULATOR v2.5</span>
        <span>STATUS: PRE-FLIGHT CATAPULT CLEARED</span>
      </div>
    </div>
  );
};
