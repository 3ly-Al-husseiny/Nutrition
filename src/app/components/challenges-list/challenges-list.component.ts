// Displays available and active challenges

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ChallengeService } from '../../services/challenge.service';
import { NotificationService } from '../../services/notification.service';
import { ReminderService } from '../../services/reminder.service';
import { Challenge, UserChallenge, ChallengeStats } from '../../models/challenge.model';

@Component({
    selector: 'app-challenges-list',
    standalone: true,
    imports: [CommonModule, HeaderComponent],
    templateUrl: './challenges-list.component.html',
    styleUrl: './challenges-list.component.css'
})
export class ChallengesListComponent implements OnInit {

    availableChallenges: Challenge[] = [];
    activeChallenges: UserChallenge[] = [];

    isLoading = true;

    constructor(
        private challengeService: ChallengeService,
        private notificationService: NotificationService,
        private reminderService: ReminderService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadChallenges();

        this.reminderService.checkAndShowReminder();
    }

    
    // Load all challenges from service
    loadChallenges(): void {
        this.isLoading = true;

        // Get available and active challenges
        this.availableChallenges = this.challengeService.getAvailableChallenges();
        this.activeChallenges = this.challengeService.getActiveChallenges();

        this.isLoading = false;
    }

    /**
     * Join a challenge
     * @param challengeId 
     */
    joinChallenge(challengeId: number): void {
        const challenge = this.availableChallenges.find(c => c.id === challengeId);
        if (!challenge) return;

        const success = this.challengeService.joinChallenge(challengeId);

        if (success) {
            this.notificationService.success(
                'Challenge Joined!',
                `You've successfully joined: ${challenge.title}. Start tracking your progress today! 💪`
            ).then(() => {
                this.loadChallenges();
            });
        } else {
            this.notificationService.error(
                'Error',
                'Failed to join challenge. Please try again.'
            );
        }
    }

    /**
     * Navigate to challenge details page
     * @param challengeId 
     */
    viewChallengeDetails(challengeId: number): void {
        this.router.navigate(['/challenge', challengeId]);
    }

    /**
     * Get statistics for a challenge
     * @param challenge 
     * @returns 
     */
    getChallengeStats(challenge: UserChallenge): ChallengeStats {
        return this.challengeService.getChallengeStats(challenge);
    }

    /**
     * Check if a challenge is fully completed
     * @param challenge
     * @returns
     */
    isChallengeCompleted(challenge: UserChallenge): boolean {
        return challenge.progress.every(day => day === true);
    }
}