import { Injectable, inject } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Project, ProjectStatus, ProjectRole, ProjectVersion } from '../models/project.model';
import { MockDataService } from './mock-data.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private mockData = inject(MockDataService);

  getAllProjects(): Observable<Project[]> {
    return of(this.mockData.getProjects()).pipe(delay(500));
  }

  getProjectById(id: string): Observable<Project | undefined> {
    return of(this.mockData.getProjects().find(p => p.id === id)).pipe(delay(300));
  }

  createProject(project: Partial<Project>): Observable<Project> {
    const newProject: Project = {
      ...project,
      id: `p${Date.now()}`,
      status: ProjectStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
      researchers: [],
      tags: project.tags || []
    } as Project;
    
    // In a real app, we would push to the array
    // this.mockData.projects.push(newProject);
    
    return of(newProject).pipe(delay(800));
  }

  updateProject(id: string, changes: Partial<Project>): Observable<Project> {
    const project = this.mockData.getProjects().find(p => p.id === id);
    if (!project) throw new Error('Project not found');
    
    const updatedProject = { ...project, ...changes, updatedAt: new Date() };
    return of(updatedProject).pipe(delay(600));
  }

  getProjectsByStatus(status: ProjectStatus): Observable<Project[]> {
    return this.getAllProjects().pipe(
      map(projects => projects.filter(p => p.status === status))
    );
  }

  assignResearcher(projectId: string, userId: string, role: ProjectRole): Observable<boolean> {
    return of(true).pipe(delay(500));
  }

  getProjectVersions(projectId: string): Observable<ProjectVersion[]> {
    // Mock versions
    const versions: ProjectVersion[] = [
      {
        id: 'v1',
        projectId,
        versionNumber: '1.0',
        changes: 'Initial project creation',
        modifiedBy: 'u1',
        modifiedAt: new Date()
      }
    ];
    return of(versions).pipe(delay(400));
  }
}
