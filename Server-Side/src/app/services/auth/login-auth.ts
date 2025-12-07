import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginAuth {
  // Signal to track login state
  private isLoggedInSignal = signal<boolean>(this.checkInitialLoginState());
  
  // Publicly exposed readonly signal
  isLoggedIn = computed(() => this.isLoggedInSignal());

  constructor(private router: Router) {}

  private checkInitialLoginState(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  }

  login() {
    localStorage.setItem('isLoggedIn', 'true');
    this.isLoggedInSignal.set(true);
    this.router.navigate(['/physical']);
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedInSignal.set(false);
    this.router.navigate(['/login']);
  }
}
