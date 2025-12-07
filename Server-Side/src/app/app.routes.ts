import { Physical } from './Components/physical/physical';
import { Mental } from './Components/mental/mental';
import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./Components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./Components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'library',
    loadComponent: () => import('./Components/library/library').then((m) => m.LibraryPage),
    canActivate: [authGuard],
  },
  {
    path: 'library/:id',
    loadComponent: () =>
      import('./Components/resource-detail/resource-detail').then((m) => m.ResourceDetailPage),
    canActivate: [authGuard],
  },
  {
    path: 'physical',
    component: Physical,
    canActivate: [authGuard],
  },
  {
    path: 'mental',
    component: Mental,
    canActivate: [authGuard],
  },
  {
    path: 'nutrition',
    loadComponent: () =>
      import('./Components/nutrition/nutrition').then((m) => m.NutritionComponent),
    canActivate: [authGuard],
  },
  {
    path: 'challenging/list',
    loadComponent: () =>
      import('./Components/challenging/challenges-list/challenges-list.component').then(
        (m) => m.ChallengesListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'challenging/progress',
    loadComponent: () =>
      import('./Components/challenging/progress/progress.component').then(
        (m) => m.ProgressComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'challenging/:id',
    loadComponent: () =>
      import('./Components/challenging/challenge-details/challenge-details.component').then(
        (m) => m.ChallengeDetailsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'user-profile',
    loadComponent: () =>
      import('./Components/user-profile/user-profile').then((m) => m.UserProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./Components/settings/settings').then((m) => m.SettingsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./Components/auth/login/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./Components/auth/register/register-page').then((m) => m.RegisterPage),
  },
  {
    path: 'register/step2',
    loadComponent: () =>
      import('./Components/auth/register-step2/register-page2').then((m) => m.RegisterPage2),
  },
  {
    path: 'register/step3',
    loadComponent: () =>
      import('./Components/auth/register-step3/register-page3').then((m) => m.RegisterPage3),
  },
  {
    path: 'register/step4',
    loadComponent: () =>
      import('./Components/auth/register-step4/register-page4').then((m) => m.RegisterPage4),
  },
];
