import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { SpaceButton } from '../../components/ui/SpaceButton';
import { TelemetryBadge } from '../../components/ui/TelemetryBadge';
import { CockpitCanvas } from './CockpitCanvas';
import { QUIZ_CATEGORIES, QuizQuestion } from './quizData';
import { PlayerLevel, PlayerProfile } from './quizStore';
import {
  Zap,
  Target,
  Clock,
  ChevronLeft,
  Radio,
  Compass,
  Cpu,
  ShieldCheck,
  Play,
} from 'lucide-react';

interface CockpitPreFlightProps {
  playerProfile: PlayerProfile;
  currentLevel: PlayerLevel;
  selectedCategory: string;
  selectedDifficulty: string;
  isTimedBlitz: boolean;
  questionPool: QuizQuestion[];
  onSelectCategory: (cat: string) => void;
  onSelectDifficulty: (diff: string) => void;
  onToggleTimedBlitz: (blitz: boolean) => void;
  onStartMission: () => void;
  onReturnToHangar: () => void;
}

export const CockpitPreFlight: React.FC<CockpitPreFlightProps> = ({
  playerProfile,
  currentLevel,
  selectedCategory,
  selectedDifficulty,
  isTimedBlitz,
  questionPool,
  onSelectCategory,
  onSelectDifficulty,
  onToggleTimedBlitz,
  onStartMission,
  onReturnToHangar,
}) => {
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(3);

  // 3-Second Launch Countdown sequence
  useEffect(() => {
    if (!isCountingDown) return;

    if (countdownSeconds <= 0) {
      onStartMission();
      return;
    }

    const timer = setTimeout(() => {
      setCountdownSeconds((s) => s - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isCountingDown, countdownSeconds, onStartMission]);

  const handleLaunchClick = () => {
    setIsCountingDown(true);
    setCountdownSeconds(3);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-hidden bg-[#030611]">
      {/* Background Starfield / Hyperspace Canvas */}
      <CockpitCanvas mode={isCountingDown ? 'warp' : 'orbit'} />

      {/* Cockpit Canopy Strut Overlay Brackets */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top Canopy crossbar */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#0B1226] to-transparent border-b border-white/10" />
        {/* Left Strut */}
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-[#070C1B] to-transparent border-r border-[#38BDF8]/20 hidden md:block" />
        {/* Right Strut */}
        <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[#070C1B] to-transparent border-l border-[#38BDF8]/20 hidden md:block" />
      </div>

      {/* Main Cockpit Flight Hub */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Cockpit Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReturnToHangar}
              disabled={isCountingDown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0B1226]/80 text-xs font-mono text-[#94A3B8] hover:text-white hover:border-white/30 transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>RETURN TO HANGAR</span>
            </button>

            <TelemetryBadge
              label="COCKPIT HUD"
              value={`PILOT: ${playerProfile.name.toUpperCase()}`}
              tone="cyan"
              size="sm"
            />
            <TelemetryBadge
              label="RANK"
              value={`LVL ${currentLevel.level} • ${currentLevel.name.toUpperCase()}`}
              tone={currentLevel.badgeTone}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#34D399] animate-ping" />
            <span className="font-mono text-xs text-[#34D399] font-bold">
              ALL SYSTEMS GO FOR LAUNCH
            </span>
          </div>
        </div>

        {/* 3-Second Launch Countdown Fullscreen Overlay */}
        {isCountingDown && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-xl animate-fade-in">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="font-mono text-xs uppercase tracking-widest text-[#F59E0B] font-bold animate-pulse">
                ORBITAL INSERTION IGNITION SEQUENCE
              </span>

              {/* Massive Countdown Number */}
              <div className="flex h-36 w-36 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 text-slate-950 font-black text-7xl shadow-[0_0_80px_rgba(245,158,11,0.8)] border-4 border-white animate-bounce">
                {countdownSeconds > 0 ? countdownSeconds : 'GO!'}
              </div>

              <span className="font-mono text-sm text-[#38BDF8] font-bold">
                {countdownSeconds === 3 && 'MAIN ION THRUSTERS: 100%'}
                {countdownSeconds === 2 && 'TRAJECTORY VECTOR: LOCKED'}
                {countdownSeconds === 1 && 'COMMENCING HYPERSPEED FLIGHT!'}
                {countdownSeconds <= 0 && 'ENTERING CELESTIAL QUIZ ARENA...'}
              </span>
            </div>
          </div>
        )}

        {/* Cockpit Avionics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Flight Avionics Status (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <GlassCard variant="default" className="p-5 border-glow-cyan flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Cpu className="h-4 w-4 text-[#38BDF8]" />
                <h3 className="font-mono text-xs uppercase font-bold text-[#38BDF8] tracking-wider">
                  VESSEL AVIONICS DIAGNOSTIC
                </h3>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-white/[0.02]">
                  <span className="text-[#94A3B8] flex items-center gap-2">
                    <Compass className="h-3.5 w-3.5 text-[#38BDF8]" />
                    Target Vector:
                  </span>
                  <span className="font-bold text-white">L2 Lagrange Orbit</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-white/[0.02]">
                  <span className="text-[#94A3B8] flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-[#F59E0B]" />
                    Engine Reactor:
                  </span>
                  <span className="font-bold text-[#34D399]">Ion Pulse 100%</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-white/[0.02]">
                  <span className="text-[#94A3B8] flex items-center gap-2">
                    <Radio className="h-3.5 w-3.5 text-[#A78BFA]" />
                    Comms Uplink:
                  </span>
                  <span className="font-bold text-[#38BDF8]">NASA DSN Linked</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-white/[0.02]">
                  <span className="text-[#94A3B8] flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#34D399]" />
                    Canopy Pressure:
                  </span>
                  <span className="font-bold text-[#34D399]">1.013 bar (Nominal)</span>
                </div>
              </div>

              {/* Protocol Selector: Standard vs Blitz */}
              <div className="pt-2 border-t border-white/10">
                <span className="font-mono text-xs text-[#94A3B8] block mb-2">Flight Protocol:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleTimedBlitz(false)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      !isTimedBlitz
                        ? 'border-[#34D399] bg-[#34D399]/20 text-white'
                        : 'border-white/10 bg-[#0B1226]/60 text-[#94A3B8]'
                    }`}
                  >
                    <span className="font-sans text-xs font-bold block">Standard</span>
                    <span className="font-mono text-[10px] text-[#94A3B8]">Untimed analysis</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleTimedBlitz(true)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isTimedBlitz
                        ? 'border-[#F59E0B] bg-[#F59E0B]/20 text-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                        : 'border-white/10 bg-[#0B1226]/60 text-[#94A3B8]'
                    }`}
                  >
                    <span className="font-sans text-xs font-bold block flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      60s Blitz
                    </span>
                    <span className="font-mono text-[10px] text-[#94A3B8]">Countdown rush</span>
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Center & Right: Target Mission Selection (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* 1. Category Selection */}
            <GlassCard variant="default" className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#A78BFA]" />
                  <h3 className="font-mono text-xs uppercase font-bold text-[#A78BFA] tracking-wider">
                    TARGET ASTROPHYSICS ARENA
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#94A3B8]">
                  {questionPool.length} Challenges Armed
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUIZ_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onSelectCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'border-[#A78BFA] bg-[#A78BFA]/20 shadow-[0_0_14px_rgba(167,139,250,0.3)]'
                          : 'border-white/10 bg-[#0B1226]/70 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-sans text-xs font-bold text-white truncate max-w-full">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* 2. Difficulty Tiers & Launch Button Strip */}
            <GlassCard variant="default" className="p-5 flex flex-col gap-4 border-glow-amber">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <span className="font-mono text-xs text-[#94A3B8]">Flight Difficulty Tier:</span>
                <div className="flex items-center gap-2">
                  {['all', 'Cadet', 'Commander', 'Astrophysicist'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => onSelectDifficulty(diff)}
                      className={`px-3 py-1 rounded-lg font-mono text-xs transition-all ${
                        selectedDifficulty === diff
                          ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                          : 'bg-white/5 text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      {diff === 'all' ? 'All Tiers' : diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Big START MISSION Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="font-mono text-xs text-[#94A3B8]">
                  <span>Rewards: </span>
                  <strong className="text-[#38BDF8]">+100 XP / correct</strong>
                  <span> • </span>
                  <strong className="text-[#34D399]">+50 XP completion</strong>
                  <span> • </span>
                  <strong className="text-[#F59E0B]">+200 XP perfect</strong>
                </div>

                <SpaceButton
                  variant="primary"
                  size="lg"
                  disabled={questionPool.length === 0}
                  onClick={handleLaunchClick}
                  icon={Play}
                  className="py-3 px-8 text-sm font-black tracking-wider shadow-[0_0_30px_rgba(56,189,248,0.5)]"
                >
                  START MISSION ({questionPool.length} QUESTIONS)
                </SpaceButton>
              </div>
            </GlassCard>

          </div>

        </div>

      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-4 border-t border-white/5">
        <span>COCKPIT HEADS-UP DISPLAY ACTIVE</span>
        <span>PRESS [START MISSION] TO COMMENCE LAUNCH</span>
      </div>
    </div>
  );
};
