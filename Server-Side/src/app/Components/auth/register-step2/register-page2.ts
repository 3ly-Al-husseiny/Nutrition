import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RegisterAuth } from '../../../services/auth/register-auth';

@Component({
  selector: 'app-register-page2',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page2.html',
  styleUrl: './register-page2.css'
})
export class RegisterPage2 {
  goalsForm: FormGroup;

  constructor(private authService: RegisterAuth) {
    this.goalsForm = new FormGroup({
      lossWeight: new FormControl(false),
      muscleBuilding: new FormControl(false),
      manageDiabetes: new FormControl(false),
      generalWellness: new FormControl(false),
      betterNutrition: new FormControl(false),
      moreEnergy: new FormControl(false)
    });
  }

  onSubmit() {
    const goals = [];
    const val = this.goalsForm.value;
    if (val.lossWeight) goals.push('loss weight');
    if (val.muscleBuilding) goals.push('muscle building');
    if (val.manageDiabetes) goals.push('manage diabetes');
    if (val.generalWellness) goals.push('general wellness');
    if (val.betterNutrition) goals.push('better nutrition');
    if (val.moreEnergy) goals.push('more energy');

    this.authService.updateStep2({ goals });
  }
}
