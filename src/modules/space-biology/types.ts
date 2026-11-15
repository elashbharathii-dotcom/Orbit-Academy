export type BioModelId =
  | 'human_cell'
  | 'dna_helix'
  | 'rna_molecule'
  | 'protein_structure'
  | 'plant_cell'
  | 'microorganism'
  | 'bone_tissue'
  | 'muscle_sarcomere';

export interface BioStructureDef {
  id: BioModelId;
  name: string;
  category: 'cellular' | 'molecular' | 'tissue' | 'organism';
  modelType: 'conceptual' | 'dataset_derived';
  scientificName: string;
  scaleDescription: string;
  summary: string;
  spaceflightRelevance: string;
  organelles: {
    id: string;
    name: string;
    color: string;
    position: [number, number, number];
    description: string;
    spaceflightImpact: string;
  }[];
  nasaStudyRef?: string;
}

export type SpaceflightTopicId =
  | 'microgravity_fluids'
  | 'radiation_dna'
  | 'muscle_atrophy'
  | 'bone_osteopenia'
  | 'immune_dysregulation'
  | 'plant_growth'
  | 'microbial_biofilms'
  | 'mars_countermeasures';

export interface SpaceflightTopicDef {
  id: SpaceflightTopicId;
  title: string;
  system: string;
  badge: string;
  iconName: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  summary: string;
  physiologicalMechanism: string;
  cellularPathway: string;
  clinicalImplication: string;
  countermeasures: string[];
  osdrStudy: {
    accession: string;
    title: string;
    organism: string;
    mission: string;
    platform: string;
    summaryFindings: string;
    authoritativeUrl: string;
  };
  keyGenes: string[];
}

export interface BiomarkerGeneData {
  symbol: string;
  name: string;
  pathway: string;
  flightExpression: number; // Fold change or normalized TPM relative to ground
  groundControlExpression: number; // Normalized baseline = 1.0
  centrifugeControlExpression: number; // 1g on ISS control
  pVal: number;
  significance: 'significant' | 'trending' | 'nominal';
  direction: 'up' | 'down';
  description: string;
  studyAccession: string;
}

export interface HeatmapSample {
  sampleId: string;
  condition: 'Ground Control' | 'Spaceflight (uG)' | 'Centrifuge (ISS 1G)';
  replicate: number;
  missionDurationDays: number;
  values: Record<string, number>; // gene symbol -> z-score (-2.5 to +2.5)
}

export interface CountermeasureLabState {
  // Bone & Muscle simulation
  missionMonths: number;
  aredHoursPerDay: number;
  dietaryCalciumMg: number;

  // Radiation simulation
  shieldingMaterial: 'aluminum' | 'polyethylene' | 'water_wall' | 'lunar_regolith';
  shieldingThicknessGcm2: number;
  solarActivity: 'solar_minimum' | 'solar_maximum' | 'solar_particle_event';

  // Plant simulation
  gravityG: number; // 0, 0.16 (moon), 0.38 (mars), 1.0 (earth)
  redBlueRatio: number; // 1 to 5
  photoperiodHours: number; // 12 to 24
}

export type LabTabId =
  | 'dashboard'
  | 'visualizer_3d'
  | 'spaceflight_biology'
  | 'multiomics_data'
  | 'countermeasure_lab'
  | 'laura_assistant';
