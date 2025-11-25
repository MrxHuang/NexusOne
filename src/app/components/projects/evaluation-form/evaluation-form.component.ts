import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EvaluationService } from '../../../services/evaluation.service';
import { LucideAngularModule, X, Save } from 'lucide-angular';

@Component({
  selector: 'app-evaluation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 class="text-lg font-semibold text-slate-900">New Evaluation</h3>
          <button (click)="close.emit()" class="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <!-- Form -->
        <div class="p-6 overflow-y-auto flex-1">
          <form [formGroup]="evalForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- Scores -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Technical Merit (0-10)</label>
                <input type="number" formControlName="technicalScore" min="0" max="10" class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Budget Feasibility (0-10)</label>
                <input type="number" formControlName="budgetScore" min="0" max="10" class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Impact Potential (0-10)</label>
                <input type="number" formControlName="impactScore" min="0" max="10" class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Timeline Realism (0-10)</label>
                <input type="number" formControlName="timelineScore" min="0" max="10" class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
              </div>
            </div>

            <!-- Recommendation -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">Recommendation</label>
              <select formControlName="recommendation" class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white">
                <option value="APPROVE">Approved</option>
                <option value="REVISE">Needs Revision</option>
                <option value="REJECT">Rejected</option>
              </select>
            </div>

            <!-- Comments -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">Overall Comments</label>
              <textarea formControlName="overallComment" rows="4" class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>

            <div *ngIf="error()" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {{ error() }}
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button (click)="close.emit()" class="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">
            Cancel
          </button>
          <button 
            (click)="onSubmit()" 
            [disabled]="evalForm.invalid || submitting()"
            class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            <lucide-icon *ngIf="!submitting()" [img]="SaveIcon" class="w-4 h-4"></lucide-icon>
            <div *ngIf="submitting()" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{{ submitting() ? 'Submitting...' : 'Submit Evaluation' }}</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class EvaluationFormComponent {
  @Input() projectId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private evaluationService = inject(EvaluationService);

  submitting = signal(false);
  error = signal<string | null>(null);

  // Icons
  readonly XIcon = X;
  readonly SaveIcon = Save;

  evalForm = this.fb.group({
    technicalScore: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    budgetScore: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    impactScore: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    timelineScore: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    recommendation: ['APPROVE', [Validators.required]],
    overallComment: ['', [Validators.required, Validators.minLength(10)]]
  });

  onSubmit() {
    if (this.evalForm.invalid) return;

    this.submitting.set(true);
    this.error.set(null);

    const formValue = this.evalForm.value;
    
    // Construct scores array
    const scores = [
      { criteriaId: 'technical', score: formValue.technicalScore || 0 },
      { criteriaId: 'budget', score: formValue.budgetScore || 0 },
      { criteriaId: 'impact', score: formValue.impactScore || 0 },
      { criteriaId: 'timeline', score: formValue.timelineScore || 0 }
    ];

    // Backend expects scores as a JSON string
    const evaluationData = {
      project: { id: Number(this.projectId) },
      scores: JSON.stringify(scores),
      recommendation: formValue.recommendation,
      overallComment: formValue.overallComment
    };

    this.evaluationService.submitEvaluation(evaluationData as any).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.emit();
      },
      error: (err) => {
        console.error('Error submitting evaluation', err);
        this.error.set('Failed to submit evaluation. Please try again.');
        this.submitting.set(false);
      }
    });
  }
}
