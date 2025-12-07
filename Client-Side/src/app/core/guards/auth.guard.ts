import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginAuth } from '../../services/auth/login-auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(LoginAuth);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect to login page if not authenticated
  return router.createUrlTree(['/login']);
};
