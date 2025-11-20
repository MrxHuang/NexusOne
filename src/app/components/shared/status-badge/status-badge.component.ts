import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStatus } from '../../../models/project.model';
import { LucideAngularModule, Circle, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-angular';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div [ngClass]="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      getClasses()
    ]">
      <lucide-icon [img]="getIcon()" class="w-3 h-3 mr-1.5"></lucide-icon>
      {{ getLabel() }}
    </div>
  `
})
export class StatusBadgeComponent {
  @Input() status!: ProjectStatus;

  getClasses(): string {
    switch (this.status) {
      case ProjectStatus.ACTIVE: return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case ProjectStatus.COMPLETED: return 'bg-green-50 text-green-700 border-green-200';
      case ProjectStatus.IN_REVIEW: return 'bg-violet-50 text-violet-700 border-violet-200';
      case ProjectStatus.DRAFT: return 'bg-slate-50 text-slate-700 border-slate-200';
      case ProjectStatus.SUSPENDED: return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  }

  getIcon(): any {
    switch (this.status) {
      case ProjectStatus.ACTIVE: return Clock;
      case ProjectStatus.COMPLETED: return CheckCircle;
      case ProjectStatus.IN_REVIEW: return AlertCircle;
      case ProjectStatus.DRAFT: return FileText;
      case ProjectStatus.SUSPENDED: return Circle;
      default: return Circle;
    }
  }

  getLabel(): string {
    return this.status.replace('_', ' ');
  }
}
