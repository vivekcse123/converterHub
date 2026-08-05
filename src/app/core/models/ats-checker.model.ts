export type AtsIssueCategory =
  | 'grammar' | 'spelling' | 'weak-verb' | 'duplicate' | 'long-sentence'
  | 'vague' | 'passive-voice' | 'formatting' | 'ats' | 'keywords';

export type AtsSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface AtsIssue {
  id: string;
  category: AtsIssueCategory;
  severity: AtsSeverity;
  quote: string;
  explanation: string;
  suggestion: string;
  scoreImpact: number;
}

export interface AtsSectionScores {
  atsCompatibility: number; formatting: number; grammar: number; spelling: number;
  structure: number; readability: number; keywords: number; achievements: number;
  experience: number; projects: number; skills: number; length: number;
}

export interface AtsSectionMissing { name: string; impact: AtsSeverity; recommendation: string; }

export interface AtsContactInfo {
  email: string; phone: string; linkedin: string; github: string; portfolio: string; issues: string[];
}

export interface AtsAchievementStats {
  quantifiedCount: number; totalBullets: number; strongCount: number; moderateCount: number; weakCount: number;
}

export interface AtsLengthStats {
  wordCount: number; bulletCount: number; pageEstimate: number; readingTimeSec: number;
}

export interface AtsRecruiterSummary {
  verdict: 'ready' | 'borderline' | 'needs-work';
  notes: string;
}

export interface AtsReport {
  _id: string;
  userId?: string;
  fileName?: string;
  resumeText: string;
  overallScore: number;
  sectionScores: AtsSectionScores;
  sectionsDetected: string[];
  sectionsMissing: AtsSectionMissing[];
  contactInfo: AtsContactInfo;
  issues: AtsIssue[];
  achievementStats: AtsAchievementStats;
  lengthStats: AtsLengthStats;
  strengths: string[];
  weaknesses: string[];
  recruiterSummary: AtsRecruiterSummary;
  createdAt: string;
}

export const SECTION_SCORE_LABELS: Record<keyof AtsSectionScores, string> = {
  atsCompatibility: 'ATS Compatibility',
  formatting: 'Formatting',
  grammar: 'Grammar',
  spelling: 'Spelling',
  structure: 'Resume Structure',
  readability: 'Readability',
  keywords: 'Keywords',
  achievements: 'Achievements',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  length: 'Length',
};
