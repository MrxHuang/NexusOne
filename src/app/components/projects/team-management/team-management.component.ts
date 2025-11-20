import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../../services/mock-data.service';
import { ProjectRole } from '../../../models/project.model';
import { LucideAngularModule, UserPlus, Trash2, Shield } from 'lucide-angular';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-slate-900">Project Team</h3>
        <button class="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
          <lucide-icon [img]="UserPlusIcon" class="w-4 h-4"></lucide-icon>
          <span>Add Member</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Mock Team Members for UI Demo -->
        <div class="flex items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 transition-colors">
          <img src="https://ui-avatars.com/api/?name=Elena+Rodriguez&background=4f46e5&color=fff" class="w-10 h-10 rounded-full mr-4">
          <div class="flex-1">
            <h4 class="font-medium text-slate-900">Dr. Elena Rodriguez</h4>
            <div class="flex items-center gap-1 text-xs text-indigo-600 font-medium mt-0.5">
              <lucide-icon [img]="ShieldIcon" class="w-3 h-3"></lucide-icon>
              <span>Principal Investigator</span>
            </div>
          </div>
        </div>

        <div class="flex items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 transition-colors">
          <img src="https://ui-avatars.com/api/?name=Sarah+Miller&background=8b5cf6&color=fff" class="w-10 h-10 rounded-full mr-4">
          <div class="flex-1">
            <h4 class="font-medium text-slate-900">Sarah Miller</h4>
            <div class="flex items-center gap-1 text-xs text-slate-500 font-medium mt-0.5">
              <span>Co-Investigator</span>
            </div>
          </div>
          <button class="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <lucide-icon [img]="Trash2Icon" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
      </div>
    </div>
  `
})
export class TeamManagementComponent {
  @Input() projectId!: string;
  
  // Icons
  readonly UserPlusIcon = UserPlus;
  readonly Trash2Icon = Trash2;
  readonly ShieldIcon = Shield;
}
