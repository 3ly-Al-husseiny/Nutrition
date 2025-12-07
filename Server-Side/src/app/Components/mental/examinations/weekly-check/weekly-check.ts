import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MentalService } from '../../../../services/mental.service';
import {
  Section,
  WeeklyCheck,
  SectionResult,
  QuestionAnswer,
} from '../../../../models/examinations.models';

@Component({
  selector: 'app-mental-weekly-check',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './weekly-check.html',
  styleUrls: ['./weekly-check.css'],
})
export class WeeklyCheckComponent implements OnInit {
  @Output() checkCompleted = new EventEmitter<void>();

  currentStep: 'selection' | 'form' | 'results' = 'selection';
  allSections: Section[] = [];
  selectedSections: Section[] = [];
  sectionSelectionForm!: FormGroup;
  weeklyCheckForm!: FormGroup;
  sectionResults: SectionResult[] = [];
  totalScore: number = 0;
  overallResult: string = '';
  isLoading: boolean = true; // Add loading state

  constructor(private fb: FormBuilder, private mentalService: MentalService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = true;
      // Wait for sections to load from JSON
      this.allSections = await this.mentalService.getAllSections();
      console.log('✅ Mental sections loaded in component:', this.allSections.length, this.allSections);
      // Only initialize form after data is loaded
      this.initializeSectionSelectionForm();
    } catch (error) {
      console.error('❌ Error loading mental sections in component:', error);
      this.allSections = [];
    } finally {
      this.isLoading = false;
    }
  }

  initializeSectionSelectionForm(): void {
    if (this.allSections.length === 0) {
      console.warn('⚠️ No mental sections available to initialize form');
      return;
    }
    
    const controls: any = {};
    this.allSections.forEach((section) => {
      controls[section.id] = [false];
    });
    this.sectionSelectionForm = this.fb.group(controls, {
      validators: this.atLeastThreeSelected(),
    });
    console.log('✅ Mental form initialized with', Object.keys(controls).length, 'controls');
  }

  atLeastThreeSelected() {
    return (group: FormGroup) => {
      const selectedCount = Object.keys(group.controls).filter(
        (key) => group.controls[key].value === true
      ).length;
      return selectedCount >= 3 ? null : { minSections: true };
    };
  }

  startCheck(): void {
    if (this.sectionSelectionForm.invalid) {
      alert('Please select at least 3 sections to continue.');
      return;
    }

    // Get selected sections
    const selectedIds = Object.keys(this.sectionSelectionForm.value).filter(
      (key) => this.sectionSelectionForm.value[key] === true
    );

    this.selectedSections = this.allSections.filter((section) => selectedIds.includes(section.id));

    // Build the weekly check form
    this.initializeWeeklyCheckForm();
    this.currentStep = 'form';
  }

  initializeWeeklyCheckForm(): void {
    const formGroups: any = {};

    this.selectedSections.forEach((section) => {
      const questionControls: any = {};
      section.questions.forEach((question) => {
        questionControls[`q${question.id}`] = [false];
      });
      formGroups[section.id] = this.fb.group(questionControls);
    });

    this.weeklyCheckForm = this.fb.group(formGroups);
  }

  submitWeeklyCheck(): void {
    // Calculate results for each section
    this.sectionResults = [];
    const answers: { [sectionId: string]: QuestionAnswer[] } = {};

    this.selectedSections.forEach((section) => {
      const sectionFormGroup = this.weeklyCheckForm.get(section.id) as FormGroup;
      const sectionAnswers: QuestionAnswer[] = [];

      section.questions.forEach((question) => {
        const answer = sectionFormGroup.get(`q${question.id}`)?.value || false;
        sectionAnswers.push({
          questionId: question.id,
          answer,
        });
      });

      answers[section.id] = sectionAnswers;

      const result = this.mentalService.calculateSectionScore(section.id, sectionAnswers);
      if (result) {
        this.sectionResults.push(result);
      }
    });

    // Calculate total score
    this.totalScore = this.mentalService.calculateTotalScore(this.sectionResults);
    this.overallResult = this.mentalService.getOverallResult(this.totalScore);

    // Save to history
    const weeklyCheck: WeeklyCheck = {
      id: this.generateId(),
      date: new Date(),
      selectedSections: this.selectedSections.map((s) => s.id),
      answers,
      sectionResults: this.sectionResults,
      totalScore: this.totalScore,
      overallResult: this.overallResult,
    };

    this.mentalService.saveWeeklyCheck(weeklyCheck);

    // Move to results step
    this.currentStep = 'results';
  }

  generateId(): string {
    return `check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  resetCheck(): void {
    this.currentStep = 'selection';
    this.selectedSections = [];
    this.sectionResults = [];
    this.totalScore = 0;
    this.overallResult = '';
    this.initializeSectionSelectionForm();
    this.checkCompleted.emit();
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

  getTotalScoreClass(): string {
    if (this.totalScore >= 80) return 'score-good';
    if (this.totalScore >= 60) return 'score-needs-exercises';
    return 'score-see-doctor';
  }

  getSectionIcon(sectionName: string): string {
    const section = this.allSections.find((s) => s.displayName === sectionName);
    return section ? section.icon : '📊';
  }
}
