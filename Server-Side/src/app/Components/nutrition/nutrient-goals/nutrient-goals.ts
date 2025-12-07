// src/app/components/nutrient-goals/nutrient-goals.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NutrientCard, Nutrient as NutrientCardInterface } from '../nutrient-card/nutrient-card'; // Import Nutrient as an alias

@Component({
  selector: 'app-nutrient-goals',
  standalone: true,
  imports: [CommonModule, NutrientCard],
  templateUrl: './nutrient-goals.html',
  styleUrls: ['./nutrient-goals.css']
})
export class NutrientGoals {
  @Output() addGoalClicked = new EventEmitter<void>();

  nutrients: NutrientCardInterface[] = [
    { name: 'Iron', percentage: 40, status: 'Low', progressClass: 'low' },
    { name: 'Vitamin C', percentage: 90, status: 'On Track', progressClass: 'on-track' },
    { name: 'Vitamin B12', percentage: 100, status: 'Achieved', progressClass: 'achieved' }
  ];

  addNutrientGoal(): void {
    this.addGoalClicked.emit();
  }
}