import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RegisterAuth } from '../../../services/auth/register-auth';

@Component({
  selector: 'app-register-page4',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page4.html',
  styleUrl: './register-page4.css'
})
export class RegisterPage4 {
  activityForm: FormGroup;

  constructor(private authService: RegisterAuth) {
    this.activityForm = new FormGroup({
      activity: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    if (this.activityForm.valid) {
      this.authService.updateStep4(this.activityForm.value);
    }
  }
}
