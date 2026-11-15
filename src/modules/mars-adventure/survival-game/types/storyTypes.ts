/**
 * Story & Campaign Types for Mars: Last Frontier (Phase 11)
 * Chapters, Narrative Dialogues, Audio Logs, Journal Records, Player Choices, and Multiple Endings.
 */

export type ChapterId = 1 | 2 | 3 | 4 | 5 | 6;

export interface ChapterObjective {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  relatedMissionId?: string;
  relatedFacilityId?: string;
}

export interface ChapterDefinition {
  id: ChapterId;
  title: string;
  subtitle: string;
  solEstimate: string;
  overview: string;
  briefingAudioLogId?: string;
  objectives: ChapterObjective[];
  unlockedOnChapter?: ChapterId;
}

export type DialogueSpeaker =
  | 'ARES-OS (Suit AI)'
  | 'Mission Control (Houston)'
  | 'Dr. Elena Vance (Expedition Lead)'
  | 'Chief Engineer Chen'
  | 'Commander Reyes'
  | 'Autonomous Base Core';

export interface DialogueNode {
  id: string;
  speaker: DialogueSpeaker;
  text: string;
  audioTone?: 'comm_beep' | 'urgent_alarm' | 'whisper' | 'data_chime';
  triggerEvent?: string;
  speakerTitle?: string;
  nextDialogueId?: string;
  choiceId?: string; // Links to player choice if branching
}

export type JournalCategory =
  | 'campaign'
  | 'audio_log'
  | 'transmission'
  | 'discovery'
  | 'decision';

export interface JournalEntry {
  id: string;
  title: string;
  category: JournalCategory;
  solDate: string;
  author: string;
  preview: string;
  content: string;
  unlocked: boolean;
  coordinates?: [number, number, number];
  relatedMissionId?: string;
}

export interface PlayerChoiceOption {
  id: string;
  label: string;
  description: string;
  consequencesSummary: string;
  bonusReward?: string;
  endingBias: 'pioneer' | 'scientist' | 'explorer' | 'survivor';
}

export interface PlayerChoice {
  id: string;
  chapterId: ChapterId;
  title: string;
  premise: string;
  options: [PlayerChoiceOption, PlayerChoiceOption];
  selectedOptionId?: string;
  decisionTimestamp?: string;
}

export type CampaignEndingId = 'ending_pioneer' | 'ending_scientist' | 'ending_explorer' | 'ending_survivor';

export interface CampaignEndingDefinition {
  id: CampaignEndingId;
  code: 'ENDING A' | 'ENDING B' | 'ENDING C' | 'ENDING D';
  title: string;
  badge: string;
  prerequisitesDescription: string;
  epilogueText: string;
  futureOfMars: string;
  accentColor: string;
}
