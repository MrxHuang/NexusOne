import { Injectable, inject } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { ProjectMetrics, Activity, PersonalStats } from '../models/dashboard.model';
import { MockDataService } from './mock-data.service';
import { ProjectStatus } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private mockData = inject(MockDataService);

  getMetrics(): Observable<ProjectMetrics> {
    const projects = this.mockData.getProjects();
    
    const metrics: ProjectMetrics = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === ProjectStatus.ACTIVE).length,
      completedProjects: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
      projectsByStatus: {
        [ProjectStatus.ACTIVE]: projects.filter(p => p.status === ProjectStatus.ACTIVE).length,
        [ProjectStatus.DRAFT]: projects.filter(p => p.status === ProjectStatus.DRAFT).length,
        [ProjectStatus.IN_REVIEW]: projects.filter(p => p.status === ProjectStatus.IN_REVIEW).length,
        [ProjectStatus.COMPLETED]: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
      }
    };
    
    return of(metrics).pipe(delay(600));
  }

  getRecentActivity(): Observable<Activity[]> {
    return of(this.mockData.getActivities()).pipe(delay(400));
  }

  getPersonalStats(userId: string): Observable<PersonalStats> {
    return of({
      projectsInvolved: 3,
      evaluationsCompleted: 5,
      averageEvaluationScore: 8.2
    }).pipe(delay(500));
  }
}
