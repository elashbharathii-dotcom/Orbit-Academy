import React, { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { SpaceButton } from '../../components/ui/SpaceButton';
import { CockpitCanvas } from './CockpitCanvas';
import { LeaderboardPanel } from './LeaderboardPanel';
import { QuizRewardBreakdown, PlayerLevel, PlayerProfile, LeaderboardEntry, getLevelProgress } from './quizStore';
import { QuizQuestion } from './quizData';
import {
  RotateCcw,
  Home,
  BookOpen,
  HelpCircle,
  Sparkles,
  Rocket,
} from 'lucide-react';

interface QuestionResult {
  question: QuizQuestion;
  selectedOption: number;
  isCorrect: boolean;
  xpEarned: number;
}

interface CockpitMissionCompleteProps {
  score: number;
  totalQuestions: number;
  accuracyPercent: number;
  maxStreak: number;
  rewardBreakdown: QuizRewardBreakdown | null;
  playerProfile: PlayerProfile;
  currentLevel: PlayerLevel;
  leaderboard: LeaderboardEntry[];
  history: QuestionResult[];
  onFlyAgain: () => void;
  onReturnToHangar: () => void;
  onProfileUpdated: (updated: PlayerProfile) => void;
}

export const CockpitMissionComplete: React.FC<CockpitMissionCompleteProps> = ({
  score,
  totalQuestions,
  accuracyPercent,
  maxStreak,
  rewardBreakdown,
  playerProfile,
  currentLevel,
  leaderboard,
  history,
  onFlyAgain,
  onReturnToHangar,
  onProfileUpdated,
}) => {
  const [showReviewList, setShowReviewList] = useState<boolean>(false);
  const levelProgress = getLevelProgress(playerProfile.totalXp);
  const playerRankIndex = leaderboard.findIndex((e) => e.isCurrentPlayer);
  const playerRank = playerRankIndex !== -1 ? playerRankIndex + 1 : 1;

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#030611]">
      {/* Orbital View Canvas with glowing Earth limb below */}
      <CockpitCanvas mode="orbit" />

      <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col gap-6 my-auto py-4">

        {/* Main Mission Debrief Card */}
        <GlassCard
          variant="elevated"
          className="p-6 sm:p-10 border-glow-amber text-center flex flex-col items-center gap-6"
        >
          {/* Orbital Insertion Vessel Badge */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#B45309] via-[#F59E0B] to-[#FDE68A] text-slate-950 shadow-[0_0_40px_rgba(245,158,11,0.5)] border border-amber-300">
            <Rocket className="h-10 w-10 animate-bounce" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest text-[#F59E0B] font-bold">
              <Sparkles className="h-4 w-4" />
              <span>SPACECRAFT REACHED STABLE ORBIT // MISSION ACCOMPLISHED</span>
              <Sparkles className="h-4 w-4" />
            </div>

            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
              Orbital Mission Flight Debrief
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto">
              {accuracyPercent >= 80
                ? 'Flawless celestial navigation! Your astrophysical knowledge meets NASA Flight Commander standards.'
                : accuracyPercent >= 50
                  ? 'Solid orbital flight execution. Review debrief logs to elevate your astronaut rank.'
                  : 'Challenging atmospheric turbulence. Study the planetary science modules and launch again!'}
            </p>
          </div>

          {/* Metrics 4-Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl font-mono">
            <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col items-center">
              <span className="text-[10px] uppercase text-[#94A3B8]">Final Score</span>
              <span className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {score} / {totalQuestions}
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col items-center">
              <span className="text-[10px] uppercase text-[#94A3B8]">Accuracy</span>
              <span className="text-xl sm:text-2xl font-bold text-[#34D399] mt-0.5">
                {accuracyPercent}%
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col items-center">
              <span className="text-[10px] uppercase text-[#94A3B8]">Round XP</span>
              <span className="text-xl sm:text-2xl font-bold text-[#F59E0B] mt-0.5">
                +{rewardBreakdown ? rewardBreakdown.totalEarnedXp : score * 100} XP
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col items-center">
              <span className="text-[10px] uppercase text-[#94A3B8]">Peak Streak</span>
              <span className="text-xl sm:text-2xl font-bold text-orange-400 mt-0.5">
                {maxStreak}x Flame
              </span>
            </div>
          </div>

          {/* XP Breakdown & Rank Advancement */}
          {rewardBreakdown && (
            <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-[#0B1226]/90 p-4 text-left font-mono text-xs space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold block">
                FLIGHT REWARD AUDIT:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-white/10 pb-3">
                <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded">
                  <span className="text-[#94A3B8]">Solutions ({score}×):</span>
                  <span className="font-bold text-[#38BDF8]">+{rewardBreakdown.correctAnswersXp} XP</span>
                </div>
                <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded">
                  <span className="text-[#94A3B8]">Orbit Insertion:</span>
                  <span className="font-bold text-[#34D399]">+{rewardBreakdown.completionBonusXp} XP</span>
                </div>
                <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded">
                  <span className="text-[#94A3B8]">100% Perfect Bonus:</span>
                  <span className={`font-bold ${rewardBreakdown.perfectBonusXp > 0 ? 'text-[#F59E0B]' : 'text-slate-600'}`}>
                    +{rewardBreakdown.perfectBonusXp} XP
                  </span>
                </div>
              </div>

              {/* Pilot Tier & Total XP Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div>
                  <span className="text-[#94A3B8] block text-[10px]">TOTAL CAREER FLIGHT XP:</span>
                  <span className="text-sm font-bold text-white">
                    {playerProfile.totalXp.toLocaleString()} XP
                  </span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[10px]">CURRENT RANK:</span>
                  <span className="text-sm font-bold text-[#38BDF8]">
                    Level {currentLevel.level}: {currentLevel.name}
                  </span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[10px]">LEADERBOARD POSITION:</span>
                  <span className="text-sm font-bold text-[#F59E0B]">
                    #{playerRank} of {leaderboard.length}
                  </span>
                </div>
              </div>

              {/* Progress to next tier */}
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-gradient-to-r from-[#38BDF8] via-[#A78BFA] to-[#F59E0B] transition-all duration-500 rounded-full"
                  style={{ width: `${levelProgress.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full max-w-md">
            <SpaceButton
              variant="primary"
              size="md"
              onClick={onFlyAgain}
              icon={RotateCcw}
              className="flex-1 font-bold"
            >
              Fly Another Mission
            </SpaceButton>

            <SpaceButton
              variant="secondary"
              size="md"
              onClick={onReturnToHangar}
              icon={Home}
              className="flex-1 font-bold"
            >
              Return to Hangar
            </SpaceButton>
          </div>

          {/* Toggle Detailed Review */}
          <button
            type="button"
            onClick={() => setShowReviewList((v) => !v)}
            className="font-mono text-xs text-[#38BDF8] hover:underline flex items-center gap-1.5 pt-1"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>{showReviewList ? 'Hide Detailed Answers' : 'Review Scientific Explanations'}</span>
          </button>
        </GlassCard>

        {/* Detailed Question Review List */}
        {showReviewList && history.length > 0 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#38BDF8]" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#38BDF8] font-bold">
                AVIONICS DEBRIEF: QUESTION ANALYSIS
              </h3>
            </div>

            {history.map((item, idx) => (
              <GlassCard
                key={idx}
                variant="default"
                className={`p-5 border-l-4 ${item.isCorrect ? 'border-l-[#34D399]' : 'border-l-red-500'
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-[#94A3B8]">
                      Vector {idx + 1} • {item.question.category.toUpperCase()}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      {item.question.question}
                    </h4>
                  </div>

                  <span className={`shrink-0 font-mono text-xs font-bold px-2.5 py-1 rounded-full border ${item.isCorrect
                      ? 'border-[#34D399]/40 bg-[#34D399]/15 text-[#34D399]'
                      : 'border-red-500/40 bg-red-500/15 text-red-300'
                    }`}>
                    {item.isCorrect ? `+100 XP` : '0 XP'}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#94A3B8] block text-[11px]">Your Solution:</span>
                    <span className={`font-semibold ${item.isCorrect ? 'text-[#34D399]' : 'text-red-300'}`}>
                      {item.question.options[item.selectedOption]}
                    </span>
                  </div>
                  {!item.isCorrect && (
                    <div>
                      <span className="text-[#94A3B8] block text-[11px]">Verified Physics Solution:</span>
                      <span className="font-semibold text-[#34D399]">
                        {item.question.options[item.question.correctIndex]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 rounded-lg bg-[#0B1226]/80 p-3 text-xs text-[#CBD5E1]">
                  <span className="font-mono text-[10px] text-[#A78BFA] font-bold block mb-1">
                    NASA DEBRIEF:
                  </span>
                  {item.question.explanation}
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Live Leaderboard Standings */}
        <div className="animate-fade-in">
          <LeaderboardPanel
            entries={leaderboard}
            playerProfile={playerProfile}
            onProfileUpdated={onProfileUpdated}
          />
        </div>

      </div>
    </div>
  );
};
