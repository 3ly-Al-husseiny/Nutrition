import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExaminationsService } from '../../../../services/examinations.service';
import { WeeklyCheck, SectionResult } from '../../../../models/examinations.models';

@Component({
  selector: 'app-physical-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css'],
})
export class HistoryComponent implements OnInit {
  weeklyChecks: WeeklyCheck[] = [];
  expandedCheckId: string | null = null;

  constructor(private examinationsService: ExaminationsService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.weeklyChecks = this.examinationsService
      .getHistory()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  toggleDetails(checkId: string): void {
    this.expandedCheckId = this.expandedCheckId === checkId ? null : checkId;
  }

  isExpanded(checkId: string): boolean {
    return this.expandedCheckId === checkId;
  }

  deleteCheck(checkId: string): void {
    if (confirm('Are you sure you want to delete this weekly check?')) {
      this.examinationsService.deleteWeeklyCheck(checkId);
      this.loadHistory();
    }
  }

  clearAllHistory(): void {
    if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      this.examinationsService.clearHistory();
      this.loadHistory();
    }
  }

  getResultClass(result: string): string {
    switch (result) {
      case 'Good':
        return 'result-good';
      case 'Needs Exercises':
        return 'result-needs-exercises';
      case 'See Doctor':
        return 'result-see-doctor';
      default:
        return '';
    }
  }

  getTotalScoreClass(score: number): string {
    if (score >= 80) return 'score-good';
    if (score >= 60) return 'score-needs-exercises';
    return 'score-see-doctor';
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getSectionDisplayName(sectionId: string): string {
    const displayNames: { [key: string]: string } = {
      lower_back: 'Lower Back',
      shoulder: 'Shoulder',
      eyes: 'Eyes',
      energy_focus: 'Energy & Headache & Focus',
    };
    return displayNames[sectionId] || sectionId;
  }

  getSectionIcon(sectionId: string): string {
    const icons: { [key: string]: string } = {
      lower_back: '🦴',
      shoulder: '💪',
      eyes: '👁️',
      energy_focus: '⚡',
    };
    return icons[sectionId] || '📊';
  }

  getSectionIdFromName(sectionName: string): string {
    const nameToId: { [key: string]: string } = {
      'Lower Back': 'lower_back',
      Shoulder: 'shoulder',
      Eyes: 'eyes',
      'Energy & Headache & Focus': 'energy_focus',
    };
    return nameToId[sectionName] || '';
  }
}
