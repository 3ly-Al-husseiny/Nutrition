// src/app/user-profile/user-profile.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalInfoComponent } from './personal-info/personal-info';
import { HealthIssuesComponent } from './health-issues/health-issues';
import { EarnedBadgesComponent } from './earned-badges/earned-badges';
import { CurrentChallengesComponent } from './current-challenges/current-challenges';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    PersonalInfoComponent,
    HealthIssuesComponent,
    EarnedBadgesComponent,
    CurrentChallengesComponent
  ],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent {

}