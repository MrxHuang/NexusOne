import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reports`;

  generateProjectReport(projectId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/project/${projectId}`, { responseType: 'blob' });
  }

  generateEvaluationReport(projectId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/evaluation/${projectId}`, { responseType: 'blob' });
  }

  downloadPdf(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
