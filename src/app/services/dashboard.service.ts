import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectMetrics, Activity, PersonalStats } from '../models/dashboard.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`;

  // Role-specific dashboard methods
  getAdminDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin`);
  }

  getEvaluatorDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/evaluator`);
  }

  getResearcherDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/researcher`);
  }

  // Legacy methods for backward compatibility
  getMetrics(): Observable<ProjectMetrics> {
    return this.http.get<ProjectMetrics>(`${this.apiUrl}/metrics`);
  }

  getRecentActivity(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/activity`);
  }

  getPersonalStats(): Observable<PersonalStats> {
    return this.http.get<PersonalStats>(`${this.apiUrl}/stats`);
  }
}
