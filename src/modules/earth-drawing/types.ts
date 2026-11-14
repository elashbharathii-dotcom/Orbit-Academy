export type ColoringCategoryId =
  | 'solar-system'
  | 'earth-features'
  | 'moon-exploration'
  | 'astronauts-space-travel'
  | 'galaxies-nebulae'
  | 'rockets-satellites'
  | 'mars-alien-worlds'
  | 'stars-mysteries';

export interface ColoringCategory {
  id: ColoringCategoryId;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  accentColor: string;
  badgeTone: 'cyan' | 'amber' | 'emerald' | 'violet';
  thumbnailUrl?: string;
  itemCount: number;
}

export type DifficultyLevel = 'Easy' | 'Medium' | 'Explorer';

export interface ColorSuggestion {
  number: number;
  name: string;
  hex: string;
  targetDescription: string;
}

export interface SvgColorRegion {
  id: string;
  path: string;
  name?: string;
  defaultFill?: string;
  suggestedNumber?: number;
  suggestedColor?: string;
  suggestedColorName?: string;
  centerPoint?: { x: number; y: number };
}

export interface ColoringArtwork {
  id: string;
  title: string;
  category: ColoringCategoryId;
  difficulty: DifficultyLevel;
  description: string;
  educationalFact: string;
  additionalFact?: string;
  learningTopic: string;
  viewBox: string;
  regions: SvgColorRegion[];
  underlaySvg?: string;
  overlaySvg?: string;
  recommendedPalette?: string[];
  colorSuggestions?: ColorSuggestion[];
  thumbnailSvg?: string;
}

export interface ColorDefinition {
  name: string;
  hex: string;
}

export interface ColoringHistoryStep {
  regionId: string;
  previousColor: string;
  newColor: string;
}

export interface ArtworkProgress {
  artworkId: string;
  coloredRegionsCount: number;
  totalRegionsCount: number;
  lastUpdated: number;
  isComplete: boolean;
}
