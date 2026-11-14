import React, { useState } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { TelemetryBadge } from '../../components/ui/TelemetryBadge';
import { SpaceButton } from '../../components/ui/SpaceButton';
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
  ChevronLeft,
  Compass,
  Star,
  Search,
  Check,
} from 'lucide-react';
import { useNavigation } from '../../navigation/NavigationProvider';
import { ROUTES } from '../../navigation/routes';

// Destination visual accents matching cosmic worlds
const DESTINATION_THEMES: Record<string, { accent: string; badgeTone: 'cyan' | 'amber' | 'violet' | 'emerald'; glow: string }> = {
  'course-solar-system': { accent: '#38BDF8', badgeTone: 'cyan', glow: 'from-sky-500/10 via-[#070C1B] to-[#0A162B]' },
  'course-the-sun': { accent: '#F59E0B', badgeTone: 'amber', glow: 'from-amber-500/15 via-[#070C1B] to-[#1C1103]' },
  'course-earth-atmosphere': { accent: '#34D399', badgeTone: 'emerald', glow: 'from-emerald-500/10 via-[#070C1B] to-[#041B1F]' },
  'course-mars-life': { accent: '#F87171', badgeTone: 'amber', glow: 'from-red-500/15 via-[#070C1B] to-[#220B0B]' },
  'course-jupiter-grs': { accent: '#FB923C', badgeTone: 'amber', glow: 'from-orange-500/15 via-[#070C1B] to-[#201004]' },
  'course-saturn-rings': { accent: '#FBBF24', badgeTone: 'amber', glow: 'from-yellow-500/15 via-[#070C1B] to-[#1D1503]' },
  'course-uranus': { accent: '#22D3EE', badgeTone: 'cyan', glow: 'from-cyan-500/15 via-[#070C1B] to-[#041822]' },
  'course-neptune': { accent: '#60A5FA', badgeTone: 'cyan', glow: 'from-blue-600/15 via-[#070C1B] to-[#07132B]' },
  'course-milky-way': { accent: '#C084FC', badgeTone: 'violet', glow: 'from-purple-600/15 via-[#070C1B] to-[#18082D]' },
};

export const LearnPortalScreen: React.FC = () => {
  const { navigate } = useNavigation();

  // Navigation State: Directory vs Lesson Reader
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Lesson Checkpoint State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['ss-1']);
  const [studentXp, setStudentXp] = useState<number>(620);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Categories
  const CATEGORIES = [
    { id: 'all', label: 'All Destinations' },
    { id: 'Foundations', label: 'Foundations' },
    { id: 'Stellar Physics', label: 'Stellar Physics' },
    { id: 'Planetary Science', label: 'Planetary Science' },
    { id: 'Astrobiology', label: 'Astrobiology' },
    { id: 'Fluid Mechanics', label: 'Fluid Mechanics' },
    { id: 'Celestial Mechanics', label: 'Celestial Mechanics' },
    { id: 'Cosmology', label: 'Cosmology' },
  ];

  // Filtering
  const filteredCourses = ASTRONOMY_COURSES.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredCourse = ASTRONOMY_COURSES.find((c) => c.id === 'course-the-sun') || ASTRONOMY_COURSES[0];

  const handleStartCourse = (course: Course) => {
    setSelectedCourse(course);
    setActiveLesson(course.lessons[0]);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      // Completed all lessons in course
      setSelectedCourse(null);
      setActiveLesson(null);
    }
  };

  const handlePrevLesson = () => {
    if (!selectedCourse || !activeLesson) return;
    const currentIndex = selectedCourse.lessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex > 0) {
      handleSelectLesson(selectedCourse.lessons[currentIndex - 1]);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#030611] font-sans text-[#F8FAFC]">
      {/* Subtle Starfield & Ambient Glow Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,35,77,0.35),rgba(3,6,17,0.95))]"
        aria-hidden="true"
      />

      {/* 1. Global Master Navigation Header */}
      <MasterHeader />

      {/* 2. Main Content Area */}
      <main className="relative z-10 flex-1 p-4 sm:p-6 md:p-8 pb-20 sm:pb-28 max-w-7xl w-full mx-auto">
        {/* VIEW 1: Learning Dashboard & Course Directory */}
        {!selectedCourse && (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* HERO EXPERIENCE: Editorial Astronomy Portal Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Main Editorial Hero Banner */}
              <GlassCard
                variant="elevated"
                className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between border-white/10 bg-gradient-to-br from-[#0B1528]/90 via-[#070C1B]/95 to-[#0A2540]/80 shadow-2xl"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <TelemetryBadge
                      label="ACADEMIC ASTRONOMY PORTAL"
                      tone="cyan"
                      pulsing
                      size="sm"
                    />
                    <TelemetryBadge
                      label="9 PLANETARY DESTINATIONS"
                      tone="amber"
                      size="sm"
                    />
                    <span className="font-mono text-[10px] text-[#94A3B8] hidden sm:inline">
                      // NASA & ESA CURATED
                    </span>
                  </div>

                  <h1 className="mt-3 font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
                    Astrophysics & Space Science Curriculum
                  </h1>

                  <p className="mt-2 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                    Master peer-reviewed space science from planetary formation and stellar nucleosynthesis
                    to relativistic black holes. Earn academic XP, solve scientific checkpoints, and unlock certified exploration credentials.
                  </p>
                </div>

                {/* Real Student Telemetry Counters */}
                <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0B1226]/80 px-3.5 py-2 font-mono text-xs">
                    <Award className="h-4 w-4 text-[#F59E0B]" />
                    <span className="text-[#F8FAFC] font-bold">{studentXp} XP</span>
                    <span className="text-[#94A3B8]">Earned</span>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0B1226]/80 px-3.5 py-2 font-mono text-xs">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <span className="text-[#F8FAFC] font-bold">4 Day</span>
                    <span className="text-[#94A3B8]">Streak</span>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0B1226]/80 px-3.5 py-2 font-mono text-xs">
                    <BookOpen className="h-4 w-4 text-[#38BDF8]" />
                    <span className="text-[#F8FAFC] font-bold">{completedLessonIds.length}</span>
                    <span className="text-[#94A3B8]">Checkpoints Solved</span>
                  </div>

                  <div className="ml-auto hidden md:flex items-center gap-1.5 text-xs text-[#94A3B8] font-mono">
                    <Star className="h-3.5 w-3.5 text-[#F59E0B]" />
                    <span>Level 2 Cadet</span>
                  </div>
                </div>
              </GlassCard>

              {/* Right Col: Featured Destination CTA Banner */}
              <GlassCard
                variant="elevated"
                glowingBorder="amber"
                className="p-6 flex flex-col justify-between bg-gradient-to-br from-[#1C1204]/90 via-[#070C1B]/95 to-[#130B02]/90 border-[#F59E0B]/30 shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <TelemetryBadge
                      label="FEATURED DESTINATION"
                      tone="amber"
                      icon={Sparkles}
                      size="sm"
                    />
                    <span className="rounded bg-[#F59E0B]/15 text-[#F59E0B] font-mono text-[10px] font-bold px-2 py-0.5 border border-[#F59E0B]/30">
                      +{featuredCourse.xpTotal} XP
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                      {featuredCourse.icon}
                    </span>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#F59E0B]">
                        {featuredCourse.category}
                      </span>
                      <h3 className="font-sans text-base font-bold text-[#F8FAFC] line-clamp-1">
                        {featuredCourse.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                    {featuredCourse.description}
                  </p>

                  <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 font-mono text-[11px] text-[#CBD5E1]">
                    ✦ Spotlight: {featuredCourse.lessons[0].title}
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <SpaceButton
                    variant="primary"
                    size="md"
                    className="w-full justify-center shadow-lg"
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={() => handleStartCourse(featuredCourse)}
                  >
                    Start Featured Module
                  </SpaceButton>

                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.EXPLORE)}
                    className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-[#94A3B8] hover:text-[#38BDF8] transition-colors py-1"
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>View in 3D Solar System</span>
                  </button>
                </div>
              </GlassCard>
            </div>

            {/* Controls Bar: Category Filter Pills + Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-all whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'border border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                        : 'border border-transparent bg-white/[0.02] text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[220px]">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0B1226]/80 pl-9 pr-3 py-1.5 font-mono text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* 9 PLANETARY LEARNING DESTINATIONS GRID */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Planetary Learning Destinations ({filteredCourses.length})
                </span>
                <span className="font-mono text-[10px] text-[#64748B]">
                  Click destination to open curriculum
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCourses.map((course) => {
                  const completedInCourse = course.lessons.filter((l) =>
                    completedLessonIds.includes(l.id)
                  ).length;
                  const progressPct = Math.round((completedInCourse / course.lessons.length) * 100);
                  const theme = DESTINATION_THEMES[course.id] || {
                    accent: '#38BDF8',
                    badgeTone: 'cyan' as const,
                    glow: 'from-blue-600/10 via-[#070C1B] to-[#0A162B]',
                  };

                  return (
                    <GlassCard
                      key={course.id}
                      variant="interactive"
                      onClick={() => handleStartCourse(course)}
                      className={`group p-5 flex flex-col justify-between border-white/10 bg-gradient-to-br ${theme.glow} transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
                    >
                      <div>
                        {/* Destination Card Header */}
                        <div className="flex items-center justify-between">
                          <span className="text-3xl p-2 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                            {course.icon}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <TelemetryBadge
                              label={course.level}
                              tone={
                                course.level === 'Beginner'
                                  ? 'emerald'
                                  : course.level === 'Intermediate'
                                  ? 'amber'
                                  : 'violet'
                              }
                              size="sm"
                            />
                          </div>
                        </div>

                        {/* Title & Tagline */}
                        <span className="mt-3 block font-mono text-[9.5px] uppercase tracking-wider text-[#94A3B8]">
                          {course.category}
                        </span>

                        <h3 className="mt-0.5 font-sans text-base sm:text-lg font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors line-clamp-1">
                          {course.title}
                        </h3>

                        <p className="mt-1 font-mono text-[10.5px] text-[#38BDF8] line-clamp-1">
                          {course.tagline}
                        </p>

                        <p className="mt-2 text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      {/* Destination Progress & Footer */}
                      <div className="mt-5 border-t border-white/5 pt-3">
                        <div className="flex justify-between font-mono text-[10.5px] text-[#94A3B8] mb-1.5">
                          <span>{course.totalLessons} Lessons</span>
                          <span className="font-bold text-[#F8FAFC]">{progressPct}% Complete</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${progressPct}%`,
                              backgroundColor: theme.accent,
                              boxShadow: `0 0 8px ${theme.accent}66`,
                            }}
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-[#F59E0B]">
                            +{course.xpTotal} XP
                          </span>

                          <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-[#38BDF8] group-hover:translate-x-1 transition-transform">
                            <span>Explore Modules</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Course & Interactive Lesson Studio View */}
        {selectedCourse && activeLesson && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Top Navigation Back Banner */}
            <GlassCard
              variant="elevated"
              className="p-4 flex flex-wrap items-center justify-between gap-4 border-white/10"
            >
              <div className="flex items-center gap-3">
                <SpaceButton
                  variant="secondary"
                  size="sm"
                  icon={ArrowLeft}
                  onClick={() => {
                    setSelectedCourse(null);
                    setActiveLesson(null);
                  }}
                >
                  All Destinations
                </SpaceButton>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedCourse.icon}</span>
                    <h2 className="font-sans text-base sm:text-lg font-bold text-[#F8FAFC]">
                      {selectedCourse.title}
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-[#94A3B8]">
                    {selectedCourse.category} // {selectedCourse.level} Track
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <TelemetryBadge
                  label="CHECKPOINT REWARD"
                  value={`+${activeLesson.xpReward} XP`}
                  tone="amber"
                  size="sm"
                />

                <button
                  type="button"
                  onClick={() => navigate(ROUTES.EXPLORE)}
                  className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-[#94A3B8] hover:border-[#38BDF8] hover:text-[#38BDF8] transition-colors"
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>Inspect Solar System</span>
                </button>
              </div>
            </GlassCard>

            {/* Lesson Content & Module Stepper Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Col: Lesson Curriculum Stepper */}
              <GlassCard
                variant="elevated"
                className="p-5 flex flex-col gap-3.5 border-white/10 self-start"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                    Course Modules
                  </h3>
                  <span className="font-mono text-[10px] text-[#94A3B8]">
                    {selectedCourse.lessons.length} Modules
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {selectedCourse.lessons.map((lesson, idx) => {
                    const isActive = activeLesson.id === lesson.id;
                    const isDone = completedLessonIds.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => handleSelectLesson(lesson)}
                        className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                          isActive
                            ? 'border-[#38BDF8] bg-[#38BDF8]/15 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                            : isDone
                            ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10'
                            : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#10B981]/20 text-[#10B981]">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </span>
                          ) : (
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-full border font-mono text-[10px] ${
                                isActive
                                  ? 'border-[#38BDF8] bg-[#38BDF8] text-[#030611] font-bold'
                                  : 'border-white/20 text-[#94A3B8]'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span
                            className={`font-sans text-xs font-semibold ${
                              isActive ? 'text-[#F8FAFC]' : 'text-[#CBD5E1]'
                            }`}
                          >
                            {lesson.title}
                          </span>
                          <span className="font-mono text-[9.5px] text-[#94A3B8] mt-0.5">
                            {lesson.duration} • +{lesson.xpReward} XP
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Course Progress Summary Card */}
                <div className="mt-4 rounded-xl border border-white/5 bg-[#0B1226]/50 p-3">
                  <div className="flex justify-between font-mono text-[10px] text-[#94A3B8] mb-1">
                    <span>Course Progress</span>
                    <span className="text-[#38BDF8] font-bold">
                      {Math.round(
                        (selectedCourse.lessons.filter((l) => completedLessonIds.includes(l.id)).length /
                          selectedCourse.lessons.length) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-[#38BDF8] rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (selectedCourse.lessons.filter((l) => completedLessonIds.includes(l.id)).length /
                            selectedCourse.lessons.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </GlassCard>

              {/* Middle & Right Col: Active Lesson Reader & Checkpoint */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* 1. LESSON EDITORIAL READER */}
                <GlassCard variant="elevated" className="p-6 sm:p-8 border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#38BDF8]">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{activeLesson.duration} Read</span>
                    </div>

                    <TelemetryBadge
                      label="LESSON ACTIVE"
                      tone="cyan"
                      size="sm"
                    />
                  </div>

                  <h1 className="mt-3 font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
                    {activeLesson.title}
                  </h1>

                  {/* Summary Block */}
                  <p className="mt-3 text-xs sm:text-sm text-[#CBD5E1] font-medium leading-relaxed italic border-l-2 border-[#38BDF8] pl-3.5 bg-gradient-to-r from-[#38BDF8]/10 to-transparent py-1.5 rounded-r-lg">
                    {activeLesson.summary}
                  </p>

                  {/* Body Paragraphs */}
                  <div className="mt-6 flex flex-col gap-4 text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-3xl">
                    {activeLesson.content.map((paragraph, idx) => (
                      <p key={idx} className="tracking-wide">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Reader Navigation Stepper */}
                  <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                    <button
                      type="button"
                      onClick={handlePrevLesson}
                      disabled={selectedCourse.lessons.findIndex((l) => l.id === activeLesson.id) === 0}
                      className="flex items-center gap-1.5 font-mono text-xs text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-20 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous Lesson</span>
                    </button>

                    <span className="font-mono text-[10px] text-[#64748B]">
                      Module{' '}
                      {selectedCourse.lessons.findIndex((l) => l.id === activeLesson.id) + 1} of{' '}
                      {selectedCourse.lessons.length}
                    </span>

                    <button
                      type="button"
                      onClick={handleNextLesson}
                      className="flex items-center gap-1.5 font-mono text-xs text-[#38BDF8] hover:text-[#7DD3FC] transition-colors"
                    >
                      <span>
                        {selectedCourse.lessons.findIndex((l) => l.id === activeLesson.id) ===
                        selectedCourse.lessons.length - 1
                          ? 'Back to Courses'
                          : 'Next Lesson'}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </GlassCard>

                {/* 2. KNOWLEDGE CHECKPOINT */}
                <GlassCard
                  variant="elevated"
                  glowingBorder={isAnswerSubmitted ? 'cyan' : 'none'}
                  className="p-6 sm:p-8 border-white/10 bg-[#070C1B]/95 shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#F59E0B]" />
                      <span className="font-mono text-xs uppercase tracking-wider text-[#F59E0B] font-bold">
                        KNOWLEDGE CHECKPOINT
                      </span>
                    </div>

                    <TelemetryBadge
                      label="AWARD"
                      value={`+${activeLesson.xpReward} XP`}
                      tone="amber"
                      size="sm"
                    />
                  </div>

                  <h3 className="mt-4 font-sans text-base sm:text-lg font-bold text-[#F8FAFC]">
                    {activeLesson.checkpointQuestion.question}
                  </h3>

                  {/* Checkpoint Options */}
                  <div className="mt-5 flex flex-col gap-2.5">
                    {activeLesson.checkpointQuestion.options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect =
                        isAnswerSubmitted && idx === activeLesson.checkpointQuestion.correctIndex;
                      const isWrong =
                        isAnswerSubmitted && isSelected && idx !== activeLesson.checkpointQuestion.correctIndex;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (!isAnswerSubmitted) setSelectedOption(idx);
                          }}
                          className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                            isCorrect
                              ? 'border-[#10B981] bg-[#10B981]/20 text-[#F8FAFC] shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                              : isWrong
                              ? 'border-red-500 bg-red-500/20 text-red-200'
                              : isSelected
                              ? 'border-[#38BDF8] bg-[#38BDF8]/15 text-[#F8FAFC] shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                              : 'border-white/5 bg-[#0B1226]/50 text-[#CBD5E1] hover:bg-white/5 hover:text-[#F8FAFC]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                                isCorrect
                                  ? 'bg-[#10B981] text-[#030611]'
                                  : isWrong
                                  ? 'bg-red-500 text-[#030611]'
                                  : isSelected
                                  ? 'bg-[#38BDF8] text-[#030611]'
                                  : 'bg-white/10 text-[#94A3B8]'
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="font-sans text-xs sm:text-sm">{option}</span>
                          </div>

                          {isCorrect && <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />}
                          {isWrong && <XCircle className="h-4 w-4 text-red-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Scientific Principle Explanation Callout */}
                  {isAnswerSubmitted && (
                    <div className="mt-5 rounded-xl border border-white/10 bg-[#0B1226]/80 p-4 text-xs text-[#CBD5E1] animate-fade-in">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#38BDF8] font-bold mb-1">
                        <Sparkles className="h-3 w-3" />
                        <span>SCIENTIFIC PRINCIPLE EXPLANATION</span>
                      </div>
                      <p className="leading-relaxed">
                        {activeLesson.checkpointQuestion.explanation}
                      </p>
                    </div>
                  )}

                  {/* Action Controls */}
                  <div className="mt-6 flex items-center justify-end gap-3">
                    {!isAnswerSubmitted ? (
                      <SpaceButton
                        variant="primary"
                        size="md"
                        disabled={selectedOption === null}
                        onClick={handleSubmitCheckpoint}
                      >
                        Submit Checkpoint
                      </SpaceButton>
                    ) : (
                      <SpaceButton
                        variant="primary"
                        size="md"
                        icon={ChevronRight}
                        iconPosition="right"
                        onClick={handleNextLesson}
                      >
                        {selectedCourse.lessons.findIndex((l) => l.id === activeLesson.id) ===
                        selectedCourse.lessons.length - 1
                          ? 'Finish Course (+XP)'
                          : 'Continue to Next Lesson'}
                      </SpaceButton>
                    )}
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
