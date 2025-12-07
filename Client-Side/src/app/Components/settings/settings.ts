import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileService, UserProfile } from '../../services/user-profile.service';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  userName: string = '';
  userAge: number = 0;
  userGender: string = '';
  userPhoto: string = '';
  userEmail: string = '';
  userWeight: number = 0;
  userHeight: number = 0;

  private originalData: UserProfile = {
    name: '',
    age: 0,
    gender: '',
    photo: '',
    email: '',
    password: '',
    weight: 0,
    height: 0
  };

  private profileSubscription?: Subscription;

  constructor(
    private userProfileService: UserProfileService,
    private authService: AuthService
  ) {}

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.userPhoto = e.target.result as string;
        }
      };

      reader.readAsDataURL(file);
    }
  }

  onSave(): void {
    const updatedProfile: UserProfile = {
      name: this.userName,
      age: this.userAge,
      gender: this.userGender,
      photo: this.userPhoto,
      email: this.userEmail,
      password: this.originalData.password, // Keep existing password
      weight: this.userWeight,
      height: this.userHeight
    };

    // Update both services
    this.userProfileService.updateProfile(updatedProfile);
    this.authService.updateUserProfile(updatedProfile).subscribe(result => {
      if (result.success) {
        this.originalData = { ...updatedProfile };
        this.showNotification('Profile updated successfully!', 'success');
      } else {
        this.showNotification('Failed to update profile', 'error');
      }
    });
  }

  onCancel(): void {
    this.userName = this.originalData.name;
    this.userAge = this.originalData.age;
    this.userGender = this.originalData.gender;
    this.userPhoto = this.originalData.photo;
    this.userEmail = this.originalData.email;
    this.userWeight = this.originalData.weight;
    this.userHeight = this.originalData.height;

    this.showNotification('Changes cancelled', 'info');
  }

  private showNotification(message: string, type: 'success' | 'info' | 'error'): void {
    const notification = document.createElement('div');
    notification.textContent = message;
    const bgColor = type === 'success' 
      ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)' 
      : type === 'error'
      ? 'linear-gradient(135deg, #f44336 0%, #c62828 100%)'
      : 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)';
    
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 16px 24px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-weight: 600;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Reset all challenge data (for testing purposes)
   * Clears points, badges, and active challenges
   */
  resetChallengeData(): void {
    const confirmed = confirm(
      '⚠️ Reset Challenge Data?\n\n' +
      'This will clear:\n' +
      '• All points (back to 0)\n' +
      '• All earned badges\n' +
      '• All active challenges\n\n' +
      'Are you sure you want to continue?'
    );

    if (confirmed) {
      try {
        localStorage.removeItem('challengesDetoxData');
        this.showNotification('Challenge data reset successfully! Refreshing...', 'success');
        
        // Reload page after short delay to show notification
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error('Error resetting challenge data:', error);
        this.showNotification('Failed to reset challenge data', 'error');
      }
    }
  }

  ngOnInit(): void {
    this.profileSubscription = this.userProfileService.profile$.subscribe(profile => {
      this.userName = profile.name;
      this.userAge = profile.age;
      this.userGender = profile.gender;
      this.userPhoto = profile.photo;
      this.userEmail = profile.email;
      this.userWeight = profile.weight;
      this.userHeight = profile.height;
      this.originalData = { ...profile };
    });
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }
}
