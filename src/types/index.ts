export type RoomType =
  | 'Auto-Detect'
  | 'Home Office'
  | 'Living Room'
  | 'Bedroom'
  | 'Closet & Wardrobe'
  | 'Kitchen & Pantry'
  | 'Garage & Workshop'
  | 'Bathroom'
  | 'Kids Playroom'
  | 'Entryway & Mudroom';

export type GeminiModelChoice =
  | 'gemini-3.1-pro-preview'
  | 'gemini-3.5-flash'
  | 'gemini-3.1-flash-lite';

export type CoachRole =
  | 'master_organizer'
  | 'konmari'
  | 'swedish_death'
  | 'speed_organizer';

export interface RoomMetrics {
  surfaceClutter: number; // 1-10
  storageUtilization: number; // 1-10
  floorPathways: number; // 1-10
  visualCalmIndex: number; // 1-10
}

export interface IdentifiedZone {
  id: string;
  name: string;
  status: 'Critical Attention' | 'Needs Tweaking' | 'Well Organized';
  observation: string;
  actionRequired: string;
}

export interface ItemTriageGroup {
  category: 'Keep & Relocate' | 'Donate / Gift' | 'Sell / Consign' | 'Recycle / Trash';
  itemNames: string[];
  rationale: string;
  suggestedDestination: string;
}

export interface ActionTask {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  tips?: string;
  completed?: boolean;
}

export interface ActionPhase {
  phase: string;
  estimatedMinutes: number;
  tasks: ActionTask[];
}

export interface StorageSolution {
  title: string;
  targetZone: string;
  purpose: string;
  budgetLevel: '$' | '$$' | '$$$';
  diyAlternative: string;
}

export interface RoomAnalysisResult {
  roomType: string;
  overallScore: number; // 1-100
  clutterLevel: 'Minimal' | 'Moderate' | 'Substantial' | 'Severe';
  executiveSummary: string;
  metrics: RoomMetrics;
  identifiedZones: IdentifiedZone[];
  itemTriage: ItemTriageGroup[];
  actionPlan: ActionPhase[];
  storageSolutions: StorageSolution[];
  spatialLayoutTips: string[];
  motivationalQuote: string;
  modelUsed?: string;
}

export interface RoomSession {
  id: string;
  title: string;
  createdAt: string;
  imageUrl: string;
  roomType: string;
  analysis: RoomAnalysisResult;
  completedTaskIds: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
}
