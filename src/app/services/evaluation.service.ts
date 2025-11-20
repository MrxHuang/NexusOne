import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Evaluation, EvaluationResult } from '../models/evaluation.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private mockData = inject(MockDataService);

  getEvaluationsByProject(projectId: string): Observable<Evaluation[]> {
    return of(this.mockData.getEvaluations().filter(e => e.projectId === projectId)).pipe(delay(500));
  }

  getMyEvaluations(evaluatorId: string): Observable<Evaluation[]> {
    return of(this.mockData.getEvaluations().filter(e => e.evaluatorId === evaluatorId)).pipe(delay(500));
  }

  submitEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    return of({ ...evaluation, submittedAt: new Date(), status: 'COMPLETED' as const }).pipe(delay(1000));
  }

  getEvaluationResults(projectId: string): Observable<EvaluationResult> {
    // Mock aggregation logic
    const result: EvaluationResult = {
      projectId,
      averageScore: 8.5,
      criteriaAverages: {
        'innovation': 9,
        'methodology': 8,
        'feasibility': 7.5,
        'impact': 9,
        'team': 9
      },
      evaluatorCount: 3,
      recommendations: {
        approve: 2,
        reject: 0,
        revise: 1
      }
    };
    return of(result).pipe(delay(800));
  }
}
