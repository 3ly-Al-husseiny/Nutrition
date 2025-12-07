import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginAuth } from './login-auth';

export interface RegisterData {
  step1?: { name: string; age: string; gender: string; height: string; weight: string; email?: string; password?: string };
  step2?: { goals: string[] };
  step3?: { diet: string[] };
  step4?: { activity: string };
}

@Injectable({
  providedIn: 'root'
})
export class RegisterAuth {
  private registrationData = signal<RegisterData>({});

  constructor(
    private router: Router,
    private loginAuth: LoginAuth
  ) {}

  getProfile(): RegisterData | null {
    const stored = localStorage.getItem('userProfile');
    return stored ? JSON.parse(stored) : null;
  }

  updateStep1(data: any) {
    this.registrationData.update(current => ({ ...current, step1: data }));
    this.router.navigate(['/register/step2']);
  }

  updateStep2(data: any) {
    this.registrationData.update(current => ({ ...current, step2: data }));
    this.router.navigate(['/register/step3']);
  }

  updateStep3(data: any) {
    this.registrationData.update(current => ({ ...current, step3: data }));
    this.router.navigate(['/register/step4']);
  }

  updateStep4(data: any) {
    this.registrationData.update(current => ({ ...current, step4: data }));
    this.register();
  }

  private register() {
    const finalData = this.registrationData();
    console.log('Registration Complete:', finalData);
    
    // Create UserProfile object compatible with UserProfileService
    const userProfile = {
      name: finalData.step1?.name || 'User',
      age: Number(finalData.step1?.age) || 0,
      gender: finalData.step1?.gender || 'other',
      photo: 'https://ui-avatars.com/api/?name=' + (finalData.step1?.name || 'User') + '&size=200&background=2d5f3f&color=e8f5e9&bold=true',
      email: finalData.step1?.email,
      // Store other data if needed, or keep it in a separate key
      fullRegistrationData: finalData
    };

    // Save to localStorage for UserProfileService to pick up
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Auto-login
    this.loginAuth.login();
  }
}
