import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';
import { LucideAngularModule, UserPlus, User, Shield, BookOpen, Eye, EyeOff } from 'lucide-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, RouterLink],
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Icons
  readonly UserPlusIcon = UserPlus;
  readonly UserIcon = User;
  readonly ShieldIcon = Shield;
  readonly BookOpenIcon = BookOpen;
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;

  isLoading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  
  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    role: [UserRole.RESEARCHER, [Validators.required]],
    department: [''],
    specialization: ['']
  });

  roles = [
    { value: UserRole.RESEARCHER, label: 'Researcher', icon: BookOpen },
    { value: UserRole.EVALUATOR, label: 'Evaluator', icon: User },
    { value: UserRole.ADMIN, label: 'Administrator', icon: Shield }
  ];

  onSubmit() {
    if (this.registerForm.invalid) {
      this.error.set('Por favor completa todos los campos requeridos.');
      return;
    }

    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const { name, email, role, department, specialization } = this.registerForm.value;

    this.authService.register({
      name: name!,
      email: email!,
      password: password!,
      role: role as UserRole,
      department: department || undefined,
      specialization: specialization || undefined
    }).subscribe({
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
    this.registerForm.patchValue({ role });
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update(v => !v);
  }
}
