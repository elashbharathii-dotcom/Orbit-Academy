import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { TelemetryBadge } from '../../components/ui/TelemetryBadge';
import { SpaceButton } from '../../components/ui/SpaceButton';
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
  Target,
  ChevronRight,
  Atom,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

interface QuestionResult {
  question: QuizQuestion;
  selectedOption: number;
  isCorrect: boolean;
  xpEarned: number;
}

export const QuizArenaScreen: React.FC = () => {
  // Lobby Configuration State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isTimedBlitz, setIsTimedBlitz] = useState<boolean>(false);

  // Active Quiz State
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [earnedXp, setEarnedXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [blitzSecondsLeft, setBlitzSecondsLeft] = useState<number>(60);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showReviewList, setShowReviewList] = useState<boolean>(false);

  // Answer history for review screen
  const [history, setHistory] = useState<QuestionResult[]>([]);

  // Filter questions based on selected category and difficulty
  const questionPool = useMemo(() => {
    return QUIZ_ARENA_QUESTIONS.filter((q) => {
      const matchCat = selectedCategory === 'all' || q.category === selectedCategory;
      const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      return matchCat && matchDiff;
    });
  }, [selectedCategory, selectedDifficulty]);

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

  // Start / Reset Arena
  const handleStartArena = useCallback(() => {
    if (questionPool.length === 0) return;
    setIsQuizActive(true);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setEarnedXp(0);
    setStreak(0);
    setMaxStreak(0);
    setIsFinished(false);
    setBlitzSecondsLeft(60);
    setHistory([]);
    setShowReviewList(false);
  }, [questionPool.length]);

  // Handle Option Select
  const handleSelectOption = useCallback((idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  }, [isAnswerSubmitted]);

  // Submit Answer
  const handleSubmitAnswer = useCallback(() => {
    if (selectedOption === null || !currentQ || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctIndex;
    const streakBonus = isCorrect ? streak * 10 : 0;
    const questionXp = isCorrect ? currentQ.xpReward + streakBonus : 0;

    if (isCorrect) {
      setScore((s) => s + 1);
      setEarnedXp((xp) => xp + questionXp);
      setStreak((st) => {
        const nextStreak = st + 1;
        setMaxStreak((m) => Math.max(m, nextStreak));
        return nextStreak;
      });
    } else {
      setStreak(0);
    }

    // Record into history
    setHistory((prev) => [
      ...prev,
      {
        question: currentQ,
        selectedOption,
        isCorrect,
        xpEarned: questionXp,
      },
    ]);
  }, [selectedOption, currentQ, isAnswerSubmitted, streak]);

  // Next Question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questionPool.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
    }
  }, [currentQuestionIndex, questionPool.length]);

  // Keyboard Navigation: 1-4, A-D, Enter
  useEffect(() => {
    if (!isQuizActive || isFinished || !currentQ) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toLowerCase();

      if (!isAnswerSubmitted) {
        if (key === '1' || key === 'a') handleSelectOption(0);
        else if (key === '2' || key === 'b') handleSelectOption(1);
        else if (key === '3' || key === 'c') handleSelectOption(2);
        else if (key === '4' || key === 'd') handleSelectOption(3);
        else if (e.key === 'Enter' && selectedOption !== null) {
          handleSubmitAnswer();
        }
      } else {
        if (e.key === 'Enter') {
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuizActive, isFinished, currentQ, isAnswerSubmitted, selectedOption, handleSelectOption, handleSubmitAnswer, handleNextQuestion]);

  // Category question count lookup
  const getCategoryQuestionCount = (catId: string) => {
    if (catId === 'all') return QUIZ_ARENA_QUESTIONS.length;
    return QUIZ_ARENA_QUESTIONS.filter((q) => q.category === catId).length;
  };

  const progressPercent = questionPool.length > 0 
    ? Math.round(((currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)) / questionPool.length) * 100)
    : 0;

  const accuracyPercent = questionPool.length > 0
    ? Math.round((score / questionPool.length) * 100)
    : 0;

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#030611] font-sans text-[#F8FAFC]">
      <MasterHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
        
        {/* ================================================================= */}
        {/* 1. LOBBY VIEW: TOURNAMENT COMMAND HUB                             */}
        {/* ================================================================= */}
        {!isQuizActive && !isFinished && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Arena Hero Banner */}
            <GlassCard
              variant="elevated"
              className="p-6 sm:p-8 border-glow-violet bg-gradient-to-r from-[#171026]/90 via-[#070C1B]/95 to-[#0A1628]/90"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <TelemetryBadge
                      label="ARENA MODE"
                      value="LIVE TOURNAMENT"
                      tone="violet"
                      pulsing
                      icon={Trophy}
                      size="sm"
                    />
                    <TelemetryBadge
                      label="DISCIPLINES"
                      value="7 DOMAINS"
                      tone="cyan"
                      size="sm"
                    />
                    <TelemetryBadge
                      label="CHALLENGES"
                      value={`${QUIZ_ARENA_QUESTIONS.length} TOTAL`}
                      tone="amber"
                      size="sm"
                    />
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                      <span>Space Science Quiz Arena</span>
                      <Sparkles className="h-6 w-6 text-[#A78BFA] hidden sm:inline-block animate-pulse" />
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                      Compete in astrophysics tournaments testing orbital mechanics, general relativity, stellar evolution, and deep-space observation. Earn streak multipliers and advance your NASA flight rank.
                    </p>
                  </div>
                </div>

                {/* Player Telemetry Capsule */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
                  <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col justify-between">
                    <span className="font-mono text-[10px] uppercase text-[#94A3B8]">Career Rank</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#A78BFA]">Commander</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col justify-between">
                    <span className="font-mono text-[10px] uppercase text-[#94A3B8]">Career XP</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#F59E0B]">2,450 XP</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col justify-between">
                    <span className="font-mono text-[10px] uppercase text-[#94A3B8]">Accuracy</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#34D399]">92.4%</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col justify-between">
                    <span className="font-mono text-[10px] uppercase text-[#94A3B8]">Best Streak</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-orange-400">8x Flame</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Arena Selection and Mission Briefing Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Discipline Categories (8 Cols) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* 1. Category Selector */}
                <GlassCard variant="default" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-[#A78BFA]" />
                      <h2 className="font-mono text-xs uppercase tracking-wider text-[#A78BFA] font-bold">
                        1. SELECT ASTROPHYSICS ARENA
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-[#94A3B8]">
                      {getCategoryQuestionCount(selectedCategory)} Questions Available
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {QUIZ_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      const count = getCategoryQuestionCount(cat.id);

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`relative group rounded-xl p-3.5 flex flex-col items-center justify-center text-center transition-all duration-200 border ${
                            isSelected
                              ? 'border-[#A78BFA] bg-[#A78BFA]/20 shadow-[0_0_16px_rgba(167,139,250,0.3)]'
                              : 'border-white/10 bg-[#0B1226]/60 hover:bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <span className="text-2xl mb-1.5 transition-transform group-hover:scale-110">
                            {cat.icon}
                          </span>
                          <span className="font-sans text-xs font-bold text-[#F8FAFC] leading-snug">
                            {cat.label}
                          </span>
                          <span className="mt-1 font-mono text-[10px] text-[#94A3B8]">
                            {count} {count === 1 ? 'question' : 'questions'}
                          </span>
                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#A78BFA] shadow-[0_0_6px_#A78BFA]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </GlassCard>

                {/* 2. Difficulty & Mode Configuration */}
                <GlassCard variant="default" className="p-6">
                  <h2 className="font-mono text-xs uppercase tracking-wider text-[#38BDF8] font-bold mb-4 flex items-center gap-2">
                    <Atom className="h-4 w-4 text-[#38BDF8]" />
                    2. TOURNAMENT SPECIFICATIONS
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Difficulty Tier */}
                    <div>
                      <span className="font-mono text-xs text-[#94A3B8] block mb-2">Difficulty Tier:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'all', label: 'All Tiers', desc: 'Full spectrum' },
                          { id: 'Cadet', label: 'Cadet', desc: '50 XP Base' },
                          { id: 'Commander', label: 'Commander', desc: '75 XP Base' },
                          { id: 'Astrophysicist', label: 'Astrophysicist', desc: '100 XP Base' },
                        ].map((diff) => (
                          <button
                            key={diff.id}
                            type="button"
                            onClick={() => setSelectedDifficulty(diff.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              selectedDifficulty === diff.id
                                ? 'border-[#38BDF8] bg-[#38BDF8]/15 text-white shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                                : 'border-white/10 bg-[#0B1226]/60 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
                            }`}
                          >
                            <span className="block font-sans text-xs font-bold">{diff.label}</span>
                            <span className="block font-mono text-[10px] text-[#94A3B8]">{diff.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mode: Standard vs Blitz */}
                    <div>
                      <span className="font-mono text-xs text-[#94A3B8] block mb-2">Tournament Protocol:</span>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => setIsTimedBlitz(false)}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                            !isTimedBlitz
                              ? 'border-[#34D399] bg-[#34D399]/15 text-white'
                              : 'border-white/10 bg-[#0B1226]/60 text-[#94A3B8] hover:text-[#F8FAFC]'
                          }`}
                        >
                          <div>
                            <span className="font-sans text-xs font-bold block text-white">Standard Tournament</span>
                            <span className="font-mono text-[10px] text-[#94A3B8]">Untimed. Deep cosmological analysis.</span>
                          </div>
                          {!isTimedBlitz && <CheckCircle2 className="h-4 w-4 text-[#34D399]" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsTimedBlitz(true)}
                          data-testid="blitz-mode-btn"
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                            isTimedBlitz
                              ? 'border-[#F59E0B] bg-[#F59E0B]/20 text-[#F59E0B] shadow-[0_0_14px_rgba(245,158,11,0.25)]'
                              : 'border-white/10 bg-[#0B1226]/60 text-[#94A3B8] hover:text-[#F8FAFC]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-[#F59E0B] shrink-0" />
                            <div>
                              <span className="font-sans text-xs font-bold block text-white">60s Timed Blitz</span>
                              <span className="font-mono text-[10px] text-[#94A3B8]">High speed adrenaline countdown.</span>
                            </div>
                          </div>
                          {isTimedBlitz && <CheckCircle2 className="h-4 w-4 text-[#F59E0B]" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>

              </div>

              {/* Right Column: Mission Briefing & Launch (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col">
                <GlassCard
                  variant="elevated"
                  className="p-6 flex-1 flex flex-col justify-between border-glow-cyan"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                      <BookOpen className="h-4 w-4 text-[#38BDF8]" />
                      <h2 className="font-mono text-xs uppercase tracking-wider text-[#38BDF8] font-bold">
                        MISSION BRIEFING
                      </h2>
                    </div>

                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      Engage NASA-curated challenges testing core astrophysics, planetary geophysics, and aerospace history. Answers require precise scientific deduction.
                    </p>

                    <div className="space-y-2.5 font-mono text-xs pt-2">
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-[#94A3B8]">Pool Size:</span>
                        <span className="text-white font-bold">{questionPool.length} Challenges</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-[#94A3B8]">Potential XP:</span>
                        <span className="text-[#F59E0B] font-bold">
                          +{questionPool.reduce((acc, q) => acc + q.xpReward, 0)} XP
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-[#94A3B8]">Streak Multiplier:</span>
                        <span className="text-[#34D399] font-bold">+10 XP / consecutive</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-[#94A3B8]">Timer Protocol:</span>
                        <span className={`font-bold ${isTimedBlitz ? 'text-[#F59E0B]' : 'text-white'}`}>
                          {isTimedBlitz ? '60s Countdown' : 'Untimed Mission'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <SpaceButton
                      variant="primary"
                      size="lg"
                      disabled={questionPool.length === 0}
                      onClick={handleStartArena}
                      className="w-full py-4 text-sm font-bold tracking-wider"
                      icon={Sparkles}
                      data-testid="start-arena-btn"
                    >
                      ENGAGE TOURNAMENT ARENA
                    </SpaceButton>

                    {questionPool.length === 0 && (
                      <p className="mt-2 text-center font-mono text-[11px] text-red-400">
                        No questions in pool. Broaden category or tier filter.
                      </p>
                    )}
                  </div>
                </GlassCard>
              </div>

            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. ACTIVE QUIZ VIEW: TACTICAL ARENA EXPERIENCE                   */}
        {/* ================================================================= */}
        {isQuizActive && !isFinished && currentQ && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            
            {/* Main Interactive Stage (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <GlassCard
                variant="elevated"
                className="p-6 sm:p-8 flex flex-col justify-between min-h-[480px]"
                glowingBorder={isAnswerSubmitted ? (selectedOption === currentQ.correctIndex ? 'cyan' : 'none') : 'violet'}
              >
                <div>
                  {/* Arena Top Telemetry Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <TelemetryBadge
                        label="ARENA"
                        value={currentQ.category.toUpperCase()}
                        tone="violet"
                        size="sm"
                      />
                      <TelemetryBadge
                        label="TIER"
                        value={currentQ.difficulty}
                        tone={currentQ.difficulty === 'Astrophysicist' ? 'amber' : 'cyan'}
                        size="sm"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      {isTimedBlitz && (
                        <div className={`flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1 rounded-full border ${
                          blitzSecondsLeft <= 10
                            ? 'border-red-500 bg-red-500/20 text-red-300 animate-pulse'
                            : 'border-[#F59E0B]/50 bg-[#F59E0B]/15 text-[#F59E0B]'
                        }`}>
                          <Clock className="h-3.5 w-3.5" />
                          <span>{blitzSecondsLeft}s REMAINING</span>
                        </div>
                      )}

                      <span className="font-mono text-xs text-[#94A3B8]">
                        Question <strong className="text-white">{currentQuestionIndex + 1}</strong> of {questionPool.length}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div className="w-full bg-[#0B1226] h-1.5 rounded-full overflow-hidden mt-3 mb-6">
                    <div
                      className="h-full bg-gradient-to-r from-[#38BDF8] via-[#A78BFA] to-[#34D399] transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Question Stem */}
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    {currentQ.question}
                  </h2>

                  {/* Answer Option Buttons (A, B, C, D) */}
                  <div className="mt-6 flex flex-col gap-3">
                    {currentQ.options.map((option, idx) => {
                      const letter = String.fromCharCode(65 + idx); // 'A', 'B', 'C', 'D'
                      const isSelected = selectedOption === idx;
                      const isCorrect = isAnswerSubmitted && idx === currentQ.correctIndex;
                      const isWrong = isAnswerSubmitted && isSelected && idx !== currentQ.correctIndex;

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswerSubmitted}
                          onClick={() => handleSelectOption(idx)}
                          data-testid={`quiz-option-${idx}`}
                          className={`group relative flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 ${
                            isCorrect
                              ? 'border-[#34D399] bg-[#34D399]/20 text-white shadow-[0_0_16px_rgba(52,211,153,0.3)]'
                              : isWrong
                              ? 'border-red-500 bg-red-500/20 text-red-200 shadow-[0_0_16px_rgba(239,68,68,0.3)]'
                              : isSelected
                              ? 'border-[#A78BFA] bg-[#A78BFA]/15 text-white shadow-[0_0_12px_rgba(167,139,250,0.25)]'
                              : 'border-white/10 bg-[#0B1226]/70 text-[#CBD5E1] hover:border-white/25 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold transition-all ${
                              isCorrect
                                ? 'bg-[#34D399] text-[#030611]'
                                : isWrong
                                ? 'bg-red-500 text-white'
                                : isSelected
                                ? 'bg-[#A78BFA] text-[#030611]'
                                : 'bg-white/10 text-[#94A3B8] group-hover:bg-white/20 group-hover:text-white'
                            }`}>
                              {letter}
                            </span>
                            <span className="text-sm sm:text-base font-medium">
                              {option}
                            </span>
                          </div>

                          <div className="shrink-0 ml-3">
                            {isCorrect && (
                              <div className="flex items-center gap-1.5 font-mono text-xs text-[#34D399] font-bold">
                                <CheckCircle2 className="h-5 w-5 text-[#34D399]" />
                                <span className="hidden sm:inline">CORRECT</span>
                              </div>
                            )}
                            {isWrong && (
                              <div className="flex items-center gap-1.5 font-mono text-xs text-red-400 font-bold">
                                <XCircle className="h-5 w-5 text-red-400" />
                                <span className="hidden sm:inline">INCORRECT</span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Scientific Fact Explanatory Debrief */}
                  {isAnswerSubmitted && (
                    <div className="mt-5 rounded-xl border border-white/10 bg-[#0B1226]/90 p-4 sm:p-5 animate-fade-in shadow-xl">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Atom className="h-4 w-4 text-[#A78BFA]" />
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                          NASA ASTROPHYSICS DEBRIEF
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed">
                        {currentQ.explanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation Actions */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-xs text-[#94A3B8] hidden sm:inline">
                    {!isAnswerSubmitted
                      ? 'Press [A–D] or [1–4] to select, [Enter] to confirm'
                      : 'Press [Enter] to continue'}
                  </span>

                  <div className="flex items-center gap-3 ml-auto">
                    {!isAnswerSubmitted ? (
                      <SpaceButton
                        variant="primary"
                        size="md"
                        disabled={selectedOption === null}
                        onClick={handleSubmitAnswer}
                        icon={CheckCircle2}
                        data-testid="submit-solution-btn"
                      >
                        Confirm Solution
                      </SpaceButton>
                    ) : (
                      <SpaceButton
                        variant="primary"
                        size="md"
                        onClick={handleNextQuestion}
                        icon={ArrowRight}
                        iconPosition="right"
                        data-testid="next-challenge-btn"
                      >
                        {currentQuestionIndex < questionPool.length - 1 ? 'Next Celestial Challenge' : 'View Tournament Debrief'}
                      </SpaceButton>
                    )}
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Right Telemetry & Streak Panel (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              
              {/* Live Telemetry Card */}
              <GlassCard variant="default" className="p-5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold block mb-3">
                  LIVE TOURNAMENT TELEMETRY
                </span>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-[#94A3B8]">Score Tally:</span>
                    <span className="text-lg font-bold text-white">
                      {score} / {currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-[#94A3B8]">Accumulated XP:</span>
                    <span className="text-lg font-bold text-[#F59E0B]">
                      +{earnedXp} XP
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-[#94A3B8]">Question Value:</span>
                    <span className="text-white font-bold">
                      +{currentQ.xpReward} XP Base
                    </span>
                  </div>

                  {/* Flame Streak Multiplier Gauge */}
                  <div className="py-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Flame className={`h-4 w-4 ${streak > 0 ? 'text-orange-400 animate-bounce' : 'text-[#94A3B8]'}`} />
                        <span className="text-[#94A3B8]">Current Streak:</span>
                      </div>
                      <span className={`font-bold ${streak > 0 ? 'text-orange-400' : 'text-[#94A3B8]'}`}>
                        {streak}x Multiplier
                      </span>
                    </div>

                    <div className="w-full bg-[#0B1226] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300 rounded-full"
                        style={{ width: `${Math.min(100, streak * 20)}%` }}
                      />
                    </div>
                    <span className="mt-1 font-mono text-[10px] text-[#94A3B8] block text-right">
                      {streak >= 3 ? '🔥 Solar Flare Bonus active (+30+ XP)' : 'Reach 3x streak for extra bonus'}
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Tournament Abandon Button */}
              <GlassCard variant="subtle" className="p-4 flex items-center justify-between">
                <div>
                  <span className="block font-sans text-xs font-bold text-white">Need to recalibrate?</span>
                  <span className="block font-mono text-[10px] text-[#94A3B8]">Exit tournament to arena lobby</span>
                </div>
                <SpaceButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsQuizActive(false)}
                  data-testid="exit-arena-btn"
                >
                  Exit
                </SpaceButton>
              </GlassCard>

            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* 3. POST-QUIZ RESULTS & MISSION DEBRIEF                           */}
        {/* ================================================================= */}
        {isFinished && (
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 animate-fade-in my-auto py-6">
            <GlassCard
              variant="elevated"
              className="p-8 sm:p-10 border-glow-amber text-center flex flex-col items-center gap-6"
            >
              {/* Award Trophy Badge */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#F59E0B] shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                <Award className="h-10 w-10 animate-pulse" />
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#F59E0B] font-bold">
                  MISSION COMPLETE
                </span>
                <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                  Astrophysics Arena Debrief
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-[#94A3B8] max-w-lg mx-auto">
                  {accuracyPercent >= 80
                    ? 'Superb celestial mastery. Your cosmological deduction and astrophysics knowledge meet Flight Commander certification standards.'
                    : accuracyPercent >= 50
                    ? 'Commendable mission execution. Review the orbital physics debriefs below and re-engage the arena to elevate your rank.'
                    : 'Challenging stellar flight. Explore the Science Lab to study foundational gravitational mechanics and retry.'}
                </p>
              </div>

              {/* Metrics Showcase Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-xl font-mono">
                <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3.5 flex flex-col items-center">
                  <span className="text-[10px] uppercase text-[#94A3B8]">Final Score</span>
                  <span className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {score} / {questionPool.length}
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3.5 flex flex-col items-center">
                  <span className="text-[10px] uppercase text-[#94A3B8]">Accuracy</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#34D399] mt-1">
                    {accuracyPercent}%
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3.5 flex flex-col items-center">
                  <span className="text-[10px] uppercase text-[#94A3B8]">XP Awarded</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#F59E0B] mt-1">
                    +{earnedXp}
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3.5 flex flex-col items-center">
                  <span className="text-[10px] uppercase text-[#94A3B8]">Peak Streak</span>
                  <span className="text-xl sm:text-2xl font-bold text-orange-400 mt-1">
                    {maxStreak}x
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full max-w-md">
                <SpaceButton
                  variant="primary"
                  size="md"
                  onClick={handleStartArena}
                  icon={RotateCcw}
                  className="flex-1"
                >
                  Re-Engage Tournament
                </SpaceButton>

                <SpaceButton
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setIsQuizActive(false);
                    setIsFinished(false);
                  }}
                  icon={ChevronRight}
                  className="flex-1"
                  data-testid="return-to-lobby-btn"
                >
                  Return to Lobby
                </SpaceButton>
              </div>

              {/* Toggle Question Review Breakdown */}
              <button
                type="button"
                onClick={() => setShowReviewList((v) => !v)}
                className="font-mono text-xs text-[#38BDF8] hover:underline flex items-center gap-1.5 pt-2"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{showReviewList ? 'Hide Detailed Answers' : 'Review Question Explanations'}</span>
              </button>
            </GlassCard>

            {/* Detailed Question Review List */}
            {showReviewList && history.length > 0 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#38BDF8]" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[#38BDF8] font-bold">
                    DEBRIEF: QUESTION-BY-QUESTION ANALYSIS
                  </h3>
                </div>

                {history.map((item, idx) => (
                  <GlassCard
                    key={idx}
                    variant="default"
                    className={`p-5 border-l-4 ${
                      item.isCorrect ? 'border-l-[#34D399]' : 'border-l-red-500'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-mono text-[10px] uppercase text-[#94A3B8]">
                          Challenge {idx + 1} • {item.question.category.toUpperCase()}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">
                          {item.question.question}
                        </h4>
                      </div>

                      <span className={`shrink-0 font-mono text-xs font-bold px-2.5 py-1 rounded-full border ${
                        item.isCorrect
                          ? 'border-[#34D399]/40 bg-[#34D399]/15 text-[#34D399]'
                          : 'border-red-500/40 bg-red-500/15 text-red-300'
                      }`}>
                        {item.isCorrect ? `+${item.xpEarned} XP` : '0 XP'}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[#94A3B8] block text-[11px]">Your Answer:</span>
                        <span className={`font-semibold ${item.isCorrect ? 'text-[#34D399]' : 'text-red-300'}`}>
                          {item.question.options[item.selectedOption]}
                        </span>
                      </div>
                      {!item.isCorrect && (
                        <div>
                          <span className="text-[#94A3B8] block text-[11px]">Correct Verified Answer:</span>
                          <span className="font-semibold text-[#34D399]">
                            {item.question.options[item.question.correctIndex]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 rounded-lg bg-[#0B1226]/80 p-3 text-xs text-[#CBD5E1]">
                      <span className="font-mono text-[10px] text-[#A78BFA] font-bold block mb-1">
                        EXPLANATION:
                      </span>
                      {item.question.explanation}
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};
