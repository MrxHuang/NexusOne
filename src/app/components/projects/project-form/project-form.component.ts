import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Project, ProjectStatus } from '../../../models/project.model';
import { LucideAngularModule, Save, Calendar, Plus, X } from 'lucide-angular';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="space-y-6">
      
      <!-- Title & Description -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
          <input type="text" formControlName="title" 
                 class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                 placeholder="e.g., Quantum Computing Research">
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea formControlName="description" rows="3"
                    class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Brief summary of the research project..."></textarea>
        </div>
      </div>

      <!-- Dates -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
          <div class="relative">
            <lucide-icon [img]="CalendarIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></lucide-icon>
            <input type="date" formControlName="startDate"
                   class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">End Date</label>
          <div class="relative">
            <lucide-icon [img]="CalendarIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></lucide-icon>
            <input type="date" formControlName="endDate"
                   class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
          </div>
        </div>
      </div>

      <!-- Objectives -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Objectives</label>
        <textarea formControlName="objectives" rows="4"
                  class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm"
                  placeholder="- Objective 1&#10;- Objective 2"></textarea>
      </div>

      <!-- Tags -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Tags</label>
        <div class="flex flex-wrap gap-2 mb-2">
          <span *ngFor="let tag of tags.controls; let i = index" 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            {{ tag.value }}
            <button type="button" (click)="removeTag(i)" class="ml-1.5 text-indigo-400 hover:text-indigo-600">
              <lucide-icon [img]="XIcon" class="w-3 h-3"></lucide-icon>
            </button>
          </span>
        </div>
        <div class="flex gap-2">
          <input type="text" #tagInput 
                 (keydown.enter)="$event.preventDefault(); addTag(tagInput.value); tagInput.value = ''"
                 class="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                 placeholder="Add a tag and press Enter">
          <button type="button" (click)="addTag(tagInput.value); tagInput.value = ''"
                  class="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button type="button" (click)="cancel.emit()" 
                class="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
          Cancel
        </button>
        <button type="submit" [disabled]="projectForm.invalid"
                class="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <lucide-icon [img]="SaveIcon" class="w-4 h-4"></lucide-icon>
          <span>{{ isEdit ? 'Update Project' : 'Create Project' }}</span>
        </button>
      </div>
    </form>
  `
})
export class ProjectFormComponent {
  @Input() project: Project | null = null;
  @Input() isEdit = false;
  @Output() save = new EventEmitter<Partial<Project>>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  // Icons
  readonly SaveIcon = Save;
  readonly CalendarIcon = Calendar;
  readonly PlusIcon = Plus;
  readonly XIcon = X;

  projectForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    objectives: ['', Validators.required],
    tags: this.fb.array([])
  });

  ngOnInit() {
    if (this.project) {
      this.projectForm.patchValue({
        title: this.project.title,
        description: this.project.description,
        startDate: this.formatDate(this.project.startDate),
        endDate: this.formatDate(this.project.endDate),
        objectives: this.project.objectives
      });
      
      this.project.tags.forEach(tag => this.addTag(tag));
    }
  }

  get tags() {
    return this.projectForm.get('tags') as FormArray;
  }

  addTag(tag: string) {
    if (tag && !this.tags.value.includes(tag)) {
      this.tags.push(this.fb.control(tag));
    }
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.save.emit(this.projectForm.value as Partial<Project>);
    }
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }
}
