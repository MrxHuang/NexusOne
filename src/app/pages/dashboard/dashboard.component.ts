import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';
import { ProjectMetrics, Activity } from '../../models/dashboard.model';
import { LucideAngularModule, Plus, FileText, Folder, CheckCircle, Clock, Users, BarChart3 } from 'lucide-angular';
import { formatDistanceToNow, format } from 'date-fns';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  dashboardData = signal<any>(null);
  loading = signal(true);
  
  // Expose UserRole enum to template
  UserRole = UserRole;

  // Icons
  readonly PlusIcon = Plus;
  readonly FileTextIcon = FileText;
  readonly FolderIcon = Folder;
  readonly CheckCircleIcon = CheckCircle;
  readonly ClockIcon = Clock;
  readonly UsersIcon = Users;
  readonly BarChart3Icon = BarChart3;

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading.set(true);
    const userRole = this.currentUser()?.role;

    console.log('[Dashboard] Loading dashboard for user:', this.currentUser(), 'role:', userRole);

    // Load role-specific dashboard
    switch (userRole) {
      case UserRole.ADMIN:
        this.dashboardService.getAdminDashboard().subscribe({
          next: (data) => {
            this.dashboardData.set(data);
            console.log('[Dashboard] Admin dashboard data loaded:', data);
            this.loading.set(false);
          },
          error: (error) => {
            console.error('[Dashboard] Error loading admin dashboard:', error);
            this.dashboardData.set({});
            this.loading.set(false);
          }
        });
        break;

      case UserRole.EVALUATOR:
        this.dashboardService.getEvaluatorDashboard().subscribe({
          next: (data) => {
            this.dashboardData.set(data);
            console.log('[Dashboard] Evaluator dashboard data loaded:', data);
            this.loading.set(false);
          },
          error: (error) => {
            console.error('[Dashboard] Error loading evaluator dashboard:', error);
            this.dashboardData.set({});
            this.loading.set(false);
          }
        });
        break;

      case UserRole.RESEARCHER:
        this.dashboardService.getResearcherDashboard().subscribe({
          next: (data) => {
            this.dashboardData.set(data);
            console.log('[Dashboard] Researcher dashboard data loaded:', data);
            this.loading.set(false);
          },
          error: (error) => {
            console.error('[Dashboard] Error loading researcher dashboard:', error);
            this.dashboardData.set({});
            this.loading.set(false);
          }
        });
        break;

      default:
        console.warn('[Dashboard] Unknown or missing user role, cannot load role-specific dashboard:', userRole);
        this.dashboardData.set({});
        this.loading.set(false);
    }
  }

  formatTime(date: Date | string): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }

  formatDate(date: Date | string): string {
    return format(new Date(date), 'MMM d, yyyy');
  }
}
