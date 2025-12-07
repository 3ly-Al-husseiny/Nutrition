import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recommendations } from './recommendations/recommendations';
import { Examinations } from './examinations/examinations';

@Component({
  selector: 'app-mental',
  imports: [CommonModule, Recommendations, Examinations],
  templateUrl: './mental.html',
  styleUrls: ['./mental.css'],
  standalone: true,
})
export class Mental {}
