import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentalService } from '../../../../services/mental.service';
import { WeeklyCheck, SectionResult } from '../../../../models/examinations.models';

@Component({
  selector: 'app-mental-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css'],
})
export class HistoryComponent implements OnInit {
  weeklyChecks: WeeklyCheck[] = [];
  expandedCheckId: string | null = null;

  constructor(private mentalService: MentalService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.weeklyChecks = this.mentalService
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
    if (confirm('Are you sure you want to delete this mental health check?')) {
      this.mentalService.deleteWeeklyCheck(checkId);
      this.loadHistory();
    }
  }

  clearAllHistory(): void {
    if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      this.mentalService.clearHistory();
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
      stress_mental_load: 'Stress & Mental Load',
      focus_attention: 'Focus & Attention',
      motivation_productivity: 'Motivation & Productivity',
      sleep_recovery: 'Sleep & Mental Recovery',
      emotional_wellbeing: 'Emotional Wellbeing & Mood',
      digital_overuse: 'Digital Overuse / Tech Fatigue',
    };
    return displayNames[sectionId] || sectionId;
  }

  getSectionIcon(sectionId: string): string {
    const icons: { [key: string]: string } = {
      stress_mental_load: '🧠',
      focus_attention: '🎯',
      motivation_productivity: '🚀',
      sleep_recovery: '😴',
      emotional_wellbeing: '💙',
      digital_overuse: '📱',
    };
    return icons[sectionId] || '📊';
  }

  getSectionIdFromName(sectionName: string): string {
    const nameToId: { [key: string]: string } = {
      'Stress & Mental Load': 'stress_mental_load',
      'Focus & Attention': 'focus_attention',
      'Motivation & Productivity': 'motivation_productivity',
      'Sleep & Mental Recovery': 'sleep_recovery',
      'Emotional Wellbeing & Mood': 'emotional_wellbeing',
      'Digital Overuse / Tech Fatigue': 'digital_overuse',
    };
    return nameToId[sectionName] || '';
  }
}
