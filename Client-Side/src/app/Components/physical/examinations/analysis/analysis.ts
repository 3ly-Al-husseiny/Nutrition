import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ExaminationsService } from '../../../../services/examinations.service';
import { WeeklyCheck, SectionResult } from '../../../../models/examinations.models';

interface TrendData {
  date: string;
  score: number;
}

interface SectionTrend {
  sectionName: string;
  data: TrendData[];
  averageScore: number;
  trend: 'improving' | 'declining' | 'stable';
}

interface AnalysisStats {
  totalChecks: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  mostCommonSections: string[];
  improvementRate: number;
}

@Component({
  selector: 'app-physical-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis.html',
  styleUrls: ['./analysis.css'],
})
export class AnalysisComponent implements OnInit, OnDestroy {
  weeklyChecks: WeeklyCheck[] = [];
  stats: AnalysisStats | null = null;
  sectionTrends: SectionTrend[] = [];
  recentChecks: WeeklyCheck[] = [];
  showNoDataMessage = false;
  private dataSubscription?: Subscription;

  constructor(private examinationsService: ExaminationsService) {}

  ngOnInit(): void {
    this.loadAnalysisData();
    
    // Subscribe to data updates
    this.dataSubscription = this.examinationsService.dataUpdated$.subscribe(() => {
      this.loadAnalysisData();
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadAnalysisData(): void {
    this.weeklyChecks = this.examinationsService.getHistory();

    if (this.weeklyChecks.length === 0) {
      this.showNoDataMessage = true;
      return;
    }

    this.showNoDataMessage = false;
    this.calculateStats();
    this.calculateSectionTrends();
    this.recentChecks = this.weeklyChecks.slice(0, 5);
  }

  calculateStats(): void {
    const totalChecks = this.weeklyChecks.length;
    const scores = this.weeklyChecks.map((check) => check.totalScore);
    const averageScore = scores.reduce((a, b) => a + b, 0) / totalChecks;
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);

    // Calculate most common sections
    const sectionCounts: { [key: string]: number } = {};
    this.weeklyChecks.forEach((check) => {
      check.selectedSections.forEach((section) => {
        sectionCounts[section] = (sectionCounts[section] || 0) + 1;
      });
    });

    const mostCommonSections = Object.entries(sectionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([section]) => this.getSectionDisplayName(section));

    // Calculate improvement rate
    let improvementRate = 0;
    if (totalChecks >= 2) {
      const firstScore = this.weeklyChecks[this.weeklyChecks.length - 1].totalScore;
      const lastScore = this.weeklyChecks[0].totalScore;
      improvementRate = ((lastScore - firstScore) / firstScore) * 100;
    }

    this.stats = {
      totalChecks,
      averageScore: Math.round(averageScore * 100) / 100,
      bestScore,
      worstScore,
      mostCommonSections,
      improvementRate: Math.round(improvementRate * 100) / 100,
    };
  }

  calculateSectionTrends(): void {
    const sectionData: { [key: string]: { scores: number[]; dates: string[] } } = {};

    // Collect data for each section
    this.weeklyChecks.forEach((check) => {
      check.sectionResults.forEach((result) => {
        if (!sectionData[result.sectionId]) {
          sectionData[result.sectionId] = { scores: [], dates: [] };
        }
        sectionData[result.sectionId].scores.push(result.normalizedScore);
        sectionData[result.sectionId].dates.push(this.formatDate(check.date));
      });
    });

    // Calculate trends
    this.sectionTrends = Object.entries(sectionData).map(([sectionId, data]) => {
      // Take only the last 5 checks for each section
      const last5Scores = data.scores.slice(0, 5);
      const last5Dates = data.dates.slice(0, 5);

      const averageScore = last5Scores.reduce((a, b) => a + b, 0) / last5Scores.length;

      // Determine trend
      let trend: 'improving' | 'declining' | 'stable' = 'stable';
      if (last5Scores.length >= 2) {
        const firstHalf = last5Scores.slice(0, Math.ceil(last5Scores.length / 2));
        const secondHalf = last5Scores.slice(Math.ceil(last5Scores.length / 2));
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

        if (secondAvg > firstAvg + 5) trend = 'improving';
        else if (secondAvg < firstAvg - 5) trend = 'declining';
      }

      const trendData: TrendData[] = last5Scores.map((score, idx) => ({
        date: last5Dates[idx],
        score,
      }));

      return {
        sectionName: this.getSectionDisplayName(sectionId),
        data: trendData,
        averageScore: Math.round(averageScore * 100) / 100,
        trend,
      };
    });
  }

  getSectionDisplayName(sectionId: string): string {
    const displayNames: { [key: string]: string } = {
      lower_back: 'Lower Back',
      shoulder: 'Shoulder',
      eyes: 'Eyes',
      energy_focus: 'Energy & Focus',
    };
    return displayNames[sectionId] || sectionId;
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'score-good';
    if (score >= 60) return 'score-needs-exercises';
    return 'score-see-doctor';
  }

  getTrendIcon(trend: string): string {
    if (trend === 'improving') return '↑';
    if (trend === 'declining') return '↓';
    return '→';
  }

  getTrendClass(trend: string): string {
    if (trend === 'improving') return 'trend-improving';
    if (trend === 'declining') return 'trend-declining';
    return 'trend-stable';
  }

  getBarHeight(score: number): string {
    return `${score}%`;
  }

  getImprovementClass(): string {
    if (!this.stats) return '';
    if (this.stats.improvementRate > 0) return 'positive';
    if (this.stats.improvementRate < 0) return 'negative';
    return 'neutral';
  }
}
