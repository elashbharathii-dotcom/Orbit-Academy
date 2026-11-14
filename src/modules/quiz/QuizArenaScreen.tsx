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
  PlayerLevel,
  PlayerProfile,
  LeaderboardEntry,
  QuizRewardBreakdown,
  PLAYER_LEVELS,
  getPlayerLevel,
  getLevelProgress,
  loadPlayerProfile,
  loadLeaderboard,
  awardQuizAttempt,
  updatePlayerName,
} from './quizStore';
import { CosmicBackground } from './CosmicBackground';
import { LeaderboardPanel } from './LeaderboardPanel';
import { LevelUpNotification } from './LevelUpNotification';
import { GlassCategoryCard } from './GlassCategoryCard';
import { CinematicAircraftLaunch } from './CinematicAircraftLaunch';
import {
  Clock,
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
  Sparkles,
  Edit2,
  Check,
  Shield,
  Play,
  Rocket,
} from 'lucide-react';

interface QuestionResult {
  question: QuizQuestion;
  selectedOption: number;
  isCorrect: boolean;
  xpEarned: number;
}

export const QuizArenaScreen: React.FC = () => {
  // ---------------------------------------------------------------------------
  // 1. Persistent Player Profile, Level, & Leaderboard State
  // ---------------------------------------------------------------------------
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(() => loadPlayerProfile());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => loadLeaderboard());
  const [levelUpModal, setLevelUpModal] = useState<PlayerLevel | null>(null);
  const [rewardBreakdown, setRewardBreakdown] = useState<QuizRewardBreakdown | null>(null);
  const [isEditingCallSign, setIsEditingCallSign] = useState<boolean>(false);
  const [callSignInput, setCallSignInput] = useState<string>(() => loadPlayerProfile().name);

  // Active attempt tracker to strictly prevent duplicate XP rewards
  const [currentAttemptId, setCurrentAttemptId] = useState<string>(() => `attempt-${Date.now()}`);

  // Derived Player Level & Progress
  const currentLevel = useMemo(() => getPlayerLevel(playerProfile.totalXp), [playerProfile.totalXp]);
  const levelProgress = useMemo(() => getLevelProgress(playerProfile.totalXp), [playerProfile.totalXp]);

  // Current rank in leaderboard
  const currentPlayerRank = useMemo(() => {
    const idx = leaderboard.findIndex((e) => e.isCurrentPlayer);
    return idx !== -1 ? idx + 1 : 1;
  }, [leaderboard]);

  // ---------------------------------------------------------------------------
  // 2. Navigation Tabs (Arenas vs Leaderboard)
  // ---------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<'arenas' | 'leaderboard'>('arenas');

  // ---------------------------------------------------------------------------
  // 3. Quiz Configuration State
  // ---------------------------------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isTimedBlitz, setIsTimedBlitz] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // 4. Active Quiz State
  // ---------------------------------------------------------------------------
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [earnedXp, setEarnedXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [blitzSecondsLeft, setBlitzSecondsLeft] = useState<number>(60);
  const [standardSecondsLeft, setStandardSecondsLeft] = useState<number>(300);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
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

  // Selected category metadata
  const selectedCatMeta = useMemo(() => {
    return QUIZ_CATEGORIES.find((c) => c.id === selectedCategory) || QUIZ_CATEGORIES[0];
  }, [selectedCategory]);

  // ---------------------------------------------------------------------------
  // 5. Award XP & Process Quiz Completion (Single idempotent execution)
  // ---------------------------------------------------------------------------
  const finalizeQuizAttempt = useCallback(
    (finalScore: number, totalQ: number, peakStreak: number) => {
      const result = awardQuizAttempt({
        attemptId: currentAttemptId,
        score: finalScore,
        totalQuestions: totalQ,
        maxStreak: peakStreak,
      });

      if (result) {
        setRewardBreakdown(result);
        const updatedProfile = loadPlayerProfile();
        setPlayerProfile(updatedProfile);
        setLeaderboard(loadLeaderboard());

        if (result.didLevelUp) {
          setLevelUpModal(result.newLevel);
        }
      }
      setIsFinished(true);
    },
    [currentAttemptId]
  );

  // ---------------------------------------------------------------------------
  // 6. 60-Second Timed Blitz Countdown
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isQuizActive || !isTimedBlitz || isFinished) return;

    if (blitzSecondsLeft <= 0) {
      finalizeQuizAttempt(score, questionPool.length, maxStreak);
      return;
    }

    const timer = setInterval(() => {
      setBlitzSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizActive, isTimedBlitz, blitzSecondsLeft, isFinished, finalizeQuizAttempt, score, questionPool.length, maxStreak]);

  // 6b. Standard 5-Minute (300s) Countdown
  useEffect(() => {
    if (!isQuizActive || isTimedBlitz || isFinished) return;

    if (standardSecondsLeft <= 0) {
      finalizeQuizAttempt(score, questionPool.length, maxStreak);
      return;
    }

    const timer = setInterval(() => {
      setStandardSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizActive, isTimedBlitz, standardSecondsLeft, isFinished, finalizeQuizAttempt, score, questionPool.length, maxStreak]);

  // ---------------------------------------------------------------------------
  // 7. Start / Reset Arena & Launch Sequence
  // ---------------------------------------------------------------------------
  const handleStartArena = useCallback(() => {
    if (questionPool.length === 0) return;
    const newAttemptId = `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setCurrentAttemptId(newAttemptId);
    setRewardBreakdown(null);
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
    setStandardSecondsLeft(300);
    setHistory([]);
    setShowReviewList(false);
  }, [questionPool.length]);

  const handleInitiateLaunch = useCallback(() => {
    if (questionPool.length === 0) return;
    setIsLaunching(true);
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
    // Standard base scoring: +100 XP per correct answer + streak bonus
    const questionXp = isCorrect ? 100 + streakBonus : 0;

    let nextScore = score;
    let nextMaxStreak = maxStreak;

    if (isCorrect) {
      nextScore = score + 1;
      setScore(nextScore);
      setEarnedXp((xp) => xp + questionXp);
      setStreak((st) => {
        const nextStreak = st + 1;
        nextMaxStreak = Math.max(maxStreak, nextStreak);
        setMaxStreak(nextMaxStreak);
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
  }, [selectedOption, currentQ, isAnswerSubmitted, streak, score, maxStreak]);

  // Next Question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questionPool.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      finalizeQuizAttempt(score, questionPool.length, maxStreak);
    }
  }, [currentQuestionIndex, questionPool.length, finalizeQuizAttempt, score, maxStreak]);

  // Keyboard Navigation: 1-4, A-D, Enter
  useEffect(() => {
    if (!isQuizActive || isFinished || !currentQ) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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

  const progressPercent = questionPool.length > 0 
    ? Math.round(((currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)) / questionPool.length) * 100)
    : 0;

  const accuracyPercent = questionPool.length > 0
    ? Math.round((score / questionPool.length) * 100)
    : 0;

  const handleSaveCallSign = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!callSignInput.trim()) return;
    const updated = updatePlayerName(callSignInput);
    setPlayerProfile(updated);
    setLeaderboard(loadLeaderboard());
    setIsEditingCallSign(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans text-[#F8FAFC] overflow-x-hidden selection:bg-[#38DDF8]/30">
      {/* 1. Animated Cosmic Ambient Canvas Background */}
      <CosmicBackground />

      {/* 2. Top Sleek Transparent Glass Header */}
      <MasterHeader />

      {/* 3. Global Level-Up Promotion Modal */}
      {levelUpModal && (
        <LevelUpNotification
          newLevel={levelUpModal}
          totalXp={playerProfile.totalXp}
          onClose={() => setLevelUpModal(null)}
        />
      )}

      {/* 3b. Signature Cinematic Aircraft Launch Sequence */}
      {isLaunching && (
        <CinematicAircraftLaunch
          categoryMeta={selectedCatMeta}
          difficulty={selectedDifficulty}
          questionCount={questionPool.length}
          isTimedBlitz={isTimedBlitz}
          onLaunchComplete={() => {
            setIsLaunching(false);
            handleStartArena();
          }}
        />
      )}

      {/* Main Viewport Container */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">

        {/* ================================================================= */}
        {/* 1. LOBBY VIEW: GLASSMORPHISM TOURNAMENT HUB                       */}
        {/* ================================================================= */}
        {!isQuizActive && !isFinished && (
          <div className="flex flex-col gap-6 animate-fade-in">
            
            {/* 1.1 PLAYER PROFILE HEADER (Futuristic Glass Panel) */}
            <GlassCard
              variant="elevated"
              className="p-6 sm:p-7 backdrop-blur-2xl bg-white/[0.05] border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-3xl"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                
                {/* Left: Astronaut Avatar + Identity */}
                <div className="flex items-center gap-4 sm:gap-5">
                  {/* Glowing Astronaut Avatar Ring */}
                  <div className="relative shrink-0">
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0B1024] via-[#121C38] to-[#1E293B] border-2 border-[#38DDF8]/50 shadow-[0_0_25px_rgba(56,221,248,0.35)] p-1">
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#0284C7]/20 to-[#A78BFA]/20 text-3xl sm:text-4xl">
                        🧑‍🚀
                      </div>
                    </div>
                    {/* Rank Pip Badge */}
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 border border-[#38DDF8] text-[10px] font-mono font-bold text-[#38DDF8] shadow-[0_0_8px_#38DDF8]">
                      {currentLevel.level}
                    </span>
                  </div>

                  {/* Pilot Name, Title & Status */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <TelemetryBadge
                        label="PILOT TIER"
                        value={`LVL ${currentLevel.level} • ${currentLevel.name.toUpperCase()}`}
                        tone={currentLevel.badgeTone}
                        pulsing
                        icon={Shield}
                        size="sm"
                      />
                      <TelemetryBadge
                        label="GLOBAL RANK"
                        value={`#${currentPlayerRank} OF ${leaderboard.length}`}
                        tone={currentPlayerRank <= 3 ? 'amber' : 'cyan'}
                        size="sm"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      {!isEditingCallSign ? (
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                          <span>{playerProfile.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setCallSignInput(playerProfile.name);
                              setIsEditingCallSign(true);
                            }}
                            className="text-[#94A3B8] hover:text-[#38DDF8] transition-colors p-1"
                            title="Edit Call-Sign"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        </h1>
                      ) : (
                        <form onSubmit={handleSaveCallSign} className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            maxLength={22}
                            value={callSignInput}
                            onChange={(e) => setCallSignInput(e.target.value)}
                            className="rounded-xl border border-[#38DDF8] bg-[#050816] px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#38DDF8]"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="bg-[#38DDF8] text-slate-950 px-2.5 py-1 rounded-xl font-bold text-xs hover:bg-[#38DDF8]/80 transition-colors"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      )}
                    </div>

                    <p className="text-xs text-[#94A3B8] flex items-center gap-2 font-mono">
                      <span>{playerProfile.completedQuizzes} Quizzes Flown</span>
                      <span>•</span>
                      <span>Best Streak: {playerProfile.bestStreak}x Flame</span>
                    </p>
                  </div>
                </div>

                {/* Right: XP Status & Glowing Progress Bar */}
                <div className="flex flex-col gap-2.5 lg:w-80 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase text-[#94A3B8] tracking-wider flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-[#FBBF24]" />
                      Total Flight XP
                    </span>
                    <span className="font-mono text-base sm:text-lg font-black text-[#FBBF24] tracking-tight">
                      {playerProfile.totalXp.toLocaleString()} XP
                    </span>
                  </div>

                  {/* Level Progress Bar Strip */}
                  <div className="rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-md p-3 flex flex-col gap-1.5 shadow-inner">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-white font-semibold">
                        Progress to {currentLevel.nextLevelXp ? `Level ${currentLevel.level + 1}` : 'Max Rank'}
                      </span>
                      <span className="text-[#38DDF8] font-bold">
                        {levelProgress.percent}%
                      </span>
                    </div>

                    {/* Gradient Glowing Track */}
                    <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#38DDF8] via-[#A78BFA] to-[#E879F9] transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(56,221,248,0.5)]"
                        style={{ width: `${levelProgress.percent}%` }}
                      />
                    </div>

                    <span className="text-[10px] font-mono text-[#94A3B8] text-right">
                      {currentLevel.nextLevelXp
                        ? `${levelProgress.remainingXp.toLocaleString()} XP to ${PLAYER_LEVELS[currentLevel.level]?.name}`
                        : '🌟 Cosmic Legend Rank Attained'}
                    </span>
                  </div>
                </div>

              </div>
            </GlassCard>

            {/* 1.2 VIEWPORT TABS (Astrophysics Arenas vs Flight Leaderboard) */}
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('arenas')}
                className={`px-5 py-2.5 rounded-2xl font-sans text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'arenas'
                    ? 'bg-gradient-to-r from-[#38DDF8]/20 to-[#A78BFA]/15 text-[#38DDF8] border border-[#38DDF8]/50 shadow-[0_0_20px_rgba(56,221,248,0.25)]'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.05] border border-transparent'
                }`}
              >
                <Target className="h-4 w-4" />
                <span>Astrophysics Arenas</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('leaderboard')}
                className={`px-5 py-2.5 rounded-2xl font-sans text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'leaderboard'
                    ? 'bg-gradient-to-r from-[#FBBF24]/20 to-[#F97316]/15 text-[#FBBF24] border border-[#FBBF24]/50 shadow-[0_0_20px_rgba(251,191,36,0.25)]'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.05] border border-transparent'
                }`}
              >
                <Trophy className="h-4 w-4" />
                <span>Flight Leaderboard</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-bold">
                  #{currentPlayerRank}
                </span>
              </button>
            </div>

            {/* 1.3 TAB 1: ARENA SELECTION & MISSION BRIEFING */}
            {activeTab === 'arenas' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
                
                {/* Left Column: Category Grid & Specifications (8 Cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  
                  {/* Category Selection Section */}
                  <GlassCard
                    variant="default"
                    className="p-6 backdrop-blur-2xl bg-white/[0.04] border border-white/[0.1] rounded-3xl"
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-white/[0.08] pb-3">
                      <div className="flex items-center gap-2.5">
                        <Target className="h-4 w-4 text-[#A78BFA]" />
                        <h2 className="font-mono text-xs uppercase tracking-wider text-[#A78BFA] font-bold">
                          1. SELECT ASTROPHYSICS ARENA
                        </h2>
                      </div>
                      <span className="font-mono text-xs text-[#94A3B8]">
                        {selectedCategory === 'all'
                          ? `${QUIZ_ARENA_QUESTIONS.length} Questions in Pool`
                          : `${questionPool.length} Questions Available`}
                      </span>
                    </div>

                    {/* 8 Premium Frosted Glass Category Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      {QUIZ_CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        const count = cat.id === 'all'
                          ? QUIZ_ARENA_QUESTIONS.length
                          : QUIZ_ARENA_QUESTIONS.filter((q) => q.category === cat.id).length;

                        return (
                          <GlassCategoryCard
                            key={cat.id}
                            category={cat}
                            questionCount={count}
                            isSelected={isSelected}
                            isAnySelected={selectedCategory !== 'all'}
                            onSelect={(id) => setSelectedCategory(id)}
                          />
                        );
                      })}
                    </div>
                  </GlassCard>

                  {/* Tournament Specifications (Difficulty & Timer Mode) */}
                  <GlassCard
                    variant="default"
                    className="p-6 backdrop-blur-2xl bg-white/[0.04] border border-white/[0.1] rounded-3xl"
                  >
                    <div className="flex items-center gap-2 mb-4 border-b border-white/[0.08] pb-3">
                      <Atom className="h-4 w-4 text-[#38DDF8]" />
                      <h2 className="font-mono text-xs uppercase tracking-wider text-[#38DDF8] font-bold">
                        2. TOURNAMENT SPECIFICATIONS
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Difficulty Tiers */}
                      <div>
                        <span className="font-mono text-xs text-[#94A3B8] block mb-2.5">
                          Difficulty Tier:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'all', label: 'All Tiers', desc: 'Full spectrum challenges' },
                            { id: 'Cadet', label: 'Cadet', desc: '+100 XP base yield' },
                            { id: 'Commander', label: 'Commander', desc: '+100 XP base yield' },
                            { id: 'Astrophysicist', label: 'Astrophysicist', desc: '+100 XP base yield' },
                          ].map((diff) => (
                            <button
                              key={diff.id}
                              type="button"
                              onClick={() => setSelectedDifficulty(diff.id)}
                              className={`p-3 rounded-2xl border text-left transition-all ${
                                selectedDifficulty === diff.id
                                  ? 'border-[#38DDF8] bg-[#38DDF8]/15 text-white shadow-[0_0_16px_rgba(56,221,248,0.25)]'
                                  : 'border-white/[0.08] bg-white/[0.02] text-[#94A3B8] hover:text-white hover:bg-white/[0.06]'
                              }`}
                            >
                              <span className="block font-sans text-xs font-bold">{diff.label}</span>
                              <span className="block font-mono text-[9.5px] text-[#94A3B8]">{diff.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tournament Mode: Standard vs Blitz */}
                      <div>
                        <span className="font-mono text-xs text-[#94A3B8] block mb-2.5">
                          Timer Protocol:
                        </span>
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => setIsTimedBlitz(false)}
                            className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                              !isTimedBlitz
                                ? 'border-[#34D399] bg-[#34D399]/15 text-white shadow-[0_0_16px_rgba(52,211,153,0.2)]'
                                : 'border-white/[0.08] bg-white/[0.02] text-[#94A3B8] hover:text-white hover:bg-white/[0.06]'
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
                            className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                              isTimedBlitz
                                ? 'border-[#FBBF24] bg-[#FBBF24]/20 text-[#FBBF24] shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                                : 'border-white/[0.08] bg-white/[0.02] text-[#94A3B8] hover:text-white hover:bg-white/[0.06]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Zap className="h-4 w-4 text-[#FBBF24] shrink-0" />
                              <div>
                                <span className="font-sans text-xs font-bold block text-white">60s Timed Blitz</span>
                                <span className="font-mono text-[10px] text-[#94A3B8]">High speed adrenaline countdown.</span>
                              </div>
                            </div>
                            {isTimedBlitz && <CheckCircle2 className="h-4 w-4 text-[#FBBF24]" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                </div>

                {/* Right Column: MISSION BRIEFING & GLOWING START BUTTON (4 Cols) */}
                <div className="lg:col-span-4 flex flex-col">
                  <GlassCard
                    variant="elevated"
                    className="p-6 flex-1 flex flex-col justify-between backdrop-blur-2xl bg-gradient-to-b from-[#0B1024]/90 to-[#050816]/90 border border-white/[0.14] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
                  >
                    <div className="space-y-4">
                      {/* Mission Header */}
                      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
                        <BookOpen className="h-4 w-4 text-[#38DDF8]" />
                        <h2 className="font-mono text-xs uppercase tracking-wider text-[#38DDF8] font-bold">
                          MISSION BRIEFING
                        </h2>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{selectedCatMeta.icon}</span>
                          <div>
                            <span className="block font-sans text-sm font-extrabold text-white">
                              {selectedCatMeta.label}
                            </span>
                            <span className="font-mono text-[10.5px] text-[#A78BFA]">
                              {selectedCatMeta.tagline}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-[#94A3B8] leading-relaxed pt-1">
                          Engage NASA-verified astrophysics challenges testing orbital mechanics, general relativity, stellar evolution, and deep-space missions.
                        </p>
                      </div>

                      {/* Flight Audit Parameters */}
                      <div className="space-y-2 font-mono text-xs pt-1">
                        <div className="flex justify-between items-center py-1.5 border-b border-white/[0.06]">
                          <span className="text-[#94A3B8]">Challenges Armed:</span>
                          <span className="text-white font-bold">{questionPool.length} Questions</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/[0.06]">
                          <span className="text-[#94A3B8]">Per Correct Solution:</span>
                          <span className="text-[#38DDF8] font-bold">+100 XP</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/[0.06]">
                          <span className="text-[#94A3B8]">Mission Completion:</span>
                          <span className="text-[#34D399] font-bold">+50 XP</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/[0.06]">
                          <span className="text-[#94A3B8]">100% Perfect Bonus:</span>
                          <span className="text-[#FBBF24] font-bold">+200 Bonus XP</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/[0.06]">
                          <span className="text-[#94A3B8]">Timer Protocol:</span>
                          <span className={`font-bold ${isTimedBlitz ? 'text-[#FBBF24]' : 'text-white'}`}>
                            {isTimedBlitz ? '60s Countdown' : 'Untimed Mission'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 1.4 LARGE GLOWING AMBER-TO-ORANGE START BUTTON */}
                    <div className="pt-6">
                      <button
                        type="button"
                        disabled={questionPool.length === 0}
                        onClick={handleInitiateLaunch}
                        data-testid="start-arena-btn"
                        className="group relative w-full flex items-center justify-center gap-3 py-4 sm:py-5 px-6 rounded-2xl font-sans text-sm sm:text-base font-black tracking-wider uppercase text-slate-950 bg-gradient-to-r from-[#FBBF24] via-[#F97316] to-[#EF4444] hover:from-[#FCD34D] hover:via-[#FB923C] hover:to-[#F87171] shadow-[0_0_35px_rgba(251,191,36,0.5)] hover:shadow-[0_0_55px_rgba(251,191,36,0.8)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                      >
                        <Play className="h-5 w-5 fill-slate-950 text-slate-950 transition-transform group-hover:scale-110" />
                        <span>ENGAGE ARENA ({questionPool.length} QUESTIONS)</span>
                        <ArrowRight className="h-4 w-4 text-slate-950 transition-transform group-hover:translate-x-1" />

                        {/* Subtle Glowing Aura */}
                        <span className="absolute -inset-1 rounded-2xl border-2 border-[#FBBF24] opacity-40 animate-ping pointer-events-none" />
                      </button>

                      {questionPool.length === 0 && (
                        <p className="mt-2 text-center font-mono text-[11px] text-red-400">
                          No challenges in this filter. Select another tier.
                        </p>
                      )}
                    </div>
                  </GlassCard>
                </div>

              </div>
            )}

            {/* 1.5 TAB 2: FLIGHT LEADERBOARD */}
            {activeTab === 'leaderboard' && (
              <div className="w-full animate-fade-in">
                <LeaderboardPanel
                  entries={leaderboard}
                  playerProfile={playerProfile}
                  onProfileUpdated={(updated) => {
                    setPlayerProfile(updated);
                    setLeaderboard(loadLeaderboard());
                  }}
                />
              </div>
            )}

          </div>
        )}

        {/* ================================================================= */}
        {/* 2. QUIZ GAMEPLAY SCREEN: FUTURISTIC GLASS HUD                     */}
        {/* ================================================================= */}
        {isQuizActive && !isFinished && currentQ && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in my-auto py-2">
            
            {/* Main Interactive Stage (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <GlassCard
                variant="elevated"
                className="p-6 sm:p-8 flex flex-col justify-between min-h-[480px] backdrop-blur-2xl bg-white/[0.05] border border-white/[0.12] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
                glowingBorder={isAnswerSubmitted ? (selectedOption === currentQ.correctIndex ? 'cyan' : 'none') : 'violet'}
              >
                <div>
                  {/* Top Telemetry & Timer Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                    <div className="flex items-center gap-2">
                      <TelemetryBadge
                        label="ARENA"
                        value={currentQ.category.toUpperCase()}
                        tone="violet"
                        size="sm"
                      />
                      <TelemetryBadge
                        label="TIER"
                        value={currentQ.difficulty.toUpperCase()}
                        tone={currentQ.difficulty === 'Astrophysicist' ? 'amber' : 'cyan'}
                        size="sm"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      {isTimedBlitz ? (
                        <div className={`flex items-center gap-1.5 font-mono text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all ${
                          blitzSecondsLeft <= 10
                            ? 'border-red-500 bg-red-500/20 text-red-300 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                            : 'border-[#FBBF24]/50 bg-[#FBBF24]/15 text-[#FBBF24] shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                        }`}>
                          <Clock className="h-3.5 w-3.5" />
                          <span>{blitzSecondsLeft}s BLITZ COUNTDOWN</span>
                        </div>
                      ) : (
                        <div className={`flex items-center gap-1.5 font-mono text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all ${
                          standardSecondsLeft <= 60
                            ? 'border-red-500 bg-red-500/20 text-red-300 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                            : 'border-[#38DDF8]/40 bg-[#38DDF8]/10 text-[#38DDF8]'
                        }`}>
                          <Clock className="h-3.5 w-3.5" />
                          <span>{Math.floor(standardSecondsLeft / 60)}:{String(standardSecondsLeft % 60).padStart(2, '0')} MISSION CLOCK</span>
                        </div>
                      )}

                      <span className="font-mono text-xs text-[#94A3B8]">
                        Challenge <strong className="text-white">{currentQuestionIndex + 1}</strong> of {questionPool.length}
                      </span>
                    </div>
                  </div>

                  {/* Gradient Question Progress Bar */}
                  <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden mt-3 mb-6">
                    <div
                      className="h-full bg-gradient-to-r from-[#38DDF8] via-[#A78BFA] to-[#34D399] transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(56,221,248,0.5)]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Question Stem */}
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug tracking-tight">
                    {currentQ.question}
                  </h2>

                  {/* Four Attractive Glass Multiple-Choice Option Cards */}
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
                          className={`group relative flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 backdrop-blur-xl ${
                            isWrong ? 'animate-shake' : ''
                          } ${
                            isCorrect
                              ? 'border-[#34D399] bg-[#34D399]/20 text-white shadow-[0_0_25px_rgba(52,211,153,0.35)] scale-[1.01]'
                              : isWrong
                              ? 'border-red-500 bg-red-500/20 text-red-200 shadow-[0_0_25px_rgba(239,68,68,0.35)]'
                              : isSelected
                              ? 'border-[#38DDF8] bg-[#38DDF8]/15 text-white shadow-[0_0_20px_rgba(56,221,248,0.3)] scale-[1.01]'
                              : 'border-white/[0.08] bg-white/[0.03] text-[#CBD5E1] hover:border-white/25 hover:bg-white/[0.07] hover:scale-[1.005]'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-xl font-mono text-xs font-black transition-all ${
                              isCorrect
                                ? 'bg-[#34D399] text-[#030611] shadow-[0_0_12px_#34D399]'
                                : isWrong
                                ? 'bg-red-500 text-white'
                                : isSelected
                                ? 'bg-[#38DDF8] text-[#030611] shadow-[0_0_12px_#38DDF8]'
                                : 'bg-white/10 text-[#94A3B8] group-hover:bg-white/20 group-hover:text-white'
                            }`}>
                              {letter}
                            </span>
                            <span className="text-sm sm:text-base font-semibold leading-relaxed">
                              {option}
                            </span>
                          </div>

                          <div className="shrink-0 ml-3 flex items-center gap-2">
                            {isCorrect && (
                              <>
                                <span className="font-mono text-xs text-[#34D399] font-black px-2 py-0.5 rounded-full bg-[#34D399]/20 border border-[#34D399]/40 animate-bounce">
                                  +100 XP
                                </span>
                                <div className="flex items-center gap-1.5 font-mono text-xs text-[#34D399] font-bold">
                                  <CheckCircle2 className="h-5 w-5 text-[#34D399]" />
                                  <span className="hidden sm:inline">CORRECT</span>
                                </div>
                              </>
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

                  {/* NASA Astrophysics Debrief Card */}
                  {isAnswerSubmitted && (
                    <div className="mt-5 rounded-2xl border border-white/[0.1] bg-black/60 backdrop-blur-xl p-5 animate-fade-in shadow-2xl">
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
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="font-mono text-xs text-[#94A3B8] hidden sm:inline">
                    {!isAnswerSubmitted
                      ? 'Press [A–D] or [1–4] to select, [Enter] to confirm'
                      : 'Press [Enter] to continue to next challenge'}
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
                        className="font-bold shadow-[0_0_20px_rgba(56,221,248,0.3)]"
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
                        className="font-bold shadow-[0_0_20px_rgba(56,221,248,0.4)]"
                      >
                        {currentQuestionIndex < questionPool.length - 1 ? 'Next Celestial Challenge' : 'View Arena Debrief'}
                      </SpaceButton>
                    )}
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Right Telemetry & Streak Panel (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              
              {/* Live Telemetry Card */}
              <GlassCard variant="default" className="p-5 backdrop-blur-2xl bg-white/[0.04] border border-white/[0.1] rounded-3xl">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold block mb-3">
                  LIVE TOURNAMENT TELEMETRY
                </span>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                    <span className="text-[#94A3B8]">Solutions Tally:</span>
                    <span className="text-lg font-black text-white">
                      {score} / {currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                    <span className="text-[#94A3B8]">Round XP Accrued:</span>
                    <span className="text-lg font-black text-[#FBBF24]">
                      +{earnedXp} XP
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                    <span className="text-[#94A3B8]">Challenge Base Yield:</span>
                    <span className="text-white font-bold">
                      +100 XP
                    </span>
                  </div>

                  {/* Flame Streak Multiplier Gauge */}
                  <div className="py-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Flame className={`h-4 w-4 ${streak > 0 ? 'text-orange-400 animate-bounce' : 'text-[#94A3B8]'}`} />
                        <span className="text-[#94A3B8]">Streak Multiplier:</span>
                      </div>
                      <span className={`font-bold ${streak > 0 ? 'text-orange-400' : 'text-[#94A3B8]'}`}>
                        {streak}x Multiplier
                      </span>
                    </div>

                    <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                        style={{ width: `${Math.min(100, streak * 20)}%` }}
                      />
                    </div>
                    <span className="mt-1 font-mono text-[10px] text-[#94A3B8] block text-right">
                      {streak >= 3 ? '🔥 Solar Flare Multiplier Active (+30+ XP)' : 'Reach 3x streak for extra bonus'}
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Tournament Abandon Button */}
              <GlassCard variant="subtle" className="p-4 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02]">
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
        {/* 3. POST-QUIZ RESULTS SCREEN: GLASS DEBRIEF                        */}
        {/* ================================================================= */}
        {isFinished && (
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 animate-fade-in my-auto py-6">
            <GlassCard
              variant="elevated"
              className="p-8 sm:p-10 backdrop-blur-2xl bg-white/[0.05] border border-white/[0.14] rounded-3xl text-center flex flex-col items-center gap-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
            >
              {/* Spacecraft Reaching Orbit Illustration */}
              <div className="relative w-full max-w-lg h-36 rounded-2xl overflow-hidden border border-white/[0.1] bg-gradient-to-b from-[#0B1024] to-[#030611] flex items-center justify-center shadow-inner">
                {/* Earth limb curve below */}
                <div className="absolute -bottom-28 w-[450px] h-52 rounded-full bg-gradient-to-t from-[#0284C7]/50 via-[#38DDF8]/20 to-transparent filter blur-md" />
                <div className="absolute -bottom-28 w-[450px] h-52 rounded-full border-t border-[#38DDF8]/70" />
                
                {/* Spacecraft reaching orbit */}
                <div className="relative z-10 flex flex-col items-center animate-float-gentle">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0B1024] via-[#1E293B] to-[#38DDF8]/30 border border-[#38DDF8] shadow-[0_0_25px_rgba(56,221,248,0.5)]">
                    <Rocket className="h-8 w-8 text-[#38DDF8] filter drop-shadow-[0_0_8px_#38DDF8] -rotate-45" />
                  </div>
                  <span className="font-mono text-[10px] text-[#A78BFA] mt-2 font-bold tracking-wider">
                    ORBITAL INSERTION ACHIEVED • 420 KM ALTITUDE
                  </span>
                </div>
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#FBBF24] font-bold flex items-center justify-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>MISSION COMPLETE // DEBRIEF READY</span>
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <h2 className="mt-1 text-2xl sm:text-3xl font-black text-white">
                  Astrophysics Arena Debrief
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
                  {accuracyPercent >= 80
                    ? 'Superb celestial mastery! Your cosmological deduction meets NASA Flight Commander certification standards.'
                    : accuracyPercent >= 50
                    ? 'Commendable mission execution. Review the orbital physics debriefs below and re-engage the arena to elevate your rank.'
                    : 'Challenging stellar flight. Explore the Science Lab to study foundational gravitational mechanics and retry.'}
                </p>
              </div>

              {/* Next Level Progression & Leaderboard Rank Bar */}
              <div className="w-full max-w-2xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-left font-mono">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-[#94A3B8]">
                    Rank Progression: <strong className="text-white">Level {currentLevel.level} ({currentLevel.name})</strong>
                  </span>
                  <span className="text-[#38DDF8] font-bold">{levelProgress.percent}%</span>
                </div>
                <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#38DDF8] via-[#A78BFA] to-[#34D399] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(56,221,248,0.5)]"
                    style={{ width: `${levelProgress.percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#94A3B8] mt-1.5">
                  <span>Academy Leaderboard: <strong className="text-[#FBBF24]">#{currentPlayerRank} of {leaderboard.length} Pilots</strong></span>
                  {currentLevel.nextLevelXp !== null ? (
                    <span>{levelProgress.remainingXp} XP needed for next rank</span>
                  ) : (
                    <span className="text-[#FBBF24] font-bold">MAX RANK ACHIEVED</span>
                  )}
                </div>
              </div>

              {/* Metrics Showcase 4-Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl font-mono">
                <div className="rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-md p-3.5 flex flex-col items-center">
                  <span className="text-[10px] uppercase text-[#94A3B8]">Final Score</span>
                  <span className="text-xl sm:text-2xl font-black text-white mt-1">
                    {score} / {questionPool.length}
                  </span>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-md p-3.5 flex flex-col items-center">
                  <span className="text-[10px] uppercase text-[#94A3B8]">Accuracy</span>
                  <span className="text-xl sm:text-2xl font-black text-[#34D399] mt-1">
                    {accuracyPercent}%
                  </span>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-md p-3.5 flex flex-col items-center">
                  <span className="text-[10px] uppercase text-[#94A3B8]">Round XP</span>
                  <span className="text-xl sm:text-2xl font-black text-[#FBBF24] mt-1">
                    +{rewardBreakdown ? rewardBreakdown.totalEarnedXp : earnedXp} XP
                  </span>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-md p-3.5 flex flex-col items-center">
                  <span className="text-[10px] uppercase text-[#94A3B8]">Flight Tier</span>
                  <span className="text-base sm:text-lg font-black text-[#A78BFA] mt-1 truncate">
                    LVL {currentLevel.level}
                  </span>
                </div>
              </div>

              {/* Explicit XP Reward Breakdown Strip */}
              {rewardBreakdown && (
                <div className="w-full max-w-2xl rounded-2xl border border-white/[0.1] bg-black/50 backdrop-blur-xl p-4 text-left font-mono text-xs space-y-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold block">
                    FLIGHT REWARD AUDIT:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-white/[0.08] pb-3">
                    <div className="flex justify-between items-center bg-white/[0.03] p-2 rounded-xl">
                      <span className="text-[#94A3B8]">Correct Solutions ({score}×):</span>
                      <span className="font-bold text-[#38DDF8]">+{rewardBreakdown.correctAnswersXp} XP</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/[0.03] p-2 rounded-xl">
                      <span className="text-[#94A3B8]">Completion Bonus:</span>
                      <span className="font-bold text-[#34D399]">+{rewardBreakdown.completionBonusXp} XP</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/[0.03] p-2 rounded-xl">
                      <span className="text-[#94A3B8]">Perfect Score Bonus:</span>
                      <span className={`font-bold ${rewardBreakdown.perfectBonusXp > 0 ? 'text-[#FBBF24]' : 'text-slate-600'}`}>
                        +{rewardBreakdown.perfectBonusXp} XP
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[#94A3B8]">Updated Total Flight XP:</span>
                      <span className="text-sm font-bold text-white">
                        {playerProfile.totalXp.toLocaleString()} XP
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#94A3B8]">Current Status:</span>
                      <span className="text-sm font-bold text-[#38DDF8]">
                        Level {currentLevel.level}: {currentLevel.name}
                      </span>
                    </div>
                  </div>

                  {/* Level Progress Bar Strip */}
                  <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-[#38DDF8] via-[#A78BFA] to-[#E879F9] transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(56,221,248,0.5)]"
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
                  onClick={handleStartArena}
                  icon={RotateCcw}
                  className="flex-1 font-bold shadow-[0_0_20px_rgba(56,221,248,0.3)]"
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
                  className="flex-1 font-bold"
                  data-testid="return-to-lobby-btn"
                >
                  Return to Arenas
                </SpaceButton>
              </div>

              {/* Toggle Question Review Breakdown */}
              <button
                type="button"
                onClick={() => setShowReviewList((v) => !v)}
                className="font-mono text-xs text-[#38DDF8] hover:underline flex items-center gap-1.5 pt-2"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{showReviewList ? 'Hide Detailed Answers' : 'Review Question Explanations'}</span>
              </button>
            </GlassCard>

            {/* Detailed Question Review List */}
            {showReviewList && history.length > 0 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#38DDF8]" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[#38DDF8] font-bold">
                    DEBRIEF: QUESTION-BY-QUESTION ANALYSIS
                  </h3>
                </div>

                {history.map((item, idx) => (
                  <GlassCard
                    key={idx}
                    variant="default"
                    className={`p-5 backdrop-blur-xl bg-white/[0.04] rounded-2xl border-l-4 ${
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
                        {item.isCorrect ? `+100 XP` : '0 XP'}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
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

                    <div className="mt-3 rounded-xl bg-black/40 backdrop-blur-md p-3 text-xs text-[#CBD5E1]">
                      <span className="font-mono text-[10px] text-[#A78BFA] font-bold block mb-1">
                        NASA DEBRIEF:
                      </span>
                      {item.question.explanation}
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {/* Post-Quiz Live Leaderboard Showcase */}
            <div className="animate-fade-in mt-4">
              <LeaderboardPanel
                entries={leaderboard}
                playerProfile={playerProfile}
                onProfileUpdated={(updated) => {
                  setPlayerProfile(updated);
                  setLeaderboard(loadLeaderboard());
                }}
              />
            </div>

          </div>
        )}

      </main>
    </div>
  );
};
