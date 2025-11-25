import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const currentUser = authService.currentUser();
  
  if (currentUser && currentUser.role === UserRole.ADMIN) {
    return true;
  }
  
  // Redirect to dashboard if not admin
  router.navigate(['/dashboard']);
  return false;
};
