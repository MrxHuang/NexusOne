import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project, ProjectStatus } from '../../models/project.model';
import { ProjectCardComponent } from '../../components/projects/project-card/project-card.component';
import { LucideAngularModule, Plus, Filter, Search } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, LucideAngularModule, FormsModule],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  private projectService = inject(ProjectService);
  private router = inject(Router);

  projects = signal<Project[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  statusFilter = signal<ProjectStatus | 'ALL'>('ALL');

  // Icons
  readonly PlusIcon = Plus;
  readonly FilterIcon = Filter;
  readonly SearchIcon = Search;

  // Enums for template
  readonly ProjectStatus = ProjectStatus;

  filteredProjects = computed(() => {
    let result = this.projects();
    const term = this.searchTerm().toLowerCase();
    const status = this.statusFilter();

    if (term) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
      );
    }

    if (status !== 'ALL') {
      result = result.filter(p => p.status === status);
    }

    return result;
  });

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading.set(true);
    this.projectService.getAllProjects().subscribe(data => {
      this.projects.set(data);
      this.loading.set(false);
    });
  }

  onProjectClick(project: Project) {
    this.router.navigate(['/projects', project.id]);
  }

  setStatusFilter(status: ProjectStatus | 'ALL') {
    this.statusFilter.set(status);
  }
}
