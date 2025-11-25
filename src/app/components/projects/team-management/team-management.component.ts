import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../services/project.service';
import { UserService } from '../../../services/user.service';
import { ProjectRole, ProjectResearcher } from '../../../models/project.model';
import { User } from '../../../models/user.model';
import { LucideAngularModule, UserPlus, Trash2, Shield } from 'lucide-angular';
import { UserSearchModalComponent } from '../../shared/user-search-modal/user-search-modal.component';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, UserSearchModalComponent],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-slate-900">Project Team</h3>
        <button 
          (click)="showAddMemberModal.set(true)"
          class="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
          <lucide-icon [img]="UserPlusIcon" class="w-4 h-4"></lucide-icon>
          <span>Add Member</span>
        </button>
      </div>

      <div *ngIf="loading()" class="flex justify-center py-8">
        <div class="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div *ngIf="!loading()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Creator Card -->
        <div *ngIf="creator()" class="flex items-center p-4 bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm">
          <img 
            [src]="getAvatarUrl(creator()?.name || 'User')" 
            [alt]="creator()?.name"
            class="w-10 h-10 rounded-full mr-4"
          />
          <div class="flex-1">
            <h4 class="font-medium text-slate-900">{{ creator()?.name }}</h4>
            <div class="flex items-center gap-1 text-xs text-indigo-600 font-medium mt-0.5">
              <lucide-icon [img]="ShieldIcon" class="w-3 h-3"></lucide-icon>
              <span>Project Creator</span>
            </div>
          </div>
        </div>

        <!-- Team Members -->
        <div *ngFor="let member of team()" class="flex items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 transition-colors">
          <img 
            [src]="getAvatarUrl(member.user?.name || 'User')" 
            [alt]="member.user?.name"
            class="w-10 h-10 rounded-full mr-4"
          />
          <div class="flex-1">
            <h4 class="font-medium text-slate-900">{{ member.user?.name }}</h4>
            <div class="flex items-center gap-1 text-xs text-slate-500 font-medium mt-0.5">
              <lucide-icon *ngIf="member.role === 'PRINCIPAL_INVESTIGATOR'" [img]="ShieldIcon" class="w-3 h-3 text-indigo-600"></lucide-icon>
              <span [class.text-indigo-600]="member.role === 'PRINCIPAL_INVESTIGATOR'">{{ formatRole(member.role) }}</span>
            </div>
          </div>
          <button 
            *ngIf="member.role !== 'PRINCIPAL_INVESTIGATOR' && member.user"
            (click)="removeMember(member.user.id)"
            class="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <lucide-icon [img]="Trash2Icon" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
      </div>

      <!-- Add Member Modal -->
      <app-user-search-modal
        *ngIf="showAddMemberModal()"
        (close)="showAddMemberModal.set(false)"
        (select)="addMember($event)"
      ></app-user-search-modal>
    </div>
  `
})
export class TeamManagementComponent implements OnInit {
  @Input() projectId!: string;
  
  private projectService = inject(ProjectService);
  private userService = inject(UserService);
  
  team = signal<ProjectResearcher[]>([]);
  creator = signal<User | undefined>(undefined);
  loading = signal(true);
  showAddMemberModal = signal(false);

  // Icons
  readonly UserPlusIcon = UserPlus;
  readonly Trash2Icon = Trash2;
  readonly ShieldIcon = Shield;

  ngOnInit() {
    if (this.projectId) {
      this.loadTeam();
    }
  }

  loadTeam() {
    this.loading.set(true);
    // Since getProjectById returns the project with researchers, we can reuse that or fetch again.
    // Ideally we should have a specific endpoint for team if it's large, but for now we'll fetch the project.
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project) => {
        this.team.set(project.researchers || []);
        
        if (project.createdBy) {
          this.userService.getUserById(project.createdBy).subscribe(user => {
            this.creator.set(user);
          });
        }
        
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  addMember(user: User) {
    this.showAddMemberModal.set(false);
    this.loading.set(true);
    
    // assignResearcher expects (projectId, userId, role)
    this.projectService.assignResearcher(this.projectId, user.id, ProjectRole.CO_INVESTIGATOR).subscribe({
      next: () => {
        // Reload team to get fresh data from backend
        this.loadTeam();
      },
      error: (err) => {
        console.error('Error adding member', err);
        this.loading.set(false);
      }
    });
  }

  removeMember(userId: string) {
    if (!confirm('Are you sure you want to remove this member?')) return;

    this.loading.set(true);
    this.projectService.removeResearcher(this.projectId, userId).subscribe({
      next: () => {
        this.loadTeam();
      },
      error: (err) => {
        console.error('Error removing member', err);
        this.loading.set(false);
      }
    });
  }

  formatRole(role: string): string {
    return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  getAvatarUrl(seed: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  }
}
