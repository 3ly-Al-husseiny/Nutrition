import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  photo: string;
  email: string;
  password: string;
  weight: number; // in kg
  height: number; // in cm
}

export interface UserStats {
  points: number;
  badges: string[];
  completedChallenges: number;
  activeChallenges: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private readonly STORAGE_KEY = 'userProfile';
  private readonly CHALLENGES_STORAGE_KEY = 'challengesDetoxData';
  
  private defaultProfile: UserProfile = {
    name: 'John Doe',
    age: 25,
    gender: 'male',
    photo: 'https://ui-avatars.com/api/?name=John+Doe&size=200&background=2d5f3f&color=e8f5e9&bold=true',
    email: 'john@example.com',
    password: 'password123',
    weight: 70,
    height: 175
  };

  private profileSubject: BehaviorSubject<UserProfile>;
  public profile$: Observable<UserProfile>;

  constructor() {
    const savedProfile = this.loadFromStorage();
    this.profileSubject = new BehaviorSubject<UserProfile>(savedProfile || this.defaultProfile);
    this.profile$ = this.profileSubject.asObservable();
  }

  getProfile(): UserProfile {
    return this.profileSubject.value;
  }

  updateProfile(profile: UserProfile): void {
    this.profileSubject.next(profile);
    this.saveToStorage(profile);
  }

  /**
   * Get user stats from challenges (points, badges, completed challenges)
   */
  getUserStats(): UserStats {
    try {
      const challengesData = localStorage.getItem(this.CHALLENGES_STORAGE_KEY);
      console.log('🔍 Reading challengesData from localStorage:', challengesData ? 'Found' : 'Not found');
      
      if (challengesData) {
        const data = JSON.parse(challengesData);
        const challenges = data.challenges || [];
        const completedCount = challenges.filter((c: any) => 
          c.progress && c.progress.every((day: boolean) => day === true)
        ).length;

        const stats = {
          points: data.user?.points || 0,
          badges: data.user?.badges || [],
          completedChallenges: completedCount,
          activeChallenges: challenges.length
        };
        console.log('📈 Stats from localStorage:', stats);
        return stats;
      }
    } catch (error) {
      console.error('Error reading user stats:', error);
    }

    console.log('📉 No data found, returning defaults (0 points)');
    return {
      points: 0,
      badges: [],
      completedChallenges: 0,
      activeChallenges: 0
    };
  }

  /**
   * Get all earned challenge badges
   */
  getChallengeBadges(): any[] {
    try {
      const challengesData = localStorage.getItem(this.CHALLENGES_STORAGE_KEY);
      if (challengesData) {
        const data = JSON.parse(challengesData);
        return data.user?.challengeBadges || [];
      }
    } catch (error) {
      console.error('Error reading challenge badges:', error);
    }
    return [];
  }

  calculateBMI(weight: number, height: number): number {
    // BMI = weight (kg) / (height (m))^2
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10; // Round to 1 decimal place
  }

  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  private loadFromStorage(): UserProfile | null {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing saved profile:', e);
          return null;
        }
      }
    }
    return null;
  }

  private saveToStorage(profile: UserProfile): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    }
  }
}
