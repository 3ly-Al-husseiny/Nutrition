// Displays detailed information about a specific challenge


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ChallengeService } from '../../services/challenge.service';
import { NotificationService } from '../../services/notification.service';
import { StorageService } from '../../services/storage.service';
import { Challenge, UserChallenge, ChallengeStats } from '../../models/challenge.model';

// Import confetti for celebration effects
declare const confetti: any;

@Component({
    selector: 'app-challenge-details',
    standalone: true,
    imports: [CommonModule, HeaderComponent],
    templateUrl: './challenge-details.component.html',
    styleUrl: './challenge-details.component.css'
})
export class ChallengeDetailsComponent implements OnInit {


    // Challenge data
    challenge: Challenge | null = null;
    userChallenge: UserChallenge | null = null;

    stats: ChallengeStats = { completed: 0, total: 0, percentage: 0 };
    isFullyCompleted = false;

    isLoading = true;
    challengeId: number = 0;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private challengeService: ChallengeService,
        private notificationService: NotificationService,
        private storageService: StorageService
    ) { }

    ngOnInit(): void {
        window.scrollTo(0, 0);

        // Get challenge ID from route parameters
        this.route.params.subscribe(params => {
            this.challengeId = +params['id'];
            this.loadChallengeDetails();
        });

    }

    
    loadChallengeDetails(): void {
        this.isLoading = true;

        this.challenge = this.challengeService.getChallengeDefinition(this.challengeId) || null;

        this.userChallenge = this.challengeService.getUserChallenge(this.challengeId);

        if (!this.challenge || !this.userChallenge) {
            this.notificationService.error(
                'Challenge Not Found',
                'This challenge does not exist or you have not joined it yet.'
            ).then(() => {
                this.router.navigate(['/challenges']);
            });
            return;
        }

        // Calculate statistics
        this.updateStats();

        this.isLoading = false;
    }

    updateStats(): void {
        if (!this.userChallenge) return;

        this.stats = this.challengeService.getChallengeStats(this.userChallenge);
        this.isFullyCompleted = this.userChallenge.progress.every(day => day === true);
    }

    /**
     * Mark a specific day as complete
     * @param dayIndex 
     */
    markDayComplete(dayIndex: number): void {
        if (!this.userChallenge) return;

        // Check if day is already completed
        if (this.userChallenge.progress[dayIndex]) {
            return;
        }

        const result = this.challengeService.markDayComplete(this.challengeId, dayIndex);

        if (result.success) {
            this.userChallenge = this.challengeService.getUserChallenge(this.challengeId);
            this.updateStats();

            if (result.isFullyCompleted) {
                this.showCompletionCelebration(result.newBadges);
            } else {
                this.notificationService.success(
                    'Day Completed!',
                    `Day ${dayIndex + 1} marked as done! Keep it up! 💪`,
                    2000
                );
            }
        }
    }

    /**
     * Show celebration when challenge is completed
     * @param newBadges
     */
    showCompletionCelebration(newBadges: string[]): void {
        if (!this.challenge) return;

        // Show confetti or fireworks based on badges
        if (newBadges.length > 0) {
            this.showBigFireworks();
        } else {
            this.showSmallConfetti();
        }

        // Show completion alert
        this.notificationService.challengeCompleted(
            this.challenge.points,
            newBadges
        );
    }

    showSmallConfetti(): void {
        if (typeof confetti !== 'function') return;

        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio: number, opts: any) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    }

    showBigFireworks(): void {
        if (typeof confetti !== 'function') return;

        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }

    
    leaveChallenge(): void {
        if (!this.challenge) return;

        this.notificationService.confirmDanger(
            'Leave Challenge?',
            `<p>Are you sure you want to leave <strong>"${this.challenge.title}"</strong>?</p><p style="color: #fc8181; margin-top: 1rem;">⚠️ Your progress will be lost.</p>`,
            'Yes, Leave It',
            'Keep Challenge'
        ).then(confirmed => {
            if (confirmed) {
                const success = this.challengeService.leaveChallenge(this.challengeId);

                if (success) {
                    this.notificationService.success(
                        'Challenge Left',
                        'You have left the challenge. You can always join again!',
                        2500
                    ).then(() => {
                        this.router.navigate(['/challenges']);
                    });
                }
            }
        });
    }

    /**
     * Format date for display
     * @param dateString 
     * @returns
     */
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    goBack(): void {
        this.router.navigate(['/challenges']);
    }
}