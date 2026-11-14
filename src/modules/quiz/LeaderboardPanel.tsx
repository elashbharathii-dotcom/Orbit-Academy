import React, { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { SpaceButton } from '../../components/ui/SpaceButton';
import { TelemetryBadge } from '../../components/ui/TelemetryBadge';
import {
  LeaderboardEntry,
  PlayerProfile,
  updatePlayerName,
} from './quizStore';
import {
  Trophy,
  Medal,
  Crown,
  User,
  Check,
  Edit2,
  Sparkles,
  Zap,
} from 'lucide-react';

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[];
  playerProfile: PlayerProfile;
  onProfileUpdated?: (updated: PlayerProfile) => void;
  className?: string;
}

export const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({
  entries,
  playerProfile,
  onProfileUpdated,
  className = '',
}) => {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(playerProfile.name);

  // Find player's current rank
  const playerRankIndex = entries.findIndex((e) => e.isCurrentPlayer);
  const playerRank = playerRankIndex !== -1 ? playerRankIndex + 1 : entries.length;

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nameInput.trim()) return;
    const updated = updatePlayerName(nameInput.trim());
    setIsEditingName(false);
    if (onProfileUpdated) {
      onProfileUpdated(updated);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 text-slate-950 font-black shadow-[0_0_18px_rgba(251,191,36,0.65)] border border-yellow-200">
          <Crown className="h-4 w-4" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-400 via-slate-200 to-white text-slate-950 font-black shadow-[0_0_14px_rgba(203,213,225,0.6)] border border-slate-300">
          <Medal className="h-4 w-4" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-700 via-amber-500 to-amber-300 text-amber-950 font-black shadow-[0_0_14px_rgba(217,119,6,0.5)] border border-amber-400">
          <Medal className="h-4 w-4" />
        </div>
      );
    }
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] font-mono text-xs text-[#94A3B8] font-bold">
        #{rank}
      </span>
    );
  };

  return (
    <GlassCard
      variant="elevated"
      className={`p-6 sm:p-7 flex flex-col gap-6 backdrop-blur-2xl bg-[#0B1024]/75 border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.8)] ${className}`}
    >
      {/* Header & Current Rank Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#B45309] to-[#FBBF24] text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.4)]">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-sans text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <span>Flight Academy Leaderboard</span>
              <Sparkles className="h-4 w-4 text-[#FBBF24] animate-pulse" />
            </h3>
            <span className="font-mono text-xs text-[#94A3B8]">
              Live galactic standings sorted by verified flight XP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TelemetryBadge
            label="YOUR RANK"
            value={`#${playerRank} OF ${entries.length}`}
            tone={playerRank <= 3 ? 'amber' : 'cyan'}
            size="sm"
            pulsing={playerRank === 1}
          />
        </div>
      </div>

      {/* Editable Player Identity Strip */}
      <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] backdrop-blur-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0284C7] to-[#38DDF8] text-slate-950 font-bold shadow-[0_0_14px_rgba(56,221,248,0.4)]">
            <User className="h-4 w-4" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-[#94A3B8] tracking-wider block">
              PILOT CALL-SIGN
            </span>
            {!isEditingName ? (
              <span className="font-sans text-sm font-bold text-white flex items-center gap-2">
                {playerProfile.name}
                <span className="font-mono text-[10px] text-[#38DDF8] px-2 py-0.5 rounded-full bg-[#38DDF8]/15 border border-[#38DDF8]/35 font-bold">
                  YOU
                </span>
              </span>
            ) : (
              <form onSubmit={handleSaveName} className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  maxLength={24}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter call-sign..."
                  className="rounded-lg border border-[#38DDF8]/60 bg-[#050816] px-3 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#38DDF8]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#38DDF8] p-1.5 text-slate-950 hover:bg-[#38DDF8]/80 transition-colors"
                  title="Save Call-Sign"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {!isEditingName && (
          <SpaceButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setNameInput(playerProfile.name);
              setIsEditingName(true);
            }}
            icon={Edit2}
            className="text-xs border border-white/10 hover:border-[#38DDF8]/40"
          >
            Change Call-Sign
          </SpaceButton>
        )}
      </div>

      {/* Leaderboard Table / Ranking Rows */}
      <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1.5 scrollbar-thin">
        {entries.map((entry, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;
          const isUser = entry.isCurrentPlayer;

          return (
            <div
              key={entry.id}
              className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${
                isUser
                  ? 'border-[#38DDF8] bg-gradient-to-r from-[#38DDF8]/15 via-[#A78BFA]/10 to-[#38DDF8]/15 shadow-[0_0_25px_rgba(56,221,248,0.25)]'
                  : isTop3
                  ? 'border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25 shadow-sm'
                  : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]'
              }`}
            >
              {/* Left: Rank & Pilot Identity */}
              <div className="flex items-center gap-3.5">
                {getRankBadge(rank)}

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs sm:text-sm font-bold tracking-wide ${
                        isUser ? 'text-[#38DDF8]' : 'text-white'
                      }`}
                    >
                      {entry.name}
                    </span>
                    {isUser && (
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#38DDF8] bg-[#38DDF8]/20 border border-[#38DDF8]/40 px-1.5 py-0.5 rounded-full font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10.5px] text-[#94A3B8]">
                    {entry.levelName} • {entry.completedQuizzes}{' '}
                    {entry.completedQuizzes === 1 ? 'mission' : 'missions'}
                  </span>
                </div>
              </div>

              {/* Right: Flight XP & Rank Badge */}
              <div className="flex items-center gap-3 text-right">
                <div className="flex flex-col items-end">
                  <span
                    className={`font-mono text-xs sm:text-sm font-extrabold flex items-center gap-1 ${
                      isTop3 ? 'text-[#FBBF24]' : 'text-white'
                    }`}
                  >
                    <Zap className="h-3 w-3 text-[#FBBF24]" />
                    {entry.totalXp.toLocaleString()} XP
                  </span>
                  <span className="font-mono text-[10px] text-[#94A3B8]">
                    LVL {entry.level}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-[#38DDF8]" />
          <span>+100 XP / answer • +50 completion • +200 perfect</span>
        </span>
        <span className="text-[#64748B]">LocalStorage Engine</span>
      </div>
    </GlassCard>
  );
};
