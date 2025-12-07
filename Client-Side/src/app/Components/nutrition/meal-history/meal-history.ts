import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NutritionStorageService } from '../../../services/nutrition-storage.service';
import { MealEntry } from '../../../models/nutrition.model';

@Component({
  selector: 'app-meal-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meal-history.html',
  styleUrls: ['./meal-history.css']
})
export class MealHistoryComponent implements OnInit, OnDestroy {
  meals: MealEntry[] = [];
  expandedMealId: string | null = null;
  private dataSubscription?: Subscription;

  constructor(private storageService: NutritionStorageService) {}

  ngOnInit(): void {
    this.loadMeals();
    
    // Subscribe to data updates
    this.dataSubscription = this.storageService.dataUpdated$.subscribe(() => {
      this.loadMeals();
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadMeals(): void {
    this.meals = this.storageService.getMealHistory();
  }

  toggleDetails(mealId: string): void {
    this.expandedMealId = this.expandedMealId === mealId ? null : mealId;
  }

  deleteMeal(id: string): void {
    if (confirm('Are you sure you want to delete this meal?')) {
      this.storageService.deleteMeal(id);
    }
  }

  clearAllMeals(): void {
    if (confirm('Are you sure you want to clear all meal history? This cannot be undone.')) {
      this.storageService.clearAllMeals();
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}