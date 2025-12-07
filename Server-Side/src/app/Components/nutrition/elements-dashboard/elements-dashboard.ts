import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NutritionStorageService } from '../../../services/nutrition-storage.service';
import { ElementAverage } from '../../../models/nutrition.model';

@Component({
  selector: 'app-elements-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './elements-dashboard.html',
  styleUrls: ['./elements-dashboard.css']
})
export class ElementsDashboardComponent implements OnInit, OnDestroy {
  elements: ElementAverage[] = [];
  totalMeals = 0;
  showNoDataMessage = false;
  private dataSubscription?: Subscription;

  constructor(private storageService: NutritionStorageService) {}

  ngOnInit(): void {
    this.loadAverages();
    
    // Subscribe to data updates
    this.dataSubscription = this.storageService.dataUpdated$.subscribe(() => {
      this.loadAverages();
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadAverages(): void {
    const meals = this.storageService.getMealHistory();
    this.totalMeals = meals.length;

    if (meals.length === 0) {
      this.showNoDataMessage = true;
      this.elements = [];
      return;
    }

    this.showNoDataMessage = false;
    this.elements = this.storageService.calculateAverageElements();
  }

  getProgressWidth(dailyValue?: number): string {
    if (!dailyValue) return '0%';
    return `${Math.min(dailyValue, 100)}%`;
  }

  getProgressClass(dailyValue?: number): string {
    if (!dailyValue) return 'progress-unknown';
    if (dailyValue >= 100) return 'progress-excellent';
    if (dailyValue >= 75) return 'progress-good';
    if (dailyValue >= 50) return 'progress-moderate';
    return 'progress-low';
  }

  getStatusText(dailyValue?: number): string {
    if (!dailyValue) return 'N/A';
    if (dailyValue >= 100) return 'Excellent';
    if (dailyValue >= 75) return 'Good';
    if (dailyValue >= 50) return 'Moderate';
    return 'Low';
  }
}
