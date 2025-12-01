

export type ViewState = 'certification' | 'pathway2' | 'armory' | 'my-squad' | 'profile' | 'tactical' | 'quiz-builder' | 'play' | 'overwatch' | 'video-inbox' | 'leaderboards' | 'broadcast' | 'bobby-bank';

export interface DrillMistake {
  mistake: string;
  correction: string;
}

export interface DrillVariations {
  regression: string;
  progression: string;
  nextDrillId?: string;
}

export interface DrillAssessment {
  checkpoints: string[];
  readyToProgress: string;
}

export interface DrillContext {
  season: string;
  placement: string;
  gameSituations: string[];
}

export interface Drill {
  id: string;
  title: string;
  category: 'Hitting' | 'Pitching' | 'Catching' | 'Infield' | 'Outfield' | 'Base-running' | 'Mental Game' | 'Baseball IQ';
  subcategory?: string;
  difficulty: 'Recruit' | 'Veteran' | 'Elite';
  duration: string;
  thumbnail: string;
  completed: boolean;
  description?: string;
  steps?: string[];
  coachingPoints?: string[];
  
  // New Educational Fields
  whyItMatters?: string;
  commonMistakes?: DrillMistake[];
  variations?: DrillVariations;
  assessment?: DrillAssessment;
  context?: DrillContext;
}

export interface DrillAssignment {
  id: string;
  drillId: string;
  assignedDate: number;
  status: 'Pending' | 'Completed';
}

export interface CertModule {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'active' | 'completed';
  xpReward: number;
  iconType: 'book' | 'video' | 'quiz' | 'trophy';
}

export interface FeedbackSubmission {
  rating: 'positive' | 'negative';
  comment?: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  feedback?: FeedbackSubmission;
}

export interface TacticalSession {
  id: string;
  title: string;
  timestamp: number;
  messages: ChatMessage[];
  preview: string;
}

export interface FeedbackEvent {
  id: string;
  sessionId: string;
  userPrompt: string;
  modelResponse: string;
  rating: 'positive' | 'negative';
  comment?: string;
  timestamp: number;
  status: 'new' | 'archived' | 'starred';
}

// --- NEW VIDEO ANALYSIS TYPES ---

export interface Annotation {
  id: string;
  type: 'line' | 'arrow' | 'circle';
  color: string;
  points: { x: number; y: number }[];
  timestamp: number; // Video timestamp when drawn
}

export interface VideoSubmission {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  date: string;
  status: 'New' | 'Reviewed';
  drillId?: string;
}

export interface SquadMember {
  id: string;
  name: string;
  number: string;
  role: string;
  secondaryRole?: string;
  status: 'Active' | 'Rest' | 'Injured';
  readiness: number; // 0-100, General Readiness
  
  avatar: string; // Initials fallback
  avatarUrl?: string; // Profile Picture URL
  coverUrl?: string; // Cover Photo URL
  
  height: string;
  weight: string;
  bats: 'R' | 'L' | 'S';
  throws: 'R' | 'L';
  age: number;
  stats: {
    label: string;
    value: string;
  }[];
  attributes: {
    name: string;
    value: number;
  }[];
  bio: string;
  assignments: DrillAssignment[];
  videos?: VideoSubmission[]; // New field
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; 
}

export interface CustomQuiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  status: 'Draft' | 'Active' | 'Archived';
  scheduledDate?: string;
  linkedToCert: boolean;
  assignedCount: number;
}

export interface LeagueParticipant {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  isCurrentUser: boolean;
  trend: 'up' | 'down' | 'same';
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: 'Coach' | 'Athlete';
  content: string;
  timestamp: string;
  drillId?: string; // Optional link to a drill
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  xpEarned?: number; // Gamification for the author
}

export interface SavedCollection {
  id: string;
  title: string;
  color: string; // Hex or tailwind class reference
  postIds: string[];
}

// --- BOBBY BANK TYPES ---

export type TransactionType = 'EARN' | 'SPEND' | 'PENDING';
export type TransactionCategory = 'Drill' | 'Streak' | 'Challenge' | 'Shop' | 'Lesson' | 'Social' | 'Bonus';

export interface BobbyTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
}

export interface BobbyBankState {
  balance: number;
  pending: number;
  lifetimeEarned: number;
  transactions: BobbyTransaction[];
}