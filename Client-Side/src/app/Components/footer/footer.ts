import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
  standalone: true,
})
export class Footer {
  currentYear = new Date().getFullYear();
}
