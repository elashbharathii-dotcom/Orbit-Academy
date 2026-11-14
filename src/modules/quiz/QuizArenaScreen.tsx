import React, { useState, useEffect } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import {
  QUIZ_CATEGORIES,
  QUIZ_ARENA_QUESTIONS,
  QuizQuestion,
} from './quizData';
import {
  Award,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap,
  Flame,
  ArrowRight,
  Trophy,
} from 'lucide-react';

export const QuizArenaScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isTimedBlitz, setIsTimedBlitz] = useState<boolean>(false);
  const [blitzSecondsLeft, setBlitzSecondsLeft] = useState<number>(60);

  // Active Quiz State
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [earnedXp, setEarnedXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Filtered pool
  const questionPool = QUIZ_ARENA_QUESTIONS.filter((q) => {
    const matchCat = selectedCategory === 'all' || q.category === selectedCategory;
    const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return matchCat && matchDiff;
  });

  const currentQ: QuizQuestion | undefined = questionPool[currentQuestionIndex];

  // 60-Second Timed Blitz Countdown
  useEffect(() => {
    if (!isQuizActive || !isTimedBlitz || isFinished) return;

    if (blitzSecondsLeft <= 0) {
      setIsFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setBlitzSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizActive, isTimedBlitz, blitzSecondsLeft, isFinished]);

  const handleStartArena = () => {
    setIsQuizActive(true);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setEarnedXp(0);
    setStreak(0);
    setIsFinished(false);
    setBlitzSecondsLeft(60);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQ || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    if (selectedOption === currentQ.correctIndex) {
      setScore((s) => s + 1);
      setEarnedXp((xp) => xp + currentQ.xpReward + streak * 10);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionPool.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#030712] font-sans text-[#F8FAFC]">
      <MasterHeader />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in flex flex-col gap-6">
        {/* Arena Hero Banner */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#171026] via-[#05070D] to-[#0A1628] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#A855F7] animate-ping" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#A855F7]">
                ASTRONOMY QUIZ ARENA
              </span>
              <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[9px] font-bold text-[#F59E0B]">
                7 ASTROPHYSICS DISCIPLINES
              </span>
            </div>

            <h1 className="mt-1 font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              Competitive Space Science Arena
            </h1>

            <p className="mt-1 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              Test your knowledge across stellar physics, relativity, solar system mechanics, and cosmology. 
              Compete against time in Blitz Mode, earn streak multipliers, and unlock master rankings.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-[#94A3B8]">
              <Trophy className="h-4 w-4 text-[#F59E0B]" />
              <span>Rank: Flight Commander</span>
            </div>
          </div>
        </div>

        {/* LOBBY VIEW: Configuration and Start */}
        {!isQuizActive && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Arena Category Selector */}
            <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#080F1D]/80 p-6 shadow-2xl backdrop-blur-xl flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[#A855F7] font-bold">
                1. SELECT ARENA DISCIPLINE
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {QUIZ_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all ${
                      selectedCategory === cat.id
                        ? 'border-[#A855F7] bg-[#A855F7]/15 shadow-md'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xl mb-1">{cat.icon}</span>
                    <span className="font-sans text-xs font-bold text-[#F8FAFC]">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Difficulty & Mode Selection */}
              <div className="mt-4 border-t border-white/5 pt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#94A3B8]">Difficulty:</span>
                  {['all', 'Cadet', 'Commander', 'Astrophysicist'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`rounded-full px-3 py-1 font-mono text-xs transition-all ${
                        selectedDifficulty === diff
                          ? 'border border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#F8FAFC]'
                          : 'border border-white/5 text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      {diff === 'all' ? 'All Tiers' : diff}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTimedBlitz((b) => !b)}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 font-mono text-xs transition-all ${
                      isTimedBlitz
                        ? 'border border-[#F59E0B] bg-[#F59E0B]/20 text-[#F59E0B] font-bold'
                        : 'border border-white/10 text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>60s Blitz Mode {isTimedBlitz ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Launch Action Card */}
            <div className="rounded-3xl border border-white/10 bg-[#080F1D]/80 p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#38BDF8] font-bold">
                  2. MISSION BRIEFING
                </span>

                <div className="mt-4 flex flex-col gap-3 font-mono text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-[#94A3B8]">Questions in Pool:</span>
                    <span className="text-[#F8FAFC] font-bold">{questionPool.length} Challenges</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-[#94A3B8]">Maximum XP:</span>
                    <span className="text-[#F59E0B] font-bold">
                      +{questionPool.reduce((acc, q) => acc + q.xpReward, 0)} XP
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-[#94A3B8]">Streak Multiplier:</span>
                    <span className="text-[#10B981] font-bold">+10 XP per consecutive correct</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={questionPool.length === 0}
                onClick={handleStartArena}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#A855F7] py-3.5 font-mono text-xs font-bold text-[#FFFFFF] shadow-lg transition-all hover:bg-[#9333EA] hover:scale-102 active:scale-98 disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4" />
                <span>START ARENA CHALLENGE</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE QUIZ ARENA VIEW */}
        {isQuizActive && !isFinished && currentQ && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Question & Options Card */}
            <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#080F1D]/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
              <div>
                {/* Header Status Bar */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-mono text-[9.5px] font-bold text-[#A855F7] border border-white/10">
                      {currentQ.category.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-[#94A3B8]">
                      Question {currentQuestionIndex + 1} of {questionPool.length}
                    </span>
                  </div>

                  {isTimedBlitz && (
                    <div className="flex items-center gap-1.5 font-mono text-xs text-[#F59E0B] font-bold animate-pulse">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{blitzSecondsLeft}s Left</span>
                    </div>
                  )}
                </div>

                <h2 className="mt-4 font-sans text-xl sm:text-2xl font-bold text-[#F8FAFC] leading-snug">
                  {currentQ.question}
                </h2>

                {/* Multiple Choice Options */}
                <div className="mt-6 flex flex-col gap-2.5">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = isAnswerSubmitted && idx === currentQ.correctIndex;
                    const isWrong = isAnswerSubmitted && isSelected && idx !== currentQ.correctIndex;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        className={`flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                          isCorrect
                            ? 'border-[#10B981] bg-[#10B981]/20 text-[#F8FAFC]'
                            : isWrong
                            ? 'border-red-500 bg-red-500/20 text-red-200'
                            : isSelected
                            ? 'border-[#A855F7] bg-[#A855F7]/15 text-[#F8FAFC]'
                            : 'border-white/5 bg-white/[0.02] text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
                        }`}
                      >
                        <span className="font-sans text-xs sm:text-sm">{option}</span>
                        {isCorrect && <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />}
                        {isWrong && <XCircle className="h-4 w-4 text-red-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Scientific Explanation Callout */}
                {isAnswerSubmitted && (
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-[#CBD5E1] animate-fade-in">
                    <span className="font-mono text-[10px] text-[#A855F7] font-bold block mb-1">
                      ASTROPHYSICS FACT:
                    </span>
                    {currentQ.explanation}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end">
                {!isAnswerSubmitted ? (
                  <button
                    type="button"
                    disabled={selectedOption === null}
                    onClick={handleSubmitAnswer}
                    className="rounded-xl bg-[#A855F7] px-6 py-2.5 font-mono text-xs font-bold text-[#FFFFFF] hover:bg-[#9333EA] disabled:opacity-40"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5 rounded-xl bg-[#10B981] px-6 py-2.5 font-mono text-xs font-bold text-[#05070D] hover:bg-[#34D399]"
                  >
                    <span>{currentQuestionIndex < questionPool.length - 1 ? 'Next Question →' : 'See Results'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Score & Streak Side Panel */}
            <div className="flex flex-col gap-5">
              <div className="rounded-3xl border border-white/10 bg-[#080F1D]/80 p-6 shadow-2xl backdrop-blur-xl font-mono text-xs flex flex-col gap-4">
                <span className="text-[10px] uppercase text-[#94A3B8] font-bold">
                  LIVE ARENA TELEMETRY
                </span>

                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[#94A3B8]">Correct Score:</span>
                  <span className="text-xl font-bold text-[#F8FAFC]">
                    {score} / {currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[#94A3B8]">Earned XP:</span>
                  <span className="text-lg font-bold text-[#F59E0B]">+{earnedXp} XP</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <span className="text-[#94A3B8]">Streak:</span>
                  </div>
                  <span className="text-base font-bold text-orange-400">{streak}x Multiplier</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {isFinished && (
          <div className="max-w-xl mx-auto w-full rounded-3xl border border-white/10 bg-[#080F1D]/90 p-8 shadow-2xl backdrop-blur-2xl text-center flex flex-col items-center gap-4 my-auto">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#A855F7]/15 border border-[#A855F7]/40 text-[#A855F7] shadow-[0_0_24px_rgba(168,85,247,0.5)]">
              <Award className="h-8 w-8" />
            </div>

            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              Arena Challenge Completed!
            </h2>

            <div className="flex items-center gap-6 font-mono text-sm my-2">
              <div>
                <span className="block text-xs text-[#94A3B8]">SCORE</span>
                <span className="text-2xl font-bold text-[#10B981]">{score} / {questionPool.length}</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="block text-xs text-[#94A3B8]">XP EARNED</span>
                <span className="text-2xl font-bold text-[#F59E0B]">+{earnedXp} XP</span>
              </div>
            </div>

            <p className="font-sans text-xs text-[#94A3B8] max-w-md">
              {score >= questionPool.length * 0.8
                ? 'Outstanding celestial mastery! You have demonstrated high astrophysics proficiency.'
                : 'Commendable exploration. Review the scientific explanations and challenge the arena again!'}
            </p>

            <button
              type="button"
              onClick={() => setIsQuizActive(false)}
              className="mt-4 flex items-center gap-2 rounded-xl bg-[#A855F7] px-6 py-2.5 font-mono text-xs font-bold text-[#FFFFFF] hover:bg-[#9333EA]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Return to Arena Lobby</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

