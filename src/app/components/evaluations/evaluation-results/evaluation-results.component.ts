import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationService } from '../../../services/evaluation.service';
import { EvaluationResult } from '../../../models/evaluation.model';
import { LucideAngularModule, BarChart2, CheckCircle, AlertTriangle, XCircle } from 'lucide-angular';

@Component({
  selector: 'app-evaluation-results',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div *ngIf="results()" class="space-y-8">
      
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-center">
          <h4 class="text-sm font-medium text-indigo-600 mb-1">Average Score</h4>
          <div class="text-3xl font-bold text-indigo-900">{{ results()?.averageScore }}</div>
        </div>
        
        <div class="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
          <h4 class="text-sm font-medium text-slate-600 mb-1">Evaluators</h4>
          <div class="text-3xl font-bold text-slate-900">{{ results()?.evaluatorCount }}</div>
        </div>

        <div class="bg-green-50 p-6 rounded-xl border border-green-100 text-center">
          <h4 class="text-sm font-medium text-green-600 mb-1">Approvals</h4>
          <div class="text-3xl font-bold text-green-900">{{ results()?.recommendations?.approve }}</div>
        </div>
      </div>

      <!-- Criteria Breakdown -->
      <div>
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Criteria Breakdown</h3>
        <div class="space-y-4">
          <div *ngFor="let item of results()?.criteriaAverages | keyvalue" class="bg-white p-4 rounded-lg border border-slate-200">
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium text-slate-700 capitalize">{{ item.key }}</span>
              <span class="font-bold text-slate-900">{{ item.value }} / 10</span>
            </div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-indigo-500 rounded-full" [style.width]="(item.value * 10) + '%'"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendation Distribution -->
      <div>
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Recommendation Consensus</h3>
        <div class="flex gap-4">
          <div class="flex-1 bg-green-50 p-4 rounded-lg border border-green-100 flex items-center gap-3">
            <lucide-icon [img]="CheckCircleIcon" class="w-5 h-5 text-green-600"></lucide-icon>
            <div>
              <div class="text-sm font-medium text-green-900">Approve</div>
              <div class="text-2xl font-bold text-green-700">{{ results()?.recommendations?.approve }}</div>
            </div>
          </div>
          
          <div class="flex-1 bg-orange-50 p-4 rounded-lg border border-orange-100 flex items-center gap-3">
            <lucide-icon [img]="AlertTriangleIcon" class="w-5 h-5 text-orange-600"></lucide-icon>
            <div>
              <div class="text-sm font-medium text-orange-900">Revise</div>
              <div class="text-2xl font-bold text-orange-700">{{ results()?.recommendations?.revise }}</div>
            </div>
          </div>

          <div class="flex-1 bg-red-50 p-4 rounded-lg border border-red-100 flex items-center gap-3">
            <lucide-icon [img]="XCircleIcon" class="w-5 h-5 text-red-600"></lucide-icon>
            <div>
              <div class="text-sm font-medium text-red-900">Reject</div>
              <div class="text-2xl font-bold text-red-700">{{ results()?.recommendations?.reject }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class EvaluationResultsComponent implements OnInit {
  @Input() projectId!: string;
  private evaluationService = inject(EvaluationService);

  results = signal<EvaluationResult | null>(null);

  // Icons
  readonly CheckCircleIcon = CheckCircle;
  readonly AlertTriangleIcon = AlertTriangle;
  readonly XCircleIcon = XCircle;

  ngOnInit() {
    if (this.projectId) {
      this.evaluationService.getEvaluationResults(this.projectId).subscribe(data => {
        this.results.set(data);
      });
    }
  }
}
