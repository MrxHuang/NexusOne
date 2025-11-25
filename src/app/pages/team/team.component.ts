import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserRole } from '../../models/user.model';
import { LucideAngularModule, Users, UserPlus, Trash2, Edit, Mail, Shield } from 'lucide-angular';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  specialization?: string;
  avatar?: string;
  fecha_registro?: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './team.component.html',
  styles: []
})
export class TeamComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  // Icons
  readonly UsersIcon = Users;
  readonly UserPlusIcon = UserPlus;
  readonly Trash2Icon = Trash2;
  readonly EditIcon = Edit;
  readonly MailIcon = Mail;
  readonly ShieldIcon = Shield;

  teamMembers = signal<TeamMember[]>([]);
  isLoading = signal(false);
  showAddModal = signal(false);
  error = signal<string | null>(null);

  UserRole = UserRole;

  addMemberForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: [UserRole.RESEARCHER, [Validators.required]],
    department: [''],
    specialization: ['']
  });

  ngOnInit() {
    this.loadTeamMembers();
  }

  loadTeamMembers() {
    this.isLoading.set(true);
    this.http.get<TeamMember[]>(`${environment.apiUrl}/users`).subscribe({
      next: (members) => {
        this.teamMembers.set(members);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading team members:', err);
        this.error.set('Error al cargar los miembros del equipo');
        this.isLoading.set(false);
      }
    });
  }

  openAddModal() {
    this.showAddModal.set(true);
    this.addMemberForm.reset({ role: UserRole.RESEARCHER });
  }

  closeAddModal() {
    this.showAddModal.set(false);
    this.error.set(null);
  }

  onSubmitAddMember() {
    if (this.addMemberForm.invalid) {
      this.error.set('Por favor completa todos los campos requeridos.');
      return;
    }

    this.isLoading.set(true);
    const formValue = this.addMemberForm.value;

    this.http.post<TeamMember>(`${environment.apiUrl}/auth/register`, {
      name: formValue.name!,
      email: formValue.email!,
      password: formValue.password!,
      role: formValue.role!,
      department: formValue.department || undefined,
      specialization: formValue.specialization || undefined
    }).subscribe({
      next: () => {
        this.loadTeamMembers();
        this.closeAddModal();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al agregar miembro');
        this.isLoading.set(false);
      }
    });
  }

  deleteMember(id: number) {
    if (!confirm('¿Estás seguro de eliminar este miembro?')) {
      return;
    }

    this.http.delete(`${environment.apiUrl}/users/${id}`).subscribe({
      next: () => {
        this.loadTeamMembers();
      },
      error: (err) => {
        console.error('Error deleting member:', err);
        alert('Error al eliminar miembro');
      }
    });
  }

  getRoleBadgeClass(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-purple-100 text-purple-700';
      case UserRole.EVALUATOR:
        return 'bg-blue-100 text-blue-700';
      case UserRole.RESEARCHER:
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}
