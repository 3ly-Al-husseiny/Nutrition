// src/app/components/earned-badges/earned-badges.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileService } from '../../../services/user-profile.service';
import { Subscription, interval } from 'rxjs';

interface DisplayBadge {
  name: string;
  icon: string;
  color: string;
  dateEarned?: string;
}

@Component({
  selector: 'app-earned-badges',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './earned-badges.html',
  styleUrls: ['./earned-badges.css']
})
export class EarnedBadgesComponent implements OnInit, OnDestroy {
  challengeBadges: DisplayBadge[] = [];
  private badgesSubscription?: Subscription;

  constructor(private userProfileService: UserProfileService) {}

  ngOnInit(): void {
    // Update badges dynamically
    this.updateBadges();
    
    // Poll for badge updates every 2 seconds (in case challenges are completed)
    this.badgesSubscription = interval(2000).subscribe(() => {
      this.updateBadges();
    });
  }

  private updateBadges(): void {
    const badges = this.userProfileService.getChallengeBadges();
    
    // Transform badges for display
    this.challengeBadges = badges.map((badge: any) => ({
      name: badge.name,
      icon: badge.icon,
      color: badge.color,
      dateEarned: badge.dateEarned
    }));
  }

  /**
   * Format date for display
   */
  formatDate(dateString?: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  }

  ngOnDestroy(): void {
    if (this.badgesSubscription) {
      this.badgesSubscription.unsubscribe();
    }
  }
}