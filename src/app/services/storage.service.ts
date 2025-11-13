// Manages all localStorage operations

import { Injectable } from '@angular/core';
import { StorageData, UserData } from '../models/user.model';
import { UserChallenge } from '../models/challenge.model';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    // localStorage key for all app data
    private readonly STORAGE_KEY = 'challengesDetoxData';

    constructor() {
        this.init();
    }

    /**
     * @returns The initialized or existing data
     */
    init(): StorageData {
        const existingData = this.getData();
        if (!existingData) {
            const defaultData: StorageData = {
                challenges: [],
                user: {
                    badges: [],
                    points: 0,
                    lastReminderShown: null
                }
            };
            this.setData(defaultData);
            return defaultData;
        }
        return existingData;
    }

    /**
     * Get all data from localStorage
     * @returns
     */
    getData(): StorageData | null {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    /**
     * Save complete data object to localStorage
     * @param data
     * @returns
     */
    setData(data: StorageData): boolean {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    }

    /**
     * Get all user challenges
     * @returns Array of UserChallenge objects
     */
    getChallenges(): UserChallenge[] {
        const data = this.getData() || this.init();
        return data.challenges || [];
    }

    /**
     * Add a new challenge to user's active challenges
     * @param challenge
     * @returns
     */
    addChallenge(challenge: UserChallenge): boolean {
        const data = this.getData() || this.init();
        data.challenges.push(challenge);
        return this.setData(data);
    }

    /**
     * Update an existing challenge
     * @param id - Challenge ID
     * @param updates
     * @returns
     */
    updateChallenge(id: number, updates: Partial<UserChallenge>): boolean {
        const data = this.getData() || this.init();
        const index = data.challenges.findIndex((c: UserChallenge) => c.id === id);

        if (index !== -1) {
            data.challenges[index] = { ...data.challenges[index], ...updates };
            return this.setData(data);
        }
        return false;
    }

    /**
     * Delete a challenge from user's active challenges
     * @param id
     * @returns
     */
    deleteChallenge(id: number): boolean {
        const data = this.getData() || this.init();
        data.challenges = data.challenges.filter((c: UserChallenge) => c.id !== id);
        return this.setData(data);
    }

    /**
     * Get a specific challenge by ID
     * @param id
     * @returns UserChallenge object or null
     */
    getChallengeById(id: number): UserChallenge | null {
        const challenges = this.getChallenges();
        return challenges.find((c: UserChallenge) => c.id === id) || null;
    }

    /**
     * Get user data
     * @returns
     */
    getUserData(): UserData {
        const data = this.getData() || this.init();
        return data.user || { badges: [], points: 0, lastReminderShown: null };
    }

    /**
     * Update user data
     * @param updates
     * @returns
     */
    updateUserData(updates: Partial<UserData>): boolean {
        const data = this.getData() || this.init();
        data.user = { ...data.user, ...updates };
        return this.setData(data);
    }

    /**
     * Add a badge to user's collection
     * @param badge - Badge name (Bronze, Silver, Gold)
     * @returns Success status (false if badge already exists)
     */
    addBadge(badge: string): boolean {
        const data = this.getData() || this.init();
        if (!data.user.badges.includes(badge)) {
            data.user.badges.push(badge);
            return this.setData(data);
        }
        return false;
    }

    /**
     * Add points to user's total
     * @param points
     * @returns
     */
    addPoints(points: number): boolean {
        const data = this.getData() || this.init();
        data.user.points = (data.user.points || 0) + points;
        return this.setData(data);
    }

    /**
     * Calculate total completed challenges
     * @returns
     */
    getCompletedChallengesCount(): number {
        const challenges = this.getChallenges();
        return challenges.filter((c: UserChallenge) =>
            c.progress && c.progress.every(day => day === true)
        ).length;
    }

    /**
     * Check badge eligibility and award new badges
     * Bronze: 3+ completed challenges
     * Silver: 6+ completed challenges  
     * Gold: 9+ completed challenges
     * @returns Array of newly earned badge names
     */
    checkAndAwardBadges(): string[] {
        const completedCount = this.getCompletedChallengesCount();
        const userData = this.getUserData();
        const newBadges: string[] = [];

        if (completedCount >= 2 && !userData.badges.includes('Bronze')) {
            this.addBadge('Bronze');
            newBadges.push('Bronze');
        }

        if (completedCount >= 5 && !userData.badges.includes('Silver')) {
            this.addBadge('Silver');
            newBadges.push('Silver');
        }

        if (completedCount >= 8 && !userData.badges.includes('Gold')) {
            this.addBadge('Gold');
            newBadges.push('Gold');
        }

        return newBadges;
    }

    /**
     * Clear all data (reset functionality)
     * @returns
     */
    clearAll(): boolean {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            this.init();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    /**
     * Export data as JSON string
     * @returns
     */
    exportData(): string {
        const data = this.getData() || this.init();
        return JSON.stringify(data, null, 2);
    }

    /**
     * Import data from JSON string
     * @param jsonString
     * @returns
     */
    importData(jsonString: string): boolean {
        try {
            const data = JSON.parse(jsonString);
            return this.setData(data);
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}