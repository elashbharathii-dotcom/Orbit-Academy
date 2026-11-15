/**
 * ORBIT ACADEMY — NASA SCIENCE QUIZ ARENA TYPES
 * Stage 08 Educational Gamification & Scientific Assessment Engine
 */

export type QuizCategory =
  | 'astronomy'
  | 'solar-system'
  | 'planetary-geology'
  | 'spacecraft-missions'
  | 'mars-exploration'
  | 'lunar-science'
  | 'space-biology'
  | 'human-spaceflight'
  | 'climate-science'
  | 'space-weather'
  | 'astrophysics'
  // Backward-compatibility aliases
  | 'space-missions'
  | 'earth-climate'
  | 'advanced-planetary';

export type QuizQuestionType =
  | 'multiple-choice'
  | 'image-id'
  | 'planet-id'
  | 'geological-id'
  | 'map-id'
  | 'matching'
  | 'true-false'
  | 'ordering'
  | 'mission-scenario'
  | 'data-interpretation';

export type DifficultyTier = 'Cadet' | 'Commander' | 'Astrophysicist';

export interface MatchingPair {
  id: string;
  leftText: string;
  rightText: string;
  leftIcon?: string;
  rightDetail?: string;
}

export interface OrderingItem {
  id: string;
  label: string;
  detail?: string;
  correctOrder: number;
}

export interface MapTargetZone {
  id: string;
  name: string;
  lat: number;
  lon: number;
  description: string;
  isCorrect: boolean;
}

export interface ScientificDataPoint {
  label: string;
  value: number;
  expectedValue?: number;
  unit: string;
  category?: string;
  annotation?: string;
}

export interface ScientificChartData {
  chartType: 'bar' | 'line' | 'transit-dip' | 'scatter';
  xAxisLabel: string;
  yAxisLabel: string;
  title: string;
  points: ScientificDataPoint[];
  threshold?: number;
  thresholdLabel?: string;
}

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  difficulty: DifficultyTier;
  type: QuizQuestionType;
  question: string;
  subtitle?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
  source: string;
  sourceUrl?: string;
  topic: string;
  relatedLessonId?: string;
  destinationId?: string;

  // Format Specific Payloads
  imageUrl?: string;
  imageCaption?: string;
  imageSensor?: string;

  // Planet / Geological Visual Attributes
  targetCelestialId?: string;
  geologicalFeatureName?: string;
  geologicalClassification?: string;

  // Map Coordinates & Target Zones
  mapTargetBody?: 'mars' | 'moon' | 'earth' | 'mercury';
  mapTargetZones?: MapTargetZone[];
  mapPinpointTarget?: { lat: number; lon: number; toleranceDeg: number; featureName: string };

  // Matching Challenge
  matchingPairs?: MatchingPair[];

  // Ordering Challenge
  orderingItems?: OrderingItem[];

  // Mission Scenario
  missionDirective?: string;
  missionTelemetry?: {
    spacecraft: string;
    velocityKmS: string;
    distanceKm: string;
    subsystemAlert?: string;
  };

  // Scientific Data Interpretation
  chartData?: ScientificChartData;
}

export interface QuestionSubmissionResult {
  question: QuizQuestion;
  selectedOption: number | null;
  matchingSelections?: Record<string, string>; // leftId -> rightId
  orderedItemIds?: string[];
  selectedMapZoneId?: string;
  isCorrect: boolean;
  xpEarned: number;
  secondsElapsed: number;
}

export interface DailyChallengeQuest {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  progress?: number;
  target?: number;
  category?: QuizCategory;
  xpReward: number;
  isCompleted: boolean;
  icon: string;
}

export interface CadetFlightRank {
  rankLevel: number;
  rankTitle: string;
  title?: string;
  callsign?: string;
  description?: string;
  badgeCode: string;
  minXp: number;
  insigniaTone: 'cyan' | 'amber' | 'emerald' | 'violet' | 'rose';
  authorityScope: string;
}

export type ArenaGameMode = 'tournament' | 'blitz' | 'scenarios' | 'analytics';
