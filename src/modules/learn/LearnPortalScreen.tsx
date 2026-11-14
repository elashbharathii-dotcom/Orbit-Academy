import React, { useState } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { ASTRONOMY_COURSES, Course, Lesson } from './learnData';
import {
  BookOpen,
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { useNavigation } from '../../navigation/NavigationProvider';
import { ROUTES } from '../../navigation/routes';

export const LearnPortalScreen: React.FC = () => {
  const { navigate } = useNavigation();

  // Navigation State: Dashboard vs Course Detail vs Lesson View
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Lesson Checkpoint State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['ss-1']);
  const [studentXp, setStudentXp] = useState<number>(620);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categories
  const CATEGORIES = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'Foundations', label: 'Foundations' },
    { id: 'Stellar Physics', label: 'Stellar Physics' },
    { id: 'Planetary Science', label: 'Planetary Science' },
    { id: 'Astrobiology', label: 'Astrobiology' },
    { id: 'Fluid Mechanics', label: 'Fluid Mechanics' },
    { id: 'Celestial Mechanics', label: 'Celestial Mechanics' },
    { id: 'Cosmology', label: 'Cosmology' },
  ];

  const filteredCourses = ASTRONOMY_COURSES.filter((c) => {
    if (selectedCategory === 'all') return true;
    return c.category === selectedCategory;
  });

  const handleStartCourse = (course: Course) => {
    setSelectedCourse(course);
    setActiveLesson(course.lessons[0]);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  const handleSubmitCheckpoint = () => {
    if (selectedOption === null || !activeLesson) return;
    setIsAnswerSubmitted(true);

    if (selectedOption === activeLesson.checkpointQuestion.correctIndex) {
      if (!completedLessonIds.includes(activeLesson.id)) {
        setCompletedLessonIds((prev) => [...prev, activeLesson.id]);
        setStudentXp((xp) => xp + activeLesson.xpReward);
      }
    }
  };

  const handleNextLesson = () => {
    if (!selectedCourse || !activeLesson) return;
    const currentIndex = selectedCourse.lessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex < selectedCourse.lessons.length - 1) {
      handleSelectLesson(selectedCourse.lessons[currentIndex + 1]);
    } else {
      // Completed course
      setSelectedCourse(null);
      setActiveLesson(null);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#030712] font-sans text-[#F8FAFC]">
      {/* 1. Global Master Navigation Header */}
      <MasterHeader />

      {/* 2. Main Container */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
        {/* VIEW 1: Learning Dashboard & Course Directory */}
        {!selectedCourse && (
          <div className="flex flex-col gap-6">
            {/* Student Progress Overview & Daily Challenge Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Dashboard Hero */}
              <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0B1528] via-[#05070D] to-[#0A2540] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-[#38BDF8] animate-ping" />
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#38BDF8]">
                      ACADEMIC ASTRONOMY PORTAL
                    </span>
                    <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[9px] font-bold text-[#F59E0B]">
                      8 CERTIFICATION TRACKS
                    </span>
                  </div>

                  <h1 className="mt-2 font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F8FAFC]">
                    Astrophysics & Space Science Curriculum
                  </h1>

                  <p className="mt-1 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-xl leading-relaxed">
                    Master peer-reviewed space science from planetary formation and stellar nucleosynthesis 
                    to relativistic black holes. Earn academic XP and unlock exploration credentials.
                  </p>
                </div>

                {/* Student Metric Badges */}
                <div className="mt-6 flex flex-wrap gap-3 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-xs">
                    <Award className="h-4 w-4 text-[#F59E0B]" />
                    <span className="text-[#F8FAFC] font-bold">{studentXp} XP</span>
                    <span className="text-[#94A3B8]">Earned</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-xs">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <span className="text-[#F8FAFC] font-bold">4 Day</span>
                    <span className="text-[#94A3B8]">Streak</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-xs">
                    <BookOpen className="h-4 w-4 text-[#38BDF8]" />
                    <span className="text-[#F8FAFC] font-bold">{completedLessonIds.length}</span>
                    <span className="text-[#94A3B8]">Lessons Completed</span>
                  </div>
                </div>
              </div>

              {/* Right Col: Daily Astronomy Challenge */}
              <div className="rounded-3xl border border-[#F59E0B]/30 bg-gradient-to-br from-[#1C1304] via-[#05070D] to-[#120D03] p-6 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>DAILY MISSION CHECKPOINT</span>
                    </span>
                    <span className="rounded bg-[#F59E0B]/20 text-[#F59E0B] font-mono text-[9px] font-bold px-2 py-0.5">
                      +50 XP BONUS
                    </span>
                  </div>

                  <h3 className="mt-3 font-sans text-base font-bold text-[#F8FAFC]">
                    Solar Wind Velocity Check
                  </h3>

                  <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed">
                    At what speed does the solar wind travel outward from the Sun past Earth’s magnetosphere?
                  </p>

                  <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 font-mono text-xs text-[#CBD5E1]">
                    ✦ Answer: 400 to 800 km/s (Mach 1,000+ relative to speed of sound in air!)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(ROUTES.EXPLORE)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] py-2 font-mono text-xs font-bold text-[#05070D] hover:bg-[#FBBF24] transition-colors"
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>Inspect in 3D Solar System</span>
                </button>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-3.5 py-1 font-mono text-xs transition-all ${
                    selectedCategory === cat.id
                      ? 'border border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#F8FAFC]'
                      : 'border border-transparent text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredCourses.map((course) => {
                const completedInCourse = course.lessons.filter((l) =>
                  completedLessonIds.includes(l.id)
                ).length;
                const progressPct = Math.round((completedInCourse / course.lessons.length) * 100);

                return (
                  <div
                    key={course.id}
                    onClick={() => handleStartCourse(course)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#080F1D]/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#38BDF8]/50 hover:bg-white/[0.04] hover:-translate-y-1 cursor-pointer"
                  >
                    <div>
                      {/* Course Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{course.icon}</span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[9px] font-bold text-[#38BDF8]">
                          {course.level}
                        </span>
                      </div>

                      <span className="mt-3 block font-mono text-[9.5px] uppercase tracking-wider text-[#94A3B8]">
                        {course.category}
                      </span>

                      <h3 className="mt-0.5 font-sans text-base font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                        {course.title}
                      </h3>

                      <p className="mt-1 text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Progress Bar & Footer */}
                    <div className="mt-5 border-t border-white/5 pt-3">
                      <div className="flex justify-between font-mono text-[10px] text-[#94A3B8] mb-1">
                        <span>{course.totalLessons} Lessons</span>
                        <span>{progressPct}% Done</span>
                      </div>

                      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#38BDF8] transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#F59E0B]">
                          +{course.xpTotal} XP
                        </span>

                        <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-[#38BDF8] group-hover:translate-x-1 transition-transform">
                          <span>Start</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: Course & Interactive Lesson Studio View */}
        {selectedCourse && activeLesson && (
          <div className="flex flex-col gap-6">
            {/* Top Navigation Back Banner */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#080F1D]/80 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourse(null);
                    setActiveLesson(null);
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-[#94A3B8] hover:border-[#38BDF8] hover:text-[#F8FAFC]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Curriculum</span>
                </button>

                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-[#94A3B8]">
                    {selectedCourse.category} // {selectedCourse.level}
                  </span>
                  <h2 className="font-sans text-base font-bold text-[#F8FAFC]">
                    {selectedCourse.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#F59E0B] font-bold">
                  +{activeLesson.xpReward} XP Checkpoint
                </span>
              </div>
            </div>

            {/* Lesson Content & Sidebar Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Col: Lesson Curriculum Stepper */}
              <div className="rounded-3xl border border-white/10 bg-[#080F1D]/80 p-5 shadow-xl backdrop-blur-xl flex flex-col gap-3">
                <h3 className="font-sans text-sm font-bold text-[#F8FAFC] pb-2 border-b border-white/5">
                  Course Modules
                </h3>

                <div className="flex flex-col gap-2">
                  {selectedCourse.lessons.map((lesson, idx) => {
                    const isActive = activeLesson.id === lesson.id;
                    const isDone = completedLessonIds.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => handleSelectLesson(lesson)}
                        className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all ${
                          isActive
                            ? 'border-[#38BDF8] bg-[#38BDF8]/15 shadow-md'
                            : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                          ) : (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/20 font-mono text-[9px] text-[#94A3B8]">
                              {idx + 1}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span className="font-sans text-xs font-semibold text-[#F8FAFC]">
                            {lesson.title}
                          </span>
                          <span className="font-mono text-[9.5px] text-[#94A3B8]">
                            {lesson.duration} • +{lesson.xpReward} XP
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Middle & Right Col: Active Lesson Reader & Checkpoint */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                {/* Lesson Main Content Card */}
                <div className="rounded-3xl border border-white/10 bg-[#080F1D]/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8]">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{activeLesson.duration} Read</span>
                  </div>

                  <h1 className="mt-2 font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                    {activeLesson.title}
                  </h1>

                  <p className="mt-2 text-sm text-[#CBD5E1] font-medium leading-relaxed italic border-l-2 border-[#38BDF8] pl-3">
                    {activeLesson.summary}
                  </p>

                  <div className="mt-6 flex flex-col gap-4 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {activeLesson.content.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Knowledge Checkpoint Question */}
                <div className="rounded-3xl border border-white/10 bg-[#05070D]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#F59E0B] font-bold flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>KNOWLEDGE CHECKPOINT</span>
                    </span>

                    <span className="font-mono text-xs text-[#94A3B8]">
                      +{activeLesson.xpReward} XP on correct answer
                    </span>
                  </div>

                  <h3 className="mt-4 font-sans text-base sm:text-lg font-bold text-[#F8FAFC]">
                    {activeLesson.checkpointQuestion.question}
                  </h3>

                  {/* Options */}
                  <div className="mt-4 flex flex-col gap-2.5">
                    {activeLesson.checkpointQuestion.options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = isAnswerSubmitted && idx === activeLesson.checkpointQuestion.correctIndex;
                      const isWrong = isAnswerSubmitted && isSelected && idx !== activeLesson.checkpointQuestion.correctIndex;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (!isAnswerSubmitted) setSelectedOption(idx);
                          }}
                          className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                            isCorrect
                              ? 'border-[#10B981] bg-[#10B981]/20 text-[#F8FAFC]'
                              : isWrong
                              ? 'border-red-500 bg-red-500/20 text-red-200'
                              : isSelected
                              ? 'border-[#38BDF8] bg-[#38BDF8]/15 text-[#F8FAFC]'
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

                  {/* Explanation Callout */}
                  {isAnswerSubmitted && (
                    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-[#CBD5E1] animate-fade-in">
                      <span className="font-mono text-[10px] text-[#38BDF8] font-bold block mb-1">
                        SCIENTIFIC PRINCIPLE:
                      </span>
                      {activeLesson.checkpointQuestion.explanation}
                    </div>
                  )}

                  {/* Submit / Continue Button */}
                  <div className="mt-6 flex justify-end">
                    {!isAnswerSubmitted ? (
                      <button
                        type="button"
                        disabled={selectedOption === null}
                        onClick={handleSubmitCheckpoint}
                        className="rounded-xl bg-[#38BDF8] px-5 py-2 font-mono text-xs font-bold text-[#05070D] hover:bg-[#7DD3FC] disabled:opacity-40"
                      >
                        Submit Checkpoint
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNextLesson}
                        className="flex items-center gap-1.5 rounded-xl bg-[#10B981] px-5 py-2 font-mono text-xs font-bold text-[#05070D] hover:bg-[#34D399]"
                      >
                        <span>Next Lesson</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

