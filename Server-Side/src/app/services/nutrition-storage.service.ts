import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MealEntry, MealAnalysis, ElementAverage } from '../models/nutrition.model';

@Injectable({
  providedIn: 'root'
})
export class NutritionStorageService {
  private readonly STORAGE_KEY = 'NUTRITION_MEALS';
  private dataUpdated = new Subject<void>();
  dataUpdated$ = this.dataUpdated.asObservable();

  constructor() {}

  saveMealAnalysis(description: string, analysis: MealAnalysis): MealEntry {
    const newMeal: MealEntry = {
      id: this.generateId(),
      description,
      date: new Date(),
      timestamp: Date.now(),
      analysis
    };

    const meals = this.getMealHistory();
    meals.unshift(newMeal); // Add to beginning (newest first)
    this.saveMeals(meals);
    this.dataUpdated.next();

    return newMeal;
  }

  getMealHistory(): MealEntry[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      const meals = JSON.parse(stored);
      // Convert date strings back to Date objects
      return meals.map((meal: any) => ({
        ...meal,
        date: new Date(meal.date)
      }));
    } catch (error) {
      console.error('Error loading meal history:', error);
      return [];
    }
  }

  calculateAverageElements(): ElementAverage[] {
    const meals = this.getMealHistory();
    
    if (meals.length === 0) {
      return [];
    }

    const elementMap = new Map<string, {
      total: number;
      count: number;
      unit: string;
      totalDV: number;
    }>();

    // Aggregate all elements across all meals
    meals.forEach(meal => {
      meal.analysis.elements.forEach(element => {
        if (!elementMap.has(element.name)) {
          elementMap.set(element.name, {
            total: 0,
            count: 0,
            unit: element.unit,
            totalDV: 0
          });
        }

        const data = elementMap.get(element.name)!;
        data.total += element.amount;
        data.count += 1;
        if (element.dailyValue) {
          data.totalDV += element.dailyValue;
        }
      });
    });

    // Calculate averages
    const averages: ElementAverage[] = [];
    elementMap.forEach((data, name) => {
      averages.push({
        name,
        averageAmount: Math.round((data.total / data.count) * 100) / 100,
        unit: data.unit,
        totalMeals: data.count,
        averageDailyValue: data.totalDV > 0 
          ? Math.round((data.totalDV / data.count) * 100) / 100 
          : undefined
      });
    });

    return averages.sort((a, b) => a.name.localeCompare(b.name));
  }

  deleteMeal(id: string): void {
    const meals = this.getMealHistory();
    const filtered = meals.filter(meal => meal.id !== id);
    this.saveMeals(filtered);
    this.dataUpdated.next();
  }

  clearAllMeals(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
      this.dataUpdated.next();
    }
  }

  private saveMeals(meals: MealEntry[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(meals));
    }
  }

  private generateId(): string {
    return `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
