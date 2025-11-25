import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EvaluationService } from '../../services/evaluation.service';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';
import { Evaluation } from '../../models/evaluation.model';
import { LucideAngularModule, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-angular';
import { format } from 'date-fns';

@Component({
  selector: 'app-evaluations',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './evaluations.component.html'
})
export class EvaluationsComponent implements OnInit {
  private evaluationService = inject(EvaluationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  evaluations = signal<Evaluation[]>([]);
  loading = signal(true);

  // Icons
  readonly FileTextIcon = FileText;
  readonly CheckCircleIcon = CheckCircle;
  readonly ClockIcon = Clock;
  readonly AlertCircleIcon = AlertCircle;

  ngOnInit() {
    this.loadEvaluations();
  }

  loadEvaluations() {
    this.loading.set(true);
    const user = this.authService.currentUser();
    
    // Admin sees all evaluations, others see only their own
    if (user?.role === UserRole.ADMIN) {
      this.evaluationService.getAllEvaluations().subscribe({
        next: data => {
          this.evaluations.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.evaluationService.getMyEvaluations().subscribe({
        next: data => {
          this.evaluations.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  formatDate(date: Date): string {
    return format(new Date(date), 'MMM d, yyyy');
  }

  viewDetails(evaluation: Evaluation) {
    console.log('Evaluation object:', evaluation);
    
    if (!evaluation.projectId) {
      console.error('Project ID is missing from evaluation:', evaluation);
      alert('Error: No se puede navegar al proyecto. El ID del proyecto no está disponible.');
      return;
    }
    
    // Navigate to project detail page
    this.router.navigate(['/projects', evaluation.projectId]);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-200';
      case 'DRAFT': return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'SUBMITTED': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  }
}
