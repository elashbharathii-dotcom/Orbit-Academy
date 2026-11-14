import React from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { SpaceButton } from '../../components/ui/SpaceButton';
import { TelemetryBadge } from '../../components/ui/TelemetryBadge';
import { QuizQuestion } from './quizData';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Atom,
  Crosshair,
  Compass,
  Radio,
  Shield,
} from 'lucide-react';

interface AircraftQuizBoxProps {
  currentQ: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  progressPercent: number;
  selectedOption: number | null;
  isAnswerSubmitted: boolean;
  isTimedBlitz: boolean;
  blitzSecondsLeft: number;
  onSelectOption: (idx: number) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
}

export const AircraftQuizBox: React.FC<AircraftQuizBoxProps> = ({
  currentQ,
  questionIndex,
  totalQuestions,
  progressPercent,
  selectedOption,
  isAnswerSubmitted,
  isTimedBlitz,
  blitzSecondsLeft,
  onSelectOption,
  onSubmitAnswer,
  onNextQuestion,
}) => {
  return (
    <div className="relative w-full flex flex-col gap-4">
      {/* 1. Aircraft Avionics Canopy Top Instrument Ribbon */}
      <div className="w-full rounded-2xl border border-white/[0.1] bg-[#050816]/90 backdrop-blur-xl p-2.5 px-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
        {/* Left: Aircraft Flight Attitude Diagnostics */}
        <div className="flex items-center gap-3 sm:gap-4 text-[#38DDF8]">
          <span className="flex items-center gap-1.5 font-bold">
            <Compass className="h-3.5 w-3.5 text-[#38DDF8]" />
            <span>HDG 184° SSE</span>
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="hidden sm:inline text-[#94A3B8]">PITCH +02°</span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="hidden md:inline text-[#94A3B8]">ALT 420.8 KM</span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="text-[#FBBF24] font-bold">MACH 25.4</span>
        </div>

        {/* Right: Weapons/Avionics Systems Status */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-[#34D399] font-bold">
            <Shield className="h-3 w-3" />
            <span className="hidden sm:inline">DEFLECTOR:</span> 100%
          </span>
          <span className="flex items-center gap-1 text-[#A78BFA] font-bold">
            <Radio className="h-3 w-3" />
            <span>DSN: LINKED</span>
          </span>
        </div>
      </div>

      {/* 2. Main Aircraft Tactical HUD Cockpit Box */}
      <GlassCard
        variant="elevated"
        className="relative p-6 sm:p-8 flex flex-col justify-between min-h-[500px] backdrop-blur-2xl bg-white/[0.05] border border-white/[0.14] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        glowingBorder={isAnswerSubmitted ? (selectedOption === currentQ.correctIndex ? 'cyan' : 'none') : 'violet'}
      >
        {/* Tactical HUD Corner Reticle Brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#38DDF8]/70 pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#38DDF8]/70 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#38DDF8]/70 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#38DDF8]/70 pointer-events-none" />

        {/* Subtle Pitch Ladder Lines on Left & Right Margins */}
        <div className="absolute left-2 top-1/3 bottom-1/3 flex flex-col justify-between font-mono text-[9px] text-[#38DDF8]/30 pointer-events-none select-none hidden md:flex">
          <span>+15° ──</span>
          <span>+10° ────</span>
          <span>+05° ──</span>
          <span className="text-[#38DDF8]/60 font-bold">00° ──────</span>
          <span>-05° ──</span>
          <span>-10° ────</span>
          <span>-15° ──</span>
        </div>

        <div className="absolute right-2 top-1/3 bottom-1/3 flex flex-col justify-between font-mono text-[9px] text-[#38DDF8]/30 pointer-events-none select-none hidden md:flex items-end">
          <span>── +15°</span>
          <span>──── +10°</span>
          <span>── +05°</span>
          <span className="text-[#38DDF8]/60 font-bold">────── 00°</span>
          <span>── -05°</span>
          <span>──── -10°</span>
          <span>── -15°</span>
        </div>

        {/* Center Target Crosshair Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
          <Crosshair className="w-80 h-80 text-[#38DDF8]" />
        </div>

        <div>
          {/* Top Telemetry & Timer HUD Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <TelemetryBadge
                label="TARGET ARENA"
                value={currentQ.category.toUpperCase()}
                tone="violet"
                size="sm"
              />
              <TelemetryBadge
                label="THREAT TIER"
                value={currentQ.difficulty.toUpperCase()}
                tone={currentQ.difficulty === 'Astrophysicist' ? 'amber' : 'cyan'}
                size="sm"
              />
            </div>

            <div className="flex items-center gap-4">
              {isTimedBlitz && (
                <div className={`flex items-center gap-1.5 font-mono text-xs font-bold px-3.5 py-1 rounded-full border ${
                  blitzSecondsLeft <= 10
                    ? 'border-red-500 bg-red-500/20 text-red-300 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                    : 'border-[#FBBF24]/50 bg-[#FBBF24]/15 text-[#FBBF24] shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                }`}>
                  <Clock className="h-3.5 w-3.5" />
                  <span>{blitzSecondsLeft}s BLITZ COUNTDOWN</span>
                </div>
              )}

              <span className="font-mono text-xs text-[#94A3B8]">
                Target Vector <strong className="text-white">{questionIndex + 1}</strong> of {totalQuestions}
              </span>
            </div>
          </div>

          {/* Gradient Trajectory Progress Bar */}
          <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden mt-3 mb-6">
            <div
              className="h-full bg-gradient-to-r from-[#38DDF8] via-[#A78BFA] to-[#34D399] transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(56,221,248,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question Stem with Target Lock Subtitle */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#38DDF8] uppercase tracking-wider">
              <Crosshair className="h-3 w-3 animate-spin text-[#38DDF8]" />
              <span>ACTIVE TARGET MISSION OBJECTIVE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug tracking-tight">
              {currentQ.question}
            </h2>
          </div>

          {/* Four Tactical Aircraft Multiple-Choice Option Cards */}
          <div className="mt-6 flex flex-col gap-3">
            {currentQ.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              const isSelected = selectedOption === idx;
              const isCorrect = isAnswerSubmitted && idx === currentQ.correctIndex;
              const isWrong = isAnswerSubmitted && isSelected && idx !== currentQ.correctIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswerSubmitted}
                  onClick={() => onSelectOption(idx)}
                  data-testid={`quiz-option-${idx}`}
                  className={`group relative flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 backdrop-blur-xl ${
                    isCorrect
                      ? 'border-[#34D399] bg-[#34D399]/20 text-white shadow-[0_0_25px_rgba(52,211,153,0.35)] scale-[1.01]'
                      : isWrong
                      ? 'border-red-500 bg-red-500/20 text-red-200 shadow-[0_0_25px_rgba(239,68,68,0.35)]'
                      : isSelected
                      ? 'border-[#38DDF8] bg-[#38DDF8]/15 text-white shadow-[0_0_20px_rgba(56,221,248,0.3)] scale-[1.01]'
                      : 'border-white/[0.08] bg-white/[0.03] text-[#CBD5E1] hover:border-[#38DDF8]/40 hover:bg-white/[0.07] hover:scale-[1.005]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Aircraft Tactical Weapon Pod Badge */}
                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl font-mono text-xs font-black transition-all ${
                      isCorrect
                        ? 'bg-[#34D399] text-[#030611] shadow-[0_0_12px_#34D399]'
                        : isWrong
                        ? 'bg-red-500 text-white'
                        : isSelected
                        ? 'bg-[#38DDF8] text-[#030611] shadow-[0_0_12px_#38DDF8]'
                        : 'bg-white/10 text-[#94A3B8] group-hover:bg-[#38DDF8]/20 group-hover:text-white'
                    }`}>
                      {letter}
                    </span>

                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] text-[#94A3B8] uppercase tracking-wider group-hover:text-[#38DDF8]">
                        TARGET VECTOR {letter}
                      </span>
                      <span className="text-sm sm:text-base font-semibold leading-relaxed">
                        {option}
                      </span>
                    </div>
                  </div>

                  {/* Right Status Pill */}
                  <div className="shrink-0 ml-3 font-mono text-xs font-bold">
                    {isCorrect && (
                      <div className="flex items-center gap-1.5 text-[#34D399]">
                        <CheckCircle2 className="h-5 w-5 text-[#34D399]" />
                        <span className="hidden sm:inline">TRAJECTORY VERIFIED</span>
                      </div>
                    )}
                    {isWrong && (
                      <div className="flex items-center gap-1.5 text-red-400">
                        <XCircle className="h-5 w-5 text-red-400" />
                        <span className="hidden sm:inline">TRAJECTORY REJECTED</span>
                      </div>
                    )}
                    {!isAnswerSubmitted && isSelected && (
                      <span className="hidden sm:inline text-[#38DDF8] text-[10px] tracking-wider">
                        [ TGT LOCKED ]
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* NASA Flight Debrief Terminal */}
          {isAnswerSubmitted && (
            <div className="mt-5 rounded-2xl border border-white/[0.1] bg-black/60 backdrop-blur-xl p-5 animate-fade-in shadow-2xl relative">
              <div className="flex items-center gap-2 mb-1.5">
                <Atom className="h-4 w-4 text-[#A78BFA]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                  HUD FLIGHT DEBRIEF // NASA ASTROPHYSICS DATA-LINK
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Cockpit Controls & Fire Confirmation Action */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#94A3B8]">
            <span className="h-2 w-2 rounded-full bg-[#34D399] animate-pulse" />
            <span className="hidden sm:inline">
              {!isAnswerSubmitted
                ? 'FLIGHT COMPUTER ARMED: [1–4 / A–D] SELECT • [ENTER] CONFIRM'
                : 'TRAJECTORY CONFIRMED: PRESS [ENTER] TO ADVANCE'}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {!isAnswerSubmitted ? (
              <SpaceButton
                variant="primary"
                size="md"
                disabled={selectedOption === null}
                onClick={onSubmitAnswer}
                icon={Crosshair}
                data-testid="submit-solution-btn"
                className="font-bold shadow-[0_0_20px_rgba(56,221,248,0.3)] bg-gradient-to-r from-[#0284C7] to-[#38DDF8]"
              >
                Confirm Trajectory Solution
              </SpaceButton>
            ) : (
              <SpaceButton
                variant="primary"
                size="md"
                onClick={onNextQuestion}
                icon={ArrowRight}
                iconPosition="right"
                data-testid="next-challenge-btn"
                className="font-bold shadow-[0_0_20px_rgba(56,221,248,0.4)]"
              >
                {questionIndex < totalQuestions - 1 ? 'Next Celestial Vector' : 'Orbital Insertion Debrief'}
              </SpaceButton>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

