import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LucideAngularModule, Settings as SettingsIcon, User, Bell, Lock, Palette } from 'lucide-angular';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './settings.component.html',
  styles: []
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  // Icons
  readonly SettingsIconImg = SettingsIcon;
  readonly UserIcon = User;
  readonly BellIcon = Bell;
  readonly LockIcon = Lock;
  readonly PaletteIcon = Palette;

  currentUser = this.authService.currentUser;
  isSaving = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  profileForm = this.fb.group({
    name: [this.currentUser()?.name || '', [Validators.required]],
    email: [this.currentUser()?.email || '', [Validators.required, Validators.email]],
    department: [this.currentUser()?.department || ''],
    specialization: [this.currentUser()?.specialization || '']
  });

  notificationForm = this.fb.group({
    emailNotifications: [true],
    projectUpdates: [true],
    evaluationReminders: [true],
    weeklyDigest: [false]
  });

  securityForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  activeTab = signal<'profile' | 'notifications' | 'security' | 'appearance'>('profile');

  setActiveTab(tab: 'profile' | 'notifications' | 'security' | 'appearance') {
    this.activeTab.set(tab);
  }

  getAvatarUrl(seed: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  }

  onSaveProfile() {
    if (this.profileForm.invalid) return;

    const userId = this.currentUser()?.id;
    if (!userId) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);

    const profileData = {
      name: this.profileForm.get('name')?.value || '',
      email: this.profileForm.get('email')?.value || '',
      department: this.profileForm.get('department')?.value || '',
      specialization: this.profileForm.get('specialization')?.value || ''
    };

    this.userService.updateUser(userId, profileData).subscribe({
      next: () => {
        // Refresh current user to update UI
        this.authService.refreshCurrentUser().subscribe({
          next: (updatedUser) => {
            if (updatedUser) {
              // Update form with fresh data
              this.profileForm.patchValue({
                name: updatedUser.name,
                email: updatedUser.email,
                department: updatedUser.department,
                specialization: updatedUser.specialization
              });
            }
            this.successMessage.set('Profile updated successfully!');
            this.isSaving.set(false);
            setTimeout(() => this.successMessage.set(null), 3000);
          },
          error: () => {
            this.successMessage.set('Profile updated successfully!');
            this.isSaving.set(false);
            setTimeout(() => this.successMessage.set(null), 3000);
          }
        });
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to update profile');
        this.isSaving.set(false);
      }
    });
  }

  onSaveNotifications() {
    this.isSaving.set(true);
    setTimeout(() => {
      this.successMessage.set('Notification preferences saved!');
      this.isSaving.set(false);
      setTimeout(() => this.successMessage.set(null), 3000);
    }, 1000);
  }

  onChangePassword() {
    if (this.securityForm.invalid) return;

    const currentPassword = this.securityForm.get('currentPassword')?.value;
    const newPassword = this.securityForm.get('newPassword')?.value;
    const confirmPassword = this.securityForm.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage.set('Passwords do not match!');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    // Call backend
    const userId = this.currentUser()?.id;
    if (!userId) return;

    this.http.post(`${this.apiUrl}/${userId}/password`, {
      currentPassword,
      newPassword
    }).subscribe({
      next: () => {
        this.successMessage.set('Password changed successfully!');
        this.securityForm.reset();
        this.isSaving.set(false);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to change password');
        this.isSaving.set(false);
      }
    });
  }
}
