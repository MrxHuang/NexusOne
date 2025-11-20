import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from '../../../models/dashboard.model';
import { LucideAngularModule, Plus, FileText, CheckCircle, Edit, LucideIconData } from 'lucide-angular';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-activity-timeline',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="relative pl-4 border-l border-slate-200 space-y-6">
      <div *ngFor="let activity of activities" class="relative">
        <!-- Dot -->
        <div [ngClass]="[
          'absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm',
          getActivityColor(activity.type)
        ]"></div>
        
        <div class="flex items-start gap-3">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-900">{{ activity.description }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-slate-500">{{ activity.userName }}</span>
              <span class="text-xs text-slate-300">•</span>
              <span class="text-xs text-slate-500">{{ getTimeAgo(activity.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="activities.length === 0" class="text-center py-8 text-slate-400 text-sm">
        No recent activity
      </div>
    </div>
  `
})
export class ActivityTimelineComponent {
  @Input() activities: Activity[] = [];

  getTimeAgo(date: Date): string {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  getActivityColor(type: Activity['type']): string {
    switch (type) {
      case 'PROJECT_CREATED': return 'bg-indigo-500';
      case 'PROJECT_UPDATED': return 'bg-blue-500';
      case 'EVALUATION_ASSIGNED': return 'bg-orange-500';
      case 'EVALUATION_SUBMITTED': return 'bg-green-500';
      case 'STATUS_CHANGED': return 'bg-violet-500';
      default: return 'bg-slate-400';
    }
  }
}
