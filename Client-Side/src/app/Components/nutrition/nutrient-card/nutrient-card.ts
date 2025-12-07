// src/app/components/nutrient-card/nutrient-card.component.ts - UPDATED
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Nutrient {
  name: string;
  percentage: number;
  status: 'Low' | 'Good' | 'On Track' | 'Achieved';
  progressClass: string;
}

@Component({
  selector: 'app-nutrient-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nutrient-card.html',
  styleUrls: ['./nutrient-card.css']
})
export class NutrientCard implements OnInit {
  @Input() nutrient!: Nutrient;
  progressStyles: any = {};

  ngOnInit(): void {
    this.setProgressStyles();
  }

  setProgressStyles(): void {
    let color: string;
    
    // Determine color based on status
    if (this.nutrient.progressClass === 'low') {
      color = '#f44336'; // red
    } else if (this.nutrient.progressClass === 'good') {
      color = '#ff9800'; // orange
    } else if (this.nutrient.progressClass === 'on-track') {
      color = '#2196f3'; // blue
    } else {
      color = '#4caf50'; // green
    }

    this.progressStyles = {
      '--progress-percentage': this.nutrient.percentage,
      '--progress-color': color
    };
  }
}