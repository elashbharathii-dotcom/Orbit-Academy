import React, { useEffect } from 'react';
import { BuilderAchievement } from '../types';
import { Sparkles, Award, CheckCircle2, Flame, Hammer, X } from 'lucide-react';

interface ProgressionToastProps {
  achievement: BuilderAchievement | null;
  onDismiss: () => void;
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Award,
  CheckCircle2,
  Flame,
  Hammer,
};

export const ProgressionToast: React.FC<ProgressionToastProps> = ({
  achievement,
  onDismiss,
}) => {
  useEffect(() => {
    if (!achievement) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  const Icon = ICONS[achievement.iconName] || Sparkles;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-[#F59E0B]/50 bg-[#070C1B]/95 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-fade-in sm:max-w-md">
      {/* Icon Emblem */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F59E0B]/50 bg-[#F59E0B]/20 text-[#F59E0B] shadow-[0_0_16px_rgba(245,158,11,0.35)]">
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold tracking-wider text-[#F59E0B]">
          <span>ACHIEVEMENT UNLOCKED</span>
          <span>•</span>
          <span className="text-[#34D399]">+{achievement.xpReward} XP</span>
        </div>
        <span className="font-sans text-xs sm:text-sm font-extrabold text-white truncate">
          {achievement.title}
        </span>
        <span className="font-sans text-[11px] text-[#94A3B8] leading-tight">
          {achievement.description}
        </span>
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={onDismiss}
        title="Dismiss alert"
        className="text-[#64748B] hover:text-white transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
