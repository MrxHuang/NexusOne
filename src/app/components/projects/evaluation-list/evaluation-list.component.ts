import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationService } from '../../../services/evaluation.service';
import { Evaluation } from '../../../models/evaluation.model';
import { LucideAngularModule, Plus, FileText, Star } from 'lucide-angular';
import { EvaluationFormComponent } from '../evaluation-form/evaluation-form.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-evaluation-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, EvaluationFormComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">Project Evaluations</h3>
        <button 
          *ngIf="canEvaluate()"
          (click)="showForm.set(true)"
          class="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
          <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
          <span>New Evaluation</span>
        </button>
      </div>

      <div *ngIf="loading()" class="flex justify-center py-8">
        <div class="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div *ngIf="!loading() && evaluations().length === 0" class="text-center py-12 bg-slate-50 rounded-xl border border-slate-100">
        <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
          <lucide-icon [img]="FileTextIcon" class="w-6 h-6 text-slate-400"></lucide-icon>
        </div>
        <h3 class="text-sm font-medium text-slate-900">No evaluations yet</h3>
        <p class="text-xs text-slate-500 mt-1">Be the first to evaluate this project.</p>
      </div>

      <div *ngIf="!loading() && evaluations().length > 0" class="space-y-4">
        <div *ngFor="let eval of evaluations()" class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-indigo-200 transition-colors">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {{ eval.evaluator.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <div class="font-medium text-slate-900">{{ eval.evaluator.name }}</div>
                <div class="text-xs text-slate-500">{{ formatDate(eval.submittedAt) }}</div>
              </div>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs font-medium" 
                [ngClass]="{
                  'bg-green-100 text-green-700': eval.recommendation === 'APPROVE',
                  'bg-red-100 text-red-700': eval.recommendation === 'REJECT',
                  'bg-yellow-100 text-yellow-700': eval.recommendation === 'REVISE'
                }">
              {{ formatRecommendation(eval.recommendation) }}
            </div>
          </div>
          
          <p class="text-slate-600 text-sm mb-4">{{ eval.overallComment }}</p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div *ngFor="let score of getScores(eval)" class="text-center">
              <div class="text-xs text-slate-500 mb-1">{{ score.label }}</div>
              <div class="font-semibold text-slate-900">{{ score.value }}/10</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Evaluation Form Modal -->
      <app-evaluation-form
        *ngIf="showForm()"
        [projectId]="projectId"
        (close)="showForm.set(false)"
        (submitted)="onEvaluationSubmitted()"
      ></app-evaluation-form>
    </div>
  `
})
export class EvaluationListComponent implements OnInit {
  @Input() projectId!: string;

  private evaluationService = inject(EvaluationService);
  private authService = inject(AuthService);

  evaluations = signal<Evaluation[]>([]);
  loading = signal(true);
  showForm = signal(false);

  // Icons
  readonly PlusIcon = Plus;
  readonly FileTextIcon = FileText;
  readonly StarIcon = Star;

  ngOnInit() {
    if (this.projectId) {
      this.loadEvaluations();
    }
  }

  loadEvaluations() {
    this.loading.set(true);
    this.evaluationService.getEvaluationsByProject(this.projectId).subscribe({
      next: (data) => {
        this.evaluations.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  canEvaluate(): boolean {
    const user = this.authService.currentUser();
    return user?.role === 'EVALUATOR' || user?.role === 'ADMIN';
  }

  onEvaluationSubmitted() {
    this.showForm.set(false);
    this.loadEvaluations();
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  formatRecommendation(rec: string): string {
    return rec.replace(/_/g, ' ');
  }

  getScores(evalObj: Evaluation) {
    // Helper to find score by criteria ID
    const findScore = (id: string) => {
      const s = evalObj.scores.find(s => s.criteriaId === id);
      return s ? s.score : 0;
    };

    return [
      { label: 'Technical', value: findScore('technical') },
      { label: 'Budget', value: findScore('budget') },
      { label: 'Impact', value: findScore('impact') },
      { label: 'Timeline', value: findScore('timeline') }
    ];
  }
}
