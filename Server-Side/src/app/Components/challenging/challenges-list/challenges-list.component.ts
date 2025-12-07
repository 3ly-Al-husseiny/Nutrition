// Displays available and active challenges

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { ChallengeService } from '../../../services/challenging/challenge.service';
import { NotificationService } from '../../../services/challenging/notification.service';
import { ReminderService } from '../../../services/challenging/reminder.service';
import { Challenge, UserChallenge, ChallengeStats } from '../../../models/challenge.model';

@Component({
  selector: 'app-challenges-list',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './challenges-list.component.html',
  styleUrl: './challenges-list.component.css',
})
export class ChallengesListComponent implements OnInit, OnDestroy {
  allChallenges: Challenge[] = [];
  recentJoinedChallenges: Challenge[] = [];
  activeChallenges: UserChallenge[] = [];
  selectedChallenge: Challenge | null = null;

  isLoading = true;
  private routerSubscription?: Subscription;

  constructor(
    private challengeService: ChallengeService,
    private notificationService: NotificationService,
    private reminderService: ReminderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChallenges();
    this.reminderService.checkAndShowReminder();

    // Subscribe to router events to reload when navigating to the same route
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEnd = event as NavigationEnd;
        if (navEnd.urlAfterRedirects.includes('/challenging/list')) {
          this.loadChallenges();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Load all challenges from service
  async loadChallenges(): Promise<void> {
    this.isLoading = true;
    console.log('🔄 Loading challenges...');

    try {
      // Get active (joined) challenges from storage
      this.activeChallenges = this.challengeService.getActiveChallenges();
      console.log('📋 Active challenges:', this.activeChallenges.length);

      // Get ALL challenge definitions directly
      this.allChallenges = this.challengeService.getAllChallengeDefinitions();
      console.log('📋 All challenges loaded:', this.allChallenges.length);

      // Get recent joined challenges (latest 3)
      this.recentJoinedChallenges = this.getRecentJoinedChallengesSync();
      console.log('📋 Recent joined:', this.recentJoinedChallenges.length);
    } catch (error) {
      console.error('❌ Error loading challenges:', error);
      this.notificationService.error(
        'Loading Error',
        'Failed to load challenges. Please refresh the page.'
      );
    } finally {
      this.isLoading = false;
      console.log('✅ Loading complete. isLoading:', this.isLoading);
    }
  }

  /**
   * Get the most recent joined challenges (max 3) - Optimized sync version
   */
  getRecentJoinedChallengesSync(): Challenge[] {
    // Sort active challenges by start date (most recent first)
    const sortedActive = [...this.activeChallenges].sort((a, b) => {
      return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
    });

    // Get the latest 3
    const recent = sortedActive.slice(0, 3);

    // Get their full challenge definitions from allChallenges
    const recentChallenges: Challenge[] = [];
    for (const activeChallenge of recent) {
      const challengeDef = this.allChallenges.find((c) => c.id === activeChallenge.id);
      if (challengeDef) {
        recentChallenges.push(challengeDef);
      }
    }

    return recentChallenges;
  }

  /**
   * Get the most recent joined challenges (max 3) - DEPRECATED
   */
  async getRecentJoinedChallenges(): Promise<Challenge[]> {
    // This method is now deprecated, kept for reference
    return this.getRecentJoinedChallengesSync();
  }

  /**
   * Check if a challenge is joined
   */
  isJoined(challengeId: number): boolean {
    return this.activeChallenges.some((c) => c.id === challengeId);
  }

  /**
   * Get challenge progress percentage
   */
  getChallengeProgress(challengeId: number): number {
    const userChallenge = this.activeChallenges.find((c) => c.id === challengeId);
    if (!userChallenge) return 0;

    const stats = this.challengeService.getChallengeStats(userChallenge);
    return stats.percentage;
  }

  /**
   * Show challenge details in modal
   */
  showChallengeDetails(challenge: Challenge): void {
    this.selectedChallenge = challenge;
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this.selectedChallenge = null;
  }

  /**
   * Join a challenge
   * @param challengeId
   */
  async joinChallenge(challengeId: number): Promise<void> {
    const challenge = this.allChallenges.find((c) => c.id === challengeId);
    if (!challenge) return;

    const success = await this.challengeService.joinChallenge(challengeId);

    if (success) {
      this.notificationService
        .success(
          'Challenge Joined!',
          `You've successfully joined: ${challenge.title}. Start tracking your progress today! 💪`,
          2500
        )
        .then(() => {
          this.loadChallenges();
        });
    } else {
      this.notificationService.error(
        'Error',
        'Failed to join challenge. You may have already joined it.'
      );
    }
  }

  /**
   * Reset a challenge (leave and rejoin)
   * @param challengeId
   */
  resetChallenge(challengeId: number): void {
    const challenge = this.allChallenges.find((c) => c.id === challengeId);
    if (!challenge) return;

    this.notificationService
      .confirmDanger(
        'Reset Challenge?',
        `<p>Are you sure you want to reset <strong>"${challenge.title}"</strong>?</p><p style="color: #fc8181; margin-top: 1rem;">⚠️ Your current progress will be lost and you'll start fresh!</p>`,
        'Yes, Reset It',
        'Keep Progress'
      )
      .then((confirmed) => {
        if (confirmed) {
          // Leave the challenge
          const success = this.challengeService.leaveChallenge(challengeId);

          if (success) {
            // Rejoin immediately
            setTimeout(async () => {
              await this.challengeService.joinChallenge(challengeId);
              this.notificationService.success(
                'Challenge Reset!',
                "Your progress has been reset. Let's start fresh! 💪",
                2000
              );
              this.loadChallenges();
            }, 500);
          }
        }
      });
  }

  /**
   * Navigate to challenge details page
   * @param challengeId
   */
  viewChallengeDetails(challengeId: number): void {
    this.router.navigate(['/challenging', challengeId]);
  }

  /**
   * Navigate to progress page
   */
  viewAllProgress(): void {
    this.router.navigate(['/challenging/progress']);
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
    return challenge.progress.every((day) => day === true);
  }
}
