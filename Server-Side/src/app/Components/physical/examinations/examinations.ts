import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { WeeklyCheckComponent } from './weekly-check/weekly-check';
import { HistoryComponent } from './history/history';
import { AnalysisComponent } from './analysis/analysis';
import { ExaminationsService } from '../../../services/examinations.service';
import { WeeklyCheck } from '../../../models/examinations.models';

interface QuickStats {
  totalChecks: number;
  averageScore: number;
  bestScore: number;
  improvementRate: number;
}

@Component({
  selector: 'app-physical-examinations',
  imports: [CommonModule, WeeklyCheckComponent, HistoryComponent, AnalysisComponent],
  templateUrl: './examinations.html',
  styleUrls: ['./examinations.css'],
  standalone: true,
})
export class Examinations implements OnInit, OnDestroy {
  showWeeklyCheckModal = false;
  showHistoryModal = false;
  stats: QuickStats | null = null;
  private dataSubscription?: Subscription;

  constructor(private examinationsService: ExaminationsService) {}

  ngOnInit(): void {
    this.loadStats();
    
    // Subscribe to data updates for reactive stats display
    this.dataSubscription = this.examinationsService.dataUpdated$.subscribe(() => {
      this.loadStats();
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadStats(): void {
    const weeklyChecks = this.examinationsService.getHistory();

    if (weeklyChecks.length === 0) {
      this.stats = null;
      return;
    }

    const totalChecks = weeklyChecks.length;
    const scores = weeklyChecks.map((check) => check.totalScore);
    const averageScore = scores.reduce((a, b) => a + b, 0) / totalChecks;
    const bestScore = Math.max(...scores);

    // Calculate improvement rate
    let improvementRate = 0;
    if (totalChecks >= 2) {
      const firstScore = weeklyChecks[weeklyChecks.length - 1].totalScore;
      const lastScore = weeklyChecks[0].totalScore;
      improvementRate = ((lastScore - firstScore) / firstScore) * 100;
    }

    this.stats = {
      totalChecks,
      averageScore: Math.round(averageScore * 100) / 100,
      bestScore: Math.round(bestScore * 100) / 100,
      improvementRate: Math.round(improvementRate * 100) / 100,
    };
  }

  openWeeklyCheck() {
    this.showWeeklyCheckModal = true;
  }

  openHistory() {
    this.showHistoryModal = true;
  }

  closeWeeklyCheck() {
    this.showWeeklyCheckModal = false;
  }

  closeHistory() {
    this.showHistoryModal = false;
  }

  onCheckCompleted() {
    // Close weekly check and open history modal, then refresh stats
    this.showWeeklyCheckModal = false;
    this.showHistoryModal = true;
    this.loadStats();
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'score-good';
    if (score >= 60) return 'score-needs-exercises';
    return 'score-see-doctor';
  }

  getImprovementClass(): string {
    if (!this.stats) return '';
    if (this.stats.improvementRate > 0) return 'positive';
    if (this.stats.improvementRate < 0) return 'negative';
    return 'neutral';
  }
}
