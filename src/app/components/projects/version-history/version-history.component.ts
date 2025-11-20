import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../services/project.service';
import { ProjectVersion } from '../../../models/project.model';
import { LucideAngularModule, History, GitCommit } from 'lucide-angular';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-version-history',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div *ngFor="let version of versions()" class="flex gap-4">
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 z-10">
            <lucide-icon [img]="GitCommitIcon" class="w-4 h-4 text-indigo-600"></lucide-icon>
          </div>
          <div class="flex-1 w-px bg-slate-200 my-2 last:hidden"></div>
        </div>
        
        <div class="flex-1 pb-6">
          <div class="flex items-center justify-between mb-1">
            <h4 class="font-medium text-slate-900">Version {{ version.versionNumber }}</h4>
            <span class="text-xs text-slate-500">{{ getTimeAgo(version.modifiedAt) }}</span>
          </div>
          <p class="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
            {{ version.changes }}
          </p>
          <div class="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Modified by User {{ version.modifiedBy }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="versions().length === 0" class="text-center py-8 text-slate-400">
        <lucide-icon [img]="HistoryIcon" class="w-8 h-8 mx-auto mb-2 opacity-50"></lucide-icon>
        <p>No version history available</p>
      </div>
    </div>
  `
})
export class VersionHistoryComponent implements OnInit {
  @Input() projectId!: string;
  private projectService = inject(ProjectService);

  versions = signal<ProjectVersion[]>([]);
  
  // Icons
  readonly HistoryIcon = History;
  readonly GitCommitIcon = GitCommit;

  ngOnInit() {
    if (this.projectId) {
      this.projectService.getProjectVersions(this.projectId).subscribe(data => {
        this.versions.set(data);
      });
    }
  }

  getTimeAgo(date: Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }
}
