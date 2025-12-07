import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, firstValueFrom } from 'rxjs';
import {
  Section,
  SectionQuestion,
  WeeklyCheck,
  SectionResult,
  QuestionAnswer,
} from '../models/examinations.models';

@Injectable({
  providedIn: 'root',
})
export class MentalService {
  private readonly STORAGE_KEY = 'mental_check_history';
  private readonly DATA_PATH = 'data/mental/examination-sections.json';
  private sections: Section[] = [];
  private dataUpdated = new Subject<void>();
  private dataLoaded = false;

  // Observable that components can subscribe to for updates
  dataUpdated$ = this.dataUpdated.asObservable();

  constructor(private http: HttpClient) {
    this.loadSectionsFromJSON();
  }

  /**
   * Load examination sections from JSON file (simulating API call)
   */
  private async loadSectionsFromJSON(): Promise<void> {
    try {
      this.sections = await firstValueFrom(
        this.http.get<Section[]>(this.DATA_PATH)
      );
      this.dataLoaded = true;
      console.log('✅ Mental sections loaded from JSON:', this.sections.length);
    } catch (error) {
      console.error('❌ Error loading mental sections from JSON:', error);
      // Fallback to empty array if file not found
      this.sections = [];
      this.dataLoaded = true;
    }
  }

  /**
   * Get all sections (async to ensure data is loaded)
   */
  async getAllSections(): Promise<Section[]> {
    // Wait for data to load if not yet loaded
    if (!this.dataLoaded) {
      await this.loadSectionsFromJSON();
    }
    return this.sections;
  }

  /**
   * Get all sections synchronously (for backward compatibility)
   * Note: May return empty array if data hasn't loaded yet
   */
  getAllSectionsSync(): Section[] {
    return this.sections;
  }

  getSectionById(sectionId: string): Section | undefined {
    return this.sections.find((s) => s.id === sectionId);
  }

  calculateSectionScore(sectionId: string, answers: QuestionAnswer[]): SectionResult | null {
    const section = this.getSectionById(sectionId);
    if (!section) return null;

    let score = 0;
    answers.forEach((answer) => {
      if (answer.answer) {
        // YES = true
        const question = section.questions.find((q) => q.id === answer.questionId);
        if (question) {
          score += question.points;
        }
      }
    });

    const normalizedScore = (1 - score / section.maxPoints) * 100;
    let result: 'Good' | 'Needs Exercises' | 'See Doctor';

    if (normalizedScore >= 80) {
      result = 'Good';
    } else if (normalizedScore >= 60) {
      result = 'Needs Exercises';
    } else {
      result = 'See Doctor';
    }

    return {
      sectionId: section.id,
      sectionName: section.displayName,
      score,
      maxPoints: section.maxPoints,
      normalizedScore: Math.round(normalizedScore * 100) / 100,
      result,
    };
  }

  calculateTotalScore(sectionResults: SectionResult[]): number {
    if (sectionResults.length === 0) return 0;
    const sum = sectionResults.reduce((acc, sr) => acc + sr.normalizedScore, 0);
    return Math.round((sum / sectionResults.length) * 100) / 100;
  }

  getOverallResult(totalScore: number): string {
    if (totalScore >= 80) {
      return 'Excellent! Your mental health is in good condition.';
    } else if (totalScore >= 60) {
      return 'Good, but some areas need attention. Consider mindfulness or stress management exercises.';
    } else {
      return 'Please consider consulting a mental health professional for support.';
    }
  }

  saveWeeklyCheck(weeklyCheck: WeeklyCheck): void {
    const history = this.getHistory();
    history.push(weeklyCheck);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    this.dataUpdated.next(); // Notify subscribers of data change
  }

  getHistory(): WeeklyCheck[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];

    const history = JSON.parse(data);
    // Convert date strings back to Date objects
    return history.map((check: any) => ({
      ...check,
      date: new Date(check.date),
    }));
  }

  deleteWeeklyCheck(id: string): void {
    const history = this.getHistory().filter((check) => check.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    this.dataUpdated.next(); // Notify subscribers of data change
  }

  clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.dataUpdated.next(); // Notify subscribers of data change
  }
}
