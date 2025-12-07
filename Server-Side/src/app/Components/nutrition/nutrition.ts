import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { MealLogger } from './meal-logger/meal-logger';
import { ElementsDashboardComponent } from './elements-dashboard/elements-dashboard';
import { MealHistoryComponent } from './meal-history/meal-history';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [
    CommonModule,
    MealLogger,
    ElementsDashboardComponent,
    MealHistoryComponent
  ],
  templateUrl: './nutrition.html',
  styleUrls: ['./nutrition.css']
})
export class NutritionComponent {
  constructor() {}
}