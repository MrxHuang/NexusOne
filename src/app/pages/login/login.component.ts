import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';
import { LucideAngularModule, LogIn, User, Shield, BookOpen, Eye, EyeOff } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, RouterLink],
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Icons
  readonly LogInIcon = LogIn;
  readonly UserIcon = User;
  readonly ShieldIcon = Shield;
  readonly BookOpenIcon = BookOpen;
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;

  isLoading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);
  
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    role: [UserRole.RESEARCHER, [Validators.required]]
  });

  roles = [
    { value: UserRole.RESEARCHER, label: 'Researcher', icon: BookOpen },
    { value: UserRole.EVALUATOR, label: 'Evaluator', icon: User },
    { value: UserRole.ADMIN, label: 'Administrator', icon: Shield }
  ];

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.error.set(null);

    const { email, password, role } = this.loginForm.value;

    this.authService.login(email!, password!, role as UserRole).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  selectRole(role: UserRole) {
    this.loginForm.patchValue({ role });
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }
}
