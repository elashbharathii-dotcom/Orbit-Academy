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

// ============================================================================
// COSMIC CREATIVE STUDIO TYPES (NUDGE-INSPIRED DRAWING WORKSPACE)
// ============================================================================

export type StudioTool =
  | 'pencil'
  | 'brush'
  | 'eraser'
  | 'line'
  | 'rect'
  | 'circle'
  | 'polygon'
  | 'fill'
  | 'text'
  | 'select'
  | 'pan';

export type StrokeStyle = 'solid' | 'dashed' | 'pixel' | 'glow';

export type StudioBlendMode = 'source-over' | 'multiply' | 'screen' | 'overlay';

export type CanvasDimensionPreset = 'square' | 'widescreen' | 'standard' | 'portrait';

export interface CanvasDimensions {
  preset: CanvasDimensionPreset;
  width: number;
  height: number;
  label: string;
}

export type CanvasGridType = 'none' | 'pixel' | 'space-grid';

export type CanvasBackdropType = 'ivory' | 'white' | 'transparent';

export interface StudioLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number; // 0 to 1
  canvas?: HTMLCanvasElement;
}

export interface LayerSnapshot {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  dataUrl: string;
}

export interface StudioHistoryStep {
  type: 'layer-draw' | 'layer-add' | 'layer-delete' | 'layer-reorder' | 'clear';
  layerId?: string;
  beforeSnapshot?: string; // dataUrl of canvas before action
  afterSnapshot?: string;  // dataUrl of canvas after action
  layersState?: LayerSnapshot[];
}

export interface SavedStudioProject {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  thumbnailDataUrl: string;
  width: number;
  height: number;
  layers: LayerSnapshot[];
  templateId?: string;
}

export type StudioActiveView = 'studio' | 'templates' | 'gallery' | 'plate-coloring';

export interface CosmoQuote {
  id: string;
  text: string;
  category: 'tip' | 'fact' | 'encouragement';
  relatedTool?: StudioTool;
}

