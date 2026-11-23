export type CategoryId = 'eat' | 'watch' | 'weekend';

export type BudgetLevel = '€' | '€€' | '€€€';
export type FatigueLevel = 'canape' | 'moyen' | 'motive';
export type AmbianceType = 'chill' | 'drole' | 'decouverte' | 'insolite';
export type PlayMode = 'same-phone' | 'whatsapp-link';

export interface IdeaCard {
  id: string;
  category: CategoryId;
  title: string;
  subtitle: string;
  description: string;
  budget: BudgetLevel;
  fatigue: FatigueLevel[];
  ambiance: AmbianceType[];
  durationOrPrep: string;
  practicalTip: string;
  keywords: string[];
  emoji: string;
  isAiGenerated?: boolean;
}

export interface ConstraintsState {
  category: CategoryId;
  budget: BudgetLevel;
  fatigue: FatigueLevel;
  ambiance: AmbianceType;
  customNote: string;
  playMode: PlayMode;
  player1Name: string;
  player2Name: string;
  useAiGeneration: boolean;
}

export interface SharedSessionPayload {
  v: number;
  c: CategoryId;
  b: BudgetLevel;
  f: FatigueLevel;
  a: AmbianceType;
  n: string;
  p1: string;
  p2: string;
  cards: IdeaCard[];
  p1Likes: string[]; // IDs of cards liked by Player 1
}

export interface ValidatedChoice {
  category: CategoryId;
  card: IdeaCard;
  validatedAt: string;
  method: 'match-direct' | 'roue-secours' | 'coup-de-coeur';
}
