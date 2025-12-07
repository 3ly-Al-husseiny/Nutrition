import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiNutritionService } from '../../../services/gemini-nutrition.service';
import { NutritionStorageService } from '../../../services/nutrition-storage.service';
import { MealAnalysis } from '../../../models/nutrition.model';

@Component({
  selector: 'app-meal-logger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meal-logger.html',
  styleUrls: ['./meal-logger.css'],
})
export class MealLogger {
  mealDescription = '';
  isAnalyzing = false;
  analysisResult: MealAnalysis | null = null;
  errorMessage = '';
  showSuccess = false;

  constructor(
    private geminiService: GeminiNutritionService,
    private storageService: NutritionStorageService,
    private cdr: ChangeDetectorRef
  ) {}

  async analyzeMeal() {
    console.log('MealLogger: analyzeMeal called');
    if (!this.mealDescription || this.mealDescription.trim().length < 5) {
      this.errorMessage = 'Please enter a meal description (minimum 5 characters)';
      return;
    }

    this.isAnalyzing = true;
    this.errorMessage = '';
    this.analysisResult = null;

    try {
      console.log('MealLogger: Calling service...');
      this.analysisResult = await this.geminiService.analyzeMeal(this.mealDescription);
      console.log('MealLogger: Service returned', this.analysisResult);
    } catch (error) {
      console.error('MealLogger: Error caught', error);
      this.errorMessage = error instanceof Error ? error.message : 'Failed to analyze meal';
    } finally {
      console.log('MealLogger: Finally block - setting isAnalyzing to false');
      this.isAnalyzing = false;
      this.cdr.detectChanges(); // Force change detection
    }
  }

  saveMeal() {
    if (!this.analysisResult) {
      return;
    }

    this.storageService.saveMealAnalysis(this.mealDescription, this.analysisResult);

    // Show success and reset
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
      this.resetForm();
    }, 2000);
  }

  resetForm() {
    this.mealDescription = '';
    this.analysisResult = null;
    this.errorMessage = '';
  }

  get isFormValid(): boolean {
    return this.mealDescription.trim().length >= 5;
  }
}
