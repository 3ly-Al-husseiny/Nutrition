import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recommendations } from './recommendations/recommendations';
import { Examinations } from './examinations/examinations';

@Component({
  selector: 'app-physical',
  imports: [CommonModule, Recommendations, Examinations],
  templateUrl: './physical.html',
  styleUrls: ['./physical.css'],
  standalone: true,
})
export class Physical {}
