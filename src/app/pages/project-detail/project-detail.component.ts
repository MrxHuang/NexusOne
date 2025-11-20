import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project, ProjectStatus } from '../../models/project.model';
import { StatusBadgeComponent } from '../../components/shared/status-badge/status-badge.component';
import { TimelineViewComponent } from '../../components/projects/timeline-view/timeline-view.component';
import { VersionHistoryComponent } from '../../components/projects/version-history/version-history.component';
import { TeamManagementComponent } from '../../components/projects/team-management/team-management.component';
import { LucideAngularModule, ArrowLeft, Calendar, Edit, FileText, Download } from 'lucide-angular';
import { PdfService } from '../../services/pdf.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule, 
    StatusBadgeComponent, 
    TimelineViewComponent, 
    VersionHistoryComponent,
    TeamManagementComponent,
    LucideAngularModule
  ],
  templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private pdfService = inject(PdfService);

  project = signal<Project | undefined>(undefined);
  loading = signal(true);
  activeTab = signal<'overview' | 'team' | 'evaluations' | 'versions'>('overview');

  // Icons
  readonly ArrowLeftIcon = ArrowLeft;
  readonly CalendarIcon = Calendar;
  readonly EditIcon = Edit;
  readonly FileTextIcon = FileText;
  readonly DownloadIcon = Download;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProject(id);
    }
  }

  loadProject(id: string) {
    this.loading.set(true);
    this.projectService.getProjectById(id).subscribe(data => {
      this.project.set(data);
      this.loading.set(false);
    });
  }

  setActiveTab(tab: 'overview' | 'team' | 'evaluations' | 'versions') {
    this.activeTab.set(tab);
  }

  goBack() {
    this.router.navigate(['/projects']);
  }

  formatDate(date: Date | undefined): string {
    return date ? format(new Date(date), 'MMM d, yyyy') : '';
  }

  async exportPdf() {
    const p = this.project();
    if (p) {
      await this.pdfService.generateProjectReport(p, 'project-content');
    }
  }
}
