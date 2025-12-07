import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileService } from '../../../services/user-profile.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.css']
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  // User summary properties
  userName: string = '';
  userEmail: string = '';
  userPhoto: string = '';
  userPoints: number = 0; // Dynamic points from challenges
  
  // Personal info properties
  userAge: number = 0;
  userGender: string = '';
  userWeight: number = 0;
  userHeight: number = 0;
  userBMI: number = 0;
  bmiCategory: string = '';
  private profileSubscription?: Subscription;
  private pointsSubscription?: Subscription;

  constructor(private userProfileService: UserProfileService) {}

  ngOnInit(): void {
    this.profileSubscription = this.userProfileService.profile$.subscribe(profile => {
      // User summary data
      this.userName = profile.name;
      this.userEmail = profile.email;
      this.userPhoto = profile.photo || 'assets/default-avatar.png';
      
      // Personal info data
      this.userAge = profile.age;
      this.userGender = this.capitalizeGender(profile.gender);
      this.userWeight = profile.weight;
      this.userHeight = profile.height;
      
      // Calculate BMI
      this.userBMI = this.userProfileService.calculateBMI(profile.weight, profile.height);
      this.bmiCategory = this.userProfileService.getBMICategory(this.userBMI);
    });

    // Update points dynamically from challenges
    this.updatePoints();
    
    // Poll for points updates every 2 seconds
    this.pointsSubscription = interval(2000).subscribe(() => {
      this.updatePoints();
    });
  }

  private updatePoints(): void {
    const stats = this.userProfileService.getUserStats();
    this.userPoints = stats.points;
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
    if (this.pointsSubscription) {
      this.pointsSubscription.unsubscribe();
    }
  }

  private capitalizeGender(gender: string): string {
    if (!gender) return '';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  }
}