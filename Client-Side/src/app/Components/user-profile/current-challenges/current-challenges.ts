import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';

interface ActiveChallenge {
  id: number;
  title: string;
  icon: string;
  description: string;
  progress: number; // percentage
  completedDays: number;
  totalDays: number;
  daysLeft: number;
}

@Component({
  selector: 'app-current-challenges',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current-challenges.html',
  styleUrls: ['./current-challenges.css']
})
export class CurrentChallengesComponent implements OnInit, OnDestroy {
  activeChallenges: ActiveChallenge[] = [];
  private challengesSubscription?: Subscription;
  private readonly CHALLENGES_STORAGE_KEY = 'challengesDetoxData';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Load challenges immediately
    this.updateChallenges();
    
    // Poll for updates every 2 seconds
    this.challengesSubscription = interval(2000).subscribe(() => {
      this.updateChallenges();
    });
  }

  private updateChallenges(): void {
    try {
      const challengesData = localStorage.getItem(this.CHALLENGES_STORAGE_KEY);
      if (challengesData) {
        const data = JSON.parse(challengesData);
        const challenges = data.challenges || [];
        
        // Filter only active (not fully completed) challenges
        this.activeChallenges = challenges
          .filter((c: any) => !c.progress.every((day: boolean) => day === true))
          .map((c: any) => {
            const completedDays = c.progress.filter((day: boolean) => day === true).length;
            const totalDays = c.progress.length;
            const progressPercentage = Math.round((completedDays / totalDays) * 100);
            const daysLeft = totalDays - completedDays;

            return {
              id: c.id,
              title: c.title,
              icon: c.icon,
              description: c.description,
              progress: progressPercentage,
              completedDays: completedDays,
              totalDays: totalDays,
              daysLeft: daysLeft
            };
          });
      }
    } catch (error) {
      console.error('Error loading active challenges:', error);
      this.activeChallenges = [];
    }
  }

  /**
   * Navigate to challenge details
   */
  viewChallenge(challengeId: number): void {
    this.router.navigate(['/challenges/details', challengeId]);
  }

  ngOnDestroy(): void {
    if (this.challengesSubscription) {
      this.challengesSubscription.unsubscribe();
    }
  }
}