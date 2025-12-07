import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileService } from '../../../services/user-profile.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-user-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-summary.html',
  styleUrls: ['./user-summary.css']
})
export class UserSummaryComponent implements OnInit, OnDestroy {
  userName: string = '';
  userEmail: string = '';
  userPhoto: string = '';
  userPoints: number = 0;
  private profileSubscription?: Subscription;
  private pointsSubscription?: Subscription;

  constructor(private userProfileService: UserProfileService) {}

  ngOnInit(): void {
    this.profileSubscription = this.userProfileService.profile$.subscribe(profile => {
      this.userName = profile.name;
      this.userEmail = profile.email || '';
      this.userPhoto = profile.photo;
    });

    // Update points dynamically
    this.updatePoints();
    
    // Poll for points updates every 2 seconds (in case challenges are completed)
    this.pointsSubscription = interval(2000).subscribe(() => {
      this.updatePoints();
    });
  }

  private updatePoints(): void {
    const stats = this.userProfileService.getUserStats();
    this.userPoints = stats.points;
    console.log('📊 Points updated:', this.userPoints, 'from stats:', stats);
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
    if (this.pointsSubscription) {
      this.pointsSubscription.unsubscribe();
    }
  }
}