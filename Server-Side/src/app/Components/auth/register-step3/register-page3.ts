import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RegisterAuth } from '../../../services/auth/register-auth';

@Component({
  selector: 'app-register-page3',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page3.html',
  styleUrl: './register-page3.css'
})
export class RegisterPage3 {
  dietForm: FormGroup;

  constructor(private authService: RegisterAuth) {
    this.dietForm = new FormGroup({
      vegetarian: new FormControl(false),
      vegan: new FormControl(false),
      glutenFree: new FormControl(false),
      halal: new FormControl(false),
      kosher: new FormControl(false),
      lactoseFree: new FormControl(false)
    });
  }

  onSubmit() {
    const diet = [];
    const val = this.dietForm.value;
    if (val.vegetarian) diet.push('vegetarian');
    if (val.vegan) diet.push('vegan');
    if (val.glutenFree) diet.push('Gluten-free');
    if (val.halal) diet.push('Halal');
    if (val.kosher) diet.push('kosher');
    if (val.lactoseFree) diet.push('lactose-free');

    this.authService.updateStep3({ diet });
  }
}
