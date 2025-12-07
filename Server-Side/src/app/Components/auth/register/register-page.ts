import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RegisterAuth } from '../../../services/auth/register-auth';
import { AuthService } from '../../../services/auth/auth.service';
import { UserProfile } from '../../../services/user-profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css'
})
export class RegisterPage {
  regForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Photo upload properties
  photoPreview: string = 'https://ui-avatars.com/api/?name=User&size=200&background=2d5f3f&color=e8f5e9&bold=true';
  photoFileName: string = '';
  selectedPhoto: File | null = null;
  photoBase64: string = '';

  constructor(
    private authService: RegisterAuth,
    private newAuthService: AuthService,
    private router: Router
  ) {
    this.regForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'gender': new FormControl('', Validators.required),
      'weight': new FormControl('', [Validators.required, Validators.min(35), Validators.max(250)]),
      'height': new FormControl('', [Validators.required, Validators.min(90), Validators.max(220)])
    });
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;
      this.photoFileName = file.name;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
        this.photoBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.regForm.valid) {
      const profile: UserProfile = {
        name: this.regForm.value.name,
        email: this.regForm.value.email,
        password: this.regForm.value.password,
        weight: Number(this.regForm.value.weight),
        height: Number(this.regForm.value.height),
        age: 25, // Default value
        gender: this.regForm.value.gender,
        photo: this.photoBase64 || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.regForm.value.name)}&size=200&background=2d5f3f&color=e8f5e9&bold=true`
      };

      this.newAuthService.register(profile).subscribe(result => {
        if (result.success) {
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = result.message;
        }
      });
    } else {
      this.errorMessage = 'Please fill in all fields correctly';
    }
  }
}
