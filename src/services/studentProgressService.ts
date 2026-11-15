/**
 * ORBIT ACADEMY — Student Progress & Gamification Service (Stage 07 Upgrade)
 * Manages persistent XP, daily streaks, planetary mastery, 12-subject mastery,
 * active learning time, bookmarks, daily missions, and achievement badges.
 */

import { useState, useEffect, useCallback } from 'react';

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  target: number;
  isCompleted: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'explorer' | 'scholar' | 'commander' | 'specialist';
}

export interface PlanetMastery {
  destinationId: string;
  masteryPercent: number;
  lessonsCompleted: number;
  quizzesPassed: number;
}

export interface StudentProgressState {
  totalXp: number;
  dailyStreakDays: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  learningTimeMinutes: number;
  quizzesTaken: number;
  quizzesWon: number;
  correctAnswersCount: number;
  totalAnswersCount: number;
  maxStreak: number;
  unlockedAchievementIds: string[];
  planetMastery: Record<string, PlanetMastery>;
  subjectMastery: Record<string, number>;
  dailyMissions: DailyMission[];
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-light',
    title: 'First Light',
    description: 'Completed your first NASA academic lesson checkpoint.',
    icon: '✨',
    category: 'scholar',
  },
  {
    id: 'olympus-ascender',
    title: 'Olympus Ascender',
    description: 'Explored Mars geological volcanic formations in 3D.',
    icon: '🌋',
    category: 'explorer',
  },
  {
    id: 'apollo-scholar',
    title: 'Apollo Scholar',
    description: 'Mastered Lunar impact cratering and Tranquility Base history.',
    icon: '🌕',
    category: 'specialist',
  },
  {
    id: 'blitz-champion',
    title: 'Blitz Champion',
    description: 'Completed a 60-second high-speed Timed Blitz Quiz run.',
    icon: '⚡',
    category: 'commander',
  },
  {
    id: 'deep-space-cartographer',
    title: 'Deep Space Cartographer',
    description: 'Toggled and inspected official NASA Trek elevation layers.',
    icon: '🗺️',
    category: 'explorer',
  },
  {
    id: 'grand-astrophysicist',
    title: 'Grand Astrophysicist',
    description: 'Accumulated over 1,000 academic space science XP.',
    icon: '🔭',
    category: 'commander',
  },
  {
    id: 'perfect-orbit',
    title: 'Flawless Trajectory',
    description: 'Scored 100% accuracy in any NASA Tournament Arena.',
    icon: '🎯',
    category: 'commander',
  },
  {
    id: 'solar-surveyor',
    title: 'Solar Surveyor',
    description: 'Explored lessons across 5 or more planetary destinations.',
    icon: '☀️',
    category: 'scholar',
  },
  // Stage 07 New Achievements
  {
    id: 'cosmic-scholar',
    title: 'Cosmic Scholar',
    description: 'Completed 5 lessons in Astronomy & Deep Cosmos.',
    icon: '🌌',
    category: 'scholar',
  },
  {
    id: 'space-biologist',
    title: 'NASA Astrobiologist',
    description: 'Explored NASA OSDR and GeneLab microgravity cellular research.',
    icon: '🧬',
    category: 'specialist',
  },
  {
    id: 'planetary-geologist',
    title: 'Planetary Geologist',
    description: 'Analyzed surface stratigraphy and volcanic caldera terrain in 3D.',
    icon: '⛰️',
    category: 'explorer',
  },
  {
    id: 'heliophysicist',
    title: 'Heliophysicist',
    description: 'Mastered solar magnetic dynamos and NASA DONKI space weather events.',
    icon: '🔥',
    category: 'scholar',
  },
  {
    id: 'climate-sentinel',
    title: 'Climate Sentinel',
    description: 'Investigated Earth radiative equilibrium and greenhouse dynamics with NASA GIBS.',
    icon: '🌍',
    category: 'specialist',
  },
  {
    id: 'grand-master-orbit',
    title: 'Grand Master of Orbit',
    description: 'Achieved high mastery across all 12 space-science disciplines.',
    icon: '👑',
    category: 'commander',
  },
  // Stage 08 New Quiz Arena Achievements
  {
    id: 'data-analyst',
    title: 'NASA Data Analyst',
    description: 'Interpreted empirical scientific charts, light curves, or omics datasets.',
    icon: '📊',
    category: 'specialist',
  },
  {
    id: 'planetary-cartographer',
    title: 'Planetary Cartographer',
    description: 'Pinpointed geographical coordinates on NASA Trek equirectangular map grids.',
    icon: '🧭',
    category: 'explorer',
  },
  {
    id: 'flight-director',
    title: 'Flight Director',
    description: 'Successfully resolved a tactical flight telemetry mission scenario.',
    icon: '🚀',
    category: 'commander',
  },
  {
    id: 'helio-master',
    title: 'Heliophysics Master',
    description: 'Demonstrated mastery over NASA DONKI space weather classifications.',
    icon: '⚡',
    category: 'scholar',
  },
  {
    id: 'astrobiology-scholar',
    title: 'Astrobiology Scholar',
    description: 'Excelled in NASA Open Science Data Repository (OSDR) biology challenges.',
    icon: '🔬',
    category: 'scholar',
  },
  {
    id: 'grand-tournament-champion',
    title: 'Grand Tournament Champion',
    description: 'Completed a comprehensive NASA Space Science Tournament.',
    icon: '🏆',
    category: 'commander',
  },
  // Stage 09 New Space Mission Simulator Achievements
  {
    id: 'orbital-aviator',
    title: 'Orbital Aviator',
    description: 'Executed Earth Orbit Insertion and circularization into low Earth orbit.',
    icon: '🚀',
    category: 'commander',
  },
  {
    id: 'docking-master',
    title: 'Docking Specialist',
    description: 'Successfully soft-docked with the International Space Station at IDSS capture speeds.',
    icon: '🛰️',
    category: 'specialist',
  },
  {
    id: 'lunar-lander',
    title: 'Lunar South Pole Lander',
    description: 'Executed powered descent and touched down safely at Shackleton Crater rim.',
    icon: '🌕',
    category: 'commander',
  },
  {
    id: 'interplanetary-navigator',
    title: 'Interplanetary Navigator',
    description: 'Calculated and executed Trans-Mars Injection into the Hohmann transfer corridor.',
    icon: '🪐',
    category: 'scholar',
  },
  {
    id: 'red-planet-pioneer',
    title: 'Red Planet Pioneer',
    description: 'Survives the Seven Minutes of Terror to land softly in Jezero Crater.',
    icon: '🌋',
    category: 'explorer',
  },
  {
    id: 'deep-space-pilot',
    title: 'Deep Space Aviator',
    description: 'Navigated asteroid proximity operations or extreme solar coronal perihelion dives.',
    icon: '✨',
    category: 'specialist',
  },
];

export const ACHIEVEMENTS_LIST = ALL_ACHIEVEMENTS;

const DEFAULT_MISSIONS: DailyMission[] = [
  {
    id: 'mission-lesson-1',
    title: 'Cosmic Scholar',
    description: 'Complete 1 interactive NASA lesson checkpoint.',
    xpReward: 100,
    progress: 1,
    target: 1,
    isCompleted: true,
  },
  {
    id: 'mission-quiz-3',
    title: 'Planetary Pioneer',
    description: 'Solve 3 questions in any Quiz Arena.',
    xpReward: 150,
    progress: 2,
    target: 3,
    isCompleted: false,
  },
  {
    id: 'mission-trek-explore',
    title: 'Surface Reconnaissance',
    description: 'Inspect a 3D NASA Trek planetary surface landmark.',
    xpReward: 75,
    progress: 1,
    target: 1,
    isCompleted: true,
  },
];

const CELESTIAL_DESTINATIONS = [
  'solar-system',
  'sun',
  'mercury',
  'venus',
  'earth',
  'moon',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'milky-way',
];

export const SUBJECT_DISCIPLINES = [
  'astronomy',
  'solar-system',
  'sun',
  'planets',
  'moons',
  'milky-way',
  'geology',
  'exploration',
  'space-biology',
  'climate',
  'space-weather',
  'human-spaceflight',
];

function initDefaultMastery(): Record<string, PlanetMastery> {
  const mastery: Record<string, PlanetMastery> = {};
  for (const id of CELESTIAL_DESTINATIONS) {
    mastery[id] = {
      destinationId: id,
      masteryPercent: id === 'mars' ? 55 : id === 'moon' ? 40 : id === 'earth' ? 60 : 25,
      lessonsCompleted: id === 'mars' ? 2 : id === 'moon' ? 1 : id === 'earth' ? 2 : 1,
      quizzesPassed: id === 'mars' ? 1 : id === 'earth' ? 1 : 0,
    };
  }
  return mastery;
}

function initDefaultSubjectMastery(): Record<string, number> {
  const sm: Record<string, number> = {};
  for (const id of SUBJECT_DISCIPLINES) {
    sm[id] = id === 'astronomy' ? 45 : id === 'solar-system' ? 60 : id === 'space-biology' ? 35 : id === 'climate' ? 50 : 20;
  }
  return sm;
}

const STORAGE_KEY = 'orbit_academy_student_progress_v3';

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadStudentProgress(): StudentProgressState {
  if (typeof window === 'undefined') {
    return createInitialState();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<StudentProgressState>;
    return {
      totalXp: parsed.totalXp ?? 850,
      dailyStreakDays: parsed.dailyStreakDays ?? 5,
      lastActiveDate: parsed.lastActiveDate ?? getTodayStr(),
      completedLessonIds: parsed.completedLessonIds ?? ['ss-1', 'mars-1', 'bio-1'],
      bookmarkedLessonIds: parsed.bookmarkedLessonIds ?? ['ss-2', 'astro-1'],
      learningTimeMinutes: parsed.learningTimeMinutes ?? 42,
      quizzesTaken: parsed.quizzesTaken ?? 3,
      quizzesWon: parsed.quizzesWon ?? 2,
      correctAnswersCount: parsed.correctAnswersCount ?? 11,
      totalAnswersCount: parsed.totalAnswersCount ?? 14,
      maxStreak: parsed.maxStreak ?? 5,
      unlockedAchievementIds: parsed.unlockedAchievementIds ?? ['first-light', 'olympus-ascender', 'cosmic-scholar'],
      planetMastery: parsed.planetMastery ?? initDefaultMastery(),
      subjectMastery: parsed.subjectMastery ?? initDefaultSubjectMastery(),
      dailyMissions: parsed.dailyMissions ?? DEFAULT_MISSIONS,
    };
  } catch (e) {
    console.warn('Failed to load student progress from storage, using defaults:', e);
    return createInitialState();
  }
}

function createInitialState(): StudentProgressState {
  return {
    totalXp: 850,
    dailyStreakDays: 5,
    lastActiveDate: getTodayStr(),
    completedLessonIds: ['ss-1', 'mars-1', 'bio-1'],
    bookmarkedLessonIds: ['ss-2', 'astro-1'],
    learningTimeMinutes: 42,
    quizzesTaken: 3,
    quizzesWon: 2,
    correctAnswersCount: 11,
    totalAnswersCount: 14,
    maxStreak: 5,
    unlockedAchievementIds: ['first-light', 'olympus-ascender', 'cosmic-scholar'],
    planetMastery: initDefaultMastery(),
    subjectMastery: initDefaultSubjectMastery(),
    dailyMissions: DEFAULT_MISSIONS,
  };
}

export function saveStudentProgress(state: StudentProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('orbit_progress_updated', { detail: state }));
  } catch (e) {
    console.error('Failed to save student progress to localStorage:', e);
  }
}

export function useStudentProgress() {
  const [state, setState] = useState<StudentProgressState>(loadStudentProgress);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<StudentProgressState>;
      if (customEvent.detail) {
        setState(customEvent.detail);
      } else {
        setState(loadStudentProgress());
      }
    };
    window.addEventListener('orbit_progress_updated', handleUpdate);
    return () => window.removeEventListener('orbit_progress_updated', handleUpdate);
  }, []);

  const completeLesson = useCallback((lessonId: string, xpReward: number, celestialId?: string, disciplineId?: string) => {
    setState((prev) => {
      const alreadyCompleted = prev.completedLessonIds.includes(lessonId);
      const newCompleted = alreadyCompleted ? prev.completedLessonIds : [...prev.completedLessonIds, lessonId];
      const newXp = alreadyCompleted ? prev.totalXp : prev.totalXp + xpReward;
      const newAchievements = [...prev.unlockedAchievementIds];

      if (!newAchievements.includes('first-light')) {
        newAchievements.push('first-light');
      }
      if (newXp >= 1000 && !newAchievements.includes('grand-astrophysicist')) {
        newAchievements.push('grand-astrophysicist');
      }
      if (newCompleted.length >= 5 && !newAchievements.includes('cosmic-scholar')) {
        newAchievements.push('cosmic-scholar');
      }
      if (disciplineId === 'space-biology' && !newAchievements.includes('space-biologist')) {
        newAchievements.push('space-biologist');
      }
      if (disciplineId === 'geology' && !newAchievements.includes('planetary-geologist')) {
        newAchievements.push('planetary-geologist');
      }
      if ((disciplineId === 'sun' || disciplineId === 'space-weather') && !newAchievements.includes('heliophysicist')) {
        newAchievements.push('heliophysicist');
      }
      if (disciplineId === 'climate' && !newAchievements.includes('climate-sentinel')) {
        newAchievements.push('climate-sentinel');
      }

      // Update planet mastery if celestialId provided
      const cId = celestialId || 'solar-system';
      const currentMastery = prev.planetMastery[cId] || {
        destinationId: cId,
        masteryPercent: 0,
        lessonsCompleted: 0,
        quizzesPassed: 0,
      };

      const updatedMastery: PlanetMastery = {
        ...currentMastery,
        lessonsCompleted: currentMastery.lessonsCompleted + (alreadyCompleted ? 0 : 1),
        masteryPercent: Math.min(100, currentMastery.masteryPercent + (alreadyCompleted ? 0 : 25)),
      };

      // Update discipline mastery if disciplineId provided
      const disc = disciplineId || (cId === 'sun' ? 'sun' : cId === 'milky-way' ? 'milky-way' : 'solar-system');
      const curSubVal = prev.subjectMastery[disc] ?? 20;
      const updatedSubjectMastery = {
        ...prev.subjectMastery,
        [disc]: Math.min(100, curSubVal + (alreadyCompleted ? 0 : 25)),
      };

      // Update daily mission
      const updatedMissions = prev.dailyMissions.map((m) => {
        if (m.id === 'mission-lesson-1') {
          const nextProg = Math.min(m.target, m.progress + 1);
          return { ...m, progress: nextProg, isCompleted: nextProg >= m.target };
        }
        return m;
      });

      const nextState: StudentProgressState = {
        ...prev,
        totalXp: newXp,
        completedLessonIds: newCompleted,
        unlockedAchievementIds: newAchievements,
        planetMastery: {
          ...prev.planetMastery,
          [cId]: updatedMastery,
        },
        subjectMastery: updatedSubjectMastery,
        dailyMissions: updatedMissions,
      };

      saveStudentProgress(nextState);
      return nextState;
    });
  }, []);

  const toggleBookmark = useCallback((lessonId: string) => {
    setState((prev) => {
      const isBookmarked = prev.bookmarkedLessonIds.includes(lessonId);
      const nextBookmarks = isBookmarked
        ? prev.bookmarkedLessonIds.filter((id) => id !== lessonId)
        : [...prev.bookmarkedLessonIds, lessonId];
      const nextState: StudentProgressState = {
        ...prev,
        bookmarkedLessonIds: nextBookmarks,
      };
      saveStudentProgress(nextState);
      return nextState;
    });
  }, []);

  const recordLearningTime = useCallback((additionalMinutes: number) => {
    setState((prev) => {
      const nextState: StudentProgressState = {
        ...prev,
        learningTimeMinutes: (prev.learningTimeMinutes || 0) + additionalMinutes,
      };
      saveStudentProgress(nextState);
      return nextState;
    });
  }, []);

  const recordQuizResult = useCallback(
    (params: {
      category: string;
      questionsCount: number;
      correctCount: number;
      xpEarned: number;
      streak: number;
      isBlitz: boolean;
      destinationId?: string;
      disciplineId?: string;
      achievementIdsToAward?: string[];
    }) => {
      setState((prev) => {
        const isPerfect = params.questionsCount > 0 && params.correctCount === params.questionsCount;
        const newXp = prev.totalXp + params.xpEarned;
        const newAchievements = [...prev.unlockedAchievementIds];

        if (isPerfect && !newAchievements.includes('perfect-orbit')) {
          newAchievements.push('perfect-orbit');
        }
        if (params.isBlitz && !newAchievements.includes('blitz-champion')) {
          newAchievements.push('blitz-champion');
        }
        if (newXp >= 1000 && !newAchievements.includes('grand-astrophysicist')) {
          newAchievements.push('grand-astrophysicist');
        }
        if (params.achievementIdsToAward && params.achievementIdsToAward.length > 0) {
          params.achievementIdsToAward.forEach((id) => {
            if (!newAchievements.includes(id)) {
              newAchievements.push(id);
            }
          });
        }

        // Update missions
        const updatedMissions = prev.dailyMissions.map((m) => {
          if (m.id === 'mission-quiz-3') {
            const nextProg = Math.min(m.target, m.progress + params.correctCount);
            return { ...m, progress: nextProg, isCompleted: nextProg >= m.target };
          }
          return m;
        });

        // Update destination mastery if supplied
        const dest = params.destinationId || (params.category.includes('mars') ? 'mars' : params.category.includes('lunar') ? 'moon' : 'solar-system');
        const currentMastery = prev.planetMastery[dest] || {
          destinationId: dest,
          masteryPercent: 0,
          lessonsCompleted: 0,
          quizzesPassed: 0,
        };

        const updatedMastery: PlanetMastery = {
          ...currentMastery,
          quizzesPassed: currentMastery.quizzesPassed + (params.correctCount > 0 ? 1 : 0),
          masteryPercent: Math.min(100, currentMastery.masteryPercent + Math.round((params.correctCount / Math.max(1, params.questionsCount)) * 30)),
        };

        // Update discipline / subject mastery if available
        const discKey = params.disciplineId || params.category;
        const currentDiscMastery = prev.subjectMastery[discKey] ?? 25;
        const updatedDiscMastery = {
          ...prev.subjectMastery,
          [discKey]: Math.min(100, currentDiscMastery + Math.round((params.correctCount / Math.max(1, params.questionsCount)) * 25)),
        };

        const nextState: StudentProgressState = {
          ...prev,
          totalXp: newXp,
          quizzesTaken: prev.quizzesTaken + 1,
          quizzesWon: prev.quizzesWon + (params.correctCount >= Math.ceil(params.questionsCount / 2) ? 1 : 0),
          correctAnswersCount: prev.correctAnswersCount + params.correctCount,
          totalAnswersCount: prev.totalAnswersCount + params.questionsCount,
          maxStreak: Math.max(prev.maxStreak, params.streak),
          unlockedAchievementIds: newAchievements,
          planetMastery: {
            ...prev.planetMastery,
            [dest]: updatedMastery,
          },
          subjectMastery: updatedDiscMastery,
          dailyMissions: updatedMissions,
        };

        saveStudentProgress(nextState);
        return nextState;
      });
    },
    []
  );

  const unlockAchievement = useCallback((badgeId: string) => {
    setState((prev) => {
      if (prev.unlockedAchievementIds.includes(badgeId)) return prev;
      const nextState: StudentProgressState = {
        ...prev,
        unlockedAchievementIds: [...prev.unlockedAchievementIds, badgeId],
      };
      saveStudentProgress(nextState);
      return nextState;
    });
  }, []);

  const awardXp = useCallback((amount: number) => {
    setState((prev) => {
      const nextState: StudentProgressState = {
        ...prev,
        totalXp: prev.totalXp + amount,
      };
      saveStudentProgress(nextState);
      return nextState;
    });
  }, []);

  return {
    progress: state,
    awardXp,
    completeLesson,
    toggleBookmark,
    recordLearningTime,
    recordQuizResult,
    unlockAchievement,
  };
}
