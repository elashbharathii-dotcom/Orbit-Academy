import React, { useState, useEffect } from 'react';
import { Activity, Award, Sparkles } from 'lucide-react';

interface BottomStatusFooterProps {
  isBuildValid: boolean;
  validationMessage?: string;
  triangleCount?: number;
  unlockedAchievementTitle?: string;
  unlockedXpReward?: number;
}

export const BottomStatusFooter: React.FC<BottomStatusFooterProps> = ({
  isBuildValid,
  validationMessage = 'Build Ready • 100% Valid',
  triangleCount = 245000,
  unlockedAchievementTitle = 'Shipwright',
  unlockedXpReward = 250,
}) => {
  const [fps, setFps] = useState<number>(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <footer className="w-full flex flex-wrap items-center justify-between px-4 py-1.5 border-t border-white/5 bg-[#030611]/95 text-[10.5px] font-mono text-[#64748B] select-none gap-2 z-10">
      {/* 1. Left: Hardware Telemetry Readouts */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-[#00E5FF]">
          <Activity className="h-3 w-3 animate-pulse" />
          <span className="font-bold">FPS: {fps}</span>
        </div>
        <span>|</span>
        <span>Memory: 2.8 GB</span>
        <span>|</span>
        <span>Triangles: {(triangleCount / 1000).toFixed(0)}K</span>
      </div>

      {/* 2. Center: Validation Status */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          {isBuildValid && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-75" />
          )}
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${
              isBuildValid ? 'bg-[#34D399]' : 'bg-amber-400'
            }`}
          />
        </span>
        <span
          className={`font-sans text-[11px] font-bold ${
            isBuildValid ? 'text-[#34D399]' : 'text-amber-400'
          }`}
        >
          {validationMessage}
        </span>
      </div>

      {/* 3. Right: Cadet Progression Telemetry */}
      <div className="flex items-center gap-2 text-[#CBD5E1]">
        <div className="flex items-center gap-1 text-[#F59E0B] font-bold">
          <Award className="h-3.5 w-3.5" />
          <span>+{unlockedXpReward} XP</span>
        </div>
        <span>|</span>
        <div className="flex items-center gap-1 text-[#A78BFA]">
          <Sparkles className="h-3 w-3" />
          <span>Achievement: {unlockedAchievementTitle}</span>
        </div>
      </div>
    </footer>
  );
};
