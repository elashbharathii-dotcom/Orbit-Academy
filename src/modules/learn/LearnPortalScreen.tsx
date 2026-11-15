import React, { useState, useEffect, useRef } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import {
  ASTRONOMY_COURSES,
  DISCIPLINE_CATEGORIES,
  Course,
  Lesson,
  TrekLandmarkFeature,
} from './learnData';
import { AETHER_DISCIPLINE_METAS } from './aetherMapping';
import { NasaSpaceObservatory } from './components/NasaSpaceObservatory';
import { LessonTrekExplorer3D } from './components/LessonTrekExplorer3D';
import { LauraTeacherPanel } from './components/LauraTeacherPanel';
import { Lesson3DViewport } from './components/Lesson3DViewport';
import { ScientificDiagramView } from './components/ScientificDiagramView';
import { NasaOsdrLessonCard } from './components/NasaOsdrLessonCard';
import { NasaGibsLessonViewer } from './components/NasaGibsLessonViewer';
import { useStudentProgress } from '../../services/studentProgressService';
import { NasaTrekBody } from '../../services/nasa/types';
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
  Search,
  Check,
  Radio,
  Globe2,
  Bot,
  Rocket,
  FileText,
  Target,
  Bookmark,
  BookmarkCheck,
  Layers,
} from 'lucide-react';
import { useNavigation } from '../../navigation/NavigationProvider';
import { ROUTES } from '../../navigation/routes';
import './aether-learn.css';

export const LearnPortalScreen: React.FC = () => {
  const { navigate } = useNavigation();

  // Mode: Courses vs NASA Observatory
  const [activeLearnSection, setActiveLearnSection] = useState<'courses' | 'nasa-observatory'>('courses');

  // Navigation State: Directory vs Lesson Reader
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Studio tabs within active lesson
  const [lessonStudioTab, setLessonStudioTab] = useState<
    'theory' | '3d-viewport' | 'diagram' | 'nasa-data' | 'laura-teacher' | 'missions'
  >('theory');
  const [activeTrekFeature, setActiveTrekFeature] = useState<TrekLandmarkFeature | null>(null);

  // Lesson Checkpoint State & Student Progress Persistence
  const {
    progress: studentProgress,
    completeLesson,
    toggleBookmark,
    recordLearningTime,
  } = useStudentProgress();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterBookmarksOnly, setFilterBookmarksOnly] = useState<boolean>(false);
  const [showMasteryDrawer, setShowMasteryDrawer] = useState<boolean>(false);

  // Learning Time Tracker: logs 1 minute for every 60 seconds spent inside an active lesson
  const learningTimerRef = useRef<any>(null);
  useEffect(() => {
    if (activeLesson) {
      learningTimerRef.current = setInterval(() => {
        recordLearningTime(1);
      }, 60000);
    }
    return () => {
      if (learningTimerRef.current) clearInterval(learningTimerRef.current);
    };
  }, [activeLesson, recordLearningTime]);

  // Filtering across courses
  const filteredCourses = ASTRONOMY_COURSES.filter((c) => {
    const matchesDiscipline =
      selectedDiscipline === 'all' ||
      c.disciplineId === selectedDiscipline ||
      c.category.toLowerCase().includes(selectedDiscipline);

    const matchesSearch =
      searchQuery.trim() === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lessons.some(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesBookmarks =
      !filterBookmarksOnly ||
      c.lessons.some((l) => studentProgress.bookmarkedLessonIds?.includes(l.id));

    return matchesDiscipline && matchesSearch && matchesBookmarks;
  });

  const featuredCourse =
    ASTRONOMY_COURSES.find((c) => c.id === 'course-astronomy') ||
    ASTRONOMY_COURSES.find((c) => c.id === 'course-the-sun') ||
    ASTRONOMY_COURSES[0];

  const featuredMeta = AETHER_DISCIPLINE_METAS[featuredCourse.id] || {
    fig: 'FIG. 01',
    designation: 'AE-01 // OBSERVATIONAL ASTROPHYSICS',
    accent: '#7FFFD4',
    accentClass: 'earth' as const,
    imageSrc: '/assets/aether/img/aether-earth.jpg',
    videoSrc: '/assets/aether/video/aether-spin.mp4',
    surveyFocus: 'Deep Field Planetary Survey',
    dataFeed: 'JWST • HUBBLE • CHANDRA',
  };

  const handleStartCourse = (course: Course) => {
    setSelectedCourse(course);
    setActiveLesson(course.lessons[0]);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setLessonStudioTab('theory');
    setActiveTrekFeature(course.lessons[0].trekFeatures?.[0] || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setLessonStudioTab('theory');
    setActiveTrekFeature(lesson.trekFeatures?.[0] || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitCheckpoint = () => {
    if (selectedOption === null || !activeLesson || !selectedCourse) return;
    setIsAnswerSubmitted(true);

    if (selectedOption === activeLesson.checkpointQuestion.correctIndex) {
      completeLesson(
        activeLesson.id,
        activeLesson.xpReward,
        selectedCourse.celestialId,
        selectedCourse.disciplineId
      );
    }
  };

  const handleNextLesson = () => {
    if (!selectedCourse || !activeLesson) return;
    const currentIndex = selectedCourse.lessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex < selectedCourse.lessons.length - 1) {
      handleSelectLesson(selectedCourse.lessons[currentIndex + 1]);
    } else {
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

  // Determine if lesson supports NASA Trek 3D view
  const trekBody: NasaTrekBody | null = activeLesson?.trekBody
    ? activeLesson.trekBody
    : selectedCourse?.celestialId === 'mars'
    ? 'mars'
    : selectedCourse?.celestialId === 'moon'
    ? 'moon'
    : selectedCourse?.celestialId === 'mercury'
    ? 'mercury'
    : null;

  const isCurrentLessonBookmarked = activeLesson
    ? studentProgress.bookmarkedLessonIds?.includes(activeLesson.id)
    : false;

  return (
    <div className="aether-learn-portal relative min-h-screen w-full flex flex-col">
      {/* 1. Atmospheric Deep Cosmic Backdrop Layers */}
      <div className="alp-bg-nebula" aria-hidden="true" />
      <div className="alp-bg-grid" aria-hidden="true">
        <i /><i /><i /><i /><i /><i /><i />
      </div>
      <div className="alp-bg-vignette" aria-hidden="true" />

      {/* 2. Global Application Master Header */}
      <MasterHeader />

      {/* 3. Main Content Studio Area */}
      <main className="relative z-10 flex-1 px-4 sm:px-6 md:px-10 lg:px-12 py-6 sm:py-8 pb-28 max-w-[1440px] w-full mx-auto flex flex-col gap-8">
        {/* VIEW 1: AETHER Learning Directory & Curated Curriculum */}
        {!selectedCourse && (
          <div className="flex flex-col gap-10">
            {/* TOP TELEMETRY HUD BAR */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#7FFFD4]/40 bg-[#7FFFD4]/10 text-[#7FFFD4]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="alp-eyebrow">
                    <span>CYCLE 41</span>
                    <i />
                    <span>SECTOR VELA-9</span>
                    <i />
                    <span>NASA CURRICULUM</span>
                  </div>
                  <h1 className="alp-display text-2xl sm:text-3xl tracking-tight text-[#E9F0F6]">
                    NASA Academic Learning Portal
                  </h1>
                </div>
              </div>

              {/* Student Telemetry Stats */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#080B12]/80 px-3.5 py-1.5 font-mono">
                  <Award className="h-3.5 w-3.5 text-[#FFC46B]" />
                  <span className="text-[#E9F0F6] font-bold alp-lining-nums">{studentProgress.totalXp} XP</span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#080B12]/80 px-3.5 py-1.5 font-mono">
                  <Flame className="h-3.5 w-3.5 text-[#FF8A3D]" />
                  <span className="text-[#E9F0F6] font-bold alp-lining-nums">{studentProgress.dailyStreakDays} Day Streak</span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#080B12]/80 px-3.5 py-1.5 font-mono">
                  <BookOpen className="h-3.5 w-3.5 text-[#7FFFD4]" />
                  <span className="text-[#E9F0F6] font-bold alp-lining-nums">
                    {studentProgress.completedLessonIds.length} / 12 Solved
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#080B12]/80 px-3.5 py-1.5 font-mono">
                  <Clock className="h-3.5 w-3.5 text-[#8FD3FF]" />
                  <span className="text-[#E9F0F6] font-bold alp-lining-nums">
                    {studentProgress.learningTimeMinutes || 42} min
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMasteryDrawer(!showMasteryDrawer)}
                  className="alp-pill alp-pill--ghost !py-1.5 !px-3.5"
                >
                  <Layers className="h-3 w-3 text-[#7FFFD4]" />
                  <span>Mastery Matrix</span>
                </button>
              </div>
            </div>

            {/* EXPANDABLE 12-SUBJECT MASTERY MATRIX */}
            {showMasteryDrawer && (
              <div className="p-6 rounded-2xl border border-white/15 bg-[#080B12]/95 backdrop-blur-2xl shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="alp-eyebrow">
                    <span>12-SUBJECT SPACE SCIENCE MASTERY MATRIX</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowMasteryDrawer(false)}
                    className="alp-micro hover:text-white"
                  >
                    CLOSE [✕]
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-1">
                  {DISCIPLINE_CATEGORIES.filter((d) => d.id !== 'all').map((cat) => {
                    const mastery = studentProgress.subjectMastery?.[cat.id] ?? 30;
                    return (
                      <div
                        key={cat.id}
                        className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{cat.icon}</span>
                          <span className="font-mono text-xs font-bold text-[#7FFFD4] alp-lining-nums">
                            {mastery}%
                          </span>
                        </div>
                        <span className="font-sans text-xs font-medium text-[#E9F0F6] truncate">
                          {cat.label}
                        </span>
                        <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#7FFFD4] to-[#8FD3FF] rounded-full"
                            style={{ width: `${mastery}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* HERO BEAT: AETHER-STYLE FEATURED DISCIPLINE */}
            <section className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-[#080B12]/90 via-[#05070C]/95 to-[#080B12]/90 p-6 sm:p-10 md:p-14 shadow-2xl">
              {/* Subtle Orb Video / Image Preview in Right Corner */}
              <div className="pointer-events-none absolute right-[-5%] top-[-10%] sm:right-[-2%] sm:top-[-5%] h-[340px] w-[340px] sm:h-[480px] sm:w-[480px] md:h-[560px] md:w-[560px] opacity-40 md:opacity-70 mix-blend-screen overflow-hidden">
                <div className="relative h-full w-full rounded-full">
                  <video
                    className="h-full w-full object-cover rounded-full"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={featuredMeta.imageSrc}
                  >
                    {featuredMeta.videoSrc && <source src={featuredMeta.videoSrc} type="video/mp4" />}
                  </video>
                  <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgba(5,7,12,0.95)]" />
                </div>
              </div>

              <div className="relative z-10 max-w-2xl flex flex-col gap-5">
                <div className="alp-eyebrow">
                  <span>01</span>
                  <i />
                  <span>FEATURED DISCIPLINE</span>
                  <i />
                  <span>{featuredMeta.designation}</span>
                </div>

                <h2 className="alp-display text-4xl sm:text-5xl md:text-6xl text-[#E9F0F6]">
                  A Universe that is <br />
                  <em className="text-[#7FFFD4]">almost</em> all mystery.
                </h2>

                <p className="text-sm sm:text-base text-[#93A1B2] font-light leading-relaxed max-w-xl">
                  {featuredCourse.description} Examine multi-wavelength observations from JWST, Hubble, and Chandra. Investigate stellar evolution, nuclear nucleosynthesis, and deep cosmic structures.
                </p>

                {/* Specs Stats Row */}
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-[rgba(255,255,255,0.1)] pt-5 font-mono text-xs">
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[#5A6675]">TRACK LEVEL</dt>
                    <dd className="alp-display text-2xl text-[#E9F0F6] mt-1">{featuredCourse.level}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[#5A6675]">CURRICULUM</dt>
                    <dd className="alp-display text-2xl text-[#E9F0F6] mt-1">{featuredCourse.totalLessons} Units</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[#5A6675]">ACCREDITATION</dt>
                    <dd className="alp-display text-2xl text-[#FFC46B] mt-1">+{featuredCourse.xpTotal} XP</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[#5A6675]">DATA FEED</dt>
                    <dd className="alp-display text-xl text-[#8FD3FF] mt-1 truncate">JWST / HUBBLE</dd>
                  </div>
                </dl>

                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <button
                    type="button"
                    onClick={() => handleStartCourse(featuredCourse)}
                    className="alp-pill alp-pill--primary"
                  >
                    <span>START DISCIPLINE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveLearnSection('nasa-observatory')}
                    className="alp-pill alp-pill--ghost"
                  >
                    <Radio className="w-3.5 h-3.5 text-[#7FFFD4]" />
                    <span>NASA OBSERVATORY</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.EXPLORE)}
                    className="alp-pill alp-pill--ghost"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#8FD3FF]" />
                    <span>3D SOLAR SYSTEM</span>
                  </button>
                </div>
              </div>
            </section>

            {/* CURRICULUM SECTIONS & CONTROLS */}
            <div className="flex flex-col gap-6">
              {/* Section Toggle: Courses vs NASA Live Observatory */}
              <div className="flex flex-wrap items-center gap-2 border-b border-[rgba(255,255,255,0.08)] pb-4">
                <button
                  type="button"
                  onClick={() => setActiveLearnSection('courses')}
                  className={`alp-pill ${activeLearnSection === 'courses' ? 'alp-pill--primary' : 'alp-pill--ghost'}`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>12 LEARNING DISCIPLINES</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLearnSection('nasa-observatory')}
                  className={`alp-pill ${activeLearnSection === 'nasa-observatory' ? 'alp-pill--primary' : 'alp-pill--ghost'}`}
                >
                  <Radio className="w-3 h-3 text-[#7FFFD4]" />
                  <span>NASA OBSERVATORY (APOD • ASTEROIDS • DONKI)</span>
                </button>
              </div>

              {activeLearnSection === 'nasa-observatory' ? (
                <NasaSpaceObservatory />
              ) : (
                <>
                  {/* AETHER FILTERBAR & SEARCH */}
                  <form className="alp-filterbar" onSubmit={(e) => e.preventDefault()} role="search">
                    <div className="alp-search">
                      <Search />
                      <input
                        type="search"
                        placeholder="SEARCH PLATE, DISCIPLINE OR KEYWORD"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search learning disciplines"
                      />
                    </div>

                    <div className="alp-chips" role="group" aria-label="Filter by discipline">
                      {DISCIPLINE_CATEGORIES.map((cat) => {
                        const isSelected = selectedDiscipline === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedDiscipline(cat.id)}
                            className={`alp-chip ${isSelected ? 'is-on' : ''}`}
                          >
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => setFilterBookmarksOnly(!filterBookmarksOnly)}
                        className={`alp-chip ${filterBookmarksOnly ? 'is-bookmark-on' : ''}`}
                      >
                        <Bookmark className="w-2.5 h-2.5 inline mr-1" />
                        <span>BOOKMARKS ({studentProgress.bookmarkedLessonIds?.length || 0})</span>
                      </button>
                    </div>

                    <p className="alp-micro">
                      <b>{filteredCourses.length}</b> DISCIPLINES ACTIVE
                    </p>
                  </form>

                  {/* 12 DISCIPLINE DOSSIER CARDS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => {
                      const completedInCourse = course.lessons.filter((l) =>
                        studentProgress.completedLessonIds.includes(l.id)
                      ).length;
                      const progressPct = Math.round(
                        (completedInCourse / course.lessons.length) * 100
                      );
                      const meta = AETHER_DISCIPLINE_METAS[course.id] || {
                        fig: 'FIG. 00',
                        designation: 'AE-00 // DEEP SPACE',
                        accent: '#7FFFD4',
                        accentClass: 'earth' as const,
                        imageSrc: '/assets/aether/img/aether-nebula.jpg',
                        surveyFocus: course.tagline,
                        dataFeed: 'NASA SCIENCE',
                      };

                      return (
                        <article
                          key={course.id}
                          onClick={() => handleStartCourse(course)}
                          className="alp-card group cursor-pointer"
                        >
                          {/* Image preview / Orb header */}
                          <div className="relative h-44 w-full overflow-hidden rounded-lg bg-[#080B12] border border-white/5">
                            <img
                              src={meta.imageSrc}
                              alt={course.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#05070C] via-transparent to-transparent opacity-90" />
                            
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                              <span
                                className="alp-card-fig px-2 py-0.5 rounded-full border border-white/10 bg-[#05070C]/80"
                                style={{ color: meta.accent }}
                              >
                                {meta.fig}
                              </span>
                              <span className="font-mono text-[9px] uppercase tracking-widest text-[#93A1B2] bg-[#05070C]/80 px-2 py-0.5 rounded-full border border-white/10">
                                {course.level}
                              </span>
                            </div>

                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                              <span className="font-mono text-[10px] text-[#E9F0F6] uppercase tracking-wider font-semibold">
                                {meta.designation}
                              </span>
                              <span
                                className="font-mono text-[10px] font-bold"
                                style={{ color: meta.accent }}
                              >
                                +{course.xpTotal} XP
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex flex-col gap-2">
                            <span className="alp-micro">
                              {course.category} <i></i> {course.totalLessons} MODULES
                            </span>

                            <h3 className="alp-card-title group-hover:text-[#7FFFD4] transition-colors">
                              {course.title}
                            </h3>

                            <p
                              className="font-mono text-[11px] font-medium leading-snug line-clamp-1"
                              style={{ color: meta.accent }}
                            >
                              {course.tagline}
                            </p>

                            <p className="alp-card-desc line-clamp-2">
                              {course.description}
                            </p>
                          </div>

                          {/* Specs & Progress Bar */}
                          <div className="mt-auto flex flex-col gap-3 pt-3 border-t border-[rgba(255,255,255,0.08)]">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-[#5A6675]">COMPLETION</span>
                              <span className="text-[#E9F0F6] font-bold alp-lining-nums">{progressPct}%</span>
                            </div>

                            <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${progressPct}%`,
                                  backgroundColor: meta.accent,
                                  boxShadow: `0 0 8px ${meta.accent}`,
                                }}
                              />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <span className="font-mono text-[9.5px] uppercase tracking-widest text-[#5A6675] truncate max-w-[160px]">
                                {meta.dataFeed}
                              </span>
                              <span className="alp-micro !text-[#7FFFD4] group-hover:translate-x-1 transition-transform">
                                <span>OPEN DOSSIER</span>
                                <ArrowRight className="w-3 h-3 inline ml-1" />
                              </span>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: Interactive Lesson Reading Studio View */}
        {selectedCourse && activeLesson && (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Top Back Navigation Bar */}
            <div className="p-4 sm:p-5 rounded-2xl border border-white/15 bg-[#080B12]/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourse(null);
                    setActiveLesson(null);
                  }}
                  className="alp-pill alp-pill--ghost !py-2 !px-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>ALL DISCIPLINES</span>
                </button>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedCourse.icon}</span>
                    <h2 className="alp-display text-xl sm:text-2xl text-[#E9F0F6]">
                      {selectedCourse.title}
                    </h2>
                  </div>
                  <span className="alp-micro">
                    {selectedCourse.category} <i></i> {selectedCourse.level} TRACK <i></i> +{selectedCourse.xpTotal} XP
                  </span>
                </div>
              </div>

              {/* Studio Tabs */}
              <div className="flex items-center gap-1.5 rounded-full bg-[#05070C] p-1 border border-white/10 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setLessonStudioTab('theory')}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    lessonStudioTab === 'theory'
                      ? 'bg-[#7FFFD4] text-[#02040A] shadow-md'
                      : 'text-[#93A1B2] hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Theory</span>
                </button>

                {activeLesson.visualization3D && (
                  <button
                    type="button"
                    onClick={() => setLessonStudioTab('3d-viewport')}
                    className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      lessonStudioTab === '3d-viewport'
                        ? 'bg-[#7FFFD4] text-[#02040A] shadow-md'
                        : 'text-[#93A1B2] hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>3D Model</span>
                  </button>
                )}

                {activeLesson.scientificDiagram && (
                  <button
                    type="button"
                    onClick={() => setLessonStudioTab('diagram')}
                    className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      lessonStudioTab === 'diagram'
                        ? 'bg-[#7FFFD4] text-[#02040A] shadow-md'
                        : 'text-[#93A1B2] hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Diagram</span>
                  </button>
                )}

                {trekBody && (
                  <button
                    type="button"
                    onClick={() => setLessonStudioTab('nasa-data')}
                    className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      lessonStudioTab === 'nasa-data'
                        ? 'bg-[#7FFFD4] text-[#02040A] shadow-md'
                        : 'text-[#93A1B2] hover:text-white'
                    }`}
                  >
                    <Globe2 className="w-3.5 h-3.5" />
                    <span>NASA Trek</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setLessonStudioTab('laura-teacher')}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    lessonStudioTab === 'laura-teacher'
                      ? 'bg-[#7FFFD4] text-[#02040A] shadow-md'
                      : 'text-[#93A1B2] hover:text-white'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Laura AI</span>
                </button>

                {(activeLesson.missions || activeLesson.discoveries || activeLesson.realMissionExamples) && (
                  <button
                    type="button"
                    onClick={() => setLessonStudioTab('missions')}
                    className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      lessonStudioTab === 'missions'
                        ? 'bg-[#7FFFD4] text-[#02040A] shadow-md'
                        : 'text-[#93A1B2] hover:text-white'
                    }`}
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    <span>Missions</span>
                  </button>
                )}
              </div>

              {/* Bookmark & Reward */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleBookmark(activeLesson.id)}
                  title={isCurrentLessonBookmarked ? 'Remove Bookmark' : 'Bookmark Lesson'}
                  className={`flex h-8 px-3 items-center gap-1.5 rounded-full border text-xs font-mono uppercase tracking-wider transition-all ${
                    isCurrentLessonBookmarked
                      ? 'border-[#FFC46B] bg-[#FFC46B]/20 text-[#FFC46B] font-bold'
                      : 'border-white/10 bg-white/5 text-[#93A1B2] hover:text-white'
                  }`}
                >
                  {isCurrentLessonBookmarked ? (
                    <BookmarkCheck className="w-3.5 h-3.5 text-[#FFC46B]" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5" />
                  )}
                  <span>{isCurrentLessonBookmarked ? 'Bookmarked' : 'Save'}</span>
                </button>

                <div className="flex items-center gap-1.5 rounded-full border border-[#FFC46B]/30 bg-[#FFC46B]/10 px-3 py-1 font-mono text-xs text-[#FFC46B] font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>+{activeLesson.xpReward} XP</span>
                </div>
              </div>
            </div>

            {/* Layout: Module Stepper (Left) + Studio Content (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Modules Stepper */}
              <div className="p-6 rounded-2xl border border-white/15 bg-[#080B12]/80 backdrop-blur-xl flex flex-col gap-4 self-start">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="alp-eyebrow">
                    <span>DISCIPLINE UNITS</span>
                  </span>
                  <span className="font-mono text-xs text-[#93A1B2]">
                    {selectedCourse.lessons.length} Modules
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {selectedCourse.lessons.map((lesson, idx) => {
                    const isActive = activeLesson.id === lesson.id;
                    const isDone = studentProgress.completedLessonIds.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => handleSelectLesson(lesson)}
                        className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                          isActive
                            ? 'border-[#7FFFD4] bg-[#7FFFD4]/10 shadow-[0_0_16px_rgba(127,255,212,0.2)]'
                            : isDone
                            ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10'
                            : 'border-white/5 bg-white/[0.015] hover:bg-white/5'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </span>
                          ) : (
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-full border font-mono text-[10px] ${
                                isActive
                                  ? 'border-[#7FFFD4] bg-[#7FFFD4] text-[#02040A] font-bold'
                                  : 'border-white/20 text-[#93A1B2]'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span
                            className={`font-sans text-xs font-semibold ${
                              isActive ? 'text-[#E9F0F6]' : 'text-[#93A1B2]'
                            }`}
                          >
                            {lesson.title}
                          </span>
                          <span className="font-mono text-[10px] text-[#5A6675] mt-0.5">
                            {lesson.duration} <i>•</i> +{lesson.xpReward} XP
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Progress Meter */}
                <div className="mt-4 rounded-xl border border-white/5 bg-[#05070C]/60 p-3.5">
                  <div className="flex justify-between font-mono text-[11px] text-[#93A1B2] mb-1.5">
                    <span>Course Mastery</span>
                    <span className="text-[#7FFFD4] font-bold alp-lining-nums">
                      {Math.round(
                        (selectedCourse.lessons.filter((l) =>
                          studentProgress.completedLessonIds.includes(l.id)
                        ).length /
                          selectedCourse.lessons.length) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-[#7FFFD4] rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (selectedCourse.lessons.filter((l) =>
                            studentProgress.completedLessonIds.includes(l.id)
                          ).length /
                            selectedCourse.lessons.length) *
                          100
                        }%`,
                        boxShadow: '0 0 8px rgba(127,255,212,0.6)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Active Studio Content */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* TAB 1: THEORY & LESSON READING */}
                {lessonStudioTab === 'theory' && (
                  <>
                    <div className="p-6 sm:p-10 rounded-2xl border border-white/15 bg-[#080B12]/80 backdrop-blur-xl space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-2 font-mono text-xs text-[#7FFFD4]">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{activeLesson.duration} SURVEY READ</span>
                        </div>
                        <span className="alp-micro">
                          LESSON <b>ACTIVE</b>
                        </span>
                      </div>

                      <h1 className="alp-display text-3xl sm:text-4xl md:text-5xl text-[#E9F0F6]">
                        {activeLesson.title}
                      </h1>

                      {/* Learning Objectives Callout Banner */}
                      {activeLesson.objectives && (
                        <div className="p-4 rounded-xl border border-[#7FFFD4]/20 bg-[#7FFFD4]/5 space-y-2">
                          <div className="alp-micro !text-[#7FFFD4]">
                            <Target className="w-3.5 h-3.5 inline mr-1" />
                            <span>LEARNING OBJECTIVES</span>
                          </div>
                          <ul className="flex flex-col gap-1.5 text-xs text-[#E9F0F6]">
                            {activeLesson.objectives.map((obj, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-[#7FFFD4] font-bold">•</span>
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Summary Block */}
                      <p className="text-sm text-[#E9F0F6] font-light leading-relaxed italic border-l-2 border-[#7FFFD4] pl-4 py-2 bg-gradient-to-r from-[#7FFFD4]/5 to-transparent rounded-r-xl">
                        {activeLesson.summary}
                      </p>

                      {/* Content Paragraphs */}
                      <div className="flex flex-col gap-4 text-xs sm:text-sm text-[#93A1B2] font-light leading-relaxed">
                        {activeLesson.content.map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>

                      {/* Embedded 3D Model Teaser */}
                      {activeLesson.visualization3D && (
                        <div className="p-4 rounded-xl bg-[#05070C] border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-4 h-4 text-[#7FFFD4]" />
                            <div>
                              <span className="font-sans text-xs font-bold text-white block">
                                {activeLesson.visualization3D.title || 'Interactive 3D Simulation'}
                              </span>
                              <span className="font-mono text-[10px] text-[#5A6675]">
                                Model Type: {activeLesson.visualization3D.type}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setLessonStudioTab('3d-viewport')}
                            className="alp-pill alp-pill--primary !py-1.5 !px-3.5"
                          >
                            <span>Open 3D Viewport</span>
                          </button>
                        </div>
                      )}

                      {/* NASA Imagery Card */}
                      {activeLesson.nasaImagery && (
                        <div className="rounded-xl border border-white/10 bg-[#05070C] overflow-hidden space-y-2">
                          <div className="relative h-64 w-full overflow-hidden">
                            <img
                              src={activeLesson.nasaImagery.url}
                              alt={activeLesson.nasaImagery.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#05070C] via-transparent to-transparent" />
                          </div>
                          <div className="p-4 text-xs font-mono space-y-1">
                            <span className="font-bold text-white block">
                              {activeLesson.nasaImagery.title}
                            </span>
                            <p className="text-[11px] text-[#93A1B2]">
                              {activeLesson.nasaImagery.caption}
                            </p>
                            <span className="text-[10px] text-[#5A6675] block">
                              Credit: {activeLesson.nasaImagery.credit}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Previous / Next Lesson Stepper */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <button
                          type="button"
                          onClick={handlePrevLesson}
                          disabled={
                            selectedCourse.lessons.findIndex((l) => l.id === activeLesson.id) === 0
                          }
                          className="alp-pill alp-pill--ghost !py-1.5 !px-3 disabled:opacity-30"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Previous</span>
                        </button>

                        <span className="alp-micro">
                          MODULE {selectedCourse.lessons.findIndex((l) => l.id === activeLesson.id) + 1} OF {selectedCourse.lessons.length}
                        </span>

                        <button
                          type="button"
                          onClick={handleNextLesson}
                          className="alp-pill alp-pill--ghost !py-1.5 !px-3"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* KNOWLEDGE CHECKPOINT */}
                    <div className="p-6 sm:p-10 rounded-2xl border border-white/15 bg-[#080B12]/95 backdrop-blur-xl shadow-2xl space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="alp-eyebrow">
                          <Sparkles className="w-3.5 h-3.5 text-[#FFC46B]" />
                          <span>KNOWLEDGE CHECKPOINT</span>
                        </div>

                        <div className="font-mono text-xs text-[#FFC46B] font-bold">
                          +{activeLesson.xpReward} XP
                        </div>
                      </div>

                      <h3 className="alp-display text-xl sm:text-2xl text-[#E9F0F6]">
                        {activeLesson.checkpointQuestion.question}
                      </h3>

                      {/* Options */}
                      <div className="flex flex-col gap-3">
                        {activeLesson.checkpointQuestion.options.map((option, idx) => {
                          const isSelected = selectedOption === idx;
                          const isCorrect =
                            isAnswerSubmitted &&
                            idx === activeLesson.checkpointQuestion.correctIndex;
                          const isWrong =
                            isAnswerSubmitted &&
                            isSelected &&
                            idx !== activeLesson.checkpointQuestion.correctIndex;

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                if (!isAnswerSubmitted) setSelectedOption(idx);
                              }}
                              className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                                isCorrect
                                  ? 'border-emerald-400 bg-emerald-500/20 text-[#E9F0F6] shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                                  : isWrong
                                  ? 'border-red-500 bg-red-500/20 text-red-200'
                                  : isSelected
                                  ? 'border-[#7FFFD4] bg-[#7FFFD4]/15 text-[#E9F0F6] shadow-[0_0_16px_rgba(127,255,212,0.2)]'
                                  : 'border-white/10 bg-[#05070C]/50 text-[#93A1B2] hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-bold ${
                                    isCorrect
                                      ? 'bg-emerald-400 text-[#02040A]'
                                      : isWrong
                                      ? 'bg-red-500 text-white'
                                      : isSelected
                                      ? 'bg-[#7FFFD4] text-[#02040A]'
                                      : 'bg-white/10 text-[#93A1B2]'
                                  }`}
                                >
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="font-sans text-xs sm:text-sm">{option}</span>
                              </div>

                              {isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                              {isWrong && <XCircle className="h-4 w-4 text-red-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Callout */}
                      {isAnswerSubmitted && (
                        <div className="rounded-xl border border-white/10 bg-[#05070C]/80 p-4 text-xs text-[#93A1B2] space-y-1">
                          <div className="alp-micro !text-[#7FFFD4]">
                            <span>SCIENTIFIC PRINCIPLE EXPLANATION</span>
                          </div>
                          <p className="leading-relaxed">
                            {activeLesson.checkpointQuestion.explanation}
                          </p>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="flex items-center justify-end gap-3 pt-2">
                        {!isAnswerSubmitted ? (
                          <button
                            type="button"
                            disabled={selectedOption === null}
                            onClick={handleSubmitCheckpoint}
                            className="alp-pill alp-pill--primary disabled:opacity-40"
                          >
                            <span>SUBMIT CHECKPOINT</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleNextLesson}
                            className="alp-pill alp-pill--primary"
                          >
                            <span>
                              {selectedCourse.lessons.findIndex((l) => l.id === activeLesson.id) ===
                              selectedCourse.lessons.length - 1
                                ? 'COMPLETE DISCIPLINE (+XP)'
                                : 'CONTINUE TO NEXT LESSON'}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* TAB 2: INTERACTIVE 3D MODEL VIEWPORT */}
                {lessonStudioTab === '3d-viewport' && activeLesson.visualization3D && (
                  <Lesson3DViewport config={activeLesson.visualization3D} />
                )}

                {/* TAB 3: SCIENTIFIC DIAGRAM VIEW */}
                {lessonStudioTab === 'diagram' && activeLesson.scientificDiagram && (
                  <ScientificDiagramView diagram={activeLesson.scientificDiagram} />
                )}

                {/* TAB 4: NASA OPEN DATA */}
                {lessonStudioTab === 'nasa-data' && (
                  <div className="flex flex-col gap-6">
                    {trekBody && (
                      <div className="p-6 rounded-2xl border border-white/15 bg-[#080B12]/95 backdrop-blur-xl">
                        <LessonTrekExplorer3D
                          trekBody={trekBody}
                          features={activeLesson.trekFeatures || []}
                          onSelectFeature={(feat) => setActiveTrekFeature(feat)}
                          title={`NASA ${trekBody.toUpperCase()} Surface & Elevation Studio`}
                        />
                      </div>
                    )}

                    {activeLesson.osdrStudy && (
                      <NasaOsdrLessonCard
                        study={activeLesson.osdrStudy}
                        onExplainWithLaura={() => setLessonStudioTab('laura-teacher')}
                      />
                    )}

                    {selectedCourse.disciplineId === 'climate' && (
                      <NasaGibsLessonViewer />
                    )}
                  </div>
                )}

                {/* TAB 5: LAURA AI TEACHER */}
                {lessonStudioTab === 'laura-teacher' && (
                  <LauraTeacherPanel
                    lesson={activeLesson}
                    selectedFeature={activeTrekFeature}
                    celestialTitle={selectedCourse.title}
                    onGuide3D={() => setLessonStudioTab('3d-viewport')}
                  />
                )}

                {/* TAB 6: MISSIONS & REFERENCES */}
                {lessonStudioTab === 'missions' && (
                  <div className="p-6 sm:p-10 rounded-2xl border border-white/15 bg-[#080B12]/95 backdrop-blur-xl flex flex-col gap-6">
                    <div>
                      <div className="alp-eyebrow">
                        <Rocket className="w-3.5 h-3.5 text-[#FFC46B]" />
                        <span>NASA & ESA SPACE EXPLORATION DOSSIER</span>
                      </div>
                      <h2 className="alp-display text-2xl sm:text-3xl text-white mt-2">
                        Missions, Discoveries & Scientific Citations
                      </h2>
                    </div>

                    {/* Real Mission Examples */}
                    {activeLesson.realMissionExamples && activeLesson.realMissionExamples.length > 0 && (
                      <div className="flex flex-col gap-3">
                        <span className="alp-micro">KEY SPACECRAFT MISSIONS</span>
                        <div className="grid grid-cols-1 gap-3">
                          {activeLesson.realMissionExamples.map((m, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-slate-200 space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white flex items-center gap-1.5">
                                  <Rocket className="w-3.5 h-3.5 text-[#7FFFD4]" />
                                  <span>{m.missionName}</span>
                                </span>
                                <span className="font-mono text-[10px] text-[#FFC46B]">
                                  {m.agency} • {m.launchYear}
                                </span>
                              </div>
                              <p className="font-mono text-[11px] text-[#93A1B2]">
                                {m.keyContribution}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Associated Spacecraft */}
                    {activeLesson.missions && activeLesson.missions.length > 0 && (
                      <div className="flex flex-col gap-3">
                        <span className="alp-micro">ASSOCIATED SPACECRAFT & OBSERVATORIES</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {activeLesson.missions.map((m, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-slate-200 flex items-center gap-2"
                            >
                              <Rocket className="w-3.5 h-3.5 text-[#7FFFD4] shrink-0" />
                              <span>{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Discoveries */}
                    {activeLesson.discoveries && activeLesson.discoveries.length > 0 && (
                      <div className="flex flex-col gap-3">
                        <span className="alp-micro">KEY SCIENTIFIC DISCOVERIES</span>
                        <div className="flex flex-col gap-2.5">
                          {activeLesson.discoveries.map((d, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-[#7FFFD4]/5 border border-[#7FFFD4]/20 text-xs text-emerald-100 flex items-start gap-2.5"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#7FFFD4] shrink-0 mt-0.5" />
                              <span>{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Academic References */}
                    {activeLesson.references && activeLesson.references.length > 0 && (
                      <div className="flex flex-col gap-3 border-t border-white/10 pt-5">
                        <span className="alp-micro">
                          <FileText className="w-3.5 h-3.5 inline mr-1" />
                          <span>ACADEMIC & NASA DATA REFERENCES</span>
                        </span>
                        <ul className="text-xs text-[#93A1B2] space-y-1.5 list-disc list-inside">
                          {activeLesson.references.map((r, idx) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LearnPortalScreen;
