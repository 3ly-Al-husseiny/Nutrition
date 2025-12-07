import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginAuth } from '../../services/auth/login-auth';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: true,
})
export class NavBar {
  isProfileDropdownOpen = false;

  constructor(private authService: LoginAuth) {}

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  closeDropdown() {
    this.isProfileDropdownOpen = false;
  }

  logout() {
    this.closeDropdown();
    this.authService.logout();
  }
}
