// Business logic for managing challenges

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs';
import { StorageService } from './storage.service';
// Fallback data module in case the JSON file isn't available at runtime
import { getAllChallenges } from '../../data/challenges.data';
import { Challenge, UserChallenge, ChallengeStats } from '../../models/challenge.model';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  private readonly DATA_PATH = '/data/challenging/challenges.json';
  private challengesData: Challenge[] = [];
  private dataLoaded = false;
  private loadingPromise: Promise<void> | null = null;

  constructor(private storageService: StorageService, private http: HttpClient) {
    // Immediately load fallback data so we're never stuck with empty array
    this.challengesData = getAllChallenges();
    this.dataLoaded = true;
    console.log('✅ Initialized with fallback challenges data:', this.challengesData.length);

    // Then try to load from JSON (will override if successful)
    this.tryLoadFromJSON();
  }

  /**
   * Try to load challenges from JSON file (non-blocking)
   */
  private tryLoadFromJSON(): void {
    this.http
      .get<Challenge[]>(this.DATA_PATH)
      .pipe(timeout(3000))
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.challengesData = data;
            console.log('✅ Loaded challenges from JSON:', data.length);
          }
        },
        error: (err) => {
          console.warn('⚠️ Could not load from JSON, using fallback data');
        },
      });
  }

  /**
   * Ensure data is loaded before accessing (now synchronous since we preload)
   */
  private async ensureDataLoaded(): Promise<void> {
    // Data is always loaded synchronously in constructor now
    return Promise.resolve();
  }

  /**
   * Get ALL challenge definitions (both joined and available)
   * @returns
   */
  getAllChallengeDefinitions(): Challenge[] {
    return [...this.challengesData];
  }

  /**
   * Get all available challenges
   * @returns
   */
  async getAvailableChallenges(): Promise<Challenge[]> {
    await this.ensureDataLoaded();

    const userChallenges = this.storageService.getChallenges();
    const userChallengeIds = userChallenges.map((c) => c.id);

    const available = this.challengesData.filter(
      (challenge: Challenge) => !userChallengeIds.includes(challenge.id)
    );

    return available;
  }

  /**
   * Get all user's active challenges
   * @returns
   */
  getActiveChallenges(): UserChallenge[] {
    return this.storageService.getChallenges();
  }

  /**
   * Get a specific challenge by ID (async version - ensures data loaded)
   * @param id
   * @returns
   */
  async getChallengeDefinition(id: number): Promise<Challenge | undefined> {
    await this.ensureDataLoaded();
    return this.challengesData.find((challenge) => challenge.id === id);
  }

  /**
   * Get a specific challenge by ID (sync version - for when data is already loaded)
   * @param id
   * @returns
   */
  getChallengeDefinitionSync(id: number): Challenge | undefined {
    return this.challengesData.find((challenge) => challenge.id === id);
  }

  /**
   * Get user's active challenge by ID
   * @param id
   * @returns
   */
  getUserChallenge(id: number): UserChallenge | null {
    return this.storageService.getChallengeById(id);
  }

  /**
   * Join a new challenge
   * @param challengeId
   * @returns
   */
  async joinChallenge(challengeId: number): Promise<boolean> {
    await this.ensureDataLoaded();
    const challenge = this.challengesData.find((c) => c.id === challengeId);
    if (!challenge) {
      return false;
    }

    // Check if already joined
    const existing = this.storageService.getChallengeById(challengeId);
    if (existing) {
      return false;
    }

    const newChallenge: UserChallenge = {
      ...challenge,
      startedAt: new Date().toISOString(),
      progress: Array(challenge.durationDays).fill(false),
      joined: true,
      pointsEarned: 0,
    };

    return this.storageService.addChallenge(newChallenge);
  }

  /**
   * Leave a challenge
   * @param challengeId
   * @returns
   */
  leaveChallenge(challengeId: number): boolean {
    const userChallenge = this.storageService.getChallengeById(challengeId);

    if (userChallenge && userChallenge.pointsEarned > 0) {
      // Deduct points
      const userData = this.storageService.getUserData();
      const newPoints = Math.max(0, userData.points - userChallenge.pointsEarned);
      this.storageService.updateUserData({ points: newPoints });
    }

    // Delete the challenge
    const success = this.storageService.deleteChallenge(challengeId);

    // Recalculate badges
    if (success) {
      this.recalculateBadges();
    }

    return success;
  }

  /**
   * Mark day as complete
   * Updates progress and points/badges
   * @param challengeId
   * @param dayIndex
   * @returns
   */
  markDayComplete(
    challengeId: number,
    dayIndex: number
  ): {
    success: boolean;
    isFullyCompleted: boolean;
    newBadges: string[];
    challengeBadgeAwarded?: boolean;
  } {
    const userChallenge = this.storageService.getChallengeById(challengeId);

    if (!userChallenge || userChallenge.progress[dayIndex]) {
      return { success: false, isFullyCompleted: false, newBadges: [] };
    }

    // Update progress
    userChallenge.progress[dayIndex] = true;

    // Check if challenge is fully completed
    const isFullyCompleted = userChallenge.progress.every((day) => day === true);
    let newBadges: string[] = [];
    let challengeBadgeAwarded = false;

    if (isFullyCompleted && userChallenge.pointsEarned === 0) {
      // Award points
      userChallenge.pointsEarned = userChallenge.points;
      this.storageService.addPoints(userChallenge.points);

      // Award challenge-specific badge
      const badgeSuccess = this.storageService.awardChallengeBadge(
        userChallenge.id,
        userChallenge.title,
        userChallenge.icon
      );
      
      if (badgeSuccess) {
        challengeBadgeAwarded = true;
        userChallenge.badgeEarned = true;
        newBadges.push(userChallenge.title);
      }

      // Also check and award milestone badges (Bronze, Silver, Gold) - keeping legacy system
      const milestoneBadges = this.storageService.checkAndAwardBadges();
      newBadges = [...newBadges, ...milestoneBadges];
    }

    // Save updates
    this.storageService.updateChallenge(challengeId, {
      progress: userChallenge.progress,
      pointsEarned: userChallenge.pointsEarned,
      badgeEarned: userChallenge.badgeEarned,
    });

    return { success: true, isFullyCompleted, newBadges, challengeBadgeAwarded };
  }

  /**
   * Calculate statistics for a challenge
   * @param challenge
   * @returns
   */
  getChallengeStats(challenge: UserChallenge): ChallengeStats {
    const completed = challenge.progress.filter((day) => day === true).length;
    const total = challenge.progress.length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
  }

  /**
   * Recalculate and update user badges based on current completed challenges
   * This function recalculates from scratch to handle badge removal
   * Bronze: 3+ completed, Silver: 6+ completed, Gold: 9+ completed
   */
  private recalculateBadges(): void {
    const completedCount = this.storageService.getCompletedChallengesCount();
    const earnedBadges: string[] = [];

    if (completedCount >= 3) {
      earnedBadges.push('Bronze');
    }
    if (completedCount >= 6) {
      earnedBadges.push('Silver');
    }
    if (completedCount >= 9) {
      earnedBadges.push('Gold');
    }

    // Update user data with the recalculated badges
    this.storageService.updateUserData({ badges: earnedBadges });
  }

  /**
   * Get user statistics
   * @returns
   */
  getUserStats(): {
    totalPoints: number;
    activeChallenges: number;
    completedChallenges: number;
  } {
    const userData = this.storageService.getUserData();
    const challenges = this.storageService.getChallenges();
    const completedChallenges = this.storageService.getCompletedChallengesCount();

    return {
      totalPoints: userData.points,
      activeChallenges: challenges.length,
      completedChallenges,
    };
  }
}
