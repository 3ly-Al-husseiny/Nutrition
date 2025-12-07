import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserProfile } from '../user-profile.service';

export interface StoredUser {
  email: string;
  password: string;
  profile: UserProfile;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'registered_users';
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    if (currentUserEmail) {
      const users = this.loadUsersFromStorage();
      const user = users.find(u => u.email === currentUserEmail);
      if (user) {
        this.currentUserSubject.next(user.profile);
      }
    }
  }

  register(profile: UserProfile): Observable<{ success: boolean; message: string }> {
    const users = this.loadUsersFromStorage();
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === profile.email);
    if (existingUser) {
      return of({ success: false, message: 'Email already registered' });
    }

    // Add new user
    const newUser: StoredUser = {
      email: profile.email,
      password: profile.password,
      profile: profile
    };

    users.push(newUser);
    this.saveUsersToStorage(users);

    return of({ success: true, message: 'Registration successful' });
  }

  login(email: string, password: string): Observable<{ success: boolean; message: string; user?: UserProfile }> {
    const users = this.loadUsersFromStorage();
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Set current user
      localStorage.setItem('currentUserEmail', email);
      localStorage.setItem('userProfile', JSON.stringify(user.profile));
      this.currentUserSubject.next(user.profile);
      
      return of({ 
        success: true, 
        message: 'Login successful',
        user: user.profile
      });
    } else {
      return of({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
  }

  logout(): void {
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('userProfile');
    this.currentUserSubject.next(null);
  }

  updateUserProfile(updatedProfile: UserProfile): Observable<{ success: boolean; message: string }> {
    const users = this.loadUsersFromStorage();
    const currentEmail = localStorage.getItem('currentUserEmail');
    
    if (!currentEmail) {
      return of({ success: false, message: 'No user logged in' });
    }

    const userIndex = users.findIndex(u => u.email === currentEmail);
    
    if (userIndex !== -1) {
      // Update the user's profile
      users[userIndex].profile = updatedProfile;
      
      // If email changed, update the key
      if (updatedProfile.email !== currentEmail) {
        users[userIndex].email = updatedProfile.email;
        localStorage.setItem('currentUserEmail', updatedProfile.email);
      }
      
      this.saveUsersToStorage(users);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      this.currentUserSubject.next(updatedProfile);
      
      return of({ success: true, message: 'Profile updated successfully' });
    }

    return of({ success: false, message: 'User not found' });
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUserEmail');
  }

  private loadUsersFromStorage(): StoredUser[] {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.USERS_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Error parsing users:', e);
          return [];
        }
      }
    }
    return [];
  }

  private saveUsersToStorage(users: StoredUser[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }
}
