import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { User, UserRole } from '../models/user.model';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  specialization?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // Signals
  currentUser = signal<User | null>(this.loadUserFromStorage());
  isAuthenticated = computed(() => this.currentUser() !== null);
  userRole = computed(() => this.currentUser()?.role);

  constructor() {}

  login(email: string, password: string, role: UserRole) {
    const loginRequest: LoginRequest = { email, password, role };
    
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, loginRequest).pipe(
      tap(response => {
        if (response && response.token) {
          // Normalize role from backend to ensure it matches UserRole enum
          response.user.role = this.normalizeRole(response.user.role as any);
          this.currentUser.set(response.user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
          this.router.navigate(['/dashboard']);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        
        // User-friendly error messages in Spanish
        let errorMessage = 'Error al iniciar sesión. Por favor intenta de nuevo.';
        
        if (error.status === 401) {
          errorMessage = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
        } else if (error.status === 403) {
          errorMessage = 'No tienes permisos para acceder con este rol.';
        } else if (error.status === 404) {
          errorMessage = 'Servicio no disponible. Contacta al administrador.';
        } else if (error.status === 0) {
          errorMessage = 'No se puede conectar al servidor. Verifica tu conexión.';
        } else if (error.status >= 500) {
          errorMessage = 'Error del servidor. Por favor intenta más tarde.';
        }
        
        throw new Error(errorMessage);
      })
    );
  }

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, request).pipe(
      tap(response => {
        if (response && response.token) {
          // Normalize role from backend to ensure it matches UserRole enum
          response.user.role = this.normalizeRole(response.user.role as any);
          this.currentUser.set(response.user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
          this.router.navigate(['/dashboard']);
        }
      }),
      catchError(error => {
        console.error('Registration error:', error);
        
        // User-friendly error messages in Spanish
        let errorMessage = 'Error al registrarse. Por favor intenta de nuevo.';
        
        if (error.status === 409) {
          errorMessage = 'Este correo ya está registrado. Intenta iniciar sesión.';
        } else if (error.status === 400) {
          errorMessage = 'Datos inválidos. Verifica la información ingresada.';
        } else if (error.status === 0) {
          errorMessage = 'No se puede conectar al servidor. Verifica tu conexión.';
        } else if (error.status >= 500) {
          errorMessage = 'Error del servidor. Por favor intenta más tarde.';
        }
        
        throw new Error(errorMessage);
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.router.navigate(['/login']);
  }

  refreshCurrentUser() {
    const userId = this.currentUser()?.id;
    if (!userId) return of(null);

    return this.http.get<User>(`${environment.apiUrl}/users/${userId}`).pipe(
      tap(user => {
        // Normalize role from backend to ensure it matches UserRole enum
        user.role = this.normalizeRole(user.role as any);
        this.currentUser.set(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }),
      catchError(error => {
        console.error('Error refreshing user:', error);
        return of(null);
      })
    );
  }

  hasRole(allowedRoles: UserRole[]): boolean {
    const user = this.currentUser();
    return user ? allowedRoles.includes(user.role) : false;
  }

  private normalizeRole(rawRole: string): UserRole {
    if (!rawRole) {
      return UserRole.RESEARCHER;
    }

    const value = rawRole.toString().trim().toUpperCase();

    if (value === 'ADMIN' || value.includes('ADMIN')) {
      return UserRole.ADMIN;
    }

    if (value === 'EVALUATOR' || value === 'EVALUADOR' || value.includes('EVAL')) {
      return UserRole.EVALUATOR;
    }

    if (
      value === 'RESEARCHER' ||
      value === 'RESEARCH' ||
      value === 'INVESTIGADOR' ||
      value.includes('RESEARCH') ||
      value.includes('INVESTIG')
    ) {
      return UserRole.RESEARCHER;
    }

    return UserRole.RESEARCHER;
  }

  private loadUserFromStorage(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }
}
