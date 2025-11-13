
// Business logic for managing challenges


import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Challenge, UserChallenge, ChallengeStats } from '../models/challenge.model';
import { CHALLENGES_DATA, getChallengeById } from '../data/challenges.data';

@Injectable({
    providedIn: 'root'
})
export class ChallengeService {

    constructor(private storageService: StorageService) { }

    /**
     * Get all available challenges 
     * @returns 
     */
    getAvailableChallenges(): Challenge[] {
        const userChallenges = this.storageService.getChallenges();
        const userChallengeIds = userChallenges.map(c => c.id);

        return CHALLENGES_DATA.filter(challenge =>
            !userChallengeIds.includes(challenge.id)
        );
    }

    /**
     * Get all user's active challenges
     * @returns 
     */
    getActiveChallenges(): UserChallenge[] {
        return this.storageService.getChallenges();
    }

    /**
     * Get a specific challenge by ID
     * @param id
     * @returns 
     */
    getChallengeDefinition(id: number): Challenge | undefined {
        return getChallengeById(id);
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
    joinChallenge(challengeId: number): boolean {
        const challenge = getChallengeById(challengeId);
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
            pointsEarned: 0
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
    markDayComplete(challengeId: number, dayIndex: number): {
        success: boolean;
        isFullyCompleted: boolean;
        newBadges: string[];
    } {
        const userChallenge = this.storageService.getChallengeById(challengeId);

        if (!userChallenge || userChallenge.progress[dayIndex]) {
            return { success: false, isFullyCompleted: false, newBadges: [] };
        }

        // Update progress
        userChallenge.progress[dayIndex] = true;

        // Check if challenge is fully completed
        const isFullyCompleted = userChallenge.progress.every(day => day === true);
        let newBadges: string[] = [];

        if (isFullyCompleted && userChallenge.pointsEarned === 0) {
            // Award points
            userChallenge.pointsEarned = userChallenge.points;
            this.storageService.addPoints(userChallenge.points);

            // Check and award badges
            newBadges = this.storageService.checkAndAwardBadges();
        }

        // Save updates
        this.storageService.updateChallenge(challengeId, {
            progress: userChallenge.progress,
            pointsEarned: userChallenge.pointsEarned
        });

        return { success: true, isFullyCompleted, newBadges };
    }

    /**
     * Calculate statistics for a challenge
     * @param challenge
     * @returns
     */
    getChallengeStats(challenge: UserChallenge): ChallengeStats {
        const completed = challenge.progress.filter(day => day === true).length;
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
            completedChallenges
        };
    }
}