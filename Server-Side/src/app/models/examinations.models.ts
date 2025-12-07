export interface SectionQuestion {
  id: number;
  text: string;
  points: number;
}

export interface QuestionAnswer {
  questionId: number;
  answer: boolean; // true = YES, false = NO
}

export interface Section {
  id: string;
  name: string;
  displayName: string;
  icon: string; // Emoji icon for the section
  questions: SectionQuestion[];
  maxPoints: number;
}

export interface SectionResult {
  sectionId: string;
  sectionName: string;
  score: number;
  maxPoints: number;
  normalizedScore: number;
  result: 'Good' | 'Needs Exercises' | 'See Doctor';
}

export interface WeeklyCheck {
  id: string;
  date: Date;
  selectedSections: string[];
  answers: { [sectionId: string]: QuestionAnswer[] };
  sectionResults: SectionResult[];
  totalScore: number;
  overallResult: string;
}
