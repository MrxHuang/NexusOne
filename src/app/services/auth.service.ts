import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { User, UserRole } from '../models/user.model';
import { MockDataService } from './mock-data.service';
import { of, delay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mockDataService = inject(MockDataService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // Signals
  currentUser = signal<User | null>(this.loadUserFromStorage());
  isAuthenticated = computed(() => this.currentUser() !== null);
  userRole = computed(() => this.currentUser()?.role);

  constructor() {}

  login(email: string, role: UserRole) {
    // Simulate API call
    const user = this.mockDataService.getUsers().find(u => u.email === email && u.role === role) 
                 || this.mockDataService.getUsers().find(u => u.role === role); // Fallback for demo

    return of(user).pipe(
      delay(800), // Simulate network delay
      tap(user => {
        if (user) {
          this.currentUser.set(user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.router.navigate(['/dashboard']);
        } else {
          throw new Error('Invalid credentials');
        }
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.router.navigate(['/login']);
  }

  hasRole(allowedRoles: UserRole[]): boolean {
    const user = this.currentUser();
    return user ? allowedRoles.includes(user.role) : false;
  }

  private loadUserFromStorage(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }
}
