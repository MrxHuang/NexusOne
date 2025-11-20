import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { ProjectMetrics, Activity } from '../../models/dashboard.model';
import { BentoCardComponent } from '../../components/shared/bento-card/bento-card.component';
import { MetricsCardComponent } from '../../components/dashboard/metrics-card/metrics-card.component';
import { ActivityTimelineComponent } from '../../components/dashboard/activity-timeline/activity-timeline.component';
import { StatusChartComponent } from '../../components/dashboard/status-chart/status-chart.component';
import { LucideAngularModule, Plus, FileText, Folder, CheckCircle, Clock } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    BentoCardComponent, 
    MetricsCardComponent, 
    ActivityTimelineComponent, 
    StatusChartComponent,
    LucideAngularModule
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  metrics = signal<ProjectMetrics | null>(null);
  recentActivity = signal<Activity[]>([]);
  loading = signal(true);

  // Icons
  readonly PlusIcon = Plus;
  readonly FileTextIcon = FileText;
  readonly FolderIcon = Folder;
  readonly CheckCircleIcon = CheckCircle;
  readonly ClockIcon = Clock;

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading.set(true);
    
    // In a real app, use forkJoin
    this.dashboardService.getMetrics().subscribe(data => {
      this.metrics.set(data);
    });

    this.dashboardService.getRecentActivity().subscribe(data => {
      this.recentActivity.set(data);
      this.loading.set(false);
    });
  }
}
