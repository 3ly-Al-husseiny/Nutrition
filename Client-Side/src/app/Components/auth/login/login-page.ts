import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { LoginAuth } from '../../../services/auth/login-auth';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  
  constructor(
    private authService: LoginAuth,
    private newAuthService: AuthService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)]
      })
    });
  }
  
  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      
      this.newAuthService.login(email, password).subscribe(result => {
        if (result.success) {
          this.successMessage = result.message;
          // Use the old auth service to set logged in state and navigate
          this.authService.login();
        } else {
          this.errorMessage = result.message;
        }
      });
    } else {
      this.errorMessage = 'Please fill in all fields correctly';
    }
  }
}
