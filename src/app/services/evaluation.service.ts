import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluation, EvaluationResult } from '../models/evaluation.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/evaluations`;

  getEvaluationsByProject(projectId: string): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/project/${projectId}`);
  }

  getMyEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/my`);
  }

  getAllEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.apiUrl);
  }

  submitEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.apiUrl, evaluation);
  }

  getEvaluationResults(projectId: string): Observable<EvaluationResult> {
    return this.http.get<EvaluationResult>(`${this.apiUrl}/results/${projectId}`);
  }
}
