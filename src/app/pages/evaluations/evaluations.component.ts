import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationService } from '../../services/evaluation.service';
import { AuthService } from '../../services/auth.service';
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

  evaluations = signal<Evaluation[]>([]);
  loading = signal(true);

  // Icons
  readonly FileTextIcon = FileText;
  readonly CheckCircleIcon = CheckCircle;
  readonly ClockIcon = Clock;
  readonly AlertCircleIcon = AlertCircle;

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.loadEvaluations(user.id);
    }
  }

  loadEvaluations(userId: string) {
    this.loading.set(true);
    this.evaluationService.getMyEvaluations(userId).subscribe(data => {
      this.evaluations.set(data);
      this.loading.set(false);
    });
  }

  formatDate(date: Date): string {
    return format(new Date(date), 'MMM d, yyyy');
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
