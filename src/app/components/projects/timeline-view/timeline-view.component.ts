import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../models/project.model';
import { format, differenceInDays, addDays } from 'date-fns';

@Component({
  selector: 'app-timeline-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative h-24 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
      <!-- Grid Lines -->
      <div class="absolute inset-0 flex">
        <div *ngFor="let i of [1,2,3,4,5,6]" class="flex-1 border-r border-slate-200/50"></div>
      </div>

      <!-- Progress Bar -->
      <div class="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-4 bg-slate-200 rounded-full overflow-hidden">
        <div class="h-full bg-indigo-500 relative" [style.width]="getProgress() + '%'">
          <div class="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>

      <!-- Dates -->
      <div class="absolute bottom-2 left-4 text-xs font-medium text-slate-500">
        {{ formatDate(project.startDate) }}
      </div>
      <div class="absolute bottom-2 right-4 text-xs font-medium text-slate-500">
        {{ formatDate(project.endDate) }}
      </div>
    </div>
  `,
  styles: [`
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `]
})
export class TimelineViewComponent {
  @Input() project!: Project;

  formatDate(date: Date): string {
    return format(new Date(date), 'MMM d, yyyy');
  }

  getProgress(): number {
    const total = differenceInDays(new Date(this.project.endDate), new Date(this.project.startDate));
    const elapsed = differenceInDays(new Date(), new Date(this.project.startDate));
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  }
}
