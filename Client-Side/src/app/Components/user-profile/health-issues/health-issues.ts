import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExaminationsService } from '../../../services/examinations.service';
import { MentalService } from '../../../services/mental.service';
import { Subscription, interval } from 'rxjs';

interface HealthIssue {
  concern: string;
  severity: 'low' | 'medium' | 'high';
  source: 'physical' | 'mental';
  icon: string;
  score: number;
}

interface SectionHealth {
  sectionName: string;
  averageScore: number;
  isIssue: boolean;
}

@Component({
  selector: 'app-health-issues',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-issues.html',
  styleUrls: ['./health-issues.css']
})
export class HealthIssuesComponent implements OnInit, OnDestroy {
  healthIssues: HealthIssue[] = [];
  private updateSubscription?: Subscription;
  private dataSubscription?: Subscription;
  
  // Debug info to display in UI
  debugInfo: {
    physicalRecordCount: number;
    mentalRecordCount: number;
    physicalSections: SectionHealth[];
    mentalSections: SectionHealth[];
  } | null = null;

  constructor(
    private examinationsService: ExaminationsService,
    private mentalService: MentalService
  ) {}

  forceRefresh(): void {
    console.log('🔄 Manual refresh triggered');
    this.updateHealthIssues();
  }

  ngOnInit(): void {
    // Update immediately
    this.updateHealthIssues();

    // Subscribe to examination data updates
    this.dataSubscription = this.examinationsService.dataUpdated$.subscribe(() => {
      console.log('📡 Examination data updated - refreshing health issues');
      this.updateHealthIssues();
    });

    // Poll for updates every 3 seconds as backup
    this.updateSubscription = interval(3000).subscribe(() => {
      this.updateHealthIssues();
    });

    // Listen for storage changes
    window.addEventListener('storage', () => {
      console.log('📡 Storage event detected - refreshing health issues');
      this.updateHealthIssues();
    });
  }

  private updateHealthIssues(): void {
    const issues: HealthIssue[] = [];
    const HEALTH_THRESHOLD = 85; // Section below 85% is an issue

    // ============ PHYSICAL EXAMINATIONS ============
    // Get Physical examination history (same as Analysis component)
    const physicalHistory = this.examinationsService.getHistory();
    const physicalSectionHealths: SectionHealth[] = [];
    
    console.log('🏃 Physical Examination Records:', physicalHistory.length);

    if (physicalHistory.length > 0) {
      // Collect all section scores
      const sectionScores: { [key: string]: { name: string; scores: number[] } } = {};

      physicalHistory.forEach(check => {
        check.sectionResults.forEach(result => {
          if (!sectionScores[result.sectionId]) {
            sectionScores[result.sectionId] = { name: result.sectionName, scores: [] };
          }
          sectionScores[result.sectionId].scores.push(result.normalizedScore);
        });
      });

      // Calculate average for each section and check if below threshold
      Object.entries(sectionScores).forEach(([sectionId, data]) => {
        const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
        const isIssue = avgScore < HEALTH_THRESHOLD;
        
        physicalSectionHealths.push({
          sectionName: data.name,
          averageScore: Math.round(avgScore * 100) / 100,
          isIssue: isIssue
        });

        console.log(`  📊 ${data.name}: ${avgScore.toFixed(1)}% ${isIssue ? '❌ ISSUE' : '✅ OK'}`);

        if (isIssue) {
          const severity = avgScore < 60 ? 'high' : 'medium';
          const icon = this.getPhysicalIcon(sectionId);
          
          issues.push({
            concern: data.name,
            severity: severity,
            source: 'physical',
            icon: icon,
            score: Math.round(avgScore)
          });
        }
      });
    }

    // ============ MENTAL EXAMINATIONS ============
    // Get Mental examination history
    const mentalHistory = this.mentalService.getHistory();
    const mentalSectionHealths: SectionHealth[] = [];
    
    console.log('🧠 Mental Examination Records:', mentalHistory.length);

    if (mentalHistory.length > 0) {
      // Collect all section scores
      const sectionScores: { [key: string]: { name: string; scores: number[] } } = {};

      mentalHistory.forEach(check => {
        check.sectionResults.forEach(result => {
          if (!sectionScores[result.sectionId]) {
            sectionScores[result.sectionId] = { name: result.sectionName, scores: [] };
          }
          sectionScores[result.sectionId].scores.push(result.normalizedScore);
        });
      });

      // Calculate average for each section and check if below threshold
      Object.entries(sectionScores).forEach(([sectionId, data]) => {
        const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
        const isIssue = avgScore < HEALTH_THRESHOLD;
        
        mentalSectionHealths.push({
          sectionName: data.name,
          averageScore: Math.round(avgScore * 100) / 100,
          isIssue: isIssue
        });

        console.log(`  📊 ${data.name}: ${avgScore.toFixed(1)}% ${isIssue ? '❌ ISSUE' : '✅ OK'}`);

        if (isIssue) {
          const severity = avgScore < 60 ? 'high' : 'medium';
          
          issues.push({
            concern: data.name,
            severity: severity,
            source: 'mental',
            icon: '🧠',
            score: Math.round(avgScore)
          });
        }
      });
    }

    // Populate debug info for UI display
    this.debugInfo = {
      physicalRecordCount: physicalHistory.length,
      mentalRecordCount: mentalHistory.length,
      physicalSections: physicalSectionHealths,
      mentalSections: mentalSectionHealths
    };

    this.healthIssues = issues;
    console.log('🏥 Health issues updated:', issues.length, 'concerns detected:', issues.map(i => `${i.concern} (${i.score}%)`));
  }

  private getPhysicalIcon(sectionId: string): string {
    const icons: { [key: string]: string } = {
      'lower_back': '🧍',
      'shoulder': '💪',
      'eyes': '👁️',
      'energy_focus': '⚡'
    };
    return icons[sectionId] || '❤️';
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}