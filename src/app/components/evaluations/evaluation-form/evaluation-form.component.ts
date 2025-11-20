import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Evaluation, DEFAULT_CRITERIA } from '../../../models/evaluation.model';
import { LucideAngularModule, Save, Send } from 'lucide-angular';

@Component({
  selector: 'app-evaluation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <form [formGroup]="evalForm" (ngSubmit)="onSubmit()" class="space-y-8">
      
      <!-- Criteria Scores -->
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-slate-900">Evaluation Criteria</h3>
        
        <div formArrayName="scores" class="space-y-6">
          <div *ngFor="let criteria of defaultCriteria; let i = index" [formGroupName]="i" 
               class="bg-slate-50 p-6 rounded-xl border border-slate-200">
            
            <div class="flex justify-between items-start mb-4">
              <div>
                <h4 class="font-medium text-slate-900">{{ criteria.name }}</h4>
                <p class="text-sm text-slate-500 mt-1">{{ criteria.description }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-2xl font-bold text-indigo-600">{{ getScoreControl(i).value }}</span>
                <span class="text-slate-400">/ 10</span>
              </div>
            </div>

            <div class="space-y-4">
              <!-- Range Slider -->
              <input type="range" formControlName="score" min="1" max="10" step="1"
                     class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600">
              
              <!-- Comment -->
              <textarea formControlName="comment" rows="2" 
                        placeholder="Add specific comments for this criteria..."
                        class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Overall Feedback -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-slate-900">Final Assessment</h3>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Overall Comments</label>
          <textarea formControlName="overallComment" rows="4"
                    class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Recommendation</label>
          <select formControlName="recommendation"
                  class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
            <option value="APPROVE">Approve Project</option>
            <option value="REVISE">Request Revisions</option>
            <option value="REJECT">Reject Proposal</option>
          </select>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button type="button" class="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
          Save Draft
        </button>
        <button type="submit" [disabled]="evalForm.invalid"
                class="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <lucide-icon [img]="SendIcon" class="w-4 h-4"></lucide-icon>
          <span>Submit Evaluation</span>
        </button>
      </div>
    </form>
  `
})
export class EvaluationFormComponent {
  @Input() projectId!: string;
  @Output() submitEvaluation = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  defaultCriteria = DEFAULT_CRITERIA;
  
  // Icons
  readonly SendIcon = Send;
  readonly SaveIcon = Save;

  evalForm = this.fb.group({
    scores: this.fb.array(this.defaultCriteria.map(c => this.createScoreGroup(c.id))),
    overallComment: ['', Validators.required],
    recommendation: ['APPROVE', Validators.required]
  });

  createScoreGroup(criteriaId: string) {
    return this.fb.group({
      criteriaId: [criteriaId],
      score: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      comment: ['']
    });
  }

  getScoreControl(index: number) {
    return (this.evalForm.get('scores') as FormArray).at(index).get('score')!;
  }

  onSubmit() {
    if (this.evalForm.valid) {
      this.submitEvaluation.emit(this.evalForm.value);
    }
  }
}
