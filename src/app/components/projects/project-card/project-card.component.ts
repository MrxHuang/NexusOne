import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectStatus } from '../../../models/project.model';
import { LucideAngularModule, Calendar, Users, ArrowRight } from 'lucide-angular';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';
import { format } from 'date-fns';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, StatusBadgeComponent],
  template: `
    <div class="group bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-500 hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col"
         (click)="cardClick.emit(project)">
      
      <div class="flex items-start justify-between mb-4">
        <app-status-badge [status]="project.status"></app-status-badge>
        <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
          <lucide-icon [img]="ArrowRightIcon" class="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors"></lucide-icon>
        </div>
      </div>

      <h3 class="font-semibold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">{{ project.title }}</h3>
      <p class="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">{{ project.description }}</p>

      <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
        <div class="flex items-center text-xs text-slate-500">
          <lucide-icon [img]="CalendarIcon" class="w-3.5 h-3.5 mr-1.5"></lucide-icon>
          <span>{{ formatDate(project.endDate) }}</span>
        </div>

        <div class="flex -space-x-2">
          <div *ngFor="let researcher of project.researchers.slice(0, 3)" 
               class="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
               [title]="researcher.user?.name">
            <img *ngIf="researcher.user?.avatar" [src]="researcher.user?.avatar" class="w-full h-full object-cover">
          </div>
          <div *ngIf="project.researchers.length > 3" class="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-medium text-slate-600">
            +{{ project.researchers.length - 3 }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Output() cardClick = new EventEmitter<Project>();

  // Icons
  readonly CalendarIcon = Calendar;
  readonly UsersIcon = Users;
  readonly ArrowRightIcon = ArrowRight;

  formatDate(date: Date): string {
    return format(new Date(date), 'MMM d, yyyy');
  }
}
