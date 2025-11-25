import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectStatus, ProjectRole, ProjectVersion } from '../models/project.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projects`;

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  updateProject(id: string, changes: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, changes);
  }

  getProjectsByStatus(status: ProjectStatus): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}?status=${status}`);
  }

  assignResearcher(projectId: string, userId: string, role: ProjectRole): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${projectId}/researchers`, { userId, role });
  }

  removeResearcher(projectId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}/researchers/${userId}`);
  }

  getProjectVersions(projectId: string): Observable<ProjectVersion[]> {
    return this.http.get<ProjectVersion[]>(`${this.apiUrl}/${projectId}/versions`);
  }

  getMyProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/my`);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
