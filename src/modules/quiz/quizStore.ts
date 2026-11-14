/**
 * ORBIT ACADEMY — Quiz Arena State & Persistence Store
 * Manages XP scoring, 5-tier player levels, and local leaderboard storage.
 */

export interface PlayerLevel {
  level: number;
  name: string;
  minXp: number;
  nextLevelXp: number | null; // null if max level (Cosmic Legend)
  badgeTone: 'cyan' | 'emerald' | 'amber' | 'violet';
  accentColor: string;
  badgeTitle: string;
}

export const PLAYER_LEVELS: PlayerLevel[] = [
  { level: 1, name: 'Space Cadet', minXp: 0, nextLevelXp: 500, badgeTone: 'cyan', accentColor: '#38BDF8', badgeTitle: 'LVL 1' },
  { level: 2, name: 'Moon Explorer', minXp: 500, nextLevelXp: 1200, badgeTone: 'emerald', accentColor: '#34D399', badgeTitle: 'LVL 2' },
  { level: 3, name: 'Planet Ranger', minXp: 1200, nextLevelXp: 2500, badgeTone: 'amber', accentColor: '#FBBF24', badgeTitle: 'LVL 3' },
  { level: 4, name: 'Galaxy Guardian', minXp: 2500, nextLevelXp: 5000, badgeTone: 'violet', accentColor: '#A78BFA', badgeTitle: 'LVL 4' },
  { level: 5, name: 'Cosmic Legend', minXp: 5000, nextLevelXp: null, badgeTone: 'amber', accentColor: '#F472B6', badgeTitle: 'LVL 5' },
];

export interface PlayerProfile {
  name: string;
  totalXp: number;
  completedQuizzes: number;
  totalCorrect: number;
  totalQuestionsAnswered: number;
  bestStreak: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  totalXp: number;
  completedQuizzes: number;
  level: number;
  levelName: string;
  isCurrentPlayer?: boolean;
}

export interface QuizRewardBreakdown {
  attemptId: string;
  correctAnswers: number;
  correctAnswersXp: number;
  completionBonusXp: number;
  perfectBonusXp: number;
  totalEarnedXp: number;
  previousTotalXp: number;
  newTotalXp: number;
  previousLevel: PlayerLevel;
  newLevel: PlayerLevel;
  didLevelUp: boolean;
}

const STORAGE_KEYS = {
  PROFILE: 'orbit_academy_player_profile',
  LEADERBOARD: 'orbit_academy_leaderboard',
  PROCESSED_ATTEMPTS: 'orbit_academy_processed_attempts',
};

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Cadet Explorer',
  totalXp: 0,
  completedQuizzes: 0,
  totalCorrect: 0,
  totalQuestionsAnswered: 0,
  bestStreak: 0,
};

// Realistic mock academy peer cadets for the competition
const INITIAL_ACADEMY_CADETS: Omit<LeaderboardEntry, 'level' | 'levelName'>[] = [
  { id: 'cadet-1', name: 'Commander Nova', totalXp: 3400, completedQuizzes: 12 },
  { id: 'cadet-2', name: 'Aria Solis', totalXp: 2750, completedQuizzes: 9 },
  { id: 'cadet-3', name: 'Marcus Vance', totalXp: 1950, completedQuizzes: 7 },
  { id: 'cadet-4', name: 'Kiran Patel', totalXp: 950, completedQuizzes: 4 },
  { id: 'cadet-5', name: 'Zackary Ray', totalXp: 400, completedQuizzes: 2 },
];

/**
 * Returns player level metadata based on total XP
 */
export function getPlayerLevel(xp: number): PlayerLevel {
  const safeXp = Math.max(0, xp);
  for (let i = PLAYER_LEVELS.length - 1; i >= 0; i--) {
    if (safeXp >= PLAYER_LEVELS[i].minXp) {
      return PLAYER_LEVELS[i];
    }
  }
  return PLAYER_LEVELS[0];
}

/**
 * Calculates current XP progress toward the next level (percentage and numbers)
 */
export function getLevelProgress(xp: number): {
  percent: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  remainingXp: number;
} {
  const currentLvl = getPlayerLevel(xp);
  if (currentLvl.nextLevelXp === null) {
    // Max level reached (Cosmic Legend)
    return {
      percent: 100,
      currentLevelXp: xp - currentLvl.minXp,
      xpForNextLevel: 0,
      remainingXp: 0,
    };
  }

  const span = currentLvl.nextLevelXp - currentLvl.minXp;
  const progressInLevel = Math.max(0, xp - currentLvl.minXp);
  const percent = Math.min(100, Math.round((progressInLevel / span) * 100));
  const remainingXp = Math.max(0, currentLvl.nextLevelXp - xp);

  return {
    percent,
    currentLevelXp: progressInLevel,
    xpForNextLevel: span,
    remainingXp,
  };
}

/**
 * Safe local storage reader
 */
function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`[Orbit Academy Store] Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

/**
 * Safe local storage writer
 */
function writeStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[Orbit Academy Store] Error writing ${key} to localStorage`, e);
  }
}

/**
 * Loads current player profile from localStorage
 */
export function loadPlayerProfile(): PlayerProfile {
  const profile = readStorage<PlayerProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  return {
    ...DEFAULT_PROFILE,
    ...profile,
    name: profile.name?.trim() || DEFAULT_PROFILE.name,
    totalXp: Math.max(0, profile.totalXp || 0),
  };
}

/**
 * Saves player profile to localStorage
 */
export function savePlayerProfile(profile: PlayerProfile): void {
  writeStorage(STORAGE_KEYS.PROFILE, profile);
}

/**
 * Updates player name and re-synchronizes the leaderboard
 */
export function updatePlayerName(newName: string): PlayerProfile {
  const profile = loadPlayerProfile();
  const sanitized = newName.trim().slice(0, 24) || DEFAULT_PROFILE.name;
  profile.name = sanitized;
  savePlayerProfile(profile);
  syncLeaderboardWithPlayer(profile);
  return profile;
}

/**
 * Loads leaderboard sorted by total XP descending, including current player
 */
export function loadLeaderboard(): LeaderboardEntry[] {
  const profile = loadPlayerProfile();
  const peers = readStorage<Omit<LeaderboardEntry, 'level' | 'levelName'>[]>(
    STORAGE_KEYS.LEADERBOARD,
    INITIAL_ACADEMY_CADETS
  );

  // Combine peers and current player
  const combined: LeaderboardEntry[] = peers.map((p) => {
    const lvl = getPlayerLevel(p.totalXp);
    return {
      ...p,
      level: lvl.level,
      levelName: lvl.name,
      isCurrentPlayer: false,
    };
  });

  const playerLvl = getPlayerLevel(profile.totalXp);
  combined.push({
    id: 'player-current',
    name: profile.name,
    totalXp: profile.totalXp,
    completedQuizzes: profile.completedQuizzes,
    level: playerLvl.level,
    levelName: playerLvl.name,
    isCurrentPlayer: true,
  });

  // Sort descending by total XP, then by completed quizzes
  combined.sort((a, b) => b.totalXp - a.totalXp || b.completedQuizzes - a.completedQuizzes);

  return combined;
}

/**
 * Keeps peers list stored and ensures current player is synced
 */
export function syncLeaderboardWithPlayer(_profile: PlayerProfile): LeaderboardEntry[] {
  let peers = readStorage<Omit<LeaderboardEntry, 'level' | 'levelName'>[]>(
    STORAGE_KEYS.LEADERBOARD,
    INITIAL_ACADEMY_CADETS
  );

  // Ensure peers don't contain current player id
  peers = peers.filter((p) => p.id !== 'player-current');
  writeStorage(STORAGE_KEYS.LEADERBOARD, peers);

  return loadLeaderboard();
}

/**
 * Awards XP for a completed quiz attempt and updates player profile & leaderboard.
 * Strictly prevents duplicate awards for the same attemptId.
 */
export function awardQuizAttempt(params: {
  attemptId: string;
  score: number;
  totalQuestions: number;
  maxStreak?: number;
}): QuizRewardBreakdown | null {
  const { attemptId, score, totalQuestions } = params;

  if (!attemptId) return null;

  // Prevent duplicate awards
  const processed = readStorage<string[]>(STORAGE_KEYS.PROCESSED_ATTEMPTS, []);
  if (processed.includes(attemptId)) {
    // Already awarded
    return null;
  }

  // Scoring rules:
  // - Each correct answer: +100 XP
  // - Completing a quiz: +50 XP
  // - Getting all answers correct: +200 bonus XP
  const correctAnswersXp = score * 100;
  const completionBonusXp = totalQuestions > 0 ? 50 : 0;
  const isAllCorrect = score === totalQuestions && totalQuestions > 0;
  const perfectBonusXp = isAllCorrect ? 200 : 0;

  const totalEarnedXp = correctAnswersXp + completionBonusXp + perfectBonusXp;

  const profile = loadPlayerProfile();
  const previousTotalXp = profile.totalXp;
  const previousLevel = getPlayerLevel(previousTotalXp);

  const newTotalXp = previousTotalXp + totalEarnedXp;
  const newLevel = getPlayerLevel(newTotalXp);
  const didLevelUp = newLevel.level > previousLevel.level;

  // Update profile
  profile.totalXp = newTotalXp;
  profile.completedQuizzes += 1;
  profile.totalCorrect += score;
  profile.totalQuestionsAnswered += totalQuestions;
  if (params.maxStreak && params.maxStreak > profile.bestStreak) {
    profile.bestStreak = params.maxStreak;
  }

  savePlayerProfile(profile);
  syncLeaderboardWithPlayer(profile);

  // Mark attempt as processed
  processed.push(attemptId);
  writeStorage(STORAGE_KEYS.PROCESSED_ATTEMPTS, processed.slice(-50)); // keep last 50

  return {
    attemptId,
    correctAnswers: score,
    correctAnswersXp,
    completionBonusXp,
    perfectBonusXp,
    totalEarnedXp,
    previousTotalXp,
    newTotalXp,
    previousLevel,
    newLevel,
    didLevelUp,
  };
}
