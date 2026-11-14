import React from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { SpaceButton } from '../../components/ui/SpaceButton';
import { PlayerLevel } from './quizStore';
import { Sparkles, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';

interface LevelUpNotificationProps {
  newLevel: PlayerLevel;
  totalXp: number;
  onClose: () => void;
}

export const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({
  newLevel,
  totalXp,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <GlassCard
        variant="elevated"
        className="max-w-md w-full p-8 border-glow-amber text-center flex flex-col items-center gap-5 shadow-2xl relative overflow-hidden"
      >
        {/* Stellar Glow Beam Background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#F59E0B]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Level Up Emblem */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#B45309] via-[#F59E0B] to-[#FDE68A] text-slate-950 shadow-[0_0_40px_rgba(245,158,11,0.5)] border border-amber-300">
          <Trophy className="h-12 w-12 animate-bounce" />
          <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 border border-amber-400 text-amber-400 font-mono text-xs font-black shadow-lg">
            {newLevel.level}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#F59E0B]">
            <Sparkles className="h-4 w-4" />
            <span>FLIGHT RANK PROMOTION</span>
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Level {newLevel.level}: {newLevel.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xs mx-auto pt-1 leading-relaxed">
            Congratulations, explorer! Your mastery of cosmic science has officially promoted you to the flight tier of <strong className="text-white">{newLevel.name}</strong>.
          </p>
        </div>

        {/* Telemetry pill */}
        <div className="w-full bg-[#0B1226]/80 rounded-xl border border-white/10 p-3 flex items-center justify-around font-mono text-xs">
          <div>
            <span className="text-[10px] uppercase text-[#94A3B8] block">CURRENT XP</span>
            <span className="text-sm font-bold text-[#F59E0B]">
              {totalXp.toLocaleString()} XP
            </span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <span className="text-[10px] uppercase text-[#94A3B8] block">TIER STATUS</span>
            <span className="text-sm font-bold text-[#34D399] flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              CONFIRMED
            </span>
          </div>
        </div>

        <div className="w-full pt-2">
          <SpaceButton
            variant="primary"
            size="lg"
            onClick={onClose}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full py-3.5 text-sm font-bold tracking-wider"
          >
            CLAIM PROMOTION & CONTINUE
          </SpaceButton>
        </div>
      </GlassCard>
    </div>
  );
};
